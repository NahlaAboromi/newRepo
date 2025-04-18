// Auto Exam Generation Logic (auto-exam.js)

document.addEventListener("DOMContentLoaded", function() {
    // Form elements
    const classCodeInput = document.getElementById("classCode");
    const classNameInput = document.getElementById("className");
    const subjectSelect = document.getElementById("subjectSelect");
    const difficultySelect = document.getElementById("difficultySelect");
    const autoRadio = document.querySelector('input[value="auto"]');
    const autoPreview = document.getElementById("autoPreview");
    const manualSection = document.getElementById("manualExam");
    const autoSection = document.getElementById("autoExam");
    const viewBtn = document.getElementById("viewFullExamBtn");
  
    // Function to validate required fields
    function validateRequiredFields() {
      // Check if all required fields are filled
      const classCode = classCodeInput.value.trim();
      const className = classNameInput.value.trim();
      const subject = subjectSelect.value;
      
      if (!classCode || !className || !subject) {
        // Show error message in English
        alert("Please fill in the Class Code, Class Name, and Subject fields before selecting an exam creation method.");
        
        // Uncheck the radio button
        autoRadio.checked = false;
        
        // Hide exam section if it was visible
        autoSection.classList.add("hidden");
        
        // Highlight empty fields
        if (!classCode) {
          classCodeInput.classList.add("border-red-500");
          classCodeInput.classList.add("bg-red-50");
          classCodeInput.classList.add("dark:bg-red-900");
        }
        
        if (!className) {
          classNameInput.classList.add("border-red-500");
          classNameInput.classList.add("bg-red-50");
          classNameInput.classList.add("dark:bg-red-900");
        }
        
        if (!subject) {
          subjectSelect.classList.add("border-red-500");
          subjectSelect.classList.add("bg-red-50");
          subjectSelect.classList.add("dark:bg-red-900");
        }
        
        return false;
      }
      
      // Remove any previous error highlighting
      classCodeInput.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
      classNameInput.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
      subjectSelect.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
      
      return true;
    }
  
    function showSuggestedExam() {
      if (!autoRadio.checked) return;
  
      const subject = subjectSelect.value;
      const difficulty = difficultySelect.value;
      if (!subject || !difficulty) return;
  
      fetch("all-exams.json")
        .then(res => res.json())
        .then(examData => {
          const exam = examData[subject]?.[difficulty];
          if (!exam) return;
  
          autoPreview.classList.remove("hidden");
          viewBtn.classList.remove("hidden");
  
          // Apply consistent button styling
          viewBtn.className = "mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700";
          
          viewBtn.onclick = () => showFullExam(exam);
        })
        .catch(err => console.error("Failed to load exam data:", err));
    }
  
    function showFullExam(exam) {
      let modalContent = `
        <div style="background-color: #1e293b; color: white; padding: 24px; border-radius: 12px; max-height: 80vh; overflow-y: auto;">
          <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 16px; border-bottom: 2px solid #334155;">${exam.title}</h2>
      `;
  
      exam.questions.forEach((q, i) => {
        modalContent += `
          <div style="margin-bottom: 20px; padding: 10px; background-color: #334155; border-radius: 8px;">
            <p style="font-weight: bold;">Question ${i + 1}: <span style="font-weight: normal;">${q.question}</span></p>
            <ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px;">
              ${q.options
                .map(opt => `<li style="color: ${opt === q.correctAnswer ? '#22c55e' : 'white'}; font-weight: ${opt === q.correctAnswer ? 'bold' : 'normal'}">${opt}</li>`)
                .join("")}
            </ul>
          </div>
        `;
      });
  
      // Changed to only show a Return button
      modalContent += `
        <div style="text-align: center; margin-top: 24px;">
          <button id="returnButton" style="background-color: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">Return</button>
        </div>
      </div>`;
  
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;
  
      const modalBox = document.createElement("div");
      modalBox.innerHTML = modalContent;
      modal.appendChild(modalBox);
      document.body.appendChild(modal);
  
      // Single button to close the modal
      document.getElementById("returnButton").onclick = () => {
        document.body.removeChild(modal);
      };
    }
  
    // Event listeners for suggestion trigger
    subjectSelect.addEventListener("change", showSuggestedExam);
    difficultySelect.addEventListener("change", showSuggestedExam);
  
    // Initialize event listener for auto exam creation
    autoRadio.addEventListener("change", () => {
      console.log("Auto radio clicked");
      if (!validateRequiredFields()) {
        return; // Stop if validation fails
      }
      
      console.log("Showing auto section");
      autoSection.classList.remove("hidden");
      manualSection.classList.add("hidden");
      showSuggestedExam();
    });
  });