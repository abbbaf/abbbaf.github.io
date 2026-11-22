'use strict';
(async function(){
  const $=id=>document.getElementById(id);let asset;
  let renderer,frame=0,toastTimer;const values={},widgets=new Map();
  function message(text,error=false){const el=$('message');el.textContent=text;el.classList.toggle('error',error);el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true;},error?10000:4500);}
  function storageKey(){return 'turtlespeed-expression-studio-v1:'+asset.sourceSHA256;}
  function persist(){try{localStorage.setItem(storageKey(),JSON.stringify(values));}catch(e){/* Private browsing can disable persistence; portable JSON still works. */}}
  function schedule(){if(!renderer)return;if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const start=performance.now();renderer.update(values);renderer.draw();$('status').textContent='Live · '+Math.round(performance.now()-start)+' ms';});}
  function sync(){for(const [name,widget] of widgets)widget.update(values[name]);}
  function setParameter(name,value,custom=true){
    const p=asset.model.param.find(p=>p.name===name);if(!p)throw Error('Unknown parameter: '+name);
    const axes=p.is_vec2?2:1,raw=Array.isArray(value)?value:[value];
    if(raw.length<axes)throw Error('Missing value for '+name);
    const converted=[];for(let i=0;i<axes;i++){if(typeof raw[i]!=='number'||!Number.isFinite(raw[i]))throw Error('Invalid number for '+name);converted.push(Math.max(p.min[i],Math.min(p.max[i],raw[i])));}
    values[name]=p.is_vec2?converted:converted[0];if(custom)$('preset').value='';if(widgets.has(name))widgets.get(name).update(values[name]);persist();schedule();
  }
  function applyParameters(input){
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('This file does not contain an expression.');
    // Validate everything before mutating state, so a malformed file cannot partially apply.
    const checked={};for(const p of asset.model.param){
      if(!(p.name in input))continue;const raw=Array.isArray(input[p.name])?input[p.name]:[input[p.name]],axes=p.is_vec2?2:1;
      if(raw.length<axes||raw.slice(0,axes).some(x=>typeof x!=='number'||!Number.isFinite(x)))throw Error('Invalid value for '+p.name);
      checked[p.name]=p.is_vec2?raw.slice(0,2):raw[0];
    }
    if(!Object.keys(checked).length)throw Error('No matching turtle parameters were found.');
    for(const [name,value] of Object.entries(checked))setParameter(name,value,false);
    sync();persist();schedule();
  }
  const descriptions={
    'Eye movement':['Move the dot or use X and Y. Positive Y looks up.'],
    'Close eyes':['Upper and lower eyelids together.','Closed','Open'],
    'Close upper eyelids':['Adjust only the upper eyelids.','Closed','Open'],
    'Eyebrows movement':['Move both eyebrows vertically.','Lower','Original height'],
    'Mouth smile':['Includes the cheeks and eye expression.','Frown','Smile'],
    'Mouth open':['Open the mouth independently of the smile.','Closed','Open'],
    'Concentration':['Coordinated focused eyes, brows and mouth.','Relaxed','Strong focus'],
    'Eyebrow slope':['Positive values lower the inner ends.','Inner ends up','Inner ends down'],
    'Cute head tilt':['Use zero to keep the head upright.','Upright','Tilted']
  };
  function slider(parent,p,axis,label){
    const row=document.createElement('div');row.className='slider-line';
    const id='parameter-'+p.uuid+'-'+axis;
    const range=document.createElement('input');range.type='range';range.min=p.min[axis];range.max=p.max[axis];range.step='.01';range.id=id;range.setAttribute('aria-label',label);
    const number=document.createElement('input');number.type='number';number.min=range.min;number.max=range.max;number.step=range.step;number.setAttribute('aria-label',label+' value');
    const change=el=>{if(el.value.trim()===''||!Number.isFinite(Number(el.value)))return;const n=Number(el.value),v=p.is_vec2?values[p.name].slice():n;if(p.is_vec2)v[axis]=n;setParameter(p.name,v);};
    range.addEventListener('input',()=>change(range));number.addEventListener('input',()=>change(number));number.addEventListener('blur',()=>{number.value=(p.is_vec2?values[p.name][axis]:values[p.name]).toFixed(2);});row.append(range,number);parent.append(row);
    return v=>{range.value=v;number.value=Number(v).toFixed(2);};
  }
  try{
    asset=await window.turtleRigReady;
    const {TurtleRenderer}=await import('./runtime-adapter.js');
    $('rig-count').textContent=asset.model.param.length+' Inochi parameters · live controls';
    for(const p of asset.model.param)values[p.name]=p.is_vec2?p.defaults.slice(0,2):p.defaults[0];
    for(const p of asset.model.param){
      const card=document.createElement('div');card.className='control'+(p.is_vec2?' eye-control':'');
      const title=document.createElement('div');title.className='control-title';const label=document.createElement(p.is_vec2?'span':'label');label.textContent=p.name;if(!p.is_vec2)label.htmlFor='parameter-'+p.uuid+'-0';
      const reset=document.createElement('button');reset.className='reset-one';reset.textContent='↺';reset.title='Reset '+p.name;reset.setAttribute('aria-label','Reset '+p.name);reset.onclick=()=>setParameter(p.name,p.is_vec2?p.defaults.slice(0,2):p.defaults[0]);title.append(label,reset);card.append(title);
      const hint=document.createElement('p');hint.className='hint';hint.textContent=(descriptions[p.name]||['Adjust this Inochi parameter.'])[0];card.append(hint);
      if(p.is_vec2){
        const grid=document.createElement('div');grid.className='eye-grid';const pad=document.createElement('div');pad.className='eye-pad';pad.setAttribute('aria-hidden','true');const dot=document.createElement('span');dot.className='eye-dot';pad.append(dot);const axes=document.createElement('div');
        const updaters=[];for(let i=0;i<2;i++){const name=document.createElement('span');name.className='eye-axis';name.textContent=i===0?'X · left / right':'Y · down / up';axes.append(name);updaters.push(slider(axes,p,i,p.name+(i===0?' X':' Y')));}
        grid.append(pad,axes);card.append(grid);
        const pointer=event=>{const rect=pad.getBoundingClientRect();const rotated=window.turtleView&&window.turtleView.rotated;const x=Math.max(0,Math.min(1,rotated?(event.clientY-rect.top)/rect.height:(event.clientX-rect.left)/rect.width)),y=Math.max(0,Math.min(1,rotated?(event.clientX-rect.left)/rect.width:1-(event.clientY-rect.top)/rect.height));setParameter(p.name,[p.min[0]+x*(p.max[0]-p.min[0]),p.min[1]+y*(p.max[1]-p.min[1])]);};
        let down=false;pad.onpointerdown=event=>{down=true;pad.setPointerCapture(event.pointerId);pointer(event);};pad.onpointermove=event=>{if(down)pointer(event);};pad.onpointerup=pad.onpointercancel=()=>{down=false;};
        widgets.set(p.name,{update:v=>{updaters.forEach((fn,i)=>fn(v[i]));dot.style.left=((v[0]-p.min[0])/(p.max[0]-p.min[0])*100)+'%';dot.style.top=(100-(v[1]-p.min[1])/(p.max[1]-p.min[1])*100)+'%';}});
      }else{
        const update=slider(card,p,0,p.name);widgets.set(p.name,{update});const ends=document.createElement('div');ends.className='endpoints';for(const t of (descriptions[p.name]||['',String(p.min[0]),String(p.max[0])]).slice(1)){const span=document.createElement('span');span.textContent=t;ends.append(span);}card.append(ends);
      }
      $('controls').append(card);
    }
    asset.presets.forEach((preset,index)=>{const o=document.createElement('option');o.value=String(index);o.textContent=preset.emotion;$('preset').append(o);});
    $('preset').onchange=()=>{const index=$('preset').value;if(index!=='')applyParameters(asset.presets[Number(index)].parameters);};
    $('reset').onclick=()=>{for(const p of asset.model.param)setParameter(p.name,p.is_vec2?p.defaults.slice(0,2):p.defaults[0],false);$('preset').value='';message('Restored the saved Inochi defaults.');};
    function framing(face){renderer.focusFace=face;$('full-view').classList.toggle('selected',!face);$('face-view').classList.toggle('selected',face);$('full-view').setAttribute('aria-pressed',String(!face));$('face-view').setAttribute('aria-pressed',String(face));schedule();}
    $('full-view').onclick=()=>{if(renderer)framing(false);};$('face-view').onclick=()=>{if(renderer)framing(true);};
    $('zoom').oninput=()=>{if(renderer)renderer.zoom=Number($('zoom').value);$('zoom-value').value=Math.round(Number($('zoom').value)*100)+'%';schedule();};
    let background=0;$('background').onclick=()=>{background=(background+1)%3;$('stage').classList.toggle('dark',background===1);$('stage').classList.toggle('light',background===2);};
    const download=(blob,name)=>{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);};
    $('save-settings').onclick=()=>download(new Blob([JSON.stringify({format:'turtlespeed-expression-v1',source:asset.source,sourceSHA256:asset.sourceSHA256,parameters:values},null,2)],{type:'application/json'}),'turtle-expression.json');
    $('load-settings').onclick=()=>$('settings-file').click();$('settings-file').onchange=async()=>{const file=$('settings-file').files[0];if(!file)return;try{if(file.size>100000)throw Error('Choose an expression settings JSON, not the full rig.');const data=JSON.parse(await file.text());applyParameters(data.parameters||data);$('preset').value='';message('Expression loaded.');}catch(e){message(e.message,true);}finally{$('settings-file').value='';}};
    $('export-png').onclick=()=>{
      const face=renderer.focusFace,zoom=renderer.zoom;renderer.focusFace=false;renderer.zoom=1;renderer.update(values);renderer.draw();
      $('turtle').toBlob(blob=>{if(blob)download(blob,'turtle-expression.png');else message('PNG export failed. Please try again.',true);},'image/png');
      renderer.focusFace=face;renderer.zoom=zoom;schedule();
    };
    try{const saved=localStorage.getItem(storageKey());if(saved)applyParameters(JSON.parse(saved));}catch(e){/* Ignore stale/invalid saved settings. */}
    sync();renderer=new TurtleRenderer($('turtle'),asset);await renderer.load();renderer.update(values);renderer.draw();$('loading').remove();$('export-png').disabled=false;$('save-settings').disabled=false;$('status').textContent='Ready · every parameter is live';
    document.addEventListener('turtle-render-error',event=>message(event.detail,true));
    // Small explicit API for deterministic renderer verification and integrations.
    window.turtleStudio={ready:true,engine:'Inox2D',renderer,asset,values,setParameter,applyParameters,draw:()=>{renderer.update(values);renderer.draw();}};
  }catch(e){if($('loading'))$('loading').textContent=e.message;message(e.message,true);console.error(e);window.turtleStudio={ready:false,error:e.message};}
})();
