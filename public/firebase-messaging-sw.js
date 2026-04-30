/* eslint-disable */
// Firebase Cloud Messaging service worker.
// This file is served from the site root so it can intercept push events
// even when the app is in the background or closed.
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBo-2eO3_F78gMai3gyrt2wpnQc2esn6oc',
  authDomain: 'rotr-app.firebaseapp.com',
  projectId: 'rotr-app',
  storageBucket: 'rotr-app.firebasestorage.app',
  messagingSenderId: '763868835094',
  appId: '1:763868835094:web:e04fa89fc3ba94393b3437',
  measurementId: 'G-V97V3QX6KQ'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'Rhythm of the River';
  const body = (payload.notification && payload.notification.body) || '';
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: { click_action: '/announcements' }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.click_action) || '/announcements';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.focus();
          return client.navigate(target);
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
