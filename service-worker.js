self.addEventListener('install', function (event) {
  event.waitUntil(preLoad());
});

var preLoad = function () {
  console.log('Install Event processing');
  return caches.open('offline').then(function (cache) {
    console.log('Cached index and offline page during Install');
    return cache.addAll(['/offline.html', '/index.html']);
  });
}

self.addEventListener('fetch', function (event) {
  console.log('The service worker is serving the asset.');
  if (!event.request.url) {
    return Promise.resolve()
  }
  event.respondWith(checkResponse(event.request).catch(function () {
    return returnFromCache(event.request)
  }));
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function (request) {
  return new Promise(function (fulfill, reject) {
    fetch(request).then(function (response) {
      if (response.status !== 404 || response.type === 'opaque') {
        fulfill(response)
      } else {
        reject()
      }
    }, reject)
  });
};

var addToCache = function (request) {
  if (request.url.startsWith('chrome-extension://') ||
      request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    console.log("ignoring extension: " + request.url)
    return Promise.resolve()
  }
  return caches.open('offline').then(function (cache) {
    return fetch(request).then(function (response) {
      console.log('add page to offline ' + request.url)
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function (request) {
  return caches.open('offline').then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status == 404) {
        return cache.match('offline.html')
      } else {
        return matching
      }
    });
  });
};
