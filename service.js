// עמודי שירות – טעינת תוכן Markdown לתוך המודולים
// כל אלמנט עם data-md טוען את הקובץ שלו מתיקיית content/.
// קובץ ריק (או שמכיל רק הערה) משאיר את ההודעה "התוכן לפרק זה בהכנה".

document.getElementById("year").textContent = new Date().getFullYear();

// כרטיסים נפתחים: בתוך <div class="content-grid content-accordion"> מוצגת רק כותרת הכרטיס,
// והתיאור נפתח/נסגר בלחיצה עליה
let accordionId = 0;

function setupAccordion(box) {
    box.querySelectorAll(".content-accordion .content-card").forEach((card) => {
        const heading = card.querySelector("h3");
        if (!heading) return;

        const bodyId = `card-body-${++accordionId}`;

        // כל מה שאחרי הכותרת עובר לתוך גוף מתקפל
        const body = document.createElement("div");
        body.className = "content-card-body";
        body.id = bodyId;
        const inner = document.createElement("div");
        inner.className = "content-card-inner";
        while (heading.nextSibling) inner.appendChild(heading.nextSibling);
        body.appendChild(inner);
        card.appendChild(body);

        // הכותרת הופכת לכפתור נגיש
        const button = document.createElement("button");
        button.type = "button";
        button.className = "content-card-toggle";
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", bodyId);
        button.innerHTML = `<span></span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
        button.firstChild.textContent = heading.textContent;
        heading.textContent = "";
        heading.appendChild(button);

        button.addEventListener("click", () => {
            const open = card.classList.toggle("is-open");
            button.setAttribute("aria-expanded", String(open));
        });
    });
}

document.querySelectorAll("[data-md]").forEach(async (box) => {
    try {
        const res = await fetch(box.dataset.md, { cache: "no-cache" });
        if (!res.ok) return;

        const md = (await res.text()).replace(/<!--[\s\S]*?-->/g, "").trim();
        if (!md) return;

        box.innerHTML = marked.parse(md);
        box.classList.add("is-loaded");

        // כותרת ## ראשונה בקובץ הופכת לכותרת הפרק (במקום להופיע פעמיים)
        const first = box.firstElementChild;
        const title = box.closest(".svc-module")?.querySelector(".svc-module-title");
        if (first && first.tagName === "H2" && title) {
            title.textContent = first.textContent;
            first.remove();
        }

        setupAccordion(box);
    } catch (e) {
        // אם הטעינה נכשלה – נשארת הודעת "בהכנה"
    }
});
