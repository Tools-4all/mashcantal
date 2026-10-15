// מרכז המחשבונים: מחשבון ריבית קבועה + מחשבון ריבית קבועה צמודה
// שני המחשבונים משתמשים באותה סימולציה ובאותו גרף – ההבדל היחיד הוא ההצמדה למדד.

document.getElementById("year").textContent = new Date().getFullYear();

const BLUE = "#365db4";   // קרן
const BLACK = "#111827";  // ריבית

Chart.defaults.font.family = "Heebo, sans-serif";
Chart.defaults.color = "#374151";

const num = (id, fallback = 0) => {
    const v = parseFloat(document.getElementById(id).value);
    return Number.isFinite(v) ? v : fallback;
};
const ils = (v) => "₪" + Math.round(v).toLocaleString("he-IL");
const setText = (id, text) => { document.getElementById(id).textContent = text; };

// החזר חודשי בשיטת שפיצר
function spitzer(principal, monthlyRate, months) {
    if (months <= 0) return 0;
    if (monthlyRate === 0) return principal / months;
    const f = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * f) / (f - 1);
}

// סימולציה חודשית של הלוואה בשפיצר, עם הצמדה אופציונלית למדד.
// מחזירה את ההחזר הראשון והאחרון, סכומים כוללים, ולכל שנה – ממוצע חודשי של קרן ושל ריבית.
function simulate(principal, years, annualRatePct, annualInflationPct = 0) {
    const months = years * 12;
    const monthlyRate = annualRatePct / 100 / 12;
    const monthlyInflation = Math.pow(1 + annualInflationPct / 100, 1 / 12) - 1;

    let balance = principal;
    const result = { first: 0, last: 0, total: 0, interest: 0, labels: [], principalByYear: [], interestByYear: [] };
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= months; m++) {
        balance *= 1 + monthlyInflation;
        const payment = spitzer(balance, monthlyRate, months - m + 1);
        const interest = balance * monthlyRate;
        const principalPart = payment - interest;
        balance -= principalPart;

        if (m === 1) result.first = payment;
        result.last = payment;
        result.total += payment;
        result.interest += interest;
        yearPrincipal += principalPart;
        yearInterest += interest;

        if (m % 12 === 0) {
            result.labels.push(`שנה ${m / 12}`);
            result.principalByYear.push(Math.round(yearPrincipal / 12));
            result.interestByYear.push(Math.round(yearInterest / 12));
            yearPrincipal = 0;
            yearInterest = 0;
        }
    }
    return result;
}

// גרף עמודות מוערם: ההחזר החודשי הממוצע בכל שנה, מחולק לקרן (כחול) ולריבית (שחור)
const charts = {};

function drawChart(canvasId, r) {
    const existing = charts[canvasId];
    if (existing) {
        existing.data.labels = r.labels;
        existing.data.datasets[0].data = r.principalByYear;
        existing.data.datasets[1].data = r.interestByYear;
        existing.update();
        return;
    }
    charts[canvasId] = new Chart(document.getElementById(canvasId), {
        type: "bar",
        data: {
            labels: r.labels,
            datasets: [
                { label: "קרן", data: r.principalByYear, backgroundColor: BLUE, borderRadius: 2 },
                { label: "ריבית", data: r.interestByYear, backgroundColor: BLACK, borderRadius: 2 },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { position: "bottom", rtl: true },
                tooltip: {
                    rtl: true,
                    callbacks: {
                        label: (c) => `${c.dataset.label}: ${ils(c.parsed.y)}`,
                        footer: (items) => `החזר חודשי: ${ils(items.reduce((sum, i) => sum + i.parsed.y, 0))}`,
                    },
                },
            },
            scales: {
                x: { stacked: true, reverse: true, grid: { display: false } },
                y: { stacked: true, position: "right", ticks: { callback: (v) => ils(v) } },
            },
        },
    });
}

// ---------- 1. מחשבון ריבית קבועה ----------
function calcGeneralMortgage() {
    const years = parseInt(document.getElementById("genYears").value, 10) || 25;
    setText("genYearsDisplay", years);

    const r = simulate(Math.max(num("genAmount"), 0), years, Math.max(num("genRate"), 0));
    setText("genMonthly", ils(r.first));
    setText("genInterest", ils(r.interest));
    setText("genTotal", ils(r.total));
    drawChart("genChart", r);
}

// ---------- 2. מחשבון ריבית קבועה צמודה ----------
function calcCpiMortgage() {
    const years = parseInt(document.getElementById("cpiYears").value, 10) || 20;
    setText("cpiYearsDisplay", years);

    const r = simulate(Math.max(num("cpiAmount"), 0), years, Math.max(num("cpiRate"), 0), num("cpiInflation"));
    setText("cpiFirst", ils(r.first));
    setText("cpiLast", ils(r.last));
    setText("cpiTotal", ils(r.total));
    drawChart("cpiChart", r);
}

// ---------- בחירת מחשבון (לשוניות) ----------
const panels = { general: "calcGeneral", cpi: "calcCpi" };

function switchCalculator(type) {
    if (!panels[type]) type = "general";
    document.querySelectorAll(".calc-tab").forEach((tab) => {
        const active = tab.dataset.calc === type;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
    });
    Object.entries(panels).forEach(([key, id]) => {
        document.getElementById(id).hidden = key !== type;
    });
    if (type === "general") calcGeneralMortgage();
    else calcCpiMortgage();
}

document.querySelectorAll(".calc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        switchCalculator(tab.dataset.calc);
        history.replaceState(null, "", "#" + tab.dataset.calc);
    });
});

// ---------- חיבור השדות ----------
["genAmount", "genYears", "genRate"].forEach((id) =>
    document.getElementById(id).addEventListener("input", calcGeneralMortgage));
["cpiAmount", "cpiYears", "cpiRate", "cpiInflation"].forEach((id) =>
    document.getElementById(id).addEventListener("input", calcCpiMortgage));

// הפעלה ראשונית – לפי הקישור (#general / #cpi), וגם כשהקישור משתנה בלי טעינה מחדש
const fromHash = () => switchCalculator(location.hash.replace("#", "") || "general");
window.addEventListener("hashchange", fromHash);
fromHash();
