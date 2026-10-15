// עמודי שירות – טעינת תוכן Markdown לתוך המודולים
// כל אלמנט עם data-md טוען את הקובץ שלו מתיקיית content/.
// קובץ ריק (או שמכיל רק הערה) משאיר את ההודעה "התוכן לפרק זה בהכנה".

document.getElementById("year").textContent = new Date().getFullYear();

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
    } catch (e) {
        // אם הטעינה נכשלה – נשארת הודעת "בהכנה"
    }
});
