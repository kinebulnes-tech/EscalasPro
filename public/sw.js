const CACHE_NAME = 'escalapro-v2'; // Cambiamos a v2 para que el cel sepa que hay cambios
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Aquí es donde vive tu diseño y lógica
];

// 1. INSTALACIÓN: Guarda los archivos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('EscalaPro: Guardando archivos para modo offline...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Fuerza a que la nueva versión tome el control
});

// 2. ACTIVACIÓN: Limpia versiones viejas para no ocupar espacio de más
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('EscalaPro: Borrando caché antiguo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. ESTRATEGIA DE CARGA: Primero busca en caché, si no hay, va a internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el archivo está en el bolsillo (caché), lo entrega. 
      // Si no, intenta buscarlo en la red.
      return response || fetch(event.request);
    })
  );
});