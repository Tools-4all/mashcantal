// כל שורות הכותרת (עליון + תחתון)
const headlineRows = document.querySelectorAll(".headline-row");


// בעת טעינת הדף – מכניסים פנימה
window.addEventListener("DOMContentLoaded", () => {
    headlineRows.forEach((row) => {
        row.classList.add("visible");
        row.classList.remove("hidden");
    });
});



// section 4

document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.timeline-item');

    items.forEach(function (item) {
        item.addEventListener('click', function () {
            // סגירה של כל האחרים באותו תהליך
            item.closest('.timeline').querySelectorAll('.timeline-item').forEach(function (other) {
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

// כפתור המסלול המשולב – בוחר מראש את האפשרות המתאימה בטופס
document.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const radio = document.querySelector(`#contact-form input[name="service"][value="${btn.dataset.service}"]`);
        if (radio) radio.checked = true;
    });
});
