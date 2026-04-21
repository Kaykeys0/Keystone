// Hardcoded login credentials
const USERNAME = "admin";
const PASSWORD = "1234";

let students = JSON.parse(localStorage.getItem("students")) || [];

const loginForm = document.getElementById("login-form");
const loginPage = document.getElementById("login-page");
const dashboard = document.getElementById("dashboard");
const reportTable = document.querySelector("#report-table tbody");
const classAverageEl = document.getElementById("class-average");
const marksForm = document.getElementById("marks-form");
const chartCanvas = document.getElementById("marksChart");
let marksChart;

// Login validation
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === USERNAME && password === PASSWORD) {
    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderReport();
  } else {
    document.getElementById("login-error").textContent = "Invalid credentials!";
  }
});

// Add student
marksForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("student-name").value;
  const subjects = Array.from(document.querySelectorAll("#subjects input")).map(i => Number(i.value));
  const total = subjects.reduce((a,b) => a+b, 0);
  const average = total / subjects.length;

  students.push({ name, subjects, total, average });
  localStorage.setItem("students", JSON.stringify(students));
  renderReport();
  marksForm.reset();
});

// Render report
function renderReport() {
  students.sort((a,b) => b.total - a.total);
  reportTable.innerHTML = "";
  students.forEach((s, i) => {
    const row = `<tr>
      <td>${i+1}</td>
      <td>${s.name}</td>
      <td>${s.total}</td>
      <td>${s.average.toFixed(2)}</td>
    </tr>`;
    reportTable.innerHTML += row;
  });

  const classAvg = students.reduce((a,b) => a+b.average, 0) / students.length || 0;
  classAverageEl.textContent = `Class Average: ${classAvg.toFixed(2)}`;

  renderChart();
}

// Chart.js visualization
function renderChart() {
  const labels = students.map(s => s.name);
  const data = students.map(s => s.total);

  if (marksChart) marksChart.destroy();
  marksChart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Total Marks',
        data,
        backgroundColor: '#007bff'
      }]
    }
  });
}

// Export PDF
document.getElementById("export-pdf").addEventListener("click", () => {
  window.print();
});

// Clear data
document.getElementById("clear-data").addEventListener("click", () => {
  localStorage.removeItem("students");
  students = [];
  renderReport();
});
