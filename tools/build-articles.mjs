#!/usr/bin/env node
/**
 * build-articles.mjs – עדכון אוטומטי של מדור המאמרים
 * ---------------------------------------------------
 * מריצים מתיקיית האתר:   node tools/build-articles.mjs
 *
 * מה הסקריפט עושה בכל הרצה (אפשר להריץ כמה פעמים שרוצים, התוצאה זהה):
 *  1. עובר על כל קובצי המאמרים בתיקייה articles/ (קבצים שמתחילים ב-"_" מדולגים – למשל התבנית).
 *  2. בכל מאמר: ממלא כותרת לשונית, קישור קנוני, תגיות שיתוף, שורת "טל צדוק | תאריך",
 *     תוכן עניינים, כפתור הנעה לפעולה באמצע ובסוף, ונתונים מובנים לגוגל (Article + FAQ).
 *  3. מעדכן את העמוד המרכזי articles.html – כל המאמרים מהחדש לישן.
 *  4. מעדכן את sitemap.xml – מוסיף את עמוד המאמרים ואת כל המאמרים.
 *
 * מה כותבים ידנית בכל מאמר: כותרת H1, תקציר (meta description), תאריך פרסום, נושא,
 * מילות מפתח לחיפוש, גוף המאמר (סעיפים עם H2) ושאלות נפוצות. כל השאר נוצר כאן.
 * לכל נושא יש "קובייה" גרפית משלו בעמוד המאמרים (צבע + אייקון) – מוגדר ב-CATEGORIES למטה.
 * אין צורך בהתקנות – Node.js בלבד.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://finantza.co.il";
const ARTICLES_DIR = join(ROOT, "articles");
const HUB = join(ROOT, "articles.html");
const SITEMAP = join(ROOT, "sitemap.xml");

const AUTHOR = {
    "@type": "Person",
    name: "טל צדוק",
    jobTitle: "יועץ משכנתאות ויועץ פיננסי",
    description: "חבר התאחדות יועצי המשכנתאות בישראל ויועץ פיננסי",
    url: `${SITE}/`,
    memberOf: { "@type": "Organization", name: "התאחדות יועצי המשכנתאות בישראל" },
};
const PUBLISHER = {
    "@type": "Organization",
    name: "FINANTZA",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
};

// ---------- נושאים ----------
// כל נושא מקבל עיצוב קובייה (variant – מוגדר ב-articles.css) ואייקון מ-Font Awesome.
// אפשר להוסיף נושא חדש כאן; מאמר עם נושא שלא ברשימה יקבל את עיצוב ברירת המחדל.
const CATEGORIES = {
    "משכנתא": { variant: "navy", icon: "fa-house" },
    "מחזור משכנתא": { variant: "blue", icon: "fa-arrows-rotate" },
    "ריביות ומדדים": { variant: "sky", icon: "fa-chart-line" },
    "תכנון כלכלי": { variant: "light", icon: "fa-piggy-bank" },
};
const DEFAULT_CATEGORY = "כללי";
const DEFAULT_STYLE = { variant: "navy", icon: "fa-coins" };

/** אותה פונקציה בדיוק קיימת ב-articles.js – מנרמלת טקסט לחיפוש */
const norm = (s) =>
    s.toLowerCase().replace(/[\u0591-\u05C7]/g, "").replace(/["'״׳`]/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, " ").trim();

// ---------- עזרים ----------
const heDate = (iso) =>
    new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
        .format(new Date(iso + "T00:00:00Z"));

const decode = (s) =>
    s.replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonLd = (obj) =>
    `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/</g, "\\u003c")}\n</script>`;

/** מחליף את התוכן שבין <!-- AUTO:NAME --> ל-<!-- /AUTO:NAME --> */
function fill(html, name, content, file) {
    const re = new RegExp(`(<!-- AUTO:${name} -->)[\\s\\S]*?(<!-- /AUTO:${name} -->)`);
    if (!re.test(html)) throw new Error(`${file}: חסר הסימון <!-- AUTO:${name} -->`);
    return html.replace(re, (_, a, b) => `${a}${content}${b}`);
}

function meta(html, attr, key) {
    html = html.replace(/<!--[\s\S]*?-->/g, ""); // מתעלמים משורות שבתוך הערה
    const m = html.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`, "i"));
    return m ? decode(m[1]).trim() : "";
}

function ctaBlock(slug, position) {
    const href = `../landingPage.html?utm_source=articles&amp;utm_medium=${position}&amp;utm_campaign=${slug}`;
    const title = position === "article-mid" ? "רוצים לדעת מה נכון בדיוק עבורכם?" : "מוכנים לעשות את הצעד הבא?";
    const sub = position === "article-mid"
        ? "בשיחת היכרות קצרה וללא עלות נבין יחד את המצב שלכם ונראה איפה אפשר לחסוך."
        : "קבעו שיחת היכרות ללא עלות, ונבנה יחד משכנתא ותוכנית כלכלית שמתאימות לכם.";
    return `
    <aside class="a-cta" aria-label="שיחת היכרות">
        <p class="a-cta-title">${title}</p>
        <p>${sub}</p>
        <a class="a-cta-btn" href="${href}">לשיחת היכרות ללא עלות <i class="fa-solid fa-arrow-left" aria-hidden="true"></i></a>
    </aside>
    `;
}

// ---------- עיבוד מאמר ----------
function buildArticle(file) {
    const path = join(ARTICLES_DIR, file);
    let html = readFileSync(path, "utf8");
    const slug = file.replace(/\.html$/, "");
    const url = `${SITE}/articles/${file}`;

    const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
    if (h1s.length !== 1) throw new Error(`${file}: חייבת להיות כותרת H1 אחת בדיוק (נמצאו ${h1s.length})`);
    const title = text(h1s[0]);
    const description = meta(html, "name", "description");
    const published = meta(html, "property", "article:published_time");
    const modified = meta(html, "property", "article:modified_time") || published;
    const category = meta(html, "property", "article:section") || DEFAULT_CATEGORY;
    const keywords = meta(html, "name", "keywords");
    const cover = meta(html, "name", "finantza:cover");   // תמונה אופציונלית לקובייה
    const icon = meta(html, "name", "finantza:icon");     // אייקון אופציונלי במקום אייקון הנושא
    if (!description) throw new Error(`${file}: חסר תקציר (meta description)`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(published)) throw new Error(`${file}: תאריך פרסום חסר או לא בפורמט YYYY-MM-DD`);

    // --- גוף המאמר: מזהים לכותרות H2 + כפתור אמצע ---
    const bodyRe = /(<div class="a-body">)([\s\S]*?)(<!-- END:BODY -->)/;
    const bm = html.match(bodyRe);
    if (!bm) throw new Error(`${file}: חסר <div class="a-body"> או הסימון <!-- END:BODY -->`);
    let body = bm[2].replace(/<!-- AUTO:CTA-MID -->[\s\S]*?<!-- \/AUTO:CTA-MID -->/g, "<!-- CTA -->");

    let n = 0;
    const toc = [];
    body = body.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (m, attrs, inner) => {
        n++;
        let id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
        if (!id) { id = `section-${n}`; attrs = `${attrs} id="${id}"`; }
        toc.push({ id, label: text(inner) });
        return `<h2${attrs}>${inner}</h2>`;
    });
    if (toc.length < 2) throw new Error(`${file}: צריך לפחות שני סעיפים (H2) בגוף המאמר`);

    // מיקום כפתור האמצע: איפה שכתוב <!-- CTA -->, ואם אין – לפני הסעיף שבאמצע
    const mid = `<!-- AUTO:CTA-MID -->${ctaBlock(slug, "article-mid")}<!-- /AUTO:CTA-MID -->`;
    if (body.includes("<!-- CTA -->")) {
        body = body.replace("<!-- CTA -->", mid).replace(/<!-- CTA -->/g, "");
    } else {
        const target = toc[Math.floor(toc.length / 2)].id;
        body = body.replace(new RegExp(`(<h2[^>]*\\sid="${target}")`), `${mid}\n        $1`);
    }
    html = html.replace(bodyRe, (_, a, __, c) => `${a}${body}${c}`);

    // --- שאלות נפוצות ---
    const faqSec = (html.match(/<section class="a-faq"[\s\S]*?<\/section>/) || [""])[0];
    const faqs = [...faqSec.matchAll(/<summary>([\s\S]*?)<\/summary>\s*<div class="a-faq-answer">([\s\S]*?)<\/div>/g)]
        .map(([, q, a]) => ({ q: text(q), a: text(a) }));
    if (faqs.length) toc.push({ id: "faq", label: "שאלות נפוצות" });

    // --- אזורים אוטומטיים ---
    const head = `
    <title>${esc(title)} | FINANTZA</title>
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="he_IL" />
    <meta property="og:site_name" content="FINANTZA" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/logo.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    ${jsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        inLanguage: "he-IL",
        datePublished: published,
        dateModified: modified,
        articleSection: category,
        ...(keywords ? { keywords } : {}),
        author: AUTHOR,
        publisher: PUBLISHER,
        image: [`${SITE}/logo.png`],
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
    })}
    ${faqs.length ? jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(({ q, a }) => ({
            "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a },
        })),
    }) : ""}
    `;
    html = fill(html, "HEAD", head, file);
    html = fill(html, "BYLINE", `<strong>טל צדוק</strong> | <time datetime="${published}">${heDate(published)}</time>`, file);
    html = fill(html, "TOC", `
        <nav class="a-toc" aria-label="תוכן עניינים">
            <details open>
                <summary>תוכן עניינים</summary>
                <ol>
${toc.map((t) => `                    <li><a href="#${t.id}">${esc(t.label)}</a></li>`).join("\n")}
                </ol>
            </details>
        </nav>
        `, file);
    html = fill(html, "CTA-END", ctaBlock(slug, "article-end"), file);

    writeFileSync(path, html);
    return { file, slug, title, description, published, modified, url, category, keywords, cover, icon };
}

// ---------- עמוד מרכזי ----------
function coverHtml(a) {
    const style = CATEGORIES[a.category] || DEFAULT_STYLE;
    const icon = a.icon || style.icon;
    const art = a.cover
        ? `<img src="${esc(a.cover.replace(/^\.\.\//, ""))}" alt="" loading="lazy" />`
        : `<span class="a-cover-medal"><i class="fa-solid ${esc(icon)}"></i></span>
                            <span class="a-cover-coin c1">₪</span><span class="a-cover-coin c2">%</span><span class="a-cover-coin c3">₪</span>
                            <i class="fa-solid ${esc(icon)} a-cover-ghost"></i>`;
    return `<div class="a-cover v-${style.variant}${a.cover ? " has-img" : ""}" aria-hidden="true">
                            <span class="a-cover-badge">${esc(a.category)}</span>
                            ${art}
                        </div>`;
}

function buildHub(list) {
    let html = readFileSync(HUB, "utf8");

    // סרגל חיפוש + נושאים (רק כשיש מאמרים)
    const counts = {};
    list.forEach((a) => (counts[a.category] = (counts[a.category] || 0) + 1));
    const cats = Object.keys(counts).sort((x, y) => counts[y] - counts[x] || x.localeCompare(y, "he"));
    const filters = list.length
        ? `
            <div class="a-search" role="search">
                <h2 class="a-search-title">על מה תרצו לקרוא?</h2>
                <form class="a-search-box" action="articles.html" onsubmit="return false">
                    <label for="a-q" class="visually-hidden">חיפוש מאמרים</label>
                    <input id="a-q" name="q" type="search" placeholder="חפשו נושא, למשל: מחזור משכנתא" autocomplete="off" />
                    <button type="submit" aria-label="חיפוש"><i class="fa-solid fa-magnifying-glass"></i></button>
                </form>
                <div class="a-chips" role="group" aria-label="סינון לפי נושא">
                    <button type="button" class="a-chip is-active" data-cat="" aria-pressed="true">כל המאמרים (${list.length})</button>
${cats.map((c) => `                    <button type="button" class="a-chip" data-cat="${esc(c)}" aria-pressed="false">${esc(c)} (${counts[c]})</button>`).join("\n")}
                </div>
            </div>
            `
        : "";
    html = fill(html, "FILTERS", filters, "articles.html");

    const items = list.length
        ? `
            <p class="a-status" id="a-status" aria-live="polite"></p>
            <ol class="a-grid" id="a-grid">
${list.map((a) => `                <li data-cat="${esc(a.category)}" data-text="${esc(norm([a.title, a.description, a.category, a.keywords].join(" ")))}">
                    <article class="a-card">
                        ${coverHtml(a)}
                        <div class="a-card-body">
                            <time datetime="${a.published}">${heDate(a.published)}</time>
                            <h2><a href="articles/${a.file}">${esc(a.title)}</a></h2>
                            <p>${esc(a.description)}</p>
                            <span class="a-more" aria-hidden="true">לקריאת המאמר <i class="fa-solid fa-angles-left"></i></span>
                        </div>
                    </article>
                </li>`).join("\n")}
            </ol>
            <div class="a-empty" id="a-noresults" hidden>
                לא מצאנו מאמר שמתאים לחיפוש. <a href="landingPage.html?utm_source=articles&amp;utm_medium=search-empty">אפשר פשוט לשאול אותי בשיחת היכרות ללא עלות</a>.
            </div>
            `
        : `
            <div class="a-empty">המאמרים הראשונים בדרך. בינתיים אפשר <a href="landingPage.html">לקבוע שיחת היכרות ללא עלות</a>.</div>
            `;
    html = fill(html, "LIST", items, "articles.html");
    html = fill(html, "JSONLD", "\n    " + jsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "מאמרים – FINANTZA",
        url: `${SITE}/articles.html`,
        inLanguage: "he-IL",
        publisher: PUBLISHER,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: list.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: a.url, name: a.title })),
        },
    }) + "\n    ", "articles.html");
    writeFileSync(HUB, html);
}

// ---------- sitemap ----------
function buildSitemap(list) {
    let xml = readFileSync(SITEMAP, "utf8");
    // מסירים רשומות ישנות של מאמרים / עמוד המאמרים, וגם בלוק אוטומטי קודם
    xml = xml.replace(/\s*<!-- AUTO:ARTICLES -->[\s\S]*?<!-- \/AUTO:ARTICLES -->/, "");
    xml = xml.replace(/\s*<url>\s*<loc>[^<]*\/(articles\.html|articles\/[^<]*)<\/loc>[\s\S]*?<\/url>/g, "");
    const today = new Date().toISOString().slice(0, 10);
    const hubDate = list.length ? list.map((a) => a.modified).sort().at(-1) : today;
    const entries = [
        `  <url>\n    <loc>${SITE}/articles.html</loc>\n    <lastmod>${hubDate}</lastmod>\n    <priority>0.8</priority>\n  </url>`,
        ...list.map((a) => `  <url>\n    <loc>${a.url}</loc>\n    <lastmod>${a.modified}</lastmod>\n    <priority>0.7</priority>\n  </url>`),
    ];
    const block = `\n  <!-- AUTO:ARTICLES -->\n${entries.join("\n")}\n  <!-- /AUTO:ARTICLES -->\n`;
    xml = xml.replace(/\s*<\/urlset>\s*$/, `${block}</urlset>\n`);
    // שומרים על סוג ירידת השורה של הקובץ המקורי (Windows/Mac)
    const eol = /\r\n/.test(xml) ? "\r\n" : "\n";
    writeFileSync(SITEMAP, xml.replace(/\r?\n/g, eol));
}

// ---------- הרצה ----------
const files = existsSync(ARTICLES_DIR)
    ? readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".html") && !f.startsWith("_"))
    : [];
const articles = files.map(buildArticle)
    .sort((a, b) => b.published.localeCompare(a.published) || a.file.localeCompare(b.file));
buildHub(articles);
buildSitemap(articles);
console.log(`עודכנו ${articles.length} מאמרים, העמוד המרכזי ו-sitemap.xml`);
articles.forEach((a) => console.log(`  ${a.published}  ${a.title}`));
