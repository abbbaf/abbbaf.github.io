/* Rotate the editor itself when OS/browser orientation is locked to portrait. */
(function(){
 const button=document.getElementById('rotate-view'),key='turtlespeed-studio-landscape-view';
 const query=new URLSearchParams(location.search).get('view');let enabled=query==='landscape';
 if(query!=='landscape'&&query!=='normal'){try{enabled=localStorage.getItem(key)==='1';}catch(e){}}
 const state=window.turtleView={rotated:false};
 function update(){
  const rotated=enabled&&innerHeight>innerWidth;
  document.documentElement.classList.toggle('manual-rotation',rotated);
  document.body.classList.toggle('manual-landscape',rotated);
  document.body.style.setProperty('--rotated-width',innerHeight+'px');
  document.body.style.setProperty('--rotated-height',innerWidth+'px');
  state.rotated=rotated;
  button.textContent=enabled?'Restore view':'Rotate view';button.setAttribute('aria-pressed',String(enabled));
 }
 button.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem(key,enabled?'1':'0');}catch(e){}window.scrollTo(0,0);update();});
 window.addEventListener('resize',update);update();
})();
