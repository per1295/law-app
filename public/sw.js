// Конфигурация
const CACHE_NAME = 'app-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Добавьте сюда пути ко всем вашим статическим файлам
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Установка');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Кэширование статических файлов');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Установка завершена');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Ошибка при установке', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Активация');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Удаление старого кэша', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Активация завершена');
      return self.clients.claim();
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем не-GET запросы
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Возвращаем кэшированную версию, если есть
        if (cachedResponse) {
          console.log('Service Worker: Возвращаем из кэша', event.request.url);
          return cachedResponse;
        }

        // Иначе загружаем из сети и кэшируем
        return fetch(event.request)
          .then((response) => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ, так как он может быть использован только один раз
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Кэшируем только успешные ответы
                cache.put(event.request, responseToCache);
                console.log('Service Worker: Кэширован новый ресурс', event.request.url);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Ошибка загрузки', error);
            // Здесь можно вернуть fallback-страницу
            // return caches.match('/offline.html');
          });
      })
  );
});

// Обработка сообщений от основного потока
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});