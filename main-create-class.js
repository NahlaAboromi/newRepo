
document.addEventListener("DOMContentLoaded", function() {
    // Form elements
    const classCodeInput = document.getElementById("classCode");
    const classNameInput = document.getElementById("className");
    const subjectSelect = document.getElementById("subjectSelect");
    const autoSection = document.getElementById("autoExam");
    const manualSection = document.getElementById("manualExam");
    const themeBtn = document.getElementById("btnTheme");
    const autoRadio = document.querySelector('input[value="auto"]');
    const manualRadio = document.querySelector('input[value="manual"]');
    const classForm = document.getElementById("classForm");
  
    // Remove highlighting when user starts typing
    classCodeInput.addEventListener("input", () => {
      classCodeInput.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
    });
  
    classNameInput.addEventListener("input", () => {
      classNameInput.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
    });
  
    subjectSelect.addEventListener("change", () => {
      subjectSelect.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
    });
  
  
    // Function to reset the form
    function resetForm() {
      // Reset form fields
      classForm.reset();
      
      // Hide both exam sections
      manualSection.classList.add("hidden");
      autoSection.classList.add("hidden");
      
      // Uncheck radio buttons
      manualRadio.checked = false;
      autoRadio.checked = false;
      
      // Clear any error highlighting
      classCodeInput.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
      classNameInput.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
      subjectSelect.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
      
      // Hide auto preview if visible
      const autoPreview = document.getElementById("autoPreview");
      if (autoPreview) {
        autoPreview.classList.add("hidden");
      }
      
      // Hide view button if visible
      const viewBtn = document.getElementById("viewFullExamBtn");
      if (viewBtn) {
        viewBtn.classList.add("hidden");
      }
      
      // Reset questions data if in manual mode
      if (window.manualExam && window.manualExam.questions) {
        window.manualExam.questions = Array(10).fill().map(() => ({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          tag: ''
        }));
      }
      
      // Clear question fields if they exist
      const questionFields = document.getElementById("questionFields");
      if (questionFields) {
        questionFields.innerHTML = '';
      }
    }
  
    // Form submission
    classForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Check if all required fields are filled in
      const classCode = classCodeInput.value.trim();
      const className = classNameInput.value.trim();
      const subject = subjectSelect.value;
      
      // Check if either exam option is selected
      const examOptionSelected = manualRadio.checked || autoRadio.checked;
      
      // Validate all fields
      if (!classCode || !className || !subject || !examOptionSelected) {
        // Show appropriate error message
        if (!examOptionSelected) {
          alert("Please select an exam creation method (manual or automatic).");
        } else {
          alert("Please fill in all required fields before creating the class.");
        }
        
        // Highlight empty fields
        if (!classCode) {
          classCodeInput.classList.add("border-red-500", "bg-red-50", "dark:bg-red-900");
        }
        
        if (!className) {
          classNameInput.classList.add("border-red-500", "bg-red-50", "dark:bg-red-900");
        }
        
        if (!subject) {
          subjectSelect.classList.add("border-red-500", "bg-red-50", "dark:bg-red-900");
        }
        
        return; // Stop form submission
      }
      
      // Additional validation for manual exam
      if (manualRadio.checked) {
        // Check if all questions are filled out (if manual mode is selected)
        if (window.manualExam && window.manualExam.validateQuestion && window.manualExam.questions) {
          const incomplete = window.manualExam.questions.some(q => !window.manualExam.validateQuestion(q));
          if (incomplete) {
            alert("Please complete all exam questions before creating the class.");
            return; // 
          }
        }
      }
      
      // For auto exam mode, check if a difficulty is selected
      if (autoRadio.checked) {
        const difficultySelect = document.getElementById("difficultySelect");
        const difficulty = difficultySelect.value;
        if (!difficulty) {
          alert("Please select a difficulty level for the auto-generated exam.");
          return; // Stop form submission
        }
      }
      
      // If we get here, all validations have passed
      alert("Class created successfully!");
      
      // Reset the form after successful submission
      resetForm();
    });
  });