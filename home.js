// כל שורות הכותרת (עליון + תחתון)
const headlineRows = document.querySelectorAll(".headline-row");

// מצב גלילה קודם כדי לזהות כיוון
let lastScrollY = window.scrollY;

// בעת טעינת הדף – מכניסים פנימה
window.addEventListener("DOMContentLoaded", () => {
    headlineRows.forEach((row) => {
        row.classList.add("visible");
        row.classList.remove("hidden");
    });
});

// מאזינים לגלילה כדי לזהות עלייה / ירידה
window.addEventListener("scroll", () => {
    const currentY = window.scrollY;

    // אם גוללים למטה
    if (currentY > lastScrollY + 10) {
        headlineRows.forEach((row) => {
            row.classList.add("hidden");
            row.classList.remove("visible");
        });
    }

    // אם גוללים למעלה
    if (currentY < lastScrollY - 10) {
        headlineRows.forEach((row) => {
            row.classList.add("visible");
            row.classList.remove("hidden");
        });
    }

    lastScrollY = currentY;
});



document.addEventListener("DOMContentLoaded", function () {

    const title = document.getElementById("siftah_title");
    const subtitle = document.getElementById("siftah_subtitle");

    // מצב התחלתי – טקסטים מחוץ למסך
    title.style.transform = "translateX(-150%)";
    subtitle.style.transform = "translateX(150%)";
    title.style.opacity = "0";
    subtitle.style.opacity = "0";

    setTimeout(() => {
        title.style.transition = "transform 1.5s ease-out, opacity 1s ease-out";
        subtitle.style.transition = "transform 1.5s ease-out, opacity 1s ease-out";

        title.style.transform = "translateX(0)";
        subtitle.style.transform = "translateX(0)";
        title.style.opacity = "1";
        subtitle.style.opacity = "1";
    }, 120);

});



// section 3

const productsData = {
    p1: {
        title: "הלוואת משכנתא לדיור / שיפוץ",
        body: `עסקה עבור דירה יחידה/ראשונה. בין אם מדובר ברכישת דירה מיד שנייה, קבלן או שיפוץ נכס קיים,
ניתן לקבל עד 75% מימון מסכום העסקה תוך התאמת ההלוואה אל אופי העסקה ולוחות הזמנים.`
    },
    p2: {
        title: "מחזור משכנתא קיימת",
        body: `מחזור ההלוואה בשנית או יותר, על מנת להתאים את ההלוואה אל התנאים הנוכחיים של הלווה
מבחינה פיננסית ותכנונית, ולהוריד את הריבית בגשרות עד מאות אלפי שקלים – במחזור פנימי או חיצוני.`
    },
    p3: {
        title: "מחיר למשתכן / דירה בהנחה",
        body: `עסקה עבור זוכי תוכניות המחיר למשתכן או דירה בהנחה של משרד השיכון.
התאמת הלוואת המשכנתא אל הלווים ומצבם הכלכלי בזמן בניית הפרויקט ולאחריו.
בעסקה שכזו ניתן לקבל הלוואה תוך שימוש בהון עצמי נמוך מ־25%.`
    },
    p4: {
        title: "משכנתא לשיפור דיור",
        body: `עסקה עבור בעלי דירה יחידה המעוניינים לשפר את מגוריהם על ידי רכישת דירה נוספת,
תוך התחייבות למכור את הדירה הנוכחית בעד 24 חודשים מרגע רכישת הדירה החדשה.
בסוג עסקה זה ניתן לקבל עד 70% מימון מסכום העסקה, בניכוי משכנתא קיימת (אם ישנה).`
    },
    p5: {
        title: "משכנתא עבור דירה שנייה ומעלה",
        body: `עסקה המתאימה לבעלי לפחות דירה אחת אשר ברצונם לרכוש דירה נוספת.
בעסקה זו יוכלו הלווים לקבל עד 50% מסכום העסקה, בניכוי משכנתא קיימת (אם קיימת).`
    },
    p6: {
        title: "משכנתא הפוכה לבני 55+",
        body: `עסקה המתאימה לבעלי דירות מעל גיל 55 אשר ברצונם לקבל כסף כנגד הבית (משכון).
ככל שגיל הלווים גבוה יותר – כך עולים אחוזי ההלוואה מתוך שווי הבית.
את פירעון ההלוואה ישלמו היורשים או הלווים לאורך שארית חייהם.`
    },
    p7: {
        title: "משכנתא לכל מטרה כנגד נכס קיים",
        body: `עסקה המתאימה לבעלי דירות אשר ברצונם לקבל סכום כסף כנגד שווי הנכס.
בעסקה שכזו ניתן לקבל עד 50% משווי הנכס, בהתאם למצב הפיננסי ויכולת ההחזר של הלווה.`
    }
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