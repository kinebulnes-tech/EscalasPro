const CACHE_NAME = 'escalapro-dynamic-v1';

// Al instalar, solo guardamos lo básico para arrancar
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/index.html', '/manifest.json']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// LA MAGIA: Intercepta cada petición
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // Si hay internet, hacemos una copia de lo que recibimos en el caché
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return res;
      })
      .catch(() => {
        // Si NO hay internet, buscamos en el caché lo que sea que hayamos guardado antes
        return caches.match(event.request);
      })
  );
});