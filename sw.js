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
	return self.skipWaiting();
});

self.addEventListener('activate', e => {
	self.clients.claim();
});

self.addEventListener('fetch', e => {
	const req = e.request;
	const url = new URL(req.url);
	if (url.origin === location.origin) {
		e.respondWith(cacheOnly(req));
	} else {
		e.respondWith(netAndCache(req));
	}
	
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
	return cacheRespond || fetch(req);
}