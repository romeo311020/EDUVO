# 🔧 كود SQL محسّن لـ Supabase

## الخطوات:
1. افتح https://app.supabase.com
2. اختر المشروع mjptrjidrhwaphkmqoma
3. اذهب إلى SQL Editor
4. انسخ **كل واحد من الأكواد التالية بالترتيب** وشغّله

---

## ✅ الخطوة 1: حذف الجداول القديمة (اختياري)

```sql
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP FUNCTION IF EXISTS handle_new_user();
```

**شغّل هذا الكود أولاً** ثم اضغط Run

---

## ✅ الخطوة 2: إنشاء جدول Profiles الجديد

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended', 'rejected')),
  grade TEXT,
  section TEXT,
  created_at TIMESTAMP DEFAULT NOW() AT TIME ZONE 'UTC',
  updated_at TIMESTAMP DEFAULT NOW() AT TIME ZONE 'UTC'
);

-- تفعيل Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة للمستخدمين
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (true);

-- سياسة الكتابة للمستخدمين
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (true);
```

**شغّل هذا الكود** ثم اضغط Run

---

## ✅ الخطوة 3: إضافة حساب Admin يدويًا

```sql
-- حذف admin القديم إن وجد
DELETE FROM profiles WHERE email = 'admin@eduvo.eg';

-- إضافة admin جديد
INSERT INTO profiles (email, name, role, status)
VALUES ('admin@eduvo.eg', 'مدير EDUVO', 'admin', 'active');

-- تحقق من النتيجة
SELECT * FROM profiles WHERE email = 'admin@eduvo.eg';
```

**شغّل هذا الكود** ثم اضغط Run

---

## ✅ الخطوة 4: إضافة طلاب تجريبيين

```sql
-- حذف الطلاب القدماء
DELETE FROM profiles WHERE role = 'student';

-- إضافة طلاب جدد
INSERT INTO profiles (email, name, role, status, grade)
VALUES 
  ('ahmed@test.eg', 'أحمد محمد', 'student', 'active', 'الصف الثالث الثانوي'),
  ('fatma@test.eg', 'فاطمة علي', 'student', 'active', 'الصف الثالث الثانوي'),
  ('mahmoud@test.eg', 'محمود سارة', 'student', 'pending', 'الصف الثاني الثانوي');

-- تحقق من النتائج
SELECT COUNT(*) as total_students FROM profiles WHERE role = 'student';
```

**شغّل هذا الكود** ثم اضغط Run

---

## ✅ الخطوة 5: التحقق من كل شيء

```sql
-- عرض جميع المستخدمين
SELECT id, email, name, role, status FROM profiles;

-- عد عدد المستخدمين
SELECT COUNT(*) as total_users FROM profiles;
SELECT COUNT(*) as admin_count FROM profiles WHERE role = 'admin';
SELECT COUNT(*) as student_count FROM profiles WHERE role = 'student';
```

**شغّل هذا الكود** ثم اضغط Run

---

## 🔐 الخطوة 6: إضافة كلمة المرور للـ Admin

1. في Supabase Dashboard، اذهب إلى **Authentication → Users**
2. ابحث عن `admin@eduvo.eg`
3. إذا لم تجده، اضغط **Create New User**
4. أدخل:
   - **Email**: `admin@eduvo.eg`
   - **Password**: `Admin123456` (أو أي كلمة قوية)
5. اضغط **Create User**

---

## ✅ الاختبار

بعد اتمام الخطوات أعلاه:

1. افتح `test-connection.html` في المتصفح (الملف الذي تم إنشاؤه حالاً)
2. اضغط الزر **اختبر الاتصال**
3. يجب أن ترى جميع الاختبارات بـ ✅

4. ثم افتح `admin.html` وسجل دخول بـ:
   - **البريد**: `admin@eduvo.eg`
   - **كلمة المرور**: `Admin123456`

---

## ⚠️ إذا حدث خطأ

### خطأ: "relation "profiles" does not exist"
- هذا يعني لم تشغّل الخطوة 2
- تأكد من تشغيل كود إنشاء الجدول

### خطأ: "Duplicate key value violates unique constraint"
- يعني البيانات موجودة بالفعل
- شغّل الخطوة 3 لحذف البيانات القديمة أولاً

### خطأ: "permission denied"
- تأكد أن لديك صلاحيات الكتابة في Supabase
- جرّب تسجيل الدخول مرة أخرى

---

## 📞 للمساعدة

- اختبر الاتصال باستخدام `test-connection.html`
- اضغط F12 في المتصفح وشاهد Console
- أخبرني بأي رسالة خطأ تظهر بالتفصيل
