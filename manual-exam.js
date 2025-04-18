document.addEventListener('DOMContentLoaded', function () {
  const originalAlert = window.alert;
  window.alert = function (message) {
    if (typeof message === 'string' && message.includes('Please enter the question text')) {
      console.log('❌ Alert skipped:', message);
      return;
    }
    originalAlert(message);
  };
    
  let questions = [];
    
  const examRadios = document.querySelectorAll('input[name="examOption"]');
  const manualExam = document.getElementById('manualExam');
  const autoExam = document.getElementById('autoExam');
    
  examRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'manual') {
        manualExam.classList.remove('hidden');
        autoExam.classList.add('hidden');
      } else if (this.value === 'auto') {
        manualExam.classList.add('hidden');
        autoExam.classList.remove('hidden');
      }
    });
  });
    
  const modal = document.getElementById('examEditorModal');
  const openModalBtn = document.getElementById('openExamEditorBtn');
  const closeModals = document.querySelectorAll('.close-modal, .close-modal-btn');
  const saveExamBtn = document.getElementById('saveExamBtn');
    
  openModalBtn.addEventListener('click', function() {
    modal.style.display = 'block';
  });
    
  closeModals.forEach(btn => {
    btn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  });
    
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
    
  const addQuestionBtn = document.getElementById('addQuestionBtn');
  const questionsList = document.getElementById('questionsList');
  const emptyQuestionsList = document.getElementById('emptyQuestionsList');
  const modalQuestionCount = document.getElementById('modalQuestionCount');
  const questionCounter = document.getElementById('questionCounter');
  const noQuestionsMsg = document.getElementById('noQuestionsMsg');
  const questionsPreviewList = document.getElementById('questionsPreviewList');
    
  const confirmBtns = document.querySelectorAll('.modal-confirm-btn, button[type="submit"]');
  confirmBtns.forEach(btn => {
    btn.addEventListener('click', function(event) {
      const modalInput = this.closest('.modal')?.querySelector('input[type="text"]');
      if (modalInput && !modalInput.value.trim()) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'text-red-500 mt-2';
        errorMsg.textContent = 'Please enter question text';
        
        const existingError = modalInput.parentNode.querySelector('.text-red-500');
        if (existingError) {
          existingError.remove();
        }
        
        modalInput.parentNode.appendChild(errorMsg);
        
        event.preventDefault();
        return;
      }
    });
  });
  
  function removeErrorMessages() {
    const errorMessages = document.querySelectorAll('.text-red-500');
    errorMessages.forEach(msg => msg.remove());
  }
  
  function setupErrorClearingListeners() {
    document.querySelectorAll('.option-text').forEach(input => {
      input.addEventListener('input', function() {
        const allOptionsFilled = Array.from(document.querySelectorAll('.option-text'))
                                      .every(el => el.value.trim() !== '');
        if (allOptionsFilled) {
          removeErrorMessages();
        }
      });
    });
    
    document.getElementById('questionText').addEventListener('input', function() {
      if (this.value.trim() !== '') {
        removeErrorMessages();
      }
    });
  }
  
  setupErrorClearingListeners();
    
  addQuestionBtn.addEventListener('click', function() {
    const questionType = document.getElementById('questionType').value;
    const questionText = document.getElementById('questionText').value;
    
    removeErrorMessages();
    
    // Validate question text
    if (!questionText.trim()) {
      const questionForm = document.getElementById('questionForm');
      const errorMsg = document.createElement('div');
      errorMsg.className = 'text-red-500 mt-4 text-center';
      errorMsg.textContent = 'Please enter question text';
      questionForm.appendChild(errorMsg);
      return;
    }
    
    let question = {
      type: questionType,
      text: questionText
    };
    
    if (questionType === 'multiple-choice') {
      const options = Array.from(document.querySelectorAll('.option-text')).map(el => el.value);
      const correctOption = document.querySelector('input[name="correctOption"]:checked').value;
      
      if (options.some(opt => !opt.trim())) {
        const questionForm = document.getElementById('questionForm');
        
        const existingError = questionForm.querySelector('.text-red-500');
        if (!existingError) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'text-red-500 mt-4 text-center';
          errorMsg.textContent = 'Please fill in all answer options';
          questionForm.appendChild(errorMsg);
        }
        return;
      }
      
      question.options = options;
      question.correctOption = parseInt(correctOption);
    } else if (questionType === 'true-false') {
      question.answer = document.querySelector('input[name="trueFalseAnswer"]:checked').value === 'true';
    }
    
    if (questions.length >= 10) {
      const questionForm = document.getElementById('questionForm');
      
      const existingError = questionForm.querySelector('.text-red-500');
      if (!existingError) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'text-red-500 mt-4 text-center';
        errorMsg.textContent = 'Maximum number of questions (10) reached';
        questionForm.appendChild(errorMsg);
      }
      return;
    }
    
    questions.push(question);
    
    updateQuestionsDisplay();
    
    document.getElementById('questionText').value = '';
    document.querySelectorAll('.option-text').forEach(option => {
      option.value = '';
    });
    document.querySelector('input[name="correctOption"][value="0"]').checked = true;
    
    document.getElementById('questionText').focus();
  });
    
  function updateQuestionsDisplay() {
    modalQuestionCount.textContent = `${questions.length}/10`;
    questionCounter.textContent = `${questions.length}/10`;
    
    if (questions.length > 0) {
      emptyQuestionsList.classList.add('hidden');
      noQuestionsMsg.classList.add('hidden');
      questionsPreviewList.classList.remove('hidden');
    } else {
      emptyQuestionsList.classList.remove('hidden');
      noQuestionsMsg.classList.remove('hidden');
      questionsPreviewList.classList.add('hidden');
    }
    
    // Clear the questions list first
    questionsList.innerHTML = '';
    
    questionsList.appendChild(emptyQuestionsList);
    
    questions.forEach((q, index) => {
      const card = document.createElement('div');
      card.className = 'bg-slate-800 border border-slate-700 rounded-lg p-4 question-card mb-4';
      
      let typeLabel = '';
      switch(q.type) {
        case 'multiple-choice': typeLabel = 'Multiple Choice'; break;
        case 'true-false': typeLabel = 'True/False'; break;
      }
      
      const header = document.createElement('div');
      header.className = 'flex justify-between items-start mb-2';
      header.innerHTML = `
        <div class="flex items-center">
          <span class="font-medium text-white mr-2">Question ${index + 1} -</span>
          <span class="text-gray-300">${typeLabel}</span>
        </div>
        <button class="text-blue-400 hover:text-blue-300 transition-colors edit-question" data-index="${index}">Edit</button>
      `;
      card.appendChild(header);
      
      const questionTextEl = document.createElement('div');
      questionTextEl.className = 'mb-3 text-white';
      questionTextEl.textContent = q.text;
      card.appendChild(questionTextEl);
      
      // Create answer options section based on question type
      if (q.type === 'multiple-choice') {
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-3';
        
        q.options.forEach((option, optIndex) => {
          const optionEl = document.createElement('div');
          const isCorrect = optIndex === q.correctOption;
          
          if (isCorrect) {
            optionEl.className = 'p-3 rounded bg-green-800 border border-green-600 text-white flex items-center justify-between';
            optionEl.innerHTML = `
              <span>${String.fromCharCode(65 + optIndex)}. ${option}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            `;
          } else {
            optionEl.className = 'p-3 rounded bg-slate-700 border border-slate-600 text-gray-300';
            optionEl.textContent = `${String.fromCharCode(65 + optIndex)}. ${option}`;
          }
          
          optionsContainer.appendChild(optionEl);
        });
        
        card.appendChild(optionsContainer);
      } else if (q.type === 'true-false') {
        const tfContainer = document.createElement('div');
        tfContainer.className = 'grid grid-cols-2 gap-3';
        
        // False option
        const falseEl = document.createElement('div');
        if (!q.answer) {
          falseEl.className = 'p-3 rounded bg-green-800 border border-green-600 text-white flex items-center justify-between';
          falseEl.innerHTML = `
            <span>False</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          `;
        } else {
          falseEl.className = 'p-3 rounded bg-slate-700 border border-slate-600 text-gray-300';
          falseEl.textContent = 'False';
        }
        tfContainer.appendChild(falseEl);
        
        const trueEl = document.createElement('div');
        if (q.answer) {
          trueEl.className = 'p-3 rounded bg-green-800 border border-green-600 text-white flex items-center justify-between';
          trueEl.innerHTML = `
            <span>True</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          `;
        } else {
          trueEl.className = 'p-3 rounded bg-slate-700 border border-slate-600 text-gray-300';
          trueEl.textContent = 'True';
        }
        tfContainer.appendChild(trueEl);
        
        card.appendChild(tfContainer);
      }
      
      // Add the completed card to the list
      questionsList.appendChild(card);
    });
    
    updatePreviewList();
    
    document.querySelectorAll('.edit-question').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        editQuestion(index);
      });
    });
  }
    
  function updatePreviewList() {
    questionsPreviewList.innerHTML = '';
    
    if (questions.length === 0) {
      return;
    }
    
    questions.forEach((q, index) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'p-3 bg-slate-700 rounded-md mb-2 border border-slate-600';
      
      let typeLabel = '';
      switch(q.type) {
        case 'multiple-choice': typeLabel = 'Multiple Choice'; break;
        case 'true-false': typeLabel = 'True/False'; break;
      }
     
      let previewHtml = `
        <div class="flex justify-between">
          <span class="font-semibold text-white">Question ${index + 1}</span>
          <span class="text-sm text-gray-300">${typeLabel}</span>
        </div>
        <p class="text-sm text-white truncate">${q.text}</p>
      `;
  
      if (q.type === 'multiple-choice') {
        const correctOptionLetter = String.fromCharCode(65 + q.correctOption);
        const correctAnswer = q.options[q.correctOption];
        previewHtml += `
          <p class="text-xs text-green-400 mt-1">Answer: ${correctOptionLetter}. ${correctAnswer}</p>
        `;
      } else if (q.type === 'true-false') {
        previewHtml += `
          <p class="text-xs text-green-400 mt-1">Answer: ${q.answer ? 'True' : 'False'}</p>
        `;
      }
      
      previewItem.innerHTML = previewHtml;
      questionsPreviewList.appendChild(previewItem);
    });
  }
    
  function editQuestion(index) {
    const question = questions[index];
    
    document.getElementById('questionType').value = question.type;
    document.getElementById('questionText').value = question.text;
    
    document.getElementById('multipleChoiceOptions').classList.add('hidden');
    document.getElementById('trueFalseOptions').classList.add('hidden');
    
    if (question.type === 'multiple-choice') {
      document.getElementById('multipleChoiceOptions').classList.remove('hidden');
      
      const optionInputs = document.querySelectorAll('.option-text');
      question.options.forEach((opt, i) => {
        if (i < optionInputs.length) {
          optionInputs[i].value = opt;
        }
      });
      
      document.querySelector(`input[name="correctOption"][value="${question.correctOption}"]`).checked = true;
    } else if (question.type === 'true-false') {
      document.getElementById('trueFalseOptions').classList.remove('hidden');
      
      document.querySelector(`input[name="trueFalseAnswer"][value="${question.answer}"]`).checked = true;
    }
    
    
    removeErrorMessages();
    
    addQuestionBtn.textContent = 'Update Question';
    addQuestionBtn.dataset.mode = 'edit';
    addQuestionBtn.dataset.index = index;
    
    document.getElementById('questionForm').scrollIntoView({ behavior: 'smooth' });
  }
    
  document.getElementById('questionType').addEventListener('change', function() {
    document.getElementById('multipleChoiceOptions').classList.add('hidden');
    document.getElementById('trueFalseOptions').classList.add('hidden');
    
    if (this.value === 'multiple-choice') {
      document.getElementById('multipleChoiceOptions').classList.remove('hidden');
      setupErrorClearingListeners();
    } else if (this.value === 'true-false') {
      document.getElementById('trueFalseOptions').classList.remove('hidden');
    }
    
    // Clear errors when changing question type
    removeErrorMessages();
  });
    
  saveExamBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50';
    notification.textContent = 'Exam questions have been saved successfully!';
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});