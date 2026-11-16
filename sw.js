// Service worker: funcionamento offline com cache "stale-while-revalidate".
const CACHE = 'hamurabi-v3';
const ASSETS = [
    './', 'index.html', 'legal.html', 'css/styles.css', 'manifest.webmanifest',
    'js/i18n.js', 'js/shell.js', 'js/finance.js', 'js/core.js', 'js/calculator.js', 'js/tools.js', 'js/features.js',
    'js/vendor/chart.umd.js', 'images/logo.png','images/mark.png', 'images/icon-192.png', 'images/icon-512.png', 'favicon.ico'
];

self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys()
            .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
            .then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (e) {
    const req = e.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
    e.respondWith(
        caches.open(CACHE).then(function (cache) {
            return cache.match(req, { ignoreSearch: true }).then(function (hit) {
                const rede = fetch(req).then(function (res) {
                    if (res.ok) cache.put(req, res.clone());
                    return res;
                }).catch(function () { return hit; });
                return hit || rede;
            });
        })
    );
});
