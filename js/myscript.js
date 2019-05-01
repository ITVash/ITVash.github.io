/*let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});*/
/*window.addEventListener('appinstalled', (evt) => {
  app.logEvent('a2hs', 'installed');
});*/
'use strict';
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
			const sub = await reg.pushManager.subscribe({userVisibleOnly: true});
			console.log('endpoint: ', sub.endpoint);		
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