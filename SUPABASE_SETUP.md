# 🔧 دليل إعداد Supabase - EDUVO

## ✅ معلومات الاتصال الحالية

```
URL: https://mjptrjidrhwaphkmqoma.supabase.co
Publishable Key: sb_publishable_CwN4jvLvXRTEu5uimUsIzA_ob8h8DAS
```

---

## 📋 الخطوات المطلوبة لتفعيل النظام بالكامل

### 1️⃣ تسجيل الدخول إلى Supabase Dashboard
1. اذهب إلى: https://app.supabase.com
2. سجل الدخول باستخدام حسابك
3. اختر المشروع: **mjptrjidrhwaphkmqoma**

### 2️⃣ إنشاء جدول `profiles`

انسخ واستخدم هذا الكود في SQL Editor:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE DEFAULT (auth.uid()),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  grade TEXT,
  section TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended', 'rejected')),
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة للمستخدمين
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- سياسة للإدمن لقراءة جميع البيانات
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
```

### 3️⃣ إنشاء حساب Admin تجريبي

استخدم SQL Editor لإدراج مستخدم admin:

```sql
-- إدراج حساب admin
INSERT INTO profiles (name, email, role, status)
VALUES ('مدير EDUVO', 'admin@eduvo.eg', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;
```

ثم استخدم Auth Tab لإنشاء كلمة مرور للمستخدم:
- البريد: `admin@eduvo.eg`
- كلمة المرور: اختر كلمة قوية

### 4️⃣ إنشاء جدول `quizzes`

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  time_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5️⃣ إنشاء جدول `user_progress`

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  progress_percent INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 اختبار الاتصال

### للصفحة الرئيسية (index.html)
1. افتح `index.html` في المتصفح
2. اختر **التسجيل الجديد**
3. أدخل البيانات المطلوبة
4. تحقق من رسالة النجاح الخضراء ✅

### لصفحة الإدارة (admin.html)
1. افتح `admin.html`
2. سجل الدخول بـ:
   - البريد: `admin@eduvo.eg`
   - كلمة المرور: (الكلمة التي اخترتها)
3. تحقق من ظهور لوحة التحكم

---

## 🔐 إعدادات الأمان المهمة

### تفعيل Email Authentication
1. في Supabase Dashboard → Authentication → Providers
2. فعّل **Email Provider**
3. اختر "Enable Email Confirmation" إذا كنت تريد

### إعدادات CORS
إذا استخدمت الموقع من نطاق مختلف، أضف النطاق في:
Settings → API → CORS Configuration

---

## 📊 البيانات النموذجية

### أضف بيانات طلاب تجريبية:

```sql
INSERT INTO profiles (name, email, role, status, grade)
VALUES 
  ('أحمد محمد', 'ahmed@eduvo.eg', 'student', 'active', 'الصف الثالث الثانوي'),
  ('فاطمة علي', 'fatma@eduvo.eg', 'student', 'active', 'الصف الثالث الثانوي'),
  ('محمود سارة', 'mahmoud@eduvo.eg', 'student', 'pending', 'الصف الثاني الثانوي');
```

---

## ⚠️ استكشاف الأخطاء

| المشكلة | الحل |
|--------|------|
| ❌ "فشل الاتصال بقاعدة البيانات" | تأكد من الاتصال بالإنترنت وأن مفتاح Supabase صحيح |
| ❌ "جدول المستخدمين غير موجود" | نفذ خطوة إنشاء الجداول أعلاه |
| ❌ "ليس لديك صلاحيات الإدارة" | تأكد من أن دور المستخدم = 'admin' في جدول profiles |
| ❌ "خطأ في المصادقة" | تحقق من صحة البريد وكلمة المرور |

---

## 🎯 ملخص الحالة الحالية

✅ **تم الاتصال بـ Supabase بنجاح**
- المفتاح صحيح وفعال
- الملفات جاهزة للاستخدام
- معالجة الأخطاء محسّنة

⏳ **يحتاج إلى إكمال**
- إنشاء الجداول في قاعدة البيانات
- إضافة حساب admin
- اختبار المصادقة

---

## 📞 دعم إضافي

للمساعدة الإضافية، تحقق من:
- https://supabase.com/docs
- وثائق JavaScript: https://supabase.com/docs/reference/javascript
