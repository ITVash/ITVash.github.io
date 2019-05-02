'use strict';
const staticAssets = [
	'./',
	'https://code.jquery.com/jquery-3.3.1.slim.min.js',
	'https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Poppins:300,400,500,600,700', 
	'./favicon.ico',
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

self.addEventListener('fetch', async e => {
	const req = e.request;
	e.respondWith(cacheOnly(req));
	const response = await update(req);
	//await fetching('https://gcm-http.googleapis.com/gcm/send', 'f8ILBWqNSaw:APA91bGhhX8Er0gkha4jd1MXwdqCAXc13Dz9YwgT4r8wGonXxkD0Pb5R1nHWzbY2kNvK8rDM663qRh6ymEq679HlGTBpgXpY1BXCgu_I2-AK3r2pc6KtIWOj7aXi3pwl8iyTQ3kEoHfb');
	await ref(response);
});

self.addEventListener('push', async e => {
	const res = await fetch('./upd.json');
	if (res.status === 200) {
		try {
			const data = await res.json();
			const ntf = await data.notification;
			if (data.error || !ntf) {
				console.log('Ошибка загрузки файла или неправельный формат файла!');
			}
			return self.registration.showNotification(ntf.title, {
				body: ntf.body,
				icon: ntf.icon
			});
		} catch(e) {
			console.log('Что-то пошло не так: ', e);
		}
	} else {
		console.log('Нет данных об обновлении!!!');
	}
});

self.addEventListener('notificationclick', async e => {
	e.notification.close();
	const url = await location.protocol + '//' + location.host;
	const clientList = await self.clients.matchAll();
	if (clientList.length > 0) {
		return clientList[0].focus();
	}
	return clients.openWindow(url);
});

async function fetching (url, endpoint) {
	const opt = {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			'Authorization': 'key=AIzaSyDuxxwy_swXLCS6VLBHORHzJ9B_CgjwmTM'
		},
		body: JSON.stringify({
			to: endpoint,
			data: {
				title: 'Ну если получилось',
				icon: './img/icons/icon-72x72.png',
				text: 'Ура новый контент!!!'
			}
		})
	};
	try {
		const res = await fetch(url, opt);
		console.log('Вот что мы имеем: ', res);
		return res;
	} catch(e) {
		// statements
		console.log('Не улетел запросс((((: ',e);
	}
}

async function ref (ress) {
	const res = await fetch('./upd.json');
	if (res.status === 200) {
		try {
			const data = await res.json();
			const ntf = await data.notification;
			if (data.error || !ntf) {
				console.log('Ошибка загрузки файла или неправельный формат файла!');
			}
			return self.registration.showNotification(ntf.title, {
				//type: 'refresh',
				body: ntf.body,
				icon: ntf.icon,
				tag: 'spell'
			});
		} catch(e) {
			console.log('Что-то пошло не так: ', e);
		}
	} else {
		console.log('Нет данных об обновлении!!!');
	}
	/*var num = 1;
	await self.registration.showNotification('Обновление контента', {
		type: 'refresh',
		url: location.href,
		body: ++num >1 ? 'Новые данные на ресурсе' : 'Полная херь',
		icon: './img/icons/icon-72x72.png',
		//eTag: res.headers.get('ETag')
		tag: 'spell'
	});*/
}
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
		return res;
	} catch(e) {
		//const cacheRead = await cached.match(req);
		//return cacheRead;
		console.log('Нет интернета. Попробуйте позже! ', e);
	}
}

async function refresh (res) {
	const clt = await self.clients.matchAll();
	return clt.forEach(cltMsg => {
		const msg = {
			type: 'refresh',
			url: res.url,
			eTag: res.headers.get('ETag')
		};
		cltMsg.postMessage(JSON.stringify(msg));
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