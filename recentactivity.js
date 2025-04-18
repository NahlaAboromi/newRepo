// פונקציה להצגת נתוני Recent Activity
async function loadRecentActivity() {
    try {
      // קריאת קובץ ה-JSON
      const response = await fetch('recentActivityLECTURERFAKEData.json');
      const data = await response.json();
      
      const recentActivities = data.recentActivity || [];
      const activityContainer = document.getElementById('recent-activity-container');
      
      // נקה את התוכן הקיים
      activityContainer.innerHTML = '';
      
      // אם אין פעילויות
      if (recentActivities.length === 0) {
        activityContainer.innerHTML = '<div class="p-4 text-center text-gray-500 dark:text-gray-400">No recent activity</div>';
        return;
      }
      
      // מיפוי סוגי האייקונים
      const iconMapping = {
        'success': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>`,
        'exam': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
                  </svg>`,
        'message': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>`,
        'schedule': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>`
      };
      
      // מיפוי צבעי רקע
      const bgColorMapping = {
        'success': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
        'exam': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
        'message': 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
        'schedule': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
      };
      
      // הצג כל פעילות
      recentActivities.forEach((activity, index) => {
        const isLastItem = index === recentActivities.length - 1;
        const borderClass = isLastItem ? '' : 'border-b border-gray-200 dark:border-gray-600';
        
        const activityHTML = `
          <div class="p-4 ${borderClass} flex items-center gap-3">
            <div class="p-2 ${bgColorMapping[activity.type] || 'bg-gray-100 text-gray-600'} rounded-full flex-shrink-0">
              ${iconMapping[activity.type] || ''}
            </div>
            <div>
              <p class="font-medium">${activity.message}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">${activity.time}</p>
            </div>
          </div>
        `;
        
        activityContainer.innerHTML += activityHTML;
      });
      
    } catch (error) {
      console.error('Error loading recent activity data:', error);
      document.getElementById('recent-activity-container').innerHTML = '<div class="p-4 text-center text-red-500">Failed to load recent activity data</div>';
    }
  }
  
  // טען את נתוני הפעילות האחרונה כאשר העמוד נטען
  document.addEventListener('DOMContentLoaded', loadRecentActivity);