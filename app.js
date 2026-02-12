function generate() {

    const name = document.getElementById("name").value;
    const rawDate = document.getElementById("date").value;

    document.getElementById("pName").innerText = name || "---";

    if (rawDate) {
        const d = new Date(rawDate);
        document.getElementById("pDate").innerText =
            d.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
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

    document.getElementById("prAdd").innerText =
    document.getElementById("rAdd").value;

document.getElementById("plAdd").innerText =
    document.getElementById("lAdd").value;

}


async function downloadPDF() {

    // small delay ensures DOM updates
    await new Promise(resolve => setTimeout(resolve, 200));

    const element = document.getElementById("prescription");

    const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    const name =
        document.getElementById("pName").innerText.replace(/\s+/g, "_");

    const date =
        document.getElementById("pDate").innerText.replace(/[\s,]+/g, "_");

    pdf.save(`${name}_${date}.pdf`);
}

