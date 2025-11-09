// ==================== EYEkart Optics Report Generator ====================

let patients = [];
let currentPatient = null;

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("rxDate").value = today;

  loadSamplePatient();

  document.getElementById("prescriptionForm").addEventListener("submit", handleFormSubmit);
  document.getElementById("clearBtn").addEventListener("click", clearForm);
  document.getElementById("backBtn").addEventListener("click", backToForm);
  document.getElementById("printBtn").addEventListener("click", printReport);
  document.getElementById("downloadBtn").addEventListener("click", downloadPDF);

  renderPatientHistory();
});

// -------------------- Sample Patient --------------------
function loadSamplePatient() {
  const sample = {
    id: Date.now(),
    name: "John Doe",
    dob: "1990-05-15",
    rxDate: "2025-11-07",
    contact: "",
    od: { sph: "-1.50", cyl: "-0.75", axis: "180", add: "1.00", pd: "32" },
    os: { sph: "-1.25", cyl: "-0.50", axis: "175", add: "1.00", pd: "32" },
    createdAt: new Date().toISOString(),
  };
  patients.push(sample);
  renderPatientHistory();
}

// -------------------- Form Handling --------------------
function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const p = {
    id: currentPatient ? currentPatient.id : Date.now(),
    name: document.getElementById("patientName").value,
    dob: document.getElementById("dob").value,
    rxDate: document.getElementById("rxDate").value,
    contact: document.getElementById("contactNumber").value,
    od: {
      sph: document.getElementById("odSph").value || "0.00",
      cyl: document.getElementById("odCyl").value || "0.00",
      axis: document.getElementById("odAxis").value || "0",
      add: document.getElementById("odAdd").value || "0.00",
      pd: document.getElementById("odPd").value || "0",
    },
    os: {
      sph: document.getElementById("osSph").value || "0.00",
      cyl: document.getElementById("osCyl").value || "0.00",
      axis: document.getElementById("osAxis").value || "0",
      add: document.getElementById("osAdd").value || "0.00",
      pd: document.getElementById("osPd").value || "0",
    },
    createdAt: currentPatient ? currentPatient.createdAt : new Date().toISOString(),
  };

  savePatient(p);
  generateReport(p);
  alert("✅ Report generated successfully!");
}

// -------------------- Validation --------------------
function validateForm() {
  const name = document.getElementById("patientName").value.trim();
  const dob = document.getElementById("dob").value;
  const rxDate = document.getElementById("rxDate").value;
  const odAxis = document.getElementById("odAxis").value;
  const osAxis = document.getElementById("osAxis").value;

  if (!name) return alert("Please enter patient name");
  if (!dob) return alert("Please enter date of birth");
  if (!rxDate) return alert("Please enter Rx date");
  if (odAxis && (odAxis < 0 || odAxis > 180)) return alert("OD Axis must be between 0 and 180");
  if (osAxis && (osAxis < 0 || osAxis > 180)) return alert("OS Axis must be between 0 and 180");
  return true;
}

// -------------------- Report Generation --------------------
function savePatient(data) {
  const i = patients.findIndex((p) => p.id === data.id);
  if (i !== -1) patients[i] = data;
  else patients.push(data);
  renderPatientHistory();
}

function generateReport(d) {
  document.getElementById("reportPatientName").textContent = d.name;
  document.getElementById("reportDob").textContent = formatDate(d.dob);
  document.getElementById("reportRxDate").textContent = formatDate(d.rxDate);
  document.getElementById("reportContact").textContent = d.contact || "N/A";

  document.getElementById("reportOdSph").textContent = formatValue(d.od.sph);
  document.getElementById("reportOdCyl").textContent = formatValue(d.od.cyl);
  document.getElementById("reportOdAxis").textContent = d.od.axis;
  document.getElementById("reportOdAdd").textContent = formatValue(d.od.add);
  document.getElementById("reportOdPd").textContent = d.od.pd;

  document.getElementById("reportOsSph").textContent = formatValue(d.os.sph);
  document.getElementById("reportOsCyl").textContent = formatValue(d.os.cyl);
  document.getElementById("reportOsAxis").textContent = d.os.axis;
  document.getElementById("reportOsAdd").textContent = formatValue(d.os.add);
  document.getElementById("reportOsPd").textContent = d.os.pd;

  document.getElementById("formSection").classList.add("hidden");
  document.querySelector(".history-section").classList.add("hidden");
  document.getElementById("reportPreview").classList.add("active");
  window.scrollTo(0, 0);
}

function formatValue(v) {
  const n = parseFloat(v);
  if (isNaN(n) || n === 0) return "0.00";
  return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
}

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// -------------------- Buttons --------------------
function clearForm() {
  document.getElementById("prescriptionForm").reset();
  document.getElementById("rxDate").value = new Date().toISOString().split("T")[0];
  currentPatient = null;
}

function backToForm() {
  document.getElementById("formSection").classList.remove("hidden");
  document.querySelector(".history-section").classList.remove("hidden");
  document.getElementById("reportPreview").classList.remove("active");
}

function printReport() {
  window.print();
}

// ✅ FINAL FIXED PDF DOWNLOAD FUNCTION
async function downloadPDF() {
  try {
    const element = document.getElementById("reportContent");
    if (!element) {
      alert("⚠️ Report content not found!");
      return;
    }

    // Delay to ensure logo + fonts fully render
    await new Promise((r) => setTimeout(r, 800));

    const name = document.getElementById("reportPatientName").textContent || "Patient";
    const date = document.getElementById("reportRxDate").textContent || "Report";
    const cleanName = name.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_");
    const cleanDate = date.replace(/[^0-9A-Za-z]/g, "_");
    const filename = `EYEkart_${cleanName}_${cleanDate}.pdf`;

    // Convert external logo to base64 (fixes CORS issues)
    const logo = document.querySelector(".report-logo-small");
    if (logo && logo.src.startsWith("http")) {
      const blob = await fetch(logo.src).then((res) => res.blob());
      const reader = new FileReader();
      const base64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      logo.src = base64;
    }

    const opt = {
      margin: 0.4,
      filename: filename,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.scrollWidth,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(element).save();
    alert("✅ PDF downloaded successfully!");
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("⚠️ Failed to generate PDF. Check console for details.");
  }
}

// -------------------- Patient History --------------------
function renderPatientHistory() {
  const c = document.getElementById("patientHistoryContainer");
  if (patients.length === 0) {
    c.innerHTML = '<div class="empty-state">No patients saved yet</div>';
    return;
  }

  const sorted = [...patients].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  c.innerHTML = `
    <ul class="patient-history-list">
      ${sorted
        .map(
          (p) => `
          <li class="patient-item">
            <div class="patient-name">${p.name}</div>
            <div class="patient-date">Rx: ${formatDate(p.rxDate)}</div>
            <div class="patient-actions">
              <button class="btn btn-primary btn-small" onclick="loadPatient(${p.id})">View</button>
              <button class="btn btn-secondary btn-small" onclick="deletePatient(${p.id})">Delete</button>
            </div>
          </li>`
        )
        .join("")}
    </ul>`;
}

function loadPatient(id) {
  const p = patients.find((x) => x.id === id);
  if (!p) return;
  currentPatient = p;

  document.getElementById("patientName").value = p.name;
  document.getElementById("dob").value = p.dob;
  document.getElementById("rxDate").value = p.rxDate;
  document.getElementById("contactNumber").value = p.contact || "";

  document.getElementById("odSph").value = p.od.sph;
  document.getElementById("odCyl").value = p.od.cyl;
  document.getElementById("odAxis").value = p.od.axis;
  document.getElementById("odAdd").value = p.od.add;
  document.getElementById("odPd").value = p.od.pd;

  document.getElementById("osSph").value = p.os.sph;
  document.getElementById("osCyl").value = p.os.cyl;
  document.getElementById("osAxis").value = p.os.axis;
  document.getElementById("osAdd").value = p.os.add;
  document.getElementById("osPd").value = p.os.pd;

  alert(`✅ Loaded patient: ${p.name}`);
}

function deletePatient(id) {
  if (!confirm("Are you sure you want to delete this record?")) return;
  patients = patients.filter((p) => p.id !== id);
  renderPatientHistory();
  alert("🗑️ Patient deleted successfully!");
}
