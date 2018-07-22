let rrCache = 'restaurant-reviews-cache';

// Cached files
let urlsToCache = [
    '/',
	'/restaurant.html',
	'/css/styles.css',
	'/data/restaurants.json',
	'/img/1.jpg',
	'/img/2.jpg',
	'/img/3.jpg',
	'/img/4.jpg',
	'/img/5.jpg',
	'/img/6.jpg',
	'/img/7.jpg',
	'/img/8.jpg',
	'/img/9.jpg',
	'/img/10.jpg',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/js/dbhelper.js'
];

// Callback for the install event
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(rrCache)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
        // Notify if any of the files fail to download
      }).catch(error => {
			console.log(error);
		})
    );
});

// Return cached responses
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Upadate when new content is added
self.addEventListener('activate', function (event) {
  event.waitUntil (
	  cache.keys().then(function (cacheNames) {
		return Promise.all(
		  cacheNames.filter(function (cacheName) {
			return cacheName.startsWith('restaurant-') && cacheName != rrCache;
		  }).map(function(cacheName) {
			 return cache.delete(cacheName);
		  })
	    );
	  })
   );
});
