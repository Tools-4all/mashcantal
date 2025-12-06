// כל שורות הכותרת (עליון + תחתון)
const headlineRows = document.querySelectorAll(".headline-row");


// בעת טעינת הדף – מכניסים פנימה
window.addEventListener("DOMContentLoaded", () => {
    headlineRows.forEach((row) => {
        row.classList.add("visible");
        row.classList.remove("hidden");
    });
});



// section 3

const productsData = {
    p1: {
        title: "משכנתא לדירה יחידה/שיפוץ נכס קיים",
        body: `משכנתא לאנשים ללא בעלות על דירה או כאלה אשר רוצים לשפץ את ביתם.בין אם מדובר ברכישת דירה מיד שנייה/ קבלן או שיפוץ נכס קיים, ניתן לקבל עד 75% מימון מסכום העסקה תוך התאמת ההלוואה אל אופי העסקה ולוחות הזמנים. `
    },
    p2: {
        title: "מחזור משכנתא קיימת",
        body: `משכנתא לאנשים בעלי משכנתא שרוצים להוזיל את ההלוואה.מחזור ההלוואה בשנית או יותר, על מנת להתאים את ההלוואה אל התנאים הנוכחיים של הלווה מבחינה פיננסית, תכנונית והוזלת מחיר ההלוואה(הריבית) בעשרות עד מאות אלפי שקלים.על ידי מחזור אנו גם מטיבים את תנאי ההלוואה וגם מתאימים אותה למצב הנוכחי שלנו. `
    },
    p3: {
        title: "מחיר למשתכן / דירה בהנחה",
        body:
            `משכנתא לזוכי תוכניות "המחיר למשתכן" או "דירה בהנחה" של משרד השיכון.כאן אנו נתאים את הלוואת המשכנתא אל הלווים ומצבם הכלכלי בזמן בניית הפרויקט ולאחריו.בהלוואה זו ניתן לקבל הלוואה תוך שימוש בהון עצמי נמוך מ25% שלא כמו במשכנתא לדירה ראשונה/ יחידה.`
    },
    p4: {
        title: "משכנתא לשיפור דיור",
        body:
            `משכנתא לבעלי דירה יחידה אשר מעוניינים לשפר את מגוריהם על ידי רכישת דירה נוספת תוך התחייבות למכור את הדירה הנוכחית בעד 24 חודשים מרגע רכישת הדירה.בסוג עסקה זה ניתן לקבל עד 70% מימון מסכום העסקה בניכוי משכנתא קיימת(אם ישנה)`
    },
    p5: {
        title: "משכנתא עבור דירה שנייה ומעלה",
        body:
            `משכנתא לבעלי לפחות דירה אחת אשר ברצונם לרכוש דירה נוספת.בעסקה זו יוכלו הלווים לקבל בעד 50% מסכום העסקה בניכוי משכנתא קיימת(באם ישנה).`
    },
    p6: {
        title: "משכנתא למינוף נכס קיים",
        body:
            `משכנתא לכל מטרה לבעלי דירות אשר ברצונם לקבל סכום כסף כנגד שווי הנכס.בעסקה שכזו ניתן לקבל בעד 50% משווי הנכס ועוד 200 אלף ש"ח.`
    },
    p7: {
        title: "משכנתא הפוכה לבני 55+",
        body: `משכנתא לבעלי דירות מעל גיל 55 אשר ברצונם לקבל כסף כנגד הבית(משכון).ככל שגיל הלווים גבוה יותר כך עולים אחוזי ההלוואה מתוך שווי הבית. 
משכנתא זו שונה בפירעונה ממשכנתא "לכל מטרה" כשאת פירעון ההלוואה ישלמו היורשים או הלווים לאורך שארית חייהם.`
    },
};

const pills = document.querySelectorAll(".service-pill");
const detailsCard = document.getElementById("serviceDetails");
const detailsTitle = document.getElementById("detailsTitle");
const detailsText = document.getElementById("detailsText");

// גלילה רכה לכרטיס, עם אופסט לנאב־בר (רק במובייל)
function smoothScrollToDetails() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const rect = detailsCard.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const cardMiddle = rect.top + scrollTop + rect.height / 2;
    const viewportMiddle = window.innerHeight / 2;

    const targetY = cardMiddle - viewportMiddle;

    window.scrollTo({
        top: targetY,
        behavior: "smooth"
    });
}


pills.forEach((pill) => {
    pill.addEventListener("click", () => {
        const id = pill.dataset.productId;
        const data = productsData[id];
        if (!data) return;

        // עדכון הטקסט בכרטיס
        detailsTitle.textContent = data.title;
        detailsText.textContent = data.body;

        // הדגשת הבועה שנבחרה
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        // גלילה אל הכרטיס (במיוחד במובייל)
        smoothScrollToDetails();
    });
});

// section 4

document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.timeline-item');

    items.forEach(function (item) {
        item.addEventListener('click', function () {
            // סגירה של כל האחרים
            items.forEach(function (other) {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });

            // פתיחה/סגירה של הנוכחי
            item.classList.toggle('active');
        });
    });
});


// section 5

// אקורדיון לשאלות נפוצות
document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".faq-item");

    items.forEach((item) => {
        const btn = item.querySelector(".faq-question");
        const wrapper = item.querySelector(".faq-answer-wrapper");
        const icon = item.querySelector(".faq-toggle-icon");

        // אם זה פריט פתוח כבר ב־HTML – פותחים גובה בפועל
        if (item.classList.contains("faq-item-open")) {
            wrapper.style.maxHeight = wrapper.scrollHeight + "px";
            if (icon) icon.textContent = "−";
        }

        btn.addEventListener("click", () => {
            const isOpen = item.classList.contains("faq-item-open");

            // סגירת כל השאר (אקורדיון אמיתי)
            items.forEach((other) => {
                if (other !== item) {
                    other.classList.remove("faq-item-open");
                    const w = other.querySelector(".faq-answer-wrapper");
                    const i = other.querySelector(".faq-toggle-icon");
                    if (w) w.style.maxHeight = null;
                    if (i) i.textContent = "+";
                }
            });

            if (!isOpen) {
                item.classList.add("faq-item-open");
                wrapper.style.maxHeight = wrapper.scrollHeight + "px";
                if (icon) icon.textContent = "−";
            } else {
                item.classList.remove("faq-item-open");
                wrapper.style.maxHeight = null;
                if (icon) icon.textContent = "+";
            }
        });
    });
});