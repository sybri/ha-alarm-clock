function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:l,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,_=u.trustedTypes,f=_?_.emptyScript:"",g=u.reactiveElementPolyfillSupport,$=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...l(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:m).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??y)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[$("elementProperties")]=new Map,A[$("finalized")]=new Map,g?.({ReactiveElement:A}),(u.reactiveElementVersions??=[]).push("2.1.2");const b=globalThis,w=t=>t,x=b.trustedTypes,S=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,k=`<${P}>`,T=document,U=()=>T.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,H="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,z=/>/g,D=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,J=T.createTreeWalker(T,129);function F(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<i;e++){const i=t[e];let a,h,c=-1,l=0;for(;l<i.length&&(n.lastIndex=l,h=n.exec(i),null!==h);)l=n.lastIndex,n===N?"!--"===h[1]?n=R:void 0!==h[1]?n=z:void 0!==h[2]?(B.test(h[2])&&(r=RegExp("</"+h[2],"g")),n=D):void 0!==h[3]&&(n=D):n===D?">"===h[0]?(n=r??N,c=-1):void 0===h[1]?c=-2:(c=n.lastIndex-h[2].length,a=h[1],n=void 0===h[3]?D:'"'===h[3]?L:j):n===L||n===j?n=D:n===R||n===z?n=N:(n=D,r=void 0);const d=n===D&&t[e+1].startsWith("/>")?" ":"";o+=n===N?i+k:c>=0?(s.push(a),i.slice(0,c)+E+i.slice(c)+C+d):i+C+(-2===c?e:d)}return[F(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[h,c]=K(t,e);if(this.el=Z.createElement(h,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=c[o++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?it:Y}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),J.nextNode(),a.push({type:2,index:++r});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===q)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=G(t,r._$AS(t,e.values),r,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);J.currentNode=s;let r=J.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=J.nextNode(),o++)}return J.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),O(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(F(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Z(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new X(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=G(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=G(this,s[i+n],e,n),a===q&&(a=this._$AH[n]),o||=!O(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends Y{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??V)===q)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const rt=b.litHtmlPolyfillSupport;rt?.(Z,X),(b.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;let nt=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new X(e.insertBefore(U(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const at=ot.litElementPolyfillSupport;at?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:y},lt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function dt(t){return(e,i)=>"object"==typeof i?lt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return dt({...t,state:!0,attribute:!1})}const ut=1;class _t{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const ft=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends _t{constructor(t){if(super(t),t.type!==ut||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return q}}),gt="smart-alarm-card",$t="smart-alarm-card-editor",mt="smart_alarm",yt="disabled",vt="triggered",At="snoozed",bt=["L","M","M","J","V","S","D"],wt=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],xt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)})`
  ha-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

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
    font-size: 1.15em;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-text-color);
  }

  .title ha-icon {
    --mdc-icon-size: 22px;
  }

  .next-trigger {
    font-size: 0.9em;
    color: var(--secondary-text-color);
  }

  .state-triggered .title,
  .state-triggered .next-trigger {
    color: var(--error-color);
  }

  .state-snoozed .title,
  .state-snoozed .next-trigger {
    color: var(--warning-color);
  }

  .state-disabled .title,
  .state-disabled .next-trigger {
    color: var(--disabled-text-color);
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .row-label {
    font-size: 0.95em;
    color: var(--primary-text-color);
  }

  .time-picker {
    font-size: 1em;
    padding: 4px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
  }

  .day-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .day-chip {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
    cursor: pointer;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    border: 1px solid var(--divider-color);
    transition: all 150ms ease-out;
    user-select: none;
  }

  .day-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
    border-color: var(--primary-color);
  }

  .day-chip:active {
    transform: scale(0.95);
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
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
    0%, 100% { box-shadow: 0 0 0 0 var(--error-color); }
    50% { box-shadow: 0 0 0 6px transparent; }
  }

  .state-triggered ha-card {
    animation: pulse 1.5s ease-in-out infinite;
  }
`;console.info("%c  SMART-ALARM-CARD  %c  v0.1.0  ","color: white; background: #0288d1; font-weight: 700","color: #0288d1; background: white; font-weight: 700");const St=window;St.customCards=St.customCards||[],St.customCards.push({type:gt,name:"Smart Alarm Card",description:"Control a Smart Alarm clock from your dashboard.",preview:!1});let Et=class extends nt{constructor(){super(...arguments),this._onToggleEnable=()=>{const t=this._state();this._callService(t===yt?"enable":"disable")},this._onTimeChange=t=>{const e=t.target;e.value&&this._callService("set_time",{time:e.value})},this._onDayToggle=t=>{const e=new Set(this._attrs().days_active??[]);e.has(t)?e.delete(t):e.add(t),this._callService("set_days",{days:Array.from(e).sort()})},this._onTestNow=()=>{this._callService("trigger_now")},this._onSnooze=()=>{this._callService("snooze")},this._onStop=()=>{this._callService("stop")}}static async getConfigElement(){return await Promise.resolve().then(function(){return Pt}),document.createElement($t)}static getStubConfig(){return{type:`custom:${gt}`,entity:""}}setConfig(t){if(!t?.entity)throw new Error("entity is required");this._config=t}getCardSize(){return 3}_state(){if(this._config&&this.hass)return this.hass.states[this._config.entity]?.state}_attrs(){return this._config&&this.hass&&this.hass.states[this._config.entity]?.attributes||{}}_name(){if(this._config?.name)return this._config.name;const t=this.hass?.states[this._config.entity]?.attributes?.friendly_name;return t||this._config?.entity||"Alarm"}_formatNextTrigger(t){if(!t)return"—";const e=new Date(t);if(Number.isNaN(e.getTime()))return"—";return`${e.toLocaleDateString(void 0,{weekday:"long",day:"2-digit",month:"short"})} · ${e.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}`}_callService(t,e={}){this._config&&this.hass&&this.hass.callService(mt,t,{entity_id:this._config.entity,...e})}render(){if(!this._config||!this.hass)return V;const t=this._state();if(void 0===t)return I`<ha-card><div class="row">Entity not found</div></ha-card>`;const e=this._attrs(),i=t===yt,s=t===vt||t===At,r=ft({[`state-${t}`]:!0});return I`
      <ha-card class=${r}>
        ${this._config.hide_header?V:this._renderHeader(t,e)}
        ${this._renderTimeRow(e)}
        ${this._config.hide_days?V:this._renderDays(e)}
        ${this._renderActions(s,i)}
      </ha-card>
    `}_renderHeader(t,e){return I`
      <div class="header">
        <div class="header-info">
          <div class="title">
            <ha-icon icon=${t===vt?"mdi:bell-ring":t===At?"mdi:alarm-snooze":t===yt?"mdi:alarm-off":"mdi:alarm"}></ha-icon>
            ${this._name()}
          </div>
          <div class="next-trigger">
            ${t===yt?"Désactivé":I`Prochain : ${this._formatNextTrigger(e.next_trigger)}`}
          </div>
        </div>
        <ha-switch
          .checked=${t!==yt}
          @change=${this._onToggleEnable}
        ></ha-switch>
      </div>
    `}_renderTimeRow(t){return I`
      <div class="row">
        <div class="row-label">Heure</div>
        <input
          class="time-picker"
          type="time"
          .value=${t.time||"07:00"}
          @change=${this._onTimeChange}
        />
      </div>
    `}_renderDays(t){const e=new Set(t.days_active??[]);return I`
      <div class="day-chips">
        ${bt.map((t,i)=>I`
            <div
              class=${ft({"day-chip":!0,active:e.has(i)})}
              title=${wt[i]}
              role="button"
              tabindex="0"
              @click=${()=>this._onDayToggle(i)}
              @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||this._onDayToggle(i)}}
            >
              ${t}
            </div>
          `)}
      </div>
    `}_renderActions(t,e){return I`
      <div class="actions">
        ${this._config.hide_test_button||e?V:I`
              <button class="action-btn test" @click=${this._onTestNow}>
                <ha-icon icon="mdi:test-tube"></ha-icon>
                Tester
              </button>
            `}
        ${t?I`
              <button class="action-btn snooze" @click=${this._onSnooze}>
                <ha-icon icon="mdi:alarm-snooze"></ha-icon>
                Snooze
              </button>
              <button class="action-btn stop" @click=${this._onStop}>
                <ha-icon icon="mdi:stop-circle"></ha-icon>
                Arrêter
              </button>
            `:V}
      </div>
    `}};Et.styles=xt,t([dt({attribute:!1})],Et.prototype,"hass",void 0),t([pt()],Et.prototype,"_config",void 0),Et=t([ht(gt)],Et);let Ct=class extends nt{constructor(){super(...arguments),this._onEntity=t=>{const e=t.detail.value||"";this._fireChange({...this._config,entity:e})},this._onBool=t=>e=>{const i=e.detail.value,s={...this._config,[t]:i};i||delete s[t],this._fireChange(s)}}setConfig(t){this._config=t}_fireChange(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))}render(){return this._config&&this.hass?I`
      <div class="form">
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity||""}
          .label=${"Smart Alarm entity"}
          .includeDomains=${["sensor"]}
          .entityFilter=${t=>t.platform===mt}
          required
          @value-changed=${this._onEntity}
        ></ha-entity-picker>

        <ha-textfield
          label="Display name (optional)"
          .value=${this._config.name||""}
          @input=${t=>{const e=t.target.value;this._fireChange({...this._config,name:e||void 0})}}
        ></ha-textfield>

        <ha-formfield label="Hide header">
          <ha-switch
            .checked=${!!this._config.hide_header}
            @change=${t=>this._onBool("hide_header")(new CustomEvent("v",{detail:{value:t.target.checked}}))}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Hide days row">
          <ha-switch
            .checked=${!!this._config.hide_days}
            @change=${t=>this._onBool("hide_days")(new CustomEvent("v",{detail:{value:t.target.checked}}))}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Hide test button">
          <ha-switch
            .checked=${!!this._config.hide_test_button}
            @change=${t=>this._onBool("hide_test_button")(new CustomEvent("v",{detail:{value:t.target.checked}}))}
          ></ha-switch>
        </ha-formfield>
      </div>
    `:V}};Ct.styles=["\n      .form {\n        display: flex;\n        flex-direction: column;\n        gap: 12px;\n        padding: 8px 0;\n      }\n      ha-entity-picker, ha-textfield {\n        width: 100%;\n      }\n    "],t([dt({attribute:!1})],Ct.prototype,"hass",void 0),t([pt()],Ct.prototype,"_config",void 0),Ct=t([ht($t)],Ct);var Pt=Object.freeze({__proto__:null,get SmartAlarmCardEditor(){return Ct}});export{Et as SmartAlarmCard};
