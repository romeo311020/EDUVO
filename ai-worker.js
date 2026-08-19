/**
 * EDUVO AI Worker
 * -----------------
 * هذا كود يعمل على Cloudflare Workers (مجاني) وبيشتغل كـ backend آمن
 * بين موقع EDUVO والـ Anthropic API، عشان مفتاح الـ API يفضل مخفي
 * ومحدش يقدر يسرقه من كود الموقع.
 *
 * خطوات النشر موجودة في ملف INSTRUCTIONS.md المرفق.
 */

export default {
  async fetch(request, env) {
    // السماح فقط لطلبات POST
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders()
      });
    }

    try {
      const body = await request.json();
      const userMessage = (body.message || '').toString().trim();

      if (!userMessage) {
        return new Response(JSON.stringify({ error: 'الرسالة فارغة' }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      if (userMessage.length > 2000) {
        return new Response(JSON.stringify({ error: 'الرسالة طويلة جداً' }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 700,
          system:
            'أنت مساعد تعليمي اسمه "EDUVO AI" بيساعد طلاب الثانوية العامة في المواد الدراسية (رياضيات، فيزياء، كيمياء، أحياء، عربي). ' +
            'رد دايماً باللغة العربية بأسلوب واضح ومبسط ومباشر ومناسب لطالب ثانوي، وقسّم الشرح خطوة بخطوة لو السؤال معقد. ' +
            'لو السؤال مش متعلق بالدراسة، رد بأدب واقترح إنه يسأل في موضوع دراسي.',
          messages: [{ role: 'user', content: userMessage }]
        })
      });

      if (!apiResponse.ok) {
        const errText = await apiResponse.text();
        console.error('Anthropic API error:', errText);
        return new Response(JSON.stringify({ error: 'حصل خطأ في المساعد الذكي، حاول تاني' }), {
          status: 502,
          headers: corsHeaders()
        });
      }

      const data = await apiResponse.json();
      const reply = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: corsHeaders()
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'حصل خطأ غير متوقع' }), {
        status: 500,
        headers: corsHeaders()
      });
    }
  }
};

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    // بعد النشر، بدّل * برابط موقعك الحقيقي عشان الأمان (مثال: https://eduvo.com)
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
