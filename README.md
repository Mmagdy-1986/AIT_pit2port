# AIT Pit2Port ERP - GitHub Pages Mobile UI

نسخة Static/PWA تعمل مباشرة على GitHub Pages بدون تثبيت أي شيء على الجهاز.

## التحديث الأخير

تم تعديل واجهة المستخدم UI/UX لتكون قريبة من مرجع تطبيق الموبايل المرسل:

- Home Mobile Screen بإطار موبايل وStatus Bar.
- شعار AIT مركزي وألوان AIT الأساسية.
- Hero mining illustration.
- كروت رئيسية كبيرة: شركات المعدات، المعدات، الاستهلاكات، التشغيل، الحسابات.
- شاشات List للشركات والمعدات بشكل Mobile Cards.
- شاشة تشغيل معدات مشابهة للمرجع.
- شاشة إضافة لوط Quality مشابهة للمرجع مع حسابات m3/ton.
- Bottom Navigation بسيط: الرئيسية، التنبيهات، الإعدادات.
- RTL + Cairo + تصميم Mobile First.
- جاهز للرفع على GitHub Pages.

## طريقة التشغيل على GitHub فقط

1. فك الضغط عن الملف.
2. ارفع محتويات فولدر `AIT_pit2port-main` إلى GitHub Repository.
3. من GitHub:

```text
Settings -> Pages -> Deploy from branch -> main -> /root -> Save
```

4. افتح رابط GitHub Pages.
5. للعرض كموبايل على اللابتوب:

```text
Ctrl + Shift + I
Ctrl + Shift + M
```

ثم اختار iPhone أو Pixel.

## ملاحظات

هذه النسخة تعمل بالكامل داخل المتصفح باستخدام LocalStorage وبيانات Demo واقعية. لا تحتاج Node.js أو Backend أو Database.
