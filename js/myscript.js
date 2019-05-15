/*let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});*/
/*window.addEventListener('appinstalled', (evt) => {
  app.logEvent('a2hs', 'installed');
});*/
'use strict';
var endpoint,
		key,
		auth;
const serverPublicKey = 'BM5dZ6wzllLLrf2hc8RaTkGX5Lvd1xoqxTezYeHyCQe3sQWNykmk8SoC6M3A2LxIefdZPMU1mt0PcYcMpqzN6QI';
window.addEventListener('load', async e=>{
	swRegister();
});
async function swRegister () {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register('../sw.js');
			console.log('Регистрация SW прошла успешно: ', registration);	
			const reg = await navigator.serviceWorker.ready;
			console.log('Service Worker готов к работе: ', reg);
			const serverKey = await url64To8Array(serverPublicKey);
			const sub = await reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: serverKey
			});
			const keys = await sub.getKey ? sub.getKey('p256dh') : '';
			key = keys ? btoa(String.fromCharCode(null, new Uint8Array(keys))) : '';
			const gauth = await sub.getKey ? sub.getKey('auth') : '';
			auth = gauth ? btoa(String.fromCharCode(null, new Uint8Array(gauth))) : '';
			endpoint = sub.endpoint;
			console.log('auth: ', auth);
			console.log('key: ', sub.getKey);
			console.log('endpoint: ', endpoint);
			console.log('Subscribe: ', JSON.stringify(sub));
			
			await fetch(`https://vashsite.000webhostapp.com/?method=add&name=Vash&point=${sub.endpoint}`);
			
		} catch(e) {
			console.log('SW Не прошла регистрацию: '+ e);
		}
	} else {
		console.log('Браузер не поддерживает технологию SW!!!');
	}
}
function loadDO () {
	let header = new Headers({
    'Access-Control-Allow-Origin':'*',
    'Content-Type': 'multipart/form-data'
	});
	fetch('https://donbassopera.com/ru/afisha.html', {headers: header, mode: 'cors'})
  .then(function(response) {
    return response.text()
  }).then(function(body) {
    document.body.innerHTML = body
  });
}

function url64To8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


$(document).ready(function(){
  //menu
  $('.navbar__btn').on('click', function(){
  	$(this).toggleClass('activ');
  	$('div.navbar__toggle').toggleClass('collapse');
  });
  $('div.navbar__toggle').find('a').on('click', ()=>{
  	if ($('div.navbar__toggle').attr('class') === 'navbar__toggle collapse') {
  		$('div.navbar__toggle').toggleClass('collapse');
			$('.navbar__btn').toggleClass('activ');
  	}
  	
  });
});
