const cacheNFCU = 'nfcu-cache-v2';   

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(cacheNFCU).then(function(cache) {
            return cache.addAll([
                "/",
                "/js/party.min.js",
                "/js/MemoryGame.js",
                "/js/Card.js",
                "/js/BrowserInterface.js",
                "/images/nfcu/auto.jpg",
                "/images/nfcu/creditcard.jpg",
                "/images/nfcu/making.jpg",
                "/images/nfcu/mobile.jpg",
                "/images/card.svg",
                "/images/gear.png",
                "/images/logo.png.webp",
                "/images/apple-touch-icon.png",
                "/fonts/gotham-black-webfont.eot",
                "/fonts/gotham-black-webfont.woff",
                "/fonts/gotham-black-webfont.ttf",
                "/fonts/gotham-black-webfont.svg#GothamBlackRegular",
                "/fonts/gotham-medium-webfont.eot",
                "/fonts/gotham-medium-webfont.woff",
                "/fonts/gotham-medium-webfont.ttf",
                "/fonts/gotham-medium-webfont.svg#GothamMediumRegular",
                "/fonts/gotham-light-webfont.eot",
                "/fonts/gotham-light-webfont.woff",
                "/fonts/gotham-light-webfont.ttf",
                "/fonts/gotham-light-webfont.svg#GothamLightRegular",
                "/css/style.css",
            ]);
        }),
    );
    });
        
self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith("nfcu-cache-") &&
                        cacheName != cacheNFCU;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
}   );