importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

// Initialize Firebase in the service worker with the same config used in your app
const firebaseConfig = {
  apiKey: "AIzaSyChRLFYFw-0GrkIK3tWQZ1rIYWZViavN-s",
  authDomain: "communicationservices-94966.firebaseapp.com",
  projectId: "communicationservices-94966",
  storageBucket: "communicationservices-94966.firebasestorage.app",
  messagingSenderId: "731822565938",
  appId: "1:731822565938:web:e91c44adc7ed4290c86a2b",
  measurementId: "G-MJZCPFCY0Y"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  try {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);

    const link = payload.data?.url 

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/images/icon.png", // Use a valid icon
      data: link, // Add the URL to the notification data if it exists
    };


    // Ensure the notification is shown before continuing
     self.registration.showNotification(notificationTitle, notificationOptions);
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error handling background message:', error);
  }
});

// Listen for notification clicks
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received:', event);

  // Extract the URL stored in the notification's data property
  const urlToOpen = event.notification?.data || '/'; // Default to root if no URL
 

  // Close the notification after the click
  event.notification.close();

  // Open the URL in a new window/tab or focus if already open
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});