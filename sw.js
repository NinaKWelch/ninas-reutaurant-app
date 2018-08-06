var staticCacheName = 'restaurant-static-v1';

//Cached files
let urlsToCache = [
    '/',
	'/restaurant.html',
	'/css/styles.css',
	'/data/restaurants.json',
	'/img/1-400_md.jpg',
	'/img/2-400_md.jpg',
	'/img/3-400_md.jpg',
	'/img/4-400_md.jpg',
	'/img/5-400_md.jpg',
	'/img/6-400_md.jpg',
	'/img/7-400_md.jpg',
	'/img/8-400_md.jpg',
	'/img/9-400_md.jpg',
	'/img/10-400_md.jpg',
	'/img/1-800_lg.jpg',
	'/img/2-800_lg.jpg',
	'/img/3-800_lg.jpg',
	'/img/4-800_lg.jpg',
	'/img/5-800_lg.jpg',
	'/img/6-800_lg.jpg',
	'/img/7-800_lg.jpg',
	'/img/8-800_lg.jpg',
	'/img/9-800_lg.jpg',
	'/img/10-800_lg.jpg',
	'/img/1-1600_xlg.jpg',
	'/img/2-1600_xlg.jpg',
	'/img/3-1600_xlg.jpg',
	'/img/4-1600_xlg.jpg',
	'/img/5-1600_xlg.jpg',
	'/img/6-1600_xlg.jpg',
	'/img/7-1600_xlg.jpg',
	'/img/8-1600_xlg.jpg',
	'/img/9-1600_xlg.jpg',
	'/img/10-1600_xlg.jpg',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/js/dbhelper.js',
	'/js/register_sw.js'
];

//Callback for the install event
self.addEventListener('install', function (event) {
	event.waitUntil(caches.open(staticCacheName).then(function (cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

// Upadate cache when new content is added
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (cacheName) {
					return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
				}).map(function (cacheName) {
					return caches['delete'](cacheName);
				})
			);
		})
	);
});

//Return cached responses
self.addEventListener('fetch', function (event) {
	event.respondWith(caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});