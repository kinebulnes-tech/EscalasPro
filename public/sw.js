// Service Worker — EscalaPro
// La versión se inyecta automáticamente por Vite en cada build
// __BUILD_HASH__ es reemplazado por vite.config.ts con el hash del bundle

const CACHE_VERSION = typeof __BUILD_HASH__ !== 'undefined' ? __BUILD_HASH__ : Date.now().toString();
const CACHE_NAME = 'escalapro-v' + CACHE_VERSION;

// Recursos críticos que se pre-cachean en la instalación
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Al instalar: pre-cachea los recursos críticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Al activar: elimina cachés anteriores y toma control inmediato
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('escalapro-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia: Network-first para HTML, Cache-first para assets estáticos
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // HTML: siempre intenta red primero (versión fresca), fallback a caché
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // JS/CSS/imágenes: Cache-first con actualización en background (stale-while-revalidate)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request).then((res) => {
          if (res.status === 200 && res.type === 'basic') {
            cache.put(event.request, res.clone());
          }
          return res;
        });
        return cached || networkFetch;
      })
    )
  );
});

// Recibe mensajes desde la app (ej: forzar actualización)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});
