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
			const sub = await reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: 'AAAArBMpuiI:APA91bEpb_Q0ZKTHVayxYdygRAz150ouLqT5ARi4tq3dBHU2Ln3lnDV9aX6Uz3xRNMBlhowWDWYZm-k6Rj8ZVsN47fMk4MxCQl7L0L4JAolvlIxavfQJmBTXfQ2OFLHxckuK9QdyzPHm'
			});
			const keys = await sub.getKey ? sub.getKey('p256dh') : '';
			key = keys ? btoa(String.fromCharCode(null, new Uint8Array(keys))) : '';
			const gauth = await sub.getKey ? sub.getKey('auth') : '';
			auth = gauth ? btoa(String.fromCharCode(null, new Uint8Array(gauth))) : '';
			endpoint = sub.endpoint;
			console.log('auth: ', auth);
			console.log('key: ', key);
			console.log('endpoint: ', endpoint);
			console.log('Subscribe: ', JSON.stringify(sub));
			
			//await fetch(location.href + 'createpushadresat?adresat=' + sub.endpoint, {method: 'GET'});
			
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