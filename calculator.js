/* מחשבון "לאן הכסף הולך" – calculator.html
   כל החישובים נעשים בדפדפן. לשרת נשלחים רק פרטי הליד וסיכום התוצאה. */

// =====================================================================
// הגדרות – למלא / לבדוק לפני העלאה
// =====================================================================

// TODO (טל): לוודא שזה מספר הוואטסאפ הנכון. פורמט בינלאומי, בלי + ובלי מקפים.
const WHATSAPP_NUMBER = "972559971294";

// TODO (טל): לוודא שזה מספר הטלפון הנכון לכפתור "התקשרו אליי".
const PHONE_NUMBER = "0559971294";

// ההודעה שתופיע מוכנה בוואטסאפ.
const WHATSAPP_MESSAGE = 'שלום טל, מילאתי את המחשבון "לאן הכסף הולך" ואשמח לתאם בדיקת דופק כלכלי של 15 דקות.';

// כתובת עמוד מדיניות הפרטיות – מוצגת כקישור ליד תיבת ההסכמה לדיוור.
// אם ריק – הקישור לא יוצג.
const PRIVACY_POLICY_URL = "privacy.html";

// נקודת שליחת הלידים – אותו טופס Formspree שמשמש את שאר האתר.
const LEAD_ENDPOINT = "https://formspree.io/f/xpqyanzg";

// סף הסטטוס הצהוב: אם (נשאר בסוף החודש + הפקדה לחיסכון) קטן מהאחוז הזה מההכנסות.
const YELLOW_THRESHOLD = 0.10;

// =====================================================================
// שלבי האשף והקטגוריות
// =====================================================================

const STEPS = [
    {
        title: "הכנסות (נטו)",
        subtotalLabel: 'סה"כ הכנסות',
        fields: [
            { id: "salary1", label: "משכורת נטו, בן/בת זוג 1", hint: "הסכום שנכנס לחשבון בפועל" },
            { id: "salary2", label: "משכורת נטו, בן/בת זוג 2", hint: "הסכום שנכנס לחשבון בפועל" },
            { id: "allowances", label: "קצבאות", hint: "קצבת ילדים, קצבאות נוספות, סיוע בשכר דירה" },
            { id: "otherIncome", label: "הכנסות נוספות", hint: "מזונות, הכנסה מנכס, סיוע מההורים, עבודה צדדית" }
        ]
    },
    {
        title: "הוצאות קבועות",
        subtotalLabel: 'סה"כ הוצאות קבועות',
        // כל קטגוריה מחולקת לריבועים – הוצאה אחת בכל ריבוע. סכום הקטגוריה = סכום הריבועים.
        fields: [
            { id: "housing", label: "דיור", items: [
                { id: "rent", label: "משכנתא / שכר דירה" },
                { id: "houseCommittee", label: "ועד בית" }] },
            { id: "bills", label: "ארנונה וחשבונות", items: [
                { id: "arnona", label: "ארנונה" },
                { id: "electricity", label: "חשמל" },
                { id: "water", label: "מים וביוב" },
                { id: "gas", label: "גז" }] },
            { id: "telecom", label: "תקשורת ומנויים", items: [
                { id: "mobile", label: "סלולר" },
                { id: "internet", label: "אינטרנט" },
                { id: "tv", label: "טלוויזיה" },
                { id: "streaming", label: "סטרימינג" },
                { id: "gym", label: "חדר כושר" }] },
            { id: "insurance", label: "ביטוחים", items: [
                { id: "insHealth", label: "ביטוח בריאות" },
                { id: "insLife", label: "ביטוח חיים" },
                { id: "insProperty", label: "ביטוח רכוש" },
                { id: "insCar", label: "ביטוח רכב (החלק החודשי)" }] },
            { id: "kids", label: "ילדים וחינוך", items: [
                { id: "daycare", label: "גן / מעון" },
                { id: "afterschool", label: "צהרון" },
                { id: "classes", label: "חוגים" },
                { id: "camps", label: "קייטנות" }] },
            { id: "loans", label: "החזרי הלוואות ותשלומים", items: [
                { id: "loanRepay", label: "הלוואות" },
                { id: "installments", label: "עסקאות בתשלומים" }] },
            { id: "fees", label: "עמלות וריבית", items: [
                { id: "overdraftInterest", label: "ריבית על המינוס" },
                { id: "bankFees", label: "עמלות בנק" },
                { id: "cardFees", label: "דמי כרטיס אשראי" }] }
        ]
    },
    {
        title: "הוצאות משתנות",
        subtotalLabel: 'סה"כ הוצאות משתנות',
        fields: [
            { id: "groceries", label: "מזון לבית", items: [
                { id: "supermarket", label: "סופר" },
                { id: "market", label: "שוק" },
                { id: "grocery", label: "מכולת" }] },
            { id: "eatingOut", label: "אוכל בחוץ ובילויים", items: [
                { id: "restaurants", label: "מסעדות" },
                { id: "delivery", label: "משלוחים" },
                { id: "outings", label: "יציאות" }] },
            { id: "transport", label: "רכב ותחבורה", items: [
                { id: "fuel", label: "דלק" },
                { id: "parking", label: "חניה" },
                { id: "tolls", label: "כבישי אגרה" },
                { id: "publicTransport", label: "תחבורה ציבורית" },
                { id: "carRepairs", label: "תיקונים" }] },
            { id: "shopping", label: "קניות וטיפוח", items: [
                { id: "clothing", label: "ביגוד והנעלה" },
                { id: "pharm", label: "פארם" },
                { id: "cosmetics", label: "קוסמטיקה" },
                { id: "haircut", label: "תספורת" }] },
            { id: "gifts", label: "מתנות ואירועים", items: [
                { id: "eventGifts", label: "מתנות לשמחות" },
                { id: "holidays", label: "חגים" }] },
            { id: "leisure", label: "פנאי וחופשות", items: [
                { id: "hobbies", label: "תחביבים" },
                { id: "trips", label: "טיולים" },
                { id: "vacations", label: "חופשות" }] },
            { id: "untracked", label: "מזומן וביט ללא מעקב", items: [
                { id: "cashWithdrawals", label: "משיכות מזומן" },
                { id: "untrackedTransfers", label: "העברות שלא ברור על מה הלכו" }] },
            { id: "misc", label: "שונות", items: [
                { id: "miscItems", label: "כל מה שלא נכנס למעלה" }] }
        ]
    },
    {
        title: "חיסכון, הלוואות ומצב החשבון",
        subtotalLabel: "הפקדה חודשית לחיסכון",
        fields: [
            { id: "saving", label: "הפקדה חודשית לחיסכון", hint: "הוראות קבע לחיסכון, קופת גמל להשקעה. לא כולל פנסיה מהמשכורת" },
            // יתרות (לא סכומים חודשיים) – משמשות רק לחישוב השווי הנקי
            { id: "existingSavings", label: "חסכונות קיימים", hint: "כמה כסף יש לכם היום בחסכונות, בפיקדונות, בקופות גמל להשקעה ובתיקי השקעות. לא כולל פנסיה", balance: true },
            { id: "loanBalance", label: "יתרת הלוואות קיימות", hint: "כמה נשאר לכם להחזיר בכל ההלוואות יחד עד סיומן. לא כולל משכנתא", balance: true },
            { id: "balance", label: 'יתרת העו"ש היום', hint: "הסכום בחשבון העו\"ש נכון להיום", signed: true }
        ]
    }
];

const STATUS = {
    red: { name: "אדום", text: "ההוצאות גבוהות מההכנסות" },
    yellow: { name: "צהוב", text: "מאוזן, אבל כמעט בלי חיסכון" },
    green: { name: "ירוק", text: "יש תזרים חיובי וחיסכון" }
};

// =====================================================================
// עזרי מספרים
// =====================================================================

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatDigits(n) {
    return numberFormat.format(Math.round(Math.abs(n)));
}

// סכום להצגה, כולל סימן מינוס. עטוף ב-span משמאל לימין כדי שהמינוס לא יקפוץ בעברית.
function money(n) {
    const sign = Math.round(n) < 0 ? "-" : "";
    return `<span class="mc-num">${sign}${formatDigits(n)} ₪</span>`;
}

// אותו דבר כטקסט פשוט (למייל של הליד)
function moneyText(n) {
    const sign = Math.round(n) < 0 ? "-" : "";
    return `${sign}${formatDigits(n)} ₪`;
}

function parseAmount(str) {
    const digits = String(str || "").replace(/\D/g, "");
    return digits ? Number(digits) : 0;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// =====================================================================
// החישוב – לפי הנוסחאות במפרט
// =====================================================================

// סכום קטגוריה: אם יש לה ריבועים – סכום הריבועים, אחרת השדה עצמו
function fieldAmount(f, values) {
    if (f.items) return f.items.reduce((acc, it) => acc + (values[it.id] || 0), 0);
    return f.signed || f.balance ? 0 : (values[f.id] || 0);
}

function sumFields(stepIndex, values) {
    return STEPS[stepIndex].fields.reduce((acc, f) => acc + fieldAmount(f, values), 0);
}

function compute(values, balanceSign) {
    const income = sumFields(0, values);
    const fixed = sumFields(1, values);
    const variable = sumFields(2, values);
    const expenses = fixed + variable;
    const saving = values.saving || 0;
    const left = income - expenses - saving;
    const yearly = left * 12;
    const balanceToday = (values.balance || 0) * (balanceSign === "minus" ? -1 : 1);
    const balanceInYear = balanceToday + yearly;
    const yearlySaving = saving * 12;

    // שווי נקי: נכסים (חסכונות קיימים + עו"ש בפלוס) פחות התחייבויות (יתרת הלוואות + מינוס בעו"ש)
    const existingSavings = values.existingSavings || 0;
    const loanBalance = values.loanBalance || 0;
    const assets = existingSavings + Math.max(balanceToday, 0);
    const liabilities = loanBalance + Math.max(-balanceToday, 0);
    const netWorth = assets - liabilities;

    const fixedPct = income > 0 ? (fixed / income) * 100 : 0;
    const incomeMinusExpenses = income - expenses;
    // חלוקת ההוצאות: קבועות ומשתנות מתוך סך ההוצאות
    const fixedShare = expenses > 0 ? (fixed / expenses) * 100 : 0;
    const variableShare = expenses > 0 ? (variable / expenses) * 100 : 0;

    const categories = [...STEPS[1].fields, ...STEPS[2].fields].map((f) => ({ label: f.label, amount: fieldAmount(f, values) }));
    const top3 = categories
        .filter((c) => c.amount > 0)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

    let status = "green";
    if (left < 0) status = "red";
    else if (left + saving < YELLOW_THRESHOLD * income) status = "yellow";

    return { income, fixed, variable, expenses, saving, left, yearly, balanceToday, balanceInYear, yearlySaving, fixedPct, incomeMinusExpenses, fixedShare, variableShare, existingSavings, loanBalance, assets, liabilities, netWorth, top3, status };
}

// =====================================================================
// מעקב אירועים (Google Analytics / Meta Pixel – רק אם מותקנים באתר)
// =====================================================================

const META_EVENT_NAMES = {
    calculator_start: "CalculatorStart",
    calculator_step_complete: "CalculatorStepComplete",
    calculator_complete: "CalculatorComplete"
};

function track(eventName, params = {}) {
    try {
        if (typeof window.gtag === "function") window.gtag("event", eventName, params);
        if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: eventName, ...params });
        if (typeof window.fbq === "function") {
            if (eventName === "generate_lead") window.fbq("track", "Lead", params);
            else window.fbq("trackCustom", META_EVENT_NAMES[eventName] || eventName, params);
        }
    } catch (err) { /* מעקב לא אמור לשבור את העמוד */ }
}

let started = false;
function trackStart() {
    if (started) return;
    started = true;
    track("calculator_start");
}

// =====================================================================
// מקור הגעה (UTM) – אותה לוגיקה כמו בדף הנחיתה
// =====================================================================

const SOURCE_NAMES = {
    instagram: "אינסטגרם", facebook: "פייסבוק", google: "גוגל",
    whatsapp: "וואטסאפ", tiktok: "טיקטוק", linkedin: "לינקדאין", youtube: "יוטיוב", articles: "מאמרים באתר"
};

function getSource() {
    const params = new URLSearchParams(window.location.search);
    let utm = {
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || ""
    };
    try {
        if (utm.utm_source) sessionStorage.setItem("finantza_utm", JSON.stringify(utm));
        else utm = JSON.parse(sessionStorage.getItem("finantza_utm") || "null") || utm;
    } catch (err) { /* דפדפן שחוסם אחסון – ממשיכים בלי */ }

    let label = "ישיר / לא ידוע";
    if (utm.utm_source) {
        label = SOURCE_NAMES[utm.utm_source.toLowerCase()] || utm.utm_source;
        if (utm.utm_medium) label += " – " + utm.utm_medium;
        if (utm.utm_campaign) label += " (" + utm.utm_campaign + ")";
    } else if (document.referrer) {
        try {
            const host = new URL(document.referrer).hostname;
            if (host && host !== location.hostname) label = "הפניה מ-" + host;
        } catch (err) { /* referrer לא תקין */ }
    }
    return { label, ...utm };
}

// =====================================================================
// בניית האשף
// =====================================================================

const values = {};
let balanceSign = "plus";
let currentStep = 0;
let leadSent = false;

const stepsEl = document.getElementById("wizardSteps");
const subtotalEl = document.getElementById("subtotal");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const wizardCard = document.getElementById("wizard");
const leadCard = document.getElementById("leadCard");
const resultsEl = document.getElementById("results");

function buildField(f) {
    const hintId = `${f.id}Hint`;
    const input = `
        <div class="mc-input-wrap">
            <input type="text" id="${f.id}" name="${f.id}" inputmode="numeric" autocomplete="off"
                enterkeyhint="next" maxlength="11" aria-describedby="${hintId}" data-amount>
            <span class="mc-currency" aria-hidden="true">₪</span>
        </div>
        <p class="mc-hint" id="${hintId}">${f.hint}</p>`;

    if (!f.signed) {
        return `<div class="mc-field"><label for="${f.id}">${f.label}</label>${input}</div>`;
    }

    // יתרת עו"ש: בורר פלוס / מינוס במקום הקלדת סימן
    return `
        <fieldset class="mc-fieldset">
            <legend>${f.label}</legend>
            <div class="mc-sign" role="radiogroup" aria-label="יתרה בפלוס או במינוס">
                <input type="radio" id="signPlus" name="balanceSign" value="plus" checked>
                <label for="signPlus">פלוס</label>
                <input type="radio" id="signMinus" name="balanceSign" value="minus">
                <label for="signMinus">מינוס</label>
            </div>
            <div class="mc-field">
                <label for="${f.id}">סכום היתרה</label>
                ${input}
            </div>
        </fieldset>`;
}

// כרטיס קטגוריה עם ריבוע לכל הוצאה, וסכום הקטגוריה בכותרת
function buildGroup(g) {
    const tiles = g.items.map((it) => `
        <div class="mc-tile">
            <label for="${it.id}">${it.label}</label>
            <div class="mc-input-wrap">
                <input type="text" id="${it.id}" name="${it.id}" inputmode="numeric" autocomplete="off"
                    enterkeyhint="next" maxlength="11" data-amount data-group="${g.id}">
                <span class="mc-currency" aria-hidden="true">₪</span>
            </div>
        </div>`).join("");

    return `
        <div class="mc-group" role="group" aria-labelledby="gl-${g.id}">
            <div class="mc-group-head">
                <h4 class="mc-group-title" id="gl-${g.id}">${g.label}</h4>
                <span class="mc-group-sum" id="sum-${g.id}">${money(0)}</span>
            </div>
            <div class="mc-tiles">${tiles}</div>
        </div>`;
}

stepsEl.innerHTML = STEPS.map((step, i) => `
    <div class="mc-step" data-step="${i}" ${i === 0 ? "" : "hidden"}>
        <h3 class="mc-step-title" tabindex="-1">${step.title}</h3>
        ${step.fields.map((f) => (f.items ? buildGroup(f) : buildField(f))).join("")}
    </div>`).join("");

const GROUPS = {};
[...STEPS[1].fields, ...STEPS[2].fields].forEach((g) => { GROUPS[g.id] = g; });

function updateGroupSum(groupId) {
    const el = document.getElementById(`sum-${groupId}`);
    if (el) el.innerHTML = money(fieldAmount(GROUPS[groupId], values));
}

// עיצוב אוטומטי של מפריד אלפים, תוך שמירה על מיקום הסמן
function formatInput(input) {
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, "").replace(/^0+(?=\d)/, "").length;
    let digits = input.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 9);
    const formatted = digits ? numberFormat.format(Number(digits)) : "";
    input.value = formatted;

    let pos = 0;
    let seen = 0;
    while (pos < formatted.length && seen < digitsBeforeCaret) {
        if (/\d/.test(formatted[pos])) seen++;
        pos++;
    }
    if (document.activeElement === input) input.setSelectionRange(pos, pos);
    values[input.id] = parseAmount(formatted);
}

stepsEl.addEventListener("input", (e) => {
    if (e.target.matches("[data-amount]")) {
        formatInput(e.target);
        if (e.target.dataset.group) updateGroupSum(e.target.dataset.group);
        updateSubtotal();
    }
});

stepsEl.addEventListener("change", (e) => {
    if (e.target.name === "balanceSign") balanceSign = e.target.value;
});

wizardCard.addEventListener("focusin", trackStart);
document.getElementById("heroStart").addEventListener("click", trackStart);

function updateSubtotal() {
    const step = STEPS[currentStep];
    const amount = currentStep === 3 ? (values.saving || 0) : sumFields(currentStep, values);
    subtotalEl.innerHTML = `<span>${step.subtotalLabel}</span><strong>${money(amount)}</strong>`;
}

function showStep(index, moveFocus) {
    currentStep = index;
    document.querySelectorAll(".mc-step").forEach((el) => {
        el.hidden = Number(el.dataset.step) !== index;
    });
    progressLabel.textContent = `שלב ${index + 1} מתוך ${STEPS.length}`;
    progressFill.style.width = `${((index + 1) / STEPS.length) * 100}%`;
    prevBtn.hidden = index === 0;
    nextBtn.textContent = index === STEPS.length - 1 ? "לסיום" : "הבא";
    updateSubtotal();

    if (moveFocus) {
        const title = document.querySelector(`.mc-step[data-step="${index}"] .mc-step-title`);
        title.focus({ preventScroll: true });
        scrollToEl(wizardCard);
    }
}

function scrollToEl(el) {
    const top = el.getBoundingClientRect().top;
    if (top < 100 || top > window.innerHeight * 0.6) {
        el.scrollIntoView({ block: "start", behavior: "smooth" });
    }
}

document.getElementById("wizardForm").addEventListener("submit", (e) => {
    e.preventDefault();
    trackStart();
    track("calculator_step_complete", { step: currentStep + 1, step_name: STEPS[currentStep].title });

    if (currentStep < STEPS.length - 1) {
        showStep(currentStep + 1, true);
    } else {
        finishWizard();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentStep > 0) showStep(currentStep - 1, true);
});

// =====================================================================
// סיום האשף: התוצאות מוצגות מיד. השארת פרטים היא רשות ומופיעה אחרי התוצאות.
// =====================================================================

let result = null;

function finishWizard() {
    result = compute(values, balanceSign);
    wizardCard.hidden = true;
    document.getElementById("resultsContent").innerHTML = renderResults(result, "rs");
    resultsEl.hidden = false;
    leadCard.hidden = false;
    track("calculator_complete");
    document.getElementById("resultsTitle").focus({ preventScroll: true });
    scrollToEl(resultsEl);
}

document.getElementById("editBtn").addEventListener("click", () => {
    resultsEl.hidden = true;
    leadCard.hidden = true;
    wizardCard.hidden = false;
    showStep(0, true);
});

// =====================================================================
// תצוגת התוצאות
// =====================================================================

function renderResults(r, uid) {
    const st = STATUS[r.status];
    const forecast = r.yearly < 0
        ? `בקצב הזה, תוך 12 חודשים המינוס שלכם יגדל ב־${money(-r.yearly)}`
        : `בקצב הזה, תוך 12 חודשים יישאר לכם עודף של ${money(r.yearly)}`;

    const stat = (label, n) =>
        `<div class="mc-stat"><p class="mc-stat-label">${label}</p><p class="mc-stat-value ${Math.round(n) < 0 ? "is-neg" : ""}">${money(n)}</p></div>`;

    return `
    <div class="mc-res-grid">
        <div class="mc-card mc-hero-card mc-status-${r.status}">
            <p class="mc-label">נשאר בסוף החודש</p>
            <p class="mc-big">${money(r.left)}</p>
            <p class="mc-sub-line">הכנסות פחות הוצאות (לפני חיסכון): <strong>${money(r.incomeMinusExpenses)}</strong></p>
            <p class="mc-forecast">${forecast}</p>
            <p class="mc-badge"><span class="mc-badge-dot" aria-hidden="true"></span>סטטוס ${st.name}: ${st.text}</p>
        </div>

        <div class="mc-stats">
            ${stat('סה"כ הכנסות', r.income)}
            ${stat('סה"כ הוצאות', r.expenses)}
            ${stat("תוך 12 חודשים", r.yearly)}
            ${stat('יתרת עו"ש היום', r.balanceToday)}
            ${stat('יתרת עו"ש צפויה בעוד שנה', r.balanceInYear)}
            ${stat("חיסכון שנתי מתוכנן", r.yearlySaving)}
        </div>

        <div class="mc-card">
            <h4 class="mc-chart-title">הוצאות קבועות מול משתנות</h4>
            ${renderSplit(r)}
        </div>

        <div class="mc-card">
            <h4 class="mc-chart-title">לאן הולכת ההכנסה</h4>
            ${renderDonut(r, uid)}
        </div>

        <div class="mc-card">
            <h4 class="mc-chart-title">3 הקטגוריות הגדולות</h4>
            ${renderBars(r)}
        </div>

        <div class="mc-card">
            <h4 class="mc-chart-title">הוצאות קבועות מתוך ההכנסה</h4>
            ${renderMeter(r)}
        </div>

        <div class="mc-card">
            <h4 class="mc-chart-title">שווי נקי: נכסים מול התחייבויות</h4>
            ${renderNetWorth(r)}
        </div>
    </div>`;
}

// גרף טבעת ב-SVG. אם ההוצאות + החיסכון גבוהים מההכנסה, הטבעת מייצגת את כל הכסף שיוצא,
// והחלק שאינו מכוסה בהכנסה מסומן בפסים אדומים ("חריגה").
function renderDonut(r, uid) {
    const outflow = r.fixed + r.variable + r.saving;
    const over = r.left < 0;
    const deficit = over ? -r.left : 0;
    const remaining = over ? 0 : r.left;
    const base = over ? outflow : r.income;

    const parts = [
        { name: "הוצאות קבועות", value: r.fixed, color: "var(--mc-fixed)" },
        { name: "הוצאות משתנות", value: r.variable, color: "var(--mc-variable)" },
        { name: "חיסכון", value: r.saving, color: "var(--mc-saving)" }
    ];
    if (!over) parts.push({ name: "נשאר", value: remaining, color: "var(--mc-left)" });

    const R = 78;
    const C = 2 * Math.PI * R;
    let offset = 0;
    let arcs = "";

    if (base > 0) {
        parts.forEach((p) => {
            if (p.value <= 0) return;
            const len = (p.value / base) * C;
            arcs += `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${p.color}" stroke-width="30"
                stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" />`;
            offset += len;
        });
        if (over) {
            const len = (deficit / base) * C;
            arcs += `<circle cx="100" cy="100" r="${R}" fill="none" stroke="url(#hatch-${uid})" stroke-width="30"
                stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-(C - len)}" />`;
        }
    }

    const pctOfIncome = (v) => (r.income > 0 ? `${Math.round((v / r.income) * 100)}%` : "");

    let centerBig = "";
    let centerSmall = "";
    if (base <= 0) {
        centerBig = "0 ₪";
        centerSmall = "לא הוזנו סכומים";
    } else if (r.income > 0) {
        centerBig = `${Math.round((outflow / r.income) * 100)}%`;
        centerSmall = "מההכנסה יוצא";
    } else {
        centerBig = "0 ₪";
        centerSmall = "הכנסה";
    }

    const legendRows = parts.map((p) => `
        <li><span class="mc-swatch" style="background:${p.color}" aria-hidden="true"></span>
            <span class="mc-legend-name">${p.name}</span>
            <span class="mc-legend-val">${money(p.value)}</span>
            <span class="mc-legend-pct">${pctOfIncome(p.value)}</span></li>`).join("");

    const overRow = over ? `
        <li><span class="mc-swatch mc-swatch-over" aria-hidden="true"></span>
            <span class="mc-legend-name">חריגה מעבר להכנסה</span>
            <span class="mc-legend-val">${money(deficit)}</span>
            <span class="mc-legend-pct">${pctOfIncome(deficit)}</span></li>` : "";

    const overNote = over
        ? `<p class="mc-over-note">ההוצאות והחיסכון גבוהים מההכנסה ב־${money(deficit)} בחודש. החלק המסומן בפסים לא מכוסה בהכנסה.</p>`
        : "";

    const ariaLabel = `לאן הולכת ההכנסה: ${parts.map((p) => `${p.name} ${moneyText(p.value)}`).join(", ")}${over ? `, חריגה מעבר להכנסה ${moneyText(deficit)}` : ""}`;

    return `
    <div class="mc-donut-wrap">
        <svg class="mc-donut" viewBox="0 0 200 200" role="img" aria-label="${escapeHtml(ariaLabel)}">
            <defs>
                <pattern id="hatch-${uid}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="8" fill="#fca5a5" />
                    <rect width="4" height="8" fill="#b91c1c" />
                </pattern>
            </defs>
            <g transform="rotate(-90 100 100)">
                <circle cx="100" cy="100" r="${R}" fill="none" stroke="#eef1f7" stroke-width="30" />
                ${arcs}
            </g>
            <text x="100" y="98" text-anchor="middle" class="mc-donut-center-big" direction="ltr">${centerBig}</text>
            <text x="100" y="120" text-anchor="middle" class="mc-donut-center-small">${centerSmall}</text>
        </svg>
        <div style="width:100%">
            <ul class="mc-legend">${legendRows}${overRow}</ul>
            ${overNote}
        </div>
    </div>`;
}

// סך ההוצאות מחולק לקבועות ולמשתנות, בשקלים ובאחוזים מסך ההוצאות
function renderSplit(r) {
    if (r.expenses <= 0) return `<p class="mc-empty">לא הוזנו הוצאות.</p>`;
    const fixedPct = Math.round(r.fixedShare);
    const variablePct = 100 - fixedPct;
    return `
        <p class="mc-split-total">סך ההוצאות: <strong>${money(r.expenses)}</strong></p>
        <div class="mc-split-bar" aria-hidden="true">
            <div class="mc-split-fixed" style="width:${r.fixedShare}%"></div>
            <div class="mc-split-variable" style="width:${r.variableShare}%"></div>
        </div>
        <ul class="mc-split-legend">
            <li><span class="mc-swatch" style="background:var(--mc-fixed)" aria-hidden="true"></span>
                <span class="mc-legend-name">הוצאות קבועות</span>
                <span class="mc-legend-val">${money(r.fixed)}</span>
                <span class="mc-legend-pct">${fixedPct}%</span></li>
            <li><span class="mc-swatch" style="background:var(--mc-variable)" aria-hidden="true"></span>
                <span class="mc-legend-name">הוצאות משתנות</span>
                <span class="mc-legend-val">${money(r.variable)}</span>
                <span class="mc-legend-pct">${variablePct}%</span></li>
        </ul>`;
}

// שווי נקי: שני פסים (נכסים, התחייבויות) ביחס לגדול מביניהם, והפרש ביניהם כמספר גדול
function renderNetWorth(r) {
    if (r.assets <= 0 && r.liabilities <= 0) return `<p class="mc-empty">לא הוזנו חסכונות, הלוואות או יתרת עו"ש.</p>`;
    const max = Math.max(r.assets, r.liabilities);
    const row = (label, amount, cls, details) => `
        <li>
            <div class="mc-bar-head"><span>${label}</span><strong>${money(amount)}</strong></div>
            <div class="mc-bar-track" aria-hidden="true"><div class="mc-bar-fill ${cls}" style="width:${max > 0 ? (amount / max) * 100 : 0}%"></div></div>
            ${details ? `<p class="mc-nw-details">${details}</p>` : ""}
        </li>`;

    const assetParts = [];
    if (r.existingSavings > 0) assetParts.push(`חסכונות קיימים ${money(r.existingSavings)}`);
    if (r.balanceToday > 0) assetParts.push(`עו"ש בפלוס ${money(r.balanceToday)}`);
    const liabilityParts = [];
    if (r.loanBalance > 0) liabilityParts.push(`יתרת הלוואות ${money(r.loanBalance)}`);
    if (r.balanceToday < 0) liabilityParts.push(`מינוס בעו"ש ${money(-r.balanceToday)}`);

    return `
        <p class="mc-nw-value ${Math.round(r.netWorth) < 0 ? "is-neg" : ""}">${money(r.netWorth)}</p>
        <p class="mc-meter-sub">נכסים פחות התחייבויות</p>
        <ul class="mc-bars">
            ${row("נכסים", r.assets, "mc-fill-assets", assetParts.join(" · "))}
            ${row("התחייבויות", r.liabilities, "mc-fill-liabilities", liabilityParts.join(" · "))}
        </ul>`;
}

function renderBars(r) {
    if (!r.top3.length) return `<p class="mc-empty">לא הוזנו הוצאות.</p>`;
    const max = r.top3[0].amount;
    return `<ol class="mc-bars">${r.top3.map((c) => `
        <li>
            <div class="mc-bar-head"><span>${c.label}</span><strong>${money(c.amount)}</strong></div>
            <div class="mc-bar-track" aria-hidden="true"><div class="mc-bar-fill" style="width:${(c.amount / max) * 100}%"></div></div>
        </li>`).join("")}</ol>`;
}

function renderMeter(r) {
    const pct = Math.round(r.fixedPct);
    const width = Math.min(r.fixedPct, 100);
    return `
        <p class="mc-meter-value"><span class="mc-num">${pct}%</span></p>
        <p class="mc-meter-sub">${money(r.fixed)} מתוך הכנסה של ${money(r.income)}</p>
        <div class="mc-meter-track" aria-hidden="true"><div class="mc-meter-fill" style="width:${width}%"></div></div>
        <div class="mc-meter-scale" aria-hidden="true"><span>0%</span><span>50%</span><span>100%</span></div>`;
}

// =====================================================================
// טופס הליד
// =====================================================================

const leadForm = document.getElementById("leadForm");
const nameInput = document.getElementById("leadName");
const phoneInput = document.getElementById("leadPhone");
const emailInput = document.getElementById("leadEmail");
const consentInput = document.getElementById("leadConsent");
const submitBtn = document.getElementById("leadSubmit");

// מספר ישראלי: נייד (05X) או קווי, גם בפורמט +972
function normalizePhone(raw) {
    let digits = String(raw).replace(/\D/g, "");
    if (digits.startsWith("972")) digits = "0" + digits.slice(3);
    return digits;
}

function isValidIsraeliPhone(raw) {
    return /^0(5\d{8}|7\d{8}|[23489]\d{7})$/.test(normalizePhone(raw));
}

function setFieldError(input, errId, msg) {
    document.getElementById(errId).textContent = msg;
    if (msg) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
}

leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formErr = document.getElementById("leadFormErr");
    formErr.textContent = "";

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    let firstInvalid = null;

    if (name.length < 2) {
        setFieldError(nameInput, "leadNameErr", "נא להזין שם מלא");
        firstInvalid = firstInvalid || nameInput;
    } else setFieldError(nameInput, "leadNameErr", "");

    if (!isValidIsraeliPhone(phone)) {
        setFieldError(phoneInput, "leadPhoneErr", "נא להזין מספר טלפון ישראלי תקין, למשל 050-1234567");
        firstInvalid = firstInvalid || phoneInput;
    } else setFieldError(phoneInput, "leadPhoneErr", "");

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError(emailInput, "leadEmailErr", "כתובת האימייל לא תקינה. אפשר גם להשאיר את השדה ריק.");
        firstInvalid = firstInvalid || emailInput;
    } else setFieldError(emailInput, "leadEmailErr", "");

    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }

    const r = result;
    const st = STATUS[r.status];
    const source = getSource();

    // רק פרטי הליד וסיכום התוצאה נשלחים לשרת
    const payload = {
        _subject: `ליד חדש ממחשבון "לאן הכסף הולך" – ${source.label}`,
        page: "מחשבון לאן הכסף הולך",
        name,
        phone: normalizePhone(phone),
        email,
        "הסכמה לפניות ודיוור": consentInput.checked ? "כן" : "לא",
        'סה"כ הכנסות': moneyText(r.income),
        'סה"כ הוצאות': moneyText(r.expenses),
        "מתוכן הוצאות קבועות": `${moneyText(r.fixed)} (${Math.round(r.fixedShare)}%)`,
        "מתוכן הוצאות משתנות": `${moneyText(r.variable)} (${r.expenses > 0 ? 100 - Math.round(r.fixedShare) : 0}%)`,
        "הכנסות פחות הוצאות": moneyText(r.incomeMinusExpenses),
        "נשאר בסוף החודש": moneyText(r.left),
        'יתרת עו"ש היום': moneyText(r.balanceToday),
        "חסכונות קיימים": moneyText(r.existingSavings),
        "יתרת הלוואות קיימות": moneyText(r.loanBalance),
        "שווי נקי (נכסים פחות התחייבויות)": moneyText(r.netWorth),
        "סטטוס": `${st.name} – ${st.text}`,
        "3 הקטגוריות הגדולות": r.top3.length
            ? r.top3.map((c) => `${c.label} ${moneyText(c.amount)}`).join(" | ")
            : "לא הוזנו הוצאות",
        "מקור הגעה": source.label,
        utm_source: source.utm_source,
        utm_medium: source.utm_medium,
        utm_campaign: source.utm_campaign
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "שולח...";

    try {
        const response = await fetch(LEAD_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("HTTP " + response.status);

        leadSent = true;
        // לאירועי המעקב לא מצורף שום נתון כספי
        track("generate_lead");
        leadForm.hidden = true;
        const success = document.getElementById("leadSuccess");
        success.hidden = false;
        success.focus();
    } catch (err) {
        formErr.textContent = "השליחה לא הצליחה. נא לבדוק את החיבור ולנסות שוב.";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "שלחו פרטים";
    }
});

// =====================================================================
// קישורים: וואטסאפ, טלפון, מדיניות פרטיות
// =====================================================================

const waBtn = document.getElementById("ctaWhatsapp");
const phoneBtn = document.getElementById("ctaPhone");

if (WHATSAPP_NUMBER) waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
else waBtn.hidden = true;

if (PHONE_NUMBER) phoneBtn.href = `tel:${PHONE_NUMBER}`;
else phoneBtn.hidden = true;

if (PRIVACY_POLICY_URL) {
    document.getElementById("privacyLinkWrap").innerHTML =
        `בהתאם ל<a href="${PRIVACY_POLICY_URL}" target="_blank" rel="noopener">מדיניות הפרטיות</a>`;
}

document.getElementById("year").textContent = new Date().getFullYear();

showStep(0, false);

