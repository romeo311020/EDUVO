# تفعيل المساعد الذكي الحقيقي في EDUVO

اتبع الخطوات دي بالترتيب. تقريباً هتاخد 10-15 دقيقة.

## 1) احصل على مفتاح Anthropic API

1. روح https://console.anthropic.com وسجّل حساب.
2. من القائمة روح **API Keys** → **Create Key**.
3. انسخ المفتاح واحفظه في مكان آمن (هيبان مرة واحدة بس).
4. لازم تضيف رصيد (billing) بسيط للحساب عشان تقدر تستخدم الـ API — الاستخدام العادي لمساعد طلاب رخيص جداً (سنتات قليلة لكل مئات الأسئلة).

## 2) انشر ملف الـ Worker على Cloudflare (مجاني)

1. روح https://workers.cloudflare.com وسجّل حساب مجاني.
2. من الداشبورد: **Workers & Pages** → **Create** → **Create Worker**.
3. اختار اسم للـ Worker (مثلاً `eduvo-ai`) واضغط **Deploy** (هينشر نسخة افتراضية الأول).
4. بعد الإنشاء، ادخل على الـ Worker → **Edit Code**.
5. امسح الكود الموجود، والصق مكانه محتوى ملف `ai-worker.js` المرفق معاك بالكامل.
6. اضغط **Save and Deploy**.

## 3) خزّن مفتاح الـ API بأمان (Secret)

1. من صفحة الـ Worker: **Settings** → **Variables and Secrets**.
2. اضغط **Add** → اختار **Secret** (مش Text عادي، عشان يتشفر).
3. الاسم: `ANTHROPIC_API_KEY`
4. القيمة: المفتاح اللي نسخته من الخطوة 1.
5. احفظ.

## 4) خد رابط الـ Worker

بعد النشر، هتلاقي رابط شكله كده:
```
https://eduvo-ai.YOUR-SUBDOMAIN.workers.dev
```
انسخه.

## 5) حط الرابط في موقعك

في ملف `index.html`، دور على السطر ده في أول الـ `<script>`:
```js
const AI_ENDPOINT = 'https://YOUR-WORKER-URL.workers.dev';
```
واستبدل الرابط بالرابط الحقيقي بتاعك من الخطوة 4.

## 6) (اختياري لكن مهم للأمان) قيّد الوصول لدومينك بس

في ملف `ai-worker.js`، في دالة `corsHeaders()`، غيّر:
```js
'Access-Control-Allow-Origin': '*',
```
إلى:
```js
'Access-Control-Allow-Origin': 'https://your-real-domain.com',
```
وده يمنع أي موقع تاني يستخدم الـ Worker بتاعك ويستهلك رصيدك.

---

بعد كده المساعد الذكي هيبقى شغال بذكاء اصطناعي حقيقي (Claude) ويقدر يشرح أي سؤال دراسي فعلاً، مش ردود جاهزة.

### ملاحظة عن التكلفة
انت اللي بتدفع تكلفة الـ API حسب استخدام الطلاب (مش مجاني تماماً زي الاستضافة). راقب استهلاكك من https://console.anthropic.com/settings/billing من وقت للتاني.
