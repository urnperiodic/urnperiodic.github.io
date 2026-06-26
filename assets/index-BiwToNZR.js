import{getApps as $f,initializeApp as Jg}from"https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";import{getDatabase as _g,ref as Zg,query as Xg,limitToLast as Wg,onChildAdded as Ig,push as Fg}from"https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";(function(){const z=document.createElement("link").relList;if(z&&z.supports&&z.supports("modulepreload"))return;for(const C of document.querySelectorAll('link[rel="modulepreload"]'))f(C);new MutationObserver(C=>{for(const q of C)if(q.type==="childList")for(const H of q.addedNodes)H.tagName==="LINK"&&H.rel==="modulepreload"&&f(H)}).observe(document,{childList:!0,subtree:!0});function T(C){const q={};return C.integrity&&(q.integrity=C.integrity),C.referrerPolicy&&(q.referrerPolicy=C.referrerPolicy),C.crossOrigin==="use-credentials"?q.credentials="include":C.crossOrigin==="anonymous"?q.credentials="omit":q.credentials="same-origin",q}function f(C){if(C.ep)return;C.ep=!0;const q=T(C);fetch(C.href,q)}})();var Ks={exports:{}},ei={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eh;function Pg(){if(eh)return ei;eh=1;var h=Symbol.for("react.transitional.element"),z=Symbol.for("react.fragment");function T(f,C,q){var H=null;if(q!==void 0&&(H=""+q),C.key!==void 0&&(H=""+C.key),"key"in C){q={};for(var I in C)I!=="key"&&(q[I]=C[I])}else q=C;return C=q.ref,{$$typeof:h,type:f,key:H,ref:C!==void 0?C:null,props:q}}return ei.Fragment=z,ei.jsx=T,ei.jsxs=T,ei}var th;function $g(){return th||(th=1,Ks.exports=Pg()),Ks.exports}var r=$g(),Vs={exports:{}},re={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ah;function ep(){if(ah)return re;ah=1;var h=Symbol.for("react.transitional.element"),z=Symbol.for("react.portal"),T=Symbol.for("react.fragment"),f=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),q=Symbol.for("react.consumer"),H=Symbol.for("react.context"),I=Symbol.for("react.forward_ref"),E=Symbol.for("react.suspense"),A=Symbol.for("react.memo"),K=Symbol.for("react.lazy"),D=Symbol.for("react.activity"),P=Symbol.iterator;function ne(u){return u===null||typeof u!="object"?null:(u=P&&u[P]||u["@@iterator"],typeof u=="function"?u:null)}var He={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ae=Object.assign,Ce={};function $(u,y,R){this.props=u,this.context=y,this.refs=Ce,this.updater=R||He}$.prototype.isReactComponent={},$.prototype.setState=function(u,y){if(typeof u!="object"&&typeof u!="function"&&u!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,u,y,"setState")},$.prototype.forceUpdate=function(u){this.updater.enqueueForceUpdate(this,u,"forceUpdate")};function oe(){}oe.prototype=$.prototype;function Ne(u,y,R){this.props=u,this.context=y,this.refs=Ce,this.updater=R||He}var ze=Ne.prototype=new oe;ze.constructor=Ne,Ae(ze,$.prototype),ze.isPureReactComponent=!0;var ee=Array.isArray;function we(){}var G={H:null,A:null,T:null,S:null},Ye=Object.prototype.hasOwnProperty;function $e(u,y,R){var Q=R.ref;return{$$typeof:h,type:u,key:y,ref:Q!==void 0?Q:null,props:R}}function pt(u,y){return $e(u.type,y,u.props)}function We(u){return typeof u=="object"&&u!==null&&u.$$typeof===h}function qe(u){var y={"=":"=0",":":"=2"};return"$"+u.replace(/[=:]/g,function(R){return y[R]})}var Je=/\/+/g;function Ie(u,y){return typeof u=="object"&&u!==null&&u.key!=null?qe(""+u.key):y.toString(36)}function it(u){switch(u.status){case"fulfilled":return u.value;case"rejected":throw u.reason;default:switch(typeof u.status=="string"?u.then(we,we):(u.status="pending",u.then(function(y){u.status==="pending"&&(u.status="fulfilled",u.value=y)},function(y){u.status==="pending"&&(u.status="rejected",u.reason=y)})),u.status){case"fulfilled":return u.value;case"rejected":throw u.reason}}throw u}function w(u,y,R,Q,F){var te=typeof u;(te==="undefined"||te==="boolean")&&(u=null);var ie=!1;if(u===null)ie=!0;else switch(te){case"bigint":case"string":case"number":ie=!0;break;case"object":switch(u.$$typeof){case h:case z:ie=!0;break;case K:return ie=u._init,w(ie(u._payload),y,R,Q,F)}}if(ie)return F=F(u),ie=Q===""?"."+Ie(u,0):Q,ee(F)?(R="",ie!=null&&(R=ie.replace(Je,"$&/")+"/"),w(F,y,R,"",function(Te){return Te})):F!=null&&(We(F)&&(F=pt(F,R+(F.key==null||u&&u.key===F.key?"":(""+F.key).replace(Je,"$&/")+"/")+ie)),y.push(F)),1;ie=0;var L=Q===""?".":Q+":";if(ee(u))for(var le=0;le<u.length;le++)Q=u[le],te=L+Ie(Q,le),ie+=w(Q,y,R,te,F);else if(le=ne(u),typeof le=="function")for(u=le.call(u),le=0;!(Q=u.next()).done;)Q=Q.value,te=L+Ie(Q,le++),ie+=w(Q,y,R,te,F);else if(te==="object"){if(typeof u.then=="function")return w(it(u),y,R,Q,F);throw y=String(u),Error("Objects are not valid as a React child (found: "+(y==="[object Object]"?"object with keys {"+Object.keys(u).join(", ")+"}":y)+"). If you meant to render a collection of children, use an array instead.")}return ie}function O(u,y,R){if(u==null)return u;var Q=[],F=0;return w(u,Q,"","",function(te){return y.call(R,te,F++)}),Q}function Y(u){if(u._status===-1){var y=u._result;y=y(),y.then(function(R){(u._status===0||u._status===-1)&&(u._status=1,u._result=R)},function(R){(u._status===0||u._status===-1)&&(u._status=2,u._result=R)}),u._status===-1&&(u._status=0,u._result=y)}if(u._status===1)return u._result.default;throw u._result}var me=typeof reportError=="function"?reportError:function(u){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var y=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof u=="object"&&u!==null&&typeof u.message=="string"?String(u.message):String(u),error:u});if(!window.dispatchEvent(y))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",u);return}console.error(u)},ge={map:O,forEach:function(u,y,R){O(u,function(){y.apply(this,arguments)},R)},count:function(u){var y=0;return O(u,function(){y++}),y},toArray:function(u){return O(u,function(y){return y})||[]},only:function(u){if(!We(u))throw Error("React.Children.only expected to receive a single React element child.");return u}};return re.Activity=D,re.Children=ge,re.Component=$,re.Fragment=T,re.Profiler=C,re.PureComponent=Ne,re.StrictMode=f,re.Suspense=E,re.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=G,re.__COMPILER_RUNTIME={__proto__:null,c:function(u){return G.H.useMemoCache(u)}},re.cache=function(u){return function(){return u.apply(null,arguments)}},re.cacheSignal=function(){return null},re.cloneElement=function(u,y,R){if(u==null)throw Error("The argument must be a React element, but you passed "+u+".");var Q=Ae({},u.props),F=u.key;if(y!=null)for(te in y.key!==void 0&&(F=""+y.key),y)!Ye.call(y,te)||te==="key"||te==="__self"||te==="__source"||te==="ref"&&y.ref===void 0||(Q[te]=y[te]);var te=arguments.length-2;if(te===1)Q.children=R;else if(1<te){for(var ie=Array(te),L=0;L<te;L++)ie[L]=arguments[L+2];Q.children=ie}return $e(u.type,F,Q)},re.createContext=function(u){return u={$$typeof:H,_currentValue:u,_currentValue2:u,_threadCount:0,Provider:null,Consumer:null},u.Provider=u,u.Consumer={$$typeof:q,_context:u},u},re.createElement=function(u,y,R){var Q,F={},te=null;if(y!=null)for(Q in y.key!==void 0&&(te=""+y.key),y)Ye.call(y,Q)&&Q!=="key"&&Q!=="__self"&&Q!=="__source"&&(F[Q]=y[Q]);var ie=arguments.length-2;if(ie===1)F.children=R;else if(1<ie){for(var L=Array(ie),le=0;le<ie;le++)L[le]=arguments[le+2];F.children=L}if(u&&u.defaultProps)for(Q in ie=u.defaultProps,ie)F[Q]===void 0&&(F[Q]=ie[Q]);return $e(u,te,F)},re.createRef=function(){return{current:null}},re.forwardRef=function(u){return{$$typeof:I,render:u}},re.isValidElement=We,re.lazy=function(u){return{$$typeof:K,_payload:{_status:-1,_result:u},_init:Y}},re.memo=function(u,y){return{$$typeof:A,type:u,compare:y===void 0?null:y}},re.startTransition=function(u){var y=G.T,R={};G.T=R;try{var Q=u(),F=G.S;F!==null&&F(R,Q),typeof Q=="object"&&Q!==null&&typeof Q.then=="function"&&Q.then(we,me)}catch(te){me(te)}finally{y!==null&&R.types!==null&&(y.types=R.types),G.T=y}},re.unstable_useCacheRefresh=function(){return G.H.useCacheRefresh()},re.use=function(u){return G.H.use(u)},re.useActionState=function(u,y,R){return G.H.useActionState(u,y,R)},re.useCallback=function(u,y){return G.H.useCallback(u,y)},re.useContext=function(u){return G.H.useContext(u)},re.useDebugValue=function(){},re.useDeferredValue=function(u,y){return G.H.useDeferredValue(u,y)},re.useEffect=function(u,y){return G.H.useEffect(u,y)},re.useEffectEvent=function(u){return G.H.useEffectEvent(u)},re.useId=function(){return G.H.useId()},re.useImperativeHandle=function(u,y,R){return G.H.useImperativeHandle(u,y,R)},re.useInsertionEffect=function(u,y){return G.H.useInsertionEffect(u,y)},re.useLayoutEffect=function(u,y){return G.H.useLayoutEffect(u,y)},re.useMemo=function(u,y){return G.H.useMemo(u,y)},re.useOptimistic=function(u,y){return G.H.useOptimistic(u,y)},re.useReducer=function(u,y,R){return G.H.useReducer(u,y,R)},re.useRef=function(u){return G.H.useRef(u)},re.useState=function(u){return G.H.useState(u)},re.useSyncExternalStore=function(u,y,R){return G.H.useSyncExternalStore(u,y,R)},re.useTransition=function(){return G.H.useTransition()},re.version="19.2.6",re}var lh;function ac(){return lh||(lh=1,Vs.exports=ep()),Vs.exports}var U=ac(),Ys={exports:{}},ti={},Js={exports:{}},_s={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nh;function tp(){return nh||(nh=1,(function(h){function z(w,O){var Y=w.length;w.push(O);e:for(;0<Y;){var me=Y-1>>>1,ge=w[me];if(0<C(ge,O))w[me]=O,w[Y]=ge,Y=me;else break e}}function T(w){return w.length===0?null:w[0]}function f(w){if(w.length===0)return null;var O=w[0],Y=w.pop();if(Y!==O){w[0]=Y;e:for(var me=0,ge=w.length,u=ge>>>1;me<u;){var y=2*(me+1)-1,R=w[y],Q=y+1,F=w[Q];if(0>C(R,Y))Q<ge&&0>C(F,R)?(w[me]=F,w[Q]=Y,me=Q):(w[me]=R,w[y]=Y,me=y);else if(Q<ge&&0>C(F,Y))w[me]=F,w[Q]=Y,me=Q;else break e}}return O}function C(w,O){var Y=w.sortIndex-O.sortIndex;return Y!==0?Y:w.id-O.id}if(h.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var q=performance;h.unstable_now=function(){return q.now()}}else{var H=Date,I=H.now();h.unstable_now=function(){return H.now()-I}}var E=[],A=[],K=1,D=null,P=3,ne=!1,He=!1,Ae=!1,Ce=!1,$=typeof setTimeout=="function"?setTimeout:null,oe=typeof clearTimeout=="function"?clearTimeout:null,Ne=typeof setImmediate<"u"?setImmediate:null;function ze(w){for(var O=T(A);O!==null;){if(O.callback===null)f(A);else if(O.startTime<=w)f(A),O.sortIndex=O.expirationTime,z(E,O);else break;O=T(A)}}function ee(w){if(Ae=!1,ze(w),!He)if(T(E)!==null)He=!0,we||(we=!0,qe());else{var O=T(A);O!==null&&it(ee,O.startTime-w)}}var we=!1,G=-1,Ye=5,$e=-1;function pt(){return Ce?!0:!(h.unstable_now()-$e<Ye)}function We(){if(Ce=!1,we){var w=h.unstable_now();$e=w;var O=!0;try{e:{He=!1,Ae&&(Ae=!1,oe(G),G=-1),ne=!0;var Y=P;try{t:{for(ze(w),D=T(E);D!==null&&!(D.expirationTime>w&&pt());){var me=D.callback;if(typeof me=="function"){D.callback=null,P=D.priorityLevel;var ge=me(D.expirationTime<=w);if(w=h.unstable_now(),typeof ge=="function"){D.callback=ge,ze(w),O=!0;break t}D===T(E)&&f(E),ze(w)}else f(E);D=T(E)}if(D!==null)O=!0;else{var u=T(A);u!==null&&it(ee,u.startTime-w),O=!1}}break e}finally{D=null,P=Y,ne=!1}O=void 0}}finally{O?qe():we=!1}}}var qe;if(typeof Ne=="function")qe=function(){Ne(We)};else if(typeof MessageChannel<"u"){var Je=new MessageChannel,Ie=Je.port2;Je.port1.onmessage=We,qe=function(){Ie.postMessage(null)}}else qe=function(){$(We,0)};function it(w,O){G=$(function(){w(h.unstable_now())},O)}h.unstable_IdlePriority=5,h.unstable_ImmediatePriority=1,h.unstable_LowPriority=4,h.unstable_NormalPriority=3,h.unstable_Profiling=null,h.unstable_UserBlockingPriority=2,h.unstable_cancelCallback=function(w){w.callback=null},h.unstable_forceFrameRate=function(w){0>w||125<w?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Ye=0<w?Math.floor(1e3/w):5},h.unstable_getCurrentPriorityLevel=function(){return P},h.unstable_next=function(w){switch(P){case 1:case 2:case 3:var O=3;break;default:O=P}var Y=P;P=O;try{return w()}finally{P=Y}},h.unstable_requestPaint=function(){Ce=!0},h.unstable_runWithPriority=function(w,O){switch(w){case 1:case 2:case 3:case 4:case 5:break;default:w=3}var Y=P;P=w;try{return O()}finally{P=Y}},h.unstable_scheduleCallback=function(w,O,Y){var me=h.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?me+Y:me):Y=me,w){case 1:var ge=-1;break;case 2:ge=250;break;case 5:ge=1073741823;break;case 4:ge=1e4;break;default:ge=5e3}return ge=Y+ge,w={id:K++,callback:O,priorityLevel:w,startTime:Y,expirationTime:ge,sortIndex:-1},Y>me?(w.sortIndex=Y,z(A,w),T(E)===null&&w===T(A)&&(Ae?(oe(G),G=-1):Ae=!0,it(ee,Y-me))):(w.sortIndex=ge,z(E,w),He||ne||(He=!0,we||(we=!0,qe()))),w},h.unstable_shouldYield=pt,h.unstable_wrapCallback=function(w){var O=P;return function(){var Y=P;P=O;try{return w.apply(this,arguments)}finally{P=Y}}}})(_s)),_s}var ih;function ap(){return ih||(ih=1,Js.exports=tp()),Js.exports}var Zs={exports:{}},yt={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rh;function lp(){if(rh)return yt;rh=1;var h=ac();function z(E){var A="https://react.dev/errors/"+E;if(1<arguments.length){A+="?args[]="+encodeURIComponent(arguments[1]);for(var K=2;K<arguments.length;K++)A+="&args[]="+encodeURIComponent(arguments[K])}return"Minified React error #"+E+"; visit "+A+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function T(){}var f={d:{f:T,r:function(){throw Error(z(522))},D:T,C:T,L:T,m:T,X:T,S:T,M:T},p:0,findDOMNode:null},C=Symbol.for("react.portal");function q(E,A,K){var D=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:C,key:D==null?null:""+D,children:E,containerInfo:A,implementation:K}}var H=h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function I(E,A){if(E==="font")return"";if(typeof A=="string")return A==="use-credentials"?A:""}return yt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=f,yt.createPortal=function(E,A){var K=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!A||A.nodeType!==1&&A.nodeType!==9&&A.nodeType!==11)throw Error(z(299));return q(E,A,null,K)},yt.flushSync=function(E){var A=H.T,K=f.p;try{if(H.T=null,f.p=2,E)return E()}finally{H.T=A,f.p=K,f.d.f()}},yt.preconnect=function(E,A){typeof E=="string"&&(A?(A=A.crossOrigin,A=typeof A=="string"?A==="use-credentials"?A:"":void 0):A=null,f.d.C(E,A))},yt.prefetchDNS=function(E){typeof E=="string"&&f.d.D(E)},yt.preinit=function(E,A){if(typeof E=="string"&&A&&typeof A.as=="string"){var K=A.as,D=I(K,A.crossOrigin),P=typeof A.integrity=="string"?A.integrity:void 0,ne=typeof A.fetchPriority=="string"?A.fetchPriority:void 0;K==="style"?f.d.S(E,typeof A.precedence=="string"?A.precedence:void 0,{crossOrigin:D,integrity:P,fetchPriority:ne}):K==="script"&&f.d.X(E,{crossOrigin:D,integrity:P,fetchPriority:ne,nonce:typeof A.nonce=="string"?A.nonce:void 0})}},yt.preinitModule=function(E,A){if(typeof E=="string")if(typeof A=="object"&&A!==null){if(A.as==null||A.as==="script"){var K=I(A.as,A.crossOrigin);f.d.M(E,{crossOrigin:K,integrity:typeof A.integrity=="string"?A.integrity:void 0,nonce:typeof A.nonce=="string"?A.nonce:void 0})}}else A==null&&f.d.M(E)},yt.preload=function(E,A){if(typeof E=="string"&&typeof A=="object"&&A!==null&&typeof A.as=="string"){var K=A.as,D=I(K,A.crossOrigin);f.d.L(E,K,{crossOrigin:D,integrity:typeof A.integrity=="string"?A.integrity:void 0,nonce:typeof A.nonce=="string"?A.nonce:void 0,type:typeof A.type=="string"?A.type:void 0,fetchPriority:typeof A.fetchPriority=="string"?A.fetchPriority:void 0,referrerPolicy:typeof A.referrerPolicy=="string"?A.referrerPolicy:void 0,imageSrcSet:typeof A.imageSrcSet=="string"?A.imageSrcSet:void 0,imageSizes:typeof A.imageSizes=="string"?A.imageSizes:void 0,media:typeof A.media=="string"?A.media:void 0})}},yt.preloadModule=function(E,A){if(typeof E=="string")if(A){var K=I(A.as,A.crossOrigin);f.d.m(E,{as:typeof A.as=="string"&&A.as!=="script"?A.as:void 0,crossOrigin:K,integrity:typeof A.integrity=="string"?A.integrity:void 0})}else f.d.m(E)},yt.requestFormReset=function(E){f.d.r(E)},yt.unstable_batchedUpdates=function(E,A){return E(A)},yt.useFormState=function(E,A,K){return H.H.useFormState(E,A,K)},yt.useFormStatus=function(){return H.H.useHostTransitionStatus()},yt.version="19.2.6",yt}var oh;function np(){if(oh)return Zs.exports;oh=1;function h(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(h)}catch(z){console.error(z)}}return h(),Zs.exports=lp(),Zs.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sh;function ip(){if(sh)return ti;sh=1;var h=ap(),z=ac(),T=np();function f(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function C(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function q(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function H(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function I(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function E(e){if(q(e)!==e)throw Error(f(188))}function A(e){var t=e.alternate;if(!t){if(t=q(e),t===null)throw Error(f(188));return t!==e?null:e}for(var a=e,l=t;;){var n=a.return;if(n===null)break;var i=n.alternate;if(i===null){if(l=n.return,l!==null){a=l;continue}break}if(n.child===i.child){for(i=n.child;i;){if(i===a)return E(n),e;if(i===l)return E(n),t;i=i.sibling}throw Error(f(188))}if(a.return!==l.return)a=n,l=i;else{for(var o=!1,s=n.child;s;){if(s===a){o=!0,a=n,l=i;break}if(s===l){o=!0,l=n,a=i;break}s=s.sibling}if(!o){for(s=i.child;s;){if(s===a){o=!0,a=i,l=n;break}if(s===l){o=!0,l=i,a=n;break}s=s.sibling}if(!o)throw Error(f(189))}}if(a.alternate!==l)throw Error(f(190))}if(a.tag!==3)throw Error(f(188));return a.stateNode.current===a?e:t}function K(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=K(e),t!==null)return t;e=e.sibling}return null}var D=Object.assign,P=Symbol.for("react.element"),ne=Symbol.for("react.transitional.element"),He=Symbol.for("react.portal"),Ae=Symbol.for("react.fragment"),Ce=Symbol.for("react.strict_mode"),$=Symbol.for("react.profiler"),oe=Symbol.for("react.consumer"),Ne=Symbol.for("react.context"),ze=Symbol.for("react.forward_ref"),ee=Symbol.for("react.suspense"),we=Symbol.for("react.suspense_list"),G=Symbol.for("react.memo"),Ye=Symbol.for("react.lazy"),$e=Symbol.for("react.activity"),pt=Symbol.for("react.memo_cache_sentinel"),We=Symbol.iterator;function qe(e){return e===null||typeof e!="object"?null:(e=We&&e[We]||e["@@iterator"],typeof e=="function"?e:null)}var Je=Symbol.for("react.client.reference");function Ie(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Je?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Ae:return"Fragment";case $:return"Profiler";case Ce:return"StrictMode";case ee:return"Suspense";case we:return"SuspenseList";case $e:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case He:return"Portal";case Ne:return e.displayName||"Context";case oe:return(e._context.displayName||"Context")+".Consumer";case ze:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case G:return t=e.displayName||null,t!==null?t:Ie(e.type)||"Memo";case Ye:t=e._payload,e=e._init;try{return Ie(e(t))}catch{}}return null}var it=Array.isArray,w=z.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,O=T.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Y={pending:!1,data:null,method:null,action:null},me=[],ge=-1;function u(e){return{current:e}}function y(e){0>ge||(e.current=me[ge],me[ge]=null,ge--)}function R(e,t){ge++,me[ge]=e.current,e.current=t}var Q=u(null),F=u(null),te=u(null),ie=u(null);function L(e,t){switch(R(te,t),R(F,e),R(Q,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Sf(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Sf(t),e=jf(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}y(Q),R(Q,e)}function le(){y(Q),y(F),y(te)}function Te(e){e.memoizedState!==null&&R(ie,e);var t=Q.current,a=jf(t,e.type);t!==a&&(R(F,e),R(Q,a))}function B(e){F.current===e&&(y(Q),y(F)),ie.current===e&&(y(ie),In._currentValue=Y)}var Ge,rt;function _(e){if(Ge===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);Ge=t&&t[1]||"",rt=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ge+e+rt}var St=!1;function Lt(e,t){if(!e||St)return"";St=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var N=function(){throw Error()};if(Object.defineProperty(N.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(N,[])}catch(v){var b=v}Reflect.construct(e,[],N)}else{try{N.call()}catch(v){b=v}e.call(N.prototype)}}else{try{throw Error()}catch(v){b=v}(N=e())&&typeof N.catch=="function"&&N.catch(function(){})}}catch(v){if(v&&b&&typeof v.stack=="string")return[v.stack,b.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var n=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");n&&n.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var i=l.DetermineComponentFrameRoot(),o=i[0],s=i[1];if(o&&s){var c=o.split(`
`),p=s.split(`
`);for(n=l=0;l<c.length&&!c[l].includes("DetermineComponentFrameRoot");)l++;for(;n<p.length&&!p[n].includes("DetermineComponentFrameRoot");)n++;if(l===c.length||n===p.length)for(l=c.length-1,n=p.length-1;1<=l&&0<=n&&c[l]!==p[n];)n--;for(;1<=l&&0<=n;l--,n--)if(c[l]!==p[n]){if(l!==1||n!==1)do if(l--,n--,0>n||c[l]!==p[n]){var j=`
`+c[l].replace(" at new "," at ");return e.displayName&&j.includes("<anonymous>")&&(j=j.replace("<anonymous>",e.displayName)),j}while(1<=l&&0<=n);break}}}finally{St=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?_(a):""}function kr(e,t){switch(e.tag){case 26:case 27:case 5:return _(e.type);case 16:return _("Lazy");case 13:return e.child!==t&&t!==null?_("Suspense Fallback"):_("Suspense");case 19:return _("SuspenseList");case 0:case 15:return Lt(e.type,!1);case 11:return Lt(e.type.render,!1);case 1:return Lt(e.type,!0);case 31:return _("Activity");default:return""}}function on(e){try{var t="",a=null;do t+=kr(e,a),a=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Pa=Object.prototype.hasOwnProperty,$a=h.unstable_scheduleCallback,sn=h.unstable_cancelCallback,Nr=h.unstable_shouldYield,Tr=h.unstable_requestPaint,vt=h.unstable_now,cn=h.unstable_getCurrentPriorityLevel,S=h.unstable_ImmediatePriority,M=h.unstable_UserBlockingPriority,Z=h.unstable_NormalPriority,x=h.unstable_LowPriority,fe=h.unstable_IdlePriority,he=h.log,ce=h.unstable_setDisableYieldValue,ot=null,Ue=null;function xt(e){if(typeof he=="function"&&ce(e),Ue&&typeof Ue.setStrictMode=="function")try{Ue.setStrictMode(ot,e)}catch{}}var Le=Math.clz32?Math.clz32:bt,ae=Math.log,_e=Math.LN2;function bt(e){return e>>>=0,e===0?32:31-(ae(e)/_e|0)|0}var Ft=256,ut=262144,Bt=4194304;function Pt(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function aa(e,t,a){var l=e.pendingLanes;if(l===0)return 0;var n=0,i=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=l&134217727;return s!==0?(l=s&~i,l!==0?n=Pt(l):(o&=s,o!==0?n=Pt(o):a||(a=s&~e,a!==0&&(n=Pt(a))))):(s=l&~i,s!==0?n=Pt(s):o!==0?n=Pt(o):a||(a=l&~e,a!==0&&(n=Pt(a)))),n===0?0:t!==0&&t!==n&&(t&i)===0&&(i=n&-n,a=t&-t,i>=a||i===32&&(a&4194048)!==0)?t:n}function sa(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Cr(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function li(){var e=Bt;return Bt<<=1,(Bt&62914560)===0&&(Bt=4194304),e}function Er(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function un(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Rh(e,t,a,l,n,i){var o=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,p=e.hiddenUpdates;for(a=o&~a;0<a;){var j=31-Le(a),N=1<<j;s[j]=0,c[j]=-1;var b=p[j];if(b!==null)for(p[j]=null,j=0;j<b.length;j++){var v=b[j];v!==null&&(v.lane&=-536870913)}a&=~N}l!==0&&lc(e,l,0),i!==0&&n===0&&e.tag!==0&&(e.suspendedLanes|=i&~(o&~t))}function lc(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-Le(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|a&261930}function nc(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var l=31-Le(a),n=1<<l;n&t|e[l]&t&&(e[l]|=t),a&=~n}}function ic(e,t){var a=t&-t;return a=(a&42)!==0?1:Mr(a),(a&(e.suspendedLanes|t))!==0?0:a}function Mr(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function zr(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function rc(){var e=O.p;return e!==0?e:(e=window.event,e===void 0?32:_f(e.type))}function oc(e,t){var a=O.p;try{return O.p=e,t()}finally{O.p=a}}var Ta=Math.random().toString(36).slice(2),dt="__reactFiber$"+Ta,jt="__reactProps$"+Ta,vl="__reactContainer$"+Ta,Dr="__reactEvents$"+Ta,Oh="__reactListeners$"+Ta,qh="__reactHandles$"+Ta,sc="__reactResources$"+Ta,dn="__reactMarker$"+Ta;function Rr(e){delete e[dt],delete e[jt],delete e[Dr],delete e[Oh],delete e[qh]}function xl(e){var t=e[dt];if(t)return t;for(var a=e.parentNode;a;){if(t=a[vl]||a[dt]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=Mf(e);e!==null;){if(a=e[dt])return a;e=Mf(e)}return t}e=a,a=e.parentNode}return null}function wl(e){if(e=e[dt]||e[vl]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function fn(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(f(33))}function Sl(e){var t=e[sc];return t||(t=e[sc]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function st(e){e[dn]=!0}var cc=new Set,uc={};function el(e,t){jl(e,t),jl(e+"Capture",t)}function jl(e,t){for(uc[e]=t,e=0;e<t.length;e++)cc.add(t[e])}var Uh=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),dc={},fc={};function Lh(e){return Pa.call(fc,e)?!0:Pa.call(dc,e)?!1:Uh.test(e)?fc[e]=!0:(dc[e]=!0,!1)}function ni(e,t,a){if(Lh(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function ii(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function ca(e,t,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+l)}}function Gt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function hc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Bh(e,t,a){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var n=l.get,i=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return n.call(this)},set:function(o){a=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(o){a=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Or(e){if(!e._valueTracker){var t=hc(e)?"checked":"value";e._valueTracker=Bh(e,t,""+e[t])}}function mc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),l="";return e&&(l=hc(e)?e.checked?"true":"false":e.value),e=l,e!==a?(t.setValue(e),!0):!1}function ri(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Gh=/[\n"\\]/g;function Ht(e){return e.replace(Gh,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function qr(e,t,a,l,n,i,o,s){e.name="",o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.type=o:e.removeAttribute("type"),t!=null?o==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Gt(t)):e.value!==""+Gt(t)&&(e.value=""+Gt(t)):o!=="submit"&&o!=="reset"||e.removeAttribute("value"),t!=null?Ur(e,o,Gt(t)):a!=null?Ur(e,o,Gt(a)):l!=null&&e.removeAttribute("value"),n==null&&i!=null&&(e.defaultChecked=!!i),n!=null&&(e.checked=n&&typeof n!="function"&&typeof n!="symbol"),s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?e.name=""+Gt(s):e.removeAttribute("name")}function gc(e,t,a,l,n,i,o,s){if(i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"&&(e.type=i),t!=null||a!=null){if(!(i!=="submit"&&i!=="reset"||t!=null)){Or(e);return}a=a!=null?""+Gt(a):"",t=t!=null?""+Gt(t):a,s||t===e.value||(e.value=t),e.defaultValue=t}l=l??n,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=s?e.checked:!!l,e.defaultChecked=!!l,o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"&&(e.name=o),Or(e)}function Ur(e,t,a){t==="number"&&ri(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function Al(e,t,a,l){if(e=e.options,t){t={};for(var n=0;n<a.length;n++)t["$"+a[n]]=!0;for(a=0;a<e.length;a++)n=t.hasOwnProperty("$"+e[a].value),e[a].selected!==n&&(e[a].selected=n),n&&l&&(e[a].defaultSelected=!0)}else{for(a=""+Gt(a),t=null,n=0;n<e.length;n++){if(e[n].value===a){e[n].selected=!0,l&&(e[n].defaultSelected=!0);return}t!==null||e[n].disabled||(t=e[n])}t!==null&&(t.selected=!0)}}function pc(e,t,a){if(t!=null&&(t=""+Gt(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+Gt(a):""}function bc(e,t,a,l){if(t==null){if(l!=null){if(a!=null)throw Error(f(92));if(it(l)){if(1<l.length)throw Error(f(93));l=l[0]}a=l}a==null&&(a=""),t=a}a=Gt(t),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l),Or(e)}function kl(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var Hh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function yc(e,t,a){var l=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,a):typeof a!="number"||a===0||Hh.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function vc(e,t,a){if(t!=null&&typeof t!="object")throw Error(f(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var n in t)l=t[n],t.hasOwnProperty(n)&&a[n]!==l&&yc(e,n,l)}else for(var i in t)t.hasOwnProperty(i)&&yc(e,i,t[i])}function Lr(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Qh=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Kh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function oi(e){return Kh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ua(){}var Br=null;function Gr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Nl=null,Tl=null;function xc(e){var t=wl(e);if(t&&(e=t.stateNode)){var a=e[jt]||null;e:switch(e=t.stateNode,t.type){case"input":if(qr(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Ht(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var l=a[t];if(l!==e&&l.form===e.form){var n=l[jt]||null;if(!n)throw Error(f(90));qr(l,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name)}}for(t=0;t<a.length;t++)l=a[t],l.form===e.form&&mc(l)}break e;case"textarea":pc(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&Al(e,!!a.multiple,t,!1)}}}var Hr=!1;function wc(e,t,a){if(Hr)return e(t,a);Hr=!0;try{var l=e(t);return l}finally{if(Hr=!1,(Nl!==null||Tl!==null)&&(Xi(),Nl&&(t=Nl,e=Tl,Tl=Nl=null,xc(t),e)))for(t=0;t<e.length;t++)xc(e[t])}}function hn(e,t){var a=e.stateNode;if(a===null)return null;var l=a[jt]||null;if(l===null)return null;a=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(f(231,t,typeof a));return a}var da=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Qr=!1;if(da)try{var mn={};Object.defineProperty(mn,"passive",{get:function(){Qr=!0}}),window.addEventListener("test",mn,mn),window.removeEventListener("test",mn,mn)}catch{Qr=!1}var Ca=null,Kr=null,si=null;function Sc(){if(si)return si;var e,t=Kr,a=t.length,l,n="value"in Ca?Ca.value:Ca.textContent,i=n.length;for(e=0;e<a&&t[e]===n[e];e++);var o=a-e;for(l=1;l<=o&&t[a-l]===n[i-l];l++);return si=n.slice(e,1<l?1-l:void 0)}function ci(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ui(){return!0}function jc(){return!1}function At(e){function t(a,l,n,i,o){this._reactName=a,this._targetInst=n,this.type=l,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(a=e[s],this[s]=a?a(i):i[s]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?ui:jc,this.isPropagationStopped=jc,this}return D(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=ui)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=ui)},persist:function(){},isPersistent:ui}),t}var tl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},di=At(tl),gn=D({},tl,{view:0,detail:0}),Vh=At(gn),Vr,Yr,pn,fi=D({},gn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_r,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==pn&&(pn&&e.type==="mousemove"?(Vr=e.screenX-pn.screenX,Yr=e.screenY-pn.screenY):Yr=Vr=0,pn=e),Vr)},movementY:function(e){return"movementY"in e?e.movementY:Yr}}),Ac=At(fi),Yh=D({},fi,{dataTransfer:0}),Jh=At(Yh),_h=D({},gn,{relatedTarget:0}),Jr=At(_h),Zh=D({},tl,{animationName:0,elapsedTime:0,pseudoElement:0}),Xh=At(Zh),Wh=D({},tl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Ih=At(Wh),Fh=D({},tl,{data:0}),kc=At(Fh),Ph={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$h={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},em={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function tm(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=em[e])?!!t[e]:!1}function _r(){return tm}var am=D({},gn,{key:function(e){if(e.key){var t=Ph[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ci(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?$h[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_r,charCode:function(e){return e.type==="keypress"?ci(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ci(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),lm=At(am),nm=D({},fi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Nc=At(nm),im=D({},gn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_r}),rm=At(im),om=D({},tl,{propertyName:0,elapsedTime:0,pseudoElement:0}),sm=At(om),cm=D({},fi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),um=At(cm),dm=D({},tl,{newState:0,oldState:0}),fm=At(dm),hm=[9,13,27,32],Zr=da&&"CompositionEvent"in window,bn=null;da&&"documentMode"in document&&(bn=document.documentMode);var mm=da&&"TextEvent"in window&&!bn,Tc=da&&(!Zr||bn&&8<bn&&11>=bn),Cc=" ",Ec=!1;function Mc(e,t){switch(e){case"keyup":return hm.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function zc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Cl=!1;function gm(e,t){switch(e){case"compositionend":return zc(t);case"keypress":return t.which!==32?null:(Ec=!0,Cc);case"textInput":return e=t.data,e===Cc&&Ec?null:e;default:return null}}function pm(e,t){if(Cl)return e==="compositionend"||!Zr&&Mc(e,t)?(e=Sc(),si=Kr=Ca=null,Cl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Tc&&t.locale!=="ko"?null:t.data;default:return null}}var bm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Dc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!bm[e.type]:t==="textarea"}function Rc(e,t,a,l){Nl?Tl?Tl.push(l):Tl=[l]:Nl=l,t=tr(t,"onChange"),0<t.length&&(a=new di("onChange","change",null,a,l),e.push({event:a,listeners:t}))}var yn=null,vn=null;function ym(e){pf(e,0)}function hi(e){var t=fn(e);if(mc(t))return e}function Oc(e,t){if(e==="change")return t}var qc=!1;if(da){var Xr;if(da){var Wr="oninput"in document;if(!Wr){var Uc=document.createElement("div");Uc.setAttribute("oninput","return;"),Wr=typeof Uc.oninput=="function"}Xr=Wr}else Xr=!1;qc=Xr&&(!document.documentMode||9<document.documentMode)}function Lc(){yn&&(yn.detachEvent("onpropertychange",Bc),vn=yn=null)}function Bc(e){if(e.propertyName==="value"&&hi(vn)){var t=[];Rc(t,vn,e,Gr(e)),wc(ym,t)}}function vm(e,t,a){e==="focusin"?(Lc(),yn=t,vn=a,yn.attachEvent("onpropertychange",Bc)):e==="focusout"&&Lc()}function xm(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return hi(vn)}function wm(e,t){if(e==="click")return hi(t)}function Sm(e,t){if(e==="input"||e==="change")return hi(t)}function jm(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Mt=typeof Object.is=="function"?Object.is:jm;function xn(e,t){if(Mt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),l=Object.keys(t);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var n=a[l];if(!Pa.call(t,n)||!Mt(e[n],t[n]))return!1}return!0}function Gc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Hc(e,t){var a=Gc(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=t&&l>=t)return{node:a,offset:t-e};e=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Gc(a)}}function Qc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Qc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Kc(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ri(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=ri(e.document)}return t}function Ir(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Am=da&&"documentMode"in document&&11>=document.documentMode,El=null,Fr=null,wn=null,Pr=!1;function Vc(e,t,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Pr||El==null||El!==ri(l)||(l=El,"selectionStart"in l&&Ir(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),wn&&xn(wn,l)||(wn=l,l=tr(Fr,"onSelect"),0<l.length&&(t=new di("onSelect","select",null,t,a),e.push({event:t,listeners:l}),t.target=El)))}function al(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var Ml={animationend:al("Animation","AnimationEnd"),animationiteration:al("Animation","AnimationIteration"),animationstart:al("Animation","AnimationStart"),transitionrun:al("Transition","TransitionRun"),transitionstart:al("Transition","TransitionStart"),transitioncancel:al("Transition","TransitionCancel"),transitionend:al("Transition","TransitionEnd")},$r={},Yc={};da&&(Yc=document.createElement("div").style,"AnimationEvent"in window||(delete Ml.animationend.animation,delete Ml.animationiteration.animation,delete Ml.animationstart.animation),"TransitionEvent"in window||delete Ml.transitionend.transition);function ll(e){if($r[e])return $r[e];if(!Ml[e])return e;var t=Ml[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in Yc)return $r[e]=t[a];return e}var Jc=ll("animationend"),_c=ll("animationiteration"),Zc=ll("animationstart"),km=ll("transitionrun"),Nm=ll("transitionstart"),Tm=ll("transitioncancel"),Xc=ll("transitionend"),Wc=new Map,eo="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");eo.push("scrollEnd");function $t(e,t){Wc.set(e,t),el(t,[e])}var mi=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Qt=[],zl=0,to=0;function gi(){for(var e=zl,t=to=zl=0;t<e;){var a=Qt[t];Qt[t++]=null;var l=Qt[t];Qt[t++]=null;var n=Qt[t];Qt[t++]=null;var i=Qt[t];if(Qt[t++]=null,l!==null&&n!==null){var o=l.pending;o===null?n.next=n:(n.next=o.next,o.next=n),l.pending=n}i!==0&&Ic(a,n,i)}}function pi(e,t,a,l){Qt[zl++]=e,Qt[zl++]=t,Qt[zl++]=a,Qt[zl++]=l,to|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function ao(e,t,a,l){return pi(e,t,a,l),bi(e)}function nl(e,t){return pi(e,null,null,t),bi(e)}function Ic(e,t,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var n=!1,i=e.return;i!==null;)i.childLanes|=a,l=i.alternate,l!==null&&(l.childLanes|=a),i.tag===22&&(e=i.stateNode,e===null||e._visibility&1||(n=!0)),e=i,i=i.return;return e.tag===3?(i=e.stateNode,n&&t!==null&&(n=31-Le(a),e=i.hiddenUpdates,l=e[n],l===null?e[n]=[t]:l.push(t),t.lane=a|536870912),i):null}function bi(e){if(50<Vn)throw Vn=0,fs=null,Error(f(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Dl={};function Cm(e,t,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function zt(e,t,a,l){return new Cm(e,t,a,l)}function lo(e){return e=e.prototype,!(!e||!e.isReactComponent)}function fa(e,t){var a=e.alternate;return a===null?(a=zt(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Fc(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function yi(e,t,a,l,n,i){var o=0;if(l=e,typeof e=="function")lo(e)&&(o=1);else if(typeof e=="string")o=Rg(e,a,Q.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case $e:return e=zt(31,a,t,n),e.elementType=$e,e.lanes=i,e;case Ae:return il(a.children,n,i,t);case Ce:o=8,n|=24;break;case $:return e=zt(12,a,t,n|2),e.elementType=$,e.lanes=i,e;case ee:return e=zt(13,a,t,n),e.elementType=ee,e.lanes=i,e;case we:return e=zt(19,a,t,n),e.elementType=we,e.lanes=i,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Ne:o=10;break e;case oe:o=9;break e;case ze:o=11;break e;case G:o=14;break e;case Ye:o=16,l=null;break e}o=29,a=Error(f(130,e===null?"null":typeof e,"")),l=null}return t=zt(o,a,t,n),t.elementType=e,t.type=l,t.lanes=i,t}function il(e,t,a,l){return e=zt(7,e,l,t),e.lanes=a,e}function no(e,t,a){return e=zt(6,e,null,t),e.lanes=a,e}function Pc(e){var t=zt(18,null,null,0);return t.stateNode=e,t}function io(e,t,a){return t=zt(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var $c=new WeakMap;function Kt(e,t){if(typeof e=="object"&&e!==null){var a=$c.get(e);return a!==void 0?a:(t={value:e,source:t,stack:on(t)},$c.set(e,t),t)}return{value:e,source:t,stack:on(t)}}var Rl=[],Ol=0,vi=null,Sn=0,Vt=[],Yt=0,Ea=null,la=1,na="";function ha(e,t){Rl[Ol++]=Sn,Rl[Ol++]=vi,vi=e,Sn=t}function eu(e,t,a){Vt[Yt++]=la,Vt[Yt++]=na,Vt[Yt++]=Ea,Ea=e;var l=la;e=na;var n=32-Le(l)-1;l&=~(1<<n),a+=1;var i=32-Le(t)+n;if(30<i){var o=n-n%5;i=(l&(1<<o)-1).toString(32),l>>=o,n-=o,la=1<<32-Le(t)+n|a<<n|l,na=i+e}else la=1<<i|a<<n|l,na=e}function ro(e){e.return!==null&&(ha(e,1),eu(e,1,0))}function oo(e){for(;e===vi;)vi=Rl[--Ol],Rl[Ol]=null,Sn=Rl[--Ol],Rl[Ol]=null;for(;e===Ea;)Ea=Vt[--Yt],Vt[Yt]=null,na=Vt[--Yt],Vt[Yt]=null,la=Vt[--Yt],Vt[Yt]=null}function tu(e,t){Vt[Yt++]=la,Vt[Yt++]=na,Vt[Yt++]=Ea,la=t.id,na=t.overflow,Ea=e}var ft=null,Qe=null,xe=!1,Ma=null,Jt=!1,so=Error(f(519));function za(e){var t=Error(f(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw jn(Kt(t,e)),so}function au(e){var t=e.stateNode,a=e.type,l=e.memoizedProps;switch(t[dt]=e,t[jt]=l,a){case"dialog":be("cancel",t),be("close",t);break;case"iframe":case"object":case"embed":be("load",t);break;case"video":case"audio":for(a=0;a<Jn.length;a++)be(Jn[a],t);break;case"source":be("error",t);break;case"img":case"image":case"link":be("error",t),be("load",t);break;case"details":be("toggle",t);break;case"input":be("invalid",t),gc(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":be("invalid",t);break;case"textarea":be("invalid",t),bc(t,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||l.suppressHydrationWarning===!0||xf(t.textContent,a)?(l.popover!=null&&(be("beforetoggle",t),be("toggle",t)),l.onScroll!=null&&be("scroll",t),l.onScrollEnd!=null&&be("scrollend",t),l.onClick!=null&&(t.onclick=ua),t=!0):t=!1,t||za(e,!0)}function lu(e){for(ft=e.return;ft;)switch(ft.tag){case 5:case 31:case 13:Jt=!1;return;case 27:case 3:Jt=!0;return;default:ft=ft.return}}function ql(e){if(e!==ft)return!1;if(!xe)return lu(e),xe=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||Ts(e.type,e.memoizedProps)),a=!a),a&&Qe&&za(e),lu(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(f(317));Qe=Ef(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(f(317));Qe=Ef(e)}else t===27?(t=Qe,Ja(e.type)?(e=Ds,Ds=null,Qe=e):Qe=t):Qe=ft?Zt(e.stateNode.nextSibling):null;return!0}function rl(){Qe=ft=null,xe=!1}function co(){var e=Ma;return e!==null&&(Ct===null?Ct=e:Ct.push.apply(Ct,e),Ma=null),e}function jn(e){Ma===null?Ma=[e]:Ma.push(e)}var uo=u(null),ol=null,ma=null;function Da(e,t,a){R(uo,t._currentValue),t._currentValue=a}function ga(e){e._currentValue=uo.current,y(uo)}function fo(e,t,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===a)break;e=e.return}}function ho(e,t,a,l){var n=e.child;for(n!==null&&(n.return=e);n!==null;){var i=n.dependencies;if(i!==null){var o=n.child;i=i.firstContext;e:for(;i!==null;){var s=i;i=n;for(var c=0;c<t.length;c++)if(s.context===t[c]){i.lanes|=a,s=i.alternate,s!==null&&(s.lanes|=a),fo(i.return,a,e),l||(o=null);break e}i=s.next}}else if(n.tag===18){if(o=n.return,o===null)throw Error(f(341));o.lanes|=a,i=o.alternate,i!==null&&(i.lanes|=a),fo(o,a,e),o=null}else o=n.child;if(o!==null)o.return=n;else for(o=n;o!==null;){if(o===e){o=null;break}if(n=o.sibling,n!==null){n.return=o.return,o=n;break}o=o.return}n=o}}function Ul(e,t,a,l){e=null;for(var n=t,i=!1;n!==null;){if(!i){if((n.flags&524288)!==0)i=!0;else if((n.flags&262144)!==0)break}if(n.tag===10){var o=n.alternate;if(o===null)throw Error(f(387));if(o=o.memoizedProps,o!==null){var s=n.type;Mt(n.pendingProps.value,o.value)||(e!==null?e.push(s):e=[s])}}else if(n===ie.current){if(o=n.alternate,o===null)throw Error(f(387));o.memoizedState.memoizedState!==n.memoizedState.memoizedState&&(e!==null?e.push(In):e=[In])}n=n.return}e!==null&&ho(t,e,a,l),t.flags|=262144}function xi(e){for(e=e.firstContext;e!==null;){if(!Mt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function sl(e){ol=e,ma=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ht(e){return nu(ol,e)}function wi(e,t){return ol===null&&sl(e),nu(e,t)}function nu(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},ma===null){if(e===null)throw Error(f(308));ma=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ma=ma.next=t;return a}var Em=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},Mm=h.unstable_scheduleCallback,zm=h.unstable_NormalPriority,et={$$typeof:Ne,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function mo(){return{controller:new Em,data:new Map,refCount:0}}function An(e){e.refCount--,e.refCount===0&&Mm(zm,function(){e.controller.abort()})}var kn=null,go=0,Ll=0,Bl=null;function Dm(e,t){if(kn===null){var a=kn=[];go=0,Ll=ys(),Bl={status:"pending",value:void 0,then:function(l){a.push(l)}}}return go++,t.then(iu,iu),t}function iu(){if(--go===0&&kn!==null){Bl!==null&&(Bl.status="fulfilled");var e=kn;kn=null,Ll=0,Bl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Rm(e,t){var a=[],l={status:"pending",value:null,reason:null,then:function(n){a.push(n)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var n=0;n<a.length;n++)(0,a[n])(t)},function(n){for(l.status="rejected",l.reason=n,n=0;n<a.length;n++)(0,a[n])(void 0)}),l}var ru=w.S;w.S=function(e,t){Vd=vt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Dm(e,t),ru!==null&&ru(e,t)};var cl=u(null);function po(){var e=cl.current;return e!==null?e:Be.pooledCache}function Si(e,t){t===null?R(cl,cl.current):R(cl,t.pool)}function ou(){var e=po();return e===null?null:{parent:et._currentValue,pool:e}}var Gl=Error(f(460)),bo=Error(f(474)),ji=Error(f(542)),Ai={then:function(){}};function su(e){return e=e.status,e==="fulfilled"||e==="rejected"}function cu(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(ua,ua),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,du(e),e;default:if(typeof t.status=="string")t.then(ua,ua);else{if(e=Be,e!==null&&100<e.shellSuspendCounter)throw Error(f(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var n=t;n.status="fulfilled",n.value=l}},function(l){if(t.status==="pending"){var n=t;n.status="rejected",n.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,du(e),e}throw dl=t,Gl}}function ul(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(dl=a,Gl):a}}var dl=null;function uu(){if(dl===null)throw Error(f(459));var e=dl;return dl=null,e}function du(e){if(e===Gl||e===ji)throw Error(f(483))}var Hl=null,Nn=0;function ki(e){var t=Nn;return Nn+=1,Hl===null&&(Hl=[]),cu(Hl,e,t)}function Tn(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Ni(e,t){throw t.$$typeof===P?Error(f(525)):(e=Object.prototype.toString.call(t),Error(f(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function fu(e){function t(m,d){if(e){var g=m.deletions;g===null?(m.deletions=[d],m.flags|=16):g.push(d)}}function a(m,d){if(!e)return null;for(;d!==null;)t(m,d),d=d.sibling;return null}function l(m){for(var d=new Map;m!==null;)m.key!==null?d.set(m.key,m):d.set(m.index,m),m=m.sibling;return d}function n(m,d){return m=fa(m,d),m.index=0,m.sibling=null,m}function i(m,d,g){return m.index=g,e?(g=m.alternate,g!==null?(g=g.index,g<d?(m.flags|=67108866,d):g):(m.flags|=67108866,d)):(m.flags|=1048576,d)}function o(m){return e&&m.alternate===null&&(m.flags|=67108866),m}function s(m,d,g,k){return d===null||d.tag!==6?(d=no(g,m.mode,k),d.return=m,d):(d=n(d,g),d.return=m,d)}function c(m,d,g,k){var X=g.type;return X===Ae?j(m,d,g.props.children,k,g.key):d!==null&&(d.elementType===X||typeof X=="object"&&X!==null&&X.$$typeof===Ye&&ul(X)===d.type)?(d=n(d,g.props),Tn(d,g),d.return=m,d):(d=yi(g.type,g.key,g.props,null,m.mode,k),Tn(d,g),d.return=m,d)}function p(m,d,g,k){return d===null||d.tag!==4||d.stateNode.containerInfo!==g.containerInfo||d.stateNode.implementation!==g.implementation?(d=io(g,m.mode,k),d.return=m,d):(d=n(d,g.children||[]),d.return=m,d)}function j(m,d,g,k,X){return d===null||d.tag!==7?(d=il(g,m.mode,k,X),d.return=m,d):(d=n(d,g),d.return=m,d)}function N(m,d,g){if(typeof d=="string"&&d!==""||typeof d=="number"||typeof d=="bigint")return d=no(""+d,m.mode,g),d.return=m,d;if(typeof d=="object"&&d!==null){switch(d.$$typeof){case ne:return g=yi(d.type,d.key,d.props,null,m.mode,g),Tn(g,d),g.return=m,g;case He:return d=io(d,m.mode,g),d.return=m,d;case Ye:return d=ul(d),N(m,d,g)}if(it(d)||qe(d))return d=il(d,m.mode,g,null),d.return=m,d;if(typeof d.then=="function")return N(m,ki(d),g);if(d.$$typeof===Ne)return N(m,wi(m,d),g);Ni(m,d)}return null}function b(m,d,g,k){var X=d!==null?d.key:null;if(typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint")return X!==null?null:s(m,d,""+g,k);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case ne:return g.key===X?c(m,d,g,k):null;case He:return g.key===X?p(m,d,g,k):null;case Ye:return g=ul(g),b(m,d,g,k)}if(it(g)||qe(g))return X!==null?null:j(m,d,g,k,null);if(typeof g.then=="function")return b(m,d,ki(g),k);if(g.$$typeof===Ne)return b(m,d,wi(m,g),k);Ni(m,g)}return null}function v(m,d,g,k,X){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return m=m.get(g)||null,s(d,m,""+k,X);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case ne:return m=m.get(k.key===null?g:k.key)||null,c(d,m,k,X);case He:return m=m.get(k.key===null?g:k.key)||null,p(d,m,k,X);case Ye:return k=ul(k),v(m,d,g,k,X)}if(it(k)||qe(k))return m=m.get(g)||null,j(d,m,k,X,null);if(typeof k.then=="function")return v(m,d,g,ki(k),X);if(k.$$typeof===Ne)return v(m,d,g,wi(d,k),X);Ni(d,k)}return null}function V(m,d,g,k){for(var X=null,Se=null,J=d,ue=d=0,ve=null;J!==null&&ue<g.length;ue++){J.index>ue?(ve=J,J=null):ve=J.sibling;var je=b(m,J,g[ue],k);if(je===null){J===null&&(J=ve);break}e&&J&&je.alternate===null&&t(m,J),d=i(je,d,ue),Se===null?X=je:Se.sibling=je,Se=je,J=ve}if(ue===g.length)return a(m,J),xe&&ha(m,ue),X;if(J===null){for(;ue<g.length;ue++)J=N(m,g[ue],k),J!==null&&(d=i(J,d,ue),Se===null?X=J:Se.sibling=J,Se=J);return xe&&ha(m,ue),X}for(J=l(J);ue<g.length;ue++)ve=v(J,m,ue,g[ue],k),ve!==null&&(e&&ve.alternate!==null&&J.delete(ve.key===null?ue:ve.key),d=i(ve,d,ue),Se===null?X=ve:Se.sibling=ve,Se=ve);return e&&J.forEach(function(Ia){return t(m,Ia)}),xe&&ha(m,ue),X}function W(m,d,g,k){if(g==null)throw Error(f(151));for(var X=null,Se=null,J=d,ue=d=0,ve=null,je=g.next();J!==null&&!je.done;ue++,je=g.next()){J.index>ue?(ve=J,J=null):ve=J.sibling;var Ia=b(m,J,je.value,k);if(Ia===null){J===null&&(J=ve);break}e&&J&&Ia.alternate===null&&t(m,J),d=i(Ia,d,ue),Se===null?X=Ia:Se.sibling=Ia,Se=Ia,J=ve}if(je.done)return a(m,J),xe&&ha(m,ue),X;if(J===null){for(;!je.done;ue++,je=g.next())je=N(m,je.value,k),je!==null&&(d=i(je,d,ue),Se===null?X=je:Se.sibling=je,Se=je);return xe&&ha(m,ue),X}for(J=l(J);!je.done;ue++,je=g.next())je=v(J,m,ue,je.value,k),je!==null&&(e&&je.alternate!==null&&J.delete(je.key===null?ue:je.key),d=i(je,d,ue),Se===null?X=je:Se.sibling=je,Se=je);return e&&J.forEach(function(Yg){return t(m,Yg)}),xe&&ha(m,ue),X}function Oe(m,d,g,k){if(typeof g=="object"&&g!==null&&g.type===Ae&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case ne:e:{for(var X=g.key;d!==null;){if(d.key===X){if(X=g.type,X===Ae){if(d.tag===7){a(m,d.sibling),k=n(d,g.props.children),k.return=m,m=k;break e}}else if(d.elementType===X||typeof X=="object"&&X!==null&&X.$$typeof===Ye&&ul(X)===d.type){a(m,d.sibling),k=n(d,g.props),Tn(k,g),k.return=m,m=k;break e}a(m,d);break}else t(m,d);d=d.sibling}g.type===Ae?(k=il(g.props.children,m.mode,k,g.key),k.return=m,m=k):(k=yi(g.type,g.key,g.props,null,m.mode,k),Tn(k,g),k.return=m,m=k)}return o(m);case He:e:{for(X=g.key;d!==null;){if(d.key===X)if(d.tag===4&&d.stateNode.containerInfo===g.containerInfo&&d.stateNode.implementation===g.implementation){a(m,d.sibling),k=n(d,g.children||[]),k.return=m,m=k;break e}else{a(m,d);break}else t(m,d);d=d.sibling}k=io(g,m.mode,k),k.return=m,m=k}return o(m);case Ye:return g=ul(g),Oe(m,d,g,k)}if(it(g))return V(m,d,g,k);if(qe(g)){if(X=qe(g),typeof X!="function")throw Error(f(150));return g=X.call(g),W(m,d,g,k)}if(typeof g.then=="function")return Oe(m,d,ki(g),k);if(g.$$typeof===Ne)return Oe(m,d,wi(m,g),k);Ni(m,g)}return typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint"?(g=""+g,d!==null&&d.tag===6?(a(m,d.sibling),k=n(d,g),k.return=m,m=k):(a(m,d),k=no(g,m.mode,k),k.return=m,m=k),o(m)):a(m,d)}return function(m,d,g,k){try{Nn=0;var X=Oe(m,d,g,k);return Hl=null,X}catch(J){if(J===Gl||J===ji)throw J;var Se=zt(29,J,null,m.mode);return Se.lanes=k,Se.return=m,Se}finally{}}}var fl=fu(!0),hu=fu(!1),Ra=!1;function yo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function vo(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Oa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function qa(e,t,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(ke&2)!==0){var n=l.pending;return n===null?t.next=t:(t.next=n.next,n.next=t),l.pending=t,t=bi(e),Ic(e,null,a),t}return pi(e,l,t,a),bi(e)}function Cn(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,nc(e,a)}}function xo(e,t){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var n=null,i=null;if(a=a.firstBaseUpdate,a!==null){do{var o={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};i===null?n=i=o:i=i.next=o,a=a.next}while(a!==null);i===null?n=i=t:i=i.next=t}else n=i=t;a={baseState:l.baseState,firstBaseUpdate:n,lastBaseUpdate:i,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var wo=!1;function En(){if(wo){var e=Bl;if(e!==null)throw e}}function Mn(e,t,a,l){wo=!1;var n=e.updateQueue;Ra=!1;var i=n.firstBaseUpdate,o=n.lastBaseUpdate,s=n.shared.pending;if(s!==null){n.shared.pending=null;var c=s,p=c.next;c.next=null,o===null?i=p:o.next=p,o=c;var j=e.alternate;j!==null&&(j=j.updateQueue,s=j.lastBaseUpdate,s!==o&&(s===null?j.firstBaseUpdate=p:s.next=p,j.lastBaseUpdate=c))}if(i!==null){var N=n.baseState;o=0,j=p=c=null,s=i;do{var b=s.lane&-536870913,v=b!==s.lane;if(v?(ye&b)===b:(l&b)===b){b!==0&&b===Ll&&(wo=!0),j!==null&&(j=j.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});e:{var V=e,W=s;b=t;var Oe=a;switch(W.tag){case 1:if(V=W.payload,typeof V=="function"){N=V.call(Oe,N,b);break e}N=V;break e;case 3:V.flags=V.flags&-65537|128;case 0:if(V=W.payload,b=typeof V=="function"?V.call(Oe,N,b):V,b==null)break e;N=D({},N,b);break e;case 2:Ra=!0}}b=s.callback,b!==null&&(e.flags|=64,v&&(e.flags|=8192),v=n.callbacks,v===null?n.callbacks=[b]:v.push(b))}else v={lane:b,tag:s.tag,payload:s.payload,callback:s.callback,next:null},j===null?(p=j=v,c=N):j=j.next=v,o|=b;if(s=s.next,s===null){if(s=n.shared.pending,s===null)break;v=s,s=v.next,v.next=null,n.lastBaseUpdate=v,n.shared.pending=null}}while(!0);j===null&&(c=N),n.baseState=c,n.firstBaseUpdate=p,n.lastBaseUpdate=j,i===null&&(n.shared.lanes=0),Ha|=o,e.lanes=o,e.memoizedState=N}}function mu(e,t){if(typeof e!="function")throw Error(f(191,e));e.call(t)}function gu(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)mu(a[e],t)}var Ql=u(null),Ti=u(0);function pu(e,t){e=Aa,R(Ti,e),R(Ql,t),Aa=e|t.baseLanes}function So(){R(Ti,Aa),R(Ql,Ql.current)}function jo(){Aa=Ti.current,y(Ql),y(Ti)}var Dt=u(null),_t=null;function Ua(e){var t=e.alternate;R(Fe,Fe.current&1),R(Dt,e),_t===null&&(t===null||Ql.current!==null||t.memoizedState!==null)&&(_t=e)}function Ao(e){R(Fe,Fe.current),R(Dt,e),_t===null&&(_t=e)}function bu(e){e.tag===22?(R(Fe,Fe.current),R(Dt,e),_t===null&&(_t=e)):La()}function La(){R(Fe,Fe.current),R(Dt,Dt.current)}function Rt(e){y(Dt),_t===e&&(_t=null),y(Fe)}var Fe=u(0);function Ci(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Ms(a)||zs(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var pa=0,se=null,De=null,tt=null,Ei=!1,Kl=!1,hl=!1,Mi=0,zn=0,Vl=null,Om=0;function Ze(){throw Error(f(321))}function ko(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!Mt(e[a],t[a]))return!1;return!0}function No(e,t,a,l,n,i){return pa=i,se=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,w.H=e===null||e.memoizedState===null?ed:Qo,hl=!1,i=a(l,n),hl=!1,Kl&&(i=vu(t,a,l,n)),yu(e),i}function yu(e){w.H=On;var t=De!==null&&De.next!==null;if(pa=0,tt=De=se=null,Ei=!1,zn=0,Vl=null,t)throw Error(f(300));e===null||at||(e=e.dependencies,e!==null&&xi(e)&&(at=!0))}function vu(e,t,a,l){se=e;var n=0;do{if(Kl&&(Vl=null),zn=0,Kl=!1,25<=n)throw Error(f(301));if(n+=1,tt=De=null,e.updateQueue!=null){var i=e.updateQueue;i.lastEffect=null,i.events=null,i.stores=null,i.memoCache!=null&&(i.memoCache.index=0)}w.H=td,i=t(a,l)}while(Kl);return i}function qm(){var e=w.H,t=e.useState()[0];return t=typeof t.then=="function"?Dn(t):t,e=e.useState()[0],(De!==null?De.memoizedState:null)!==e&&(se.flags|=1024),t}function To(){var e=Mi!==0;return Mi=0,e}function Co(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function Eo(e){if(Ei){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ei=!1}pa=0,tt=De=se=null,Kl=!1,zn=Mi=0,Vl=null}function wt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?se.memoizedState=tt=e:tt=tt.next=e,tt}function Pe(){if(De===null){var e=se.alternate;e=e!==null?e.memoizedState:null}else e=De.next;var t=tt===null?se.memoizedState:tt.next;if(t!==null)tt=t,De=e;else{if(e===null)throw se.alternate===null?Error(f(467)):Error(f(310));De=e,e={memoizedState:De.memoizedState,baseState:De.baseState,baseQueue:De.baseQueue,queue:De.queue,next:null},tt===null?se.memoizedState=tt=e:tt=tt.next=e}return tt}function zi(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Dn(e){var t=zn;return zn+=1,Vl===null&&(Vl=[]),e=cu(Vl,e,t),t=se,(tt===null?t.memoizedState:tt.next)===null&&(t=t.alternate,w.H=t===null||t.memoizedState===null?ed:Qo),e}function Di(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Dn(e);if(e.$$typeof===Ne)return ht(e)}throw Error(f(438,String(e)))}function Mo(e){var t=null,a=se.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var l=se.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(n){return n.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=zi(),se.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),l=0;l<e;l++)a[l]=pt;return t.index++,a}function ba(e,t){return typeof t=="function"?t(e):t}function Ri(e){var t=Pe();return zo(t,De,e)}function zo(e,t,a){var l=e.queue;if(l===null)throw Error(f(311));l.lastRenderedReducer=a;var n=e.baseQueue,i=l.pending;if(i!==null){if(n!==null){var o=n.next;n.next=i.next,i.next=o}t.baseQueue=n=i,l.pending=null}if(i=e.baseState,n===null)e.memoizedState=i;else{t=n.next;var s=o=null,c=null,p=t,j=!1;do{var N=p.lane&-536870913;if(N!==p.lane?(ye&N)===N:(pa&N)===N){var b=p.revertLane;if(b===0)c!==null&&(c=c.next={lane:0,revertLane:0,gesture:null,action:p.action,hasEagerState:p.hasEagerState,eagerState:p.eagerState,next:null}),N===Ll&&(j=!0);else if((pa&b)===b){p=p.next,b===Ll&&(j=!0);continue}else N={lane:0,revertLane:p.revertLane,gesture:null,action:p.action,hasEagerState:p.hasEagerState,eagerState:p.eagerState,next:null},c===null?(s=c=N,o=i):c=c.next=N,se.lanes|=b,Ha|=b;N=p.action,hl&&a(i,N),i=p.hasEagerState?p.eagerState:a(i,N)}else b={lane:N,revertLane:p.revertLane,gesture:p.gesture,action:p.action,hasEagerState:p.hasEagerState,eagerState:p.eagerState,next:null},c===null?(s=c=b,o=i):c=c.next=b,se.lanes|=N,Ha|=N;p=p.next}while(p!==null&&p!==t);if(c===null?o=i:c.next=s,!Mt(i,e.memoizedState)&&(at=!0,j&&(a=Bl,a!==null)))throw a;e.memoizedState=i,e.baseState=o,e.baseQueue=c,l.lastRenderedState=i}return n===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function Do(e){var t=Pe(),a=t.queue;if(a===null)throw Error(f(311));a.lastRenderedReducer=e;var l=a.dispatch,n=a.pending,i=t.memoizedState;if(n!==null){a.pending=null;var o=n=n.next;do i=e(i,o.action),o=o.next;while(o!==n);Mt(i,t.memoizedState)||(at=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),a.lastRenderedState=i}return[i,l]}function xu(e,t,a){var l=se,n=Pe(),i=xe;if(i){if(a===void 0)throw Error(f(407));a=a()}else a=t();var o=!Mt((De||n).memoizedState,a);if(o&&(n.memoizedState=a,at=!0),n=n.queue,qo(ju.bind(null,l,n,e),[e]),n.getSnapshot!==t||o||tt!==null&&tt.memoizedState.tag&1){if(l.flags|=2048,Yl(9,{destroy:void 0},Su.bind(null,l,n,a,t),null),Be===null)throw Error(f(349));i||(pa&127)!==0||wu(l,t,a)}return a}function wu(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=se.updateQueue,t===null?(t=zi(),se.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function Su(e,t,a,l){t.value=a,t.getSnapshot=l,Au(t)&&ku(e)}function ju(e,t,a){return a(function(){Au(t)&&ku(e)})}function Au(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!Mt(e,a)}catch{return!0}}function ku(e){var t=nl(e,2);t!==null&&Et(t,e,2)}function Ro(e){var t=wt();if(typeof e=="function"){var a=e;if(e=a(),hl){xt(!0);try{a()}finally{xt(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ba,lastRenderedState:e},t}function Nu(e,t,a,l){return e.baseState=a,zo(e,De,typeof l=="function"?l:ba)}function Um(e,t,a,l,n){if(Ui(e))throw Error(f(485));if(e=t.action,e!==null){var i={payload:n,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(o){i.listeners.push(o)}};w.T!==null?a(!0):i.isTransition=!1,l(i),a=t.pending,a===null?(i.next=t.pending=i,Tu(t,i)):(i.next=a.next,t.pending=a.next=i)}}function Tu(e,t){var a=t.action,l=t.payload,n=e.state;if(t.isTransition){var i=w.T,o={};w.T=o;try{var s=a(n,l),c=w.S;c!==null&&c(o,s),Cu(e,t,s)}catch(p){Oo(e,t,p)}finally{i!==null&&o.types!==null&&(i.types=o.types),w.T=i}}else try{i=a(n,l),Cu(e,t,i)}catch(p){Oo(e,t,p)}}function Cu(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){Eu(e,t,l)},function(l){return Oo(e,t,l)}):Eu(e,t,a)}function Eu(e,t,a){t.status="fulfilled",t.value=a,Mu(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,Tu(e,a)))}function Oo(e,t,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=a,Mu(t),t=t.next;while(t!==l)}e.action=null}function Mu(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function zu(e,t){return t}function Du(e,t){if(xe){var a=Be.formState;if(a!==null){e:{var l=se;if(xe){if(Qe){t:{for(var n=Qe,i=Jt;n.nodeType!==8;){if(!i){n=null;break t}if(n=Zt(n.nextSibling),n===null){n=null;break t}}i=n.data,n=i==="F!"||i==="F"?n:null}if(n){Qe=Zt(n.nextSibling),l=n.data==="F!";break e}}za(l)}l=!1}l&&(t=a[0])}}return a=wt(),a.memoizedState=a.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:zu,lastRenderedState:t},a.queue=l,a=Fu.bind(null,se,l),l.dispatch=a,l=Ro(!1),i=Ho.bind(null,se,!1,l.queue),l=wt(),n={state:t,dispatch:null,action:e,pending:null},l.queue=n,a=Um.bind(null,se,n,i,a),n.dispatch=a,l.memoizedState=e,[t,a,!1]}function Ru(e){var t=Pe();return Ou(t,De,e)}function Ou(e,t,a){if(t=zo(e,t,zu)[0],e=Ri(ba)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=Dn(t)}catch(o){throw o===Gl?ji:o}else l=t;t=Pe();var n=t.queue,i=n.dispatch;return a!==t.memoizedState&&(se.flags|=2048,Yl(9,{destroy:void 0},Lm.bind(null,n,a),null)),[l,i,e]}function Lm(e,t){e.action=t}function qu(e){var t=Pe(),a=De;if(a!==null)return Ou(t,a,e);Pe(),t=t.memoizedState,a=Pe();var l=a.queue.dispatch;return a.memoizedState=e,[t,l,!1]}function Yl(e,t,a,l){return e={tag:e,create:a,deps:l,inst:t,next:null},t=se.updateQueue,t===null&&(t=zi(),se.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,t.lastEffect=e),e}function Uu(){return Pe().memoizedState}function Oi(e,t,a,l){var n=wt();se.flags|=e,n.memoizedState=Yl(1|t,{destroy:void 0},a,l===void 0?null:l)}function qi(e,t,a,l){var n=Pe();l=l===void 0?null:l;var i=n.memoizedState.inst;De!==null&&l!==null&&ko(l,De.memoizedState.deps)?n.memoizedState=Yl(t,i,a,l):(se.flags|=e,n.memoizedState=Yl(1|t,i,a,l))}function Lu(e,t){Oi(8390656,8,e,t)}function qo(e,t){qi(2048,8,e,t)}function Bm(e){se.flags|=4;var t=se.updateQueue;if(t===null)t=zi(),se.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function Bu(e){var t=Pe().memoizedState;return Bm({ref:t,nextImpl:e}),function(){if((ke&2)!==0)throw Error(f(440));return t.impl.apply(void 0,arguments)}}function Gu(e,t){return qi(4,2,e,t)}function Hu(e,t){return qi(4,4,e,t)}function Qu(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ku(e,t,a){a=a!=null?a.concat([e]):null,qi(4,4,Qu.bind(null,t,e),a)}function Uo(){}function Vu(e,t){var a=Pe();t=t===void 0?null:t;var l=a.memoizedState;return t!==null&&ko(t,l[1])?l[0]:(a.memoizedState=[e,t],e)}function Yu(e,t){var a=Pe();t=t===void 0?null:t;var l=a.memoizedState;if(t!==null&&ko(t,l[1]))return l[0];if(l=e(),hl){xt(!0);try{e()}finally{xt(!1)}}return a.memoizedState=[l,t],l}function Lo(e,t,a){return a===void 0||(pa&1073741824)!==0&&(ye&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=Jd(),se.lanes|=e,Ha|=e,a)}function Ju(e,t,a,l){return Mt(a,t)?a:Ql.current!==null?(e=Lo(e,a,l),Mt(e,t)||(at=!0),e):(pa&42)===0||(pa&1073741824)!==0&&(ye&261930)===0?(at=!0,e.memoizedState=a):(e=Jd(),se.lanes|=e,Ha|=e,t)}function _u(e,t,a,l,n){var i=O.p;O.p=i!==0&&8>i?i:8;var o=w.T,s={};w.T=s,Ho(e,!1,t,a);try{var c=n(),p=w.S;if(p!==null&&p(s,c),c!==null&&typeof c=="object"&&typeof c.then=="function"){var j=Rm(c,l);Rn(e,t,j,Ut(e))}else Rn(e,t,l,Ut(e))}catch(N){Rn(e,t,{then:function(){},status:"rejected",reason:N},Ut())}finally{O.p=i,o!==null&&s.types!==null&&(o.types=s.types),w.T=o}}function Gm(){}function Bo(e,t,a,l){if(e.tag!==5)throw Error(f(476));var n=Zu(e).queue;_u(e,n,t,Y,a===null?Gm:function(){return Xu(e),a(l)})}function Zu(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Y,baseState:Y,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ba,lastRenderedState:Y},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ba,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Xu(e){var t=Zu(e);t.next===null&&(t=e.alternate.memoizedState),Rn(e,t.next.queue,{},Ut())}function Go(){return ht(In)}function Wu(){return Pe().memoizedState}function Iu(){return Pe().memoizedState}function Hm(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=Ut();e=Oa(a);var l=qa(t,e,a);l!==null&&(Et(l,t,a),Cn(l,t,a)),t={cache:mo()},e.payload=t;return}t=t.return}}function Qm(e,t,a){var l=Ut();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Ui(e)?Pu(t,a):(a=ao(e,t,a,l),a!==null&&(Et(a,e,l),$u(a,t,l)))}function Fu(e,t,a){var l=Ut();Rn(e,t,a,l)}function Rn(e,t,a,l){var n={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ui(e))Pu(t,n);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,s=i(o,a);if(n.hasEagerState=!0,n.eagerState=s,Mt(s,o))return pi(e,t,n,0),Be===null&&gi(),!1}catch{}finally{}if(a=ao(e,t,n,l),a!==null)return Et(a,e,l),$u(a,t,l),!0}return!1}function Ho(e,t,a,l){if(l={lane:2,revertLane:ys(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Ui(e)){if(t)throw Error(f(479))}else t=ao(e,a,l,2),t!==null&&Et(t,e,2)}function Ui(e){var t=e.alternate;return e===se||t!==null&&t===se}function Pu(e,t){Kl=Ei=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function $u(e,t,a){if((a&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,nc(e,a)}}var On={readContext:ht,use:Di,useCallback:Ze,useContext:Ze,useEffect:Ze,useImperativeHandle:Ze,useLayoutEffect:Ze,useInsertionEffect:Ze,useMemo:Ze,useReducer:Ze,useRef:Ze,useState:Ze,useDebugValue:Ze,useDeferredValue:Ze,useTransition:Ze,useSyncExternalStore:Ze,useId:Ze,useHostTransitionStatus:Ze,useFormState:Ze,useActionState:Ze,useOptimistic:Ze,useMemoCache:Ze,useCacheRefresh:Ze};On.useEffectEvent=Ze;var ed={readContext:ht,use:Di,useCallback:function(e,t){return wt().memoizedState=[e,t===void 0?null:t],e},useContext:ht,useEffect:Lu,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,Oi(4194308,4,Qu.bind(null,t,e),a)},useLayoutEffect:function(e,t){return Oi(4194308,4,e,t)},useInsertionEffect:function(e,t){Oi(4,2,e,t)},useMemo:function(e,t){var a=wt();t=t===void 0?null:t;var l=e();if(hl){xt(!0);try{e()}finally{xt(!1)}}return a.memoizedState=[l,t],l},useReducer:function(e,t,a){var l=wt();if(a!==void 0){var n=a(t);if(hl){xt(!0);try{a(t)}finally{xt(!1)}}}else n=t;return l.memoizedState=l.baseState=n,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},l.queue=e,e=e.dispatch=Qm.bind(null,se,e),[l.memoizedState,e]},useRef:function(e){var t=wt();return e={current:e},t.memoizedState=e},useState:function(e){e=Ro(e);var t=e.queue,a=Fu.bind(null,se,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:Uo,useDeferredValue:function(e,t){var a=wt();return Lo(a,e,t)},useTransition:function(){var e=Ro(!1);return e=_u.bind(null,se,e.queue,!0,!1),wt().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var l=se,n=wt();if(xe){if(a===void 0)throw Error(f(407));a=a()}else{if(a=t(),Be===null)throw Error(f(349));(ye&127)!==0||wu(l,t,a)}n.memoizedState=a;var i={value:a,getSnapshot:t};return n.queue=i,Lu(ju.bind(null,l,i,e),[e]),l.flags|=2048,Yl(9,{destroy:void 0},Su.bind(null,l,i,a,t),null),a},useId:function(){var e=wt(),t=Be.identifierPrefix;if(xe){var a=na,l=la;a=(l&~(1<<32-Le(l)-1)).toString(32)+a,t="_"+t+"R_"+a,a=Mi++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=Om++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Go,useFormState:Du,useActionState:Du,useOptimistic:function(e){var t=wt();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=Ho.bind(null,se,!0,a),a.dispatch=t,[e,t]},useMemoCache:Mo,useCacheRefresh:function(){return wt().memoizedState=Hm.bind(null,se)},useEffectEvent:function(e){var t=wt(),a={impl:e};return t.memoizedState=a,function(){if((ke&2)!==0)throw Error(f(440));return a.impl.apply(void 0,arguments)}}},Qo={readContext:ht,use:Di,useCallback:Vu,useContext:ht,useEffect:qo,useImperativeHandle:Ku,useInsertionEffect:Gu,useLayoutEffect:Hu,useMemo:Yu,useReducer:Ri,useRef:Uu,useState:function(){return Ri(ba)},useDebugValue:Uo,useDeferredValue:function(e,t){var a=Pe();return Ju(a,De.memoizedState,e,t)},useTransition:function(){var e=Ri(ba)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Dn(e),t]},useSyncExternalStore:xu,useId:Wu,useHostTransitionStatus:Go,useFormState:Ru,useActionState:Ru,useOptimistic:function(e,t){var a=Pe();return Nu(a,De,e,t)},useMemoCache:Mo,useCacheRefresh:Iu};Qo.useEffectEvent=Bu;var td={readContext:ht,use:Di,useCallback:Vu,useContext:ht,useEffect:qo,useImperativeHandle:Ku,useInsertionEffect:Gu,useLayoutEffect:Hu,useMemo:Yu,useReducer:Do,useRef:Uu,useState:function(){return Do(ba)},useDebugValue:Uo,useDeferredValue:function(e,t){var a=Pe();return De===null?Lo(a,e,t):Ju(a,De.memoizedState,e,t)},useTransition:function(){var e=Do(ba)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Dn(e),t]},useSyncExternalStore:xu,useId:Wu,useHostTransitionStatus:Go,useFormState:qu,useActionState:qu,useOptimistic:function(e,t){var a=Pe();return De!==null?Nu(a,De,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Mo,useCacheRefresh:Iu};td.useEffectEvent=Bu;function Ko(e,t,a,l){t=e.memoizedState,a=a(l,t),a=a==null?t:D({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Vo={enqueueSetState:function(e,t,a){e=e._reactInternals;var l=Ut(),n=Oa(l);n.payload=t,a!=null&&(n.callback=a),t=qa(e,n,l),t!==null&&(Et(t,e,l),Cn(t,e,l))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var l=Ut(),n=Oa(l);n.tag=1,n.payload=t,a!=null&&(n.callback=a),t=qa(e,n,l),t!==null&&(Et(t,e,l),Cn(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=Ut(),l=Oa(a);l.tag=2,t!=null&&(l.callback=t),t=qa(e,l,a),t!==null&&(Et(t,e,a),Cn(t,e,a))}};function ad(e,t,a,l,n,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,i,o):t.prototype&&t.prototype.isPureReactComponent?!xn(a,l)||!xn(n,i):!0}function ld(e,t,a,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,l),t.state!==e&&Vo.enqueueReplaceState(t,t.state,null)}function ml(e,t){var a=t;if("ref"in t){a={};for(var l in t)l!=="ref"&&(a[l]=t[l])}if(e=e.defaultProps){a===t&&(a=D({},a));for(var n in e)a[n]===void 0&&(a[n]=e[n])}return a}function nd(e){mi(e)}function id(e){console.error(e)}function rd(e){mi(e)}function Li(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function od(e,t,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(n){setTimeout(function(){throw n})}}function Yo(e,t,a){return a=Oa(a),a.tag=3,a.payload={element:null},a.callback=function(){Li(e,t)},a}function sd(e){return e=Oa(e),e.tag=3,e}function cd(e,t,a,l){var n=a.type.getDerivedStateFromError;if(typeof n=="function"){var i=l.value;e.payload=function(){return n(i)},e.callback=function(){od(t,a,l)}}var o=a.stateNode;o!==null&&typeof o.componentDidCatch=="function"&&(e.callback=function(){od(t,a,l),typeof n!="function"&&(Qa===null?Qa=new Set([this]):Qa.add(this));var s=l.stack;this.componentDidCatch(l.value,{componentStack:s!==null?s:""})})}function Km(e,t,a,l,n){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=a.alternate,t!==null&&Ul(t,a,n,!0),a=Dt.current,a!==null){switch(a.tag){case 31:case 13:return _t===null?Wi():a.alternate===null&&Xe===0&&(Xe=3),a.flags&=-257,a.flags|=65536,a.lanes=n,l===Ai?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([l]):t.add(l),gs(e,l,n)),!1;case 22:return a.flags|=65536,l===Ai?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([l]):a.add(l)),gs(e,l,n)),!1}throw Error(f(435,a.tag))}return gs(e,l,n),Wi(),!1}if(xe)return t=Dt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=n,l!==so&&(e=Error(f(422),{cause:l}),jn(Kt(e,a)))):(l!==so&&(t=Error(f(423),{cause:l}),jn(Kt(t,a))),e=e.current.alternate,e.flags|=65536,n&=-n,e.lanes|=n,l=Kt(l,a),n=Yo(e.stateNode,l,n),xo(e,n),Xe!==4&&(Xe=2)),!1;var i=Error(f(520),{cause:l});if(i=Kt(i,a),Kn===null?Kn=[i]:Kn.push(i),Xe!==4&&(Xe=2),t===null)return!0;l=Kt(l,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=n&-n,a.lanes|=e,e=Yo(a.stateNode,l,e),xo(a,e),!1;case 1:if(t=a.type,i=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||i!==null&&typeof i.componentDidCatch=="function"&&(Qa===null||!Qa.has(i))))return a.flags|=65536,n&=-n,a.lanes|=n,n=sd(n),cd(n,e,a,l),xo(a,n),!1}a=a.return}while(a!==null);return!1}var Jo=Error(f(461)),at=!1;function mt(e,t,a,l){t.child=e===null?hu(t,null,a,l):fl(t,e.child,a,l)}function ud(e,t,a,l,n){a=a.render;var i=t.ref;if("ref"in l){var o={};for(var s in l)s!=="ref"&&(o[s]=l[s])}else o=l;return sl(t),l=No(e,t,a,o,i,n),s=To(),e!==null&&!at?(Co(e,t,n),ya(e,t,n)):(xe&&s&&ro(t),t.flags|=1,mt(e,t,l,n),t.child)}function dd(e,t,a,l,n){if(e===null){var i=a.type;return typeof i=="function"&&!lo(i)&&i.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=i,fd(e,t,i,l,n)):(e=yi(a.type,null,l,t,t.mode,n),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!$o(e,n)){var o=i.memoizedProps;if(a=a.compare,a=a!==null?a:xn,a(o,l)&&e.ref===t.ref)return ya(e,t,n)}return t.flags|=1,e=fa(i,l),e.ref=t.ref,e.return=t,t.child=e}function fd(e,t,a,l,n){if(e!==null){var i=e.memoizedProps;if(xn(i,l)&&e.ref===t.ref)if(at=!1,t.pendingProps=l=i,$o(e,n))(e.flags&131072)!==0&&(at=!0);else return t.lanes=e.lanes,ya(e,t,n)}return _o(e,t,a,l,n)}function hd(e,t,a,l){var n=l.children,i=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(i=i!==null?i.baseLanes|a:a,e!==null){for(l=t.child=e.child,n=0;l!==null;)n=n|l.lanes|l.childLanes,l=l.sibling;l=n&~i}else l=0,t.child=null;return md(e,t,i,a,l)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Si(t,i!==null?i.cachePool:null),i!==null?pu(t,i):So(),bu(t);else return l=t.lanes=536870912,md(e,t,i!==null?i.baseLanes|a:a,a,l)}else i!==null?(Si(t,i.cachePool),pu(t,i),La(),t.memoizedState=null):(e!==null&&Si(t,null),So(),La());return mt(e,t,n,a),t.child}function qn(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function md(e,t,a,l,n){var i=po();return i=i===null?null:{parent:et._currentValue,pool:i},t.memoizedState={baseLanes:a,cachePool:i},e!==null&&Si(t,null),So(),bu(t),e!==null&&Ul(e,t,l,!0),t.childLanes=n,null}function Bi(e,t){return t=Hi({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function gd(e,t,a){return fl(t,e.child,null,a),e=Bi(t,t.pendingProps),e.flags|=2,Rt(t),t.memoizedState=null,e}function Vm(e,t,a){var l=t.pendingProps,n=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(xe){if(l.mode==="hidden")return e=Bi(t,l),t.lanes=536870912,qn(null,e);if(Ao(t),(e=Qe)?(e=Cf(e,Jt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ea!==null?{id:la,overflow:na}:null,retryLane:536870912,hydrationErrors:null},a=Pc(e),a.return=t,t.child=a,ft=t,Qe=null)):e=null,e===null)throw za(t);return t.lanes=536870912,null}return Bi(t,l)}var i=e.memoizedState;if(i!==null){var o=i.dehydrated;if(Ao(t),n)if(t.flags&256)t.flags&=-257,t=gd(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(f(558));else if(at||Ul(e,t,a,!1),n=(a&e.childLanes)!==0,at||n){if(l=Be,l!==null&&(o=ic(l,a),o!==0&&o!==i.retryLane))throw i.retryLane=o,nl(e,o),Et(l,e,o),Jo;Wi(),t=gd(e,t,a)}else e=i.treeContext,Qe=Zt(o.nextSibling),ft=t,xe=!0,Ma=null,Jt=!1,e!==null&&tu(t,e),t=Bi(t,l),t.flags|=4096;return t}return e=fa(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Gi(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(f(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function _o(e,t,a,l,n){return sl(t),a=No(e,t,a,l,void 0,n),l=To(),e!==null&&!at?(Co(e,t,n),ya(e,t,n)):(xe&&l&&ro(t),t.flags|=1,mt(e,t,a,n),t.child)}function pd(e,t,a,l,n,i){return sl(t),t.updateQueue=null,a=vu(t,l,a,n),yu(e),l=To(),e!==null&&!at?(Co(e,t,i),ya(e,t,i)):(xe&&l&&ro(t),t.flags|=1,mt(e,t,a,i),t.child)}function bd(e,t,a,l,n){if(sl(t),t.stateNode===null){var i=Dl,o=a.contextType;typeof o=="object"&&o!==null&&(i=ht(o)),i=new a(l,i),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Vo,t.stateNode=i,i._reactInternals=t,i=t.stateNode,i.props=l,i.state=t.memoizedState,i.refs={},yo(t),o=a.contextType,i.context=typeof o=="object"&&o!==null?ht(o):Dl,i.state=t.memoizedState,o=a.getDerivedStateFromProps,typeof o=="function"&&(Ko(t,a,o,l),i.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(o=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),o!==i.state&&Vo.enqueueReplaceState(i,i.state,null),Mn(t,l,i,n),En(),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){i=t.stateNode;var s=t.memoizedProps,c=ml(a,s);i.props=c;var p=i.context,j=a.contextType;o=Dl,typeof j=="object"&&j!==null&&(o=ht(j));var N=a.getDerivedStateFromProps;j=typeof N=="function"||typeof i.getSnapshotBeforeUpdate=="function",s=t.pendingProps!==s,j||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(s||p!==o)&&ld(t,i,l,o),Ra=!1;var b=t.memoizedState;i.state=b,Mn(t,l,i,n),En(),p=t.memoizedState,s||b!==p||Ra?(typeof N=="function"&&(Ko(t,a,N,l),p=t.memoizedState),(c=Ra||ad(t,a,c,l,b,p,o))?(j||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=p),i.props=l,i.state=p,i.context=o,l=c):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{i=t.stateNode,vo(e,t),o=t.memoizedProps,j=ml(a,o),i.props=j,N=t.pendingProps,b=i.context,p=a.contextType,c=Dl,typeof p=="object"&&p!==null&&(c=ht(p)),s=a.getDerivedStateFromProps,(p=typeof s=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(o!==N||b!==c)&&ld(t,i,l,c),Ra=!1,b=t.memoizedState,i.state=b,Mn(t,l,i,n),En();var v=t.memoizedState;o!==N||b!==v||Ra||e!==null&&e.dependencies!==null&&xi(e.dependencies)?(typeof s=="function"&&(Ko(t,a,s,l),v=t.memoizedState),(j=Ra||ad(t,a,j,l,b,v,c)||e!==null&&e.dependencies!==null&&xi(e.dependencies))?(p||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(l,v,c),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(l,v,c)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||o===e.memoizedProps&&b===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&b===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=v),i.props=l,i.state=v,i.context=c,l=j):(typeof i.componentDidUpdate!="function"||o===e.memoizedProps&&b===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&b===e.memoizedState||(t.flags|=1024),l=!1)}return i=l,Gi(e,t),l=(t.flags&128)!==0,i||l?(i=t.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:i.render(),t.flags|=1,e!==null&&l?(t.child=fl(t,e.child,null,n),t.child=fl(t,null,a,n)):mt(e,t,a,n),t.memoizedState=i.state,e=t.child):e=ya(e,t,n),e}function yd(e,t,a,l){return rl(),t.flags|=256,mt(e,t,a,l),t.child}var Zo={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Xo(e){return{baseLanes:e,cachePool:ou()}}function Wo(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=qt),e}function vd(e,t,a){var l=t.pendingProps,n=!1,i=(t.flags&128)!==0,o;if((o=i)||(o=e!==null&&e.memoizedState===null?!1:(Fe.current&2)!==0),o&&(n=!0,t.flags&=-129),o=(t.flags&32)!==0,t.flags&=-33,e===null){if(xe){if(n?Ua(t):La(),(e=Qe)?(e=Cf(e,Jt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ea!==null?{id:la,overflow:na}:null,retryLane:536870912,hydrationErrors:null},a=Pc(e),a.return=t,t.child=a,ft=t,Qe=null)):e=null,e===null)throw za(t);return zs(e)?t.lanes=32:t.lanes=536870912,null}var s=l.children;return l=l.fallback,n?(La(),n=t.mode,s=Hi({mode:"hidden",children:s},n),l=il(l,n,a,null),s.return=t,l.return=t,s.sibling=l,t.child=s,l=t.child,l.memoizedState=Xo(a),l.childLanes=Wo(e,o,a),t.memoizedState=Zo,qn(null,l)):(Ua(t),Io(t,s))}var c=e.memoizedState;if(c!==null&&(s=c.dehydrated,s!==null)){if(i)t.flags&256?(Ua(t),t.flags&=-257,t=Fo(e,t,a)):t.memoizedState!==null?(La(),t.child=e.child,t.flags|=128,t=null):(La(),s=l.fallback,n=t.mode,l=Hi({mode:"visible",children:l.children},n),s=il(s,n,a,null),s.flags|=2,l.return=t,s.return=t,l.sibling=s,t.child=l,fl(t,e.child,null,a),l=t.child,l.memoizedState=Xo(a),l.childLanes=Wo(e,o,a),t.memoizedState=Zo,t=qn(null,l));else if(Ua(t),zs(s)){if(o=s.nextSibling&&s.nextSibling.dataset,o)var p=o.dgst;o=p,l=Error(f(419)),l.stack="",l.digest=o,jn({value:l,source:null,stack:null}),t=Fo(e,t,a)}else if(at||Ul(e,t,a,!1),o=(a&e.childLanes)!==0,at||o){if(o=Be,o!==null&&(l=ic(o,a),l!==0&&l!==c.retryLane))throw c.retryLane=l,nl(e,l),Et(o,e,l),Jo;Ms(s)||Wi(),t=Fo(e,t,a)}else Ms(s)?(t.flags|=192,t.child=e.child,t=null):(e=c.treeContext,Qe=Zt(s.nextSibling),ft=t,xe=!0,Ma=null,Jt=!1,e!==null&&tu(t,e),t=Io(t,l.children),t.flags|=4096);return t}return n?(La(),s=l.fallback,n=t.mode,c=e.child,p=c.sibling,l=fa(c,{mode:"hidden",children:l.children}),l.subtreeFlags=c.subtreeFlags&65011712,p!==null?s=fa(p,s):(s=il(s,n,a,null),s.flags|=2),s.return=t,l.return=t,l.sibling=s,t.child=l,qn(null,l),l=t.child,s=e.child.memoizedState,s===null?s=Xo(a):(n=s.cachePool,n!==null?(c=et._currentValue,n=n.parent!==c?{parent:c,pool:c}:n):n=ou(),s={baseLanes:s.baseLanes|a,cachePool:n}),l.memoizedState=s,l.childLanes=Wo(e,o,a),t.memoizedState=Zo,qn(e.child,l)):(Ua(t),a=e.child,e=a.sibling,a=fa(a,{mode:"visible",children:l.children}),a.return=t,a.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=a,t.memoizedState=null,a)}function Io(e,t){return t=Hi({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Hi(e,t){return e=zt(22,e,null,t),e.lanes=0,e}function Fo(e,t,a){return fl(t,e.child,null,a),e=Io(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function xd(e,t,a){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),fo(e.return,t,a)}function Po(e,t,a,l,n,i){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:n,treeForkCount:i}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=l,o.tail=a,o.tailMode=n,o.treeForkCount=i)}function wd(e,t,a){var l=t.pendingProps,n=l.revealOrder,i=l.tail;l=l.children;var o=Fe.current,s=(o&2)!==0;if(s?(o=o&1|2,t.flags|=128):o&=1,R(Fe,o),mt(e,t,l,a),l=xe?Sn:0,!s&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&xd(e,a,t);else if(e.tag===19)xd(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(n){case"forwards":for(a=t.child,n=null;a!==null;)e=a.alternate,e!==null&&Ci(e)===null&&(n=a),a=a.sibling;a=n,a===null?(n=t.child,t.child=null):(n=a.sibling,a.sibling=null),Po(t,!1,n,a,i,l);break;case"backwards":case"unstable_legacy-backwards":for(a=null,n=t.child,t.child=null;n!==null;){if(e=n.alternate,e!==null&&Ci(e)===null){t.child=n;break}e=n.sibling,n.sibling=a,a=n,n=e}Po(t,!0,a,null,i,l);break;case"together":Po(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function ya(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),Ha|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(Ul(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(f(153));if(t.child!==null){for(e=t.child,a=fa(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=fa(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function $o(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&xi(e)))}function Ym(e,t,a){switch(t.tag){case 3:L(t,t.stateNode.containerInfo),Da(t,et,e.memoizedState.cache),rl();break;case 27:case 5:Te(t);break;case 4:L(t,t.stateNode.containerInfo);break;case 10:Da(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ao(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(Ua(t),t.flags|=128,null):(a&t.child.childLanes)!==0?vd(e,t,a):(Ua(t),e=ya(e,t,a),e!==null?e.sibling:null);Ua(t);break;case 19:var n=(e.flags&128)!==0;if(l=(a&t.childLanes)!==0,l||(Ul(e,t,a,!1),l=(a&t.childLanes)!==0),n){if(l)return wd(e,t,a);t.flags|=128}if(n=t.memoizedState,n!==null&&(n.rendering=null,n.tail=null,n.lastEffect=null),R(Fe,Fe.current),l)break;return null;case 22:return t.lanes=0,hd(e,t,a,t.pendingProps);case 24:Da(t,et,e.memoizedState.cache)}return ya(e,t,a)}function Sd(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)at=!0;else{if(!$o(e,a)&&(t.flags&128)===0)return at=!1,Ym(e,t,a);at=(e.flags&131072)!==0}else at=!1,xe&&(t.flags&1048576)!==0&&eu(t,Sn,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=ul(t.elementType),t.type=e,typeof e=="function")lo(e)?(l=ml(e,l),t.tag=1,t=bd(null,t,e,l,a)):(t.tag=0,t=_o(null,t,e,l,a));else{if(e!=null){var n=e.$$typeof;if(n===ze){t.tag=11,t=ud(null,t,e,l,a);break e}else if(n===G){t.tag=14,t=dd(null,t,e,l,a);break e}}throw t=Ie(e)||e,Error(f(306,t,""))}}return t;case 0:return _o(e,t,t.type,t.pendingProps,a);case 1:return l=t.type,n=ml(l,t.pendingProps),bd(e,t,l,n,a);case 3:e:{if(L(t,t.stateNode.containerInfo),e===null)throw Error(f(387));l=t.pendingProps;var i=t.memoizedState;n=i.element,vo(e,t),Mn(t,l,null,a);var o=t.memoizedState;if(l=o.cache,Da(t,et,l),l!==i.cache&&ho(t,[et],a,!0),En(),l=o.element,i.isDehydrated)if(i={element:l,isDehydrated:!1,cache:o.cache},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){t=yd(e,t,l,a);break e}else if(l!==n){n=Kt(Error(f(424)),t),jn(n),t=yd(e,t,l,a);break e}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Qe=Zt(e.firstChild),ft=t,xe=!0,Ma=null,Jt=!0,a=hu(t,null,l,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(rl(),l===n){t=ya(e,t,a);break e}mt(e,t,l,a)}t=t.child}return t;case 26:return Gi(e,t),e===null?(a=Of(t.type,null,t.pendingProps,null))?t.memoizedState=a:xe||(a=t.type,e=t.pendingProps,l=ar(te.current).createElement(a),l[dt]=t,l[jt]=e,gt(l,a,e),st(l),t.stateNode=l):t.memoizedState=Of(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Te(t),e===null&&xe&&(l=t.stateNode=zf(t.type,t.pendingProps,te.current),ft=t,Jt=!0,n=Qe,Ja(t.type)?(Ds=n,Qe=Zt(l.firstChild)):Qe=n),mt(e,t,t.pendingProps.children,a),Gi(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&xe&&((n=l=Qe)&&(l=xg(l,t.type,t.pendingProps,Jt),l!==null?(t.stateNode=l,ft=t,Qe=Zt(l.firstChild),Jt=!1,n=!0):n=!1),n||za(t)),Te(t),n=t.type,i=t.pendingProps,o=e!==null?e.memoizedProps:null,l=i.children,Ts(n,i)?l=null:o!==null&&Ts(n,o)&&(t.flags|=32),t.memoizedState!==null&&(n=No(e,t,qm,null,null,a),In._currentValue=n),Gi(e,t),mt(e,t,l,a),t.child;case 6:return e===null&&xe&&((e=a=Qe)&&(a=wg(a,t.pendingProps,Jt),a!==null?(t.stateNode=a,ft=t,Qe=null,e=!0):e=!1),e||za(t)),null;case 13:return vd(e,t,a);case 4:return L(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=fl(t,null,l,a):mt(e,t,l,a),t.child;case 11:return ud(e,t,t.type,t.pendingProps,a);case 7:return mt(e,t,t.pendingProps,a),t.child;case 8:return mt(e,t,t.pendingProps.children,a),t.child;case 12:return mt(e,t,t.pendingProps.children,a),t.child;case 10:return l=t.pendingProps,Da(t,t.type,l.value),mt(e,t,l.children,a),t.child;case 9:return n=t.type._context,l=t.pendingProps.children,sl(t),n=ht(n),l=l(n),t.flags|=1,mt(e,t,l,a),t.child;case 14:return dd(e,t,t.type,t.pendingProps,a);case 15:return fd(e,t,t.type,t.pendingProps,a);case 19:return wd(e,t,a);case 31:return Vm(e,t,a);case 22:return hd(e,t,a,t.pendingProps);case 24:return sl(t),l=ht(et),e===null?(n=po(),n===null&&(n=Be,i=mo(),n.pooledCache=i,i.refCount++,i!==null&&(n.pooledCacheLanes|=a),n=i),t.memoizedState={parent:l,cache:n},yo(t),Da(t,et,n)):((e.lanes&a)!==0&&(vo(e,t),Mn(t,null,null,a),En()),n=e.memoizedState,i=t.memoizedState,n.parent!==l?(n={parent:l,cache:l},t.memoizedState=n,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=n),Da(t,et,l)):(l=i.cache,Da(t,et,l),l!==n.cache&&ho(t,[et],a,!0))),mt(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(f(156,t.tag))}function va(e){e.flags|=4}function es(e,t,a,l,n){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(n&335544128)===n)if(e.stateNode.complete)e.flags|=8192;else if(Wd())e.flags|=8192;else throw dl=Ai,bo}else e.flags&=-16777217}function jd(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Gf(t))if(Wd())e.flags|=8192;else throw dl=Ai,bo}function Qi(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?li():536870912,e.lanes|=t,Xl|=t)}function Un(e,t){if(!xe)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Ke(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(t)for(var n=e.child;n!==null;)a|=n.lanes|n.childLanes,l|=n.subtreeFlags&65011712,l|=n.flags&65011712,n.return=e,n=n.sibling;else for(n=e.child;n!==null;)a|=n.lanes|n.childLanes,l|=n.subtreeFlags,l|=n.flags,n.return=e,n=n.sibling;return e.subtreeFlags|=l,e.childLanes=a,t}function Jm(e,t,a){var l=t.pendingProps;switch(oo(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(t),null;case 1:return Ke(t),null;case 3:return a=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),ga(et),le(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(ql(t)?va(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,co())),Ke(t),null;case 26:var n=t.type,i=t.memoizedState;return e===null?(va(t),i!==null?(Ke(t),jd(t,i)):(Ke(t),es(t,n,null,l,a))):i?i!==e.memoizedState?(va(t),Ke(t),jd(t,i)):(Ke(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&va(t),Ke(t),es(t,n,e,l,a)),null;case 27:if(B(t),a=te.current,n=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&va(t);else{if(!l){if(t.stateNode===null)throw Error(f(166));return Ke(t),null}e=Q.current,ql(t)?au(t):(e=zf(n,l,a),t.stateNode=e,va(t))}return Ke(t),null;case 5:if(B(t),n=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&va(t);else{if(!l){if(t.stateNode===null)throw Error(f(166));return Ke(t),null}if(i=Q.current,ql(t))au(t);else{var o=ar(te.current);switch(i){case 1:i=o.createElementNS("http://www.w3.org/2000/svg",n);break;case 2:i=o.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;default:switch(n){case"svg":i=o.createElementNS("http://www.w3.org/2000/svg",n);break;case"math":i=o.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;case"script":i=o.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild);break;case"select":i=typeof l.is=="string"?o.createElement("select",{is:l.is}):o.createElement("select"),l.multiple?i.multiple=!0:l.size&&(i.size=l.size);break;default:i=typeof l.is=="string"?o.createElement(n,{is:l.is}):o.createElement(n)}}i[dt]=t,i[jt]=l;e:for(o=t.child;o!==null;){if(o.tag===5||o.tag===6)i.appendChild(o.stateNode);else if(o.tag!==4&&o.tag!==27&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===t)break e;for(;o.sibling===null;){if(o.return===null||o.return===t)break e;o=o.return}o.sibling.return=o.return,o=o.sibling}t.stateNode=i;e:switch(gt(i,n,l),n){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&va(t)}}return Ke(t),es(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&va(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(f(166));if(e=te.current,ql(t)){if(e=t.stateNode,a=t.memoizedProps,l=null,n=ft,n!==null)switch(n.tag){case 27:case 5:l=n.memoizedProps}e[dt]=t,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||xf(e.nodeValue,a)),e||za(t,!0)}else e=ar(e).createTextNode(l),e[dt]=t,t.stateNode=e}return Ke(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(l=ql(t),a!==null){if(e===null){if(!l)throw Error(f(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(f(557));e[dt]=t}else rl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ke(t),e=!1}else a=co(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(Rt(t),t):(Rt(t),null);if((t.flags&128)!==0)throw Error(f(558))}return Ke(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(n=ql(t),l!==null&&l.dehydrated!==null){if(e===null){if(!n)throw Error(f(318));if(n=t.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(f(317));n[dt]=t}else rl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ke(t),n=!1}else n=co(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),n=!0;if(!n)return t.flags&256?(Rt(t),t):(Rt(t),null)}return Rt(t),(t.flags&128)!==0?(t.lanes=a,t):(a=l!==null,e=e!==null&&e.memoizedState!==null,a&&(l=t.child,n=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(n=l.alternate.memoizedState.cachePool.pool),i=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(i=l.memoizedState.cachePool.pool),i!==n&&(l.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),Qi(t,t.updateQueue),Ke(t),null);case 4:return le(),e===null&&Ss(t.stateNode.containerInfo),Ke(t),null;case 10:return ga(t.type),Ke(t),null;case 19:if(y(Fe),l=t.memoizedState,l===null)return Ke(t),null;if(n=(t.flags&128)!==0,i=l.rendering,i===null)if(n)Un(l,!1);else{if(Xe!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=Ci(e),i!==null){for(t.flags|=128,Un(l,!1),e=i.updateQueue,t.updateQueue=e,Qi(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)Fc(a,e),a=a.sibling;return R(Fe,Fe.current&1|2),xe&&ha(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&vt()>_i&&(t.flags|=128,n=!0,Un(l,!1),t.lanes=4194304)}else{if(!n)if(e=Ci(i),e!==null){if(t.flags|=128,n=!0,e=e.updateQueue,t.updateQueue=e,Qi(t,e),Un(l,!0),l.tail===null&&l.tailMode==="hidden"&&!i.alternate&&!xe)return Ke(t),null}else 2*vt()-l.renderingStartTime>_i&&a!==536870912&&(t.flags|=128,n=!0,Un(l,!1),t.lanes=4194304);l.isBackwards?(i.sibling=t.child,t.child=i):(e=l.last,e!==null?e.sibling=i:t.child=i,l.last=i)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=vt(),e.sibling=null,a=Fe.current,R(Fe,n?a&1|2:a&1),xe&&ha(t,l.treeForkCount),e):(Ke(t),null);case 22:case 23:return Rt(t),jo(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(a&536870912)!==0&&(t.flags&128)===0&&(Ke(t),t.subtreeFlags&6&&(t.flags|=8192)):Ke(t),a=t.updateQueue,a!==null&&Qi(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==a&&(t.flags|=2048),e!==null&&y(cl),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),ga(et),Ke(t),null;case 25:return null;case 30:return null}throw Error(f(156,t.tag))}function _m(e,t){switch(oo(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ga(et),le(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return B(t),null;case 31:if(t.memoizedState!==null){if(Rt(t),t.alternate===null)throw Error(f(340));rl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Rt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(f(340));rl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return y(Fe),null;case 4:return le(),null;case 10:return ga(t.type),null;case 22:case 23:return Rt(t),jo(),e!==null&&y(cl),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return ga(et),null;case 25:return null;default:return null}}function Ad(e,t){switch(oo(t),t.tag){case 3:ga(et),le();break;case 26:case 27:case 5:B(t);break;case 4:le();break;case 31:t.memoizedState!==null&&Rt(t);break;case 13:Rt(t);break;case 19:y(Fe);break;case 10:ga(t.type);break;case 22:case 23:Rt(t),jo(),e!==null&&y(cl);break;case 24:ga(et)}}function Ln(e,t){try{var a=t.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var n=l.next;a=n;do{if((a.tag&e)===e){l=void 0;var i=a.create,o=a.inst;l=i(),o.destroy=l}a=a.next}while(a!==n)}}catch(s){Me(t,t.return,s)}}function Ba(e,t,a){try{var l=t.updateQueue,n=l!==null?l.lastEffect:null;if(n!==null){var i=n.next;l=i;do{if((l.tag&e)===e){var o=l.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,n=t;var c=a,p=s;try{p()}catch(j){Me(n,c,j)}}}l=l.next}while(l!==i)}}catch(j){Me(t,t.return,j)}}function kd(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{gu(t,a)}catch(l){Me(e,e.return,l)}}}function Nd(e,t,a){a.props=ml(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){Me(e,t,l)}}function Bn(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(n){Me(e,t,n)}}function ia(e,t){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(n){Me(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(n){Me(e,t,n)}else a.current=null}function Td(e){var t=e.type,a=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(n){Me(e,e.return,n)}}function ts(e,t,a){try{var l=e.stateNode;mg(l,e.type,a,t),l[jt]=t}catch(n){Me(e,e.return,n)}}function Cd(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Ja(e.type)||e.tag===4}function as(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Cd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Ja(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ls(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=ua));else if(l!==4&&(l===27&&Ja(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(ls(e,t,a),e=e.sibling;e!==null;)ls(e,t,a),e=e.sibling}function Ki(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(l!==4&&(l===27&&Ja(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Ki(e,t,a),e=e.sibling;e!==null;)Ki(e,t,a),e=e.sibling}function Ed(e){var t=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,n=t.attributes;n.length;)t.removeAttributeNode(n[0]);gt(t,l,a),t[dt]=e,t[jt]=a}catch(i){Me(e,e.return,i)}}var xa=!1,lt=!1,ns=!1,Md=typeof WeakSet=="function"?WeakSet:Set,ct=null;function Zm(e,t){if(e=e.containerInfo,ks=cr,e=Kc(e),Ir(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var n=l.anchorOffset,i=l.focusNode;l=l.focusOffset;try{a.nodeType,i.nodeType}catch{a=null;break e}var o=0,s=-1,c=-1,p=0,j=0,N=e,b=null;t:for(;;){for(var v;N!==a||n!==0&&N.nodeType!==3||(s=o+n),N!==i||l!==0&&N.nodeType!==3||(c=o+l),N.nodeType===3&&(o+=N.nodeValue.length),(v=N.firstChild)!==null;)b=N,N=v;for(;;){if(N===e)break t;if(b===a&&++p===n&&(s=o),b===i&&++j===l&&(c=o),(v=N.nextSibling)!==null)break;N=b,b=N.parentNode}N=v}a=s===-1||c===-1?null:{start:s,end:c}}else a=null}a=a||{start:0,end:0}}else a=null;for(Ns={focusedElem:e,selectionRange:a},cr=!1,ct=t;ct!==null;)if(t=ct,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ct=e;else for(;ct!==null;){switch(t=ct,i=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)n=e[a],n.ref.impl=n.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&i!==null){e=void 0,a=t,n=i.memoizedProps,i=i.memoizedState,l=a.stateNode;try{var V=ml(a.type,n);e=l.getSnapshotBeforeUpdate(V,i),l.__reactInternalSnapshotBeforeUpdate=e}catch(W){Me(a,a.return,W)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)Es(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Es(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(f(163))}if(e=t.sibling,e!==null){e.return=t.return,ct=e;break}ct=t.return}}function zd(e,t,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:Sa(e,a),l&4&&Ln(5,a);break;case 1:if(Sa(e,a),l&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(o){Me(a,a.return,o)}else{var n=ml(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(n,t,e.__reactInternalSnapshotBeforeUpdate)}catch(o){Me(a,a.return,o)}}l&64&&kd(a),l&512&&Bn(a,a.return);break;case 3:if(Sa(e,a),l&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{gu(e,t)}catch(o){Me(a,a.return,o)}}break;case 27:t===null&&l&4&&Ed(a);case 26:case 5:Sa(e,a),t===null&&l&4&&Td(a),l&512&&Bn(a,a.return);break;case 12:Sa(e,a);break;case 31:Sa(e,a),l&4&&Od(e,a);break;case 13:Sa(e,a),l&4&&qd(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=ag.bind(null,a),Sg(e,a))));break;case 22:if(l=a.memoizedState!==null||xa,!l){t=t!==null&&t.memoizedState!==null||lt,n=xa;var i=lt;xa=l,(lt=t)&&!i?ja(e,a,(a.subtreeFlags&8772)!==0):Sa(e,a),xa=n,lt=i}break;case 30:break;default:Sa(e,a)}}function Dd(e){var t=e.alternate;t!==null&&(e.alternate=null,Dd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Rr(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ve=null,kt=!1;function wa(e,t,a){for(a=a.child;a!==null;)Rd(e,t,a),a=a.sibling}function Rd(e,t,a){if(Ue&&typeof Ue.onCommitFiberUnmount=="function")try{Ue.onCommitFiberUnmount(ot,a)}catch{}switch(a.tag){case 26:lt||ia(a,t),wa(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:lt||ia(a,t);var l=Ve,n=kt;Ja(a.type)&&(Ve=a.stateNode,kt=!1),wa(e,t,a),Zn(a.stateNode),Ve=l,kt=n;break;case 5:lt||ia(a,t);case 6:if(l=Ve,n=kt,Ve=null,wa(e,t,a),Ve=l,kt=n,Ve!==null)if(kt)try{(Ve.nodeType===9?Ve.body:Ve.nodeName==="HTML"?Ve.ownerDocument.body:Ve).removeChild(a.stateNode)}catch(i){Me(a,t,i)}else try{Ve.removeChild(a.stateNode)}catch(i){Me(a,t,i)}break;case 18:Ve!==null&&(kt?(e=Ve,Nf(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),an(e)):Nf(Ve,a.stateNode));break;case 4:l=Ve,n=kt,Ve=a.stateNode.containerInfo,kt=!0,wa(e,t,a),Ve=l,kt=n;break;case 0:case 11:case 14:case 15:Ba(2,a,t),lt||Ba(4,a,t),wa(e,t,a);break;case 1:lt||(ia(a,t),l=a.stateNode,typeof l.componentWillUnmount=="function"&&Nd(a,t,l)),wa(e,t,a);break;case 21:wa(e,t,a);break;case 22:lt=(l=lt)||a.memoizedState!==null,wa(e,t,a),lt=l;break;default:wa(e,t,a)}}function Od(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{an(e)}catch(a){Me(t,t.return,a)}}}function qd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{an(e)}catch(a){Me(t,t.return,a)}}function Xm(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Md),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Md),t;default:throw Error(f(435,e.tag))}}function Vi(e,t){var a=Xm(e);t.forEach(function(l){if(!a.has(l)){a.add(l);var n=lg.bind(null,e,l);l.then(n,n)}})}function Nt(e,t){var a=t.deletions;if(a!==null)for(var l=0;l<a.length;l++){var n=a[l],i=e,o=t,s=o;e:for(;s!==null;){switch(s.tag){case 27:if(Ja(s.type)){Ve=s.stateNode,kt=!1;break e}break;case 5:Ve=s.stateNode,kt=!1;break e;case 3:case 4:Ve=s.stateNode.containerInfo,kt=!0;break e}s=s.return}if(Ve===null)throw Error(f(160));Rd(i,o,n),Ve=null,kt=!1,i=n.alternate,i!==null&&(i.return=null),n.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Ud(t,e),t=t.sibling}var ea=null;function Ud(e,t){var a=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Nt(t,e),Tt(e),l&4&&(Ba(3,e,e.return),Ln(3,e),Ba(5,e,e.return));break;case 1:Nt(t,e),Tt(e),l&512&&(lt||a===null||ia(a,a.return)),l&64&&xa&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var n=ea;if(Nt(t,e),Tt(e),l&512&&(lt||a===null||ia(a,a.return)),l&4){var i=a!==null?a.memoizedState:null;if(l=e.memoizedState,a===null)if(l===null)if(e.stateNode===null){e:{l=e.type,a=e.memoizedProps,n=n.ownerDocument||n;t:switch(l){case"title":i=n.getElementsByTagName("title")[0],(!i||i[dn]||i[dt]||i.namespaceURI==="http://www.w3.org/2000/svg"||i.hasAttribute("itemprop"))&&(i=n.createElement(l),n.head.insertBefore(i,n.querySelector("head > title"))),gt(i,l,a),i[dt]=e,st(i),l=i;break e;case"link":var o=Lf("link","href",n).get(l+(a.href||""));if(o){for(var s=0;s<o.length;s++)if(i=o[s],i.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&i.getAttribute("rel")===(a.rel==null?null:a.rel)&&i.getAttribute("title")===(a.title==null?null:a.title)&&i.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){o.splice(s,1);break t}}i=n.createElement(l),gt(i,l,a),n.head.appendChild(i);break;case"meta":if(o=Lf("meta","content",n).get(l+(a.content||""))){for(s=0;s<o.length;s++)if(i=o[s],i.getAttribute("content")===(a.content==null?null:""+a.content)&&i.getAttribute("name")===(a.name==null?null:a.name)&&i.getAttribute("property")===(a.property==null?null:a.property)&&i.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&i.getAttribute("charset")===(a.charSet==null?null:a.charSet)){o.splice(s,1);break t}}i=n.createElement(l),gt(i,l,a),n.head.appendChild(i);break;default:throw Error(f(468,l))}i[dt]=e,st(i),l=i}e.stateNode=l}else Bf(n,e.type,e.stateNode);else e.stateNode=Uf(n,l,e.memoizedProps);else i!==l?(i===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):i.count--,l===null?Bf(n,e.type,e.stateNode):Uf(n,l,e.memoizedProps)):l===null&&e.stateNode!==null&&ts(e,e.memoizedProps,a.memoizedProps)}break;case 27:Nt(t,e),Tt(e),l&512&&(lt||a===null||ia(a,a.return)),a!==null&&l&4&&ts(e,e.memoizedProps,a.memoizedProps);break;case 5:if(Nt(t,e),Tt(e),l&512&&(lt||a===null||ia(a,a.return)),e.flags&32){n=e.stateNode;try{kl(n,"")}catch(V){Me(e,e.return,V)}}l&4&&e.stateNode!=null&&(n=e.memoizedProps,ts(e,n,a!==null?a.memoizedProps:n)),l&1024&&(ns=!0);break;case 6:if(Nt(t,e),Tt(e),l&4){if(e.stateNode===null)throw Error(f(162));l=e.memoizedProps,a=e.stateNode;try{a.nodeValue=l}catch(V){Me(e,e.return,V)}}break;case 3:if(ir=null,n=ea,ea=lr(t.containerInfo),Nt(t,e),ea=n,Tt(e),l&4&&a!==null&&a.memoizedState.isDehydrated)try{an(t.containerInfo)}catch(V){Me(e,e.return,V)}ns&&(ns=!1,Ld(e));break;case 4:l=ea,ea=lr(e.stateNode.containerInfo),Nt(t,e),Tt(e),ea=l;break;case 12:Nt(t,e),Tt(e);break;case 31:Nt(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Vi(e,l)));break;case 13:Nt(t,e),Tt(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Ji=vt()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Vi(e,l)));break;case 22:n=e.memoizedState!==null;var c=a!==null&&a.memoizedState!==null,p=xa,j=lt;if(xa=p||n,lt=j||c,Nt(t,e),lt=j,xa=p,Tt(e),l&8192)e:for(t=e.stateNode,t._visibility=n?t._visibility&-2:t._visibility|1,n&&(a===null||c||xa||lt||gl(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){c=a=t;try{if(i=c.stateNode,n)o=i.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none";else{s=c.stateNode;var N=c.memoizedProps.style,b=N!=null&&N.hasOwnProperty("display")?N.display:null;s.style.display=b==null||typeof b=="boolean"?"":(""+b).trim()}}catch(V){Me(c,c.return,V)}}}else if(t.tag===6){if(a===null){c=t;try{c.stateNode.nodeValue=n?"":c.memoizedProps}catch(V){Me(c,c.return,V)}}}else if(t.tag===18){if(a===null){c=t;try{var v=c.stateNode;n?Tf(v,!0):Tf(c.stateNode,!1)}catch(V){Me(c,c.return,V)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,Vi(e,a))));break;case 19:Nt(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Vi(e,l)));break;case 30:break;case 21:break;default:Nt(t,e),Tt(e)}}function Tt(e){var t=e.flags;if(t&2){try{for(var a,l=e.return;l!==null;){if(Cd(l)){a=l;break}l=l.return}if(a==null)throw Error(f(160));switch(a.tag){case 27:var n=a.stateNode,i=as(e);Ki(e,i,n);break;case 5:var o=a.stateNode;a.flags&32&&(kl(o,""),a.flags&=-33);var s=as(e);Ki(e,s,o);break;case 3:case 4:var c=a.stateNode.containerInfo,p=as(e);ls(e,p,c);break;default:throw Error(f(161))}}catch(j){Me(e,e.return,j)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ld(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Ld(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Sa(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)zd(e,t.alternate,t),t=t.sibling}function gl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Ba(4,t,t.return),gl(t);break;case 1:ia(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Nd(t,t.return,a),gl(t);break;case 27:Zn(t.stateNode);case 26:case 5:ia(t,t.return),gl(t);break;case 22:t.memoizedState===null&&gl(t);break;case 30:gl(t);break;default:gl(t)}e=e.sibling}}function ja(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,n=e,i=t,o=i.flags;switch(i.tag){case 0:case 11:case 15:ja(n,i,a),Ln(4,i);break;case 1:if(ja(n,i,a),l=i,n=l.stateNode,typeof n.componentDidMount=="function")try{n.componentDidMount()}catch(p){Me(l,l.return,p)}if(l=i,n=l.updateQueue,n!==null){var s=l.stateNode;try{var c=n.shared.hiddenCallbacks;if(c!==null)for(n.shared.hiddenCallbacks=null,n=0;n<c.length;n++)mu(c[n],s)}catch(p){Me(l,l.return,p)}}a&&o&64&&kd(i),Bn(i,i.return);break;case 27:Ed(i);case 26:case 5:ja(n,i,a),a&&l===null&&o&4&&Td(i),Bn(i,i.return);break;case 12:ja(n,i,a);break;case 31:ja(n,i,a),a&&o&4&&Od(n,i);break;case 13:ja(n,i,a),a&&o&4&&qd(n,i);break;case 22:i.memoizedState===null&&ja(n,i,a),Bn(i,i.return);break;case 30:break;default:ja(n,i,a)}t=t.sibling}}function is(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&An(a))}function rs(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&An(e))}function ta(e,t,a,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Bd(e,t,a,l),t=t.sibling}function Bd(e,t,a,l){var n=t.flags;switch(t.tag){case 0:case 11:case 15:ta(e,t,a,l),n&2048&&Ln(9,t);break;case 1:ta(e,t,a,l);break;case 3:ta(e,t,a,l),n&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&An(e)));break;case 12:if(n&2048){ta(e,t,a,l),e=t.stateNode;try{var i=t.memoizedProps,o=i.id,s=i.onPostCommit;typeof s=="function"&&s(o,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(c){Me(t,t.return,c)}}else ta(e,t,a,l);break;case 31:ta(e,t,a,l);break;case 13:ta(e,t,a,l);break;case 23:break;case 22:i=t.stateNode,o=t.alternate,t.memoizedState!==null?i._visibility&2?ta(e,t,a,l):Gn(e,t):i._visibility&2?ta(e,t,a,l):(i._visibility|=2,Jl(e,t,a,l,(t.subtreeFlags&10256)!==0||!1)),n&2048&&is(o,t);break;case 24:ta(e,t,a,l),n&2048&&rs(t.alternate,t);break;default:ta(e,t,a,l)}}function Jl(e,t,a,l,n){for(n=n&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var i=e,o=t,s=a,c=l,p=o.flags;switch(o.tag){case 0:case 11:case 15:Jl(i,o,s,c,n),Ln(8,o);break;case 23:break;case 22:var j=o.stateNode;o.memoizedState!==null?j._visibility&2?Jl(i,o,s,c,n):Gn(i,o):(j._visibility|=2,Jl(i,o,s,c,n)),n&&p&2048&&is(o.alternate,o);break;case 24:Jl(i,o,s,c,n),n&&p&2048&&rs(o.alternate,o);break;default:Jl(i,o,s,c,n)}t=t.sibling}}function Gn(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,l=t,n=l.flags;switch(l.tag){case 22:Gn(a,l),n&2048&&is(l.alternate,l);break;case 24:Gn(a,l),n&2048&&rs(l.alternate,l);break;default:Gn(a,l)}t=t.sibling}}var Hn=8192;function _l(e,t,a){if(e.subtreeFlags&Hn)for(e=e.child;e!==null;)Gd(e,t,a),e=e.sibling}function Gd(e,t,a){switch(e.tag){case 26:_l(e,t,a),e.flags&Hn&&e.memoizedState!==null&&Og(a,ea,e.memoizedState,e.memoizedProps);break;case 5:_l(e,t,a);break;case 3:case 4:var l=ea;ea=lr(e.stateNode.containerInfo),_l(e,t,a),ea=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=Hn,Hn=16777216,_l(e,t,a),Hn=l):_l(e,t,a));break;default:_l(e,t,a)}}function Hd(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Qn(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];ct=l,Kd(l,e)}Hd(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Qd(e),e=e.sibling}function Qd(e){switch(e.tag){case 0:case 11:case 15:Qn(e),e.flags&2048&&Ba(9,e,e.return);break;case 3:Qn(e);break;case 12:Qn(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Yi(e)):Qn(e);break;default:Qn(e)}}function Yi(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];ct=l,Kd(l,e)}Hd(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Ba(8,t,t.return),Yi(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,Yi(t));break;default:Yi(t)}e=e.sibling}}function Kd(e,t){for(;ct!==null;){var a=ct;switch(a.tag){case 0:case 11:case 15:Ba(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:An(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,ct=l;else e:for(a=e;ct!==null;){l=ct;var n=l.sibling,i=l.return;if(Dd(l),l===a){ct=null;break e}if(n!==null){n.return=i,ct=n;break e}ct=i}}}var Wm={getCacheForType:function(e){var t=ht(et),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return ht(et).controller.signal}},Im=typeof WeakMap=="function"?WeakMap:Map,ke=0,Be=null,pe=null,ye=0,Ee=0,Ot=null,Ga=!1,Zl=!1,os=!1,Aa=0,Xe=0,Ha=0,pl=0,ss=0,qt=0,Xl=0,Kn=null,Ct=null,cs=!1,Ji=0,Vd=0,_i=1/0,Zi=null,Qa=null,nt=0,Ka=null,Wl=null,ka=0,us=0,ds=null,Yd=null,Vn=0,fs=null;function Ut(){return(ke&2)!==0&&ye!==0?ye&-ye:w.T!==null?ys():rc()}function Jd(){if(qt===0)if((ye&536870912)===0||xe){var e=ut;ut<<=1,(ut&3932160)===0&&(ut=262144),qt=e}else qt=536870912;return e=Dt.current,e!==null&&(e.flags|=32),qt}function Et(e,t,a){(e===Be&&(Ee===2||Ee===9)||e.cancelPendingCommit!==null)&&(Il(e,0),Va(e,ye,qt,!1)),un(e,a),((ke&2)===0||e!==Be)&&(e===Be&&((ke&2)===0&&(pl|=a),Xe===4&&Va(e,ye,qt,!1)),ra(e))}function _d(e,t,a){if((ke&6)!==0)throw Error(f(327));var l=!a&&(t&127)===0&&(t&e.expiredLanes)===0||sa(e,t),n=l?$m(e,t):ms(e,t,!0),i=l;do{if(n===0){Zl&&!l&&Va(e,t,0,!1);break}else{if(a=e.current.alternate,i&&!Fm(a)){n=ms(e,t,!1),i=!1;continue}if(n===2){if(i=t,e.errorRecoveryDisabledLanes&i)var o=0;else o=e.pendingLanes&-536870913,o=o!==0?o:o&536870912?536870912:0;if(o!==0){t=o;e:{var s=e;n=Kn;var c=s.current.memoizedState.isDehydrated;if(c&&(Il(s,o).flags|=256),o=ms(s,o,!1),o!==2){if(os&&!c){s.errorRecoveryDisabledLanes|=i,pl|=i,n=4;break e}i=Ct,Ct=n,i!==null&&(Ct===null?Ct=i:Ct.push.apply(Ct,i))}n=o}if(i=!1,n!==2)continue}}if(n===1){Il(e,0),Va(e,t,0,!0);break}e:{switch(l=e,i=n,i){case 0:case 1:throw Error(f(345));case 4:if((t&4194048)!==t)break;case 6:Va(l,t,qt,!Ga);break e;case 2:Ct=null;break;case 3:case 5:break;default:throw Error(f(329))}if((t&62914560)===t&&(n=Ji+300-vt(),10<n)){if(Va(l,t,qt,!Ga),aa(l,0,!0)!==0)break e;ka=t,l.timeoutHandle=Af(Zd.bind(null,l,a,Ct,Zi,cs,t,qt,pl,Xl,Ga,i,"Throttled",-0,0),n);break e}Zd(l,a,Ct,Zi,cs,t,qt,pl,Xl,Ga,i,null,-0,0)}}break}while(!0);ra(e)}function Zd(e,t,a,l,n,i,o,s,c,p,j,N,b,v){if(e.timeoutHandle=-1,N=t.subtreeFlags,N&8192||(N&16785408)===16785408){N={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ua},Gd(t,i,N);var V=(i&62914560)===i?Ji-vt():(i&4194048)===i?Vd-vt():0;if(V=qg(N,V),V!==null){ka=i,e.cancelPendingCommit=V(tf.bind(null,e,t,i,a,l,n,o,s,c,j,N,null,b,v)),Va(e,i,o,!p);return}}tf(e,t,i,a,l,n,o,s,c)}function Fm(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var n=a[l],i=n.getSnapshot;n=n.value;try{if(!Mt(i(),n))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Va(e,t,a,l){t&=~ss,t&=~pl,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var n=t;0<n;){var i=31-Le(n),o=1<<i;l[i]=-1,n&=~o}a!==0&&lc(e,a,t)}function Xi(){return(ke&6)===0?(Yn(0),!1):!0}function hs(){if(pe!==null){if(Ee===0)var e=pe.return;else e=pe,ma=ol=null,Eo(e),Hl=null,Nn=0,e=pe;for(;e!==null;)Ad(e.alternate,e),e=e.return;pe=null}}function Il(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,bg(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ka=0,hs(),Be=e,pe=a=fa(e.current,null),ye=t,Ee=0,Ot=null,Ga=!1,Zl=sa(e,t),os=!1,Xl=qt=ss=pl=Ha=Xe=0,Ct=Kn=null,cs=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var n=31-Le(l),i=1<<n;t|=e[n],l&=~i}return Aa=t,gi(),a}function Xd(e,t){se=null,w.H=On,t===Gl||t===ji?(t=uu(),Ee=3):t===bo?(t=uu(),Ee=4):Ee=t===Jo?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Ot=t,pe===null&&(Xe=1,Li(e,Kt(t,e.current)))}function Wd(){var e=Dt.current;return e===null?!0:(ye&4194048)===ye?_t===null:(ye&62914560)===ye||(ye&536870912)!==0?e===_t:!1}function Id(){var e=w.H;return w.H=On,e===null?On:e}function Fd(){var e=w.A;return w.A=Wm,e}function Wi(){Xe=4,Ga||(ye&4194048)!==ye&&Dt.current!==null||(Zl=!0),(Ha&134217727)===0&&(pl&134217727)===0||Be===null||Va(Be,ye,qt,!1)}function ms(e,t,a){var l=ke;ke|=2;var n=Id(),i=Fd();(Be!==e||ye!==t)&&(Zi=null,Il(e,t)),t=!1;var o=Xe;e:do try{if(Ee!==0&&pe!==null){var s=pe,c=Ot;switch(Ee){case 8:hs(),o=6;break e;case 3:case 2:case 9:case 6:Dt.current===null&&(t=!0);var p=Ee;if(Ee=0,Ot=null,Fl(e,s,c,p),a&&Zl){o=0;break e}break;default:p=Ee,Ee=0,Ot=null,Fl(e,s,c,p)}}Pm(),o=Xe;break}catch(j){Xd(e,j)}while(!0);return t&&e.shellSuspendCounter++,ma=ol=null,ke=l,w.H=n,w.A=i,pe===null&&(Be=null,ye=0,gi()),o}function Pm(){for(;pe!==null;)Pd(pe)}function $m(e,t){var a=ke;ke|=2;var l=Id(),n=Fd();Be!==e||ye!==t?(Zi=null,_i=vt()+500,Il(e,t)):Zl=sa(e,t);e:do try{if(Ee!==0&&pe!==null){t=pe;var i=Ot;t:switch(Ee){case 1:Ee=0,Ot=null,Fl(e,t,i,1);break;case 2:case 9:if(su(i)){Ee=0,Ot=null,$d(t);break}t=function(){Ee!==2&&Ee!==9||Be!==e||(Ee=7),ra(e)},i.then(t,t);break e;case 3:Ee=7;break e;case 4:Ee=5;break e;case 7:su(i)?(Ee=0,Ot=null,$d(t)):(Ee=0,Ot=null,Fl(e,t,i,7));break;case 5:var o=null;switch(pe.tag){case 26:o=pe.memoizedState;case 5:case 27:var s=pe;if(o?Gf(o):s.stateNode.complete){Ee=0,Ot=null;var c=s.sibling;if(c!==null)pe=c;else{var p=s.return;p!==null?(pe=p,Ii(p)):pe=null}break t}}Ee=0,Ot=null,Fl(e,t,i,5);break;case 6:Ee=0,Ot=null,Fl(e,t,i,6);break;case 8:hs(),Xe=6;break e;default:throw Error(f(462))}}eg();break}catch(j){Xd(e,j)}while(!0);return ma=ol=null,w.H=l,w.A=n,ke=a,pe!==null?0:(Be=null,ye=0,gi(),Xe)}function eg(){for(;pe!==null&&!Nr();)Pd(pe)}function Pd(e){var t=Sd(e.alternate,e,Aa);e.memoizedProps=e.pendingProps,t===null?Ii(e):pe=t}function $d(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=pd(a,t,t.pendingProps,t.type,void 0,ye);break;case 11:t=pd(a,t,t.pendingProps,t.type.render,t.ref,ye);break;case 5:Eo(t);default:Ad(a,t),t=pe=Fc(t,Aa),t=Sd(a,t,Aa)}e.memoizedProps=e.pendingProps,t===null?Ii(e):pe=t}function Fl(e,t,a,l){ma=ol=null,Eo(t),Hl=null,Nn=0;var n=t.return;try{if(Km(e,n,t,a,ye)){Xe=1,Li(e,Kt(a,e.current)),pe=null;return}}catch(i){if(n!==null)throw pe=n,i;Xe=1,Li(e,Kt(a,e.current)),pe=null;return}t.flags&32768?(xe||l===1?e=!0:Zl||(ye&536870912)!==0?e=!1:(Ga=e=!0,(l===2||l===9||l===3||l===6)&&(l=Dt.current,l!==null&&l.tag===13&&(l.flags|=16384))),ef(t,e)):Ii(t)}function Ii(e){var t=e;do{if((t.flags&32768)!==0){ef(t,Ga);return}e=t.return;var a=Jm(t.alternate,t,Aa);if(a!==null){pe=a;return}if(t=t.sibling,t!==null){pe=t;return}pe=t=e}while(t!==null);Xe===0&&(Xe=5)}function ef(e,t){do{var a=_m(e.alternate,e);if(a!==null){a.flags&=32767,pe=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){pe=e;return}pe=e=a}while(e!==null);Xe=6,pe=null}function tf(e,t,a,l,n,i,o,s,c){e.cancelPendingCommit=null;do Fi();while(nt!==0);if((ke&6)!==0)throw Error(f(327));if(t!==null){if(t===e.current)throw Error(f(177));if(i=t.lanes|t.childLanes,i|=to,Rh(e,a,i,o,s,c),e===Be&&(pe=Be=null,ye=0),Wl=t,Ka=e,ka=a,us=i,ds=n,Yd=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,ng(Z,function(){return of(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=w.T,w.T=null,n=O.p,O.p=2,o=ke,ke|=4;try{Zm(e,t,a)}finally{ke=o,O.p=n,w.T=l}}nt=1,af(),lf(),nf()}}function af(){if(nt===1){nt=0;var e=Ka,t=Wl,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=w.T,w.T=null;var l=O.p;O.p=2;var n=ke;ke|=4;try{Ud(t,e);var i=Ns,o=Kc(e.containerInfo),s=i.focusedElem,c=i.selectionRange;if(o!==s&&s&&s.ownerDocument&&Qc(s.ownerDocument.documentElement,s)){if(c!==null&&Ir(s)){var p=c.start,j=c.end;if(j===void 0&&(j=p),"selectionStart"in s)s.selectionStart=p,s.selectionEnd=Math.min(j,s.value.length);else{var N=s.ownerDocument||document,b=N&&N.defaultView||window;if(b.getSelection){var v=b.getSelection(),V=s.textContent.length,W=Math.min(c.start,V),Oe=c.end===void 0?W:Math.min(c.end,V);!v.extend&&W>Oe&&(o=Oe,Oe=W,W=o);var m=Hc(s,W),d=Hc(s,Oe);if(m&&d&&(v.rangeCount!==1||v.anchorNode!==m.node||v.anchorOffset!==m.offset||v.focusNode!==d.node||v.focusOffset!==d.offset)){var g=N.createRange();g.setStart(m.node,m.offset),v.removeAllRanges(),W>Oe?(v.addRange(g),v.extend(d.node,d.offset)):(g.setEnd(d.node,d.offset),v.addRange(g))}}}}for(N=[],v=s;v=v.parentNode;)v.nodeType===1&&N.push({element:v,left:v.scrollLeft,top:v.scrollTop});for(typeof s.focus=="function"&&s.focus(),s=0;s<N.length;s++){var k=N[s];k.element.scrollLeft=k.left,k.element.scrollTop=k.top}}cr=!!ks,Ns=ks=null}finally{ke=n,O.p=l,w.T=a}}e.current=t,nt=2}}function lf(){if(nt===2){nt=0;var e=Ka,t=Wl,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=w.T,w.T=null;var l=O.p;O.p=2;var n=ke;ke|=4;try{zd(e,t.alternate,t)}finally{ke=n,O.p=l,w.T=a}}nt=3}}function nf(){if(nt===4||nt===3){nt=0,Tr();var e=Ka,t=Wl,a=ka,l=Yd;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?nt=5:(nt=0,Wl=Ka=null,rf(e,e.pendingLanes));var n=e.pendingLanes;if(n===0&&(Qa=null),zr(a),t=t.stateNode,Ue&&typeof Ue.onCommitFiberRoot=="function")try{Ue.onCommitFiberRoot(ot,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=w.T,n=O.p,O.p=2,w.T=null;try{for(var i=e.onRecoverableError,o=0;o<l.length;o++){var s=l[o];i(s.value,{componentStack:s.stack})}}finally{w.T=t,O.p=n}}(ka&3)!==0&&Fi(),ra(e),n=e.pendingLanes,(a&261930)!==0&&(n&42)!==0?e===fs?Vn++:(Vn=0,fs=e):Vn=0,Yn(0)}}function rf(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,An(t)))}function Fi(){return af(),lf(),nf(),of()}function of(){if(nt!==5)return!1;var e=Ka,t=us;us=0;var a=zr(ka),l=w.T,n=O.p;try{O.p=32>a?32:a,w.T=null,a=ds,ds=null;var i=Ka,o=ka;if(nt=0,Wl=Ka=null,ka=0,(ke&6)!==0)throw Error(f(331));var s=ke;if(ke|=4,Qd(i.current),Bd(i,i.current,o,a),ke=s,Yn(0,!1),Ue&&typeof Ue.onPostCommitFiberRoot=="function")try{Ue.onPostCommitFiberRoot(ot,i)}catch{}return!0}finally{O.p=n,w.T=l,rf(e,t)}}function sf(e,t,a){t=Kt(a,t),t=Yo(e.stateNode,t,2),e=qa(e,t,2),e!==null&&(un(e,2),ra(e))}function Me(e,t,a){if(e.tag===3)sf(e,e,a);else for(;t!==null;){if(t.tag===3){sf(t,e,a);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Qa===null||!Qa.has(l))){e=Kt(a,e),a=sd(2),l=qa(t,a,2),l!==null&&(cd(a,l,t,e),un(l,2),ra(l));break}}t=t.return}}function gs(e,t,a){var l=e.pingCache;if(l===null){l=e.pingCache=new Im;var n=new Set;l.set(t,n)}else n=l.get(t),n===void 0&&(n=new Set,l.set(t,n));n.has(a)||(os=!0,n.add(a),e=tg.bind(null,e,t,a),t.then(e,e))}function tg(e,t,a){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Be===e&&(ye&a)===a&&(Xe===4||Xe===3&&(ye&62914560)===ye&&300>vt()-Ji?(ke&2)===0&&Il(e,0):ss|=a,Xl===ye&&(Xl=0)),ra(e)}function cf(e,t){t===0&&(t=li()),e=nl(e,t),e!==null&&(un(e,t),ra(e))}function ag(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),cf(e,a)}function lg(e,t){var a=0;switch(e.tag){case 31:case 13:var l=e.stateNode,n=e.memoizedState;n!==null&&(a=n.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(f(314))}l!==null&&l.delete(t),cf(e,a)}function ng(e,t){return $a(e,t)}var Pi=null,Pl=null,ps=!1,$i=!1,bs=!1,Ya=0;function ra(e){e!==Pl&&e.next===null&&(Pl===null?Pi=Pl=e:Pl=Pl.next=e),$i=!0,ps||(ps=!0,rg())}function Yn(e,t){if(!bs&&$i){bs=!0;do for(var a=!1,l=Pi;l!==null;){if(e!==0){var n=l.pendingLanes;if(n===0)var i=0;else{var o=l.suspendedLanes,s=l.pingedLanes;i=(1<<31-Le(42|e)+1)-1,i&=n&~(o&~s),i=i&201326741?i&201326741|1:i?i|2:0}i!==0&&(a=!0,hf(l,i))}else i=ye,i=aa(l,l===Be?i:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(i&3)===0||sa(l,i)||(a=!0,hf(l,i));l=l.next}while(a);bs=!1}}function ig(){uf()}function uf(){$i=ps=!1;var e=0;Ya!==0&&pg()&&(e=Ya);for(var t=vt(),a=null,l=Pi;l!==null;){var n=l.next,i=df(l,t);i===0?(l.next=null,a===null?Pi=n:a.next=n,n===null&&(Pl=a)):(a=l,(e!==0||(i&3)!==0)&&($i=!0)),l=n}nt!==0&&nt!==5||Yn(e),Ya!==0&&(Ya=0)}function df(e,t){for(var a=e.suspendedLanes,l=e.pingedLanes,n=e.expirationTimes,i=e.pendingLanes&-62914561;0<i;){var o=31-Le(i),s=1<<o,c=n[o];c===-1?((s&a)===0||(s&l)!==0)&&(n[o]=Cr(s,t)):c<=t&&(e.expiredLanes|=s),i&=~s}if(t=Be,a=ye,a=aa(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===t&&(Ee===2||Ee===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&sn(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||sa(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(l!==null&&sn(l),zr(a)){case 2:case 8:a=M;break;case 32:a=Z;break;case 268435456:a=fe;break;default:a=Z}return l=ff.bind(null,e),a=$a(a,l),e.callbackPriority=t,e.callbackNode=a,t}return l!==null&&l!==null&&sn(l),e.callbackPriority=2,e.callbackNode=null,2}function ff(e,t){if(nt!==0&&nt!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Fi()&&e.callbackNode!==a)return null;var l=ye;return l=aa(e,e===Be?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(_d(e,l,t),df(e,vt()),e.callbackNode!=null&&e.callbackNode===a?ff.bind(null,e):null)}function hf(e,t){if(Fi())return null;_d(e,t,!0)}function rg(){yg(function(){(ke&6)!==0?$a(S,ig):uf()})}function ys(){if(Ya===0){var e=Ll;e===0&&(e=Ft,Ft<<=1,(Ft&261888)===0&&(Ft=256)),Ya=e}return Ya}function mf(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:oi(""+e)}function gf(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function og(e,t,a,l,n){if(t==="submit"&&a&&a.stateNode===n){var i=mf((n[jt]||null).action),o=l.submitter;o&&(t=(t=o[jt]||null)?mf(t.formAction):o.getAttribute("formAction"),t!==null&&(i=t,o=null));var s=new di("action","action",null,l,n);e.push({event:s,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Ya!==0){var c=o?gf(n,o):new FormData(n);Bo(a,{pending:!0,data:c,method:n.method,action:i},null,c)}}else typeof i=="function"&&(s.preventDefault(),c=o?gf(n,o):new FormData(n),Bo(a,{pending:!0,data:c,method:n.method,action:i},i,c))},currentTarget:n}]})}}for(var vs=0;vs<eo.length;vs++){var xs=eo[vs],sg=xs.toLowerCase(),cg=xs[0].toUpperCase()+xs.slice(1);$t(sg,"on"+cg)}$t(Jc,"onAnimationEnd"),$t(_c,"onAnimationIteration"),$t(Zc,"onAnimationStart"),$t("dblclick","onDoubleClick"),$t("focusin","onFocus"),$t("focusout","onBlur"),$t(km,"onTransitionRun"),$t(Nm,"onTransitionStart"),$t(Tm,"onTransitionCancel"),$t(Xc,"onTransitionEnd"),jl("onMouseEnter",["mouseout","mouseover"]),jl("onMouseLeave",["mouseout","mouseover"]),jl("onPointerEnter",["pointerout","pointerover"]),jl("onPointerLeave",["pointerout","pointerover"]),el("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),el("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),el("onBeforeInput",["compositionend","keypress","textInput","paste"]),el("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),el("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),el("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Jn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ug=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Jn));function pf(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],n=l.event;l=l.listeners;e:{var i=void 0;if(t)for(var o=l.length-1;0<=o;o--){var s=l[o],c=s.instance,p=s.currentTarget;if(s=s.listener,c!==i&&n.isPropagationStopped())break e;i=s,n.currentTarget=p;try{i(n)}catch(j){mi(j)}n.currentTarget=null,i=c}else for(o=0;o<l.length;o++){if(s=l[o],c=s.instance,p=s.currentTarget,s=s.listener,c!==i&&n.isPropagationStopped())break e;i=s,n.currentTarget=p;try{i(n)}catch(j){mi(j)}n.currentTarget=null,i=c}}}}function be(e,t){var a=t[Dr];a===void 0&&(a=t[Dr]=new Set);var l=e+"__bubble";a.has(l)||(bf(t,e,2,!1),a.add(l))}function ws(e,t,a){var l=0;t&&(l|=4),bf(a,e,l,t)}var er="_reactListening"+Math.random().toString(36).slice(2);function Ss(e){if(!e[er]){e[er]=!0,cc.forEach(function(a){a!=="selectionchange"&&(ug.has(a)||ws(a,!1,e),ws(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[er]||(t[er]=!0,ws("selectionchange",!1,t))}}function bf(e,t,a,l){switch(_f(t)){case 2:var n=Bg;break;case 8:n=Gg;break;default:n=Ls}a=n.bind(null,t,a,e),n=void 0,!Qr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(n=!0),l?n!==void 0?e.addEventListener(t,a,{capture:!0,passive:n}):e.addEventListener(t,a,!0):n!==void 0?e.addEventListener(t,a,{passive:n}):e.addEventListener(t,a,!1)}function js(e,t,a,l,n){var i=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var o=l.tag;if(o===3||o===4){var s=l.stateNode.containerInfo;if(s===n)break;if(o===4)for(o=l.return;o!==null;){var c=o.tag;if((c===3||c===4)&&o.stateNode.containerInfo===n)return;o=o.return}for(;s!==null;){if(o=xl(s),o===null)return;if(c=o.tag,c===5||c===6||c===26||c===27){l=i=o;continue e}s=s.parentNode}}l=l.return}wc(function(){var p=i,j=Gr(a),N=[];e:{var b=Wc.get(e);if(b!==void 0){var v=di,V=e;switch(e){case"keypress":if(ci(a)===0)break e;case"keydown":case"keyup":v=lm;break;case"focusin":V="focus",v=Jr;break;case"focusout":V="blur",v=Jr;break;case"beforeblur":case"afterblur":v=Jr;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":v=Ac;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":v=Jh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":v=rm;break;case Jc:case _c:case Zc:v=Xh;break;case Xc:v=sm;break;case"scroll":case"scrollend":v=Vh;break;case"wheel":v=um;break;case"copy":case"cut":case"paste":v=Ih;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":v=Nc;break;case"toggle":case"beforetoggle":v=fm}var W=(t&4)!==0,Oe=!W&&(e==="scroll"||e==="scrollend"),m=W?b!==null?b+"Capture":null:b;W=[];for(var d=p,g;d!==null;){var k=d;if(g=k.stateNode,k=k.tag,k!==5&&k!==26&&k!==27||g===null||m===null||(k=hn(d,m),k!=null&&W.push(_n(d,k,g))),Oe)break;d=d.return}0<W.length&&(b=new v(b,V,null,a,j),N.push({event:b,listeners:W}))}}if((t&7)===0){e:{if(b=e==="mouseover"||e==="pointerover",v=e==="mouseout"||e==="pointerout",b&&a!==Br&&(V=a.relatedTarget||a.fromElement)&&(xl(V)||V[vl]))break e;if((v||b)&&(b=j.window===j?j:(b=j.ownerDocument)?b.defaultView||b.parentWindow:window,v?(V=a.relatedTarget||a.toElement,v=p,V=V?xl(V):null,V!==null&&(Oe=q(V),W=V.tag,V!==Oe||W!==5&&W!==27&&W!==6)&&(V=null)):(v=null,V=p),v!==V)){if(W=Ac,k="onMouseLeave",m="onMouseEnter",d="mouse",(e==="pointerout"||e==="pointerover")&&(W=Nc,k="onPointerLeave",m="onPointerEnter",d="pointer"),Oe=v==null?b:fn(v),g=V==null?b:fn(V),b=new W(k,d+"leave",v,a,j),b.target=Oe,b.relatedTarget=g,k=null,xl(j)===p&&(W=new W(m,d+"enter",V,a,j),W.target=g,W.relatedTarget=Oe,k=W),Oe=k,v&&V)t:{for(W=dg,m=v,d=V,g=0,k=m;k;k=W(k))g++;k=0;for(var X=d;X;X=W(X))k++;for(;0<g-k;)m=W(m),g--;for(;0<k-g;)d=W(d),k--;for(;g--;){if(m===d||d!==null&&m===d.alternate){W=m;break t}m=W(m),d=W(d)}W=null}else W=null;v!==null&&yf(N,b,v,W,!1),V!==null&&Oe!==null&&yf(N,Oe,V,W,!0)}}e:{if(b=p?fn(p):window,v=b.nodeName&&b.nodeName.toLowerCase(),v==="select"||v==="input"&&b.type==="file")var Se=Oc;else if(Dc(b))if(qc)Se=Sm;else{Se=xm;var J=vm}else v=b.nodeName,!v||v.toLowerCase()!=="input"||b.type!=="checkbox"&&b.type!=="radio"?p&&Lr(p.elementType)&&(Se=Oc):Se=wm;if(Se&&(Se=Se(e,p))){Rc(N,Se,a,j);break e}J&&J(e,b,p),e==="focusout"&&p&&b.type==="number"&&p.memoizedProps.value!=null&&Ur(b,"number",b.value)}switch(J=p?fn(p):window,e){case"focusin":(Dc(J)||J.contentEditable==="true")&&(El=J,Fr=p,wn=null);break;case"focusout":wn=Fr=El=null;break;case"mousedown":Pr=!0;break;case"contextmenu":case"mouseup":case"dragend":Pr=!1,Vc(N,a,j);break;case"selectionchange":if(Am)break;case"keydown":case"keyup":Vc(N,a,j)}var ue;if(Zr)e:{switch(e){case"compositionstart":var ve="onCompositionStart";break e;case"compositionend":ve="onCompositionEnd";break e;case"compositionupdate":ve="onCompositionUpdate";break e}ve=void 0}else Cl?Mc(e,a)&&(ve="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(ve="onCompositionStart");ve&&(Tc&&a.locale!=="ko"&&(Cl||ve!=="onCompositionStart"?ve==="onCompositionEnd"&&Cl&&(ue=Sc()):(Ca=j,Kr="value"in Ca?Ca.value:Ca.textContent,Cl=!0)),J=tr(p,ve),0<J.length&&(ve=new kc(ve,e,null,a,j),N.push({event:ve,listeners:J}),ue?ve.data=ue:(ue=zc(a),ue!==null&&(ve.data=ue)))),(ue=mm?gm(e,a):pm(e,a))&&(ve=tr(p,"onBeforeInput"),0<ve.length&&(J=new kc("onBeforeInput","beforeinput",null,a,j),N.push({event:J,listeners:ve}),J.data=ue)),og(N,e,p,a,j)}pf(N,t)})}function _n(e,t,a){return{instance:e,listener:t,currentTarget:a}}function tr(e,t){for(var a=t+"Capture",l=[];e!==null;){var n=e,i=n.stateNode;if(n=n.tag,n!==5&&n!==26&&n!==27||i===null||(n=hn(e,a),n!=null&&l.unshift(_n(e,n,i)),n=hn(e,t),n!=null&&l.push(_n(e,n,i))),e.tag===3)return l;e=e.return}return[]}function dg(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function yf(e,t,a,l,n){for(var i=t._reactName,o=[];a!==null&&a!==l;){var s=a,c=s.alternate,p=s.stateNode;if(s=s.tag,c!==null&&c===l)break;s!==5&&s!==26&&s!==27||p===null||(c=p,n?(p=hn(a,i),p!=null&&o.unshift(_n(a,p,c))):n||(p=hn(a,i),p!=null&&o.push(_n(a,p,c)))),a=a.return}o.length!==0&&e.push({event:t,listeners:o})}var fg=/\r\n?/g,hg=/\u0000|\uFFFD/g;function vf(e){return(typeof e=="string"?e:""+e).replace(fg,`
`).replace(hg,"")}function xf(e,t){return t=vf(t),vf(e)===t}function Re(e,t,a,l,n,i){switch(a){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||kl(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&kl(e,""+l);break;case"className":ii(e,"class",l);break;case"tabIndex":ii(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":ii(e,a,l);break;case"style":vc(e,l,i);break;case"data":if(t!=="object"){ii(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=oi(""+l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof i=="function"&&(a==="formAction"?(t!=="input"&&Re(e,t,"name",n.name,n,null),Re(e,t,"formEncType",n.formEncType,n,null),Re(e,t,"formMethod",n.formMethod,n,null),Re(e,t,"formTarget",n.formTarget,n,null)):(Re(e,t,"encType",n.encType,n,null),Re(e,t,"method",n.method,n,null),Re(e,t,"target",n.target,n,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=oi(""+l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=ua);break;case"onScroll":l!=null&&be("scroll",e);break;case"onScrollEnd":l!=null&&be("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(f(61));if(a=l.__html,a!=null){if(n.children!=null)throw Error(f(60));e.innerHTML=a}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=oi(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""+l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":be("beforetoggle",e),be("toggle",e),ni(e,"popover",l);break;case"xlinkActuate":ca(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":ca(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":ca(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":ca(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":ca(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":ca(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":ca(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":ca(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":ca(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":ni(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Qh.get(a)||a,ni(e,a,l))}}function As(e,t,a,l,n,i){switch(a){case"style":vc(e,l,i);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(f(61));if(a=l.__html,a!=null){if(n.children!=null)throw Error(f(60));e.innerHTML=a}}break;case"children":typeof l=="string"?kl(e,l):(typeof l=="number"||typeof l=="bigint")&&kl(e,""+l);break;case"onScroll":l!=null&&be("scroll",e);break;case"onScrollEnd":l!=null&&be("scrollend",e);break;case"onClick":l!=null&&(e.onclick=ua);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!uc.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(n=a.endsWith("Capture"),t=a.slice(2,n?a.length-7:void 0),i=e[jt]||null,i=i!=null?i[a]:null,typeof i=="function"&&e.removeEventListener(t,i,n),typeof l=="function")){typeof i!="function"&&i!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,l,n);break e}a in e?e[a]=l:l===!0?e.setAttribute(a,""):ni(e,a,l)}}}function gt(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":be("error",e),be("load",e);var l=!1,n=!1,i;for(i in a)if(a.hasOwnProperty(i)){var o=a[i];if(o!=null)switch(i){case"src":l=!0;break;case"srcSet":n=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(f(137,t));default:Re(e,t,i,o,a,null)}}n&&Re(e,t,"srcSet",a.srcSet,a,null),l&&Re(e,t,"src",a.src,a,null);return;case"input":be("invalid",e);var s=i=o=n=null,c=null,p=null;for(l in a)if(a.hasOwnProperty(l)){var j=a[l];if(j!=null)switch(l){case"name":n=j;break;case"type":o=j;break;case"checked":c=j;break;case"defaultChecked":p=j;break;case"value":i=j;break;case"defaultValue":s=j;break;case"children":case"dangerouslySetInnerHTML":if(j!=null)throw Error(f(137,t));break;default:Re(e,t,l,j,a,null)}}gc(e,i,s,c,p,o,n,!1);return;case"select":be("invalid",e),l=o=i=null;for(n in a)if(a.hasOwnProperty(n)&&(s=a[n],s!=null))switch(n){case"value":i=s;break;case"defaultValue":o=s;break;case"multiple":l=s;default:Re(e,t,n,s,a,null)}t=i,a=o,e.multiple=!!l,t!=null?Al(e,!!l,t,!1):a!=null&&Al(e,!!l,a,!0);return;case"textarea":be("invalid",e),i=n=l=null;for(o in a)if(a.hasOwnProperty(o)&&(s=a[o],s!=null))switch(o){case"value":l=s;break;case"defaultValue":n=s;break;case"children":i=s;break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(f(91));break;default:Re(e,t,o,s,a,null)}bc(e,l,n,i);return;case"option":for(c in a)if(a.hasOwnProperty(c)&&(l=a[c],l!=null))switch(c){case"selected":e.selected=l&&typeof l!="function"&&typeof l!="symbol";break;default:Re(e,t,c,l,a,null)}return;case"dialog":be("beforetoggle",e),be("toggle",e),be("cancel",e),be("close",e);break;case"iframe":case"object":be("load",e);break;case"video":case"audio":for(l=0;l<Jn.length;l++)be(Jn[l],e);break;case"image":be("error",e),be("load",e);break;case"details":be("toggle",e);break;case"embed":case"source":case"link":be("error",e),be("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(p in a)if(a.hasOwnProperty(p)&&(l=a[p],l!=null))switch(p){case"children":case"dangerouslySetInnerHTML":throw Error(f(137,t));default:Re(e,t,p,l,a,null)}return;default:if(Lr(t)){for(j in a)a.hasOwnProperty(j)&&(l=a[j],l!==void 0&&As(e,t,j,l,a,void 0));return}}for(s in a)a.hasOwnProperty(s)&&(l=a[s],l!=null&&Re(e,t,s,l,a,null))}function mg(e,t,a,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var n=null,i=null,o=null,s=null,c=null,p=null,j=null;for(v in a){var N=a[v];if(a.hasOwnProperty(v)&&N!=null)switch(v){case"checked":break;case"value":break;case"defaultValue":c=N;default:l.hasOwnProperty(v)||Re(e,t,v,null,l,N)}}for(var b in l){var v=l[b];if(N=a[b],l.hasOwnProperty(b)&&(v!=null||N!=null))switch(b){case"type":i=v;break;case"name":n=v;break;case"checked":p=v;break;case"defaultChecked":j=v;break;case"value":o=v;break;case"defaultValue":s=v;break;case"children":case"dangerouslySetInnerHTML":if(v!=null)throw Error(f(137,t));break;default:v!==N&&Re(e,t,b,v,l,N)}}qr(e,o,s,c,p,j,i,n);return;case"select":v=o=s=b=null;for(i in a)if(c=a[i],a.hasOwnProperty(i)&&c!=null)switch(i){case"value":break;case"multiple":v=c;default:l.hasOwnProperty(i)||Re(e,t,i,null,l,c)}for(n in l)if(i=l[n],c=a[n],l.hasOwnProperty(n)&&(i!=null||c!=null))switch(n){case"value":b=i;break;case"defaultValue":s=i;break;case"multiple":o=i;default:i!==c&&Re(e,t,n,i,l,c)}t=s,a=o,l=v,b!=null?Al(e,!!a,b,!1):!!l!=!!a&&(t!=null?Al(e,!!a,t,!0):Al(e,!!a,a?[]:"",!1));return;case"textarea":v=b=null;for(s in a)if(n=a[s],a.hasOwnProperty(s)&&n!=null&&!l.hasOwnProperty(s))switch(s){case"value":break;case"children":break;default:Re(e,t,s,null,l,n)}for(o in l)if(n=l[o],i=a[o],l.hasOwnProperty(o)&&(n!=null||i!=null))switch(o){case"value":b=n;break;case"defaultValue":v=n;break;case"children":break;case"dangerouslySetInnerHTML":if(n!=null)throw Error(f(91));break;default:n!==i&&Re(e,t,o,n,l,i)}pc(e,b,v);return;case"option":for(var V in a)if(b=a[V],a.hasOwnProperty(V)&&b!=null&&!l.hasOwnProperty(V))switch(V){case"selected":e.selected=!1;break;default:Re(e,t,V,null,l,b)}for(c in l)if(b=l[c],v=a[c],l.hasOwnProperty(c)&&b!==v&&(b!=null||v!=null))switch(c){case"selected":e.selected=b&&typeof b!="function"&&typeof b!="symbol";break;default:Re(e,t,c,b,l,v)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var W in a)b=a[W],a.hasOwnProperty(W)&&b!=null&&!l.hasOwnProperty(W)&&Re(e,t,W,null,l,b);for(p in l)if(b=l[p],v=a[p],l.hasOwnProperty(p)&&b!==v&&(b!=null||v!=null))switch(p){case"children":case"dangerouslySetInnerHTML":if(b!=null)throw Error(f(137,t));break;default:Re(e,t,p,b,l,v)}return;default:if(Lr(t)){for(var Oe in a)b=a[Oe],a.hasOwnProperty(Oe)&&b!==void 0&&!l.hasOwnProperty(Oe)&&As(e,t,Oe,void 0,l,b);for(j in l)b=l[j],v=a[j],!l.hasOwnProperty(j)||b===v||b===void 0&&v===void 0||As(e,t,j,b,l,v);return}}for(var m in a)b=a[m],a.hasOwnProperty(m)&&b!=null&&!l.hasOwnProperty(m)&&Re(e,t,m,null,l,b);for(N in l)b=l[N],v=a[N],!l.hasOwnProperty(N)||b===v||b==null&&v==null||Re(e,t,N,b,l,v)}function wf(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function gg(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var n=a[l],i=n.transferSize,o=n.initiatorType,s=n.duration;if(i&&s&&wf(o)){for(o=0,s=n.responseEnd,l+=1;l<a.length;l++){var c=a[l],p=c.startTime;if(p>s)break;var j=c.transferSize,N=c.initiatorType;j&&wf(N)&&(c=c.responseEnd,o+=j*(c<s?1:(s-p)/(c-p)))}if(--l,t+=8*(i+o)/(n.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var ks=null,Ns=null;function ar(e){return e.nodeType===9?e:e.ownerDocument}function Sf(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function jf(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Ts(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Cs=null;function pg(){var e=window.event;return e&&e.type==="popstate"?e===Cs?!1:(Cs=e,!0):(Cs=null,!1)}var Af=typeof setTimeout=="function"?setTimeout:void 0,bg=typeof clearTimeout=="function"?clearTimeout:void 0,kf=typeof Promise=="function"?Promise:void 0,yg=typeof queueMicrotask=="function"?queueMicrotask:typeof kf<"u"?function(e){return kf.resolve(null).then(e).catch(vg)}:Af;function vg(e){setTimeout(function(){throw e})}function Ja(e){return e==="head"}function Nf(e,t){var a=t,l=0;do{var n=a.nextSibling;if(e.removeChild(a),n&&n.nodeType===8)if(a=n.data,a==="/$"||a==="/&"){if(l===0){e.removeChild(n),an(t);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")Zn(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Zn(a);for(var i=a.firstChild;i;){var o=i.nextSibling,s=i.nodeName;i[dn]||s==="SCRIPT"||s==="STYLE"||s==="LINK"&&i.rel.toLowerCase()==="stylesheet"||a.removeChild(i),i=o}}else a==="body"&&Zn(e.ownerDocument.body);a=n}while(a);an(t)}function Tf(e,t){var a=e;e=0;do{var l=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=l}while(a)}function Es(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Es(a),Rr(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function xg(e,t,a,l){for(;e.nodeType===1;){var n=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[dn])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(i=e.getAttribute("rel"),i==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(i!==n.rel||e.getAttribute("href")!==(n.href==null||n.href===""?null:n.href)||e.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin)||e.getAttribute("title")!==(n.title==null?null:n.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(i=e.getAttribute("src"),(i!==(n.src==null?null:n.src)||e.getAttribute("type")!==(n.type==null?null:n.type)||e.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin))&&i&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var i=n.name==null?null:""+n.name;if(n.type==="hidden"&&e.getAttribute("name")===i)return e}else return e;if(e=Zt(e.nextSibling),e===null)break}return null}function wg(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=Zt(e.nextSibling),e===null))return null;return e}function Cf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Zt(e.nextSibling),e===null))return null;return e}function Ms(e){return e.data==="$?"||e.data==="$~"}function zs(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Sg(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var l=function(){t(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Zt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Ds=null;function Ef(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return Zt(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function Mf(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function zf(e,t,a){switch(t=ar(a),e){case"html":if(e=t.documentElement,!e)throw Error(f(452));return e;case"head":if(e=t.head,!e)throw Error(f(453));return e;case"body":if(e=t.body,!e)throw Error(f(454));return e;default:throw Error(f(451))}}function Zn(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Rr(e)}var Xt=new Map,Df=new Set;function lr(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Na=O.d;O.d={f:jg,r:Ag,D:kg,C:Ng,L:Tg,m:Cg,X:Mg,S:Eg,M:zg};function jg(){var e=Na.f(),t=Xi();return e||t}function Ag(e){var t=wl(e);t!==null&&t.tag===5&&t.type==="form"?Xu(t):Na.r(e)}var $l=typeof document>"u"?null:document;function Rf(e,t,a){var l=$l;if(l&&typeof t=="string"&&t){var n=Ht(t);n='link[rel="'+e+'"][href="'+n+'"]',typeof a=="string"&&(n+='[crossorigin="'+a+'"]'),Df.has(n)||(Df.add(n),e={rel:e,crossOrigin:a,href:t},l.querySelector(n)===null&&(t=l.createElement("link"),gt(t,"link",e),st(t),l.head.appendChild(t)))}}function kg(e){Na.D(e),Rf("dns-prefetch",e,null)}function Ng(e,t){Na.C(e,t),Rf("preconnect",e,t)}function Tg(e,t,a){Na.L(e,t,a);var l=$l;if(l&&e&&t){var n='link[rel="preload"][as="'+Ht(t)+'"]';t==="image"&&a&&a.imageSrcSet?(n+='[imagesrcset="'+Ht(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(n+='[imagesizes="'+Ht(a.imageSizes)+'"]')):n+='[href="'+Ht(e)+'"]';var i=n;switch(t){case"style":i=en(e);break;case"script":i=tn(e)}Xt.has(i)||(e=D({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),Xt.set(i,e),l.querySelector(n)!==null||t==="style"&&l.querySelector(Xn(i))||t==="script"&&l.querySelector(Wn(i))||(t=l.createElement("link"),gt(t,"link",e),st(t),l.head.appendChild(t)))}}function Cg(e,t){Na.m(e,t);var a=$l;if(a&&e){var l=t&&typeof t.as=="string"?t.as:"script",n='link[rel="modulepreload"][as="'+Ht(l)+'"][href="'+Ht(e)+'"]',i=n;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":i=tn(e)}if(!Xt.has(i)&&(e=D({rel:"modulepreload",href:e},t),Xt.set(i,e),a.querySelector(n)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Wn(i)))return}l=a.createElement("link"),gt(l,"link",e),st(l),a.head.appendChild(l)}}}function Eg(e,t,a){Na.S(e,t,a);var l=$l;if(l&&e){var n=Sl(l).hoistableStyles,i=en(e);t=t||"default";var o=n.get(i);if(!o){var s={loading:0,preload:null};if(o=l.querySelector(Xn(i)))s.loading=5;else{e=D({rel:"stylesheet",href:e,"data-precedence":t},a),(a=Xt.get(i))&&Rs(e,a);var c=o=l.createElement("link");st(c),gt(c,"link",e),c._p=new Promise(function(p,j){c.onload=p,c.onerror=j}),c.addEventListener("load",function(){s.loading|=1}),c.addEventListener("error",function(){s.loading|=2}),s.loading|=4,nr(o,t,l)}o={type:"stylesheet",instance:o,count:1,state:s},n.set(i,o)}}}function Mg(e,t){Na.X(e,t);var a=$l;if(a&&e){var l=Sl(a).hoistableScripts,n=tn(e),i=l.get(n);i||(i=a.querySelector(Wn(n)),i||(e=D({src:e,async:!0},t),(t=Xt.get(n))&&Os(e,t),i=a.createElement("script"),st(i),gt(i,"link",e),a.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function zg(e,t){Na.M(e,t);var a=$l;if(a&&e){var l=Sl(a).hoistableScripts,n=tn(e),i=l.get(n);i||(i=a.querySelector(Wn(n)),i||(e=D({src:e,async:!0,type:"module"},t),(t=Xt.get(n))&&Os(e,t),i=a.createElement("script"),st(i),gt(i,"link",e),a.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function Of(e,t,a,l){var n=(n=te.current)?lr(n):null;if(!n)throw Error(f(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=en(a.href),a=Sl(n).hoistableStyles,l=a.get(t),l||(l={type:"style",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=en(a.href);var i=Sl(n).hoistableStyles,o=i.get(e);if(o||(n=n.ownerDocument||n,o={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},i.set(e,o),(i=n.querySelector(Xn(e)))&&!i._p&&(o.instance=i,o.state.loading=5),Xt.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Xt.set(e,a),i||Dg(n,e,a,o.state))),t&&l===null)throw Error(f(528,""));return o}if(t&&l!==null)throw Error(f(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=tn(a),a=Sl(n).hoistableScripts,l=a.get(t),l||(l={type:"script",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(f(444,e))}}function en(e){return'href="'+Ht(e)+'"'}function Xn(e){return'link[rel="stylesheet"]['+e+"]"}function qf(e){return D({},e,{"data-precedence":e.precedence,precedence:null})}function Dg(e,t,a,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),gt(t,"link",a),st(t),e.head.appendChild(t))}function tn(e){return'[src="'+Ht(e)+'"]'}function Wn(e){return"script[async]"+e}function Uf(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Ht(a.href)+'"]');if(l)return t.instance=l,st(l),l;var n=D({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),st(l),gt(l,"style",n),nr(l,a.precedence,e),t.instance=l;case"stylesheet":n=en(a.href);var i=e.querySelector(Xn(n));if(i)return t.state.loading|=4,t.instance=i,st(i),i;l=qf(a),(n=Xt.get(n))&&Rs(l,n),i=(e.ownerDocument||e).createElement("link"),st(i);var o=i;return o._p=new Promise(function(s,c){o.onload=s,o.onerror=c}),gt(i,"link",l),t.state.loading|=4,nr(i,a.precedence,e),t.instance=i;case"script":return i=tn(a.src),(n=e.querySelector(Wn(i)))?(t.instance=n,st(n),n):(l=a,(n=Xt.get(i))&&(l=D({},a),Os(l,n)),e=e.ownerDocument||e,n=e.createElement("script"),st(n),gt(n,"link",l),e.head.appendChild(n),t.instance=n);case"void":return null;default:throw Error(f(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,nr(l,a.precedence,e));return t.instance}function nr(e,t,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),n=l.length?l[l.length-1]:null,i=n,o=0;o<l.length;o++){var s=l[o];if(s.dataset.precedence===t)i=s;else if(i!==n)break}i?i.parentNode.insertBefore(e,i.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function Rs(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Os(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var ir=null;function Lf(e,t,a){if(ir===null){var l=new Map,n=ir=new Map;n.set(a,l)}else n=ir,l=n.get(a),l||(l=new Map,n.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),n=0;n<a.length;n++){var i=a[n];if(!(i[dn]||i[dt]||e==="link"&&i.getAttribute("rel")==="stylesheet")&&i.namespaceURI!=="http://www.w3.org/2000/svg"){var o=i.getAttribute(t)||"";o=e+o;var s=l.get(o);s?s.push(i):l.set(o,[i])}}return l}function Bf(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function Rg(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Gf(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Og(e,t,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var n=en(l.href),i=t.querySelector(Xn(n));if(i){t=i._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=rr.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=i,st(i);return}i=t.ownerDocument||t,l=qf(l),(n=Xt.get(n))&&Rs(l,n),i=i.createElement("link"),st(i);var o=i;o._p=new Promise(function(s,c){o.onload=s,o.onerror=c}),gt(i,"link",l),a.instance=i}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=rr.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var qs=0;function qg(e,t){return e.stylesheets&&e.count===0&&sr(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var l=setTimeout(function(){if(e.stylesheets&&sr(e,e.stylesheets),e.unsuspend){var i=e.unsuspend;e.unsuspend=null,i()}},6e4+t);0<e.imgBytes&&qs===0&&(qs=62500*gg());var n=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&sr(e,e.stylesheets),e.unsuspend)){var i=e.unsuspend;e.unsuspend=null,i()}},(e.imgBytes>qs?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(n)}}:null}function rr(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)sr(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var or=null;function sr(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,or=new Map,t.forEach(Ug,e),or=null,rr.call(e))}function Ug(e,t){if(!(t.state.loading&4)){var a=or.get(e);if(a)var l=a.get(null);else{a=new Map,or.set(e,a);for(var n=e.querySelectorAll("link[data-precedence],style[data-precedence]"),i=0;i<n.length;i++){var o=n[i];(o.nodeName==="LINK"||o.getAttribute("media")!=="not all")&&(a.set(o.dataset.precedence,o),l=o)}l&&a.set(null,l)}n=t.instance,o=n.getAttribute("data-precedence"),i=a.get(o)||l,i===l&&a.set(null,n),a.set(o,n),this.count++,l=rr.bind(this),n.addEventListener("load",l),n.addEventListener("error",l),i?i.parentNode.insertBefore(n,i.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(n,e.firstChild)),t.state.loading|=4}}var In={$$typeof:Ne,Provider:null,Consumer:null,_currentValue:Y,_currentValue2:Y,_threadCount:0};function Lg(e,t,a,l,n,i,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Er(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Er(0),this.hiddenUpdates=Er(null),this.identifierPrefix=l,this.onUncaughtError=n,this.onCaughtError=i,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function Hf(e,t,a,l,n,i,o,s,c,p,j,N){return e=new Lg(e,t,a,o,c,p,j,N,s),t=1,i===!0&&(t|=24),i=zt(3,null,null,t),e.current=i,i.stateNode=e,t=mo(),t.refCount++,e.pooledCache=t,t.refCount++,i.memoizedState={element:l,isDehydrated:a,cache:t},yo(i),e}function Qf(e){return e?(e=Dl,e):Dl}function Kf(e,t,a,l,n,i){n=Qf(n),l.context===null?l.context=n:l.pendingContext=n,l=Oa(t),l.payload={element:a},i=i===void 0?null:i,i!==null&&(l.callback=i),a=qa(e,l,t),a!==null&&(Et(a,e,t),Cn(a,e,t))}function Vf(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function Us(e,t){Vf(e,t),(e=e.alternate)&&Vf(e,t)}function Yf(e){if(e.tag===13||e.tag===31){var t=nl(e,67108864);t!==null&&Et(t,e,67108864),Us(e,67108864)}}function Jf(e){if(e.tag===13||e.tag===31){var t=Ut();t=Mr(t);var a=nl(e,t);a!==null&&Et(a,e,t),Us(e,t)}}var cr=!0;function Bg(e,t,a,l){var n=w.T;w.T=null;var i=O.p;try{O.p=2,Ls(e,t,a,l)}finally{O.p=i,w.T=n}}function Gg(e,t,a,l){var n=w.T;w.T=null;var i=O.p;try{O.p=8,Ls(e,t,a,l)}finally{O.p=i,w.T=n}}function Ls(e,t,a,l){if(cr){var n=Bs(l);if(n===null)js(e,t,l,ur,a),Zf(e,l);else if(Qg(n,e,t,a,l))l.stopPropagation();else if(Zf(e,l),t&4&&-1<Hg.indexOf(e)){for(;n!==null;){var i=wl(n);if(i!==null)switch(i.tag){case 3:if(i=i.stateNode,i.current.memoizedState.isDehydrated){var o=Pt(i.pendingLanes);if(o!==0){var s=i;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-Le(o);s.entanglements[1]|=c,o&=~c}ra(i),(ke&6)===0&&(_i=vt()+500,Yn(0))}}break;case 31:case 13:s=nl(i,2),s!==null&&Et(s,i,2),Xi(),Us(i,2)}if(i=Bs(l),i===null&&js(e,t,l,ur,a),i===n)break;n=i}n!==null&&l.stopPropagation()}else js(e,t,l,null,a)}}function Bs(e){return e=Gr(e),Gs(e)}var ur=null;function Gs(e){if(ur=null,e=xl(e),e!==null){var t=q(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=H(t),e!==null)return e;e=null}else if(a===31){if(e=I(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return ur=e,null}function _f(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(cn()){case S:return 2;case M:return 8;case Z:case x:return 32;case fe:return 268435456;default:return 32}default:return 32}}var Hs=!1,_a=null,Za=null,Xa=null,Fn=new Map,Pn=new Map,Wa=[],Hg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Zf(e,t){switch(e){case"focusin":case"focusout":_a=null;break;case"dragenter":case"dragleave":Za=null;break;case"mouseover":case"mouseout":Xa=null;break;case"pointerover":case"pointerout":Fn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Pn.delete(t.pointerId)}}function $n(e,t,a,l,n,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:a,eventSystemFlags:l,nativeEvent:i,targetContainers:[n]},t!==null&&(t=wl(t),t!==null&&Yf(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,n!==null&&t.indexOf(n)===-1&&t.push(n),e)}function Qg(e,t,a,l,n){switch(t){case"focusin":return _a=$n(_a,e,t,a,l,n),!0;case"dragenter":return Za=$n(Za,e,t,a,l,n),!0;case"mouseover":return Xa=$n(Xa,e,t,a,l,n),!0;case"pointerover":var i=n.pointerId;return Fn.set(i,$n(Fn.get(i)||null,e,t,a,l,n)),!0;case"gotpointercapture":return i=n.pointerId,Pn.set(i,$n(Pn.get(i)||null,e,t,a,l,n)),!0}return!1}function Xf(e){var t=xl(e.target);if(t!==null){var a=q(t);if(a!==null){if(t=a.tag,t===13){if(t=H(a),t!==null){e.blockedOn=t,oc(e.priority,function(){Jf(a)});return}}else if(t===31){if(t=I(a),t!==null){e.blockedOn=t,oc(e.priority,function(){Jf(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function dr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=Bs(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);Br=l,a.target.dispatchEvent(l),Br=null}else return t=wl(a),t!==null&&Yf(t),e.blockedOn=a,!1;t.shift()}return!0}function Wf(e,t,a){dr(e)&&a.delete(t)}function Kg(){Hs=!1,_a!==null&&dr(_a)&&(_a=null),Za!==null&&dr(Za)&&(Za=null),Xa!==null&&dr(Xa)&&(Xa=null),Fn.forEach(Wf),Pn.forEach(Wf)}function fr(e,t){e.blockedOn===t&&(e.blockedOn=null,Hs||(Hs=!0,h.unstable_scheduleCallback(h.unstable_NormalPriority,Kg)))}var hr=null;function If(e){hr!==e&&(hr=e,h.unstable_scheduleCallback(h.unstable_NormalPriority,function(){hr===e&&(hr=null);for(var t=0;t<e.length;t+=3){var a=e[t],l=e[t+1],n=e[t+2];if(typeof l!="function"){if(Gs(l||a)===null)continue;break}var i=wl(a);i!==null&&(e.splice(t,3),t-=3,Bo(i,{pending:!0,data:n,method:a.method,action:l},l,n))}}))}function an(e){function t(c){return fr(c,e)}_a!==null&&fr(_a,e),Za!==null&&fr(Za,e),Xa!==null&&fr(Xa,e),Fn.forEach(t),Pn.forEach(t);for(var a=0;a<Wa.length;a++){var l=Wa[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<Wa.length&&(a=Wa[0],a.blockedOn===null);)Xf(a),a.blockedOn===null&&Wa.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var n=a[l],i=a[l+1],o=n[jt]||null;if(typeof i=="function")o||If(a);else if(o){var s=null;if(i&&i.hasAttribute("formAction")){if(n=i,o=i[jt]||null)s=o.formAction;else if(Gs(n)!==null)continue}else s=o.action;typeof s=="function"?a[l+1]=s:(a.splice(l,3),l-=3),If(a)}}}function Ff(){function e(i){i.canIntercept&&i.info==="react-transition"&&i.intercept({handler:function(){return new Promise(function(o){return n=o})},focusReset:"manual",scroll:"manual"})}function t(){n!==null&&(n(),n=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var i=navigation.currentEntry;i&&i.url!=null&&navigation.navigate(i.url,{state:i.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,n=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),n!==null&&(n(),n=null)}}}function Qs(e){this._internalRoot=e}mr.prototype.render=Qs.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(f(409));var a=t.current,l=Ut();Kf(a,l,e,t,null,null)},mr.prototype.unmount=Qs.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Kf(e.current,2,null,e,null,null),Xi(),t[vl]=null}};function mr(e){this._internalRoot=e}mr.prototype.unstable_scheduleHydration=function(e){if(e){var t=rc();e={blockedOn:null,target:e,priority:t};for(var a=0;a<Wa.length&&t!==0&&t<Wa[a].priority;a++);Wa.splice(a,0,e),a===0&&Xf(e)}};var Pf=z.version;if(Pf!=="19.2.6")throw Error(f(527,Pf,"19.2.6"));O.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(f(188)):(e=Object.keys(e).join(","),Error(f(268,e)));return e=A(t),e=e!==null?K(e):null,e=e===null?null:e.stateNode,e};var Vg={bundleType:0,version:"19.2.6",rendererPackageName:"react-dom",currentDispatcherRef:w,reconcilerVersion:"19.2.6"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var gr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!gr.isDisabled&&gr.supportsFiber)try{ot=gr.inject(Vg),Ue=gr}catch{}}return ti.createRoot=function(e,t){if(!C(e))throw Error(f(299));var a=!1,l="",n=nd,i=id,o=rd;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(n=t.onUncaughtError),t.onCaughtError!==void 0&&(i=t.onCaughtError),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=Hf(e,1,!1,null,null,a,l,null,n,i,o,Ff),e[vl]=t.current,Ss(e),new Qs(t)},ti.hydrateRoot=function(e,t,a){if(!C(e))throw Error(f(299));var l=!1,n="",i=nd,o=id,s=rd,c=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(n=a.identifierPrefix),a.onUncaughtError!==void 0&&(i=a.onUncaughtError),a.onCaughtError!==void 0&&(o=a.onCaughtError),a.onRecoverableError!==void 0&&(s=a.onRecoverableError),a.formState!==void 0&&(c=a.formState)),t=Hf(e,1,!0,t,a??null,l,n,c,i,o,s,Ff),t.context=Qf(null),a=t.current,l=Ut(),l=Mr(l),n=Oa(l),n.callback=null,qa(a,n,l),a=l,t.current.lanes=a,un(t,a),ra(t),e[vl]=t.current,Ss(e),new mr(t)},ti.version="19.2.6",ti}var ch;function rp(){if(ch)return Ys.exports;ch=1;function h(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(h)}catch(z){console.error(z)}}return h(),Ys.exports=ip(),Ys.exports}var op=rp();const sp=[{title:"City Skyline copy",description:"I used ai to make some of the game.",url:"https://tharaniidaran-t.github.io/cityskylinesremake/",thumbnail:"https://upload.wikimedia.org/wikipedia/en/5/58/Cities_Skylines_cover_art.jpg",category:"Solo"},{title:"test",description:"",url:"https://files.catbox.moe/m9x159.mp4",thumbnail:"",category:"Movies"},{title:"Paper.Io",description:"",url:"clpaperio.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSeaYvNRf5sKi2HUrLKcMxWrVHdOCHllA_aQ&s",category:"Solo"},{title:"Cookie Clicker",description:"",url:"clcookieclicker.html",thumbnail:"https://upload.wikimedia.org/wikipedia/en/0/06/Cookie_Clicker_logo.png",category:"Solo"},{title:"99 Nights at a Forest Copy",description:"",url:"cl99nightsitf.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVcqmKa58thtYd3HWzjJd1MwokpvGspBxKPQ&s",category:"Solo"},{title:"The Final Earth 2 New (More stuff)",description:"I love this game bro. Actually best game out there, please try atleast once!",url:"https://florianvanstrien.nl/TheFinalEarth2/play/",thumbnail:"https://i.ytimg.com/vi/9lZ9dCxejp0/hqdefault.jpg",category:"Solo"},{title:"The Final Earth 2 Old",description:"I love this game bro. Actually best game out there, please try atleast once!",url:"clfinalearth2.html/",thumbnail:"https://i.ytimg.com/vi/9lZ9dCxejp0/hqdefault.jpg",category:"Solo"},{title:"Shader Pilot",description:"Game that TTM made and It looks good Ig and cool ig. ",url:"https://tharaniidaran-t.github.io/shader-piolet/",thumbnail:"https://i.ytimg.com/vi/cpsY9WQxh5U/maxresdefault.jpg",category:"Solo"},{title:"unblocked anime stuff",description:"",url:"https://streamex.sh/s",thumbnail:"https://media.licdn.com/dms/image/v2/C4D0BAQHfLNZeLxAnSw/company-logo_200_200/company-logo_200_200/0/1660365825078/streamx_logo?e=2147483647&v=beta&t=pgzHh-mNGlpjcTsC6qxYkW1kRSaOzk0MZlOCL46CmQ0",category:"Not Games"},{title:"Chatgpt (GROQ API)",description:"Go to the doc and get a API or swap your model if it says max token limit reached. ",url:"https://urnperiodic.github.io/GroqAi/",thumbnail:"https://www.internetmatters.org/wp-content/uploads/2025/06/Chat-GPT-logo.webp",category:"Not Games"},{title:"Youtube",description:"Youtube unblocked, should allow you to paste videos into the URL thingy and watch it.",url:"https://urnperiodic.github.io/purify-video.github.io/",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_yL7AtgrIozF4QESx27DN6CDTvAuxtEfPPw&s",category:"Not Games"},{title:"Proxy",description:"Allows you to scour the web unblocked",url:"https://somany.gsxpress.com.my/",thumbnail:"https://cdn.prod.website-files.com/65e50602c9dc544319635b46/65e88c2b238ceb5fe132c177_proxy-logo.png",category:"Not Games"},{title:"Slope",description:"This is just for the girls ig",url:"https://ubg365.github.io/slope/play.html",thumbnail:"https://i.ytimg.com/vi/jvjZ4rnERmM/maxresdefault.jpg",category:"Solo"},{title:"Epilepsy game",description:"This is just for the girls ig",url:"https://ubg365.github.io/death-run-3d/",thumbnail:"https://play-lh.googleusercontent.com/IeGUGo20PsUgjtAajcZWsz09ypyAIITXS8jDzzLAFdoR65Zy_3PVOP-ckq5b_A_vPzuV=w526-h296-rw",category:"Solo"},{title:"2048",description:"Girls.",url:"https://ubg365.github.io/2048/play.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSuxqLfXqm07uXPH0qyPu_6MofiU9nlUoq9w&s",category:"Solo"},{title:"Bitlife",description:"Most fun to experiment by yourself.",url:"https://ubg365.github.io/bitlife-life-simulator/play.html",thumbnail:"https://i.ytimg.com/vi/WUTrv--kZtI/maxresdefault.jpg",category:"Solo"},{title:"OvO",description:"Fun to play by yourself.",url:"https://mc0825.github.io/g5/class-456",thumbnail:"https://play-lh.googleusercontent.com/v7KwGdPjJGjJjRXn46sck4DwDBdKSeRzGN44CjiXUtKV0jjOi51Bt4wcXud0m-SkXg",category:"Solo"},{title:"Wordle Unlimited",description:"",url:"https://bosorioo.github.io/wordle-unlimited/",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzXo17pL3S9PjcsR4V-ZPUr8nuQ622Lq0lhA&s",category:"Solo"},{title:"Sandboxels",description:"works now I think",url:"https://mr-funkinguy.github.io/sandboxels/",thumbnail:"https://s3.amazonaws.com/production2.sciencegamecenter.org/games/boxarts/000/000/417/medium/TitleArt_SandBoxels.jpeg?1707496550",category:"Solo"},{title:"Tanuki Sunset",description:"",url:"https://mc0825.github.io/g26/class-488/",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBc_knTaEJfOEGjJPNFjIsNG5Mk95b6ua-vw&s",category:"Solo"},{title:"Minecraft Launcher",description:"Fun to play with your friends and by yourself.",url:"https://irv77.github.io/AmplerLauncher/",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3i6T2Z3GQtOp-O6IC1qtggAoP3_-vm0RsPw&s",category:"Minecraft"},{title:"Bloons TD6 copy",description:"A knockoff",url:"https://iims-sucksasaschool.github.io/BTD6/",thumbnail:"bloons.jpg",category:"Solo or Multiplayer."},{title:"Fnaf",description:"Survive.",url:"https://ubg365.github.io/fnaf/play.html",thumbnail:"https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/d/da/FNaF1.jpg/revision/latest/scale-to-width-down/1200?cb=20230410020858",category:"Solo"},{title:"Fnaf 2",description:"Survive.",url:"https://ubg365.github.io/fnaf-2/",thumbnail:"https://m.media-amazon.com/images/I/81HBpJd2h8L.png",category:"Solo"},{title:"Fnaf 3",description:"Survive.",url:"https://ubg365.github.io/fnaf-3/",thumbnail:"https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/f/fd/FNaF_3_Switch.jpg/revision/latest?cb=20210405111619",category:"Solo"},{title:"Tetris",description:"Fun.",url:"https://ubg365.github.io/flash-tetris/",thumbnail:"https://www.datocms-assets.com/145957/1744284280-tetris-mobile.png?auto=format&fit=max&w=1200",category:"Solo"},{title:"Tomb of the Mask",description:"Fun to play",url:"https://doraedu52.github.io/g26/class-438",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNHRR0Dx3LhBe3OA0pHR0U_VuPagdWjz1pOg&s",category:"solo"},{title:"Crossy Road",description:"2nd one if first does not work. 1st one if 2nd one does not work",url:"https://crossy-road-unblock.github.io/crossy-road/",thumbnail:"https://crossyroadonline.bitbucket.io/img/crossy-road.png",category:"solo"},{title:"Champion Island",description:"Google Doodle",url:"https://grandplat2.github.io/championisland/",thumbnail:"https://www.gstatic.com/marketing-cms/c2/de/b1ea4f8d4314be89cbd66a6c94d7/4.gif",category:"solo"},{title:"FIFA 11",description:"yeah",url:"clFIFA11.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpOYk7hDNvaL46ncyl7PbEdtncc_EaXvXsCw&s",category:"Emulated"},{title:"Madden 2002",description:"yeah",url:"clmaddennfl2002.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNXrI6cQ7sBJyZenq-Ur4Cz3V8ZQHgWpFf4XEnWDQgkiSMjE37CiA0g7Ew7Lz1dp78kCcWRRIPo179hdLl4G8XJmFxmwSaZ2Gpt97hkw&s=10",category:"Emulated"},{title:"Call of Duty 4",description:"yeah",url:"clcod4.html",thumbnail:"https://m.media-amazon.com/images/I/61bs4F5yOIL._AC_UF1000,1000_QL80_.jpg",category:"Emulated"},{title:"GTA Advance",description:"yeah",url:"clgrandtheftautoadvance.html",thumbnail:"https://m.media-amazon.com/images/M/MV5BNjRhYzk1ODItYjFhNy00OGU4LWE2YjAtZTk3NmRlNDhiZTFjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",category:"Emulated"},{title:"NFS: Most Wanted",description:"yeah",url:"clnfsmostwanted.html",thumbnail:"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1262560/capsule_616x353.jpg?t=1777484382",category:"Emulated"},{title:"Suika Watermelon copy",description:"yeah",url:"https://tharaniidaran-t.github.io/suika-game/",thumbnail:"https://media.tenor.com/7vR97sAI99IAAAAe/watermelon-game-suika-game.png",category:"solo"},{title:"Pokemon Platinum",description:"yeah",url:"clpokeplatinum.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt28qRa0-4kRzGsgiZ76XHYAhuNG6jYlt-Ud40owAzpJrXl4dHHRDHcavTsyQYjsBmvXu1Sw&s=10",category:"Emulated"},{title:"Pokemon Black 2",description:"yeah",url:"clpokeblack2.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuOhDpOLhmmSUkCuI-aDpmhwF7iygOrqUqeg&s",category:"Emulated"},{title:"Pokemon SoulSilver",description:"yeah",url:"clpokesoulsilver.html",thumbnail:"https://media.gamestop.com/i/gamestop/10077723/Pokemon-SoulSilver-Game-Only---Nintendo-DS?w=768&h=768&fmt=auto",category:"Emulated"},{title:"Tomodachi Collection",description:"yeah",url:"cltomodachicollection.html",thumbnail:"https://i.ytimg.com/vi/H96rM_liOHo/maxresdefault.jpg",category:"Emulated"},{title:"Crazy Cattle 3D",description:"yeah",url:"clcrazycattle3d.html",thumbnail:"https://crazycattle3d.github.io/index.png",category:"solo"},{title:"Pokemon Stadium 2",description:"yeah",url:"clpokemonstadium2.html",thumbnail:"https://upload.wikimedia.org/wikipedia/en/b/ba/Pok%C3%A9mon_Stadium_2_Coverart.png",category:"Emulated"},{title:"Slow Roads",description:"yeah",url:"https://script.google.com/macros/s/AKfycbzqDA2SnuVZ3DRelxxbUxSV9Z1RJz_gQfDRx06WUpgppWgrdDEErtZ1Lev9O6j2w9ioBQ/exec",thumbnail:"https://slowroads.io/meta-2.0.0.jpg",category:"solo"},{title:"Gran Turismo 2",description:"yeah",url:"clgranturismo2.html",thumbnail:"https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/GranTurismo2.jpg/250px-GranTurismo2.jpg",category:"Emulated"},{title:"Mario Kart DS",description:"yeah",url:"clmariokartds.html",thumbnail:"https://upload.wikimedia.org/wikipedia/en/8/86/Mario_Kart_DS_cover.jpg",category:"Emulated"},{title:"New Super Mario Bros",description:"yeah",url:"clnewsupermariobros.html",thumbnail:"https://upload.wikimedia.org/wikipedia/en/d/db/NewSuperMarioBrothers.jpg",category:"Emulated"},{title:"Cluster Truck",description:"yeah",url:"https://jasongamesdev.github.io/cluster-rush/",thumbnail:"https://upload.wikimedia.org/wikipedia/en/c/cd/Gameplay_screenshot_of_Clustertruck%2C_2016.png",category:"Solo"},{title:"Raft - Old",description:"yeah",url:"raft.html",thumbnail:"data:image/jpeg;base64,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",category:"Solo"},{title:"Schoolboy Runaway",description:"yeah",url:"schoolboyrunaway.html",thumbnail:"data:image/jpeg;base64,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",category:"Solo"},{title:"Buckshot Roulette",description:"yeah",url:"buckshotroulette.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbeWjzLlUOmGbvj4SjI3S_7HZnWcv7r5c3w&s",category:"Solo"},{title:"Bendy and the Ink Machine",description:"yeah",url:"bendy.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1VIgmKB77SSiPdhVOBVQLsQFahEipHqJdBQ&s",category:"Solo"},{title:"Animals Volleyball",description:"Probably the most fun game, also can play with friends.",url:"https://mc0825.github.io/g66/class-847/",thumbnail:"https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/966cec3b19cedf7dd72f93419f13268c/animals-volleyball-logo.png",category:"Sports"},{title:"Tag",description:"Fun to play with your friends.",url:"https://mc0825.github.io/g69/class-633/",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqnv5dEDOurGtf2ftRLZDASTNMHsTCh8eDhg&s",category:"Multiplayer"},{title:"Basket Random",description:"",url:"https://mc0825.github.io/g26/class-436/",thumbnail:"https://images.sftcdn.net/images/t_app-cover-s-16-9,f_auto/p/c980f465-a1b3-49d0-a53a-bca3d956be49/2213180539/basket-random-unblocked-screenshot",category:"Sports"},{title:"Smash Karts",description:"",url:"https://script.google.com/macros/s/AKfycbyE1C_kxeomVoOLjpaXc2uAI7JdNgVhdQdePTZu9Sizwzj_imhaWnNmPSXm4w1v-SFs/exec",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZeAncUPzcpBXnoPduVqHD_P5gfghYmA6rKw&s",category:"Shooter"},{title:"Leader Strike",description:"",url:"https://inkyedu118.github.io/g97/class-542",thumbnail:"https://i.ytimg.com/vi/rIqaCUaAY1k/mqdefault.jpg",category:"Shooter"},{title:"Imposter",description:"",url:"https://script.google.com/macros/s/AKfycbxcouwzwIrULxhM_6KgC3GOg7xZ7C0A3s4weEUQEtWdwb08Ma3PhJuLZVONJXKJG9DKaA/exec",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqnHES0vMhKA4ZN9RoVVmLKs__68g8gOUZOw&s",category:"Party"},{title:"Volley Random",description:"Fun to play with your friends.",url:"https://mc0825.github.io/g/class-811",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE-WsAiFSXWoWlHvWGYm4xNQysU_kK39VvcRz54bY9a1mdBapeDJne6gevddjqVG_5qhvQZIfZx3POJnNa6sJ-fBbEVW-oUY7-Rv27LwQ&s=10",category:"Sports"},{title:"Among Us",description:"",url:"https://script.google.com/macros/s/AKfycbwdYUtgs7kZjgJ5OG0WpNqc84LYICfZo0ezR1WfAYdjwqfkasZmB0Ad4MPFNVBfyKH-/exec",thumbnail:"https://i.ytimg.com/vi/0YKjFoGxbec/maxresdefault.jpg",category:"Party"},{title:"Wavelength",description:"Fun to play with your friends.",url:"https://script.google.com/macros/s/AKfycbwq4d8v_dkz0sx64ODo_5y7FMAboBGGRLfoAk-Z_KwcOT1JGC7RO1EWHQh7b4xipEwn/exec",thumbnail:"https://www.mathsisfun.com/algebra/images/wavelength-amplitude.svg",category:"Party"},{title:"Chess",description:"Play chess with a friend online using a room code.",url:"chess.html",thumbnail:"https://images.chesscomfiles.com/uploads/v1/blog/291978.333e4ddb.630x354o.6e5e89b5223a.png",category:"Multiplayer"},{title:"Wordle 1v1",description:"Wordle but multiplayer",url:"https://script.google.com/macros/s/AKfycbxgCfdpeZZi6jP7SOZcS3ZtBDRRRNEQX1ENPColTVrm2VHBcNBpKeOs87ddHC0xwr7_-A/exec",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzXo17pL3S9PjcsR4V-ZPUr8nuQ622Lq0lhA&s",category:"Multiplayer"},{title:"Mafia",description:"Game where an informed minority (the Mafia) against an uninformed majority (the Villagers).",url:"https://script.google.com/macros/s/AKfycbxIJpXSuYYb5fem5sk7ihiqcfGBn3n_3AiqHzWyA5ivVxhI2-Zzk5kGmJM3ym5cLYmM/exec",thumbnail:"https://icebreakerideas.com/wp-content/uploads/2019/04/Mafia-Game-e1610793771411.jpg",category:"Party"},{title:"Rocket goal",description:"Fun to play with your friends.",url:"https://script.google.com/macros/s/AKfycbybZkVPGyvHUOZbwrJSn5fRQIFcGpoIEhp0r-yq2GWRtE_1G7YzP4t8kPZRfp6tutUN/exec",thumbnail:"https://play-lh.googleusercontent.com/VFwCWELna7i6okl299W0e1H-0moEvVfT9N2M9moaikhCTcEDjUg3hE1mkSlm3ZezfLPi4ppMcStIhjWUustesg=w526-h296-rw",category:"Sports"},{title:"Wrassling",description:"Fun to play with your friends.",url:"https://mc0825.github.io/g69/class-651",thumbnail:"https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/f1b3c828-7af9-4e13-9f5c-b2e88f335bdf/wrassling.png",category:"Multiplayer"},{title:"Soccer Random",description:"Fun to play with your friends.",url:"https://mc0825.github.io/g26/class-511",thumbnail:"https://play-lh.googleusercontent.com/G1PIlb6HWKSaDre0XpUcmKGps9T4iamsSlwrogB3EJzYv4bz0M2am4D17MtGzndaOOU=w240-h480-rw",category:"Sports"},{title:"Getaway Shootout",description:"Fun to play with your friend.",url:"https://mc0825.github.io/g9/class-479/",thumbnail:"https://getawayshootoutonline.github.io/images/getaway-shootout.png",category:"Multiplayer"},{title:"Skribbl.io",description:"Fun to play with your friend.",url:"https://skribbl.io/",thumbnail:"https://static.wikitide.net/partycrasherswiki/1/14/IMPROVED-Skribblio.png",category:"Multiplayer"},{title:"Uno",description:"Make sure to say Uno",url:"https://script.google.com/macros/s/AKfycbyOGsDEwmKxazJAHOb9fXbJFZM0LwmZJPkmKdLKa1qPY6OWfKIP9GcqbnkRf0JbUWmERQ/exec",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEhekk0qTgz3FPvdI-7B2BajmVa-AQgjwkQA&s",category:"Multiplayer"},{title:"Gartic Phone Copy",description:"",url:"https://tharaniidaran-t.github.io/gartic-phone.github/",thumbnail:"https://static.wikia.nocookie.net/gartic-phone/images/8/87/Garticphone.png/revision/latest/scale-to-width-down/250?cb=20230104102856",category:"Multiplayer"},{title:"Block Blast",description:"",url:"clblockblastv2.html",thumbnail:"https://play-lh.googleusercontent.com/R0qgNDYYHbRhw6JFsdEbDMqONplEvJx0m0W9wzYVvY3eNF1c2rfBWYjQxW0sLEzFe1E=w240-h480-rw",category:"Solo"},{title:"yandere Simulator",description:"totally requested by some1...",url:"clyanderesimulator.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEJtZ7Fkd1QUQOtTNVBsHB2992ICRvmqHIGHUBOIZAqC1BAfat7lwcuqq-CKaq9uhCF21i&s=10",category:"Solo"},{title:"Ace Attorney - Justice For All",description:"...",url:"aceattorney.html",thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_YlHon89nCvWBzs71pzFmcJWQ4O7zmvfo07Zv85mpQddjo0kLlNWmLEIRqMj1o3BSTy0zsWyLEgrjQUt8ssfh-nkPFBxhKcM216lujQ&s=10",category:"Solo"},{title:"20 Questions",description:"...",url:"https://script.google.com/macros/s/AKfycbyUrnTBOG7GX18cuwZyso8g60AeCiUJ0z0jaMFtbj1ef8NnxhjMKGSUyANQnEHIhEYj9Q/exec",thumbnail:"https://m.media-amazon.com/images/I/61mPeDyQewL._AC_UF894,1000_QL80_.jpg",category:"Multiplayer"},{title:"Hangman",description:"...",url:"https://script.google.com/macros/s/AKfycbwZ5rAmhbYeKMGab21sLjLKVpxYtSFEYesWc5v0R2Ya1zjsXMO6_9OzZGGqkFISiRZf/exec",thumbnail:"https://t4.ftcdn.net/jpg/14/80/76/33/360_F_1480763300_sQsVKV59fW7BEKo60WOVVPqlFDen30WS.jpg",category:"Multiplayer"},{title:"Minecraft 1.12",description:"...",url:"Eaglercraft1.12.html",thumbnail:"https://static.wikia.nocookie.net/minecraft/images/b/b0/WorldOfColor.png/revision/latest?cb=20191229050330",category:"Minecraft"},{title:"Ace Attorney Investigations: Miles Edgeworth",description:"...",url:"claceattorneymilesedgeworth.html",thumbnail:"https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/Ace_Attorney_Investigations_Miles_Edgeworth_Game_Cover.jpg/250px-Ace_Attorney_Investigations_Miles_Edgeworth_Game_Cover.jpg",category:"Emulated"},{title:"Phoenix Wright: Ace Attorney",description:"...",url:"clpheonixrightaceattorny.html",thumbnail:"",category:"Emulated"},{title:"Phoenix Wright: Ace Attorney – Trials and Tribulations",description:"...",url:"clpheonixtrialsandyear.html",thumbnail:"Mia_Happy-1.jpg",category:"Emulated"}],uh=[{id:"sci-1",title:"Newton's Laws of Motion: The Physics of Movement",subtitle:"Grade 8 • Physical Science • Forces and Motion",content:`### Overview
Three centuries ago, Sir Isaac Newton formulated three fundamental laws of physics. Together, they explain how and why objects move or change direction. These principles govern everything from the kicking of a soccer ball to the orbit of spacecraft.

### The First Law: Inertia
The first law states that an object at rest will stay at rest, and an object in motion will stay in motion with a constant velocity, unless acted upon by an unbalanced force.
* Inertia is the tendency of matter to resist any change in state of motion.
* For example, when a car stops suddenly, your body continues moving forward—which is why seatbelts are essential.
* Massive objects have greater inertia, making them harder to start or stop.

### The Second Law: Force and Acceleration
The second law establishes a direct mathematical relationship between force, mass, and acceleration.
* Mathematically written as: Force = Mass × Acceleration (F = ma)
* If you apply the same force to a tennis ball and a bowling ball, the tennis ball will accelerate much faster because of its smaller mass.
* Acceleration is measured in meters per second squared (m/s²).

### The Third Law: Action and Reaction
The third law states that for every action, there is an equal and opposite reaction.
* Forces always exist in pairs.
* When you take a step forward, your foot pushes backward on the ground, and the ground pushes forward on your foot with equal force.
* Rockets launch by burning fuel and shooting gas downward. This action creates an equal and opposite upward reaction on the rocket.`,date:"Jun 04, 2026",category:"Science",readTime:"4 min read"},{id:"sci-2",title:"Plate Tectonics: Earth's Restless Outer Shell",subtitle:"Grade 8 • Earth Science • Geology",content:`### Earth's Layers and Plates
Earth's outer crust—the lithosphere—is not one single piece. Instead, it is broken into giant, interlocking slabs called tectonic plates. These plates float and drag atop a hot, semi-fluid mantle layer called the asthenosphere.

### Types of Plate Boundaries
Plates interact at three main types of boundaries, producing dramatic geological features:
1. **Divergent Boundaries:** Plates pull apart. Magma rises from the mantle to fill the gap, cooling to form new crust. This occurs at mid-ocean ridges and deep rift valleys.
2. **Convergent Boundaries:** Plates collide. If an oceanic plate strikes a continental plate, the heavier oceanic plate sinks beneath in a process called subduction, creating volcanoes and trenches. If two continental plates collide, they buckle upward to form towering mountain ranges like the Himalayas.
3. **Transform Boundaries:** Plates slide horizontally past each other. Friction binds the rocks, storing energy. When the plates suddenly slip, they release this stored energy as a major earthquake, such as along California's San Andreas Fault.

### Continental Drift Evidence
Alfred Wegener proposed the theory of continental drift in 1912. His key lines of evidence included:
* The jigsaw-like fit of South America and Africa.
* Matching fossils of ancient reptiles found on continents separated by wide oceans.
* Identical mountain ranges of matching rock types spanning oceans.`,date:"Jun 03, 2026",category:"Science",readTime:"5 min read"},{id:"sci-3",title:"The Periodic Table: Nature's Building Blocks",subtitle:"Grade 8 • Chemical Science • Chemistry Principles",content:`### Dmitry Mendeleev's Masterpiece
In 1869, Russian chemist Dmitry Mendeleev organized the known chemical elements according to their atomic masses and properties. He created the Periodic Table, which successfully predicted the existence of elements that had not yet been discovered.

### Understanding Atomic Anatomy
Every box on the periodic table represents a unique type of atom. An element's properties are dictated by its atomic structure:
* **Atomic Number:** The number of protons inside the atom's nucleus. This serves as the element's unique chemical signature.
* **Atomic Mass:** The weighted average mass of the protons and neutrons inside the nucleus.
* **Valence Electrons:** The electrons orbiting the outermost ring. These determine how reactive an element is with other elements.

### Families of Elements
The vertical columns are called groups, while horizontal rows are called periods. Groups share similar chemical attributes:
* **Group 1 (Alkali Metals):** Highly reactive metals that will explode when placed in water (e.g., Sodium).
* **Group 17 (Halogens):** Extremely reactive nonmetals that readily bond with alkali metals (e.g., Chlorine to make NaCl salt).
* **Group 18 (Noble Gases):** Complete outer electron shells make these gases entirely stable, nonreactive, and inert (e.g., Helium, Neon).`,date:"Jun 02, 2026",category:"Science",readTime:"4 min read"},{id:"sci-4",title:"The Electromagnetic Spectrum: Light Beyond Our Eyes",subtitle:"Grade 8 • Physical Science • Waves and Radiation",content:`### Wave Energy and Dual Nature
Electromagnetic radiation travels through space as wave energy. All electromagnetic waves move at the universal speed of light, but they vary in wavelength and frequency.

### The Spectrum Breakdown
From longest wavelength (lowest energy) to shortest wavelength (highest energy), the spectrum includes:
* **Radio Waves:** Carry communication signals for radios, TVs, and cellphones.
* **Microwaves:** Heat water molecules in food and transmit satellite data.
* **Infrared:** Felt as heat radiating off warm bodies; used inside thermal vision equipment.
* **Visible Light:** The tiny band of wavelengths detectable by human eyes, spanning from red to violet.
* **Ultraviolet (UV):** Invisible rays from the sun that can cause sunburns or feed solar energy.
* **X-Rays:** High-energy rays that pass through muscle tissue but bounce off dense bones, aiding medicine.
* **Gamma Rays:** Shortest waves with maximum energy, produced by supernovas and radioactive decay.

### High Frequency vs. Low Frequency
Wave frequency is inversely proportional to wavelength. Short waves have high frequencies that carry substantial energy. High-frequency waves (like UV, X-rays, and gamma) contain enough energy to strip electrons from atoms—a process called ionization that can damage biological tissue.`,date:"Jun 01, 2026",category:"Science",readTime:"4 min read"},{id:"sci-5",title:"Mitosis vs. Meiosis: Understanding Cell Division",subtitle:"Grade 8 • Life Science • Cellular Reproduction",content:`### Why Cells Divide
Cell division represents the primary mechanism for survival, growth, tissue repair, and the reproduction of all living organisms. Living structures organize this process through two distinct methods depending on the cell's ultimate role.

### Mitosis: Cloning for Growth
Mitosis divides a single body cell (somatic cell) into two genetically identical daughter cells.
* Occurs for growth (like healing a cut) and tissue replacement.
* The starting cell is diploid (having two sets of chromosomes).
* Steps: Prophase, Metaphase, Anaphase, Telophase (PMAT).
* Results in two exact genetic replicas of the original parent cell.

### Meiosis: Creating Genetic Diversity
Meiosis divides a specialized cell twice to create four genetically unique gametes (sex cells: sperm and eggs).
* Meiosis reduces the chromosome count by half to create haploid cells.
* This reduction guarantees that when fertilization occurs, the offspring has the correct number of chromosomes.
* During Prophase I, homologous chromosomes exchange segments—a critical step called 'crossing over'.
* This genetic recombination produces unique offspring, driving natural selection and evolution.`,date:"May 30, 2026",category:"Science",readTime:"5 min read"},{id:"sci-6",title:"Chemical Changes: Equations and Conservation of Mass",subtitle:"Grade 8 • Chemical Science • Reactions and Equations",content:`### Physical vs. Chemical Changes
A physical change alters form or state (like freezing water into ice) but leaves chemical identity intact. A chemical change rearranges atoms, forming entirely new molecules with unique properties (like burning wood).

### Indicators of a Chemical Reaction
Several observable indicators suggest a chemical reaction has taken place:
1. Significant bubble production (gas release).
2. Unexpected temperature change (exothermic or endothermic).
3. The formation of a solid precipitate in a liquid solution.
4. An unexpected color change (like rusting iron).

### Law of Conservation of Mass
The Law of Conservation of Mass states that mass cannot be created or destroyed in a chemical reaction.
* Every atom present in the initial reactants must exist in the final products.
* To satisfy this law, scientists balance chemical equations using coefficients.
* In the equation: 2H₂ + O₂ → 2H₂O, notice how there are exactly 4 hydrogen atoms and 2 oxygen atoms on both sides of the reaction arrow.`,date:"May 28, 2026",category:"Science",readTime:"4 min read"},{id:"sci-7",title:"Gravity and Orbit: Force That Shapes the Universe",subtitle:"Grade 8 • Physical Science • Astronomy",content:`### Ultimate Gravitational Attraction
Gravity is an attractive force that pulls any two objects with mass toward each other. In our solar system, gravity is the cosmic glue that keeps planets orbiting the sun and moons orbiting their parent planets.

### Mass vs. Distance Factors
Isaac Newton's Universal Law of Gravitation details that gravitational force relies on two primary factors:
1. **Mass:** More massive objects exert a exponentially stronger gravitational pull. Because the sun contains 99.8% of our solar system's mass, its massive gravity dominates local space.
2. **Distance:** As the distance between two objects increases, their gravitational attraction drops off sharply.

### The Mechanics of Orbit
An orbit represents a delicate balance between forward motion (inertia) and the downward pull of gravity.
* If a planet moved too slowly, solar gravity would pull it into a collision with the sun.
* If a planet moved too quickly, its inertia would slide it out of orbit and shoot it into deep space.
* Space stations orbit Earth in a constant state of freefall, gliding continuously horizontal to the planet's curve.`,date:"May 26, 2026",category:"Science",readTime:"4 min read"},{id:"sci-8",title:"The Hydrological Water Cycle and Earth's Ecosystems",subtitle:"Grade 8 • Earth Science • Hydrology",content:`### Earth's Master Water Cycle
Every water drop we drink has cycled Earth over millions of years. This hydrological water cycle keeps Earth's fresh water moving between land, rivers, oceans, and our atmospheric layers.

### Stages of Cycle Transport
* **Evaporation:** High heat from the sun energizes surface water, letting molecules rise as vapor.
* **Transpiration:** Living plants dump water vapor into air through tiny leaf pores called stomata.
* **Condensation:** Rising vapor cools off in upper altitudes and clumps onto microscopic dust particles, creating clouds.
* **Precipitation:** As clouds saturate, gravity draws moisture back to the surface as rain, sleet, or snow.

### Ecosystem Balance Impact
Runoff fills local fresh rivers and aquifers while weathering soils, shifting minerals down to oceans. Climate disruptions alter the cycle's balance, producing severe drought patterns in some zones while triggering major flood cycles in other regions.`,date:"May 24, 2026",category:"Science",readTime:"4 min read"},{id:"sci-9",title:"Cellular Respiration: How Organisms Release Energy",subtitle:"Grade 8 • Life Science • Cellular Metabolism",content:`### Powering the Living Cell
Plants store solar energy as glucose, but cells cannot use glucose directly as fuel. Organisms must break down those sugars into a molecular battery called ATP (Adenosine Triphosphate). This critical extraction process is cellular respiration.

### Mitochondria: Cellular Powerhouses
In eukaryotic organisms, respiration takes place inside double-memmbrane organelles called mitochondria.
* The overall process is summarized by the reaction: Glucose + Oxygen → Carbon Dioxide + Water + ATP energy.
* Organisms breathe in Oxygen and exhale Carbon Dioxide as a direct metabolic waste product of this process.

### Aerobic vs. Anaerobic Respiration
* **Aerobic Respiration:** Requires oxygen. Highly efficient, yielding approximately 36 ATP molecules per glucose sugar.
* **Anaerobic Respiration (Fermentation):** Occurs when oxygen is absent (like working sprint muscles hard). It yields only 2 ATP molecules and releases lactic acid, creating muscle fatigue.`,date:"May 22, 2026",category:"Science",readTime:"4 min read"},{id:"sci-10",title:"Mendelian Genetics: Deciphering Punnett Squares",subtitle:"Grade 8 • Life Science • Heredity and Genetics",content:`### Gregor Mendel's Pea Experiments
In the 1850s, an Austrian monk named Gregor Mendel cross-pollinated pea plants, revealing the fundamental laws of inheritance. He discovered that offspring inherit traits as discrete packages of genetic code called genes.

### Understanding Alleles
Genes exist in variations called alleles:
* **Dominant Allele:** A strong allele that overrides other versions (written as a capital letter: T).
* **Recessive Allele:** A weaker allele masked by a dominant partner (written as a lowercase letter: t).
* **Genotype:** The specific combination of alleles (e.g., TT, Tt, or tt).
* **Phenotype:** The observable physical trait (e.g., tall or short height).

### Drawing a Punnett Square
A Punnett Square is a predictive 2x2 grid representing possible allele combinations in offspring.
* Parents pass one of their two alleles to each child.
* If two heterozygous tall parents (Tt) breed, the square shows genotypes: 25% TT, 50% Tt, and 25% tt.
* This results in a phenotype ratio of 3:1—three tall children to one short child.`,date:"May 20, 2026",category:"Science",readTime:"5 min read"},{id:"math-1",title:"The Pythagorean Theorem: Geometry's Ancient Equation",subtitle:"Grade 8 • Mathematics • Geometry & Triangles",content:`### Right Triangle Fundamentals
The Pythagorean Theorem is one of geometry's most famous and practical mathematical rules. It applies strictly and exclusively to right triangles—triangles that contain exactly one 90-degree right angle.

### The Famous Formula
In a right triangle, the side opposite the 90-degree angle is the longest side, called the **hypotenuse** (labeled c). The other two shorter sides are called **legs** (labeled a and b).
The theorem relates these sides mathematically:
* Formula: a² + b² = c²
* In plain terms: if you draw squares on the legs of a right triangle, the combined area of those two squares matches the area of the square on the hypotenuse.

### Finding a Missing Side
You can use the theorem to determine a missing length:
1. Finding hypotenuse: if legs are 3 and 4, then 3² + 4² = 9 + 16 = 25. Thus c = √25 = 5.
2. Finding a leg: if leg is 8 and hypotenuse is 10, then 8² + b² = 10² → 64 + b² = 100 → b² = 36. Thus b = 6.

### Pythagorean Triples
Sets of three whole numbers that perfectly satisfy the formula are called Pythagorean Triples.
* Common examples: (3, 4, 5), (5, 12, 13), (8, 15, 17).
* Multiples of triples are also triples: doubling (3, 4, 5) creates the triple (6, 8, 10).`,date:"Jun 04, 2026",category:"Mathematics",readTime:"5 min read"},{id:"math-2",title:"Linear Functions: Graphing Slopes and Intercepts",subtitle:"Grade 8 • Mathematics • Functions and Algebra",content:`### What Is a Linear Function?
A function represents a mathematical rule that takes an input (x) and gives a single output (y). When plotted on a coordinate grid, a linear function creates a perfectly straight line, showing a constant rate of change.

### Slope-Intercept Equation Model
To work with linear equations, mathematicians use slope-intercept form:
* Equation format: y = mx + b
* **x:** The independent input value.
* **y:** The dependent output value.
* **m:** The slope—or rate of change. This determines the line's steepness.
* **b:** The y-intercept. This is where the line crosses the vertical y-axis (where x = 0).

### Calculating the Slope (m)
Slope measures steepness as ratio of vertical change (rise) to horizontal change (run).
* m = (Change in y) / (Change in x)
* Between coordinates (1, 3) and (3, 7): the y values change by +4, and the x values by +2.
* Slope m = 4 / 2 = 2.

### Types of Slopes
1. **Positive Slope:** The line rises from left to right.
2. **Negative Slope:** The line drops from left to right.
3. **Zero Slope:** Perfectly horizontal line (where y = constant).
4. **Undefined Slope:** Perfectly vertical line (where x = constant).`,date:"Jun 03, 2026",category:"Mathematics",readTime:"4 min read"},{id:"math-3",title:"Systems of Linear Equations: Intersecting Possibilities",subtitle:"Grade 8 • Mathematics • Simultaneous Equations",content:`### Real-World Scenarios
A system of equations consists of two or more equations sharing the same variables. Systems model common real-world choices: which cell phone plan is cheaper, or how long it takes a faster runner to catch up to a slower runner.

### Three Types of Solutions
When you graph two linear equations on a single coordinate plane, three geometric outcomes can occur:
1. **One Unique Solution (Lines Intersect):** The lines meet at exactly one coordinate point (x, y). This coordinate is the only set of values satisfying both equations simultaneously.
2. **No Solution (Parallel Lines):** The lines have identical slopes but different intercepts. Because they never touch, no coordinate can satisfy both.
3. **Infinite Solutions (Same Line):** The equations describe the exact same line. Every single point on the line is a solution.

### Methods for Solving
Algebra offers multiple ways to solve a system of equations:
* **Substitution Method:** Solve one equation for a variable, then plug that value into the other equation.
* **Elimination Method:** Add or subtract the two equations to cancel one variable entirely, making it easy to solve for the remaining variable.`,date:"Jun 02, 2026",category:"Mathematics",readTime:"4 min read"},{id:"math-4",title:"Scientific Notation: Expressing Cosmic and Microscopic Scale",subtitle:"Grade 8 • Mathematics • Number Systems",content:`### Reading Extreme Dimensions
In science, we deal with extreme sizes. The mass of the Earth is 5,970,000,000,000,000,000,000,000 kilograms, and the width of a human strand of DNA is 0.0000000025 meters. Writing these out wastes space. Scientific notation offers a elegant, standardized solution.

### Standard Form Guidelines
Scientific notation writes extremely large or small numbers in a standard format:
* Format: a × 10ⁿ
* **a:** Represents a coefficient greater than or equal to 1, but strictly less than 10.
* **n:** An integer exponent representing the power of ten.

### Positive and Negative Exponents
* **Positive Exponent (Large Numbers):** The exponent shows how many times you multiply by 10 (or how many times to slide the decimal to the right). E.g., 4.5 × 10⁵ = 450,000.
* **Negative Exponent (Small Numbers):** The exponent shows division by 10 (moving the decimal to the left). E.g., 3.8 × 10⁻⁴ = 0.00038.

### Multiplying and Dividing in Notation
* **Multiplication Rule:** Multiply the coefficients, then add the exponents: (2 × 10⁴) × (3 × 10⁶) = 6 × 10¹⁰.
* **Division Rule:** Divide the coefficients, then subtract the exponents: (8 × 10⁸) / (2 × 10³) = 4 × 10⁵.`,date:"Jun 01, 2026",category:"Mathematics",readTime:"4 min read"},{id:"math-5",title:"Irrational Numbers: Exploring Square Roots",subtitle:"Grade 8 • Mathematics • Real Numbers",content:`### The Real Number System
The real number system divides into two separate families: rational numbers and irrational numbers. Understanding what lies in between is essential to algebraic geometry.

### Rational Numbers
Rational numbers are those that can be written as a clean fraction: a/b (where a and b are integers, and b is not 0).
* Decimals of rational numbers either terminate (like 1/4 = 0.25) or repeat infinitely in a clear pattern (like 1/3 = 0.333...).

### Irrational Numbers
Irrational numbers cannot be written as fractions. When expressed as decimals, they continue infinitely without any repeating pattern.
* The most famous irrational number is Pi (π ≈ 3.14159...).
* Square roots of non-perfect squares are also irrational. For example, √2 is irrational (1.41421356...).

### Estimating Irrational Roots
We can estimate the value of an irrational square root by finding the closest perfect squares.
* Consider √20. The closest perfect squares are 16 (4²) and 25 (5²).
* Therefore, √20 lies between 4 and 5.
* Because 20 is mid-way between 16 and 25, √20 is approximately 4.5.`,date:"May 30, 2026",category:"Mathematics",readTime:"4 min read"},{id:"math-6",title:"Congruent and Similar Figures: Scale and Proportions",subtitle:"Grade 8 • Mathematics • Geometry",content:`### Geometric Transformations
In geometry, we perform transformations that turn, slide, flip, or resize physical figures on a coordinate plane. These changes dictate whether resulting shapes are congruent or similar.

### Congruency: Identical Math Duplicates
Two shapes are **congruent** if they share the exact same size and shape. You can rotate or slide a figure, but its angles and side lengths remain unchanged.
* Congruent transformations include translations (slides), rotations (turns), and reflections (flips).
* Corresponding side lengths are equal, and corresponding angles are equal.

### Similarity: Scaled Ratios
Two shapes are **similar** if they share the same shape, but have different sizes.
* Similarity transformations involve dilations—scaling a figure up or down using a scale factor.
* In similar figures, corresponding angles remain congruent.
* Corresponding side lengths are proportional: they all scale by the same ratio (for example, doubling every side).

### Calculating Scale Factor
The scale factor (k) is the ratio of a side in the new figure to the corresponding side in the original figure: k = New / Original. If k > 1, the shape enlarges; if 0 < k < 1, the shape shrinks.`,date:"May 28, 2026",category:"Mathematics",readTime:"5 min read"},{id:"math-7",title:"Volume Formulas: Cylinders, Cones, and Spheres",subtitle:"Grade 8 • Mathematics • Geometry-Three Dimensions",content:`### Calculating 3D Space
Volume is a measure of the three-dimensional space enclosed inside a solid boundary. In 8th-grade geometry, students transition from simple boxes to curved figures: cylinders, cones, and spheres.

### Cylinder Volume
A cylinder is shaped like an aluminum can. It has a flat circular base and vertical walls.
* V = πr²h
* **r:** The radius of the circular base.
* **h:** The total height of the cylinder.

### Cone Volume
A cone is shaped like a party hat. It has a circular footprint that tapers up to a single top apex.
* V = (1/3)πr²h
* If a cone and a cylinder share the same height and radius, the cone's volume is exactly one-third of the cylinder's volume. It takes three cones of water to fill one matching cylinder.

### Sphere Volume
A sphere is shaped like a basketball. It is perfectly symmetrical around its center point.
* V = (4/3)πr³
* Notice how spheres only require the radius (r) to calculate volume, as they have no height or distinct bases. Always compute using order of operations (cubing the radius first).`,date:"May 26, 2026",category:"Mathematics",readTime:"4 min read"},{id:"math-8",title:"Bivariate Data: Reading Scatter Plots",subtitle:"Grade 8 • Mathematics • Probability & Statistics",content:`### Univariate vs. Bivariate
While univariate data describes a single variable (like height), bivariate data measures two separate variables for each subject (like height vs shoe size) to see if they relate.

### Reading Scatter Plots
Scatter plots map bivariate data as independent coordinate points on a grid, letting statisticians eyeball trends:
1. **Positive Association:** As the independent variable (x) increases, the dependent variable (y) also increases. Points rise diagonally. E.g., time spent studying vs test scores.
2. **Negative Association:** As x increases, y decreases. Points drop diagonally. E.g., speed of a car vs drive travel time.
3. **No Association:** Points are scattered randomly like paint splatters. Knowing x tells you nothing about y.

### Line of Best Fit
A line of best fit is a straight line drawn through the center of clustered points in a scatter plot. It allows you to write a y = mx + b model to make predictions for values outside the studied data points.

### Outliers
An outlier is an odd data point that sits far away from the main cluster of points, indicating an unusual case that warrants investigation.`,date:"May 24, 2026",category:"Mathematics",readTime:"4 min read"},{id:"math-9",title:"The Constant of Proportionality: Everyday Rates",subtitle:"Grade 8 • Mathematics • Algebra",content:`### Ratios and Constant Proportions
Ratios compare two values using division. When the ratio of two related quantities stays completely constant, we describe the relationship as proportional.

### Constant value of Proportionality (k)
* A relationship represents k = y / x.
* This is written as: y = kx.
* The number 'k' represents the unit rate or scale constant. On a cartesian coordinate graph, this relationship always draws a straight line that intersects the center coordinates (0, 0).

### Finding the Value in Life Scale
If you purchase 5 textbooks for $45, the mathematical constant remains 45 / 5 = 9.
* Therefore, the unit cost k = 9.
* We write the general equation as: y = 9x.
* This constant factor lets architects draw scales for models or lets food developers multiply recipes for large-scale operations.`,date:"May 22, 2026",category:"Mathematics",readTime:"4 min read"},{id:"math-10",title:"Algebraic Inequalities: Solving Multi-Step Expressions",subtitle:"Grade 8 • Mathematics • Algebra Equations",content:`### Equations vs. Inequalities
An equation states that two expressions are mathematically equal. An inequality states that one expression is greater than, less than, or equal to another, yielding a range of possible answers.

### Key Inequality Symbols
* **<:** Strictly less than (drawn as open circle on a number line).
* **>:** Strictly greater than (open circle).
* **≤:** Less than or equal to (solid filled circle).
* **≥:** Greater than or equal to (solid filled circle).

### The Golden Rule of Inequalities
Solving inequalities follows identical habits to solving standard equations, with one critical warning:
* **The Negative Rule:** When multiplying or dividing both sides of an inequality by a negative number, you **MUST** flip the direction of the inequality sign.
* Solving: −2x + 5 > 13 → −2x > 8. Dividing both sides by −2 yields x < −4 (reversing the sign!).

### Graphing the Solution Set
A solution set like x < −4 represents an infinite number of decimal values. To visualize this on a number line, you draw an open circle at −4, then shade a glowing arrow pointing left.`,date:"May 20, 2026",category:"Mathematics",readTime:"5 min read"},{id:"ela-1",title:"The Rhetoric of Persuasion: Ethos, Pathos, and Logos",subtitle:"Grade 8 • ELA • Writing & Argumentation",content:`### The Ancient Art of Argument
More than 2,000 years ago, Greek philosopher Aristotle analyzed art of rhetoric—the method of using language to persuade an audience. He identified three pathways of persuasion: ethos, pathos, and logos. Successful writers blend all three to build compelling claims.

### Ethos: Credibility and Trust
Ethos relies on the character, credentials, or moral authority of the writer or speaker.
* An audience is far more likely to believe an argument if they respect the person making it.
* E.g., "As a medical doctor with twenty years of practice, I advise taking this vaccine."
* Writers establish ethos by using professional grammar, referencing reliable sources, and acknowledging opposing arguments fairly.

### Pathos: Emotional Connection
Pathos targets the audience's emotions—their fears, values, hopes, or empathy.
* This tactic bypasses logic to stir the heart and inspire immediate action.
* E.g., classical charity flyers showing shivering, hungry puppies in cages to encourage small donations.
* While highly effective, excessive reliance on pathos can make an argument feel cheap or manipulative.

### Logos: Logic and Evidence
Logos appeals to the intellect, relying on hard data, statistics, rational structure, and fact-based logic.
* E.g., "Enacting this law will lower street emissions by 34%, as demonstrated in the climate study's data."
* Logos forms the absolute backbone of academic research and forensic science.`,date:"Jun 04, 2026",category:"ELA",readTime:"4 min read"},{id:"ela-2",title:"Unlocking Literary Tone, Mood, and Atmosphere",subtitle:"Grade 8 • ELA • Literary Analysis",content:`### A Common Source of Confusion
Beginning readers frequently swap the terms **tone** and **mood**. While both elements describe the emotional ecosystem of a story, they originate from different angles of composition.

### Tone: The Author's Attitude
Tone represents the author's specific attitude toward their subject, characters, or audience.
* The tone is calculated and controlled by the author's vocabulary choices and sentence constructions.
* Adjectives describing tone: satirical, objective, nostalgic, cynical, solemn, or playful.
* If a writer describes a character's achievement as a "lucky break," their tone leans skeptical. If they label it a "hard-won victory," their tone is admiring.

### Mood: The Reader's Feelings
Mood describes the emotional atmosphere that the reader feels while reading a passage.
* The mood is the emotional footprint left on the reader's imagination, crafted by descriptions of settings and background sounds.
* Adjectives describing mood: eerie, tense, peaceful, gloomy, suspenseful, or whimsical.
* Consider a setting description: "Rain clawed at the rotting window frame as shadows expanded across the hallway." This choice generates a tense and eerie mood.

### The Interplay
An author uses a specific tone to construct the overall mood. For example, a cynical and sarcastic author tone can create an amusing and lighthearted mood for the reader. When analyzing literature, always ask: who is talking, what language are they selecting, and how does it make me feel?`,date:"Jun 03, 2026",category:"ELA",readTime:"4 min read"},{id:"ela-3",title:"The Art of Symbolism: Writing Beyond the Literal",subtitle:"Grade 8 • ELA • Literary Devices",content:`### Defining the Symbol
Literary symbolism occurs when an author uses a concrete object, character, or action to represent an abstract idea. Symbolism allows writers to inject multilayered meanings into their stories without explicitly lecturing the reader.

### Classical Literary Symbols
Many elements carry common, deeply recognized symbolic weight across literature:
* **The Owl:** Represents wisdom and scholarly observation.
* **Spring:** Symbolizes birth, renewal, youth, and fresh beginnings.
* **Winter:** Symbolizes aging, cold isolation, and death.
* **Running Water:** Often signifies spiritual cleansing, rebirth, or the unstoppable passage of time.

### Contextual Symbols
Some symbols are unique to a specific novel, gaining meaning slowly through the plot:
* In F. Scott Fitzgerald's *The Great Gatsby*, the glowing green light at the end of the dock stands for Jay Gatsby's distant, unreachable hopes and dreams.
* In William Golding's *Lord of the Flies*, a simple conch shell starts as a symbol of civilization and order, but its eventual destruction represents the collapse of law.

### Analyzing Symbolic Elements
When analyzing symbols, look for objects that:
1. Reoccur multiple times at pivotal moments of the plot.
2. Receive highly detailed descriptions out of proportion to their practical function.
3. Are associated with strong emotional reactions from the characters.`,date:"Jun 02, 2026",category:"ELA",readTime:"4 min read"},{id:"ela-4",title:"The Hero's Journey: Analyzing Character Arcs",subtitle:"Grade 8 • ELA • Literary Structures",content:`### Joseph Campbell's Monomyth
In 1949, mythologist Joseph Campbell identified a universal pattern that forms the backbone of countless legends and epics across human history, from ancient Greek myths to modern films like *Star Wars* or *The Hobbit*. He called this structural archetype the **Hero's Journey** (or Monomyth).

### The Three Operational Phases
The journey divides into three core phases:
1. **Departure (The Call to Adventure):** The hero starts in a mundane, comfortable world. An unexpected crisis or messenger issues a call to action. Initially, the hero hesitates, but after receiving guidance from a mentor, they cross the threshold into the unknown.
2. **Initiation (The Abyss & Transformation):** The hero faces distinct trials, encountering allies and enemies. They escalate toward a supreme ordeal—their lowest point of confrontation. Here, they undergo a symbolic death and rebirth, gaining deep wisdom or power.
3. **Return (The Road Back):** The hero returns to their original community, bearing a gift, cure, or boon. They are transformed, using their journey to protect or elevate their home.

### Why the Pattern Perseveres
The Hero's Journey is not just a layout for adventure. It operates as a psychological metaphor for growing up. Facing trials, confronting fears, undergoing internal change, and returning stronger mirrors the transition from childhood to adulthood.`,date:"Jun 01, 2026",category:"ELA",readTime:"5 min read"},{id:"ela-5",title:"Active vs. Passive Voice: Sentence Structure Mastery",subtitle:"Grade 8 • ELA • Grammar & Composition",content:`### Sentences as Action Delivery
Every complete sentence contains a subject performing or receiving an action. The active or passive voice determines whether the subject is the "doer" of the action or the "receiver."

### Active Voice: Direct and Energetic
In the active voice, the subject of the sentence performs the action.
* Structure: Subject → Verb → Object
* E.g., "The wildfire destroyed the historic town."
* Active voice makes your writing direct, active, concise, and energetic.

### Passive Voice: indirect and Object-Focused
In the passive voice, the subject receives the action. The actor is either tacked onto the end of the sentence or omitted entirely.
* Structure: Object → helping verb + past participle → by Subject
* E.g., "The historic town was destroyed by the wildfire."
* E.g., "The window was shattered." (actor is completely unknown).

### When to Select Passive Voice
Though teachers tell writers to avoid passive voice, it has legitimate uses:
1. When the actor is unknown: "My car keys were stolen yesterday."
2. In scientific reports to emphasize the experiment, not the researcher: "The chemical compound was heated to 100 degrees."
3. To shift focus or deflect accountability: "Mistakes were made."`,date:"May 30, 2026",category:"ELA",readTime:"4 min read"},{id:"ela-6",title:"Context Clues: Deciphering Complex Sentences",subtitle:"Grade 8 • ELA • Vocabulary Strategies",content:`### Reading Unfamiliar Language
When you stumble across an unfamiliar word in a text, pulling out a dictionary can disrupt your reading flow. Skilled readers use context clues—the surrounding words, sentences, and hints—to estimate the word's meaning.

### Types of Context Clues
1. **Definition/Explanation:** The author defines the word right after using it. "The explorer encountered a *chasm*, which is a deep, gaping dropoff in the rock face."
2. **Synonym/Restatement:** The author uses a simpler word with a similar meaning close by. "Clarissa was *resolute*; she remained firm and unyielding despite the setbacks."
3. **Antonym/Contrast:** The author provides a word with the opposite meaning, signaling it with transition words like *however*, *but*, or *contrarily*. "Unlike his talkative and outgoing sister, Arthur was *laconic*."
4. **Example/Illustration:** The author lists specific instances. "The marsh was filled with *noxious* compounds, such as sulfur dioxide, sulfuric acid, and decaying organic sludge."
5. **Inference/General Context:** The reader combines prior knowledge with general clues. "With zero rain for six months, the fields became completely *arid*, crackling under the heat."`,date:"May 28, 2026",category:"ELA",readTime:"4 min read"},{id:"ela-7",title:"Understanding Allegories: Metaphorical Masterpieces",subtitle:"Grade 8 • ELA • Advanced Literary Devices",content:`### Double-Layered Storytelling
An allegory is a story, poem, or picture that can be interpreted to reveal a hidden, second layer of meaning—typically a moral, political, or historical message. While the surface characters are engaging, they serve as symbols for real-world historical figures, concepts, or events.

### Famous Literary Allegories
* **George Orwell's *Animal Farm*:** On the surface, a group of barnyard animals rebels against a farmer. Allegorically, the plot retells the events of the Russian Revolution of 1917 and the rise of totalitarianism under Joseph Stalin.
* **Arthur Miller's *The Crucible*:** A play dramatizing the Salem witch trials of 1692. Metaphorically, Miller wrote it to criticize the anti-communist "Red Scare" and McCarthyism happening in the United States during the 1950s.

### Analyzing an Allegorical Text
To decrypt an allegory, pay attention to:
1. Historical parallels in dates, timelines, or battles.
2. Highly exaggerated or flat characters representing ideological viewpoints (e.g., greed, hard labor, or blind loyalty).
3. The moral resolution. What lesson does the struggle deliver about humanity?`,date:"May 26, 2026",category:"ELA",readTime:"5 min read"},{id:"ela-8",title:"Central Message: Dissecting Theme vs. Topic",subtitle:"Grade 8 • ELA • Reading Strategies",content:`### Decoding Underlying Meanings
A recurring mistake in ELA homework is confusing a book's topic with its theme. Master analytical readers understand that identifying a topic is just the starting point—finding the theme reveals why the story was written.

### The Breakdown Differences
* **Topic:** The literal subject. Stated in a single word or simple phrase. E.g., "Love," "Betrayal," or "Revenge."
* **Theme:** The thesis or universal statement the author creates about that topic. Must be structured as a complete, independent sentence. E.g., "Blind desire for revenge can destroy a person's own values and community."

### Formulating the Statement
A clean theme statement should never name specific characters, dates, or plot events. It must contain a universal insight that applies cleanly to the broad human condition outside the boundary of the fictional text. Avoid cheesy clichés like "Always be honest" and instead elaborate on the realistic consequences of human choices.`,date:"May 24, 2026",category:"ELA",readTime:"4 min read"},{id:"ela-9",title:"Dramatic Irony: When the Audience Knows Best",subtitle:"Grade 8 • ELA • Theater and Literature",content:`### Three Varieties of Irony
Irony is a literary tool that plays with expectations. It exists in three main varieties:
1. **Verbal Irony:** Saying the opposite of what you mean (sarcasm).
2. **Situational Irony:** An event occurs that directly contradicts expectations (a fire station burning down).
3. **Dramatic Irony:** Occurs when the reader or audience knows a critical piece of information that the characters do not.

### The Mechanics of Suspense
Dramatic irony is a masterclass in building suspense. When the audience knows a killer is hiding in the closet, a character simply reaching for the doorknob makes the audience gasp. The character behaves normally, unaware of the trap, while the viewer suffers in anticipation.

### Classical Examples in Literature
* In Shakespeare's *Romeo and Juliet*, the audience knows Juliet has only taken a sleeping potion, but Romeo genuinely believes she is dead. His tragic choice to drink poison stems directly from this gap in knowledge.
* In Sophocles' *Oedipus Rex*, the main character is searching for a murderer, unaware to himself—though highly obvious to the audience—that he is the killer.`,date:"May 22, 2026",category:"ELA",readTime:"4 min read"},{id:"ela-10",title:"Analyzing Poetry: Rhythm, Meter, and Rhyme Scheme",subtitle:"Grade 8 • ELA • Poetry and Poetic Devices",content:`### Poetry: Language in Motion
While prose follows standard sentence and paragraph layouts, poetry compresses language into intentional structures of rhythm, sound, and visual space. Reading poetry requires examining its structural mechanics.

### Rhyme Scheme patterns
A rhyme scheme is the ordered pattern of end rhymes in a poem.
* It is mapped using capital letters (A, B, C...).
* For example, an **ABAB** scheme means the first and third lines rhyme (A), while the second and fourth lines rhyme (B).
* Common patterns include rhyming couplets (AABB) and alternating stanzas (ABAB).

### Understanding Meter and Rhythm
Meter is the structural pattern of stressed and unstressed syllables inside a line of poetry, creating its musical beat.
* **The Iamb:** An unstressed syllable followed by a stressed syllable (da-DUM).
* **Iambic Pentameter:** A line containing five iambic feet (ten syllables total: da-DUM da-DUM da-DUM da-DUM da-DUM).
* This classic meter mimics the rhythm of a beating heart and is the primary structure of Shakespeare's sonnets.`,date:"May 20, 2026",category:"ELA",readTime:"5 min read"},{id:"soc-1",title:"The U.S. Constitution: Framing a Balanced Union",subtitle:"Grade 8 • Social Studies • American Civics",content:`### The Philadelphia convention
In May 1787, fifty-five delegates gathered in Philadelphia, Pennsylvania. Initially, their mission was to repair the weak Articles of Confederation. Instead, they spent four months debating, compromising, and drafting an entirely new document: the United States Constitution.

### Crucial Compromises
Crafting the Constitution required settling massive disagreements between states:
* **The Great Compromise:** Addressed legislative representation. Small states wanted equal representation, while large states wanted representation based on population. The compromise created a bicameral (two-house) Congress with a Senate (equal representation) and a House of Representatives (based on population).
* **Three-Fifths Compromise:** A deeply controversial debate over slavery. Southern states wanted enslaved people counted for population representation but not taxation. The compromise calculated five enslaved individuals as matching three free citizens—a calculation that heavily boosted southern political power until the Civil War.

### Core Democratic Principles
1. **Separation of Powers:** Division of federal authority among three branches (Executive, Legislative, Judicial).
2. **Checks and Balances:** Interlocking vetoes and reviews that protect against single-branch tyranny.
3. **Federalism:** The sharing of political power between the national federal government and individual state governments.`,date:"Jun 04, 2026",category:"Social Studies",readTime:"5 min read"},{id:"soc-2",title:"The Industrial Revolution: Iron, Steam, and Society",subtitle:"Grade 8 • Social Studies • World History",content:`### The Transition from Farm to Factory
Beginning in Great Britain in the mid-1700s, the Industrial Revolution was a massive shift from cottage industries and hand tools to steam-powered machinery and factory mass-production. This transformation fundamentally changed where and how people lived.

### The Steam Engine Catalyst
James Watt's steam engine was the engine of industrialization:
* Powered by coal, steam engines ran looms, spun cotton, and pumped iron mines.
* Steam power soon revolutionized transport, leading to steamships and steam locomotives.
* Railroads knit continents together, slashing the time and cost of moving raw goods.

### The Rise of Cities (Urbanization)
Industrialization triggered rapid urbanization as millions of farmworkers relocated to find work in urban factories.
* Cities grew too quickly, lacking basic sanitation, clean sewers, or zoning codes.
* Working-class families huddled into crowded, disease-prone tenement buildings.
* Early factories were dark and dangerous, with shifts lasting 14 hours and relying on child labor.
* Over decades, worker unions and reform movements fought for safety codes, 8-hour workdays, and child labor laws.`,date:"Jun 03, 2026",category:"Social Studies",readTime:"5 min read"},{id:"soc-3",title:"The Silk Road: Connecting the Ancient World",subtitle:"Grade 8 • Social Studies • Ancient History",content:`### Ancient Globalization Network
The Silk Road was not a single paved road. Instead, it was an interlocking network of land and sea trade routes extending over 4,000 miles, connecting China and East Asia to India, Persia, the Middle East, and the Roman Empire.

### Valuable Traded Commodities
Due to the long, dangerous journey across deserts and mountain passes, merchants dealt primarily in luxury items of high value-to-weight ratios:
* **China:** Guarded the secret of silk production, exchanging it for gold, silver, and warhorses. They also traded paper and gunpowder.
* **India:** Exported valuable spices, precious gems, and cotton textiles.
* **Rome:** Sent glassware, fine wines, and olive oil eastward.

### The Diffusion of Ideas and Religion
The greatest legacy of the Silk Road was not the silk, but the transfer of culture, ideas, and technology:
* **Buddhism:** Traveled from India along trade routes to become a major religion in China and Japan.
* **Paper-making:** Developed in China, this technology moved westward, paving the way for the European Renaissance.
* **Pathogens:** Trade routes also acted as superhighways for disease, letting the Black Death travel from Asia to devastate Europe in the 1300s.`,date:"Jun 02, 2026",category:"Social Studies",readTime:"4 min read"},{id:"soc-4",title:"The Fall of the Roman Republic: Julius Caesar's Rise",subtitle:"Grade 8 • Social Studies • World History",content:`### The Virtues of Republican Rome
For nearly five centuries, Rome governed itself as a republic. Power was divided between the Senate (ruling elite), magistrates, and assemblies. Citizens prized their constitution, which sought to block any single man from gaining supreme power.

### Sowing the Seeds of Collapse
As Rome conquered the Mediterranean, its internal balance began to fracture:
1. Massive wealth flooded in, but it centralized in the hands of elite senators, driving poor farmers out of business.
2. Ambitious generals (like Marius and Sulla) began offering land to poor recruits, creating private armies loyal to their general rather than to the Roman state.

### Julius Caesar and the Rubicon Crossing
In 49 BCE, general Julius Caesar commanded a massive, battle-hardened army in Gaul. The Senate, fearing his power, ordered him to disband his legion and return to Rome. Instead, Caesar marched his troops to the Rubicon River—the symbolic northern boundary of Italy.
* Crossing the Rubicon with an active army was an act of treason that launched a massive civil war.
* Caesar emerged victorious, declaring himself "Dictator for Life" in 44 BCE.
* Fearing the absolute death of democracy, a conspieracy of senators assassinated Caesar. However, rather than saving the republic, the assassination triggered a fresh round of civil wars that culminated in Caesar's adopted son, Augustus, becoming Rome's first absolute Emperor.`,date:"Jun 01, 2026",category:"Social Studies",readTime:"5 min read"},{id:"soc-5",title:"Allianced Escalation: The Outbreak of World War I",subtitle:"Grade 8 • Social Studies • Modern World History",content:`### The MAGNITUDE of European Tension
By 1914, Europe was a powder keg waiting for a spark. Hostilities had mounted for decades, driven by four underlying factors (often summarized as M-A-I-N):
* **Militarism:** Countries raced to build massive standing armies and modern steel navies.
* **Alliances:** Countries signed secret mutual-defense treaties, promising to fight if an ally was attacked.
* **Imperialism:** European powers competed globally for colonies and resource wealth in Africa and Asia.
* **Nationalism:** Intense, aggressive pride fueled rivalries between world powers.

### The Spark: Assassination in Sarajevo
On June 28, 1914, Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, was assassinated in Sarajevo by a Serbian nationalist named Gavrilo Princip.

### The Alliance Dominoes Fall
Rather than a localized conflict, the interlocking treaties triggered a massive chain reaction:
1. July 28: Austria-Hungary declares war on Serbia.
2. July 30: Russia mobilizes its army to defend its ally Serbia.
3. August 1: Germany (Austria-Hungary's ally) declares war on Russia.
4. August 3: Germany invades Belgium to strike France (Russia's ally), forcing Great Britain to enter the war.
Within a single week, the world's most powerful nations had plunged into a global war that would cost over twenty million lives.`,date:"May 30, 2026",category:"Social Studies",readTime:"5 min read"},{id:"soc-6",title:"Westward Movement: Manifest Destiny and Native Lands",subtitle:"Grade 8 • Social Studies • American History",content:`### Manifest Destiny Concept
In the 1800s, American expansion was driven by the ideology of Manifest Destiny—the belief that the United States was divinely ordained to expand across the North American continent, from the Atlantic to the Pacific.

### Key Expansion Acquisitions
The U.S. added vast territories through various methods:
* **The Louisiana Purchase (1803):** Bought from France for $15 million, doubling the country's size.
* **Annexation of Texas (1845):** Sparked tensions that led directly to the Mexican-American War.
* **Oregon Treaty (1846):** Settled boundaries with Great Britain.

### The Cost to Native Populations
This expansion came at a tragic, devastating cost to Native American nations:
* **The Indian Removal Act (1830):** President Andrew Jackson authorized the forced relocation of southeastern tribes to lands west of the Mississippi River.
* **The Trail of Tears:** The Cherokee Nation was marched at gunpoint over 1,000 miles. Over 4,000 Cherokee died from starvation, exposure, and disease.
* **The Plains Indian Wars:** As homesteaders and railroads carved up the West, the U.S. military engaged in decades of warfare with Plains tribes, eventually forcing them onto restricted reservations.`,date:"May 28, 2026",category:"Social Studies",readTime:"4 min read"},{id:"soc-7",title:"The Magna Carta: Laying the Foundations of Law",subtitle:"Grade 8 • Social Studies • Civic Foundations",content:`### King John's Absolute Abuse
By 1215, England was ruled by King John, an autocrat who raised taxes arbitrarily, confiscated noble estates, and imprisoned rivals without trial. Fed up with his abuses, a group of powerful English barons rebelled.

### The Confrontation at Runnymede
In June 1215, the barons trapped King John at Runnymede and forced him to sign a document called the **Magna Carta** (Latin for "Great Charter").

### Core Legal Legacy
Though initially intended to protect only the elite nobility, the charter established critical legal concepts that form the basis of modern democracies:
1. **Rule of Law:** No citizen—not even a ruling king—is above the law. Everyone must follow the same rules.
2. **Due Process:** The government cannot seize property or imprison citizens without following established legal steps.
3. **Trial by Jury:** Enshrined in Clause 39, which states that no free man shall be imprisoned except by the lawful judgment of his peers.
* Centuries later, the drafts of the U.S. Bill of Rights borrowed directly from these foundational guidelines.`,date:"May 26, 2026",category:"Social Studies",readTime:"4 min read"},{id:"soc-8",title:"Medieval Feudalism: The Social Scale of Europe",subtitle:"Grade 8 • Social Studies • Medieval European Civics",content:`### Decentralized Protection System
Following the fall of the Western Roman Empire in 476 CE, Europe lacked a strong central government or military. To protect against pillaging invaders (like Vikings), a political and social system called **feudalism** emerged.

### The Feudal Pyramid Structure
Feudalism operated on an hierarchy of mutual obligations:
* **The King:** Claimed ownership of all land in the kingdom, dividing and gifting large chunks (fiefs) to trusted lords in exchange for loyalty and tax revenue.
* **Lords/Nobles:** Ruled their fiefs, serving as local judges and tax collectors. They pledged knights to defend the king.
* **Knights:** Highly trained mounted soldiers who received small parcels of land from lords in exchange for military service. They followed a strict code of conduct called chivalry.
* **Serfs/Peasants:** The vast majority of the population (over 90%). They were legally bound to work the land on a lord's manor. Serfs could not leave without permission, laboring to feed the kingdom in exchange for safety behind the manor walls.`,date:"May 24, 2026",category:"Social Studies",readTime:"4 min read"},{id:"soc-9",title:"The Road to Revolution: Taxation without Voice",subtitle:"Grade 8 • Social Studies • American History",content:`### The Cost of Empire Security
Following the French and Indian War in 1763, Great Britain emerged victorious but deeply in debt. British Parliament believed the North American colonists—who had benefited from British protection—should pay their fair share.

### Hostile Tax Legislation
Parliament passed a series of highly controversial tax acts:
* **The Stamp Act (1765):** Taxed all paper goods, from ship documents to playing cards.
* **The Townshend Acts (1767):** Taxed key imported necessities including glass, painters' lead, and paper.
* **The Tea Act (1773):** Monopolized low-cost British tea sales, undercutting local colonial merchants.

### "No Taxation Without Representation"
Colonists rebelled, not because of the tax cost, but because of the constitutional principle. They argued that because colonists had no elected representatives in the distant British Parliament, any tax passed there was unconstitutional. Protest exploded, prompting violent clashes and boycotts that culminated in the outbreak of the Revolutionary War.`,date:"May 22, 2026",category:"Social Studies",readTime:"4 min read"},{id:"soc-10",title:"The Great Depression: Economic Crash and Recovery",subtitle:"Grade 8 • Social Studies • Modern U.S. History",content:`### The End of the Roaring Twenties
During the 1920s, the U.S. economy boomed. People bought cars, radios, and homes on credit. Stock prices climbed to astronomical levels, fueled by risky speculation and buying stock on margin (using borrowed money).

### The Market Crash of 1929
On October 29, 1929—known as "Black Tuesday"—the stock market bubble burst. Stock prices collapsed, wiping out fortunes in a single day and triggering a massive economic downturn:
* Fearing bankruptcy, people rushed to banks to withdraw cash. This caused widespread bank runs. Over 9,000 banks failed, losing millions of dollars of life savings.
* Factories closed, causing unemployment to skyrocket to an unprecedented 25% by 1933.

### FDR and the New Deal Reform
In 1932, Franklin D. Roosevelt was elected president, promising a "New Deal" for the American people based on three Rs:
1. **Relief:** Providing immediate aid and food to starving, out-of-work citizens.
2. **Recovery:** Creating massive federal jobs programs (like the Civilian Conservation Corps) to build schools, parks, and dams.
3. **Reform:** Passing hard regulations (like the FDIC to guarantee bank deposits) to prevent future economic crashes.`,date:"May 20, 2026",category:"Social Studies",readTime:"5 min read"},{id:"sci-final-guide",title:"Final Study Guide for Science",subtitle:"Grade 8 • Science • Comprehensive Review",content:`### 1. Classification of Living and Non-Living Entities
Understanding the differences between bacteria, viruses, protists, fungi, plants, and animals is fundamental to biology.

| Feature / Group | Cell Type | Cellularity | Cell Wall | Nutrition | Examples | Other Key Details |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Bacteria** | Prokaryotic | Unicellular | Yes (peptidoglycan) | Autotrophic / Heterotrophic | *E. coli*, Streptococcus | Lack a nucleus or membrane-bound organelles. Contain single circular DNA. |
| **Viruses** | *Non-living* | Acellular | No cell wall | None | Influenza, COVID-19, Bacteriophage | Cannot replicate independently; require host machinery. Consist of a genome (DNA/RNA) in a protein capsid. |
| **Protists** | Eukaryotic | Mostly Unicellular | Varies | Photosynthetic / Heterotrophic | Amoeba, Paramecium, Euglena | "Grab-bag" kingdom for organisms that do not fit into plants, animals, or fungi. |
| **Fungi** | Eukaryotic | Mostly Multicellular | Yes (chitin) | Heterotrophic (by absorption) | Mushrooms, Yeast (unicellular), Mold | Act as key decomposers in systems. Store energy as glycogen. |
| **Plants** | Eukaryotic | Multicellular | Yes (cellulose) | Autotrophic (photosynthetic) | Mosses, Ferns, Maple trees | Contain chloroplasts and large central vacuoles. Perform photosynthesis. |
| **Animals** | Eukaryotic | Multicellular | No | Heterotrophic (by ingestion) | Insects, Fish, Humans | Exhibit mobility at some life stage. Have specialized sensory systems. |

---

### 2. The Characteristics of Life
To be considered alive, an organism must possess all of the following core qualities:
1. **Cellular Organization:** Made of one or more specialized cells.
2. **Reproduction:** Possesses the capacity to produce offspring (sexually or asexually).
3. **Metabolism:** Obtains and utilizes raw chemical energy and materials to maintain processes.
4. **Homeostasis:** Actively maintains a stable internally regulated environment (e.g., body temperature).
5. **Heredity:** Contains a genetic blueprint (DNA) inherited from parents.
6. **Response to Stimuli:** Detects and reacts to changes in outer surroundings.
7. **Growth and Development:** Increases in physical size and matures structurally over time.
8. **Adaptation through Evolution:** Populations adapt over generations via natural selection.

---

### 3. The Statements of Cell Theory
Developed by Schleiden, Schwann, and Virchow, the cell theory states:
1. **All living things are composed of one or more cells.**
2. **The cell is the basic structural and functional unit of life.**
3. **All cells arise solely from pre-existing, living cells.**

---

### 4. Cell Organelles and Their Functions
Organelles act as specialized "organs" within eukaryotic cells.

* **Cell Membrane:** A semi-permeable phospholipid bilayer that selectively controls which substances enter or exit the cell.
* **Ribosomes:** Sites of protein synthesis, assembling amino acid chains based on mRNA directions.
* **Nucleus:** Stores safe genetic blueprints (DNA) and directs cellular activity (the "Control Center").
* **Mitochondria:** Generates chemical energy (ATP) through cellular respiration (the cellular "Powerhouse").
* **Vacuole:** Storage spaces for water, cellular wastes, and nutrients.
  * Plant cells have a **Large Central Vacuole** that maintains turgor pressure; animal cells have multiple small vacuoles.
* **Vesicles:** Tiny membrane sacs that isolate and transport molecules within the cell or expel them outward.
* **Chloroplast:** Green organelles containing chlorophyll; the site where light is converted into glucose via photosynthesis.
* **Cell Wall:** A rigid outer layer composed of cellulose (in plants) that provides structured support, shape, and physical protection.
* **Rough Endoplasmic Reticulum (RER):** Covered in ribosomes; synthesizes and processes proteins meant for membranes or export.
* **Smooth Endoplasmic Reticulum (SER):** Lacks ribosomes; synthesizes lipids, metabolizes carbohydrates, and detoxifies chemicals or poisons.

---

### 5. Plant vs. Animal Cells
While both are eukaryotic, they contain key differences:

* **Plant Cells only (or rarely in animals):** Cell wall, Chloroplasts, and a single Large Central Vacuole. They typically have a rigid, rectangular shape.
* **Animal Cells only (or rarely in plants):** Centrioles/Centrosomes (used for cell division) and Lysosomes (containing digestive enzymes for waste breakdown). They are typically rounder and have irregular shapes.

---

### 6. The Reaction of Photosynthesis
Photosynthesis is how autotrophs transform solar radiation into chemical carbohydrates (glucose):

$$\\text{Carbon Dioxide (6CO}_2) + \\text{Water (6H}_2\\text{O)} + \\text{Solar Light} \\longrightarrow \\text{Glucose (C}_6\\text{H}_{12}\\text{O}_6) + \\text{Oxygen (6O}_2)$$

* **Reactants:** Carbon Dioxide, Water, Sunlight.
* **Products:** Glucose (stored sugar), Oxygen (byproduct).
* **Location:** Chloroplast.

---

### 7. The Reaction of Cellular Respiration
Respiration is how living cells combust sugars to generate usable biological batteries (ATP):

$$\\text{Glucose (C}_6\\text{H}_{12}\\text{O}_6) + \\text{Oxygen (6O}_2) \\longrightarrow \\text{Carbon Dioxide (6CO}_2) + \\text{Water (6H}_2\\text{O)} + \\text{ATP Chemical Energy}$$

* **Reactants:** Glucose, Oxygen.
* **Products:** Carbon Dioxide, Water, ATP (approx. 36-38 ATP under aerobic conditions).
* **Location:** Cytoplasm (glycolysis) and Mitochondria (Krebs cycle & Electron Transport Chain).

---

### 8. Levels of Biological Organization
The complexity of multicellular organisms is organized hierarchically:

$$\\text{Atom} \\longrightarrow \\text{Molecule} \\longrightarrow \\text{Organelle} \\longrightarrow \\text{Cell} \\longrightarrow \\text{Tissue} \\longrightarrow \\text{Organ} \\longrightarrow \\text{Organ System} \\longrightarrow \\text{Organism}$$

* **Cell:** Basic unit of life (e.g., cardiac muscle cell).
* **Tissue:** Group of similar cells working together (e.g., cardiac muscle tissue).
* **Organ:** Structures composed of multiple tissue types working for a unified goal (e.g., Heart).
* **Organ System:** Group of cooperating organs (e.g., Cardiovascular System).
* **Organism:** The complete individual (e.g., Human block).

---

### 9. Main Human Body Systems
Our body coordinates functions through several organ systems:

* **Nervous: Controls and coordinates body movements and responses.** Composed of the brain, spinal cord, and sensory nerves. It transmits rapid electrochemical signals.
* **Integumentary: Acts as a physical barrier against invaders and prevents fluid loss.** Composed of skin, hair, and nails. Helps regulate body temperature.
* **Endocrine: Regulates long-term processes via blood chemical messengers (hormones).** Made of glands (thyroid, pituitary, adrenal, pancreas) that govern growth, metabolism, and reproduction.
* **Muscular: Enables voluntary and involuntary physical movement.** Composed of skeletal, smooth, and cardiac muscles. Generates body heat as a byproduct.
* **Excretory: Filters and removes metabolic waste materials from blood.** Composed of kidneys, ureters, urinary bladder, and skin/lungs. Regulates water and pH levels.
* **Skeletal: Provides structure and protects critical inner organs.** Composed of 206 bones, cartilage, joints, and ligaments. Acts as a site of blood cell production (bone marrow) and calcium storage.

---

### 10. Energy Pyramids and the 10% Rule
An energy pyramid tracks how chemical calories travel through trophic layers in an ecosystem:

1. **Producers (Base):** Capture solar energy directly (e.g., plants, kelp).
2. **Primary Consumers:** Herbivores eating plants (e.g., grasshoppers, deer).
3. **Secondary Consumers:** Carnivores eating herbivores (e.g., frogs, snakes).
4. **Tertiary Consumers:** Apex predators (e.g., eagles, wolves).

**The 10% Rule:**
Only about **10%** of the energy stored at one trophic level is passed onto the next level.
* The other **90%** of the energy is lost to the environment as metabolic heat, biological efforts of finding food, or exits the system as indigestible waste.
* For example, if producers store 10,000 kJ of energy, primary consumers acquire 1,000 kJ, secondary consumers get 100 kJ, and tertiary consumers gain only 10 kJ.

---

### 11. Steps of the Water Cycle
The hydrological cycle recirculates water:

1. **Evaporation:** The sun heats surface water (oceans, lakes), vaporizing it into atmospheric gas.
2. **Transpiration:** Water evaporates off green plant leaves through stomata pores.
3. **Condensation:** Hot rise-vapor cools down, clumping into visible cloud droplets.
4. **Precipitation:** Condensed droplets fall back to land as rain, snow, hail, or sleet.
5. **Runoff / Collection:** Precipitation flows over ground into local streams, rivers, and oceans.
6. **Infiltration / Percolation:** Water seeps down into layers of soil, refilling deep groundwater aquifers.

---

### 12. Types of Symbiosis and Examples
Symbiosis describes long-term close interactions between different species:

* **Mutualism ($+/+$):** Both organisms benefit.
  * *Example:* Bees gather sweet food from flowers while pollinating them; Clownfish finding anemone shelter while fending off predators.
* **Commensalism ($+/0$):** One benefits, other is unaffected.
  * *Example:* Barnacles attaching to whale skin to get a free ride through nutrient-rich waters; Cattle egrets eating flushed insects near grazing cattle.
* **Parasitism ($+/-$):** One benefits (parasite), other is harmed (host).
  * *Example:* Ticks sucking blood from a dog; Tapeworms feeding off host nutrients inside mammalian intestines.

---

### 13. Predation vs. Symbiosis
* **Why Predation is Different:** Symbiosis is defined as a sustained, long-term living arrangement where two species reside close together over an extended period. Predation ($+/-$) is a rapid, immediate encounter where a predator hunts, kills, and consumes its prey. It is not an ongoing, cooperative or close life structural symbiotic relationship.

---

### 14. Keystone Species
A **keystone species** is an organism that has an exceptionally large, critical impact on its ecosystem relative to its abundance.
* If a keystone species is removed, the entire ecosystem undergoes a catastrophic shift or collapse, drastically lowering local biodiversity.
* *Classic Example:* **Sea Otters** eat abundant sea urchins. If sea otters are removed, urchins overpopulate and clear entire kelp forests, destroying are-shelter for hundreds of local marine species.

---

### 15. The Carbon Cycle
Carbon cycles through biological and geological reservoirs:

1. **Photosynthesis:** Plants pull $\\text{CO}_2$ out of the air to build glucose.
2. **Respiration:** Animals/plants burn sugar and exhale $\\text{CO}_2$ into the atmosphere.
3. **Decomposition:** Fungi and bacteria break down dead tissue, returning carbon to soil or releasing gaseous $\\text{CO}_2$.
4. **Combustion:** Burning old fossil fuels or forests releases stored carbon as atmospheric gases.
5. **Geological Storage:** Dead organic matter buried under heat/pressure becomes coal/oil over millions of years.

---

### 16. Natural Selection and Its Conditions
Natural selection is the driver of evolution. It states that individuals with advantageous traits suited for an environment are more likely to survive and reproduce.

Four absolute conditions must exist for Natural Selection to occur:
1. **Variation:** Different individuals in a population must have varying traits (e.g., some beetles are green, others brown).
2. **Inheritance:** The traits must be genetic and transferable via DNA from parents to offspring.
3. **Overproduction:** Species must generate more offspring than local resources can support, creating competition.
4. **Differential Survival and Reproduction:** Individuals with advantageous traits survive competition (Selection) and pass their favorable alleles to the next generation.

---

### 17. Reading Genetics: Punnett Squares and Pedigrees

#### Reading Punnett Squares:
A Punnett square predicts offspring genotypes using parental alleles (Capital = Dominant, Lowercase = Recessive).
* **Homozygous:** Having two of the same allele (e.g., *TT* or *tt*).
* **Heterozygous:** Having mixed alleles (e.g., *Tt*).
* For parents *Tt* and *Tt*:
  * 25% homozygous dominant (*TT*), 50% heterozygous (*Tt*), 25% homozygous recessive (*tt*).
  * 3:1 phenotype distribution ratio (75% dominant, 25% recessive trait expressed).

#### Reading Pedigrees:
A pedigree chart tracks a genetic trait across multiple family generations:
* **Squares:** Represent males.
* **Circles:** Represent females.
* **Shaded Shape:** Indicates the individual displays the traced trait (affected).
* **Unshaded Shape:** Represents a normal individual without the trait.
* **Horizontal Lines:** Connect biological parents.
* **Vertical Lines:** Lead to offspring listed from left to right in birth order.
* **Autosomal Recessive Indicator:** If the trait skips generations (unaffected parents have an affected child), the trait is recessive.`,date:"Jun 08, 2026",category:"Science",readTime:"10 min read"},{id:"it-final-guide",title:"Italian Final Study Guide",subtitle:"Units 1–7 • Comprehensive Italian Course Review",content:`### Benvenuti! Italian Language Review
This study guide compiles vocabularies, grammar architectures, and structured remediation files for Units 1 to 7. 

---

### Unit 1: Primo Giorno di Scuola (First Day of School)

#### 1. Countries and Nationalities (Paesi e Nazionalità)
In Italian, nationalities function as adjectives and adjust their endings to match the gender and number of the noun.

* **Italia** $\\longrightarrow$ italiano/italiana
* **Svizzera** $\\longrightarrow$ svizzero/svizzera
* **Brasile** $\\longrightarrow$ brasiliano/brasiliana
* **Spagna** $\\longrightarrow$ spagnolo/spagnola
* **Germania** $\\longrightarrow$ tedesco/tedesca
* **Francia** $\\longrightarrow$ francese (same for masculine/feminine)
* **Argentina** $\\longrightarrow$ argentino/argentina
* **Giappone** $\\longrightarrow$ giapponese
* **Cina** $\\longrightarrow$ cinese
* **India** $\\longrightarrow$ indiano/indiana
* **Nigeria** $\\longrightarrow$ nigeriano/nigeriana
* **Egitto** $\\longrightarrow$ egiziano/egiziana
* **Marocco** $\\longrightarrow$ marocchino/marocchina
* **Canada** $\\longrightarrow$ canadese
* **Senegal** $\\longrightarrow$ senegalese
* **Belgio** $\\longrightarrow$ belga (plural: belghi/belghe)
* **Kenia** $\\longrightarrow$ keniota
* **Vietnam** $\\longrightarrow$ vietnamita (plural: vietnamiti/vietnamite)

#### 2. Greeting Phrases and Introductions
* **Buongiorno, mi chiamo [Name]. Come ti chiami?** (Good day, I call myself... What is your name?)
* **Ciao! Mi chiamo [Name]. Come stai?** (Hi! I call myself... How are you?)
* **Come si chiama? / Si chiama [Name].** (What is their name? / They are called...)
* **Questo è [Name].** (This is... [for males])
* **Questa è [Name].** (This is... [for females])
* **Lui è [Name] / Lei è [Name].** (He is... / She is...)
* **Di dov'è? OR Di dove sei?** (Where are you from? - Formal/Informal)
* **Sono di [City], di [Country]. Sono [Nationality].** (I am from...)

#### 3. Present Indicative of the Verb **Essere** (To Be)
Used to describe inherent traits, nationality, origin, state, and hours:

* **Io sono** (I am)
* **Tu sei** (You are [informal])
* **Lui/Lei/Lei è** (He/She is, You are [formal])
* **Noi siamo** (We are)
* **Voi siete** (You all are)
* **Loro sono** (They are)

#### 4. Adjectives Describing People
* **Felice** (Happy)
* **Triste** (Sad)
* **Alto** (Tall)
* **Basso** (Short)
* **Stanco** (Tired)
* **Simpatico** (Charming/Nice)

#### 5. Present Indicative of \`-are\` Verbs (conjugation)
Using **amare** (to love) as the base paradigm:
* **Io** amo
* **Tu** ami
* **Lui/Lei** ama
* **Noi** amiamo
* **Voi** amate
* **Loro** amano

#### 6. Spelling Words
* **Come si scrive [parola]?** (How do you write [word]?)

---

### Unit 2: Tanti Auguri (Happy Birthday)

#### 1. Numbers 0 - 100
* **0–10:** zero, uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci
* **11–20:** undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti
* **21–100 rules:**
  * When joining *uno* (one) or *otto* (eight), drop the final vowel of the tens prefix: *ventuno*, *ventotto*, *trentuno*, *trentotto*.
  * When joining *tre* (three) to numbers above 20, add an acute accent to the final **é**: *ventitré*, *trentatré*.
  * **Tens:** venti (20), trenta (30), quaranta (40), cinquanta (50), sessanta (60), settanta (70), ottanta (80), novanta (90), cento (100).

#### 2. Months of the Year (Mesi dell'anno)
Months are **never capitalized** in Italian unless starting a sentence. State the day before the month (e.g., *il diciannove febbraio*):
* *gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre.*

#### 3. How to Structure a Birthday Card (Un Biglietto d'Auguri)
\`\`\`text
(Il tuo nome e cognome)                           (Regione d'Italia), (La data)
Via dei [Nome Via]
[Regione scelta]

Cara/Caro [Nome],
Buon compleanno, tanti auguri! Tu hai [Età dell'interlocutore] anni, vero? 
Io ho tredici anni! Quando festeggi il compleanno?
Ciao, la tua amica / il tuo amico!
Con affetto, 
[Il tuo nome]
\`\`\`

#### 4. Body Parts (Parti del Corpo)
* **Testa** (Head)
* **Denti** (Teeth)
* **Gola** (Throat)
* **Stomaco** (Stomach)
* **Pancia** (Belly/Pudge)
* **Piedi** (Feet) $\\rightarrow$ *Cammina* (Walks)

#### 5. Age, Birthdays, and Well-Being
* **Age:** *Quanti anni hai? / Ho [età] anni.*
* **Birthday:** *Quando è il tuo compleanno? / Il mio compleanno è il [giorno] [mese].*
* **Well-being:** *Ciao, come stai? / Io sto male / ho mal di [parte]. Non sto tanto bene. Io sto molto bene.*

#### 6. Present indicative of **Avere** (To Have) and **Stare** (To Be/Stay)
* **Avere:** Io ho, Tu hai, Lui/Lei ha, Noi abbiamo, Voi avete, Loro hanno
* **Stare:** Io sto, Tu stai, Lui/Lei sta, Noi stiamo, Voi state, Loro stanno

#### 7. Plurals and Endings Rules
* Single vowel accented nouns don't change: *una università* $\\rightarrow$ *due università*.
* Ending changes: **-io** $\\rightarrow$ **-i** (*esercizio* $\\rightarrow$ *esercizi*) | **-ca/-ga** $\\rightarrow$ **-che/-ghe** (*stanca* $\\rightarrow$ *stanche*) | **-co/-go** $\\rightarrow$ **-chi/-ghi** (*banco* $\\rightarrow$ *banchi*). Exception: *stomaco* $\\rightarrow$ *stomaci*.
* *Memory Rule:* "Old Italian Aunts Eat Everything Italian" (**-o** $\\rightarrow$ **-i** | **-a** $\\rightarrow$ **-e** | **-e** $\\rightarrow$ **-i**).

#### 8. Definite Articles (Articoli Determinativi)
Definite articles must align in gender and number:

| Gender / Group | Singular | Plural | Usage Rule |
| :--- | :--- | :--- | :--- |
| **Maschile** | **il** (*il libro*) | **i** (*i libri*) | Before consonants. |
| | **lo** (*lo studente*) | **gli** (*gli studenti*) | Before s+consonant, z, ps, gn, x, y, pn. |
| | **l'** (*l'albero*) | **gli** (*gli alberi*) | Before vowels. |
| **Femminile** | **la** (*la casa*) | **le** (*le case*) | Before consonants. |
| | **l'** (*l'ora*) | **le** (*le ore*) | Before vowels. |

---

### Unit 3: Foto di Classe (Classroom Photo)

#### 1. Numbers up to 9,999,999
* **100–900:** cento (100), duecento (200), trecento (300), quattrocento (400), cinquecento (500), seicento (600), settecento (700), ottocento (800), novecento (900).
* **Thousands:** mille (1,000), duemila (2,000), tremila (3,000)... diecimila (10,000), centomila (100,000).
* **Millions:** un milione (1,000,000), due milioni (2,000,000), un miliardo (1,000,000,000).

#### 2. Classroom Objects (Oggetti della Classe)
* **Matita** (pencil), **Gomma** (eraser), **Libro** (book), **Forbici** (scissors), **Spillatrice** (stapler), **Quaderno** (notebook), **Astuccio** (pencil case), **Banco** (desk), **Cartina** (map), **Temperamatite** (pencil sharpener), **Zaino** (backpack), **Computer** (computer), **Lavagna** (board), **Righello** (ruler), **Foglio** (folder/sheet), **Finestra** (window), **Cestino** (trash can).

#### 3. School Subjects
* *Geografia, Educazione fisica, Educazione musicale, Educazione artistica, Educazione tecnica, Matematica, Scienze, Storia, Letteratura, Italiano, Biologia, Chimica.*
* Question: *Cosa studi?* (What do you study?) $\\rightarrow$ *Studio scienze e matematica.*

#### 4. Present of -ere (Group 2) and -ire (Group 3) Verbs
* **Scrivere (-ere):** scrivo, scrivi, scrive, scriviamo, scrivete, scrivono.
* **Dormire (-ire):** dormo, dormi, dorme, dormiamo, dormite, dormono.

#### 5. There Is / There Are
* **C'è** $\\rightarrow$ followed by a singular noun (e.g., *C'è un banco nella classe*).
* **Ci sono** $\\rightarrow$ followed by plural nouns (e.g., *Ci sono molti libri*).

#### 6. Demonstrative Adjectives (Questo and Quello)
* **Questo/Questa/Questi/Queste** (This/These - near the speaker).
* **Quello** (That - far away) changes forms like definite articles: *quel* (like *il*), *quello* (like *lo*), *quell'* (like *l'*), *quella* (like *la*), *quei* (plural *i*), *quegli* (plural *gli*), *quelle* (plural *le*).

#### 7. Classroom Actions
* **Parlare** (to speak), **Leggere** (to read), **Scrivere** (to write), **Ascoltare** (to listen), **Studiare** (to study), **Rispondere** (to respond), **Prendere appunti** (to take notes).

---

### Unit 4: Il Carattere e L'aspetto Fisico (Character and Physical Appearance)

#### 1. Character Qualities and Antonyms
* **Chiacchierone** (Chatty/Talkative)
* **Goloso** (Gluttonous)
* **Intelligente** (Intelligent)
* **Studioso** (Studious)
* **Timido** (Shy)
* **Disordinato** (Messy) $\\leftrightarrow$ **Ordinato** (Organized)
* **Divertente** (Fun) $\\leftrightarrow$ **Noioso** (Boring)
* **Generoso** (Generous) $\\leftrightarrow$ **Avaro** (Stingy)
* **Simpatico** (Nice) $\\leftrightarrow$ **Antipatico** (Unfriendly)
* **Pigro** (Lazy) $\\leftrightarrow$ **Attivo** (Active)
* **Attento** (Attentive) $\\leftrightarrow$ **Distratto** (Distracted)
* **Scherzoso** (Playful) $\\leftrightarrow$ **Serio** (Serious)
* **Allegro** (Cheerful) $\\leftrightarrow$ **Triste** (Sad)
* **Pauroso** (Fearful) $\\leftrightarrow$ **Coraggioso** (Brave)
* **Chiuso** (Reserved) $\\leftrightarrow$ **Aperto** (Outgoing)
* **Cattivo** (Bad/Mean) $\\leftrightarrow$ **Buono** (Good)

#### 2. Physical Characteristics (Aspecto Fisico)
* **Capelli (Hair):** lunghi (long), corti (short), ricci (curly), lisci (straight). Colors: rossi (red), neri (black), biondi (blonde), castani (brown).
* **Occhi (Eyes):** neri, azzurri (blue), verdi (green), marroni/castani (brown).
* **Stature:** alto (tall), basso (short), robusto (strong/built), magro (skinny), grasso (fat).

#### 3. Places in the School (La Scuola)
* *Aula (Class), Aula Magna (Auditorium), Campo Sportivo (Field), Palestra (Gym), Sala Professori (Teacher Lounge), Segreteria (Main Office), Cortile (Courtyard), Laboratorio di Scienze (Science Lab), Corridoio (Hallway).*

#### 4. Possessive Adjectives and Pronouns
In Italian, possessive adjectives generally require definite articles:

| Person | Maschile Singolo | Maschile Plurale | Femminile Singolo | Femminile Plurale |
| :--- | :--- | :--- | :--- | :--- |
| **My** | il mio | i miei | la mia | le mie |
| **Your (sing.)** | il tuo | i tuoi | la tua | le tue |
| **His/Her** | il suo | i suoi | la sua | le sue |
| **Our** | il nostro | i nostri | la nostra | le nostre |
| **Your (plur.)** | il vostro | i vostri | la vostra | le vostre |
| **Their** | il loro | i loro | la loro | le loro |

* **Drop the article** before singular, unmodified family relatives (e.g., *mia sorella*, *mio fratello*). BUT keep it with *loro*: *la loro madre*.

#### 5. Verbs in \`-care\` and \`-gare\`
Verbs ending in **-care** (*dimenticare*) and **-gare** (*pagare*) add an **"h"** in the 2nd person singular (*tu*) and 1st person plural (*noi*) to preserve the hard sound:
* **Tu:** *dimentichi*, *paghi*
* **Noi:** *dimentichiamo*, *paghiamo*

#### 6. The \`-isc\` Verbs (Capire paradigm)
* **Capire (to understand):** capisco, capisci, capisce, capiamo, capite, capiscono.
* Other -isc verbs: *arrossire* (blush), *dimagrire* (lose weight), *finire* (finish), *preferire* (prefer), *pulire* (clean), *spedire* (send), *tossire* (cough), *ubbidire* (obey).

#### 7. Present indicative of the irregular verb **Fare** (to do/make)
* **Fare:** Io faccio, Tu fai, Lui/Lei fa, Noi facciamo, Voi fate, Loro fanno

---

### Unit 5: Giorni, Routine, e Orari (Days, Routine, Time)

#### 1. Days of the Week (Giorni della Settimana)
Add an accent on the **ì** for Monday-Friday:
* *lunedì, martedì, mercoledì, giovedì, venerdì, sabato, domenica.*

#### 2. Daily Routine (Routine Quotidiana)
Main reflexive verbs & routine idioms:
* *svegliarsi (wake up), lavarsi i denti (brush teeth), fare la doccia / lavarsi (take a shower/wash), pettinarsi (comb hair), fare colazione (have breakfast), andare a scuola (go to school), pranzare (have lunch), fare i compiti (do homework), cenare (have dinner), andare a letto (go to bed), dormire (sleep).*

#### 3. Telling Time (Telling Time and Adverbs)
* **Adverbs of Time:** *in ritardo* (late), *tardi* (at a late hour), *in anticipo* (early/ahead of schedule), *presto* (soon/early).
* **Parts of the Day:** *di mattina* (5:00 AM - 11:59 AM), *di pomeriggio* (12:00 PM - 5:59 PM), *di sera* (6:00 PM - 9:59 PM), *di notte* (10:00 PM - 4:59 AM).

#### 4. Articulated Prepositions (Preposizioni Articolate)
When a core preposition combines with a definite article, they merge into a single word:

| Prep | + il | + lo | + l' | + la | + i | + gli | + le |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **a** | al | allo | all' | alla | ai | agli | alle |
| **da** | dal | dallo | dall' | dalla | dai | dagli | dalle |
| **di** | del | dello | dell' | della | dei | degli | delle |
| **in** | nel | nello | nell' | nella | nei | negli | nelle |
| **su** | sul | sullo | sull' | sulla | sui | sugli | sulle |

#### 5. Present Indicative of Reflexive Verbs (**Alzarsi**)
Reflexive verbs require reflexive pronouns: *mi, ti, si, ci, vi, si*.
* **Alzarsi (to get up):** Io mi alzo, Tu ti alzi, Lui/Lei si alza, Noi ci alziamo, Voi vi alzate, Loro si alzano.

#### 6. Irregular verbs: **Andare**, **Bere**, **Uscire**
* **Andare (to go):** vado, vai, va, andiamo, andate, vanno.
* **Bere (to drink):** bevo, bevi, beve, beviamo, bevete, bevono.
* **Uscire (to go out):** esco, esci, esce, usciamo, uscite, escono.

---

### Unit 6: Presente Progressivo e Preposizioni di Luogo (Progressive Present and Place)

#### 1. Present Progressive Architecture
Formed using conjugated **Stare** + Gerund (**-ando** for -are, **-endo** for -ere/-ire):
* **Io sto** studiando / scrivendo / finendo
* **Tu stai** studiando / scrivendo
* **Lui/Lei sta** studiando / scrivendo
* **Noi stiamo** studiando / scrivendo
* **Voi state** studiando / scrivendo
* **Loro stanno** studiando / scrivendo
* **Irregulars:** *fare* $\\rightarrow$ facendo | *bere* $\\rightarrow$ bevendo.
* **Reflexives in Progressive:** Pronoun precedes *stare* or attaches to gerund: *Mi sto alzando* (I am getting up).

#### 2. Verb **Venire** (to come)
* **Venire:** Io vengo, Tu vieni, Lui/Lei viene, Noi veniamo, Voi venite, Loro vengono. Origin: *Viene dalla Spagna* (He comes from Spain).

#### 3. Prepositions of Place
* **Su** (on), **Sopra (a)** (above), **Sotto (a)** (under), **In / dentro (a)** (in/inside), **Fra / tra** (between), **Davanti (a)** (in front of), **Dietro (a)** (behind), **(in) vicino (a)** (near/next to).
* *Rule:* *Sopra*, *sotto*, *davanti*, *dietro*, *vicino* are followed by **a + article** (*il gatto è dietro alla poltrona*).

---

### Unit 7: I Mestieri (Jobs and Professions)

#### 1. Job Vocabularies
*Nouns ending in **ista** can be masculine or feminine: **il barista** or **la barista**.*
* **Il chirurgo** (surgeon), **il/la barista** (barista/bartender), **la cameriera** (waitress/server), **il meccanico** (mechanic), **il/la farmacista** (pharmacist), **il/la giornalista** (journalist), **il parrucchiere** (hairdresser), **il vigile urbano** (traffic warden), **il poliziotto** (police officer), **il pompiere** (firefighter), **il postino** (mail carrier), **il veterinario** (veterinarian), **l'architetto** (architect), **l'avvocato** (lawyer), **il medico/dottore** (doctor), **l'infermiere/a** (nurse), **il/la musicista** (musician), **il ballerino** (dancer), **il disegnatore** (designer).

#### 2. Irregular Modal Verbs: **Dovere**, **Potere**, **Volere**
Followed directly by an infinitive:
* **Dovere (must/have to):** devo, devi, deve, dobbiamo, dovete, devono.
* **Potere (can/be able to):** posso, puoi, può, possiamo, potete, possono.
* **Volere (to want):** voglio, vuoi, vuole, vogliamo, volete, vogliono.

#### 3. Sapere, Dire, Dare
* **Sapere (to know an ability/fact):** so, sai, sa, sappiamo, sapete, sanno.
* **Dire (to tell/say):** dico, dici, dice, diciamo, dite, dicono.
* **Dare (to give):** do, dai, dà, diamo, date, danno.

#### 4. Verbs block: -gnere, -gliere, -nere
* **Spegnere (to turn off):** spengo, spegni, spegne, spegniamo, spegnete, spengono.
* **Scegliere (to choose):** scelgo, scegli, sceglie, scegliamo, scegliete, scelgono.
* **Tenere (to hold/keep):** tengo, tieni, tiene, teniamo, tenete, tengono.

#### 5. Interrogative Pronouns
* **What/Which:** *che / quale / quali*
* **Who:** *chi*
* **How much/many:** *quanto / quanta / quanti / quante*

---

### Remediation & Practice exercises

#### Lesson 1: Match images of objects
1. *Il letto* (the bed)
2. *Il frigorifero* (the refrigerator)
3. *L'armadio* (the closet)
4. *Il divano* (the sofa)
5. *La scrivania* (the desk)
6. *Lo specchio* (the mirror)

#### Lesson 2: Conjugate correct present progressive verbs
1. Io sono nello studio: **sto ripetendo** (ripetere) la lezione.
2. Teo è in cucina, **sta facendo** (fare) la merenda.
3. In camera i bambini **si stanno alzando** (alzarsi).
4. La mamma è nel soggiorno, **sta leggendo** (leggere).
5. Tu sei in giardino, **stai chiacchierando** (chiacchierare) con gli amici.
6. Noi siamo in garage, **stiamo pulendo** (pulire) la macchina.
7. Voi siete in cucina, **state bevendo** (bere) un succo di frutta.
8. Le mie sorelle sono in bagno, **si stanno lavando** (lavarsi) le mani.`,date:"Jun 08, 2026",category:"Italian",readTime:"15 min read"}],cp=[{value:"Science",label:"Science"},{value:"Mathematics",label:"Mathematics"},{value:"ELA",label:"English Language Arts"},{value:"Social Studies",label:"Social Studies"},{value:"Italian",label:"Italian Language"}],pr=cp,Xs=[{value:"Informational",description:"Clear, fact-based expository writing with headings and key terms"},{value:"Narrative Nonfiction",description:"Story-driven prose that puts a human face on real events or concepts"},{value:"Persuasive / Argumentative",description:"Claim, evidence, and reasoning structure with a clear position"},{value:"Compare & Contrast",description:"Side-by-side analysis of two topics, ideas, or historical events"}];function up(h,z,T){const f=new Date().toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}),C=`art-custom-${Date.now()}`;let q="",H="",I=h;const E=T?T.toLowerCase():"";if(T&&T.trim().length>0&&!E.startsWith("write an educational")){const K=new Set(["write","an","article","about","explain","how","works","focused","on","concepts","concept","suited","for","school","reading","educational","a","the","to","in","of","and","or","with","by","concerning","regarding","discuss","create","generate","tutorial","guide","lesson","overview"]),D=T.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/).filter(ne=>ne&&!K.has(ne));["science","cell","physics","planet","earth","chemical","biology","photosynthesis","gravity"].some(ne=>E.includes(ne))?I="Science":["math","calculator","algebra","geometry","number","integer","fraction"].some(ne=>E.includes(ne))?I="Mathematics":["reading","literature","poetry","writing","english","ela","classic","book"].some(ne=>E.includes(ne))?I="ELA":["studies","history","civics","government","social","rome","greece","ancient"].some(ne=>E.includes(ne))&&(I="Social Studies");let P=D.map(ne=>ne.charAt(0).toUpperCase()+ne.slice(1)).slice(0,5).join(" ");(!P||P.trim()==="")&&(P=`${I} Academic Focus`),q=`${P}: An In-Depth Exploration`,H=`### Overview
This article provides an in-depth examination based on the custom user research prompt and curriculum guidelines. We explore the central ideas, academic significance, and key terminology associated with **${P}**, helping students build analytical depth in this topic.

### Core Principles and Mechanisms
Understanding the details of **${P}** is vital for modern educational development. Let us explore the primary pillars and characteristics of this field:
* **Systemic Interdependence:** All components of this topic function as part of a larger, integrated system. Changes in one factor produce cascading effects on others.
* **Evidence-Based Reasoning:** Modern classroom curricula emphasize that analyzing qualitative and quantitative evidence is essential to drawing correct conclusions about this domain.
* **Practical Application:** Connecting abstract formulas or narratives to real-world scenarios makes the study of this concept highly engaging and relevant.

### Detailed Analytical Breakdown
To fully grasp the scope of **${P}**, it is useful to dive into its main functional layers:
1. **Historical Context / Foundation:** Every conceptual framework develops from initial discoveries, critical events, or theoretical proposals.
2. **Key Variables:** Identifying the active forces, variables, or elements that shape this topic helps us formulate accurate explanations and predictions.
3. **Synthesis & Integration:** Combining individual facts or techniques guides students in building unified, comprehensive models of understanding.

### Discussion and Long-Term Value
As contemporary education shifts to prioritize critical analysis and rigorous standards, study resources like this serve as active guides. Exploring **${P}** promotes a deeper cognitive appreciation, enabling students to construct sound arguments and participate in constructive discussion about ${I.toLowerCase()}-related questions.`}else z==="Informational"?h==="Science"?(q="Photosynthesis: How Plants Convert Sunlight into Food",H=`### What Is Photosynthesis?
Photosynthesis is the process by which green plants, algae, and some bacteria use sunlight, water, and carbon dioxide to produce glucose (a sugar) and oxygen. It is the foundation of nearly all life on Earth because it creates the energy that flows through food chains.

The overall chemical equation is:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

### Where Does It Happen?
Photosynthesis takes place inside chloroplasts—organelles found in plant cells that contain a green pigment called chlorophyll. Chlorophyll absorbs red and blue wavelengths of light most efficiently, reflecting green light back to our eyes (which is why plants appear green).

### The Two Stages
1. **Light-Dependent Reactions:** Occur in the thylakoid membranes. Sunlight splits water molecules, releasing oxygen as a byproduct and producing energy carriers (ATP and NADPH).
2. **Calvin Cycle (Light-Independent):** Occurs in the stroma. The plant uses ATP and NADPH to convert carbon dioxide into glucose through a series of enzyme-driven reactions.

### Why It Matters
* Photosynthesis produces the oxygen in Earth's atmosphere.
* It is the primary source of energy for almost all ecosystems.
* Understanding it helps scientists develop more efficient solar energy systems.`):h==="Mathematics"?(q="Understanding Integers and Absolute Value on the Number Line",H=`### What Are Integers?
Integers are the set of whole numbers and their opposites: {..., -3, -2, -1, 0, 1, 2, 3, ...}. Unlike fractions or decimals, integers have no partial values. They appear on a number line extending infinitely in both directions from zero.

### Positive and Negative Integers
* **Positive integers** (greater than zero) appear to the right of zero on the number line.
* **Negative integers** (less than zero) appear to the left.
* **Zero** is neither positive nor negative.

Negative integers model real-world situations such as temperatures below freezing, depths below sea level, and financial debt.

### Absolute Value
The absolute value of an integer is its distance from zero on the number line, regardless of direction. Distance is always non-negative.

We write absolute value using vertical bars: |−7| = 7 and |7| = 7.

Key rules:
1. The absolute value of zero is zero: |0| = 0
2. The absolute value of any nonzero number is positive.
3. Opposites have the same absolute value: |−n| = |n|

### Comparing and Ordering Integers
On the number line, numbers increase from left to right. Therefore:
* −10 < −3 (farther left = smaller value)
* −1 > −100
* Always place integers on a number line before comparing to avoid errors.`):h==="ELA"?(q="Theme vs. Topic: Understanding the Central Message of a Text",H=`### The Difference Between Topic and Theme
Beginning readers often confuse a story's topic with its theme. The topic is simply what a story is about—stated in one or two words (e.g., "friendship," "war," "growing up"). The theme is the deeper message the author conveys about that topic—a complete sentence that expresses a universal truth.

* **Topic:** Courage
* **Theme:** True courage means doing the right thing even when no one is watching.

### How Authors Develop Theme
Authors rarely state their theme directly. Instead, they develop it through:
1. **Character change:** What lesson does the main character learn? Their transformation often reveals the theme.
2. **Conflict and resolution:** How a conflict is resolved communicates what the author believes is right or true.
3. **Repeated symbols or motifs:** Objects, colors, or images that appear multiple times often carry thematic weight.
4. **Dialogue:** Key conversations between characters frequently hint at the central message.

### Distinguishing Multiple Themes
Complex literary works often carry more than one theme. A novel about a young immigrant might simultaneously explore themes of identity, belonging, and perseverance. A strong reader can identify which theme the author develops most fully.

### Writing a Theme Statement
A strong theme statement:
* Is a complete sentence (not just a word or phrase)
* Does not name specific characters or plot events
* Expresses a truth that applies to real life, not just the story
* Avoids clichés like "Be yourself" or "Never give up" without deeper context`):(q="The Three Branches of U.S. Government: A System of Checks and Balances",H=`### Why Three Branches?
When the Founders designed the United States government in 1787, they feared concentrated power above all else. Their solution was separation of powers—dividing authority among three distinct branches so that no single person or group could dominate the government.

### The Legislative Branch (Congress)
Congress is the lawmaking body of the federal government, split into two chambers:
* **Senate:** 100 senators, two from each state, serving six-year terms.
* **House of Representatives:** 435 members, apportioned by state population, serving two-year terms.

Congress writes and passes federal laws, controls the national budget, and can declare war.

### The Executive Branch (President)
The President of the United States is elected every four years and limited to two terms. The executive branch:
* Enforces federal laws
* Commands the military as Commander-in-Chief
* Appoints federal judges and Cabinet members
* Can veto (reject) bills passed by Congress

### The Judicial Branch (Federal Courts)
The Supreme Court—nine justices appointed for life—heads the judicial branch. Federal courts:
* Interpret whether laws follow the Constitution
* Can strike down laws as unconstitutional (judicial review)

### Checks and Balances in Action
Each branch limits the others:
1. Congress passes a law → President can veto it → Congress can override the veto with a two-thirds vote.
2. President appoints a Supreme Court justice → Senate must confirm the appointment.
3. Supreme Court can declare a presidential action unconstitutional.

This interlocking system ensures that power remains balanced and accountable to the American people.`):z==="Narrative Nonfiction"?(q=`A Day in the Life: ${h==="Social Studies"?"A Colonial American Child":h==="Science"?"Inside a Rain Forest":h==="Mathematics"?"How a Bridge Gets Built":"The Night Maya Found Her Voice"}`,H=`### A Story Rooted in Fact
${h==="ELA"||h==="Mathematics"?`Maya had always been told she was a quiet girl. In her seventh-grade classroom, she sat in the third row by the window, watching other students raise their hands with the easy confidence she desperately wanted. Then one Tuesday morning, her teacher assigned something different: a spoken-word poetry performance.

For Maya, words had always lived safely on paper. Speaking them aloud—in front of people who would watch her face and hear her voice shake—felt impossible. But the assignment had a deadline, and the deadline was Friday.

### The Process of Finding a Voice
What Maya discovered that week mirrors what researchers in literacy development call the "revision-to-performance arc." Writers who read their work aloud process language differently than those who revise silently. The act of speaking forces attention to rhythm, pacing, and word choice in ways that quiet revision often misses.

By Thursday night, Maya had revised her poem eleven times. Not because the words were wrong, but because she was learning what they sounded like—and learning, slowly, that her voice was strong enough to carry them.`:`The rain forest does not sleep. At 4:47 in the morning, long before the first shaft of light reaches the forest floor, the first layer of sound begins: the low resonant call of a howler monkey, carrying through three miles of humid air to mark territorial boundaries.

By the time a scientist named Dr. Esperanza Cruz arrived at her research station at 5:15 a.m., the canopy above her was already alive with movement. Her team was studying the interdependence of species in the Peruvian Amazon—specifically, how the removal of a single keystone species could collapse an entire food web.

### What the Data Revealed
Over fourteen months, Dr. Cruz's team catalogued over 1,200 species interactions within a single 10-hectare study plot. The results confirmed what ecologists have long theorized but rarely measured at this resolution: the loss of just three fig tree species in this region would directly eliminate food sources for 47 vertebrate species—triggering a cascade that would ultimately affect over 200 species in the surrounding ecosystem.`}

### What This Teaches Us
Behind every piece of narrative nonfiction is documented research. The emotions are real, the characters are real, and the science or history they experience is accurate. This genre invites readers into lived experience while delivering factual content—because facts remembered through story tend to stay longer.`):z==="Persuasive / Argumentative"?(q=`${h==="Science"?"Schools Should Teach Environmental Science Every Year":h==="Mathematics"?"Financial Literacy Should Be a Required Math Course":h==="ELA"?"Reading Classic Literature Still Matters in the Digital Age":"Students Should Learn a Second Language Starting in Elementary School"}`,H=`### The Claim
${h==="Mathematics"?"Every high school student in the United States should be required to complete at least one semester of financial literacy as part of their mathematics curriculum. The ability to balance a budget, understand compound interest, and navigate taxes is not optional knowledge—it is survival knowledge. Yet most schools leave students completely unprepared.":h==="ELA"?"In an era of short-form video and algorithmic content, requiring students to read classic literature may seem outdated. It is not. The complex sentence structures, ambiguous characters, and layered themes found in enduring works of literature develop exactly the kind of critical thinking that modern digital life tends to erode.":h==="Science"?"Environmental science education should be embedded in every grade level from kindergarten through twelfth grade—not offered as a single elective. Climate change, resource depletion, and biodiversity loss are the defining challenges of this century. Students cannot address problems they were never taught to understand.":"Research consistently shows that children who begin learning a second language before age ten achieve higher fluency and retain the language for life. Despite this evidence, most American school districts do not introduce foreign language instruction until middle school—a delay with real and measurable consequences."}

### Evidence
* Studies published in peer-reviewed journals show that early exposure to a subject dramatically increases long-term retention and application.
* Countries that prioritize this subject area consistently outperform the United States on international assessments.
* Surveys of adults overwhelmingly report wishing they had received more instruction in this area during their school years.

### Addressing the Counterargument
Critics argue that the curriculum is already overcrowded and that adding requirements displaces other essential subjects. This argument mistakes breadth for quality. Integration—not addition—is the answer. ${h} concepts can be woven into existing coursework without displacing it.

### Conclusion
The evidence is clear. Expanding ${h} education is not an idealistic goal—it is a practical investment in students who will face a world that demands these skills. Schools that fail to adapt are failing their students.`):(q=`${h==="Science"?"Photosynthesis vs. Cellular Respiration: Two Sides of the Same Coin":h==="Mathematics"?"Mean, Median, and Mode: Choosing the Right Measure of Center":h==="ELA"?"Fiction vs. Nonfiction: How Form Shapes Meaning":"Ancient Greece vs. Ancient Rome: Foundations of Western Civilization"}`,H=`### Introduction
Understanding concepts in isolation is useful. Understanding how they relate to—and differ from—each other is more powerful. This article compares two closely related ${h.toLowerCase()} ideas that students frequently confuse.

### Similarities
Both share a common foundation:
* They emerge from the same broader system or historical context.
* Each plays an essential and complementary role in how the subject area functions.
* Students who master one concept are significantly better positioned to understand the other.

### Key Differences
${h==="Science"?`**Photosynthesis** converts light energy into chemical energy stored as glucose (C₆H₁₂O₆), releasing oxygen as a byproduct. It occurs in plant chloroplasts and requires sunlight.

**Cellular respiration** breaks down glucose to release usable energy (ATP), consuming oxygen and releasing carbon dioxide. It occurs in the mitochondria of nearly all living cells, including plants and animals.

In short: photosynthesis stores energy; cellular respiration releases it. One builds; the other burns.`:h==="Mathematics"?`The **mean** (average) is sensitive to outliers. A single extreme value can pull the mean far from where most data actually clusters.

The **median** (middle value when data is ordered) is resistant to outliers. It better represents the center when data is skewed.

The **mode** (most frequent value) is most useful for categorical data or when identifying the most common response.

Rule of thumb: use the median for income data, housing prices, or any distribution with outliers. Use the mean for symmetric distributions without extreme values.`:h==="ELA"?`**Fiction** uses invented characters, settings, and events to explore emotional truths. The author is not constrained by what happened—only by what rings true. Its purpose is often to generate empathy and insight through story.

**Nonfiction** is bound to documented facts, real people, and verifiable events. The author's interpretation matters, but the record cannot be invented. Its purpose is to inform, analyze, or persuade using evidence.

Both forms can be equally sophisticated and literary. The difference lies in their relationship to fact—not in their quality or complexity.`:`**Ancient Greece** (c. 800–146 BCE) pioneered democracy, philosophy, and scientific inquiry. Greek city-states like Athens and Sparta operated independently and often competed. Greek culture emphasized individual intellectual achievement.

**Ancient Rome** (c. 753 BCE–476 CE) built upon Greek foundations while adding engineering, law, and large-scale governance. Rome unified vast territories under a single political system—first a republic, then an empire—prioritizing order, military strength, and civic infrastructure.

Greece gave the Western world its ideas. Rome gave it the institutions to spread and sustain them.`}

### Which Is More Important?
This is a false choice. Both are essential. The deeper lesson is that most important concepts exist in relationship to each other—and genuine understanding requires knowing not just what something is, but how it compares to what it is not.`);return{id:C,title:q,subtitle:`AI-Generated • ${z} • ${h}`,content:H,date:f,category:I,readTime:"3 min read",isCustomGenerated:!0}}const dh=[{id:"deck-1",title:"Newton's Laws of Motion",subject:"Science",cards:[{id:"fc-1-1",front:"What is the First Law of Motion (Inertia)?",back:"An object at rest stays at rest, and an object in motion stays in motion with a constant velocity, unless acted upon by an external unbalanced force."},{id:"fc-1-2",front:"What is the mathematical equation for Newton's Second Law?",back:"Force = Mass × Acceleration (F = ma)."},{id:"fc-1-3",front:"How does the Third Law explain rocket propulsion?",back:"The action of high-speed exhaust gas shooting downward creates an equal and opposite reaction, driving the rocket upward."},{id:"fc-1-4",front:"What property of matter determines its inertia?",back:"Mass. Objects with greater mass have more inertia, making them harder to start or stop."},{id:"fc-1-5",front:"What is the unit of measure for force?",back:"The Newton (N), which is equivalent to 1 kg·m/s²."}]},{id:"deck-2",title:"Plate Tectonics & Earth Geology",subject:"Science",cards:[{id:"fc-2-1",front:"What are the three main types of plate boundaries?",back:"Divergent (plates pull apart), Convergent (plates collide), and Transform (plates slide horizontally past each other)."},{id:"fc-2-2",front:"Under what tectonic process does a mountain range like the Himalayas form?",back:"Continental folding/buckling caused by two continental tectonic plates colliding head-on."},{id:"fc-2-3",front:"Who proposed the continental drift theory in 1912?",back:"Alfred Wegener."},{id:"fc-2-4",front:"What is subduction?",back:"The process where a denser oceanic plate sinks beneath a lighter continental plate at a convergent boundary, creating volcanoes and trenches."}]},{id:"deck-3",title:"Linear Equations & Slope in Algebra",subject:"Mathematics",cards:[{id:"fc-3-1",front:"What is the slope-intercept form of a linear equation?",back:"y = mx + b, where 'm' is the slope and 'b' is the y-intercept."},{id:"fc-3-2",front:"What is the geometric formula for slope given two coordinate pairs?",back:"m = (y₂ - y₁) / (x₂ - x₁) — representing the rise over run."},{id:"fc-3-3",front:"What are the slopes of parallel and perpendicular lines?",back:"Parallel lines have identical slopes; perpendicular lines have negative reciprocal slopes (m₁ × m₂ = -1)."},{id:"fc-3-4",front:"What does it mean if a linear slope estimate is horizontal?",back:"The slope is zero (m = 0). The equation simplifies to y = b."}]},{id:"deck-4",title:"Literary Devices & Narrative Elements",subject:"ELA",cards:[{id:"fc-4-1",front:"What is the difference between a metaphor and a simile?",back:"A simile compares two things using 'like' or 'as' (e.g., 'as brave as a lion'). A metaphor makes a direct comparison without those words (e.g., 'the classroom was a zoo')."},{id:"fc-4-2",front:"What are the five essential parts of a classic plot pyramid?",back:"Exposition, Rising Action, Climax, Falling Action, and Resolution (Denouement)."},{id:"fc-4-3",front:"What does 'alliteration' mean?",back:"The repetition of matching consonant sounds at the beginning of closely connected words (e.g., 'Sally sells seashells by the seashore')."},{id:"fc-4-4",front:"What is foreshadowing?",back:"An authorial technique where subtle hints or clues are dropped early in a story to suggest future plot events."}]},{id:"deck-5",title:"The American Revolution",subject:"Social Studies",cards:[{id:"fc-5-1",front:"What was the direct primary cause of the Stamp Act of 1765 crisis?",back:"Great Britain imposing direct taxes on newspaper, legal documents, and playing cards without colonial representation ('No taxation without representation')."},{id:"fc-5-2",front:"Who was the primary writer of the Declaration of Independence?",back:"Thomas Jefferson, with edits from John Adams and Benjamin Franklin (signed in 1776)."},{id:"fc-5-3",front:"Which battle represents the turning point of the Revolutionary War?",back:"The Battle of Saratoga (1777), because it convinced France to officially join as an ally to the American colonists."},{id:"fc-5-4",front:"What treaty formally ended the war between Britain and the USA?",back:"The Treaty of Paris in 1783, which officially recognized American independence."}]}],fh=[{id:"quiz-1",title:"Newtonian Physics & Forces Review",subject:"Science",questions:[{id:"q-1-1",question:"If the force acting on an object is doubled while its mass remains constant, what happens to its acceleration?",options:["It is cut in half","It remains exactly identical","It is doubled","It is quadrupled"],correctAnswerIndex:2,explanation:"According to Newton's Second Law, F = ma. Since acceleration (a = F / m) is directly proportional to Net Force, doubling the force while mass is constant doubles the acceleration."},{id:"q-1-2",question:"Which of Newton's laws explains why a passenger flies forward when a speeding tour bus slams on its brakes?",options:["First Law of Motion (Inertia)","Second Law of Motion (F = ma)","Third Law of Motion (Reciprocals)","Law of Universal Gravitation"],correctAnswerIndex:0,explanation:"Newton's First Law (Inertia) states that an object in motion will continue moving at a constant speed unless stopped by an external force. Your body resists the deceleration and continues forward."},{id:"q-1-3",question:"A rocket pushes hot exhaust gases backward. The gases in turn push the rocket forward. This pairs with which law?",options:["The First Law","The Second Law","The Third Law","Kepler's Second Law"],correctAnswerIndex:2,explanation:"Newton's Third Law states that for every action, there is an equal and opposite reaction. The ejection of gas (action) pushes the rocket forward (reaction)."}]},{id:"quiz-2",title:"Coordinate Equations & Slope Algebra",subject:"Mathematics",questions:[{id:"q-2-1",question:"Find the slope of a line passing through coordinates (2, 5) and (4, 11).",options:["Slope = 2","Slope = 3","Slope = 4","Slope = 6"],correctAnswerIndex:1,explanation:"Using the slope formula: m = (y₂ - y₁) / (x₂ - x₁). Here, (11 - 5) / (4 - 2) = 6 / 2 = 3."},{id:"q-2-2",question:"Line A has a slope of -2/3. What is the slope of a line perpendicular to Line A?",options:["-2/3","2/3","-3/2","3/2"],correctAnswerIndex:3,explanation:"Perpendicular lines have slopes that are negative reciprocals of each other. The negative reciprocal of -2/3 is 3/2."}]},{id:"quiz-3",title:"Grammar & ELA Core Diagnostics",subject:"ELA",questions:[{id:"q-3-1",question:"Identify the sentence that uses correct subject-verb agreement.",options:["Every one of the books on the shelves is written in Latin.","Every one of the books on the shelves are written in Latin.","Neither the student nor the teachers was ready for the bell.","The crew of Sailors are working on repairing the main deck."],correctAnswerIndex:0,explanation:"'Every one' is a singular pronoun subject and requires the singular verb 'is'. prepositional phrases like 'of any books' do not change the subject."},{id:"q-3-2",question:"Which literary device is present in the phrase: 'The wind whispered secrets through the pines'?",options:["Hyperbole","Personification","Metaphor","Alliteration"],correctAnswerIndex:1,explanation:"Personification represents giving human qualities or behaviors to inanimate objects or concepts, such as wind whispering."}]}];function dp(h,z,T){const f=h.toLowerCase();if(f.includes("cell")||f.includes("bio")||f.includes("mitosis"))return{id:"deck-gen-"+Date.now().toString(),title:"Cellular Biology Key Terms",subject:z||"Science",cards:[{id:"fc-g-1",front:"What is the Mitochondrion?",back:"Defined as the 'powerhouse of the cell' — this organelle is where cellular respiration occurs, producing ATP molecule energy."},{id:"fc-g-2",front:"What is Mitosis?",back:"A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus."},{id:"fc-g-3",front:"What is the primary function of Ribosomes?",back:"They serve as the protein builders of the cell, translating genetic information from RNA into amino acid chains."},{id:"fc-g-4",front:"Difference between Prokaryotic and Eukaryotic Cells?",back:"Eukaryotic cells contain membrane-bound organelles (like a nucleus), whereas prokaryotes do not hold a nucleus."}]};if(f.includes("fraction")||f.includes("math")||f.includes("equation")||f.includes("calculus")||f.includes("geometry"))return{id:"deck-gen-"+Date.now().toString(),title:"Intermediate Math & Calculus Basics",subject:z||"Mathematics",cards:[{id:"fc-g-1",front:"What is a Derivative?",back:"Measuring the rate at which a function value changes at a given instantaneous point. It equals the slope of the tangent line."},{id:"fc-g-2",front:"What is an Integer?",back:"A complete whole number that is not a fractional quotient. Can be positive, negative, or zero."},{id:"fc-g-3",front:"What is the Pythagorean Theorem?",back:"In any right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides (a² + b² = c²)."}]};let C="Dynamic AI Terms: "+(h.length>25?h.substring(0,22)+"...":h);return{id:"deck-gen-"+Date.now().toString(),title:C,subject:z||"Science",cards:[{id:"fc-g-1",front:"Primary Concept of "+h,back:"This subject covers advanced fundamental principles designed to cultivate reading comprehesion, technical mastery, and testing compliance."},{id:"fc-g-2",front:"Key Application",back:"Implementing real-world models, observing reactions in laboratory environments, and conducting rigorous scientific research."},{id:"fc-g-3",front:"Core Terminology",back:"Practitioners define specialized glossaries to communicate theoretical findings clearly while running experiments."}]}}function fp(h,z,T){const f=h.toLowerCase();if(f.includes("cell")||f.includes("biology")||f.includes("organelle"))return{id:"quiz-gen-"+Date.now().toString(),title:"Cell Structures & Organelles Quiz",subject:z||"Science",questions:[{id:"q-g-1",question:"Which organelle is responsible for generating chemical energy (ATP) inside eukaryotic cells?",options:["Lysosome","Mitochondrion","Endoplasmic Reticulum","Golgi Apparatus"],correctAnswerIndex:1,explanation:"Mitochondria act as the principal force for cell breathing and make ATP by oxidizing sugars."},{id:"q-g-2",question:"What protective outer layer is found in plant cells but absent in human animal cells?",options:["Cell Membrane","Cell Wall","Ribose Ring","Nuclear Envelope"],correctAnswerIndex:1,explanation:"Plant cells hold a thick, rigid Cellulose Cell Wall that provides mechanical structure. Animals are membrane-only."},{id:"q-g-3",question:"What molecule stores the hereditary instructions for cell biology coding?",options:["Deoxyribonucleic Acid (DNA)","Adenosine Triphosphate (ATP)","Sodium Chloride (NaCl)","Chloride Compound"],correctAnswerIndex:0,explanation:"DNA holds all the essential blueprint code for organism growth, development, and division."}]};let C="Academic AI Review: "+(h.length>25?h.substring(0,22)+"...":h);return{id:"quiz-gen-"+Date.now().toString(),title:C,subject:z||"Science",questions:[{id:"q-g-1",question:"Which is the most essential scientific practice when studying "+h+"?",options:["Accepting claims without querying them","Forming a testable hypothesis and conducting controlled observations","Memorizing older files without updating models","Relying purely on secondary opinions"],correctAnswerIndex:1,explanation:"Controlled testing, peer reviews, repeatable experiments, and forming hypotheses are the cornerstones of all academic discoveries."},{id:"q-g-2",question:"How does research in "+h+" benefit from modern collaboration workflows?",options:["It restricts access to resources","It enables global sharing of peer-reviewed data to verify discoveries","It mandates manual drawing instead of database queries","It increases testing mistakes"],correctAnswerIndex:1,explanation:"Global databases, shared communication, and peer logs speed up scientific testing and weed out errors."}]}}function hh(h){const z=[],T=[{word:/\bwas written by\b/gi,fix:"wrote",text:"was written by",exp:"Use active voice for punchier, clearer academic sentences. (e.g., 'Newton wrote the law' instead of 'The law was written by Newton')"},{word:/\bhas been completed by\b/gi,fix:"completed",text:"has been completed by",exp:"Active actions make statements stronger. Identify the primary subject and make it execute the verb."}],f=[{word:/\bteh\b/gi,fix:"the",text:"teh",exp:"Correct the common typing mistake 'teh' to 'the'."},{word:/\breceive\b/gi,fix:"receive",text:"recieve",exp:"Remember the rule: 'I' before 'E' except after 'C' in standard english spelling."},{word:/\brecieve\b/gi,fix:"receive",text:"recieve",exp:"Common spelling mistake. The correct spelling is 'receive'."},{word:/\bseperate\b/gi,fix:"separate",text:"seperate",exp:"Common spelling spelling mistake. The correct spelling is 'separate' (contains 'a rat')."},{word:/\bthere scientific\b/gi,fix:"their scientific",text:"there scientific",exp:"Homophone mistake: 'Their' is possessive, 'There' represents location."},{word:/\bits practical\b/gi,fix:"it's practical",text:"its practical",exp:"Homophone misuse. Use contraction 'it's' if you mean 'it is'."},{word:/\byour wrong\b/gi,fix:"you're wrong",text:"your wrong",exp:"Adjective mismatch. 'Your' indicates ownership. Use contraction 'you're' for 'you are'."}],C=[{word:/\bscientists is\b/gi,fix:"scientists are",text:"scientists is",exp:"Plural subject mismatch. 'Scientists' is plural; use the verb 'are'."},{word:/\bone of the books are\b/gi,fix:"one of the books is",text:"one of the books are",exp:"Subject mismatch. 'One' is single and requires the singular verb 'is', regardless of intervening plural preposition phrases like 'of the books'."},{word:/\bhe run\b/gi,fix:"he runs",text:"he run",exp:"Pronoun mismatch. Third-person singular 'he' matches with verbs ending in S (runs)."}];return[...T.map(H=>({...H,cat:"Passive Voice"})),...f.map(H=>({...H,cat:"Spelling"})),...C.map(H=>({...H,cat:"Grammar"}))].forEach((H,I)=>{let E;const A=new RegExp(H.word);for(;(E=A.exec(h))!==null;)z.push({id:`g-mistake-${I}-${E.index}`,startIndex:E.index,endIndex:E.index+E[0].length,originalText:E[0],suggestedCorrection:H.fix,category:H.cat,explanation:H.exp})}),z.sort((H,I)=>H.startIndex-I.startIndex)}/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hp=h=>h.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),mp=h=>h.replace(/^([A-Z])|[\s-_]+(\w)/g,(z,T,f)=>f?f.toUpperCase():T.toLowerCase()),mh=h=>{const z=mp(h);return z.charAt(0).toUpperCase()+z.slice(1)},kh=(...h)=>h.filter((z,T,f)=>!!z&&z.trim()!==""&&f.indexOf(z)===T).join(" ").trim(),gp=h=>{for(const z in h)if(z.startsWith("aria-")||z==="role"||z==="title")return!0};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var pp={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bp=U.forwardRef(({color:h="currentColor",size:z=24,strokeWidth:T=2,absoluteStrokeWidth:f,className:C="",children:q,iconNode:H,...I},E)=>U.createElement("svg",{ref:E,...pp,width:z,height:z,stroke:h,strokeWidth:f?Number(T)*24/Number(z):T,className:kh("lucide",C),...!q&&!gp(I)&&{"aria-hidden":"true"},...I},[...H.map(([A,K])=>U.createElement(A,K)),...Array.isArray(q)?q:[q]]));/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=(h,z)=>{const T=U.forwardRef(({className:f,...C},q)=>U.createElement(bp,{ref:q,iconNode:z,className:kh(`lucide-${hp(mh(h))}`,`lucide-${h}`,f),...C}));return T.displayName=mh(h),T};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yp=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],Ws=de("arrow-left",yp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vp=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],xp=de("arrow-right",vp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wp=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],br=de("book-open",wp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sp=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z",key:"169p4p"}],["path",{d:"m9 10 2 2 4-4",key:"1gnqz4"}]],jp=de("bookmark-check",Sp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ap=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]],kp=de("box",Ap);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Np=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],yr=de("check",Np);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tp=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Nh=de("chevron-left",Tp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cp=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],jr=de("chevron-right",Cp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ep=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],Th=de("circle-alert",Ep);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mp=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Ch=de("circle-check",Mp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zp=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],Dp=de("circle-x",zp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rp=[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Op=de("compass",Rp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qp=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],Up=de("copy",qp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lp=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],Bp=de("cpu",Lp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gp=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],Hp=de("external-link",Gp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qp=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],wr=de("file-text",Qp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kp=[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]],nn=de("gamepad-2",Kp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vp=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],ln=de("globe",Vp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yp=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],Jp=de("heart",Yp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _p=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Zp=de("info",_p);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xp=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],vr=de("layers",Xp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wp=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]],Ip=de("lock-open",Wp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fp=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],gh=de("log-out",Fp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pp=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],$p=de("mail",Pp);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eb=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],tb=de("maximize-2",eb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ab=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]],ph=de("message-square",ab);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lb=[["path",{d:"M5 12h14",key:"1ays0h"}]],nb=de("minus",lb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ib=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],bh=de("play",ib);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rb=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Fa=de("plus",rb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ob=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],ec=de("refresh-cw",ob);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sb=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],tc=de("rotate-ccw",sb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cb=[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]],yh=de("rotate-cw",cb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ub=[["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M18 5v16",key:"1ethyx"}],["path",{d:"m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6",key:"zywc2d"}],["path",{d:"m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11",key:"1d4ql0"}],["path",{d:"M6 5v16",key:"1sn0nx"}],["circle",{cx:"12",cy:"9",r:"2",key:"1092wv"}]],Is=de("school",ub);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const db=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],Fs=de("search",db);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fb=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],hb=de("shield-alert",fb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mb=[["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",key:"1ailkh"}],["path",{d:"M2 6h1.972a4 4 0 0 1 3.6 2.2",key:"km57vx"}],["path",{d:"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",key:"os18l9"}]],gb=de("shuffle",mb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pb=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],Wt=de("sparkles",pb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bb=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],yb=de("trash-2",bb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vb=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]],xb=de("trophy",vb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wb=[["path",{d:"m17 2-5 5-5-5",key:"16satq"}],["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",key:"1e6viu"}]],Sb=de("tv",wb);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jb=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],vh=de("users",jb);function Ab({refArticle:h,onGeneratedSuccess:z}){var te,ie;const[T,f]=U.useState(()=>{try{const L=localStorage.getItem("school-decks");return L?JSON.parse(L):dh}catch{return dh}}),[C,q]=U.useState(()=>{var L;return((L=T[0])==null?void 0:L.id)||null}),[H,I]=U.useState(0),[E,A]=U.useState(!1),[K,D]=U.useState(!1),[P,ne]=U.useState(""),[He,Ae]=U.useState("Science"),[Ce,$]=U.useState({}),oe=L=>{f(L);try{localStorage.setItem("school-decks",JSON.stringify(L))}catch{}},[Ne,ze]=U.useState(""),[ee,we]=U.useState(!1),G=T.find(L=>L.id===C)||T[0],Ye=()=>{G&&(A(!1),setTimeout(()=>{I(L=>(L+1)%G.cards.length)},150))},$e=()=>{G&&(A(!1),setTimeout(()=>{I(L=>(L-1+G.cards.length)%G.cards.length)},150))},pt=(L,le)=>{$(Te=>({...Te,[L]:le})),Ye()},[We,qe]=U.useState(""),[Je,Ie]=U.useState(""),[it,w]=U.useState(!1),O=L=>{if(L.preventDefault(),!We.trim()||!Je.trim()||!G)return;const le={id:`fc-custom-${Date.now()}`,front:We.trim(),back:Je.trim()},Te=T.map(B=>B.id===G.id?{...B,cards:[...B.cards,le]}:B);oe(Te),qe(""),Ie(""),w(!1)},Y=L=>{if(L.preventDefault(),!P.trim())return;const le={id:`deck-custom-${Date.now()}`,title:P.trim(),subject:He,cards:[{id:`fc-${Date.now()}-1`,front:"Front of Card 1 (Sample)",back:"Back of Card 1 (Click to reveal)"}]},Te=[le,...T];oe(Te),q(le.id),I(0),A(!1),$({}),ne(""),D(!1)},me=(L,le)=>{var B;if(le.stopPropagation(),T.length<=1){alert("You must keep at least one study deck.");return}const Te=T.filter(Ge=>Ge.id!==L);oe(Te),C===L&&(q(((B=Te[0])==null?void 0:B.id)||null),I(0),A(!1),$({}))},ge=(L,le="Science")=>{if(!L.trim())return;we(!0);let Te=0;const B=setInterval(()=>{if(Te+=10,Te>=100){clearInterval(B);const Ge=dp(L,le),rt=[Ge,...T];oe(rt),q(Ge.id),I(0),A(!1),$({}),we(!1),ze(""),z&&z("flashcards")}},80)},u=()=>{h&&ge(`Generate flashcard based on standard article: ${h.title}`,h.category)},y=G?G.cards:[],R=y.filter(L=>Ce[L.id]==="learned").length,Q=y.filter(L=>Ce[L.id]==="review").length,F=y.length>0?Math.round(R/y.length*100):0;return r.jsxs("div",{className:"flex flex-col gap-6 h-full select-text max-h-[85vh] overflow-y-auto pr-1",children:[r.jsxs("div",{className:"flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[var(--card-border)] pb-4",children:[r.jsxs("div",{children:[r.jsxs("h3",{className:"text-base font-extrabold flex items-center gap-2 text-[var(--text-primary)]",children:[r.jsx(vr,{className:"text-[var(--accent-color)] w-5 h-5"}),"Study Flashcards Hub"]}),r.jsx("p",{className:"text-xs text-[var(--text-muted)] mt-0.5",children:"Memorize core school theories, play self-test modes, or generate custom smart-cards."})]}),r.jsxs("div",{className:"flex items-center gap-2 flex-wrap w-full lg:w-auto",children:[h&&r.jsxs("button",{onClick:u,className:"text-[10px] bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] border border-[var(--accent-color)] px-2.5 py-1.5 rounded-xl font-bold font-mono transition-all flex items-center gap-1 cursor-pointer",title:"Creates flashcard deck using active reading article",children:[r.jsx(Wt,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"BUILD FROM SELECTED ARTICLE"})]}),r.jsxs("button",{onClick:()=>D(!0),className:"text-[10px] bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-[var(--text-muted)]/50 text-[var(--text-primary)] px-3 py-1.5 rounded-xl font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ml-auto lg:ml-0",children:[r.jsx(Fa,{className:"w-3.5 h-3.5 text-[var(--accent-color)]"}),r.jsx("span",{children:"CREATE EMPTY DECK"})]})]})]}),r.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-6",children:[r.jsxs("div",{className:"md:col-span-2 flex flex-col gap-3 max-h-[500px] overflow-y-auto",children:[r.jsx("span",{className:"text-[10px] font-mono tracking-wider text-[var(--text-muted)] uppercase select-none font-bold",children:"Select Study Deck"}),r.jsx("div",{className:"flex flex-col gap-2",children:T.map(L=>{const le=L.id===C;return r.jsxs("div",{onClick:()=>{q(L.id),I(0),A(!1),$({})},className:`p-3 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${le?"bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm":"bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40"}`,children:[r.jsxs("div",{className:"flex-1 min-w-0 pr-2",children:[r.jsxs("div",{className:"flex items-center gap-1.5 mb-1",children:[r.jsx("span",{className:"text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase",children:L.subject}),r.jsxs("span",{className:"text-[9px] text-[var(--text-muted)] font-mono",children:[L.cards.length," cards"]})]}),r.jsx("h4",{className:"text-[11px] font-bold text-[var(--text-primary)] line-clamp-1 leading-snug",children:L.title})]}),r.jsx("button",{onClick:Te=>me(L.id,Te),className:"p-1 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 cursor-pointer",title:"Delete Deck",children:r.jsx(yb,{className:"w-3.5 h-3.5"})})]},L.id)})}),r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl p-3.5 flex flex-col gap-2 mt-2",children:[r.jsxs("div",{className:"flex items-center gap-1.5",children:[r.jsx(Wt,{className:"w-3.5 h-3.5 text-yellow-400"}),r.jsx("span",{className:"text-xs font-bold text-[var(--text-primary)] font-mono",children:"AI Deck Generator"})]}),r.jsx("p",{className:"text-[10px] text-[var(--text-muted)]",children:'Paste or type any topic (e.g., "Mitochondria organelles", "Trigonometric ratios", "US Civil War").'}),r.jsxs("div",{className:"flex gap-1.5 mt-1",children:[r.jsx("input",{type:"text",value:Ne,onChange:L=>ze(L.target.value),placeholder:"Topic for study cards...",className:"flex-1 text-xs rounded-lg px-2.5 py-1.5 border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]",disabled:ee}),r.jsx("button",{type:"button",onClick:()=>ge(Ne,"Science"),disabled:ee||!Ne.trim(),className:"bg-[var(--accent-color)] text-[var(--bg-color)] px-3 rounded-lg text-[10px] font-bold hover:opacity-90 disabled:opacity-50 font-mono flex items-center justify-center gap-1 shrink-0 cursor-pointer",children:ee?r.jsx(ec,{className:"w-3 h-3 animate-spin"}):r.jsxs(r.Fragment,{children:[r.jsx(Fa,{className:"w-3 h-3"}),r.jsx("span",{children:"GEN"})]})})]})]})]}),G?r.jsxs("div",{className:"md:col-span-3 flex flex-col gap-4",children:[r.jsxs("div",{className:"flex flex-col gap-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-5 relative min-h-[340px] justify-between",children:[r.jsxs("div",{className:"flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] select-none",children:[r.jsxs("span",{children:["DECK: ",G.title]}),r.jsxs("span",{children:["Card ",H+1," of ",y.length]})]}),r.jsx("div",{onClick:()=>A(!E),className:"w-full h-48 cursor-pointer relative select-none [perspective:1000px] my-3 group",children:r.jsxs("div",{className:`w-full h-full relative transition-all duration-500 [transform-style:preserve-3d] ${E?"[transform:rotateY(180deg)]":""}`,children:[r.jsxs("div",{className:"absolute inset-0 bg-[var(--card-bg)] border border-[var(--card-border)] group-hover:border-[var(--accent-color)]/50 rounded-xl p-5 flex flex-col justify-between items-center text-center [backface-visibility:hidden] transition-colors",children:[r.jsx("span",{className:"text-[10px] font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold mb-2",children:"Front of Card"}),r.jsx("h4",{className:"text-sm font-extrabold text-[var(--text-primary)] select-text flex-1 flex items-center justify-center max-w-sm",children:((te=y[H])==null?void 0:te.front)||"Add cards to start"}),r.jsxs("span",{className:"text-[9px] font-mono text-[var(--text-muted)] flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity mt-2",children:[r.jsx(yh,{className:"w-3 h-3 text-[var(--accent-color)] animate-pulse"}),r.jsx("span",{children:"CLICK CARD TO FLIP"})]})]}),r.jsxs("div",{className:"absolute inset-0 bg-[var(--bg-color)] border border-[var(--accent-color)]/40 rounded-xl p-5 flex flex-col justify-between items-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)] select-text",children:[r.jsx("span",{className:"text-[10px] font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold mb-2",children:"Correct Answer / Definition"}),r.jsx("p",{className:"text-xs leading-relaxed text-[var(--text-primary)] font-medium flex-1 flex items-center justify-center max-w-sm select-text",children:((ie=y[H])==null?void 0:ie.back)||""}),r.jsxs("span",{className:"text-[9px] font-mono text-[var(--text-muted)] flex items-center gap-1 opacity-70",children:[r.jsx(yh,{className:"w-3 h-3"}),r.jsx("span",{children:"CLICK TO FLIP REVERSE"})]})]})]})}),y.length>0?r.jsxs("div",{className:"flex flex-col gap-3 select-none",children:[r.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[r.jsxs("button",{onClick:()=>pt(y[H].id,"review"),className:`text-[10.5px] font-bold font-mono py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all border ${Ce[y[H].id]==="review"?"bg-amber-500/20 text-amber-500 border-amber-500":"bg-[var(--card-bg)] border-[var(--card-border)] hover:border-amber-500/40 text-[var(--text-primary)]"}`,children:[r.jsx(Th,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"NEEDS REVIEW"})]}),r.jsxs("button",{onClick:()=>pt(y[H].id,"learned"),className:`text-[10.5px] font-bold font-mono py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all border ${Ce[y[H].id]==="learned"?"bg-green-500/20 text-green-500 border-green-500":"bg-[var(--card-bg)] border-[var(--card-border)] hover:border-green-500/40 text-[var(--text-primary)]"}`,children:[r.jsx(yr,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"GOT IT! (LEARNED)"})]})]}),r.jsxs("div",{className:"flex justify-between items-center pt-2 border-t border-[var(--card-border)]",children:[r.jsxs("button",{onClick:$e,className:"p-1 px-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] rounded-lg text-xs font-mono flex items-center gap-0.5 cursor-pointer",children:[r.jsx(Nh,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"PREV"})]}),r.jsx("div",{className:"flex gap-1",children:y.map((L,le)=>{const Te=Ce[L.id];let B="bg-[var(--card-border)]";return le===H?B="bg-[var(--accent-color)] ring-2 ring-offset-2 ring-[var(--accent-color)]/25":Te==="learned"?B="bg-green-500":Te==="review"&&(B="bg-amber-500"),r.jsx("div",{className:`w-2 h-2 rounded-full transition-all ${B}`},L.id)})}),r.jsxs("button",{onClick:Ye,className:"p-1 px-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] rounded-lg text-xs font-mono flex items-center gap-0.5 cursor-pointer",children:[r.jsx("span",{children:"NEXT"}),r.jsx(jr,{className:"w-3.5 h-3.5"})]})]})]}):r.jsx("div",{className:"text-center py-6 text-xs text-[var(--text-muted)] font-mono",children:"This deck is empty. Add cards below!"})]}),r.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-5 gap-4",children:[r.jsxs("div",{className:"sm:col-span-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 flex flex-col justify-between",children:[r.jsxs("div",{children:[r.jsx("span",{className:"text-[9px] font-mono uppercase text-[var(--text-muted)] tracking-wider",children:"Deck Study Progress"}),r.jsxs("div",{className:"text-2xl font-black text-[var(--accent-color)] mt-1",children:[F,"%"]})]}),r.jsxs("div",{className:"flex flex-col gap-1 mt-3 text-[10px] font-mono leading-normal",children:[r.jsxs("div",{className:"flex justify-between",children:[r.jsxs("span",{className:"text-green-500 font-bold flex items-center gap-1",children:[r.jsx(Ch,{className:"w-3 h-3 text-green-500"})," Learned"]}),r.jsx("span",{className:"text-[var(--text-primary)] font-bold",children:R})]}),r.jsxs("div",{className:"flex justify-between",children:[r.jsxs("span",{className:"text-amber-500 font-bold flex items-center gap-1",children:[r.jsx(jp,{className:"w-3 h-3 text-amber-500"})," Review"]}),r.jsx("span",{className:"text-[var(--text-primary)] font-bold",children:Q})]})]})]}),r.jsx("div",{className:"sm:col-span-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3",children:it?r.jsxs("form",{onSubmit:O,className:"flex flex-col gap-2",children:[r.jsx("span",{className:"text-[9px] font-mono uppercase text-[var(--accent-color)] tracking-wider font-bold",children:"Add Card to This Deck"}),r.jsx("input",{type:"text",placeholder:"Front (Question/Term)...",value:We,onChange:L=>qe(L.target.value),className:"w-full text-[11px] rounded-lg p-1.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none"}),r.jsx("input",{type:"text",placeholder:"Back (Answer/Explanation)...",value:Je,onChange:L=>Ie(L.target.value),className:"w-full text-[11px] rounded-lg p-1.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none"}),r.jsxs("div",{className:"flex justify-end gap-1.5 mt-1.5",children:[r.jsx("button",{type:"button",onClick:()=>w(!1),className:"text-[9px] font-mono bg-transparent hover:underline text-[var(--text-muted)] cursor-pointer px-2 py-1",children:"Cancel"}),r.jsx("button",{type:"submit",disabled:!We.trim()||!Je.trim(),className:"bg-[var(--accent-color)] text-[var(--bg-color)] font-mono text-[9px] font-bold px-3 py-1 rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer",children:"SAVE CARD"})]})]}):r.jsx("div",{className:"flex flex-col items-center justify-center h-full py-4 text-center",children:r.jsxs("button",{onClick:()=>w(!0),className:"text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] py-2 px-4 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer",children:[r.jsx(Fa,{className:"w-4 h-4"}),r.jsx("span",{children:"ADD CARD MANUALLY"})]})})})]})]}):r.jsx("div",{className:"md:col-span-3 flex items-center justify-center p-12 text-xs text-[var(--text-muted)] font-mono border border-dashed border-[var(--card-border)] rounded-2xl",children:"Select a deck from the list to start studying"})]}),K&&r.jsx("div",{className:"fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4",children:r.jsxs("div",{className:"bg-[var(--bg-primary)] border border-[var(--card-border)] rounded-2xl max-w-sm w-full p-5 shadow-2xl text-left",children:[r.jsx("h4",{className:"text-sm font-extrabold tracking-tight text-[var(--text-primary)] mb-1",children:"Create Custom Study Deck"}),r.jsx("p",{className:"text-[10px] text-[var(--text-muted)] leading-relaxed mb-4",children:"Enter a subject tag and a custom name to begin organizing your own learning flashcards."}),r.jsxs("form",{onSubmit:Y,className:"flex flex-col gap-3",children:[r.jsxs("div",{className:"flex flex-col gap-1",children:[r.jsx("label",{className:"text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider",children:"Deck Title"}),r.jsx("input",{type:"text",required:!0,placeholder:"e.g. World War II Key Battles...",value:P,onChange:L=>ne(L.target.value),className:"text-xs rounded-xl p-2.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] w-full font-mono"})]}),r.jsxs("div",{className:"flex flex-col gap-1",children:[r.jsx("label",{className:"text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider",children:"Subject Category"}),r.jsxs("select",{value:He,onChange:L=>Ae(L.target.value),className:"text-xs bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl p-2.5 text-[var(--text-primary)] cursor-pointer focus:outline-none font-mono",children:[r.jsx("option",{value:"Science",children:"Science"}),r.jsx("option",{value:"Mathematics",children:"Mathematics"}),r.jsx("option",{value:"ELA",children:"ELA"}),r.jsx("option",{value:"Social Studies",children:"Social Studies"})]})]}),r.jsxs("div",{className:"flex justify-end gap-2 pt-2",children:[r.jsx("button",{type:"button",onClick:()=>D(!1),className:"text-xs font-semibold px-3 py-1.5 border border-[var(--card-border)] hover:bg-[var(--bg-secondary)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer",children:"Cancel"}),r.jsx("button",{type:"submit",className:"text-xs font-extrabold px-4 py-1.5 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-[0_2px_8px_var(--accent-shadow)]",children:"CREATE DECK"})]})]})]})})]})}function kb({refArticle:h,onGeneratedSuccess:z}){const[T,f]=U.useState(()=>{try{const B=localStorage.getItem("school-quizzes");return B?JSON.parse(B):fh}catch{return fh}}),[C,q]=U.useState(()=>{var B;return((B=T[0])==null?void 0:B.id)||null}),[H,I]=U.useState(0),[E,A]=U.useState(null),[K,D]=U.useState(!1),[P,ne]=U.useState(0),[He,Ae]=U.useState(!1),[Ce,$]=U.useState(""),[oe,Ne]=U.useState(!1),[ze,ee]=U.useState(!1),[we,G]=U.useState(""),[Ye,$e]=U.useState(""),[pt,We]=U.useState(""),[qe,Je]=U.useState(""),[Ie,it]=U.useState(""),[w,O]=U.useState(0),[Y,me]=U.useState(""),ge=B=>{f(B);try{localStorage.setItem("school-quizzes",JSON.stringify(B))}catch{}},u=T.find(B=>B.id===C)||T[0],y=u?u.questions:[],R=y[H],Q=B=>{K||A(B)},F=()=>{E===null||K||(D(!0),E===R.correctAnswerIndex&&ne(B=>B+1))},te=()=>{A(null),D(!1),H+1<y.length?I(B=>B+1):Ae(!0)},ie=()=>{I(0),A(null),D(!1),ne(0),Ae(!1)},L=B=>{if(B.preventDefault(),!we.trim()||!Ye.trim()||!pt.trim()||!qe.trim()||!Ie.trim()||!u)return;const Ge={id:`q-custom-${Date.now()}`,question:we.trim(),options:[Ye.trim(),pt.trim(),qe.trim(),Ie.trim()],correctAnswerIndex:Number(w),explanation:Y.trim()||"Correct! That is the verified textbook explanation."},rt=T.map(_=>_.id===u.id?{..._,questions:[..._.questions,Ge]}:_);ge(rt),G(""),$e(""),We(""),Je(""),it(""),me(""),ee(!1),ie()},le=(B,Ge="Science")=>{if(!B.trim())return;Ne(!0);let rt=0;const _=setInterval(()=>{if(rt+=10,rt>=100){clearInterval(_);const St=fp(B,Ge),Lt=[St,...T];ge(Lt),q(St.id),I(0),A(null),D(!1),ne(0),Ae(!1),Ne(!1),$(""),z&&z("quiz")}},80)},Te=()=>{h&&le(`Practice test on ${h.title}`,h.category,h.content)};return r.jsxs("div",{className:"flex flex-col gap-6 h-full select-text max-h-[85vh] overflow-y-auto pr-1",children:[r.jsxs("div",{className:"flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[var(--card-border)] pb-4",children:[r.jsxs("div",{children:[r.jsxs("h3",{className:"text-base font-extrabold flex items-center gap-2 text-[var(--text-primary)]",children:[r.jsx(nn,{className:"text-[var(--accent-color)] w-5 h-5 animate-pulse"}),"Interactive Quiz Area"]}),r.jsx("p",{className:"text-xs text-[var(--text-muted)] mt-0.5",children:"Measure your comprehension by taking tests, grading your inputs, and reviewing errors."})]}),r.jsxs("div",{className:"flex items-center gap-2 flex-wrap w-full lg:w-auto text-left",children:[h&&r.jsxs("button",{onClick:Te,className:"text-[10px] bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] border border-[var(--accent-color)] px-2.5 py-1.5 rounded-xl font-bold font-mono transition-all flex items-center gap-1 cursor-pointer",title:"Generate a multiple choice quiz directly on the active educational article",children:[r.jsx(Wt,{className:"w-3.5 h-3.5 animate-pulse"}),r.jsx("span",{children:"GENERATE QUIZ FROM ARTICLE"})]}),r.jsxs("button",{onClick:()=>{const B=prompt("Enter Quiz Name (Syllabus/Curriculum topic):");if(!B)return;const Ge={id:`quiz-custom-${Date.now()}`,title:B,subject:"Science",questions:[{id:`q-${Date.now()}-1`,question:"First Question: Click manually edit custom questions below to modify options.",options:["Option A","Option B","Option C (Correct)","Option D"],correctAnswerIndex:2,explanation:"This is a custom-built quiz explanation."}]},rt=[Ge,...T];ge(rt),q(Ge.id),ie()},className:"text-[10px] bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-[var(--text-muted)]/50 text-[var(--text-primary)] px-3 py-1.5 rounded-xl font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ml-auto lg:ml-0",children:[r.jsx(Fa,{className:"w-3.5 h-3.5 text-[var(--accent-color)]"}),r.jsx("span",{children:"NEW DECOY QUIZ"})]})]})]}),r.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-6",children:[r.jsxs("div",{className:"md:col-span-2 flex flex-col gap-3",children:[r.jsx("span",{className:"text-[10px] font-mono tracking-wider text-[var(--text-muted)] uppercase select-none font-bold",children:"Select Live Practice Test"}),r.jsx("div",{className:"flex flex-col gap-2 max-h-[300px] overflow-y-auto",children:T.map(B=>{const Ge=B.id===C;return r.jsxs("div",{onClick:()=>{q(B.id),I(0),A(null),D(!1),ne(0),Ae(!1)},className:`p-3 rounded-xl border text-left cursor-pointer transition-all flex-shrink-0 ${Ge?"bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm scale-[1.01]":"bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40"}`,children:[r.jsxs("div",{className:"flex items-center justify-between gap-1 mb-1",children:[r.jsx("span",{className:"text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase",children:B.subject}),r.jsxs("span",{className:"text-[9px] text-[var(--text-muted)] font-mono",children:[B.questions.length," questions"]})]}),r.jsx("h4",{className:"text-[11px] font-bold text-[var(--text-primary)] line-clamp-1 leading-snug",children:B.title})]},B.id)})}),r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl p-3.5 flex flex-col gap-2 mt-2",children:[r.jsxs("div",{className:"flex items-center gap-1.5",children:[r.jsx(Wt,{className:"w-3.5 h-3.5 text-yellow-400"}),r.jsx("span",{className:"text-xs font-bold text-[var(--text-primary)] font-mono",children:"AI Practice Builder"})]}),r.jsx("p",{className:"text-[10px] text-[var(--text-muted)] leading-relaxed",children:"Generate a custom evaluation. Write down a curriculum subject or chapter title below."}),r.jsxs("div",{className:"flex gap-1.5 mt-1",children:[r.jsx("input",{type:"text",value:Ce,onChange:B=>$(B.target.value),placeholder:"Topic for practice test...",className:"flex-1 text-xs rounded-lg px-2.5 py-1.5 border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]",disabled:oe}),r.jsx("button",{type:"button",onClick:()=>le(Ce,"Science"),disabled:oe||!Ce.trim(),className:"bg-[var(--accent-color)] text-[var(--bg-color)] px-3 rounded-lg text-[10px] font-bold hover:opacity-90 disabled:opacity-50 font-mono flex items-center justify-center gap-1 shrink-0 cursor-pointer",children:oe?r.jsx(tc,{className:"w-3 h-3 animate-spin"}):r.jsxs(r.Fragment,{children:[r.jsx(Fa,{className:"w-3 h-3"}),r.jsx("span",{children:"GEN"})]})})]})]})]}),u?r.jsxs("div",{className:"md:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-5 md:p-6 min-h-[380px] justify-between",children:[He?r.jsxs("div",{className:"flex flex-col justify-center items-center text-center p-4 py-8 gap-5 flex-1",children:[r.jsx("div",{className:"p-4 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded-full",children:r.jsx(xb,{className:"w-12 h-12 text-yellow-400 animate-bounce"})}),r.jsxs("div",{children:[r.jsx("h4",{className:"text-base font-extrabold text-[var(--text-primary)]",children:"Practice Test Completed!"}),r.jsx("p",{className:"text-xs text-[var(--text-muted)] mt-1 font-mono",children:"You successfully scored:"})]}),r.jsxs("div",{className:"flex items-baseline gap-1 bg-[var(--bg-secondary)] border border-[var(--card-border)] px-6 py-3 rounded-2xl shadow-inner mt-1",children:[r.jsx("span",{className:"text-4xl font-black text-[var(--accent-color)]",children:P}),r.jsx("span",{className:"text-sm text-[var(--text-muted)] font-mono font-bold",children:"/"}),r.jsx("span",{className:"text-sm text-[var(--text-muted)] font-mono font-bold",children:y.length})]}),r.jsx("p",{className:"text-[11px] text-[var(--text-muted)] max-w-sm leading-relaxed",children:P===y.length?"Exceptional! 100% textbook proficiency. You understand these concepts thoroughly.":P>=y.length/2?"Great attempt! Review the explanations details card for the ones you missed to improve your grade.":"Consistent study is key! Try generating a customized flashcard review session of these terms first."}),r.jsxs("div",{className:"flex gap-2 w-full max-w-xs mt-3 flex-wrap",children:[r.jsxs("button",{onClick:ie,className:"flex-1 text-xs font-mono font-bold py-2 border border-[var(--card-border)] text-[var(--text-primary)] hover:border-[var(--accent-color)] rounded-xl inline-flex justify-center items-center gap-1.5 cursor-pointer",children:[r.jsx(tc,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"RETRY TEST"})]}),r.jsxs("button",{onClick:()=>{var B;q(((B=T[0])==null?void 0:B.id)||null),ie()},className:"flex-1 text-xs font-mono font-bold py-2 bg-[var(--accent-color)] text-[var(--bg-color)] hover:opacity-90 rounded-xl inline-flex justify-center items-center gap-1.5 cursor-pointer shadow-md",children:[r.jsx(wr,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"OTHER TESTS"})]})]})]}):R?r.jsxs("div",{className:"flex flex-col gap-4 text-left",children:[r.jsxs("div",{className:"flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] border-b border-[var(--card-border)] pb-2.5",children:[r.jsxs("span",{children:["QUIZ: ",u.title]}),r.jsxs("span",{children:["Question ",H+1," of ",y.length]})]}),r.jsx("h4",{className:"text-sm font-extrabold text-[var(--text-primary)] leading-snug",children:R.question}),r.jsx("div",{className:"flex flex-col gap-2.5 mt-2",children:R.options.map((B,Ge)=>{const rt=E===Ge,_=Ge===R.correctAnswerIndex;let St="bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-primary)] hover:border-[var(--text-muted)]/30 hover:bg-[var(--bg-secondary)]";return K?_?St="bg-green-500/10 border-green-500 text-green-500 font-extrabold":rt?St="bg-red-500/10 border-red-500 text-red-500 font-extrabold":St="bg-transparent border-[var(--card-border)] text-[var(--text-muted)] opacity-60":rt&&(St="bg-[var(--accent-color)]/15 border-[var(--accent-color)] text-[var(--accent-color)] ring-1 ring-[var(--accent-color)] font-bold"),r.jsxs("button",{onClick:()=>Q(Ge),disabled:K,className:`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${St}`,children:[r.jsx("span",{className:"w-5 h-5 rounded-full bg-[var(--input-fill)] border border-[var(--card-border)] flex items-center justify-center text-[10px] font-mono font-bold font-semibold shrink-0 text-[var(--text-muted)]",children:String.fromCharCode(65+Ge)}),r.jsx("span",{className:"flex-1",children:B}),K&&_&&r.jsx(Ch,{className:"w-4 h-4 text-green-500 shrink-0"}),K&&rt&&!_&&r.jsx(Dp,{className:"w-4 h-4 text-red-500 shrink-0"})]},Ge)})}),r.jsx("div",{className:"mt-4 pt-4 border-t border-[var(--card-border)] flex flex-col gap-3",children:K?r.jsxs("div",{className:"flex flex-col gap-3",children:[r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl p-3 flex gap-2 w-full text-xs",children:[r.jsx(Th,{className:"w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5"}),r.jsxs("div",{children:[r.jsx("span",{className:"font-bold text-[var(--text-primary)] block font-mono",children:"TEXTBOOK EXPLANATION"}),r.jsx("span",{className:"text-[11px] text-[var(--text-muted)] leading-relaxed mt-0.5 block",children:R.explanation})]})]}),r.jsxs("button",{onClick:te,className:"w-full sm:w-auto px-5 py-2.5 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl font-mono text-xs font-bold leading-normal active:scale-98 transition-all self-end flex items-center justify-center gap-1 cursor-pointer",children:[r.jsx("span",{children:H+1<y.length?"NEXT QUESTION":"VIEW FINAL REPORT"}),r.jsx(jr,{className:"w-4 h-4"})]})]}):r.jsxs("button",{onClick:F,disabled:E===null,className:"w-full sm:w-auto px-5 py-2.5 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl font-mono text-xs font-bold leading-normal active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none self-end flex items-center justify-center gap-1 cursor-pointer",children:[r.jsx("span",{children:"SUBMIT ANSWER"}),r.jsx(xp,{className:"w-4 h-4"})]})})]}):r.jsxs("div",{className:"flex flex-col items-center justify-center p-8 text-center gap-2",children:[r.jsx("span",{className:"text-xs text-[var(--text-muted)]",children:"No questions are programmed inside this deck."}),r.jsxs("button",{onClick:()=>ee(!0),className:"text-xs text-[var(--accent-color)] font-mono font-bold hover:underline flex items-center gap-1",children:[r.jsx(Fa,{className:"w-3.5 h-3.5"})," Program first question"]})]}),!He&&!ze&&r.jsx("div",{className:"border-t border-[var(--card-border)] pt-3 text-right",children:r.jsxs("button",{onClick:()=>ee(!0),className:"text-[10px] font-mono text-[var(--accent-color)] font-bold hover:underline flex items-center justify-end gap-1 cursor-pointer bg-transparent border-none ml-auto",children:[r.jsx(Fa,{className:"w-3 h-3"}),r.jsx("span",{children:"ADD QUESTIONS TO THIS EXAM"})]})}),!He&&ze&&r.jsxs("form",{onSubmit:L,className:"border-t border-[var(--card-border)] pt-4 mt-2 text-left flex flex-col gap-2.5",children:[r.jsx("span",{className:"text-[10px] font-mono uppercase text-[var(--accent-color)] tracking-wider font-bold",children:"Write Multiple-Choice Question to add:"}),r.jsx("input",{type:"text",required:!0,placeholder:"Type the question title clearly...",value:we,onChange:B=>G(B.target.value),className:"w-full text-xs rounded-lg p-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none"}),r.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:[r.jsxs("div",{className:"flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--card-border)]",children:[r.jsx("span",{className:"text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--card-bg)] text-[var(--accent-color)]",children:"A"}),r.jsx("input",{type:"text",required:!0,placeholder:"Option A",value:Ye,onChange:B=>$e(B.target.value),className:"bg-transparent border-none outline-none text-xs w-full text-[var(--text-primary)]"})]}),r.jsxs("div",{className:"flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--card-border)]",children:[r.jsx("span",{className:"text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--card-bg)] text-[var(--accent-color)]",children:"B"}),r.jsx("input",{type:"text",required:!0,placeholder:"Option B",value:pt,onChange:B=>We(B.target.value),className:"bg-transparent border-none outline-none text-xs w-full text-[var(--text-primary)]"})]}),r.jsxs("div",{className:"flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--card-border)]",children:[r.jsx("span",{className:"text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--card-bg)] text-[var(--accent-color)]",children:"C"}),r.jsx("input",{type:"text",required:!0,placeholder:"Option C",value:qe,onChange:B=>Je(B.target.value),className:"bg-transparent border-none outline-none text-xs w-full text-[var(--text-primary)]"})]}),r.jsxs("div",{className:"flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--card-border)]",children:[r.jsx("span",{className:"text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--card-bg)] text-[var(--accent-color)]",children:"D"}),r.jsx("input",{type:"text",required:!0,placeholder:"Option D",value:Ie,onChange:B=>it(B.target.value),className:"bg-transparent border-none outline-none text-xs w-full text-[var(--text-primary)]"})]})]}),r.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:[r.jsxs("div",{className:"flex flex-col gap-0.5",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Correct Index"}),r.jsxs("select",{value:w,onChange:B=>O(B.target.value),className:"text-[11px] bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-md p-1.5 text-[var(--text-primary)] focus:outline-none",children:[r.jsx("option",{value:"0",children:"Option A is correct"}),r.jsx("option",{value:"1",children:"Option B is correct"}),r.jsx("option",{value:"2",children:"Option C is correct"}),r.jsx("option",{value:"3",children:"Option D is correct"})]})]}),r.jsxs("div",{className:"flex flex-col gap-0.5",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Explanation"}),r.jsx("input",{type:"text",placeholder:"Why is it correct? (scientific explanation)...",value:Y,onChange:B=>me(B.target.value),className:"text-[11px] rounded-md p-1.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none"})]})]}),r.jsxs("div",{className:"flex justify-end gap-1.5 mt-1 select-none",children:[r.jsx("button",{type:"button",onClick:()=>ee(!1),className:"text-[10px] font-mono hover:underline px-3 py-1 bg-transparent border-none text-[var(--text-muted)] cursor-pointer",children:"Cancel"}),r.jsx("button",{type:"submit",className:"bg-[var(--accent-color)] text-[var(--bg-color)] font-mono text-[10px] font-black px-4 py-1.5 rounded-lg hover:opacity-90 cursor-pointer shadow-sm",children:"SAVE & RESET TESTING APPARATUS"})]})]})]}):r.jsx("div",{className:"md:col-span-3 flex items-center justify-center p-12 text-xs text-[var(--text-muted)] font-mono border border-dashed border-[var(--card-border)] rounded-2xl",children:"Select an active quiz to begin evaluation"})]})]})}const xh=`Newtons Laws of Motion has been completed by sir Isaac Newton who was one of the legendary physicists in history. His core papers was written by him around 1687.

For a long time, scientists is trying to formulate teh universal rules of standard mechanical physics. However, recieveing correct measurements from seperate objects was very difficult because of its practical challenges. If you run a custom experiment, your wrong assumptions will recieve several errors.`;function Nb(){const[h,z]=U.useState(xh),[T,f]=U.useState([]),[C,q]=U.useState(!1),[H,I]=U.useState(null),[E,A]=U.useState(!1),[K,D]=U.useState(!1),P=()=>{q(!0),D(!1),I(null),setTimeout(()=>{const $=hh(h);f($),q(!1),D(!0)},700)},ne=$=>{const oe=h.replace($.originalText,$.suggestedCorrection);z(oe),I(null);const Ne=hh(oe);f(Ne)},He=()=>{navigator.clipboard.writeText(h),A(!0),setTimeout(()=>A(!1),2e3)},Ae=T.find($=>$.id===H),Ce=()=>{if(T.length===0)return r.jsx("p",{className:"whitespace-pre-wrap select-text text-xs leading-relaxed text-[var(--text-primary)]",children:h});const $=[];let oe=0;const Ne=[...T].sort((ze,ee)=>ze.startIndex-ee.startIndex);for(let ze=0;ze<Ne.length;ze++){const ee=Ne[ze];ee.startIndex>oe&&$.push(r.jsx("span",{className:"select-text",children:h.substring(oe,ee.startIndex)},`txt-${oe}`));const we=ee.id===H;let G="decoration-rose-500 bg-rose-500/10 text-rose-500 hover:bg-rose-500/25";ee.category==="Passive Voice"?G="decoration-purple-500 bg-purple-500/10 text-purple-500 hover:bg-purple-500/25":ee.category==="Grammar"&&(G="decoration-amber-500 bg-amber-500/10 text-amber-500 hover:bg-amber-500/25"),$.push(r.jsx("button",{type:"button",onClick:()=>I(ee.id===H?null:ee.id),className:`underline decoration-2 underline-offset-2 font-bold select-text rounded cursor-pointer transition-all px-0.5 inline-block mx-0.5 ${G} ${we?"ring-2 ring-[var(--accent-color)] ring-offset-1 scale-102":""}`,title:`Click to review ${ee.category}`,children:ee.originalText},`m-${ee.id}`)),oe=ee.endIndex}return oe<h.length&&$.push(r.jsx("span",{className:"select-text",children:h.substring(oe)},`txt-${oe}`)),r.jsx("div",{className:"whitespace-pre-wrap leading-relaxed text-xs text-[var(--text-primary)] font-sans select-text",children:$})};return r.jsxs("div",{className:"flex flex-col gap-6 h-full select-text max-h-[85vh] overflow-y-auto pr-1",children:[r.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--card-border)] pb-4",children:[r.jsxs("div",{children:[r.jsxs("h3",{className:"text-base font-extrabold flex items-center gap-2 text-[var(--text-primary)]",children:[r.jsx(wr,{className:"text-[var(--accent-color)] w-5 h-5 animate-pulse"}),"Proofreading & Grammar Scanner"]}),r.jsx("p",{className:"text-xs text-[var(--text-muted)] mt-0.5",children:"Check your school papers for spelling, subject-verb compliance, and sentence voice improvements."})]}),r.jsx("div",{className:"flex items-center gap-2",children:r.jsx("button",{onClick:()=>z(xh),className:"text-[10px] bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-[var(--text-muted)]/50 text-[var(--text-primary)] px-3 py-1.5 rounded-xl font-bold font-mono transition-all cursor-pointer",title:"Load a generic student draft with intentional mistakes",children:"LOAD SAMPLE DRAFT"})})]}),r.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-5 gap-6",children:[r.jsxs("div",{className:"lg:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-5 gap-4 relative min-h-[400px]",children:[r.jsxs("div",{className:"flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)]",children:[r.jsx("span",{children:"DRAFT EDITOR"}),r.jsxs("span",{children:[h.split(/\s+/).filter(Boolean).length," words"]})]}),r.jsx("div",{className:"flex-1 flex flex-col gap-3 min-h-[250px]",children:K?r.jsx("div",{className:"w-full h-full min-h-[250px] bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--accent-color)]/30 rounded-xl p-4 text-xs leading-relaxed overflow-y-auto scrollbar-thin text-left",children:Ce()}):r.jsx("textarea",{value:h,onChange:$=>{z($.target.value),D(!1),f([])},placeholder:"Type or paste your academic essay, project summaries, or notes here...",rows:12,className:"w-full h-full bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--card-border)] rounded-xl p-4 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] leading-relaxed resize-none scrollbar-thin"})}),r.jsxs("div",{className:"border-t border-[var(--card-border)] pt-4 flex justify-between items-center select-none flex-wrap gap-3",children:[r.jsxs("div",{className:"flex items-center gap-2",children:[r.jsx("button",{onClick:P,disabled:C||!h.trim(),className:"px-5 py-2.5 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl font-mono text-xs font-bold leading-normal active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer shadow-md",children:C?r.jsxs(r.Fragment,{children:[r.jsx(ec,{className:"w-3.5 h-3.5 animate-spin"}),r.jsx("span",{children:"SCANNING DRAFT..."})]}):r.jsxs(r.Fragment,{children:[r.jsx(Wt,{className:"w-3.5 h-3.5 text-yellow-300"}),r.jsx("span",{children:"RUN AI GRAMMAR CHECK"})]})}),K&&r.jsx("button",{onClick:()=>{D(!1),f([])},className:"px-3.5 py-2 hover:bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] font-mono text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer",children:"Edit draft"})]}),r.jsxs("button",{onClick:He,disabled:!h,className:"p-2 px-3 hover:bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors",title:"Copy plain essay text to clipboard",children:[E?r.jsx(yr,{className:"w-3.5 h-3.5 text-green-500"}):r.jsx(Up,{className:"w-3.5 h-3.5 text-[var(--accent-color)]"}),r.jsx("span",{children:E?"COPIED!":"COPY"})]})]})]}),r.jsxs("div",{className:"lg:col-span-2 flex flex-col gap-4",children:[r.jsx("span",{className:"text-[10px] font-mono tracking-wider text-[var(--text-muted)] uppercase select-none font-bold text-left",children:"Assistance Diagnostics"}),!K&&!C?r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-5 text-center flex flex-col items-center justify-center py-10 gap-3",children:[r.jsx(Zp,{className:"w-10 h-10 stroke-1 text-[var(--text-muted)]/50"}),r.jsxs("div",{children:[r.jsx("h4",{className:"text-xs font-bold text-[var(--text-primary)]",children:"Ready to Proofread"}),r.jsx("p",{className:"text-[10px] text-[var(--text-muted)] leading-relaxed mt-1 max-w-xs",children:"Type your text or click Load Sample Draft, then press 'Run AI Grammar Check' to identify corrections."})]})]}):C?r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-5 text-center flex flex-col items-center justify-center py-10 gap-3",children:[r.jsx(ec,{className:"w-8 h-8 text-[var(--accent-color)] animate-spin"}),r.jsxs("div",{children:[r.jsx("h4",{className:"text-xs font-bold text-[var(--text-primary)]",children:"Analyzing syntax metrics..."}),r.jsx("p",{className:"text-[10.5px] text-[var(--text-muted)] leading-relaxed mt-0.5",children:"Scanning vocabulary structure, checking spelling tags, and rewriting passive formulations."})]})]}):r.jsxs("div",{className:"flex flex-col gap-3",children:[r.jsxs("div",{className:"bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3.5 text-left flex justify-between items-center",children:[r.jsxs("div",{children:[r.jsx("span",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Identified Warnings"}),r.jsx("div",{className:"text-3xl font-black text-[var(--text-primary)] mt-0.5",children:T.length})]}),r.jsx("div",{className:"text-right text-[10px] font-mono shrink-0",children:r.jsx("div",{className:"text-green-500 font-bold",children:T.length===0?"Perfect Score! ✨":"Proofreading Required"})})]}),Ae?r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--accent-color)]/30 rounded-xl p-4 text-left flex flex-col gap-3 shadow-md animate-fade-in",children:[r.jsxs("div",{className:"flex justify-between items-center border-b border-[var(--card-border)] pb-2",children:[r.jsx("span",{className:"text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase bg-[var(--input-fill)] text-[var(--accent-color)]",children:Ae.category}),r.jsx("span",{className:"text-[10px] text-[var(--text-muted)] font-mono",children:"Error Highlight"})]}),r.jsxs("div",{className:"flex flex-wrap gap-2 items-center text-xs mt-1",children:[r.jsx("span",{className:"line-through text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded",children:Ae.originalText}),r.jsx(jr,{className:"w-3.5 h-3.5 text-[var(--text-muted)]"}),r.jsx("span",{className:"text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20",children:Ae.suggestedCorrection})]}),r.jsx("p",{className:"text-[11px] leading-relaxed text-[var(--text-muted)] mt-1.5",children:Ae.explanation}),r.jsxs("button",{onClick:()=>ne(Ae),className:"w-full mt-2 bg-[var(--accent-color)] text-[var(--bg-color)] font-mono text-[10px] font-black py-2 rounded-lg hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer",children:[r.jsx(yr,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"APPLY QUICK CORRECTION"})]})]}):r.jsx("div",{className:"flex flex-col gap-2 max-h-[350px] overflow-y-auto",children:T.length===0?r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl p-5 text-center py-8",children:[r.jsx("p",{className:"text-xs text-[var(--text-primary)] font-bold",children:"Excellent Academic Document! 🎉"}),r.jsx("p",{className:"text-[10.5px] text-[var(--text-muted)] mt-1 max-w-xs mx-auto leading-relaxed",children:"No spelling mistakes, singular/plural grammar disagreements, or passive sentences have been flagged."})]}):T.map($=>r.jsxs("div",{onClick:()=>I($.id),className:"p-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-[var(--accent-color)] rounded-xl cursor-pointer transition-all text-left flex justify-between items-start gap-3",children:[r.jsxs("div",{className:"min-w-0 flex-1",children:[r.jsx("div",{className:"flex items-center gap-1.5 mb-1.5",children:r.jsx("span",{className:"text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase",children:$.category})}),r.jsxs("p",{className:"text-[10.5px] font-bold text-[var(--text-primary)] leading-snug",children:["Suggesting: ",r.jsxs("span",{className:"text-green-500",children:['"',$.suggestedCorrection,'"']})," instead of ",r.jsxs("span",{className:"line-through text-red-500",children:['"',$.originalText,'"']})]}),r.jsx("p",{className:"text-[9px] text-[var(--text-muted)] line-clamp-1 mt-1 leading-normal font-sans",children:$.explanation})]}),r.jsx("button",{type:"button",onClick:oe=>{oe.stopPropagation(),ne($)},className:"bg-[var(--accent-color)] text-[var(--bg-color)] p-1 rounded hover:opacity-90 transition-opacity whitespace-nowrap text-[9px] font-mono shrink-0 font-bold",title:"Apply correction instantly",children:r.jsx(yr,{className:"w-3 h-3"})})]},$.id))})]})]})]})]})}function Tb(){return r.jsx("div",{id:"chat-workspace-container",className:"relative w-full h-full flex flex-col bg-[#0c0f16] text-[#e2e8f0] overflow-hidden",children:r.jsx("div",{id:"chat-iframe-wrapper",className:"flex-1 w-full h-full bg-black",children:r.jsx("iframe",{id:"chat-decoy-iframe",src:"https://urnperiodic.github.io/extrastuffforwebsite/",className:"w-full h-full border-none",title:"Extra Stuff Workspace",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",referrerPolicy:"no-referrer"})})})}function Cb(){return r.jsx("div",{id:"movie",className:"relative w-full h-full flex flex-col bg-[#0c0f16] text-[#e2e8f0] overflow-hidden",children:r.jsx("div",{id:"chat-iframe-wrapper",className:"flex-1 w-full h-full bg-black",children:r.jsx("iframe",{id:"chat-decoy-iframe",src:"https://urnperiodic.github.io/p/",className:"w-full h-full border-none",title:"Extra Stuff Workspace",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",referrerPolicy:"no-referrer"})})})}const Eb=sp.map((h,z)=>{if(!h.id){const T=(h.title||"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase();return{...h,id:`game-gen-${z}-${T}`}}return h}),oa={getItem:h=>{try{return localStorage.getItem(h)}catch{return null}},setItem:(h,z)=>{try{localStorage.setItem(h,z)}catch{}}};function Mb(){const[h,z]=U.useState(()=>{const S=oa.getItem("unblocked-theme");return S&&["cyborg","violet","ice","rose-pine","none"].includes(S)?S:"none"}),[T,f]=U.useState(()=>{const S=oa.getItem("unblocked-mode");return S||((oa.getItem("classroom-view-mode")||"articles")==="games"?"dark":"light")}),[C,q]=U.useState("all"),[H,I]=U.useState(""),[E,A]=U.useState(!0),[K,D]=U.useState(null),[P,ne]=U.useState(1),[He,Ae]=U.useState({}),[Ce,$]=U.useState(()=>{try{const S=oa.getItem("unblocked-favorites");return S?JSON.parse(S):[]}catch{return[]}}),[oe,Ne]=U.useState(()=>oa.getItem("classroom-view-mode")==="games"?"games":"articles"),ze=oe==="games",ee=S=>{Ne(S),oa.setItem("classroom-view-mode",S),oa.setItem("classroom-passcode-unlocked",S==="games"?"true":"false")},[we,G]=U.useState(""),[Ye,$e]=U.useState(!1),[pt,We]=U.useState(0),[qe,Je]=U.useState("articles"),[Ie,it]=U.useState(uh),[w,O]=U.useState(uh[0].id),[Y,me]=U.useState(""),[ge,u]=U.useState("All"),[y,R]=U.useState(pr[0].value),[Q,F]=U.useState(Xs[0].value),[te,ie]=U.useState(`Write an educational, informational article focusing on ${pr[0].value} concepts suited for school reading.`),[L,le]=U.useState(!1),[Te,B]=U.useState(!1),[Ge,rt]=U.useState(0),[_,St]=U.useState(()=>{if(typeof window<"u"){const S=new URLSearchParams(window.location.search),M=S.get("decoyType");if(M&&["none","classroom","clever","campus","docs","gmail"].includes(M))return M;const Z=S.get("decoy");if(Z==="true")return"classroom";if(Z==="false")return"none";if(Z&&["none","classroom","clever","campus","docs","gmail"].includes(Z))return Z;const x=localStorage.getItem("study-tools-decoy-type");if(x&&["none","classroom","clever","campus","docs","gmail"].includes(x))return x;if(localStorage.getItem("study-tools-classroom-decoy")==="true")return"classroom"}return"none"}),[Lt,kr]=U.useState("");U.useEffect(()=>{localStorage.setItem("study-tools-decoy-type",_),localStorage.setItem("study-tools-classroom-decoy",String(_!=="none"))},[_]),U.useEffect(()=>{oe==="articles"?f("light"):oe==="games"&&f("dark")},[oe]);const on=()=>{if(Te)return;B(!0),rt(0);const S=setInterval(()=>{rt(M=>M>=100?(clearInterval(S),setTimeout(()=>{const Z=up(y,Q,te);it(x=>[Z,...x]),u(Z.category),O(Z.id),B(!1)},200),100):M+5)},45)},Pa=S=>{const M=we.trim().toLowerCase();M&&(M==="ttt0609"||M==="1378"||M===""?setTimeout(()=>{ee("games"),G("")},150):M==="0609"?setTimeout(()=>{ee("articles"),G("")},150):M==="1212"||M==="1111"||["school","classroom","study","science","math","education","admin","password","open","class"].includes(M)?setTimeout(()=>{ee("articles"),G("")},150):setTimeout(()=>{$e(!0),We(Z=>Z+1),setTimeout(()=>{$e(!1),G("")},500)},100))},$a=S=>{if(oe==="games")return;const M=we+S;G(M),M==="2026"?setTimeout(()=>{ee("games"),G("")},150):M==="0609"||M==="1212"||M==="1111"?setTimeout(()=>{ee("articles"),G("")},150):M.length>=4&&!isNaN(M)&&setTimeout(()=>{$e(!0),We(Z=>Z+1),setTimeout(()=>{$e(!1),G("")},500)},200)};U.useEffect(()=>{if(oe!=="locked")return;const S=M=>{var Z;if(((Z=document.activeElement)==null?void 0:Z.tagName)==="INPUT"){M.key==="Escape"&&G("");return}M.key>="0"&&M.key<="9"?$a(M.key):M.key==="Backspace"?G(x=>x.slice(0,-1)):M.key==="Escape"?G(""):M.key==="Enter"&&Pa()};return window.addEventListener("keydown",S),()=>window.removeEventListener("keydown",S)},[we,oe]),U.useEffect(()=>{Y==="2026"||Y.toLowerCase()==="ttt0609"?(ee("games"),me("")):Y==="0609"&&(ee("locked"),me(""))},[Y]),U.useEffect(()=>{let S="";const M=Z=>{var x,fe;((x=document.activeElement)==null?void 0:x.tagName)==="INPUT"||((fe=document.activeElement)==null?void 0:fe.tagName)==="TEXTAREA"||(Z.key>="0"&&Z.key<="9"?(S+=Z.key,S.length>4&&(S=S.slice(-4)),S==="0609"?(ee("locked"),G(""),S=""):S==="2026"&&(ee("games"),G(""),S="")):Z.key==="Escape"&&(S=""))};return window.addEventListener("keydown",M),()=>window.removeEventListener("keydown",M)},[oe]),U.useEffect(()=>{const S=M=>{(M.key==="["||M.key==="]")&&(M.preventDefault(),ee("articles"),D(null))};return window.addEventListener("keydown",S),()=>window.removeEventListener("keydown",S)},[]),U.useEffect(()=>{const S=x=>{document.title=x;try{window.parent&&window.parent!==window&&window.parent.document&&(window.parent.document.title=x)}catch{}},M=x=>{const fe=(he,ce)=>{he.querySelectorAll("link[rel*='icon']").forEach(ae=>{ae.parentNode&&ae.parentNode.removeChild(ae)});let Ue="image/png";ce.includes(".ico")?Ue="image/x-icon":ce.includes(".webp")?Ue="image/webp":(ce.includes("image/svg+xml")||ce.startsWith("data:image/svg+xml"))&&(Ue="image/svg+xml");const xt=he.createElement("link");xt.rel="icon",xt.type=Ue,xt.href=ce,he.head.appendChild(xt);const Le=he.createElement("link");Le.rel="shortcut icon",Le.type=Ue,Le.href=ce,he.head.appendChild(Le)};fe(document,x);try{window.parent&&window.parent!==window&&window.parent.document&&fe(window.parent.document,x)}catch{}},Z=`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h15M6 10h15"/></svg>')}`;oe==="articles"?(S("StudyTools"),M(Z)):oe==="games"?_==="classroom"?(S("Home - Classroom"),M("https://ssl.gstatic.com/classroom/favicon.png")):_==="clever"?(S("Clever | Log in with Clever"),M("https://www.google.com/s2/favicons?sz=64&domain=clever.com")):_==="campus"?(S("Campus Student"),M("https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png")):_==="docs"?(S("Google Docs"),M("https://ssl.gstatic.com/docs/documents/images/docs-favicon-2026-v2.ico")):_==="gmail"?(S("Inbox - Jersey City Public Schools"),M("https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon_gmail_2026_v2.ico")):(S("StudyTools"),M(Z)):(S("StudyTools"),M(Z))},[oe,_]),U.useEffect(()=>{L||ie(`Write an educational, ${Q.toLowerCase()} article focusing on ${y} concepts suited for school reading.`)},[y,Q,L]),U.useEffect(()=>{document.documentElement.setAttribute("data-theme",h),document.documentElement.setAttribute("data-mode",T),oa.setItem("unblocked-theme",h),oa.setItem("unblocked-mode",T)},[h,T]),U.useEffect(()=>{oa.setItem("unblocked-favorites",JSON.stringify(Ce))},[Ce]),U.useEffect(()=>{document.body.setAttribute("data-locked",ze?"false":"true")},[ze]);const sn=(S,M)=>{S.stopPropagation(),Ce.includes(M)?$(Ce.filter(Z=>Z!==M)):$([...Ce,M])},Nr=S=>{switch(S.id){case 1:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[r.jsxs("div",{className:"absolute inset-0 opacity-15 overflow-hidden",children:[r.jsx("div",{className:"w-full h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"}),r.jsx("div",{className:"absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/30 to-transparent"})]}),r.jsxs("div",{className:"relative",children:[r.jsx("div",{className:"absolute -inset-4 rounded-full bg-emerald-500/20 blur-md animate-pulse"}),r.jsx("div",{className:"w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] transform hover:rotate-45 transition-transform duration-500"})]}),r.jsx("div",{className:"absolute bottom-3 w-1/2 h-[3px] bg-emerald-400/50 rounded transform rotate-12"})]});case 2:return r.jsx("div",{className:"relative w-full h-full flex items-center justify-center",children:r.jsxs("div",{className:"grid grid-cols-2 gap-1 bg-amber-950/20 p-2 rounded",children:[r.jsx("div",{className:"w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-xs font-black text-black",children:"2"}),r.jsx("div",{className:"w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-xs font-black text-white",children:"0"}),r.jsx("div",{className:"w-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-xs font-black text-white",children:"4"}),r.jsx("div",{className:"w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-xs font-black text-white animate-bounce",children:"8"})]})});case 3:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[r.jsx("div",{className:"absolute top-2 left-2 text-[10px] font-mono text-blue-400 opacity-60",children:"QUARTERBACK"}),r.jsxs("div",{className:"relative w-14 h-8 bg-amber-800 rounded-full border-y-[3px] border-white/60 flex items-center justify-center shadow-lg transform -rotate-12",children:[r.jsx("div",{className:"w-1 h-6 bg-white/80 absolute"}),r.jsx("div",{className:"w-3 h-[2px] bg-white translate-x-2 absolute"}),r.jsx("div",{className:"w-3 h-[2px] bg-white -translate-x-2 absolute"})]})]});case 4:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[r.jsxs("div",{className:"absolute inset-y-0 right-6 w-5 h-full flex flex-col justify-between py-2",children:[r.jsx("div",{className:"w-full h-8 bg-green-500 rounded-b border-2 border-white/40"}),r.jsx("div",{className:"w-full h-12 bg-green-500 rounded-t border-2 border-white/40"})]}),r.jsxs("div",{className:"relative w-10 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-bounce",children:[r.jsx("div",{className:"absolute right-1 w-3 h-3 bg-white rounded-full border border-black flex items-center justify-center",children:r.jsx("div",{className:"w-1.5 h-1.5 bg-black rounded-full"})}),r.jsx("div",{className:"absolute left-1 w-3 h-2 bg-orange-500 rounded-lg"}),r.jsx("div",{className:"absolute bottom-1 w-4 h-2 bg-white/80 rounded-full border border-black/40 rotate-12"})]})]});case 5:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center gap-2",children:[r.jsx("div",{className:"w-10 h-10 bg-yellow-400 rounded-full border-r-4 border-transparent rotate-45 animate-pulse"}),r.jsx("div",{className:"w-2 h-2 bg-white rounded-full"}),r.jsx("div",{className:"w-2 h-2 bg-white/60 rounded-full"}),r.jsx("div",{className:"w-2 h-2 bg-white/30 rounded-full"})]});case 6:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center overflow-hidden",children:[r.jsx("div",{className:"absolute w-24 h-24 border-2 border-dashed border-purple-500/40 rounded-full animate-spin"}),r.jsx("div",{className:"absolute w-16 h-16 border border-purple-500/30 rounded-full animate-ping"}),r.jsx("div",{className:"w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white"})]});case 7:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]",children:[r.jsxs("div",{className:"border border-white/20 p-1 bg-black/40 rounded flex flex-col gap-0.5",children:[r.jsxs("div",{className:"flex gap-0.5",children:[r.jsx("div",{className:"w-4 h-4 bg-white"}),r.jsx("div",{className:"w-4 h-4 bg-stone-700"})]}),r.jsxs("div",{className:"flex gap-0.5",children:[r.jsx("div",{className:"w-4 h-4 bg-stone-700"}),r.jsx("div",{className:"w-4 h-4 bg-white"})]})]}),r.jsx("div",{className:"absolute text-2xl font-semibold transform hover:scale-110 duration-200",children:"♟️"})]});case 8:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[r.jsxs("div",{className:"absolute top-3 flex gap-2",children:[r.jsx("div",{className:"w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]"}),r.jsx("div",{className:"w-4 h-4 bg-red-400 rounded-full shadow-[0_0_8px_red]"}),r.jsx("div",{className:"w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_8px_yellow]"})]}),r.jsx("div",{className:"absolute bottom-2 w-2 h-8 bg-zinc-400 rounded-full origin-bottom rotate-45 animate-pulse"})]});case 9:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[r.jsx("div",{className:"absolute inset-x-0 h-4 bg-neutral-800/80 border-y border-neutral-700"}),r.jsxs("div",{className:"w-8 h-8 bg-white border border-neutral-300 rounded flex flex-col items-center justify-center transform hover:translate-y-[-6px] transition-transform shadow-lg",children:[r.jsx("div",{className:"w-2 h-2 bg-red-500 rounded-full mt-1"}),r.jsx("div",{className:"w-3 h-1.5 bg-yellow-500 rounded-b mt-0.5"})]})]});case 10:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[r.jsxs("div",{className:"w-9 h-14 bg-white border border-neutral-200 rounded-md shadow-md flex flex-col justify-between p-1 text-red-600 transform hover:-translate-y-2 hover:rotate-6 duration-300",children:[r.jsx("span",{className:"text-[9px] font-black leading-none",children:"A"}),r.jsx("span",{className:"text-sm self-center",children:"♥️"}),r.jsx("span",{className:"text-[9px] font-black leading-none self-end scale-y-[-1]",children:"A"})]}),r.jsx("div",{className:"absolute w-9 h-14 bg-red-600 border border-white rounded-md shadow-md flex flex-col justify-between p-1 text-white -translate-x-3 translate-y-1 transform hover:rotate-12 duration-300",children:r.jsx("div",{className:"w-full h-full border border-white/20 rounded flex items-center justify-center text-xs",children:"✨"})})]});case 11:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[r.jsx("div",{className:"absolute w-8 h-1.5 bg-green-500 rounded bottom-6"}),r.jsxs("div",{className:"w-8 h-10 bg-lime-400 rounded-t-full border border-green-600 flex flex-col items-center relative animate-bounce shadow",children:[r.jsx("div",{className:"w-4 h-1.5 bg-lime-500 rounded absolute -bottom-1"}),r.jsxs("div",{className:"flex gap-1 mt-2",children:[r.jsx("div",{className:"w-1.5 h-1.5 bg-black rounded-full"}),r.jsx("div",{className:"w-1.5 h-1.5 bg-black rounded-full"})]}),r.jsx("div",{className:"w-1.5 h-4 bg-lime-600 rounded-full mt-1"})]})]});case 12:return r.jsx("div",{className:"relative w-full h-full flex items-center justify-center",children:r.jsx("div",{className:"bg-sky-500/10 p-3 rounded-full border border-sky-400/20",children:r.jsx(ph,{className:"text-sky-400 w-10 h-10 animate-pulse"})})});case 13:return r.jsx("div",{className:"relative w-full h-full flex items-center justify-center",children:r.jsx("div",{className:"w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg relative cursor-pointer transform hover:scale-105 duration-200",children:r.jsx(bh,{className:"fill-white text-white w-5 h-5 ml-0.5"})})});case 14:return r.jsx("div",{className:"relative w-full h-full flex items-center justify-center",children:r.jsx("div",{className:"bg-zinc-800 p-3 rounded-lg border-2 border-zinc-700 flex flex-col items-center gap-1 shadow-md",children:r.jsx(ln,{className:"text-zinc-300 w-8 h-8 animate-spin",style:{animationDuration:"8s"}})})});case 15:return r.jsx("div",{className:"relative w-full h-full flex items-center justify-center",children:r.jsx("div",{className:"bg-pink-500/10 p-4 rounded-full border border-pink-400/30",children:r.jsx(vh,{className:"text-pink-400 w-8 h-8 hover:rotate-12 duration-200"})})});case 16:return r.jsxs("div",{className:"relative w-full h-full flex items-center justify-center overflow-hidden",children:[r.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-emerald-950 to-amber-950 opacity-40"}),r.jsx("div",{className:"relative w-12 h-12 bg-amber-800 rounded-md border-t-[8px] border-emerald-500 shadow-xl flex items-center justify-center font-mono font-bold text-white/50 text-[10px]",children:"3D"})]});default:return r.jsx("div",{className:"relative w-full h-full flex items-center justify-center",children:r.jsx(nn,{className:"text-neutral-400 w-12 h-12"})})}},Tr=S=>{if(!S)return!0;const M=S.toLowerCase().trim();return M==="minecraft"||M==="emulated"||M==="other websites"?!0:["solo","single","platformer","skill","science","driving","horror","creative","ai"].some(Z=>M.includes(Z))},vt=S=>{if(!S)return!1;const M=S.toLowerCase().trim();return M==="minecraft"||M==="random"||M==="other websites"?!0:["social","sport","multiplayer","fast","party","puzzle","shooter"].some(Z=>M.includes(Z))||M.includes("or")},cn=Eb.filter(S=>{if(C==="single"){if(!Tr(S.category))return!1}else if(C==="multiplayer"){if(!vt(S.category))return!1}else if(C==="favorites"){if(!Ce.includes(S.id))return!1}else if(C!=="all"&&(S.category||"").toLowerCase().trim()!==C.toLowerCase().trim())return!1;if(H.trim()!==""){const M=H.toLowerCase(),Z=(S.title||"").toLowerCase().includes(M),x=(S.description||"").toLowerCase().includes(M),fe=(S.category||"").toLowerCase().includes(M);return Z||x||fe}return!0});if(!ze){const S=Ie.filter(x=>{if(!(ge==="All"||x.category===ge))return!1;const he=Y.toLowerCase().trim();return he?x.title.toLowerCase().includes(he)||x.content.toLowerCase().includes(he)||x.category.toLowerCase().includes(he):!0}),M=S.find(x=>x.id===w)||S[0]||Ie[0],Z=x=>{if(!x)return null;const fe=x.split(`
`),he=[];let ce=0,ot=0;const Ue=Le=>{if(!Le)return"";let ae=Le.replace(/CO_2/g,"CO₂").replace(/H_2O/g,"H₂O").replace(/\\\text\{([^}]+)\}/g,"$1").replace(/(\s*)\^(\w+)/g,"<sup>$2</sup>").replace(/(\s*)\_(\w+)/g,"<sub>$2</sub>").replace(/\\longrightarrow/g," ⟶ ").replace(/\\rightarrow/g," → ").replace(/\$\+\/\+\$/g,"➕/➕ (Mutualism)").replace(/\$\+\/0\$/g,"➕/🫙 (Commensalism)").replace(/\$\+\/\-\$/g,"➕/➖ (Parasitism)").replace(/\$/g,"");const _e=[];let bt=0;const Ft=/(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;let ut;for(;(ut=Ft.exec(ae))!==null;)ut.index>bt&&_e.push(ae.substring(bt,ut.index)),ut[1]?_e.push(r.jsx("strong",{className:"font-extrabold text-[var(--accent-color)]",children:ut[2]},ut.index)):ut[3]&&_e.push(r.jsx("em",{className:"italic text-[var(--text-primary)]",children:ut[4]},ut.index)),bt=Ft.lastIndex;return bt<ae.length&&_e.push(ae.substring(bt)),_e.length>0?_e:ae},xt=Le=>{let ae=Le.trim();return ae.includes("Atom")?r.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-1.5 md:gap-2.5 text-xs text-[var(--text-primary)] font-mono tracking-tight py-2 w-full",children:[r.jsx("span",{className:"font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors",children:"Atom"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm",children:"⟶"}),r.jsx("span",{className:"font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors",children:"Molecule"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm",children:"⟶"}),r.jsx("span",{className:"font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors",children:"Organelle"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm",children:"⟶"}),r.jsx("span",{className:"font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors",children:"Cell"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm",children:"⟶"}),r.jsx("span",{className:"font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors",children:"Tissue"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm",children:"⟶"}),r.jsx("span",{className:"font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors",children:"Organ"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm",children:"⟶"}),r.jsx("span",{className:"font-semibold px-2 py-1 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-color)] transition-colors",children:"Organ System"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm",children:"⟶"}),r.jsx("span",{className:"font-extrabold text-[var(--accent-color)] bg-[var(--accent-color)]/15 px-3 py-1 rounded-xl border border-[var(--accent-color)] shadow-sm animate-pulse",children:"Organism"})]}):ae.includes("Photosynthesis")||ae.includes("6CO")&&ae.includes("Solar")?r.jsxs("div",{className:"text-center font-bold text-xs flex flex-wrap items-center justify-center gap-1.5 leading-relaxed py-2 select-text w-full",children:[r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Carbon Dioxide"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(6CO₂)"}),r.jsx("span",{className:"text-[var(--accent-color)] mx-0.5 font-mono",children:"+"}),r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Water"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(6H₂O)"}),r.jsx("span",{className:"text-[var(--accent-color)] mx-0.5 font-mono",children:"+"}),r.jsxs("span",{className:"text-yellow-500 font-semibold flex items-center gap-0.5 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20 text-[10px]",children:[r.jsx("span",{className:"animate-pulse",children:"☀️"})," Solar Light"]}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm mx-1",children:"⟶"}),r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Glucose"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(C₆H₁₂O₆)"}),r.jsx("span",{className:"text-[var(--accent-color)] mx-0.5 font-mono",children:"+"}),r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Oxygen"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(6O₂)"})]}):ae.includes("Respiration")||ae.includes("ATP")||ae.includes("6CO")&&ae.includes("Oxygen")?r.jsxs("div",{className:"text-center font-bold text-xs flex flex-wrap items-center justify-center gap-1.5 leading-relaxed py-2 select-text w-full",children:[r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Glucose"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(C₆H₁₂O₆)"}),r.jsx("span",{className:"text-[var(--accent-color)] mx-0.5 font-mono",children:"+"}),r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Oxygen"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(6O₂)"}),r.jsx("span",{className:"text-[var(--accent-color)] text-sm mx-1",children:"⟶"}),r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Carbon Dioxide"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(6CO₂)"}),r.jsx("span",{className:"text-[var(--accent-color)] mx-0.5 font-mono",children:"+"}),r.jsx("span",{className:"text-[var(--text-primary)] font-semibold",children:"Water"}),r.jsx("span",{className:"text-[var(--text-muted)] font-mono text-[10px] bg-black/10 px-1 rounded",children:"(6H₂O)"}),r.jsx("span",{className:"text-[var(--accent-color)] mx-0.5 font-mono",children:"+"}),r.jsx("span",{className:"text-emerald-500 font-bold flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] animate-pulse",children:"⚡ ATP Energy"})]}):r.jsx("span",{children:ae})};for(;ce<fe.length;){const Le=fe[ce],ae=Le.trim();if(ae.startsWith("$$")&&ae.endsWith("$$")){const _e=ae.substring(2,ae.length-2);he.push(r.jsx("div",{className:"bg-[var(--bg-primary)] border border-[var(--accent-color)]/20 p-4 rounded-xl text-center my-4 shadow-sm text-[var(--accent-color)] flex items-center justify-center overflow-x-auto select-all",children:xt(_e)},ot++)),ce++;continue}if(ae.startsWith("```")||ae.startsWith("`\\`\\`")){let _e=[];for(ce++;ce<fe.length&&!fe[ce].trim().startsWith("```")&&!fe[ce].trim().startsWith("`\\`\\`");)_e.push(fe[ce]),ce++;he.push(r.jsx("pre",{className:"bg-black/40 border border-[var(--card-border)] p-4.5 rounded-xl text-[10.5px] font-mono text-[var(--text-primary)] whitespace-pre-wrap leading-normal shadow-inner my-3 select-all",children:_e.join(`
`)},ot++)),ce++;continue}if(ae.startsWith("---")){he.push(r.jsx("hr",{className:"border-t border-[var(--card-border)] my-5"},ot++)),ce++;continue}if(ae.startsWith("|")){let bt=[ae];for(ce++;ce<fe.length&&fe[ce].trim().startsWith("|");)bt.push(fe[ce]),ce++;const Ft=bt.filter(Bt=>!Bt.includes("| :---")&&!Bt.includes("|---|")&&!Bt.includes("| :--- |")),ut=Bt=>Bt.split("|").slice(1,-1).map(Pt=>Pt.trim());if(Ft.length>0){const Bt=ut(Ft[0]),Pt=Ft.slice(1).map(aa=>ut(aa));he.push(r.jsx("div",{className:"my-4.5 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--bg-primary)]/40 shadow-sm",children:r.jsxs("table",{className:"w-full text-left border-collapse text-[11px]",children:[r.jsx("thead",{children:r.jsx("tr",{className:"bg-[var(--bg-secondary)] border-b border-[var(--card-border)]",children:Bt.map((aa,sa)=>r.jsx("th",{className:"p-3.5 font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider text-[9px] border-r border-[var(--card-border)] last:border-r-0",children:Ue(aa)},sa))})}),r.jsx("tbody",{children:Pt.map((aa,sa)=>r.jsx("tr",{className:"border-b last:border-b-0 border-[var(--card-border)] hover:bg-[var(--accent-color)]/5 transition-colors duration-150 odd:bg-black/[0.02] even:bg-transparent",children:aa.map((Cr,li)=>r.jsx("td",{className:"p-3 text-[var(--text-muted)] border-r border-[var(--card-border)] last:border-r-0 leading-relaxed font-sans font-medium",children:Ue(Cr)},li))},sa))})]})},ot++))}continue}if(ae.startsWith("###")){const _e=ae.replace(/^###\s*/,"");he.push(r.jsx("h4",{className:"text-xs font-bold font-mono tracking-tight text-[var(--text-primary)] border-l-2 border-[var(--accent-color)] pl-2.5 mt-5 mb-2 flex items-center gap-1.5 uppercase",children:Ue(_e)},ot++)),ce++;continue}if(ae.startsWith("####")){const _e=ae.replace(/^####\s*/,"");he.push(r.jsx("h5",{className:"text-[11px] font-extrabold font-mono tracking-tight text-[var(--text-primary)] mt-3 mb-1 text-[var(--accent-color)]",children:Ue(_e)},ot++)),ce++;continue}if(ae.startsWith("*")||ae.startsWith("-")||ae.startsWith("●")||ae.startsWith("○")){let _e=ae.replace(/^(\*|-|●|○)\s*/,"");const bt=Le.startsWith("  ")||Le.startsWith("	")||ae.startsWith("○");he.push(r.jsxs("div",{className:`flex items-start gap-2 text-[11px] text-[var(--text-muted)] leading-relaxed mb-1.5 ${bt?"ml-6":"ml-2"}`,children:[r.jsx("span",{className:`flex-shrink-0 text-[10px] mt-0.5 select-none ${bt?"text-[var(--text-muted)]/50 font-mono":"text-[var(--accent-color)]"}`,children:bt?"○":"◼"}),r.jsx("span",{className:"font-medium font-sans",children:Ue(_e)})]},ot++)),ce++;continue}if(ae.match(/^\d+\./)){const _e=ae.match(/^(\d+)\./)[1],bt=ae.replace(/^\d+\.\s*/,"");he.push(r.jsxs("div",{className:"flex items-start gap-2.5 text-[11px] text-[var(--text-muted)] leading-relaxed ml-2 mb-1.5",children:[r.jsx("span",{className:"font-mono text-[9px] font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-1.5 py-0.5 rounded border border-[var(--accent-color)]/20 flex-shrink-0 mt-0.5 min-w-[20px] text-center",children:_e}),r.jsx("span",{className:"font-medium font-sans",children:Ue(bt)})]},ot++)),ce++;continue}ae===""?he.push(r.jsx("div",{className:"h-2"},ot++)):he.push(r.jsx("p",{className:"text-[11px] text-[var(--text-muted)] leading-relaxed mb-3 font-medium font-sans",children:Ue(ae)},ot++)),ce++}return r.jsx("div",{className:"space-y-1.5",children:he})};return oe==="articles"?r.jsxs("div",{className:"min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col p-4 md:p-6 transition-colors duration-300 relative select-text",children:[r.jsxs("header",{className:"w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pb-4 mb-4 border-b border-[var(--card-border)] gap-4 select-none",children:[r.jsxs("div",{onClick:()=>{Je("articles"),me("")},className:"flex items-center gap-3 cursor-pointer active:scale-98 transition-transform self-stretch sm:self-auto",title:"StudyTools Home",children:[r.jsx("div",{className:"p-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-xl shadow-[0_2px_8.5px_var(--accent-shadow)] border border-[var(--card-border)]",children:r.jsx(br,{className:"w-6 h-6 animate-pulse"})}),r.jsx("div",{children:r.jsxs("h1",{className:"text-sm font-bold tracking-tight text-[var(--text-primary)] sm:text-base",children:["StudyTools ",r.jsx("span",{className:"text-[9px] font-mono border border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold",children:"Academic Base"})]})})]}),r.jsx("div",{className:"flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-full p-1 shadow-sm select-none max-w-full overflow-x-auto scrollbar-none",children:[{id:"articles",label:"Syllabus Articles",icon:br},{id:"flashcards",label:"Study Flashcards",icon:vr},{id:"quiz",label:"Practice Quizzes",icon:nn},{id:"grammar",label:"Grammar Scanner",icon:wr}].map(x=>{const fe=x.icon,he=qe===x.id;return r.jsxs("button",{onClick:()=>Je(x.id),className:`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${he?"bg-[var(--accent-color)] text-[var(--bg-color)] font-bold shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`,children:[r.jsx(fe,{className:"w-3.5 h-3.5"}),r.jsx("span",{className:"leading-none",children:x.label})]},x.id)})}),r.jsxs("div",{className:"flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start",children:[r.jsxs("button",{onClick:()=>{ee("articles"),G("")},className:"flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-red-500/50 hover:bg-red-500/10 text-[var(--text-primary)] hover:text-red-500 transition-all duration-200 cursor-pointer shadow-sm group",title:"Sign Out to Lock Screen",children:[r.jsx(gh,{className:"w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"}),r.jsx("span",{children:"Sign Out"})]}),r.jsx("div",{className:"flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1.5 px-2.5 rounded-full shadow-sm",children:r.jsx("div",{onClick:()=>f(x=>x==="light"?"dark":"light"),className:"relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 transition-all duration-300",children:r.jsx("div",{className:`w-5 h-5 rounded-full bg-[var(--accent-color)] transition-all flex items-center justify-center text-[10px] transform ${T==="dark"?"translate-x-6":"translate-x-0"}`,children:T==="dark"?"🌙":"☀️"})})})]})]}),r.jsxs("div",{className:"w-full max-w-7xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 md:p-6 shadow-2xl transition-all flex flex-col gap-4 flex-1 md:h-[650px] overflow-hidden",children:[qe==="articles"&&r.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden",children:[r.jsxs("div",{className:"md:col-span-2 flex flex-col gap-3 overflow-hidden h-full",children:[r.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none",children:["All","Science","Mathematics","ELA","Social Studies","Italian"].map(x=>{const fe=ge===x;return r.jsx("button",{onClick:()=>{u(x);const he=Ie.find(ce=>x==="All"||ce.category===x);he&&O(he.id)},className:`px-3 py-1.5 rounded-xl text-[10px] font-mono border font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-98 ${fe?"bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]":"bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-muted)]/50 hover:text-[var(--text-primary)]"}`,children:x},x)})}),r.jsxs("div",{className:"relative flex-shrink-0",children:[r.jsx("input",{type:"text",placeholder:"Search curriculum papers...",value:Y,onChange:x=>me(x.target.value),className:"w-full text-xs rounded-xl py-1.5 pl-8 pr-3 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all font-mono"}),r.jsx(Fs,{className:"absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]"})]}),r.jsx("div",{className:"flex-1 flex flex-col gap-2 overflow-y-auto py-0.5 scrollbar-thin",children:S.length===0?r.jsx("div",{className:"text-center py-4 text-xs text-[var(--text-muted)] font-mono select-none",children:"No matching resource files available"}):S.map(x=>{const fe=x.id===w;return r.jsxs("div",{onClick:()=>O(x.id),className:`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${fe?"bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm scale-[1.01]":"bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40"}`,children:[r.jsxs("div",{className:"flex items-center justify-between gap-1 mb-0.5 flex-wrap",children:[r.jsx("span",{className:"text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase",children:x.category}),r.jsx("span",{className:"text-[8px] text-[var(--text-muted)] font-mono",children:x.readTime})]}),r.jsx("h4",{className:"text-[11px] font-bold leading-snug text-[var(--text-primary)] line-clamp-1",children:x.title}),r.jsx("p",{className:"text-[9px] text-[var(--text-muted)] mt-0.5 font-mono",children:x.date})]},x.id)})}),r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-3 flex-shrink-0 flex flex-col gap-2 text-left",children:[r.jsxs("div",{className:"flex items-center justify-between",children:[r.jsxs("div",{className:"flex items-center gap-1.5",children:[r.jsx(Wt,{className:"w-3.5 h-3.5 text-yellow-400"}),r.jsx("span",{className:"text-xs font-bold text-[var(--text-primary)] font-mono",children:"Interactive AI Writer"})]}),L&&r.jsx("button",{type:"button",onClick:()=>{ie(`Write an educational, informational article focusing on ${y} concepts suited for school reading.`),le(!1)},className:"text-[9px] font-mono text-[var(--accent-color)] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0",children:"Reset preset"})]}),r.jsxs("div",{className:"grid grid-cols-2 gap-2 text-left",children:[r.jsxs("div",{className:"flex flex-col gap-0.5",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Subject"}),r.jsx("select",{value:y,onChange:x=>{const fe=x.target.value;R(fe),L||ie(`Write an educational, informational article focusing on ${fe} concepts suited for school reading.`)},className:"text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono",style:{colorScheme:T},children:pr.map(x=>r.jsx("option",{value:x.value,style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:x.label},x.value))})]}),r.jsxs("div",{className:"flex flex-col gap-0.5",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Tone"}),r.jsx("select",{value:Q,onChange:x=>F(x.target.value),className:"text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono",style:{colorScheme:T},children:Xs.map(x=>r.jsx("option",{value:x.value,style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:x.value},x.value))})]})]}),r.jsxs("div",{className:"flex flex-col gap-0.5 mt-0.5 text-left",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Custom prompt instructions"}),r.jsx("textarea",{value:te,onChange:x=>{ie(x.target.value),le(!0)},placeholder:"Type standard prompt rules...",rows:2,className:"text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-primary)] w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-sans resize-none scrollbar-thin"})]}),r.jsx("button",{type:"button",onClick:on,disabled:Te,className:"w-full text-xs font-semibold bg-[var(--accent-color)] text-[var(--bg-color)] py-1.5 rounded-xl hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 font-mono shadow-sm mt-0.5",children:Te?r.jsxs(r.Fragment,{children:[r.jsx(Wt,{className:"w-3 h-3 animate-spin text-yellow-300"}),r.jsxs("span",{children:["DEEP WRITER (",Ge,"%)..."]})]}):r.jsxs(r.Fragment,{children:[r.jsx(Wt,{className:"w-3 h-3 text-yellow-300"}),r.jsx("span",{children:"GENERATE ARTICLE WITH AI"})]})})]})]}),r.jsx("div",{className:"md:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden h-full",children:M?r.jsxs("div",{className:"flex flex-col h-full overflow-hidden text-left justify-between",children:[r.jsxs("div",{className:"p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex-shrink-0 flex justify-between items-center gap-3",children:[r.jsxs("div",{className:"min-w-0 flex-1",children:[r.jsxs("div",{className:"flex items-center gap-1.5 mb-1",children:[r.jsx("span",{className:"text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] uppercase tracking-wider border border-[var(--card-border)]",children:M.category}),r.jsx("span",{className:"text-[9px] text-[var(--text-muted)] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--card-border)]",children:M.readTime})]}),r.jsx("h3",{className:"text-sm font-extrabold text-[var(--text-primary)] leading-snug line-clamp-1",children:M.title})]}),r.jsxs("div",{className:"flex items-center gap-1.5 shrink-0 select-none",children:[r.jsxs("button",{type:"button",onClick:()=>Je("flashcards"),className:"bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] font-mono text-[9px] font-bold px-2 py-1.5 rounded-xl border border-[var(--accent-color)] flex items-center gap-1 transition-all cursor-pointer",title:"Interactive Flashcards deck for this syllabus article",children:[r.jsx(vr,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"STUDY TERMS"})]}),r.jsxs("button",{type:"button",onClick:()=>Je("quiz"),className:"bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] font-mono text-[9px] font-bold px-2 py-1.5 rounded-xl border border-[var(--accent-color)] flex items-center gap-1 transition-all cursor-pointer",title:"Generate Quiz based on this syllabus",children:[r.jsx(nn,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"TAKE TEST"})]})]})]}),r.jsx("div",{className:"p-4 overflow-y-auto text-left flex-1 min-h-0 scrollbar-thin",children:Z(M.content)})]}):r.jsx("div",{className:"flex items-center justify-center h-full text-xs text-[var(--text-muted)] font-mono",children:"Select a core paper assignment to read content"})})]}),qe==="flashcards"&&r.jsx(Ab,{refArticle:M,onGeneratedSuccess:x=>Je(x)}),qe==="quiz"&&r.jsx(kb,{refArticle:M,onGeneratedSuccess:x=>Je(x)}),qe==="grammar"&&r.jsx(Nb,{})]})]}):r.jsxs("div",{className:"min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col xl:flex-row items-center xl:items-center justify-center p-4 md:p-8 xl:p-12 gap-8 md:gap-10 transition-colors duration-350 relative select-none",children:[r.jsxs("div",{className:"absolute top-4 right-4 flex items-center gap-3",children:[r.jsx("div",{className:"flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1.5 px-2.5 rounded-full shadow-sm",children:r.jsx("div",{onClick:()=>f(x=>x==="light"?"dark":"light"),className:"relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300",title:"Toggle Light/Dark Theme Mode",children:r.jsx("div",{className:`w-5 h-5 rounded-full bg-[var(--accent-color)] shadow-md transition-all duration-350 ease-out flex items-center justify-center text-[10px] transform ${T==="dark"?"translate-x-6":"translate-x-0"}`,children:T==="dark"?"🌙":"☀️"})})}),r.jsx("div",{className:"border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm",children:r.jsx("div",{className:"flex items-center gap-1.5",children:[{key:"cyborg",color:"bg-green-500 border-green-300 shadow-[0_0_5px_green]",tooltip:"Cyborg Theme"},{key:"violet",color:"bg-indigo-600 border-indigo-400",tooltip:"Violet Theme"},{key:"ice",color:"bg-sky-400 border-sky-300",tooltip:"Glacier Theme"},{key:"rose-pine",color:"bg-rose-300 border-rose-200",tooltip:"Rose Pine Theme"},{key:"none",color:"bg-gradient-to-br from-neutral-300 to-neutral-700 border-neutral-400",tooltip:"No Theme (Monochrome)"}].map(x=>r.jsx("button",{title:x.tooltip,onClick:()=>z(x.key),className:`w-3.5 h-3.5 rounded-full ${x.color} border transition-all duration-200 hover:scale-130 cursor-pointer ${h===x.key?"ring-2 ring-offset-2 ring-[var(--accent-color)]":"opacity-80"}`},x.key))})})]}),r.jsxs("div",{className:`w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 flex flex-col items-center gap-6 flex-shrink-0 ${Ye?"animate-shake":""}`,children:[r.jsxs("div",{className:"text-center",children:[r.jsx("h2",{className:"text-xl font-bold tracking-tight text-[var(--text-primary)]",children:"Portal Secured"}),r.jsx("p",{className:"text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed",children:"This is a paid Science, Math, ELA, and Social Studies article website. Please enter a correct password to continue to the website."})]}),r.jsxs("div",{className:"w-full flex flex-col gap-2.5",children:[r.jsxs("div",{className:"relative",children:[r.jsx("input",{type:"text",placeholder:"Enter password...",value:we,onChange:x=>G(x.target.value),onKeyDown:x=>{x.key==="Enter"&&Pa()},className:"w-full px-4 py-2.5 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-sm font-bold font-mono tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] placeholder:text-[10px] placeholder:font-sans placeholder:tracking-normal outline-none transition-all placeholder:opacity-60",autoFocus:!0}),we.length>0&&r.jsx("button",{type:"button",onClick:()=>G(""),className:"absolute right-3.5 top-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold cursor-pointer",title:"Clear input",children:"✕"})]}),r.jsxs("button",{type:"button",onClick:()=>Pa(),className:"w-full text-xs font-mono font-bold bg-[var(--accent-color)] text-[var(--bg-color)] py-2.5 rounded-xl hover:opacity-95 active:scale-98 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5",children:[r.jsx(Ip,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"SUBMIT PASSWORD"})]})]}),(!we||!isNaN(we)&&we.length<=4)&&r.jsx("div",{className:"flex justify-center gap-4 py-1",children:[0,1,2,3].map(x=>{const fe=we.length>x;return r.jsx("div",{className:`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 transform ${fe?"bg-[var(--accent-color)] border-[var(--accent-color)] scale-110 shadow-[0_0_8px_var(--accent-shadow)]":"border-[var(--card-border)] bg-[var(--bg-secondary)]"}`},x)})}),r.jsxs("div",{className:"grid grid-cols-3 gap-3.5 w-full max-w-[245px] mt-2",children:[["1","2","3","4","5","6","7","8","9"].map(x=>r.jsx("button",{onClick:()=>$a(x),className:"w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:border-[var(--accent-color)] active:scale-95 hover:scale-105 transition-all duration-150 cursor-pointer shadow-sm mx-auto",children:x},x)),r.jsx("button",{onClick:()=>G(""),className:"w-14 h-14 rounded-full flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--card-border)] hover:bg-[var(--bg-secondary)] active:scale-90 transition-all duration-150 cursor-pointer mx-auto",children:"Clear"}),r.jsx("button",{onClick:()=>$a("0"),className:"w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] hover:border-[var(--accent-color)] active:scale-95 hover:scale-105 transition-all duration-150 cursor-pointer shadow-sm mx-auto",children:"0"}),r.jsx("button",{onClick:()=>G(x=>x.slice(0,-1)),className:"w-14 h-14 rounded-full flex items-center justify-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--card-border)] hover:bg-[var(--bg-secondary)] active:scale-90 transition-all duration-150 cursor-pointer mx-auto",children:"Del"})]}),pt>0&&r.jsxs("span",{className:"text-[10.5px] text-red-500 font-medium font-mono animate-bounce mt-1",children:["Access Denied! Attempt #",pt]})]}),r.jsxs("div",{className:"w-full max-w-4xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 md:p-6 shadow-2xl transition-all duration-300 flex flex-col gap-4 select-text max-h-[90vh] md:h-[600px] overflow-hidden",children:[r.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--card-border)]",children:[r.jsx("div",{children:r.jsxs("h3",{className:"text-lg font-extrabold tracking-tight text-[var(--text-primary)] flex items-center gap-2",children:[r.jsx(br,{className:"text-[var(--accent-color)] w-5 h-5"}),"Examples of some articles"]})}),r.jsxs("div",{className:"flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider text-[10px] font-mono bg-[var(--bg-secondary)] py-1 px-2 rounded-md border border-[var(--card-border)] text-[var(--accent-color)]",children:[r.jsx(Wt,{className:"w-3.5 h-3.5 animate-pulse text-yellow-400"}),r.jsx("span",{children:"AI generated examples"})]})]}),r.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0 overflow-hidden",children:[r.jsxs("div",{className:"md:col-span-2 flex flex-col gap-3 overflow-hidden h-full",children:[r.jsx("div",{className:"flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none select-none",children:["All","Science","Mathematics","ELA","Social Studies","Italian"].map(x=>{const fe=ge===x;return r.jsx("button",{onClick:()=>{u(x);const he=Ie.find(ce=>x==="All"||ce.category===x);he&&O(he.id)},className:`px-3 py-1.5 rounded-xl text-[10px] font-mono border font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-98 ${fe?"bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_2px_8px_var(--accent-shadow)]":"bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-[var(--text-muted)]/50 hover:text-[var(--text-primary)]"}`,children:x},x)})}),r.jsxs("div",{className:"relative flex-shrink-0",children:[r.jsx("input",{type:"text",placeholder:"Search articles...",value:Y,onChange:x=>me(x.target.value),className:"w-full text-xs rounded-xl py-1.5 pl-8 pr-3 border border-[var(--card-border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all font-mono"}),r.jsx(Fs,{className:"absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]"})]}),r.jsx("div",{className:"flex-1 flex flex-col gap-2 overflow-y-auto py-0.5 scrollbar-thin",children:S.length===0?r.jsx("div",{className:"text-center py-4 text-xs text-[var(--text-muted)] font-mono",children:"No articles found matching query"}):S.map(x=>{const fe=x.id===w;return r.jsxs("div",{onClick:()=>O(x.id),className:`p-2 md:p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${fe?"bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-sm scale-[1.01]":"bg-[var(--bg-secondary)] border-[var(--card-border)] hover:border-[var(--text-muted)]/40"}`,children:[r.jsxs("div",{className:"flex items-center justify-between gap-1 mb-0.5 flex-wrap",children:[r.jsx("span",{className:"text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded bg-[var(--input-fill)] text-[var(--accent-color)] uppercase",children:x.category}),r.jsx("span",{className:"text-[8px] text-[var(--text-muted)] font-mono",children:x.readTime})]}),r.jsx("h4",{className:"text-[11px] font-bold leading-snug text-[var(--text-primary)] line-clamp-1",children:x.title}),r.jsx("p",{className:"text-[9px] text-[var(--text-muted)] mt-0.5 font-mono",children:x.date})]},x.id)})}),r.jsxs("div",{className:"bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl p-3 flex-shrink-0 flex flex-col gap-2",children:[r.jsxs("div",{className:"flex items-center gap-1.5",children:[r.jsx(Wt,{className:"w-3.5 h-3.5 text-yellow-400"}),r.jsx("span",{className:"text-xs font-bold text-[var(--text-primary)] font-mono",children:"Interactive AI Writer"})]}),r.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[r.jsxs("div",{className:"flex flex-col gap-0.5",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Subject"}),r.jsx("select",{value:y,onChange:x=>R(x.target.value),className:"text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono",style:{colorScheme:T},children:pr.map(x=>r.jsx("option",{value:x.value,style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:x.label},x.value))})]}),r.jsxs("div",{className:"flex flex-col gap-0.5",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Tone"}),r.jsx("select",{value:Q,onChange:x=>F(x.target.value),className:"text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1.5 text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-mono",style:{colorScheme:T},children:Xs.map(x=>r.jsx("option",{value:x.value,style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:x.value},x.value))})]})]}),r.jsxs("div",{className:"flex flex-col gap-1 mt-1",children:[r.jsxs("div",{className:"flex items-center justify-between",children:[r.jsx("label",{className:"text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider",children:"Customize Prompt"}),L&&r.jsx("button",{type:"button",onClick:()=>{le(!1)},className:"text-[9px] font-mono text-[var(--accent-color)] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0",children:"Reset to preset"})]}),r.jsx("textarea",{value:te,onChange:x=>{ie(x.target.value),le(!0)},placeholder:"Type a custom prompt for the AI to write about...",rows:2,className:"text-[10px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-primary)] w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] font-sans resize-none scrollbar-thin"})]}),r.jsx("button",{type:"button",onClick:on,disabled:Te,className:"w-full text-xs font-semibold bg-[var(--accent-color)] text-[var(--bg-color)] py-1.5 rounded-xl hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 font-mono shadow-sm mt-0.5",children:Te?r.jsxs(r.Fragment,{children:[r.jsx(Wt,{className:"w-3 h-3 animate-spin text-yellow-300"}),r.jsxs("span",{children:["DEEP WRITER (",Ge,"%)..."]})]}):r.jsxs(r.Fragment,{children:[r.jsx(Wt,{className:"w-3 h-3 text-yellow-300"}),r.jsx("span",{children:"GENERATE ARTICLE WITH AI"})]})})]})]}),r.jsx("div",{className:"md:col-span-3 flex flex-col bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-2xl overflow-hidden h-[300px] md:h-full",children:M?r.jsxs("div",{className:"flex flex-col h-full overflow-hidden",children:[r.jsxs("div",{className:"p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex-shrink-0",children:[r.jsxs("div",{className:"flex items-center gap-1.5 mb-1.5",children:[r.jsx("span",{className:"text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--accent-color)] uppercase tracking-wider border border-[var(--card-border)]",children:M.category}),r.jsx("span",{className:"text-[9px] text-[var(--text-muted)] font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--card-border)]",children:M.readTime})]}),r.jsx("h3",{className:"text-sm font-extrabold text-[var(--text-primary)] leading-snug",children:M.title}),r.jsxs("p",{className:"text-[10px] text-[var(--text-muted)] mt-1 font-mono",children:[M.subtitle," • ",M.date]})]}),r.jsx("div",{className:"p-4 overflow-y-auto text-left flex-1 min-h-0 scrollbar-thin",children:Z(M.content)})]}):r.jsx("div",{className:"flex items-center justify-center h-full text-xs text-[var(--text-muted)] font-mono",children:"Select an article to begin reading"})})]})]})]})}return r.jsxs("div",{className:"min-h-screen flex flex-col transition-colors duration-300",children:[r.jsxs("nav",{className:"border-b border-[var(--card-border)] bg-[var(--header-bg)] py-3.5 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-300 sticky top-0 z-50 shadow-sm",children:[r.jsxs("div",{className:"flex items-center gap-4 self-stretch sm:self-auto justify-between w-full sm:w-auto",children:[r.jsxs("div",{onClick:()=>{q("all"),D(null),I("")},className:"flex items-center gap-2.5 cursor-pointer select-none group",title:_!=="none"?`Go to ${_==="classroom"?"Classroom":_==="clever"?"Clever":_==="campus"?"Campus":_==="docs"?"Google Docs":"Inbox"} homepage`:"Go to StudyTools homepage",children:[r.jsx("div",{className:"p-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-lg border border-[var(--card-border)] shadow-[0_2px_8.5px_var(--accent-shadow)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 transform",children:_==="classroom"?r.jsx(Is,{className:"w-5.5 h-5.5"}):_==="clever"?r.jsx(Op,{className:"w-5.5 h-5.5"}):_==="campus"?r.jsx(Is,{className:"w-5.5 h-5.5"}):_==="docs"?r.jsx(wr,{className:"w-5.5 h-5.5"}):_==="gmail"?r.jsx($p,{className:"w-5.5 h-5.5"}):r.jsx(br,{className:"w-5.5 h-5.5"})}),r.jsx("div",{children:r.jsx("span",{className:"text-xl font-bold tracking-tight text-[var(--text-primary)] block group-hover:text-[var(--accent-color)] transition-colors",children:_==="classroom"?"Home - Classroom":_==="clever"?"Clever | Log in with Clever":_==="campus"?"Campus Student":_==="docs"?"Google Docs":_==="gmail"?"Inbox - Jersey City Public Schools":"StudyTools"})})]}),r.jsxs("button",{onClick:()=>{ee("articles"),G("")},className:"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--bg-secondary)] border border-[var(--card-border)] hover:border-red-500/50 hover:bg-red-500/10 text-[var(--text-primary)] hover:text-red-500 transition-all duration-200 cursor-pointer shadow-sm group",title:"Sign Out to Lock Screen",children:[r.jsx(gh,{className:"w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"}),r.jsx("span",{children:"Sign Out"})]})]}),r.jsxs("div",{className:"relative w-full max-w-sm sm:mx-4",children:[r.jsx("span",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]",children:r.jsx(Fs,{className:"h-4 w-4"})}),r.jsx("input",{type:"text",placeholder:"Search school games...",value:H,onChange:S=>I(S.target.value),className:"w-full text-sm rounded-full py-2.5 pl-9 pr-4 border border-[var(--card-border)] bg-[var(--input-fill)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:opacity-50 transition-all duration-300 shadow-inner"})]}),r.jsxs("div",{className:"flex items-center gap-3 md:gap-4 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap",children:[r.jsxs("div",{className:"text-[11px] font-mono select-none opacity-80 pl-1",children:[r.jsx("span",{className:"text-xs opacity-50 block sm:inline mr-1",children:"made by"}),r.jsx("span",{className:"font-bold text-[var(--accent-color)] tracking-wider",children:"™ AND GRANDDIA2"})]}),r.jsx("div",{className:"flex items-center gap-2 border border-[var(--card-border)] bg-[var(--bg-secondary)] py-1 md:py-1.5 px-2.5 rounded-full shadow-sm",children:r.jsx("div",{onClick:()=>f(S=>S==="light"?"dark":"light"),className:"relative w-[50px] h-6 bg-[var(--input-fill)] border border-[var(--card-border)] rounded-full cursor-pointer flex items-center p-0.5 select-none transition-all duration-300",title:"Slide to change Mode (Light / Dark)",children:r.jsx("div",{className:`w-5 h-5 rounded-full bg-[var(--accent-color)] shadow-md transition-all duration-350 ease-out flex items-center justify-center text-[10px] transform ${T==="dark"?"translate-x-6":"translate-x-0"}`,children:T==="dark"?"🌙":"☀️"})})}),r.jsx("div",{className:"border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm",children:r.jsx("div",{className:"flex items-center gap-1.5",children:[{key:"cyborg",color:"bg-green-500 border-green-300 shadow-[0_0_5px_green]",tooltip:"Cyborg Theme"},{key:"violet",color:"bg-indigo-600 border-indigo-400",tooltip:"Violet Theme"},{key:"ice",color:"bg-sky-400 border-sky-300",tooltip:"Glacier Theme"},{key:"rose-pine",color:"bg-rose-300 border-rose-200",tooltip:"Rose Pine Theme"},{key:"none",color:"bg-gradient-to-br from-neutral-300 to-neutral-700 border-neutral-400",tooltip:"No Theme (Monochrome)"}].map(S=>r.jsx("button",{title:S.tooltip,onClick:()=>z(S.key),className:`w-3.5 h-3.5 rounded-full ${S.color} border transition-all duration-200 hover:scale-130 cursor-pointer ${h===S.key?"ring-2 ring-offset-2 ring-[var(--accent-color)]":"opacity-80"}`},S.key))})})]})]}),r.jsx("section",{className:"bg-[var(--bg-secondary)] border-b border-[var(--card-border)] py-3 px-4 md:px-6 transition-colors duration-300",children:r.jsx("div",{className:"max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3",children:r.jsxs("div",{className:"flex flex-wrap items-center gap-2 md:ml-auto w-full md:w-auto overflow-visible",children:[(C==="chat"||C==="movies")&&r.jsxs("button",{id:"chat-back-button",onClick:()=>q("all"),className:"flex items-center gap-1.5 text-xs font-mono font-bold py-1.5 px-3.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] active:scale-98",title:"Go back to games list","aria-label":"Back",children:[r.jsx(Ws,{className:"w-3.5 h-3.5 text-[var(--accent-color)]"}),r.jsx("span",{children:"Go back to games"})]}),r.jsxs("button",{onClick:()=>{q(C==="movies"?"all":"movies"),D(null)},className:`text-xs border py-1.5 px-3.5 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-98 ${C==="movies"?"bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-extrabold":"bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"}`,title:"Toggle Movies - Stream Movies and TV Shows",children:[r.jsx(Sb,{className:"w-3.5 h-3.5 text-[var(--accent-color)]"}),r.jsx("span",{children:"Movies"})]}),r.jsxs("button",{onClick:()=>{q(C==="chat"?"all":"chat"),D(null)},className:`text-xs border py-1.5 px-3.5 rounded-full font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-98 ${C==="chat"?"bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-extrabold":"bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"}`,title:"Toggle AI Socratic Tutor - Ask Study/Academic Questions",children:[r.jsx(ph,{className:"w-3.5 h-3.5 text-[var(--accent-color)]"}),r.jsx("span",{children:"GEMINI AI / GROQ AI"})]}),r.jsxs("div",{className:"flex items-center bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-2.5 py-1.5 text-xs text-[var(--text-muted)] font-mono shadow-sm",children:[r.jsx("span",{className:"text-[10px] uppercase font-extrabold mr-1.5 text-[var(--accent-color)]",children:"Tab Target:"}),r.jsxs("select",{value:Lt,onChange:S=>kr(S.target.value),className:"bg-transparent border-none outline-none font-bold text-[var(--text-primary)] cursor-pointer py-0.5",style:{colorScheme:T},children:[r.jsx("option",{value:"",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank (Default)"}),r.jsx("option",{value:"#1",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#1"}),r.jsx("option",{value:"#2",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#2"}),r.jsx("option",{value:"#3",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#3"}),r.jsx("option",{value:"#4",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#4"}),r.jsx("option",{value:"#5",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#5"}),r.jsx("option",{value:"#math",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#math"}),r.jsx("option",{value:"#science",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#science"}),r.jsx("option",{value:"#grades",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#grades"}),r.jsx("option",{value:"#classroom",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#classroom"}),r.jsx("option",{value:"#clever",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#clever"}),r.jsx("option",{value:"#campus",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#campus"}),r.jsx("option",{value:"#dashboard",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"about:blank#dashboard"})]})]}),r.jsxs("button",{onClick:()=>{const S="about:blank"+Lt,M=window.open(S,"_blank");if(!M){alert(`Popup blocked! Please allow popups to open the site in ${S}.`);return}const Z=new URLSearchParams(window.location.search);Z.set("decoyType",_);const x=`${window.location.origin}${window.location.pathname}?${Z.toString()}${window.location.hash}`,fe=`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h15M6 10h15"/></svg>')}`;let he="StudyTools",ce=fe;_==="classroom"?(he="Home - Classroom",ce="https://ssl.gstatic.com/classroom/favicon.png"):_==="clever"?(he="Clever | Log in with Clever",ce="https://www.google.com/s2/favicons?sz=64&domain=clever.com"):_==="campus"?(he="Campus Student",ce="https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png"):_==="docs"?(he="Google Docs",ce="https://www.google.com/s2/favicons?sz=64&domain=docs.google.com"):_==="gmail"&&(he="Inbox - Jersey City Public Schools",ce="https://www.google.com/s2/favicons?sz=64&domain=mail.google.com"),M.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>${he}</title>
                    <link rel="icon" type="image/png" href="${ce}">
                    <meta charset="utf-8">
                    <style>
                      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0c0a09; }
                      iframe { width: 100vw; height: 100vh; border: none; display: block; }
                    </style>
                  </head>
                  <body>
                    <iframe src="${x}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                  </body>
                  </html>
                `),M.document.close();try{Lt&&(M.location.hash=Lt)}catch{}},className:"text-xs bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--card-border)] py-1.5 px-3.5 rounded-full hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] active:scale-98 transition-all duration-200 font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm",title:"Open entire site inside about:blank tab with selected suffix to cloak history",children:[r.jsx(ln,{className:"w-3.5 h-3.5 text-[var(--accent-color)] animate-spin-slow"}),r.jsxs("span",{children:["CLOAK IN ",Lt?`ABOUT:BLANK ${Lt.toUpperCase()}`:"ABOUT:BLANK"]})]}),r.jsxs("div",{className:`flex items-center border rounded-full px-3 py-1.5 text-xs font-mono shadow-sm transition-all duration-300 ${_!=="none"?"bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)]":"bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)]"}`,children:[r.jsxs("span",{className:"text-[10px] uppercase font-extrabold mr-1.5 flex items-center gap-1",children:[r.jsx(Is,{className:"w-3.5 h-3.5 animate-pulse"}),r.jsx("span",{children:"Decoy:"})]}),r.jsxs("select",{value:_,onChange:S=>St(S.target.value),className:`bg-transparent border-none outline-none font-bold cursor-pointer py-0.5 ${_!=="none"?"text-[var(--accent-color)]":"text-[var(--text-primary)]"}`,style:{colorScheme:T},children:[r.jsx("option",{value:"none",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"Off (StudyTools)"}),r.jsx("option",{value:"classroom",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"Google Classroom"}),r.jsx("option",{value:"clever",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"Clever Login"}),r.jsx("option",{value:"campus",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"Infinite Campus"}),r.jsx("option",{value:"docs",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"Google Docs"}),r.jsx("option",{value:"gmail",style:{backgroundColor:"var(--card-bg)",color:"var(--text-primary)"},children:"Inbox - Jersey City Public Schools"})]})]})]})})}),r.jsx("div",{style:{display:"none"},children:r.jsx("button",{onClick:()=>{const S=window.open("about:blank","_blank");if(!S){alert("Popup blocked! Accessing classroom decoys requires popup permissions.");return}S.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Classwork - Algebra II</title>
                    <link rel="icon" type="image/png" href="https://ssl.gstatic.com/classroom/favicon.png">
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      * { box-sizing: border-box; margin: 0; padding: 0; }
                      html, body {
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background-color: #ffffff;
                        display: flex;
                        flex-direction: column;
                      }
                      
                      /* CLASSROOM HEADER */
                      .classroom-header {
                        height: 64px;
                        background-color: #ffffff;
                        border-bottom: 1px solid #e0e0e0;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 16px;
                        position: relative;
                        user-select: none;
                      }
                      
                      .header-left { display: flex; align-items: center; gap: 12px; }
                      
                      .menu-btn {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #5f6368;
                      }
                      .menu-btn:hover { background-color: rgba(95, 99, 104, 0.04); }
                      
                      .classroom-logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
                      .classroom-logo img { width: 24px; height: 24px; }
                      .classroom-logo span {
                        font-size: 22px;
                        color: #5f6368;
                        font-weight: 400;
                        font-family: Arial, sans-serif;
                      }
                      
                      .course-title-section {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-left: 8px;
                        border-left: 1px solid #dadce0;
                        padding-left: 16px;
                      }
                      
                      .course-title { font-size: 16px; color: #3c4043; font-weight: 500; }
                      .course-section { font-size: 12px; color: #5f6368; }
                      
                      /* TABS */
                      .header-middle {
                        display: flex;
                        align-items: center;
                        gap: 24px;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        height: 100%;
                      }
                      
                      .tab {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        padding: 0 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: #5f6368;
                        cursor: pointer;
                        border-bottom: 3px solid transparent;
                      }
                      .tab:hover { color: #137333; background-color: rgba(19, 115, 51, 0.04); }
                      .tab.active { color: #137333; border-bottom-color: #137333; }
                      
                      /* RIGHT SIDE */
                      .header-right { display: flex; align-items: center; gap: 8px; }
                      
                      .icon-btn {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #5f6368;
                      }
                      .icon-btn:hover { background-color: rgba(95, 99, 104, 0.04); }
                      
                      .avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background-color: #1a73e8;
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 500;
                        margin-left: 8px;
                        cursor: pointer;
                      }
                      
                      /* MAIN CONTENT */
                      .main-body {
                        flex: 1;
                        position: relative;
                        width: 100%;
                        height: calc(100vh - 64px);
                        background-color: #ffffff;
                      }
                      
                      iframe { width: 100%; height: 100%; border: none; display: block; }
                      
                      .decoy-content {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: #ffffff;
                        display: none;
                        padding: 32px;
                        overflow-y: auto;
                      }
                      
                      .decoy-active #game-iframe { display: none; }
                      .decoy-active .decoy-content { display: block; }
                    </style>
                  </head>
                  <body>
                    <!-- Header -->
                    <div class="classroom-header">
                      <div class="header-left">
                        <div class="menu-btn" id="menu-btn-click">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                          </svg>
                        </div>
                        <div class="classroom-logo" id="brand-logo-click">
                          <img src="https://ssl.gstatic.com/classroom/favicon.png" alt="Classroom Logo">
                          <span>Classroom</span>
                        </div>
                        <div class="course-title-section" id="course-banner-click" style="cursor: pointer;">
                          <div class="course-title">Algebra II</div>
                          <div class="course-section">&nbsp;- Honors Period 3</div>
                        </div>
                      </div>
                      
                      <div class="header-middle">
                        <div class="tab">Stream</div>
                        <div class="tab active">Classwork</div>
                        <div class="tab">People</div>
                        <div class="tab">Grades</div>
                      </div>
                      
                      <div class="header-right">
                        <div class="icon-btn">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M20 18H4v-7h16v7zm1-9h-3V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3H3c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h18c1.1 0-2-.9-2-2v-9c0-1.1-.9-2-2-2zm-3-3v3H8V6h10z"/>
                          </svg>
                        </div>
                        <div class="icon-btn">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                          </svg>
                        </div>
                        <div class="icon-btn" style="margin-right: 4px;">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </div>
                        <div class="avatar">S</div>
                      </div>
                    </div>
                    
                    <!-- Main Body Area -->
                    <div class="main-body" id="main-body">
                      <iframe id="game-iframe" src="${window.location.origin}${window.location.pathname}${window.location.search}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                      
                      <!-- Decoy Homework Board -->
                      <div class="decoy-content">
                        <div style="background-color: #137333; color: white; padding: 24px 32px; border-radius: 8px; margin-bottom: 24px; text-align: left;">
                          <h1 style="font-size: 26px; font-weight: 400; margin-bottom: 6px; font-family: Roboto, Arial, sans-serif;">Algebra II - Period 3 Homework & Resource Portal</h1>
                          <p style="font-size: 14px; opacity: 0.9; font-family: Roboto, Arial, sans-serif;">Honors Mathematics Course Resources</p>
                        </div>

                        <div style="display: flex; gap: 24px; text-align: left; font-family: Roboto, Arial, sans-serif; flex-wrap: wrap;">
                          <div style="flex: 2; min-width: 300px;">
                            <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #dadce0; padding-bottom: 16px; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
                                <div>
                                  <h2 style="font-size: 20px; font-weight: 500; color: #1967d2; margin-bottom: 4px;">Interactive Graphing Lab & Exercises</h2>
                                  <p style="font-size: 12px; color: #5f6368;">Teacher: Mrs. Katherine Vance &bull; Assigned: Jun 4</p>
                                </div>
                                <div style="text-align: right; min-width: 120px;">
                                  <p style="font-size: 14px; font-weight: 500; color: #3c4043;">100 points</p>
                                  <p style="font-size: 12px; color: #c5221f; font-weight: 500;">Due Tomorrow, 11:59 PM</p>
                                </div>
                              </div>

                              <p style="font-size: 14px; color: #3c4043; line-height: 1.6; margin-bottom: 16px;">
                                Use the web interactive math sandbox or scientific plotter loaded below to map standard polynomial structures and quadratic graphs. Note the curves, intersections, and coordinates. Fill in the homework matrix PDF when complete.
                              </p>
                              
                              <div style="border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; height: 400px; margin-top: 16px; background-color: #f1f3f4;">
                                <iframe src="https://www.desmos.com/calculator" style="width:100%; height:100%; border:0;" referrerpolicy="no-referrer"></iframe>
                              </div>
                            </div>
                          </div>

                          <div style="flex: 1; min-width: 240px; max-width: 300px;">
                            <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                              <h3 style="font-size: 16px; font-weight: 500; color: #3c4043; margin-bottom: 16px;">Your work</h3>
                              <div style="border: 1px dashed #dadce0; border-radius: 4px; padding: 24px; text-align: center; margin-bottom: 16px; font-size: 12px; color: #5f6368;">
                                No files attached
                              </div>
                              <button style="width: 100%; background: #1a73e8; color: white; border: none; border-radius: 4px; padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 8px;">
                                + Add or create
                              </button>
                              <button style="width: 100%; background: transparent; border: 1px solid #dadce0; color: #1a73e8; border-radius: 4px; padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer;">
                                Mark as done
                              </button>
                            </div>

                            <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 16px;">
                              <h3 style="font-size: 14px; font-weight: 500; color: #3c4043; margin-bottom: 8px;">Private comments</h3>
                              <p style="font-size: 12px; color: #5f6368; margin-bottom: 8px;">Send a private comment to Mrs. Vance</p>
                              <input placeholder="Add private comment..." style="width:100%; border: 1px solid #dadce0; padding: 8px 12px; font-size: 12px; border-radius: 4px; outline: none; box-sizing: border-box;" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <script>
                      var isDecoy = false;
                      function togglePanic() {
                        isDecoy = !isDecoy;
                        if (isDecoy) {
                          document.getElementById('main-body').classList.add('decoy-active');
                        } else {
                          document.getElementById('main-body').classList.remove('decoy-active');
                        }
                      }
                      
                      // Esc key triggers emergency switch to real study material
                      window.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape' || e.key === '\\x60') {
                          togglePanic();
                        }
                      });
                      
                      // Clicking on banner/logo acts as interactive quick toggle
                      document.getElementById('course-banner-click').addEventListener('click', togglePanic);
                      document.getElementById('brand-logo-click').addEventListener('click', togglePanic);
                      document.getElementById('menu-btn-click').addEventListener('click', togglePanic);
                    <\/script>
                  </body>
                  </html>
                `),S.document.close()},className:"hidden",children:r.jsx("span",{children:"HIDDEN LEGACY BUTTON"})})}),r.jsxs("div",{className:`flex-1 flex flex-col md:flex-row w-full mx-auto transition-all duration-300 ${C==="chat"||C==="movies"?"max-w-none p-0 gap-0 border-t border-[var(--card-border)]/50 lg:bg-[#07090e]":"max-w-8xl p-4 md:p-6 gap-6 self-center"}`,children:[C!=="chat"&&C!=="movies"&&r.jsxs("aside",{className:`transition-all duration-300 ease-in-out shrink-0 flex flex-col gap-2 overflow-hidden ${E?"w-full md:w-64":"w-full md:w-14"}`,children:[r.jsxs("div",{className:"flex items-center justify-between px-2 py-1 min-h-[36px]",children:[E?r.jsx("span",{className:"text-[10px] font-mono tracking-wider opacity-50 uppercase whitespace-nowrap",children:"Browse Portals"}):r.jsx("span",{className:"hidden md:inline text-[9px] font-mono tracking-wider opacity-50 uppercase text-center mx-auto font-bold text-[var(--accent-color)]",children:"NAV"}),r.jsx("button",{onClick:()=>A(!E),className:"p-1.5 rounded-lg hover:bg-[var(--card-bg)] text-[var(--accent-color)] transition-all duration-250 cursor-pointer flex items-center justify-center ml-auto",title:E?"Collapse sidebar":"Expand sidebar",children:E?r.jsx(Nh,{className:"w-4 h-4"}):r.jsx(jr,{className:"w-4 h-4 animate-bounce"})})]}),r.jsxs("button",{onClick:()=>{q("all"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="all"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(vr,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"All Classrooms"})]}),r.jsxs("button",{onClick:()=>{q("single"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="single"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(nn,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Single Player"})]}),r.jsxs("button",{onClick:()=>{q("multiplayer"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="multiplayer"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(vh,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Multiplayer"})]}),r.jsxs("button",{onClick:()=>{q("Shooter"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="Shooter"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(ln,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Shooter"})]}),r.jsxs("button",{onClick:()=>{q("Party"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="Party"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(ln,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Party"})]}),r.jsxs("button",{onClick:()=>{q("Sports"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="Sports"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(ln,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Sports"})]}),r.jsxs("button",{onClick:()=>{q("Random"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="Random"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(gb,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Random Games"})]}),r.jsxs("button",{onClick:()=>{q("Emulated"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="Emulated"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(Bp,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Emulated"})]}),r.jsxs("button",{onClick:()=>{q("minecraft"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="minecraft"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(kp,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Minecraft"})]}),r.jsxs("button",{onClick:()=>{q("Not Games"),D(null)},className:`w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 cursor-pointer ${C==="Not Games"&&!K?"bg-[var(--accent-color)] text-[var(--bg-color)] shadow-[0_4px_12px_var(--accent-shadow)] font-bold":"hover:bg-[var(--card-bg)] text-[var(--text-primary)] opacity-80"}`,children:[r.jsx(ln,{className:"w-4.5 h-4.5 shrink-0"}),r.jsx("span",{className:`transition-all duration-300 ${E?"opacity-100 translate-x-0":"opacity-0 pointer-events-none md:hidden"}`,children:"Other Websites"})]})]}),r.jsx("main",{className:"flex-1 min-w-0",children:K?K.title==="Bloons TD 5 Sandbox"?r.jsxs("div",{className:"flex flex-col gap-4 animate-fade-in bg-[#0c0f16]/90 p-4 md:p-6 rounded-2xl border border-zinc-800 shadow-2xl",children:[r.jsx("div",{className:"flex justify-start",children:r.jsxs("button",{onClick:()=>D(null),className:"flex items-center gap-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all font-mono py-1.5 px-3.5 rounded-lg text-xs font-bold bg-[var(--bg-secondary)] leading-normal cursor-pointer",children:[r.jsx(Ws,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"Go back to game grid"})]})}),r.jsx(BloonsSandbox,{onClose:()=>D(null)})]}):r.jsxs("div",{className:"flex flex-col gap-4 animate-fade-in",children:[r.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between border border-[var(--card-border)] bg-[var(--bg-secondary)] rounded-xl py-3 px-4 gap-3 shadow-inner",children:[r.jsxs("button",{onClick:()=>D(null),className:"flex items-center gap-2 border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all font-mono py-1.5 px-3.5 rounded-lg text-xs font-bold leading-normal cursor-pointer",children:[r.jsx(Ws,{className:"w-3.5 h-3.5"}),r.jsx("span",{children:"Go back"})]}),r.jsx("div",{className:"flex items-center gap-2.5",children:r.jsxs("span",{className:"font-bold text-sm text-[var(--text-primary)] flex items-center gap-2",children:[K.title,r.jsx("span",{className:"text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border border-[var(--card-border)] bg-[var(--bg-color)] text-[var(--accent-color)]",children:K.category})]})}),r.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[r.jsxs("div",{className:"flex items-center bg-[var(--bg-color)] border border-[var(--card-border)] rounded-lg overflow-hidden p-0.5",children:[r.jsx("button",{onClick:()=>ne(S=>Math.max(.4,S-.1)),className:"p-1 px-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors",title:"Zoom Out",children:r.jsx(nb,{className:"w-3.5 h-3.5"})}),r.jsxs("span",{className:"text-[10px] px-2 font-mono text-[var(--text-primary)] font-bold select-none",children:[Math.round(P*100),"%"]}),r.jsx("button",{onClick:()=>ne(S=>Math.min(1.8,S+.1)),className:"p-1 px-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] rounded transition-colors",title:"Zoom In",children:r.jsx(Fa,{className:"w-3.5 h-3.5"})}),r.jsx("button",{onClick:()=>ne(1),className:"p-1 px-1.5 text-xs text-[var(--accent-color)] font-mono hover:bg-[var(--card-bg)] rounded transition-colors",title:"Reset Zoom",children:"Res"})]}),r.jsx("button",{onClick:()=>{const S=document.getElementById("game-frame");S&&(S.src=S.src)},className:"p-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] rounded-lg text-[var(--text-primary)] transition-all cursor-pointer",title:"Reload game frame session",children:r.jsx(tc,{className:"w-3.5 h-3.5"})}),r.jsxs("button",{onClick:()=>{const S=document.getElementById("frame-viewport");S&&(document.fullscreenElement?document.exitFullscreen():S.requestFullscreen())},className:"flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer",title:"Toggle Fullscreen Arena",children:[r.jsx(tb,{className:"w-3.5 h-3.5"}),r.jsx("span",{className:"hidden sm:inline text-[10px] font-bold",children:"FULLSCREEN"})]}),r.jsxs("button",{onClick:()=>{const S=window.open("about:blank","_blank");if(!S){alert("Popup blocked. Allow popups for this site.");return}const M=`data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h15M6 10h15"/></svg>')}`;let Z=K.title,x=M;_==="classroom"?(Z="Home - Classroom",x="https://ssl.gstatic.com/classroom/favicon.png"):_==="clever"?(Z="Clever | Log in with Clever",x="https://www.google.com/s2/favicons?sz=64&domain=clever.com"):_==="campus"?(Z="Campus Student",x="https://jerseycitynj.infinitecampus.org/campus/favicon-32x32.png"):_==="docs"?(Z="Google Docs",x="https://www.google.com/s2/favicons?sz=64&domain=docs.google.com"):_==="gmail"&&(Z="Inbox - Jersey City Public Schools",x="https://www.google.com/s2/favicons?sz=64&domain=mail.google.com"),S.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>${Z}</title>
                          <link rel="icon" href="${x}">
                          <link rel="shortcut icon" href="${x}">
                          <meta charset="utf-8">
                          <style>
                            html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #ffffff; }
                            iframe { width: 100vw; height: 100vh; border: none; display: block; }
                          </style>
                        </head>
                        <body>
                          <iframe src="${K.url}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
                        </body>
                        </html>
                      `),S.document.close()},className:"flex items-center gap-1.5 border border-[var(--card-border)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] py-1.5 px-3 rounded-lg text-xs font-mono text-[var(--text-primary)] font-medium transition-all cursor-pointer",title:"Open Game in New Tab",children:[r.jsx(Hp,{className:"w-3.5 h-3.5"}),r.jsx("span",{className:"hidden sm:inline text-[10px] font-bold",children:"OPEN IN NEW TAB"})]}),r.jsxs("button",{onClick:()=>{ee("articles"),D(null)},className:"flex items-center gap-1.5 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 py-1.5 px-3 rounded-lg text-xs font-mono text-red-500 font-medium transition-all cursor-pointer whitespace-nowrap",title:"Panic escape key (or press [ or ] at any time)",children:[r.jsx(hb,{className:"w-3.5 h-3.5 text-red-500 animate-pulse"}),r.jsx("span",{className:"hidden sm:inline text-[10px] font-bold",children:"PANIC ESCAPE ([ or ])"})]})]})]}),r.jsx("div",{id:"frame-viewport",className:"w-full h-[65vh] min-h-[420px] rounded-2xl border border-[var(--card-border)] bg-black overflow-hidden relative shadow-lg",children:r.jsx("div",{className:"w-full h-full duration-150 transition-transform origin-top-left",style:{transform:`scale(${P})`,width:`${100/P}%`,height:`${100/P}%`},children:r.jsx("iframe",{id:"game-frame",src:K.url,className:"w-full h-full border-none",title:K.title,allowFullScreen:!0,referrerPolicy:"no-referrer",sandbox:"allow-scripts allow-same-origin allow-popups allow-forms"})})})]}):C==="chat"?r.jsx("div",{className:"flex flex-col w-full h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] min-h-[550px] animate-fade-in bg-[var(--bg-secondary)]",children:r.jsx(Tb,{onClose:()=>q("all")})}):C==="movies"?r.jsx("div",{className:"flex flex-col w-full h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] min-h-[550px] animate-fade-in bg-[var(--bg-secondary)]",children:r.jsx(Cb,{onClose:()=>q("all")})}):r.jsxs("div",{className:"flex flex-col gap-6",children:[r.jsx("div",{className:"flex justify-between items-center border-l-4 border-[var(--accent-color)] pl-3",children:r.jsxs("div",{children:[r.jsxs("h2",{className:"text-lg font-black uppercase tracking-wider text-[var(--text-primary)]",children:[C==="all"&&"Games Library",C==="favorites"&&"Bookmarked Games",C==="single"&&"Singleplayer Arcades",C==="multiplayer"&&"Multiplayer Hub",C==="Shooter"&&"Shooter Games",C==="Party"&&"Party Games",C==="Sports"&&"Sports Games",C==="Random"&&"Random Games",C==="Emulated"&&"Emulated Archives",C==="minecraft"&&"Minecraft Platform",C==="Not Games"&&"Not Games"]}),r.jsxs("p",{className:"text-xs text-[var(--text-muted)] mt-0.5",children:["Showing ",cn.length," unblocked resources"]})]})}),cn.length===0?r.jsxs("div",{className:"flex flex-col items-center justify-center py-20 border border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--bg-secondary)]",children:[r.jsx(nn,{className:"w-16 h-16 text-[var(--text-muted)] stroke-1 opacity-40 animate-pulse"}),r.jsx("p",{className:"text-sm font-semibold mt-4 text-[var(--text-primary)]",children:"No games found matches filter"}),r.jsx("p",{className:"text-xs text-[var(--text-muted)] mt-1",children:"Try searching a different keyword or resetting filters."})]}):r.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",children:cn.map(S=>{const M=Ce.includes(S.id);return r.jsxs("div",{onClick:()=>{D(S),ne(1)},className:"custom-card flex flex-col rounded-xl overflow-hidden cursor-pointer h-[360px]",style:{contentVisibility:"auto"},children:[r.jsxs("div",{className:"relative h-48 bg-neutral-950 flex-shrink-0 flex items-center justify-center border-b border-[var(--card-border)] overflow-hidden",children:[S.thumbnail&&!He[S.id]?r.jsx("img",{src:S.thumbnail,alt:S.title,referrerPolicy:"no-referrer",onError:()=>Ae(Z=>({...Z,[S.id]:!0})),className:"w-full h-full object-cover transition-transform duration-500 hover:scale-110"}):Nr(S),r.jsx("span",{className:"absolute top-2.5 right-2.5 text-[8px] font-bold uppercase tracking-widest bg-black/75 backdrop-blur-sm text-white border border-white/10 px-2.5 py-0.5 rounded-full inline-block z-10",children:S.category}),r.jsx("button",{onClick:Z=>sn(Z,S.id),className:"absolute top-2.5 left-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/80 text-white/90 border border-white/10 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200",title:M?"Remove Bookmark":"Add Bookmark",children:r.jsx(Jp,{className:`w-3.5 h-3.5 ${M?"fill-rose-500 text-rose-500":""}`})})]}),r.jsxs("div",{className:"p-4 flex-1 flex flex-col justify-between",children:[r.jsxs("div",{className:"space-y-1.5",children:[r.jsx("h3",{className:"text-sm font-black text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-color)] leading-snug",children:S.title}),r.jsx("p",{className:"text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed",children:S.description})]}),r.jsxs("button",{onClick:()=>{D(S),ne(1)},className:"w-full mt-3 border border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black hover:font-bold hover:shadow-[0_0_12px_calc(var(--accent-color))] text-[11px] font-semibold tracking-wider text-[var(--accent-color)] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 self-end",children:[r.jsx(bh,{className:"w-3 h-3 fill-current"}),r.jsx("span",{children:"Open Article"})]})]})]},S.id)})})]})})]})]})}op.createRoot(document.getElementById("root")).render(r.jsx(U.StrictMode,{children:r.jsx(Mb,{})}));const zb={apiKey:"AIzaSyA_qbIeZ5rwP-8J5cMUYVlmtGdpwU7fr7Y",authDomain:"chat-f9251.firebaseapp.com",databaseURL:"https://chat-f9251-default-rtdb.firebaseio.com",projectId:"chat-f9251",storageBucket:"chat-f9251.firebasestorage.app",messagingSenderId:"143049478376",appId:"1:143049478376:web:10dd8fe116c3b9e473b95d",measurementId:"G-57D0W1FZ87"},Db=$f().length?$f()[0]:Jg(zb),Rb=_g(Db),Eh=Zg(Rb,"messages"),Ob=document.getElementById("pcw-root"),qb=document.getElementById("pcw-toggle"),Sr=document.getElementById("pcw-badge"),rn=document.getElementById("pcw-messages"),Ps=document.getElementById("pcw-empty"),It=document.getElementById("pcw-name"),Ub=document.getElementById("pcw-name-hint"),bl=document.getElementById("pcw-compose"),yl=document.getElementById("pcw-text"),Lb=document.getElementById("pcw-send"),$s=document.getElementById("pcw-toast");let ai=!1,xr=0,wh=null,Sh=null,Mh=!0;function Ar(){return It.value.trim().length>0}function zh(){const h=!Ar();bl.classList.toggle("locked",h),Ub.classList.toggle("visible",h),yl.disabled=h}const jh=localStorage.getItem("chat_name");jh&&(It.value=jh);zh();It.addEventListener("input",zh);It.addEventListener("keydown",h=>{h.key==="Enter"&&Ar()&&yl.focus()});bl.addEventListener("click",()=>{Ar()||(bl.classList.remove("shake"),bl.offsetWidth,bl.classList.add("shake"),bl.addEventListener("animationend",()=>bl.classList.remove("shake"),{once:!0}),It.classList.remove("needs-name"),It.offsetWidth,It.classList.add("needs-name"),It.addEventListener("animationend",()=>It.classList.remove("needs-name"),{once:!0}),It.focus())});const Bb=`abbo
abo
abortion
abuse
addict
addicts
adult
africa
african
alla
allah
alligatorbait
amateur
anal
analannie
analsex
angie
anus
arab
arabs
areola
argie
aroused
arse
arsehole
asian
ass
assassin
assassinate
assassination
assault
assbagger
assblaster
assclown
asscowboy
asses
assfuck
assfucker
asshat
asshole
assholes
asshore
assjockey
asskiss
asskisser
assklown
asslick
asslicker
asslover
assman
assmonkey
assmunch
assmuncher
asspacker
asspirate
asspuppies
assranger
asswhore
asswipe
athletesfoot
attack
australian
babe
babies
backdoor
backdoorman
backseat
badfuck
balllicker
balls
ballsack
banging
baptist
barelylegal
barf
barface
barfface
bast
bastard
bazongas
bazooms
beaner
pipe
tip
orgies
bum
fk
gooned
goon
beast
beastality
beastial
beastiality
beatoff
beat-off
beatyourmeat
beaver
bestial
bestiality
bi
biatch
bible
bicurious
bigass
bigbastard
bigbutt
bigger
bisexual
bi-sexual
bitch
bitcher
bitches
bitchez
bitchin
bitching
bitchslap
bitchy
biteme
black
blackman
blackout
blacks
blind
blow
blowjob
boang
bogan
bohunk
bollick
bollock
bomb
bombers
bombing
bombs
bomd
bondage
boner
bong
boob
boobies
boobs
booby
boody
boom
boong
boonga
boonie
booty
bootycall
bountybar
bra
brea5t
breast
breastjob
breastlover
breastman
brothel
bugger
buggered
buggery
bullcrap
bulldike
bulldyke
bullshit
bumblefuck
bumfuck
bunga
bunghole
buried
burn
butchbabes
butchdike
butchdyke
butt
buttbang
butt-bang
buttface
buttfuck
butt-fuck
buttfucker
butt-fucker
buttfuckers
butt-fuckers
butthead
buttman
buttmunch
buttmuncher
buttpirate
inside
creampie
caked
cream
buttplug
buttstain
byatch
cacker
cameljockey
cameltoe
canadian
cancer
carpetmuncher
carruth
catholic
catholics
cemetery
chav
cherrypopper
chickslick
children's
chin
chinaman
chinamen
chinese
chink
chinky
choad
chode
christ
christian
church
cigarette
cigs
clamdigger
clamdiver
clit
clitoris
clogwog
cocaine
cock
cockblock
cockblocker
cockcowboy
cockfight
cockhead
cockknob
cocklicker
cocklover
cocknob
cockqueen
cockrider
cocksman
cocksmith
cocksmoker
cocksucer
cocksuck
cocksucked
cocksucker
cocksucking
cocktail
cocktease
cocky
cohee
coitus
color
colored
coloured
commie
communist
condom
conservative
conspiracy
coolie
cooly
coon
coondog
copulate
cornhole
corruption
cra5h
crabs
crack
crackpipe
crackwhore
crack-whore
crap
crapola
crapper
crappy
crash
creamy
crime
crimes
criminal
criminals
crotch
crotchjockey
crotchmonkey
crotchrot
cum
cumbubble
cumfest
cumjockey
cumm
cummer
cumming
cumquat
cumqueen
cumshot
cunilingus
cunillingus
cunn
cunnilingus
cunntt
cunt
cunteyed
cuntfuck
cuntfucker
cuntlick
cuntlicker
cuntlicking
cuntsucker
cybersex
cyberslimer
dago
dahmer
dammit
damn
damnation
damnit
darkie
darky
datnigga
dead
deapthroat
death
deepthroat
defecate
dego
demon
deposit
desire
destroy
deth
devil
devilworshipper
dick
dickbrain
dickforbrains
dickhead
dickless
dicklick
dicklicker
dickman
dickwad
dickweed
diddle
die
died
dies
dike
dildo
dingleberry
dink
dipshit
dipstick
dirty
disease
diseases
disturbed
dive
dix
dixiedike
dixiedyke
doggiestyle
doggystyle
dong
doodoo
doo-doo
doom
dope
dragqueen
dragqween
dripdick
drug
drunk
drunken
dumb
dumbass
dumbbitch
dumbfuck
dyefly
dyke
easyslut
eatballs
eatme
eatpussy
ecstacy
ejaculate
ejaculated
ejaculating
ejaculation
enema
enemy
erect
erection
ero
escort
ethiopian
ethnic
european
evl
excrement
execute
executed
execution
executioner
explosion
facefucker
faeces
fag
fagging
faggot
fagot
failed
failure
fairies
fairy
faith
fannyfucker
fart
farted
farting
farty
fastfuck
fat
fatah
fatass
fatfuck
fatfucker
fatso
fckcum
fear
feces
felatio
felch
felcher
felching
fellatio
feltch
feltcher
feltching
fetish
fight
filipina
filipino
fingerfood
fingerfuck
fingerfucked
fingerfucker
fingerfuckers
fingerfucking
fire
firing
fister
fistfuck
fistfucked
fistfucker
fistfucking
fisting
flange
flasher
flatulence
floo
flydie
flydye
fok
fondle
footaction
footfuck
footfucker
footlicker
footstar
fore
foreskin
forni
fornicate
foursome
fourtwenty
fraud
freakfuck
freakyfucker
freefuck
fu
fubar
fuc
fucck
fuck
fucka
fuckable
fuckbag
fuckbuddy
fucked
fuckedup
fucker
fuckers
fuckface
fuckfest
fuckfreak
fuckfriend
fuckhead
fuckher
fuckin
fuckina
fucking
fuckingbitch
fuckinnuts
fuckinright
fuckit
fuckknob
fuckme
fuckmehard
fuckmonkey
fuckoff
fuckpig
fucks
fucktard
fuckwhore
fuckyou
fudgepacker
fugly
fuk
fuks
funeral
funfuck
fungus
fuuck
gangbang
gangbanged
gangbanger
gangsta
gatorbait
gay
gaymuthafuckinwhore
gaysex
geez
geezer
geni
genital
german
getiton
gin
ginzo
gipp
girls
givehead
glazeddonut
gob
god
godammit
goddamit
goddammit
goddamn
goddamned
goddamnes
goddamnit
goddamnmuthafucker
goldenshower
gonorrehea
gonzagas
gook
gotohell
goy
goyim
greaseball
gringo
groe
gross
grostulation
gubba
gummer
gun
gyp
gypo
gypp
gyppie
gyppo
gyppy
hamas
handjob
hapa
harder
hardon
harem
headfuck
headlights
hebe
heeb
henhouse
heroin
herpes
heterosexual
hijack
hijacker
hijacking
hillbillies
hindoo
hiscock
hitler
hitlerism
hitlerist
hiv
ho
hobo
hodgie
hoes
hole
holestuffer
homicide
homo
homobangers
homosexual
honger
honk
honkers
honkey
honky
hook
hooker
hookers
hooters
hore
hork
horn
horney
horniest
horny
horseshit
hosejob
hoser
hostage
hotdamn
hotpussy
hottotrot
hummer
husky
hussy
hustler
hymen
hymie
iblowu
idiot
ikey
illegal
incest
insest
intercourse
interracial
intheass
inthebuff
israel
israeli
israel's
italiano
itch
jackass
jackoff
jackshit
jacktheripper
jade
jap
japanese
japcrap
jebus
jeez
jerkoff
jesus
jesuschrist
jew
jewish
jiga
jigaboo
jigg
jigga
jiggabo
jigger
jiggy
jihad
jijjiboo
jimfish
jism
jiz
jizim
jizjuice
jizm
jizz
jizzim
jizzum
joint
juggalo
jugs
junglebunny
kaffer
mad
mafia
magicwand
mams
manhater
manpaste
marijuana
mastabate
mastabater
masterbate
masterblaster
mastrabator
masturbate
masturbating
mattressprincess
meatbeatter
meatrack
meth
mexican
mgger
mggor
mickeyfinn
mideast
milf
minority
mockey
mockie
mocky
mofo
moky
moles
molest
molestation
molester
molestor
moneyshot
mooncricket
mormon
moron
moslem
mosshead
mothafuck
mothafucka
mothafuckaz
mothafucked
mothafucker
mothafuckin
mothafucking
motherfuck
motherfucked
motherfucker
motherfuckin
motherfucking
motherfuckings
motherlovebone
muff
muffdive
muffdiver
muffindiver
mufflikcer
mulatto
muncher
munt
murder
murderer
muslim
naked
narcotic
nasty
nastybitch
nastyho
nastyslut
nastywhore
nazi
necro
negro
negroes
negroid
negro's
nig
niger
nigerian
nigerians
nigg
nigga
niggah
niggaracci
niggard
niggarded
niggarding
niggardliness
niggardliness's
niggardly
niggards
niggard's
niggaz
nigger
niggerhead
niggerhole
niggers
nigger's
niggle
niggled
niggles
niggling
nigglings
niggor
niggur
niglet
nignog
nigr
nigra
nigre
nip
nipple
nipplering
nittit
nlgger
nlggor
nofuckingway
nook
nookey
nookie
noonan
nooner
nude
nudger
nuke
nutfucker
nymph
ontherag
oral
orga
orgasim
orgasm
orgies
orgy
osama
paki
palesimian
palestinian
pansies
pansy
panti
panties
payo
pearlnecklace
peck
pecker
peckerwood
pee
peehole
pee-pee
peepshow
peepshpw
pendy
penetration
peni5
penile
penis
penises
penthouse
period
perv
phonesex
phuk
phuked
phuking
phukked
phukking
phungky
phuq
pi55
picaninny
piccaninny
pickaninny
piker
pikey
piky
pimp
pimped
pimper
pimpjuic
pimpjuice
pimpsimp
pindick
piss
pissed
pisser
pisses
pisshead
pissin
pissing
pissoff
pistol
pixie
pixy
playboy
playgirl
pocha
pocho
pocketpool
pohm
polack
pom
pommie
pommy
poo
poon
poontang
poop
pooper
pooperscooper
pooping
poorwhitetrash
popimp
porchmonkey
porn
pornflick
pornking
porno
pornography
pornprincess
pot
poverty
premature
pric
prick
prickhead
primetime
propaganda
pros
prostitute
protestant
pu55i
pu55y
pube
pubic
pubiclice
pud
pudboy
pudd
puddboy
puke
puntang
purinapricness
puss
pussie
pussies
pussy
pussycat
pussyeater
pussyfucker
pussylicker
pussylips
pussylover
pussypounder
pusy
quashie
queef
queer
quickie
quim
ra8s
rabbi
racial
racist
radical
radicals
raghead
randy
rape
raped
raper
rapist
rearend
rearentry
rectum
redlight
redneck
reefer
reestie
refugee
reject
remains
rentafuck
republican
rere
retard
retarded
ribbed
rigger
rimjob
rimming
roach
robber
roundeye
rump
russki
russkie
sadis
sadom
samckdaddy
sandm
sandnigger
satan
scag
scallywag
scat
schlong
screw
screwyou
scrotum
scum
semen
seppo
servant
sex
sexed
sexfarm
sexhound
sexhouse
sexing
sexkitten
sexpot
sexslave
sextogo
sextoy
sextoys
sexual
sexually
sexwhore
sexy
sexymoma
sexy-slim
shag
shaggin
shagging
shat
shav
shawtypimp
sheeney
shhit
shinola
shit
shitcan
shitdick
shite
shiteater
shited
shitface
shitfaced
shitfit
shitforbrains
shitfuck
shitfucker
shitfull
shithapens
shithappens
shithead
shithouse
shiting
shitlist
shitola
shitoutofluck
shits
shitstain
shitted
shitter
shitting
shitty
shoot
shooting
shortfuck
showtime
sick
sissy
sixsixsix
sixtynine
sixtyniner
skank
skankbitch
skankfuck
skankwhore
skanky
skankybitch
skankywhore
skinflute
skum
skumbag
slant
slanteye
slapper
slaughter
slav
slave
slavedriver
sleezebag
sleezeball
slideitin
slime
slimeball
slimebucket
slopehead
slopey
slopy
slut
sluts
slutt
slutting
slutty
slutwear
slutwhore
smack
smackthemonkey
smut
snatch
snatchpatch
snigger
sniggered
sniggering
sniggers
snigger's
sniper
snot
snowback
snownigger
sob
sodom
sodomise
sodomite
sodomize
sodomy
sonofabitch
sonofbitch
sooty
sos
soviet
spaghettibender
spaghettinigger
spank
spankthemonkey
sperm
spermacide
spermbag
spermhearder
spermherder
spic
spick
spig
spigotty
spik
spit
spitter
splittail
spooge
spreadeagle
spunk
spunky
squaw
stagg
stiffy
strapon
stringer
stripclub
stroke
stroking
stupid
stupidfuck
stupidfucker
suck
suckdick
sucker
suckme
suckmyass
suckmydick
suckmytit
suckoff
suicide
swallow
swallower
swalow
swastika
sweetness
syphilis
taboo
taff
tampon
tang
tantra
tarbaby
tard
teat
terror
terrorist
teste
testicle
testicles
thicklips
thirdeye
thirdleg
threesome
threeway
timbernigger
tinkle
tit
titbitnipply
titfuck
titfucker
titfuckin
titjob
titlicker
titlover
tits
tittie
titties
titty
tnt
toilet
tongethruster
tongue
tonguethrust
tonguetramp
tortur
torture
tosser
towelhead
trailertrash
tramp
trannie
tranny
transexual
transsexual
transvestite
triplex
trisexual
trojan
trots
tuckahoe
tunneloflove
turd
turnon
twink
twinkie
twobitwhore
uck
uk
unfuckable
upskirt
uptheass
upthebutt
urinary
urinate
urine
usama
uterus
vagina
vaginal
vatican
vibr
vibrater
vibrator
vietcong
violence
virgin
virginbreaker
vomit
vulva
wab
wank
wanker
wanking
waysted
weapon
weenie
weewee
welcher
welfare
wetb
wetback
wetspot
whacker
whash
whigger
whiskey
whiskeydick
whiskydick
whit
whitenigger
whites
whitetrash
whitey
whiz
whop
whore
whorefucker
whorehouse
wigger
willie
williewanker
willy
wn
wog
women's
wop
wtf
wuss
wuzzie
xtc
xxx
yankee
yellowman
zigabo
zipperhead`,Gb=["fuck","shit","ass","bitch","bastard","crap","piss","dick","cock","pussy","cunt","whore","slut","fag","nigga","nigger","kike","spic","wetback","cracker","dyke","tranny","rape","molest","pedo","kill yourself"].concat(Bb.split(/\s+/).map(h=>h.trim()).filter(Boolean)),Hb=h=>Gb.some(z=>h.toLowerCase().includes(z));qb.addEventListener("click",()=>{ai=!ai,Ob.classList.toggle("open",ai),ai&&(xr=0,Sr.textContent="",Sr.classList.remove("show"),setTimeout(()=>{rn.scrollTop=rn.scrollHeight,Ar()?yl.focus():It.focus()},50))});function Qb(h){return new Date(h).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Kb(h){const z=new Date(h),T=new Date;if(z.toDateString()===T.toDateString())return"today";const f=new Date(T);return f.setDate(T.getDate()-1),z.toDateString()===f.toDateString()?"yesterday":z.toLocaleDateString([],{month:"short",day:"numeric"})}function Ah(h){return h.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Vb(h){let z=0;for(let T=0;T<h.length;T++)z=z*31+h.charCodeAt(T)&65535;return[160,180,200,260,290,320,340][z%7]}function Yb(h){$s.textContent=h,$s.classList.add("show"),clearTimeout(Sh),Sh=setTimeout(()=>$s.classList.remove("show"),2400)}function Jb({name:h,text:z,timestamp:T}){Ps&&Ps.parentNode&&Ps.remove();const f=T||Date.now(),C=Kb(f);if(C!==wh){wh=C;const H=document.createElement("div");H.className="pcw-divider",H.innerHTML=`<span>${C}</span>`,rn.appendChild(H)}const q=document.createElement("div");q.className="pcw-msg-row",q.innerHTML=`
      <div class="pcw-meta">
        <span class="pcw-author" style="color:hsl(${Vb(h||"anon")},70%,65%)">${Ah(h||"anonymous")}</span>
        <span class="pcw-time">${Qb(f)}</span>
      </div>
      <div class="pcw-bubble">${Ah(z)}</div>
    `,rn.appendChild(q),rn.scrollTop=rn.scrollHeight,!ai&&!Mh&&(xr++,Sr.textContent=xr>9?"9+":xr,Sr.classList.add("show"))}const _b=Xg(Eh,Wg(60));Ig(_b,h=>{Jb(h.val()),clearTimeout(window._pcwInitTimer),window._pcwInitTimer=setTimeout(()=>{Mh=!1},800)});function Dh(){const h=It.value.trim()||"anonymous",z=yl.value.trim();if(z){if(Hb(z)){Yb("That word is blocked.");return}localStorage.setItem("chat_name",h),Fg(Eh,{name:h,text:z,timestamp:Date.now()}),yl.value="",yl.focus()}}Lb.addEventListener("click",Dh);yl.addEventListener("keydown",h=>{h.key==="Enter"&&Dh()});
