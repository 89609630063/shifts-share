const CACHE_NAME = "shift-schedule-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html"
];

// Устанавливаем Service Worker и кешируем файлы
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Загружаем из кеша при отсутствии интернета
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "https://cdn-icons-png.flaticon.com/512/846/846551.png"
  });
});

// Обновляем кеш при изменении версии
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
