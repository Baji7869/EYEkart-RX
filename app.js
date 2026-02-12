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

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const name = document.getElementById("pName").innerText;
    const date = document.getElementById("pDate").innerText;

    const rSphere = document.getElementById("prSphere").innerText;
    const lSphere = document.getElementById("plSphere").innerText;

    const rCyl = document.getElementById("prCyl").innerText;
    const lCyl = document.getElementById("plCyl").innerText;

    const rAxis = document.getElementById("prAxis").innerText;
    const lAxis = document.getElementById("plAxis").innerText;

    const rPd = document.getElementById("prPd").innerText;
    const lPd = document.getElementById("plPd").innerText;

    const testedBy = document.getElementById("pTestedBy").innerText;

    // Header
    doc.setFontSize(18);
    doc.text("Sarkar Eye Camps and Optics", 20, 20);

    doc.setFontSize(14);
    doc.text("Eye Test Prescription", 20, 30);

    // Name + Date
    doc.setFontSize(12);
    doc.text(`Patient Name: ${name}`, 20, 45);
    doc.text(`Date: ${date}`, 20, 55);

    // Table Data
    doc.text("Right Eye        Left Eye", 20, 75);

    doc.text(`Spherical:   ${rSphere}            ${lSphere}`, 20, 90);
    doc.text(`Cylinder:    ${rCyl}            ${lCyl}`, 20, 100);
    doc.text(`Axis:        ${rAxis}            ${lAxis}`, 20, 110);
    doc.text(`PD:          ${rPd}            ${lPd}`, 20, 120);

    doc.text(`Tested By: ${testedBy}`, 20, 140);

    const fileName =
        name.replace(/\s+/g, "_") + "_" +
        date.replace(/[\s,]+/g, "_") + ".pdf";

    doc.save(fileName);
}
