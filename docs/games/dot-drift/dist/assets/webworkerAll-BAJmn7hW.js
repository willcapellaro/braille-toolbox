import{E as m,U as ct,T as de,b as dt,a2 as w,a3 as U,t as C,ac as he,Z as I,ad as D,O as ht,n as Y,ae as ft,af as fe,_ as Se,ag as W,ah as pt,ai as P,w as X,G as Pe,a as Fe,M as R,m as A,h as Be,F,a5 as ie,R as se,z as Re,d as O,B,D as ne,x as K,aj as gt,ak as ae,J as te,al as V,S as oe,o as Me,s as Ue,a7 as Ge,aa as ze,p as mt,q as xt,a8 as _t,a9 as yt,ab as bt,am as vt,an as Tt,ao as N,e as T,ap as wt}from"./original-game-DePWs98x.js";import{F as Ct,S as j,c as $,a as St,b as Pt,B as Ae}from"./colorToUniform-CuZOWssQ.js";import"./index-CYAJtKub.js";class ke{static init(e){Object.defineProperty(this,"resizeTo",{set(t){globalThis.removeEventListener("resize",this.queueResize),this._resizeTo=t,t&&(globalThis.addEventListener("resize",this.queueResize),this.resize())},get(){return this._resizeTo}}),this.queueResize=()=>{this._resizeTo&&(this._cancelResize(),this._resizeId=requestAnimationFrame(()=>this.resize()))},this._cancelResize=()=>{this._resizeId&&(cancelAnimationFrame(this._resizeId),this._resizeId=null)},this.resize=()=>{if(!this._resizeTo)return;this._cancelResize();let t,r;if(this._resizeTo===globalThis.window)t=globalThis.innerWidth,r=globalThis.innerHeight;else{const{clientWidth:i,clientHeight:s}=this._resizeTo;t=i,r=s}this.renderer.resize(t,r),this.render()},this._resizeId=null,this._resizeTo=null,this.resizeTo=e.resizeTo||null}static destroy(){globalThis.removeEventListener("resize",this.queueResize),this._cancelResize(),this._cancelResize=null,this.queueResize=null,this.resizeTo=null,this.resize=null}}ke.extension=m.Application;class De{static init(e){e=Object.assign({autoStart:!0,sharedTicker:!1},e),Object.defineProperty(this,"ticker",{set(t){this._ticker&&this._ticker.remove(this.render,this),this._ticker=t,t&&t.add(this.render,this,ct.LOW)},get(){return this._ticker}}),this.stop=()=>{this._ticker.stop()},this.start=()=>{this._ticker.start()},this._ticker=null,this.ticker=e.sharedTicker?de.shared:new de,e.autoStart&&this.start()}static destroy(){if(this._ticker){const e=this._ticker;this.ticker=null,e.destroy()}}}De.extension=m.Application;class Ft extends dt{constructor(){super(...arguments),this.chars=Object.create(null),this.lineHeight=0,this.fontFamily="",this.fontMetrics={fontSize:0,ascent:0,descent:0},this.baseLineOffset=0,this.distanceField={type:"none",range:0},this.pages=[],this.applyFillAsTint=!0,this.baseMeasurementFontSize=100,this.baseRenderedFontSize=100}get font(){return w(U,"BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."),this.fontFamily}get pageTextures(){return w(U,"BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."),this.pages}get size(){return w(U,"BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."),this.fontMetrics.fontSize}get distanceFieldRange(){return w(U,"BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."),this.distanceField.range}get distanceFieldType(){return w(U,"BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."),this.distanceField.type}destroy(e=!1){var t;this.emit("destroy",this),this.removeAllListeners();for(const r in this.chars)(t=this.chars[r].texture)==null||t.destroy();this.chars=null,e&&(this.pages.forEach(r=>r.texture.destroy(!0)),this.pages=null)}}const Oe=class Ie extends Ft{constructor(e){super(),this.resolution=1,this.pages=[],this._padding=0,this._measureCache=Object.create(null),this._currentChars=[],this._currentX=0,this._currentY=0,this._currentMaxCharHeight=0,this._currentPageIndex=-1,this._skipKerning=!1;const t={...Ie.defaultOptions,...e};this._textureSize=t.textureSize,this._mipmap=t.mipmap;const r=t.style.clone();t.overrideFill&&(r._fill.color=16777215,r._fill.alpha=1,r._fill.texture=C.WHITE,r._fill.fill=null),this.applyFillAsTint=t.overrideFill;const i=r.fontSize;r.fontSize=this.baseMeasurementFontSize;const s=he(r);t.overrideSize?r._stroke&&(r._stroke.width*=this.baseRenderedFontSize/i):r.fontSize=this.baseRenderedFontSize=i,this._style=r,this._skipKerning=t.skipKerning??!1,this.resolution=t.resolution??1,this._padding=t.padding??4,t.textureStyle&&(this._textureStyle=t.textureStyle instanceof I?t.textureStyle:new I(t.textureStyle)),this.fontMetrics=D.measureFont(s),this.lineHeight=r.lineHeight||this.fontMetrics.fontSize||r.fontSize}ensureCharacters(e){var b,x;const t=D.graphemeSegmenter(e).filter(g=>!this._currentChars.includes(g)).filter((g,p,v)=>v.indexOf(g)===p);if(!t.length)return;this._currentChars=[...this._currentChars,...t];let r;this._currentPageIndex===-1?r=this._nextPage():r=this.pages[this._currentPageIndex];let{canvas:i,context:s}=r.canvasAndContext,n=r.texture.source;const a=this._style;let u=this._currentX,l=this._currentY,d=this._currentMaxCharHeight;const c=this.baseRenderedFontSize/this.baseMeasurementFontSize,h=this._padding*c;let f=!1;const y=i.width/this.resolution,_=i.height/this.resolution;for(let g=0;g<t.length;g++){const p=t[g],v=D.measureText(p,a,i,!1);v.lineHeight=v.height;const S=v.width*c,G=Math.ceil((a.fontStyle==="italic"?2:1)*S),k=v.height*c,M=G+h*2,E=k+h*2;if(f=!1,p!==`
`&&p!=="\r"&&p!=="	"&&p!==" "&&(f=!0,d=Math.ceil(Math.max(E,d))),u+M>y&&(l+=d,d=E,u=0,l+d>_)){n.update();const z=this._nextPage();i=z.canvasAndContext.canvas,s=z.canvasAndContext.context,n=z.texture.source,u=0,l=0,d=0}const ut=S/c-(((b=a.dropShadow)==null?void 0:b.distance)??0)-(((x=a._stroke)==null?void 0:x.width)??0);if(this.chars[p]={id:p.codePointAt(0),xOffset:-this._padding,yOffset:-this._padding,xAdvance:ut,kerning:{}},f){this._drawGlyph(s,v,u+h,l+h,c,a);const z=n.width*c,ce=n.height*c,lt=new ht(u/z*n.width,l/ce*n.height,M/z*n.width,E/ce*n.height);this.chars[p].texture=new C({source:n,frame:lt}),u+=Math.ceil(M)}}n.update(),this._currentX=u,this._currentY=l,this._currentMaxCharHeight=d,this._skipKerning&&this._applyKerning(t,s)}get pageTextures(){return w(U,"BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."),this.pages}_applyKerning(e,t){const r=this._measureCache;for(let i=0;i<e.length;i++){const s=e[i];for(let n=0;n<this._currentChars.length;n++){const a=this._currentChars[n];let u=r[s];u||(u=r[s]=t.measureText(s).width);let l=r[a];l||(l=r[a]=t.measureText(a).width);let d=t.measureText(s+a).width,c=d-(u+l);c&&(this.chars[s].kerning[a]=c),d=t.measureText(s+a).width,c=d-(u+l),c&&(this.chars[a].kerning[s]=c)}}}_nextPage(){this._currentPageIndex++;const e=this.resolution,t=Y.getOptimalCanvasAndContext(this._textureSize,this._textureSize,e);this._setupContext(t.context,this._style,e);const r=e*(this.baseRenderedFontSize/this.baseMeasurementFontSize),i=new C({source:new ft({resource:t.canvas,resolution:r,alphaMode:"premultiply-alpha-on-upload",autoGenerateMipmaps:this._mipmap})});this._textureStyle&&(i.source.style=this._textureStyle);const s={canvasAndContext:t,texture:i};return this.pages[this._currentPageIndex]=s,s}_setupContext(e,t,r){t.fontSize=this.baseRenderedFontSize,e.scale(r,r),e.font=he(t),t.fontSize=this.baseMeasurementFontSize,e.textBaseline=t.textBaseline;const i=t._stroke,s=(i==null?void 0:i.width)??0;if(i&&(e.lineWidth=s,e.lineJoin=i.join,e.miterLimit=i.miterLimit,e.strokeStyle=fe(i,e)),t._fill&&(e.fillStyle=fe(t._fill,e)),t.dropShadow){const n=t.dropShadow,a=Se.shared.setValue(n.color).toArray(),u=n.blur*r,l=n.distance*r;e.shadowColor=`rgba(${a[0]*255},${a[1]*255},${a[2]*255},${n.alpha})`,e.shadowBlur=u,e.shadowOffsetX=Math.cos(n.angle)*l,e.shadowOffsetY=Math.sin(n.angle)*l}else e.shadowColor="black",e.shadowBlur=0,e.shadowOffsetX=0,e.shadowOffsetY=0}_drawGlyph(e,t,r,i,s,n){const a=t.text,u=t.fontProperties,l=n._stroke,d=((l==null?void 0:l.width)??0)*s,c=r+d/2,h=i-d/2,f=u.descent*s,y=t.lineHeight*s;let _=!1;n.stroke&&d&&(_=!0,e.strokeText(a,c,h+y-f));const{shadowBlur:b,shadowOffsetX:x,shadowOffsetY:g}=e;n._fill&&(_&&(e.shadowBlur=0,e.shadowOffsetX=0,e.shadowOffsetY=0),e.fillText(a,c,h+y-f)),_&&(e.shadowBlur=b,e.shadowOffsetX=x,e.shadowOffsetY=g)}destroy(){super.destroy();for(let e=0;e<this.pages.length;e++){const{canvasAndContext:t,texture:r}=this.pages[e];Y.returnCanvasAndContext(t),r.destroy(!0)}this.pages=null}};Oe.defaultOptions={textureSize:512,style:new W,mipmap:!0};let pe=Oe;function We(o,e,t,r){const i={width:0,height:0,offsetY:0,scale:e.fontSize/t.baseMeasurementFontSize,lines:[{width:0,charPositions:[],spaceWidth:0,spacesIndex:[],chars:[]}]};i.offsetY=t.baseLineOffset;let s=i.lines[0],n=null,a=!0;const u={width:0,start:0,index:0,positions:[],chars:[]},l=t.baseMeasurementFontSize/e.fontSize,d=e.letterSpacing*l,c=e.wordWrapWidth*l,h=e.lineHeight?e.lineHeight*l:t.lineHeight,f=e.wordWrap&&e.breakWords,y=x=>{const g=s.width;for(let p=0;p<u.index;p++){const v=x.positions[p];s.chars.push(x.chars[p]),s.charPositions.push(v+g)}s.width+=x.width,a=!1,u.width=0,u.index=0,u.chars.length=0},_=()=>{let x=s.chars.length-1;if(r){let g=s.chars[x];for(;g===" ";)s.width-=t.chars[g].xAdvance,g=s.chars[--x]}i.width=Math.max(i.width,s.width),s={width:0,charPositions:[],chars:[],spaceWidth:0,spacesIndex:[]},a=!0,i.lines.push(s),i.height+=h},b=x=>x-d>c;for(let x=0;x<o.length+1;x++){let g;const p=x===o.length;p||(g=o[x]);const v=t.chars[g]||t.chars[" "];if(/(?:\s)/.test(g)||g==="\r"||g===`
`||p){if(!a&&e.wordWrap&&b(s.width+u.width)?(_(),y(u),p||s.charPositions.push(0)):(u.start=s.width,y(u),p||s.charPositions.push(0)),g==="\r"||g===`
`)_();else if(!p){const M=v.xAdvance+(v.kerning[n]||0)+d;s.width+=M,s.spaceWidth=M,s.spacesIndex.push(s.charPositions.length),s.chars.push(g)}}else{const k=v.kerning[n]||0,M=v.xAdvance+k+d;f&&b(s.width+u.width+M)&&(y(u),_()),u.positions[u.index++]=u.width+k,u.chars.push(g),u.width+=M}n=g}return _(),e.align==="center"?Bt(i):e.align==="right"?Rt(i):e.align==="justify"&&Mt(i),i}function Bt(o){for(let e=0;e<o.lines.length;e++){const t=o.lines[e],r=o.width/2-t.width/2;for(let i=0;i<t.charPositions.length;i++)t.charPositions[i]+=r}}function Rt(o){for(let e=0;e<o.lines.length;e++){const t=o.lines[e],r=o.width-t.width;for(let i=0;i<t.charPositions.length;i++)t.charPositions[i]+=r}}function Mt(o){const e=o.width;for(let t=0;t<o.lines.length;t++){const r=o.lines[t];let i=0,s=r.spacesIndex[i++],n=0;const a=r.spacesIndex.length,l=(e-r.width)/a;for(let d=0;d<r.charPositions.length;d++)d===s&&(s=r.spacesIndex[i++],n+=l),r.charPositions[d]+=n}}function Ut(o){if(o==="")return[];typeof o=="string"&&(o=[o]);const e=[];for(let t=0,r=o.length;t<r;t++){const i=o[t];if(Array.isArray(i)){if(i.length!==2)throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${i.length}.`);if(i[0].length===0||i[1].length===0)throw new Error("[BitmapFont]: Invalid character delimiter.");const s=i[0].charCodeAt(0),n=i[1].charCodeAt(0);if(n<s)throw new Error("[BitmapFont]: Invalid character range.");for(let a=s,u=n;a<=u;a++)e.push(String.fromCharCode(a))}else e.push(...Array.from(i))}if(e.length===0)throw new Error("[BitmapFont]: Empty set when resolving characters.");return e}let L=0;class Gt{constructor(){this.ALPHA=[["a","z"],["A","Z"]," "],this.NUMERIC=[["0","9"]],this.ALPHANUMERIC=[["a","z"],["A","Z"],["0","9"]," "],this.ASCII=[[" ","~"]],this.defaultOptions={chars:this.ALPHANUMERIC,resolution:1,padding:4,skipKerning:!1,textureStyle:null},this.measureCache=pt(1e3)}getFont(e,t){var n;let r=`${t.fontFamily}-bitmap`,i=!0;if(t._fill.fill&&!t._stroke?(r+=t._fill.fill.styleKey,i=!1):(t._stroke||t.dropShadow)&&(r=`${t.styleKey}-bitmap`,i=!1),!P.has(r)){const a=Object.create(t);a.lineHeight=0;const u=new pe({style:a,overrideFill:i,overrideSize:!0,...this.defaultOptions});L++,L>50&&X("BitmapText",`You have dynamically created ${L} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``),u.once("destroy",()=>{L--,P.remove(r)}),P.set(r,u)}const s=P.get(r);return(n=s.ensureCharacters)==null||n.call(s,e),s}getLayout(e,t,r=!0){const i=this.getFont(e,t),s=`${e}-${t.styleKey}-${r}`;if(this.measureCache.has(s))return this.measureCache.get(s);const n=D.graphemeSegmenter(e),a=We(n,t,i,r);return this.measureCache.set(s,a),a}measureText(e,t,r=!0){return this.getLayout(e,t,r)}install(...e){var l,d,c,h;let t=e[0];typeof t=="string"&&(t={name:t,style:e[1],chars:(l=e[2])==null?void 0:l.chars,resolution:(d=e[2])==null?void 0:d.resolution,padding:(c=e[2])==null?void 0:c.padding,skipKerning:(h=e[2])==null?void 0:h.skipKerning},w(U,"BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));const r=t==null?void 0:t.name;if(!r)throw new Error("[BitmapFontManager] Property `name` is required.");t={...this.defaultOptions,...t};const i=t.style,s=i instanceof W?i:new W(i),n=t.dynamicFill??this._canUseTintForStyle(s),a=new pe({style:s,overrideFill:n,skipKerning:t.skipKerning,padding:t.padding,resolution:t.resolution,overrideSize:!1,textureStyle:t.textureStyle}),u=Ut(t.chars);return a.ensureCharacters(u.join("")),P.set(`${r}-bitmap`,a),a.once("destroy",()=>P.remove(`${r}-bitmap`)),a}uninstall(e){const t=`${e}-bitmap`,r=P.get(t);r&&r.destroy()}_canUseTintForStyle(e){return!e._stroke&&(!e.dropShadow||e.dropShadow.color===0)&&!e._fill.fill&&e._fill.color===16777215}}const zt=new Gt;var At=`in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,kt=`in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main() {
    finalColor = texture(uTexture, vTextureCoord);
}
`,ge=`struct GlobalFilterUniforms {
  uInputSize: vec4<f32>,
  uInputPixel: vec4<f32>,
  uInputClamp: vec4<f32>,
  uOutputFrame: vec4<f32>,
  uGlobalFrame: vec4<f32>,
  uOutputTexture: vec4<f32>,
};

@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

struct VSOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>
};

fn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition: vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, uv);
}
`;class Dt extends Ct{constructor(){const e=Pe.from({vertex:{source:ge,entryPoint:"mainVertex"},fragment:{source:ge,entryPoint:"mainFragment"},name:"passthrough-filter"}),t=Fe.from({vertex:At,fragment:kt,name:"passthrough-filter"});super({gpuProgram:e,glProgram:t})}}class Ee{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}Ee.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"filter"};const me=new R;function Ot(o,e){e.clear();const t=e.matrix;for(let r=0;r<o.length;r++){const i=o[r];if(i.globalDisplayStatus<7)continue;const s=i.renderGroup??i.parentRenderGroup;s!=null&&s.isCachedAsTexture?e.matrix=me.copyFrom(s.textureOffsetInverseTransform).append(i.worldTransform):s!=null&&s._parentCacheAsTextureRenderGroup?e.matrix=me.copyFrom(s._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(i.groupTransform):e.matrix=i.worldTransform,e.addBounds(i.bounds)}return e.matrix=t,e}const It=new ie({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:2*4,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class Wt{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new Re,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.globalFrame={x:0,y:0,width:0,height:0},this.firstEnabledIndex=-1,this.lastEnabledIndex=-1}}class Ve{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new A({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new Be({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,i=this._pushFilterData();i.skip=!1,i.filters=r,i.container=e.container,i.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,n=s.resolution,a=s.antialias;if(r.every(f=>!f.enabled)){i.skip=!0;return}const u=i.bounds;if(this._calculateFilterArea(e,u),this._calculateFilterBounds(i,t.renderTarget.rootViewPort,a,n,1),i.skip)return;const l=this._getPreviousFilterData(),d=this._findFilterResolution(n);let c=0,h=0;l&&(c=l.bounds.minX,h=l.bounds.minY),this._calculateGlobalFrame(i,c,h,d,s.width,s.height),this._setupFilterTextures(i,u,t,l)}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const i=e.source,s=i.resolution,n=i.antialias;if(t.every(f=>!f.enabled))return r.skip=!0,e;const a=r.bounds;if(a.addRect(e.frame),this._calculateFilterBounds(r,a.rectangle,n,s,0),r.skip)return e;const u=s;this._calculateGlobalFrame(r,0,0,u,i.width,i.height),r.outputRenderSurface=F.getOptimalTexture(a.width,a.height,r.resolution,r.antialias),r.backTexture=C.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const h=r.outputRenderSurface;return h.source.alphaMode="premultiplied-alpha",h}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&F.returnTexture(t.backTexture),F.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const i=e.colorTexture.source._resolution,s=F.getOptimalTexture(t.width,t.height,i,!1);let n=t.minX,a=t.minY;r&&(n-=r.minX,a-=r.minY),n=Math.floor(n*i),a=Math.floor(a*i);const u=Math.ceil(t.width*i),l=Math.ceil(t.height*i);return this.renderer.renderTarget.copyToTexture(e,s,{x:n,y:a},{width:u,height:l},{x:0,y:0}),s}applyFilter(e,t,r,i){const s=this.renderer,n=this._activeFilterData,u=n.outputRenderSurface===r,l=s.renderTarget.rootRenderTarget.colorTexture.source._resolution,d=this._findFilterResolution(l);let c=0,h=0;if(u){const y=this._findPreviousFilterOffset();c=y.x,h=y.y}this._updateFilterUniforms(t,r,n,c,h,d,u,i);const f=e.enabled?e:this._getPassthroughFilter();this._setupBindGroupsAndRender(f,t,s)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,i=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(R.shared),n=t.renderGroup||t.parentRenderGroup;return n&&n.cacheToLocalTransform&&s.prepend(n.cacheToLocalTransform),s.invert(),i.prepend(s),i.scale(1/t.texture.orig.width,1/t.texture.orig.height),i.translate(t.anchor.x,t.anchor.y),i}destroy(){var e;(e=this._passthroughFilter)==null||e.destroy(!0),this._passthroughFilter=null}_getPassthroughFilter(){return this._passthroughFilter??(this._passthroughFilter=new Dt),this._passthroughFilter}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const i=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(i,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:It,shader:e,state:e._state,topology:"triangle-list"}),r.type===se.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,i){if(e.backTexture=C.EMPTY,e.inputTexture=F.getOptimalTexture(t.width,t.height,e.resolution,e.antialias),e.blendRequired){r.renderTarget.finishRenderPass();const s=r.renderTarget.getRenderTarget(e.outputRenderSurface);e.backTexture=this.getBackTexture(s,t,i==null?void 0:i.bounds)}r.renderTarget.bind(e.inputTexture,!0),r.globalUniforms.push({offset:t})}_calculateGlobalFrame(e,t,r,i,s,n){const a=e.globalFrame;a.x=t*i,a.y=r*i,a.width=s*i,a.height=n*i}_updateFilterUniforms(e,t,r,i,s,n,a,u){const l=this._filterGlobalUniforms.uniforms,d=l.uOutputFrame,c=l.uInputSize,h=l.uInputPixel,f=l.uInputClamp,y=l.uGlobalFrame,_=l.uOutputTexture;a?(d[0]=r.bounds.minX-i,d[1]=r.bounds.minY-s):(d[0]=0,d[1]=0),d[2]=e.frame.width,d[3]=e.frame.height,c[0]=e.source.width,c[1]=e.source.height,c[2]=1/c[0],c[3]=1/c[1],h[0]=e.source.pixelWidth,h[1]=e.source.pixelHeight,h[2]=1/h[0],h[3]=1/h[1],f[0]=.5*h[2],f[1]=.5*h[3],f[2]=e.frame.width*c[2]-.5*h[2],f[3]=e.frame.height*c[3]-.5*h[3];const b=this.renderer.renderTarget.rootRenderTarget.colorTexture;y[0]=i*n,y[1]=s*n,y[2]=b.source.width*n,y[3]=b.source.height*n,t instanceof C&&(t.source.resource=null);const x=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind(t,!!u),t instanceof C?(_[0]=t.frame.width,_[1]=t.frame.height):(_[0]=x.width,_[1]=x.height),_[2]=x.isRoot?-1:1,this._filterGlobalUniforms.update()}_findFilterResolution(e){let t=this._filterStackIndex-1;for(;t>0&&this._filterStack[t].skip;)--t;return t>0&&this._filterStack[t].inputTexture?this._filterStack[t].inputTexture.source._resolution:e}_findPreviousFilterOffset(){let e=0,t=0,r=this._filterStackIndex;for(;r>0;){r--;const i=this._filterStack[r];if(!i.skip){e=i.bounds.minX,t=i.bounds.minY;break}}return{x:e,y:t}}_calculateFilterArea(e,t){if(e.renderables?Ot(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const i=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;i&&t.applyMatrix(i)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,i=e.bounds,s=e.filters,n=e.firstEnabledIndex,a=e.lastEnabledIndex;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),n===a)s[n].apply(this,r,e.outputRenderSurface,t);else{let u=e.inputTexture;const l=F.getOptimalTexture(i.width,i.height,u.source._resolution,!1);let d=l;for(let c=n;c<a;c++){const h=s[c];if(!h.enabled)continue;h.apply(this,u,d,!0);const f=u;u=d,d=f}s[a].apply(this,u,e.outputRenderSurface,t),F.returnTexture(l)}}_calculateFilterBounds(e,t,r,i,s){var x;const n=this.renderer,a=e.bounds,u=e.filters;let l=1/0,d=0,c=!0,h=!1,f=!1,y=!0,_=-1,b=-1;for(let g=0;g<u.length;g++){const p=u[g];if(!p.enabled)continue;if(_===-1&&(_=g),b=g,l=Math.min(l,p.resolution==="inherit"?i:p.resolution),d+=p.padding,p.antialias==="off"?c=!1:p.antialias==="inherit"&&c&&(c=r),p.clipToViewport||(y=!1),!!!(p.compatibleRenderers&n.type)){f=!1;break}if(p.blendRequired&&!(((x=n.backBuffer)==null?void 0:x.useBackBuffer)??!0)){X("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),f=!1;break}f=!0,h||(h=p.blendRequired)}if(!f){e.skip=!0;return}if(y&&a.fitBounds(0,t.width/i,0,t.height/i),a.scale(l).ceil().scale(1/l).pad((d|0)*s),!a.isPositive){e.skip=!0;return}e.antialias=c,e.resolution=l,e.blendRequired=h,e.firstEnabledIndex=_,e.lastEnabledIndex=b}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>0&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new Wt),this._filterStackIndex++,e}}Ve.extension={type:[m.WebGLSystem,m.WebGPUSystem],name:"filter"};const Le=class He extends ie{constructor(...e){let t=e[0]??{};t instanceof Float32Array&&(w(U,"use new MeshGeometry({ positions, uvs, indices }) instead"),t={positions:t,uvs:e[1],indices:e[2]}),t={...He.defaultOptions,...t};const r=t.positions||new Float32Array([0,0,1,0,1,1,0,1]);let i=t.uvs;i||(t.positions?i=new Float32Array(r.length):i=new Float32Array([0,0,1,0,1,1,0,1]));const s=t.indices||new Uint32Array([0,1,2,0,2,3]),n=t.shrinkBuffersToFit,a=new O({data:r,label:"attribute-mesh-positions",shrinkToFit:n,usage:B.VERTEX|B.COPY_DST}),u=new O({data:i,label:"attribute-mesh-uvs",shrinkToFit:n,usage:B.VERTEX|B.COPY_DST}),l=new O({data:s,label:"index-mesh-buffer",shrinkToFit:n,usage:B.INDEX|B.COPY_DST});super({attributes:{aPosition:{buffer:a,format:"float32x2",stride:2*4,offset:0},aUV:{buffer:u,format:"float32x2",stride:2*4,offset:0}},indexBuffer:l,topology:t.topology}),this.batchMode="auto"}get positions(){return this.attributes.aPosition.buffer.data}set positions(e){this.attributes.aPosition.buffer.data=e}get uvs(){return this.attributes.aUV.buffer.data}set uvs(e){this.attributes.aUV.buffer.data=e}get indices(){return this.indexBuffer.data}set indices(e){this.indexBuffer.data=e}};Le.defaultOptions={topology:"triangle-list",shrinkBuffersToFit:!1};let ue=Le;const xe="http://www.w3.org/2000/svg",_e="http://www.w3.org/1999/xhtml";class Ye{constructor(){this.svgRoot=document.createElementNS(xe,"svg"),this.foreignObject=document.createElementNS(xe,"foreignObject"),this.domElement=document.createElementNS(_e,"div"),this.styleElement=document.createElementNS(_e,"style");const{foreignObject:e,svgRoot:t,styleElement:r,domElement:i}=this;e.setAttribute("width","10000"),e.setAttribute("height","10000"),e.style.overflow="hidden",t.appendChild(e),e.appendChild(r),e.appendChild(i),this.image=ne.get().createImage()}destroy(){this.svgRoot.remove(),this.foreignObject.remove(),this.styleElement.remove(),this.domElement.remove(),this.image.src="",this.image.remove(),this.svgRoot=null,this.foreignObject=null,this.styleElement=null,this.domElement=null,this.image=null,this.canvasAndContext=null}}let ye;function Et(o,e,t,r){r||(r=ye||(ye=new Ye));const{domElement:i,styleElement:s,svgRoot:n}=r;i.innerHTML=`<style>${e.cssStyle};</style><div style='padding:0'>${o}</div>`,i.setAttribute("style","transform-origin: top left; display: inline-block"),t&&(s.textContent=t),document.body.appendChild(n);const a=i.getBoundingClientRect();n.remove();const u=e.padding*2;return{width:a.width-u,height:a.height-u}}class Vt{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{K.return(e)}),this.batches.length=0}}class Xe{constructor(e,t){this.state=j.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,i=this.renderer.graphicsContext.updateGpuContext(t);return!!(i.isBatchable||r!==i.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let i=0;i<r.length;i++){const s=r[i];s._batcher.updateElement(s)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const s=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const n=s.resources.localUniforms.uniforms;n.uTransformMatrix=e.groupTransform,n.uRound=t._roundPixels|e._roundPixels,$(e.groupColorAlpha,n.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,i=this._getGpuDataForRenderable(e).batches;for(let s=0;s<i.length;s++){const n=i[s];r.addToBatch(n,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new Vt;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,i=this.renderer.graphicsContext.getGpuContext(r),s=this.renderer._roundPixels|e._roundPixels;t.batches=i.batches.map(n=>{const a=K.get(gt);return n.copyTo(a),a.renderable=e,a.roundPixels=s,a})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}Xe.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"graphics"};const Ke=class je extends ue{constructor(...e){super({});let t=e[0]??{};typeof t=="number"&&(w(U,"PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"),t={width:t,height:e[1],verticesX:e[2],verticesY:e[3]}),this.build(t)}build(e){e={...je.defaultOptions,...e},this.verticesX=this.verticesX??e.verticesX,this.verticesY=this.verticesY??e.verticesY,this.width=this.width??e.width,this.height=this.height??e.height;const t=this.verticesX*this.verticesY,r=[],i=[],s=[],n=this.verticesX-1,a=this.verticesY-1,u=this.width/n,l=this.height/a;for(let c=0;c<t;c++){const h=c%this.verticesX,f=c/this.verticesX|0;r.push(h*u,f*l),i.push(h/n,f/a)}const d=n*a;for(let c=0;c<d;c++){const h=c%n,f=c/n|0,y=f*this.verticesX+h,_=f*this.verticesX+h+1,b=(f+1)*this.verticesX+h,x=(f+1)*this.verticesX+h+1;s.push(y,_,b,_,x,b)}this.buffers[0].data=new Float32Array(r),this.buffers[1].data=new Float32Array(i),this.indexBuffer.data=new Uint32Array(s),this.buffers[0].update(),this.buffers[1].update(),this.indexBuffer.update()}};Ke.defaultOptions={width:100,height:100,verticesX:10,verticesY:10};let Lt=Ke;class le{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let i=r;const s=this.texture.textureMatrix;return s.isSimple||(i=this._transformedUvs,(this._textureMatrixUpdateId!==s._updateID||this._uvUpdateId!==t._updateID)&&((!i||i.length<r.length)&&(i=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=s._updateID,this._uvUpdateId=t._updateID,s.multiplyUvs(r,i))),i}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class be{destroy(){}}class $e{constructor(e,t){this.localUniforms=new A({uTransformMatrix:{value:new R,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new Be({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,i=e.batched;if(t.batched=i,r!==i)return!0;if(i){const s=e._geometry;if(s.indices.length!==t.indexSize||s.positions.length!==t.vertexSize)return t.indexSize=s.indices.length,t.vertexSize=s.positions.length,!0;const n=this._getBatchableMesh(e);return n.texture.uid!==e._texture.uid&&(n._textureMatrixUpdateId=-1),!n._batcher.checkAndUpdateTexture(n,e._texture)}return!1}addRenderable(e,t){var s,n;const r=this.renderer.renderPipes.batch,i=this._getMeshData(e);if(e.didViewUpdate&&(i.indexSize=(s=e._geometry.indices)==null?void 0:s.length,i.vertexSize=(n=e._geometry.positions)==null?void 0:n.length),i.batched){const a=this._getBatchableMesh(e);a.setTexture(e._texture),a.geometry=e._geometry,r.addToBatch(a,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=ae(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),$(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new be),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:0,vertexSize:0},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new be),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new le;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}$e.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"mesh"};class Ht{execute(e,t){const r=e.state,i=e.renderer,s=t.shader||e.defaultShader;s.resources.uTexture=t.texture._source,s.resources.uniforms=e.localUniforms;const n=i.gl,a=e.getBuffers(t);i.shader.bind(s),i.state.set(r),i.geometry.bind(a.geometry,s.glProgram);const l=a.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?n.UNSIGNED_SHORT:n.UNSIGNED_INT;n.drawElements(n.TRIANGLES,t.particleChildren.length*6,l,0)}}class Yt{execute(e,t){const r=e.renderer,i=t.shader||e.defaultShader;i.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),i.groups[1]=r.texture.getTextureBindGroup(t.texture);const s=e.state,n=e.getBuffers(t);r.encoder.draw({geometry:n.geometry,shader:t.shader||e.defaultShader,state:s,size:t.particleChildren.length*6})}}function ve(o,e=null){const t=o*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,i=0;r<t;r+=6,i+=4)e[r+0]=i+0,e[r+1]=i+1,e[r+2]=i+2,e[r+3]=i+0,e[r+4]=i+2,e[r+5]=i+3;return e}function Xt(o){return{dynamicUpdate:Te(o,!0),staticUpdate:Te(o,!1)}}function Te(o,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const s in o){const n=o[s];if(e!==n.dynamic)continue;t.push(`offset = index + ${r}`),t.push(n.code);const a=te(n.format);r+=a.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const i=t.join(`
`);return new Function("ps","f32v","u32v",i)}class Kt{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let i=0,s=0;for(const d in r){const c=r[d],h=te(c.format);c.dynamic?s+=h.stride:i+=h.stride}this._dynamicStride=s/4,this._staticStride=i/4,this.staticAttributeBuffer=new V(t*4*i),this.dynamicAttributeBuffer=new V(t*4*s),this.indexBuffer=ve(t);const n=new ie;let a=0,u=0;this._staticBuffer=new O({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:B.VERTEX|B.COPY_DST}),this._dynamicBuffer=new O({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:B.VERTEX|B.COPY_DST});for(const d in r){const c=r[d],h=te(c.format);c.dynamic?(n.addAttribute(c.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:a*4,format:c.format}),a+=h.size):(n.addAttribute(c.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:u*4,format:c.format}),u+=h.size)}n.addIndex(this.indexBuffer);const l=this.getParticleUpdate(r);this._dynamicUpload=l.dynamicUpdate,this._staticUpload=l.staticUpdate,this.geometry=n}getParticleUpdate(e){const t=jt(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return Xt(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new V(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new V(this._size*this._dynamicStride*4*4),this.indexBuffer=ve(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const i=this.staticAttributeBuffer;this._staticUpload(e,i.float32View,i.uint32View),this._staticBuffer.setDataWithSize(i.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function jt(o){const e=[];for(const t in o){const r=o[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var $t=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,Nt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,we=`
struct ParticleUniforms {
  uTranslationMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uRound:f32,
  uResolution:vec2<f32>,
};

fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
{
  return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   var position = vec4((uniforms.uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

   if(uniforms.uRound == 1.0) {
       position = vec4(roundPixels(position.xy, uniforms.uResolution), position.zw);
   }

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class qt extends oe{constructor(){const e=Fe.from({vertex:Nt,fragment:$t}),t=Pe.from({fragment:{source:we,entryPoint:"mainFragment"},vertex:{source:we,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:C.WHITE.source,uSampler:new I({}),uniforms:{uTranslationMatrix:{value:new R,type:"mat3x3<f32>"},uColor:{value:new Se(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class Ne{constructor(e,t){this.state=j.for2d(),this.localUniforms=new A({uTranslationMatrix:{value:new R,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new qt,this.state=j.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new Kt({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,i=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const s=this.state;i.update(t,e._childrenDirty),e._childrenDirty=!1,s.blendMode=ae(e.blendMode,e.texture._source);const n=this.localUniforms.uniforms,a=n.uTranslationMatrix;e.worldTransform.copyTo(a),a.prepend(r.globalUniforms.globalUniformData.projectionMatrix),n.uResolution=r.globalUniforms.globalUniformData.resolution,n.uRound=r._roundPixels|e._roundPixels,$(e.groupColorAlpha,n.uColor,0),this.adaptor.execute(this,e)}destroy(){this.renderer=null,this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class qe extends Ne{constructor(e){super(e,new Ht)}}qe.extension={type:[m.WebGLPipes],name:"particle"};class Qe extends Ne{constructor(e){super(e,new Yt)}}Qe.extension={type:[m.WebGPUPipes],name:"particle"};const Je=class Ze extends Lt{constructor(e={}){e={...Ze.defaultOptions,...e},super({width:e.width,height:e.height,verticesX:4,verticesY:4}),this.update(e)}update(e){var t,r;this.width=e.width??this.width,this.height=e.height??this.height,this._originalWidth=e.originalWidth??this._originalWidth,this._originalHeight=e.originalHeight??this._originalHeight,this._leftWidth=e.leftWidth??this._leftWidth,this._rightWidth=e.rightWidth??this._rightWidth,this._topHeight=e.topHeight??this._topHeight,this._bottomHeight=e.bottomHeight??this._bottomHeight,this._anchorX=(t=e.anchor)==null?void 0:t.x,this._anchorY=(r=e.anchor)==null?void 0:r.y,this.updateUvs(),this.updatePositions()}updatePositions(){const e=this.positions,{width:t,height:r,_leftWidth:i,_rightWidth:s,_topHeight:n,_bottomHeight:a,_anchorX:u,_anchorY:l}=this,d=i+s,c=t>d?1:t/d,h=n+a,f=r>h?1:r/h,y=Math.min(c,f),_=u*t,b=l*r;e[0]=e[8]=e[16]=e[24]=-_,e[2]=e[10]=e[18]=e[26]=i*y-_,e[4]=e[12]=e[20]=e[28]=t-s*y-_,e[6]=e[14]=e[22]=e[30]=t-_,e[1]=e[3]=e[5]=e[7]=-b,e[9]=e[11]=e[13]=e[15]=n*y-b,e[17]=e[19]=e[21]=e[23]=r-a*y-b,e[25]=e[27]=e[29]=e[31]=r-b,this.getBuffer("aPosition").update()}updateUvs(){const e=this.uvs;e[0]=e[8]=e[16]=e[24]=0,e[1]=e[3]=e[5]=e[7]=0,e[6]=e[14]=e[22]=e[30]=1,e[25]=e[27]=e[29]=e[31]=1;const t=1/this._originalWidth,r=1/this._originalHeight;e[2]=e[10]=e[18]=e[26]=t*this._leftWidth,e[9]=e[11]=e[13]=e[15]=r*this._topHeight,e[4]=e[12]=e[20]=e[28]=1-t*this._rightWidth,e[17]=e[19]=e[21]=e[23]=1-r*this._bottomHeight,this.getBuffer("aUV").update()}};Je.defaultOptions={width:100,height:100,leftWidth:10,topHeight:10,rightWidth:10,bottomHeight:10,originalWidth:100,originalHeight:100};let Qt=Je;class Jt extends le{constructor(){super(),this.geometry=new Qt}destroy(){this.geometry.destroy()}}class et{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new Jt,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}et.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"nineSliceSprite"};const Zt={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},er={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let q,Q;class tr extends oe{constructor(){q??(q=Me({name:"tiling-sprite-shader",bits:[St,Zt,Ue]})),Q??(Q=Ge({name:"tiling-sprite-shader",bits:[Pt,er,ze]}));const e=new A({uMapCoord:{value:new R,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new R,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:Q,gpuProgram:q,resources:{localUniforms:new A({uTransformMatrix:{value:new R,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:C.EMPTY.source,uSampler:C.EMPTY.source.style}})}updateUniforms(e,t,r,i,s,n){const a=this.resources.tilingUniforms,u=n.width,l=n.height,d=n.textureMatrix,c=a.uniforms.uTextureTransform;c.set(r.a*u/e,r.b*u/t,r.c*l/e,r.d*l/t,r.tx/e,r.ty/t),c.invert(),a.uniforms.uMapCoord=d.mapCoord,a.uniforms.uClampFrame=d.uClampFrame,a.uniforms.uClampOffset=d.uClampOffset,a.uniforms.uTextureTransform=c,a.uniforms.uSizeAnchor[0]=e,a.uniforms.uSizeAnchor[1]=t,a.uniforms.uSizeAnchor[2]=i,a.uniforms.uSizeAnchor[3]=s,n&&(this.resources.uTexture=n.source,this.resources.uSampler=n.source.style)}}class rr extends ue{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function ir(o,e){const t=o.anchor.x,r=o.anchor.y;e[0]=-t*o.width,e[1]=-r*o.height,e[2]=(1-t)*o.width,e[3]=-r*o.height,e[4]=(1-t)*o.width,e[5]=(1-r)*o.height,e[6]=-t*o.width,e[7]=(1-r)*o.height}function sr(o,e,t,r){let i=0;const s=o.length/e,n=r.a,a=r.b,u=r.c,l=r.d,d=r.tx,c=r.ty;for(t*=e;i<s;){const h=o[t],f=o[t+1];o[t]=n*h+u*f+d,o[t+1]=a*h+l*f+c,t+=e,i++}}function nr(o,e){const t=o.texture,r=t.frame.width,i=t.frame.height;let s=0,n=0;o.applyAnchorToTexture&&(s=o.anchor.x,n=o.anchor.y),e[0]=e[6]=-s,e[2]=e[4]=1-s,e[1]=e[3]=-n,e[5]=e[7]=1-n;const a=R.shared;a.copyFrom(o._tileTransform.matrix),a.tx/=o.width,a.ty/=o.height,a.invert(),a.scale(o.width/r,o.height/i),sr(e,2,0,a)}const H=new rr;class ar{constructor(){this.canBatch=!0,this.geometry=new ue({indices:H.indices.slice(),positions:H.positions.slice(),uvs:H.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class tt{constructor(e){this._state=j.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const i=t.canBatch;if(i&&i===r){const{batchableMesh:s}=t;return!s._batcher.checkAndUpdateTexture(s,e.texture)}return r!==i}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const i=this._getTilingSpriteData(e),{geometry:s,canBatch:n}=i;if(n){i.batchableMesh||(i.batchableMesh=new le);const a=i.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),a.geometry=s,a.renderable=e,a.transform=e.groupTransform,a.setTexture(e._texture)),a.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(a,t)}else r.break(t),i.shader||(i.shader=new tr),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,$(e.groupColorAlpha,r.uColor,0),this._state.blendMode=ae(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:H,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:i}=t;e.didViewUpdate&&this._updateBatchableMesh(e),i._batcher.updateElement(i)}else if(e.didViewUpdate){const{shader:i}=t;i.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new ar;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,i=e.texture.source.style;i.addressMode!=="repeat"&&(i.addressMode="repeat",i.update()),nr(e,r.uvs),ir(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let i=!0;return this._renderer.type===se.WEBGL&&(i=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(i||r.source.isPowerOfTwo),t.canBatch}}tt.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"tilingSprite"};const or={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},ur={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},lr={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},cr={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let J,Z;class dr extends oe{constructor(e){const t=new A({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new R,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});J??(J=Me({name:"sdf-shader",bits:[mt,xt(e),or,lr,Ue]})),Z??(Z=Ge({name:"sdf-shader",bits:[_t,yt(e),ur,cr,ze]})),super({glProgram:Z,gpuProgram:J,resources:{localUniforms:t,batchSamplers:bt(e)}})}}class hr extends vt{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class rt{constructor(e){this._renderer=e}validateRenderable(e){const t=this._getGpuBitmapText(e);return this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);Ce(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);Ce(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,i=zt.getFont(e.text,e._style);r.clear(),i.distanceField.type!=="none"&&(r.customShader||(r.customShader=new dr(this._renderer.limits.maxBatchableTextures)));const s=D.graphemeSegmenter(e.text),n=e._style;let a=i.baseLineOffset;const u=We(s,n,i,!0),l=n.padding,d=u.scale;let c=u.width,h=u.height+u.offsetY;n._stroke&&(c+=n._stroke.width/d,h+=n._stroke.width/d),r.translate(-e._anchor._x*c-l,-e._anchor._y*h-l).scale(d,d);const f=i.applyFillAsTint?n._fill.color:16777215;let y=i.fontMetrics.fontSize,_=i.lineHeight;n.lineHeight&&(y=n.fontSize/d,_=n.lineHeight/d);let b=(_-y)/2;b-i.baseLineOffset<0&&(b=0);for(let x=0;x<u.lines.length;x++){const g=u.lines[x];for(let p=0;p<g.charPositions.length;p++){const v=g.chars[p],S=i.chars[v];if(S!=null&&S.texture){const G=S.texture;r.texture(G,f||"black",Math.round(g.charPositions[p]+S.xOffset),Math.round(a+S.yOffset+b),G.orig.width,G.orig.height)}}a+=_}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new hr;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,i=P.get(`${r}-bitmap`),{a:s,b:n,c:a,d:u}=e.groupTransform,l=Math.sqrt(s*s+n*n),d=Math.sqrt(a*a+u*u),c=(Math.abs(l)+Math.abs(d))/2,h=i.baseRenderedFontSize/e._style.fontSize,f=c*i.distanceField.range*(1/h);t.customShader.resources.localUniforms.uniforms.uDistance=f}destroy(){this._renderer=null}}rt.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"bitmapText"};function Ce(o,e){e.groupTransform=o.groupTransform,e.groupColorAlpha=o.groupColorAlpha,e.groupColor=o.groupColor,e.groupBlendMode=o.groupBlendMode,e.globalDisplayStatus=o.globalDisplayStatus,e.groupTransform=o.groupTransform,e.localDisplayStatus=o.localDisplayStatus,e.groupAlpha=o.groupAlpha,e._roundPixels=o._roundPixels}class fr extends Ae{constructor(e){super(),this.generatingTexture=!1,this.currentKey="--",this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){const{htmlText:e}=this._renderer;e.getReferenceCount(this.currentKey)===null?e.returnTexturePromise(this.texturePromise):e.decreaseReferenceCount(this.currentKey),this._renderer.runners.resolutionChange.remove(this),this.texturePromise=null,this._renderer=null}}function re(o,e){const{texture:t,bounds:r}=o,i=e._style._getFinalPadding();Tt(r,e._anchor,t);const s=e._anchor._x*i*2,n=e._anchor._y*i*2;r.minX-=i-s,r.minY-=i-n,r.maxX-=i-s,r.maxY-=i-n}class it{constructor(e){this._renderer=e}validateRenderable(e){const t=this._getGpuText(e),r=e.styleKey;return t.currentKey!==r}addRenderable(e,t){const r=this._getGpuText(e);if(e._didTextUpdate){const i=e._autoResolution?this._renderer.resolution:e.resolution;(r.currentKey!==e.styleKey||e.resolution!==i)&&this._updateGpuText(e).catch(s=>{console.error(s)}),e._didTextUpdate=!1,re(r,e)}this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;const r=t.texturePromise;t.texturePromise=null,t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;let i=this._renderer.htmlText.getTexturePromise(e);r&&(i=i.finally(()=>{this._renderer.htmlText.decreaseReferenceCount(t.currentKey),this._renderer.htmlText.returnTexturePromise(r)})),t.texturePromise=i,t.currentKey=e.styleKey,t.texture=await i;const s=e.renderGroup||e.parentRenderGroup;s&&(s.structureDidChange=!0),t.generatingTexture=!1,re(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new fr(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=C.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}it.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"htmlText"};function pr(){const{userAgent:o}=ne.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(o)}const gr=new Re;function st(o,e,t,r){const i=gr;i.minX=0,i.minY=0,i.maxX=o.width/r|0,i.maxY=o.height/r|0;const s=F.getOptimalTexture(i.width,i.height,r,!1);return s.source.uploadMethodId="image",s.source.resource=o,s.source.alphaMode="premultiply-alpha-on-upload",s.frame.width=e/r,s.frame.height=t/r,s.source.emit("update",s.source),s.updateUvs(),s}function mr(o,e){const t=e.fontFamily,r=[],i={},s=/font-family:([^;"\s]+)/g,n=o.match(s);function a(u){i[u]||(r.push(u),i[u]=!0)}if(Array.isArray(t))for(let u=0;u<t.length;u++)a(t[u]);else a(t);n&&n.forEach(u=>{const l=u.split(":")[1].trim();a(l)});for(const u in e.tagStyles){const l=e.tagStyles[u].fontFamily;a(l)}return r}async function xr(o){const t=await(await ne.get().fetch(o)).blob(),r=new FileReader;return await new Promise((s,n)=>{r.onloadend=()=>s(r.result),r.onerror=n,r.readAsDataURL(t)})}async function _r(o,e){const t=await xr(e);return`@font-face {
        font-family: "${o.fontFamily}";
        font-weight: ${o.fontWeight};
        font-style: ${o.fontStyle};
        src: url('${t}');
    }`}const ee=new Map;async function yr(o){const e=o.filter(t=>P.has(`${t}-and-url`)).map(t=>{if(!ee.has(t)){const{entries:r}=P.get(`${t}-and-url`),i=[];r.forEach(s=>{const n=s.url,u=s.faces.map(l=>({weight:l.weight,style:l.style}));i.push(...u.map(l=>_r({fontWeight:l.weight,fontStyle:l.style,fontFamily:t},n)))}),ee.set(t,Promise.all(i).then(s=>s.join(`
`)))}return ee.get(t)});return(await Promise.all(e)).join(`
`)}function br(o,e,t,r,i){const{domElement:s,styleElement:n,svgRoot:a}=i;s.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${o}</div>`,s.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),n.textContent=r;const{width:u,height:l}=i.image;return a.setAttribute("width",u.toString()),a.setAttribute("height",l.toString()),new XMLSerializer().serializeToString(a)}function vr(o,e){const t=Y.getOptimalCanvasAndContext(o.width,o.height,e),{context:r}=t;return r.clearRect(0,0,o.width,o.height),r.drawImage(o,0,0),t}function Tr(o,e,t){return new Promise(async r=>{t&&await new Promise(i=>setTimeout(i,100)),o.onload=()=>{r()},o.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,o.crossOrigin="anonymous"})}class nt{constructor(e){this._activeTextures={},this._renderer=e,this._createCanvas=e.type===se.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getManagedTexture(e){const t=e.styleKey;if(this._activeTextures[t])return this._increaseReferenceCount(t),this._activeTextures[t].promise;const r=this._buildTexturePromise(e).then(i=>(this._activeTextures[t].texture=i,i));return this._activeTextures[t]={texture:null,promise:r,usageCount:1},r}getReferenceCount(e){var t;return((t=this._activeTextures[e])==null?void 0:t.usageCount)??null}_increaseReferenceCount(e){this._activeTextures[e].usageCount++}decreaseReferenceCount(e){const t=this._activeTextures[e];t&&(t.usageCount--,t.usageCount===0&&(t.texture?this._cleanUp(t.texture):t.promise.then(r=>{t.texture=r,this._cleanUp(t.texture)}).catch(()=>{X("HTMLTextSystem: Failed to clean texture")}),this._activeTextures[e]=null))}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:i,textureStyle:s}=e,n=K.get(Ye),a=mr(t,r),u=await yr(a),l=Et(t,r,u,n),d=Math.ceil(Math.ceil(Math.max(1,l.width)+r.padding*2)*i),c=Math.ceil(Math.ceil(Math.max(1,l.height)+r.padding*2)*i),h=n.image,f=2;h.width=(d|0)+f,h.height=(c|0)+f;const y=br(t,r,i,u,n);await Tr(h,y,pr()&&a.length>0);const _=h;let b;this._createCanvas&&(b=vr(h,i));const x=st(b?b.canvas:_,h.width-f,h.height-f,i);return s&&(x.source.style=s),this._createCanvas&&(this._renderer.texture.initSource(x.source),Y.returnCanvasAndContext(b)),K.return(n),x}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{X("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){F.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null;for(const e in this._activeTextures)this._activeTextures[e]&&this.returnTexturePromise(this._activeTextures[e].promise);this._activeTextures=null}}nt.extension={type:[m.WebGLSystem,m.WebGPUSystem,m.CanvasSystem],name:"htmlText"};class wr extends Ae{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){const{canvasText:e}=this._renderer;e.getReferenceCount(this.currentKey)>0?e.decreaseReferenceCount(this.currentKey):this.texture&&e.returnTexture(this.texture),this._renderer.runners.resolutionChange.remove(this),this._renderer=null}}class at{constructor(e){this._renderer=e}validateRenderable(e){const t=this._getGpuText(e),r=e.styleKey;return t.currentKey!==r?!0:e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);if(e._didTextUpdate){const i=e._autoResolution?this._renderer.resolution:e.resolution;(r.currentKey!==e.styleKey||e.resolution!==i)&&this._updateGpuText(e),e._didTextUpdate=!1,re(r,e)}this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.decreaseReferenceCount(t.currentKey),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=this._renderer.canvasText.getManagedTexture(e),t.currentKey=e.styleKey}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new wr(this._renderer);return t.currentKey="--",t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}at.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"text"};class ot{constructor(e){this._activeTextures={},this._renderer=e}getTexture(e,t,r,i){typeof e=="string"&&(w("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof W||(e.style=new W(e.style)),e.textureStyle instanceof I||(e.textureStyle=new I(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:s,style:n,textureStyle:a}=e,u=e.resolution??this._renderer.resolution,{frame:l,canvasAndContext:d}=N.getCanvasAndContext({text:s,style:n,resolution:u}),c=st(d.canvas,l.width,l.height,u);if(a&&(c.source.style=a),n.trim&&(l.pad(n.padding),c.frame.copyFrom(l),c.frame.scale(1/u),c.updateUvs()),n.filters){const h=this._applyFilters(c,n.filters);return this.returnTexture(c),N.returnCanvasAndContext(d),h}return this._renderer.texture.initSource(c._source),N.returnCanvasAndContext(d),c}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",F.returnTexture(e,!0)}renderTextToCanvas(){w("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}getManagedTexture(e){e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const t=e.styleKey;if(this._activeTextures[t])return this._increaseReferenceCount(t),this._activeTextures[t].texture;const r=this.getTexture({text:e.text,style:e.style,resolution:e._resolution,textureStyle:e.textureStyle});return this._activeTextures[t]={texture:r,usageCount:1},r}decreaseReferenceCount(e){const t=this._activeTextures[e];t.usageCount--,t.usageCount===0&&(this.returnTexture(t.texture),this._activeTextures[e]=null)}getReferenceCount(e){var t;return((t=this._activeTextures[e])==null?void 0:t.usageCount)??0}_increaseReferenceCount(e){this._activeTextures[e].usageCount++}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,i=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),i}destroy(){this._renderer=null;for(const e in this._activeTextures)this._activeTextures[e]&&this.returnTexture(this._activeTextures[e].texture);this._activeTextures=null}}ot.extension={type:[m.WebGLSystem,m.WebGPUSystem,m.CanvasSystem],name:"canvasText"};T.add(ke);T.add(De);T.add(Xe);T.add(wt);T.add($e);T.add(qe);T.add(Qe);T.add(ot);T.add(at);T.add(rt);T.add(nt);T.add(it);T.add(tt);T.add(et);T.add(Ve);T.add(Ee);
//# sourceMappingURL=webworkerAll-BAJmn7hW.js.map
