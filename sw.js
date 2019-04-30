const staticAssets = [
	'./',
	'https://code.jquery.com/jquery-3.3.1.slim.min.js',
	'https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Poppins:300,400,500,600,700', 
	'./img/top-bg.jpg',
	'./img/Alexis.png',
	'./img/icons/icon-144x144.png',
	'./img/icons/icon-72x72.png',
	'./img/icons/icon-96x96.png',
	'./img/icons/icon-128x128.png',
	'./img/icons/icon-152x152.png',
	'./img/icons/icon-192x192.png',
	'./img/icons/icon-384x384.png',
	'./img/icons/icon-512x512.png',
	'./img/linear.jpg',
	'./img/about.jpg',
	'./img/app_dev.png',
	'./img/clock.png',
	'./img/diagram.png',
	'./img/f1.jpg',
	'./img/f2.jpg',
	'./img/f3.jpg',
	'./img/f4.jpg',
	'./img/heart.png',
	'./img/ok.png',
	'./img/p1.jpg',
	'./img/p2.jpg',
	'./img/p3.jpg',
	'./img/p4.jpg',
	'./img/p5.jpg',
	'./img/p6.jpg',
	'./img/p7.jpg',
	'./img/p8.jpg',
	'./img/p9.jpg',
	'./img/photo.png',
	'./img/present.png',
	'./img/social.png',
	'./img/stats.jpg',
	'./img/usd.png',
	'./img/user-plus.png',
	'./img/uxdes.png',
	'./img/webdes.png',
	//'./img/*.{png,jpg}',
	'./css/normalize.css',
	'./css/style.css',
	'./js/myscript.js',
	'./manifest.webmanifest'
];
const cache = 'static-cache';

self.addEventListener('install', async e => {
	const cached = await caches.open(cache);
	await cached.addAll(staticAssets);
	//return self.skipWaiting();
});

/*self.addEventListener('activate', e => {
	self.clients.claim();
});*/

/*self.addEventListener('fetch', e => {
	const req = e.request;
	const url = new URL(req.url);
	if (url.origin === location.origin) {
		e.respondWith(cacheOnly(req));
	} else {
		e.respondWith(netAndCache(req));
	}
	
});*/
self.addEventListener('fetch', e => {
	const req = e.request;
	//const url = new URL(req.url);
	
	//e.respondWith(cacheOnly(req));
	e.respondWith(fromCache(req));
	e.waitUntil(upd(req)
		.then(refresh2)
	);
	//await update(req);
	
});

async function netAndCache (req) {
	const cached = await caches.open(cache);
	try {
		const res = await fetch(req);
		await cached.put(req, res.clone());
		return res;
	} catch(e) {
		const cacheRead = await cached.match(req);
		return cacheRead;
	}
}

async function cacheOnly (req) {
	const cached = await caches.open(cache);
	const cacheRespond = await cached.match(req);
	//return cacheRespond || fetch(req);
	return cacheRespond;
}

async function update (req) {
	const cached = await caches.open(cache);
	try {
		const res = await fetch(req);
		await cached.put(req, res.clone());
		return refresh(res);
	} catch(e) {
		// statements
		console.log(e);
	}
}

async function refresh (response) {
	const clt = await self.clients.matchAll();
	return clt.forEach(cltMsg => {
		const msg = {
			type: 'refresh',
			url: response.url,
			eTag: response.headers.get('ETag')
		};
		cltMsg.postMessage(JSON.stringify(msg));
	});
}

function refresh2 (response) {
	return self.clients.matchAll().then((clients) => {
		clients.forEach((client) => {
			// Подробнее про ETag можно прочитать тут
			// https://en.wikipedia.org/wiki/HTTP_ETag
			const message = {
					type: 'refresh',
					url: response.url,
					eTag: response.headers.get('ETag')
			};
			// Уведомляем клиент об обновлении данных.
			client.postMessage(JSON.stringify(message));
		});
	});
}

function fromCache (req) {
	return caches.open(cache)
		.then((cached) =>
			cached.match(req)
			.then((matching) =>
				matching || Promise.reject('no-match')
		));
}

function upd (req) {
	return caches.open(cache)
		.then((cached) =>
			fetch(req)
			.then((res) =>
				cached.put(req, res.clone())
				.then(() => res)
			)
		);
}