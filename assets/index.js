(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{owner;state;lastState;constructor(e,t){this.owner=t,this.state=e,this.lastState=e}set(e,t=!0){switch(typeof e){case typeof this.state:this.state=e,this.lastState=this.state;break;case`function`:this.state=e(this.lastState),this.lastState=this.state;break;default:throw Error(`Invalid state update. Must be a value of the same type or a function.`)}t&&this.owner.render()}get(){return this.state}getLast(){return this.lastState}},t=class e{static instances=new Map;subscribers=new Set;name;attachedComponent;subscribeToContext=!1;location=`session`;constructor(t,n,r=!1,i=`session`){this.name=`${t}Context`,this.attachedComponent=n,this.subscribeToContext=r,this.location=i;let a=e.instances.get(this.name);if(a)return this.subscribeToContext&&a.subscribe(this.attachedComponent),a;this.initialize(),this.subscribeToContext&&this.subscribe(this.attachedComponent),e.instances.set(this.name,this)}initialize(){switch(this.location){case`local`:localStorage.getItem(this.name)||localStorage.setItem(this.name,JSON.stringify({}));break;case`session`:sessionStorage.getItem(this.name)||sessionStorage.setItem(this.name,JSON.stringify({}));break}}subscribe(e){this.subscribers.add(e)}propagate(){this.subscribers.forEach(e=>e.render())}get(e){let t=this.location===`local`?localStorage.getItem(this.name):sessionStorage.getItem(this.name),n=JSON.parse(t??`{}`);return e?e.split(`.`).reduce((e,t)=>e?.[t],n):n}set(e,t,n=!1){let r;typeof t==`string`?r=t:typeof t==`boolean`&&(n=t);let i=(e,t,n)=>{let r=t.split(`.`);return r.reduce((e,t,i)=>(i===r.length-1?e[t]=n:((!e[t]||typeof e[t]!=`object`)&&(e[t]={}),e=e[t]),e),e),e};if(this.location===`local`){let t=JSON.parse(localStorage.getItem(this.name)||`{}`);if(r){let n=i(t,r,e);localStorage.setItem(this.name,JSON.stringify(n))}else localStorage.setItem(this.name,JSON.stringify(e))}else{let t=JSON.parse(sessionStorage.getItem(this.name)||`{}`);if(r){let n=i(t,r,e);sessionStorage.setItem(this.name,JSON.stringify(n))}else sessionStorage.setItem(this.name,JSON.stringify(e))}n&&this.propagate()}clear(){this.location===`local`?localStorage.removeItem(this.name):sessionStorage.removeItem(this.name),e.instances.delete(this.name)}},n=class{app;root;routes=new Map;currentRoute;constructor(e,t=`/`){this.app=e,this.root=t,this.currentRoute=window.location.pathname,this.initialize()}initialize(){window.onpopstate=()=>this.handleRouteChange()}start(e){this.routes=new Map(Object.entries(e));let t=this.parse();if(t in e)return e[t];for(let[n,r]of Object.entries(e)){if(n===`*`)continue;let e=this.matchRoute(n,t);if(e)return this.injectParams(r,e.params)}return e[`*`]}navigateTo(e){let t=this.addRoot(e);window.history.pushState(null,``,t),this.handleRouteChange()}getRoutes(){return this.routes}handleRouteChange(){this.currentRoute=this.stripRoot(window.location.pathname||`/`),this.app.render()}matchRoute(e,t){let n=e.split(`/`).filter(e=>e),r=t.split(`/`).filter(e=>e);if(n.length!==r.length)return null;let i={};for(let e=0;e<n.length;e++){let t=n[e],a=r[e];if(t.startsWith(`:`)){let e=t.slice(1);i[e]=a}else if(t!==a)return null}return{params:i}}injectParams(e,t){if(Object.keys(t).length===0)return e;let n=e.match(/^(\s*<[a-zA-Z][\w-]*)(\s|>|\/)/);if(!n)return e;let r=Object.entries(t).map(([e,t])=>`param-${e}="${this.escapeHtml(t)}"`).join(` `),i=n[1].length;return e.slice(0,i)+` `+r+e.slice(i)}stripRoot(e){if(this.root===`/`)return e;let t=this.root.endsWith(`/`)?this.root.slice(0,-1):this.root;return e.startsWith(t)?e.slice(t.length)||`/`:e}addRoot(e){if(this.root===`/`)return e;let t=this.root.endsWith(`/`)?this.root.slice(0,-1):this.root,n=e.startsWith(`/`)?e:`/${e}`;return`${t}${n}`}parse(){return this.stripRoot(window.location.pathname)}escapeHtml(e){let t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`};return e.replace(/[&<>"']/g,e=>t[e])}},r=class{owner;registry;constructor(e){if(!e)throw Error(`You need to specify the owner of the signal. Use 'this' as default.`);this.owner=e,this.registry={}}register(e){if(!this.registry[e])this.registry[e]=[];else throw Error(`'${e}' signal already exists.`)}connect(e,t,n){if(e.signals.registry[t])e.signals.registry[t].push({element:this.owner,callback:n});else throw Error(`${e}:'${t}' signal does not exist. Maybe you're trying to connect to ${this.similarSignal(t)}...`)}emit(e,t=null){this.registry[e].forEach(e=>{e.element[e.callback.name]?t?e.element[e.callback.name](t):e.element[e.callback.name]():t?e.callback(t):e.callback()})}similarSignal(e){let t={};Object.keys(this.registry).forEach(n=>{let r=0;e.split(``).forEach((e,t)=>{n.length-1<=t&&n[t]===e&&r++}),t[n]=r});let n=null,r=0;return Object.entries(t).forEach(([e,t])=>{t>r&&(r=t,n=e)}),n}},i=class extends HTMLElement{parent=null;name;wrapper;shadow;styles;mode;props;signals=void 0;constructor(e,t=``,n=`open`){super(),this.name=e,this.mode=n,this.shadow=this.setupShadow(),this.wrapper=this.setupWrapper(),this.styles=this.setupStyles(t),this.parent=this.setupParent(),this.props=this.setupProps(),this.initialize()}initialize(){this.shadow.appendChild(this.styles),this.shadow.appendChild(this.wrapper)}setupShadow(){return this.attachShadow({mode:this.mode})}setupWrapper(){let e=document.createElement(`section`);return e.className=`${this.name}-wrapper`,e}setupStyles(e=``){let t=document.createElement(`style`);return t.innerHTML=e,t}setupParent(){if(!this.parentElement)return null;let e=this.parentElement.getRootNode();return e instanceof ShadowRoot?e.host:this.parentElement}setupProps(){let e={},t=Array.from(this.attributes),n=e=>e.includes(`-`)?e.split(`-`).map((e,t)=>t===0?e:e.charAt(0).toUpperCase()+e.slice(1)).join(``):e.includes(`:`)?e.split(`:`).map((e,t)=>t===0?e:e.charAt(0).toUpperCase()+e.slice(1)).join(``):e.includes(`.`)?e.split(`.`).map((e,t)=>t===0?e:e.charAt(0).toUpperCase()+e.slice(1)).join(``):e;for(let r of t)e[n(r.name)]=r.value;if(!this.parent)return e;let r={};for(let e of t)e.value in this.parent&&(this.parent[e.value]instanceof Function?r[n(e.name)]=this.parent[e.value].bind(this.parent):r[n(e.name)]=this.parent[e.value]);return Object.assign(e,r),e}render(){this.beforeRender(),this.wrapper.innerHTML=this.template(),this.listeners(),this.connectors(),this.afterRender()}template(){return``}listeners(){}connectors(){}connectedCallback(){this.render(),this.onMount()}disconnectedCallback(){this.onDismount()}onMount(){}onDismount(){}beforeRender(){}afterRender(){}html(e,...t){return e.reduce((e,n,r)=>e+n+(t[r]||``),``)}static css(e,...t){return e.reduce((e,n,r)=>e+n+(t[r]||``),``)}$(e){return this.shadow.querySelector(e)}$$(e){return this.shadow.querySelectorAll(e)}useState(t){return new e(t,this)}useContext(e,n=!1,r=`session`){return new t(e,this,n,r)}useRouter(){return new n(this)}useSignals(){return this.signals||=new r(this),this.signals}},a=`* {
    transition: 300ms all ease-in-out;
}

/* Utility class to disable transitions */
.no-transition,
.no-transition * {
    transition: none !important;
}
`,o=`.agora-app-wrapper {
    position: relative;
    box-sizing: border-box;

    display: flex;
    height: 100vh;
    /* width: 100vw; */

    overflow: hidden;
}
`,s=`.left-panel {
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;

    flex: 0 0 420px;
    width: 420px;
    max-width: 420px;

    position: relative;
    z-index: 50;
    background: inherit;
    
    transition: flex 300ms ease, opacity 300ms ease, transform 300ms ease, min-width 300ms ease;
}

.left-panel--header {
    padding: 16px;
    /* justify-content: center; -- Overriden/merged with later rule? */
    flex: 0 0 100px;

    /* Merging from later section */
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Merged */
}

.left-panel--nav {
    padding: 16px;

    flex: 1;

    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
}

.left-panel--nav::-webkit-scrollbar {
    width: 4px;
}

.left-panel--nav::-webkit-scrollbar-track {
    background: transparent;
}

.left-panel--nav::-webkit-scrollbar-thumb {
    background: #e7e8e9;
    border-radius: 50pt;
}

.left-panel--nav::-webkit-scrollbar-button {
    display: none;
}

.left-panel--footer {
    max-height: 200px;
    flex: 0 0 200px;
    padding: 16px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.left-panel--footer plain-carousel {
    height: 200px !important;
    width: 350px !important;
}

/* NAV COLLAPSE BUTTON */
.nav-collapse-btn {
    position: absolute;
    bottom: 0;
    right: 16px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 32px;
    height: 32px;
    padding: 0;
    
    background: transparent;
    border: none;
    border-radius: 6px;
    
    color: #9aa0a6;
    cursor: pointer;
    
    transition: all 200ms ease;
}

.nav-collapse-btn:hover {
    background: #f1f3f4;
    color: #5f6368;
}

.nav-collapse-btn svg {
    width: 20px;
    height: 20px;
}

/* NAV HOVER ZONE - invisible strip on the left edge */
.nav-hover-zone {
    position: fixed;
    left: 0;
    top: 0;
    width: 12px;
    height: 100vh;
    z-index: 100;
    
    opacity: 0;
    pointer-events: none;
    
    transition: opacity 200ms ease, background 200ms ease;
}

.nav-hover-zone.active {
    pointer-events: auto;
    opacity: 1;
}

/* Visual indicator tab when nav is collapsed */
.nav-hover-zone.active::before {
    content: '›';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    
    width: 32px;
    height: 56px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    font-size: 24px;
    color: #5f6368;

    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(190, 190, 190);
    border-left: none;
    border-radius: 0 12px 12px 0;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
    
    transition: width 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.nav-hover-zone.active:hover::before {
    width: 28px;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.12);
    color: #3c4043;
}

.nav-hover-zone.active:hover {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.03), transparent);
}

/* LEFT PANEL COLLAPSED STATE */
.left-panel.nav-collapsed {
    flex: 0 0 0px;
    overflow: hidden;
    opacity: 0;
    transform: translateX(-100%);
    pointer-events: none;
}

/* Intermediate state for smooth collapse animation */
.left-panel.nav-collapsing {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    min-width: calc(350px + 32px);
    flex: none;
    
    opacity: 0;
    transform: translateX(-100%);
    pointer-events: none;
    
    background: #fff;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0);
    z-index: 99;
}

/* LEFT PANEL HOVER EXPANDED STATE (when collapsed but hovering) */
.left-panel.nav-hover-expanded {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    min-width: calc(350px + 32px); /* carousel width + paddings */
    flex: none;
    
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
    
    background: #fff;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
    z-index: 20000;
}

.left-panel.nav-hover-expanded .left-panel--header,
.left-panel.nav-hover-expanded .left-panel--nav,
.left-panel.nav-hover-expanded .left-panel--footer {
    opacity: 1;
}

/* Hide collapse button when panel is collapsed */
.left-panel.nav-collapsed .nav-collapse-btn {
    opacity: 0;
    pointer-events: none;
}
`,c=`.main-panel {
    margin-inline: auto;

    flex: 3;

    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;

    max-width: 1400px;
    min-width: 0;
}

.main-panel--header {
    padding: 16px;

    flex: 2;
}

.main-panel--content {
    padding: 16px;

    flex: 3;

    min-height: 0;

    transition: flex 1s ease-out;

    position: relative; /* Needed for absolute positioning of children */
}

.main-panel--footer {
    padding: 16px;
    padding-bottom: 32px;

    flex: 0 0 100px;
}

/* HOVER RESIZINGS */
/* .main-panel--header:hover {
    flex: 5;
} */

.main-panel--content:hover {
    flex: 10;
}
`,l=`.right-panel {
    position: relative;
    z-index: 50;
    background: inherit;

    flex: 0 0 420px;
    width: 420px;
    max-width: 420px;

    display: flex;
    flex-direction: column;

    transition: flex 300ms ease, opacity 300ms ease, min-width 300ms ease, transform 300ms ease, width 300ms ease;
    overflow: hidden;
}

.right-panel--header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 16px;
    flex: 0 0 auto;
}

.right-panel--content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
}

.right-panel.collapsed {
    flex: 0 0 0px !important;
    width: 0 !important;
    min-width: 0;
    opacity: 0;
    pointer-events: none;
}

.right-panel--content::-webkit-scrollbar {
    width: 4px;
}

.right-panel--content::-webkit-scrollbar-track {
    background: transparent;
}

.right-panel--content::-webkit-scrollbar-thumb {
    background: #e7e8e9;
    border-radius: 50pt;
}

.right-panel--content::-webkit-scrollbar-button {
    display: none;
}

/* RIGHT PANEL COLLAPSE BUTTON */
.right-panel-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 32px;
    height: 32px;
    padding: 0;
    
    background: transparent;
    border: none;
    border-radius: 6px;
    
    color: #9aa0a6;
    cursor: pointer;
    
    transition: all 200ms ease;
}

.right-panel-collapse-btn:hover {
    background: #f1f3f4;
    color: #5f6368;
}

.right-panel-collapse-btn svg {
    width: 20px;
    height: 20px;
}

/* RIGHT PANEL HOVER ZONE - invisible strip on the right edge */
.right-panel-hover-zone {
    position: fixed;
    right: 0;
    top: 0;
    width: 12px;
    height: 100vh;
    z-index: 100;
    
    opacity: 0;
    pointer-events: none;
    
    transition: opacity 200ms ease, background 200ms ease;
}

.right-panel-hover-zone.active {
    pointer-events: auto;
    opacity: 1;
}

/* Visual indicator tab when right panel is collapsed */
.right-panel-hover-zone.active::before {
    content: '‹';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    
    width: 32px;
    height: 56px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    font-size: 24px;
    color: #5f6368;

    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(190, 190, 190);
    border-right: none;
    border-radius: 12px 0 0 12px;
    box-shadow: -2px 0 12px rgba(0, 0, 0, 0.08);
    
    transition: width 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.right-panel-hover-zone.active:hover::before {
    width: 28px;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
    color: #3c4043;
}

.right-panel-hover-zone.active:hover {
    background: linear-gradient(to left, rgba(0, 0, 0, 0.03), transparent);
}

/* RIGHT PANEL COLLAPSED STATE (manual collapse) */
.right-panel.panel-collapsed {
    flex: 0 0 0px;
    overflow: hidden;
    opacity: 0;
    transform: translateX(100%);
    pointer-events: none;
}

/* Intermediate state for smooth collapse animation */
.right-panel.panel-collapsing {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 420px;
    max-width: 420px;
    flex: none;
    
    opacity: 0;
    transform: translateX(100%);
    pointer-events: none;
    
    background: #fff;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0);
    z-index: 99;
}

/* RIGHT PANEL HOVER EXPANDED STATE (when collapsed but hovering) */
.right-panel.panel-hover-expanded {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 420px;
    max-width: 420px;
    flex: none;
    
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
    
    background: #fff;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
    z-index: 200;
}

.right-panel.panel-hover-expanded .right-panel--header,
.right-panel.panel-hover-expanded .right-panel--content {
    opacity: 1;
}

/* Hide collapse button when panel is collapsed */
.right-panel.panel-collapsed .right-panel-collapse-btn {
    opacity: 0;
    pointer-events: none;
}
`,u=`.content-split {
    position: absolute;
    inset: 16px;
    display: flex;
    gap: 16px;
    width: auto;
    height: auto;
}

.content-left {
    flex: 0;
    min-width: 0;
    overflow: hidden;
    transition: flex 400ms ease, min-width 400ms ease, opacity 400ms ease;
    opacity: 0;
}

.content-left.has-content {
    flex: 1;
    min-width: 300px;
    opacity: 1;
}

.content-right {
    flex: 1;
    position: relative;
    min-width: 0;
    transition: flex 400ms ease, min-width 400ms ease, opacity 400ms ease;
}

/* When chat has content and results exist, use 2:3 ratio */
.content-left.has-content {
    flex: 2;
}

.content-left.has-content ~ .content-right.has-results {
    flex: 3;
}

/* When chat has content but no results, collapse content-right */
.content-left.has-content ~ .content-right:not(.has-results) {
    flex: 0;
    min-width: 0;
    opacity: 0;
    overflow: hidden;
}

/* Position carousel and artifact display within content-right */
.content-right > * {
    position: absolute;
    inset: 0;
    transition: opacity 500ms ease-in-out, visibility 500ms ease-in-out;
}
`,d=`.faded-in {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 1;
}

.faded-out {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 0;
}

.collapsed {
    flex: 0 0 0px !important;
    padding: 0 !important;
    overflow: hidden;
    opacity: 0;
}

.display-none {
    display: none !important;
}
`,f=`.welcome-banner {
    display: flex;
    gap: 16px;
}

.welcome-banner plain-carousel,
.welcome-banner plain-metagora-carousel {
    flex: 1;
}
`,p=`.plain-logo-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;

    font-family: 'Sora', sans-serif;
    font-size: clamp(24px, 8vw, 48px);
} 

.logo {
    font-weight: 500;
}

.logo-subtext {
    margin-bottom: 8px;

    opacity: 0.6;

    font-family: 'Geist Mono', monospace;
    font-weight: 400;
    font-size: clamp(12px, 3vw, 24px);
}

.dot {
    font-weight: 300;
    border-radius: 100pt;
}

/* Skeleton Loader Styles */
.skeleton-logo {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.skeleton-text {
    border-radius: 4px;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-company {
    width: 120px;
    height: clamp(24px, 8vw, 48px);
}

.skeleton-subtext {
    width: 60px;
    height: clamp(12px, 3vw, 24px);
    margin-bottom: 8px;
    animation-delay: 0.1s;
}

.skeleton-dot {
    font-weight: 300;
    color: #e0e0e0;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}`;const m={COMPANY:`company`,CONFIG:`config`,RESULT:`result`,SERVICE:`service`,METAGORA:`metagora`,SEARCH:`search`,FILTER:`filter`,MODAL:`modal`,CHAT:`chat`};var ee=class extends i{companyContext;constructor(){super(`plain-logo`,p),this.companyContext=this.useContext(m.COMPANY,!0)}renderSkeletonLoader(){return this.html`
            <div class="skeleton-logo">
                <span class="skeleton-text skeleton-company"></span>
                <span class="skeleton-dot">/</span>
                <span class="skeleton-text skeleton-subtext"></span>
            </div>
        `}template(){let e=this.companyContext.get(`name`);return e?this.html`
            <span class="logo">${e}</span>
            <span class="dot" style="color: ${this.companyContext.get(`primaryColor`)||`#8238eb`};">/</span>
            <span class="logo-subtext">Agora</span>
        `:this.renderSkeletonLoader()}};window.customElements.define(`plain-logo`,ee);var te=`.plain-nav-menu-wrapper {
    width: 100%;
    height: fit-content;
} 

:host {
    interpolate-size: allow-keywords;
}

.service-details {
    border-radius: 8px;
    overflow: hidden;

    transition: 300ms;
}

.service-details[open] {
    background-color: rgb(249 250 251 / 0.5);
}

.service-details[open] summary {
    padding-block: 10px;
    background-color: #f1f3f4;
}

summary {
    padding: 4px 8px;
    box-sizing: border-box;

    list-style: none;

    display: flex;
    align-items: center;
    justify-content: space-between;

    transition: 300ms;
}

summary::-webkit-details-marker {
    display: none;
}

summary > plain-nav-item {
    flex: 1;
}

summary > div {
    flex: 1;
}

.vertical-separator {
    margin-inline: 6px;
    flex: 0 0 1px;
    min-height: 20px;
    background-color: #e0e0e0;
}

.chevron-icon {
    flex: 0 0 20px;
    
    cursor: pointer;

    color: rgb(156, 163, 175);

    width: 20px;
    height: 20px;

    transition: transform 0.3s ease;
}

.service-details[open] .chevron-icon {
    transform: rotate(180deg);
}

.service-details::details-content {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease, content-visibility 0.3s allow-discrete;
}

.service-details[open]::details-content {
    height: auto;
}

.nav-item-separator {
    border-top: 1px solid #ffffff5c;
}

ul {
    list-style: none;
    padding: 8px;
    margin: 0;
    margin-left: 16px;
    /* border-left: 1px solid #e0e0e0; */
}

.catalogues-label {
    padding: 8px;
    padding-bottom: 0;
    margin: 0;
    margin-top: 6px;
    margin-left: calc(16px + 8px + 10px);
    margin-bottom: -6px;
    box-sizing: border-box;

    user-select: none;

    display: block;

    font-size: 10px;
    color: #b3b6b9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
}

/* Skeleton Loader Styles */
.skeleton-loader {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 8px;
}

.skeleton-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
}

.skeleton-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-text {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, #e8eaec 25%, #f3f4f5 50%, #e8eaec 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    animation-delay: 0.1s;
}

.skeleton-separator {
    border-top: 1px solid #f0f0f0;
    margin: 2px 0;
}

@keyframes skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}`,ne=`.plain-nav-item-wrapper {
    padding-block: 2px;
    box-sizing: border-box;

    display: flex;
    align-items: stretch;
    width: 100%;
    box-sizing: border-box;
    border-radius: 8px;
    transition: background-color 0.2s ease;
} 

/* .plain-nav-item-wrapper:has(> .plain-nav-item--left.navigable):hover {
    cursor: pointer;
    background-color: var(--company-primary-color);
} */

.plain-nav-item--left {
    padding-left: 12px;
    padding-right: 6px;
    box-sizing: border-box;

    width: 100%;

    display: flex;
    align-items: stretch;
    gap: 12px;
}

.plain-nav-item--left:has(> .company-badge) {
    padding-left: 0;
}

/* .plain-nav-item--left:not(.navigable) {
    padding-left: 12px;
    padding-right: 6px;
} */

/* .plain-nav-item--left.navigable {
    width: 100%;
} */

.plain-nav-item--right {
    margin-left: auto;
    display: flex;
    align-items: center;
}

.nav-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    
    color: #5f6368;

    opacity: 0.25;

    transition: 300ms;
}

.nav-arrow svg {
    width: 20px;
    height: 20px;
}

.item-icon {
    padding-block: 8px;
    box-sizing: border-box;

    width: 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 6px;

    /* color: #5f6368; */
    color: var(--company-primary-color);
    
    background-color: color-mix(in srgb, var(--company-primary-color) 15%, transparent);

    transition: 300ms;
}

.item-icon svg {
    width: 20px;
    height: 20px;
}

.service-name {
    align-self: center;

    user-select: none;
    /* padding-block: 8px; */
    padding-left: 0;
    padding-right: 6px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: 12px;

    font-size: 14px;
    font-weight: 500;
    color: #202124;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;

    transition: 300ms;
}

.service-name.navigable {
    width: 100%;

    padding-block: 8px;
    margin-block: -8px;
    padding-left: 8px;
    margin-left: -8px;

    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: color-mix(in srgb, black 35%, transparent);
}

.service-name.navigable:hover {
    cursor: pointer;
    border-radius: 4px;
    background-color: color-mix(in srgb, var(--company-primary-color) 15%, transparent);
    color: var(--company-primary-color);
    text-decoration-color: color-mix(in srgb, var(--company-primary-color) 75%, transparent);
    text-underline-offset: 2px;
}

.service-name.navigable:hover .nav-arrow {
    color: var(--company-primary-color);
    opacity: 0.75;
} 

.service-name.navigable:hover .item-icon {
    color: var(--company-primary-color);
    background-color: transparent;
}

.info-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.info-icon {
    display: flex;
    align-items: center;
    color: #9aa0a6;
    margin-left: 8px;
    margin-right: 8px;
    opacity: 0;
    transition: opacity 0.2s, color 0.2s;
    cursor: help;
}

.plain-nav-item-wrapper:hover .info-icon {
    opacity: 1;
}

.info-icon:hover {
    color: #5f6368;
}

.info-icon svg {
    width: 18px;
    height: 18px;
}

.tooltip {
    visibility: hidden;
    width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px;
    position: fixed;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 12px;
    pointer-events: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    white-space: normal;
    word-wrap: break-word;
    line-height: 1.4;
}

.tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
}

a.service-name {
    text-decoration: none;
    cursor: pointer;
}

a.service-name:hover {
    text-decoration: underline;
    color: #1a73e8;
}

.company-badge {
    display: inline-block;

    padding: 2px 6px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 60px;

    font-size: 10px;
    font-weight: 500;
    text-decoration: none;
    color: #6b7280;
    white-space: nowrap;

    border: 1px solid #e5e7eb;
    border-radius: 4px;

    background-color: #f3f4f6;
}

/* Ensure badge doesn't get underlined when hovering the link */
a.service-name:hover .company-badge {
    text-decoration: none;
    color: #6b7280;
}

.service-name {
    display: flex;
    align-items: center;
}`;const h=`
    <svg 
        id="aUPaEU" 
        data-name="aUPaEU" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 658.08 657.97"
    >
        <defs>
            <style>
                .cls-1 {
                fill: #3a85fe;
                }

                .cls-2 {
                fill: #febd0b;
                }

                .cls-3 {
                fill: #fe006e;
                }

                .cls-4 {
                fill: #8238eb;
                }

                .cls-5 {
                fill: #fa5607;
                }
            </style>
        </defs>
        <g id="Capa_1-2" data-name="Capa 1">
        <path class="cls-2" d="M318.49,229.28c89.04-7.92,144.11,93.15,88.17,163.02-44.78,55.93-135.14,46.33-167.52-17.41-31.65-62.3,9.58-139.4,79.34-145.61Z"/>
        <path class="cls-5" d="M330.39,459.87l2.84.83c17.63,19.48,39.12,36.96,56.48,56.48,52.92,59.49,11,147.48-68.51,140.38-39.16-3.5-70.49-38.81-72.56-77.37-2.95-55.05,49.76-83.94,81.74-120.32Z"/>
        <path class="cls-5" d="M316.49.48c76-7.75,121.11,79.38,71.23,137.11-17.65,20.43-40.91,38.6-58.98,58.96l-2.55,1.49-2.55-1.49c-37.16-42.18-95.3-71.92-76.22-138.18C256.21,27.88,284.72,3.72,316.49.48Z"/>
        <path class="cls-3" d="M234.69,238.97c-27.69-1.31-56.98,1.76-84.49,0-113.78-7.32-100.41-171.77,8.03-164.88,35.63,2.26,76.46,36.06,76.46,73.47v91.42Z"/>
        <path class="cls-1" d="M71.49,247.26c23.94-2.44,46.51,4.05,64.73,19.66l61.4,61.61-1.39,2.39c-42.26,36.94-72.35,96.51-138.97,76.84-83.95-24.78-72.52-151.67,14.23-160.5Z"/>
        <path class="cls-1" d="M565.49,247.26c59.39-6.04,105.16,46.45,89.49,104.39-15.5,57.32-87.79,78.51-132.81,40.21l-62.4-62.61,1.39-2.39c32.04-26.68,59.42-75.04,104.33-79.6Z"/>
        <path class="cls-4" d="M237.69,422.8v95.41c0,14.05-16.07,39.15-26.53,48.43-61.42,54.54-155.86-3.87-134.76-83.68,7.76-29.36,40.22-60.16,71.78-60.16h89.5Z"/>
        <path class="cls-3" d="M422.69,419.8h93.5c25.66,0,55.74,27.24,64.98,49.97,31.93,78.52-59.75,148.36-126.94,96.85-14.97-11.48-31.54-37.09-31.54-56.41v-90.42Z"/>
        <path class="cls-4" d="M419.69,234.97v-94.41c0-21.13,22.97-49.27,40.69-59.25,66.87-37.68,143.92,26.9,118.76,99.67-8.8,25.46-39.99,53.99-67.96,53.99h-91.5Z"/>
        </g>
    </svg>
`,re=`
    <svg 
        id="aUPaEU-grey" 
        data-name="aUPaEU-grey" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 658.08 657.97"
    >
        <defs>
            <style>
                .cls-1-grey {
                fill: #6b6b6b;
                }

                .cls-2-grey {
                fill: #9a9a9a;
                }

                .cls-3-grey {
                fill: #7d7d7d;
                }

                .cls-4-grey {
                fill: #5e5e5e;
                }

                .cls-5-grey {
                fill: #8a8a8a;
                }
            </style>
        </defs>
        <g id="Capa_1-2" data-name="Capa 1">
        <path class="cls-2-grey" d="M318.49,229.28c89.04-7.92,144.11,93.15,88.17,163.02-44.78,55.93-135.14,46.33-167.52-17.41-31.65-62.3,9.58-139.4,79.34-145.61Z"/>
        <path class="cls-5-grey" d="M330.39,459.87l2.84.83c17.63,19.48,39.12,36.96,56.48,56.48,52.92,59.49,11,147.48-68.51,140.38-39.16-3.5-70.49-38.81-72.56-77.37-2.95-55.05,49.76-83.94,81.74-120.32Z"/>
        <path class="cls-5-grey" d="M316.49.48c76-7.75,121.11,79.38,71.23,137.11-17.65,20.43-40.91,38.6-58.98,58.96l-2.55,1.49-2.55-1.49c-37.16-42.18-95.3-71.92-76.22-138.18C256.21,27.88,284.72,3.72,316.49.48Z"/>
        <path class="cls-3-grey" d="M234.69,238.97c-27.69-1.31-56.98,1.76-84.49,0-113.78-7.32-100.41-171.77,8.03-164.88,35.63,2.26,76.46,36.06,76.46,73.47v91.42Z"/>
        <path class="cls-1-grey" d="M71.49,247.26c23.94-2.44,46.51,4.05,64.73,19.66l61.4,61.61-1.39,2.39c-42.26,36.94-72.35,96.51-138.97,76.84-83.95-24.78-72.52-151.67,14.23-160.5Z"/>
        <path class="cls-1-grey" d="M565.49,247.26c59.39-6.04,105.16,46.45,89.49,104.39-15.5,57.32-87.79,78.51-132.81,40.21l-62.4-62.61,1.39-2.39c32.04-26.68,59.42-75.04,104.33-79.6Z"/>
        <path class="cls-4-grey" d="M237.69,422.8v95.41c0,14.05-16.07,39.15-26.53,48.43-61.42,54.54-155.86-3.87-134.76-83.68,7.76-29.36,40.22-60.16,71.78-60.16h89.5Z"/>
        <path class="cls-3-grey" d="M422.69,419.8h93.5c25.66,0,55.74,27.24,64.98,49.97,31.93,78.52-59.75,148.36-126.94,96.85-14.97-11.48-31.54-37.09-31.54-56.41v-90.42Z"/>
        <path class="cls-4-grey" d="M419.69,234.97v-94.41c0-21.13,22.97-49.27,40.69-59.25,66.87-37.68,143.92,26.9,118.76,99.67-8.8,25.46-39.99,53.99-67.96,53.99h-91.5Z"/>
        </g>
    </svg>
`,ie=`
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    >
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
    <line x1="12" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
`,ae=`
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
`,g=`
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        class="chevron-icon"
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
`,oe=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
`,_=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
`,se=`
    <svg viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <g>
            <path d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" transform="translate(-831.568 -384.448)"></path>
        </g>
    </svg>
`,ce=`
    <svg viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <g transform="scale(-1, 1) translate(-37.724, 0)">
            <path d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" transform="translate(-831.568 -384.448)"></path>
        </g>
    </svg>
`,v=`
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 21h18"/>
        <path d="M5 21V7"/>
        <path d="M19 21V7"/>
        <path d="M4 7h16"/>
        <path d="M12 2L2 7h20L12 2z"/>
        <path d="M10 21V11"/>
        <path d="M14 21V11"/>
    </svg>
`,y=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="19" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
`,le=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 19l-7-7 7-7"></path>
        <path d="M18 5v14"></path>
    </svg>
`,ue=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 5l7 7-7 7"></path>
        <path d="M6 5v14"></path>
    </svg>
`,de=`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
`,b={gear:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
`,tool:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
`,research:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 490.1 490.1" fill="currentColor">
        <path d="M467.667,460.9l-130.3-269v-171c0-11.5-9.4-20.9-20.9-20.9h-142.8c-11.5,0-20.9,9.4-20.9,20.9v171l-130.3,269
        c-4.4,6.9-3.7,28,18.8,29.2h408.7C471.967,489.5,471.667,467.6,467.667,460.9z M192.467,205.5c1-3.1,2.1-6.3,2.1-9.4V40.8h102.2
        v155.3c0,3.1,1,6.3,2.1,9.4l43.6,90.2c-49.7-12.1-86.2,0.8-119.7,12c-27.2,9.4-53.1,18-87.1,14.7L192.467,205.5z M73.567,449.4
        l43.1-88.5c58.7,9.6,94.5-6.4,119.5-14.7c40-14,74.3-25.1,131.3,1.6l49.1,101.6H73.567z"/>
    </svg>
`,calendar:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
`,conversation:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
    </svg>
`,sparks:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l1.9 5.8a2 2 0 0 0 1.2 1.2l5.9 1.9-5.9 1.9a2 2 0 0 0-1.2 1.2L12 21l-1.9-5.8a2 2 0 0 0-1.2-1.2l-5.9-1.9 5.9-1.9a2 2 0 0 0 1.2-1.2z"/>
        <path d="M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/>
    </svg>
`,blog:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
`,mortarboard:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
`,badge:`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
`};var fe=class extends i{companyContext;constructor(){super(`plain-nav-item`,ne),this.companyContext=this.useContext(`company`)}showTooltip(e){let t=e.currentTarget,n=t.querySelector(`.tooltip`);if(!n)return;let r=t.getBoundingClientRect();n.style.position=`fixed`,n.style.top=`${r.top-n.offsetHeight-8}px`,n.style.left=`${r.left+r.width/2-n.offsetWidth/2}px`,n.style.visibility=`visible`,n.style.opacity=`1`}hideTooltip(e){let t=e.currentTarget.querySelector(`.tooltip`);t&&(t.style.visibility=`hidden`,t.style.opacity=`0`)}template(){let e=this.props.mainUrl?this.html`
                <a 
                    href="${this.props.mainUrl}" 
                    class="service-name navigable" 
                    target="_blank" 
                    style="--company-primary-color: ${this.companyContext.get(`primaryColor`)};"
                    onclick="event.stopPropagation()"
                >
                    ${!this.props.companyName&&this.props.serviceIcon&&b[this.props.serviceIcon]?this.html`<span class="item-icon">${b[this.props.serviceIcon]}</span>`:``}
                    ${this.props.serviceName}
                    ${this.props.mainUrl?this.html`<span class="nav-arrow">${y}</span>`:``}
                    <div class="plain-nav-item--right">
                    <div class="info-icon-wrapper" 
                         onmouseenter="this.getRootNode().host.showTooltip(event)" 
                         onmouseleave="this.getRootNode().host.hideTooltip(event)">
                        <span class="info-icon">${ie}</span>
                        <div class="tooltip">${this.props.serviceDescription}</div>
                    </div>
                </div>
                </a>`:this.html`<span class="service-name">
                ${this.props.serviceName}
            </span>`;return this.html`
            <div class="plain-nav-item-wrapper ">
                <div 
                    class="plain-nav-item--left ${this.props.mainUrl?`navigable`:``}"
                    style="--company-primary-color: ${this.props.companyPrimaryColor||this.companyContext.get(`primaryColor`)};"
                >
                    ${this.props.companyName?this.html`
                            <span 
                                class="company-badge" 
                                style="border-color: ${this.props.companyPrimaryColor} !important;color: ${this.props.companyPrimaryColor} !important;background-color: ${this.props.companyPrimaryColor}22 !important;"
                            >
                                ${this.props.companyName}
                            </span>
                        `:!this.props.mainUrl&&this.props.serviceIcon&&b[this.props.serviceIcon]?this.html`
                                <span class="item-icon">${b[this.props.serviceIcon]}</span>
                            `:``}
                    
                    ${e}
                    ${!this.props.mainUrl&&this.props.serviceDescription?this.html`
                    <div class="plain-nav-item--right">
                        <div class="info-icon-wrapper"
                             onmouseenter="this.getRootNode().host.showTooltip(event)" 
                             onmouseleave="this.getRootNode().host.hideTooltip(event)">
                            <span class="info-icon">${ie}</span>
                            <div class="tooltip">${this.props.serviceDescription}</div>
                        </div>
                    </div>
                    `:``}
                </div>
                
            </div>
        `}};window.customElements.define(`plain-nav-item`,fe);var pe=`.plain-catalogue-item-wrapper {
    display: block;
}

.catalogue-item {
    padding: 10px 16px;
    box-sizing: border-box;

    cursor: pointer;
    user-select: none;
    
    display: flex;
    align-items: center;

    border-radius: 8px;
    
    color: #5f6368;
    font-size: 14px;
    font-weight: 400;

    transition: background-color 0.2s ease, color 0.2s ease;
}

.catalogue-item:not(.disabled):hover {
    background-color: #f1f3f4;
    color: #202124;
}

.catalogue-item.disabled {
    cursor: default;
}

.icon {
    display: flex;
    align-items: center;
    margin-right: 12px;
    color: inherit;
}

.icon.disabled {
    color: #a8a8a8;
}

.icon svg {
    width: 20px;
    height: 20px;
}

.label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
} 

.label.disabled {
    color: #a8a8a8;
}`,me=class extends i{configContext;metagoraContext;constructor(){super(`plain-catalogue-item`,pe),this.configContext=this.useContext(m.CONFIG,!0),this.metagoraContext=this.useContext(m.METAGORA,!0)}template(){let e=this.configContext.get(`IS_METAGORA`),t=this.metagoraContext.get(`agoras`).filter(e=>e.name===this.props.companyName)[0],n=`${e?t?.host:this.configContext.get(`API_HOST`)}${this.props.url}`;return e&&!t?this.html`
            <span class="catalogue-item disabled" title="The page is not available">
                <span class="icon disabled">${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
        <path d="M15 7h2a5 5 0 0 1 4 8"></path>
        <line x1="8" y1="12" x2="12" y2="12"></line>
        <line x1="2" y1="2" x2="22" y2="22"></line>
    </svg>
`}</span>
                <span class="label disabled">${this.props.name}</span>
            </span>
            `:this.html`
            <a href="${n}" target="_blank" class="catalogue-item">
                <!-- <span class="icon">${ae}</span> -->
                <span class="label">${this.props.name}</span>
            </a>
        `}};window.customElements.define(`plain-catalogue-item`,me);var he=class extends i{serviceContext;companyContext;constructor(){super(`plain-nav-menu`,te),this.serviceContext=this.useContext(m.SERVICE,!0),this.companyContext=this.useContext(m.COMPANY,!0)}renderSkeletonLoader(){let e=[,,,,].fill(null).map((e,t)=>this.html`
            <div class="skeleton-item">
                <div class="skeleton-icon"></div>
                <div class="skeleton-text" style="width: ${70+t*10%30}%"></div>
            </div>
            ${t<3?`<hr class="nav-item-separator skeleton-separator"/>`:``}
        `).join(``);return this.html`
            <div class="skeleton-loader">
                ${e}
            </div>
        `}template(){let e=this.serviceContext.get(`services`);return!e||e.length===0?this.renderSkeletonLoader():this.html`
            ${e.map(t=>{let n=t.fields.catalogues.websites,r=n&&n.length>0,i=t.fields.main_url&&t.fields.main_url!==`False`?t.fields.main_url:``,a=this.html`
                    <plain-nav-item
                        service-name="${t.fields.name}"
                        service-description="${t.fields.description}"
                        main-url="${i}"
                        service-icon="${t.fields.service_icon}"
                    ></plain-nav-item>
                `;return r?this.html`
                    <details class="service-details">
                        <summary>
                            <div onclick="event.preventDefault()">
                                ${a}
                            </div>
                            <div class="vertical-separator"></div>
                            ${g}
                        </summary>
                        <span class="catalogues-label">Catalogues</span>
                        <ul>
                            ${n.map(e=>this.html`
                                    <plain-catalogue-item 
                                        name="${e.name}"
                                        url="${e.url}"
                                        model="${e.model}"
                                        view-id="${e.view_id}"
                                        website="${e.website}"
                                    ></plain-catalogue-item>
                                `).join(``)}
                        </ul>
                    </details>
                    ${e.indexOf(t)==e.length-1?``:`<hr class="nav-item-separator"/>`}
                `:this.html`
                    <summary>
                        ${a}
                    </summary>
                        ${e.indexOf(t)==e.length-1?``:`<hr class="nav-item-separator"/>`}
                    `}).join(`
`)}
        `}};window.customElements.define(`plain-nav-menu`,he);var ge=`.plain-metagora-nav-menu-wrapper {
    width: 100%;
    height: fit-content;
} 

:host {
    interpolate-size: allow-keywords;
}

/* Search Styles */
.search-container {
    padding: 12px 8px 12px 8px;
    position: sticky;
    top: -16px;
    background-color: #fff;
    z-index: 10;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 10px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    pointer-events: none;
}

.search-icon svg {
    width: 16px;
    height: 16px;
}

.nav-search-input {
    width: 100%;
    padding: 8px 12px 8px 34px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #374151;
    background-color: #f9fafb;
    transition: all 0.2s;
    outline: none;
}

.nav-search-input:focus {
    background-color: #fff;
    border-color: #d1d5db;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.nav-search-input::placeholder {
    color: #9ca3af;
}

/* Filter Styles */
.filter-container {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-top: 8px;
    padding-bottom: 4px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}

.filter-container::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

.filter-chip {
    flex: 0 0 auto;
    padding: 4px 12px;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    color: #6b7280;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.filter-chip:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
}

.filter-chip.active {
    background-color: #eff6ff;
    border-color: #bfdbfe;
    color: #2563eb;
}

.no-results {
    padding: 16px;
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
    font-style: italic;
}

/* Category Styles */
.category-details {
    margin-bottom: 4px;
}

.category-details::details-content {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease, content-visibility 0.3s allow-discrete;
}

.category-details[open]::details-content {
    height: auto;
}

.category-summary {
    padding: 12px 8px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    background-color: transparent;
    border-radius: 6px;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
}

.category-summary::-webkit-details-marker {
    display: none;
}

.category-summary:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.category-name {
    flex: 1;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
}

.category-services {
    padding-left: 0;
}

.category-separator {
    border: 0;
    border-top: 1px solid #e5e7eb;
    margin: 8px 0;
}

.category-details[open] > .category-summary .chevron-icon {
    transform: rotate(180deg);
}

/* Service Styles (copied and adapted from NavMenu) */
.service-details {
    border-radius: 8px;
    overflow: hidden;
    transition: 300ms;
}

.service-details[open] {
    background-color: rgb(249 250 251 / 0.5);
}

.service-details[open] summary {
    padding-block: 10px;
    background-color: #f1f3f4;
}

.service-item {
    padding: 4px 8px;
    box-sizing: border-box;
}

summary {
    padding: 4px 8px;
    box-sizing: border-box;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 300ms;
}

summary::-webkit-details-marker {
    display: none;
}

summary > plain-nav-item {
    flex: 1;
}

summary > div {
    flex: 1;
}

.vertical-separator {
    margin-inline: 6px;
    flex: 0 0 1px;
    min-height: 20px;
    background-color: #e0e0e0;
}

.chevron-icon {
    flex: 0 0 20px;
    cursor: pointer;

    width: 20px;
    height: 20px;
    
    color: rgb(156, 163, 175);

    transition: transform 0.3s ease;
}

.service-details[open] .chevron-icon {
    transform: rotate(180deg);
}

.service-details::details-content {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease, content-visibility 0.3s allow-discrete;
}

.service-details[open]::details-content {
    height: auto;
}

.nav-item-separator {
    border-top: 1px solid #ffffff5c;
}

ul {
    list-style: none;
    padding: 8px;
    margin: 0;
    margin-left: 16px;
}

.catalogues-label {
    padding: 8px;
    padding-bottom: 0;
    margin: 0;
    margin-top: 6px;
    margin-left: calc(16px + 8px + 10px);
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    display: block;
}

/* Skeleton Loader */
.skeleton-loader {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.skeleton-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
}

.skeleton-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

.skeleton-text {
    height: 16px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

.skeleton-separator {
    margin: 0;
    border-color: #f0f0f0;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
} `;function _e(e){if(!e||typeof e!=`string`)return null;try{let t=[],n=e.replace(/\bTrue\b/g,`true`).replace(/\bFalse\b/g,`false`).replace(/\bNone\b/g,`null`).replace(/"((?:[^"\\]|\\.)*)"/g,(e,n)=>(t.push(n),`<<<${t.length-1}>>>`)).replace(/'((?:[^'\\]|\\.)*)'/g,(e,t)=>`"${t.replace(/\\'/g,`'`).replace(/"/g,`\\"`)}"`).replace(/<<<(\d+)>>>/g,(e,n)=>`"${t[parseInt(n)]}"`);return JSON.parse(n)}catch(t){return console.warn(`Failed to parse Python object to JSON:`,e,t),null}}function ve(e){if(!e||typeof e!=`string`||!e.startsWith(`[`)||e===`[]`)return null;let t=_e(e);if(!t)return null;if(Array.isArray(t)&&t.length>0){let e=t[0];if(typeof e==`object`&&e&&`name`in e)return t.map(e=>e.name||e.display_name||``).filter(e=>e!==``)}return null}function x(e){if(!e)return[];if(Array.isArray(e))return e.map(e=>{if(typeof e==`object`&&e){let t=e.name||e.display_name||``;if(!t)return null;let n=t.match(/^\(([^)]+)\)/);return n?n[1]:t}if(typeof e==`string`){let t=e.match(/^\(([^)]+)\)/);return t?t[1]:e}return null}).filter(e=>e!==null&&e!==``);if(typeof e==`string`){if(e.startsWith(`[`)){let t=_e(e);if(t)return x(t)}let t=e.match(/^\(([^)]+)\)/);return t?[t[1]]:[e]}if(typeof e==`object`&&e){let t=e.name||e.display_name||``;if(!t)return[];let n=t.match(/^\(([^)]+)\)/);return n?[n[1]]:[t]}return[]}function S(e){return e&&e.startsWith(`as_`)?e.substring(3).replace(/_/g,` `).split(` `).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` `):`Other`}function C(e){if(!e)return``;let t=document.createElement(`div`);return t.innerHTML=e,t.textContent||t.innerText||``}var ye=class extends i{serviceContext;metagoraContext;searchQuery=``;selectedCompany=null;searchTimeout=null;constructor(){super(`plain-metagora-nav-menu`,ge),this.serviceContext=this.useContext(m.SERVICE,!0),this.metagoraContext=this.useContext(m.METAGORA,!0)}handleSearch(e){let t=e.target.value.toLowerCase();this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=window.setTimeout(()=>{this.searchQuery=t,this.updateList()},300)}handleCompanyFilter(e){this.selectedCompany===e?this.selectedCompany=null:this.selectedCompany=e,this.updateList(),this.updateFilterChips()}updateList(){let e=this.$(`#services-list`);e&&(e.innerHTML=this.getServicesListHTML())}updateFilterChips(){(this.shadowRoot?.querySelectorAll(`.filter-chip`))?.forEach(e=>{let t=e.getAttribute(`data-company`);t===this.selectedCompany||t===`all`&&this.selectedCompany===null?e.classList.add(`active`):e.classList.remove(`active`)})}renderSkeletonLoader(){let e=[,,,,].fill(null).map((e,t)=>this.html`
            <div class="skeleton-item">
                <div class="skeleton-icon"></div>
                <div class="skeleton-text" style="width: ${70+t*10%30}%"></div>
            </div>
            ${t<3?`<hr class="nav-item-separator skeleton-separator"/>`:``}
        `).join(``);return this.html`
            <div class="skeleton-loader">
                ${e}
            </div>
        `}renderService(e){let t=e.fields.catalogues.websites,n=t&&t.length>0,r=e.fields.main_url&&e.fields.main_url!==`False`?e.fields.main_url:``,i=e.fields.company?.fields?.name,a=this.metagoraContext.get(`agoras`)?.find(e=>e.name===i)?.primaryColor||`#000000`,o=this.html`
            <plain-nav-item
                service-name="${e.fields.name}"
                service-description="${e.fields.description}"
                main-url="${r}"
                service-icon="${e.fields.service_icon}"
                company-name="${i}"
                company-primary-color="${a}"
            ></plain-nav-item>
        `;return n?this.html`
            <details class="service-details">
                <summary>
                    <div onclick="event.preventDefault()">
                        ${o}
                    </div>
                    <div class="vertical-separator"></div>
                    ${g}
                </summary>
                <span class="catalogues-label">Catalogues</span>
                <ul>
                    ${t.map(e=>this.html`
                            <plain-catalogue-item 
                                name="${e.name}"
                                url="${e.url}"
                                model="${e.model}"
                                view-id="${e.view_id}"
                                website="${e.website}"
                                company-name="${i}"
                            ></plain-catalogue-item>
                        `).join(``)}
                </ul>
            </details>
        `:this.html`
                <div class="service-item">
                    ${o}
                </div>
            `}getUniqueCompanies(e){let t=new Set;return e.forEach(e=>{let n=e.fields.company?.fields?.name;n&&t.add(n)}),Array.from(t).sort()}getServicesListHTML(){let e=this.serviceContext.get(`services`),t=this.searchQuery,n=this.selectedCompany;if(!e||e.length===0)return``;let r={},i=!1;e.forEach(e=>{if(n&&e.fields.company?.fields?.name!==n)return;if(t){let n=e.fields.name?.toLowerCase()||``,r=(e.fields.catalogues?.websites||[]).some(e=>e.name?.toLowerCase().includes(t));if(!n.includes(t)&&!r)return}let a=e.fields.category||`Uncategorized`,o=S(a)||a;r[o]||(r[o]=[]),r[o].push(e),i=!0});let a=Object.keys(r).sort();return!i&&(t||n)?this.html`
                    <div class="no-results">
                        No services found matching your criteria
                    </div>
                `:this.html`
            ${a.map((e,i)=>{let o=r[e],s=e,c=!!t||!!n;return this.html`
                    <details class="category-details" ${c?`open`:``}>
                        <summary class="category-summary">
                            <span class="category-name">${s}</span>
                            ${g}
                        </summary>
                        <div class="category-services">
                            ${o.map((e,t)=>this.html`
                                    ${this.renderService(e)}
                                    ${t===o.length-1?``:`<hr class="nav-item-separator"/>`}
                                `).join(``)}
                        </div>
                    </details>
                    ${i===a.length-1?``:`<hr class="category-separator"/>`}
                `}).join(``)}
        `}template(){let e=this.serviceContext.get(`services`);if(!e||e.length===0)return this.renderSkeletonLoader();let t=this.getUniqueCompanies(e);return this.html`
            <div class="search-container">
                <div class="search-input-wrapper">
                    <span class="search-icon">${_}</span>
                    <input 
                        type="text" 
                        class="nav-search-input" 
                        placeholder="Search services..." 
                        value="${this.searchQuery}"
                        oninput="this.getRootNode().host.handleSearch(event)"
                    />
                </div>
                ${t.length>0?this.html`
                    <div class="filter-container">
                        <button 
                            class="filter-chip ${this.selectedCompany===null?`active`:``}" 
                            data-company="all"
                            onclick="this.getRootNode().host.handleCompanyFilter(null)"
                        >
                            All
                        </button>
                        ${t.map(e=>this.html`
                            <button 
                                class="filter-chip ${this.selectedCompany===e?`active`:``}" 
                                data-company="${e}"
                                onclick="this.getRootNode().host.handleCompanyFilter('${e}')"
                            >
                                ${e}
                            </button>
                        `).join(``)}
                    </div>
                `:``}
            </div>
            <div id="services-list">
                ${this.getServicesListHTML()}
            </div>
        `}};window.customElements.define(`plain-metagora-nav-menu`,ye);var be=`.plain-greetings-wrapper {
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 2rem;

}

.greetings-container {
    max-width: 800px;
}

.headline {
    margin: 0 0 1rem 0;

    font-family: 'Sora', sans-serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;

    opacity: 0;
    animation: slideUpFade 0.8s ease-out forwards;
}

.subheadline {
    margin: 0 0 2rem 0;

    max-width: 600px;

    font-family: 'Geist', sans-serif;
    font-size: clamp(12px, 2vw, 16px);
    font-weight: 400;
    text-wrap: balance;
    color: #666;
    line-height: 1.6;

    opacity: 0;
    animation: slideUpFade 0.8s ease-out 0.2s forwards;
}

.subheadline strong {
    font-weight: 600;
}

.prompt {
    margin: 0;

    display: flex;
    align-items: baseline;
    gap: 0.5ch;

    font-family: 'Geist Mono', monospace;
    font-size: 14px;
    color: #888;

    opacity: 0;

    animation: slideUpFade 0.8s ease-out 0.4s forwards;
}

.dynamic-wrapper {
    position: relative;

    height: 1.2em;

    display: inline-block;

    vertical-align: bottom;

    overflow: hidden;
}

.dynamic-text {
    display: inline-block;

    color: #555;
    font-weight: 500;

    border-bottom: 1px dashed #ccc;
}

.dynamic-text.roll-out {
    animation: rollOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.dynamic-text.roll-in {
    animation: rollIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes rollOut {
    from {
        transform: translateY(0);
        opacity: 1;
    }

    to {
        transform: translateY(-100%);
        opacity: 0;
    }
}

@keyframes rollIn {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideUpFade {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}`,xe=class extends i{companyContext;examples=[`funding opportunities`,`research partners`,`upcoming events`,`shared infrastructure`,`challenges`];intervalId;constructor(){super(`plain-greetings`,be),this.companyContext=this.useContext(m.COMPANY,!0)}connectedCallback(){super.connectedCallback(),this.startCycling()}disconnectedCallback(){super.disconnectedCallback(),this.intervalId&&clearInterval(this.intervalId)}startCycling(){let e=0;this.intervalId=setInterval(()=>{e=(e+1)%this.examples.length;let t=this.shadowRoot?.querySelector(`.dynamic-text`);t&&(t.classList.remove(`roll-in`),t.classList.add(`roll-out`),setTimeout(()=>{t.textContent=this.examples[e],t.classList.remove(`roll-out`),t.classList.add(`roll-in`)},400))},4e3)}template(){let e=this.companyContext.get(`primaryColor`)||`inherit`;return this.html`
            <div class="greetings-container">
                <h1 class="headline">What will you discover?</h1>
                <p class="subheadline">
                    From funding and courses to shared infrastructure and researcher matchmaking — find the right resources to accelerate your career in the <strong style="color: ${e}">${this.companyContext.get(`name`)||``}</strong> Agora.
                </p>
                <p class="prompt">
                    Try searching for <span class="dynamic-wrapper"><span class="dynamic-text">${this.examples[0]}</span></span>
                </p>
            </div>
        `}};window.customElements.define(`plain-greetings`,xe);var Se=`.plain-carousel-wrapper {
    height: 100%;
    max-height: var(--slide-height);
}

.carousel-container {
    position: relative;
    width: 100%;
    height: var(--slide-height);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.slide {
    width: 100%;
    height: var(--slide-height);
    position: relative;
}

.carousel-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    z-index: 0;
}

.carousel-bg.active {
    opacity: 1;
    z-index: 1;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%);
    z-index: 2;
}

.content {
    position: relative;
    z-index: 3;
    padding: var(--content-padding);
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    color: white;
    max-width: 600px;
}

.tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;

    font-size: var(--small-text-size);
    font-weight: 700;
    text-transform: uppercase;

    margin-bottom: 16px;

    backdrop-filter: blur(5px);
    background-color: rgb(255, 255, 255, 0.3);
}

.title {
    font-size: var(--big-text-size);
    font-weight: 700;
    margin: 0 0 12px 0;
    line-height: 1.2;
}

.description {
    margin: 0 0 24px 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;

    font-size: var(--default-text-size);
    font-weight: 400;
    line-height: 1.5;
    line-clamp: 3;
    -webkit-line-clamp: 3;

    opacity: 0.9;

    overflow: hidden;
}

.search-terms {
    margin-bottom: 24px;

    font-family: 'Geist Mono', monospace;
    font-size: var(--small-text-size);
    opacity: 0.8;
}

.search-terms span {
    margin-right: 8px;
}

.action-button {
    padding: var(--cta-padding);
    width: var(--cta-width);
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    color: white;
    text-decoration: none;
    font-weight: 400;
    font-size: var(--cta-text-size);

    border-radius: 8px;
    
    transition: background-color 0.2s;
}

.action-button:hover {
    background-color: #f1f3f4;
}

.action-button svg {
    margin-left: 0;
    max-width: 0;
    opacity: 0;
    transition: all 0.3s ease;
}

.action-button:hover svg {
    margin-left: 8px;
    max-width: var(--default-text-size);
    opacity: 1;
}

.pagination {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 8px;
    z-index: 2;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: background-color 0.3s, width 0.6s;
}

.dot.active {
    background-color: white;
    width: 24px;
    border-radius: 5px;
}

/* Animations */
.anim-slide-text {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    transform: translateX(0);
    opacity: 1;
}

.anim-slide-text.exit {
    opacity: 0;
    transform: translateX(50px);
}

.anim-slide-text.enter-start {
    opacity: 0;
    transform: translateX(-50px);
    transition: none;
}

.anim-fade {
    transition: opacity 0.5s ease-in-out;
    opacity: 1;
}

.anim-fade.exit {
    opacity: 0;
}

.anim-fade.enter-start {
    opacity: 0;
    transition: none;
}

.gradient-bg {
    background: linear-gradient(-45deg, var(--primary-color, #8238eb), #2c3e50, #000000, var(--primary-color, #8238eb)) !important;
    background-size: 400% 400% !important;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}`,Ce=class extends i{serviceContext;configContext;companyContext;currentIndex=0;intervalId=null;activeBgIndex=0;constructor(){super(`plain-carousel`,Se),this.serviceContext=this.useContext(m.SERVICE,!0),this.configContext=this.useContext(m.CONFIG,!0),this.companyContext=this.useContext(m.COMPANY,!0)}connectedCallback(){super.connectedCallback(),this.startAutoPlay()}disconnectedCallback(){super.disconnectedCallback(),this.stopAutoPlay()}startAutoPlay(){this.stopAutoPlay(),this.intervalId=setInterval(()=>{this.nextSlide()},5e3)}stopAutoPlay(){this.intervalId&&=(clearInterval(this.intervalId),null)}nextSlide(){let e=this.serviceContext.get(`services`)||[];e.length!==0&&(this.currentIndex=(this.currentIndex+1)%e.length,this.updateView())}setSlide(e){this.currentIndex=e,this.updateView(),this.startAutoPlay()}updateView(){let e=this.serviceContext.get(`services`)||[];if(e.length===0)return;let{name:t,description:n,image:r,suggested_search_terms:i,main_url:a}=e[this.currentIndex].fields,o=this.$$(`.carousel-bg`);if(o&&o.length===2){let e=this.activeBgIndex===0?1:0,t=o[this.activeBgIndex],n=o[e];r?(n.style.backgroundImage=`url('${this.configContext.get(`API_HOST`)}${r}')`,n.style.removeProperty(`--primary-color`),n.classList.remove(`gradient-bg`)):(n.style.backgroundImage=``,n.style.setProperty(`--primary-color`,this.companyContext.get(`primaryColor`)||`#8238eb`),n.classList.add(`gradient-bg`)),n.classList.add(`active`),t.classList.remove(`active`),this.activeBgIndex=e}let s=[this.$(`.title`),this.$(`.description`),this.$(`.search-terms`)],c=[this.$(`.tag`),this.$(`.action-button`)];s.forEach(e=>e?.classList.add(`exit`)),c.forEach(e=>e?.classList.add(`exit`)),setTimeout(()=>{let e=this.$(`.title`);e&&(e.textContent=t);let r=this.$(`.description`);r&&(r.textContent=n);let o=this.$(`.search-terms`);if(o){let e=[];typeof i==`string`?e=i.split(`,`):Array.isArray(i)&&(e=i),o.innerHTML=e.slice(0,3).map(e=>`<span>#${e.trim()}</span>`).join(` `)}let l=this.$(`.action-button`);l&&(a&&a!==`False`?(l.style.display=``,l.href=`${a}`,l.style.backgroundColor=this.companyContext.get(`primaryColor`)||`#8238eb`):l.style.display=`none`);let u=this.$$(`.dot`);u&&u.forEach((e,t)=>{t===this.currentIndex?e.classList.add(`active`):e.classList.remove(`active`)}),s.forEach(e=>{e&&(e.classList.remove(`exit`),e.classList.add(`enter-start`))}),c.forEach(e=>{e&&(e.classList.remove(`exit`),e.classList.add(`enter-start`))});let d=this.$(`.slide`);d&&d.offsetWidth,s.forEach(e=>e?.classList.remove(`enter-start`)),c.forEach(e=>e?.classList.remove(`enter-start`))},500)}setupVariants(){switch(this.props.variant){case`small`:this.style.setProperty(`--slide-height`,`180px`),this.style.setProperty(`--big-text-size`,`16px`),this.style.setProperty(`--default-text-size`,`12px`),this.style.setProperty(`--small-text-size`,`10px`),this.style.setProperty(`--content-padding`,`20px 40px`),this.style.setProperty(`--cta-width`,`100px`),this.style.setProperty(`--cta-padding`,`5px 10px`),this.style.setProperty(`--cta-text-size`,`10px`);break;default:this.style.setProperty(`--slide-height`,`100%`),this.style.setProperty(`--big-text-size`,`32px`),this.style.setProperty(`--default-text-size`,`16px`),this.style.setProperty(`--small-text-size`,`14px`),this.style.setProperty(`--content-padding`,`40px`),this.style.setProperty(`--cta-width`,`150px`),this.style.setProperty(`--cta-padding`,`10px 20px`),this.style.setProperty(`--cta-text-size`,`14px`);break}}template(){this.setupVariants();let e=this.serviceContext.get(`services`)||[];if(e.length===0)return this.html``;let{name:t,description:n,image:r,suggested_search_terms:i,main_url:a}=e[this.currentIndex].fields,o=!!r,s=o?`background-image: url('${this.configContext.get(`API_HOST`)}${r}');`:`--primary-color: ${this.companyContext.get(`primaryColor`)||`#8238eb`};`,c=o?``:`gradient-bg`,l=a&&a!==`False`,u=l?`background-color: ${this.companyContext.get(`primaryColor`)||`#8238eb`}`:`display: none;`;return this.html`
            <div class="carousel-container ${this.props.variant?`carousel-${this.props.variant}`:``}">
                <div class="slide">
                    <div class="carousel-bg active ${c}" style="${s}"></div>
                    <div class="carousel-bg"></div>
                    <div class="overlay"></div>
                    <div class="content">
                        <div class="tag anim-fade">Service</div>
                        <h1 class="title anim-slide-text">${t}</h1>
                        ${this.props.variant!==`small`&&this.html`<p class="description anim-slide-text">${n}</p>`}
                        <div class="search-terms anim-slide-text">
                            ${i&&i.split(`,`).slice(0,3).map(e=>`<span>#${e.trim()}</span>`).join(` `)}
                        </div>
                        <a 
                            href="${l?a:`#`}"
                            target="_blank"
                            class="action-button anim-fade"
                            style="${u}"
                        >
                            Read More ${oe}
                        </a>
                    </div>
                </div>
                ${this.props.variant===`small`?``:this.html`
                    <div class="pagination">
                        ${e.map((e,t)=>`
                            <span 
                                class="dot ${t===this.currentIndex?`active`:``}" 
                            ></span>
                        `).join(``)}
                    </div>
                `}
            </div>
        `}listeners(){let e=this.$$(`.dot`);e&&e.forEach((e,t)=>{e.onclick=()=>this.setSlide(t)})}};window.customElements.define(`plain-carousel`,Ce);var we=`.plain-metagora-hero-wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    border-radius: 32px;
} 

/* ==== BACKGROUND ========================================================== */
.background-container {
    width: 100%;
    height: 1538px !important;
    border-radius: 5px;
    background: #E86A2F; /* White background for contrast */
    overflow: hidden; /* Hide overflow for masking */
    z-index: -1; /* Behind all other content */
    pointer-events: none; /* Don't block interactions with other elements */
}

@media (max-width: 768px) {
    .background-container {
        background:#E86A2F !important;
    }
}

/* ==== BACKGROUND SHAPES =================================================== */
.central-square {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: 32px;

    /* width: 10px;
    height: 10px; */
    width: calc(100% - 32px);
    height: calc(100% - 32px);

    background-color: blue;

    overflow: hidden;

    /* animation: expand 1.5s ease-in-out forwards; */

    transition: 300ms;
}

.gradient-layer {
    position: absolute;
    width: 220vw;
    height: 130vh;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    filter: blur(75px);
    animation: gradientShift 12s ease-in-out infinite alternate;
    z-index: 1;
    opacity: 0; /* Initially hidden */
}

.ellipse {
    position: absolute;
    background: #FFFFFF;
    border-radius: 50%;
    opacity: 1;
    filter: blur(50px);
    z-index: 2;
    
    /* This creates the effect where gradient shows through */
    background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    animation: ellipseColorShift 12s ease-in-out infinite alternate;
}

.ellipse-323 {
    width: 1200px;
    height: 1200px;
    animation: ellipse323Move 9s ease-in-out infinite alternate;
}

.ellipse-324 {
    width: 550px;
    height: 550px;
    animation: ellipse324Move 11s ease-in-out infinite alternate;
}

.ellipse-325 {
    width: 650px;
    height: 650px;
    animation: ellipse325Move 13s ease-in-out infinite alternate;
}

.ellipse-326 {
    width: 900px;
    height: 1000px;
    animation: ellipse326Move 15s ease-in-out infinite alternate;
}

.ellipse-327 {
    width: 650px;
    height: 650px;
    animation: ellipse327Move 12s ease-in-out infinite alternate;
}

.ellipse-328 {
    width: 650px;
    height: 650px;
    animation: ellipse328Move 10s ease-in-out infinite alternate;
}

.ellipse-329 {
    width: 650px;
    height: 650px;
    animation: ellipse329Move 14s ease-in-out infinite alternate;
}

.ellipse-330 {
    width: 650px;
    height: 650px;
    animation: ellipse330Move 11s ease-in-out infinite alternate;
}

@media (max-width: 768px) {
    .ellipse {
        transform: scale(0.7);
    }
}

@media (max-width: 480px) {
    .ellipse {
        transform: scale(0.5);
    }
}

/* ==== CONTENT ============================================================= */
.metagora-hero--content {
    position: relative;
    padding: 64px;
    padding-block: 48px;
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: flex-start;

    z-index: 100;
}

.metagora-hero--left {
    flex: 0 0 60%;

    max-width: 60%;

    display: flex;
    flex-direction: column;
}

.metagora-hero--right {
    flex: 0 0 40%;

    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-gutter: stable;
}

.metagora-hero--right::-webkit-scrollbar {
    width: 4px;
}

.metagora-hero--right::-webkit-scrollbar-track {
    background: transparent;
}

.metagora-hero--right::-webkit-scrollbar-thumb {
    background: #ffffff;
    border-radius: 50pt;
}

.metagora-hero--right::-webkit-scrollbar-button {
    display: none;
}

.metagora-hero--words {
    padding-top: 24px;
    padding-inline: 12px;

    font-family: 'Sora', sans-serif;
    font-size: 124px;
    font-weight: 800;
    color: white;

    display: flex;
    align-items: center;
}

@media (max-width: 1600px) {
    .metagora-hero--words {
        font-size: 86px;
    }
}

@media (max-width: 1200px) {
    .metagora-hero--words {
        font-size: 64px;
    }
}

@media (max-width: 768px) {
    .metagora-hero--words {
        font-size: 48px;
    }
}

.metagora-hero--words .animated-word {
    display: inline-block;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 1;
    transform: translateY(0);
}

.metagora-hero--words .animated-word.fade-out {
    opacity: 0;
    transform: translateY(10px);
}

.metagora-hero--greetings {
    padding: 16px;

    font-family: 'Geist', sans-serif;
    color: white;
}

.metagora-hero--alliances-container {
    list-style: none;

    padding: 0;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 16px;
}

.metagora-hero--alliance-item {
    padding: 12px 16px;
}

.metagora-hero--alliance-link {
    padding: 12px 16px;
    color: rgb(from white r g b / 0.9);

    display: flex;
    align-items: center;
    gap: 12px;
}

.metagora-hero--alliance-icon,
.metagora-hero--cta-icon {
    opacity: 0.5;
    transition: 300ms;
}

.metagora-hero--alliance-item:hover .metagora-hero--alliance-icon {
    opacity: 1;
}

.metagora-hero--cta-container {
    margin-top: 32px;
    padding: 16px;

    display: flex;
    align-items: center;
    gap: 16px;
}

.metagora-hero--cta-container a {
    font-family: 'Geist', sans-serif;
    font-weight: 600;
    color: white;

    text-decoration: none;
}

.metagora-hero--cta {
    display: flex;
    align-items: center;
    gap: 8px;
}

.metagora-hero--cta:hover .metagora-hero--cta-icon {
    opacity: 1;
}

/* ==== ANIMATIONS ========================================================== */
.move-out-to-left {
    animation: moveOutToLeft 4s ease-in-out forwards;
}

@keyframes expand {
    0% {
        width: 10px;
        height: 10px;
    }
    100% {
        width: calc(100% - 32px);
        height: calc(100% - 32px);
    }
}

@keyframes moveOutToLeft {
    0% {
        transform: translate(-50%, -50%);
    }
    100% {
        transform: translate(-100%, -50%);
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes gradientShift {
    0% {
        background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
    25% {
        background: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
        transform: translate(-50%, -50%) rotate(5deg) scale(1.1);
    }
    50% {
        background: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
        transform: translate(-50%, -50%) rotate(-3deg) scale(1.05);
    }
    75% {
        background: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
        transform: translate(-50%, -50%) rotate(7deg) scale(0.95);
    }
    100% {
        background: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
}

@keyframes ellipseColorShift {
    0% {
        background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    }
    25% {
        background-image: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
    }
    50% {
        background-image: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
    }
    75% {
        background-image: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
    }
    100% {
        background-image: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
    }
}

@keyframes ellipse323Move {
    0% { left: -15%; top: 1.5%; }
    25% { left: 5%; top: -17%; }
    50% { left: -42%; top: -5%; }
    75% { left: -4%; top: -3%; }
    100% { left: 0%; top: -7%; }
}

@keyframes ellipse324Move {
    0% { left: 30%; top: 4%; }
    25% { left: 38%; top: -8.5%; }
    50% { left: 38%; top: -8.5%; }
    75% { left: 38.5%; top: 10%; }
    100% { left: 38.5%; top: 10%; }
}

@keyframes ellipse325Move {
    0% { left: 19%; top: 38%; }
    25% { left: 8.5%; top: 25%; }
    50% { left: 8.5%; top: 25%; }
    75% { left: 8.5%; top: 25%; }
    100% { left: 12%; top: 29%; }
}

@keyframes ellipse326Move {
    0% { left: 47%; top: 2.5%; }
    25% { left: 69%; top: -3%; }
    50% { left: 50%; top: 10%; }
    75% { left: 47.5%; top: 1.8%; }
    100% { left: 51.5%; top: -2%; }
}

@keyframes ellipse327Move {
    0% { left: 46.5%; top: 20.5%; }
    25% { left: 41%; top: 28%; }
    50% { left: 31%; top: 35%; }
    75% { left: 38%; top: 10.5%; }
    100% { left: 43%; top: 30.5%; }
}

@keyframes ellipse328Move {
    0% { left: 78.5%; top: 43.5%; }
    25% { left: 69.5%; top: 13%; }
    50% { left: 69.5%; top: 13%; }
    75% { left: 69.5%; top: 13%; }
    100% { left: 69.5%; top: 13%; }
}

@keyframes ellipse329Move {
    0% { left: 89%; top: -5%; }
    25% { left: 89%; top: -5%; }
    50% { left: 89%; top: -16%; }
    75% { left: 84%; top: 11.5%; }
    100% { left: 88%; top: -7%; }
}

@keyframes ellipse330Move {
    0% { left: -26.5%; top: -5%; }
    25% { left: -26.5%; top: -5%; }
    50% { left: -26.5%; top: -5%; }
    75% { left: -26.5%; top: 10.5%; }
    100% { left: -26.5%; top: -5.5%; }
}

/* ==== ICON SPINNER ======================================================== */
.metagora-hero--icon-spinner {
    position: absolute;
    top: 32px;
    right: 32px;

    padding: 8px;
    box-sizing: border-box;

    width: 48px;
    height: 48px;

    background: white;
    border-radius: 50%;
    
    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;
    
    animation: simpleSpin 20s linear infinite;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    
    pointer-events: auto; /* Ensure it captures events if needed, though mostly visual */
}

.metagora-hero--icon-spinner svg {
    width: 100%;
    height: 100%;
}

@keyframes simpleSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`,Te=class extends i{metagoraContext;words=[`Explore`,`Transform`,`Empower`,`Accelerate`,`Bound`,`Innovate`];currentWordIndex=0;intervalId=null;wordElement=null;constructor(){super(`plain-metagora-hero`,we),this.metagoraContext=this.useContext(m.METAGORA,!0)}template(){let e=this.metagoraContext.get(`agoras`)||[];return this.html`
            <div class="central-square">
                <section class="s_aupaeu_animated_background background-container" >
                    <div class="gradient-layer"></div>
                    <div class="ellipse ellipse-323"></div>
                    <div class="ellipse ellipse-324"></div>
                    <div class="ellipse ellipse-325"></div>
                    <div class="ellipse ellipse-326"></div>
                    <div class="ellipse ellipse-327"></div>
                    <div class="ellipse ellipse-328"></div>
                    <div class="ellipse ellipse-329"></div>
                    <div class="ellipse ellipse-330"></div>
                </section>
            </div>
            <section class="metagora-hero--content">
                <div class="metagora-hero--left">
                    <div class="metagora-hero--words">
                        <span class="animated-word">${this.words[0]}</span>
                    </div>
                    
                    <div class="metagora-hero--greetings" contenteditable="true">
                            Agora is a digital platform designed to support the<br/>
                            institutional transformation of HEI. Agora acts as a practical<br/>
                            tool for HEIs seeking impactful and sustainable change.<br/><br/>
                            Next, you can find more information about <b>all the alliances</b><br/>
                            that are part of the Agora ecosystem.
                        </div>

                    <div class="metagora-hero--cta-container">
                        <a  href="https://aupaeu.widening.eu/" 
                            target="_blank" 
                            class="metagora-hero--cta"
                        >
                            Know more about us
                            <span class="metagora-hero--cta-icon">${y}</span>
                        </a>
                        <a  href="https://aupaeu.widening.eu/contact" 
                            target="_blank" 
                            class="metagora-hero--cta metagora-hero--cta-secondary"
                        >
                            Contact us
                            <span class="metagora-hero--cta-icon">${y}</span>
                        </a>
                    </div>
                </div>
                
                <div class="metagora-hero--right">
                    <ul class="metagora-hero--alliances-container">
                        ${e.map(e=>this.html`
                            <li class="metagora-hero--alliance-item">
                                <a  class="metagora-hero--alliance-link" 
                                    href="${e.host}" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    ${e.name}
                                    <span class="metagora-hero--alliance-icon">
                                        ${y}
                                    </span>
                                </a>
                            </li>
                        `).join(``)}
                    </ul>
                </div>
            </section>
            <div class="metagora-hero--icon-spinner">
                ${h}
            </div>
        `}listeners(){this.startAnimation()}connectors(){}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.stopAnimation()}startAnimation(){this.wordElement=(this.shadowRoot||this).querySelector(`.animated-word`),this.wordElement&&!this.intervalId&&(this.intervalId=window.setInterval(()=>this.rotateWord(),2500))}stopAnimation(){this.intervalId&&=(clearInterval(this.intervalId),null)}rotateWord(){this.wordElement&&(this.wordElement.classList.add(`fade-out`),setTimeout(()=>{this.currentWordIndex=(this.currentWordIndex+1)%this.words.length,this.wordElement&&(this.wordElement.textContent=this.words[this.currentWordIndex],this.wordElement.classList.remove(`fade-out`))},500))}};window.customElements.define(`plain-metagora-hero`,Te);var Ee=`:host {
    display: block;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.results-container {
    width: 100%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    box-sizing: border-box;
}

.results-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    margin: 0;
    margin-bottom: -1.5rem; /* Pull it closer to the first section */
}

/* Category Section Styles */
.category-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.category-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

.category-accent-bar {
    width: 6px;
    height: 28px;
    border-radius: 3px;

    background-color: #e2e8f0; /* Default gray, can be customized per category */
}

.category-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #111827;
    letter-spacing: 0.05em;
}

.category-result-count {
    background-color: #e2e8f0;
    color: #475569;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 600;
}

.category-agora-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-left: auto;
}

.agora-badge {
    font-size: 0.7rem;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid #e5e7eb;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    transition: filter 0.2s ease;
}

.agora-badge:hover {
    filter: brightness(0.5);
}

.category-services {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-left: 0.5rem;
}

/* Service Section Styles */
.service-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.accent-bar {
    width: 4px;
    height: 24px;
    background-color: #3b82f6;
    border-radius: 2px;
}

.service-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    letter-spacing: 0.025em;
}

/* Smaller service title when nested inside category */
.category-services .service-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.015em;
}

.result-count {
    background-color: #f1f5f9;
    color: #64748b;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
}

.carousel-controls {
    display: flex;
    gap: 0.75rem;
}

.arrow-btn {
    cursor: pointer;
    padding: 0;

    width: 32px;
    height: 32px;

    display: grid;
    place-content: center;

    border-radius: 50%;
    border: 1px solid #e5e7eb;

    background: white;

    transition: all 0.2s ease;
    color: #6b7280;
}

.arrow-btn:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
}

.arrow-btn:active {
    color: #111827;
    background-color: #d8d8d8;
}

.arrow-btn svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
}

.carousel-wrapper {
    position: relative;
    width: 100%;
}

.carousel-container {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 0.5rem 0.25rem; /* Slight padding for shadows if needed */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}

.carousel-container::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

.carousel-container plain-dynamic-card {
    flex: 0 0 240px; /* Adjusted width */
    min-width: 320px;
}

/* Stacked Column for Medium Cards */
.stacked-column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 0 0 240px;
    min-width: 320px;
}

.stacked-column plain-dynamic-card {
    flex: 1;
    min-height: 0;
}

/* Agora Cards Grid */
.agora-cards-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 0.5rem 0.25rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.agora-cards-grid::-webkit-scrollbar {
    display: none;
}

/* Agora Card */
.agora-card {
    flex: 1;
    flex-shrink: 0;
    /* min-height: 320px; */
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    width: 100%;
}

.agora-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--agora-color, #e5e7eb);
}

/* Agora Card Header */
.agora-card-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, #fafafa, white);
}

.agora-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.agora-card-header .agora-badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 5px;
    border: 1px solid;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition: filter 0.2s ease;
}

.agora-card-header .agora-badge:hover {
    filter: brightness(0.5);
}

.agora-result-count {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
}

.agora-carousel-controls {
    display: flex;
    gap: 0.25rem;
}

.agora-arrow-btn {
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: grid;
    place-content: center;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    background: white;
    transition: all 0.2s ease;
    color: #9ca3af;
}

.agora-arrow-btn:hover {
    background: #f9fafb;
    border-color: var(--agora-color, #d1d5db);
    color: var(--agora-color, #374151);
}

.agora-arrow-btn svg {
    width: 10px;
    height: 10px;
    fill: currentColor;
}

/* Agora Items Container */
.agora-items {
    flex: 1;
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.agora-items::-webkit-scrollbar {
    display: none;
}

.agora-items plain-dynamic-card {
    /* flex: 0 0 280px; */
    min-width: 280px;
}

/* More Results Card */
.more-results-card {
    flex: 0 0 120px;
    min-width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 2px dashed;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    font-family: inherit;
}

.more-results-card:hover {
    transform: scale(1.02);
}

.more-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: #374151;
}

.more-label {
    font-size: 0.65rem;
    color: #6b7280;
    margin-top: 0.125rem;
}

/* Empty state */
.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    padding: 2rem;
}

.empty-state p {
    color: #9ca3af;
    font-size: 1rem;
    text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
    .results-container {
        padding: 1rem;
        gap: 2rem;
    }

    .service-title {
        font-size: 1rem;
    }

    .carousel-container plain-dynamic-card {
        flex: 0 0 280px;
        min-width: 280px;
    }

    .stacked-column {
        flex: 0 0 280px;
        min-width: 280px;
    }

    .carousel-controls {
        display: none; /* Hide arrows on mobile, rely on swipe */
    }

    /* Agora cards responsive */
    .agora-card {
        min-height: 260px;
    }

    .agora-carousel-controls {
        display: none;
    }

    .agora-items plain-dynamic-card {
        /* flex: 0 0 240px; */
        min-width: 240px;
    }
}`,De=`.plain-dynamic-card-wrapper {
    width: 100%;
    height: 100%;
}

.card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

/* Full and Medium Cards */
.full-card {
    height: 496px;
    display: flex;
    flex-direction: column;
}

.medium-card {
    height: 240px;
    display: flex;
    flex-direction: column;
}

/* Allow medium cards to stretch in stacked columns */
.stacked-column .plain-dynamic-card-wrapper,
.stacked-column .plain-dynamic-card-wrapper .medium-card {
    height: 100%;
}

.card-image-container {
    padding: 8px;
    box-sizing: border-box;
}

.card-image {
    width: 100%;
    height: 200px;

    border-radius: 10px;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
}

.full-card .card-content,
.medium-card .card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
    min-height: 0;
}

.card-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-shrink: 0;
}

.card-top-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.4;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
    word-break: break-word;
    flex-shrink: 0;
}

.score-badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background-color: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.score-badge.ai-pick {
    background: linear-gradient(135deg, #f0e6ff 0%, #e6f0ff 100%);
    border-color: #c4b5fd;
    color: #6b21a8;
}

.score-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: hsl(calc(var(--score) * 120), 70%, 50%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.score-dot.ai {
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
}

.card-summary {
    margin: 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    overflow: hidden;
    word-break: break-word;
    flex-shrink: 0;
}

/* Dynamic spacing for cards with summaries */
.full-card .card-summary,
.medium-card .card-summary {
    display: block;
    flex: 1;
    -webkit-line-clamp: unset;
    line-clamp: unset;
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.card-link {
    color: #8238eb;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9375rem;
    transition: color 0.2s;
}

.card-link:hover {
    color: #6b21a8;
    text-decoration: underline;
}

.card-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.125rem;
    max-width: 60%;
}

.card-origins {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
    justify-content: flex-end;
    max-width: 70%;
    min-width: 0;
}

.card-origin {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.7rem;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
    min-width: 0;
    background-color: #f3f4f6;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    border: 1px solid #e5e7eb;
}

.card-origin svg {
    flex-shrink: 0;
    opacity: 0.7;
}

.card-origin-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.card-model {
    color: #9ca3af;
    font-size: 0.75rem;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.card-model:hover {
    text-decoration: underline;
    color: #6b7280;
}

/* Minimal Card */
.minimal-card {
    height: 200px;
}

.minimal-card .card-content {
    padding: 1.25rem;
}

.minimal-card .card-title {
    font-size: 1.125rem;
}

.card-fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.field-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.field-label {
    color: #6b7280;
    font-weight: 500;
}

.field-value {
    color: #1f2937;
}

/* Highlighted Terms - Highlighter marker style */
mark {
    background-color: transparent; /* Will be set inline */
    color: inherit;
    padding: 0;
    border: none;
    border-radius: 0;
    font-weight: inherit;
}

/* Error State */
.error-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 150px;
    color: #9ca3af;
    font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .card-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .card-title {
        font-size: 1.125rem;
    }
}`;function Oe(e,t){return e?e.startsWith(`http://`)||e.startsWith(`https://`)?e:`${t}${e}`:``}function ke(e,t,n,r,i){if(!e||!t)return i||`#`;for(let i of n){let n=i.fields?.catalogues?.websites||[];for(let i of n)if(i.model===e){let e=i.view_id;return`${r}/offering/${e}/${t}`}}return i||`#`}function Ae(e,t=1){let n=e.startsWith(`#`)?e.slice(1):e,r=parseInt(n.slice(0,2),16),i=parseInt(n.slice(2,4),16),a=parseInt(n.slice(4,6),16);return`rgba(${r}, ${i}, ${a}, ${t})`}function je(e,t,n){if(!e||!t||t.length===0)return e;let r=e;return[...t].sort((e,t)=>t.length-e.length).forEach(e=>{if(!e)return;let t=e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`),i=RegExp(`\\b(${t}\\w*)`,`gi`),a=n.startsWith(`#`)?Ae(n,.2):`${n}33`;r=r.replace(i,`<mark style="background-color: ${a};">$1</mark>`)}),r}var Me=`.score-badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background-color: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.score-badge.ai-pick {
    background: linear-gradient(135deg, #f0e6ff 0%, #e6f0ff 100%);
    border-color: #c4b5fd;
    color: #6b21a8;
}

.score-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: hsl(calc(var(--score) * 120), 70%, 50%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.score-dot.ai {
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
}
`,Ne=class extends i{constructor(){super(`plain-score-badge`,Me)}get score(){let e=this.props.score;if(e==null||e===`null`||e===``)return null;let t=parseFloat(e);return isNaN(t)?null:t}get aiPickTitle(){return this.props.aiPickTitle||`Suggested by AI assistant`}get matchTitle(){return this.props.matchTitle||`This is the relevance of the result`}template(){let e=this.score;return e===null?this.html`
                <div class="score-badge ai-pick" title="${this.aiPickTitle}">
                    <div class="score-dot ai"></div>
                    <span class="score-value">AI Pick</span>
                </div>
            `:this.html`
            <div class="score-badge" style="--score: ${e}" title="${this.matchTitle}">
                <div class="score-dot"></div>
                <span class="score-value">${Math.round(e*100)}% Match</span>
            </div>
        `}};window.customElements.define(`plain-score-badge`,Ne);var Pe=class extends i{result;configContext;serviceContext;modalContext;companyContext;constructor(){super(`plain-dynamic-card`,De),this.configContext=this.useContext(m.CONFIG),this.serviceContext=this.useContext(m.SERVICE),this.modalContext=this.useContext(m.MODAL),this.companyContext=this.useContext(m.COMPANY),this.result=JSON.parse(this.props.result)}getDetailUrl(){let e=this.result?._sourceHost||this.configContext.get(`API_HOST`);return ke(this.result?.model,this.result?.data?.id,this.serviceContext.get(`services`)||[],e,this.result?.model_view_url)}getCardType(){let e=this.result?.data;if(!e)return`minimal`;let t=e?.name||e?.display_name,n=e?.x_summary||e?.x_description,r=e?.x_image,i=e?.x_origin||e?.x_home_partner_institution||e?.x_host_university||e?.x_participating_universities,a=e?.x_web_link||e?.x_link||e?.x_more_info||e?.x_additional_link,o=this.result?.model_view_url;return t&&n&&r&&i&&a&&o?`full`:t&&n?`medium`:`minimal`}extractFullCard(){let e=this.result.data,t=e?.x_origin||e?.x_university_origin||e?.x_home_partner_institution||e?.x_host_university||e?.x_participating_universities||``;return{score:this.result.score?.relative??null,image_url:e?.x_image||``,origins:x(t),name:e?.display_name||e?.name||``,summary:e?.x_summary||e?.x_description?C(e.x_summary||e.x_description):``,model_name:this.result?.model_verbose_name||``,detail_url:this.getDetailUrl(),additional_url:e?.x_web_link||e?.x_link||e?.x_more_info||e?.x_additional_link||``,catalogue_url:this.result.model_view_url||``}}extractMediumCard(){let e=this.result.data,t=e?.x_origin||e?.x_university_origin||e?.x_home_partner_institution||e?.x_host_university||e?.x_participating_universities,n=t?x(t):[];return{score:this.result.score?.relative??null,origins:n.length>0?n:void 0,name:e?.display_name||e?.name||``,summary:e?.x_summary||e?.x_description?C(e.x_summary||e.x_description):``,model_name:this.result?.model_verbose_name||``,detail_url:this.getDetailUrl(),catalogue_url:this.result.model_view_url,additional_url:e?.x_web_link||e?.x_link||e?.x_more_info||e?.x_additional_link}}extractMinimalCard(){let e=this.result.data,t=e?.x_origin||e?.x_university_origin||e?.x_home_partner_institution||e?.x_host_university||e?.x_participating_universities,n=t?x(t):[],r=this.result.score?.relative??null;return{name:e?.display_name||e?.name||`Untitled`,score:r,model_name:this.result?.model_verbose_name||``,origins:n.length>0?n:void 0}}getHighlightedText(e){let t=this.result?.roots||[],n=this.companyContext.get(`primaryColor`)||`#8238eb`;return je(e,t,n)}renderFullCard(){let e=this.extractFullCard(),t=this.configContext.get(`API_HOST`),n=e.origins.length>0?e.origins.map(e=>this.html`
                <span class="card-origin">
                    ${v}
                    <span class="card-origin-text">${e}</span>
                </span>
            `).join(``):``;return this.html`
            <div class="card full-card">
                ${e.image_url?this.html`
                        <div class="card-image-container">
                            <div 
                                class="card-image" 
                                style="background-image: url('${Oe(e.image_url,t)}')"
                            ></div>
                        </div>
                    `:``}
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-top-info">
                            <plain-score-badge score="${e.score}"></plain-score-badge>
                            ${n?this.html`
                                <div class="card-origins">
                                    ${n}
                                </div>
                            `:this.html`<span></span>`}
                        </div>
                        <h3 class="card-title">${this.getHighlightedText(e.name)}</h3>
                    </div>
                    <p class="card-summary">${this.getHighlightedText(e.summary)}</p>
                    <div class="card-footer">
                        <a href="${e.detail_url}" target="_blank" class="card-link">Learn More →</a>
                        <div class="card-meta">
                            <a href="${e.catalogue_url}" target="_blank" class="card-model">${e.model_name}</a>
                        </div>
                    </div>
                </div>
            </div>
        `}renderMediumCard(){let e=this.extractMediumCard(),t=e.origins&&e.origins.length>0?e.origins.map(e=>this.html`
                <span class="card-origin">
                    ${v}
                    <span class="card-origin-text">${e}</span>
                </span>
            `).join(``):``;return this.html`
            <div class="card medium-card">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-top-info">
                            <plain-score-badge score="${e.score}"></plain-score-badge>
                            ${t?this.html`
                                <div class="card-origins">
                                    ${t}
                                </div>
                            `:this.html`<span></span>`}
                        </div>
                        <h3 class="card-title">${this.getHighlightedText(e.name)}</h3>
                    </div>
                    ${e.summary?`<p class="card-summary">${this.getHighlightedText(e.summary)}</p>`:``}
                    <div class="card-footer">
                        ${e.detail_url?`<a href="${e.detail_url}" target="_blank" class="card-link">View Details →</a>`:``}
                        <div class="card-meta">
                            ${e.catalogue_url?`<a href="${e.catalogue_url}" target="_blank" class="card-model">${e.model_name}</a>`:``}
                        </div>
                    </div>
                </div>
            </div>
        `}renderMinimalCard(){let e=this.extractMinimalCard(),t=e.origins&&e.origins.length>0?e.origins.map(e=>this.html`
                <span class="card-origin">
                    ${v}
                    ${e}
                </span>
            `).join(``):``;return this.html`
            <div class="card minimal-card">
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-top-info">
                            <plain-score-badge score="${e.score}"></plain-score-badge>
                            ${t?this.html`
                                <div class="card-origins">
                                    ${t}
                                </div>
                            `:this.html`<span></span>`}
                        </div>
                        <h3 class="card-title">${this.getHighlightedText(e.name)}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="card-meta">
                            <span class="card-model">${e.model_name}</span>
                        </div>
                    </div>
                </div>
            </div>
        `}template(){if(!this.result)return this.html`<div class="card error-card">No result data</div>`;switch(this.getCardType()){case`full`:return this.renderFullCard();case`medium`:return this.renderMediumCard();case`minimal`:return this.renderMinimalCard();default:return this.renderMinimalCard()}}listeners(){let e=this.$(`.card`);e&&this.result.model_view_url&&(e.style.cursor=`pointer`,e.onclick=e=>{e.target.tagName!==`A`&&this.modalContext.set({isOpen:!0,element:this.result},!0)})}};window.customElements.define(`plain-dynamic-card`,Pe);var Fe=class extends i{resultContext;filterContext;searchContext;configContext;metagoraContext;expandedAgoraCards=new Set;skipScrollOnRender=!1;lastExpandedAgoraId=null;savedScrollPosition=0;constructor(){super(`plain-artifact-display`,Ee),this.resultContext=this.useContext(m.RESULT,!0),this.filterContext=this.useContext(m.FILTER,!0),this.searchContext=this.useContext(m.SEARCH,!0),this.configContext=this.useContext(m.CONFIG),this.metagoraContext=this.useContext(m.METAGORA)}scrollCarousel(e,t){let n=this.$(`.carousel-container[data-service="${e}"]`);if(!n)return;let r=n.clientWidth*.8,i=t===`left`?n.scrollLeft-r:n.scrollLeft+r;n.scrollTo({left:i,behavior:`smooth`})}getServiceColor(e){let t=0;for(let n=0;n<e.length;n++)t=e.charCodeAt(n)+((t<<5)-t);return`hsl(${Math.abs(t%360)}, 80%, 55%)`}getUniqueAgorasFromItems(e){let t=this.metagoraContext.get(`agoras`)||[];return[...new Set(e.map(e=>e._sourceHost).filter(Boolean))].map(e=>t.find(t=>t.host===e)||{host:e,name:e,primaryColor:`#6b7280`,secondaryColor:null})}renderAgoraBadges(e){let t=this.getUniqueAgorasFromItems(e);return t.length===0?``:t.map(e=>this.html`
            <a 
                href="${e.host}"
                target="_blank"
                class="agora-badge" 
                style="border-color: ${e.primaryColor}; color: ${e.primaryColor}; background-color: ${e.primaryColor}22;"
            >
                ${e.name}
            </a>
        `).join(``)}groupItemsByAgora(e){let t=this.metagoraContext.get(`agoras`)||[],n=new Map;e.forEach(e=>{let t=e._sourceHost||`unknown`;n.has(t)||n.set(t,[]),n.get(t).push(e)});let r=[];return n.forEach((e,n)=>{let i=t.find(e=>e.host===n)||{host:n,name:n.replace(/^https?:\/\//,``).split(`/`)[0],primaryColor:`#6b7280`,secondaryColor:null};r.push({agora:i,items:e})}),r.sort((e,t)=>t.items.length-e.items.length)}renderAgoraCards(e,t){let n=this.groupItemsByAgora(e);return this.html`
            <div class="agora-cards-grid">
                ${n.map(e=>{let n=`${t}-${e.agora.host.replace(/[^a-zA-Z0-9]/g,`-`)}`,r=this.expandedAgoraCards.has(n),i=r?e.items:e.items.slice(0,4),a=r?0:e.items.length-i.length,o=this.renderAgoraCarouselItems(i);return this.html`
                        <div class="agora-card" style="--agora-color: ${e.agora.primaryColor};">
                            <div class="agora-card-header">
                                <div class="agora-info">
                                    <a 
                                        href="${e.agora.host}"
                                        target="_blank"
                                        class="agora-badge"
                                        style="border-color: ${e.agora.primaryColor}; color: ${e.agora.primaryColor}; background-color: ${e.agora.primaryColor}22;"
                                    >
                                        ${e.agora.name}
                                    </a>
                                    <span class="agora-result-count">${e.items.length} results</span>
                                </div>
                                <div class="agora-carousel-controls">
                                    <button class="agora-arrow-btn left" data-agora="${n}" aria-label="Scroll left">
                                        ${ce}
                                    </button>
                                    <button class="agora-arrow-btn right" data-agora="${n}" aria-label="Scroll right">
                                        ${se}
                                    </button>
                                </div>
                            </div>
                            <div class="agora-items" data-agora="${n}">
                                ${o}
                                ${a>0?this.html`
                                    <button 
                                        class="more-results-card" 
                                        data-expand-agora="${n}"
                                        style="background-color: ${e.agora.primaryColor}11; border-color: ${e.agora.primaryColor}33;"
                                    >
                                        <span class="more-count">+${a}</span>
                                        <span class="more-label">more results</span>
                                    </button>
                                `:``}
                            </div>
                        </div>
                    `}).join(``)}
            </div>
        `}renderAgoraCarouselItems(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];if(this.getCardType(r)===`medium`&&n+1<e.length){let i=e[n+1];if(this.getCardType(i)===`medium`){t.push(this.html`
                        <div class="stacked-column">
                            <plain-dynamic-card 
                                result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                            <plain-dynamic-card 
                                result='${JSON.stringify(i).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                        </div>
                    `),n++;continue}}t.push(this.html`
                <plain-dynamic-card 
                    result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                ></plain-dynamic-card>
            `)}return t.join(``)}scrollAgoraCarousel(e,t){let n=this.$(`.agora-items[data-agora="${e}"]`);if(!n)return;let r=n.clientWidth*.6,i=t===`left`?n.scrollLeft-r:n.scrollLeft+r;n.scrollTo({left:i,behavior:`smooth`})}getValueByPath(e,t){if(t===`origin`){let t=e.data,n=t?.x_origin||t?.x_university_origin||t?.x_home_partner_institution||t?.x_host_university||t?.x_participating_universities;return n?x(n):void 0}return t.split(`.`).reduce((e,t)=>e&&e[t],e)}getCardType(e){let t=e?.data;if(!t)return`minimal`;let n=t?.name||t?.display_name,r=t?.x_summary||t?.x_description,i=t?.x_image,a=t?.x_origin||t?.x_home_partner_institution||t?.x_host_university||t?.x_participating_universities,o=t?.x_web_link||t?.x_link||t?.x_more_info||t?.x_additional_link,s=e?.model_view_url;return n&&r&&i&&a&&o&&s?`full`:n&&r?`medium`:`minimal`}template(){let e=this.resultContext.get(),t=this.filterContext.get()?.filters||{},n=this.filterContext.get()?.mapping||{},r=this.searchContext.get()?.current?.join(` `),i=this.configContext.get(`IS_METAGORA`);return e?i&&e.groupedByCategory?this.renderMetagoraTemplate(e.groupedByCategory,t,n,r):e.grouped?this.renderAgoraTemplate(e.grouped,t,n,r):``:``}applyFiltersToItems(e,t,n){return e.filter(e=>Object.entries(t).every(([t,r])=>{let i=Array.isArray(r)?r:[r];if(i.length===0)return!0;let a=n[t]&&n[t].length>0?n[t][0]:t,o=this.getValueByPath(e,a);return i.some(e=>typeof e==`boolean`?!!o===e:Array.isArray(o)?o.some(t=>String(t).toLowerCase()===String(e).toLowerCase()):String(o).toLowerCase()===String(e).toLowerCase())}))}renderCarouselItems(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];if(this.getCardType(r)===`medium`&&n+1<e.length){let i=e[n+1];if(this.getCardType(i)===`medium`){t.push(this.html`
                        <div class="stacked-column">
                            <plain-dynamic-card 
                                result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                            <plain-dynamic-card 
                                result='${JSON.stringify(i).replace(/'/g,`&apos;`)}'
                            ></plain-dynamic-card>
                        </div>
                    `),n++;continue}}t.push(this.html`
                <plain-dynamic-card 
                    result='${JSON.stringify(r).replace(/'/g,`&apos;`)}'
                ></plain-dynamic-card>
            `)}return t.join(``)}renderAgoraTemplate(e,t,n,r){let i=e.map(e=>({...e,items:this.applyFiltersToItems(e.items,t,n)})).filter(e=>e.items.length>0);return i.length===0?this.html`
                <div class="empty-state">
                    <p>No results found matching the filters.</p>
                </div>
            `:this.html`
            <div class="results-container">
                ${r?`<div class="results-label">Results for "${r}"...</div>`:``}
                ${i.map(e=>{let t=e.service.replace(/\s+/g,`-`).toLowerCase(),n=this.getServiceColor(e.service);return this.html`
                        <div class="service-section">
                            <div class="service-header">
                                <div class="header-left">
                                    <div class="accent-bar" style="background-color: ${n}"></div>
                                    <h2 class="service-title">${e.service.toUpperCase()}</h2>
                                    <span class="result-count">${e.items.length} results</span>
                                </div>
                                <div class="carousel-controls">
                                    <button class="arrow-btn left" data-service="${t}" aria-label="Scroll left">
                                        ${ce}
                                    </button>
                                    <button class="arrow-btn right" data-service="${t}" aria-label="Scroll right">
                                        ${se}
                                    </button>
                                </div>
                            </div>
                            <div class="carousel-wrapper" data-service="${t}">
                                <div class="carousel-container" data-service="${t}">
                                    ${this.renderCarouselItems(e.items)}
                                </div>
                            </div>
                        </div>
                    `}).join(``)}
            </div>
        `}renderMetagoraTemplate(e,t,n,r){let i=e.map(e=>({...e,services:e.services.map(e=>({...e,items:this.applyFiltersToItems(e.items,t,n)})).filter(e=>e.items.length>0)})).filter(e=>e.services.length>0);return i.length===0?this.html`
                <div class="empty-state">
                    <p>No results found matching the filters.</p>
                </div>
            `:this.html`
            <div class="results-container">
                ${r?`<div class="results-label">Results for "${r}"...</div>`:``}
                ${i.map(e=>{let t=e.category.replace(/\s+/g,`-`).toLowerCase(),n=e.services.reduce((e,t)=>e+t.items.length,0),r=e.services.flatMap(e=>e.items);return this.html`
                        <div class="category-section" data-category="${t}">
                            <div class="category-header">
                                <div class="category-accent-bar"></div>
                                <h2 class="category-title">${e.category.toUpperCase()}</h2>
                                <span class="category-result-count">${n} results</span>
                                <div class="category-agora-badges">
                                    ${this.renderAgoraBadges(r)}
                                </div>
                            </div>
                            <div class="category-services">
                                ${e.services.map(e=>{let n=`${t}-${e.service.replace(/\s+/g,`-`).toLowerCase()}`,r=this.getServiceColor(e.service);return this.html`
                                        <div class="service-section">
                                            <div class="service-header">
                                                <div class="header-left">
                                                    <div class="accent-bar" style="background-color: ${r}"></div>
                                                    <h3 class="service-title">${e.service}</h3>
                                                    <span class="result-count">${e.items.length} results</span>
                                                </div>
                                            </div>
                                            ${this.renderAgoraCards(e.items,n)}
                                        </div>
                                    `}).join(``)}
                            </div>
                        </div>
                    `}).join(``)}
            </div>
        `}afterRender(){if(this.skipScrollOnRender){if(this.skipScrollOnRender=!1,this.lastExpandedAgoraId){let e=this.$(`.agora-items[data-agora="${this.lastExpandedAgoraId}"]`);e&&(e.style.scrollBehavior=`auto`,e.scrollLeft=this.savedScrollPosition,requestAnimationFrame(()=>{e.style.scrollBehavior=``})),this.lastExpandedAgoraId=null}return}this.scrollTo({top:0,behavior:`smooth`})}expandAgoraCard(e){let t=this.$(`.agora-items[data-agora="${e}"]`);this.savedScrollPosition=t?t.scrollLeft:0,this.expandedAgoraCards.add(e),this.skipScrollOnRender=!0,this.lastExpandedAgoraId=e,this.render()}listeners(){let e=this.resultContext.get(),t=this.configContext.get(`IS_METAGORA`);e&&(t&&e.groupedByCategory?(e.groupedByCategory.forEach(e=>{let t=e.category.replace(/\s+/g,`-`).toLowerCase();e.services.forEach(e=>{let n=`${t}-${e.service.replace(/\s+/g,`-`).toLowerCase()}`;this.groupItemsByAgora(e.items).forEach(e=>{let t=`${n}-${e.agora.host.replace(/[^a-zA-Z0-9]/g,`-`)}`,r=this.$(`.agora-arrow-btn.left[data-agora="${t}"]`),i=this.$(`.agora-arrow-btn.right[data-agora="${t}"]`);r&&(r.onclick=()=>this.scrollAgoraCarousel(t,`left`)),i&&(i.onclick=()=>this.scrollAgoraCarousel(t,`right`))})})}),this.$$(`.more-results-card[data-expand-agora]`).forEach(e=>{let t=e.getAttribute(`data-expand-agora`);t&&(e.onclick=()=>this.expandAgoraCard(t))})):e.grouped&&e.grouped.forEach(e=>{let t=e.service.replace(/\s+/g,`-`).toLowerCase(),n=this.$(`.arrow-btn.left[data-service="${t}"]`),r=this.$(`.arrow-btn.right[data-service="${t}"]`);n&&(n.onclick=()=>this.scrollCarousel(t,`left`)),r&&(r.onclick=()=>this.scrollCarousel(t,`right`))}))}};window.customElements.define(`plain-artifact-display`,Fe);var Ie=`.agora-input-container {
    margin: 0 auto;

    width: 100%;
    max-width: 800px;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    font-family: 'Geist', sans-serif;
}
`,Le=`.search-card {
    position: relative;

    border: 1px solid #eef2f6;
    border-radius: 16px;

    background: transparent;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

    z-index: 100;

    transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.search-card::before {
    content: '';
    position: absolute;

    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;

    border-radius: 18px;

    background: linear-gradient(45deg,
            #3a85fe,
            #febd0b,
            #fe006e,
            #8238eb,
            #fa5607,
            #3a85fe);
    background-size: 400%;

    filter: blur(12px);
    opacity: 0;

    z-index: -1;

    transition: opacity 0.5s ease;
    animation: glowing 20s linear infinite;
}

.search-card.mode-chat::before {
    opacity: 0.5;
}

@keyframes glowing {
    0% {
        background-position: 0 0;
    }

    50% {
        background-position: 400% 0;
    }

    100% {
        background-position: 0 0;
    }
}
`,Re=`.card-header {
    padding: 0.5rem 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    border-bottom: 1px solid #e2e8f0;
    border-radius: 16px 16px 0 0;

    background-color: #f1f5f9;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.clear-btn-header,
.new-chat-btn {
    cursor: pointer;
    
    padding: 0.5rem;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    
    background: #fff;
    color: #64748b;
    
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    opacity: 1;
    transform: scale(1);
}

.clear-btn-header svg,
.new-chat-btn svg {
    width: 18px;
    height: 18px;
}

.clear-btn-header:hover {
    background: #fee2e2;
    border-color: #fecaca;
    color: #dc2626;
}

.new-chat-btn:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
}

.clear-btn-header:active,
.new-chat-btn:active {
    transform: scale(0.95);
}

.clear-btn-header.hidden,
.new-chat-btn.hidden {
    opacity: 0;
    transform: scale(0.8);
    pointer-events: none;
}
`,ze=`.card-body {
    padding: 1rem 1.5rem;

    display: flex;
    align-items: flex-start;
    gap: 1rem;

    border-radius: 0 0 16px 16px;

    background: #fff;
}

.icon {
    display: flex;
    align-items: center;
    color: #94a3b8;
    padding-top: 0.5rem;
    flex-shrink: 0;
}

.icon svg {
    width: 24px;
    height: 24px;
}

.globe-icon {
    color: #94a3b8;
}

textarea {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #1e293b;
    background: transparent;
    padding: 0.5rem 0;
    font-family: inherit;
    resize: none;
    field-sizing: content;
    min-height: 26px;
    max-height: 300px;
    line-height: 1.5;
    transition: min-height 0.3s ease;
}

.search-card.mode-chat textarea {
    min-height: 120px;
}

textarea::placeholder {
    font-size: 16px;
    color: #94a3b8;
    transition: opacity 0.2s ease;
    opacity: 1;
}

textarea.placeholder-hidden::placeholder {
    opacity: 0;
}

.actions {
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.shortcut {
    font-size: 0.8rem;
    color: #94a3b8;
    border: 1px solid #e2e8f0;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    background: #f8fafc;
    font-family: inherit;
}

.go-btn {
    padding: 0.6rem 1.5rem;
    cursor: pointer;

    border: none;
    border-radius: 8px;

    background: #0f172a;

    color: #fff;
    font-weight: 600;
    font-size: 14px;

    transition: background 0.2s;
}

.go-btn:hover {
    background: #1e293b;
}
`,Be=`.tabs-single {
    padding: 0.5rem 0;

    display: flex;
}

.tab-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
}

.tabs {
    padding: 4px;

    position: relative;

    display: inline-flex;

    border-radius: 10px;

    background-color: #e2e8f0;
}

.tab-slider {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;

    width: calc(50% - 4px);

    border-radius: 8px;

    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    z-index: 1;

    transition: transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.tabs.mode-chat .tab-slider {
    transform: translateX(100%);
}

.tab {
    cursor: pointer;

    padding: 0.5rem 1rem;

    position: relative;

    width: 110px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    border: none;
    border-radius: 8px;

    background: transparent;

    font-size: 12px;
    font-weight: 500;
    color: #64748b;

    transition: color 0.2s ease;

    z-index: 2;
}

.tabs.mode-search .tab[data-mode="search"],
.tabs.mode-chat .tab[data-mode="chat"] {
    color: #0f172a;
}

.tab:hover:not(.active) {
    color: #334155;
}
`,Ve=`.trending {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease, transform 0.3s ease;
    opacity: 1;
    transform: translateY(0);
}

.trending.hidden {
    grid-template-rows: 0fr;
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
    margin-top: -1.5rem;
}

.trending-content {
    overflow: hidden;
    padding-left: 0.5rem;
}

.trending .label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.chip {
    cursor: pointer;

    padding: 0.4rem 1rem;

    border: 1px solid #e2e8f0;
    border-radius: 20px;

    color: #475569;
    font-family: 'Geist Mono', sans-serif;
    font-size: 12px;

    background: #fff;
    transition: all 0.2s;
}

.chip:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
    color: #1e293b;
}
`,He=`.suggestions {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 0;
    right: 0;

    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

    overflow: hidden;
    z-index: 10;

    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(0);
}

.suggestions.hidden {
    grid-template-rows: 0fr;
    opacity: 0;
    transform: translateY(10px);
    display: grid;
    pointer-events: none;
}

.suggestions-content {
    min-height: 0;
    padding: 0.5rem 0;
}

.suggestion-item {
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: background 0.2s;
    color: #64748b;
}

.suggestion-item .highlight {
    color: #3b82f6;
    font-weight: 600;
}

.suggestion-item:hover,
.suggestion-item.active {
    background: #f1f5f9;
}

.tab-hint {
    margin-left: auto;
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    background: #e2e8f0;
    padding: 2px 6px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
}

.suggestion-item:hover .tab-hint,
.suggestion-item.active .tab-hint {
    opacity: 1;
}
`,Ue=`.mentions {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 0;
    right: 0;

    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;

    overflow: hidden;
    z-index: 11;

    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(0);
}

.mentions.hidden {
    grid-template-rows: 0fr;
    opacity: 0;
    transform: translateY(10px);
    display: grid;
    pointer-events: none;
}

.mentions-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
}

.mentions-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
}

.mentions-content {
    min-height: 0;
    padding: 0.5rem 0;
    max-height: 240px;
    overflow-y: auto;
}

.mention-item {
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    cursor: pointer;
    transition: background 0.2s;
}

.mention-item:hover,
.mention-item.active {
    background: #f1f5f9;
}

.mention-name {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mention-meta {
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
`;const w={RESULTS_FETCHED:`results-fetched`,RESULTS_CLEARED:`results-cleared`,CHAT_STARTED:`chat-started`,CHAT_USER_MESSAGE:`chat-user-message`,CHAT_MESSAGE_CHUNK:`chat-message-chunk`,CHAT_MESSAGE_COMPLETE:`chat-message-complete`,CHAT_RESULTS_UPDATED:`chat-results-updated`,CHAT_FETCHING_RESULTS:`chat-fetching-results`,NEW_CHAT:`new-chat`,MODE_SWITCH:`mode-switch`};function We(e){return e.length&&Math.max(...e.map(e=>e.score))||1}function Ge(e,t){let n=e.filter(e=>e.service===t);return n.length&&Math.max(...n.map(e=>e.score))||1}function Ke(e,t,n=.1){return e.filter(e=>e.score[t]>=n)}function qe(e,t){e.forEach(e=>{let n=t.find(t=>t.models.includes(e.model));n?(e.service=n.service,e.serviceCategory=n.category):(console.warn(`No service found for model: ${e.model}`),e.service=`unknown`,e.serviceCategory=`Other`)})}function Je(e,t,n){let r=We(e);return e.sort((e,t)=>t.score-e.score).map(i=>{let a=t.find(e=>e.model===i.model),o=a?.name||i.model,s=a?.website,c=a?.url,l=i._sourceHost||n,u=s?`${s}${c}`:`${l}${c}`,d=Ge(e,i.service);return{model:i.model,model_verbose_name:o,model_view_url:u,service:i.service,serviceCategory:i.serviceCategory||`Other`,featured_fields:i.featured_fields||[`web_link`,`url`,`website`],featured:i.featured||!1,data:i.data,roots:i.roots,score:{absolute:Number((i.score/r).toFixed(2)),relative:Number((i.score/d).toFixed(2))},_sourceHost:i._sourceHost}})}function Ye(e){return[...new Set(e.map(e=>e.service))].sort().map(t=>{let n=e.filter(e=>e.service===t);return{service:t,items:n}})}function Xe(e){return[...new Set(e.map(e=>e.serviceCategory))].sort().map(t=>{let n=e.filter(e=>e.serviceCategory===t),r=[...new Set(n.map(e=>e.service))].sort().map(e=>({service:e,items:n.filter(t=>t.service===e)}));return{category:t,services:r}})}function Ze(e,t,n=5){return e.filter(e=>e.toLowerCase().includes(t.toLowerCase())).reverse().slice(0,n)}function Qe(e,t){let n=t.length,r=e.substring(0,n),i=e.substring(n);return{match:r,rest:i}}const $e={GPT_3_5_TURBO:`gpt-3.5-turbo`,GPT_4O:`gpt-4o`,GPT_4O_MINI:`gpt-4o-mini`,GEMINI_PRO:`gemini-pro`,GEMINI_1_5:`gemini-1.5`,CLAUDE_3:`claude-3`,CLAUDE_INSTANT_100K:`claude-instant-100k`,AZURE_GPT_3_5_TURBO:`azure-gpt-3.5-turbo`,AZURE_GPT_4:`azure-gpt-4`,AZURE_GPT_4O:`azure-gpt-4o`},et={OPENAI:`openai`,ANTHROPIC:`anthropic`,GOOGLE:`google`,AZURE:`azure`};var tt=`:host {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    pointer-events: none;
}

.toast-container-wrapper {
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
}

.toast-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    padding-bottom: 18px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: #333;
    color: #fff;
    font-size: 14px;
    max-width: 400px;
    min-width: 280px;
    pointer-events: auto;
    overflow: hidden;
}

/* Fade in animation */
.toast-item.fade-in {
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Fade out animation */
.toast-item.fade-out {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(calc(100% + 20px));
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(calc(100% + 20px));
    }
}

.toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
}

.toast-message {
    flex: 1;
    line-height: 1.4;
    word-break: break-word;
}

.toast-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin-left: 8px;
    opacity: 0.7;
    transition: opacity 0.2s;
    line-height: 1;
}

.toast-close:hover {
    opacity: 1;
}

/* Progress bar */
.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    width: 100%;
    background: rgba(255, 255, 255, 0.3);
    transform-origin: left;
}

.toast-item.fade-in .toast-progress {
    animation: progress var(--duration, 5000ms) linear forwards;
}

@keyframes progress {
    from {
        transform: scaleX(1);
    }
    to {
        transform: scaleX(0);
    }
}

/* Type variants */
.toast-item.error {
    background: #dc3545;
}

.toast-item.error .toast-icon {
    background: rgba(255, 255, 255, 0.2);
}

.toast-item.error .toast-progress {
    background: rgba(255, 255, 255, 0.4);
}

.toast-item.warning {
    background: #ffc107;
    color: #333;
}

.toast-item.warning .toast-icon {
    background: rgba(0, 0, 0, 0.1);
}

.toast-item.warning .toast-progress {
    background: rgba(0, 0, 0, 0.2);
}

.toast-item.info {
    background: #17a2b8;
}

.toast-item.info .toast-icon {
    background: rgba(255, 255, 255, 0.2);
}

.toast-item.info .toast-progress {
    background: rgba(255, 255, 255, 0.4);
}

.toast-item.success {
    background: #28a745;
}

.toast-item.success .toast-icon {
    background: rgba(255, 255, 255, 0.2);
}

.toast-item.success .toast-progress {
    background: rgba(255, 255, 255, 0.4);
} `,nt={name:`agora-home`,private:!0,version:`1.0.0`,type:`module`,scripts:{dev:`vite`,build:`tsc && vite build`,preview:`vite preview`,"create-component":`node ./scripts/create.cjs`},devDependencies:{"plain-ts":`npm:plain-ts@latest`,typescript:`~5.9.3`,vite:`npm:rolldown-vite@7.1.14`},overrides:{vite:`npm:rolldown-vite@7.1.14`},dependencies:{marked:`^17.0.1`}};const T={APP_NAME:nt.name,VERSION:nt.version,API_HOST:`http://localhost:8010`,AI_HOST:`http://localhost:2020`,TRANSLATION_HOST:null,ENABLED_AI:!0,DEBUG_MODE:!1,IS_METAGORA:!0,MAX_HEIGHT:null};var rt=class extends i{constructor(){super(`toast-container`,tt)}template(){return this.html`
            <div class="toast-container-wrapper"></div>
        `}addToast(e){let t=this.$(`.toast-container-wrapper`);if(!t)return;let n=document.createElement(`div`),r=e.type||`info`,i=e.duration||5e3;n.className=`toast-item ${r} fade-in`,n.style.setProperty(`--duration`,`${i}ms`),n.innerHTML=`
            <div class="toast-icon">${this.getIcon(r)}</div>
            <div class="toast-message">${e.message}</div>
            <button class="toast-close">×</button>
            <div class="toast-progress"></div>
        `,t.appendChild(n);let a=n.querySelector(`.toast-close`);a&&a.addEventListener(`click`,()=>this.removeToast(n)),setTimeout(()=>{this.removeToast(n)},i)}removeToast(e){if(!e.parentElement)return;e.classList.remove(`fade-in`),e.classList.add(`fade-out`);let t=n=>{n.animationName===`slideOut`&&(e.removeEventListener(`animationend`,t),e.remove())};e.addEventListener(`animationend`,t)}getIcon(e){return{error:`✕`,warning:`⚠`,info:`ℹ`,success:`✓`}[e]}};function it(e,t=`info`,n=5e3){if(!T.DEBUG_MODE)return;let r=document.querySelector(`agora-app`)?.shadowRoot?.querySelector(`toast-container`);r&&r.addToast({message:e,type:t,duration:n})}function E(e,t){if(!T.DEBUG_MODE)return;let n=e instanceof Error?e.message:e,r=t?`[${t}] ${n}`:n;it(r,`error`,8e3)}window.customElements.define(`toast-container`,rt);var D={GET_AGORA_SERVICES:`/catalogue-api/v2/acceleration-services/1`,GET_AGORA_SEARCH_RESULTS:`/elastic/search`,GET_AGORA_INGEST_MODEL:`/elastic/ingest`,SEND_MESSAGE:`/assistant/rag/stream`,FETCH_ELEMENT:`/catalogue-api/v2`,GET_AIDA_API_KEY:`/catalogue-api/v2/api-key/aida`};const O={GET_ALL_AGORA_URLS:async()=>[`https://agora.unite-university.eu/`,`https://eugreen.pre.widening.eu/`,`https://eudres.widening.eu/`,`https://civis.widening.eu/`,`https://aupaeu.widening.eu/`,`https://forthem.widening.eu/`,`https://eutopia-agora.widening.eu/`,`https://circle-u.widening.eu/`,`https://heroes.widening.eu/`,`https://uninovis.widening.eu/`],GET_AGORA_SERVICES:async e=>{try{let t=`${e}${D.GET_AGORA_SERVICES}`,n=await fetch(t);if(!n.ok)throw E(Error(`Failed to fetch Agora services from ${t}`),`GET_AGORA_SERVICES`),Error(`Something went wrong while fetching the Agora services`);return await n.json()}catch(e){throw E(e,`GET_AGORA_SERVICES`),e}},GET_AGORA_SEARCH_RESULTS:async(e,t,n,r,i)=>{if(!t||t.length===0)throw Error(`No query provided`);if(n.length===0)throw Error(`No models provided for the search`);let a=`${e}${D.GET_AGORA_SEARCH_RESULTS}?query=${t}&models=${n.join()}`;try{let e=await fetch(a);if(!e.ok&&e.status===404){let t=await e.json();throw Error(JSON.stringify(t))}return await e.json()}catch(e){throw E(e,`GET_AGORA_SEARCH_RESULTS`),e}},GET_AGORA_INGEST_MODEL:async(e,t)=>{let n=`${e}${D.GET_AGORA_INGEST_MODEL}/${t}`;try{let e=await fetch(n);if(!e.ok){let t=await e.json();throw Error(t.message)}return await e.json()}catch(e){throw E(e,`GET_AGORA_INGEST_MODEL`),e}},SEND_MESSAGE:async(e,t,n=[],r=``,i=$e.GPT_4O_MINI,a=et.OPENAI,o=.7)=>{let s={message:t,history:n,context:r,model:i,provider:a,temperature:o},c=`${e}${D.SEND_MESSAGE}`;try{let e=await fetch(c,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(s)});if(!e.ok)throw Error(`Something went wrong while sending message`);return e.body instanceof ReadableStream?e:await e.json()}catch(e){throw E(e,`SEND_MESSAGE`),e}},FETCH_ELEMENT:async(e,t,n)=>{let r=`${e}${D.FETCH_ELEMENT}/${t}/${n}`;try{let e=localStorage.getItem(`aida_ak`);if(!e)throw Error(`AIDA API key not found. Please ensure you are properly authenticated.`);let i=await fetch(r,{method:`GET`,headers:{accept:`application/json`,Authorization:`Bearer ${e}`}});if(!i.ok){if(i.status===404){let e=await i.json();throw Error(JSON.stringify(e))}if(i.status===401||i.status===403){let e=await i.json();throw Error(JSON.stringify(e))}throw Error(`Failed to fetch element ${t}/${n}`)}return await i.json()}catch(e){throw E(e,`FETCH_ELEMENT`),e}},GET_AIDA_API_KEY:async(e,t=[])=>{try{let n=new URLSearchParams;t&&t.length>0&&n.append(`models`,t.join(`,`));let r=`${e}${D.GET_AIDA_API_KEY}${n.toString()?`?${n.toString()}`:``}`,i=await fetch(r,{method:`GET`,headers:{accept:`application/json`}});if(!i.ok){if(i.status===400){let e=await i.json();throw Error(e.error?.message||`Bad request when fetching API key`)}if(i.status===500){let e=await i.json();throw Error(e.error?.message||`Server error when fetching API key`)}throw Error(`Something went wrong while fetching AIDA API key`)}return await i.json()}catch(e){throw E(e,`GET_AIDA_API_KEY`),e}},GET_MULTIPLE_AIDA_API_KEYS:async(e,t={})=>{let n={};return await Promise.all(e.map(async e=>{try{let r=await O.GET_AIDA_API_KEY(e,t[e]);r?.token?.jwt_token&&(n[e]=r.token.jwt_token)}catch(t){console.warn(`Failed to fetch API key for host: ${e}`,t)}})),n}},k=(e,t)=>{let n=[];function r(e){for(let i in e)Object.prototype.hasOwnProperty.call(e,i)&&(i===t&&n.push({[t]:e[i]}),typeof e[i]==`object`&&e[i]!==null&&r(e[i]))}return r(e),n};var at=class{deps;callbacks;messageBuffer=``;isFirstChunk=!0;shouldResetResults=!1;constructor(e,t){this.deps=e,this.callbacks=t}async chat(e){if(!e){console.warn(`No message provided`);return}this.callbacks.showSpinner(),this.isFirstChunk=!0,this.messageBuffer=``,this.deps.signals.emit(w.CHAT_STARTED),this.storeMessageInChatContext(e,`user`),this.deps.signals.emit(w.CHAT_USER_MESSAGE);try{let t=this.deps.configContext.get(`AI_HOST`),n=this.formatMessageHistory(),r=this.buildChatContext(),i=await O.SEND_MESSAGE(t,e,n,r);if(i.body instanceof ReadableStream)await this.handleStreamingResponse(i);else{let e=i,t=e.response||e.message||``;this.storeMessageInChatContext(t,`ai`),this.deps.signals.emit(w.CHAT_MESSAGE_COMPLETE,t)}}catch(e){console.error(`Chat error:`,e)}finally{this.callbacks.hideSpinner(),this.shouldResetResults=!0}}buildChatContext(){let e=this.deps.companyContext.get(`name`)||`the alliance`,t=this.deps.filterContext.get(`filters`)||[],n=this.deps.resultContext.get(`grouped`)||[],r=(n.length>0&&t.length>0?n.filter(e=>t.some(t=>t.service===e.service)):n).map(e=>[`\n> Service: ${e.service}\n`,...e.items.map(e=>` >> Resource: ${JSON.stringify(e)}\n`)].join(`
`)),i=r.length>0?[`These resources are being displayed in the user screen (take them into account when answering and proposing follow-up questions):`,r.join(`
`),`Take into account the user's previous messages and the context provided by these resources when formulating your response.`].join(`
`):`(No resources displayed right now.)`;return[`You are a helpful assistant working for the university alliance ${e}.`,`This site is the alliance Agora.`,`An Agora is a service that serves as a central hub that provides access to services and resources offered by the alliance members.`,`If the user asks for more information about the alliance, verify your response on the internet and provide accurate information.`,`If the user asks for resources or related information use your retrieve capabilities to find the most relevant information.
`,`Use the provided context to answer the user's question as accurately as possible.`,`If you don't know the answer, just say you don't know.`,`Do not make up an answer.`,`Always keep your answers concise and to the point.
`,i].join(`
`)}formatMessageHistory(){return(this.deps.chatContext.get(`history`)||[]).map(e=>({role:e.author===`user`?`user`:`ai`,content:e.content}))}storeMessageInChatContext(e,t){if(!e||e.trim()===``)return;let n=this.deps.chatContext.get(`history`)||[];n.push({content:e,author:t,time:new Date().toLocaleTimeString()}),this.deps.chatContext.set({history:n}),this.callbacks.updateClearButtonVisibility()}async handleStreamingResponse(e){let t=e.body.getReader(),n=new TextDecoder;try{for(;;){let{done:e,value:r}=await t.read();if(e)break;let i=n.decode(r,{stream:!0});this.handleChunk(i)}this.messageBuffer&&=(this.storeMessageInChatContext(this.messageBuffer,`ai`),this.deps.signals.emit(w.CHAT_MESSAGE_COMPLETE,this.messageBuffer),``)}catch(e){throw console.error(`Stream reading error:`,e),e}}splitChunkByTags(e){let t=/(\[\$\w+\])(.*?)(?=\[\$\w+\]|$)/gs,n=[],r;for(;(r=t.exec(e))!==null;){let e=r[1],t=r[2];if(e===`[$done]`){n.length>0&&(n[n.length-1].content+=` [$done]`);continue}n.push({tag:e,content:t})}return n}handleChunk(e){this.splitChunkByTags(e).forEach(e=>{if(e.tag===`[$artifact]`)try{let t=JSON.parse(e.content.replace(/'/g,`"`));this.handleChatResults(t)}catch(e){console.error(`Error parsing artifact:`,e)}else if(e.tag===`[$message]`){let t=e.content.includes(`[$done]`),n=t?e.content.split(`[$done]`)[0]:e.content;this.handleChatMessage({isFirstChunk:this.isFirstChunk,isLastChunk:t,message:n}),this.isFirstChunk&&=!1}})}handleChatMessage(e){if(e.isFirstChunk&&this.callbacks.hideSpinner(),e.isLastChunk){let t=this.messageBuffer+e.message;this.storeMessageInChatContext(t,`ai`),this.deps.signals.emit(w.CHAT_MESSAGE_COMPLETE,t),this.messageBuffer=``;return}this.messageBuffer+=e.message,e.message&&this.deps.signals.emit(w.CHAT_MESSAGE_CHUNK,{chunk:e.message,fullMessage:this.messageBuffer})}async handleChatResults(e){if(!e||e.length===0)return;let t={grouped:[],data:[]};this.shouldResetResults||(t.data=this.deps.resultContext.get(`data`)||[],t.grouped=this.deps.resultContext.get(`grouped`)||[]),this.shouldResetResults&&=!1;let n=this.deps.serviceContext.get(`services`)||[],r=k(n,`websites`).flatMap(e=>e.websites),i={},a=e=>{t.data.push(e),t.grouped=[...new Set(t.data.map(e=>e.service))].sort().map(e=>({service:e,items:t.data.filter(t=>t.service===e)})),this.deps.resultContext.set(t,!0),this.deps.signals.emit(w.CHAT_RESULTS_UPDATED,t.grouped),this.deps.signals.emit(w.RESULTS_FETCHED,t.data)};this.deps.signals.emit(w.CHAT_FETCHING_RESULTS,!0),(async()=>{for(let t of e){i[t.model]=r.find(e=>e.model===t.model)?.name||null;let e=t.model,o=null;if(n.forEach(t=>{let n=t.fields?.catalogues?.websites;if(!n)return;let r={};n.forEach(t=>{if(!t.model||t.model!==e)return;let n={model:t.model,model_verbose_name:t.model_verbose_name,model_website:t.website,model_view_url:t.url,model_view_id:t.view_id};r[t.model]=n}),e in r&&(o={service:t.fields.name,serviceCategory:S(t.fields.category),models:r})}),!o)continue;let s=o,c;try{c=await O.FETCH_ELEMENT(this.deps.configContext.get(`API_HOST`),t.model,Number(t.source_id))}catch(e){console.error(`Error fetching element:`,e);continue}if(!c)continue;Object.entries(c.fields).forEach(([e,t])=>{if(typeof t==`string`&&(t.startsWith(`[`)||t.startsWith(`{`)))try{let n=_e(t);n&&(c.fields[e]=n.name||t)}catch(n){console.warn(`Could not parse field ${e} with value ${t} as JSON:`,n)}});let l=c.fields?.x_image||null;l&&=l.replace(this.deps.configContext.get(`API_HOST`),``);let u=c.fields?.detail_url?s.models[e].model_website+s.models[e].model_view_url:null,d={data:{...c.fields,id:c.id,image:l},featured:c.fields?.featured||!1,featured_fields:[`web_link`,`url`,`website`],model:t.model,model_verbose_name:i[t.model],model_view_url:u,roots:[],score:{absolute:null,relative:null},service:s.service,serviceCategory:s.serviceCategory};a(d)}this.deps.signals.emit(w.CHAT_FETCHING_RESULTS,!1)})()}clearChatHistory(){this.deps.chatContext.set({history:[]}),this.messageBuffer=``}newChat(e){this.deps.chatContext.set({history:[]}),this.messageBuffer=``,e(),this.deps.signals.emit(w.NEW_CHAT)}};const ot=async(e,t,n)=>{if(!t||t.trim()===``)return console.warn(`No query provided`),{data:null};if(n.length===0)return console.warn(`No models provided`),{data:null};let r=t.replace(/[^^A-Za-z0-9 ]/g,``),i={raw:r,translated:r};try{return{data:await O.GET_AGORA_SEARCH_RESULTS(e,i.translated,n)}}catch(e){throw console.log(`Error during query:`,JSON.parse(e.message)),E(e,`Search Query`),e}},st=async(e,t)=>{try{return it(`Elasticsearch is ingesting the missing model data.\n
            Ingesting missing data from the model: '${t}' into Elasticsearch`,`warning`,1e4),console.warn(`ELASTICSEARCH IS INGESTING\nIngesting missing data from the model: '${t}' into Elasticsearch`),await O.GET_AGORA_INGEST_MODEL(e,t),null}catch(e){return E(e,`Model Data Ingestion`),e}};var ct=class{props;callbacks;constructor(e,t){this.props=e,this.callbacks=t}async search(e){let t=this.props.serviceContext.get(`models`);if(!e||e.trim()===``){console.warn(`No query provided`);return}if(t.length===0){console.warn(`No models provided`);return}this.callbacks.hideSuggestions(),this.callbacks.showSpinner();let n=this.sanitizeQuery(e);if(this.props.configContext.get(`IS_METAGORA`)){let t=this.props.serviceContext.get(`modelsByAgora`)||{},r=new Map;await Promise.all(Object.entries(t).map(async([e,t])=>{if(t.length===0){console.warn(`No models available for Agora at host ${e}`);return}try{let i=(await ot(e,n,t)).data.results;r.set(e,i)}catch(t){console.error(`Error querying Agora at host ${e}\n${t}`),r.set(e,[])}})),this.callbacks.hideSpinner(),this.handleMetagoraSearchResults(e,r);return}try{let r=await ot(this.props.configContext.get(`API_HOST`),n,t);this.callbacks.hideSpinner();let i=r.data.results;this.handleSearchResults(e,i)}catch(t){try{let n=JSON.parse(t.message);if(n.missing_model){let t=await st(this.props.configContext.get(`API_HOST`),n.missing_model);if(t){console.error(`ELASTICSEARCH INGESTION ERROR\n${t}`),this.callbacks.hideSpinner();return}await this.search(e)}}catch{throw console.error(`SEARCH ERROR\n${t}`),this.callbacks.hideSpinner(),t}}}sanitizeQuery(e){return e.replace(/[^^A-Za-z0-9 ]/g,``)}handleSearchResults(e,t,n=!1){if(this.props.signals.emit(w.RESULTS_FETCHED,t),this.callbacks.updateClearButtonVisibility(t.length>0),t.length===0){this.props.resultContext.set({data:[],grouped:[]},!0);return}this.storeQueryInContext({raw:e,translated:e});let r=this.props.serviceContext.get(`services`),i=[...new Set(r.map(e=>({service:e.fields.name,category:S(e.fields.category),models:k(e,`model`).map(e=>e.model)})))];qe(t,i);let a=k(r,`websites`).flatMap(e=>e.websites),o=Je(t,a,this.props.configContext.get(`API_HOST`)),s=Ke(o,`absolute`),c=Ye(s);this.props.resultContext.set({data:s,grouped:c},!0)}handleMetagoraSearchResults(e,t){let n=[];if(t.forEach((e,t)=>{let r=e.map(e=>({...e,_sourceHost:t}));n.push(...r)}),this.props.signals.emit(w.RESULTS_FETCHED,n),this.callbacks.updateClearButtonVisibility(n.length>0),n.length===0){this.props.resultContext.set({data:[],grouped:[]},!0);return}this.storeQueryInContext({raw:e,translated:e});let r=this.props.serviceContext.get(`services`),i=[...new Set(r.map(e=>({service:e.fields.name,category:S(e.fields.category),models:k(e,`model`).map(e=>e.model)})))];qe(n,i);let a=k(r,`websites`).flatMap(e=>e.websites),o=Je(n,a,``),s=Ke(o,`absolute`),c=Xe(s);this.props.resultContext.set({data:s,groupedByCategory:c},!0)}storeQueryInContext(e){let t=this.props.searchContext.get(`history`)||[],n={history:[...new Set([...t,e.raw])],current:e.translated.split(` `)};this.props.searchContext.set(n)}},lt=class{deps;constructor(e){this.deps=e}checkForMention(e,t){let n=-1;for(let r=t-1;r>=0;r--){let t=e[r];if(t===` `||t===`
`||t===`\r`)break;if(t===`@`){n=r;break}}if(n===-1)return{isMentioning:!1,startIndex:-1,query:``};let r=e.substring(n+1,t).toLowerCase();return{isMentioning:!0,startIndex:n,query:r}}filterMentionResults(e){let t=this.deps.resultContext.get(`data`)||[],n=new Map;return t.forEach(e=>{let t=this.getResultDisplayName(e);t&&!n.has(t)&&n.set(t,{name:t,model:e.model_verbose_name||e.model,service:e.service})}),Array.from(n.values()).filter(t=>t.name.toLowerCase().includes(e)).slice(0,5)}getResultDisplayName(e){let t=e.data||{};for(let e of[`name`,`title`,`Name`,`Title`,`headline`,`label`,`display_name`])if(t[e]&&typeof t[e]==`string`)return t[e];return e.model_verbose_name||``}buildMentionText(e,t,n,r){let i=e.substring(0,t),a=e.substring(n),o=`${i}@${r} ${a}`,s=t+r.length+2;return{newText:o,newCursorPosition:s}}},ut=`:host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
}

.spinner {
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: currentColor;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}`,dt=class extends i{constructor(){super(`plain-spinner`,ut)}template(){return this.html`
            <div class="spinner"></div>
        `}};window.customElements.define(`plain-spinner`,dt);var ft=class extends i{activeMode=`search`;inputValues={search:``,chat:``};suggestions=[];activeSuggestionIndex=-1;mentionResults=[];activeMentionIndex=-1;mentionStartIndex=-1;isMentioning=!1;companyContext;configContext;serviceContext;searchContext;resultContext;filterContext;chatContext;chatHandler;searchHandler;mentionHandler;constructor(){super(`plain-agora-input`,[Ie,Le,Re,ze,Be,Ve,He,Ue].join(`
`)),this.companyContext=this.useContext(m.COMPANY),this.configContext=this.useContext(m.CONFIG),this.serviceContext=this.useContext(m.SERVICE),this.searchContext=this.useContext(m.SEARCH,!1,`local`),this.resultContext=this.useContext(m.RESULT),this.filterContext=this.useContext(m.FILTER),this.chatContext=this.useContext(m.CHAT),this.signals=this.useSignals(),this.signals.register(w.RESULTS_FETCHED),this.signals.register(w.RESULTS_CLEARED),this.signals.register(w.CHAT_STARTED),this.signals.register(w.CHAT_USER_MESSAGE),this.signals.register(w.CHAT_MESSAGE_CHUNK),this.signals.register(w.CHAT_MESSAGE_COMPLETE),this.signals.register(w.CHAT_RESULTS_UPDATED),this.signals.register(w.CHAT_FETCHING_RESULTS),this.signals.register(w.NEW_CHAT),this.signals.register(w.MODE_SWITCH),this.initializeHandlers()}initializeHandlers(){this.chatHandler=new at({configContext:this.configContext,serviceContext:this.serviceContext,companyContext:this.companyContext,resultContext:this.resultContext,filterContext:this.filterContext,chatContext:this.chatContext,signals:this.signals},{showSpinner:()=>this.showSpinner(),hideSpinner:()=>this.hideSpinner(),updateClearButtonVisibility:()=>this.updateClearButtonVisibility()}),this.searchHandler=new ct({configContext:this.configContext,serviceContext:this.serviceContext,resultContext:this.resultContext,searchContext:this.searchContext,signals:this.signals},{showSpinner:()=>this.showSpinner(),hideSpinner:()=>this.hideSpinner(),hideSuggestions:()=>this.hideSuggestions(),updateClearButtonVisibility:e=>{let t=this.$(`.clear-btn-header`);e?t?.classList.remove(`hidden`):t?.classList.add(`hidden`)}}),this.mentionHandler=new lt({resultContext:this.resultContext})}toggleMode(e,t){t.stopPropagation();let n=this.$(`textarea`);n&&(this.inputValues[this.activeMode]=n.value),this.activeMode=e,this.suggestions=[],this.activeSuggestionIndex=-1,this.hideSuggestions(),this.mentionResults=[],this.activeMentionIndex=-1,this.isMentioning=!1,this.hideMentions(),this.updateTabs(),this.updateInputState(),this.updateIcon(),n&&(n.value=this.inputValues[e]),this.signals.emit(w.MODE_SWITCH,e)}updateTabs(){let e=this.$(`.tabs`),t=this.$(`.search-card`),n=this.$(`.trending`);this.activeMode===`search`?(e?.classList.remove(`mode-chat`),e?.classList.add(`mode-search`),t?.classList.remove(`mode-chat`),n?.classList.remove(`hidden`)):(e?.classList.remove(`mode-search`),e?.classList.add(`mode-chat`),t?.classList.add(`mode-chat`),n?.classList.add(`hidden`))}updateInputState(){let e=this.$(`textarea`);e&&(e.classList.add(`placeholder-hidden`),setTimeout(()=>{this.activeMode===`search`?(e.setAttribute(`maxlength`,`100`),e.setAttribute(`placeholder`,`Search for funding, courses, infrastructure...`)):(e.removeAttribute(`maxlength`),e.setAttribute(`placeholder`,`Ask the AI assistant...`)),e.classList.remove(`placeholder-hidden`)},200))}updateIcon(){let e=this.$(`.globe-icon`);e&&(e.innerHTML=this.activeMode===`search`?re:h)}template(){let e=this.companyContext.get(`primaryColor`)||`#8238eb`,t=this.configContext.get(`ENABLED_AI`)?this.html`
                <div class="tabs mode-search">
                    <div class="tab-slider"></div>
                    <button class="tab" data-mode="search">
                        ${_} Search
                    </button>
                    <button class="tab" data-mode="chat">
                        ${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        <path d="M20.5 5.5A2 2 0 0 0 19 4l-1-.232a.5.5 0 0 1 0-.964l1-.232A2 2 0 0 0 20.5 1a.5.5 0 0 1 .964 0A2 2 0 0 0 23 2.572l1 .232a.5.5 0 0 1 0 .964l-1 .232A2 2 0 0 0 21.464 5.5a.5.5 0 0 1-.964 0z" transform="translate(-1 0) scale(0.7)" transform-origin="21 3"/>
        <path d="M20.5 5.5A2 2 0 0 0 19 4l-1-.232a.5.5 0 0 1 0-.964l1-.232A2 2 0 0 0 20.5 1a.5.5 0 0 1 .964 0A2 2 0 0 0 23 2.572l1 .232a.5.5 0 0 1 0 .964l-1 .232A2 2 0 0 0 21.464 5.5a.5.5 0 0 1-.964 0z" transform="translate(-2 16) scale(0.6)" transform-origin="21 3"/>
    </svg>
`} Assistant
                    </button>
                </div>`:this.html`
                <div class="tabs-single">
                    <span class="tab-label">
                        ${_} Search
                    </span>
                </div>`;return this.html`
            <div class="agora-input-container" style="--primary-color: ${e}">
                <div class="search-card">
                    <div class="card-header">
                        ${t}
                        <div class="header-actions">
                            <button 
                                class="new-chat-btn hidden" 
                                title="New conversation" 
                                aria-label="New conversation"
                            >${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="12" y1="7" x2="12" y2="13"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
`}</button>
                            <button 
                                class="clear-btn-header hidden" 
                                title="Clear results" 
                                aria-label="Clear results"
                            >${`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
        <path d="M22 21H7"/>
        <path d="m5 11 9 9"/>
    </svg>
`}</button>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <span class="icon globe-icon">${this.activeMode===`search`?re:h}</span>
                        <textarea 
                            placeholder="Search for funding, courses, infrastructure..."  
                            rows="1" 
                            maxlength="100"
                        ></textarea>
                        <div class="actions">
                            <span class="shortcut">⌘ K</span>
                            <button class="go-btn">${de}</button>
                        </div>
                    </div>
                    <div class="suggestions hidden"></div>
                    <div class="mentions hidden"></div>
                </div>

                <div class="trending">
                    <div class="trending-content">
                        <span class="label">TRENDING SEARCHES</span>
                        <div class="chips">
                            <span class="chip">latest ai courses</span>
                            <span class="chip">innovation projects</span>
                            <span class="chip">research collaboration</span>
                        </div>
                    </div>
                </div>
            </div>
        `}afterRender(){this.updateClearButtonVisibility()}listeners(){let e=this.$(`.tab[data-mode="search"]`),t=this.$(`.tab[data-mode="chat"]`),n=this.$(`.go-btn`),r=this.$(`.clear-btn-header`),i=this.$(`.new-chat-btn`),a=this.$(`textarea`);e&&(e.onclick=e=>this.toggleMode(`search`,e)),t&&(t.onclick=e=>this.toggleMode(`chat`,e)),n&&(n.onclick=()=>this.handleSubmit()),r&&(r.onclick=()=>this.clear()),i&&(i.onclick=()=>this.newChat()),a&&(a.onkeydown=e=>this.handleKeyDown(e)),a&&(a.oninput=e=>this.handleInput(e))}handleSubmit(){let e=this.$(`textarea`),t=e?.value?.trim()||``;this.activeMode===`search`?this.searchHandler.search(t):(e.value=``,this.chatHandler.chat(t))}showSpinner(){let e=this.$(`.go-btn`),t=this.$(`textarea`);e&&(e.querySelector(`plain-spinner`)||(e.dataset.originalHtml=e.innerHTML,e.innerHTML=`<plain-spinner></plain-spinner>`,e.disabled=!0,e.style.cursor=`not-allowed`,t&&(t.disabled=!0,t.style.cursor=`not-allowed`,t.style.opacity=`0.6`)))}hideSpinner(){let e=this.$(`.go-btn`),t=this.$(`textarea`);e&&(e.innerHTML=e.dataset.originalHtml||de,e.disabled=!1,e.style.cursor=`pointer`,t&&(t.disabled=!1,t.style.cursor=`text`,t.style.opacity=`1`,t.focus()))}clear(){let e=this.$(`textarea`);e&&(e.value=``,e.focus()),this.hideSuggestions(),this.$(`.clear-btn-header`)?.classList.add(`hidden`),this.resultContext.set({data:[],grouped:[]},!0),this.signals.emit(w.RESULTS_CLEARED);let t=this.searchContext.get(`history`)||[];this.searchContext.set({history:t,current:[]}),this.filterContext.set([],`filters`,!0)}updateClearButtonVisibility(){let e=this.$(`.clear-btn-header`),t=this.$(`.new-chat-btn`),n=this.resultContext.get(`data`)||[],r=this.chatContext.get(`history`)||[];n.length>0?e?.classList.remove(`hidden`):e?.classList.add(`hidden`),r.length>0?t?.classList.remove(`hidden`):t?.classList.add(`hidden`)}newChat(){let e=this.$(`.new-chat-btn`);this.chatHandler.newChat(()=>e?.classList.add(`hidden`))}handleInput(e){let t=e.target,n=t.value,r=t.selectionStart||0;if(this.activeMode===`chat`){let e=this.mentionHandler.checkForMention(n,r);if(e.isMentioning&&(this.isMentioning=!0,this.mentionStartIndex=e.startIndex,this.mentionResults=this.mentionHandler.filterMentionResults(e.query),this.activeMentionIndex=this.mentionResults.length>0?0:-1,this.mentionResults.length>0)){this.renderMentions(),this.showMentions();return}}this.hideMentions(),this.isMentioning=!1;let i=n.trim().toLowerCase();if(!i){this.hideSuggestions();return}if(this.activeMode!==`search`){this.hideSuggestions();return}let a=this.searchContext.get(`history`)||[];this.suggestions=Ze(a,i),this.activeSuggestionIndex=-1,this.suggestions.length>0?(this.renderSuggestions(i),this.showSuggestions()):this.hideSuggestions()}renderMentions(){let e=this.$(`.mentions`);e&&(e.innerHTML=`
            <div class="mentions-header">
                <span class="mentions-label">@ Reference a result</span>
            </div>
            <div class="mentions-content">
                ${this.mentionResults.map((e,t)=>`
                <div class="mention-item ${t===this.activeMentionIndex?`active`:``}" data-index="${t}">
                    <span class="mention-name">${e.name}</span>
                    <span class="mention-meta">${e.model} · ${e.service}</span>
                </div>
            `).join(``)}
            </div>
        `,e.querySelectorAll(`.mention-item`).forEach((e,t)=>{e.onmousedown=e=>{e.preventDefault(),this.selectMention(this.mentionResults[t])},e.onmouseenter=()=>{this.activeMentionIndex=t,this.renderMentions()}}))}showMentions(){let e=this.$(`.mentions`),t=this.$(`.search-card`);e?.classList.remove(`hidden`),t?.classList.add(`has-mentions`)}hideMentions(){let e=this.$(`.mentions`),t=this.$(`.search-card`);e?.classList.add(`hidden`),t?.classList.remove(`has-mentions`),this.mentionResults=[],this.activeMentionIndex=-1}selectMention(e){let t=this.$(`textarea`);if(!t)return;let n=t.selectionStart||0,{newText:r,newCursorPosition:i}=this.mentionHandler.buildMentionText(t.value,this.mentionStartIndex,n,e.name);t.value=r,t.setSelectionRange(i,i),this.hideMentions(),this.isMentioning=!1,t.focus()}showSuggestions(){let e=this.$(`.suggestions`),t=this.$(`.search-card`);e?.classList.remove(`hidden`),t?.classList.add(`has-suggestions`)}hideSuggestions(){let e=this.$(`.suggestions`),t=this.$(`.search-card`);e?.classList.add(`hidden`),t?.classList.remove(`has-suggestions`)}renderSuggestions(e){let t=this.$(`.suggestions`);t&&(t.innerHTML=`
            <div class="suggestions-content">
                ${this.suggestions.map((t,n)=>{let{match:r,rest:i}=Qe(t,e);return`
                <div class="suggestion-item ${n===this.activeSuggestionIndex?`active`:``}">
                    ${_}
                    <span><span class="highlight">${r}</span>${i}</span>
                    <span class="tab-hint">TAB</span>
                </div>
            `}).join(``)}
            </div>
        `,t.querySelectorAll(`.suggestion-item`).forEach((t,n)=>{t.onmousedown=e=>{e.preventDefault(),this.selectSuggestion(this.suggestions[n])},t.onmouseenter=()=>{this.activeSuggestionIndex=n,this.renderSuggestions(e)}}))}handleKeyDown(e){let t=this.$(`textarea`);if(this.isMentioning&&this.mentionResults.length>0){if(e.key===`ArrowDown`){e.preventDefault(),this.activeMentionIndex++,this.activeMentionIndex>=this.mentionResults.length&&(this.activeMentionIndex=0),this.renderMentions();return}else if(e.key===`ArrowUp`){e.preventDefault(),this.activeMentionIndex--,this.activeMentionIndex<0&&(this.activeMentionIndex=this.mentionResults.length-1),this.renderMentions();return}else if(e.key===`Tab`||e.key===`Enter`){if(this.activeMentionIndex>=0){e.preventDefault(),this.selectMention(this.mentionResults[this.activeMentionIndex]);return}}else if(e.key===`Escape`){e.preventDefault(),this.hideMentions(),this.isMentioning=!1;return}}e.key===`ArrowDown`?(e.preventDefault(),this.activeSuggestionIndex++,this.activeSuggestionIndex>=this.suggestions.length&&(this.activeSuggestionIndex=0),this.renderSuggestions(t.value)):e.key===`ArrowUp`?(e.preventDefault(),this.activeSuggestionIndex--,this.activeSuggestionIndex<0&&(this.activeSuggestionIndex=this.suggestions.length-1),this.renderSuggestions(t.value)):e.key===`Tab`?this.activeSuggestionIndex>=0&&(e.preventDefault(),this.selectSuggestion(this.suggestions[this.activeSuggestionIndex])):e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),this.activeSuggestionIndex>=0?this.selectSuggestion(this.suggestions[this.activeSuggestionIndex]):this.handleSubmit())}selectSuggestion(e){let t=this.$(`textarea`);t&&(t.value=e,this.hideSuggestions(),this.suggestions=[],this.activeSuggestionIndex=-1,t.focus(),t.setSelectionRange(e.length,e.length))}};window.customElements.define(`plain-agora-input`,ft);var pt=`.plain-filter-widget-wrapper {
    padding: 1rem;
    box-sizing: border-box;

    width: 100%;

    display: block;
    
    color: var(--text-color);
}

.filter-widget {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #eef2f6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 0;
    overflow: hidden;
}

.filter-header {
    user-select: none;
    cursor: pointer;

    padding: 0.75rem 1.5rem;

    height: 25px;

    border-bottom: 1px solid #e2e8f0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: #f1f5f9;

    transition: border-bottom-color 0.2s;
}

.filter-widget.collapsed .filter-header {
    border-bottom-color: transparent;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-left h3 {
    font-size: 12px !important;
}

.chevron {
    display: flex;
    align-items: center;
    color: #64748b;
    transition: transform 0.3s ease;
}

.filter-widget.collapsed .chevron {
    transform: rotate(-90deg);
}

.filter-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: -0.01em;
    text-transform: uppercase;
}

.clear-filters-btn {
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.clear-filters-btn:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
}

.filter-wrapper {
    height: auto;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    interpolate-size: allow-keywords;
}

.filter-widget.collapsed .filter-wrapper {
    height: 0;
}

.filter-list {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}



.filter-item {
    padding: 1rem;

    display: flex;
    flex-direction: column;

    border: 1px solid #e2e8f0;
    border-radius: 12px;

    background-color: #f8fafc;
}

.filter-item label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-color-secondary);
}

.filter-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.filter-section-header label {
    cursor: pointer;
}

.section-chevron {
    display: flex;
    align-items: center;
    color: #64748b;
    transition: transform 0.2s ease;
}

.filter-item.section-collapsed .section-chevron {
    transform: rotate(-90deg);
}

.chip-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-height: 500px;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out;
    opacity: 1;
    margin-top: 0.75rem;
}

.filter-item.section-collapsed .chip-container {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
}

.chip {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
    padding: 0.35rem 0.85rem;
    font-size: 12px;
    font-weight: 500;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}

.chip:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.chip.active {
    background: #fff;
    color: var(--primary-color, var(--accent-color));
    border-color: var(--primary-color, var(--accent-color));
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-widget.empty {
    text-align: center;
    color: var(--text-color-muted);
    font-style: italic;
    padding: 2rem 0;
}
`;const A={catalogue:[`model_verbose_name`],service:[`service`],serviceCategory:[`serviceCategory`],agora:[`_sourceHost`],origin:[`origin`,`x_origin`,`x_home_partner_institution`,`x_home_university`,`x_participating_universities`,`x_host_university`,`x_university`,`x_university_origin`]};var mt=class extends i{selectedFilters;resultContext;filterContext;companyContext;metagoraContext;isCollapsed=!1;collapsedSections=new Set;sectionsInitialized=!1;constructor(){super(`plain-filter-widget`,pt),this.resultContext=this.useContext(m.RESULT,!0),this.filterContext=this.useContext(m.FILTER),this.companyContext=this.useContext(m.COMPANY),this.metagoraContext=this.useContext(m.METAGORA),this.selectedFilters=this.useState({mapping:A,filters:{}}),this.initiFilters()}initiFilters(){let e=this.filterContext.get();this.selectedFilters.set({mapping:A,filters:e?.filters||{}})}getAgoraNameFromHost(e){return(this.metagoraContext.get(`agoras`)||[]).find(t=>t.host===e)?.name||e}truncateText(e,t=30){return e.length<=t?e:e.substring(0,t)+`...`}updateAvailableFilters(){let e=this.resultContext.get()?.data||[],t=Object.values(A).flatMap(e=>e),n={service:[],origin:[],catalogue:[],serviceCategory:[],agora:[]};return t.map(t=>{e.map(e=>{let r=k(e,t),i=Object.keys(A).find(e=>A[e].includes(t));if(!i||![`service`,`origin`,`catalogue`,`serviceCategory`,`agora`].includes(i))return;let a=r.map(e=>e[t]);if(a=a.filter(e=>e),i===`origin`){let e=a.flatMap(e=>x(e));n[i].push(...e)}else if(i===`agora`){let e=a.map(e=>({label:this.getAgoraNameFromHost(e),value:e}));n[i].push(...e)}else n[i].push(...a);if(i===`agora`){let e=new Set;n[i]=n[i].filter(t=>e.has(t.value)?!1:(e.add(t.value),!0))}else n[i]=Array.from(new Set(n[i]))})}),n}clearFilters(){let e={mapping:A,filters:{}};this.selectedFilters.set(e),this.filterContext.set(e,!0)}toggleCollapse(){this.isCollapsed=!this.isCollapsed,this.$(`.filter-widget`)?.classList.toggle(`collapsed`,this.isCollapsed)}toggleSection(e){this.collapsedSections.has(e)?this.collapsedSections.delete(e):this.collapsedSections.add(e),this.render()}template(){if((this.resultContext.get()?.data||[]).length===0)return``;let e=this.updateAvailableFilters(),t=Object.values(e).flatMap(e=>e).length>0;t&&!this.sectionsInitialized&&(this.sectionsInitialized=!0,[`origin`,`service`,`catalogue`,`serviceCategory`,`agora`].forEach(t=>{e[t]&&e[t].length>1&&this.collapsedSections.add(t)}));let n=this.companyContext.get(`primaryColor`);n&&this.style.setProperty(`--primary-color`,n);let r=e.origin.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`origin`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="origin">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
`} Origins</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.origin.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.origin?.includes(e)?`active`:``}"
                                data-key="origin"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,i=e.service.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`service`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="service">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
`} Services</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.service.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.service?.includes(e)?`active`:``}"
                                data-key="service"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,a=e.catalogue.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`catalogue`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="catalogue">
                    <label>${ae} Catalogues</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.catalogue.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.catalogue?.includes(e)?`active`:``}"
                                data-key="catalogue"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,o=e.serviceCategory.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`serviceCategory`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="serviceCategory">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
`} Service Categories</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.serviceCategory.map(e=>`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.serviceCategory?.includes(e)?`active`:``}"
                                data-key="serviceCategory"
                                data-value="${e}"
                                title="${e}"
                            >
                                ${this.truncateText(e)}
                            </button>
                        `).join(``)}
                </div>
            </div>`:``,s=e.agora.length>1?this.html`
                <div class="filter-item ${this.collapsedSections.has(`agora`)?`section-collapsed`:``}">
                <div class="filter-section-header" data-section="agora">
                    <label>${`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
    </svg>
`} Agoras</label>
                    <div class="section-chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="chip-container">
                    ${e.agora.map(e=>{let t=typeof e==`object`?e.value:e,n=typeof e==`object`?e.label:e;return`
                            <button 
                                class="chip ${this.selectedFilters.get()?.filters?.agora?.includes(t)?`active`:``}"
                                data-key="agora"
                                data-value="${t}"
                                title="${n}"
                            >
                                ${this.truncateText(n)}
                            </button>
                        `}).join(``)}
                </div>
            </div>`:``;return e.origin.length<2&&e.service.length<2&&e.catalogue.length<2&&e.serviceCategory.length<2&&e.agora.length<2?``:this.html`
            <div class="filter-widget ${this.isCollapsed?`collapsed`:``}">
                <div class="filter-header">
                    <div class="header-left">
                        <h3>Filters</h3>
                        <div class="chevron">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    ${t?this.html`<button class="clear-filters-btn">Clear all</button>`:``}
                </div>
                <div class="filter-wrapper">
                    <div class="filter-list">
                        ${s}
                        ${o}
                        ${i}
                        ${r}
                        ${a}
                    </div>
                </div>
            </div>
        `}listeners(){this.$$(`.chip`).forEach(e=>{e.onclick=t=>this.selectChip(t,e)});let e=this.$(`.clear-filters-btn`);e&&(e.onclick=e=>{e.stopPropagation(),this.clearFilters()});let t=this.$(`.filter-header`);t&&(t.onclick=()=>this.toggleCollapse()),this.$$(`.filter-section-header`).forEach(e=>{e.onclick=t=>{t.stopPropagation();let n=e.dataset.section;n&&this.toggleSection(n)}})}selectChip(e,t){e.stopPropagation();let n=t.dataset.key,r=t.dataset.value,{filters:i,mapping:a}=this.selectedFilters.get(),o={...i};o[n]&&o[n].includes(r)?o[n]=o[n].filter(e=>e!==r):o[n]=[...o[n]||[],r],this.selectedFilters.set({mapping:a,filters:o}),this.filterContext.set({mapping:a,filters:o},!0)}};window.customElements.define(`plain-filter-widget`,mt);var ht=`.plain-intro-animation-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: white;

    z-index: 1000000;

    transition: 300ms;
} 

.central-square {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: 32px;

    width: 10px;
    height: 10px;

    background-color: blue;

    overflow: hidden;

    animation: expand 1.5s ease-in-out forwards;

    transition: 300ms;
}

.title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-family: 'Sora', sans-serif;
    color: white;
    font-size: 82px;

    opacity: 0;

    animation: fadeIn 1.5s ease-in-out forwards;
    animation-delay: 0.5s;
}

.move-out-to-left {
    animation: moveOutToLeft 4s ease-in-out forwards;
}

@keyframes expand {
    0% {
        width: 10px;
        height: 10px;
    }
    100% {
        width: calc(100% - 32px);
        height: calc(100% - 32px);
    }
}

@keyframes moveOutToLeft {
    0% {
        transform: translate(-50%, -50%);
    }
    100% {
        transform: translate(-100%, -50%);
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

/* ANIMATED BACKGROUND */
/* Background container */
.background-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1538px !important;
    border-radius: 5px;
    background: #E86A2F; /* White background for contrast */
    overflow: hidden; /* Hide overflow for masking */
    z-index: -1; /* Behind all other content */
    pointer-events: none; /* Don't block interactions with other elements */
}

@media (max-width: 768px) {
    .background-container {
        background:#E86A2F !important;
    }
}

/* Content styles */
.content {
    position: relative;
    z-index: 1; /* Above the background */
    padding: 2rem;
    min-height: 100vh;
    /* Add any other styles for your content */
}

/* Animated gradient background */
.gradient-layer {
    position: absolute;
    width: 220vw;
    height: 130vh;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    filter: blur(75px);
    animation: gradientShift 12s ease-in-out infinite alternate;
    z-index: 1;
    opacity: 0; /* Initially hidden */
}

/* Base ellipse styles */
.ellipse {
    position: absolute;
    background: #FFFFFF;
    border-radius: 50%;
    opacity: 1;
    filter: blur(50px);
    z-index: 2;
    
    /* This creates the effect where gradient shows through */
    background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    animation: ellipseColorShift 12s ease-in-out infinite alternate;
}

/* Individual ellipse animations */
.ellipse-323 {
    width: 1200px;
    height: 1200px;
    animation: ellipse323Move 9s ease-in-out infinite alternate;
}

.ellipse-324 {
    width: 550px;
    height: 550px;
    animation: ellipse324Move 11s ease-in-out infinite alternate;
}

.ellipse-325 {
    width: 650px;
    height: 650px;
    animation: ellipse325Move 13s ease-in-out infinite alternate;
}

.ellipse-326 {
    width: 900px;
    height: 1000px;
    animation: ellipse326Move 15s ease-in-out infinite alternate;
}

.ellipse-327 {
    width: 650px;
    height: 650px;
    animation: ellipse327Move 12s ease-in-out infinite alternate;
}

.ellipse-328 {
    width: 650px;
    height: 650px;
    animation: ellipse328Move 10s ease-in-out infinite alternate;
}

.ellipse-329 {
    width: 650px;
    height: 650px;
    animation: ellipse329Move 14s ease-in-out infinite alternate;
}

.ellipse-330 {
    width: 650px;
    height: 650px;
    animation: ellipse330Move 11s ease-in-out infinite alternate;
}

/* Keyframe animations for gradient */
@keyframes gradientShift {
    0% {
        background: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
    25% {
        background: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
        transform: translate(-50%, -50%) rotate(5deg) scale(1.1);
    }
    50% {
        background: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
        transform: translate(-50%, -50%) rotate(-3deg) scale(1.05);
    }
    75% {
        background: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
        transform: translate(-50%, -50%) rotate(7deg) scale(0.95);
    }
    100% {
        background: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
        transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
}

/* Ellipse color animation to match gradient */
@keyframes ellipseColorShift {
    0% {
        background-image: linear-gradient(28.42deg, #5281F5 10.24%, #783FE4 30.6%, #E73371 53.81%, #E86A2F 76.8%, #F5BF45 101.98%);
    }
    25% {
        background-image: linear-gradient(29.27deg, #5281F5 -1.75%, #783FE4 19.09%, #E73371 42.84%, #E86A2F 66.36%, #F5BF45 92.11%);
    }
    50% {
        background-image: linear-gradient(30.06deg, #5281F5 6.63%, #783FE4 25.95%, #E73371 47.98%, #E86A2F 69.8%, #F5BF45 93.69%);
    }
    75% {
        background-image: linear-gradient(34.1deg, #5281F5 -3.5%, #783FE4 20.73%, #E73371 48.36%, #E86A2F 75.72%, #F5BF45 105.67%);
    }
    100% {
        background-image: linear-gradient(31.63deg, #5281F5 -0.05%, #783FE4 22.23%, #E73371 47.63%, #E86A2F 72.78%, #F5BF45 100.32%);
    }
}

/* Ellipse movement animations */
@keyframes ellipse323Move {
    0% { left: -15%; top: 1.5%; }
    25% { left: 5%; top: -17%; }
    50% { left: -42%; top: -5%; }
    75% { left: -4%; top: -3%; }
    100% { left: 0%; top: -7%; }
}

@keyframes ellipse324Move {
    0% { left: 30%; top: 4%; }
    25% { left: 38%; top: -8.5%; }
    50% { left: 38%; top: -8.5%; }
    75% { left: 38.5%; top: 10%; }
    100% { left: 38.5%; top: 10%; }
}

@keyframes ellipse325Move {
    0% { left: 19%; top: 38%; }
    25% { left: 8.5%; top: 25%; }
    50% { left: 8.5%; top: 25%; }
    75% { left: 8.5%; top: 25%; }
    100% { left: 12%; top: 29%; }
}

@keyframes ellipse326Move {
    0% { left: 47%; top: 2.5%; }
    25% { left: 69%; top: -3%; }
    50% { left: 50%; top: 10%; }
    75% { left: 47.5%; top: 1.8%; }
    100% { left: 51.5%; top: -2%; }
}

@keyframes ellipse327Move {
    0% { left: 46.5%; top: 20.5%; }
    25% { left: 41%; top: 28%; }
    50% { left: 31%; top: 35%; }
    75% { left: 38%; top: 10.5%; }
    100% { left: 43%; top: 30.5%; }
}

@keyframes ellipse328Move {
    0% { left: 78.5%; top: 43.5%; }
    25% { left: 69.5%; top: 13%; }
    50% { left: 69.5%; top: 13%; }
    75% { left: 69.5%; top: 13%; }
    100% { left: 69.5%; top: 13%; }
}

@keyframes ellipse329Move {
    0% { left: 89%; top: -5%; }
    25% { left: 89%; top: -5%; }
    50% { left: 89%; top: -16%; }
    75% { left: 84%; top: 11.5%; }
    100% { left: 88%; top: -7%; }
}

@keyframes ellipse330Move {
    0% { left: -26.5%; top: -5%; }
    25% { left: -26.5%; top: -5%; }
    50% { left: -26.5%; top: -5%; }
    75% { left: -26.5%; top: 10.5%; }
    100% { left: -26.5%; top: -5.5%; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .ellipse {
        transform: scale(0.7);
    }
}

@media (max-width: 480px) {
    .ellipse {
        transform: scale(0.5);
    }
}`,gt=class extends i{constructor(){super(`plain-intro-animation`,ht),setTimeout(()=>{let e=this.$(`.central-square`);e&&(e.style.opacity=`0`),setTimeout(()=>{this.style.opacity=`0`,setTimeout(()=>{this.remove()},1e3)},500)},3e3)}template(){return this.html`
            <div class="central-square">
                <section class="s_aupaeu_animated_background background-container" >
                    <div class="gradient-layer"></div>
                    <div class="ellipse ellipse-323"></div>
                    <div class="ellipse ellipse-324"></div>
                    <div class="ellipse ellipse-325"></div>
                    <div class="ellipse ellipse-326"></div>
                    <div class="ellipse ellipse-327"></div>
                    <div class="ellipse ellipse-328"></div>
                    <div class="ellipse ellipse-329"></div>
                    <div class="ellipse ellipse-330"></div>
                </section>
            </div>
            <div class="title">
                <svg xmlns="http://www.w3.org/2000/svg" width="621" height="193" viewBox="0 0 621 193" fill="none">
                    <path d="M0 149.248L50.8478 0H98.2241L150.501 149.248H120.687L76.3738 19.8316L86.7884 24.3295H61.2624L71.8812 19.8316L28.9976 149.248H0ZM35.5322 109.585L44.7216 85.0508H105.167L114.152 109.585H35.5322Z" fill="white"></path>
                    <path d="M212.096 193C206.786 193 201.341 192.796 195.759 192.387C190.313 191.978 185.208 191.433 180.443 190.751V167.035C185.344 167.58 190.586 168.057 196.167 168.466C201.749 169.011 206.99 169.284 211.891 169.284C221.013 169.284 228.364 168.194 233.946 166.013C239.664 163.832 243.816 160.356 246.403 155.586C249.125 150.952 250.487 145.023 250.487 137.799V115.923L256.613 102.02C256.205 112.243 254.094 120.966 250.283 128.19C246.471 135.277 241.297 140.729 234.763 144.546C228.228 148.226 220.672 150.066 212.096 150.066C204.472 150.066 197.529 148.635 191.266 145.772C185.14 142.91 179.831 138.957 175.338 133.914C170.982 128.871 167.578 122.942 165.128 116.127C162.677 109.312 161.452 102.02 161.452 94.2511V89.9576C161.452 82.1886 162.677 74.9647 165.128 68.286C167.714 61.471 171.322 55.542 175.951 50.4989C180.58 45.4559 186.093 41.5713 192.492 38.8453C198.89 36.1194 205.969 34.7564 213.729 34.7564C222.851 34.7564 230.747 36.7327 237.417 40.6854C244.224 44.6381 249.534 50.3626 253.346 57.8591C257.158 65.3556 259.268 74.5558 259.676 85.4598L254.775 86.2775V38.232H277.238V136.163C277.238 149.657 274.924 160.561 270.295 168.875C265.666 177.189 258.519 183.255 248.853 187.071C239.323 191.024 227.071 193 212.096 193ZM220.264 125.736C225.71 125.736 230.679 124.51 235.171 122.056C239.664 119.603 243.271 116.059 245.994 111.425C248.717 106.791 250.078 101.202 250.078 94.66V87.5042C250.078 81.2345 248.649 75.9188 245.79 71.5572C243.067 67.1956 239.46 63.9244 234.967 61.7436C230.474 59.4266 225.573 58.268 220.264 58.268C214.274 58.268 208.964 59.6992 204.336 62.5614C199.843 65.2874 196.304 69.172 193.717 74.215C191.13 79.2581 189.837 85.2553 189.837 92.2066C189.837 99.0215 191.13 104.951 193.717 109.994C196.304 115.037 199.843 118.921 204.336 121.647C208.964 124.373 214.274 125.736 220.264 125.736Z" fill="white"></path>
                    <path d="M361.498 153.132C351.696 153.132 343.051 151.565 335.563 148.43C328.076 145.295 321.745 141.07 316.572 135.754C311.399 130.302 307.451 124.169 304.728 117.354C302.141 110.539 300.848 103.451 300.848 96.0911V91.7977C300.848 84.1649 302.209 76.941 304.932 70.1261C307.791 63.1748 311.807 57.0413 316.98 51.7256C322.29 46.2737 328.688 42.0484 336.176 39.0498C343.664 35.9149 352.104 34.3475 361.498 34.3475C370.891 34.3475 379.332 35.9149 386.82 39.0498C394.307 42.0484 400.638 46.2737 405.811 51.7256C411.12 57.0413 415.136 63.1748 417.859 70.1261C420.582 76.941 421.943 84.1649 421.943 91.7977V96.0911C421.943 103.451 420.582 110.539 417.859 117.354C415.273 124.169 411.393 130.302 406.219 135.754C401.046 141.07 394.716 145.295 387.228 148.43C379.74 151.565 371.164 153.132 361.498 153.132ZM361.498 128.803C368.441 128.803 374.295 127.304 379.06 124.305C383.825 121.17 387.432 117.013 389.883 111.834C392.333 106.518 393.558 100.521 393.558 93.8422C393.558 87.0272 392.265 81.03 389.678 75.8506C387.228 70.535 383.552 66.3778 378.651 63.3792C373.886 60.2444 368.169 58.6769 361.498 58.6769C354.827 58.6769 349.041 60.2444 344.14 63.3792C339.375 66.3778 335.699 70.535 333.113 75.8506C330.526 81.03 329.233 87.0272 329.233 93.8422C329.233 100.521 330.458 106.518 332.909 111.834C335.495 117.013 339.171 121.17 343.936 124.305C348.701 127.304 354.555 128.803 361.498 128.803Z" fill="white"></path>
                    <path d="M446.798 149.248V38.232H469.261V85.2553H468.648C468.648 69.3083 472.051 57.2458 478.858 49.0678C485.665 40.8898 495.672 36.8008 508.877 36.8008H512.961V61.5392H505.201C495.672 61.5392 488.252 64.1289 482.943 69.3083C477.769 74.3513 475.183 81.7115 475.183 91.3888V149.248H446.798Z" fill="white"></path>
                    <path d="M598.537 149.248V116.332H593.84V79.7352C593.84 73.3291 592.275 68.5586 589.143 65.4237C586.012 62.2888 581.179 60.7214 574.645 60.7214C571.241 60.7214 567.157 60.7895 562.392 60.9258C557.627 61.0621 552.794 61.2666 547.893 61.5392C543.129 61.6755 538.84 61.8799 535.028 62.1525V38.0275C538.16 37.7549 541.699 37.4823 545.647 37.2097C549.595 36.9371 553.611 36.8008 557.695 36.8008C561.916 36.6646 565.864 36.5964 569.54 36.5964C580.975 36.5964 590.437 38.0957 597.924 41.0943C605.548 44.0929 611.266 48.7952 615.078 55.2013C619.026 61.6073 621 69.9898 621 80.3485V149.248H598.537ZM562.801 152.11C554.768 152.11 547.689 150.679 541.563 147.817C535.573 144.954 530.876 140.865 527.473 135.55C524.205 130.234 522.572 123.828 522.572 116.332C522.572 108.154 524.546 101.475 528.494 96.2956C532.578 91.1162 538.228 87.2316 545.443 84.642C552.794 82.0523 561.371 80.7574 571.173 80.7574H596.903V97.7267H570.765C564.23 97.7267 559.193 99.3623 555.653 102.633C552.25 105.768 550.548 109.857 550.548 114.9C550.548 119.944 552.25 124.032 555.653 127.167C559.193 130.302 564.23 131.87 570.765 131.87C574.713 131.87 578.32 131.188 581.588 129.825C584.991 128.326 587.782 125.873 589.96 122.465C592.275 118.921 593.568 114.151 593.84 108.154L600.783 116.127C600.103 123.896 598.197 130.439 595.066 135.754C592.071 141.07 587.85 145.159 582.405 148.021C577.095 150.747 570.561 152.11 562.801 152.11Z" fill="white"></path>
                </svg>
            </div>
        `}};window.customElements.define(`plain-intro-animation`,gt);var _t=`.plain-detail-modal-wrapper {
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.modal-overlay {
    padding: 2rem;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    animation: fadeIn 0.3s ease-out;
}

.modal-content {
    position: relative;
    padding: 0;
    box-sizing: border-box;
    background: white;
    width: 90%;
    max-width: 1000px;
    height: 85%;
    max-height: 800px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(0,0,0,0.05);
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.close-btn {
    cursor: pointer;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border: 1px solid #e5e7eb;
    border-radius: 50%;
    color: #6b7280;
    font-size: 24px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    transition: all 0.2s ease;
}

.close-btn:hover {
    color: #111827;
    background: #fff;
    transform: rotate(90deg);
}

/* LAYOUT */

.modal-content--top {
    flex: 1;
    display: flex;
    flex-direction: row;
    min-height: 0;
    border-bottom: 1px solid #f3f4f6;
}

.modal-content--top-left {
    flex: 1;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow-y: auto;
}

.modal-content--top-right {
    flex: 0 0 40%;
    background-color: #f9fafb;
    border-left: 1px solid #f3f4f6;
    position: relative;
    overflow: hidden;
}

.image-item {
    width: 100%;
    height: 100%;
}

.image-wrapper {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease;
}

/* Header */
.modal-content--header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.top-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.score-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #f0fdf4;
    color: #166534;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #dcfce7;
}

.score-badge.ai-pick {
    background: linear-gradient(135deg, #f0e6ff 0%, #e6f0ff 100%);
    border-color: #c4b5fd;
    color: #6b21a8;
}

.score-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: hsl(calc(var(--score) * 120), 70%, 50%);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.5);
}

.score-dot.ai {
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
}

.origin-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    background: #f9fafb;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #f3f4f6;
}

.origin-badge svg {
    width: 14px;
    height: 14px;
    opacity: 0.7;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
    letter-spacing: -0.02em;
}

.model-badge {
    display: inline-block;
    font-size: 14px;
    color: #6b7280;
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 4px;
    align-self: flex-start;
}

/* Summary */
.modal-content--summary h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin: 0 0 0.75rem 0;
    font-weight: 600;
}

.modal-content--summary p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #4b5563;
}

/* Actions */
.actions-wrapper {
    display: flex;
    gap: 1rem;
    margin-top: auto;
    padding-top: 1rem;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    transition: all 0.2s ease;
}

.action-btn.primary {
    background: #111827;
    color: white;
    border: 1px solid transparent;
}

.action-btn.primary svg {
    margin-left: 0;
    max-width: 0;
    opacity: 0;
    transition: all 0.3s ease;
}

.action-btn.primary:hover svg {
    margin-left: 8px;
    max-width: 16px;
    opacity: 1;
}

.action-btn.primary:hover {
    background: #000;
    /* box-shadow: 0 4px 12px rgba(0,0,0,0.15); */
}

.action-btn.secondary {
    gap: 8px;
    background: white;
    color: #374151;
    border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #111827;
}

/* Bottom Details */
.modal-content--bottom {
    background: #fcfcfc;
    border-top: 1px solid #f3f4f6;
    padding: 2rem 2.5rem;
    max-height: 40%;
    overflow-y: auto;
}

.modal-content--bottom h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin: 0 0 1.5rem 0;
    font-weight: 600;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem 3rem;
}

.detail-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-label {
    font-size: 12px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    font-weight: 600;
}

.detail-value {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    word-break: break-word;
}

.detail-value.detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.detail-tag {
    display: inline-block;
    background-color: #f3f4f6;
    color: #374151;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid #e5e7eb;
}

/* Highlighted Terms - Highlighter marker style */
mark {
    background-color: transparent; /* Will be set inline */
    color: inherit;
    padding: 0;
    border: none;
    border-radius: 0;
    font-weight: inherit;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Responsive */
@media (max-width: 900px) {
    .modal-content {
        width: 100%;
        height: 100%;
        border-radius: 0;
        max-width: none;
        max-height: none;
    }

    .modal-content--top {
        flex-direction: column-reverse;
        flex: auto;
    }

    .modal-content--top-right {
        flex: 0 0 200px;
        border-left: none;
        border-bottom: 1px solid #f3f4f6;
    }

    .modal-content--top-left {
        padding: 1.5rem;
    }

    .modal-content--bottom {
        padding: 1.5rem;
    }
    
    .modal-title {
        font-size: 1.5rem;
    }
}`,vt=class extends i{modalContext;configContext;serviceContext;companyContext;possibleNameFields;possibleSummaryFields;possibleImageFields;possibleOriginFields;possibleAdditionalUrlFields;excludedFields;constructor(){super(`plain-detail-modal`,_t),this.configContext=this.useContext(m.CONFIG),this.serviceContext=this.useContext(m.SERVICE),this.companyContext=this.useContext(m.COMPANY),this.modalContext=this.useContext(m.MODAL,!0),this.possibleNameFields=[`display_name`,`name`],this.possibleSummaryFields=[`x_summary`,`x_description`,`summary`,`description`],this.possibleImageFields=[`x_image`,`image`],this.possibleOriginFields=[`origin`,`x_origin`,`x_university_origin`,`university_origin`,`x_home_partner_institution`,`home_partner_institution`,`x_host_university`,`host_university`,`x_participating_universities`,`participating_universities`],this.possibleAdditionalUrlFields=[`x_web_link`,`web_link`,`x_link`,`link`,`x_more_info`,`more_info`,`x_additional_link`,`additional_link`],this.excludedFields=[...this.possibleImageFields,...this.possibleOriginFields,...this.possibleNameFields,...this.possibleSummaryFields,...this.possibleAdditionalUrlFields,`id`,`score`,`detail_url`,`write_uid`,`write_date`,`create_uid`,`create_date`,`__last_update`,`featured`,`validated`,`lead`,`x_editors`,`contact_person`]}close(){this.modalContext.set({isOpen:!1,element:null},!0)}getDetailUrl(e){let t=e?._sourceHost||this.configContext.get(`API_HOST`);return ke(e?.model,e?.data?.id,this.serviceContext.get(`services`)||[],t,e?.model_view_url)}getHighlightedText(e,t){let n=this.companyContext.get(`primaryColor`)||`#8238eb`;return je(e,t,n)}extractValueForField(e,t){for(let n of t)if(e[n])return e[n];return null}extractFieldsData(e){let t=this.extractValueForField(e.data,this.possibleOriginFields)||``,n=this.extractValueForField(e.data,this.possibleImageFields)||``,r=this.extractValueForField(e.data,this.possibleNameFields)||``,i=this.extractValueForField(e.data,this.possibleSummaryFields)||``,a=this.extractValueForField(e.data,this.possibleAdditionalUrlFields)||``,o=e.model_verbose_name||``;return{rawOrigin:t,rawImageUrl:n,name:r,summary:i,additionalUrl:a,modelName:o}}template(){let{isOpen:e,element:t}=this.modalContext.get();if(!e||!t)return``;let{rawOrigin:n,rawImageUrl:r,name:i,summary:a,additionalUrl:o,modelName:s}=this.extractFieldsData(t),c=this.configContext.get(`API_HOST`),l=t.data,u=t.score?.relative??null,d=x(n),f=C(a),p=this.getDetailUrl(t),m=r?Oe(r,c):``,ee=d.length>0?d.map(e=>this.html`
                <span class="origin-badge">
                    ${v}
                    ${e}
                </span>
            `).join(``):``;return this.html`
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="close-btn" aria-label="Close modal">×</button>

                    <div class="modal-content--top">
                        <div class="modal-content--top-left">

                            <!-- Header -->
                            <div class="modal-content--header">
                                <div class="top-info">
                                    <plain-score-badge score="${u}"></plain-score-badge>
                                    ${ee}
                                </div>
                                <h2 class="modal-title">${this.getHighlightedText(i,t.roots||[])}</h2>
                                <div class="model-badge">${s}</div>
                            </div>

                            <!-- Summary -->
                            <div class="modal-content--summary">
                                <h3>Summary</h3>
                                <p>${this.getHighlightedText(f,t.roots||[])}</p>
                            </div>

                            <!-- Actions -->
                            <div class="actions-wrapper">
                                <a 
                                    href="${p}" 
                                    target="_blank" 
                                    class="action-btn primary"
                                    style="background-color: ${this.companyContext.get(`primaryColor`)}"
                                >
                                    View Full Details
                                    ${oe}
                                </a>
                                ${o?this.html`
                                    <a href="${o}" target="_blank" class="action-btn secondary">
                                        Visit Source
                                        <span class="icon">↗</span>
                                    </a>
                                `:``}
                            </div>
                        </div>

                        ${m?this.html`
                        <!-- Image -->
                        <div class="modal-content--top-right">
                            <div class="image-item">
                                <div class="image-wrapper" style="background-image: url('${m}')"></div>
                            </div>
                        </div>`:``}
                    </div>

                    <div class="modal-content--bottom">
                        <h3>Details</h3>
                        <div class="details-grid">
                        ${Object.entries(l).map(([e,n])=>{if(this.excludedFields.includes(e)||typeof n!=`string`||!n||n===`False`||n===`[]`||n===`{}`)return``;let r=e.replace(/^x_/,``).replace(/_/g,` `),i=ve(n);return i===null?this.html`
                                <div class="detail-row">
                                    <span class="detail-label">${r}</span>
                                    <span class="detail-value">
                                        ${this.getHighlightedText(n,t.roots||[])}
                                    </span>
                                </div>
                            `:i.length===0?``:this.html`
                                    <div class="detail-row">
                                        <span class="detail-label">${r}</span>
                                        <span class="detail-value detail-tags">
                                            ${i.map(e=>this.html`
                                                <span class="detail-tag">${e}</span>
                                            `).join(``)}
                                        </span>
                                    </div>
                                `}).join(``)}
                        </div>
                    </div>
                </div>
            </div>
        `}listeners(){let e=this.$(`.modal-overlay`),t=this.$(`.close-btn`);e&&(e.onclick=t=>{t.target===e&&this.close()}),t&&(t.onclick=()=>this.close())}};window.customElements.define(`plain-detail-modal`,vt);var yt=`.plain-chat-window-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    border-radius: 16px;

    overflow: hidden;
}

.chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: #fafafa;
    position: relative;
}

.chat-window::before,
.chat-window::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 50px;
    pointer-events: none;
    z-index: 1;
}

.chat-window::before {
    top: 0;
    background: linear-gradient(to bottom, #fafafa 0%, transparent 100%);
}

.chat-window::after {
    bottom: 0;
    background: linear-gradient(to top, #fafafa 0%, transparent 100%);
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.chat-messages::-webkit-scrollbar {
    width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}

/* Empty State */
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
}

.empty-text-container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.empty-text {
    font-family: 'Geist Mono', monospace;
    font-size: 15px;
    font-weight: 400;
    color: #4a4a4a;
    letter-spacing: -0.01em;
}

.empty-hint {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 400;
    color: #9a9a9a;
    letter-spacing: -0.01em;
}

.flying-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    top: 50%;
    left: 50%;
    z-index: 1;
    animation: 
        fly-x 11s ease-in-out infinite,
        fly-y 7s ease-in-out infinite,
        fly-drift 13s ease-in-out infinite;
}

.flying-dot::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #7c3aed;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
}

.pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    transform: translate(-50%, -50%);
    border: 1.5px solid rgba(124, 58, 237, 0.6);
    border-radius: 50%;
    animation: pulse-out 2s ease-out infinite;
}

.pulse-ring-2 {
    animation-delay: 0.6s;
}

.pulse-ring-3 {
    animation-delay: 1.2s;
}

@keyframes pulse-out {
    0% {
        width: 6px;
        height: 6px;
        opacity: 0.8;
    }
    100% {
        width: 50px;
        height: 50px;
        opacity: 0;
    }
}

@keyframes fly-x {
    0%, 100% { transform: translateX(-170px); }
    50% { transform: translateX(170px); }
}

@keyframes fly-y {
    0%, 100% { margin-top: -70px; }
    25% { margin-top: 50px; }
    50% { margin-top: -60px; }
    75% { margin-top: 70px; }
}

@keyframes fly-drift {
    0%, 100% { margin-left: 0; }
    20% { margin-left: 30px; }
    40% { margin-left: -40px; }
    60% { margin-left: 35px; }
    80% { margin-left: -25px; }
}

/* Messages */
.message {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.message-author {
    font-family: 'Geist', sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #999;
}

.message.user {
    margin-left: auto;
    text-align: right;
}

.message.user .message-author {
    display: none;
    color: #666;
}

.message.ai .message-author {
    color: #7c3aed;
}

.message-text {
    font-family: 'Geist', sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.65;
    color: #1a1a1a;
    letter-spacing: -0.01em;
}

.message.user .message-text {
    padding: 6px 12px;
    box-sizing: border-box;

    color: #0a0a0a;

    background-color: rgb(230, 230, 230);
}

.message.ai .message-text {
    color: #2a2a2a;
}

.message-text code {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    color: #d14;
}

.message-text strong {
    font-weight: 600;
}

.message-text em {
    font-style: italic;
}

/* Markdown Formatting */
.message-text p {
    margin: 0 0 12px 0;
}

.message-text p:last-child {
    margin-bottom: 0;
}

.message-text h1,
.message-text h2,
.message-text h3,
.message-text h4,
.message-text h5,
.message-text h6 {
    font-family: 'Geist', sans-serif;
    font-weight: 600;
    margin: 16px 0 8px 0;
    line-height: 1.3;
    color: #1a1a1a;
}

.message-text h1:first-child,
.message-text h2:first-child,
.message-text h3:first-child {
    margin-top: 0;
}

.message-text h1 { font-size: 1.4em; }
.message-text h2 { font-size: 1.25em; }
.message-text h3 { font-size: 1.1em; }
.message-text h4 { font-size: 1em; }

.message-text ul,
.message-text ol {
    margin: 8px 0;
    padding-left: 24px;
}

.message-text li {
    margin: 4px 0;
    line-height: 1.5;
}

.message-text li::marker {
    color: #7c3aed;
}

.message-text pre {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 12px 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
}

.message-text pre code {
    background: transparent;
    padding: 0;
    color: inherit;
    font-size: inherit;
}

.message-text blockquote {
    border-left: 3px solid #7c3aed;
    margin: 12px 0;
    padding: 8px 16px;
    background: #f5f3ff;
    color: #4c1d95;
    font-style: italic;
}

.message-text blockquote p {
    margin: 0;
}

.message-text a {
    color: #7c3aed;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
}

.message-text a:hover {
    border-bottom-color: #7c3aed;
}

.message-text hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 16px 0;
}

.message-text table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 14px;
}

.message-text th,
.message-text td {
    border: 1px solid #e5e5e5;
    padding: 8px 12px;
    text-align: left;
}

.message-text th {
    background: #f5f5f5;
    font-weight: 600;
}

.message-text tr:nth-child(even) {
    background: #fafafa;
}

/* Typing Indicator */
.typing-indicator {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 0;
}

.typing-indicator span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7c3aed;
    opacity: 0.4;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
    animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        opacity: 0.4;
        transform: scale(1);
    }
    30% {
        opacity: 1;
        transform: scale(1.1);
    }
}

/* Streaming Animation */
.message.streaming .message-text::after {
    content: '│';
    font-weight: 300;
    color: #7c3aed;
    animation: cursor-blink 0.8s infinite;
    margin-left: 1px;
}

@keyframes cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

/* Fetching Label (inline with author name) */
.fetching-label {
    display: inline-block;
    margin-left: 8px;
    font-family: 'Geist', sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: #7c3aed;
    text-transform: none;
    letter-spacing: 0;
    animation: label-fade-in 0.3s ease-out forwards;
    white-space: nowrap;
}

.fetching-label.fade-out {
    animation: label-fade-out 1.5s ease-out forwards;
}

@keyframes label-fade-in {
    from {
        opacity: 0;
        transform: translateX(-4px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes label-fade-out {
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    70% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(4px);
    }
}`;function j(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var M=j();function bt(e){M=e}var N={exec:()=>null};function P(e,t=``){let n=typeof e==`string`?e:e.source,r={replace:(e,t)=>{let i=typeof t==`string`?t:t.source;return i=i.replace(F.caret,`$1`),n=n.replace(e,i),r},getRegex:()=>new RegExp(n,t)};return r}var xt=(()=>{try{return!0}catch{return!1}})(),F={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,`i`)},St=/^(?:[ \t]*(?:\n|$))+/,Ct=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,wt=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,I=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Tt=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,L=/(?:[*+-]|\d{1,9}[.)])/,Et=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Dt=P(Et).replace(/bull/g,L).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,``).getRegex(),Ot=P(Et).replace(/bull/g,L).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),R=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,kt=/^[^\n]+/,At=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,jt=P(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace(`label`,At).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Mt=P(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,L).getRegex(),z=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`,Nt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Pt=P(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,`i`).replace(`comment`,Nt).replace(`tag`,z).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Ft=P(R).replace(`hr`,I).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,z).getRegex(),It={blockquote:P(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,Ft).getRegex(),code:Ct,def:jt,fences:wt,heading:Tt,hr:I,html:Pt,lheading:Dt,list:Mt,newline:St,paragraph:Ft,table:N,text:kt},Lt=P(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,I).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,`(?: {4}| {0,3}	)[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,z).getRegex(),Rt={...It,lheading:Ot,table:Lt,paragraph:P(R).replace(`hr`,I).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,Lt).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,z).getRegex()},zt={...It,html:P(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,Nt).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:N,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:P(R).replace(`hr`,I).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,Dt).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()},Bt=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Vt=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ht=/^( {2,}|\\)\n(?!\s*$)/,Ut=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,B=/[\p{P}\p{S}]/u,Wt=/[\s\p{P}\p{S}]/u,Gt=/[^\s\p{P}\p{S}]/u,Kt=P(/^((?![*_])punctSpace)/,`u`).replace(/punctSpace/g,Wt).getRegex(),qt=/(?!~)[\p{P}\p{S}]/u,Jt=/(?!~)[\s\p{P}\p{S}]/u,Yt=/(?:[^\s\p{P}\p{S}]|~)/u,Xt=P(/link|precode-code|html/,`g`).replace(`link`,/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace(`precode-`,xt?"(?<!`)()":"(^^|[^`])").replace(`code`,/(?<b>`+)[^`]+\k<b>(?!`)/).replace(`html`,/<(?! )[^<>]*?>/).getRegex(),Zt=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Qt=P(Zt,`u`).replace(/punct/g,B).getRegex(),$t=P(Zt,`u`).replace(/punct/g,qt).getRegex(),en=`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`,tn=P(en,`gu`).replace(/notPunctSpace/g,Gt).replace(/punctSpace/g,Wt).replace(/punct/g,B).getRegex(),nn=P(en,`gu`).replace(/notPunctSpace/g,Yt).replace(/punctSpace/g,Jt).replace(/punct/g,qt).getRegex(),rn=P(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,`gu`).replace(/notPunctSpace/g,Gt).replace(/punctSpace/g,Wt).replace(/punct/g,B).getRegex(),an=P(/\\(punct)/,`gu`).replace(/punct/g,B).getRegex(),on=P(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),sn=P(Nt).replace(`(?:-->|$)`,`-->`).getRegex(),cn=P(`^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,sn).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),V=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,ln=P(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace(`label`,V).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),un=P(/^!?\[(label)\]\[(ref)\]/).replace(`label`,V).replace(`ref`,At).getRegex(),dn=P(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,At).getRegex(),fn=P(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,un).replace(`nolink`,dn).getRegex(),pn=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,mn={_backpedal:N,anyPunctuation:an,autolink:on,blockSkip:Xt,br:Ht,code:Vt,del:N,emStrongLDelim:Qt,emStrongRDelimAst:tn,emStrongRDelimUnd:rn,escape:Bt,link:ln,nolink:dn,punctuation:Kt,reflink:un,reflinkSearch:fn,tag:cn,text:Ut,url:N},hn={...mn,link:P(/^!?\[(label)\]\((.*?)\)/).replace(`label`,V).getRegex(),reflink:P(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,V).getRegex()},gn={...mn,emStrongRDelimAst:nn,emStrongLDelim:$t,url:P(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace(`protocol`,pn).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:P(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace(`protocol`,pn).getRegex()},_n={...gn,br:P(Ht).replace(`{2,}`,`*`).getRegex(),text:P(gn.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()},H={normal:It,gfm:Rt,pedantic:zt},U={normal:mn,gfm:gn,breaks:_n,pedantic:hn},vn={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},yn=e=>vn[e];function W(e,t){if(t){if(F.escapeTest.test(e))return e.replace(F.escapeReplace,yn)}else if(F.escapeTestNoEncode.test(e))return e.replace(F.escapeReplaceNoEncode,yn);return e}function bn(e){try{e=encodeURI(e).replace(F.percentDecode,`%`)}catch{return null}return e}function xn(e,t){let n=e.replace(F.findPipe,(e,t,n)=>{let r=!1,i=t;for(;--i>=0&&n[i]===`\\`;)r=!r;return r?`|`:` |`}).split(F.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push(``);for(;r<n.length;r++)n[r]=n[r].trim().replace(F.slashPipe,`|`);return n}function G(e,t,n){let r=e.length;if(r===0)return``;let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function Sn(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]===`\\`)r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function Cn(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,`$1`);r.state.inLink=!0;let c={type:e[0].charAt(0)===`!`?`image`:`link`,raw:n,href:a,title:o,text:s,tokens:r.inlineTokens(s)};return r.state.inLink=!1,c}function wn(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(e=>{let t=e.match(n.other.beginningSpace);if(t===null)return e;let[r]=t;return r.length>=i.length?e.slice(i.length):e}).join(`
`)}var K=class{options;rules;lexer;constructor(e){this.options=e||M}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=t[0].replace(this.rules.other.codeRemoveIndent,``);return{type:`code`,raw:t[0],codeBlockStyle:`indented`,text:this.options.pedantic?e:G(e,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],n=wn(e,t[3]||``,this.rules);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:n}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let t=G(e,`#`);(this.options.pedantic||!t||this.rules.other.endingSpaceChar.test(t))&&(e=t.trim())}return{type:`heading`,raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:`hr`,raw:G(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=G(t[0],`
`).split(`
`),n=``,r=``,i=[];for(;e.length>0;){let t=!1,a=[],o;for(o=0;o<e.length;o++)if(this.rules.other.blockquoteStart.test(e[o]))a.push(e[o]),t=!0;else if(!t)a.push(e[o]);else break;e=e.slice(o);let s=a.join(`
`),c=s.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,``);n=n?`${n}
${s}`:s,r=r?`${r}
${c}`:c;let l=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=l,e.length===0)break;let u=i.at(-1);if(u?.type===`code`)break;if(u?.type===`blockquote`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.blockquote(a);i[i.length-1]=o,n=n.substring(0,n.length-t.raw.length)+o.raw,r=r.substring(0,r.length-t.text.length)+o.text;break}else if(u?.type===`list`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.list(a);i[i.length-1]=o,n=n.substring(0,n.length-u.raw.length)+o.raw,r=r.substring(0,r.length-t.raw.length)+o.raw,e=a.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:`blockquote`,raw:n,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:`list`,raw:``,ordered:r,start:r?+n.slice(0,-1):``,loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:`[*+-]`);let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let n=!1,r=``,s=``;if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;r=t[0],e=e.substring(r.length);let c=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,e=>` `.repeat(3*e.length)),l=e.split(`
`,1)[0],u=!c.trim(),d=0;if(this.options.pedantic?(d=2,s=c.trimStart()):u?d=t[1].length+1:(d=t[2].search(this.rules.other.nonSpaceChar),d=d>4?1:d,s=c.slice(d),d+=t[1].length),u&&this.rules.other.blankLine.test(l)&&(r+=l+`
`,e=e.substring(l.length+1),n=!0),!n){let t=this.rules.other.nextBulletRegex(d),n=this.rules.other.hrRegex(d),i=this.rules.other.fencesBeginRegex(d),a=this.rules.other.headingBeginRegex(d),o=this.rules.other.htmlBeginRegex(d);for(;e;){let f=e.split(`
`,1)[0],p;if(l=f,this.options.pedantic?(l=l.replace(this.rules.other.listReplaceNesting,`  `),p=l):p=l.replace(this.rules.other.tabCharGlobal,`    `),i.test(l)||a.test(l)||o.test(l)||t.test(l)||n.test(l))break;if(p.search(this.rules.other.nonSpaceChar)>=d||!l.trim())s+=`
`+p.slice(d);else{if(u||c.replace(this.rules.other.tabCharGlobal,`    `).search(this.rules.other.nonSpaceChar)>=4||i.test(c)||a.test(c)||n.test(c))break;s+=`
`+l}!u&&!l.trim()&&(u=!0),r+=f+`
`,e=e.substring(f.length+1),c=p.slice(d)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(r)&&(o=!0)),i.items.push({type:`list_item`,raw:r,task:!!this.options.gfm&&this.rules.other.listIsTask.test(s),loose:!1,text:s,tokens:[]}),i.raw+=r}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let e of i.items){if(this.lexer.state.top=!1,e.tokens=this.lexer.blockTokens(e.text,[]),e.task){if(e.text=e.text.replace(this.rules.other.listReplaceTask,``),e.tokens[0]?.type===`text`||e.tokens[0]?.type===`paragraph`){e.tokens[0].raw=e.tokens[0].raw.replace(this.rules.other.listReplaceTask,``),e.tokens[0].text=e.tokens[0].text.replace(this.rules.other.listReplaceTask,``);for(let e=this.lexer.inlineQueue.length-1;e>=0;e--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)){this.lexer.inlineQueue[e].src=this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask,``);break}}let t=this.rules.other.listTaskCheckbox.exec(e.raw);if(t){let n={type:`checkbox`,raw:t[0]+` `,checked:t[0]!==`[ ]`};e.checked=n.checked,i.loose?e.tokens[0]&&[`paragraph`,`text`].includes(e.tokens[0].type)&&`tokens`in e.tokens[0]&&e.tokens[0].tokens?(e.tokens[0].raw=n.raw+e.tokens[0].raw,e.tokens[0].text=n.raw+e.tokens[0].text,e.tokens[0].tokens.unshift(n)):e.tokens.unshift({type:`paragraph`,raw:n.raw,text:n.raw,tokens:[n]}):e.tokens.unshift(n)}}if(!i.loose){let t=e.tokens.filter(e=>e.type===`space`);i.loose=t.length>0&&t.some(e=>this.rules.other.anyLine.test(e.raw))}}if(i.loose)for(let e of i.items){e.loose=!0;for(let t of e.tokens)t.type===`text`&&(t.type=`paragraph`)}return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:`html`,block:!0,raw:t[0],pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let e=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal,` `),n=t[2]?t[2].replace(this.rules.other.hrefBrackets,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:t[0],href:n,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=xn(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,``).split(`|`),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,``).split(`
`):[],a={type:`table`,raw:t[0],header:[],align:[],rows:[]};if(n.length===r.length){for(let e of r)this.rules.other.tableAlignRight.test(e)?a.align.push(`right`):this.rules.other.tableAlignCenter.test(e)?a.align.push(`center`):this.rules.other.tableAlignLeft.test(e)?a.align.push(`left`):a.align.push(null);for(let e=0;e<n.length;e++)a.header.push({text:n[e],tokens:this.lexer.inline(n[e]),header:!0,align:a.align[e]});for(let e of i)a.rows.push(xn(e,a.header.length).map((e,t)=>({text:e,tokens:this.lexer.inline(e),header:!1,align:a.align[t]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:`heading`,raw:t[0],depth:t[2].charAt(0)===`=`?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:`escape`,raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let e=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(e)){if(!this.rules.other.endAngleBracket.test(e))return;let t=G(e.slice(0,-1),`\\`);if((e.length-t.length)%2==0)return}else{let e=Sn(t[2],`()`);if(e===-2)return;if(e>-1){let n=(t[0].indexOf(`!`)===0?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=``}}let n=t[2],r=``;if(this.options.pedantic){let e=this.rules.other.pedanticHrefTitle.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):``;return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(n=this.options.pedantic&&!this.rules.other.endAngleBracket.test(e)?n.slice(1):n.slice(1,-1)),Cn(t,{href:n&&n.replace(this.rules.inline.anyPunctuation,`$1`),title:r&&r.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal,` `),r=t[e.toLowerCase()];if(!r){let e=n[0].charAt(0);return{type:`text`,raw:e,text:e}}return Cn(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=``){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=0,c=r[0][0]===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(r=c.exec(t))!=null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}else if((r[5]||r[6])&&n%3&&!((n+a)%3)){s+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+s);let t=[...r[0]][0].length,c=e.slice(0,n+r.index+t+a);if(Math.min(n,a)%2){let e=c.slice(1,-1);return{type:`em`,raw:c,text:e,tokens:this.lexer.inlineTokens(e)}}let l=c.slice(2,-2);return{type:`strong`,raw:c,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal,` `),n=this.rules.other.nonSpaceChar.test(e),r=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return n&&r&&(e=e.substring(1,e.length-1)),{type:`codespan`,raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:`br`,raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:`del`,raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,n;return t[2]===`@`?(e=t[1],n=`mailto:`+e):(e=t[1],n=e),{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if(t[2]===`@`)e=t[0],n=`mailto:`+e;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(r!==t[0]);e=t[0],n=t[1]===`www.`?`http://`+t[0]:t[0]}return{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e=this.lexer.state.inRawBlock;return{type:`text`,raw:t[0],text:t[0],escaped:e}}}},q=class e{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||M,this.options.tokenizer=this.options.tokenizer||new K,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:F,block:H.normal,inline:U.normal};this.options.pedantic?(t.block=H.pedantic,t.inline=U.pedantic):this.options.gfm&&(t.block=H.gfm,this.options.breaks?t.inline=U.breaks:t.inline=U.gfm),this.tokenizer.rules=t}static get rules(){return{block:H,inline:U}}static lex(t,n){return new e(n).lex(t)}static lexInline(t,n){return new e(n).inlineTokens(t)}lex(e){e=e.replace(F.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){for(this.options.pedantic&&(e=e.replace(F.tabCharGlobal,`    `).replace(F.spaceLine,``));e;){let r;if(this.options.extensions?.block?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let n=t.at(-1);r.raw.length===1&&n!==void 0?n.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.raw,this.inlineQueue.at(-1).src=n.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let t=1/0,n=e.slice(1),r;this.options.extensions.startBlock.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=t.at(-1);n&&a?.type===`paragraph`?(a.raw+=(a.raw.endsWith(`
`)?``:`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n=e,r=null;if(this.tokens.links){let e=Object.keys(this.tokens.links);if(e.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)e.includes(r[0].slice(r[0].lastIndexOf(`[`)+1,-1))&&(n=n.slice(0,r.index)+`[`+`a`.repeat(r[0].length-2)+`]`+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,r.index)+`++`+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+`[`+`a`.repeat(r[0].length-i-2)+`]`+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let a=!1,o=``;for(;e;){a||(o=``),a=!1;let r;if(this.options.extensions?.inline?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.escape(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.tag(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.link(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(r.raw.length);let n=t.at(-1);r.type===`text`&&n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(r=this.tokenizer.emStrong(e,n,o)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.codespan(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.br(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.del(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.autolink(e)){e=e.substring(r.raw.length),t.push(r);continue}if(!this.state.inLink&&(r=this.tokenizer.url(e))){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startInline){let t=1/0,n=e.slice(1),r;this.options.extensions.startInline.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(i)){e=e.substring(r.raw.length),r.raw.slice(-1)!==`_`&&(o=r.raw.slice(-1)),a=!0;let n=t.at(-1);n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return t}},J=class{options;parser;constructor(e){this.options=e||M}space(e){return``}code({text:e,lang:t,escaped:n}){let r=(t||``).match(F.notSpaceStart)?.[0],i=e.replace(F.endingNewline,``)+`
`;return r?`<pre><code class="language-`+W(r)+`">`+(n?i:W(i,!0))+`</code></pre>
`:`<pre><code>`+(n?i:W(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return``}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r=``;for(let t=0;t<e.items.length;t++){let n=e.items[t];r+=this.listitem(n)}let i=t?`ol`:`ul`,a=t&&n!==1?` start="`+n+`"`:``;return`<`+i+a+`>
`+r+`</`+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return`<input `+(e?`checked="" `:``)+`disabled="" type="checkbox"> `}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t=``,n=``;for(let t=0;t<e.header.length;t++)n+=this.tablecell(e.header[t]);t+=this.tablerow({text:n});let r=``;for(let t=0;t<e.rows.length;t++){let i=e.rows[t];n=``;for(let e=0;e<i.length;e++)n+=this.tablecell(i[e]);r+=this.tablerow({text:n})}return r&&=`<tbody>${r}</tbody>`,`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?`th`:`td`;return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${W(e,!0)}</code>`}br(e){return`<br>`}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=bn(e);if(i===null)return r;e=i;let a=`<a href="`+e+`"`;return t&&(a+=` title="`+W(t)+`"`),a+=`>`+r+`</a>`,a}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=bn(e);if(i===null)return W(n);e=i;let a=`<img src="${e}" alt="${n}"`;return t&&(a+=` title="${W(t)}"`),a+=`>`,a}text(e){return`tokens`in e&&e.tokens?this.parser.parseInline(e.tokens):`escaped`in e&&e.escaped?e.text:W(e.text)}},Y=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return``+e}image({text:e}){return``+e}br(){return``}checkbox({raw:e}){return e}},X=class e{options;renderer;textRenderer;constructor(e){this.options=e||M,this.options.renderer=this.options.renderer||new J,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Y}static parse(t,n){return new e(n).parse(t)}static parseInline(t,n){return new e(n).parseInline(t)}parse(e){let t=``;for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let e=r,n=this.options.extensions.renderers[e.type].call({parser:this},e);if(n!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`html`,`def`,`paragraph`,`text`].includes(e.type)){t+=n||``;continue}}let i=r;switch(i.type){case`space`:t+=this.renderer.space(i);break;case`hr`:t+=this.renderer.hr(i);break;case`heading`:t+=this.renderer.heading(i);break;case`code`:t+=this.renderer.code(i);break;case`table`:t+=this.renderer.table(i);break;case`blockquote`:t+=this.renderer.blockquote(i);break;case`list`:t+=this.renderer.list(i);break;case`checkbox`:t+=this.renderer.checkbox(i);break;case`html`:t+=this.renderer.html(i);break;case`def`:t+=this.renderer.def(i);break;case`paragraph`:t+=this.renderer.paragraph(i);break;case`text`:t+=this.renderer.text(i);break;default:{let e=`Token with "`+i.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return t}parseInline(e,t=this.renderer){let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let e=this.options.extensions.renderers[i.type].call({parser:this},i);if(e!==!1||![`escape`,`html`,`link`,`image`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(i.type)){n+=e||``;continue}}let a=i;switch(a.type){case`escape`:n+=t.text(a);break;case`html`:n+=t.html(a);break;case`link`:n+=t.link(a);break;case`image`:n+=t.image(a);break;case`checkbox`:n+=t.checkbox(a);break;case`strong`:n+=t.strong(a);break;case`em`:n+=t.em(a);break;case`codespan`:n+=t.codespan(a);break;case`br`:n+=t.br(a);break;case`del`:n+=t.del(a);break;case`text`:n+=t.text(a);break;default:{let e=`Token with "`+a.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}},Z=class{options;block;constructor(e){this.options=e||M}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`,`emStrongMask`]);static passThroughHooksRespectAsync=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?q.lex:q.lexInline}provideParser(){return this.block?X.parse:X.parseInline}},Q=new class{defaults=j();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=X;Renderer=J;TextRenderer=Y;Lexer=q;Tokenizer=K;Hooks=Z;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case`table`:{let e=r;for(let r of e.header)n=n.concat(this.walkTokens(r.tokens,t));for(let r of e.rows)for(let e of r)n=n.concat(this.walkTokens(e.tokens,t));break}case`list`:{let e=r;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=r;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(r=>{let i=e[r].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw Error(`extension name required`);if(`renderer`in e){let n=t.renderers[e.name];n?t.renderers[e.name]=function(...t){let r=e.renderer.apply(this,t);return r===!1&&(r=n.apply(this,t)),r}:t.renderers[e.name]=e.renderer}if(`tokenizer`in e){if(!e.level||e.level!==`block`&&e.level!==`inline`)throw Error(`extension level must be 'block' or 'inline'`);let n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level===`block`?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level===`inline`&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}`childTokens`in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),n.extensions=t),e.renderer){let t=this.defaults.renderer||new J(this.defaults);for(let n in e.renderer){if(!(n in t))throw Error(`renderer '${n}' does not exist`);if([`options`,`parser`].includes(n))continue;let r=n,i=e.renderer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n||``}}n.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new K(this.defaults);for(let n in e.tokenizer){if(!(n in t))throw Error(`tokenizer '${n}' does not exist`);if([`options`,`rules`,`lexer`].includes(n))continue;let r=n,i=e.tokenizer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new Z;for(let n in e.hooks){if(!(n in t))throw Error(`hook '${n}' does not exist`);if([`options`,`block`].includes(n))continue;let r=n,i=e.hooks[r],a=t[r];Z.passThroughHooks.has(n)?t[r]=e=>{if(this.defaults.async&&Z.passThroughHooksRespectAsync.has(n))return(async()=>{let n=await i.call(t,e);return a.call(t,n)})();let r=i.call(t,e);return a.call(t,r)}:t[r]=(...e)=>{if(this.defaults.async)return(async()=>{let n=await i.apply(t,e);return n===!1&&(n=await a.apply(t,e)),n})();let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,r=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(r.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return q.lex(e,t??this.defaults)}parser(e,t){return X.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(Error(`marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`));if(typeof t>`u`||t===null)return a(Error(`marked(): input parameter is undefined or null`));if(typeof t!=`string`)return a(Error(`marked(): input parameter is of type `+Object.prototype.toString.call(t)+`, string expected`));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let n=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer():e?q.lex:q.lexInline)(n,i),a=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(a,i.walkTokens));let o=await(i.hooks?await i.hooks.provideParser():e?X.parse:X.parseInline)(a,i);return i.hooks?await i.hooks.postprocess(o):o})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let n=(i.hooks?i.hooks.provideLexer():e?q.lex:q.lexInline)(t,i);i.hooks&&(n=i.hooks.processAllTokens(n)),i.walkTokens&&this.walkTokens(n,i.walkTokens);let r=(i.hooks?i.hooks.provideParser():e?X.parse:X.parseInline)(n,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(e){return a(e)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let e=`<p>An error occurred:</p><pre>`+W(n.message+``,!0)+`</pre>`;return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}};function $(e,t){return Q.parse(e,t)}$.options=$.setOptions=function(e){return Q.setOptions(e),$.defaults=Q.defaults,bt($.defaults),$},$.getDefaults=j,$.defaults=M,$.use=function(...e){return Q.use(...e),$.defaults=Q.defaults,bt($.defaults),$},$.walkTokens=function(e,t){return Q.walkTokens(e,t)},$.parseInline=Q.parseInline,$.Parser=X,$.parser=X.parse,$.Renderer=J,$.TextRenderer=Y,$.Lexer=q,$.lexer=q.lex,$.Tokenizer=K,$.Hooks=Z,$.parse=$,$.options,$.setOptions,$.use,$.walkTokens,$.parseInline,X.parse,q.lex;var Tn=class extends i{chatContext;resultContext;companyContext;isLoading=!1;streamingMessage=``;showFetchingLabel=!1;isFadingOut=!1;fadeOutTimer=null;constructor(){super(`plain-chat-window`,yt),this.chatContext=this.useContext(m.CHAT,!0),this.resultContext=this.useContext(m.RESULT,!0),this.companyContext=this.useContext(m.COMPANY)}template(){let e=this.chatContext.get(`history`)||[],t=this.resultContext.get(`data`)||[],n=this.companyContext.get(`name`)||`the Agora`,r=t.length>0;return this.html`
            <div class="chat-window">
                <div class="chat-messages">
                    ${e.length===0?this.html`
                            <div class="empty-state">
                                <div class="empty-text-container">
                                    <div class="flying-dot">
                                        <div class="pulse-ring"></div>
                                        <div class="pulse-ring pulse-ring-2"></div>
                                        <div class="pulse-ring pulse-ring-3"></div>
                                    </div>
                                    ${r?this.html`
                                            <span class="empty-text">Curious about these results?</span>
                                            <span class="empty-hint">Use @ to reference them</span>
                                        `:this.html`
                                            <span class="empty-text">Welcome to ${n}</span>
                                            <span class="empty-hint">How can I help you today?</span>
                                        `}
                                </div>
                            </div>
                        `:e.map(e=>this.html`
                            <div class="message ${e.author}">
                                <span class="message-author">${e.author===`user`?`You`:`Aida`}</span>
                                <div class="message-text">${this.formatMessage(e.content)}</div>
                            </div>
                        `).join(``)}
                    ${this.isLoading||this.streamingMessage?this.html`
                        <div class="message ai ${this.streamingMessage?`streaming`:`loading`}">
                            <span class="message-author">
                                Aida
                                ${this.showFetchingLabel?this.html`
                                    <span class="fetching-label ${this.isFadingOut?`fade-out`:``}">Fetching results...</span>
                                `:``}
                            </span>
                            <div class="message-text">
                                ${this.streamingMessage?this.formatMessage(this.streamingMessage):this.html`
                                        <span class="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </span>
                                    `}
                            </div>
                        </div>
                    `:``}
                </div>
            </div>
        `}handleUserMessage(){this.isLoading=!0,this.streamingMessage=``,this.showFetchingLabel=!1,this.isFadingOut=!1,this.fadeOutTimer&&=(clearTimeout(this.fadeOutTimer),null),this.render(),this.scrollToBottom()}handleMessageChunk(e){this.streamingMessage=e.fullMessage,e.fullMessage&&(this.isLoading=!1),this.updateStreamingBubble(e.fullMessage)}handleMessageComplete(){this.streamingMessage=``,this.isLoading=!1,this.render(),this.scrollToBottom()}handleFetchingResults(e){if(e&&!this.showFetchingLabel&&(this.showFetchingLabel=!0,this.isFadingOut=!1,this.fadeOutTimer&&=(clearTimeout(this.fadeOutTimer),null),this.render()),!e&&this.showFetchingLabel&&!this.isFadingOut){this.isFadingOut=!0;let e=this.$(`.fetching-label`);e&&e.classList.add(`fade-out`),this.fadeOutTimer=setTimeout(()=>{this.showFetchingLabel=!1,this.isFadingOut=!1,this.fadeOutTimer=null,this.render()},1500)}this.scrollToBottom()}formatMessage(e){return $.parse(e,{async:!1,breaks:!0})}updateStreamingBubble(e){let t=this.$(`.message.streaming .message-text`);t?(t.innerHTML=this.formatMessage(e),this.scrollToBottom()):(this.render(),this.scrollToBottom())}setLoading(e){this.isLoading=e,this.render(),e&&this.scrollToBottom()}scrollToBottom(){let e=this.$(`.chat-messages`);e&&(e.scrollTop=e.scrollHeight)}afterRender(){this.scrollToBottom()}};window.customElements.define(`plain-chat-window`,Tn);const En={REQUESTED:`requested`,DEVELOPMENT:`development`,ACTIVE:`active`,INACTIVE:`inactive`,ARCHIVED:`archived`};function Dn(e){return k({services:e},`model`).map(e=>e.model)}function On(e){return e.reduce((e,t)=>{let n=k(t.fields,`model`);return e[t.fields.name]={models:n.map(e=>e.model),description:t.fields.description},e},{})}function kn(e){return e.filter(e=>e.fields.stage===En.ACTIVE)}function An(e){return[...e].sort((e,t)=>e.fields.name.localeCompare(t.fields.name))}function jn(e,t){return[...e].sort((e,n)=>{let r=t.get(e.fields.name)??2**53-1,i=t.get(n.fields.name)??2**53-1;return r-i})}function Mn(e){return Object.entries(e).reduce((e,[t,n])=>{let r=(Array.isArray(n)?n:[n]).filter(e=>e?.fields?.stage===En.ACTIVE).flatMap(e=>k(e.fields,`model`).map(e=>e.model));return r.length>0&&(e[t]=[...new Set(r)]),e},{})}var Nn=class{deps;constructor(e){this.deps=e}async initializeAll(){if(this.initConfig(),this.deps.configContext.get(`IS_METAGORA`))this.initMetagoraCompanyContext(),await this.initMetagoraServiceContext(),await this.initAidaApiKeyForMetagora();else{let e=await this.initServiceContext();this.initCompanyContext(e),await this.initAidaApiKey()}this.initModalContext()}initConfig(){let e={APP_NAME:this.deps.getAttribute(`name`)??T.APP_NAME,VERSION:T.VERSION,API_HOST:this.deps.getAttribute(`host`)??window.location.origin??T.API_HOST,AI_HOST:this.deps.getAttribute(`ai_host`)??T.AI_HOST,TRANSLATION_HOST:this.deps.getAttribute(`translation_host`)??T.TRANSLATION_HOST,ENABLED_AI:this.deps.hasAttribute(`enabled_ai`)??T.ENABLED_AI,DEBUG_MODE:this.deps.hasAttribute(`debug_mode`)??T.DEBUG_MODE,IS_METAGORA:T.IS_METAGORA,MAX_HEIGHT:this.deps.getAttribute(`max_height`)??T.MAX_HEIGHT};this.deps.configContext.set(e)}async initServiceContext(){let e=await this.fetchServices(this.deps.configContext.get(`API_HOST`)),t=e.items[0],n=t.fields.sub_acceleration_services instanceof Array?[...t.fields.sub_acceleration_services]:[t.fields.sub_acceleration_services],r=new Map(e.order.map(e=>[e.name,e.sequence]));n=jn(n,r),n=kn(n);let i=Dn(n),a=On(n),o={services:n,models:i,modelsByService:a};return this.deps.serviceContext.set(o,!0),t}async initMetagoraServiceContext(){let e=await O.GET_ALL_AGORA_URLS(),t=[],n=await Promise.all(e.map(async e=>{try{let n=await this.fetchServices(e);n.total===0&&console.warn(`No services found for Agora at ${e}`);let r=n.items[0],i={host:e,name:r.fields.company.fields.name,primaryColor:r.fields.primary_color,secondaryColor:r.fields.secondary_color};return t.push(i),[e,r.fields.sub_acceleration_services]}catch(t){return console.error(`Error fetching services from ${e}:`,t),[e,{total:0,items:[],order:[]}]}})),r=Object.fromEntries(n);this.deps.metagoraContext.set({agoras:t},!0);let i=Object.values(r).flat();i=An(i),i=kn(i);let a=Dn(i),o=On(i),s=Mn(r);this.deps.serviceContext.set({services:i,models:a,modelsByAgora:s,modelsByService:o},!0)}initCompanyContext(e){let t={name:e.fields.name,primaryColor:e.fields.primary_color,secondaryColor:e.fields.secondary_color};this.deps.companyContext.set(t,!0)}initMetagoraCompanyContext(){this.deps.companyContext.set({name:`Metagora`,primaryColor:`#3a85fe`,secondaryColor:`#00AAFF`},!0)}initModalContext(){this.deps.modalContext.set({isOpen:!1,element:null})}async initAidaApiKey(){try{let e=this.deps.serviceContext.get(`models`)||[],t=await O.GET_AIDA_API_KEY(this.deps.configContext.get(`API_HOST`),e);if(!t?.token?.jwt_token){console.warn(`There was an error while retrieving the assistant API key.
Please, contact the administrator.`);return}localStorage.setItem(`aida_ak`,t.token.jwt_token)}catch(e){console.warn(`Error retrieving assistant API key: ${e}`)}}async initAidaApiKeyForMetagora(){try{let e=(this.deps.metagoraContext.get(`agoras`)||[]).map(e=>e.host),t=this.deps.serviceContext.get(`modelsByAgora`)||[],n=await O.GET_MULTIPLE_AIDA_API_KEYS(e,t);localStorage.setItem(`aida_multiple_ak`,JSON.stringify(n)||`{}`)}catch(e){console.warn(`Error retrieving Metagora API keys: ${e}`)}}async fetchServices(e){return await O.GET_AGORA_SERVICES(e)}},Pn=class{deps;callbacks;constructor(e,t){this.deps=e,this.callbacks=t}initializeLayout(){this.deps.resultContext.get(`data`)&&this.deps.resultContext.get(`data`).length>0?this.updateVisibility(this.deps.resultContext.get().data):this.deps.$(`.right-panel`)?.classList.add(`collapsed`);let e=this.deps.chatContext.get(`history`);if(e&&e.length>0){this.callbacks.setCurrentMode(`chat`),this.showChatWindow();let e=this.deps.$(`plain-agora-input`);e?.toggleMode&&e.toggleMode(`chat`,new Event(`init`))}}updateVisibility(e){let t=this.getLayoutElements();if(e===null){this.handleNoResults(t);return}e.length>0?this.handleHasResults(t):this.handleEmptyResults(t)}showChatWindow(){let e=this.deps.$(`plain-chat-window`),t=this.deps.$(`.content-left`),n=this.deps.$(`.content-right plain-carousel`),r=this.deps.$(`.left-panel--footer plain-carousel`),i=this.deps.$(`plain-greetings`),a=this.deps.$(`.main-panel--header`);e?.classList.add(`faded-in`),e?.classList.remove(`faded-out`),t?.classList.add(`has-content`),n?.classList.add(`faded-out`),n?.classList.remove(`faded-in`),r?.classList.add(`faded-in`),r?.classList.remove(`faded-out`),i?.classList.add(`faded-out`),setTimeout(()=>{i?.classList.contains(`faded-out`)&&(a?.classList.add(`collapsed`),i?.classList.add(`display-none`))},500)}resetToInitialState(){let e=this.deps.$(`.content-right plain-carousel`)||this.deps.$(`.content-right plain-metagora-carousel`),t=this.deps.$(`plain-artifact-display`),n=this.deps.$(`.left-panel--footer plain-carousel`),r=this.deps.$(`plain-greetings`),i=this.deps.$(`.main-panel--header`),a=this.deps.$(`plain-chat-window`),o=this.deps.$(`.content-left`),s=this.deps.$(`.content-right`),c=this.deps.$(`.right-panel`),l=(this.deps.resultContext.get(`data`)||[]).length>0;e?.classList.add(`faded-out`),e?.classList.remove(`faded-in`),n?.classList.add(`faded-in`),n?.classList.remove(`faded-out`),r?.classList.add(`faded-out`),setTimeout(()=>{r?.classList.contains(`faded-out`)&&(i?.classList.add(`collapsed`),r?.classList.add(`display-none`))},500),a?.classList.add(`faded-in`),a?.classList.remove(`faded-out`),o?.classList.add(`has-content`),l?(c?.classList.remove(`collapsed`),t?.classList.add(`faded-in`),t?.classList.remove(`faded-out`),s?.classList.add(`has-results`)):(c?.classList.add(`collapsed`),t?.classList.remove(`faded-in`),t?.classList.add(`faded-out`),s?.classList.remove(`has-results`))}handleModeSwitch(e){this.callbacks.setCurrentMode(e);let t=this.getLayoutElements(),n=(this.deps.resultContext.get(`data`)||[]).length>0;e===`search`?this.switchToSearchMode(t,n):this.switchToChatMode(t,n)}getLayoutElements(){return{centralCarousel:this.deps.$(`.content-right plain-carousel`)||this.deps.$(`.content-right plain-metagora-hero`),artifactDisplay:this.deps.$(`plain-artifact-display`),leftCarousel:this.deps.$(`.left-panel--footer plain-carousel`),greetings:this.deps.$(`plain-greetings`),mainHeader:this.deps.$(`.main-panel--header`),chatWindow:this.deps.$(`plain-chat-window`),contentLeft:this.deps.$(`.content-left`),contentRight:this.deps.$(`.content-right`),rightPanel:this.deps.$(`.right-panel`),rightHoverZone:this.deps.$(`.right-panel-hover-zone`)}}handleNoResults(e){let t=(this.deps.chatContext.get(`history`)||[]).length>0;e.rightPanel?.classList.add(`collapsed`),e.rightHoverZone?.classList.remove(`active`),t?(e.artifactDisplay?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-out`),e.contentRight?.classList.remove(`has-results`)):(setTimeout(()=>{e.centralCarousel?.classList.remove(`faded-out`),e.centralCarousel?.classList.add(`faded-in`)},200),e.artifactDisplay?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-out`),e.leftCarousel?.classList.remove(`faded-in`),e.leftCarousel?.classList.add(`faded-out`),e.greetings?.classList.remove(`faded-out`),e.greetings?.classList.add(`faded-in`),e.mainHeader?.classList.remove(`collapsed`),e.greetings?.classList.remove(`display-none`),e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`),e.contentRight?.classList.remove(`has-results`))}handleHasResults(e){e.rightPanel?.classList.remove(`collapsed`),e.centralCarousel?.classList.add(`faded-out`),e.centralCarousel?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-in`),e.artifactDisplay?.classList.remove(`faded-out`),e.leftCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-out`),e.greetings?.classList.add(`faded-out`),setTimeout(()=>{e.greetings?.classList.contains(`faded-out`)&&(e.mainHeader?.classList.add(`collapsed`),e.greetings?.classList.add(`display-none`))},500),this.callbacks.getCurrentMode()===`chat`?(e.chatWindow?.classList.add(`faded-in`),e.chatWindow?.classList.remove(`faded-out`),e.contentLeft?.classList.add(`has-content`),e.contentRight?.classList.add(`has-results`)):(e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`),e.contentRight?.classList.remove(`has-results`))}handleEmptyResults(e){e.rightPanel?.classList.add(`collapsed`),e.centralCarousel?.classList.add(`faded-out`),e.centralCarousel?.classList.remove(`faded-in`),e.artifactDisplay?.classList.add(`faded-in`),e.artifactDisplay?.classList.remove(`faded-out`),e.leftCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-out`),e.mainHeader?.classList.remove(`collapsed`),e.greetings?.classList.remove(`display-none`),requestAnimationFrame(()=>{e.greetings?.classList.remove(`faded-out`)}),this.callbacks.getCurrentMode()===`chat`?(e.chatWindow?.classList.add(`faded-in`),e.chatWindow?.classList.remove(`faded-out`),e.contentLeft?.classList.add(`has-content`)):(e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`)),e.contentRight?.classList.remove(`has-results`)}switchToSearchMode(e,t){e.chatWindow?.classList.remove(`faded-in`),e.chatWindow?.classList.add(`faded-out`),e.contentLeft?.classList.remove(`has-content`),t?(e.rightPanel?.classList.remove(`collapsed`),e.artifactDisplay?.classList.add(`faded-in`),e.artifactDisplay?.classList.remove(`faded-out`),e.contentRight?.classList.add(`has-results`)):(e.rightPanel?.classList.add(`collapsed`),e.centralCarousel?.classList.remove(`faded-out`),e.centralCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-in`),e.leftCarousel?.classList.add(`faded-out`),e.greetings?.classList.remove(`faded-out`),e.greetings?.classList.add(`faded-in`),e.mainHeader?.classList.remove(`collapsed`),e.greetings?.classList.remove(`display-none`))}switchToChatMode(e,t){e.chatWindow?.classList.add(`faded-in`),e.chatWindow?.classList.remove(`faded-out`),e.contentLeft?.classList.add(`has-content`),e.centralCarousel?.classList.add(`faded-out`),e.centralCarousel?.classList.remove(`faded-in`),e.leftCarousel?.classList.add(`faded-in`),e.leftCarousel?.classList.remove(`faded-out`),e.greetings?.classList.add(`faded-out`),setTimeout(()=>{e.greetings?.classList.contains(`faded-out`)&&(e.mainHeader?.classList.add(`collapsed`),e.greetings?.classList.add(`display-none`))},500),t?(e.rightPanel?.classList.remove(`collapsed`),e.contentRight?.classList.add(`has-results`)):(e.rightPanel?.classList.add(`collapsed`),e.contentRight?.classList.remove(`has-results`))}},Fn=class{deps;state;constructor(e){this.deps=e,this.state={isNavCollapsed:!1,isRightPanelCollapsed:!1}}getState(){return{...this.state}}setupEventListeners(){this.setupNavCollapseButton(),this.setupNavHoverZone(),this.setupRightPanelCollapseButton(),this.setupRightPanelHoverZone()}toggleNavCollapse(){let e=this.deps.$(`.left-panel`),t=this.deps.$(`.nav-hover-zone`),n=this.deps.$(`.nav-collapse-btn`),r=e?.classList.contains(`nav-hover-expanded`);this.state.isNavCollapsed=!this.state.isNavCollapsed,e&&(r&&!this.state.isNavCollapsed?(e.classList.add(`no-transition`),e.classList.remove(`nav-hover-expanded`),e.classList.remove(`nav-collapsed`),requestAnimationFrame(()=>{e.classList.remove(`no-transition`)})):(e.classList.toggle(`nav-collapsed`,this.state.isNavCollapsed),e.classList.remove(`nav-hover-expanded`))),t&&t.classList.toggle(`active`,this.state.isNavCollapsed),n&&(n.innerHTML=this.state.isNavCollapsed?ue:le)}toggleRightPanelCollapse(){let e=this.deps.$(`.right-panel`),t=this.deps.$(`.right-panel-hover-zone`),n=this.deps.$(`.right-panel-collapse-btn`),r=e?.classList.contains(`panel-hover-expanded`);this.state.isRightPanelCollapsed=!this.state.isRightPanelCollapsed,e&&(r&&!this.state.isRightPanelCollapsed?(e.classList.add(`no-transition`),e.classList.remove(`panel-hover-expanded`),e.classList.remove(`panel-collapsed`),requestAnimationFrame(()=>{e.classList.remove(`no-transition`)})):(e.classList.toggle(`panel-collapsed`,this.state.isRightPanelCollapsed),e.classList.remove(`panel-hover-expanded`))),t&&t.classList.toggle(`active`,this.state.isRightPanelCollapsed),n&&(n.innerHTML=this.state.isRightPanelCollapsed?le:ue)}setupNavCollapseButton(){let e=this.deps.$(`.nav-collapse-btn`);e&&e.addEventListener(`click`,()=>this.toggleNavCollapse())}setupNavHoverZone(){let e=this.deps.$(`.nav-hover-zone`),t=this.deps.$(`.left-panel`);e&&t&&(e.addEventListener(`mouseenter`,()=>{this.state.isNavCollapsed&&(t.classList.remove(`nav-collapsed`),t.classList.add(`nav-hover-expanded`))}),t.addEventListener(`mouseleave`,()=>{this.state.isNavCollapsed&&(t.classList.add(`nav-collapsing`),t.classList.remove(`nav-hover-expanded`),setTimeout(()=>{this.state.isNavCollapsed&&!t.classList.contains(`nav-hover-expanded`)&&(t.classList.remove(`nav-collapsing`),t.classList.add(`nav-collapsed`))},300))}))}setupRightPanelCollapseButton(){let e=this.deps.$(`.right-panel-collapse-btn`);e&&e.addEventListener(`click`,()=>this.toggleRightPanelCollapse())}setupRightPanelHoverZone(){let e=this.deps.$(`.right-panel-hover-zone`),t=this.deps.$(`.right-panel`);e&&t&&(e.addEventListener(`mouseenter`,()=>{let e=(this.deps.resultContext.get(`data`)||[]).length>0;this.state.isRightPanelCollapsed&&e&&(t.classList.remove(`panel-collapsed`),t.classList.add(`panel-hover-expanded`))}),t.addEventListener(`mouseleave`,()=>{this.state.isRightPanelCollapsed&&(t.classList.add(`panel-collapsing`),t.classList.remove(`panel-hover-expanded`),setTimeout(()=>{this.state.isRightPanelCollapsed&&!t.classList.contains(`panel-hover-expanded`)&&(t.classList.remove(`panel-collapsing`),t.classList.add(`panel-collapsed`))},300))}))}},In=class extends i{companyContext;configContext;serviceContext;resultContext;modalContext;chatContext;metagoraContext;contextHandler;layoutHandler;panelHandler;currentMode=`search`;constructor(){super(`agora-app`,[a,o,s,c,l,u,d,f].join(`
`)),this.companyContext=this.useContext(m.COMPANY),this.configContext=this.useContext(m.CONFIG),this.serviceContext=this.useContext(m.SERVICE),this.resultContext=this.useContext(m.RESULT),this.modalContext=this.useContext(m.MODAL),this.chatContext=this.useContext(m.CHAT),this.metagoraContext=this.useContext(m.METAGORA),this.signals=this.useSignals(),this.initializeHandlers(),this.init()}template(){return this.html`
            ${!this.serviceContext.get(`services`)||this.serviceContext.get(`services`).length===0?this.html`<!-- <plain-intro-animation></plain-intro-animation> -->`:``}
            <div class="nav-hover-zone"></div>
            <aside class="left-panel">
                <header class="left-panel--header">
                    <button class="nav-collapse-btn" title="Toggle sidebar">
                        ${le}
                    </button>
                    <plain-logo></plain-logo>
                </header>
                <nav class="left-panel--nav">
                    ${this.configContext.get(`IS_METAGORA`)?this.html`<plain-metagora-nav-menu></plain-metagora-nav-menu>`:this.html`<plain-nav-menu></plain-nav-menu>`}
                </nav>
                <footer class="left-panel--footer">
                    <plain-carousel
                        variant="small"
                        class="faded-out"
                    ></plain-carousel>
                </footer>
            </aside>

            <main class="main-panel">
                <header class="main-panel--header" style="${this.configContext.get(`IS_METAGORA`)?`display: none !important;`:``}">
                    <plain-greetings></plain-greetings>
                </header>
                <section class="main-panel--content">
                    <div class="content-split">
                        <div class="content-left">
                            <plain-chat-window class="faded-out"></plain-chat-window>
                        </div>
                        <div class="content-right">
                            ${this.configContext.get(`IS_METAGORA`)?this.html`<plain-metagora-hero class="faded-in"></plain-metagora-hero>`:this.html`<plain-carousel class="faded-in"></plain-carousel>`}
                            <plain-artifact-display class="faded-out"></plain-artifact-display>
                        </div>
                    </div>
                </section>
                <footer class="main-panel--footer">
                    <plain-agora-input></plain-agora-input>
                </footer>
            </main>

            <aside class="right-panel collapsed">
                <header class="right-panel--header">
                    <button class="right-panel-collapse-btn" title="Toggle filter panel">
                        ${ue}
                    </button>
                </header>
                <div class="right-panel--content">
                    <plain-filter-widget></plain-filter-widget>
                </div>
            </aside>
            <div class="right-panel-hover-zone"></div>
            <plain-detail-modal></plain-detail-modal>
            <toast-container></toast-container>
        `}initializeHandlers(){this.contextHandler=new Nn({configContext:this.configContext,companyContext:this.companyContext,serviceContext:this.serviceContext,modalContext:this.modalContext,metagoraContext:this.metagoraContext,getAttribute:e=>this.getAttribute(e),hasAttribute:e=>this.hasAttribute(e)}),this.layoutHandler=new Pn({resultContext:this.resultContext,chatContext:this.chatContext,$:e=>this.$(e)},{getCurrentMode:()=>this.currentMode,setCurrentMode:e=>{this.currentMode=e}}),this.panelHandler=new Fn({resultContext:this.resultContext,$:e=>this.$(e)})}async init(){await this.contextHandler.initializeAll()}afterRender(){let e=this.configContext.get(`MAX_HEIGHT`);if(e){let t=this.shadowRoot?.querySelector(`.agora-app-wrapper`);t&&(t.style.maxHeight=e)}}connectors(){this.setupSignalConnections(),this.panelHandler.setupEventListeners(),this.layoutHandler.initializeLayout()}setupSignalConnections(){let e=this.$(`plain-agora-input`),t=this.$(`plain-chat-window`);e&&(this.signals.connect(e,w.RESULTS_FETCHED,e=>this.layoutHandler.updateVisibility(e)),this.signals.connect(e,w.RESULTS_CLEARED,()=>this.layoutHandler.updateVisibility(null))),t&&(this.signals.connect(e,w.CHAT_USER_MESSAGE,()=>{t.handleUserMessage()}),this.signals.connect(e,w.CHAT_MESSAGE_CHUNK,e=>{t.handleMessageChunk(e)}),this.signals.connect(e,w.CHAT_MESSAGE_COMPLETE,()=>{t.handleMessageComplete()}),this.signals.connect(e,w.CHAT_FETCHING_RESULTS,e=>{t.handleFetchingResults(e)}),this.signals.connect(e,w.CHAT_STARTED,()=>{this.layoutHandler.showChatWindow()}),this.signals.connect(e,w.NEW_CHAT,()=>{this.layoutHandler.resetToInitialState(),t.render()}),this.signals.connect(e,w.MODE_SWITCH,e=>{this.layoutHandler.handleModeSwitch(e)}))}};window.customElements.define(`agora-app`,In);