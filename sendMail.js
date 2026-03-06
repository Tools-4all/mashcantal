
const form = document.getElementById("contact-form");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const data = new FormData(form);

    const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {

        if (document.getElementById("contactTitle")) {
            document.getElementById("contactTitle").remove();
        }

        form.innerHTML = `
<div class="form-success">

<svg viewBox="0 0 52 52" class="checkmark">
<circle cx="26" cy="26" r="25" fill="none" stroke="#e5e7eb"/>
<path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
</svg>

<h2>הפרטים נשלחו בהצלחה</h2>
<p>נחזור אליכם בהקדם האפשרי.</p>

</div>
`;

    }

});