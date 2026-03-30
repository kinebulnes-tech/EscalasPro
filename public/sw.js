// ✅ CORRECCIÓN: El nombre del caché incluye la fecha de compilación.
// Cada vez que hagas un build nuevo, cambia este número (ej: 20260401, 20260415...)
// Así los usuarios siempre reciben la versión más reciente de las escalas.
const BUILD_DATE = '20260330';
const CACHE_NAME = 'escalapro-v' + BUILD_DATE;

// Al instalar, guardamos lo básico para arrancar
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/index.html', '/manifest.json']);
    })
  );
  self.skipWaiting();
});

// ✅ CORRECCIÓN: Al activar, borramos cachés antiguos Y avisamos a la app
// que hay una versión nueva disponible.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // ✅ NUEVO: Toma control inmediato de todas las pestañas abiertas
      return self.clients.claim();
    })
  );
});

// Intercepta cada petición
self.addEventListener('fetch', (event) => {
  // ✅ CORRECCIÓN: Solo cacheamos peticiones GET (nunca POST, PUT, DELETE)
  // Ignoramos peticiones a otros dominios (APIs externas, analytics, etc.)
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // ✅ Solo guardamos en caché si la respuesta es válida (status 200)
        // Antes se podían cachear respuestas de error (404, 500) por accidente
        if (res && res.status === 200 && res.type === 'basic') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return res;
      })
      .catch(() => {
        // Sin internet: buscamos en el caché
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          
          // ✅ NUEVO: Si no hay caché para esta ruta, devolvemos index.html
          // Esto evita la pantalla en blanco al navegar offline
          return caches.match('/index.html');
        });
      })
  );
});

// ✅ NUEVO: Escucha mensajes desde la app
// Cuando la app detecta una nueva versión, puede pedirle al SW que se active ya
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});