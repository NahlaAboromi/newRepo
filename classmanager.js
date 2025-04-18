document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('class-card-template').style.display = 'none';
    document.getElementById('subject-tag-template').style.display = 'none';
  
    fetch('ClassesData.json')
      .then(response => response.json())
      .then(data => {
        document.getElementById('loading-indicator').remove();
        renderClasses(data.classes);
        
      
      })
      .catch(error => {
        console.error('Error loading class data:', error);
        document.getElementById('classes-container').innerHTML = `
          <div class="bg-white dark:bg-slate-700 p-5 rounded text-center">
            <p class="text-red-500">Error loading class data. Please try again later.</p>
          </div>
        `;
      });
  });
  
  function renderClasses(classes) {
    const container = document.getElementById('classes-container');
    while (container.firstChild) {
      if (container.firstChild.tagName !== 'TEMPLATE') {
        container.removeChild(container.firstChild);
      } else {
        break;
      }
    }
  
    if (classes.length === 0) {
      const noClassesMessage = document.createElement('div');
      noClassesMessage.className = 'bg-white dark:bg-slate-700 p-5 rounded text-center col-span-full';
      noClassesMessage.innerHTML = '<p>No classes found.</p>';
      container.appendChild(noClassesMessage);
      return;
    }
  
    const classTemplate = document.getElementById('class-card-template');
    const subjectTagTemplate = document.getElementById('subject-tag-template');
  
    classes.forEach(classData => {
      const classCard = classTemplate.content.cloneNode(true);
      const card = classCard.querySelector('.class-card');
  
      card.dataset.id = classData.id;
      classCard.querySelector('.class-title').textContent = `${classData.id}: ${classData.name}`;
      classCard.querySelector('.class-date').textContent = `Created: ${formatDate(classData.createdDate)}`;
      classCard.querySelector('.class-status').textContent = classData.status;
      classCard.querySelector('.class-student-count').textContent = `${classData.students.total} Students`;
  
      const subjectContainer = classCard.querySelector('.subject-tags-container');
      classData.subjects.forEach(subject => {
        const subjectTag = subjectTagTemplate.content.cloneNode(true);
        const tagElement = subjectTag.querySelector('.subject-tag');
        tagElement.textContent = subject;
  
        const color = getSubjectColor(subject);
        tagElement.classList.add(
          `bg-${color}-100`, 
          `text-${color}-800`,
          `dark:bg-${color}-800`,
          `dark:text-${color}-100`
        );
  
        subjectContainer.appendChild(tagElement);
      });
  
      const completionPercent = Math.round((classData.students.completed / classData.students.total) * 100);
      classCard.querySelector('.completion-count').textContent = `${classData.students.completed}/${classData.students.total}`;
      classCard.querySelector('.completion-bar').style.width = `${completionPercent}%`;
  
      classCard.querySelector('.exam-average').textContent = `${classData.examAverage}%`;
      const averageBar = classCard.querySelector('.exam-average-bar');
      averageBar.style.width = `${classData.examAverage}%`;
      averageBar.classList.add(`bg-${getGradeColor(classData.examAverage)}-500`);
      

      container.appendChild(classCard);
    });
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  function getSubjectColor(subject) {
    const colors = {
      'Mathematics': 'orange',
      'Physics': 'purple',
      'Computer Science': 'blue',
      
    };
    return colors[subject] || 'gray';
  }
  
  function getGradeColor(grade) {
    if (grade >= 80) return 'green';
    if (grade >= 70) return 'blue';
    if (grade >= 60) return 'yellow';
    return 'red';
  }
  