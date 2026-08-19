# تفعيل تسجيل الدخول بجوجل وفيسبوك على GitHub Pages

بياناتك الحساسة (Client ID / App ID) بقت في ملف `data.json` منفصل عن `index.html`.
كل اللي محتاجه إنك تعدّل الملف ده بس، وترفعه مع باقي الملفات على GitHub.

## أولاً: اعرف رابط موقعك على GitHub Pages

لو اسم حسابك `username` واسم الريبو `repo-name`، رابط موقعك هيكون:
```
https://username.github.io/repo-name/
```
احتفظ بالرابط ده، هتحتاجه في الخطوتين الجايين.

---

## 1) إعداد Google Client ID

1. روح https://console.cloud.google.com
2. أنشئ مشروع جديد (أو استخدم مشروع موجود).
3. من القائمة الجانبية: **APIs & Services** → **Credentials**.
4. لو أول مرة، هيطلب منك تظبط **OAuth consent screen** أولاً:
   - اختار **External**.
   - املأ اسم التطبيق (EDUVO) والإيميل بتاعك.
   - احفظ واستمر (مش محتاج تعبي كل حاجة، بس الأساسيات).
5. ارجع لـ **Credentials** → **Create Credentials** → **OAuth client ID**.
6. النوع: **Web application**.
7. في خانة **Authorized JavaScript origins** ضيف بالظبط:
   ```
   https://username.github.io
   ```
   (من غير اسم الريبو ومن غير سلاش في الآخر)
8. احفظ، وهيديك **Client ID** شكله كده:
   ```
   123456789-xxxxxxxxxxxx.apps.googleusercontent.com
   ```

---

## 2) إعداد Facebook App ID

1. روح https://developers.facebook.com/apps
2. **Create App** → اختار **Consumer** أو **None** → اكتب اسم التطبيق.
3. من لوحة التطبيق، ضيف منتج **Facebook Login** → **Set Up**.
4. من إعدادات Facebook Login → **Settings**:
   - في **Valid OAuth Redirect URIs** ضيف:
     ```
     https://username.github.io/repo-name/
     ```
5. من **Settings** → **Basic**:
   - في **App Domains** ضيف:
     ```
     username.github.io
     ```
   - احفظ.
6. من نفس الصفحة، انسخ **App ID** (رقم في الأعلى).
7. مهم: التطبيق هيكون في **Development Mode** الأول — يعني بس أنت والمطورين المضافين في التطبيق يقدروا يسجلوا دخول بيه. عشان أي حد يستخدمه، لازم تطلب **App Review** من فيسبوك (خطوة إضافية بعدين لو حبيت).

---

## 3) عدّل ملف data.json بس

افتح `data.json` وحط بياناتك الحقيقية:
```json
{
  "googleClientId": "123456789-xxxxxxxxxxxx.apps.googleusercontent.com",
  "facebookAppId": "1234567890123456",
  "aiEndpoint": ""
}
```

## 4) ارفع الملفات على GitHub

تأكد إن `data.json` و `index.html` في نفس المجلد على الريبو (مش لازم يكونوا في فولدرات مختلفة).

```
git add data.json index.html
git commit -m "تفعيل تسجيل الدخول بجوجل وفيسبوك"
git push
```

بعد كذا دقيقة (GitHub Pages بياخد وقت بسيط ينشر)، افتح موقعك وجرّب الأزرار.

---

## ملاحظات مهمة

- **جوجل مش هيشتغل على `localhost` أو لما تفتح الملف مباشرة من جهازك (`file://`)** — لازم يكون على الدومين المسجل بالظبط.
- لو غيّرت اسم الريبو أو حسابك، لازم ترجع تعدّل الـ Authorized origins في جوجل والـ App Domains في فيسبوك بالدومين الجديد.
- ملف `data.json` مش سري 100%— أي حد يقدر يفتحه ويشوف الـ Client ID/App ID، لكن ده طبيعي وآمن لأن الـ IDs دي مصممة تكون عامة (مش زي مفتاح API السري بتاع الذكاء الاصطناعي).
