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
        title: "משכנתא לדירה ראשונה/שיפוץ נכס קיים",
        body: "משכנתא לאנשים שהם שהם לא בעלי דירה, או כאלה שיש להם דירה ורוצים לשפץ אותה, כאן ישנה זכאות לקבלת הלוואת משכנתא של עד 75% מסכום העסקה."
    },
    p2: {
        title: "מחזור משכנתא קיימת",
        body: `מחזור הלוואת משכנתא היא בעצם התאמת תנאי ההלוואה למצבנו כיום והוזלת מחיר ההלוואה (הריבית).
כלומר, ההלוואה שלקחנו לפני כמה שנים לא בהכרח תואמת למצבנו כיום ועל כן יש להתאימה למצב החדש. בנוסף
 <span style="font-weight:700;">באמצעות מחזור ההלוואה אנחנו יכולים להשיג תנאי הלוואה טובים יותר ובכך לחסוך עד מאות אלפי שקלים
מתנאי ההלוואה הקיימת.</span>

את המחזור ניתן לבצע בבנק שבו נלקחה הלוואה או בכל בנק למשכנתאות אחר
שיציע לנו את התנאים הטובים ביותר.`
    },
    p3: {
        title: "משכנתא לזוכי מחיר למשתכן/ דירה בהנחה של משרד השיכון",
        body: `משכנתא עבור זוכי תוכניות "מחיר למשתכן" או "דירה בהנחה" של משרד השיכון והבינוי שניתנים לרוב בתנאים טובים יותר מאשר בשוק הרגיל  ואף אחוז מימון גבוה מ75% בהלוואה שמצריך "הון עצמי" נמוך יותר מאשר משכנתא רגילה. 
        
במשכנתא שכזו, חשוב להתחשב בעובדה שהכניסה לדירה היא עתידית
אך תשלום המשכנתא מתחיל מיידית, בנוסף להוצאות השוטפות הנוכחיות
כמו שכ"ד וכו', ולפיכך יש להתאים את מסלולי ההלוואה הנכונים
בשקלול המשתנים הנוכחיים והעתידיים.`
    },
    p4: {
        title: "משכנתא לשיפור דיור לבעלי דירה",
        body: `משכנתא לבעלי דירה יחידה אשר מעוניינים לשפר את מגוריהם על ידי רכישת דירה אחרת תוך התחייבות למכור את הדירה הנוכחית עד 24 חודשים מרגע רכישת הדירה החדשה. 
בסוג הלוואה זו ניתן לקבל עד 70% מסכום העסקה בניכוי משכנתא קיימת (באם ישנה).
כלומר אם נשארה לנו יתרת משכנתא בסכום של 100K, נוכל לקבל הלוואה בגובה של 70% מהעסקה פחות יתרת ההלוואה. למשל, דירה במחיר 2M גובה הלוואה מקסימלי יהיה:
2M X 70% = 1.4M-100K = 1.3M`
    },
    p5: {
        title: "משכנתא עבור דירה שנייה ומעלה",
        body: `משכנתא לבעלי דירה אחת לפחות אשר ברצונם לרכוש דירה נוספת. בהלוואה זו יוכלו הלווים לקבל עד 50% מסכום העסקה בניכוי משכנתא קיימת (באם ישנה).

כלומר אם נשארה לנו יתרת משכנתא בסכום של 100K, נוכל לקבל הלוואה בגובה של 50% מהעסקה פחות יתרת ההלוואה. למשל דירה במחיר 2M גובה הלוואה מקסימלי יהיה:
2M X 50% = 1M-100K = 900K`
    },
    p6: {
        title: "משכנתא למינוף נכס קיים",
        body: `משכנתא לכל מטרה לבעלי דירות אשר ברצונם לקבל סכום כסף כנגד שווי הנכס. 
כלומר קבלת הלוואה בתמורה למשכון הנכס ללא צורך בהון עצמי.

בהלוואה שכזו ניתן לקבל עד 50% משווי הנכס ועוד 200 אלף ש"ח בניכוי משכנתא קיימת (באם ישנה).

למשל, הלוואה מקסימלית כנגד דירה בשווי 2M ללא משכנתא קיימת תעמוד על 1.2M.`
    },
    p7: {
        title: "משכנתא הפוכה לבני 55 +",
        body: `משכנתא לבעלי דירה מעל גיל 55 אשר ברצונם לקחת הלוואה 
על חשבון הנכס,
כלומר משכון הנכס לבנק ללא צורך בהון עצמי.

בהלוואה מסוג זה
ככל שגיל הלווים גבוה יותר כך עולים אחוזי ההלוואה מתוך שווי הבית 
כשאחוז המימון נע בין 15-50 אחוזים בהתאם לגיל הלווים.

להבדיל ממשכנתא למינוף נכס קיים, במשכנתא זו אפשר לפרוע את ההלוואה על ידי יורשי הנכס לאחר מות אחרון הלווים 
כשבכל מקרה סכום פירעון ההלואה לא יעלה על שווי הבית.`
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
        detailsText.innerHTML = data.body;

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