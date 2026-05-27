function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,m=_.trustedTypes,f=m?m.emptyScript:"",g=_.reactiveElementPolyfillSupport,y=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??v)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[y("elementProperties")]=new Map,A[y("finalized")]=new Map,g?.({ReactiveElement:A}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,S=w.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+k,P=`<${T}>`,D=document,M=()=>D.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,z="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,j=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,I=/"/g,B=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),J=new WeakMap,K=D.createTreeWalker(D,129);function Z(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const F=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=H;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(n.lastIndex=h,c=n.exec(i),null!==c);)h=n.lastIndex,n===H?"!--"===c[1]?n=N:void 0!==c[1]?n=R:void 0!==c[2]?(B.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=j):void 0!==c[3]&&(n=j):n===j?">"===c[0]?(n=r??H,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?j:'"'===c[3]?I:L):n===I||n===L?n=j:n===N||n===R?n=H:(n=j,r=void 0);const d=n===j&&t[e+1].startsWith("/>")?" ":"";o+=n===H?i+P:l>=0?(s.push(a),i.slice(0,l)+C+i.slice(l)+k+d):i+k+(-2===l?e:d)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[c,l]=F(t,e);if(this.el=G.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=l[o++],i=s.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),K.nextNode(),a.push({type:2,index:++r});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:r}),t+=k.length-1}r++}}static createElement(t,e){const i=D.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===V)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??D).importNode(e,!0);K.currentNode=s;let r=K.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new Y(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=K.nextNode(),o++)}return K.currentNode=D,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),U(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new G(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Y(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Q(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==V,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Q(this,s[i+n],e,n),a===V&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??W)===V)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(G,Y),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;let at=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Y(e.insertBefore(M(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ct=nt.litElementPolyfillSupport;ct?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:v},dt=(t=ht,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const _t=1;class mt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const ft=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends mt{constructor(t){if(super(t),t.type!==_t||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return V}}),gt="smart-alarm-card",yt="smart-alarm-card-editor",$t="smart_alarm",vt="disabled",bt="triggered",At="snoozed",wt=["L","M","M","J","V","S","D"],xt=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],St=n`
  ha-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* Live clock */
  .clock {
    text-align: center;
    line-height: 1;
  }
  .clock-time {
    font-size: 3.2em;
    font-weight: 300;
    font-variant-numeric: tabular-nums;
    letter-spacing: 2px;
    color: var(--primary-text-color);
  }
  .clock-ampm {
    font-size: 0.4em;
    font-weight: 500;
    margin-left: 6px;
    vertical-align: super;
    color: var(--secondary-text-color);
  }
  .clock-date {
    font-size: 0.85em;
    color: var(--secondary-text-color);
    margin-top: 2px;
    text-transform: capitalize;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .header-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .title {
    font-size: 1.1em;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-text-color);
  }
  .title ha-icon {
    --mdc-icon-size: 20px;
  }
  .next-trigger {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }

  .state-triggered .title,
  .state-triggered .next-trigger,
  .state-triggered .clock-time {
    color: var(--error-color);
  }
  .state-snoozed .title,
  .state-snoozed .next-trigger {
    color: var(--warning-color);
  }
  .state-disabled .clock-time {
    color: var(--disabled-text-color);
  }

  .divider {
    height: 1px;
    background: var(--divider-color);
    margin: 2px 0;
  }

  /* Day selector */
  .day-row {
    display: flex;
    gap: 6px;
    justify-content: space-between;
  }
  .day {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 2px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    background: var(--secondary-background-color);
    transition: all 120ms ease-out;
    user-select: none;
  }
  .day.selected {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
  .day.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
  }
  .day .dow {
    font-size: 0.8em;
    font-weight: 600;
  }
  .day .dtime {
    font-size: 0.7em;
    font-variant-numeric: tabular-nums;
    opacity: 0.9;
  }
  .day .dtime.off {
    opacity: 0.4;
  }

  /* Selected-day editor */
  .editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .editor-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .editor-day {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .time-row {
    display: flex;
    justify-content: center;
    padding: 4px 0;
  }
  .time-native {
    font-size: 1.4em;
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .slider-label {
    width: 52px;
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
  .slider-row input[type="range"] {
    flex: 1;
    accent-color: var(--primary-color);
  }
  .slider-value {
    width: 56px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-size: 1em;
    color: var(--primary-text-color);
  }
  .day-off-hint {
    font-size: 0.85em;
    color: var(--secondary-text-color);
    font-style: italic;
  }

  /* Actions */
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .action-btn {
    flex: 1;
    min-width: 90px;
    padding: 10px 12px;
    border-radius: 12px;
    border: none;
    font-size: 0.95em;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: opacity 150ms ease-out;
  }
  .action-btn:active {
    opacity: 0.7;
  }
  .action-btn.test {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }
  .action-btn.snooze {
    background: var(--warning-color);
    color: var(--text-primary-color);
  }
  .action-btn.stop {
    background: var(--error-color);
    color: var(--text-primary-color);
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 var(--error-color);
    }
    50% {
      box-shadow: 0 0 0 5px transparent;
    }
  }
  .state-triggered ha-card {
    animation: pulse 1.5s ease-in-out infinite;
  }
`;console.info("%c  SMART-ALARM-CARD  %c  v0.2.0  ","color: white; background: #0288d1; font-weight: 700","color: #0288d1; background: white; font-weight: 700");const Et=window;Et.customCards=Et.customCards||[],Et.customCards.push({type:gt,name:"Smart Alarm Card",description:"Bedside-clock style control for a Smart Alarm.",preview:!1});let Ct;let kt=class extends at{constructor(){super(...arguments),this._selectedDay=function(t){return(t.getDay()+6)%7}(new Date),this._now=new Date,this._onToggleEnable=()=>{this._call(this._state()===vt?"enable":"disable")},this._onSelectDay=t=>{this._selectedDay=t},this._onToggleSelectedDay=()=>{const t=this._selectedDay;this._dayTime(t)?this._call("clear_day",{day:t}):this._call("set_day_time",{day:t,time:"07:00"})},this._onDayTimeChanged=t=>{const e=t.detail.value;e&&this._call("set_day_time",{day:this._selectedDay,time:e.slice(0,5)})},this._onNativeTime=t=>{const e=t.target.value;e&&this._call("set_day_time",{day:this._selectedDay,time:e})},this._onTestNow=()=>this._call("trigger_now"),this._onSnooze=()=>this._call("snooze"),this._onStop=()=>this._call("stop")}static async getConfigElement(){return await Promise.resolve().then(function(){return Mt}),document.createElement(yt)}static getStubConfig(){return{type:`custom:${gt}`,entity:""}}setConfig(t){if(!t?.entity)throw new Error("entity is required");this._config=t}getCardSize(){return 5}connectedCallback(){super.connectedCallback(),this._clockTimer=window.setInterval(()=>{this._now=new Date},1e3),async function(){if(!customElements.get("ha-time-input"))return Ct||(Ct=(async()=>{const t=await(window.loadCardHelpers?.());if(!t)return;const e=await t.createCardElement({type:"entities",entities:[]});await(e.constructor.getConfigElement?.())})(),Ct)}().then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._clockTimer&&window.clearInterval(this._clockTimer)}_use12h(){return"12h"===this._config?.time_format}_state(){return this.hass?.states[this._config.entity]?.state}_attrs(){return this.hass?.states[this._config.entity]?.attributes||{}}_name(){if(this._config?.name)return this._config.name;const t=this.hass?.states[this._config.entity]?.attributes?.friendly_name;return t||this._config?.entity||"Alarm"}_schedule(){return this._attrs().schedule??{}}_dayTime(t){return this._schedule()[String(t)]}_fmtTime(t){const[e,i]=t.split(":").map(t=>parseInt(t,10));if(this._use12h()){const t=e<12?"AM":"PM";return`${e%12==0?12:e%12}:${String(i).padStart(2,"0")} ${t}`}return`${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`}_formatNextTrigger(t){if(!t)return"—";const e=new Date(t);if(Number.isNaN(e.getTime()))return"—";return`${e.toLocaleDateString(void 0,{weekday:"short",day:"2-digit",month:"short"})} · ${e.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",hour12:this._use12h()})}`}_call(t,e={}){this.hass.callService($t,t,{entity_id:this._config.entity,...e})}render(){if(!this._config||!this.hass)return W;const t=this._state();if(void 0===t)return q`<ha-card><div class="header">Entity not found</div></ha-card>`;const e=this._attrs(),i=t===bt||t===At,s=ft({[`state-${t}`]:!0});return q`
      <ha-card class=${s}>
        ${this._renderClock(t)}
        ${this._config.hide_header?W:this._renderHeader(t,e)}
        <div class="divider"></div>
        ${this._config.hide_days?W:this._renderDays()}
        ${this._config.hide_days?W:this._renderEditor()}
        ${this._renderActions(i,t===vt)}
      </ha-card>
    `}_renderClock(t){const e=this._now.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",hour12:this._use12h()}),i=this._now.toLocaleDateString(void 0,{weekday:"long",day:"2-digit",month:"long"});return q`
      <div class="clock">
        <div class="clock-time">
          <ha-icon
            icon=${t===bt?"mdi:bell-ring":t===At?"mdi:alarm-snooze":t===vt?"mdi:alarm-off":"mdi:alarm"}
            style="--mdc-icon-size:28px;vertical-align:middle;margin-right:8px;"
          ></ha-icon>${e}
        </div>
        <div class="clock-date">${i}</div>
      </div>
    `}_renderHeader(t,e){return q`
      <div class="header">
        <div class="header-info">
          <div class="title">${this._name()}</div>
          <div class="next-trigger">
            ${t===vt?"Désactivé":q`Prochain : ${this._formatNextTrigger(e.next_trigger)}`}
          </div>
        </div>
        <ha-switch
          .checked=${t!==vt}
          @change=${this._onToggleEnable}
        ></ha-switch>
      </div>
    `}_renderDays(){return q`
      <div class="day-row">
        ${wt.map((t,e)=>{const i=this._dayTime(e),s=ft({day:!0,selected:e===this._selectedDay,active:!!i});return q`
            <div
              class=${s}
              title=${xt[e]}
              role="button"
              tabindex="0"
              @click=${()=>this._onSelectDay(e)}
              @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||this._onSelectDay(e)}}
            >
              <span class="dow">${t}</span>
              <span class="dtime ${i?"":"off"}"
                >${i?this._fmtTime(i):"—"}</span
              >
            </div>
          `})}
      </div>
    `}_renderEditor(){const t=this._selectedDay,e=this._dayTime(t),i=!!e,s={...this.hass.locale,time_format:this._use12h()?"12":"24"};return q`
      <div class="editor">
        <div class="editor-head">
          <span class="editor-day">${xt[t]}</span>
          <ha-switch
            .checked=${i}
            @change=${this._onToggleSelectedDay}
          ></ha-switch>
        </div>
        ${i?q`
              <div class="time-row">
                ${customElements.get("ha-time-input")?q`
                      <ha-time-input
                        .locale=${s}
                        .value=${`${e}:00`}
                        @value-changed=${this._onDayTimeChanged}
                      ></ha-time-input>
                    `:q`
                      <input
                        class="time-native"
                        type="time"
                        .value=${e}
                        @change=${this._onNativeTime}
                      />
                    `}
              </div>
            `:q`<div class="day-off-hint">
              Jour désactivé — active-le pour régler l'heure.
            </div>`}
      </div>
    `}_renderActions(t,e){return q`
      <div class="actions">
        ${this._config.hide_test_button||e?W:q`
              <button class="action-btn test" @click=${this._onTestNow}>
                <ha-icon icon="mdi:test-tube"></ha-icon>Tester
              </button>
            `}
        ${t?q`
              <button class="action-btn snooze" @click=${this._onSnooze}>
                <ha-icon icon="mdi:alarm-snooze"></ha-icon>Snooze
              </button>
              <button class="action-btn stop" @click=${this._onStop}>
                <ha-icon icon="mdi:stop-circle"></ha-icon>Arrêter
              </button>
            `:W}
      </div>
    `}};kt.styles=St,t([pt({attribute:!1})],kt.prototype,"hass",void 0),t([ut()],kt.prototype,"_config",void 0),t([ut()],kt.prototype,"_selectedDay",void 0),t([ut()],kt.prototype,"_now",void 0),kt=t([lt(gt)],kt);const Tt=[{name:"entity",required:!0,selector:{entity:{integration:$t,domain:"sensor"}}},{name:"name",selector:{text:{}}},{name:"time_format",selector:{select:{mode:"dropdown",options:[{value:"24h",label:"24-hour (07:00)"},{value:"12h",label:"12-hour (7:00 AM)"}]}}},{name:"hide_header",selector:{boolean:{}}},{name:"hide_days",selector:{boolean:{}}},{name:"hide_test_button",selector:{boolean:{}}}],Pt={entity:"Alarm entity",name:"Display name (optional)",time_format:"Time format",hide_header:"Hide header",hide_days:"Hide days row",hide_test_button:"Hide test button"};let Dt=class extends at{constructor(){super(...arguments),this._computeLabel=t=>Pt[t.name]??t.name,this._valueChanged=t=>{const e={...t.detail.value};for(const t of["name","time_format"])e[t]||delete e[t];for(const t of["hide_header","hide_days","hide_test_button"])e[t]||delete e[t];this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))},this._openIntegration=()=>{const t=`/config/integrations/integration/${$t}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed"))}}setConfig(t){this._config=t}render(){return this._config&&this.hass?q`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Tt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>

      <div class="advanced">
        <p class="hint">
          Snooze duration and the optional condition entity are configured on
          the integration itself (per alarm).
        </p>
        <ha-button @click=${this._openIntegration}>
          <ha-icon icon="mdi:cog" slot="icon"></ha-icon>
          Open integration settings
        </ha-button>
      </div>
    `:W}};Dt.styles=n`
    .advanced {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .hint {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin: 0 0 8px;
    }
  `,t([pt({attribute:!1})],Dt.prototype,"hass",void 0),t([ut()],Dt.prototype,"_config",void 0),Dt=t([lt(yt)],Dt);var Mt=Object.freeze({__proto__:null,get SmartAlarmCardEditor(){return Dt}});export{kt as SmartAlarmCard};
