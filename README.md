# لعبة أسئلة الفيزياء (Lecture 3)

لعبة ويب (HTML + CSS + JavaScript) بدون أي مكتبات. افتح `index.html` في المتصفح وهتشتغل.

## الملفات
- `index.html` — الصفحة الرئيسية
- `style.css` — ثيم النبيتي والبيج
- `game.js` — منطق اللعبة والنقاط
- `questions.js` — بنك الأسئلة (91 سؤال)

## نظام النقاط
- كل إجابة صح = 10 نقاط
- كل إجابة صح ورا بعض تزود 2 نقطة إضافية (الحد الأقصى +10)
- الإجابة الغلط بتصفّر السلسلة

## رفعها مجانًا على GitHub Pages
1. أنشئ حساب على github.com لو معندكش.
2. اضغط **New repository**، اكتب اسم زي `physics-quiz`، واختار **Public**، ثم **Create repository**.
3. اضغط **uploading an existing file**، واسحب الملفات الأربعة (`index.html` و`style.css` و`game.js` و`questions.js`) من غير فولدر فوقهم، ثم **Commit changes**.
4. افتح **Settings** ← **Pages**.
5. تحت **Build and deployment** اختار Source: **Deploy from a branch**، وBranch: **main** وFolder: **/ (root)**، ثم **Save**.
6. استنى دقيقة أو اتنين وحدّث الصفحة، هيظهر الرابط:
   `https://USERNAME.github.io/physics-quiz/`

لتعديل أي سؤال: افتح `questions.js` على GitHub واضغط أيقونة القلم، عدّل، ثم Commit، والموقع بيتحدث لوحده.
