function generate() {

    const nameInput = document.getElementById("name").value;
    const rawDate = document.getElementById("date").value;

    document.getElementById("pName").innerText = nameInput || "---";

    if (rawDate) {
        const d = new Date(rawDate);
        document.getElementById("pDate").innerText =
            d.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    } else {
        document.getElementById("pDate").innerText = "---";
    }

    document.getElementById("prSphere").innerText =
        document.getElementById("rSphere").value;

    document.getElementById("plSphere").innerText =
        document.getElementById("lSphere").value;

    document.getElementById("prCyl").innerText =
        document.getElementById("rCyl").value;

    document.getElementById("plCyl").innerText =
        document.getElementById("lCyl").value;

    document.getElementById("prAxis").innerText =
        document.getElementById("rAxis").value;

    document.getElementById("plAxis").innerText =
        document.getElementById("lAxis").value;

    document.getElementById("prPd").innerText =
        document.getElementById("rPd").value;

    document.getElementById("plPd").innerText =
        document.getElementById("lPd").value;

    document.getElementById("pTestedBy").innerText =
        document.getElementById("testedBy").value;
}

function downloadPDF() {

    const original = document.getElementById("prescription");

    // Clone the report
    const clone = original.cloneNode(true);

    // Force white background
    clone.style.background = "white";
    clone.style.color = "black";
    clone.style.padding = "20px";

    // Add to body temporarily
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    const name =
        document.getElementById("pName").innerText.replace(/\s+/g, "_");

    const date =
        document.getElementById("pDate").innerText.replace(/[\s,]+/g, "_");

    const filename = `${name}_${date}.pdf`;

    const opt = {
        margin: 0.5,
        filename: filename,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clone).save().then(() => {
        document.body.removeChild(clone);
    });
}

