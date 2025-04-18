// --- פונקציות טופס המלצה ---
export function openRecommendationForm(studentName) {
    const modal = document.getElementById("recommendationModal");
    document.getElementById("modalStudentName").textContent = studentName;
    document.getElementById("teacherName").value = "Dr. Sarah Johnson";
    document.getElementById("subjectField").value = "";
    modal.classList.remove("hidden");
  }
  
  export function closeRecommendationForm() {
    document.getElementById("recommendationModal").classList.add("hidden");
  }
  
  export function sendRecommendation() {
    const message = document.getElementById("recommendationMessage").value;
    const phone = document.getElementById("phone").value;
    if (message.trim() && phone.trim()) {
      alert("Recommendation sent:\n" + message + "\nContact: " + phone);
      closeRecommendationForm();
    } else {
      alert("Please fill in all fields before sending.");
    }
  }
  
  window.openRecommendationForm = openRecommendationForm;
  window.closeRecommendationForm = closeRecommendationForm;
  window.sendRecommendation = sendRecommendation;
  
  let studentReports = [];

  fetch('studentsFORREPORST.json')
    .then(res => res.json())
    .then(data => {
      studentReports = data;
      renderFeed();
    });
  
  const container = document.getElementById("studentFeed");
  const filter = document.getElementById("topicFilter");
  
  function renderFeed(topic = "All") {
    container.innerHTML = "";
    const filtered = topic === "All" ? studentReports : studentReports.filter(s => s.topic === topic);
  
    filtered.forEach((report, index) => {
      const canvasId = `chart-${index}`;
      const card = document.createElement("div");
      card.className = "p-4 bg-white rounded shadow";
      card.className = "p-4 bg-white dark:bg-slate-700 rounded shadow";

      card.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="user" class="w-5 h-5 text-blue-500"></i>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">${report.name}</h3>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">Topic: ${report.topic}</p>
        <canvas id="${canvasId}" class="w-full h-32 mb-4"></canvas>
        <button onclick="openRecommendationForm('${report.name}')" class="bg-orange-600 text-white py-1 px-3 rounded hover:bg-orange-700">Send Recommendation</button>
      `;
      
      container.appendChild(card);
      lucide.createIcons();
  
      new Chart(document.getElementById(canvasId).getContext("2d"), {
        type: "bar",
        data: {
          labels: Object.keys(report.scores),
          datasets: [{
            label: "Score",
            data: Object.values(report.scores),
            backgroundColor: "#3b82f6"
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    });
  }
  
  filter.addEventListener("change", () => renderFeed(filter.value));
  renderFeed();
  
 