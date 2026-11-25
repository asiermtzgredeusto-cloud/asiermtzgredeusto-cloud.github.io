const CACHE='myfin-play-1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
// Cada archivo se guarda por separado: si falta uno (por ejemplo un icono) la instalación ya no falla entera.
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>null)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Primero la red (así siempre llega la última versión) y, sin conexión, la copia guardada. Los datos del usuario no están aquí: viven en localStorage.
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});