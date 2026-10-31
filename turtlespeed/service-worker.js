/* TurtleSpeed PWA offline caching v1.0.0 (scope-relative paths, suitable for GitHub Pages). */
'use strict';
const VERSION='turtlespeed-pwa-20261031-v9-phone-loss-cue';
const CACHE_SHELL=VERSION+'-shell';
const CACHE_RUNTIME=VERSION+'-runtime';
const SHELL_ASSETS=["./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./images/cards/166p_neat.webp", "./images/cards/1998_bu48.webp", "./images/cards/2000_gm137.webp", "./images/cards/2000_qb243.webp", "./images/cards/2001_sq73.webp", "./images/cards/2002_gg166.webp", "./images/cards/2002_gz32.webp", "./images/cards/2002_pn34.webp", "./images/cards/2002_vr130.webp", "./images/cards/2003_co1.webp", "./images/cards/2003_ur292.webp", "./images/cards/2004_pa44.webp", "./images/cards/2005_gh228.webp", "./images/cards/2006_sx368.webp", "./images/cards/2008_rg167.webp", "./images/cards/2008_sj236.webp", "./images/cards/2009_hh36.webp", "./images/cards/2009_me10.webp", "./images/cards/2009_qy6.webp", "./images/cards/2010_fb49.webp", "./images/cards/2010_lp68.webp", "./images/cards/2010_th.webp", "./images/cards/2011_ac72.webp", "./images/cards/2011_ud63.webp", "./images/cards/2012_br61.webp", "./images/cards/2012_pv45.webp", "./images/cards/2013_eh154.webp", "./images/cards/2013_pj44.webp", "./images/cards/2013_wv107.webp", "./images/cards/2014_jc80.webp", "./images/cards/2014_on57.webp", "./images/cards/2014_qh563.webp", "./images/cards/2014_sr303.webp", "./images/cards/2014_ss303.webp", "./images/cards/2014_sw223.webp", "./images/cards/2014_tz33.webp", "./images/cards/2014_ut114.webp", "./images/cards/2015_bg519.webp", "./images/cards/2015_fb400.webp", "./images/cards/2015_hx384.webp", "./images/cards/2016_ue179.webp", "./images/cards/2017_uv43.webp", "./images/cards/2019_ab7.webp", "./images/cards/2020_ku7.webp", "./images/cards/2023_xa13.webp", "./images/cards/2024_or.webp", "./images/cards/2024_or4.webp", "./images/cards/2024_wt4.webp", "./images/cards/2025_gf.webp", "./images/cards/29p_schwassmann_wachmann.webp", "./images/cards/39p_oterma.webp", "./images/cards/944_hidalgo.webp", "./images/cards/97p_metcalf_brewington.webp", "./images/cards/amycus.webp", "./images/cards/asbolus.webp", "./images/cards/camilla.webp", "./images/cards/ceres.webp", "./images/cards/chariklo.webp", "./images/cards/chiron.webp", "./images/cards/cyllarus.webp", "./images/cards/earth.webp", "./images/cards/echeclus.webp", "./images/cards/elatus.webp", "./images/cards/hilda.webp", "./images/cards/hygiea.webp", "./images/cards/jupiter.webp", "./images/cards/mars.webp", "./images/cards/mercury.webp", "./images/cards/neptune.webp", "./images/cards/nessus.webp", "./images/cards/okyrhoe.webp", "./images/cards/pholus.webp", "./images/cards/saturn.webp", "./images/cards/thule.webp", "./images/cards/uranus.webp", "./images/cards/venus.webp", "./images/cards/vesta.webp", "./images/cards/xewioso.webp", "./images/moons/amalthea.webp", "./images/moons/ariel.webp", "./images/moons/callisto.webp", "./images/moons/charon.webp", "./images/moons/despina.webp", "./images/moons/dione.webp", "./images/moons/enceladus.webp", "./images/moons/europa.webp", "./images/moons/galatea.webp", "./images/moons/ganymede.webp", "./images/moons/himalia.webp", "./images/moons/hyperion.webp", "./images/moons/iapetus.webp", "./images/moons/io.webp", "./images/moons/janus.webp", "./images/moons/larissa.webp", "./images/moons/mimas.webp", "./images/moons/miranda.webp", "./images/moons/moon.webp", "./images/moons/nereid.webp", "./images/moons/oberon.webp", "./images/moons/phoebe.webp", "./images/moons/pluto.webp", "./images/moons/proteus.webp", "./images/moons/puck.webp", "./images/moons/rhea.webp", "./images/moons/sycorax.webp", "./images/moons/tethys.webp", "./images/moons/titan.webp", "./images/moons/titania.webp", "./images/moons/triton.webp", "./images/moons/umbriel.webp", "./images/objects/166p_neat.webp", "./images/objects/1998_bu48.webp", "./images/objects/2000_cr105.webp", "./images/objects/2000_gm137.webp", "./images/objects/2000_qb243.webp", "./images/objects/2001_sq73.webp", "./images/objects/2002_aw197.webp", "./images/objects/2002_gg166.webp", "./images/objects/2002_gz32.webp", "./images/objects/2002_pn34.webp", "./images/objects/2002_tc302.webp", "./images/objects/2002_ux25.webp", "./images/objects/2002_vr130.webp", "./images/objects/2003_co1.webp", "./images/objects/2003_ur292.webp", "./images/objects/2004_gv9.webp", "./images/objects/2004_pa44.webp", "./images/objects/2004_xr190.webp", "./images/objects/2005_gh228.webp", "./images/objects/2005_qu182.webp", "./images/objects/2006_sx368.webp", "./images/objects/2007_tg422.webp", "./images/objects/2007_uk126.webp", "./images/objects/2008_rg167.webp", "./images/objects/2008_sj236.svg", "./images/objects/2008_sj236.webp", "./images/objects/2008_st291.webp", "./images/objects/2009_hh36.svg", "./images/objects/2009_hh36.webp", "./images/objects/2009_me10.webp", "./images/objects/2009_qy6.svg", "./images/objects/2009_qy6.webp", "./images/objects/2010_ek139.webp", "./images/objects/2010_fb49.webp", "./images/objects/2010_gb174.webp", "./images/objects/2010_jo179.webp", "./images/objects/2010_lp68.webp", "./images/objects/2010_rf43.webp", "./images/objects/2010_th.webp", "./images/objects/2011_ac72.webp", "./images/objects/2011_sr250.svg", "./images/objects/2011_sr250.webp", "./images/objects/2011_ud63.webp", "./images/objects/2012_br61.webp", "./images/objects/2012_dr30.webp", "./images/objects/2012_pv45.webp", "./images/objects/2012_vp113.webp", "./images/objects/2013_eh154.webp", "./images/objects/2013_ek73.svg", "./images/objects/2013_ek73.webp", "./images/objects/2013_ft28.webp", "./images/objects/2013_fy27.webp", "./images/objects/2013_pj44.svg", "./images/objects/2013_pj44.webp", "./images/objects/2013_sy99.webp", "./images/objects/2013_wv107.webp", "./images/objects/2013_xz8.svg", "./images/objects/2013_xz8.webp", "./images/objects/2014_ez51.webp", "./images/objects/2014_fe72.webp", "./images/objects/2014_fk72.svg", "./images/objects/2014_fk72.webp", "./images/objects/2014_jc80.svg", "./images/objects/2014_jc80.webp", "./images/objects/2014_on57.webp", "./images/objects/2014_qh563.webp", "./images/objects/2014_sr303.webp", "./images/objects/2014_sr349.webp", "./images/objects/2014_ss303.svg", "./images/objects/2014_ss303.webp", "./images/objects/2014_sw223.webp", "./images/objects/2014_tz33.webp", "./images/objects/2014_ut114.webp", "./images/objects/2014_uz224.webp", "./images/objects/2015_bg519.webp", "./images/objects/2015_fb400.webp", "./images/objects/2015_fe563.webp", "./images/objects/2015_ht171.svg", "./images/objects/2015_ht171.webp", "./images/objects/2015_hx384.svg", "./images/objects/2015_hx384.webp", "./images/objects/2015_kg163.webp", "./images/objects/2015_kh162.webp", "./images/objects/2015_rr245.webp", "./images/objects/2016_lk89.svg", "./images/objects/2016_lk89.webp", "./images/objects/2016_ue179.svg", "./images/objects/2016_ue179.webp", "./images/objects/2017_of201.webp", "./images/objects/2017_uv43.webp", "./images/objects/2018_ag37.webp", "./images/objects/2018_vg18.webp", "./images/objects/2019_ab7.webp", "./images/objects/2019_eu5.webp", "./images/objects/2020_ku7.webp", "./images/objects/2021_dk18.webp", "./images/objects/2021_rr205.webp", "./images/objects/2023_xa13.webp", "./images/objects/2024_or.webp", "./images/objects/2024_or4.webp", "./images/objects/2024_wt4.webp", "./images/objects/2025_gf.webp", "./images/objects/29p_schwassmann_wachmann.webp", "./images/objects/39p_oterma.webp", "./images/objects/944_hidalgo.webp", "./images/objects/97p_metcalf_brewington.webp", "./images/objects/alicanto.webp", "./images/objects/amycus.webp", "./images/objects/asbolus.svg", "./images/objects/asbolus.webp", "./images/objects/camilla.webp", "./images/objects/ceres.webp", "./images/objects/chariklo.webp", "./images/objects/chiron.webp", "./images/objects/cyllarus.webp", "./images/objects/earth.webp", "./images/objects/echeclus.webp", "./images/objects/elatus.svg", "./images/objects/elatus.webp", "./images/objects/eris.webp", "./images/objects/europa.webp", "./images/objects/ganymede.webp", "./images/objects/gkun_homdima.webp", "./images/objects/gonggong.webp", "./images/objects/haumea.webp", "./images/objects/hilda.webp", "./images/objects/hygiea.webp", "./images/objects/io.webp", "./images/objects/jupiter.webp", "./images/objects/leleakuhonua.webp", "./images/objects/makemake.webp", "./images/objects/mars.webp", "./images/objects/mercury.webp", "./images/objects/moon.webp", "./images/objects/neptune.webp", "./images/objects/nessus.webp", "./images/objects/okyrhoe.webp", "./images/objects/pholus.webp", "./images/objects/pluto.webp", "./images/objects/quaoar.webp", "./images/objects/salacia.webp", "./images/objects/saturn.webp", "./images/objects/sedna.webp", "./images/objects/sun.webp", "./images/objects/thule.webp", "./images/objects/titan.webp", "./images/objects/uranus.webp", "./images/objects/venus.webp", "./images/objects/vesta.webp", "./images/objects/xewioso.webp", "./images/ui/blue-ball-1.webp", "./images/ui/blue-ball-2.webp", "./images/ui/blue-ball-3.webp", "./images/ui/blue-ball-4.webp", "./images/ui/nebula-background.webp", "./images/ui/red-hazard.webp", "./images/ui/score-ball.webp", "./images/ui/turtle-player.webp", "./images/ui/turtlespeed-logo-full.png", "./images/ui/turtlespeed-logo-wordmark.png"];
const AUDIO_ASSETS=["./sounds/track1.mp3", "./sounds/track2.mp3", "./sounds/track3.mp3", "./sounds/track4.mp3", "./sounds/track5.mp3", "./sounds/track6.mp3", "./sounds/track7.mp3", "./sounds/track8.mp3", "./sounds/track9.mp3", "./sounds/track10.mp3", "./sounds/level complete.mp3", "./sounds/victory.mp3", "./sounds/blue ball catch.mp3", "./sounds/gold ball catch.mp3", "./sounds/lose a life-phone-v2.mp3"];
const CHUNK_SIZE=24;
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE_SHELL);
   // Core app shell is mandatory; a failed URL should prevent a bad offline install.
   await cache.addAll(SHELL_ASSETS.slice(0,5));
   // Artwork is part of the game, but one corrupt/missing asset must not break
   // installation of the entire PWA. Cache with controlled concurrency.
   const paths=SHELL_ASSETS.slice(5);
   for(let i=0;i<paths.length;i+=CHUNK_SIZE){
     await Promise.allSettled(paths.slice(i,i+CHUNK_SIZE).map(async path=>{
       const req=new Request(path,{cache:'reload'});
       const response=await fetch(req);
       if(response.ok)await cache.put(req,response);
     }));
   }
   await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.filter(k=>k.startsWith('turtlespeed-pwa-') && k!==CACHE_SHELL && k!==CACHE_RUNTIME).map(k=>caches.delete(k)));
   await self.clients.claim();
 })());
});
async function cachedOrNetwork(request){
 const cached=await caches.match(request);
 if(cached)return cached;
 const response=await fetch(request);
 // CacheStorage cannot hold HTTP 206 partial responses. Complete audio files
 // are cached separately by the audio prefetch worker message.
 if(response.ok && response.status===200){
   const cache=await caches.open(CACHE_RUNTIME);
   try{await cache.put(request,response.clone());}catch(_quota){}
 }
 return response;
}
// HTMLMediaElement seeks frequently issue Range requests. Offline audio must
// answer those from complete cached MP3s, rather than returning a 200 to a 206
// request (which can prevent seeking on Android).
async function cachedAudioRange(request){
 const range=request.headers.get('range');
 if(!range)return null;
 const match=/^bytes=(\d*)-(\d*)$/i.exec(range.trim());
 if(!match)return null;
 const cached=await caches.match(request.url);
 if(!cached || cached.status!==200)return null;
 const bytes=await cached.arrayBuffer();
 const length=bytes.byteLength;
 if(!length)return null;
 let start,end;
 if(match[1]===''){
   const count=Number(match[2]);
   if(!Number.isSafeInteger(count)||count<=0)return null;
   start=Math.max(0,length-count);end=length-1;
 }else{
   start=Number(match[1]);
   end=match[2]===''?length-1:Number(match[2]);
 }
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=length || end<start)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${length}`}});
 end=Math.min(end,length-1);
 return new Response(bytes.slice(start,end+1),{status:206,headers:{
   'Content-Type':cached.headers.get('Content-Type')||'audio/mpeg',
   'Content-Range':`bytes ${start}-${end}/${length}`,
   'Accept-Ranges':'bytes',
   'Content-Length':String(end-start+1)
 }});
}
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 // Never intercept user navigation with a stale game build when online.
 if(request.mode==='navigate'){
   event.respondWith((async()=>{
     try{
       const fresh=await fetch(request);
       if(fresh.ok){const cache=await caches.open(CACHE_SHELL);await cache.put('./index.html',fresh.clone());}
       return fresh;
     }catch(_offline){return (await caches.match('./index.html')) || Response.error();}
   })());
   return;
 }
 // Answer byte-range requests for fully cached audio (including offline seek).
 if(url.pathname.includes('/sounds/') && request.headers.has('range')){
   event.respondWith((async()=>await cachedAudioRange(request) || fetch(request))());
   return;
 }
 event.respondWith(cachedOrNetwork(request));
});
let prefetchPromise=null;
async function prefetchAudio(){
 const cache=await caches.open(CACHE_RUNTIME);
 for(const path of AUDIO_ASSETS){
   const request=new Request(path,{cache:'no-cache'});
   // Skip cached audio to avoid large re-downloads on every launch.
   if(await cache.match(request))continue;
   try{
     const response=await fetch(request);
     if(response.ok)await cache.put(request,response);
   }catch(_offlineOrMissing){}
 }
}
self.addEventListener('message',event=>{
 if(event.data?.type!=='TS_PREFETCH_AUDIO')return;
 if(!prefetchPromise)prefetchPromise=prefetchAudio().finally(()=>{prefetchPromise=null;});
 event.waitUntil(prefetchPromise);
});
