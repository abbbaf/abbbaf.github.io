import init,{Inochi2dRuntime} from './vendor/inochi2d.js';
let initialized;
// Compatibility mapping used by the upstream AITuber-OnAir Inox2D bridge:
// WebGL does not support desktop OpenGL's CLAMP_TO_BORDER texture mode.
let clampPatched=false;
function applyWebGLCompatibility(){
 if(clampPatched)return;
 const original=WebGL2RenderingContext.prototype.texParameteri;
 WebGL2RenderingContext.prototype.texParameteri=function(target,pname,param){
  return original.call(this,target,pname,((pname===0x2802||pname===0x2803)&&param===0x812d)?0x812f:param);
 };
 clampPatched=true;
}
/** Thin page integration only; parsing, deformations, interpolation, masks and rendering are Inox2D's. */
export class TurtleRenderer {
 constructor(canvas,asset){this.canvas=canvas;this.asset=asset;this.zoom=1;this.focusFace=false;this.timestamp=0;}
 async load(){
  applyWebGLCompatibility();
  initialized=initialized||init({module_or_path:new URL('./vendor/inochi2d_bg.wasm',import.meta.url)});await initialized;
  this.canvas.width=this.asset.width;this.canvas.height=this.asset.height;
  this.runtime=new Inochi2dRuntime(this.canvas);this.runtime.resize(this.asset.width,this.asset.height,1);
  this.runtime.load_model(this.asset.puppetBytes);
  this.gl=this.canvas.getContext('webgl2')||this.canvas.getContext('webgl');
  // Resolve each actual native parameter once; never silently omit unsupported controls.
  this.handles=new Map(this.asset.model.param.map(p=>[p.name,this.runtime.resolve_parameter_handle_by_name(p.name)]));
  this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();document.dispatchEvent(new CustomEvent('turtle-render-error',{detail:'Graphics were interrupted. Reload the page to restore the turtle.'}));});
 }
 update(values){
  for(const p of this.asset.model.param){const raw=values[p.name]===undefined?p.defaults:values[p.name];const v=Array.isArray(raw)?raw:[raw,0];this.runtime.set_parameter_vec2_by_handle(this.handles.get(p.name),v[0],(p.is_vec2?v[1]:0)||((v[0]===0)?Number.EPSILON:0));}
  // Inox2D's opacity binding is a TODO. Apply only that unsupported property
  // through the existing runtime API; deformations/interpolation/rendering stay native.
  for(const b of this.asset.compatibility.opacityBindings){
   const x=(values[b.parameter]-b.min)/(b.max-b.min);let i=0;while(i<b.points.length-2&&x>b.points[i+1])i++;
   const t=Math.max(0,Math.min(1,(x-b.points[i])/(b.points[i+1]-b.points[i])));
   this.runtime.set_part_opacity_by_name(b.nodeName,b.baseOpacity*(b.values[i]*(1-t)+b.values[i+1]*t));
  }
 }
 draw(){
  this.runtime.set_camera_transform(0,this.focusFace?-311:0,(this.focusFace?2.2:1)*this.zoom);
  // Deterministic expression view: no idle motions, tracking or automatic blinks.
  this.runtime.tick(this.timestamp);
 }
}
