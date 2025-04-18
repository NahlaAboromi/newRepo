// פונקציה להצגת התראות
async function loadNotifications() {
    try {
      const response = await fetch('fakeNotificationsLECTURER.json');
      const data = await response.json();
      
      const notifications = data.notifications || [];
      const notificationCount = notifications.length;
      
      // עדכון מספר ההתראות
      document.getElementById('notification-count').textContent = notificationCount;
      document.getElementById('notifications-header').textContent = `Notifications (${notificationCount})`;
      
      const container = document.getElementById('notifications-container');
      container.innerHTML = '';
      
      // אם אין התראות
      if (notifications.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-gray-500">No notifications</div>';
        return;
      }
      
      // מיפוי האייקונים לפי סוג
      const iconMapping = {
        'success': { 
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>`,
          bg: 'bg-green-100 text-green-500'
        },
        'exam': { 
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
                </svg>`,
          bg: 'bg-blue-100 text-blue-500'
        },
        'message': { 
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>`,
          bg: 'bg-purple-100 text-purple-500'
        }
      };
      
      // הצג את כל ההתראות
      notifications.forEach(notification => {
        const { type, title, time } = notification;
        const iconInfo = iconMapping[type] || { icon: '', bg: 'bg-gray-100 text-gray-500' };
        
        const notificationHTML = `
          <div class="px-4 py-3 border-b border-gray-100 bg-blue-50 hover:bg-gray-50 transition-colors flex items-start gap-3">
            <div class="flex-shrink-0 mt-1 w-8 h-8 ${iconInfo.bg} rounded-full flex items-center justify-center">
              ${iconInfo.icon}
            </div>
            <div class="flex-1">
              <p class="text-sm"><span class="font-bold">${type.charAt(0).toUpperCase() + type.slice(1)}:</span> ${title}</p>
              <p class="text-xs text-gray-500 mt-1">${time}</p>
            </div>
            <span class="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
          </div>
        `;
        
        container.innerHTML += notificationHTML;
      });
      
    } catch (error) {
      console.error('Error loading notifications:', error);
      document.getElementById('notifications-container').innerHTML = '<div class="p-4 text-center text-red-500">Failed to load notifications</div>';
    }
  }
  
  // טען התראות כאשר העמוד נטען
  document.addEventListener('DOMContentLoaded', loadNotifications);