(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const D={};let oe=null,J=null;const k={register(t,e){D[t]=e},beforeEach(t){J=t},navigate(t){window.location.hash=t},async resolve(){const t=window.location.hash.slice(1)||"/",[e,s]=t.split("?"),r={};s&&s.split("&").forEach(o=>{const[c,d]=o.split("=");r[decodeURIComponent(c)]=decodeURIComponent(d||"")});let n=null,a={};for(const[o,c]of Object.entries(D)){const d=o.split("/"),p=e.split("/");if(d.length!==p.length)continue;let u=!0;const m={};for(let f=0;f<d.length;f++)if(d[f].startsWith(":"))m[d[f].slice(1)]=p[f];else if(d[f]!==p[f]){u=!1;break}if(u){n=c,a=m;break}}if(n||(n=D["/"]||D["/login"]),J){const o=await J(e);if(o&&o!==e){this.navigate(o);return}}oe=e;const i=document.getElementById("app");if(n){i.innerHTML="";const o=await n({...r,...a});typeof o=="string"?i.innerHTML=o:o instanceof HTMLElement&&i.appendChild(o)}},getCurrentRoute(){return oe},init(){window.addEventListener("hashchange",()=>this.resolve()),this.resolve()}},I=Object.create(null);I.open="0";I.close="1";I.ping="2";I.pong="3";I.message="4";I.upgrade="5";I.noop="6";const q=Object.create(null);Object.keys(I).forEach(t=>{q[I[t]]=t});const Y={type:"error",data:"parser error"},ge=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ve=typeof ArrayBuffer=="function",ye=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,se=({type:t,data:e},s,r)=>ge&&e instanceof Blob?s?r(e):le(e,r):ve&&(e instanceof ArrayBuffer||ye(e))?s?r(e):le(new Blob([e]),r):r(I[t]+(e||"")),le=(t,e)=>{const s=new FileReader;return s.onload=function(){const r=s.result.split(",")[1];e("b"+(r||""))},s.readAsDataURL(t)};function ce(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let W;function Oe(t,e){if(ge&&t.data instanceof Blob)return t.data.arrayBuffer().then(ce).then(e);if(ve&&(t.data instanceof ArrayBuffer||ye(t.data)))return e(ce(t.data));se(t,!1,s=>{W||(W=new TextEncoder),e(W.encode(s))})}const de="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",N=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<de.length;t++)N[de.charCodeAt(t)]=t;const Ue=t=>{let e=t.length*.75,s=t.length,r,n=0,a,i,o,c;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const d=new ArrayBuffer(e),p=new Uint8Array(d);for(r=0;r<s;r+=4)a=N[t.charCodeAt(r)],i=N[t.charCodeAt(r+1)],o=N[t.charCodeAt(r+2)],c=N[t.charCodeAt(r+3)],p[n++]=a<<2|i>>4,p[n++]=(i&15)<<4|o>>2,p[n++]=(o&3)<<6|c&63;return d},qe=typeof ArrayBuffer=="function",re=(t,e)=>{if(typeof t!="string")return{type:"message",data:be(t,e)};const s=t.charAt(0);return s==="b"?{type:"message",data:Me(t.substring(1),e)}:q[s]?t.length>1?{type:q[s],data:t.substring(1)}:{type:q[s]}:Y},Me=(t,e)=>{if(qe){const s=Ue(t);return be(s,e)}else return{base64:!0,data:t}},be=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},we="",je=(t,e)=>{const s=t.length,r=new Array(s);let n=0;t.forEach((a,i)=>{se(a,!1,o=>{r[i]=o,++n===s&&e(r.join(we))})})},Fe=(t,e)=>{const s=t.split(we),r=[];for(let n=0;n<s.length;n++){const a=re(s[n],e);if(r.push(a),a.type==="error")break}return r};function He(){return new TransformStream({transform(t,e){Oe(t,s=>{const r=s.length;let n;if(r<126)n=new Uint8Array(1),new DataView(n.buffer).setUint8(0,r);else if(r<65536){n=new Uint8Array(3);const a=new DataView(n.buffer);a.setUint8(0,126),a.setUint16(1,r)}else{n=new Uint8Array(9);const a=new DataView(n.buffer);a.setUint8(0,127),a.setBigUint64(1,BigInt(r))}t.data&&typeof t.data!="string"&&(n[0]|=128),e.enqueue(n),e.enqueue(s)})}})}let G;function O(t){return t.reduce((e,s)=>e+s.length,0)}function U(t,e){if(t[0].length===e)return t.shift();const s=new Uint8Array(e);let r=0;for(let n=0;n<e;n++)s[n]=t[0][r++],r===t[0].length&&(t.shift(),r=0);return t.length&&r<t[0].length&&(t[0]=t[0].slice(r)),s}function Ve(t,e){G||(G=new TextDecoder);const s=[];let r=0,n=-1,a=!1;return new TransformStream({transform(i,o){for(s.push(i);;){if(r===0){if(O(s)<1)break;const c=U(s,1);a=(c[0]&128)===128,n=c[0]&127,n<126?r=3:n===126?r=1:r=2}else if(r===1){if(O(s)<2)break;const c=U(s,2);n=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),r=3}else if(r===2){if(O(s)<8)break;const c=U(s,8),d=new DataView(c.buffer,c.byteOffset,c.length),p=d.getUint32(0);if(p>Math.pow(2,21)-1){o.enqueue(Y);break}n=p*Math.pow(2,32)+d.getUint32(4),r=3}else{if(O(s)<n)break;const c=U(s,n);o.enqueue(re(a?c:G.decode(c),e)),r=0}if(n===0||n>t){o.enqueue(Y);break}}}})}const ke=4;function _(t){if(t)return ze(t)}function ze(t){for(var e in _.prototype)t[e]=_.prototype[e];return t}_.prototype.on=_.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};_.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this};_.prototype.off=_.prototype.removeListener=_.prototype.removeAllListeners=_.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var s=this._callbacks["$"+t];if(!s)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var r,n=0;n<s.length;n++)if(r=s[n],r===e||r.fn===e){s.splice(n,1);break}return s.length===0&&delete this._callbacks["$"+t],this};_.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),s=this._callbacks["$"+t],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(s){s=s.slice(0);for(var r=0,n=s.length;r<n;++r)s[r].apply(this,e)}return this};_.prototype.emitReserved=_.prototype.emit;_.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};_.prototype.hasListeners=function(t){return!!this.listeners(t).length};const H=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,s)=>s(e,0),$=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Je="arraybuffer";function Ee(t,...e){return e.reduce((s,r)=>(t.hasOwnProperty(r)&&(s[r]=t[r]),s),{})}const We=$.setTimeout,Ge=$.clearTimeout;function V(t,e){e.useNativeTimers?(t.setTimeoutFn=We.bind($),t.clearTimeoutFn=Ge.bind($)):(t.setTimeoutFn=$.setTimeout.bind($),t.clearTimeoutFn=$.clearTimeout.bind($))}const Ke=1.33;function Ye(t){return typeof t=="string"?Xe(t):Math.ceil((t.byteLength||t.size)*Ke)}function Xe(t){let e=0,s=0;for(let r=0,n=t.length;r<n;r++)e=t.charCodeAt(r),e<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(r++,s+=4);return s}function xe(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Qe(t){let e="";for(let s in t)t.hasOwnProperty(s)&&(e.length&&(e+="&"),e+=encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e}function Ze(t){let e={},s=t.split("&");for(let r=0,n=s.length;r<n;r++){let a=s[r].split("=");e[decodeURIComponent(a[0])]=decodeURIComponent(a[1])}return e}class et extends Error{constructor(e,s,r){super(e),this.description=s,this.context=r,this.type="TransportError"}}class ne extends _{constructor(e){super(),this.writable=!1,V(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,s,r){return super.emitReserved("error",new et(e,s,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const s=re(e,this.socket.binaryType);this.onPacket(s)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,s={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(s)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const s=Qe(e);return s.length?"?"+s:""}}class tt extends ne{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const s=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||s()})),this.writable||(r++,this.once("drain",function(){--r||s()}))}else s()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const s=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};Fe(e,this.socket.binaryType).forEach(s),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,je(e,s=>{this.doWrite(s,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",s=this.query||{};return this.opts.timestampRequests!==!1&&(s[this.opts.timestampParam]=xe()),!this.supportsBinary&&!s.sid&&(s.b64=1),this.createUri(e,s)}}let _e=!1;try{_e=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const st=_e;function rt(){}class nt extends tt{constructor(e){if(super(e),typeof location<"u"){const s=location.protocol==="https:";let r=location.port;r||(r=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,s){const r=this.request({method:"POST",data:e});r.on("success",s),r.on("error",(n,a)=>{this.onError("xhr post error",n,a)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(s,r)=>{this.onError("xhr poll error",s,r)}),this.pollXhr=e}}class C extends _{constructor(e,s,r){super(),this.createRequest=e,V(this,r),this._opts=r,this._method=r.method||"GET",this._uri=s,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const s=Ee(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");s.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(s);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let n in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(n)&&r.setRequestHeader(n,this._opts.extraHeaders[n])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var n;r.readyState===3&&((n=this._opts.cookieJar)===null||n===void 0||n.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(n){this.setTimeoutFn(()=>{this._onError(n)},0);return}typeof document<"u"&&(this._index=C.requestsCount++,C.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=rt,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete C.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}C.requestsCount=0;C.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",ue);else if(typeof addEventListener=="function"){const t="onpagehide"in $?"pagehide":"unload";addEventListener(t,ue,!1)}}function ue(){for(let t in C.requests)C.requests.hasOwnProperty(t)&&C.requests[t].abort()}const at=(function(){const t=$e({xdomain:!1});return t&&t.responseType!==null})();class it extends nt{constructor(e){super(e);const s=e&&e.forceBase64;this.supportsBinary=at&&!s}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new C($e,this.uri(),e)}}function $e(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||st))return new XMLHttpRequest}catch{}if(!e)try{return new $[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Te=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class ot extends ne{get name(){return"websocket"}doOpen(){const e=this.uri(),s=this.opts.protocols,r=Te?{}:Ee(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,s,r)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const r=e[s],n=s===e.length-1;se(r,this.supportsBinary,a=>{try{this.doWrite(r,a)}catch{}n&&H(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",s=this.query||{};return this.opts.timestampRequests&&(s[this.opts.timestampParam]=xe()),this.supportsBinary||(s.b64=1),this.createUri(e,s)}}const K=$.WebSocket||$.MozWebSocket;class lt extends ot{createSocket(e,s,r){return Te?new K(e,s,r):s?new K(e,s):new K(e)}doWrite(e,s){this.ws.send(s)}}class ct extends ne{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const s=Ve(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(s).getReader(),n=He();n.readable.pipeTo(e.writable),this._writer=n.writable.getWriter();const a=()=>{r.read().then(({done:o,value:c})=>{o||(this.onPacket(c),a())}).catch(o=>{})};a();const i={type:"open"};this.query.sid&&(i.data=`{"sid":"${this.query.sid}"}`),this._writer.write(i).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let s=0;s<e.length;s++){const r=e[s],n=s===e.length-1;this._writer.write(r).then(()=>{n&&H(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const dt={websocket:lt,webtransport:ct,polling:it},ut=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,pt=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function X(t){if(t.length>8e3)throw"URI too long";const e=t,s=t.indexOf("["),r=t.indexOf("]");s!=-1&&r!=-1&&(t=t.substring(0,s)+t.substring(s,r).replace(/:/g,";")+t.substring(r,t.length));let n=ut.exec(t||""),a={},i=14;for(;i--;)a[pt[i]]=n[i]||"";return s!=-1&&r!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a.pathNames=mt(a,a.path),a.queryKey=ht(a,a.query),a}function mt(t,e){const s=/\/{2,9}/g,r=e.replace(s,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function ht(t,e){const s={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,n,a){n&&(s[n]=a)}),s}const Q=typeof addEventListener=="function"&&typeof removeEventListener=="function",M=[];Q&&addEventListener("offline",()=>{M.forEach(t=>t())},!1);class R extends _{constructor(e,s){if(super(),this.binaryType=Je,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(s=e,e=null),e){const r=X(e);s.hostname=r.host,s.secure=r.protocol==="https"||r.protocol==="wss",s.port=r.port,r.query&&(s.query=r.query)}else s.host&&(s.hostname=X(s.host).host);V(this,s),this.secure=s.secure!=null?s.secure:typeof location<"u"&&location.protocol==="https:",s.hostname&&!s.port&&(s.port=this.secure?"443":"80"),this.hostname=s.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=s.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},s.transports.forEach(r=>{const n=r.prototype.name;this.transports.push(n),this._transportsByName[n]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},s),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Ze(this.opts.query)),Q&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},M.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const s=Object.assign({},this.opts.query);s.EIO=ke,s.transport=e,this.id&&(s.sid=this.id);const r=Object.assign({},this.opts,{query:s,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&R.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const s=this.createTransport(e);s.open(),this.setTransport(s)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",s=>this._onClose("transport close",s))}onOpen(){this.readyState="open",R.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const s=new Error("server error");s.code=e.data,this._onError(s);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let s=1;for(let r=0;r<this.writeBuffer.length;r++){const n=this.writeBuffer[r].data;if(n&&(s+=Ye(n)),r>0&&s>this._maxPayload)return this.writeBuffer.slice(0,r);s+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,H(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,s,r){return this._sendPacket("message",e,s,r),this}send(e,s,r){return this._sendPacket("message",e,s,r),this}_sendPacket(e,s,r,n){if(typeof s=="function"&&(n=s,s=void 0),typeof r=="function"&&(n=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const a={type:e,data:s,options:r};this.emitReserved("packetCreate",a),this.writeBuffer.push(a),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},s=()=>{this.off("upgrade",s),this.off("upgradeError",s),e()},r=()=>{this.once("upgrade",s),this.once("upgradeError",s)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(R.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,s){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Q&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=M.indexOf(this._offlineEventListener);r!==-1&&M.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,s),this.writeBuffer=[],this._prevBufferLen=0}}}R.protocol=ke;class ft extends R{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let s=this.createTransport(e),r=!1;R.priorWebsocketSuccess=!1;const n=()=>{r||(s.send([{type:"ping",data:"probe"}]),s.once("packet",u=>{if(!r)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",s),!s)return;R.priorWebsocketSuccess=s.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(p(),this.setTransport(s),s.send([{type:"upgrade"}]),this.emitReserved("upgrade",s),s=null,this.upgrading=!1,this.flush())})}else{const m=new Error("probe error");m.transport=s.name,this.emitReserved("upgradeError",m)}}))};function a(){r||(r=!0,p(),s.close(),s=null)}const i=u=>{const m=new Error("probe error: "+u);m.transport=s.name,a(),this.emitReserved("upgradeError",m)};function o(){i("transport closed")}function c(){i("socket closed")}function d(u){s&&u.name!==s.name&&a()}const p=()=>{s.removeListener("open",n),s.removeListener("error",i),s.removeListener("close",o),this.off("close",c),this.off("upgrading",d)};s.once("open",n),s.once("error",i),s.once("close",o),this.once("close",c),this.once("upgrading",d),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||s.open()},200):s.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const s=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&s.push(e[r]);return s}}let gt=class extends ft{constructor(e,s={}){const r=typeof e=="object"?e:s;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(n=>dt[n]).filter(n=>!!n)),super(e,r)}};function vt(t,e="",s){let r=t;s=s||typeof location<"u"&&location,t==null&&(t=s.protocol+"//"+s.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=s.protocol+t:t=s.host+t),/^(https?|wss?):\/\//.test(t)||(typeof s<"u"?t=s.protocol+"//"+t:t="https://"+t),r=X(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const a=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+a+":"+r.port+e,r.href=r.protocol+"://"+a+(s&&s.port===r.port?"":":"+r.port),r}const yt=typeof ArrayBuffer=="function",bt=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Ce=Object.prototype.toString,wt=typeof Blob=="function"||typeof Blob<"u"&&Ce.call(Blob)==="[object BlobConstructor]",kt=typeof File=="function"||typeof File<"u"&&Ce.call(File)==="[object FileConstructor]";function ae(t){return yt&&(t instanceof ArrayBuffer||bt(t))||wt&&t instanceof Blob||kt&&t instanceof File}function j(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let s=0,r=t.length;s<r;s++)if(j(t[s]))return!0;return!1}if(ae(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return j(t.toJSON(),!0);for(const s in t)if(Object.prototype.hasOwnProperty.call(t,s)&&j(t[s]))return!0;return!1}function Et(t){const e=[],s=t.data,r=t;return r.data=Z(s,e),r.attachments=e.length,{packet:r,buffers:e}}function Z(t,e){if(!t)return t;if(ae(t)){const s={_placeholder:!0,num:e.length};return e.push(t),s}else if(Array.isArray(t)){const s=new Array(t.length);for(let r=0;r<t.length;r++)s[r]=Z(t[r],e);return s}else if(typeof t=="object"&&!(t instanceof Date)){const s={};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&(s[r]=Z(t[r],e));return s}return t}function xt(t,e){return t.data=ee(t.data,e),delete t.attachments,t}function ee(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let s=0;s<t.length;s++)t[s]=ee(t[s],e);else if(typeof t=="object")for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(t[s]=ee(t[s],e));return t}const _t=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var w;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(w||(w={}));class $t{constructor(e){this.replacer=e}encode(e){return(e.type===w.EVENT||e.type===w.ACK)&&j(e)?this.encodeAsBinary({type:e.type===w.EVENT?w.BINARY_EVENT:w.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let s=""+e.type;return(e.type===w.BINARY_EVENT||e.type===w.BINARY_ACK)&&(s+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(s+=e.nsp+","),e.id!=null&&(s+=e.id),e.data!=null&&(s+=JSON.stringify(e.data,this.replacer)),s}encodeAsBinary(e){const s=Et(e),r=this.encodeAsString(s.packet),n=s.buffers;return n.unshift(r),n}}class ie extends _{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let s;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");s=this.decodeString(e);const r=s.type===w.BINARY_EVENT;r||s.type===w.BINARY_ACK?(s.type=r?w.EVENT:w.ACK,this.reconstructor=new Tt(s),s.attachments===0&&super.emitReserved("decoded",s)):super.emitReserved("decoded",s)}else if(ae(e)||e.base64)if(this.reconstructor)s=this.reconstructor.takeBinaryData(e),s&&(this.reconstructor=null,super.emitReserved("decoded",s));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let s=0;const r={type:Number(e.charAt(0))};if(w[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===w.BINARY_EVENT||r.type===w.BINARY_ACK){const a=s+1;for(;e.charAt(++s)!=="-"&&s!=e.length;);const i=e.substring(a,s);if(i!=Number(i)||e.charAt(s)!=="-")throw new Error("Illegal attachments");const o=Number(i);if(!Ct(o)||o<0)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");r.attachments=o}if(e.charAt(s+1)==="/"){const a=s+1;for(;++s&&!(e.charAt(s)===","||s===e.length););r.nsp=e.substring(a,s)}else r.nsp="/";const n=e.charAt(s+1);if(n!==""&&Number(n)==n){const a=s+1;for(;++s;){const i=e.charAt(s);if(i==null||Number(i)!=i){--s;break}if(s===e.length)break}r.id=Number(e.substring(a,s+1))}if(e.charAt(++s)){const a=this.tryParse(e.substr(s));if(ie.isPayloadValid(r.type,a))r.data=a;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,s){switch(e){case w.CONNECT:return pe(s);case w.DISCONNECT:return s===void 0;case w.CONNECT_ERROR:return typeof s=="string"||pe(s);case w.EVENT:case w.BINARY_EVENT:return Array.isArray(s)&&(typeof s[0]=="number"||typeof s[0]=="string"&&_t.indexOf(s[0])===-1);case w.ACK:case w.BINARY_ACK:return Array.isArray(s)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Tt{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const s=xt(this.reconPack,this.buffers);return this.finishedReconstruction(),s}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const Ct=Number.isInteger||function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t};function pe(t){return Object.prototype.toString.call(t)==="[object Object]"}const It=Object.freeze(Object.defineProperty({__proto__:null,Decoder:ie,Encoder:$t,get PacketType(){return w}},Symbol.toStringTag,{value:"Module"}));function T(t,e,s){return t.on(e,s),function(){t.off(e,s)}}const Rt=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Ie extends _{constructor(e,s,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=s,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[T(e,"open",this.onopen.bind(this)),T(e,"packet",this.onpacket.bind(this)),T(e,"error",this.onerror.bind(this)),T(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...s){var r,n,a;if(Rt.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(s.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(s),this;const i={type:w.EVENT,data:s};if(i.options={},i.options.compress=this.flags.compress!==!1,typeof s[s.length-1]=="function"){const p=this.ids++,u=s.pop();this._registerAckCallback(p,u),i.id=p}const o=(n=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||n===void 0?void 0:n.writable,c=this.connected&&!(!((a=this.io.engine)===null||a===void 0)&&a._hasPingExpired());return this.flags.volatile&&!o||(c?(this.notifyOutgoingListeners(i),this.packet(i)):this.sendBuffer.push(i)),this.flags={},this}_registerAckCallback(e,s){var r;const n=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(n===void 0){this.acks[e]=s;return}const a=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);s.call(this,new Error("operation has timed out"))},n),i=(...o)=>{this.io.clearTimeoutFn(a),s.apply(this,o)};i.withError=!0,this.acks[e]=i}emitWithAck(e,...s){return new Promise((r,n)=>{const a=(i,o)=>i?n(i):r(o);a.withError=!0,s.push(a),this.emit(e,...s)})}_addToQueue(e){let s;typeof e[e.length-1]=="function"&&(s=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...a)=>(this._queue[0],n!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),s&&s(n)):(this._queue.shift(),s&&s(null,...a)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const s=this._queue[0];s.pending&&!e||(s.pending=!0,s.tryCount++,this.flags=s.flags,this.emit.apply(this,s.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:w.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,s){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,s),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case w.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case w.EVENT:case w.BINARY_EVENT:this.onevent(e);break;case w.ACK:case w.BINARY_ACK:this.onack(e);break;case w.DISCONNECT:this.ondisconnect();break;case w.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const s=e.data||[];e.id!=null&&s.push(this.ack(e.id)),this.connected?this.emitEvent(s):this.receiveBuffer.push(Object.freeze(s))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const s=this._anyListeners.slice();for(const r of s)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const s=this;let r=!1;return function(...n){r||(r=!0,s.packet({type:w.ACK,id:e,data:n}))}}onack(e){const s=this.acks[e.id];typeof s=="function"&&(delete this.acks[e.id],s.withError&&e.data.unshift(null),s.apply(this,e.data))}onconnect(e,s){this.id=e,this.recovered=s&&this._pid===s,this._pid=s,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:w.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const s=this._anyListeners;for(let r=0;r<s.length;r++)if(e===s[r])return s.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const s=this._anyOutgoingListeners;for(let r=0;r<s.length;r++)if(e===s[r])return s.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const s=this._anyOutgoingListeners.slice();for(const r of s)r.apply(this,e.data)}}}function A(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}A.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),s=Math.floor(e*this.jitter*t);t=(Math.floor(e*10)&1)==0?t-s:t+s}return Math.min(t,this.max)|0};A.prototype.reset=function(){this.attempts=0};A.prototype.setMin=function(t){this.ms=t};A.prototype.setMax=function(t){this.max=t};A.prototype.setJitter=function(t){this.jitter=t};class te extends _{constructor(e,s){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(s=e,e=void 0),s=s||{},s.path=s.path||"/socket.io",this.opts=s,V(this,s),this.reconnection(s.reconnection!==!1),this.reconnectionAttempts(s.reconnectionAttempts||1/0),this.reconnectionDelay(s.reconnectionDelay||1e3),this.reconnectionDelayMax(s.reconnectionDelayMax||5e3),this.randomizationFactor((r=s.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new A({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(s.timeout==null?2e4:s.timeout),this._readyState="closed",this.uri=e;const n=s.parser||It;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=s.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var s;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(s=this.backoff)===null||s===void 0||s.setMin(e),this)}randomizationFactor(e){var s;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(s=this.backoff)===null||s===void 0||s.setJitter(e),this)}reconnectionDelayMax(e){var s;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(s=this.backoff)===null||s===void 0||s.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new gt(this.uri,this.opts);const s=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const n=T(s,"open",function(){r.onopen(),e&&e()}),a=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},i=T(s,"error",a);if(this._timeout!==!1){const o=this._timeout,c=this.setTimeoutFn(()=>{n(),a(new Error("timeout")),s.close()},o);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(n),this.subs.push(i),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(T(e,"ping",this.onping.bind(this)),T(e,"data",this.ondata.bind(this)),T(e,"error",this.onerror.bind(this)),T(e,"close",this.onclose.bind(this)),T(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(s){this.onclose("parse error",s)}}ondecoded(e){H(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,s){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new Ie(this,e,s),this.nsps[e]=r),r}_destroy(e){const s=Object.keys(this.nsps);for(const r of s)if(this.nsps[r].active)return;this._close()}_packet(e){const s=this.encoder.encode(e);for(let r=0;r<s.length;r++)this.engine.write(s[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,s){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,s),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const s=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},s);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const L={};function F(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const s=vt(t,e.path||"/socket.io"),r=s.source,n=s.id,a=s.path,i=L[n]&&a in L[n].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||i;let c;return o?c=new te(r,e):(L[n]||(L[n]=new te(r,e)),c=L[n]),s.query&&!e.query&&(e.query=s.queryKey),c.socket(s.path,e)}Object.assign(F,{Manager:te,Socket:Ie,io:F,connect:F});const P="dl_",l={socket:null,async _rpc(t,...e){const r=await(await fetch("/api/rpc",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({method:t,args:e})})).json();if(r.error)throw new Error(r.error);return r.result},initSocket(){if(!this.socket){this.socket=F("/");const t=this.getCurrentUserId();t&&this.socket.emit("register",t)}return this.socket},async initPush(){if("serviceWorker"in navigator&&"PushManager"in window)try{const t=await navigator.serviceWorker.ready;let e=await t.pushManager.getSubscription();if(!e){const s=await this._rpc("getVapidPublicKey");s&&(e=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:s}),await this._rpc("savePushSubscription",this.getCurrentUserId(),e))}}catch(t){console.error("Push error:",t)}},getCurrentUserId(){return localStorage.getItem(P+"currentUser")},setCurrentUserId(t){t?(localStorage.setItem(P+"currentUser",t),this.socket&&this.socket.emit("register",t)):(localStorage.removeItem(P+"currentUser"),this.socket&&this.socket.disconnect(),this.socket=null)},async register(t,e,s,r){const n=await this._rpc("register",t,e,s,r);return this.setCurrentUserId(n.id),n},async login(t,e){const s=await this._rpc("login",t,e);return this.setCurrentUserId(s.id),s},logout(){this.setCurrentUserId(null)},async verifyPin(t){const e=this.getCurrentUserId();return await this._rpc("verifyPin",e,t)},async setPin(t){const e=this.getCurrentUserId();return await this._rpc("setPin",e,t)},async changePassword(t,e){const s=this.getCurrentUserId();return await this._rpc("changePassword",s,t,e)},async getCurrentUser(){const t=this.getCurrentUserId();return t?await this._rpc("getCurrentUser",t):null},async updateUser(t,e){return await this._rpc("updateUser",t,e)},async getPartner(){const t=await this.getCurrentUser();return!t||!t.roomId?null:await this._rpc("getPartner",t.roomId,t.id)},async createRoom(t){const e=await this.getCurrentUser();return await this._rpc("createRoom",e.id,t)},async joinRoom(t){const e=await this.getCurrentUser();return await this._rpc("joinRoom",e.id,t)},async getCurrentRoom(){const t=await this.getCurrentUser();return!t||!t.roomId?null:await this._rpc("getCurrentRoom",t.roomId)},async createTask(t){return await this._rpc("createTask",t)},async updateTask(t,e){return await this._rpc("updateTask",t,e)},async deleteTask(t){return await this._rpc("deleteTask",t)},async getTasks(t,e={}){return await this._rpc("getTasks",t,e)},async markTaskViewed(t){return await this._rpc("markTaskViewed",t)},async getTaskHistory(t){return await this._rpc("getTaskHistory",t)},async submitTask(t,e){return await this._rpc("submitTask",t,e)},async reviewSubmission(t,e,s=""){return await this._rpc("reviewSubmission",t,e,s)},async getSubmissions(t,e=null){return await this._rpc("getSubmissions",t,e)},async getSubmissionsForTask(t){return await this._rpc("getSubmissionsForTask",t)},async addCoins(t,e,s){return await this._rpc("addCoins",t,e,s)},async spendCoins(t,e,s){return await this._rpc("spendCoins",t,e,s)},async getTransactions(t){return await this._rpc("getTransactions",t)},async getAchievements(){return await this._rpc("getAchievements",this.getCurrentUserId())},async getAchievementsForUser(t){return await this._rpc("getAchievements",t)},async toggleAchievement(t,e,s){return await this._rpc("toggleAchievement",t,e,s)},async getWeeklyReport(){var s;const t=await this.getCurrentUser();if(!t||!t.roomId)return null;const e=t.role==="sub"?t.id:(s=await this.getPartner())==null?void 0:s.id;return await this._rpc("getWeeklyReport",t.roomId,e)},async getWheelOptions(t){return await this._rpc("getWheelOptions",t)},async saveWheelOptions(t,e){return await this._rpc("saveWheelOptions",t,e)},async spinWheel(t){return await this._rpc("spinWheel",t,this.getCurrentUserId())},async createRule(t){return await this._rpc("createRule",t)},async updateRule(t,e){return await this._rpc("updateRule",t,e)},async deleteRule(t){return await this._rpc("deleteRule",t)},async getRules(t){return await this._rpc("getRules",t)},async createLimit(t){return await this._rpc("createLimit",t)},async updateLimit(t,e){return await this._rpc("updateLimit",t,e)},async deleteLimit(t){return await this._rpc("deleteLimit",t)},async getLimits(t){return await this._rpc("getLimits",t)},async createReward(t){return await this._rpc("createReward",t)},async updateReward(t,e){return await this._rpc("updateReward",t,e)},async deleteReward(t){return await this._rpc("deleteReward",t)},async getRewards(t){return await this._rpc("getRewards",t)},async purchaseReward(t,e){return await this._rpc("purchaseReward",t,e)},async getPurchases(t){return await this._rpc("getPurchases",t)},async deletePurchase(t){return await this._rpc("deletePurchase",t)},async addDemerit(t){return await this._rpc("addDemerit",t)},async getDemerits(t){return await this._rpc("getDemerits",t)},async createJournalEntry(t){return await this._rpc("createJournalEntry",t)},async updateJournalEntry(t,e){return await this._rpc("updateJournalEntry",t,e)},async getJournalEntries(t){return await this._rpc("getJournalEntries",t)},async createJournalPrompt(t){return await this._rpc("createJournalPrompt",t)},async getJournalPrompts(t){return await this._rpc("getJournalPrompts",t)},async addGuideMessage(t){return await this._rpc("addGuideMessage",t)},async getGuideMessages(t){return await this._rpc("getGuideMessages",t)},async getCalendarData(t,e,s){return await this._rpc("getCalendarData",t,e,s)},async uploadFile(t,e){return new Promise((s,r)=>{const n=new XMLHttpRequest,a=new FormData;a.append("file",t),n.upload.addEventListener("progress",i=>{i.lengthComputable&&e&&e(Math.round(i.loaded/i.total*100))}),n.addEventListener("load",()=>{n.status===200?s(JSON.parse(n.responseText)):r(new Error("Upload failed"))}),n.addEventListener("error",()=>r(new Error("Upload error"))),n.open("POST","/api/upload"),n.send(a)})},getTheme(){return localStorage.getItem(P+"theme")||"dark"},setTheme(t){localStorage.setItem(P+"theme",t)}};function g(t,e="success"){const s=document.getElementById("toast-root"),r=document.createElement("div");r.className=`toast toast-${e}`;const n={success:"✓",error:"✕",warning:"⚠",info:"ℹ"};r.innerHTML=`<span class="toast-icon">${n[e]||""}</span><span>${t}</span>`,s.appendChild(r),setTimeout(()=>{r.style.opacity="0",r.style.transform="translateX(-50%) translateY(-20px)",setTimeout(()=>r.remove(),300)},2800)}function Bt(t,e,s){const r=document.getElementById("modal-root"),n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`<div class="modal-content"><div class="modal-header"><h3 class="modal-title">${t}</h3><button class="modal-close" id="modal-close-btn">✕</button></div><div class="modal-body-content">${e}</div></div>`,r.appendChild(n);const a=()=>{n.style.opacity="0",setTimeout(()=>{n.remove()},200)};return n.querySelector("#modal-close-btn").onclick=a,n.addEventListener("click",i=>{i.target===n&&a()}),{close:a,el:n}}function B(t,e){return new Promise(s=>{const{close:r,el:n}=Bt(t,`
      <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">${e}</p>
      <div class="flex gap-sm">
        <button class="btn btn-outline btn-block" id="confirm-cancel">Cancelar</button>
        <button class="btn btn-primary btn-block" id="confirm-ok">Confirmar</button>
      </div>
    `);n.querySelector("#confirm-cancel").onclick=()=>{r(),s(!1)},n.querySelector("#confirm-ok").onclick=()=>{r(),s(!0)}})}function St(){const t=["#c9302c","#d4a853","#e8a0bf","#2ecc71","#3498db"];for(let e=0;e<40;e++){const s=document.createElement("div");s.className="confetti-piece",s.style.background=t[Math.floor(Math.random()*t.length)],s.style.left=Math.random()*100+"vw",s.style.top="-10px",s.style.transform=`rotate(${Math.random()*360}deg)`,document.body.appendChild(s);const r=1e3+Math.random()*2e3;s.animate([{top:"-10px",opacity:1},{top:"110vh",opacity:0,transform:`rotate(${Math.random()*720}deg) translateX(${(Math.random()-.5)*200}px)`}],{duration:r,easing:"cubic-bezier(0.25, 0.46, 0.45, 0.94)"}).onfinish=()=>s.remove()}}function S(t){return t?new Date(t).toLocaleDateString("es-MX",{day:"numeric",month:"short",year:"numeric"}):""}function me(t){return t?new Date(t).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}):""}function At(t,e){return`<nav class="navbar">${(e==="dom"?[{id:"dashboard",icon:"🏠",label:"Inicio",path:"/dashboard"},{id:"tasks",icon:"📋",label:"Tareas",path:"/tasks"},{id:"shop",icon:"🛒",label:"Tienda",path:"/shop"},{id:"journal",icon:"📖",label:"Diario",path:"/journal"},{id:"menu",icon:"☰",label:"Más",path:"/menu"}]:[{id:"dashboard",icon:"🏠",label:"Inicio",path:"/dashboard"},{id:"tasks",icon:"📋",label:"Tareas",path:"/tasks"},{id:"shop",icon:"🛒",label:"Tienda",path:"/shop"},{id:"journal",icon:"📖",label:"Diario",path:"/journal"},{id:"menu",icon:"☰",label:"Más",path:"/menu"}]).map(r=>`
    <a href="#${r.path}" class="nav-item ${t===r.id?"active":""}" id="nav-${r.id}">
      <span class="nav-icon">${r.icon}</span>
      <span>${r.label}</span>
    </a>`).join("")}</nav>`}function x(t,e,s,r,n=""){return`
    <div class="page">
      <div class="page-header">
        <div>
          <h2 class="page-title">${t}</h2>
          ${n?`<p class="page-subtitle">${n}</p>`:""}
        </div>
      </div>
      ${e}
    </div>
    ${At(s,r)}
  `}const Re=[{value:"servicio",label:"🧹 Servicio",color:"#3498db"},{value:"obediencia",label:"🔒 Obediencia",color:"#c9302c"},{value:"autocuidado",label:"💆 Autocuidado",color:"#2ecc71"},{value:"entrenamiento",label:"🏋️ Entrenamiento",color:"#f39c12"},{value:"protocolo",label:"👑 Protocolo",color:"#d4a853"},{value:"otro",label:"📌 Otro",color:"#9b59b6"}];async function Be(){const t=document.createElement("div");return t.className="auth-page",t.innerHTML=`
    <div class="auth-card">
      <div class="auth-logo"><h1>DomLover</h1><p>Dinámicas BDSM</p></div>
      <form id="login-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" id="login-email" placeholder="tu@email.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input class="form-input" type="password" id="login-pass" placeholder="••••••••" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit" style="margin-top:var(--space-md)">Entrar</button>
      </form>
      <p class="text-center text-sm mt-lg" style="color:var(--text-secondary)">¿No tienes cuenta? <a href="#/register">Regístrate</a></p>
    </div>`,setTimeout(()=>{var e;(e=document.getElementById("login-form"))==null||e.addEventListener("submit",async s=>{s.preventDefault();try{await l.login(document.getElementById("login-email").value,document.getElementById("login-pass").value),g("Bienvenido/a de vuelta","success"),window.location.hash="/dashboard"}catch(r){g(r.message,"error")}})},50),t}async function Lt(){const t=document.createElement("div");return t.className="auth-page",t.innerHTML=`
    <div class="auth-card">
      <div class="auth-logo"><h1>DomLover</h1><p>Crear Cuenta</p></div>
      <form id="reg-form">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input class="form-input" id="reg-name" placeholder="Tu nombre" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" id="reg-email" placeholder="tu@email.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input class="form-input" type="password" id="reg-pass" placeholder="••••••••" minlength="6" required />
        </div>
        <div class="form-group">
          <label class="form-label">Tu Rol</label>
          <div class="role-selector">
            <div class="role-option" data-role="dom" id="role-dom">
              <div class="role-icon">👑</div>
              <div class="role-label">Amo/a</div>
              <div class="role-desc">Controla tareas y reglas</div>
            </div>
            <div class="role-option" data-role="sub" id="role-sub">
              <div class="role-icon">🌹</div>
              <div class="role-label">Sumiso/a</div>
              <div class="role-desc">Cumple y gana monedas</div>
            </div>
          </div>
          <input type="hidden" id="reg-role" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Crear Cuenta</button>
      </form>
      <p class="text-center text-sm mt-lg" style="color:var(--text-secondary)">¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a></p>
    </div>`,setTimeout(()=>{var e;document.querySelectorAll(".role-option").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".role-option").forEach(n=>n.className="role-option");const r=s.dataset.role;s.classList.add(r==="dom"?"selected-dom":"selected-sub"),document.getElementById("reg-role").value=r})}),(e=document.getElementById("reg-form"))==null||e.addEventListener("submit",async s=>{s.preventDefault();const r=document.getElementById("reg-role").value;if(!r){g("Selecciona un rol","error");return}try{await l.register(document.getElementById("reg-email").value,document.getElementById("reg-pass").value,document.getElementById("reg-name").value,r),g("¡Cuenta creada!","success"),window.location.hash=r==="dom"?"/create-room":"/join-room"}catch(n){g(n.message,"error")}})},50),t}async function Pt(){const t=document.createElement("div");return t.className="auth-page",t.innerHTML=`
    <div class="auth-card text-center">
      <div class="auth-logo"><h1 style="font-size:3rem">🔒</h1><p>Ingresa tu PIN</p></div>
      <form id="pin-form">
        <div class="form-group" style="display:flex;justify-content:center;gap:10px;margin:20px 0;">
          <input type="password" id="pin-input" maxlength="4" style="width:120px;text-align:center;font-size:2rem;letter-spacing:10px;" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Desbloquear</button>
      </form>
      <button id="logout-btn" class="btn btn-outline btn-block mt-md">Cerrar Sesión</button>
    </div>`,setTimeout(()=>{var e,s;(e=document.getElementById("pin-form"))==null||e.addEventListener("submit",async r=>{r.preventDefault();try{await l.verifyPin(document.getElementById("pin-input").value)?(window._pinUnlocked=!0,window.location.hash="/dashboard"):(g("PIN Incorrecto","error"),document.getElementById("pin-input").value="")}catch(n){g(n.message,"error")}}),(s=document.getElementById("logout-btn"))==null||s.addEventListener("click",()=>{l.logout(),window._pinUnlocked=!1,window.location.hash="/login"})},50),t}async function Nt(){const t=document.createElement("div");return t.className="auth-page",t.innerHTML=`
    <div class="auth-card">
      <div class="auth-logo"><h1>👑</h1><p>Crear Sala</p></div>
      <form id="room-form">
        <div class="form-group">
          <label class="form-label">Nombre de la sala</label>
          <input class="form-input" id="room-name" placeholder="Ej: Nuestra Dinámica" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Crear</button>
      </form>
      <div id="room-result" style="display:none;margin-top:var(--space-lg)">
        <p class="text-sm text-secondary text-center mb-md">Comparte este código con tu Sumisa:</p>
        <div class="invite-code" id="invite-code"></div>
        <p class="text-xs text-muted text-center mt-md">Toca para copiar</p>
        <a href="#/dashboard" class="btn btn-gold btn-block btn-lg" style="margin-top:var(--space-lg)">Ir al Dashboard</a>
      </div>
    </div>`,setTimeout(()=>{var e;(e=document.getElementById("room-form"))==null||e.addEventListener("submit",async s=>{s.preventDefault();try{const r=await l.createRoom(document.getElementById("room-name").value);document.getElementById("room-form").style.display="none",document.getElementById("room-result").style.display="block",document.getElementById("invite-code").textContent=r.inviteCode,document.getElementById("invite-code").onclick=()=>{var n;(n=navigator.clipboard)==null||n.writeText(r.inviteCode),g("Código copiado","success")}}catch(r){g(r.message,"error")}})},50),t}async function Dt(){const t=document.createElement("div");return t.className="auth-page",t.innerHTML=`
    <div class="auth-card">
      <div class="auth-logo"><h1>🌹</h1><p>Unirse a Sala</p></div>
      <form id="join-form">
        <div class="form-group">
          <label class="form-label">Código de invitación</label>
          <input class="form-input" id="join-code" placeholder="ABC123" maxlength="6" style="text-transform:uppercase;text-align:center;font-size:var(--text-xl);letter-spacing:4px" required />
        </div>
        <button class="btn btn-sub btn-block btn-lg" type="submit">Unirse</button>
      </form>
      <p class="text-center text-sm mt-lg" style="color:var(--text-secondary)">Pídele el código a tu Amo/a</p>
    </div>`,setTimeout(()=>{var e;(e=document.getElementById("join-form"))==null||e.addEventListener("submit",async s=>{s.preventDefault();try{await l.joinRoom(document.getElementById("join-code").value.toUpperCase()),g("¡Conectado/a!","success"),window.location.hash="/dashboard"}catch(r){g(r.message,"error")}})},50),t}function he(t){return t>=3e3?"Absoluta 👑":t>=1500?"Esclava ⛓️":t>=600?"Devota 💎":t>=200?"Sumisa 🌹":"Aprendiz 🌱"}async function Ot(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=await l.getPartner(),r=t.role==="dom",n=await l.getTasks(e.id),a=n.filter(v=>v.status==="active"),i=await l.getSubmissions(e.id,"pending");await l.getDemerits(e.id);const o=await l.getRules(e.id),c=r?s:t,d=(c==null?void 0:c.coins)||0,p=(c==null?void 0:c.totalEarned)||0,u=(c==null?void 0:c.streak)||0,m=(c==null?void 0:c.demerits)||0,f=c?(await l.getTransactions(c.id)).slice(0,5):[];let h="";if(r)h=`
      <div class="card card-glass" style="margin-bottom:var(--space-md);padding:var(--space-lg);background:linear-gradient(135deg,rgba(201,48,44,0.1),rgba(212,168,83,0.05))">
        <div class="flex-between">
          <div>
            <p class="text-sm text-secondary">Bienvenido/a</p>
            <h3 style="font-family:var(--font-display);margin-top:4px">${t.displayName} 👑</h3>
          </div>
          <div class="coin-display"><span class="coin-icon">🪙</span><span class="coin-amount">${d}</span></div>
        </div>
        ${s?`
          <div class="mt-md" style="display:flex;justify-content:space-between;align-items:center;">
            <p class="text-sm" style="color:var(--text-secondary)">Sumisa: <strong style="color:var(--accent-sub)">${s.displayName}</strong></p>
            <div style="text-align:right">
              <span class="badge" style="background:var(--bg-card);color:var(--text-primary)">Nivel: ${he(p)}</span>
              <span class="badge" style="background:var(--bg-card);color:var(--text-primary)">Racha: ${u} 🔥</span>
            </div>
          </div>
        `:'<p class="text-sm mt-md text-muted">Esperando que tu Sumisa se una...</p>'}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <div class="stat-card"><div class="stat-value">${a.length}</div><div class="stat-label">Tareas Activas</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-warning)">${i.length}</div><div class="stat-label">Por Revisar</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-danger)">${m}</div><div class="stat-label">Deméritos</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-success)">${o.filter(v=>v.isActive).length}</div><div class="stat-label">Reglas</div></div>
      </div>
      ${i.length?`<div class="card mb-md" style="border-color:var(--color-warning)"><div class="card-header"><span class="card-title">⏳ Pruebas Pendientes</span><a href="#/tasks/review" class="btn btn-sm btn-outline">Ver</a></div>${i.slice(0,3).map(v=>{const y=n.find(b=>b.id===v.taskId);return`<div class="flex-between mb-sm"><span class="text-sm">${(y==null?void 0:y.title)||"Tarea"}</span><span class="badge badge-warning">Pendiente</span></div>`}).join("")}</div>`:""}
      <div class="card-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-sm)">
        <a href="#/tasks/new" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">📋</div><div class="text-sm">Nueva Tarea</div></a>
        <a href="#/demerits/new" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">⚠️</div><div class="text-sm">Dar Demérito</div></a>
        <a href="#/guide" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🔐</div><div class="text-sm">Chat Priv</div></a>
        <a href="#/achievements" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🏆</div><div class="text-sm">Logros</div></a>
      </div>`;else{const v=new Date().toISOString().slice(0,10),y=a.filter(b=>b.recurrence==="daily"||b.createdAt.startsWith(v));h=`
      <div class="card card-glass" style="margin-bottom:var(--space-md);padding:var(--space-lg);background:linear-gradient(135deg,rgba(232,160,191,0.1),rgba(212,168,83,0.05))">
        <div class="flex-between">
          <div>
            <p class="text-sm text-secondary">Hola</p>
            <h3 style="font-family:var(--font-display);margin-top:4px">${t.displayName}</h3>
            <div class="mt-sm"><span class="badge" style="background:var(--bg-card);color:var(--text-primary)">${he(p)}</span></div>
          </div>
          <div style="text-align:right;">
            <div class="coin-display"><span class="coin-icon">🪙</span><span class="coin-amount">${d}</span></div>
            <div class="mt-sm"><span class="badge" style="background:rgba(255,100,0,0.1);color:#ff9800;font-size:1rem;">🔥 Racha: ${u}</span></div>
          </div>
        </div>
        ${s?`<p class="text-sm mt-md" style="color:var(--text-secondary)">Amo/a: <strong style="color:var(--accent-dom)">${s.displayName}</strong></p>`:""}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <div class="stat-card"><div class="stat-value">${d}</div><div class="stat-label">Monedas</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-danger)">${m}</div><div class="stat-label">Deméritos</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--accent-sub)">${y.length}</div><div class="stat-label">Hoy</div></div>
      </div>
      ${y.length?`<div class="mb-md"><h4 style="margin-bottom:var(--space-sm)">📋 Tareas de Hoy</h4>${y.slice(0,5).map(b=>`<a href="#/tasks/submit/${b.id}" class="task-card mb-sm" style="text-decoration:none"><div class="task-top"><span class="task-title">${b.title}</span><span class="task-coin">🪙 ${b.coinReward}</span></div>${b.description?`<div class="task-desc">${b.description}</div>`:""}</a>`).join("")}</div>`:'<div class="empty-state"><div class="empty-state-icon">✨</div><div class="empty-state-title">Sin tareas hoy</div><div class="empty-state-text">Tu Amo/a no ha asignado tareas</div></div>'}
      ${f.length?`<div class="card mt-md"><div class="card-header"><span class="card-title">💰 Reciente</span></div>${f.map(b=>`<div class="flex-between mb-sm"><span class="text-sm">${b.reason}</span><span class="text-sm" style="color:${b.type==="earned"?"var(--color-success)":"var(--color-danger)"}">${b.type==="earned"?"+":"-"}${b.amount} 🪙</span></div>`).join("")}</div>`:""}
      <div class="card-grid mt-md" style="grid-template-columns:1fr 1fr;gap:var(--space-sm)">
        <a href="#/shop" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🛒</div><div class="text-sm">Tienda</div></a>
        <a href="#/achievements" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🏆</div><div class="text-sm">Logros</div></a>
        <a href="#/journal/new" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">📖</div><div class="text-sm">Escribir Diario</div></a>
        <a href="#/calendar" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">📅</div><div class="text-sm">Calendario</div></a>
      </div>`}return x(r?"👑 Dashboard":"🌹 Dashboard",h,"dashboard",t.role,e.name)}async function Ut(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=await l.getTasks(e.id),n=r.filter(o=>o.status==="active"),a=r.filter(o=>o.status==="completed");let i=`
    ${s?'<a href="#/tasks/new" class="btn btn-primary btn-block mb-md">+ Nueva Tarea</a>':""}
    ${s?'<a href="#/tasks/review" class="btn btn-outline btn-block mb-md">⏳ Revisar Pruebas</a>':""}
    <a href="#/tasks/history" class="btn btn-outline btn-block mb-md">📜 ${s?"Historial de Sumisa":"Mi Historial"}</a>
    <div class="tabs mb-md"><button class="tab active" data-tab="active">Activas (${n.length})</button><button class="tab" data-tab="done">Completadas (${a.length})</button></div>
    <div id="task-list">
      ${n.length?n.map(o=>fe(o,s)).join(""):'<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">Sin tareas</div></div>'}
    </div>
    <div id="task-done" style="display:none">
      ${a.length?a.map(o=>fe(o,s)).join(""):'<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Sin completadas aún</div></div>'}
    </div>`;return setTimeout(()=>{document.querySelectorAll(".tab").forEach(o=>{o.onclick=()=>{document.querySelectorAll(".tab").forEach(c=>c.classList.remove("active")),o.classList.add("active"),document.getElementById("task-list").style.display=o.dataset.tab==="active"?"block":"none",document.getElementById("task-done").style.display=o.dataset.tab==="done"?"block":"none"}}),document.querySelectorAll("[data-delete-task]").forEach(o=>{o.onclick=async c=>{c.stopPropagation(),await B("Eliminar Tarea","¿Seguro?")&&(await l.deleteTask(o.dataset.deleteTask),window.location.hash="/tasks",location.reload())}})},50),x("📋 Tareas",i,"tasks",t.role)}function fe(t,e){const s=Re.find(n=>n.value===t.category),r={photo:"📷",video:"🎥",text:"✍️"};return`<div class="task-card mb-sm ${t.status==="completed"?"completed":""}" onclick="location.hash='${e?`/tasks/edit/${t.id}`:`/tasks/submit/${t.id}`}'">
    <div class="task-top">
      <span class="task-title">${t.title}</span>
      <span class="task-coin">🪙 ${t.coinReward||0}</span>
    </div>
    ${t.description?`<div class="task-desc">${t.description}</div>`:""}
    <div class="task-meta">
      ${s?`<span class="badge" style="background:${s.color}22;color:${s.color}">${s.label}</span>`:""}
      ${t.isIntense?'<span class="badge" style="background:var(--color-danger);color:white">🔥 Intensa</span>':""}
      ${t.recurrence&&t.recurrence!=="once"?`<span class="badge badge-info">${t.recurrence==="daily"?"Diaria":"Semanal"}</span>`:""}
      ${t.timeLimit?`<span class="badge badge-warning">⏱️ ${t.timeLimit} min</span>`:""}
      ${t.requiresProof?`<span class="badge badge-warning">${r[t.proofType]||"📎"} Prueba</span>`:""}
      ${t.deadline?`<span class="badge badge-dom">⏰ ${S(t.deadline)}</span>`:""}
    </div>
    ${e?`<div class="task-meta mt-sm"><button class="btn btn-sm btn-danger" data-delete-task="${t.id}">🗑</button></div>`:""}
  </div>`}async function Se(t){var o;const e=await l.getCurrentUser(),s=await l.getCurrentRoom(),r=await l.getTasks(s.id),n=t.id?r.find(c=>c.id===t.id):null,a=n?"Editar Tarea":"Nueva Tarea",i=`<form id="task-form">
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" id="tf-title" value="${(n==null?void 0:n.title)||""}" required /></div>
    <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" id="tf-desc">${(n==null?void 0:n.description)||""}</textarea></div>
    <div class="form-group"><label class="form-label">Categoría</label><select class="form-select" id="tf-cat">${Re.map(c=>`<option value="${c.value}" ${(n==null?void 0:n.category)===c.value?"selected":""}>${c.label}</option>`).join("")}</select></div>
    <div class="form-group"><label class="form-label">Monedas de Recompensa</label><input class="form-input" type="number" id="tf-coins" min="0" value="${(n==null?void 0:n.coinReward)||10}" /></div>
    <div class="form-group"><label class="form-label">Recurrencia</label><select class="form-select" id="tf-rec"><option value="once" ${(n==null?void 0:n.recurrence)==="once"?"selected":""}>Una vez</option><option value="daily" ${(n==null?void 0:n.recurrence)==="daily"?"selected":""}>Diaria</option><option value="weekly" ${(n==null?void 0:n.recurrence)==="weekly"?"selected":""}>Semanal</option></select></div>
    <div class="form-group"><label class="form-label">Límite de Tiempo (minutos, opcional)</label><input class="form-input" type="number" id="tf-timelimit" min="1" value="${(n==null?void 0:n.timeLimit)||""}" placeholder="Ej: 20" /></div>
    <div class="form-group"><label class="form-label">Fecha Límite (opcional)</label><input class="form-input" type="date" id="tf-deadline" value="${((o=n==null?void 0:n.deadline)==null?void 0:o.slice(0,10))||""}" /></div>
    <div class="form-group">
      <label class="form-label">¿Requiere Prueba?</label>
      <select class="form-select" id="tf-proof"><option value="" ${n!=null&&n.requiresProof?"":"selected"}>No</option><option value="photo" ${(n==null?void 0:n.proofType)==="photo"?"selected":""}>📷 Foto</option><option value="video" ${(n==null?void 0:n.proofType)==="video"?"selected":""}>🎥 Video</option><option value="text" ${(n==null?void 0:n.proofType)==="text"?"selected":""}>✍️ Texto</option></select>
    </div>
    <div class="form-group" style="display:flex; gap:10px; align-items:center;">
      <input type="checkbox" id="tf-intense" ${n!=null&&n.isIntense?"checked":""} style="width:20px;height:20px;" />
      <label class="form-label" for="tf-intense" style="margin:0">Marcar como Tarea Intensa (Activa Aftercare tras aprobar)</label>
    </div>
    <div class="form-group"><label class="form-label">Condiciones (opcional)</label><input class="form-input" id="tf-cond" placeholder="Ej: Antes de las 10pm" value="${(n==null?void 0:n.conditions)||""}" /></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">${n?"Guardar":"Crear Tarea"}</button>
    <a href="#/tasks" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;return setTimeout(()=>{var c;(c=document.getElementById("task-form"))==null||c.addEventListener("submit",async d=>{d.preventDefault();const p={roomId:s.id,title:document.getElementById("tf-title").value,description:document.getElementById("tf-desc").value,category:document.getElementById("tf-cat").value,coinReward:parseInt(document.getElementById("tf-coins").value)||0,recurrence:document.getElementById("tf-rec").value,timeLimit:parseInt(document.getElementById("tf-timelimit").value)||null,deadline:document.getElementById("tf-deadline").value||null,requiresProof:!!document.getElementById("tf-proof").value,proofType:document.getElementById("tf-proof").value||null,conditions:document.getElementById("tf-cond").value||null,isIntense:document.getElementById("tf-intense").checked};try{n?(await l.updateTask(n.id,p),g("Tarea actualizada")):(await l.createTask(p),g("¡Tarea creada!")),window.location.hash="/tasks"}catch(u){g(u.message,"error")}})},50),x(a,i,"tasks",e.role)}async function qt(t){const e=await l.getCurrentUser(),s=await l.getCurrentRoom(),n=(await l.getTasks(s.id)).find(d=>d.id===t.id);if(!n)return x("Error","<p>Tarea no encontrada</p>","tasks",e.role);const i=(await l.getSubmissionsForTask(n.id)).some(d=>d.status==="pending");let o=n.viewedAt;!i&&e.role==="sub"&&n.timeLimit&&!o&&(o=await l.markTaskViewed(n.id));const c=`
    <div class="card mb-md">
      <h3 class="card-title">${n.title}</h3>
      ${n.description?`<p class="card-body mt-sm">${n.description}</p>`:""}
      <div class="task-meta mt-md">
        <span class="task-coin">🪙 ${n.coinReward}</span>
        ${n.isIntense?'<span class="badge" style="background:var(--color-danger);color:white">🔥 Intensa</span>':""}
        ${n.conditions?`<span class="badge badge-info">📌 ${n.conditions}</span>`:""}
        ${n.deadline?`<span class="badge badge-dom">⏰ ${S(n.deadline)}</span>`:""}
      </div>
    </div>
    ${n.timeLimit&&o?`
      <div class="card mb-md text-center" style="border-color:var(--color-danger); background:var(--color-danger-light);">
        <h2 style="color:var(--color-danger); font-family:var(--font-display); letter-spacing:2px; font-size:2rem; margin:0;" id="task-timer">00:00</h2>
        <p class="text-sm" style="color:var(--color-danger)">Tiempo Restante</p>
      </div>
    `:""}
    ${i?'<div class="card mb-md" style="border-color:var(--color-warning)"><p class="text-sm text-center" style="color:var(--color-warning)">⏳ Ya tienes una prueba pendiente de revisión</p></div>':`
    <form id="submit-form">
      ${n.requiresProof?`
        <div class="form-group">
          <label class="form-label">${n.proofType==="photo"?"📷 Sube una foto":n.proofType==="video"?"🎥 Sube un video":"✍️ Escribe tu prueba"}</label>
          ${n.proofType==="text"?'<textarea class="form-textarea" id="proof-text" placeholder="Escribe aquí..." required></textarea>':`
            <label class="proof-upload" id="proof-upload-label" for="proof-file">
              <div class="proof-upload-icon">${n.proofType==="photo"?"📷":"🎥"}</div>
              <p class="text-sm text-secondary">Toca para subir</p>
              <input type="file" accept="${n.proofType==="photo"?"image/*":"video/*"}" id="proof-file" style="display:none" />
              <div id="upload-progress" class="upload-progress" style="display:none">
                <div class="upload-progress-bar"><div class="upload-progress-bar-fill" id="upload-bar"></div></div>
                <span class="upload-progress-text" id="upload-text">0%</span>
              </div>
              <img id="proof-preview" class="proof-preview" style="display:none" />
            </label>`}
        </div>`:""}
      <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" id="proof-note" placeholder="Comentario..." /></div>
      <button class="btn btn-sub btn-block btn-lg" type="submit" id="btn-submit">✓ Enviar</button>
    </form>`}
    <a href="#/tasks" class="btn btn-outline btn-block mt-sm">Volver</a>`;return setTimeout(()=>{var u;if(n.timeLimit&&o&&!i){const m=n.timeLimit*6e4,f=new Date(o).getTime(),h=document.getElementById("task-timer"),v=setInterval(()=>{const y=m-(Date.now()-f);if(y<=0)clearInterval(v),h&&(h.textContent="00:00"),g("El tiempo expiró. Has fallado la tarea.","error"),setTimeout(()=>location.reload(),2e3);else{const b=Math.floor(y/6e4),E=Math.floor(y%6e4/1e3);h&&(h.textContent=`${String(b).padStart(2,"0")}:${String(E).padStart(2,"0")}`)}},1e3)}const d=document.getElementById("proof-file");let p="";d&&(d.addEventListener("click",m=>m.stopPropagation()),d.onchange=async m=>{const f=m.target.files[0];if(!f)return;const h=document.getElementById("upload-progress"),v=document.getElementById("upload-bar"),y=document.getElementById("upload-text");h&&(h.style.display="flex");try{const b=await l.uploadFile(f,E=>{v&&(v.style.width=E+"%"),y&&(y.textContent=E+"%")});if(p=b.url,n.proofType==="photo"){const E=document.getElementById("proof-preview");E&&(E.src=b.url,E.style.display="block")}h&&(v&&(v.style.width="100%"),y&&(y.textContent="✓ Subido")),g("Archivo subido","success")}catch{g("Error subiendo archivo","error"),h&&(h.style.display="none")}}),(u=document.getElementById("submit-form"))==null||u.addEventListener("submit",async m=>{var v,y;m.preventDefault();let f="";if(n.proofType==="text"?f=((v=document.getElementById("proof-text"))==null?void 0:v.value)||"":f=p,n.requiresProof&&!f){g("Adjunta la prueba requerida","error");return}const h=document.getElementById("btn-submit");h&&(h.disabled=!0,h.textContent="⏳ Enviando...");try{await l.submitTask(n.id,{userId:e.id,proofUrl:f,proofType:n.proofType||"none",note:((y=document.getElementById("proof-note"))==null?void 0:y.value)||""}),n.requiresProof||(await l.addCoins(e.id,n.coinReward,`Tarea: ${n.title}`),n.recurrence==="once"&&await l.updateTask(n.id,{status:"completed"})),g(n.requiresProof?"Prueba enviada, esperando revisión":`¡+${n.coinReward} monedas!`,"success"),window.location.hash="/tasks"}catch(b){g(b.message,"error"),h&&(h.disabled=!1,h.textContent="✓ Enviar")}})},50),x("📋 "+n.title,c,"tasks",e.role)}async function Mt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=await l.getSubmissions(e.id,"pending"),r=await l.getTasks(e.id),n=s.length?s.map(a=>{const i=r.find(o=>o.id===a.taskId);return`<div class="card mb-md">
      <div class="card-header"><span class="card-title">${(i==null?void 0:i.title)||"Tarea"}</span><span class="task-coin">🪙 ${(i==null?void 0:i.coinReward)||0}</span></div>
      ${a.proofType==="text"?`<p class="card-body" style="background:var(--bg-secondary);padding:var(--space-sm);border-radius:var(--radius-sm);margin-bottom:var(--space-sm)">"${a.proofUrl}"</p>`:""}
      ${a.proofUrl&&a.proofType==="photo"?`<img src="${a.proofUrl}" style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)" />`:""}
      ${a.proofUrl&&a.proofType==="video"?`<video src="${a.proofUrl}" controls style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)"></video>`:""}
      ${a.note?`<p class="text-sm text-secondary mb-sm">📝 ${a.note}</p>`:""}
      <div class="flex gap-sm">
        <button class="btn btn-danger btn-block btn-sm" onclick="window._reviewSub('${a.id}',false)">✕ Rechazar</button>
        <button class="btn btn-gold btn-block btn-sm" onclick="window._reviewSub('${a.id}',true)">✓ Aprobar</button>
      </div>
    </div>`}).join(""):'<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Todo revisado</div><div class="empty-state-text">No hay pruebas pendientes</div></div>';return window._reviewSub=async(a,i)=>{try{await l.reviewSubmission(a,i),g(i?"Aprobada":"Rechazada","success"),window.location.reload()}catch(o){g(o.message,"error")}},x("⏳ Revisiones",n,"tasks",t.role)}async function jt(){var i;const t=await l.getCurrentUser();await l.getCurrentRoom();const s=t.role==="dom"?(i=await l.getPartner())==null?void 0:i.id:t.id;if(!s)return x("Sin registros",'<div class="empty-state">No hay registros disponibles</div>',"tasks",t.role);const r=await l.getTaskHistory(s),n=o=>o.length?o.map(c=>`
    <div class="card mb-md">
      <div class="card-header">
        <span class="card-title">${c.title||"Tarea eliminada"}</span>
        <span class="task-coin">🪙 ${c.coinReward||0}</span>
      </div>
      <div class="text-xs text-muted mb-sm">Completada el ${S(c.reviewedAt)} ${c.recurrence?`(${c.recurrence==="daily"?"Diaria":c.recurrence==="weekly"?"Semanal":"Una vez"})`:""}</div>
      ${c.proofType==="text"?`<p class="card-body" style="background:var(--bg-secondary);padding:var(--space-sm);border-radius:var(--radius-sm);margin-bottom:var(--space-sm)">"${c.proofUrl}"</p>`:""}
      ${c.proofUrl&&c.proofType==="photo"?`<img src="${c.proofUrl}" style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)" />`:""}
      ${c.proofUrl&&c.proofType==="video"?`<video src="${c.proofUrl}" controls style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)"></video>`:""}
      ${c.note?`<p class="text-sm text-secondary mb-sm">📝 ${c.note}</p>`:""}
    </div>
  `).join(""):'<div class="empty-state"><div class="empty-state-icon">📜</div><div class="empty-state-title">Historial vacío</div></div>';let a=`
    <div class="tabs mb-md">
      <button class="tab active" data-hist-tab="all">Todas</button>
      <button class="tab" data-hist-tab="daily">Diarias</button>
      <button class="tab" data-hist-tab="weekly">Semanales</button>
      <button class="tab" data-hist-tab="once">Una Vez</button>
    </div>
    <div id="hist-all">${n(r)}</div>
    <div id="hist-daily" style="display:none">${n(r.filter(o=>o.recurrence==="daily"))}</div>
    <div id="hist-weekly" style="display:none">${n(r.filter(o=>o.recurrence==="weekly"))}</div>
    <div id="hist-once" style="display:none">${n(r.filter(o=>o.recurrence==="once"))}</div>
  `;return setTimeout(()=>{document.querySelectorAll("[data-hist-tab]").forEach(o=>{o.onclick=()=>{document.querySelectorAll("[data-hist-tab]").forEach(d=>d.classList.remove("active")),o.classList.add("active");const c=o.dataset.histTab;document.getElementById("hist-all").style.display=c==="all"?"block":"none",document.getElementById("hist-daily").style.display=c==="daily"?"block":"none",document.getElementById("hist-weekly").style.display=c==="weekly"?"block":"none",document.getElementById("hist-once").style.display=c==="once"?"block":"none"}})},50),x("📜 Historial",a,"tasks",t.role)}async function Ft(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=await l.getRewards(e.id),n=s?await l.getPartner():t,a=n?await l.getPurchases(n.id):[],i=r.filter(u=>(u.rewardCategory||"premio")==="premio"),o=r.filter(u=>u.rewardCategory==="mejora"),c={once:"Un uso","1_day":"1 Día","3_days":"3 Días",permanent:"Permanente",daily:"Diaria",weekly:"Semanal"},d=(u,m,f)=>u.length?`<div class="card-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-sm)">
      ${u.map(h=>`<div class="reward-card" style="position:relative" ${s?`onclick="location.hash='/shop/edit/${h.id}'"`:""}>
        ${s?`<button class="btn btn-sm btn-danger" style="position:absolute;top:4px;right:4px;padding:2px 6px;font-size:0.8rem;background:transparent;color:var(--color-danger)" onclick="event.stopPropagation();window._delReward('${h.id}')">✕</button>`:""}
        <div class="reward-emoji">${h.emoji||"🎁"}</div>
        <div class="reward-title">${h.title}</div>
        <span class="badge" style="background:var(--bg-secondary);margin:4px 0">${c[h.type]||h.type}</span>
        ${s?`<div class="mt-sm text-sm" style="color:var(--accent-gold)">${h.cost} 🪙</div>`:`<button class="btn btn-gold btn-block btn-sm mt-sm" onclick="event.stopPropagation();window._buy('${h.id}')" ${((n==null?void 0:n.coins)||0)<h.cost?"disabled":""}>${h.cost} 🪙</button>`}
      </div>`).join("")}
    </div>`:`<div class="empty-state" style="padding:var(--space-lg)"><div class="empty-state-icon">${m}</div><div class="empty-state-title">${f}</div></div>`;let p=`
    <div class="card card-glass mb-md" style="text-align:center;padding:var(--space-md);border-color:var(--accent-gold)">
      <div class="text-sm text-secondary">Monedas Disponibles</div>
      <div style="font-size:2.5rem;font-weight:700;color:var(--accent-gold)">🪙 ${(n==null?void 0:n.coins)||0}</div>
    </div>
    ${s?'<a href="#/shop/new" class="btn btn-primary btn-block mb-md">+ Nueva Recompensa</a>':""}

    <!-- Tabs: Premios / Mejoras -->
    <div class="tabs mb-md">
      <button class="tab active" data-shop-tab="premios">🏆 Premios (${i.length})</button>
      <button class="tab" data-shop-tab="mejoras">⚡ Mejoras (${o.length})</button>
    </div>

    <div id="shop-premios">
      ${d(i,"🏆","Sin premios disponibles")}
    </div>
    <div id="shop-mejoras" style="display:none">
      ${d(o,"⚡","Sin mejoras disponibles")}
    </div>

    <h4 class="mb-sm mt-lg">Historial de Compras (${a.length})</h4>
    <div class="flex flex-col gap-sm" style="max-height: 400px; overflow-y: auto;">
      ${a.length?a.map(u=>`<div class="card"><div class="flex-between"><span style="font-weight:600">${u.rewardTitle}</span><span style="color:var(--color-danger)">-${u.cost} 🪙</span></div><div class="flex-between mt-xs"><div class="text-xs text-secondary">${S(u.purchasedAt)}</div>${s?`<button class="btn btn-sm" style="background:transparent;color:var(--color-danger);padding:0" onclick="window._delPurchase('${u.id}')">🗑️</button>`:""}</div></div>`).join(""):'<p class="text-sm text-muted">Sin compras aún</p>'}
    </div>`;return s?(window._delReward=async u=>{await B("Eliminar","¿Eliminar esta recompensa?")&&(await l.deleteReward(u),location.reload())},window._delPurchase=async u=>{await B("Eliminar Compra","¿Ocultar este registro del historial?")&&(await l.deletePurchase(u),location.reload())}):window._buy=async u=>{try{await B("Comprar Recompensa","¿Gastar monedas en esto?")&&(await l.purchaseReward(u,t.id),St(),g("¡Compra exitosa!","success"),setTimeout(()=>location.reload(),1500))}catch(m){g(m.message,"error")}},setTimeout(()=>{document.querySelectorAll("[data-shop-tab]").forEach(u=>{u.onclick=()=>{document.querySelectorAll("[data-shop-tab]").forEach(m=>m.classList.remove("active")),u.classList.add("active"),document.getElementById("shop-premios").style.display=u.dataset.shopTab==="premios"?"block":"none",document.getElementById("shop-mejoras").style.display=u.dataset.shopTab==="mejoras"?"block":"none"}})},50),x("🛒 Tienda",p,"shop",t.role)}async function Ae(t){const e=await l.getCurrentUser(),s=await l.getCurrentRoom(),r=t.id?(await l.getRewards(s.id)).find(a=>a.id===t.id):null,n=`<form id="reward-form">
    <div class="form-group"><label class="form-label">Emoji / Icono</label><input class="form-input" id="rf-emoji" value="${(r==null?void 0:r.emoji)||"🎁"}" required style="font-size:2rem;text-align:center" /></div>
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" id="rf-title" value="${(r==null?void 0:r.title)||""}" required /></div>
    <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" id="rf-desc">${(r==null?void 0:r.description)||""}</textarea></div>
    <div class="form-group"><label class="form-label">Costo (Monedas)</label><input class="form-input" type="number" id="rf-cost" min="1" value="${(r==null?void 0:r.cost)||50}" required /></div>
    <div class="form-group"><label class="form-label">Sección</label>
      <select class="form-select" id="rf-cat">
        <option value="premio" ${((r==null?void 0:r.rewardCategory)||"premio")==="premio"?"selected":""}>🏆 Premio</option>
        <option value="mejora" ${(r==null?void 0:r.rewardCategory)==="mejora"?"selected":""}>⚡ Mejora</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Tipo / Duración</label><select class="form-select" id="rf-type"></select></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">${r?"Guardar":"Crear"}</button>
    ${r?'<button type="button" class="btn btn-danger btn-block mt-sm" id="btn-del">Eliminar</button>':""}
    <a href="#/shop" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;return setTimeout(()=>{var d,p;const a=document.getElementById("rf-cat"),i=document.getElementById("rf-type"),o=r?r.type:"";function c(){!a||!i||(a.value==="premio"?i.innerHTML='<option value="once">Un solo uso (Cupón)</option>':i.innerHTML='<option value="1_day">1 Día</option><option value="3_days">3 Días</option><option value="permanent">Permanente</option>',o&&Array.from(i.options).some(u=>u.value===o)&&(i.value=o))}a&&(a.addEventListener("change",c),c()),(d=document.getElementById("reward-form"))==null||d.addEventListener("submit",async u=>{u.preventDefault();const m={roomId:s.id,title:document.getElementById("rf-title").value,description:document.getElementById("rf-desc").value,cost:parseInt(document.getElementById("rf-cost").value),type:document.getElementById("rf-type").value,emoji:document.getElementById("rf-emoji").value,rewardCategory:document.getElementById("rf-cat").value};r?await l.updateReward(r.id,m):await l.createReward(m),g("Recompensa guardada"),window.location.hash="/shop"}),(p=document.getElementById("btn-del"))==null||p.addEventListener("click",async()=>{await B("Eliminar","¿Seguro?")&&(await l.deleteReward(r.id),window.location.hash="/shop")})},50),x(r?"Editar Recompensa":"Nueva Recompensa",n,"shop",e.role)}async function Ht(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=await l.getRules(e.id),n={low:{l:"Baja",c:"var(--color-info)"},medium:{l:"Media",c:"var(--color-warning)"},high:{l:"Alta",c:"var(--color-danger)"}},a=`
    ${s?'<a href="#/rules/new" class="btn btn-primary btn-block mb-md">+ Nueva Regla</a>':""}
    <div class="flex flex-col gap-sm">
      ${r.length?r.map(i=>`<div class="card" ${s?`onclick="location.hash='/rules/edit/${i.id}'"`:""}>
        <div class="flex-between mb-sm"><h4 style="margin:0">${i.title}</h4><span class="badge" style="background:${n[i.severity].c}22;color:${n[i.severity].c}">${n[i.severity].l}</span></div>
        <p class="text-sm text-secondary">${i.description}</p>
        <div class="mt-sm"><span class="badge badge-danger">Penalidad: -${i.demeritPenalty} Deméritos</span></div>
      </div>`).join(""):'<div class="empty-state"><div class="empty-state-icon">📜</div><div class="empty-state-title">Sin reglas establecidas</div></div>'}
    </div>`;return x("📜 Reglas",a,"menu",t.role)}async function Le(t){const e=await l.getCurrentUser(),s=await l.getCurrentRoom(),r=t.id?(await l.getRules(s.id)).find(a=>a.id===t.id):null,n=`<form id="rule-form">
    <div class="form-group"><label class="form-label">Regla</label><input class="form-input" id="r-title" value="${(r==null?void 0:r.title)||""}" required /></div>
    <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" id="r-desc">${(r==null?void 0:r.description)||""}</textarea></div>
    <div class="form-group"><label class="form-label">Severidad</label><select class="form-select" id="r-sev"><option value="low" ${(r==null?void 0:r.severity)==="low"?"selected":""}>Baja</option><option value="medium" ${(r==null?void 0:r.severity)==="medium"?"selected":""}>Media</option><option value="high" ${(r==null?void 0:r.severity)==="high"?"selected":""}>Alta</option></select></div>
    <div class="form-group"><label class="form-label">Deméritos (Castigo)</label><input class="form-input" type="number" id="r-pen" min="1" value="${(r==null?void 0:r.demeritPenalty)||1}" required /></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">${r?"Guardar":"Crear Regla"}</button>
    ${r?'<button type="button" class="btn btn-danger btn-block mt-sm" id="btn-del">Eliminar</button>':""}
    <a href="#/rules" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;return setTimeout(()=>{var a,i;(a=document.getElementById("rule-form"))==null||a.addEventListener("submit",async o=>{o.preventDefault();const c={roomId:s.id,title:document.getElementById("r-title").value,description:document.getElementById("r-desc").value,severity:document.getElementById("r-sev").value,demeritPenalty:parseInt(document.getElementById("r-pen").value)};r?await l.updateRule(r.id,c):await l.createRule(c),g("Regla guardada"),window.location.hash="/rules"}),(i=document.getElementById("btn-del"))==null||i.addEventListener("click",async()=>{await B("Eliminar","¿Seguro?")&&(await l.deleteRule(r.id),window.location.hash="/rules")})},50),x(r?"Editar Regla":"Nueva Regla",n,"menu",e.role)}async function Vt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=await l.getLimits(e.id),n={hard:{l:"Innegociable",c:"var(--color-danger)"},soft:{l:"Negociable",c:"var(--color-warning)"},playlist:{l:"Deseo / Fantasía",c:"var(--color-success)"}},a=`
    ${s?'<p class="text-sm text-secondary text-center mb-md">Los límites solo pueden ser editados por la Sumisa.</p>':'<a href="#/limits/new" class="btn btn-sub btn-block mb-md">+ Agregar Límite / Deseo</a>'}
    <div class="flex flex-col gap-sm">
      ${r.length?r.map(i=>`<div class="card" ${s?"":`onclick="location.hash='/limits/edit/${i.id}'"`}>
        <div class="flex-between mb-sm"><h4 style="margin:0">${i.title}</h4><span class="badge" style="background:${n[i.category].c}22;color:${n[i.category].c}">${n[i.category].l}</span></div>
        <p class="text-sm text-secondary">${i.description}</p>
      </div>`).join(""):'<div class="empty-state"><div class="empty-state-icon">🚫</div><div class="empty-state-title">Lista vacía</div></div>'}
    </div>`;return x("🚫 Límites y Playlist",a,"menu",t.role)}async function Pe(t){const e=await l.getCurrentUser(),s=await l.getCurrentRoom();if(e.role==="dom"){window.location.hash="/limits";return}const r=t.id?(await l.getLimits(s.id)).find(a=>a.id===t.id):null,n=`<form id="limit-form">
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" id="l-title" value="${(r==null?void 0:r.title)||""}" required /></div>
    <div class="form-group"><label class="form-label">Tipo</label><select class="form-select" id="l-cat"><option value="hard" ${(r==null?void 0:r.category)==="hard"?"selected":""}>Límite Duro (Innegociable)</option><option value="soft" ${(r==null?void 0:r.category)==="soft"?"selected":""}>Límite Suave (Negociable)</option><option value="playlist" ${(r==null?void 0:r.category)==="playlist"?"selected":""}>Deseo / Playlist</option></select></div>
    <div class="form-group"><label class="form-label">Explicación</label><textarea class="form-textarea" id="l-desc" placeholder="Detalles de por qué...">${(r==null?void 0:r.description)||""}</textarea></div>
    <button class="btn btn-sub btn-block btn-lg" type="submit">${r?"Guardar":"Agregar"}</button>
    ${r?'<button type="button" class="btn btn-outline btn-block mt-sm" style="color:var(--color-danger);border-color:var(--color-danger)" id="btn-del">Eliminar</button>':""}
    <a href="#/limits" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;return setTimeout(()=>{var a,i;(a=document.getElementById("limit-form"))==null||a.addEventListener("submit",async o=>{o.preventDefault();const c={roomId:s.id,userId:e.id,title:document.getElementById("l-title").value,description:document.getElementById("l-desc").value,category:document.getElementById("l-cat").value,status:"active"};r?await l.updateLimit(r.id,c):await l.createLimit(c),g("Guardado"),window.location.hash="/limits"}),(i=document.getElementById("btn-del"))==null||i.addEventListener("click",async()=>{await B("Eliminar","¿Seguro?")&&(await l.deleteLimit(r.id),window.location.hash="/limits")})},50),x(r?"Editar":"Nuevo Límite",n,"menu",e.role)}async function zt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=await l.getDemerits(e.id),n=s?await l.getPartner():t,i=`
    <div class="card card-glass mb-md" style="text-align:center;padding:var(--space-lg);border-color:rgba(231,76,60,0.3)">
      <div class="demerit-points">${(n==null?void 0:n.demerits)||0}</div>
      <div class="stat-label">Deméritos Acumulados</div>
    </div>
    ${s?'<a href="#/demerits/new" class="btn btn-danger btn-block mb-md">⚠️ Asignar Demérito</a>':""}
    <h4 class="mb-sm">Historial</h4>
    ${r.length?r.map(o=>`<div class="demerit-card mb-sm">
      <div class="flex-between"><span style="font-weight:600">${o.reason}</span><span class="badge badge-danger">-${o.points}</span></div>
      ${o.punishment?`<p class="text-sm mt-sm" style="color:var(--accent-dom)">🔒 Castigo: ${o.punishment}</p>`:""}
      ${o.ruleName?`<span class="badge badge-info mt-sm">📜 ${o.ruleName}</span>`:""}
      <p class="text-xs text-muted mt-sm">${S(o.issuedAt)}</p>
    </div>`).join(""):'<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Sin deméritos</div></div>'}`;return x("⚠️ Deméritos",i,"menu",t.role)}async function Jt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=(await l.getRules(e.id)).filter(a=>a.isActive),r=await l.getPartner(),n=`<form id="dem-form">
    <div class="form-group"><label class="form-label">Regla violada (opcional)</label><select class="form-select" id="dem-rule"><option value="">— Seleccionar —</option>${s.map(a=>`<option value="${a.id}" data-pen="${a.demeritPenalty}" data-name="${a.title}">${a.title} (-${a.demeritPenalty})</option>`).join("")}</select></div>
    <div class="form-group"><label class="form-label">Razón</label><input class="form-input" id="dem-reason" required placeholder="¿Qué pasó?" /></div>
    <div class="form-group"><label class="form-label">Puntos de demérito</label><input class="form-input" type="number" id="dem-pts" min="1" value="1" required /></div>
    <div class="form-group"><label class="form-label">Castigo (opcional)</label><textarea class="form-textarea" id="dem-punish" placeholder="Describe el castigo..."></textarea></div>
    <button class="btn btn-danger btn-block btn-lg" type="submit">Asignar Demérito</button>
    <a href="#/demerits" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;return setTimeout(()=>{var a,i;(a=document.getElementById("dem-rule"))==null||a.addEventListener("change",o=>{const c=o.target.selectedOptions[0];c.dataset.pen&&(document.getElementById("dem-pts").value=c.dataset.pen),c.dataset.name&&(document.getElementById("dem-reason").value=`Violación: ${c.dataset.name}`)}),(i=document.getElementById("dem-form"))==null||i.addEventListener("submit",async o=>{var d;o.preventDefault();const c=document.getElementById("dem-rule").selectedOptions[0];try{await l.addDemerit({roomId:e.id,userId:r==null?void 0:r.id,ruleId:document.getElementById("dem-rule").value||null,ruleName:((d=c==null?void 0:c.dataset)==null?void 0:d.name)||null,reason:document.getElementById("dem-reason").value,points:parseInt(document.getElementById("dem-pts").value),punishment:document.getElementById("dem-punish").value||null}),g("Demérito asignado","warning"),window.location.hash="/demerits"}catch(p){g(p.message,"error")}})},50),x("⚠️ Nuevo Demérito",n,"menu",t.role)}async function Wt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=new Date;let r=s.getFullYear(),n=s.getMonth();const a=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],i=["Lu","Ma","Mi","Ju","Vi","Sa","Do"];async function o(p,u){const m=await l.getCalendarData(e.id,p,u),f=(new Date(p,u,1).getDay()+6)%7,h=new Date(p,u+1,0).getDate(),v=s.getDate(),y=p===s.getFullYear()&&u===s.getMonth();let b=i.map(E=>`<div class="calendar-header-cell">${E}</div>`).join("");for(let E=0;E<f;E++)b+='<div class="calendar-cell empty"></div>';for(let E=1;E<=h;E++){const z=m[E]!=="none"?m[E]:"";b+=`<div class="calendar-cell ${z} ${y&&E===v?"today":""}">${E}</div>`}return b}const c=await o(r,n),d=`
    <div class="flex-between mb-md">
      <button class="btn btn-sm btn-outline" id="cal-prev">◀</button>
      <h3 id="cal-title" style="font-family:var(--font-display)">${a[n]} ${r}</h3>
      <button class="btn btn-sm btn-outline" id="cal-next">▶</button>
    </div>
    <div class="calendar-grid" id="cal-grid">${c}</div>
    <div class="flex gap-sm mt-lg" style="justify-content:center">
      <span class="badge badge-success">✓ Completo</span>
      <span class="badge badge-warning">~ Parcial</span>
      <span class="badge badge-danger">✕ Faltó</span>
    </div>`;return setTimeout(()=>{var p,u;(p=document.getElementById("cal-prev"))==null||p.addEventListener("click",async()=>{n--,n<0&&(n=11,r--),document.getElementById("cal-title").textContent=`${a[n]} ${r}`,document.getElementById("cal-grid").innerHTML=await o(r,n)}),(u=document.getElementById("cal-next"))==null||u.addEventListener("click",async()=>{n++,n>11&&(n=0,r++),document.getElementById("cal-title").textContent=`${a[n]} ${r}`,document.getElementById("cal-grid").innerHTML=await o(r,n)})},50),x("📅 Calendario",d,"menu",t.role)}function Ne(t){return t==="positive"?"😊":t==="negative"?"😔":t==="neutral"?"😐":t||"📝"}async function Gt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=await l.getJournalEntries(e.id),a=(await l.getJournalPrompts(e.id)).filter(o=>!o.isUsed);let i=`
    ${s?"":a.length?`<div class="card mb-md" style="border-color:var(--accent-sub)"><p class="text-sm text-secondary">💌 Tu Amo/a te dejó una guía:</p><p class="mt-sm" style="font-style:italic;color:var(--accent-sub)">"${a[0].text}"</p><a href="#/journal/new?prompt=${a[0].id}" class="btn btn-sub btn-block btn-sm mt-md">Escribir sobre esto</a></div>`:""}
    ${s?'<a href="#/journal/prompt" class="btn btn-primary btn-block mb-md">💌 Enviar Guía</a>':'<a href="#/journal/new" class="btn btn-sub btn-block mb-md">✏️ Nueva Entrada</a>'}
    ${r.length?r.map(o=>`<div class="journal-card mb-sm" onclick="location.hash='/journal/entry/${o.id}'">
      <div class="flex-between"><span class="journal-date">${S(o.createdAt)}</span><span class="journal-mood" title="Análisis de IA">${Ne(o.mood)}</span></div>
      <div class="journal-preview">${o.content}</div>
      ${o.audioUrl?'<div class="text-sm mt-sm">🎵 Nota de voz adjunta</div>':""}
      ${o.prompt?'<div class="journal-prompt-badge">💌 Con guía del Amo/a</div>':""}
      ${s&&!o.isReadByDom?'<span class="badge badge-sub mt-sm">Nueva</span>':""}
    </div>`).join(""):'<div class="empty-state"><div class="empty-state-icon">📖</div><div class="empty-state-title">Sin entradas</div></div>'}`;return x("📖 Diario",i,"journal",t.role)}async function De(t){const e=await l.getCurrentUser(),s=await l.getCurrentRoom(),r=e.role==="dom",n=await l.getJournalEntries(s.id),a=await l.getJournalPrompts(s.id),i=t.id?n.find(p=>p.id===t.id):null,o=t.prompt,c=o?a.find(p=>p.id===o):null;if(i&&r){await l.updateJournalEntry(i.id,{isReadByDom:!0});const p=`
      <div class="flex-between mb-md"><span class="text-sm text-muted">${S(i.createdAt)}</span><span style="font-size:1.5rem" title="Análisis de IA">${Ne(i.mood)}</span></div>
      ${i.prompt?`<div class="card mb-md" style="border-color:var(--accent-sub)"><p class="text-xs text-muted">Guía:</p><p class="text-sm" style="color:var(--accent-sub);font-style:italic">"${i.prompt}"</p></div>`:""}
      <div class="card"><p style="line-height:1.8;white-space:pre-wrap">${i.content}</p></div>
      ${i.audioUrl?`<div class="card mt-md text-center"><audio src="${i.audioUrl}" controls style="width:100%"></audio></div>`:""}
      <a href="#/journal" class="btn btn-outline btn-block mt-lg">Volver</a>`;return x("📖 Entrada",p,"journal",e.role)}const d=`
    ${c?`<div class="card mb-md" style="border-color:var(--accent-sub)"><p class="text-xs text-muted">💌 Guía de tu Amo/a:</p><p class="mt-sm" style="font-style:italic;color:var(--accent-sub)">"${c.text}"</p></div>`:""}
    <form id="journal-form">
      <div class="form-group"><label class="form-label">Escribe aquí (Tu humor será analizado por IA)</label><textarea class="form-textarea" id="jf-content" style="min-height:200px" required>${(i==null?void 0:i.content)||""}</textarea></div>
      <div class="form-group" style="text-align:center;">
        <button type="button" class="btn btn-outline" id="journal-record" style="font-size:1.5rem; width:60px; height:60px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">🎙️</button>
        <p class="text-xs text-secondary mt-sm">Opcional: Graba una nota de voz</p>
      </div>
      <button class="btn btn-sub btn-block btn-lg" type="submit">${i?"Guardar":"Publicar"}</button>
      <a href="#/journal" class="btn btn-outline btn-block mt-sm">Cancelar</a>
    </form>
    <style>
      .recording-pulse { animation: pulseRed 1.5s infinite; color: red !important; border-color: red !important; }
      @keyframes pulseRed { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
    </style>`;return setTimeout(()=>{var v;document.querySelectorAll(".mood-pick").forEach(y=>{y.onclick=()=>{document.querySelectorAll(".mood-pick").forEach(b=>b.style.outline=""),y.style.outline="2px solid var(--accent-sub)",document.getElementById("jf-mood").value=y.dataset.mood}});let p=null,u=null,m=[],f=!1;const h=document.getElementById("journal-record");h==null||h.addEventListener("click",async()=>{if(f)u.stop(),f=!1,h.textContent="🎙️",h.classList.remove("recording-pulse");else try{const y=await navigator.mediaDevices.getUserMedia({audio:!0});u=new MediaRecorder(y),u.ondataavailable=b=>m.push(b.data),u.onstop=async()=>{const b=new Blob(m,{type:"audio/webm"});m=[],g("Subiendo audio...","info");const E=new File([b],"audio.webm",{type:"audio/webm"});try{p=(await l.uploadFile(E)).url,g("Audio adjuntado ✅","success"),h.textContent="✅",h.disabled=!0}catch{g("Error al subir audio","error")}},u.start(),f=!0,h.textContent="⏹️",h.classList.add("recording-pulse")}catch{g("Micrófono no disponible","error")}}),(v=document.getElementById("journal-form"))==null||v.addEventListener("submit",async y=>{y.preventDefault();const b={roomId:s.id,userId:e.id,content:document.getElementById("jf-content").value,prompt:(c==null?void 0:c.text)||null};p&&(b.audioUrl=p);try{i?await l.updateJournalEntry(i.id,b):(await l.createJournalEntry(b),c&&await l.updateJournalEntry(c.id,{isUsed:!0})),g("Entrada guardada 📖"),window.location.hash="/journal"}catch(E){g(E.message,"error")}})},50),x(i?"✏️ Editar":"✏️ Nueva Entrada",d,"journal",e.role)}async function Kt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),r=`<form id="prompt-form">
    <div class="form-group"><label class="form-label">Plantillas rápidas</label><div class="flex flex-col gap-sm">${["¿Cómo te sentiste hoy al cumplir tus tareas?","¿Qué aprendiste hoy sobre ti misma?","Describe un momento donde sentiste orgullo hoy.","¿Qué te gustaría mejorar mañana?","Escribe sobre tus emociones durante el día."].map(n=>`<button type="button" class="btn btn-sm btn-outline text-sm prompt-tpl" style="text-align:left;white-space:normal">${n}</button>`).join("")}</div></div>
    <div class="form-group mt-md"><label class="form-label">O escribe tu propia guía</label><textarea class="form-textarea" id="pf-text" placeholder="Escribe lo que quieres que tu Sumisa reflexione..." required></textarea></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">💌 Enviar Guía</button>
    <a href="#/journal" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;return setTimeout(()=>{var n;document.querySelectorAll(".prompt-tpl").forEach(a=>{a.onclick=()=>{document.getElementById("pf-text").value=a.textContent}}),(n=document.getElementById("prompt-form"))==null||n.addEventListener("submit",async a=>{a.preventDefault();try{await l.createJournalPrompt({roomId:e.id,text:document.getElementById("pf-text").value}),g("Guía enviada 💌"),window.location.hash="/journal"}catch(i){g(i.message,"error")}})},50),x("💌 Guía de Diario",r,"journal",t.role)}async function Yt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=await l.getGuideMessages(e.id),n=`
    <div class="chat-container" id="chat-msgs">
      ${r.length?r.map(a=>`
        <div class="chat-bubble ${a.role}">
          <div>${a.text}</div>
          ${a.audioUrl?`<audio src="${a.audioUrl}" controls style="width:100%; height:30px; margin-top:5px; border-radius:15px;"></audio>`:""}
          <div class="chat-time">${me(a.createdAt)}</div>
        </div>`).join(""):'<div class="empty-state" id="empty-chat"><div class="empty-state-icon">💬</div><div class="empty-state-title">Sin mensajes</div><div class="empty-state-text">Usa este modo para guiar en tiempo real</div></div>'}
    </div>
    <div class="chat-input-bar">
      <input class="form-input" id="guide-input" placeholder="${s?"Escribe una instrucción...":"Responder..."}" />
      <button class="btn btn-outline" id="guide-record" style="border:none; background:transparent; font-size:1.5rem;">🎙️</button>
      <button class="btn btn-primary" id="guide-send">➤</button>
    </div>
    <style>
      .recording-pulse { animation: pulseRed 1.5s infinite; color: red !important; }
      @keyframes pulseRed { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
    </style>
    `;return setTimeout(()=>{var p,u;const a=async()=>{var h;const m=document.getElementById("guide-input"),f=(h=m==null?void 0:m.value)==null?void 0:h.trim();f&&(await l.addGuideMessage({roomId:e.id,role:t.role,text:f,userId:t.id}),m.value="")};(p=document.getElementById("guide-send"))==null||p.addEventListener("click",a),(u=document.getElementById("guide-input"))==null||u.addEventListener("keydown",m=>{m.key==="Enter"&&a()}),setTimeout(()=>{const m=document.getElementById("chat-msgs");m&&(m.scrollTop=99999)},100);let i=null,o=[],c=!1;const d=document.getElementById("guide-record");if(d==null||d.addEventListener("click",async()=>{if(c)i.stop(),c=!1,d.textContent="🎙️",d.classList.remove("recording-pulse");else try{const m=await navigator.mediaDevices.getUserMedia({audio:!0});i=new MediaRecorder(m),i.ondataavailable=f=>o.push(f.data),i.onstop=async()=>{const f=new Blob(o,{type:"audio/webm"});o=[],showToast("Enviando audio...","info");const h=new File([f],"audio.webm",{type:"audio/webm"});try{const v=await l.uploadFile(h);await l.addGuideMessage({roomId:e.id,role:t.role,text:"🎵 Mensaje de voz",userId:t.id,audioUrl:v.url})}catch{showToast("Error al enviar audio","error")}},i.start(),c=!0,d.textContent="⏹️",d.classList.add("recording-pulse")}catch{showToast("Micrófono no disponible","error")}}),l.socket){const m=`chat_message_${e.id}`;l.socket.off(m),l.socket.on(m,f=>{const h=document.getElementById("chat-msgs");if(!h)return;const v=document.getElementById("empty-chat");v&&v.remove();const y=document.createElement("div");y.className=`chat-bubble ${f.role}`,y.innerHTML=`<div>${f.text}</div>${f.audioUrl?`<audio src="${f.audioUrl}" controls style="width:100%; height:30px; margin-top:5px; border-radius:15px;"></audio>`:""}<div class="chat-time">${me(f.createdAt)}</div>`,h.appendChild(y),h.scrollTop=99999})}},50),x("🔐 Chat Priv",n,"menu",t.role)}async function Xt(){var c,d;const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom",r=l.getTheme(),a="Notification"in window&&"serviceWorker"in navigator&&"PushManager"in window&&Notification.permission!=="granted",i=[{icon:"📜",label:"Reglas",path:"/rules",desc:s?"Gestionar reglas":"Ver reglas"},{icon:"🚫",label:"Límites / Playlist",path:"/limits",desc:s?"Ver límites de Sumisa":"Gestionar mis límites"},{icon:"⚠️",label:"Deméritos",path:"/demerits",desc:"Castigos y penalizaciones"},{icon:"📅",label:"Calendario",path:"/calendar",desc:"Historial de cumplimiento"},{icon:"🔐",label:"Chat Priv",path:"/guide",desc:"Mensajería privada"},{icon:"🎡",label:"Ruleta",path:"/wheel",desc:"La suerte de la sumisa"}],o=`
    <div class="card card-glass mb-md" style="padding:var(--space-lg)">
      <div class="flex gap-md" style="align-items:center">
        <div class="avatar ${s?"":"avatar-sub"} avatar-lg">${((d=(c=t.displayName)==null?void 0:c.charAt(0))==null?void 0:d.toUpperCase())||"?"}</div>
        <div>
          <h3 style="font-family:var(--font-display)">${t.displayName}</h3>
          <span class="badge ${s?"badge-dom":"badge-sub"}">${s?"👑 Amo/a":"🌹 Sumiso/a"}</span>
          <p class="text-xs text-muted mt-sm">Sala: ${(e==null?void 0:e.name)||"—"}</p>
          ${e?`<p class="text-xs text-muted">Código: <strong style="color:var(--accent-gold)">${e.inviteCode}</strong></p>`:""}
        </div>
      </div>
    </div>

    <!-- Theme Toggle -->
    <div class="card flex-between mb-md" style="padding:var(--space-md)">
      <div class="flex gap-md" style="align-items:center">
        <span style="font-size:1.5rem">${r==="dark"?"🌙":"☀️"}</span>
        <div>
          <div style="font-weight:600">Tema</div>
          <div class="text-xs text-secondary">${r==="dark"?"Modo Oscuro":"Modo Claro"}</div>
        </div>
      </div>
      <button class="btn btn-sm btn-outline" id="theme-toggle" style="min-width:80px">${r==="dark"?"☀️ Claro":"🌙 Oscuro"}</button>
    </div>

    <!-- PIN Setup -->
    <div class="card flex-between mb-md" style="padding:var(--space-md)">
      <div class="flex gap-md" style="align-items:center">
        <span style="font-size:1.5rem">🔒</span>
        <div>
          <div style="font-weight:600">Seguridad</div>
          <div class="text-xs text-secondary">Bloqueo por PIN</div>
        </div>
      </div>
      <div class="flex flex-col gap-sm">
        <button class="btn btn-sm btn-outline" id="pin-setup-btn">PIN</button>
        <button class="btn btn-sm btn-outline" id="pass-change-btn">Password</button>
      </div>
    </div>

    <div class="flex flex-col gap-sm">
      ${i.map(p=>`
        <a href="#${p.path}" class="card flex gap-md" style="text-decoration:none;align-items:center;padding:var(--space-md)">
          <span style="font-size:1.5rem">${p.icon}</span>
          <div style="flex:1">
            <div style="font-weight:600">${p.label}</div>
            <div class="text-xs text-secondary">${p.desc}</div>
          </div>
          <span class="text-muted">›</span>
        </a>
      `).join("")}
    </div>

    <!-- PWA Install -->
    <button class="btn btn-gold btn-block mt-lg" id="pwa-install-btn" style="display:none">
      📲 Instalar App
    </button>

    ${a?`
    <button class="btn btn-outline btn-block mt-sm" id="push-enable-btn" style="border-color:var(--accent-sub);color:var(--text-primary)">
      🔔 Activar Notificaciones
    </button>
    `:""}

    <button class="btn btn-outline btn-block mt-md" id="logout-btn" style="color:var(--color-danger);border-color:rgba(231,76,60,0.3)">
      🚪 Cerrar Sesión
    </button>`;return setTimeout(()=>{var p,u,m,f,h;if((p=document.getElementById("theme-toggle"))==null||p.addEventListener("click",()=>{const v=l.getTheme()==="dark"?"light":"dark";l.setTheme(v),document.documentElement.setAttribute("data-theme",v),g(v==="dark"?"🌙 Modo Oscuro":"☀️ Modo Claro"),setTimeout(()=>location.reload(),300)}),window._pwaInstallPrompt){const v=document.getElementById("pwa-install-btn");v&&(v.style.display="block"),v==null||v.addEventListener("click",async()=>{const y=await window._pwaInstallPrompt.prompt();(y==null?void 0:y.outcome)==="accepted"&&(g("¡App instalada! 📲","success"),v.style.display="none")})}(u=document.getElementById("push-enable-btn"))==null||u.addEventListener("click",async()=>{const v=document.getElementById("push-enable-btn");try{await Notification.requestPermission()==="granted"?(await l.initPush(),g("Notificaciones activadas","success"),v.style.display="none"):g("Permiso denegado","error")}catch{g("Error al activar notificaciones","error")}}),(m=document.getElementById("pin-setup-btn"))==null||m.addEventListener("click",async()=>{const v=prompt("Introduce un nuevo PIN de 4 dígitos (deja en blanco para desactivar):");if(v!==null){if(v.length>0&&v.length!==4){g("El PIN debe tener 4 dígitos","error");return}try{await l.setPin(v),g(v?"PIN configurado":"PIN desactivado","success")}catch(y){g(y.message,"error")}}}),(f=document.getElementById("pass-change-btn"))==null||f.addEventListener("click",async()=>{const v=prompt("Introduce tu contraseña actual:");if(!v)return;const y=prompt("Introduce tu NUEVA contraseña:");if(!y)return;const b=prompt("Confirma tu NUEVA contraseña:");if(y!==b){g("Las contraseñas no coinciden","error");return}try{await l.changePassword(v,y),g("Contraseña cambiada con éxito","success")}catch(E){g(E.message,"error")}}),(h=document.getElementById("logout-btn"))==null||h.addEventListener("click",()=>{l.logout(),g("Sesión cerrada"),window.location.hash="/login"})},50),x("☰ Menú",o,"menu",t.role)}async function Qt(){const t=await l.getCurrentUser(),e=t.role==="dom",s=await l.getPartner(),r=e?s==null?void 0:s.id:t.id;if(e&&!r)return x("Sin sumisa",'<div class="empty-state">No hay sumisa en la sala</div>',"dashboard",t.role);const n=await l.getAchievementsForUser(r),a=await l.getWeeklyReport();let i=`
    <div class="mb-lg">
      <h3 style="margin-bottom:var(--space-sm)">🏆 Logros Desbloqueados</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);">
        ${n.map(o=>`
          <div class="card text-center" style="opacity:${o.unlocked?"1":"0.5"};filter:${o.unlocked?"none":"grayscale(1)"};cursor:${e?"pointer":"default"}" ${e?`onclick="window._toggleAch('${o.id}', ${!o.unlocked})"`:""}>
            <div style="font-size:2rem;margin-bottom:4px">${o.icon}</div>
            <div class="text-sm" style="font-weight:bold">${o.title}</div>
            <div class="text-xs text-secondary mt-sm">${o.unlocked?"Desbloqueado":"Bloqueado"}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;return e&&(window._toggleAch=async(o,c)=>{await l.toggleAchievement(r,o,c),location.reload()}),a&&(i+=`
      <div class="card mt-lg" style="background:var(--bg-glass)">
        <h4 style="margin-bottom:var(--space-md)">📊 Reporte Semanal (Últimos 7 días)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)">
          <div class="stat-card">
            <div class="stat-value" style="color:var(--color-success)">+${a.earned}</div>
            <div class="stat-label">Monedas Ganadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--color-danger)">-${a.spent}</div>
            <div class="stat-label">Monedas Gastadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--accent-sub)">${a.tasksCompleted}</div>
            <div class="stat-label">Tareas Completadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--color-warning)">${a.demerits}</div>
            <div class="stat-label">Deméritos Recibidos</div>
          </div>
        </div>
      </div>
    `),x("🏆 Logros y Estadísticas",i,"dashboard",t.role)}async function Zt(){const t=await l.getCurrentUser(),e=await l.getCurrentRoom(),s=t.role==="dom";if(!e)return'<div class="card p-lg text-center">No estás en ninguna sala</div>';let r=await l.getWheelOptions(e.id);r.length===0&&(r=Array.from({length:8},(a,i)=>({label:`Opción ${i+1}`,effectType:"nothing",effectValue:0})));const n=document.createElement("div");return n.className="wheel-container",n.innerHTML=`
    <style>
      .wheel-wrapper {
        position: relative;
        width: 300px;
        height: 300px;
        margin: 2rem auto;
        border-radius: 50%;
        border: 4px solid var(--accent-gold);
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
      }
      .wheel {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;
        transition: transform 4s cubic-bezier(0.1, 0.7, 0.1, 1);
        background: conic-gradient(
          #e74c3c 0deg 45deg,
          #3498db 45deg 90deg,
          #2ecc71 90deg 135deg,
          #f1c40f 135deg 180deg,
          #9b59b6 180deg 225deg,
          #e67e22 225deg 270deg,
          #1abc9c 270deg 315deg,
          #34495e 315deg 360deg
        );
      }
      .wheel-pointer {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 30px solid white;
        z-index: 10;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
      }
      .wheel-segment-label {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 20px;
        transform-origin: 0% 50%;
        text-align: right;
        padding-right: 10px;
        color: white;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        font-size: 0.8rem;
        margin-top: -10px; /* half height */
      }
    </style>
    
    <div class="card p-md text-center mb-lg">
      <h2>🎡 La Ruleta</h2>
      <p class="text-sm text-secondary">${s?"Configura las 8 opciones de la ruleta.":"Gira la ruleta una vez al día para descubrir tu destino."}</p>
    </div>

    ${s?`
      <div class="card p-md">
        <h3>Opciones</h3>
        <form id="wheel-form" class="flex flex-col gap-sm mt-md">
          ${r.map((a,i)=>`
            <div class="flex gap-sm" style="align-items:center; background:var(--bg-lighter); padding:8px; border-radius:8px;">
              <span style="font-weight:bold; width:20px;">${i+1}</span>
              <input type="text" class="form-input" style="flex:2" value="${a.label}" name="label_${i}" placeholder="Nombre" required />
              <select class="form-input" style="flex:1" name="type_${i}">
                <option value="nothing" ${a.effectType==="nothing"?"selected":""}>Nada</option>
                <option value="coins" ${a.effectType==="coins"?"selected":""}>Monedas</option>
                <option value="demerit" ${a.effectType==="demerit"?"selected":""}>Demérito</option>
                <option value="task" ${a.effectType==="task"?"selected":""}>Tarea Sorpresa</option>
              </select>
              <input type="number" class="form-input" style="flex:1" value="${a.effectValue||0}" name="value_${i}" placeholder="Valor" />
            </div>
          `).join("")}
          <button type="submit" class="btn btn-primary mt-md">Guardar Configuración</button>
        </form>
      </div>
    `:`
      <div style="position:relative; width: 300px; margin: 0 auto;">
        <div class="wheel-pointer"></div>
        <div class="wheel-wrapper">
          <div class="wheel" id="wheel-element">
            ${r.map((a,i)=>`
              <div class="wheel-segment-label" style="transform: rotate(${i*45+22.5}deg);">
                ${a.label}
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      
      <div class="text-center mt-lg">
        <button id="spin-btn" class="btn btn-gold btn-lg" style="width: 200px; font-size: 1.2rem;">✨ GIRAR ✨</button>
      </div>
    `}
  `,setTimeout(()=>{var a;if(s)(a=document.getElementById("wheel-form"))==null||a.addEventListener("submit",async i=>{i.preventDefault();const o=new FormData(i.target),c=[];for(let d=0;d<8;d++)c.push({label:o.get("label_"+d),effectType:o.get("type_"+d),effectValue:parseInt(o.get("value_"+d))||0});try{await l.saveWheelOptions(e.id,c),g("Ruleta configurada con éxito","success")}catch(d){g(d.message,"error")}});else{const i=document.getElementById("spin-btn"),o=document.getElementById("wheel-element");let c=!1;i==null||i.addEventListener("click",async()=>{if(!c){c=!0,i.disabled=!0,i.textContent="Girando...";try{const d=await l.spinWheel(e.id),p=r.findIndex(f=>f.id===d.id||f.label===d.label&&f.effectType===d.effectType),m=360*5+(360-(p*45+22.5));o.style.transform=`rotate(${m}deg)`,setTimeout(()=>{let f=`¡Has ganado: ${d.label}!`;d.effectType==="coins"&&(f+=`
+${d.effectValue} Monedas`),d.effectType==="demerit"&&(f+=`
+${d.effectValue} Deméritos`),alert(f),o.style.transition="none",o.style.transform=`rotate(${m%360}deg)`,o.offsetHeight,o.style.transition="transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)",c=!1,i.textContent="¡Giro Completado!"},4e3)}catch(d){g(d.message,"error"),c=!1,i.disabled=!1,i.textContent="✨ GIRAR ✨"}}})}},50),x("Ruleta",n.outerHTML,"wheel",t.role)}function es(){l.socket&&(l.socket.off("aftercare_trigger"),l.socket.on("aftercare_trigger",t=>{ts(t.title||"Tarea Intensa")}))}function ts(t){if(document.getElementById("aftercare-overlay"))return;const e=document.createElement("div");e.id="aftercare-overlay",e.className="fade-in",Object.assign(e.style,{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundColor:"var(--bg-dark)",zIndex:9999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",color:"var(--text-light)"});const s=document.createElement("div");Object.assign(s.style,{background:"linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2))",padding:"2rem",borderRadius:"20px",border:"1px solid rgba(255, 255, 255, 0.1)",maxWidth:"400px",boxShadow:"0 8px 32px 0 rgba(0, 0, 0, 0.3)",backdropFilter:"blur(10px)"}),s.innerHTML=`
    <div style="font-size: 4rem; margin-bottom: 1rem; animation: pulse 2s infinite;">❤️‍🩹</div>
    <h2 style="margin-bottom: 1rem; font-family: var(--font-display); color: #ff9ff3;">Buen trabajo</h2>
    <p style="margin-bottom: 1.5rem; color: var(--text-secondary); line-height: 1.6;">
      Has completado <b>${t}</b>. Fue una tarea intensa.<br><br>
      Tómate un momento para respirar.<br>
      Bebe un vaso de agua.<br>
      Si lo necesitas, escribe en tu diario.
    </p>
    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="aftercare-close" class="btn btn-outline" style="border-color: #ff9ff3; color: #ff9ff3;">Ya estoy bien</button>
      <button id="aftercare-journal" class="btn btn-primary" style="background: #ff9ff3; color: #000;">Ir al Diario</button>
    </div>
  `,e.appendChild(s),document.body.appendChild(e),document.getElementById("aftercare-close").onclick=()=>{e.style.opacity="0",e.style.transition="opacity 0.5s",setTimeout(()=>e.remove(),500)},document.getElementById("aftercare-journal").onclick=()=>{e.remove(),window.location.hash="/journal/new"}}window._pinUnlocked=!1;k.beforeEach(async t=>{const e=["/login","/register","/"];try{const s=await l.getCurrentUser();if(!s&&!e.includes(t))return"/login";if(s){if(!s.roomId&&!["/create-room","/join-room","/login","/register","/"].includes(t))return s.role==="dom"?"/create-room":"/join-room";if(e.includes(t)){if(!s.roomId)return s.role==="dom"?"/create-room":"/join-room";t="/dashboard"}s.roomId&&["/create-room","/join-room"].includes(t)&&(t="/dashboard")}if(s&&!e.includes(t)&&t!=="/pin-lock"&&!window._pinUnlocked)if(await l.verifyPin(""))window._pinUnlocked=!0;else return"/pin-lock";s&&(l.initSocket(),l.initPush(),es())}catch(s){if(console.error("Guard error:",s),!e.includes(t))return"/login"}return t});k.register("/",Be);k.register("/login",Be);k.register("/register",Lt);k.register("/pin-lock",Pt);k.register("/create-room",Nt);k.register("/join-room",Dt);k.register("/dashboard",Ot);k.register("/tasks",Ut);k.register("/tasks/new",Se);k.register("/tasks/edit/:id",Se);k.register("/tasks/submit/:id",qt);k.register("/tasks/review",Mt);k.register("/tasks/history",jt);k.register("/shop",Ft);k.register("/shop/new",Ae);k.register("/shop/edit/:id",Ae);k.register("/rules",Ht);k.register("/rules/new",Le);k.register("/rules/edit/:id",Le);k.register("/limits",Vt);k.register("/limits/new",Pe);k.register("/limits/edit/:id",Pe);k.register("/demerits",zt);k.register("/demerits/new",Jt);k.register("/calendar",Wt);k.register("/journal",Gt);k.register("/journal/new",De);k.register("/journal/entry/:id",De);k.register("/journal/prompt",Kt);k.register("/guide",Yt);k.register("/menu",Xt);k.register("/achievements",Qt);k.register("/wheel",Zt);const ss=l.getTheme();document.documentElement.setAttribute("data-theme",ss);window._pwaInstallPrompt=null;window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),window._pwaInstallPrompt=t});k.init();
