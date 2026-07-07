# AIT Pit2Port ERP - GitHub Pages Mobile PWA

نسخة مطورة من مشروع **AIT Pit2Port ERP** بناءً على البرومبت الكامل الخاص بإدارة شركات تأجير المعدات وعمليات التعدين.

> هذه النسخة مصممة خصيصاً للعمل على GitHub فقط بدون تثبيت أي برامج على الجهاز. تعمل كـ Static PWA عبر GitHub Pages وتستخدم localStorage كقاعدة بيانات ديمو داخل المتصفح.

## الموديولات الموجودة

- Dashboard موبايل احترافي بألوان AIT وRTL.
- Equipment Rental Companies.
- Company Details مع 4 Tabs: Basic Info, Equipments, Financial, Reports.
- Equipments + auto-fill من بيانات الشركة.
- Contracts + حساب hourly / cubic meter / daily + contract preview/print.
- Equipment Operation + Start/End Shift + Stop Reasons.
- Quality Lots + density automatic حسب نوع الـ lot + volume/weight calculations.
- Equipment Consumption.
- Accounts: invoices/payments/financial dashboard.
- Notifications.
- Reports عربي/English + CSV/Print.
- Settings + roles/permissions demo.

## بيانات الديمو

يتم إنشاء بيانات واقعية تلقائياً عند أول فتح:

- 8 Equipment Companies
- 60 Equipments
- 25 Drivers
- 25 Helpers
- 5 Mines
- 18 Zones
- 40 Sub Zones
- 300 Equipment Shifts
- 250 Quality Lots
- 40 Contracts
- 200 Consumption/Fuel Records
- 150 Invoices
- 100 Payments

## طريقة الرفع على GitHub فقط

1. أنشئ Repository جديد على GitHub باسم `AIT_pit2port`.
2. ارفع ملفات المشروع كما هي داخل الـ repository.
3. افتح Settings > Pages.
4. Source: اختر `Deploy from a branch`.
5. Branch: اختر `main` و Folder: `/root`.
6. اضغط Save.
7. افتح رابط GitHub Pages بعد ظهور حالة النشر.

## فتحه كموبايل على اللابتوب

بعد فتح رابط GitHub Pages في Chrome:

1. اضغط `Ctrl + Shift + I`.
2. اضغط `Ctrl + Shift + M`.
3. اختار جهاز مثل iPhone أو Pixel.

## ملاحظات إنتاجية مهمة

- هذه نسخة Frontend/PWA مناسبة للعرض، الديمو، اختبار تجربة المستخدم، GitHub Pages، وفتحها كموبايل من اللابتوب.
- النسخة الحقيقية الإنتاجية بـ Next.js + PostgreSQL + Prisma + Auth.js تحتاج استضافة مثل Vercel/Railway/Supabase، وليس GitHub Pages فقط.
- تم تصميم الكود بحيث يمكن تحويله لاحقاً إلى Next.js modules بسهولة.
