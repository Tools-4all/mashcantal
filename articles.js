// ===== עמוד המאמרים: חיפוש לפי מילות מפתח + סינון לפי נושא =====
(function () {
    const grid = document.getElementById("a-grid");
    const input = document.getElementById("a-q");
    if (!grid || !input) return;

    const items = Array.from(grid.children);
    const chips = Array.from(document.querySelectorAll(".a-chip"));
    const status = document.getElementById("a-status");
    const noResults = document.getElementById("a-noresults");
    let activeCat = "";

    // אותה פונקציה בדיוק קיימת ב-tools/build-articles.mjs
    const norm = (s) =>
        s.toLowerCase().replace(/[֑-ׇ]/g, "").replace(/["'״׳`]/g, "")
            .replace(/[^\p{L}\p{N}]+/gu, " ").trim();

    // מתעלמים מאות שימוש בתחילת מילה (ה/ו/ב/ל/מ/ש/כ), כדי ש"המשכנתא" ימצא "משכנתא"
    const PREFIX = /^[הובלמשכ]{1,2}(?=.{2,})/;
    const matchWord = (text, word) =>
        text.includes(word) || (PREFIX.test(word) && text.includes(word.replace(PREFIX, "")));

    function apply() {
        const words = norm(input.value).split(" ").filter(Boolean);
        let shown = 0;
        items.forEach((li) => {
            const okCat = !activeCat || li.dataset.cat === activeCat;
            const okText = words.every((w) => matchWord(li.dataset.text, w));
            li.hidden = !(okCat && okText);
            if (!li.hidden) shown++;
        });
        noResults.hidden = shown > 0;
        const filtered = words.length || activeCat;
        status.textContent = filtered ? (shown ? `נמצאו ${shown} מאמרים` : "") : "";

        // שומרים את החיפוש בכתובת, כדי שאפשר יהיה לשתף קישור לתוצאות
        const url = new URL(location.href);
        input.value.trim() ? url.searchParams.set("q", input.value.trim()) : url.searchParams.delete("q");
        activeCat ? url.searchParams.set("topic", activeCat) : url.searchParams.delete("topic");
        history.replaceState(null, "", url);
    }

    function setCat(cat) {
        activeCat = cat;
        chips.forEach((c) => {
            const on = c.dataset.cat === cat;
            c.classList.toggle("is-active", on);
            c.setAttribute("aria-pressed", on);
        });
        apply();
    }

    input.addEventListener("input", apply);
    input.form.addEventListener("submit", (e) => { e.preventDefault(); apply(); });
    chips.forEach((c) => c.addEventListener("click", () => setCat(c.dataset.cat)));

    // פתיחה עם חיפוש מוכן מהכתובת (?q=...&topic=...)
    const params = new URLSearchParams(location.search);
    input.value = params.get("q") || "";
    const topic = params.get("topic") || "";
    setCat(chips.some((c) => c.dataset.cat === topic) ? topic : "");
})();
