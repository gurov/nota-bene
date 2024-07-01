self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('nota-bene-cache').then(cache => {
            return cache.addAll([
                '/nota-bene/',
                '/nota-bene/index.html',
                '/nota-bene/styles.css',
                '/nota-bene/script.js',
                '/nota-bene/manifest.json',
                '/nota-bene/images/icons/icon-192x192.png',
                '/nota-bene/images/icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
