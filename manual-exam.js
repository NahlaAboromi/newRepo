// Manual Exam Creation Logic (manual-exam.js)

document.addEventListener("DOMContentLoaded", function() {
    // Form elements
    const classCodeInput = document.getElementById("classCode");
    const classNameInput = document.getElementById("className");
    const subjectSelect = document.getElementById("subjectSelect");
    const manualRadio = document.querySelector('input[value="manual"]');
    const manualSection = document.getElementById("manualExam");
    const autoSection = document.getElementById("autoExam"); // Add reference to autoSection
    const questionFields = document.getElementById("questionFields");
    const addQuestionBtn = document.getElementById("addQuestionBtn");
  
    // Total number of questions required
    const TOTAL_QUESTIONS = 10; 
    // Current question being edited
    let currentQuestionIndex = 0;
    // Store all questions
    let questions = Array(TOTAL_QUESTIONS).fill().map(() => ({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      tag: ''
    }));
  
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
        manualRadio.checked = false;
        
        // Hide exam section if it was visible
        manualSection.classList.add("hidden");
        
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
  
    // Function to validate the current question fields
    function validateCurrentQuestion() {
      const currentQ = questions[currentQuestionIndex];
      
      // Check if question text is filled
      if (!currentQ.question.trim()) {
        alert("Please enter the question text.");
        return false;
      }
      
      // Check if at least 2 options are filled
      let filledOptions = 0;
      for (let i = 0; i < currentQ.options.length; i++) {
        if (currentQ.options[i].trim()) {
          filledOptions++;
        }
      }
      
      if (filledOptions < 2) {
        alert("Please provide at least 2 options for the question.");
        return false;
      }
      
      // Check if correct answer is provided
      if (!currentQ.correctAnswer.trim()) {
        alert("Please specify the correct answer.");
        return false;
      }
      
      // Check if the correct answer matches one of the options
      if (!currentQ.options.some(opt => opt.trim() === currentQ.correctAnswer.trim())) {
        alert("The correct answer must match one of the provided options.");
        return false;
      }
      
      return true;
    }
  
    // Highlight input with error
    function highlightInputWithError(input) {
      input.classList.add("border-red-500", "bg-red-50", "dark:bg-red-900");
      
      // Remove highlighting when user starts typing
      input.addEventListener("input", function removeHighlight() {
        input.classList.remove("border-red-500", "bg-red-50", "dark:bg-red-900");
        input.removeEventListener("input", removeHighlight);
      }, { once: true });
    }
  
    // Function to render the current question form
    function renderCurrentQuestion() {
      // Get the current question data
      const currentQ = questions[currentQuestionIndex];
      
      // Clear the question fields
      questionFields.innerHTML = '';
      
      // Create the question form
      const formBlock = document.createElement("div");
      formBlock.className = "space-y-2";
      
      // Add progress indicator and navigation
      const progressDiv = document.createElement("div");
      progressDiv.className = "flex justify-between items-center mb-4 bg-slate-200 dark:bg-slate-600 p-3 rounded-lg";
      
      // Progress indicator
      const progressText = document.createElement("div");
      progressText.className = "font-bold text-lg";
      progressText.textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
      
      // Progress bar
      const progressBarContainer = document.createElement("div");
      progressBarContainer.className = "w-full bg-gray-300 dark:bg-gray-700 h-2 mx-4 rounded-full";
      
      const progressBar = document.createElement("div");
      progressBar.className = "bg-blue-600 h-2 rounded-full";
      progressBar.style.width = `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%`;
      
      progressBarContainer.appendChild(progressBar);
      
      // Navigation buttons
      const navButtons = document.createElement("div");
      navButtons.className = "flex space-x-2";
      
      const prevButton = document.createElement("button");
      prevButton.type = "button";
      prevButton.className = "bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 disabled:opacity-50";
      prevButton.textContent = "Previous";
      prevButton.disabled = currentQuestionIndex === 0;
      prevButton.onclick = navigateToPrevQuestion;
      
      const nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.className = "bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700";
      nextButton.textContent = currentQuestionIndex === TOTAL_QUESTIONS - 1 ? "Finish" : "Next";
      nextButton.onclick = navigateToNextQuestion;
      
      navButtons.appendChild(prevButton);
      navButtons.appendChild(nextButton);
      
      // Assemble progress div
      progressDiv.appendChild(progressText);
      progressDiv.appendChild(progressBarContainer);
      progressDiv.appendChild(navButtons);
      
      // Question text
      const questionLabel = document.createElement("label");
      questionLabel.className = "block font-medium";
      questionLabel.textContent = `Question text:`;
      
      const questionInput = document.createElement("input");
      questionInput.type = "text";
      questionInput.className = "w-full p-2 border rounded dark:bg-slate-700 dark:text-white";
      questionInput.placeholder = "Enter question text";
      questionInput.value = currentQ.question;
      questionInput.id = "question-text-input";
      questionInput.oninput = (e) => { 
        questions[currentQuestionIndex].question = e.target.value;
      };
      
      // Options
      const optionsDiv = document.createElement("div");
      optionsDiv.className = "space-y-2 mt-4";
      
      const optionsLabel = document.createElement("label");
      optionsLabel.className = "block font-medium";
      optionsLabel.textContent = "Options:";
      optionsDiv.appendChild(optionsLabel);
      
      for (let i = 0; i < 4; i++) {
        const optionInput = document.createElement("input");
        optionInput.type = "text";
        optionInput.className = "w-full p-2 border rounded dark:bg-slate-700 dark:text-white";
        optionInput.placeholder = `Option ${i + 1}`;
        optionInput.value = currentQ.options[i];
        optionInput.id = `option-${i}-input`;
        optionInput.oninput = (e) => {
          questions[currentQuestionIndex].options[i] = e.target.value;
        };
        optionsDiv.appendChild(optionInput);
      }
      
      // Correct answer
      const correctAnswerLabel = document.createElement("label");
      correctAnswerLabel.className = "block font-medium mt-4";
      correctAnswerLabel.textContent = "Correct answer:";
      
      const correctAnswerInput = document.createElement("input");
      correctAnswerInput.type = "text";
      correctAnswerInput.className = "w-full p-2 border rounded dark:bg-slate-700 dark:text-white";
      correctAnswerInput.placeholder = "Correct answer";
      correctAnswerInput.value = currentQ.correctAnswer;
      correctAnswerInput.id = "correct-answer-input";
      correctAnswerInput.oninput = (e) => {
        questions[currentQuestionIndex].correctAnswer = e.target.value;
      };
      
      // Tag
      const tagLabel = document.createElement("label");
      tagLabel.className = "block font-medium mt-4";
      tagLabel.textContent = "Tag / Topic:";
      
      const tagInput = document.createElement("input");
      tagInput.type = "text";
      tagInput.className = "w-full p-2 border rounded dark:bg-slate-700 dark:text-white";
      tagInput.placeholder = "Tag / Topic";
      tagInput.value = currentQ.tag;
      tagInput.id = "tag-input";
      tagInput.oninput = (e) => {
        questions[currentQuestionIndex].tag = e.target.value;
      };
      
      // Add all elements to the form block
      formBlock.appendChild(progressDiv);
      formBlock.appendChild(questionLabel);
      formBlock.appendChild(questionInput);
      formBlock.appendChild(optionsDiv);
      formBlock.appendChild(correctAnswerLabel);
      formBlock.appendChild(correctAnswerInput);
      formBlock.appendChild(tagLabel);
      formBlock.appendChild(tagInput);
      
      // Add review button if on the last question AND it has content
      if (currentQuestionIndex === TOTAL_QUESTIONS - 1) {
        // Only show the review message if the current question has been filled out
        const hasValidContent = currentQ.question.trim() && 
                              currentQ.options.filter(opt => opt.trim()).length >= 2 &&
                              currentQ.correctAnswer.trim() &&
                              currentQ.options.some(opt => opt.trim() === currentQ.correctAnswer.trim());
        
        if (hasValidContent) {
          const reviewDiv = document.createElement("div");
          reviewDiv.className = "mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg";
          reviewDiv.id = "reviewCompletionMessage";
          
          const reviewText = document.createElement("p");
          reviewText.className = "mb-2";
          reviewText.textContent = "You've completed all questions! Review your exam or submit it.";
          
          const reviewButton = document.createElement("button");
          reviewButton.type = "button";
          reviewButton.className = "bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700";
          reviewButton.textContent = "Review All Questions";
          reviewButton.onclick = showExamReview;
          
          reviewDiv.appendChild(reviewText);
          reviewDiv.appendChild(reviewButton);
          formBlock.appendChild(reviewDiv);
        }
      }
      
      // Add the form to the question fields
      questionFields.appendChild(formBlock);
    }
  
    // Navigation functions
    function navigateToPrevQuestion() {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderCurrentQuestion();
      }
    }
  
    function navigateToNextQuestion() {
      // Validate the current question before proceeding
      if (!validateCurrentQuestion()) {
        // Highlight the problem fields
        const currentQ = questions[currentQuestionIndex];
        
        if (!currentQ.question.trim()) {
          highlightInputWithError(document.getElementById("question-text-input"));
        }
        
        let hasOptions = false;
        for (let i = 0; i < currentQ.options.length; i++) {
          if (currentQ.options[i].trim()) {
            hasOptions = true;
          }
        }
        
        if (!hasOptions) {
          for (let i = 0; i < 2; i++) {
            highlightInputWithError(document.getElementById(`option-${i}-input`));
          }
        }
        
        if (!currentQ.correctAnswer.trim()) {
          highlightInputWithError(document.getElementById("correct-answer-input"));
        }
        
        return;
      }
      
      // Move to next question if not at the end
      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
      } else {
        // On the last question, show the review
        showExamReview();
      }
    }
  
    // Function to show a review of all questions
    function showExamReview() {
      // Create modal to show all questions for review
      let modalContent = `
        <div style="background-color: #1e293b; color: white; padding: 24px; border-radius: 12px; max-height: 80vh; overflow-y: auto;">
          <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 16px; border-bottom: 2px solid #334155;">Review Your Exam</h2>
      `;
  
      questions.forEach((q, i) => {
        modalContent += `
          <div style="margin-bottom: 20px; padding: 10px; background-color: ${q.question ? '#334155' : '#661c1c'}; border-radius: 8px;">
            <p style="font-weight: bold;">Question ${i + 1}: <span style="font-weight: normal;">${q.question || 'Not yet completed'}</span></p>
            ${q.question ? `
            <ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px;">
              ${q.options
                .filter(opt => opt.trim()) // Only show non-empty options
                .map(opt => {
                  // Show option with correct answer highlighting
                  return `<li style="color: ${opt === q.correctAnswer ? '#22c55e' : 'white'}; font-weight: ${opt === q.correctAnswer ? 'bold' : 'normal'}">${opt}</li>`;
                })
                .join("")}
            </ul>
            <p style="margin-top: 8px; font-style: italic;">Tag: ${q.tag || 'None'}</p>
            <button data-question="${i}" style="background-color: #3b82f6; color: white; padding: 4px 8px; border: none; border-radius: 4px; margin-top: 8px; cursor: pointer;" class="edit-question-btn">Edit</button>
            ` : `
            <button data-question="${i}" style="background-color: #3b82f6; color: white; padding: 4px 8px; border: none; border-radius: 4px; margin-top: 8px; cursor: pointer;" class="edit-question-btn">Complete This Question</button>
            `}
          </div>
        `;
      });
  
      modalContent += `
        <div style="text-align: right; margin-top: 24px;">
          <button id="submitExam" style="background-color: #22c55e; color: white; padding: 10px 20px; border: none; border-radius: 6px; margin-right: 10px; cursor: pointer;">Submit Exam</button>
          <button id="cancelReview" style="background-color: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">Continue Editing</button>
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
  
      modal.id = "reviewModal";
      const modalBox = document.createElement("div");
      modalBox.innerHTML = modalContent;
      modal.appendChild(modalBox);
      document.body.appendChild(modal);
  
      // Add event listeners to all edit buttons
      document.querySelectorAll('.edit-question-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const questionIdx = parseInt(btn.getAttribute('data-question'));
          currentQuestionIndex = questionIdx;
          document.body.removeChild(modal);
          renderCurrentQuestion();
        });
      });
  
      document.getElementById("submitExam").onclick = () => {
        // Check if all questions are completed
        const incomplete = questions.some(q => !q.question);
        if (incomplete) {
          alert("Please complete all questions before submitting.");
          return;
        }
        
        alert("Exam created successfully!");
        document.body.removeChild(modal);
      };
      
      document.getElementById("cancelReview").onclick = () => {
        document.body.removeChild(modal);
      };
    }
  
    // Initialize event listener for manual exam creation
    manualRadio.addEventListener("change", () => {
      console.log("Manual radio clicked");
      if (!validateRequiredFields()) {
        return; // Stop if validation fails
      }
      
      console.log("Showing manual section");
      manualSection.classList.remove("hidden");
      autoSection.classList.add("hidden");
      // Initialize question view
      currentQuestionIndex = 0;
      renderCurrentQuestion();
    });
  
    // If there's still an addQuestionBtn in the HTML, update its functionality
    if (addQuestionBtn) {
      addQuestionBtn.addEventListener("click", navigateToNextQuestion);
    }
  
    // Helper function to validate a single question object
    function validateQuestion(q) {
      if (!q.question.trim()) return false;
      
      let validOptions = 0;
      for (let i = 0; i < q.options.length; i++) {
        if (q.options[i].trim()) validOptions++;
      }
      
      if (validOptions < 2) return false;
      if (!q.correctAnswer.trim()) return false;
      if (!q.options.some(opt => opt.trim() === q.correctAnswer.trim())) return false;
      
      return true;
    }
    
    // Make certain functions accessible globally
    window.manualExam = {
      validateQuestion: validateQuestion,
      questions: questions
    };
  });