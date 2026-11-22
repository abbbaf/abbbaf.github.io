/* Read UI parameter descriptions from the native puppet; all rigging stays in Inox2D. */
const turtlePuppetURL=new URL('puppet/turtle.inp.gz',document.currentScript.src);
window.turtleRigReady=(async()=>{
 const response=await fetch(turtlePuppetURL);
 if(!response.ok)throw Error('Could not load the turtle puppet ('+response.status+').');
 if(typeof DecompressionStream==='undefined')throw Error('Please use a current browser with gzip decompression support.');
 const bytes=new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 const magic=new TextDecoder().decode(bytes.subarray(0,8));
 if(magic!=='TRNSRTS\0')throw Error('This page expects an Inochi 0.8 native puppet.');
 const length=new DataView(bytes.buffer).getUint32(8,false);
 if(length>bytes.length-12)throw Error('The puppet file is incomplete.');
 const metadata=JSON.parse(new TextDecoder().decode(bytes.subarray(12,12+length)));
 const nodeNames=new Map();const nodes=new Map();
 const walk=node=>{nodes.set(node.uuid,node);nodeNames.set(node.uuid,node.name.replace(/\0+$/,''));for(const child of node.children||[])walk(child);};walk(metadata.nodes);
 const opacityBindings=[];
 for(const p of metadata.param)for(const binding of p.bindings){
  if(binding.param_name==='opacity')opacityBindings.push({parameter:p.name,nodeName:nodeNames.get(binding.node),baseOpacity:nodes.get(binding.node).opacity,points:p.axis_points[0],min:p.min[0],max:p.max[0],values:binding.values.map(row=>row[0])});
 }
 // Inox2D skips zero-opacity mask parts. A white Multiply mask is visually neutral
 // while retaining a drawable stencil source. Preserve the native exported file.
 let maskCompatibilityCount=0;
 const nativeTail=bytes.subarray(12+length);const textureCount=new DataView(nativeTail.buffer,nativeTail.byteOffset).getUint32(8,false);
 let needsOriginalMask=false;

 for(const node of nodes.values())for(const mask of node.masks||[]){
  const source=nodes.get(mask.source);
  if(source.opacity===0){source.opacity=1;source.blend_mode='Multiply';maskCompatibilityCount++;}
  if(source.mesh.uvs.some(x=>typeof x!=='number'||!Number.isFinite(x))){
   source.mesh.uvs=source.mesh.uvs.map(()=>.5);source.textures[0]=textureCount;needsOriginalMask=true;
  }
 }
 let runtimeTail=nativeTail;
 if(needsOriginalMask){
  // Preserve the original source rig's exact one-pixel white mask record.
  // Creator's atlas export divided by its zero UV span and emitted NaNs.
  const raw=atob(window.TURTLE_WHITE_MASK_RECORD);const record=Uint8Array.from(raw,x=>x.charCodeAt(0));
  let end=12;const view=new DataView(nativeTail.buffer,nativeTail.byteOffset);
  for(let i=0;i<textureCount;i++)end+=5+view.getUint32(end,false);
  runtimeTail=new Uint8Array(nativeTail.length+record.length);runtimeTail.set(nativeTail.subarray(0,end));runtimeTail.set(record,end);runtimeTail.set(nativeTail.subarray(end),end+record.length);new DataView(runtimeTail.buffer).setUint32(8,textureCount+1,false);
 }
 const payload=new TextEncoder().encode(JSON.stringify(metadata));
 const runtimeBytes=new Uint8Array(12+payload.length+runtimeTail.length);
 runtimeBytes.set(bytes.subarray(0,8));new DataView(runtimeBytes.buffer).setUint32(8,payload.length,false);runtimeBytes.set(payload,12);runtimeBytes.set(runtimeTail,12+payload.length);
 const parameters=metadata.param.map(({bindings,...parameter})=>parameter);
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 const sourceSHA256=Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
 return {width:1086,height:1448,source:'turtle.inp',sourceSHA256,model:{param:parameters},puppetBytes:runtimeBytes,compatibility:{opacityBindings,maskCompatibilityCount,restoredOriginalMask:needsOriginalMask},presets:window.TURTLE_PRESETS||[]};
})();
// Defer handling until the UI can display a useful error.
window.turtleRigReady.catch(()=>{});
