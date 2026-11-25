(function dartProgram(){function copyProperties(a,b){var t=Object.keys(a)
for(var s=0;s<t.length;s++){var r=t[s]
b[r]=a[r]}}function mixinPropertiesHard(a,b){var t=Object.keys(a)
for(var s=0;s<t.length;s++){var r=t[s]
if(!b.hasOwnProperty(r)){b[r]=a[r]}}}function mixinPropertiesEasy(a,b){Object.assign(b,a)}var z=function(){var t=function(){}
t.prototype={p:{}}
var s=new t()
if(!(Object.getPrototypeOf(s)&&Object.getPrototypeOf(s).p===t.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var r=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(r))return true}}catch(q){}return false}()
function inherit(a,b){a.prototype.constructor=a
a.prototype["$i"+a.name]=a
if(b!=null){if(z){Object.setPrototypeOf(a.prototype,b.prototype)
return}var t=Object.create(b.prototype)
copyProperties(a.prototype,t)
a.prototype=t}}function inheritMany(a,b){for(var t=0;t<b.length;t++){inherit(b[t],a)}}function mixinEasy(a,b){mixinPropertiesEasy(b.prototype,a.prototype)
a.prototype.constructor=a}function mixinHard(a,b){mixinPropertiesHard(b.prototype,a.prototype)
a.prototype.constructor=a}function lazy(a,b,c,d){var t=a
a[b]=t
a[c]=function(){if(a[b]===t){a[b]=d()}a[c]=function(){return this[b]}
return a[b]}}function lazyFinal(a,b,c,d){var t=a
a[b]=t
a[c]=function(){if(a[b]===t){var s=d()
if(a[b]!==t){A.la(b)}a[b]=s}var r=a[b]
a[c]=function(){return r}
return r}}function makeConstList(a,b){if(b!=null)A.c(a,b)
a.$flags=7
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var t=0;t<a.length;++t){convertToFastObject(a[t])}}var y=0
function instanceTearOffGetter(a,b){var t=null
return a?function(c){if(t===null)t=A.fr(b)
return new t(c,this)}:function(){if(t===null)t=A.fr(b)
return new t(this,null)}}function staticTearOffGetter(a){var t=null
return function(){if(t===null)t=A.fr(a).prototype
return t}}var x=0
function tearOffParameters(a,b,c,d,e,f,g,h,i,j){if(typeof h=="number"){h+=x}return{co:a,iS:b,iI:c,rC:d,dV:e,cs:f,fs:g,fT:h,aI:i||0,nDA:j}}function installStaticTearOff(a,b,c,d,e,f,g,h){var t=tearOffParameters(a,true,false,c,d,e,f,g,h,false)
var s=staticTearOffGetter(t)
a[b]=s}function installInstanceTearOff(a,b,c,d,e,f,g,h,i,j){c=!!c
var t=tearOffParameters(a,false,c,d,e,f,g,h,i,!!j)
var s=instanceTearOffGetter(c,t)
a[b]=s}function setOrUpdateInterceptorsByTag(a){var t=v.interceptorsByTag
if(!t){v.interceptorsByTag=a
return}copyProperties(a,t)}function setOrUpdateLeafTags(a){var t=v.leafTags
if(!t){v.leafTags=a
return}copyProperties(a,t)}function updateTypes(a){var t=v.types
var s=t.length
t.push.apply(t,a)
return s}function updateHolder(a,b){copyProperties(b,a)
return a}var hunkHelpers=function(){var t=function(a,b,c,d,e){return function(f,g,h,i){return installInstanceTearOff(f,g,a,b,c,d,[h],i,e,false)}},s=function(a,b,c,d){return function(e,f,g,h){return installStaticTearOff(e,f,a,b,c,[g],h,d)}}
return{inherit:inherit,inheritMany:inheritMany,mixin:mixinEasy,mixinHard:mixinHard,installStaticTearOff:installStaticTearOff,installInstanceTearOff:installInstanceTearOff,_instance_0u:t(0,0,null,["$0"],0),_instance_1u:t(0,1,null,["$1"],0),_instance_2u:t(0,2,null,["$2"],0),_instance_0i:t(1,0,null,["$0"],0),_instance_1i:t(1,1,null,["$1"],0),_instance_2i:t(1,2,null,["$2"],0),_static_0:s(0,null,["$0"],0),_static_1:s(1,null,["$1"],0),_static_2:s(2,null,["$2"],0),makeConstList:makeConstList,lazy:lazy,lazyFinal:lazyFinal,updateHolder:updateHolder,convertToFastObject:convertToFastObject,updateTypes:updateTypes,setOrUpdateInterceptorsByTag:setOrUpdateInterceptorsByTag,setOrUpdateLeafTags:setOrUpdateLeafTags}}()
function initializeDeferredHunk(a){x=v.types.length
a(hunkHelpers,v,w,$)}var J={
fv(a,b,c,d){return{i:a,p:b,e:c,x:d}},
eB(a){var t,s,r,q,p,o="_$dart_js",n=a[v.dispatchPropertyName]
if(n==null)if($.ft==null){A.kN()
n=a[v.dispatchPropertyName]}if(n!=null){t=n.p
if(!1===t)return n.i
if(!0===t)return a
s=Object.getPrototypeOf(a)
if(t===s)return n.i
if(n.e===s)throw A.d(A.h2("Return interceptor for "+A.o(t(a,n))))}r=a.constructor
if(r==null)q=null
else{p=$.dO
if(p==null)p=$.dO=A.eA(o)
q=r[p]}if(q!=null)return q
q=A.kS(a)
if(q!=null)return q
if(typeof a=="function")return B.az
t=Object.getPrototypeOf(a)
if(t==null)return B.a3
if(t===Object.prototype)return B.a3
if(typeof r=="function"){p=$.dO
if(p==null)p=$.dO=A.eA(o)
Object.defineProperty(r,p,{value:B.N,enumerable:false,writable:true,configurable:true})
return B.N}return B.N},
iv(a,b){if(a<0||a>4294967295)throw A.d(A.bU(a,0,4294967295,"length",null))
return J.iw(new Array(a),b)},
fO(a,b){if(a<0)throw A.d(A.P("Length must be a non-negative integer: "+a))
return A.c(new Array(a),b.h("k<0>"))},
fN(a,b){if(a<0)throw A.d(A.P("Length must be a non-negative integer: "+a))
return A.c(new Array(a),b.h("k<0>"))},
iw(a,b){var t=A.c(a,b.h("k<0>"))
t.$flags=1
return t},
ix(a,b){var t=u.B
return J.ia(t.a(a),t.a(b))},
b1(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.bx.prototype
return J.cw.prototype}if(typeof a=="string")return J.aO.prototype
if(a==null)return J.by.prototype
if(typeof a=="boolean")return J.cv.prototype
if(Array.isArray(a))return J.k.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.b9.prototype
if(typeof a=="bigint")return J.b8.prototype
return a}if(a instanceof A.p)return a
return J.eB(a)},
cY(a){if(typeof a=="string")return J.aO.prototype
if(a==null)return a
if(Array.isArray(a))return J.k.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.b9.prototype
if(typeof a=="bigint")return J.b8.prototype
return a}if(a instanceof A.p)return a
return J.eB(a)},
cZ(a){if(a==null)return a
if(Array.isArray(a))return J.k.prototype
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.b9.prototype
if(typeof a=="bigint")return J.b8.prototype
return a}if(a instanceof A.p)return a
return J.eB(a)},
kI(a){if(typeof a=="number")return J.b7.prototype
if(typeof a=="string")return J.aO.prototype
if(a==null)return a
if(!(a instanceof A.p))return J.bh.prototype
return a},
kJ(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.am.prototype
if(typeof a=="symbol")return J.b9.prototype
if(typeof a=="bigint")return J.b8.prototype
return a}if(a instanceof A.p)return a
return J.eB(a)},
ak(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.b1(a).W(a,b)},
eW(a,b){return J.cZ(a).i(a,b)},
i8(a,b){return J.cZ(a).R(a,b)},
i9(a){return J.kJ(a).aP(a)},
ia(a,b){return J.kI(a).U(a,b)},
eX(a,b){return J.cZ(a).E(a,b)},
d0(a){return J.cZ(a).gG(a)},
al(a){return J.b1(a).gu(a)},
fC(a){return J.cY(a).gv(a)},
fD(a){return J.cY(a).gaZ(a)},
aa(a){return J.cZ(a).gt(a)},
aw(a){return J.cY(a).gm(a)},
ib(a){return J.b1(a).gB(a)},
bq(a){return J.b1(a).l(a)},
ct:function ct(){},
cv:function cv(){},
by:function by(){},
bz:function bz(){},
aB:function aB(){},
cI:function cI(){},
bh:function bh(){},
am:function am(){},
b8:function b8(){},
b9:function b9(){},
k:function k(a){this.$ti=a},
cu:function cu(){},
d7:function d7(a){this.$ti=a},
aI:function aI(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
b7:function b7(){},
bx:function bx(){},
cw:function cw(){},
aO:function aO(){}},A={f_:function f_(){},
ie(a,b,c){if(u.R.b(a))return new A.c4(a,b.h("@<0>").D(c).h("c4<1,2>"))
return new A.aJ(a,b.h("@<0>").D(c).h("aJ<1,2>"))},
fQ(a){return new A.bC("Field '"+a+"' has been assigned during initialization.")},
aE(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
f7(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
hF(a,b,c){return a},
fu(a){var t,s
for(t=$.a3.length,s=0;s<t;++s)if(a===$.a3[s])return!0
return!1},
fZ(a,b,c,d){A.f5(b,"start")
if(c!=null){A.f5(c,"end")
if(b>c)A.a8(A.bU(b,0,c,"start",null))}return new A.c_(a,b,c,d.h("c_<0>"))},
iB(a,b,c,d){if(u.R.b(a))return new A.bu(a,b,c.h("@<0>").D(d).h("bu<1,2>"))
return new A.af(a,b,c.h("@<0>").D(d).h("af<1,2>"))},
d6(a,b,c){return new A.bt(a,b,c.h("bt<0>"))},
aN(){return new A.bZ("No element")},
bj:function bj(){},
br:function br(a,b){this.a=a
this.$ti=b},
aJ:function aJ(a,b){this.a=a
this.$ti=b},
c4:function c4(a,b){this.a=a
this.$ti=b},
aK:function aK(a,b){this.a=a
this.$ti=b},
d2:function d2(a,b){this.a=a
this.b=b},
d1:function d1(a){this.a=a},
bC:function bC(a){this.a=a},
dz:function dz(){},
i:function i(){},
D:function D(){},
c_:function c_(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.$ti=d},
aQ:function aQ(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
af:function af(a,b,c){this.a=a
this.b=b
this.$ti=c},
bu:function bu(a,b,c){this.a=a
this.b=b
this.$ti=c},
bG:function bG(a,b,c){var _=this
_.a=null
_.b=a
_.c=b
_.$ti=c},
L:function L(a,b,c){this.a=a
this.b=b
this.$ti=c},
v:function v(a,b,c){this.a=a
this.b=b
this.$ti=c},
c2:function c2(a,b,c){this.a=a
this.b=b
this.$ti=c},
bw:function bw(a,b,c){this.a=a
this.b=b
this.$ti=c},
bt:function bt(a,b,c){this.a=a
this.b=b
this.$ti=c},
a_:function a_(a,b,c){var _=this
_.a=a
_.b=b
_.c=-1
_.$ti=c},
S:function S(){},
bV:function bV(a,b){this.a=a
this.$ti=b},
il(){throw A.d(A.dG("Cannot modify constant Set"))},
hS(a){var t=A.hR(a)
if(t!=null)return t
return"minified:"+a},
lI(a,b){var t
if(b!=null){t=b.x
if(t!=null)return t}return u.da.b(a)},
o(a){var t
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
t=J.bq(a)
return t},
bR(a){var t,s=$.fU
if(s==null)s=$.fU=Symbol("identityHashCode")
t=a[s]
if(t==null){t=Math.random()*0x3fffffff|0
a[s]=t}return t},
iL(a,b){var t,s=/^\s*[+-]?((0x[a-f0-9]+)|(\d+)|([a-z0-9]+))\s*$/i.exec(a)
if(s==null)return null
if(3>=s.length)return A.a(s,3)
t=s[3]
if(t!=null)return parseInt(a,10)
if(s[2]!=null)return parseInt(a,16)
return null},
cJ(a){var t,s,r,q
if(a instanceof A.p)return A.a2(A.bo(a),null)
t=J.b1(a)
if(t===B.ay||t===B.aA||u.cr.b(a)){s=B.R(a)
if(s!=="Object"&&s!=="")return s
r=a.constructor
if(typeof r=="function"){q=r.name
if(typeof q=="string"&&q!=="Object"&&q!=="")return q}}return A.a2(A.bo(a),null)},
fV(a){var t,s,r
if(a==null||typeof a=="number"||A.fn(a))return J.bq(a)
if(typeof a=="string")return JSON.stringify(a)
if(a instanceof A.ay)return a.l(0)
if(a instanceof A.aG)return a.aO(!0)
t=$.i7()
for(s=0;s<1;++s){r=t[s].bD(a)
if(r!=null)return r}return"Instance of '"+A.cJ(a)+"'"},
R(a){var t
if(a<=65535)return String.fromCharCode(a)
if(a<=1114111){t=a-65536
return String.fromCharCode((B.b.a3(t,10)|55296)>>>0,t&1023|56320)}throw A.d(A.bU(a,0,1114111,null,null))},
a(a,b){if(a==null)J.aw(a)
throw A.d(A.fs(a,b))},
fs(a,b){var t,s="index"
if(!A.hu(b))return new A.ab(!0,b,s,null)
t=J.aw(a)
if(b<0||b>=t)return A.eY(b,t,a,s)
return new A.bT(null,null,!0,b,s,"Value not in range")},
fq(a){return new A.ab(!0,a,null,null)},
d(a){return A.O(a,new Error())},
O(a,b){var t
if(a==null)a=new A.c0()
b.dartException=a
t=A.lg
if("defineProperty" in Object){Object.defineProperty(b,"message",{get:t})
b.name=""}else b.toString=t
return b},
lg(){return J.bq(this.dartException)},
a8(a,b){throw A.O(a,b==null?new Error():b)},
F(a,b,c){var t
if(b==null)b=0
if(c==null)c=0
t=Error()
A.a8(A.jz(a,b,c),t)},
jz(a,b,c){var t,s,r,q,p,o,n,m,l
if(typeof b=="string")t=b
else{s="[]=;add;removeWhere;retainWhere;removeRange;setRange;setInt8;setInt16;setInt32;setUint8;setUint16;setUint32;setFloat32;setFloat64".split(";")
r=s.length
q=b
if(q>r){c=q/r|0
q%=r}t=s[q]}p=typeof c=="string"?c:"modify;remove from;add to".split(";")[c]
o=u.j.b(a)?"list":"ByteData"
n=a.$flags|0
m="a "
if((n&4)!==0)l="constant "
else if((n&2)!==0){l="unmodifiable "
m="an "}else l=(n&1)!==0?"fixed-length ":""
return new A.c1("'"+t+"': Cannot "+p+" "+m+l+o)},
h(a){throw A.d(A.Q(a))},
at(a){var t,s,r,q,p,o
a=A.kX(a.replace(String({}),"$receiver$"))
t=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(t==null)t=A.c([],u.s)
s=t.indexOf("\\$arguments\\$")
r=t.indexOf("\\$argumentsExpr\\$")
q=t.indexOf("\\$expr\\$")
p=t.indexOf("\\$method\\$")
o=t.indexOf("\\$receiver\\$")
return new A.dC(a.replace(new RegExp("\\\\\\$arguments\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$argumentsExpr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$expr\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$method\\\\\\$","g"),"((?:x|[^x])*)").replace(new RegExp("\\\\\\$receiver\\\\\\$","g"),"((?:x|[^x])*)"),s,r,q,p,o)},
dD(a){return function($expr$){var $argumentsExpr$="$arguments$"
try{$expr$.$method$($argumentsExpr$)}catch(t){return t.message}}(a)},
h1(a){return function($expr$){try{$expr$.$method$}catch(t){return t.message}}(a)},
f0(a,b){var t=b==null,s=t?null:b.method
return new A.cx(a,s,t?null:b.receiver)},
ci(a){if(a==null)return new A.dg(a)
if(typeof a!=="object")return a
if("dartException" in a)return A.b3(a,a.dartException)
return A.kp(a)},
b3(a,b){if(u.C.b(b))if(b.$thrownJsError==null)b.$thrownJsError=a
return b},
kp(a){var t,s,r,q,p,o,n,m,l,k,j,i,h
if(!("message" in a))return a
t=a.message
if("number" in a&&typeof a.number=="number"){s=a.number
r=s&65535
if((B.b.a3(s,16)&8191)===10)switch(r){case 438:return A.b3(a,A.f0(A.o(t)+" (Error "+r+")",null))
case 445:case 5007:A.o(t)
return A.b3(a,new A.bO())}}if(a instanceof TypeError){q=$.hV()
p=$.hW()
o=$.hX()
n=$.hY()
m=$.i0()
l=$.i1()
k=$.i_()
$.hZ()
j=$.i3()
i=$.i2()
h=q.O(t)
if(h!=null)return A.b3(a,A.f0(A.Y(t),h))
else{h=p.O(t)
if(h!=null){h.method="call"
return A.b3(a,A.f0(A.Y(t),h))}else if(o.O(t)!=null||n.O(t)!=null||m.O(t)!=null||l.O(t)!=null||k.O(t)!=null||n.O(t)!=null||j.O(t)!=null||i.O(t)!=null){A.Y(t)
return A.b3(a,new A.bO())}}return A.b3(a,new A.cP(typeof t=="string"?t:""))}if(a instanceof RangeError){if(typeof t=="string"&&t.indexOf("call stack")!==-1)return new A.bY()
t=function(b){try{return String(b)}catch(g){}return null}(a)
return A.b3(a,new A.ab(!1,null,null,typeof t=="string"?t.replace(/^RangeError:\s*/,""):t))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof t=="string"&&t==="too much recursion")return new A.bY()
return a},
fw(a){if(a==null)return J.al(a)
if(typeof a=="object")return A.bR(a)
return J.al(a)},
kv(a){if(typeof a=="number")return B.e.gu(a)
if(a instanceof A.cW)return A.bR(a)
if(a instanceof A.aG)return a.gu(a)
return A.fw(a)},
kG(a,b){var t,s,r,q=a.length
for(t=0;t<q;t=r){s=t+1
r=s+1
b.j(0,a[t],a[s])}return b},
jM(a,b,c,d,e,f){u.Z.a(a)
switch(A.B(b)){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw A.d(A.im("Unsupported number of arguments for wrapped closure"))},
kw(a,b){var t=a.$identity
if(!!t)return t
t=A.kx(a,b)
a.$identity=t
return t},
kx(a,b){var t
switch(b){case 0:t=a.$0
break
case 1:t=a.$1
break
case 2:t=a.$2
break
case 3:t=a.$3
break
case 4:t=a.$4
break
default:t=null}if(t!=null)return t.bind(a)
return function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,A.jM)},
ik(a1){var t,s,r,q,p,o,n,m,l,k,j=a1.co,i=a1.iS,h=a1.iI,g=a1.nDA,f=a1.aI,e=a1.fs,d=a1.cs,c=e[0],b=d[0],a=j[c],a0=a1.fT
a0.toString
t=i?Object.create(new A.cM().constructor.prototype):Object.create(new A.b4(null,null).constructor.prototype)
t.$initialize=t.constructor
s=i?function static_tear_off(){this.$initialize()}:function tear_off(a2,a3){this.$initialize(a2,a3)}
t.constructor=s
s.prototype=t
t.$_name=c
t.$_target=a
r=!i
if(r)q=A.fK(c,a,h,g)
else{t.$static_name=c
q=a}t.$S=A.ig(a0,i,h)
t[b]=q
for(p=q,o=1;o<e.length;++o){n=e[o]
if(typeof n=="string"){m=j[n]
l=n
n=m}else l=""
k=d[o]
if(k!=null){if(r)n=A.fK(l,n,h,g)
t[k]=n}if(o===f)p=n}t.$C=p
t.$R=a1.rC
t.$D=a1.dV
return s},
ig(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.d("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.ic)}throw A.d("Error in functionType of tearoff")},
ih(a,b,c,d){var t=A.fJ
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,t)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,t)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,t)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,t)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,t)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,t)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,t)}},
fK(a,b,c,d){if(c)return A.ij(a,b,d)
return A.ih(b.length,d,a,b)},
ii(a,b,c,d){var t=A.fJ,s=A.id
switch(b?-1:a){case 0:throw A.d(new A.cK("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,s,t)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,s,t)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,s,t)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,s,t)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,s,t)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,s,t)
default:return function(e,f,g){return function(){var r=[g(this)]
Array.prototype.push.apply(r,arguments)
return e.apply(f(this),r)}}(d,s,t)}},
ij(a,b,c){var t,s
if($.fH==null)$.fH=A.fG("interceptor")
if($.fI==null)$.fI=A.fG("receiver")
t=b.length
s=A.ii(t,c,a,b)
return s},
fr(a){return A.ik(a)},
ic(a,b){return A.cf(v.typeUniverse,A.bo(a.a),b)},
fJ(a){return a.a},
id(a){return a.b},
fG(a){var t,s,r,q=new A.b4("receiver","interceptor"),p=Object.getOwnPropertyNames(q)
p.$flags=1
t=p
for(p=t.length,s=0;s<p;++s){r=t[s]
if(q[r]===a)return r}throw A.d(A.P("Field name "+a+" not found."))},
eA(a){return v.getIsolateTag(a)},
lH(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
kS(a){var t,s,r,q,p,o=A.Y($.hI.$1(a)),n=$.ez[o]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.eF[o]
if(t!=null)return t
s=v.interceptorsByTag[o]
if(s==null){r=A.av($.hD.$2(a,o))
if(r!=null){n=$.ez[r]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.eF[r]
if(t!=null)return t
s=v.interceptorsByTag[r]
o=r}}if(s==null)return null
t=s.prototype
q=o[0]
if(q==="!"){n=A.eK(t)
$.ez[o]=n
Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}if(q==="~"){$.eF[o]=t
return t}if(q==="-"){p=A.eK(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}if(q==="+")return A.hJ(a,t)
if(q==="*")throw A.d(A.h2(o))
if(v.leafTags[o]===true){p=A.eK(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}else return A.hJ(a,t)},
hJ(a,b){var t=Object.getPrototypeOf(a)
Object.defineProperty(t,v.dispatchPropertyName,{value:J.fv(b,t,null,null),enumerable:false,writable:true,configurable:true})
return b},
eK(a){return J.fv(a,!1,null,!!a.$ia0)},
kU(a,b,c){var t=b.prototype
if(v.leafTags[a]===true)return A.eK(t)
else return J.fv(t,c,null,null)},
kN(){if(!0===$.ft)return
$.ft=!0
A.kO()},
kO(){var t,s,r,q,p,o,n,m
$.ez=Object.create(null)
$.eF=Object.create(null)
A.kM()
t=v.interceptorsByTag
s=Object.getOwnPropertyNames(t)
if(typeof window!="undefined"){window
r=function(){}
for(q=0;q<s.length;++q){p=s[q]
o=$.hL.$1(p)
if(o!=null){n=A.kU(p,t[p],o)
if(n!=null){Object.defineProperty(o,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
r.prototype=o}}}}for(q=0;q<s.length;++q){p=s[q]
if(/^[A-Za-z_]/.test(p)){m=t[p]
t["!"+p]=m
t["~"+p]=m
t["-"+p]=m
t["+"+p]=m
t["*"+p]=m}}},
kM(){var t,s,r,q,p,o,n=B.ab()
n=A.bn(B.ac,A.bn(B.ad,A.bn(B.S,A.bn(B.S,A.bn(B.ae,A.bn(B.af,A.bn(B.ag(B.R),n)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){t=dartNativeDispatchHooksTransformer
if(typeof t=="function")t=[t]
if(Array.isArray(t))for(s=0;s<t.length;++s){r=t[s]
if(typeof r=="function")n=r(n)||n}}q=n.getTag
p=n.getUnknownTag
o=n.prototypeForTag
$.hI=new A.eC(q)
$.hD=new A.eD(p)
$.hL=new A.eE(o)},
bn(a,b){return a(b)||b},
kz(a,b){var t=b.length,s=v.rttc[""+t+";"+a]
if(s==null)return null
if(t===0)return s
if(t===s.length)return s.apply(null,b)
return s(b)},
l9(a,b,c){var t=a.indexOf(b,c)
return t>=0},
kX(a){if(/[[\]{}()*+?.\\^$|]/.test(a))return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
return a},
au:function au(a,b){this.a=a
this.b=b},
c5:function c5(a,b,c){var _=this
_.a=a
_.b=b
_.c=0
_.d=null
_.$ti=c},
bs:function bs(){},
aM:function aM(a,b){this.a=a
this.$ti=b},
bX:function bX(){},
dC:function dC(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
bO:function bO(){},
cx:function cx(a,b,c){this.a=a
this.b=b
this.c=c},
cP:function cP(a){this.a=a},
dg:function dg(a){this.a=a},
ay:function ay(){},
cl:function cl(){},
cm:function cm(){},
cN:function cN(){},
cM:function cM(){},
b4:function b4(a,b){this.a=a
this.b=b},
cK:function cK(a){this.a=a},
an:function an(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
d8:function d8(a){this.a=a},
dc:function dc(a,b){this.a=a
this.b=b
this.c=null},
aP:function aP(a,b){this.a=a
this.$ti=b},
bF:function bF(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bD:function bD(a,b){this.a=a
this.$ti=b},
bE:function bE(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=null
_.$ti=d},
bA:function bA(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
eC:function eC(a){this.a=a},
eD:function eD(a){this.a=a},
eE:function eE(a){this.a=a},
aG:function aG(){},
bk:function bk(){},
la(a){throw A.O(A.fQ(a),new Error())},
hP(){throw A.O(A.fQ(""),new Error())},
dL(a){var t=new A.dK(a)
return t.b=t},
dK:function dK(a){this.a=a
this.b=null},
jt(a){return a},
iD(a,b,c){var t=new DataView(a,b)
return t},
iE(a){return new Uint16Array(a)},
aR:function aR(){},
bK:function bK(){},
dU:function dU(a){this.a=a},
cz:function cz(){},
ba:function ba(){},
bI:function bI(){},
bJ:function bJ(){},
cA:function cA(){},
cB:function cB(){},
cC:function cC(){},
cD:function cD(){},
cE:function cE(){},
cF:function cF(){},
cG:function cG(){},
bL:function bL(){},
bM:function bM(){},
c6:function c6(){},
c7:function c7(){},
c8:function c8(){},
c9:function c9(){},
f6(a,b){var t=b.c
return t==null?b.c=A.cd(a,"fL",[b.x]):t},
fW(a){var t=a.w
if(t===6||t===7)return A.fW(a.x)
return t===11||t===12},
iN(a){return a.as},
ch(a){return A.dT(v.typeUniverse,a,!1)},
aZ(a0,a1,a2,a3){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a=a1.w
switch(a){case 5:case 1:case 2:case 3:case 4:return a1
case 6:t=a1.x
s=A.aZ(a0,t,a2,a3)
if(s===t)return a1
return A.hg(a0,s,!0)
case 7:t=a1.x
s=A.aZ(a0,t,a2,a3)
if(s===t)return a1
return A.hf(a0,s,!0)
case 8:r=a1.y
q=A.bm(a0,r,a2,a3)
if(q===r)return a1
return A.cd(a0,a1.x,q)
case 9:p=a1.x
o=A.aZ(a0,p,a2,a3)
n=a1.y
m=A.bm(a0,n,a2,a3)
if(o===p&&m===n)return a1
return A.fh(a0,o,m)
case 10:l=a1.x
k=a1.y
j=A.bm(a0,k,a2,a3)
if(j===k)return a1
return A.hh(a0,l,j)
case 11:i=a1.x
h=A.aZ(a0,i,a2,a3)
g=a1.y
f=A.kh(a0,g,a2,a3)
if(h===i&&f===g)return a1
return A.he(a0,h,f)
case 12:e=a1.y
a3+=e.length
d=A.bm(a0,e,a2,a3)
p=a1.x
o=A.aZ(a0,p,a2,a3)
if(d===e&&o===p)return a1
return A.fi(a0,o,d,!0)
case 13:c=a1.x
if(c<a3)return a1
b=a2[c-a3]
if(b==null)return a1
return b
default:throw A.d(A.ck("Attempted to substitute unexpected RTI kind "+a))}},
bm(a,b,c,d){var t,s,r,q,p=b.length,o=A.dV(p)
for(t=!1,s=0;s<p;++s){r=b[s]
q=A.aZ(a,r,c,d)
if(q!==r)t=!0
o[s]=q}return t?o:b},
ki(a,b,c,d){var t,s,r,q,p,o,n=b.length,m=A.dV(n)
for(t=!1,s=0;s<n;s+=3){r=b[s]
q=b[s+1]
p=b[s+2]
o=A.aZ(a,p,c,d)
if(o!==p)t=!0
m.splice(s,3,r,q,o)}return t?m:b},
kh(a,b,c,d){var t,s=b.a,r=A.bm(a,s,c,d),q=b.b,p=A.bm(a,q,c,d),o=b.c,n=A.ki(a,o,c,d)
if(r===s&&p===q&&n===o)return b
t=new A.cS()
t.a=r
t.b=p
t.c=n
return t},
c(a,b){a[v.arrayRti]=b
return a},
hG(a){var t=a.$S
if(t!=null){if(typeof t=="number")return A.kL(t)
return a.$S()}return null},
kP(a,b){var t
if(A.fW(b))if(a instanceof A.ay){t=A.hG(a)
if(t!=null)return t}return A.bo(a)},
bo(a){if(a instanceof A.p)return A.l(a)
if(Array.isArray(a))return A.w(a)
return A.fm(J.b1(a))},
w(a){var t=a[v.arrayRti],s=u.b
if(t==null)return s
if(t.constructor!==s.constructor)return s
return t},
l(a){var t=a.$ti
return t!=null?t:A.fm(a)},
fm(a){var t=a.constructor,s=t.$ccache
if(s!=null)return s
return A.jK(a,t)},
jK(a,b){var t=a instanceof A.ay?Object.getPrototypeOf(Object.getPrototypeOf(a)).constructor:b,s=A.jh(v.typeUniverse,t.name)
b.$ccache=s
return s},
kL(a){var t,s=v.types,r=s[a]
if(typeof r=="string"){t=A.dT(v.typeUniverse,r,!1)
s[a]=t
return t}return r},
kK(a){return A.b0(A.l(a))},
fp(a){var t
if(a instanceof A.aG)return A.kF(a.$r,a.aK())
t=a instanceof A.ay?A.hG(a):null
if(t!=null)return t
if(u.bW.b(a))return J.ib(a).a
if(Array.isArray(a))return A.w(a)
return A.bo(a)},
b0(a){var t=a.r
return t==null?a.r=new A.cW(a):t},
kF(a,b){var t,s,r=b,q=r.length
if(q===0)return u.F
if(0>=q)return A.a(r,0)
t=A.cf(v.typeUniverse,A.fp(r[0]),"@<0>")
for(s=1;s<q;++s){if(!(s<r.length))return A.a(r,s)
t=A.hj(v.typeUniverse,t,A.fp(r[s]))}return A.cf(v.typeUniverse,t,a)},
ah(a){return A.b0(A.dT(v.typeUniverse,a,!1))},
jJ(a){var t=this
t.b=A.ka(t)
return t.b(a)},
ka(a){var t,s,r,q,p
if(a===u.K)return A.jT
if(A.b2(a))return A.jX
t=a.w
if(t===6)return A.jF
if(t===1)return A.hw
if(t===7)return A.jN
s=A.k8(a)
if(s!=null)return s
if(t===8){r=a.x
if(a.y.every(A.b2)){a.f="$i"+r
if(r==="m")return A.jR
if(a===u.m)return A.jP
return A.jW}}else if(t===10){q=A.kz(a.x,a.y)
p=q==null?A.hw:q
return p==null?A.hn(p):p}return A.jD},
k8(a){if(a.w===8){if(a===u.S)return A.hu
if(a===u.i||a===u.n)return A.jS
if(a===u.N)return A.jV
if(a===u.y)return A.fn}return null},
jI(a){var t=this,s=A.jC
if(A.b2(t))s=A.jn
else if(t===u.K)s=A.hn
else if(A.bp(t)){s=A.jE
if(t===u.I)s=A.bl
else if(t===u.aD)s=A.av
else if(t===u.cG)s=A.fj
else if(t===u.ae)s=A.cg
else if(t===u.dd)s=A.jl
else if(t===u.aQ)s=A.hm}else if(t===u.S)s=A.B
else if(t===u.N)s=A.Y
else if(t===u.y)s=A.jj
else if(t===u.n)s=A.cX
else if(t===u.i)s=A.jk
else if(t===u.m)s=A.jm
t.a=s
return t.a(a)},
jD(a){var t=this
if(a==null)return A.bp(t)
return A.kQ(v.typeUniverse,A.kP(a,t),t)},
jF(a){if(a==null)return!0
return this.x.b(a)},
jW(a){var t,s=this
if(a==null)return A.bp(s)
t=s.f
if(a instanceof A.p)return!!a[t]
return!!J.b1(a)[t]},
jR(a){var t,s=this
if(a==null)return A.bp(s)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
t=s.f
if(a instanceof A.p)return!!a[t]
return!!J.b1(a)[t]},
jP(a){var t=this
if(a==null)return!1
if(typeof a=="object"){if(a instanceof A.p)return!!a[t.f]
return!0}if(typeof a=="function")return!0
return!1},
hv(a){if(typeof a=="object"){if(a instanceof A.p)return u.m.b(a)
return!0}if(typeof a=="function")return!0
return!1},
jC(a){var t=this
if(a==null){if(A.bp(t))return a}else if(t.b(a))return a
throw A.O(A.hq(a,t),new Error())},
jE(a){var t=this
if(a==null||t.b(a))return a
throw A.O(A.hq(a,t),new Error())},
hq(a,b){return new A.cb("TypeError: "+A.h9(a,A.a2(b,null)))},
h9(a,b){return A.cq(a)+": type '"+A.a2(A.fp(a),null)+"' is not a subtype of type '"+b+"'"},
a7(a,b){return new A.cb("TypeError: "+A.h9(a,b))},
jN(a){var t=this
return t.x.b(a)||A.f6(v.typeUniverse,t).b(a)},
jT(a){return a!=null},
hn(a){if(a!=null)return a
throw A.O(A.a7(a,"Object"),new Error())},
jX(a){return!0},
jn(a){return a},
hw(a){return!1},
fn(a){return!0===a||!1===a},
jj(a){if(!0===a)return!0
if(!1===a)return!1
throw A.O(A.a7(a,"bool"),new Error())},
fj(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.O(A.a7(a,"bool?"),new Error())},
jk(a){if(typeof a=="number")return a
throw A.O(A.a7(a,"double"),new Error())},
jl(a){if(typeof a=="number")return a
if(a==null)return a
throw A.O(A.a7(a,"double?"),new Error())},
hu(a){return typeof a=="number"&&Math.floor(a)===a},
B(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.O(A.a7(a,"int"),new Error())},
bl(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.O(A.a7(a,"int?"),new Error())},
jS(a){return typeof a=="number"},
cX(a){if(typeof a=="number")return a
throw A.O(A.a7(a,"num"),new Error())},
cg(a){if(typeof a=="number")return a
if(a==null)return a
throw A.O(A.a7(a,"num?"),new Error())},
jV(a){return typeof a=="string"},
Y(a){if(typeof a=="string")return a
throw A.O(A.a7(a,"String"),new Error())},
av(a){if(typeof a=="string")return a
if(a==null)return a
throw A.O(A.a7(a,"String?"),new Error())},
jm(a){if(A.hv(a))return a
throw A.O(A.a7(a,"JSObject"),new Error())},
hm(a){if(a==null)return a
if(A.hv(a))return a
throw A.O(A.a7(a,"JSObject?"),new Error())},
hy(a,b){var t,s,r
for(t="",s="",r=0;r<a.length;++r,s=", ")t+=s+A.a2(a[r],b)
return t},
k3(a,b){var t,s,r,q,p,o,n=a.x,m=a.y
if(""===n)return"("+A.hy(m,b)+")"
t=m.length
s=n.split(",")
r=s.length-t
for(q="(",p="",o=0;o<t;++o,p=", "){q+=p
if(r===0)q+="{"
q+=A.a2(m[o],b)
if(r>=0)q+=" "+s[r];++r}return q+"})"},
hr(a2,a3,a4){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0=", ",a1=null
if(a4!=null){t=a4.length
if(a3==null)a3=A.c([],u.s)
else a1=a3.length
s=a3.length
for(r=t;r>0;--r)B.a.i(a3,"T"+(s+r))
for(q=u.X,p="<",o="",r=0;r<t;++r,o=a0){n=a3.length
m=n-1-r
if(!(m>=0))return A.a(a3,m)
p=p+o+a3[m]
l=a4[r]
k=l.w
if(!(k===2||k===3||k===4||k===5||l===q))p+=" extends "+A.a2(l,a3)}p+=">"}else p=""
q=a2.x
j=a2.y
i=j.a
h=i.length
g=j.b
f=g.length
e=j.c
d=e.length
c=A.a2(q,a3)
for(b="",a="",r=0;r<h;++r,a=a0)b+=a+A.a2(i[r],a3)
if(f>0){b+=a+"["
for(a="",r=0;r<f;++r,a=a0)b+=a+A.a2(g[r],a3)
b+="]"}if(d>0){b+=a+"{"
for(a="",r=0;r<d;r+=3,a=a0){b+=a
if(e[r+1])b+="required "
b+=A.a2(e[r+2],a3)+" "+e[r]}b+="}"}if(a1!=null){a3.toString
a3.length=a1}return p+"("+b+") => "+c},
a2(a,b){var t,s,r,q,p,o,n,m=a.w
if(m===5)return"erased"
if(m===2)return"dynamic"
if(m===3)return"void"
if(m===1)return"Never"
if(m===4)return"any"
if(m===6){t=a.x
s=A.a2(t,b)
r=t.w
return(r===11||r===12?"("+s+")":s)+"?"}if(m===7)return"FutureOr<"+A.a2(a.x,b)+">"
if(m===8){q=A.ko(a.x)
p=a.y
return p.length>0?q+("<"+A.hy(p,b)+">"):q}if(m===10)return A.k3(a,b)
if(m===11)return A.hr(a,b,null)
if(m===12)return A.hr(a.x,b,a.y)
if(m===13){o=a.x
n=b.length
o=n-1-o
if(!(o>=0&&o<n))return A.a(b,o)
return b[o]}return"?"},
ko(a){var t=A.hR(a)
if(t!=null)return t
return"minified:"+a},
ji(a,b){var t=a.tR[b]
while(typeof t=="string")t=a.tR[t]
return t},
jh(a,b){var t,s,r,q,p,o=a.eT,n=o[b]
if(n==null)return A.dT(a,b,!1)
else if(typeof n=="number"){t=n
s=A.ce(a,5,"#")
r=A.dV(t)
for(q=0;q<t;++q)r[q]=s
p=A.cd(a,b,r)
o[b]=p
return p}else return n},
jg(a,b){return A.hk(a.tR,b)},
jf(a,b){return A.hk(a.eT,b)},
dT(a,b,c){var t,s=a.eC,r=s.get(b)
if(r!=null)return r
t=A.hi(a,null,b,!1)
s.set(b,t)
return t},
cf(a,b,c){var t,s,r=b.z
if(r==null)r=b.z=new Map()
t=r.get(c)
if(t!=null)return t
s=A.hi(a,b,c,!0)
r.set(c,s)
return s},
hj(a,b,c){var t,s,r,q=b.Q
if(q==null)q=b.Q=new Map()
t=c.as
s=q.get(t)
if(s!=null)return s
r=A.fh(a,b,c.w===9?c.y:[c])
q.set(t,r)
return r},
hi(a,b,c,d){return A.j8(A.j2(a,b,c,d))},
aH(a,b){b.a=A.jI
b.b=A.jJ
return b},
ce(a,b,c){var t,s,r=a.eC.get(c)
if(r!=null)return r
t=new A.ag(null,null)
t.w=b
t.as=c
s=A.aH(a,t)
a.eC.set(c,s)
return s},
hg(a,b,c){var t,s=b.as+"?",r=a.eC.get(s)
if(r!=null)return r
t=A.jd(a,b,s,c)
a.eC.set(s,t)
return t},
jd(a,b,c,d){var t,s,r
if(d){t=b.w
s=!0
if(!A.b2(b))if(!(b===u.P||b===u.u))if(t!==6)s=t===7&&A.bp(b.x)
if(s)return b
else if(t===1)return u.P}r=new A.ag(null,null)
r.w=6
r.x=b
r.as=c
return A.aH(a,r)},
hf(a,b,c){var t,s=b.as+"/",r=a.eC.get(s)
if(r!=null)return r
t=A.jb(a,b,s,c)
a.eC.set(s,t)
return t},
jb(a,b,c,d){var t,s
if(d){t=b.w
if(A.b2(b)||b===u.K)return b
else if(t===1)return A.cd(a,"fL",[b])
else if(b===u.P||b===u.u)return u.bc}s=new A.ag(null,null)
s.w=7
s.x=b
s.as=c
return A.aH(a,s)},
je(a,b){var t,s,r=""+b+"^",q=a.eC.get(r)
if(q!=null)return q
t=new A.ag(null,null)
t.w=13
t.x=b
t.as=r
s=A.aH(a,t)
a.eC.set(r,s)
return s},
cc(a){var t,s,r,q=a.length
for(t="",s="",r=0;r<q;++r,s=",")t+=s+a[r].as
return t},
ja(a){var t,s,r,q,p,o=a.length
for(t="",s="",r=0;r<o;r+=3,s=","){q=a[r]
p=a[r+1]?"!":":"
t+=s+q+p+a[r+2].as}return t},
cd(a,b,c){var t,s,r,q=b
if(c.length>0)q+="<"+A.cc(c)+">"
t=a.eC.get(q)
if(t!=null)return t
s=new A.ag(null,null)
s.w=8
s.x=b
s.y=c
if(c.length>0)s.c=c[0]
s.as=q
r=A.aH(a,s)
a.eC.set(q,r)
return r},
fh(a,b,c){var t,s,r,q,p,o
if(b.w===9){t=b.x
s=b.y.concat(c)}else{s=c
t=b}r=t.as+(";<"+A.cc(s)+">")
q=a.eC.get(r)
if(q!=null)return q
p=new A.ag(null,null)
p.w=9
p.x=t
p.y=s
p.as=r
o=A.aH(a,p)
a.eC.set(r,o)
return o},
hh(a,b,c){var t,s,r="+"+(b+"("+A.cc(c)+")"),q=a.eC.get(r)
if(q!=null)return q
t=new A.ag(null,null)
t.w=10
t.x=b
t.y=c
t.as=r
s=A.aH(a,t)
a.eC.set(r,s)
return s},
he(a,b,c){var t,s,r,q,p,o=b.as,n=c.a,m=n.length,l=c.b,k=l.length,j=c.c,i=j.length,h="("+A.cc(n)
if(k>0){t=m>0?",":""
h+=t+"["+A.cc(l)+"]"}if(i>0){t=m>0?",":""
h+=t+"{"+A.ja(j)+"}"}s=o+(h+")")
r=a.eC.get(s)
if(r!=null)return r
q=new A.ag(null,null)
q.w=11
q.x=b
q.y=c
q.as=s
p=A.aH(a,q)
a.eC.set(s,p)
return p},
fi(a,b,c,d){var t,s=b.as+("<"+A.cc(c)+">"),r=a.eC.get(s)
if(r!=null)return r
t=A.jc(a,b,c,s,d)
a.eC.set(s,t)
return t},
jc(a,b,c,d,e){var t,s,r,q,p,o,n,m
if(e){t=c.length
s=A.dV(t)
for(r=0,q=0;q<t;++q){p=c[q]
if(p.w===1){s[q]=p;++r}}if(r>0){o=A.aZ(a,b,s,0)
n=A.bm(a,c,s,0)
return A.fi(a,o,n,c!==n)}}m=new A.ag(null,null)
m.w=12
m.x=b
m.y=c
m.as=d
return A.aH(a,m)},
j2(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
j8(a){var t,s,r,q,p,o,n,m=a.r,l=a.s
for(t=m.length,s=0;s<t;){r=m.charCodeAt(s)
if(r>=48&&r<=57)s=A.j4(s+1,r,m,l)
else if((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124)s=A.hb(a,s,m,l,!1)
else if(r===46)s=A.hb(a,s,m,l,!0)
else{++s
switch(r){case 44:break
case 58:l.push(!1)
break
case 33:l.push(!0)
break
case 59:l.push(A.aX(a.u,a.e,l.pop()))
break
case 94:l.push(A.je(a.u,l.pop()))
break
case 35:l.push(A.ce(a.u,5,"#"))
break
case 64:l.push(A.ce(a.u,2,"@"))
break
case 126:l.push(A.ce(a.u,3,"~"))
break
case 60:l.push(a.p)
a.p=l.length
break
case 62:A.j6(a,l)
break
case 38:A.j5(a,l)
break
case 63:q=a.u
l.push(A.hg(q,A.aX(q,a.e,l.pop()),a.n))
break
case 47:q=a.u
l.push(A.hf(q,A.aX(q,a.e,l.pop()),a.n))
break
case 40:l.push(-3)
l.push(a.p)
a.p=l.length
break
case 41:A.j3(a,l)
break
case 91:l.push(a.p)
a.p=l.length
break
case 93:p=l.splice(a.p)
A.hc(a.u,a.e,p)
a.p=l.pop()
l.push(p)
l.push(-1)
break
case 123:l.push(a.p)
a.p=l.length
break
case 125:p=l.splice(a.p)
A.j9(a.u,a.e,p)
a.p=l.pop()
l.push(p)
l.push(-2)
break
case 43:o=m.indexOf("(",s)
l.push(m.substring(s,o))
l.push(-4)
l.push(a.p)
a.p=l.length
s=o+1
break
default:throw"Bad character "+r}}}n=l.pop()
return A.aX(a.u,a.e,n)},
j4(a,b,c,d){var t,s,r=b-48
for(t=c.length;a<t;++a){s=c.charCodeAt(a)
if(!(s>=48&&s<=57))break
r=r*10+(s-48)}d.push(r)
return a},
hb(a,b,c,d,e){var t,s,r,q,p,o,n=b+1
for(t=c.length;n<t;++n){s=c.charCodeAt(n)
if(s===46){if(e)break
e=!0}else{if(!((((s|32)>>>0)-97&65535)<26||s===95||s===36||s===124))r=s>=48&&s<=57
else r=!0
if(!r)break}}q=c.substring(b,n)
if(e){t=a.u
p=a.e
if(p.w===9)p=p.x
o=A.ji(t,p.x)[q]
if(o==null)A.a8('No "'+q+'" in "'+A.iN(p)+'"')
d.push(A.cf(t,p,o))}else d.push(q)
return n},
j6(a,b){var t,s=a.u,r=A.ha(a,b),q=b.pop()
if(typeof q=="string")b.push(A.cd(s,q,r))
else{t=A.aX(s,a.e,q)
switch(t.w){case 11:b.push(A.fi(s,t,r,a.n))
break
default:b.push(A.fh(s,t,r))
break}}},
j3(a,b){var t,s,r,q=a.u,p=b.pop(),o=null,n=null
if(typeof p=="number")switch(p){case-1:o=b.pop()
break
case-2:n=b.pop()
break
default:b.push(p)
break}else b.push(p)
t=A.ha(a,b)
p=b.pop()
switch(p){case-3:p=b.pop()
if(o==null)o=q.sEA
if(n==null)n=q.sEA
s=A.aX(q,a.e,p)
r=new A.cS()
r.a=t
r.b=o
r.c=n
b.push(A.he(q,s,r))
return
case-4:b.push(A.hh(q,b.pop(),t))
return
default:throw A.d(A.ck("Unexpected state under `()`: "+A.o(p)))}},
j5(a,b){var t=b.pop()
if(0===t){b.push(A.ce(a.u,1,"0&"))
return}if(1===t){b.push(A.ce(a.u,4,"1&"))
return}throw A.d(A.ck("Unexpected extended operation "+A.o(t)))},
ha(a,b){var t=b.splice(a.p)
A.hc(a.u,a.e,t)
a.p=b.pop()
return t},
aX(a,b,c){if(typeof c=="string")return A.cd(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.j7(a,b,c)}else return c},
hc(a,b,c){var t,s=c.length
for(t=0;t<s;++t)c[t]=A.aX(a,b,c[t])},
j9(a,b,c){var t,s=c.length
for(t=2;t<s;t+=3)c[t]=A.aX(a,b,c[t])},
j7(a,b,c){var t,s,r=b.w
if(r===9){if(c===0)return b.x
t=b.y
s=t.length
if(c<=s)return t[c-1]
c-=s
b=b.x
r=b.w}else if(c===0)return b
if(r!==8)throw A.d(A.ck("Indexed base must be an interface type"))
t=b.y
if(c<=t.length)return t[c-1]
throw A.d(A.ck("Bad index "+c+" for "+b.l(0)))},
kQ(a,b,c){var t,s=b.d
if(s==null)s=b.d=new Map()
t=s.get(c)
if(t==null){t=A.J(a,b,null,c,null)
s.set(c,t)}return t},
J(a,b,c,d,e){var t,s,r,q,p,o,n,m,l,k,j
if(b===d)return!0
if(A.b2(d))return!0
t=b.w
if(t===4)return!0
if(A.b2(b))return!1
if(b.w===1)return!0
s=t===13
if(s)if(A.J(a,c[b.x],c,d,e))return!0
r=d.w
q=u.P
if(b===q||b===u.u){if(r===7)return A.J(a,b,c,d.x,e)
return d===q||d===u.u||r===6}if(d===u.K){if(t===7)return A.J(a,b.x,c,d,e)
return t!==6}if(t===7){if(!A.J(a,b.x,c,d,e))return!1
return A.J(a,A.f6(a,b),c,d,e)}if(t===6)return A.J(a,q,c,d,e)&&A.J(a,b.x,c,d,e)
if(r===7){if(A.J(a,b,c,d.x,e))return!0
return A.J(a,b,c,A.f6(a,d),e)}if(r===6)return A.J(a,b,c,q,e)||A.J(a,b,c,d.x,e)
if(s)return!1
q=t!==11
if((!q||t===12)&&d===u.Z)return!0
p=t===10
if(p&&d===u.c1)return!0
if(r===12){if(b===u.M)return!0
if(t!==12)return!1
o=b.y
n=d.y
m=o.length
if(m!==n.length)return!1
c=c==null?o:o.concat(c)
e=e==null?n:n.concat(e)
for(l=0;l<m;++l){k=o[l]
j=n[l]
if(!A.J(a,k,c,j,e)||!A.J(a,j,e,k,c))return!1}return A.ht(a,b.x,c,d.x,e)}if(r===11){if(b===u.M)return!0
if(q)return!1
return A.ht(a,b,c,d,e)}if(t===8){if(r!==8)return!1
return A.jO(a,b,c,d,e)}if(p&&r===10)return A.jU(a,b,c,d,e)
return!1},
ht(a2,a3,a4,a5,a6){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(!A.J(a2,a3.x,a4,a5.x,a6))return!1
t=a3.y
s=a5.y
r=t.a
q=s.a
p=r.length
o=q.length
if(p>o)return!1
n=o-p
m=t.b
l=s.b
k=m.length
j=l.length
if(p+k<o+j)return!1
for(i=0;i<p;++i){h=r[i]
if(!A.J(a2,q[i],a6,h,a4))return!1}for(i=0;i<n;++i){h=m[i]
if(!A.J(a2,q[p+i],a6,h,a4))return!1}for(i=0;i<j;++i){h=m[n+i]
if(!A.J(a2,l[i],a6,h,a4))return!1}g=t.c
f=s.c
e=g.length
d=f.length
for(c=0,b=0;b<d;b+=3){a=f[b]
for(;;){if(c>=e)return!1
a0=g[c]
c+=3
if(a<a0)return!1
a1=g[c-2]
if(a0<a){if(a1)return!1
continue}h=f[b+1]
if(a1&&!h)return!1
h=g[c-1]
if(!A.J(a2,f[b+2],a6,h,a4))return!1
break}}while(c<e){if(g[c+1])return!1
c+=3}return!0},
jO(a,b,c,d,e){var t,s,r,q,p,o=b.x,n=d.x
while(o!==n){t=a.tR[o]
if(t==null)return!1
if(typeof t=="string"){o=t
continue}s=t[n]
if(s==null)return!1
r=s.length
q=r>0?new Array(r):v.typeUniverse.sEA
for(p=0;p<r;++p)q[p]=A.cf(a,b,s[p])
return A.hl(a,q,null,c,d.y,e)}return A.hl(a,b.y,null,c,d.y,e)},
hl(a,b,c,d,e,f){var t,s=b.length
for(t=0;t<s;++t)if(!A.J(a,b[t],d,e[t],f))return!1
return!0},
jU(a,b,c,d,e){var t,s=b.y,r=d.y,q=s.length
if(q!==r.length)return!1
if(b.x!==d.x)return!1
for(t=0;t<q;++t)if(!A.J(a,s[t],c,r[t],e))return!1
return!0},
bp(a){var t=a.w,s=!0
if(!(a===u.P||a===u.u))if(!A.b2(a))if(t!==6)s=t===7&&A.bp(a.x)
return s},
b2(a){var t=a.w
return t===2||t===3||t===4||t===5||a===u.X},
hk(a,b){var t,s,r=Object.keys(b),q=r.length
for(t=0;t<q;++t){s=r[t]
a[s]=b[s]}},
dV(a){return a>0?new Array(a):v.typeUniverse.sEA},
ag:function ag(a,b){var _=this
_.a=a
_.b=b
_.r=_.f=_.d=_.c=null
_.w=0
_.as=_.Q=_.z=_.y=_.x=null},
cS:function cS(){this.c=this.b=this.a=null},
cW:function cW(a){this.a=a},
cR:function cR(){},
cb:function cb(a){this.a=a},
hd(a,b,c){return 0},
a1:function a1(a,b){var _=this
_.a=a
_.e=_.d=_.c=_.b=null
_.$ti=b},
aY:function aY(a,b){this.a=a
this.$ti=b},
y(a,b,c){return b.h("@<0>").D(c).h("f1<1,2>").a(A.kG(a,new A.an(b.h("@<0>").D(c).h("an<1,2>"))))},
ap(a,b){return new A.an(a.h("@<0>").D(b).h("an<1,2>"))},
f2(a){return new A.aV(a.h("aV<0>"))},
iy(a){return new A.aV(a.h("aV<0>"))},
fg(){var t=Object.create(null)
t["<non-identifier-key>"]=t
delete t["<non-identifier-key>"]
return t},
ff(a,b,c){var t=new A.aW(a,b,c.h("aW<0>"))
t.c=a.e
return t},
f3(a,b){var t,s,r=A.f2(b)
for(t=a.length,s=0;s<a.length;a.length===t||(0,A.h)(a),++s)r.i(0,b.a(a[s]))
return r},
iz(a,b){var t=A.f2(b)
t.F(0,a)
return t},
fR(a){var t,s
if(A.fu(a))return"{...}"
t=new A.bf("")
try{s={}
B.a.i($.a3,a)
t.a+="{"
s.a=!0
a.L(0,new A.de(s,t))
t.a+="}"}finally{if(0>=$.a3.length)return A.a($.a3,-1)
$.a3.pop()}s=t.a
return s.charCodeAt(0)==0?s:s},
aV:function aV(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
cV:function cV(a){this.a=a
this.b=null},
aW:function aW(a,b,c){var _=this
_.a=a
_.b=b
_.d=_.c=null
_.$ti=c},
z:function z(){},
u:function u(){},
dd:function dd(a){this.a=a},
de:function de(a,b){this.a=a
this.b=b},
aD:function aD(){},
ca:function ca(){},
k1(a,b){var t,s,r,q=null
try{q=JSON.parse(a)}catch(s){t=A.ci(s)
r=A.az(String(t))
throw A.d(r)}r=A.dX(q)
return r},
dX(a){var t
if(a==null)return null
if(typeof a!="object")return a
if(!Array.isArray(a))return new A.cT(a,Object.create(null))
for(t=0;t<a.length;++t)a[t]=A.dX(a[t])
return a},
fP(a,b,c){return new A.bB(a,b)},
jy(a){return a.T()},
j0(a,b){return new A.dP(a,[],A.ky())},
j1(a,b,c){var t,s=new A.bf(""),r=A.j0(s,b)
r.ad(a)
t=s.a
return t.charCodeAt(0)==0?t:t},
cT:function cT(a,b){this.a=a
this.b=b
this.c=null},
cU:function cU(a){this.a=a},
cn:function cn(){},
cp:function cp(){},
bB:function bB(a,b){this.a=a
this.b=b},
cy:function cy(a,b){this.a=a
this.b=b},
d9:function d9(){},
db:function db(a){this.b=a},
da:function da(a){this.a=a},
dQ:function dQ(){},
dR:function dR(a,b){this.a=a
this.b=b},
dP:function dP(a,b,c){this.c=a
this.a=b
this.b=c},
X(a,b){var t,s=b.length
for(;;){if(a>0){t=a-1
if(!(t<s))return A.a(b,t)
t=b[t]===0}else t=!1
if(!t)break;--a}return a},
bi(a,b,c,d){var t,s,r,q=new Uint16Array(d),p=c-b
for(t=a.length,s=0;s<p;++s){r=b+s
if(!(r>=0&&r<t))return A.a(a,r)
r=a[r]
if(!(s<d))return A.a(q,s)
q[s]=r}return q},
dH(a){var t
if(a===0)return $.a9()
if(a===1)return $.aj()
if(a===2)return $.fB()
if(Math.abs(a)<4294967296)return A.cQ(B.b.P(a))
t=A.iY(a)
return t},
cQ(a){var t,s,r,q,p=a<0
if(p){if(a===-9223372036854776e3){t=new Uint16Array(4)
t[3]=32768
s=A.X(4,t)
return new A.E(s!==0,t,s)}a=-a}if(a<65536){t=new Uint16Array(1)
t[0]=a
s=A.X(1,t)
return new A.E(s===0?!1:p,t,s)}if(a<=4294967295){t=new Uint16Array(2)
t[0]=a&65535
t[1]=B.b.a3(a,16)
s=A.X(2,t)
return new A.E(s===0?!1:p,t,s)}s=B.b.q(B.b.gaQ(a)-1,16)+1
t=new Uint16Array(s)
for(r=0;a!==0;r=q){q=r+1
if(!(r<s))return A.a(t,r)
t[r]=a&65535
a=B.b.q(a,65536)}s=A.X(s,t)
return new A.E(s===0?!1:p,t,s)},
iY(a){var t,s,r,q,p,o,n,m
if(isNaN(a)||a==1/0||a==-1/0)throw A.d(A.P("Value must be finite: "+a))
t=a<0
if(t)a=-a
a=Math.floor(a)
if(a===0)return $.a9()
s=$.i5()
for(r=s.$flags|0,q=0;q<8;++q){r&2&&A.F(s)
if(!(q<8))return A.a(s,q)
s[q]=0}r=J.i9(B.aV.gbr(s))
r.$flags&2&&A.F(r,13)
r.setFloat64(0,a,!0)
p=(s[7]<<4>>>0)+(s[6]>>>4)-1075
o=new Uint16Array(4)
o[0]=(s[1]<<8>>>0)+s[0]
o[1]=(s[3]<<8>>>0)+s[2]
o[2]=(s[5]<<8>>>0)+s[4]
o[3]=s[6]&15|16
n=new A.E(!1,o,4)
if(p<0)m=n.aB(0,-p)
else m=p>0?n.X(0,p):n
if(t)return m.N(0)
return m},
fd(a,b,c,d){var t,s,r,q,p
if(b===0)return 0
if(c===0&&d===a)return b
for(t=b-1,s=a.length,r=d.$flags|0;t>=0;--t){q=t+c
if(!(t<s))return A.a(a,t)
p=a[t]
r&2&&A.F(d)
if(!(q>=0&&q<d.length))return A.a(d,q)
d[q]=p}for(t=c-1;t>=0;--t){r&2&&A.F(d)
if(!(t<d.length))return A.a(d,t)
d[t]=0}return b+c},
h7(a,b,c,d){var t,s,r,q,p,o,n,m=B.b.q(c,16),l=B.b.H(c,16),k=16-l,j=B.b.X(1,k)-1
for(t=b-1,s=a.length,r=d.$flags|0,q=0;t>=0;--t){if(!(t<s))return A.a(a,t)
p=a[t]
o=t+m+1
n=B.b.ao(p,k)
r&2&&A.F(d)
if(!(o>=0&&o<d.length))return A.a(d,o)
d[o]=(n|q)>>>0
q=B.b.X((p&j)>>>0,l)}r&2&&A.F(d)
if(!(m>=0&&m<d.length))return A.a(d,m)
d[m]=q},
fe(a,b,c,d){var t,s,r,q=B.b.q(c,16)
if(B.b.H(c,16)===0)return A.fd(a,b,q,d)
t=b+q+1
A.h7(a,b,c,d)
for(s=d.$flags|0,r=q;--r,r>=0;){s&2&&A.F(d)
if(!(r<d.length))return A.a(d,r)
d[r]=0}s=t-1
if(!(s>=0&&s<d.length))return A.a(d,s)
if(d[s]===0)t=s
return t},
aF(a,b,c,d){var t,s,r,q,p,o,n=B.b.q(c,16),m=B.b.H(c,16),l=16-m,k=B.b.X(1,m)-1,j=a.length
if(!(n>=0&&n<j))return A.a(a,n)
t=B.b.ao(a[n],m)
s=b-n-1
for(r=d.$flags|0,q=0;q<s;++q){p=q+n+1
if(!(p<j))return A.a(a,p)
o=a[p]
p=B.b.X((o&k)>>>0,l)
r&2&&A.F(d)
if(!(q<d.length))return A.a(d,q)
d[q]=(p|t)>>>0
t=B.b.ao(o,m)}r&2&&A.F(d)
if(!(s>=0&&s<d.length))return A.a(d,s)
d[s]=t},
W(a,b,c,d){var t,s,r,q,p=b-d
if(p===0)for(t=b-1,s=a.length,r=c.length;t>=0;--t){if(!(t<s))return A.a(a,t)
q=a[t]
if(!(t<r))return A.a(c,t)
p=q-c[t]
if(p!==0)return p}return p},
ai(a,b,c,d,e){var t,s,r,q,p,o
for(t=a.length,s=c.length,r=e.$flags|0,q=0,p=0;p<d;++p){if(!(p<t))return A.a(a,p)
o=a[p]
if(!(p<s))return A.a(c,p)
q+=o+c[p]
r&2&&A.F(e)
if(!(p<e.length))return A.a(e,p)
e[p]=q&65535
q=q>>>16}for(p=d;p<b;++p){if(!(p>=0&&p<t))return A.a(a,p)
q+=a[p]
r&2&&A.F(e)
if(!(p<e.length))return A.a(e,p)
e[p]=q&65535
q=q>>>16}r&2&&A.F(e)
if(!(b>=0&&b<e.length))return A.a(e,b)
e[b]=q},
A(a,b,c,d,e){var t,s,r,q,p,o
for(t=a.length,s=c.length,r=e.$flags|0,q=0,p=0;p<d;++p){if(!(p<t))return A.a(a,p)
o=a[p]
if(!(p<s))return A.a(c,p)
q+=o-c[p]
r&2&&A.F(e)
if(!(p<e.length))return A.a(e,p)
e[p]=q&65535
q=0-(B.b.a3(q,16)&1)}for(p=d;p<b;++p){if(!(p>=0&&p<t))return A.a(a,p)
q+=a[p]
r&2&&A.F(e)
if(!(p<e.length))return A.a(e,p)
e[p]=q&65535
q=0-(B.b.a3(q,16)&1)}},
h8(a,b,c,d,e,f){var t,s,r,q,p,o,n,m,l
if(a===0)return
for(t=b.length,s=d.length,r=d.$flags|0,q=0;--f,f>=0;e=m,c=p){p=c+1
if(!(c<t))return A.a(b,c)
o=b[c]
if(!(e>=0&&e<s))return A.a(d,e)
n=a*o+d[e]+q
m=e+1
r&2&&A.F(d)
d[e]=n&65535
q=B.b.q(n,65536)}for(;q!==0;e=m){if(!(e>=0&&e<s))return A.a(d,e)
l=d[e]+q
m=e+1
r&2&&A.F(d)
d[e]=l&65535
q=B.b.q(l,65536)}},
j_(a,b,c){var t,s,r,q=b.length
if(!(c>=0&&c<q))return A.a(b,c)
t=b[c]
if(t===a)return 65535
s=c-1
if(!(s>=0&&s<q))return A.a(b,s)
r=B.b.ag((t<<16|b[s])>>>0,a)
if(r>65535)return 65535
return r},
iZ(b3,b4,b5){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6="must not be zero",a7=b3.c,a8=b4.c,a9=a7>a8?a7:a8,b0=A.bi(b3.b,0,a7,a9),b1=A.bi(b4.b,0,a8,a9),b2=0
if(a7===0)throw A.d(A.fE(0,"this",a6))
if(a8===0)throw A.d(A.fE(0,"other",a6))
if(a7===1){if(0>=b0.length)return A.a(b0,0)
t=b0[0]===1}else t=!1
if(!t)if(a8===1){if(0>=b1.length)return A.a(b1,0)
t=b1[0]===1}else t=!1
else t=!0
if(t)return $.aj()
if(0>=b0.length)return A.a(b0,0)
t=b1.length
for(;;){if((b0[0]&1)===0){if(0>=t)return A.a(b1,0)
s=(b1[0]&1)===0}else s=!1
if(!s)break
A.aF(b0,a7,1,b0)
A.aF(b1,a8,1,b1);++b2}if(b2>=16){r=B.b.q(b2,16)
a7-=r
a8-=r
q=a9-r}else q=a9
if(0>=t)return A.a(b1,0)
if((b1[0]&1)===1){p=a8
a8=a7
a7=p
p=b1
b1=b0
b0=p}o=A.bi(b0,0,a7,a9)
n=A.bi(b1,0,a8,a9+2)
if(0>=b0.length)return A.a(b0,0)
m=(b0[0]&1)===0
l=q+1
k=l+2
j=$.i6()
if(m){j=new Uint16Array(k)
if(0>=k)return A.a(j,0)
j[0]=1
i=new Uint16Array(k)}else i=j
h=new Uint16Array(k)
g=new Uint16Array(k)
if(0>=k)return A.a(g,0)
g[0]=1
for(t=o.length,s=n.length,f=i.length,e=j.length,d=!1,c=!1,b=!1,a=!1;;){if(0>=t)return A.a(o,0)
while((o[0]&1)===0){A.aF(o,q,1,o)
if(m){if(0>=e)return A.a(j,0)
if((j[0]&1)!==1){if(0>=k)return A.a(h,0)
a0=(h[0]&1)===1}else a0=!0
if(a0){if(d){if(!(q>=0&&q<e))return A.a(j,q)
d=j[q]!==0||A.W(j,q,b1,q)>0
if(d)A.A(j,l,b1,q,j)
else A.A(b1,q,j,q,j)}else A.ai(j,l,b1,q,j)
if(b)A.ai(h,l,b0,q,h)
else{if(!(q>=0&&q<k))return A.a(h,q)
a0=h[q]!==0||A.W(h,q,b0,q)>0
if(a0)A.A(h,l,b0,q,h)
else A.A(b0,q,h,q,h)
b=!a0}}A.aF(j,l,1,j)}else{if(0>=k)return A.a(h,0)
if((h[0]&1)===1)if(b)A.ai(h,l,b0,q,h)
else{if(!(q>=0&&q<k))return A.a(h,q)
a0=h[q]!==0||A.W(h,q,b0,q)>0
if(a0)A.A(h,l,b0,q,h)
else A.A(b0,q,h,q,h)
b=!a0}}A.aF(h,l,1,h)}if(0>=s)return A.a(n,0)
while((n[0]&1)===0){A.aF(n,q,1,n)
if(m){if(0>=f)return A.a(i,0)
if((i[0]&1)===1||(g[0]&1)===1){if(c){if(!(q>=0&&q<f))return A.a(i,q)
c=i[q]!==0||A.W(i,q,b1,q)>0
if(c)A.A(i,l,b1,q,i)
else A.A(b1,q,i,q,i)}else A.ai(i,l,b1,q,i)
if(a)A.ai(g,l,b0,q,g)
else{if(!(q>=0&&q<k))return A.a(g,q)
a0=g[q]!==0||A.W(g,q,b0,q)>0
if(a0)A.A(g,l,b0,q,g)
else A.A(b0,q,g,q,g)
a=!a0}}A.aF(i,l,1,i)}else if((g[0]&1)===1)if(a)A.ai(g,l,b0,q,g)
else{if(!(q>=0&&q<k))return A.a(g,q)
a0=g[q]!==0||A.W(g,q,b0,q)>0
if(a0)A.A(g,l,b0,q,g)
else A.A(b0,q,g,q,g)
a=!a0}A.aF(g,l,1,g)}if(A.W(o,q,n,q)>=0){A.A(o,q,n,q,o)
if(m)if(d===c){a1=A.W(j,l,i,l)
if(a1>0)A.A(j,l,i,l,j)
else{A.A(i,l,j,l,j)
d=!d&&a1!==0}}else A.ai(j,l,i,l,j)
if(b===a){a2=A.W(h,l,g,l)
if(a2>0)A.A(h,l,g,l,h)
else{A.A(g,l,h,l,h)
b=!b&&a2!==0}}else A.ai(h,l,g,l,h)}else{A.A(n,q,o,q,n)
if(m)if(c===d){a3=A.W(i,l,j,l)
if(a3>0)A.A(i,l,j,l,i)
else{A.A(j,l,i,l,i)
c=!c&&a3!==0}}else A.ai(i,l,j,l,i)
if(a===b){a4=A.W(g,l,h,l)
if(a4>0)A.A(g,l,h,l,g)
else{A.A(h,l,g,l,g)
a=!a&&a4!==0}}else A.ai(g,l,h,l,g)}a5=q
for(;;){if(a5>0){a0=a5-1
if(!(a0<t))return A.a(o,a0)
a0=o[a0]===0}else a0=!1
if(!a0)break;--a5}if(a5===0)break}t=A.X(b2>0?A.fe(n,q,b2,n):q,n)
return new A.E(!1,n,t)},
a5(a,b,c,d){var t,s=c?J.fO(a,d):J.iv(a,d)
if(a!==0&&b!=null)for(t=0;t<s.length;++t)s[t]=b
return s},
f4(a,b,c){var t,s=A.c([],c.h("k<0>"))
for(t=J.aa(a);t.n();)B.a.i(s,c.a(t.gp()))
if(b)return s
s.$flags=1
return s},
H(a,b){var t,s
if(Array.isArray(a))return A.c(a.slice(0),b.h("k<0>"))
t=A.c([],b.h("k<0>"))
for(s=J.aa(a);s.n();)B.a.i(t,s.gp())
return t},
ad(a,b){var t=A.f4(a,!1,b)
t.$flags=3
return t},
fY(a,b,c){var t=J.aa(b)
if(!t.n())return a
if(c.length===0){do a+=A.o(t.gp())
while(t.n())}else{a+=A.o(t.gp())
while(t.n())a=a+c+A.o(t.gp())}return a},
cq(a){if(typeof a=="number"||A.fn(a)||a==null)return J.bq(a)
if(typeof a=="string")return JSON.stringify(a)
return A.fV(a)},
ck(a){return new A.cj(a)},
P(a){return new A.ab(!1,null,null,a)},
fE(a,b,c){return new A.ab(!0,a,b,c)},
bU(a,b,c,d,e){return new A.bT(b,c,!0,a,d,"Invalid value")},
iM(a,b,c){if(0>a||a>c)throw A.d(A.bU(a,0,c,"start",null))
if(b!=null){if(a>b||b>c)throw A.d(A.bU(b,a,c,"end",null))
return b}return c},
f5(a,b){if(a<0)throw A.d(A.bU(a,0,null,b,null))
return a},
eY(a,b,c,d){return new A.cr(b,!0,a,d,"Index out of range")},
dG(a){return new A.c1(a)},
h2(a){return new A.cO(a)},
fX(a){return new A.bZ(a)},
Q(a){return new A.co(a)},
im(a){return new A.dN(a)},
az(a){return new A.b6(a)},
it(a,b,c){var t,s
if(A.fu(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}t=A.c([],u.s)
B.a.i($.a3,a)
try{A.jY(a,t)}finally{if(0>=$.a3.length)return A.a($.a3,-1)
$.a3.pop()}s=A.fY(b,u.bi.a(t),", ")+c
return s.charCodeAt(0)==0?s:s},
eZ(a,b,c){var t,s
if(A.fu(a))return b+"..."+c
t=new A.bf(b)
B.a.i($.a3,a)
try{s=t
s.a=A.fY(s.a,a,", ")}finally{if(0>=$.a3.length)return A.a($.a3,-1)
$.a3.pop()}t.a+=c
s=t.a
return s.charCodeAt(0)==0?s:s},
jY(a,b){var t,s,r,q,p,o,n,m=a.gt(a),l=0,k=0
for(;;){if(!(l<80||k<3))break
if(!m.n())return
t=A.o(m.gp())
B.a.i(b,t)
l+=t.length+2;++k}if(!m.n()){if(k<=5)return
if(0>=b.length)return A.a(b,-1)
s=b.pop()
if(0>=b.length)return A.a(b,-1)
r=b.pop()}else{q=m.gp();++k
if(!m.n()){if(k<=4){B.a.i(b,A.o(q))
return}s=A.o(q)
if(0>=b.length)return A.a(b,-1)
r=b.pop()
l+=s.length+2}else{p=m.gp();++k
for(;m.n();q=p,p=o){o=m.gp();++k
if(k>100){for(;;){if(!(l>75&&k>3))break
if(0>=b.length)return A.a(b,-1)
l-=b.pop().length+2;--k}B.a.i(b,"...")
return}}r=A.o(q)
s=A.o(p)
l+=s.length+r.length+4}}if(k>b.length+2){l+=5
n="..."}else n=null
for(;;){if(!(l>80&&b.length>3))break
if(0>=b.length)return A.a(b,-1)
l-=b.pop().length+2
if(n==null){l+=5
n="..."}}if(n!=null)B.a.i(b,n)
B.a.i(b,r)
B.a.i(b,s)},
iA(a,b,c,d,e){return new A.aK(a,b.h("@<0>").D(c).D(d).D(e).h("aK<1,2,3,4>"))},
iF(a,b,c,d){var t
if(B.F===c){t=B.b.gu(a)
b=J.al(b)
return A.f7(A.aE(A.aE($.eV(),t),b))}if(B.F===d){t=B.b.gu(a)
b=J.al(b)
c=J.al(c)
return A.f7(A.aE(A.aE(A.aE($.eV(),t),b),c))}t=B.b.gu(a)
b=J.al(b)
c=J.al(c)
d=J.al(d)
d=A.f7(A.aE(A.aE(A.aE(A.aE($.eV(),t),b),c),d))
return d},
E:function E(a,b,c){this.a=a
this.b=b
this.c=c},
dI:function dI(){},
dJ:function dJ(){},
dM:function dM(){},
x:function x(){},
cj:function cj(a){this.a=a},
c0:function c0(){},
ab:function ab(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
bT:function bT(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
cr:function cr(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
c1:function c1(a){this.a=a},
cO:function cO(a){this.a=a},
bZ:function bZ(a){this.a=a},
co:function co(a){this.a=a},
bY:function bY(){},
dN:function dN(a){this.a=a},
b6:function b6(a){this.a=a},
cs:function cs(){},
e:function e(){},
N:function N(a,b,c){this.a=a
this.b=b
this.$ti=c},
bN:function bN(){},
p:function p(){},
bf:function bf(a){this.a=a},
ku(a,b,c){var t,s,r,q,p,o,n
if(!b.y||!b.a||a.b.length!==0)return A.hp(a,b,c)
for(t=a.a,s=A.f3(t,A.w(t).c),s=A.ff(s,s.r,A.l(s).c),r=a.d,q=s.$ti.c,p=null;s.n();){o=s.d
n=A.hp(A.fM(t,B.aN,r,B.j,o==null?q.a(o):o),b,c)
if(p!=null)if(n.a==null)o=p.a!=null||A.ho(n,p)
else o=!1
else o=!0
if(o)p=n}p.toString
return p},
hp(a,b,c){var t,s,r,q=A.kA(a),p=q.length
if(p===0)return B.b0
for(t=null,s=0;s<q.length;q.length===p||(0,A.h)(q),++s){r=A.k7(a,q[s],b,c)
if(r==null)continue
if(t==null||A.ho(r,t))t=r}return t==null?B.b1:t},
ho(a,b){var t=a.r.d,s=b.r.d
if(t!==s)return t>s
t=a.c
s=b.c
if(t!==s)return t>s
return a.d.a>b.d.a},
k7(a,b,c,d){var t,s,r,q,p,o,n=A.kC(a,b,c,d)
if(n.length===0)return null
if(B.a.gG(n).a.f>0){t=B.a.a0(n,0,new A.e6(),u.S)
s=8000*t
return new A.bd(null,n,13*t,A.hE(a,b,c,d,!1),B.r,s,A.hK(s,c),b)}s=A.H(n,u.g)
B.a.F(s,A.jA(a,c,d))
r=B.a.a0(s,0,new A.e7(),u.S)
q=A.hE(a,b,c,d,B.a.R(n,new A.e8()))
p=A.kt(r,q.a,d)
o=p.a
return new A.bd(null,s,r,q,p.b,o,A.hK(o,c),b)},
jA(a,b,c){var t,s,r=A.eU(a.ga9()),q=A.c([],u.l),p=new A.dZ(r),o=p.$1(b.z)
if(o>0)B.a.i(q,new A.M(B.bO,o))
t=a.d
if(t>0)B.a.i(q,new A.M(B.bH,t))
if(a.gac())t=b.d||b.e
else t=!1
if(t){s=p.$1(b.Q)
if(s>0)B.a.i(q,new A.M(B.bm,s))}return q},
bd:function bd(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
dy:function dy(){},
e6:function e6(){},
e7:function e7(){},
e8:function e8(){},
dZ:function dZ(a){this.a=a},
e_:function e_(a){this.a=a},
kA(a){var t,s,r,q,p,o,n,m=A.c([],u.cL),l=A.eU(a.a),k=a.b,j=A.w(k),i=j.h("L<1,I>"),h=A.H(new A.L(k,j.h("I(1)").a(A.kB()),i),i.h("D.E"))
for(j=A.hA(l,4-k.length),i=j.$ti,j=new A.a1(j.a(),i.h("a1<1>")),t=a.c,s=u.o,i=i.c;j.n();){r=j.b
if(r==null)r=i.a(r)
q=A.H(r,s)
B.a.F(q,h)
for(p=0;p<r.length;++p){o=r[p]
if(!B.a.A(o.gb0(),t))continue
B.a.i(m,new A.b5(B.W,q,p,A.kr(o,t)))}}if(k.length===0){n=A.jw(l)
if(n!=null)B.a.i(m,new A.b5(B.G,n,B.a.aY(n,new A.eo(a)),B.D))
if(A.jQ(l))B.a.i(m,B.ai)}return m},
jB(a){var t
u.k.a(a)
switch(a.a.a){case 0:return new A.I(B.v,B.a.gG(a.b),!0,!1)
case 1:return new A.I(B.n,B.a.gG(a.b),!0,!1)
case 2:t=a.c
return new A.I(B.f,B.a.gG(a.b),t,!t)}},
kr(a,b){var t,s=a.a
if(s===B.w)return B.D
if(s===B.n||s===B.f)return B.P
s=a.b
t=A.bg(s)
if(b===s+1)return B.bg
if(b===s)return t===7?B.a5:B.O
return t===1?B.a5:B.O},
hA(a,b){return new A.aY(A.kc(a,b),u.D)},
kc(a,b){return function(){var t=a,s=b
var r=0,q=2,p=[],o,n,m,l,k,j,i
return function $async$hA(c,d,e){if(d===1){p.push(e)
r=q}for(;;)switch(r){case 0:o=u.p,n=u.S,m=0
case 3:if(!(m<34)){r=5
break}if(t[m]<2){r=4
break}l=A.H(t,n)
if(!(m<l.length)){A.a(l,m)
r=1
break}B.a.j(l,m,l[m]-2)
l=A.e9(l,0,s),k=l.$ti,l=new A.a1(l.a(),k.h("a1<1>")),k=k.c
case 6:if(!l.n()){r=7
break}j=l.b
if(j==null)j=k.a(j)
i=A.c([new A.I(B.w,m,!1,!1)],o)
B.a.F(i,j)
r=8
return c.b=i,1
case 8:r=6
break
case 7:case 4:++m
r=3
break
case 5:case 1:return 0
case 2:return c.c=p.at(-1),3}}}},
e9(a,b,c){return new A.aY(A.kb(a,b,c),u.D)},
kb(a,b,c){return function(){var t=a,s=b,r=c
var q=0,p=2,o=[],n,m,l,k,j,i,h,g
return function $async$e9(d,e,f){if(e===1){o.push(f)
q=p}for(;;)A:switch(q){case 0:h=t.length
g=s
for(;;){if(g<34){if(!(g<h)){A.a(t,g)
q=1
break A}n=t[g]===0}else n=!1
if(!n)break;++g}q=g===34?3:4
break
case 3:q=r===0?5:6
break
case 5:q=7
return d.b=B.Y,1
case 7:case 6:q=1
break
case 4:if(r===0){q=1
break}if(!(g<h)){A.a(t,g)
q=1
break}h=t[g]
q=h>=3?8:9
break
case 8:B.a.j(t,g,h-3)
h=A.e9(t,g,r-1),n=h.$ti,h=new A.a1(h.a(),n.h("a1<1>")),m=u.p,n=n.c
case 10:if(!h.n()){q=11
break}l=h.b
if(l==null)l=n.a(l)
k=A.c([new A.I(B.n,g,!1,!1)],m)
B.a.F(k,l)
q=12
return d.b=k,1
case 12:q=10
break
case 11:if(!(g<t.length)){A.a(t,g)
q=1
break}B.a.j(t,g,t[g]+3)
case 9:h=!1
if(g<27)if(A.bg(g)<=7){n=g+1
m=t.length
if(!(n<m)){A.a(t,n)
q=1
break}if(t[n]>0){h=g+2
if(!(h<m)){A.a(t,h)
q=1
break}h=t[h]>0}}q=h?13:14
break
case 13:if(!(g<t.length)){A.a(t,g)
q=1
break}B.a.j(t,g,t[g]-1)
h=g+1
if(!(h<t.length)){A.a(t,h)
q=1
break}B.a.j(t,h,t[h]-1)
n=g+2
if(!(n<t.length)){A.a(t,n)
q=1
break}B.a.j(t,n,t[n]-1)
m=A.e9(t,g,r-1),l=m.$ti,m=new A.a1(m.a(),l.h("a1<1>")),k=u.p,l=l.c
case 15:if(!m.n()){q=16
break}j=m.b
if(j==null)j=l.a(j)
i=A.c([new A.I(B.v,g,!1,!1)],k)
B.a.F(i,j)
q=17
return d.b=i,1
case 17:q=15
break
case 16:if(!(g<t.length)){A.a(t,g)
q=1
break}B.a.j(t,g,t[g]+1)
if(!(h<t.length)){A.a(t,h)
q=1
break}B.a.j(t,h,t[h]+1)
if(!(n<t.length)){A.a(t,n)
q=1
break}B.a.j(t,n,t[n]+1)
case 14:case 1:return 0
case 2:return d.c=o.at(-1),3}}}},
jw(a){var t,s,r=A.c([],u.p)
for(t=0;t<34;++t){s=a[t]
if(s===0)continue
if(s!==2)return null
B.a.i(r,new A.I(B.w,t,!1,!1))}return r.length===7?r:null},
jQ(a){var t,s,r
for(t=!1,s=0;s<34;++s){if(!B.a.A(B.X,s)){if(a[s]!==0)return!1
continue}r=a[s]
if(r===0)return!1
if(r===2){if(t)return!1
t=!0}else if(r!==1)return!1}return t},
be:function be(a,b){this.a=a
this.b=b},
I:function I(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
bv:function bv(a,b){this.a=a
this.b=b},
aU:function aU(a,b){this.a=a
this.b=b},
b5:function b5(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
d3:function d3(){},
eo:function eo(a){this.a=a},
kD(a,b,c){var t,s,r,q,p,o,n=A.kq(c)
A.ju(a,b,14)
t=u.S
s=A.H(a,t)
r=A.c([],u.V)
for(q=0;q<34;++q){if(!(q<s.length))return A.a(s,q)
p=s[q]
if(p===0)continue
B.a.j(s,q,p-1)
p=A.H(n,t)
if(!(q<p.length))return A.a(p,q)
B.a.j(p,q,p[q]+1)
o=A.kn(s,b,p)
B.a.i(r,new A.ac(q,o.a,o))
if(!(q<s.length))return A.a(s,q)
B.a.j(s,q,s[q]+1)}B.a.a5(r,new A.ey())
return r},
kn(a,b,c){var t,s,r,q,p=A.eQ(a,b).ga4(),o=A.H(a,u.S),n=A.c([],u.a6)
for(t=0;t<34;++t){if(!(t<o.length))return A.a(o,t)
s=o[t]
if(s>=4)continue
B.a.j(o,t,s+1)
r=A.eQ(o,b).ga4()
if(!(t<o.length))return A.a(o,t)
B.a.j(o,t,o[t]-1)
if(r<p){if(!(t<o.length))return A.a(o,t)
s=o[t]
if(!(t<c.length))return A.a(c,t)
q=4-s-c[t]
B.a.i(n,new A.aT(t,q>0?q:0))}}return new A.dE(p,A.ad(n,u.r))},
ju(a,b,c){var t,s,r
if(b>4)throw A.d(A.P("\uc6b8\uae30 \uc218\ub294 0~4: "+b))
t=c-3*b
for(s=0,r=0;r<34;++r)s+=a[r]
if(s!==t)throw A.d(A.P("\ub2eb\ud78c \ud328\ub294 "+t+" \uc7a5\uc774\uc5b4\uc57c \ud569\ub2c8\ub2e4 (\ud604\uc7ac "+s+" \uc7a5)"))},
kq(a){var t
for(t=0;t<34;++t);return a},
aT:function aT(a,b){this.a=a
this.b=b},
dE:function dE(a,b){this.a=a
this.b=b},
dF:function dF(){},
ac:function ac(a,b,c){this.a=a
this.b=b
this.c=c},
ey:function ey(){},
hE(a3,a4,a5,a6,a7){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=a4.a
if(a2===B.H)return B.av
if(a2===B.G)return B.au
if(a7)return a5.a?B.aw:B.ax
t=A.c([B.U],u.v)
s=a3.gac()
if(s&&!a5.a)B.a.i(t,B.T)
a2=a5.a
if(a2)B.a.i(t,B.ap)
for(r=a4.b,a2=!a2,q=a4.c,p=a4.d,o=p===B.P,n=0;n<r.length;++n){m=r[n]
l=m.a
if(!(l===B.n||l===B.f))continue
k=m.b
if(k<27)if(k<27){j=B.b.H(k,9)
j=j===0||j===8
i=j}else i=!1
else i=!0
h=a2&&n===q&&o
g=!m.c&&!h
f=i?4:2
if(g)f*=2
l=l===B.f
if(l)f*=4
if(l)e=g?"\uc548\uae61":"\uae61"
else e=g?"\uc554\uac01":"\uba85\uac01"
if(!(k>=0&&k<34))return A.a(B.c,k)
B.a.i(t,new A.K(B.c[k]+" "+e,f))}d=a4.gaz().b
c=d>=31?2:0
b=d===a5.b
a=d===a5.c
if(b&&a)c=4
else if(b||a)c=2
if(c>0){if(!(d>=0&&d<34))return A.a(B.c,d)
B.a.i(t,new A.K(B.c[d]+" \uba38\ub9ac",c))}switch(p.a){case 1:B.a.i(t,B.at)
break
case 2:B.a.i(t,B.ar)
break
case 4:B.a.i(t,B.ao)
break
case 0:case 3:break}a0=B.a.a0(t,0,new A.en(),u.S)
if(!s&&a0===20){B.a.i(t,B.aq)
a0=30}a1=B.b.q(a0+9,10)*10
if(a1!==a0)B.a.i(t,new A.K("\uc62c\ub9bc",a1-a0))
return new A.aA(a1,t)},
K:function K(a,b){this.a=a
this.b=b},
aA:function aA(a,b){this.a=a
this.b=b},
en:function en(){},
fM(a,b,c,d,e){var t=A.H(a,u.z)
B.a.a1(t)
t=new A.d4(A.ad(t,u.S),b,e,c)
t.ba(a,b,c,d,e)
return t},
d4:function d4(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
d5:function d5(){},
dA:function dA(a,b,c,d,e,f,g,h,i,j,k,l,m){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m},
dx:function dx(){},
df(a,b,c){var t=A.H(b,u.z)
B.a.a1(t)
return new A.aq(a,A.ad(t,u.S),c)},
iC(a){if(a>=27||A.bg(a)>7)throw A.d(A.P("\uce58\ub97c \ub9cc\ub4e4 \uc218 \uc5c6\ub294 \ud328: "+A.r(a)))
return A.df(B.aT,A.c([a,a+1,a+2],u.t),!0)},
bH:function bH(a,b){this.a=a
this.b=b},
aq:function aq(a,b,c){this.a=a
this.b=b
this.c=c},
kt(a,b,c){var t
if(a>=13)return B.aa
if(a>=11)return B.a7
if(a>=8)return B.a8
if(a>=6)return B.a9
if(a>=5)return B.Q
t=b*B.e.P(Math.pow(2,a+2))
if(t>=2000)return B.Q
return new A.ax(t,B.x)},
hK(a,b){var t,s,r,q,p,o=b.as
if(!b.a){t=B.b.q(a*(b.b===27?6:4)+99,100)*100+o*300
return new A.bc(t,0,0,t,o)}if(b.b===27){s=B.b.q(a*2+99,100)*100+o*100
return new A.bc(0,0,s,s*3,o)}r=o*100
q=B.b.q(a*2+99,100)*100+r
p=B.b.q(a+99,100)*100+r
return new A.bc(0,q,p,q+p*2,o)},
ao:function ao(a,b,c){this.c=a
this.a=b
this.b=c},
ax:function ax(a,b){this.a=a
this.b=b},
bc:function bc(a,b,c,d,e){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e},
eQ(a,b){var t
A.js(a,b)
t=A.kf(a,b)
if(b>0)return new A.cL(t,null,null)
return new A.cL(t,A.jv(a),A.jZ(a))},
js(a,b){var t,s,r,q,p
if(b<0||b>4)throw A.d(A.P("\uc6b8\uae30 \uc218\ub294 0~4: "+b))
t=a.length
if(t!==34)throw A.d(A.P("\uac1c\uc218 \ubc30\uc5f4\uc740 34\uce78\uc774\uc5b4\uc57c \ud569\ub2c8\ub2e4 (\ud604\uc7ac "+t+")"))
for(s=0,r=0;r<34;++r){if(!(r<t))return A.a(a,r)
q=a[r]
if(q<0||q>4)throw A.d(A.P(A.h_(r)+" \uac1c\uc218\uac00 0~4 \ub97c \ubc97\uc5b4\ub0a8: "+q))
s+=q}p=14-3*b
if(s!==p&&s!==p-1)throw A.d(A.P("\ub2eb\ud78c \ud328\ub294 "+(p-1)+" \ub610\ub294 "+p+" \uc7a5\uc774\uc5b4\uc57c \ud569\ub2c8\ub2e4 (\ud604\uc7ac "+s+" \uc7a5)"))},
jv(a){var t,s,r,q,p
for(t=a.length,s=0,r=0,q=0;q<t;++q){p=a[q]
if(p>0)++r
if(p>=2)++s}t=r<7?7-r:0
return 6-s+t},
jZ(a){var t,s,r,q,p,o
for(t=a.length,s=0,r=!1,q=0;q<13;++q){p=B.X[q]
if(!(p<t))return A.a(a,p)
o=a[p]
if(o>0)++s
if(o>=2)r=!0}t=r?1:0
return 13-s-t},
kf(a,b){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=A.hC(a,0,!1)
for(t=u.S,s=1;s<4;++s,c=q){r=A.hC(a,s*9,s===3)
q=A.a5(10,99,!1,t)
for(p=r.length,o=c.length,n=0;n<=4;++n)for(m=n*2,l=0;l<=1;++l){k=m+l
if(!(k<o))return A.a(c,k)
j=c[k]
if(j>=99)continue
for(i=0;k=n+i,k<=4;++i)for(k=k*2+l,h=i*2,g=0;l+g<=1;++g){f=h+g
if(!(f<p))return A.a(r,f)
e=r[f]
if(e>=99)continue
d=k+g
f=j+e
if(!(d<10))return A.a(q,d)
if(f<q[d])B.a.j(q,d,f)}}}t=(4-b)*2+1
if(!(t>=0&&t<c.length))return A.a(c,t)
return c[t]-1},
hC(a,b,c){var t,s,r,q,p,o,n,m,l=c?7:9
for(t=a.length,s=0,r=0;r<l;++r){q=b+r
if(!(q<t))return A.a(a,q)
s=s*5+a[q]}p=c?$.jH:$.k0
o=p.k(0,s)
if(o!=null)return o
n=J.fN(l,u.S)
for(t=a.length,r=0;r<l;++r){q=b+r
if(!(q<t))return A.a(a,q)
n[r]=a[q]}m=A.kj(n,c)
p.j(0,s,m)
return m},
kj(a9,b0){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=a9.length,a6=new A.ej(),a7=u.S,a8=A.a5(250,99,!1,a7)
B.a.j(a8,a6.$4(0,0,0,0),0)
for(t=!b0,s=a5-3,r=0;r<a5;++r,a8=q){q=A.a5(250,99,!1,a7)
p=t&&r<=s
for(o=0;o<=4;++o)for(n=4-o,m=0;l=o+m,l<=4;++m)for(k=n-m,j=0;j<=4;++j)for(i=0;i<=1;++i){h=B.a.k(a8,a6.$4(o,m,j,i))
if(h>=99)continue
g=p?k:0
for(f=0;f<=g;++f)for(e=j+f,d=l+f,c=0;c<=1;++c)for(b=e+c,a=d+3*c,a0=0;a0+i<=1;++a0){a1=a+2*a0
if(a1>4)continue
if(b>4)continue
if(!(r<a9.length))return A.a(a9,r)
a2=a9[r]
a3=a1>a2?a1-a2:0
a4=a6.$4(m,f,b,i+a0)
a2=h+a3
if(a4>>>0!==a4||a4>=250)return A.a(q,a4)
if(a2<q[a4])B.a.j(q,a4,a2)}}}t=[]
for(j=0;j<=4;++j)for(i=0;i<=1;++i)t.push(B.a.k(a8,a6.$4(0,0,j,i)))
return A.ad(t,a7)},
cL:function cL(a,b,c){this.a=a
this.b=b
this.c=c},
ej:function ej(){},
hH(a,b){var t,s,r,q,p,o,n,m=A.c([],u.p)
for(t=a.b,s=!b.a,r=a.c,q=a.d===B.P,p=0;p<t.length;++p){o=t[p]
n=o.a
if(!(n===B.n||n===B.f)||o.c)continue
if(s&&p===r&&q)continue
B.a.i(m,o)}return m},
kC(a,b,a0,a1){var t,s,r,q,p,o,n,m,l,k,j,i,h=a.gac(),g=a.ga9(),f=A.eU(g),e=b.b,d=u.e,c=A.c([],d)
if(a0.y&&a0.a&&a.b.length===0)B.a.i(c,a0.b===27?B.bY:B.bM)
t=b.a
if(t===B.H){s=a.c
if(!(s>=0&&s<34))return A.a(f,s)
B.a.i(c,f[s]===2?B.bx:B.bs)}else{if(B.a.S(g,A.fy()))B.a.i(c,B.bI)
if(t===B.W){s=A.w(e)
r=s.h("j(1)")
s=s.h("v<1>")
q=A.H(new A.v(e,r.a(new A.ep()),s),s.h("e.E"))
p=A.hH(b,a0).length
o=A.w(q)
n=o.h("j(1)")
o=o.h("v<1>")
m=new A.v(q,n.a(new A.eq()),o).gm(0)
l=new A.v(q,n.a(new A.er()),o).gm(0)
k=new A.v(e,r.a(new A.es()),s).gm(0)
if(h&&p===4)B.a.i(c,b.d===B.D?B.bE:B.bX)
if(m===3)B.a.i(c,B.c_)
if(l===4)B.a.i(c,B.bT)
else{if(l===3){s=b.gaz().b
s=s>=27&&s<=30}else s=!1
if(s)B.a.i(c,B.bJ)}if(B.a.S(g,A.ld()))B.a.i(c,B.bB)
if(B.a.S(g,A.lb()))B.a.i(c,B.bK)
if(k===4)B.a.i(c,B.bz)
if(a.b.length===0){j=A.jx(f,a.c)
if(j!=null)B.a.i(c,j)}}}if(c.length!==0){d=u.a3
t=d.h("L<D.E,M>")
d=A.H(new A.L(new A.L(c,u.bJ.a(new A.et(a1)),d),d.h("M(D.E)").a(new A.eu(a1)),t),t.h("D.E"))
return d}i=A.c([],d)
if(h){d=a0.e
if(d)B.a.i(i,B.bp)
else if(a0.d)B.a.i(i,B.bw)
if((a0.d||d)&&a0.f)B.a.i(i,B.bj)
if(a0.a)B.a.i(i,B.bV)}if(a0.r)B.a.i(i,a0.a?B.bn:B.bA)
if(a0.w&&a0.a)B.a.i(i,B.bL)
if(a0.x&&!a0.a)B.a.i(i,B.bZ)
d=B.a.S(g,A.lc())
if(d)B.a.i(i,B.bS)
if(B.a.S(g,A.le()))B.a.i(i,B.bU)
d=A.w(g)
s=d.h("af<1,b>")
if(A.iz(new A.af(new A.v(g,d.h("j(1)").a(new A.ev()),d.h("v<1>")),d.h("b(1)").a(A.lf()),s),s.h("e.E")).a===1)B.a.i(i,B.a.R(g,A.fy())?B.bi:B.bk)
if(t===B.G)B.a.i(i,B.bW)
else B.a.F(i,A.kg(a,b,a0,a1))
d=u.c9
d=new A.L(i,u.A.a(new A.ew(h)),d).b8(0,d.h("j(D.E)").a(new A.ex()))
d=A.H(d,d.$ti.h("e.E"))
return d},
kg(a0,a1,a2,a3){var t,s,r,q,p,o,n,m,l,k,j,i=a0.gac(),h=a0.ga9(),g=a1.b,f=A.w(g),e=f.h("j(1)"),d=f.h("v<1>"),c=f.h("af<1,b>"),b=A.H(new A.af(new A.v(g,e.a(new A.eb()),d),f.h("b(1)").a(new A.ec()),c),c.h("e.E")),a=A.H(new A.v(g,e.a(new A.ed()),d),d.h("e.E"))
f=A.w(a)
t=new A.L(a,f.h("b(1)").a(new A.ee()),f.h("L<1,b>")).bC(0)
s=a1.gaz()
r=A.c([],u.e)
if(i&&b.length===4&&!new A.ei(a2).$1(s.b)&&a1.d===B.O)B.a.i(r,B.a6)
if(i){for(c=A.w(b),q=A.f3(b,c.c),q=A.ff(q,q.r,A.l(q).c),p=c.h("j(1)"),c=c.h("v<1>"),o=q.$ti.c,n=0;q.n();){m=q.d
n+=B.b.q(new A.v(b,p.a(new A.ef(m==null?o.a(m):m)),c).gm(0),2)}if(n===2)B.a.i(r,B.bu)
else if(n===1)B.a.i(r,B.bP)}for(l=0;l<3;++l){k=l*9
if(B.a.A(b,k)&&B.a.A(b,k+3)&&B.a.A(b,k+6)){B.a.i(r,B.bD)
break}}for(j=0;j<7;++j)if(B.a.A(b,j)&&B.a.A(b,9+j)&&B.a.A(b,18+j)){B.a.i(r,B.bt)
break}for(j=0;j<9;++j)if(t.A(0,j)&&t.A(0,9+j)&&t.A(0,18+j)){B.a.i(r,B.bl)
break}if(a.length===4)B.a.i(r,B.bN)
if(A.hH(a1,a2).length===3)B.a.i(r,B.bC)
if(new A.v(g,e.a(new A.eg()),d).gm(0)===3)B.a.i(r,B.bo)
if(B.a.S(g,A.lh())&&b.length!==0)B.a.i(r,B.a.R(h,A.fy())?B.bq:B.bv)
if(new A.v(a,f.h("j(1)").a(new A.eh()),f.h("v<1>")).gm(0)===2&&s.b>=31)B.a.i(r,B.bQ)
for(f=A.ff(t,t.r,A.l(t).c),e=a2.c,d=a2.b,c=f.$ti.c;f.n();){q=f.d
if(q==null)q=c.a(q)
if(q===31)B.a.i(r,B.bR)
if(q===32)B.a.i(r,B.bF)
if(q===33)B.a.i(r,B.bh)
if(q===d)B.a.i(r,B.c0)
if(q===e)B.a.i(r,B.bG)}return r},
kl(a){var t,s
u.o.a(a)
if(a.a===B.v){t=A.bg(a.b)
return t===1||t===7}s=a.b
return s>=27||A.dB(s)},
jx(a,b){var t,s,r,q,p,o,n=u.S,m=A.iy(n)
for(t=0;t<34;++t)if(a[t]>0){if(t>=27)return null
m.i(0,B.b.q(t,9))}if(m.a!==1)return null
s=m.gG(0)*9
for(r=0;r<9;++r){q=s+r
if(!(q>=0&&q<34))return A.a(a,q)
if(a[q]<B.a0[r])return null}n=A.H(a,n)
if(!(b>=0&&b<n.length))return A.a(n,b)
B.a.j(n,b,n[b]-1)
for(q=n.length,p=!0,r=0;r<9;++r){o=s+r
if(!(o>=0&&o<q))return A.a(n,o)
if(n[o]!==B.a0[r])p=!1}return p?B.br:B.by},
f:function f(a,b,c,d,e,f){var _=this
_.c=a
_.d=b
_.e=c
_.f=d
_.a=e
_.b=f},
M:function M(a,b){this.a=a
this.b=b},
ep:function ep(){},
eq:function eq(){},
er:function er(){},
es:function es(){},
et:function et(a){this.a=a},
eu:function eu(a){this.a=a},
ev:function ev(){},
ew:function ew(a){this.a=a},
ex:function ex(){},
eb:function eb(){},
ec:function ec(){},
ed:function ed(){},
ee:function ee(){},
ei:function ei(a){this.a=a},
ef:function ef(a){this.a=a},
eg:function eg(){},
eh:function eh(){},
b_(a){var t,s,r,q,p,o,n=A.c([],u.ch)
u.Q.a(a)
t=a==null?B.y:a
s=t.length
r=0
for(;r<t.length;t.length===s||(0,A.h)(t),++r){q=A.Y(t[r])
p=A.f8(q)
o=q.length
if(o===2){if(0>=o)return A.a(q,0)
q=q[0]==="0"}else q=!1
n.push(new A.T(p,q))}return n},
iG(a){var t,s,r,q,p,o,n,m,l,k,j,i=a.k(0,"type")
A:{if("draw"===i){t=B.z
break A}if("discard"===i){t=B.i
break A}if("call"===i){t=B.A
break A}t=A.a8(A.az("\uc54c \uc218 \uc5c6\ub294 \uc0ac\uac74: "+A.o(i)))}s=A.B(a.k(0,"seat"))
if(s<0||s>3)throw A.d(A.az("\uc790\ub9ac\ub294 0~3: "+s))
r=A.av(a.k(0,"tile"))
if(t===B.i&&r==null)throw A.d(B.al)
if(r==null)q=null
else{q=A.f8(r)
p=r.length
if(p===2){if(0>=p)return A.a(r,0)
p=r[0]==="0"}else p=!1
p=new A.T(q,p)
q=p}p=A.fj(a.k(0,"tsumogiri"))
o=A.fj(a.k(0,"riichi"))
n=a.k(0,"hand")
n=n==null?null:A.b_(n)
m=A.av(a.k(0,"kind"))
l=A.bl(a.k(0,"from"))
k=A.b_(a.k(0,"tiles"))
j=A.cg(a.k(0,"at"))
j=j==null?null:B.e.P(j)
return new A.ar(t,s,q,p,o===!0,n,m,l,k,j,J.ak(a.k(0,"guess"),!0))},
fS(a){var t,s,r,q
if(!u.j.b(a)||a.length!==4||J.i8(a,new A.dj()))return null
t=A.c([],u.t)
for(s=a.length,r=0;r<a.length;a.length===s||(0,A.h)(a),++r)t.push(B.b.aR(B.e.bB(A.cX(a[r])),0,1000))
s=t.length
if(0>=s)return A.a(t,0)
q=t[0]
if(2>=s)return A.a(t,2)
if(q<t[2]){q=t[1]
if(3>=s)return A.a(t,3)
q=q>=t[3]
s=q}else s=!0
if(s)return null
return t},
iH(a){var t,s,r,q,p,o,n,m,l=null,k=u.f
if(!k.b(a))return l
t=a.k(0,"dir")
s=a.k(0,"side")
r=A.fS(a.k(0,"box"))
if(typeof t!="string"||t.length===0||r==null||typeof s!="string"||!B.a.A(B.I,s))return l
q=a.k(0,"boxes")
if(k.b(q)){k=A.ap(u.N,u.H)
for(p=0;p<4;++p){o=B.I[p]
n=A.fS(q.k(0,o))
if(n!=null)k.j(0,o,n)}m=k}else m=l
k=A.cg(a.k(0,"start_ms"))
k=k==null?l:B.e.P(k)
n=A.cg(a.k(0,"end_ms"))
n=n==null?l:B.e.P(n)
return new A.di(t,r,s,k,n,m==null||m.a===0?l:m)},
iI(a){var t,s,r
if(u.f.b(a)){t=A.av(a.k(0,"kind"))
if(t==null)t="pon"
return new A.bQ(t,A.b_(a.k(0,"tiles")))}if(u.j.b(a)&&J.fD(a)){s=A.b_(a)
r=B.a.S(s,new A.dl(s))
if(s.length===4)t="kan"
else t=r?"pon":"chi"
return new A.bQ(t,s)}return null},
iJ(a){var t,s,r,q,p,o,n,m,l="win_tile",k=null,j=A.Y(a.k(0,"type")),i=A.bl(a.k(0,"winner")),h=A.bl(a.k(0,"loser"))
if(a.k(0,l)==null)t=k
else{t=A.Y(a.k(0,l))
s=A.f8(t)
r=t.length
if(r===2){if(0>=r)return A.a(t,0)
t=t[0]==="0"}else t=!1
t=new A.T(s,t)}s=a.k(0,"hand")
s=s==null?k:A.b_(s)
r=A.c([],u.b_)
q=u.Q.a(a.k(0,"melds"))
if(q==null)q=B.y
p=q.length
o=0
for(;o<q.length;q.length===p||(0,A.h)(q),++o){n=A.iI(q[o])
if(n!=null)r.push(n)}if(a.k(0,"flags")==null)q=k
else{q=A.ap(u.N,u.y)
for(p=u.f.a(a.k(0,"flags")).gaa(),p=p.gt(p);p.n();){n=p.gp()
q.j(0,A.Y(n.a),J.ak(n.b,!0))}}p=u.j
if(p.b(a.k(0,"tenpai"))){n=A.c([],u.t)
for(p=p.a(a.k(0,"tenpai")),m=p.length,o=0;o<p.length;p.length===m||(0,A.h)(p),++o)n.push(B.e.P(A.cX(p[o])))
p=n}else p=k
return new A.dk(j,i,h,t,s,r,q,p)},
iK(a8){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5=null,a6="start_scores",a7=A.bl(a8.k(0,"version"))
if(a7==null)a7=1
if(a7!==1)throw A.d(A.az("\ubaa8\ub974\ub294 \ud328\ubcf4 \ubc84\uc804: "+a7))
t=A.B(a8.k(0,"hero"))
if(t<0||t>3)throw A.d(A.az("hero \ub294 0~3: "+t))
s=u.s
r=A.c([],s)
q=u.Q
p=q.a(a8.k(0,"names"))
if(p==null)p=B.y
o=p.length
n=0
for(;n<p.length;p.length===o||(0,A.h)(p),++n)r.push(A.Y(p[n]))
p=A.av(a8.k(0,"id"))
if(p==null)p=""
o=A.av(a8.k(0,"title"))
if(o==null)o=""
m=A.av(a8.k(0,"round"))
if(m==null)m=""
l=A.bl(a8.k(0,"honba"))
if(l==null)l=0
k=A.bl(a8.k(0,"dealer"))
if(k==null)k=0
s=A.c([],s)
for(j=0;j<4;++j){i=r.length
if(j<i){if(!(j<i))return A.a(r,j)
i=r[j]}else i=""
s.push(i)}r=A.b_(a8.k(0,"dora_indicators"))
i=A.b_(a8.k(0,"ura_indicators"))
h=A.av(a8.k(0,"note"))
if(h==null)h=""
g=a8.k(0,"start_hand")
g=g==null?a5:A.b_(g)
f=A.c([],u.cw)
q=q.a(a8.k(0,"events"))
if(q==null)q=B.y
e=q.length
d=u.cg
n=0
for(;n<q.length;q.length===e||(0,A.h)(q),++n)f.push(A.iG(d.a(q[n])))
q=a8.k(0,"result")==null?a5:A.iJ(d.a(a8.k(0,"result")))
e=A.iH(a8.k(0,"frames"))
d=A.av(a8.k(0,"hand_source"))
c=u.j
if(c.b(a8.k(0,"restore"))){b=A.c([],u.Y)
for(a=c.a(a8.k(0,"restore")),a0=a.length,a1=u.f,a2=u.N,a3=u.z,n=0;n<a.length;a.length===a0||(0,A.h)(a),++n){a4=a[n]
if(a1.b(a4))b.push(a4.ap(0,a2,a3))}}else b=a5
if(c.b(a8.k(0,a6))){a=A.c([],u.t)
for(c=c.a(a8.k(0,a6)),a0=c.length,n=0;n<c.length;c.length===a0||(0,A.h)(c),++n)a.push(B.e.P(A.cX(c[n])))
c=a}else c=a5
a=A.cg(a8.k(0,"kyotaku"))
return new A.dh(p,o,m,l,k,t,s,r,i,h,g,f,q,e,d,b,c,a==null?a5:B.e.P(a))},
T:function T(a,b){this.a=a
this.b=b},
bP:function bP(a,b){this.a=a
this.b=b},
ar:function ar(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k},
di:function di(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
dj:function dj(){},
bQ:function bQ(a,b){this.a=a
this.b=b},
dl:function dl(a){this.a=a},
dk:function dk(a,b,c,d,e,f,g,h){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h},
aS:function aS(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
aC:function aC(a,b,c){this.a=a
this.b=b
this.c=c},
bb:function bb(a,b,c,d){var _=this
_.b=a
_.c=b
_.d=c
_.y=d},
dh:function dh(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p
_.ch=q
_.CW=r
_.cy=_.cx=$},
du:function du(a){this.a=a},
dt:function dt(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ds:function ds(a){this.a=a},
h0(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){return new A.V(f,a8,d,e,a7,r,a6,i,a4,o,a,c,a5,a9,q,h,s,g,a3,p)},
kV(a,b){var t,s,r
if(a==null)return null
for(t=a.length,s=0;s<t;++s){r=a[s]
if(!r.ax)return r.a}return b},
kW(a,b,c,d,e,f){var t,s,r,q,p,o,n,m,l,k,j=null
if(f!==B.l||a)return j
if(e<3)return j
if(d==null||d.gm(d)<2||c==null)return j
t=new A.eL(d)
if(!d.aq(b)||!d.aq(c))return j
for(s=d.gM(),s=s.gt(s),r=1/0;s.n();){q=t.$1(s.gp())
if(q<r)r=q}if(t.$1(c)-r<5)return j
p=t.$1(b)
s=p-r
if(s>=5)s=B.aW
else s=s<2?B.aX:B.aY
o=[]
n=d.gM()
n=A.H(n,A.l(n).h("e.E"))
B.a.a1(n)
m=n.length
l=0
for(;l<n.length;n.length===m||(0,A.h)(n),++l){k=n[l]
if(J.ak(t.$1(k),r))o.push(k)}return new A.dv(s,e,b,p,r,A.ad(o,u.S))},
k6(a,b){var t
for(t=0;t<34;++t)if(a[t]!==b[t])return!1
return!0},
dY(a){var t,s,r,q=A.a5(34,0,!1,u.S)
for(t=a.length,s=0;s<a.length;a.length===t||(0,A.h)(a),++s){r=a[s].a
if(!(r>=0&&r<34))return null
if(!(r>=0&&r<34))return A.a(q,r)
B.a.j(q,r,q[r]+1)}return q},
l_(a,b){var t,s,r,q,p,o,n,m,l,k,j,i,h,g=null,f=a.f,e=null
if(f>=0&&f<4)try{e=a.gaC()}catch(t){e=null}if(e==null){s=A.c([],u.U)
for(r=A.d6(a.Q,0,u.O),q=J.aa(r.a),p=r.b,r=new A.a_(q,p,A.l(r).h("a_<1>")),o=0;r.n();){n=r.c
n=n>=0?new A.au(p+n,q.gp()):A.a8(A.aN())
m=n.b
if(m.b===f&&m.a===B.i&&m.c!=null){++o
l=m.c
l.toString
s.push(new A.V(n.a,o,l,g,m.d,m.e,B.m,0,g,B.Z,g,g,g,g,g,g,B.j,g,B.j,g))}}return new A.cH(s)}k=A.a5(4,g,!1,u.I)
j=A.c([],u.U)
for(s=A.d6(a.Q,0,u.O),r=J.aa(s.a),q=s.b,s=new A.a_(r,q,A.l(s).h("a_<1>")),i=0;s.n();){p=s.c
p=p>=0?new A.au(q+p,r.gp()):A.a8(A.aN())
h=p.a
m=p.b
p=m.a===B.i
if(p&&m.b===f){++i
B.a.i(j,A.k5(a,e,h,i,k,b,!1,!1))}n=!1
if(p)if(m.e){p=m.b
if(!(p>=0&&p<4))return A.a(k,p)
p=k[p]==null}else p=n
else p=n
if(p)B.a.j(k,m.b,h)}return new A.cH(A.ad(j,u.T))},
k5(d3,d4,d5,d6,d7,d8,d9,e0){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,c0,c1,c2,c3,c4,c5,c6,c7,c8=null,c9={},d0=d3.f,d1=d3.Q,d2=d1.length
if(!(d5>=0&&d5<d2))return A.a(d1,d5)
t=d1[d5]
s=t.c
s.toString
if(!(d5<d4.length))return A.a(d4,d5)
r=d4[d5]
q=r.c
if(!(d0>=0&&d0<q.length))return A.a(q,d0)
p=q[d0].length
c9.a=null
for(o=d5-1;n=c8,o>=0;--o){if(!(o<d2))return A.a(d1,o)
m=d1[o]
if(m.b!==d0)continue
d2=m.a
if(d2===B.z)c9.a=m
else n=d2===B.A?m:c8
break}d2=u.t
l=A.c([],d2)
for(k=r.d,j=k.length,i=0;i<4;++i){if(i!==d0){if(!(i<j))return A.a(k,i)
h=k[i]}else h=!1
if(h)l.push(i)}if(l.length!==0){h=u.y
g=A.a5(34,!0,!1,h)
for(f=l.length,e=r.b,d=0;d<l.length;l.length===f||(0,A.h)(l),++d){i=l[d]
c=A.a5(34,!1,!1,h)
if(!(i<e.length))return A.a(e,i)
b=e[i]
a=b.length
a0=0
for(;a0<a;++a0){a1=b[a0].a.a
if(a1>=0&&a1<34)B.a.j(c,a1,!0)}if(!(i<4))return A.a(d7,i)
a2=d7[i]
if(a2!=null)for(o=a2+1;o<d5;++o){if(!(o>=0&&o<d1.length))return A.a(d1,o)
m=d1[o]
a3=m.c
b=!1
if(m.a===B.i)if(a3!=null){b=a3.a
b=b>=0&&b<34}if(b)B.a.j(c,a3.a,!0)}for(a3=0;a3<34;++a3)if(!c[a3])B.a.j(g,a3,!1)}}else g=c8
d1=g==null
if(d1)a4=c8
else{h=s.a
if(h>=0&&h<34){if(!(h>=0&&h<34))return A.a(g,h)
h=g[h]
a4=h}else a4=!1}h=u.S
a5=A.a5(34,0,!1,h)
a6=new A.e4(a5)
for(f=r.b,i=0;i<4;++i){if(!(i<f.length))return A.a(f,i)
e=f[i]
b=e.length
d=0
for(;d<b;++d){a7=e[d]
if(!a7.d)a6.$1(a7.a)}if(!(i<q.length))return A.a(q,i)
e=q[i]
b=e.length
d=0
for(;d<b;++d)B.a.L(e[d].b,a6)}B.a.L(d3.w,a6)
a8=new A.e1(c9,!1,d3,d5,s,a5,d6,t,p,l,a4)
if(!t.z){q=c9.a
q=q==null?c8:q.z
q=q===!0}else q=!0
if(q)return a8.$1(B.M)
q=c9.a
if(q!=null&&q.f!=null&&q.c!=null){q=q.f
q.toString
q=A.H(q,u._)
f=c9.a.c
f.toString
q.push(f)
a9=A.dY(q)
b0=a9==null
b1=q}else if(n!=null&&n.f!=null){q=n.f
q.toString
a9=A.dY(q)
b0=a9==null
b1=q}else{b1=c8
a9=b1
b0=!1}q=t.f
if(q!=null){q=A.H(q,u._)
q.push(s)
b2=A.dY(q)
b0=b0||b2==null
b3=q}else{b3=c8
b2=b3}if(!b0){q=s.a
q=!(q>=0&&q<34)||p>4}else q=!0
if(q)return a8.$1(B.m)
q=a9==null
b4=q?b2:a9
b5=b1==null?b3:b1
if(b4==null||b5==null)return a8.$1(B.L)
if(!q&&b2!=null&&!A.k6(a9,b2))return a8.$1(B.m)
for(b6=0,d=0;d<34;++d){b7=b4[d]
if(b7>4)return a8.$1(B.m)
b6+=b7}if(b6===14-3*p){q=s.a
if(!(q>=0&&q<34))return A.a(b4,q)
q=b4[q]===0}else q=!0
if(q)return a8.$1(B.m)
b8=A.kD(b4,p,a5)
b9=B.a.gG(b8)
c0=B.a.aV(b8,new A.e2(s))
c1=A.eQ(b4,p).ga4()
c2=c0.b-b9.b
q=b9.c
c3=q.gC()-c0.c.gC()
f=A.w(b8)
f=new A.v(b8,f.h("j(1)").a(new A.e3(c0)),f.h("v<1>")).gm(0)
if(!(d0<j))return A.a(k,d0)
if(k[d0])c4=B.u
else if(c1===-1)c4=B.q
else c4=l.length!==0?B.l:B.d
if(c4===B.d){c5=q.gC()
if(c2>0)c6=B.k
else if(c3<=0)c6=B.t
else{q=c3*100
if(q<=10*c5)c6=B.a4
else c6=q<=30*c5?B.B:B.C}}else c6=c8
q=c9.a
k=q==null
c7=k&&n!=null
q=k?c8:q.c
k=A.ad(b8,u.L)
l=A.ad(l,h)
d2=A.c([],d2)
if(!d1)for(a3=0;a3<34;++a3)if(b4[a3]>0&&g[a3])d2.push(a3)
d1=A.ad(b4,h)
return A.h0(c0,d1,b9,s,q,d5,a4,c6,p,c8,c8,c8,c8,c8,k,A.kW(c7,s.a,A.kV(c8,c8),c8,c1,c4),1+f,t.e,l,c8,c8,B.j,c8,d2,c1,c2,c4,t.d,d6,c3)},
l8(a){var t,s,r,q,p=new A.eS(),o=a.z
if(o!=null)return p.$1(o)?o:null
for(o=a.Q,t=o.length,s=a.f,r=0;r<t;++r){q=o[r]
if(q.b!==s)continue
if(q.a===B.z&&!q.z&&p.$1(q.f))return q.f
return null}return null},
l1(a0){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c=null,b=A.c([],u.c0),a=A.l8(a0)
if(a!=null){t=A.dY(a)
if(t!=null)B.a.i(b,new A.U(B.aZ,0,A.eQ(t,0).ga4(),c,c,0))}for(s=a0.Q,r=A.d6(s,0,u.O),q=J.aa(r.a),p=r.b,r=new A.a_(q,p,A.l(r).h("a_<1>")),o=a0.f,n=c,m=n,l=m,k=l,j=0,i=0;r.n();){h=r.c
h=h>=0?new A.au(p+h,q.gp()):A.a8(A.aN())
g=h.a
f=h.b
if(f.a!==B.i)continue
e=f.b
if(e===o){++j
if(k!=null)++i
else if(f.e){k=g+1
l=j}}else if(f.e&&m==null){m=g+1
n=e}}if(k!=null)B.a.i(b,new A.U(B.K,k,c,o,l,i))
if(m!=null)B.a.i(b,new A.U(B.K,m,c,n,c,0))
s=s.length
r=a0.as!=null?1:0
d=s+1+r-1
if(d>0&&!B.a.R(b,new A.eN(d)))B.a.i(b,new A.U(B.b_,d,c,c,c,0))
B.a.a5(b,new A.eO())
return b},
dw:function dw(){},
as:function as(a,b){this.a=a
this.b=b},
a6:function a6(a,b){this.a=a
this.b=b},
V:function V(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k
_.Q=l
_.as=m
_.at=n
_.ax=o
_.ay=p
_.ch=q
_.CW=r
_.cx=s
_.k2=t},
bS:function bS(a,b){this.a=a
this.b=b},
dv:function dv(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eL:function eL(a){this.a=a},
cH:function cH(a){this.a=a},
dm:function dm(a){this.a=a},
dn:function dn(a){this.a=a},
dp:function dp(a){this.a=a},
dq:function dq(a){this.a=a},
e4:function e4(a){this.a=a},
e1:function e1(a,b,c,d,e,f,g,h,i,j,k){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f
_.r=g
_.w=h
_.x=i
_.y=j
_.z=k},
e2:function e2(a){this.a=a},
e3:function e3(a){this.a=a},
bW:function bW(a,b){this.a=a
this.b=b},
U:function U(a,b,c,d,e,f){var _=this
_.a=a
_.b=b
_.c=c
_.d=d
_.e=e
_.f=f},
eS:function eS(){},
eT:function eT(){},
eN:function eN(a){this.a=a},
eO:function eO(){},
l3(a){var t
for(t=0;t<4;++t)if(B.p.b6(a,B.aS[t]))return 27+t
return 27},
l5(a6){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=null,a4=a6.as,a5=a4.b
a5.toString
t=a4.r
for(s=a6.Q,r=s.length,q=!1,p=!1,o=0,n=0,m=0,l=0,k=0;k<r;++k){j=s[k]
i=j.a
if(i===B.A){++m
if(q)++l}else if(i===B.i&&j.b===a5){++o
if(q)++n
else{q=j.e
if(q)p=o===1&&m===0}}}h=q&&n===0&&l===0
s=a4.a
a5=B.b.H(a5-a6.e,4)
r=A.l3(a6.c)
i=t==null
g=i?a3:t.k(0,"riichi")
if(g==null)g=q&&!p
f=i?a3:t.k(0,"double_riichi")
if(f==null)f=p
e=i?a3:t.k(0,"ippatsu")
if(e==null)e=h
d=i?a3:t.k(0,"last_tile")
if(d==null)d=B.b.aR(70-B.a.gb_(a6.gaC()).y,0,70)===0
c=i?a3:t.k(0,"rinshan")
b=i?a3:t.k(0,"chankan")
i=i?a3:t.k(0,"first_turn")
a=u.t
a0=A.c([],a)
for(a1=a6.w,a2=a1.length,k=0;k<a1.length;a1.length===a2||(0,A.h)(a1),++k)a0.push(a1[k].a)
a=A.c([],a)
for(a1=a6.x,a2=a1.length,k=0;k<a1.length;a1.length===a2||(0,A.h)(a1),++k)a.push(a1[k].a)
return new A.dA(s==="tsumo",27+a5,r,g,f,e,d,c===!0,b===!0,i===!0,a0,a,a6.d)},
k_(a){var t,s,r,q,p,o,n,m,l=a.b
if(l.length===0)return null
q=u.t
p=A.c([],q)
for(o=l.length,n=0;n<l.length;l.length===o||(0,A.h)(l),++n)p.push(l[n].a)
B.a.a1(p)
t=p
try{s=null
r=a.a
A:{if("chi"===r){s=A.iC(J.d0(t))
break A}if("pon"===r){l=J.d0(t)
s=A.df(B.aU,A.c([l,l,l],q),!0)
break A}if("kan"===r){l=J.d0(t)
s=A.df(B.a1,A.c([l,l,l,l],q),!0)
break A}if("ankan"===r){l=J.d0(t)
s=A.df(B.a1,A.c([l,l,l,l],q),!1)
break A}s=null
break A}s=s
return s}catch(m){if(A.ci(m) instanceof A.ab)return null
else throw m}},
hN(a,b){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f=null,e=a.as
if(e==null||e.b==null||e.e==null||e.d==null)return f
if(e.a!=="ron"&&e.a!=="tsumo")return f
t=A.c([],u.c)
for(o=e.f,n=o.length,m=0;m<o.length;o.length===n||(0,A.h)(o),++m){l=A.k_(o[m])
if(l==null)return f
J.eW(t,l)}o=e.e
o.toString
o=A.H(o,u._)
n=e.d
n.toString
o.push(n)
for(n=e.f,k=n.length,m=0;m<n.length;n.length===k||(0,A.h)(n),++m)B.a.F(o,n[m].b)
n=u.t
k=A.c([],n)
for(j=o.length,m=0;m<o.length;o.length===j||(0,A.h)(o),++m){i=o[m]
if(i.b)k.push(i.a)}s=k
r=null
try{q=A.c([],n)
for(o=e.e,n=o.length,m=0;m<o.length;o.length===n||(0,A.h)(o),++m){p=o[m]
J.eW(q,p.a)}J.eW(q,e.d.a)
o=e.d.a
r=A.fM(q,t,J.aw(s),s,o)}catch(h){if(A.ci(h) instanceof A.ab)return f
else throw h}g=A.l5(a)
return new A.dr(g,A.ku(r,g,b))},
dr:function dr(a,b){this.b=a
this.c=b},
e5(a){return A.y(["kuitan",!0,"kiriageMangan",!1,"kazoeYakuman",!0,"doubleYakuman",!0,"doubleWindPairFu",4,"redDora",!0],u.N,u.X)},
hx(a){var t=B.h.aS(a,null)
if(!u.f.b(t))throw A.d(B.aj)
return A.iK(t.ap(0,u.N,u.z))},
hs(a){var t,s,r
try{s=a.$0()
return s}catch(r){t=A.ci(r)
s=u.N
s=B.h.Z(A.y(["error",J.bq(t)],s,s),null)
return s}},
jG(a){if(a.a.f>0)return a.b>=2?"\ub354\ube14 \uc5ed\ub9cc":"\uc5ed\ub9cc"
return""+a.b+"\ud310"},
k2(a){var t=a.e>0?"  ("+a.gaX()+")":"",s=a.a
if(s>0)return"\ub860: \ubc29\ucd1d\uc790 "+s+"\uc810"+t
s=a.b
if(s===0)return"\ucbd4\ubaa8: \uac01 "+a.c+"\uc810"+t
return"\ucbd4\ubaa8: \uc790 "+a.c+"\uc810 / \uce5c "+s+"\uc810"+t},
ke(a){var t,s=a.e
if(s===B.r){t=a.gae()
return t>=2?""+t+"\ubc30 \uc5ed\ub9cc":"\uc5ed\ub9cc"}return s.c},
k9(a){var t,s,r,q,p,o,n,m=a.b
if(!(m>=0&&m<34))return A.a(B.c,m)
t=B.c[m]
s=a.c
if(!(s<34))return A.a(B.c,s)
s=B.c[s]
r=u.s
q=A.c([],r)
for(p=a.z,o=p.length,n=0;n<p.length;p.length===o||(0,A.h)(p),++n)q.push(A.r(p[n]))
r=A.c([],r)
for(p=a.Q,o=p.length,n=0;n<p.length;p.length===o||(0,A.h)(p),++n)r.push(A.r(p[n]))
return A.y(["isTsumo",a.a,"isDealer",m===27,"seatWind",t,"roundWind",s,"riichi",a.d,"doubleRiichi",a.e,"ippatsu",a.f,"lastTile",a.r,"rinshan",a.w,"chankan",a.x,"firstTurnWin",a.y,"doraIndicators",q,"uraIndicators",r,"honba",a.as],u.N,u.X)},
fo(a){var t,s=A.ap(u.N,u.X)
s.j(0,"type",a.a)
s.j(0,"winner",a.b)
s.j(0,"loser",a.c)
t=a.d
s.j(0,"winTile",t==null?null:t.gY())
t=a.w
if(t!=null)s.j(0,"tenpai",t)
return s},
l4(a){return A.hs(new A.eP(a))},
jo(a){var t=a.r
if(t===B.d&&a.ay!=null){t=a.ay
t.toString
return A.d_(t)}if(t===B.l)return"\uc218\ube44"
if(t===B.q)return"\ud654\ub8cc \ud615\ud0dc"
return null},
fl(a){var t
switch(a.a){case 0:t="\u2605"
break
case 1:t="\u2713"
break
case 2:t="?!"
break
case 3:t="?"
break
case 4:t="??"
break
default:t=null}return t},
jr(a){var t=a.y,s=A.fZ(t,0,A.hF(3,"count",u.S),A.w(t).c).b1(0),r=a.z
if(r!=null&&!B.a.R(s,new A.dW(r)))B.a.i(s,r)
return s},
e0(a,b,c){var t,s,r,q,p,o,n,m,l,k,j,i,h=b.a,g=A.r(h)
if(!(h<34))return A.a(B.c,h)
t=B.c[h]
s=b.b
r=A.eR(s)
q=s<=0?"\ub300\uae30":"\uc720\ud6a8\ud328"
p=b.c
o=p.gC()
n=A.c([],u.J)
for(p=p.b,m=p.length,l=u.N,k=u.K,j=0;j<m;++j){i=p[j]
n.push(A.y(["tile",A.r(i.a),"left",i.b],l,k))}return A.y(["tile",g,"name",t,"shanten",s,"shantenText",r,"word",q,"ukeire",o,"ukeireTiles",n,"actual",h===a.c.a,"best",c.A(0,h),"info",A.ks(a,h)],l,u.X)},
km(a8){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2=null,a3=a8.ay,a4=a8.r,a5=a4===B.d&&a3!=null,a6=A.em(a8),a7=A.f3(a6,A.w(a6).c)
a6=a8.a
t=a8.c
s=t.gY()
t=A.fx(t)
r=a8.d
r=r==null?a2:r.gY()
q=A.hO(a4)
p=a5?a3.b:a2
o=a5?A.d_(a3):a2
n=a5?A.fl(a3):a2
m=A.jo(a8)
l=u.s
k=A.c([],l)
for(j=a8.cx,i=j.length,h=0;h<j.length;j.length===i||(0,A.h)(j),++h)k.push(A.r(j[h]))
j=A.l2(a8)
i=A.hM(a8)
g=A.kY(a8)
f=A.l0(a8,!1)
l=A.c([],l)
for(e=A.em(a8),d=e.length,h=0;h<e.length;e.length===d||(0,A.h)(e),++h)l.push(A.r(e[h]))
e=A.el(a8,!0)
d=a8.z
d=d==null?a2:A.e0(a8,d,a7)
c=a8.Q
c=c==null?a2:A.e0(a8,c,a7)
b=u.d
a=A.c([],b)
for(a0=A.jr(a8),a1=a0.length,h=0;h<a0.length;a0.length===a1||(0,A.h)(a0),++h)a.push(A.e0(a8,a0[h],a7))
b=A.c([],b)
for(a0=a8.y,a1=a0.length,h=0;h<a1;++h)b.push(A.e0(a8,a0[h],a7))
return A.y(["step",a6+1,"eventIndex",a6,"turn",a8.b,"discard",s,"discardName",t,"drawn",r,"tsumogiri",a8.e,"riichiDeclared",a8.f,"status",a4.b,"statusName",q,"grade",p,"gradeName",o,"glyph",n,"badge",m,"melds",a8.w,"shantenBefore",a8.x,"shantenLoss",a8.as,"ukeireLoss",a8.at,"rank",a8.ax,"riichiSeats",a8.ch,"genbutsu",a8.CW,"safeTiles",k,"title",j,"corner",i,"lines",g,"sentence",f,"bestTiles",l,"bestLabel",e,"actual",d,"best",c,"candidates",a,"options",b],u.N,u.X)},
k4(a){var t,s=a==null?null:a.a
A:{t="\uc720\uad6d"
if("ron"===s){t="\ub860"
break A}if("tsumo"===s){t="\ucbd4\ubaa8"
break A}if("draw"===s)break A
if(s==null){t=""
break A}break A}return t},
kk(a8,a9){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=a9.gaU(),a4=a8.gbu(),a5=a9.a,a6=B.a.R(a5,new A.ek()),a7=a8.b
a7=a7.length!==0?a7:a8.c
t=A.k4(a8.as)
s=a5.length
r=a9.K(B.d)
q=a3==null?"\ud3c9\uac00\ud560 \ubc84\ub9bc\uc774 \uc5c6\uc2b5\ub2c8\ub2e4":"\ubc84\ub9bc "+a5.length+"\ubc88 \uac00\uc6b4\ub370 "+a9.K(B.d)+"\ubc88\uc744 \ud3c9\uac00\ud588\uc2b5\ub2c8\ub2e4."
p=u.N
o=u.S
n=A.y(["goodPct",10,"inaccuracyPct",30],p,o)
m=u.J
l=A.c([],m)
for(k=u.K,j=0;j<5;++j){i=B.aJ[j]
l.push(A.y(["grade",i.b,"name",A.d_(i),"glyph",A.fl(i),"count",a9.b5(i)],p,k))}o=A.y(["forced",a9.K(B.u),"defense",a9.K(B.l),"complete",a9.K(B.q),"handUnknown",a9.gaW()],p,o)
h=a9.K(B.u)
g=a9.K(B.l)
f=a9.K(B.q)
e=a9.gaW()
m=A.c([],m)
for(d=a9.bA(),c=d.length,j=0;j<d.length;d.length===c||(0,A.h)(d),++j){b=d[j]
a=b.b
a0=b.c
a1=a0.b
a0=a0.a
if(a1){a2=A.r(a0)
if(1>=a2.length)return A.a(a2,1)
a2="0"+a2[1]}else a2=A.r(a0)
if(a1){if(!(a0>=0&&a0<34))return A.a(B.c,a0)
a0="\uc801"+B.c[a0]}else{if(!(a0>=0&&a0<34))return A.a(B.c,a0)
a0=B.c[a0]}a1=b.ay
m.push(A.y(["step",b.a+1,"turn",a,"discard",a2,"text",""+a+"\uc21c "+a0+" \ubc84\ub9bc","grade",a1.b,"gradeName",A.d_(a1),"glyph",A.fl(a1),"loss",A.kR(b)],p,k))}k=A.c([],u.t)
for(d=a5.length,j=0;j<a5.length;a5.length===d||(0,A.h)(a5),++j){b=a5[j]
if(B.b2.A(0,b.ay))k.push(b.a+1)}B.a.a1(k)
return A.y(["hasHeroHands",a4,"hasNumbers",a6,"head",a7,"result",t,"turns",s,"graded",r,"efficiencyPct",a3,"evaluatedText",q,"noteText","\uc720\ud6a8\ud328 \uc218\ub9cc \ubcf8 \uac12\uc785\ub2c8\ub2e4. \uc218\ube44\uc640 \uc810\uc218 \ud310\ub2e8\uc740 \ub4e4\uc5b4 \uc788\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.","thresholds",n,"thresholdText","\ub4f1\uae09 \uae30\uc900(\ucd5c\uc120\ubcf4\ub2e4 \uc720\ud6a8\ud328\uac00 10% \uc774\ud558\ub85c \uc801\uc73c\uba74 \uc88b\uc74c, 30% \uc774\ud558\uba74 \ubd80\uc815\ud655, \uadf8\ubcf4\ub2e4 \ub9ce\uc73c\uba74 \uc2e4\uc218)\uc740 \uc784\uc2dc \uae30\uc900\uc785\ub2c8\ub2e4.","grades",l,"skip",o,"skipText","\ub9ac\uce58 \uc911 "+h+" \xb7 \uc218\ube44 "+g+" \xb7 \ud654\ub8cc \ud615\ud0dc "+f+" \xb7 \uc190\ud328 \ubaa8\ub984 "+e,"lessons",m,"noLessonText","\uc774 \ud310\uc740 \uc720\ud6a8\ud328 \uc218\uc5d0\uc11c \uc9c0\uc801\ud560 \uacf3\uc774 \uc5c6\uc2b5\ub2c8\ub2e4","flaggedSteps",k],p,u.X)},
kd(a,b,c){var t,s,r,q,p,o,n,m,l,k=new A.ea(c),j=A.hN(a,B.o),i=j!=null&&j.c.a==null?j.c.r.d:null,h=A.c([],u.d)
for(t=A.l1(a),s=t.length,r=a.as,q=u.N,p=u.X,o=0;o<t.length;t.length===s||(0,A.h)(t),++o){j=t[o]
n=j.a
m=A.l6(n)
l=A.kE(r,i)
h.push(A.y(["step",j.b,"kind",n.b,"name",m,"sentence",A.l7(j,b.gaU(),l,k)],q,p))}return h},
kZ(a,b){return A.hs(new A.eM(a,b))},
eP:function eP(a){this.a=a},
dW:function dW(a){this.a=a},
ek:function ek(){},
ea:function ea(a){this.a=a},
eM:function eM(a,b){this.a=a
this.b=b},
hz(a){var t,s,r
try{s=a.$0()
return s}catch(r){t=A.ci(r)
s=u.N
s=B.h.Z(A.y(["error","engine: "+A.o(t)],s,s),null)
return s}},
kT(){var t,s,r,q="Attempting to rewrap a JS function.",p={},o=new A.eI()
if(typeof o=="function")A.a8(A.P(q))
t=function(a,b){return function(c){return a(b,c,arguments.length)}}(A.jp,o)
s=$.fz()
t[s]=o
p.score=t
o=new A.eJ()
if(typeof o=="function")A.a8(A.P(q))
t=function(a,b){return function(c,d){return a(b,c,d,arguments.length)}}(A.jq,o)
t[s]=o
p.review=t
p.version="mahjong_calc@dfa2425"
p.apiVersion=1
o=v.G
o.mjEngine=p
r=o.mjEngineOnReady
if(r!=null&&A.iu(r,"Function"))u.M.a(r).call()},
hB(a){if(a!=null&&typeof a==="string")return A.Y(a)
throw A.d(B.ak)},
eI:function eI(){},
eH:function eH(a){this.a=a},
eJ:function eJ(){},
eG:function eG(a,b){this.a=a
this.b=b},
hR(a){return v.mangledGlobalNames[a]},
iu(a,b){var t,s,r,q,p
if(b.length===0)return!1
t=b.split(".")
s=v.G
for(r=t.length,q=0;q<r;++q,s=p){p=s[t[q]]
A.hm(p)
if(p==null)return!1}return a instanceof u.M.a(s)},
jp(a,b,c){u.Z.a(a)
if(A.B(c)>=1)return a.$1(b)
return a.$0()},
jq(a,b,c,d){u.Z.a(a)
A.B(d)
if(d>=2)return a.$2(b,c)
if(d===1)return a.$1(b)
return a.$0()},
iU(a){return B.b.q(A.B(a),9)},
bg(a){return a<27?B.b.H(a,9)+1:0},
iR(a){return A.B(a)>=27},
dB(a){var t
A.B(a)
if(a<27){t=B.b.H(a,9)
t=t===0||t===8}else t=!1
return t},
iT(a){A.B(a)
return a>=27||A.dB(a)},
iS(a){A.B(a)
return!(a>=27||A.dB(a))},
iQ(a){var t
A.B(a)
if(a!==32)t=B.b.q(a,9)===2&&B.a.A(B.aQ,A.bg(a))
else t=!0
return t},
iP(a){var t,s,r
if(a<27){t=B.b.q(a,9)
s=A.bg(a)
r=s===9?0:s
return t*9+r}if(a<=30)return a===30?27:a+1
return a===33?31:a+1},
f8(a){var t,s,r=a.length
if(r!==2)throw A.d(A.az("\ud328 \ucf54\ub4dc\ub294 \ub450 \uae00\uc790\uc5ec\uc57c \ud569\ub2c8\ub2e4: "+a))
if(0>=r)return A.a(a,0)
t=A.iL(a[0],null)
if(1>=r)return A.a(a,1)
s=B.a.bv(B.J,a[1])
if(t==null||s<0)throw A.d(A.az("\uc798\ubabb\ub41c \ud328 \ucf54\ub4dc: "+a))
if(s===3){if(t<1||t>7)throw A.d(A.az("\uc790\ud328\ub294 1z~7z: "+a))
return 27+t-1}if(t===0)return s*9+4
if(t<1||t>9)throw A.d(A.az("\uc798\ubabb\ub41c \ud328 \ucf54\ub4dc: "+a))
return s*9+t-1},
r(a){var t,s
A.B(a)
if(a<27){t=A.bg(a)
s=B.b.q(a,9)
if(!(s>=0&&s<4))return A.a(B.J,s)
return""+t+B.J[s]}return""+(a-27+1)+"z"},
h_(a){if(!(a>=0&&a<34))return A.a(B.c,a)
return B.c[a]},
eU(a){var t,s,r,q=A.a5(34,0,!1,u.S)
for(t=a.length,s=0;s<a.length;a.length===t||(0,A.h)(a),++s){r=a[s]
if(!(r>=0&&r<34))return A.a(q,r)
B.a.j(q,r,q[r]+1)}return q},
d_(a){var t
switch(a.a){case 0:t="\ucd5c\uc120"
break
case 1:t="\uc88b\uc74c"
break
case 2:t="\ubd80\uc815\ud655"
break
case 3:t="\uc2e4\uc218"
break
case 4:t="\ud070 \uc2e4\uc218"
break
default:t=null}return t},
hO(a){var t
A:{if(B.d===a){t="\ud3c9\uac00"
break A}if(B.u===a){t="\ub9ac\uce58 \uc911"
break A}if(B.l===a){t="\uc218\ube44"
break A}if(B.q===a){t="\ud654\ub8cc \ud615\ud0dc"
break A}if(B.L===a||B.m===a){t="\uc190\ud328 \ubaa8\ub984"
break A}if(B.M===a){t="\uc9d0\uc791 \uc190\ud328"
break A}t=null}return t},
eR(a){var t
A:{if(a<0){t="\ud654\ub8cc \ud615\ud0dc"
break A}if(0===a){t="\ud150\ud30c\uc774"
break A}t=""+a+"\uc0f9\ud150"
break A}return t},
fx(a){var t=a.a
if(a.b){if(!(t>=0&&t<34))return A.a(B.c,t)
t="\uc801"+B.c[t]}else{if(!(t>=0&&t<34))return A.a(B.c,t)
t=B.c[t]}return t},
hT(a){var t,s,r=a.length
if(r===0)return a
t=r-1
if(!(t>=0))return A.a(a,t)
s=a.charCodeAt(t)
if(s<44032||s>55203)return a+"\uc744"
return B.b.H(s-44032,28)===0?a+"\ub97c":a+"\uc744"},
kH(a){var t,s,r=B.b.l(Math.abs(a)),q=a<0?"-":""
for(t=r.length,s=0;s<t;++s){if(s>0&&B.b.H(t-s,3)===0)q+=","
q+=r[s]}return q.charCodeAt(0)==0?q:q},
em(a){var t,s,r,q,p,o,n,m=a.Q
if(m==null)return B.j
t=A.c([],u.t)
for(s=a.y,r=s.length,q=m.b,p=m.c,o=0;o<r;++o){n=s[o]
if(n.b===q&&n.c.gC()===p.gC())t.push(n.a)}return t},
el(a,b){var t,s,r,q=A.em(a)
if(q.length===0)return""
t=B.a.gG(q)
if(!(t<34))return A.a(B.c,t)
s=B.c[t]
t=q.length
if(t===1)return s
if(1>=t)return A.a(q,1)
t=q[1]
if(!(t<34))return A.a(B.c,t)
r=B.c[t]
return b?s+"(\ub610\ub294 "+r+")":s+" \ub610\ub294 "+r},
fk(a){var t,s,r=A.em(a),q=B.a.gG(r)
if(!(q<34))return A.a(B.c,q)
t=B.c[q]
if(r.length>1){q=r[1]
if(!(q<34))return A.a(B.c,q)
s="(\ub610\ub294 "+B.c[q]+")"}else s=""
return t+s+B.p.b7(A.hT(t),t.length)},
l2(a){var t=A.fx(a.c)+" \ubc84\ub9bc",s=a.ay,r=a.r
if(r===B.d&&s!=null)return s===B.t?t+" \xb7 \ucd5c\uc120\uc785\ub2c8\ub2e4":t+" \xb7 "+A.d_(s)
return t+" \xb7 "+A.hO(r)},
kY(a){var t,s,r,q,p=a.z,o=a.Q,n=a.ay
if(a.r!==B.d||n==null||p==null||o==null)return B.aO
t=A.fx(a.c)
if(n===B.k)return A.c(["\ub0b4 \ubc84\ub9bc "+t+" \xb7 "+A.eR(p.b),"\ucd5c\uc120 "+A.el(a,!0)+" \xb7 "+A.eR(o.b)],u.s)
s=p.b<=0?"\ub300\uae30":"\uc720\ud6a8\ud328"
r="\ub0b4 \ubc84\ub9bc "+t+" \xb7 "+s+" "+p.c.gC()+"\uc7a5"
if(n===B.t)return A.c([r],u.s)
s=A.el(a,!0)
q=o.b<=0?"\ub300\uae30":"\uc720\ud6a8\ud328"
return A.c([r,"\ucd5c\uc120 "+s+" \xb7 "+q+" "+o.c.gC()+"\uc7a5"],u.s)},
hM(a){var t,s,r=a.ay
if(a.r!==B.d||r==null||r===B.t)return null
t=a.as
if(t==null)t=0
if(t>0)return t>=2?""+t+"\uc0f9\ud150 \ud6c4\ud1f4":"\uc0f9\ud150 \ud6c4\ud1f4"
s=a.at
return"\u2212"+(s==null?0:s)+"\uc7a5"},
l0(a,b){var t,s,r,q,p,o,n="\uc774 \uc21c\uc740 \uc190\ud328 \uae30\ub85d\uc774 \uc5c6\uc5b4 \ud3c9\uac00\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."
switch(a.r.a){case 1:return"\ub9ac\uce58 \uc911\uc774\ub77c \ubf51\uc740 \ud328\ub97c \uadf8\ub300\ub85c \ubc84\ub9bd\ub2c8\ub2e4."
case 2:t=a.CW
if(t==null)s="\ud604\ubb3c\uc778\uc9c0 \ud310\ub2e8\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."
else s=t?"\ubc84\ub9b0 \ud328\ub294 \ud604\ubb3c\uc785\ub2c8\ub2e4.":"\ubc84\ub9b0 \ud328\ub294 \ud604\ubb3c\uc774 \uc544\ub2d9\ub2c8\ub2e4."
return"\ub2e4\ub978 \uc790\ub9ac\uac00 \ub9ac\uce58 \uc911\uc785\ub2c8\ub2e4. "+s
case 3:return"\ud654\ub8cc \ud615\ud0dc\uc5d0\uc11c \ubc84\ub838\uc2b5\ub2c8\ub2e4. \ud654\ub8cc\ud558\uc9c0 \uc54a\uc740 \uae4c\ub2ed\uc740 \ud310\ub2e8\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."
case 4:return n
case 5:return"\uc774 \uc21c\uc740 \uc190\ud328 \uae30\ub85d\uc774 \uc55e\ub4a4\uac00 \ub9de\uc9c0 \uc54a\uc544 \ud3c9\uac00\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."
case 6:return"\uc774 \uc21c\uc758 \uc190\ud328\ub294 \uc9d0\uc791\uc774\ub77c \ud3c9\uac00\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."
case 0:break}t=a.ay
r=a.Q
if(t==null||r==null)return n
q=r.b<=0?"\ub300\uae30":"\uc720\ud6a8\ud328"
p=a.at
if(p==null)p=0
switch(t.a){case 0:o=q+"\uac00 \uac00\uc7a5 \ub9ce\uc740 \ubc84\ub9bc\uc785\ub2c8\ub2e4."
break
case 1:o="\ucd5c\uc120("+A.el(a,!1)+")\uacfc "+p+"\uc7a5 \ucc28\uc774\ub85c \uac70\uc758 \uac19\uc2b5\ub2c8\ub2e4."
break
case 2:o=A.fk(a)+" \ubc84\ub838\ub2e4\uba74 "+q+"\uac00 "+p+"\uc7a5 \ub354 \ub9ce\uc558\uc2b5\ub2c8\ub2e4."
break
case 3:o=A.fk(a)+" \ubc84\ub838\ub2e4\uba74 "+q+"\uac00 "+p+"\uc7a5 \ub354 \ub9ce\uc558\uc2b5\ub2c8\ub2e4. \ucc28\uc774\uac00 \ud07d\ub2c8\ub2e4."
break
case 4:o=a.as
if(o==null)o=0
o="\uc0f9\ud150\uc774 "+o+" \ub298\uc5c8\uc2b5\ub2c8\ub2e4. "+A.fk(a)+" \ubc84\ub9ac\uba74 \uadf8\ub300\ub85c\uc600\uc2b5\ub2c8\ub2e4."
break
default:o=null}return o},
kR(a){var t,s,r=a.as
if((r==null?0:r)>0){r=A.hM(a)
return r==null?"\uc0f9\ud150 \ud6c4\ud1f4":r}t=a.Q
r=t==null?null:t.b
r=(r==null?1:r)<=0?"\ub300\uae30":"\uc720\ud6a8\ud328"
s=a.at
if(s==null)s=0
return r+" \u2212"+s+"\uc7a5"},
ks(a,b){var t,s,r,q,p,o,n,m,l,k,j,i,h,g
for(t=a.y,s=t.length,r=null,q=0;q<s;++q){p=t[q]
if(p.a===b)r=p}o=a.Q
if(r==null||o==null)return null
if(!(b<34))return A.a(B.c,b)
n=A.hT(B.c[b])
t=r.b
m=t>o.b?A.eR(t)+" \xb7 ":""
s=A.c([],u.s)
for(l=r.c,k=l.b,j=k.length,q=0;q<j;++q){i=k[q]
if(i.b>0){h=i.a
if(!(h<34))return A.a(B.c,h)
s.push(B.c[h])}}g=t<=0?"\ub300\uae30":"\uc720\ud6a8\ud328"
if(s.length===0)return n+" \ubc84\ub9ac\uba74 "+m+g+"\uac00 \ub0a8\uc544 \uc788\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4 (0\uc7a5)"
return n+" \ubc84\ub9ac\uba74 "+m+g+": "+B.a.V(s," ")+" ("+l.gC()+"\uc7a5)"},
l6(a){var t
switch(a.a){case 0:t="\ubc30\ud328"
break
case 1:t="\ub9ac\uce58"
break
case 2:t="\ub05d"
break
default:t=null}return t},
kE(a,b){var t,s,r
if(a==null)return"\uacb0\uacfc \uae30\ub85d \uc5c6\uc74c"
t=b==null?"":" \xb7 "+A.kH(b)+"\uc810"
s=a.a
A:{if("ron"===s){r="\ub860"+t
break A}if("tsumo"===s){r="\ucbd4\ubaa8"+t
break A}r="\uc720\uad6d"
break A}return r},
l7(a,b,c,d){var t,s,r,q,p,o=a.a
switch(o.a){case 0:t=a.c
if(t==null)t=0
return t<=0?"\ubc30\ud328 \ud150\ud30c\uc774\uc600\uc2b5\ub2c8\ub2e4.":"\ubc30\ud328\ub294 "+t+"\uc0f9\ud150\uc774\uc5c8\uc2b5\ub2c8\ub2e4."
case 1:if(o===B.K&&a.e!=null){o=a.f
s=o>0?" \uadf8 \ub4a4 "+o+"\ubc88\uc740 \ubf51\uc740 \ud328\ub97c \uadf8\ub300\ub85c \ubc84\ub838\uc2b5\ub2c8\ub2e4.":""
return A.o(a.e)+"\uc21c\uc5d0 \ub9ac\uce58\ud588\uc2b5\ub2c8\ub2e4."+s}r=a.d
if(r==null)r=0
q=d.$1(r)
return(q==null?""+(r+1)+"\ubc88":q)+" \uc790\ub9ac\uac00 \ub9ac\uce58\ud588\uc2b5\ub2c8\ub2e4. \uc5ec\uae30\ubd80\ud130 \uc218\ube44 \ud310\ub2e8\uc740 \ud3c9\uac00\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."
case 2:p=b==null?"\uc774 \ud310\uc740 \ud3c9\uac00\ud55c \ubc84\ub9bc\uc774 \uc5c6\uc2b5\ub2c8\ub2e4":"\uc774 \ud310 \ud328\ud6a8\uc728 "+A.o(b)
return c+"\n"+p}}},B={}
var w=[A,J,B]
var $={}
A.f_.prototype={}
J.ct.prototype={
W(a,b){return a===b},
gu(a){return A.bR(a)},
l(a){return"Instance of '"+A.cJ(a)+"'"},
gB(a){return A.b0(A.fm(this))}}
J.cv.prototype={
l(a){return String(a)},
gu(a){return a?519018:218159},
gB(a){return A.b0(u.y)},
$it:1,
$ij:1}
J.by.prototype={
W(a,b){return null==b},
l(a){return"null"},
gu(a){return 0},
$it:1}
J.bz.prototype={$iC:1}
J.aB.prototype={
gu(a){return 0},
l(a){return String(a)}}
J.cI.prototype={}
J.bh.prototype={}
J.am.prototype={
l(a){var t=a[$.hU()]
if(t==null)t=a[$.fz()]
if(t==null)return this.b9(a)
return"JavaScript function for "+J.bq(t)},
$iaL:1}
J.b8.prototype={
gu(a){return 0},
l(a){return String(a)}}
J.b9.prototype={
gu(a){return 0},
l(a){return String(a)}}
J.k.prototype={
i(a,b){A.w(a).c.a(b)
a.$flags&1&&A.F(a,29)
a.push(b)},
F(a,b){var t,s
A.w(a).h("e<1>").a(b)
a.$flags&1&&A.F(a,"addAll",2)
if(Array.isArray(b)){this.bc(a,b)
return}for(t=b.length,s=0;s<b.length;b.length===t||(0,A.h)(b),++s)a.push(b[s])},
bc(a,b){var t,s
u.b.a(b)
t=b.length
if(t===0)return
if(a===b)throw A.d(A.Q(a))
for(s=0;s<t;++s)a.push(b[s])},
L(a,b){var t,s
A.w(a).h("~(1)").a(b)
t=a.length
for(s=0;s<t;++s){b.$1(a[s])
if(a.length!==t)throw A.d(A.Q(a))}},
V(a,b){var t,s=A.a5(a.length,"",!1,u.N)
for(t=0;t<a.length;++t)this.j(s,t,A.o(a[t]))
return s.join(b)},
a0(a,b,c,d){var t,s,r
d.a(b)
A.w(a).D(d).h("1(1,2)").a(c)
t=a.length
for(s=b,r=0;r<t;++r){s=c.$2(s,a[r])
if(a.length!==t)throw A.d(A.Q(a))}return s},
aV(a,b){var t,s,r
A.w(a).h("j(1)").a(b)
t=a.length
for(s=0;s<t;++s){r=a[s]
if(b.$1(r))return r
if(a.length!==t)throw A.d(A.Q(a))}throw A.d(A.aN())},
E(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
gG(a){if(a.length>0)return a[0]
throw A.d(A.aN())},
gb_(a){var t=a.length
if(t>0)return a[t-1]
throw A.d(A.aN())},
R(a,b){var t,s
A.w(a).h("j(1)").a(b)
t=a.length
for(s=0;s<t;++s){if(b.$1(a[s]))return!0
if(a.length!==t)throw A.d(A.Q(a))}return!1},
S(a,b){var t,s
A.w(a).h("j(1)").a(b)
t=a.length
for(s=0;s<t;++s){if(!b.$1(a[s]))return!1
if(a.length!==t)throw A.d(A.Q(a))}return!0},
a5(a,b){var t,s,r,q,p,o=A.w(a)
o.h("b(1,1)?").a(b)
a.$flags&2&&A.F(a,"sort")
t=a.length
if(t<2)return
if(b==null)b=J.jL()
if(t===2){s=a[0]
r=a[1]
o=b.$2(s,r)
if(typeof o!=="number")return o.bI()
if(o>0){a[0]=r
a[1]=s}return}q=0
if(o.c.b(null))for(p=0;p<a.length;++p)if(a[p]===void 0){a[p]=null;++q}a.sort(A.kw(b,2))
if(q>0)this.bn(a,q)},
a1(a){return this.a5(a,null)},
bn(a,b){var t,s=a.length
for(;t=s-1,s>0;s=t)if(a[t]===null){a[t]=void 0;--b
if(b===0)break}},
bv(a,b){var t,s=a.length
if(0>=s)return-1
for(t=0;t<s;++t){if(!(t<a.length))return A.a(a,t)
if(J.ak(a[t],b))return t}return-1},
A(a,b){var t
for(t=0;t<a.length;++t)if(J.ak(a[t],b))return!0
return!1},
gv(a){return a.length===0},
gaZ(a){return a.length!==0},
l(a){return A.eZ(a,"[","]")},
gt(a){return new J.aI(a,a.length,A.w(a).h("aI<1>"))},
gu(a){return A.bR(a)},
gm(a){return a.length},
k(a,b){if(!(b>=0&&b<a.length))throw A.d(A.fs(a,b))
return a[b]},
j(a,b,c){A.w(a).c.a(c)
a.$flags&2&&A.F(a)
if(!(b>=0&&b<a.length))throw A.d(A.fs(a,b))
a[b]=c},
aY(a,b){var t
A.w(a).h("j(1)").a(b)
if(0>=a.length)return-1
for(t=0;t<a.length;++t)if(b.$1(a[t]))return t
return-1},
$ii:1,
$ie:1,
$im:1}
J.cu.prototype={
bD(a){var t,s,r
if(!Array.isArray(a))return null
t=a.$flags|0
if((t&4)!==0)s="const, "
else if((t&2)!==0)s="unmodifiable, "
else s=(t&1)!==0?"fixed, ":""
r="Instance of '"+A.cJ(a)+"'"
if(s==="")return r
return r+" ("+s+"length: "+a.length+")"}}
J.d7.prototype={}
J.aI.prototype={
gp(){var t=this.d
return t==null?this.$ti.c.a(t):t},
n(){var t,s=this,r=s.a,q=r.length
if(s.b!==q){r=A.h(r)
throw A.d(r)}t=s.c
if(t>=q){s.d=null
return!1}s.d=r[t]
s.c=t+1
return!0},
$iG:1}
J.b7.prototype={
U(a,b){var t
A.cX(b)
if(a<b)return-1
else if(a>b)return 1
else if(a===b){if(a===0){t=this.gav(b)
if(this.gav(a)===t)return 0
if(this.gav(a))return-1
return 1}return 0}else if(isNaN(a)){if(isNaN(b))return 0
return 1}else return-1},
gav(a){return a===0?1/a<0:a<0},
P(a){var t
if(a>=-2147483648&&a<=2147483647)return a|0
if(isFinite(a)){t=a<0?Math.ceil(a):Math.floor(a)
return t+0}throw A.d(A.dG(""+a+".toInt()"))},
bB(a){if(a>0){if(a!==1/0)return Math.round(a)}else if(a>-1/0)return 0-Math.round(0-a)
throw A.d(A.dG(""+a+".round()"))},
aR(a,b,c){if(B.b.U(b,c)>0)throw A.d(A.fq(b))
if(this.U(a,b)<0)return b
if(this.U(a,c)>0)return c
return a},
l(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gu(a){var t,s,r,q,p=a|0
if(a===p)return p&536870911
t=Math.abs(a)
s=Math.log(t)/0.6931471805599453|0
r=Math.pow(2,s)
q=t<1?t/r:r/t
return((q*9007199254740992|0)+(q*3542243181176521|0))*599197+s*1259&536870911},
H(a,b){var t=a%b
if(t===0)return 0
if(t>0)return t
return t+b},
ag(a,b){if((a|0)===a)if(b>=1)return a/b|0
return this.aN(a,b)},
q(a,b){return(a|0)===a?a/b|0:this.aN(a,b)},
aN(a,b){var t=a/b
if(t>=-2147483648&&t<=2147483647)return t|0
if(t>0){if(t!==1/0)return Math.floor(t)}else if(t>-1/0)return Math.ceil(t)
throw A.d(A.dG("Result of truncating division is "+A.o(t)+": "+A.o(a)+" ~/ "+b))},
X(a,b){if(b<0)throw A.d(A.fq(b))
return b>31?0:a<<b>>>0},
a3(a,b){var t
if(a>0)t=this.aM(a,b)
else{t=b>31?31:b
t=a>>t>>>0}return t},
ao(a,b){if(0>b)throw A.d(A.fq(b))
return this.aM(a,b)},
aM(a,b){return b>31?0:a>>>b},
gB(a){return A.b0(u.n)},
$ia4:1,
$iq:1,
$iZ:1}
J.bx.prototype={
gaQ(a){var t,s=a<0?-a-1:a,r=s
for(t=32;r>=4294967296;){r=this.q(r,4294967296)
t+=32}return t-Math.clz32(r)},
gB(a){return A.b0(u.S)},
$it:1,
$ib:1}
J.cw.prototype={
gB(a){return A.b0(u.i)},
$it:1}
J.aO.prototype={
b6(a,b){var t=b.length
if(t>a.length)return!1
return b===a.substring(0,t)},
a2(a,b,c){return a.substring(b,A.iM(b,c,a.length))},
b7(a,b){return this.a2(a,b,null)},
U(a,b){var t
A.Y(b)
if(a===b)t=0
else t=a<b?-1:1
return t},
l(a){return a},
gu(a){var t,s,r
for(t=a.length,s=0,r=0;r<t;++r){s=s+a.charCodeAt(r)&536870911
s=s+((s&524287)<<10)&536870911
s^=s>>6}s=s+((s&67108863)<<3)&536870911
s^=s>>11
return s+((s&16383)<<15)&536870911},
gB(a){return A.b0(u.N)},
gm(a){return a.length},
$it:1,
$ia4:1,
$ifT:1,
$in:1}
A.bj.prototype={
gt(a){var t=this.a
return new A.br(t.gt(t),A.l(this).h("br<1,2>"))},
gm(a){var t=this.a
return t.gm(t)},
gv(a){var t=this.a
return t.gv(t)},
l(a){return this.a.l(0)}}
A.br.prototype={
n(){return this.a.n()},
gp(){return this.$ti.y[1].a(this.a.gp())},
$iG:1}
A.aJ.prototype={}
A.c4.prototype={$ii:1}
A.aK.prototype={
ap(a,b,c){return new A.aK(this.a,this.$ti.h("@<1,2>").D(b).D(c).h("aK<1,2,3,4>"))},
k(a,b){return this.$ti.h("4?").a(this.a.k(0,b))},
L(a,b){this.a.L(0,new A.d2(this,this.$ti.h("~(3,4)").a(b)))},
gM(){var t=this.$ti
return A.ie(this.a.gM(),t.c,t.y[2])},
gm(a){var t=this.a
return t.gm(t)},
gv(a){var t=this.a
return t.gv(t)},
gaa(){return this.a.gaa().aw(0,new A.d1(this),this.$ti.h("N<3,4>"))}}
A.d2.prototype={
$2(a,b){var t=this.a.$ti
t.c.a(a)
t.y[1].a(b)
this.b.$2(t.y[2].a(a),t.y[3].a(b))},
$S(){return this.a.$ti.h("~(1,2)")}}
A.d1.prototype={
$1(a){var t=this.a.$ti
t.h("N<1,2>").a(a)
return new A.N(t.y[2].a(a.a),t.y[3].a(a.b),t.h("N<3,4>"))},
$S(){return this.a.$ti.h("N<3,4>(N<1,2>)")}}
A.bC.prototype={
l(a){return"LateInitializationError: "+this.a}}
A.dz.prototype={}
A.i.prototype={}
A.D.prototype={
gt(a){var t=this
return new A.aQ(t,t.gm(t),A.l(t).h("aQ<D.E>"))},
gv(a){return this.gm(this)===0},
V(a,b){var t,s,r,q=this,p=q.gm(q)
if(b.length!==0){if(p===0)return""
t=A.o(q.E(0,0))
if(p!==q.gm(q))throw A.d(A.Q(q))
for(s=t,r=1;r<p;++r){s=s+b+A.o(q.E(0,r))
if(p!==q.gm(q))throw A.d(A.Q(q))}return s.charCodeAt(0)==0?s:s}else{for(r=0,s="";r<p;++r){s+=A.o(q.E(0,r))
if(p!==q.gm(q))throw A.d(A.Q(q))}return s.charCodeAt(0)==0?s:s}},
bz(a){return this.V(0,"")},
aw(a,b,c){var t=A.l(this)
return new A.L(this,t.D(c).h("1(D.E)").a(b),t.h("@<D.E>").D(c).h("L<1,2>"))},
bC(a){var t,s=this,r=A.f2(A.l(s).h("D.E"))
for(t=0;t<s.gm(s);++t)r.i(0,s.E(0,t))
return r}}
A.c_.prototype={
gbi(){var t=J.aw(this.a),s=this.c
if(s==null||s>t)return t
return s},
gbp(){var t=J.aw(this.a),s=this.b
if(s>t)return t
return s},
gm(a){var t,s=J.aw(this.a),r=this.b
if(r>=s)return 0
t=this.c
if(t==null||t>=s)return s-r
return t-r},
E(a,b){var t=this,s=t.gbp()+b
if(b<0||s>=t.gbi())throw A.d(A.eY(b,t.gm(0),t,"index"))
return J.eX(t.a,s)},
b1(a){var t,s,r,q=this,p=q.b,o=q.a,n=J.cY(o),m=n.gm(o),l=q.c
if(l!=null&&l<m)m=l
t=m-p
if(t<=0){o=J.fO(0,q.$ti.c)
return o}s=A.a5(t,n.E(o,p),!0,q.$ti.c)
for(r=1;r<t;++r){B.a.j(s,r,n.E(o,p+r))
if(n.gm(o)<m)throw A.d(A.Q(q))}return s}}
A.aQ.prototype={
gp(){var t=this.d
return t==null?this.$ti.c.a(t):t},
n(){var t,s=this,r=s.a,q=J.cY(r),p=q.gm(r)
if(s.b!==p)throw A.d(A.Q(r))
t=s.c
if(t>=p){s.d=null
return!1}s.d=q.E(r,t);++s.c
return!0},
$iG:1}
A.af.prototype={
gt(a){return new A.bG(J.aa(this.a),this.b,A.l(this).h("bG<1,2>"))},
gm(a){return J.aw(this.a)},
gv(a){return J.fC(this.a)}}
A.bu.prototype={$ii:1}
A.bG.prototype={
n(){var t=this,s=t.b
if(s.n()){t.a=t.c.$1(s.gp())
return!0}t.a=null
return!1},
gp(){var t=this.a
return t==null?this.$ti.y[1].a(t):t},
$iG:1}
A.L.prototype={
gm(a){return J.aw(this.a)},
E(a,b){return this.b.$1(J.eX(this.a,b))}}
A.v.prototype={
gt(a){return new A.c2(J.aa(this.a),this.b,this.$ti.h("c2<1>"))}}
A.c2.prototype={
n(){var t,s
for(t=this.a,s=this.b;t.n();)if(s.$1(t.gp()))return!0
return!1},
gp(){return this.a.gp()},
$iG:1}
A.bw.prototype={
gm(a){return J.aw(this.a)},
gv(a){return J.fC(this.a)},
gt(a){return new A.a_(J.aa(this.a),this.b,A.l(this).h("a_<1>"))}}
A.bt.prototype={$ii:1}
A.a_.prototype={
n(){if(++this.c>=0&&this.a.n())return!0
this.c=-2
return!1},
gp(){var t=this.c
return t>=0?new A.au(this.b+t,this.a.gp()):A.a8(A.aN())},
$iG:1}
A.S.prototype={}
A.bV.prototype={
gm(a){return this.a.length},
E(a,b){var t=this.a
return J.eX(t,t.length-1-b)}}
A.au.prototype={$r:"+(1,2)",$s:1}
A.c5.prototype={
gp(){var t=this.d
return t==null?this.$ti.c.a(t):t},
n(){var t=this,s=t.c
if(s>=t.b){t.d=null
return!1}t.d=t.a[s]
t.c=s+1
return!0},
$iG:1}
A.bs.prototype={
i(a,b){A.l(this).c.a(b)
A.il()}}
A.aM.prototype={
gm(a){return this.a.length},
gv(a){return this.a.length===0},
gt(a){var t=this.a
return new A.c5(t,t.length,this.$ti.h("c5<1>"))},
bk(){var t,s,r,q,p=this,o=p.$map
if(o==null){o=new A.bA(p.$ti.h("bA<1,1>"))
for(t=p.a,s=t.length,r=0;r<t.length;t.length===s||(0,A.h)(t),++r){q=t[r]
o.j(0,q,q)}p.$map=o}return o},
A(a,b){return this.bk().aq(b)}}
A.bX.prototype={}
A.dC.prototype={
O(a){var t,s,r=this,q=new RegExp(r.a).exec(a)
if(q==null)return null
t=Object.create(null)
s=r.b
if(s!==-1)t.arguments=q[s+1]
s=r.c
if(s!==-1)t.argumentsExpr=q[s+1]
s=r.d
if(s!==-1)t.expr=q[s+1]
s=r.e
if(s!==-1)t.method=q[s+1]
s=r.f
if(s!==-1)t.receiver=q[s+1]
return t}}
A.bO.prototype={
l(a){return"Null check operator used on a null value"}}
A.cx.prototype={
l(a){var t,s=this,r="NoSuchMethodError: method not found: '",q=s.b
if(q==null)return"NoSuchMethodError: "+s.a
t=s.c
if(t==null)return r+q+"' ("+s.a+")"
return r+q+"' on '"+t+"' ("+s.a+")"}}
A.cP.prototype={
l(a){var t=this.a
return t.length===0?"Error":"Error: "+t}}
A.dg.prototype={
l(a){return"Throw of null ('"+(this.a===null?"null":"undefined")+"' from JavaScript)"}}
A.ay.prototype={
l(a){var t=this.constructor,s=t==null?null:t.name
return"Closure '"+A.hS(s==null?"unknown":s)+"'"},
$iaL:1,
gbH(){return this},
$C:"$1",
$R:1,
$D:null}
A.cl.prototype={$C:"$0",$R:0}
A.cm.prototype={$C:"$2",$R:2}
A.cN.prototype={}
A.cM.prototype={
l(a){var t=this.$static_name
if(t==null)return"Closure of unknown static method"
return"Closure '"+A.hS(t)+"'"}}
A.b4.prototype={
W(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.b4))return!1
return this.$_target===b.$_target&&this.a===b.a},
gu(a){return(A.fw(this.a)^A.bR(this.$_target))>>>0},
l(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.cJ(this.a)+"'")}}
A.cK.prototype={
l(a){return"RuntimeError: "+this.a}}
A.an.prototype={
gm(a){return this.a},
gv(a){return this.a===0},
gM(){return new A.aP(this,A.l(this).h("aP<1>"))},
gaa(){return new A.bD(this,A.l(this).h("bD<1,2>"))},
aq(a){var t,s
if(typeof a=="string"){t=this.b
if(t==null)return!1
return t[a]!=null}else if(typeof a=="number"&&(a&0x3fffffff)===a){s=this.c
if(s==null)return!1
return s[a]!=null}else return this.bw(a)},
bw(a){var t=this.d
if(t==null)return!1
return this.ab(this.aJ(t,a),a)>=0},
F(a,b){A.l(this).h("ae<1,2>").a(b).L(0,new A.d8(this))},
k(a,b){var t,s,r,q,p=null
if(typeof b=="string"){t=this.b
if(t==null)return p
s=t[b]
r=s==null?p:s.b
return r}else if(typeof b=="number"&&(b&0x3fffffff)===b){q=this.c
if(q==null)return p
s=q[b]
r=s==null?p:s.b
return r}else return this.bx(b)},
bx(a){var t,s,r=this.d
if(r==null)return null
t=this.aJ(r,a)
s=this.ab(t,a)
if(s<0)return null
return t[s].b},
j(a,b,c){var t,s,r=this,q=A.l(r)
q.c.a(b)
q.y[1].a(c)
if(typeof b=="string"){t=r.b
r.aE(t==null?r.b=r.am():t,b,c)}else if(typeof b=="number"&&(b&0x3fffffff)===b){s=r.c
r.aE(s==null?r.c=r.am():s,b,c)}else r.by(b,c)},
by(a,b){var t,s,r,q,p=this,o=A.l(p)
o.c.a(a)
o.y[1].a(b)
t=p.d
if(t==null)t=p.d=p.am()
s=p.ar(a)
r=t[s]
if(r==null)t[s]=[p.an(a,b)]
else{q=p.ab(r,a)
if(q>=0)r[q].b=b
else r.push(p.an(a,b))}},
L(a,b){var t,s,r=this
A.l(r).h("~(1,2)").a(b)
t=r.e
s=r.r
while(t!=null){b.$2(t.a,t.b)
if(s!==r.r)throw A.d(A.Q(r))
t=t.c}},
aE(a,b,c){var t,s=A.l(this)
s.c.a(b)
s.y[1].a(c)
t=a[b]
if(t==null)a[b]=this.an(b,c)
else t.b=c},
an(a,b){var t=this,s=A.l(t),r=new A.dc(s.c.a(a),s.y[1].a(b))
if(t.e==null)t.e=t.f=r
else t.f=t.f.c=r;++t.a
t.r=t.r+1&1073741823
return r},
ar(a){return J.al(a)&1073741823},
aJ(a,b){return a[this.ar(b)]},
ab(a,b){var t,s
if(a==null)return-1
t=a.length
for(s=0;s<t;++s)if(J.ak(a[s].a,b))return s
return-1},
l(a){return A.fR(this)},
am(){var t=Object.create(null)
t["<non-identifier-key>"]=t
delete t["<non-identifier-key>"]
return t},
$if1:1}
A.d8.prototype={
$2(a,b){var t=this.a,s=A.l(t)
t.j(0,s.c.a(a),s.y[1].a(b))},
$S(){return A.l(this.a).h("~(1,2)")}}
A.dc.prototype={}
A.aP.prototype={
gm(a){return this.a.a},
gv(a){return this.a.a===0},
gt(a){var t=this.a
return new A.bF(t,t.r,t.e,this.$ti.h("bF<1>"))}}
A.bF.prototype={
gp(){return this.d},
n(){var t,s=this,r=s.a
if(s.b!==r.r)throw A.d(A.Q(r))
t=s.c
if(t==null){s.d=null
return!1}else{s.d=t.a
s.c=t.c
return!0}},
$iG:1}
A.bD.prototype={
gm(a){return this.a.a},
gv(a){return this.a.a===0},
gt(a){var t=this.a
return new A.bE(t,t.r,t.e,this.$ti.h("bE<1,2>"))}}
A.bE.prototype={
gp(){var t=this.d
t.toString
return t},
n(){var t,s=this,r=s.a
if(s.b!==r.r)throw A.d(A.Q(r))
t=s.c
if(t==null){s.d=null
return!1}else{s.d=new A.N(t.a,t.b,s.$ti.h("N<1,2>"))
s.c=t.c
return!0}},
$iG:1}
A.bA.prototype={
ar(a){return A.kv(a)&1073741823},
ab(a,b){var t,s
if(a==null)return-1
t=a.length
for(s=0;s<t;++s)if(J.ak(a[s].a,b))return s
return-1}}
A.eC.prototype={
$1(a){return this.a(a)},
$S:13}
A.eD.prototype={
$2(a,b){return this.a(a,b)},
$S:34}
A.eE.prototype={
$1(a){return this.a(A.Y(a))},
$S:29}
A.aG.prototype={
l(a){return this.aO(!1)},
aO(a){var t,s,r,q,p,o=this.bj(),n=this.aK(),m=(a?"Record ":"")+"("
for(t=o.length,s="",r=0;r<t;++r,s=", "){m+=s
q=o[r]
if(typeof q=="string")m=m+q+": "
if(!(r<n.length))return A.a(n,r)
p=n[r]
m=a?m+A.fV(p):m+A.o(p)}m+=")"
return m.charCodeAt(0)==0?m:m},
bj(){var t,s=this.$s
while($.dS.length<=s)B.a.i($.dS,null)
t=$.dS[s]
if(t==null){t=this.be()
B.a.j($.dS,s,t)}return t},
be(){var t,s,r,q=this.$r,p=q.indexOf("("),o=q.substring(1,p),n=q.substring(p),m=n==="()"?0:n.replace(/[^,]/g,"").length+1,l=u.K,k=J.fN(m,l)
for(t=0;t<m;++t)k[t]=t
if(o!==""){s=o.split(",")
t=s.length
for(r=m;t>0;){--r;--t
B.a.j(k,r,s[t])}}return A.ad(k,l)}}
A.bk.prototype={
aK(){return[this.a,this.b]},
W(a,b){if(b==null)return!1
return b instanceof A.bk&&this.$s===b.$s&&J.ak(this.a,b.a)&&J.ak(this.b,b.b)},
gu(a){return A.iF(this.$s,this.a,this.b,B.F)}}
A.dK.prototype={
J(){var t=this.b
if(t===this)throw A.d(new A.bC("Field '"+this.a+"' has not been initialized."))
return t}}
A.aR.prototype={
gB(a){return B.b4},
bq(a,b,c){var t=new DataView(a,b)
return t},
aP(a){return this.bq(a,0,null)},
$it:1,
$iaR:1}
A.bK.prototype={
gbr(a){if(((a.$flags|0)&2)!==0)return new A.dU(a.buffer)
else return a.buffer}}
A.dU.prototype={
aP(a){var t=A.iD(this.a,0,null)
t.$flags=3
return t}}
A.cz.prototype={
gB(a){return B.b5},
$it:1}
A.ba.prototype={
gm(a){return a.length},
$ia0:1}
A.bI.prototype={$ii:1,$ie:1,$im:1}
A.bJ.prototype={$ii:1,$ie:1,$im:1}
A.cA.prototype={
gB(a){return B.b6},
$it:1}
A.cB.prototype={
gB(a){return B.b7},
$it:1}
A.cC.prototype={
gB(a){return B.b8},
$it:1}
A.cD.prototype={
gB(a){return B.b9},
$it:1}
A.cE.prototype={
gB(a){return B.ba},
$it:1}
A.cF.prototype={
gB(a){return B.bc},
$it:1,
$if9:1}
A.cG.prototype={
gB(a){return B.bd},
$it:1}
A.bL.prototype={
gB(a){return B.be},
gm(a){return a.length},
$it:1}
A.bM.prototype={
gB(a){return B.bf},
gm(a){return a.length},
$it:1}
A.c6.prototype={}
A.c7.prototype={}
A.c8.prototype={}
A.c9.prototype={}
A.ag.prototype={
h(a){return A.cf(v.typeUniverse,this,a)},
D(a){return A.hj(v.typeUniverse,this,a)}}
A.cS.prototype={}
A.cW.prototype={
l(a){return A.a2(this.a,null)}}
A.cR.prototype={
l(a){return this.a}}
A.cb.prototype={}
A.a1.prototype={
gp(){var t=this.b
return t==null?this.$ti.c.a(t):t},
bo(a,b){var t,s,r
a=A.B(a)
b=b
t=this.a
for(;;)try{s=t(this,a,b)
return s}catch(r){b=r
a=1}},
n(){var t,s,r,q,p=this,o=null,n=0
for(;;){t=p.d
if(t!=null)try{if(t.n()){p.b=t.gp()
return!0}else p.d=null}catch(s){o=s
n=1
p.d=null}r=p.bo(n,o)
if(1===r)return!0
if(0===r){p.b=null
q=p.e
if(q==null||q.length===0){p.a=A.hd
return!1}if(0>=q.length)return A.a(q,-1)
p.a=q.pop()
n=0
o=null
continue}if(2===r){n=0
o=null
continue}if(3===r){o=p.c
p.c=null
q=p.e
if(q==null||q.length===0){p.b=null
p.a=A.hd
throw o
return!1}if(0>=q.length)return A.a(q,-1)
p.a=q.pop()
n=1
continue}throw A.d(A.fX("sync*"))}return!1},
bJ(a){var t,s,r=this
if(a instanceof A.aY){t=a.a()
s=r.e
if(s==null)s=r.e=[]
B.a.i(s,r.a)
r.a=t
return 2}else{r.d=J.aa(a)
return 2}},
$iG:1}
A.aY.prototype={
gt(a){return new A.a1(this.a(),this.$ti.h("a1<1>"))}}
A.aV.prototype={
gt(a){var t=this,s=new A.aW(t,t.r,A.l(t).h("aW<1>"))
s.c=t.e
return s},
gm(a){return this.a},
gv(a){return this.a===0},
A(a,b){var t
if(typeof b=="number"&&(b&1073741823)===b){t=this.c
if(t==null)return!1
return u.w.a(t[b])!=null}else return this.bf(b)},
bf(a){var t=this.d
if(t==null)return!1
return this.aI(t[this.aG(a)],a)>=0},
gG(a){var t=this.e
if(t==null)throw A.d(A.fX("No elements"))
return A.l(this).c.a(t.a)},
i(a,b){var t,s,r=this
A.l(r).c.a(b)
if(typeof b=="string"&&b!=="__proto__"){t=r.b
return r.aF(t==null?r.b=A.fg():t,b)}else if(typeof b=="number"&&(b&1073741823)===b){s=r.c
return r.aF(s==null?r.c=A.fg():s,b)}else return r.bb(b)},
bb(a){var t,s,r,q=this
A.l(q).c.a(a)
t=q.d
if(t==null)t=q.d=A.fg()
s=q.aG(a)
r=t[s]
if(r==null)t[s]=[q.aj(a)]
else{if(q.aI(r,a)>=0)return!1
r.push(q.aj(a))}return!0},
aF(a,b){A.l(this).c.a(b)
if(u.w.a(a[b])!=null)return!1
a[b]=this.aj(b)
return!0},
aj(a){var t=this,s=new A.cV(A.l(t).c.a(a))
if(t.e==null)t.e=t.f=s
else t.f=t.f.b=s;++t.a
t.r=t.r+1&1073741823
return s},
aG(a){return J.al(a)&1073741823},
aI(a,b){var t,s
if(a==null)return-1
t=a.length
for(s=0;s<t;++s)if(J.ak(a[s].a,b))return s
return-1}}
A.cV.prototype={}
A.aW.prototype={
gp(){var t=this.d
return t==null?this.$ti.c.a(t):t},
n(){var t=this,s=t.c,r=t.a
if(t.b!==r.r)throw A.d(A.Q(r))
else if(s==null){t.d=null
return!1}else{t.d=t.$ti.h("1?").a(s.a)
t.c=s.b
return!0}},
$iG:1}
A.z.prototype={
gt(a){return new A.aQ(a,a.length,A.bo(a).h("aQ<z.E>"))},
E(a,b){if(!(b>=0&&b<a.length))return A.a(a,b)
return a[b]},
gv(a){return a.length===0},
gaZ(a){return a.length!==0},
R(a,b){var t,s,r
A.bo(a).h("j(z.E)").a(b)
t=a.length
for(s=t,r=0;r<t;++r){if(!(r<s))return A.a(a,r)
if(b.$1(a[r]))return!0
s=a.length
if(t!==s)throw A.d(A.Q(a))}return!1},
l(a){return A.eZ(a,"[","]")}}
A.u.prototype={
ap(a,b,c){var t=A.l(this)
return A.iA(this,t.h("u.K"),t.h("u.V"),b,c)},
L(a,b){var t,s,r,q=A.l(this)
q.h("~(u.K,u.V)").a(b)
for(t=this.gM(),t=t.gt(t),q=q.h("u.V");t.n();){s=t.gp()
r=this.k(0,s)
b.$2(s,r==null?q.a(r):r)}},
gaa(){return this.gM().aw(0,new A.dd(this),A.l(this).h("N<u.K,u.V>"))},
gm(a){var t=this.gM()
return t.gm(t)},
gv(a){var t=this.gM()
return t.gv(t)},
l(a){return A.fR(this)},
$iae:1}
A.dd.prototype={
$1(a){var t=this.a,s=A.l(t)
s.h("u.K").a(a)
t=t.k(0,a)
if(t==null)t=s.h("u.V").a(t)
return new A.N(a,t,s.h("N<u.K,u.V>"))},
$S(){return A.l(this.a).h("N<u.K,u.V>(u.K)")}}
A.de.prototype={
$2(a,b){var t,s=this.a
if(!s.a)this.b.a+=", "
s.a=!1
s=this.b
t=A.o(a)
s.a=(s.a+=t)+": "
t=A.o(b)
s.a+=t},
$S:12}
A.aD.prototype={
gv(a){return this.gm(this)===0},
F(a,b){var t
for(t=J.aa(A.l(this).h("e<1>").a(b));t.n();)this.i(0,t.gp())},
l(a){return A.eZ(this,"{","}")},
$ii:1,
$ie:1}
A.ca.prototype={}
A.cT.prototype={
k(a,b){var t,s=this.b
if(s==null)return this.c.k(0,b)
else if(typeof b!="string")return null
else{t=s[b]
return typeof t=="undefined"?this.bl(b):t}},
gm(a){return this.b==null?this.c.a:this.a7().length},
gv(a){return this.gm(0)===0},
gM(){if(this.b==null){var t=this.c
return new A.aP(t,A.l(t).h("aP<1>"))}return new A.cU(this)},
L(a,b){var t,s,r,q,p=this
u.cQ.a(b)
if(p.b==null)return p.c.L(0,b)
t=p.a7()
for(s=0;s<t.length;++s){r=t[s]
q=p.b[r]
if(typeof q=="undefined"){q=A.dX(p.a[r])
p.b[r]=q}b.$2(r,q)
if(t!==p.c)throw A.d(A.Q(p))}},
a7(){var t=u.Q.a(this.c)
if(t==null)t=this.c=A.c(Object.keys(this.a),u.s)
return t},
bl(a){var t
if(!Object.prototype.hasOwnProperty.call(this.a,a))return null
t=A.dX(this.a[a])
return this.b[a]=t}}
A.cU.prototype={
gm(a){return this.a.gm(0)},
E(a,b){var t=this.a
if(t.b==null)t=t.gM().E(0,b)
else{t=t.a7()
if(!(b>=0&&b<t.length))return A.a(t,b)
t=t[b]}return t},
gt(a){var t=this.a
if(t.b==null){t=t.gM()
t=t.gt(t)}else{t=t.a7()
t=new J.aI(t,t.length,A.w(t).h("aI<1>"))}return t}}
A.cn.prototype={}
A.cp.prototype={}
A.bB.prototype={
l(a){var t=A.cq(this.a)
return(this.b!=null?"Converting object to an encodable object failed:":"Converting object did not return an encodable object:")+" "+t}}
A.cy.prototype={
l(a){return"Cyclic error in JSON stringify"}}
A.d9.prototype={
aS(a,b){var t=A.k1(a,this.gbs().a)
return t},
Z(a,b){var t=A.j1(a,this.gbt().b,null)
return t},
gbt(){return B.aC},
gbs(){return B.aB}}
A.db.prototype={}
A.da.prototype={}
A.dQ.prototype={
b3(a){var t,s,r,q,p,o,n=a.length
for(t=this.c,s=0,r=0;r<n;++r){q=a.charCodeAt(r)
if(q>92){if(q>=55296){p=q&64512
if(p===55296){o=r+1
o=!(o<n&&(a.charCodeAt(o)&64512)===56320)}else o=!1
if(!o)if(p===56320){p=r-1
p=!(p>=0&&(a.charCodeAt(p)&64512)===55296)}else p=!1
else p=!0
if(p){if(r>s)t.a+=B.p.a2(a,s,r)
s=r+1
p=A.R(92)
t.a+=p
p=A.R(117)
t.a+=p
p=A.R(100)
t.a+=p
p=q>>>8&15
p=A.R(p<10?48+p:87+p)
t.a+=p
p=q>>>4&15
p=A.R(p<10?48+p:87+p)
t.a+=p
p=q&15
p=A.R(p<10?48+p:87+p)
t.a+=p}}continue}if(q<32){if(r>s)t.a+=B.p.a2(a,s,r)
s=r+1
p=A.R(92)
t.a+=p
switch(q){case 8:p=A.R(98)
t.a+=p
break
case 9:p=A.R(116)
t.a+=p
break
case 10:p=A.R(110)
t.a+=p
break
case 12:p=A.R(102)
t.a+=p
break
case 13:p=A.R(114)
t.a+=p
break
default:p=A.R(117)
t.a+=p
p=A.R(48)
t.a=(t.a+=p)+p
p=q>>>4&15
p=A.R(p<10?48+p:87+p)
t.a+=p
p=q&15
p=A.R(p<10?48+p:87+p)
t.a+=p
break}}else if(q===34||q===92){if(r>s)t.a+=B.p.a2(a,s,r)
s=r+1
p=A.R(92)
t.a+=p
p=A.R(q)
t.a+=p}}if(s===0)t.a+=a
else if(s<n)t.a+=B.p.a2(a,s,n)},
ai(a){var t,s,r,q
for(t=this.a,s=t.length,r=0;r<s;++r){q=t[r]
if(a==null?q==null:a===q)throw A.d(new A.cy(a,null))}B.a.i(t,a)},
ad(a){var t,s,r,q,p=this
if(p.b2(a))return
p.ai(a)
try{t=p.b.$1(a)
if(!p.b2(t)){r=A.fP(a,null,p.gaL())
throw A.d(r)}r=p.a
if(0>=r.length)return A.a(r,-1)
r.pop()}catch(q){s=A.ci(q)
r=A.fP(a,s,p.gaL())
throw A.d(r)}},
b2(a){var t,s,r=this
if(typeof a=="number"){if(!isFinite(a))return!1
r.c.a+=B.e.l(a)
return!0}else if(a===!0){r.c.a+="true"
return!0}else if(a===!1){r.c.a+="false"
return!0}else if(a==null){r.c.a+="null"
return!0}else if(typeof a=="string"){t=r.c
t.a+='"'
r.b3(a)
t.a+='"'
return!0}else if(u.j.b(a)){r.ai(a)
r.bF(a)
t=r.a
if(0>=t.length)return A.a(t,-1)
t.pop()
return!0}else if(u.f.b(a)){r.ai(a)
s=r.bG(a)
t=r.a
if(0>=t.length)return A.a(t,-1)
t.pop()
return s}else return!1},
bF(a){var t,s=this.c
s.a+="["
if(J.fD(a)){if(0>=a.length)return A.a(a,0)
this.ad(a[0])
for(t=1;t<a.length;++t){s.a+=","
this.ad(a[t])}}s.a+="]"},
bG(a){var t,s,r,q,p,o,n=this,m={}
if(a.gv(a)){n.c.a+="{}"
return!0}t=a.gm(a)*2
s=A.a5(t,null,!1,u.X)
r=m.a=0
m.b=!0
a.L(0,new A.dR(m,s))
if(!m.b)return!1
q=n.c
q.a+="{"
for(p='"';r<t;r+=2,p=',"'){q.a+=p
n.b3(A.Y(s[r]))
q.a+='":'
o=r+1
if(!(o<t))return A.a(s,o)
n.ad(s[o])}q.a+="}"
return!0}}
A.dR.prototype={
$2(a,b){var t,s
if(typeof a!="string")this.a.b=!1
t=this.b
s=this.a
B.a.j(t,s.a++,a)
B.a.j(t,s.a++,b)},
$S:12}
A.dP.prototype={
gaL(){var t=this.c.a
return t.charCodeAt(0)==0?t:t}}
A.E.prototype={
N(a){var t,s,r=this,q=r.c
if(q===0)return r
t=!r.a
s=r.b
q=A.X(q,s)
return new A.E(q===0?!1:t,s,q)},
bg(a){var t,s,r,q,p,o,n,m=this.c
if(m===0)return $.a9()
t=m+a
s=this.b
r=new Uint16Array(t)
for(q=m-1,p=s.length;q>=0;--q){o=q+a
if(!(q<p))return A.a(s,q)
n=s[q]
if(!(o>=0&&o<t))return A.a(r,o)
r[o]=n}p=this.a
o=A.X(t,r)
return new A.E(o===0?!1:p,r,o)},
bh(a){var t,s,r,q,p,o,n,m,l=this,k=l.c
if(k===0)return $.a9()
t=k-a
if(t<=0)return l.a?$.fA():$.a9()
s=l.b
r=new Uint16Array(t)
for(q=s.length,p=a;p<k;++p){o=p-a
if(!(p>=0&&p<q))return A.a(s,p)
n=s[p]
if(!(o<t))return A.a(r,o)
r[o]=n}o=l.a
n=A.X(t,r)
m=new A.E(n===0?!1:o,r,n)
if(o)for(p=0;p<a;++p){if(!(p<q))return A.a(s,p)
if(s[p]!==0)return m.af(0,$.aj())}return m},
X(a,b){var t,s,r,q,p,o=this
if(b<0)throw A.d(A.P("shift-amount must be posititve "+b))
t=o.c
if(t===0)return o
s=B.b.q(b,16)
if(B.b.H(b,16)===0)return o.bg(s)
r=t+s+1
q=new Uint16Array(r)
A.h7(o.b,t,b,q)
t=o.a
p=A.X(r,q)
return new A.E(p===0?!1:t,q,p)},
aB(a,b){var t,s,r,q,p,o,n,m,l,k=this
if(b<0)throw A.d(A.P("shift-amount must be posititve "+b))
t=k.c
if(t===0)return k
s=B.b.q(b,16)
r=B.b.H(b,16)
if(r===0)return k.bh(s)
q=t-s
if(q<=0)return k.a?$.fA():$.a9()
p=k.b
o=new Uint16Array(q)
A.aF(p,t,b,o)
t=k.a
n=A.X(q,o)
m=new A.E(n===0?!1:t,o,n)
if(t){t=p.length
if(!(s>=0&&s<t))return A.a(p,s)
if((p[s]&B.b.X(1,r)-1)>>>0!==0)return m.af(0,$.aj())
for(l=0;l<s;++l){if(!(l<t))return A.a(p,l)
if(p[l]!==0)return m.af(0,$.aj())}}return m},
U(a,b){var t,s
u.aZ.a(b)
t=this.a
if(t===b.a){s=A.W(this.b,this.c,b.b,b.c)
return t?0-s:s}return t?-1:1},
ah(a,b){var t,s,r,q=this,p=q.c,o=a.c
if(p<o)return a.ah(q,b)
if(p===0)return $.a9()
if(o===0)return q.a===b?q:q.N(0)
t=p+1
s=new Uint16Array(t)
A.ai(q.b,p,a.b,o,s)
r=A.X(t,s)
return new A.E(r===0?!1:b,s,r)},
a6(a,b){var t,s,r,q=this,p=q.c
if(p===0)return $.a9()
t=a.c
if(t===0)return q.a===b?q:q.N(0)
s=new Uint16Array(p)
A.A(q.b,p,a.b,t,s)
r=A.X(p,s)
return new A.E(r===0?!1:b,s,r)},
aA(a,b){var t,s,r=this,q=r.c
if(q===0)return b
t=b.c
if(t===0)return r
s=r.a
if(s===b.a)return r.ah(b,s)
if(A.W(r.b,q,b.b,t)>=0)return r.a6(b,s)
return b.a6(r,!s)},
af(a,b){var t,s,r=this,q=r.c
if(q===0)return b.N(0)
t=b.c
if(t===0)return r
s=r.a
if(s!==b.a)return r.ah(b,s)
if(A.W(r.b,q,b.b,t)>=0)return r.a6(b,s)
return b.a6(r,!s)},
a_(a,b){var t,s,r,q,p,o,n,m=this.c,l=b.c
if(m===0||l===0)return $.a9()
t=m+l
s=this.b
r=b.b
q=new Uint16Array(t)
for(p=r.length,o=0;o<l;){if(!(o<p))return A.a(r,o)
A.h8(r[o],s,0,q,o,m);++o}p=this.a!==b.a
n=A.X(t,q)
return new A.E(n===0?!1:p,q,n)},
a8(a){var t,s,r,q
if(this.c<a.c)return $.a9()
this.aH(a)
t=$.fb.J()-$.c3.J()
s=A.bi($.fa.J(),$.c3.J(),$.fb.J(),t)
r=A.X(t,s)
q=new A.E(!1,s,r)
return this.a!==a.a&&r>0?q.N(0):q},
bm(a){var t,s,r,q=this
if(q.c<a.c)return q
q.aH(a)
t=A.bi($.fa.J(),0,$.c3.J(),$.c3.J())
s=A.X($.c3.J(),t)
r=new A.E(!1,t,s)
if($.fc.J()>0)r=r.aB(0,$.fc.J())
return q.a&&r.c>0?r.N(0):r},
aH(a){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=this,c=d.c
if(c===$.h4&&a.c===$.h6&&d.b===$.h3&&a.b===$.h5)return
t=a.b
s=a.c
r=s-1
if(!(r>=0&&r<t.length))return A.a(t,r)
q=16-B.b.gaQ(t[r])
if(q>0){p=new Uint16Array(s+5)
o=A.fe(t,s,q,p)
n=new Uint16Array(c+5)
m=A.fe(d.b,c,q,n)}else{n=A.bi(d.b,0,c,c+2)
o=s
p=t
m=c}r=o-1
if(!(r>=0&&r<p.length))return A.a(p,r)
l=p[r]
k=m-o
j=new Uint16Array(m)
i=A.fd(p,o,k,j)
h=m+1
r=n.$flags|0
if(A.W(n,m,j,i)>=0){r&2&&A.F(n)
if(!(m>=0&&m<n.length))return A.a(n,m)
n[m]=1
A.A(n,h,j,i,n)}else{r&2&&A.F(n)
if(!(m>=0&&m<n.length))return A.a(n,m)
n[m]=0}r=o+2
g=new Uint16Array(r)
if(!(o>=0&&o<r))return A.a(g,o)
g[o]=1
A.A(g,o+1,p,o,g)
f=m-1
for(r=n.length;k>0;){e=A.j_(l,n,f);--k
A.h8(e,g,0,n,k,o)
if(!(f>=0&&f<r))return A.a(n,f)
if(n[f]<e){i=A.fd(g,o,k,j)
A.A(n,h,j,i,n)
while(--e,n[f]<e)A.A(n,h,j,i,n)}--f}$.h3=d.b
$.h4=c
$.h5=t
$.h6=s
$.fa.b=n
$.fb.b=h
$.c3.b=o
$.fc.b=q},
gu(a){var t,s,r,q,p=new A.dI(),o=this.c
if(o===0)return 6707
t=this.a?83585:429689
for(s=this.b,r=s.length,q=0;q<o;++q){if(!(q<r))return A.a(s,q)
t=p.$2(t,s[q])}return new A.dJ().$1(t)},
W(a,b){if(b==null)return!1
return b instanceof A.E&&this.U(0,b)===0},
ag(a,b){if(b.c===0)throw A.d(B.E)
return this.a8(b)},
b4(a,b){var t=this
if(t.c===0)return b.a?b.N(0):b
if(b.c===0)return t.a?t.N(0):t
return A.iZ(t,b,!1)},
P(a){var t,s,r,q
for(t=this.c-1,s=this.b,r=s.length,q=0;t>=0;--t){if(!(t<r))return A.a(s,t)
q=q*65536+s[t]}return this.a?-q:q},
l(a){var t,s,r,q,p,o=this,n=o.c
if(n===0)return"0"
if(n===1){if(o.a){n=o.b
if(0>=n.length)return A.a(n,0)
return B.b.l(-n[0])}n=o.b
if(0>=n.length)return A.a(n,0)
return B.b.l(n[0])}t=A.c([],u.s)
n=o.a
s=n?o.N(0):o
while(s.c>1){r=$.i4()
if(r.c===0)A.a8(B.E)
q=s.bm(r).l(0)
B.a.i(t,q)
p=q.length
if(p===1)B.a.i(t,"000")
if(p===2)B.a.i(t,"00")
if(p===3)B.a.i(t,"0")
s=s.a8(r)}r=s.b
if(0>=r.length)return A.a(r,0)
B.a.i(t,B.b.l(r[0]))
if(n)B.a.i(t,"-")
return new A.bV(t,u.bd).bz(0)},
$ia4:1}
A.dI.prototype={
$2(a,b){a=a+b&536870911
a=a+((a&524287)<<10)&536870911
return a^a>>>6},
$S:9}
A.dJ.prototype={
$1(a){a=a+((a&67108863)<<3)&536870911
a^=a>>>11
return a+((a&16383)<<15)&536870911},
$S:6}
A.dM.prototype={
l(a){return this.I()}}
A.x.prototype={}
A.cj.prototype={
l(a){var t=this.a
if(t!=null)return"Assertion failed: "+A.cq(t)
return"Assertion failed"}}
A.c0.prototype={}
A.ab.prototype={
gal(){return"Invalid argument"+(!this.a?"(s)":"")},
gak(){return""},
l(a){var t=this,s=t.c,r=s==null?"":" ("+s+")",q=t.d,p=q==null?"":": "+q,o=t.gal()+r+p
if(!t.a)return o
return o+t.gak()+": "+A.cq(t.gau())},
gau(){return this.b}}
A.bT.prototype={
gau(){return A.cg(this.b)},
gal(){return"RangeError"},
gak(){var t,s=this.e,r=this.f
if(s==null)t=r!=null?": Not less than or equal to "+A.o(r):""
else if(r==null)t=": Not greater than or equal to "+A.o(s)
else if(r>s)t=": Not in inclusive range "+A.o(s)+".."+A.o(r)
else t=r<s?": Valid value range is empty":": Only valid value is "+A.o(s)
return t}}
A.cr.prototype={
gau(){return A.B(this.b)},
gal(){return"RangeError"},
gak(){if(A.B(this.b)<0)return": index must not be negative"
var t=this.f
if(t===0)return": no indices are valid"
return": index should be less than "+t},
gm(a){return this.f}}
A.c1.prototype={
l(a){return"Unsupported operation: "+this.a}}
A.cO.prototype={
l(a){return"UnimplementedError: "+this.a}}
A.bZ.prototype={
l(a){return"Bad state: "+this.a}}
A.co.prototype={
l(a){var t=this.a
if(t==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.cq(t)+"."}}
A.bY.prototype={
l(a){return"Stack Overflow"},
$ix:1}
A.dN.prototype={
l(a){return"Exception: "+this.a}}
A.b6.prototype={
l(a){var t=this.a,s=""!==t?"FormatException: "+t:"FormatException"
return s}}
A.cs.prototype={
l(a){return"IntegerDivisionByZeroException"},
$ix:1}
A.e.prototype={
aw(a,b,c){var t=A.l(this)
return A.iB(this,t.D(c).h("1(e.E)").a(b),t.h("e.E"),c)},
bE(a,b){var t=A.l(this)
return new A.v(this,t.h("j(e.E)").a(b),t.h("v<e.E>"))},
gm(a){var t,s=this.gt(this)
for(t=0;s.n();)++t
return t},
gv(a){return!this.gt(this).n()},
E(a,b){var t,s
A.f5(b,"index")
t=this.gt(this)
for(s=b;t.n();){if(s===0)return t.gp();--s}throw A.d(A.eY(b,b-s,this,"index"))},
l(a){return A.it(this,"(",")")}}
A.N.prototype={
l(a){return"MapEntry("+A.o(this.a)+": "+A.o(this.b)+")"}}
A.bN.prototype={
gu(a){return A.p.prototype.gu.call(this,0)},
l(a){return"null"}}
A.p.prototype={$ip:1,
W(a,b){return this===b},
gu(a){return A.bR(this)},
l(a){return"Instance of '"+A.cJ(this)+"'"},
gB(a){return A.kK(this)},
toString(){return this.l(this)}}
A.bf.prototype={
gm(a){return this.a.length},
l(a){var t=this.a
return t.charCodeAt(0)==0?t:t},
$iiO:1}
A.bd.prototype={
gae(){return this.e===B.r?B.a.a0(this.b,0,new A.dy(),u.S):0},
gaD(){var t,s=this,r=s.a
if(r!=null)return r
r=s.e
if(r===B.r)return s.gae()>=2?""+s.gae()+"\ubc30 \uc5ed\ub9cc":"\uc5ed\ub9cc"
t=""+s.c+"\ud310 "+s.d.a+"\ubd80"
return r===B.x?t:t+" "+r.c},
l(a){var t=this
return t.gaD()+" "+t.r.gaT()+" ["+B.a.V(t.b,", ")+"] "+A.o(t.w)}}
A.dy.prototype={
$2(a,b){return A.B(a)+u.g.a(b).b},
$S:4}
A.e6.prototype={
$2(a,b){return A.B(a)+u.g.a(b).b},
$S:4}
A.e7.prototype={
$2(a,b){return A.B(a)+u.g.a(b).b},
$S:4}
A.e8.prototype={
$1(a){return u.g.a(a).a===B.a6},
$S:8}
A.dZ.prototype={
$1(a){return B.a.a0(u.H.a(a),0,new A.e_(this.a),u.S)},
$S:33}
A.e_.prototype={
$2(a,b){var t,s
A.B(a)
t=this.a
s=A.iP(A.B(b))
if(!(s>=0&&s<34))return A.a(t,s)
return a+t[s]},
$S:9}
A.be.prototype={
I(){return"SetType."+this.b}}
A.I.prototype={
gb0(){var t=this.a
if(t===B.v){t=this.b
t=A.c([t,t+1,t+2],u.t)}else{if(t===B.w)t=2
else t=t===B.f?4:3
t=A.a5(t,this.b,!1,u.S)}return t},
l(a){var t=this.gb0(),s=A.w(t),r=new A.L(t,s.h("n(1)").a(A.hQ()),s.h("L<1,n>")).V(0,"")
if(this.c)return"["+r+"]"
if(this.d)return"("+r+")"
return r}}
A.bv.prototype={
I(){return"HandShape."+this.b}}
A.aU.prototype={
I(){return"WaitType."+this.b}}
A.b5.prototype={
gaz(){return B.a.aV(this.b,new A.d3())},
l(a){var t=this
return t.a.l(0)+" "+B.a.V(t.b," ")+" wait="+t.d.l(0)+"@"+t.c}}
A.d3.prototype={
$1(a){return u.o.a(a).a===B.w},
$S:0}
A.eo.prototype={
$1(a){return u.o.a(a).b===this.a.c},
$S:0}
A.aT.prototype={
l(a){return A.r(this.a)+"\xd7"+this.b}}
A.dE.prototype={
gC(){return B.a.a0(this.b,0,new A.dF(),u.S)},
l(a){return"Ukeire(\uc0f9\ud150 "+this.a+", "+this.gC()+"\uc7a5: "+B.a.V(this.b," ")+")"}}
A.dF.prototype={
$2(a,b){return A.B(a)+u.r.a(b).b},
$S:20}
A.ac.prototype={
l(a){return A.r(this.a)+" \ubc84\ub9bc \u2192 "+this.c.l(0)}}
A.ey.prototype={
$2(a,b){var t,s,r,q=u.L
q.a(a)
q.a(b)
q=a.b
t=b.b
if(q!==t)return q-t
s=a.c.gC()
r=b.c.gC()
if(s!==r)return r-s
return a.a-b.a},
$S:18}
A.K.prototype={
l(a){return this.a+" "+this.b}}
A.aA.prototype={}
A.en.prototype={
$2(a,b){return A.B(a)+u.G.a(b).b},
$S:17}
A.d4.prototype={
ba(a,b,c,d,e){var t,s,r=this,q=14-3*r.b.length,p=r.a,o=p.length
if(o!==q)throw A.d(A.P("\uc190\ud328\ub294 "+q+" \uc7a5\uc774\uc5b4\uc57c \ud569\ub2c8\ub2e4 (\ud604\uc7ac "+o+" \uc7a5)"))
o=r.c
if(!B.a.A(p,o))throw A.d(A.P("\ud654\ub8cc\ud328 "+A.r(o)+" \uac00 \uc190\ud328\uc5d0 \uc5c6\uc2b5\ub2c8\ub2e4"))
t=A.eU(r.ga9())
for(s=0;s<34;++s)if(t[s]>4)throw A.d(A.P(A.h_(s)+" \uc774(\uac00) 4\uc7a5\uc744 \ub118\uc2b5\ub2c8\ub2e4"))},
ga9(){var t,s,r,q=A.H(this.a,u.S)
for(t=this.b,s=t.length,r=0;r<t.length;t.length===s||(0,A.h)(t),++r)B.a.F(q,t[r].b)
return q},
gac(){return B.a.S(this.b,new A.d5())}}
A.d5.prototype={
$1(a){return!u.k.a(a).c},
$S:19}
A.dA.prototype={}
A.dx.prototype={}
A.bH.prototype={
I(){return"MeldType."+this.b}}
A.aq.prototype={
l(a){var t=this.b,s=A.w(t),r=new A.L(t,s.h("n(1)").a(A.hQ()),s.h("L<1,n>")).V(0," ")
return this.c?"["+r+"]":"("+r+")"}}
A.ao.prototype={
I(){return"Limit."+this.b}}
A.ax.prototype={}
A.bc.prototype={
gaX(){var t=this.e
return t>0?"\ubcf8\uc7a5 "+t+" \xb7 +"+t*300+"\uc810":""},
gaT(){var t=this,s=t.a
if(s>0)return""+s
s=t.b
if(s===0)return""+t.c+" \uc62c"
return""+t.c+" / "+s}}
A.cL.prototype={
ga4(){var t=this.a,s=this.b,r=this.c
if(s!=null&&s<t)t=s
return r!=null&&r<t?r:t},
l(a){var t=this
return"Shanten("+t.ga4()+": \uc77c\ubc18 "+t.a+", \uce58\ub610\uc774 "+A.o(t.b)+", \uad6d\uc0ac "+A.o(t.c)+")"}}
A.ej.prototype={
$4(a,b,c,d){return((a*5+b)*5+c)*2+d},
$S:16}
A.f.prototype={
I(){return"Yaku."+this.b}}
A.M.prototype={
l(a){return this.a.c+" "+this.b}}
A.ep.prototype={
$1(a){var t=u.o.a(a).a
return t===B.n||t===B.f},
$S:0}
A.eq.prototype={
$1(a){return u.o.a(a).b>=31},
$S:0}
A.er.prototype={
$1(a){var t=u.o.a(a).b
return t>=27&&t<=30},
$S:0}
A.es.prototype={
$1(a){return u.o.a(a).a===B.f},
$S:0}
A.et.prototype={
$1(a){u.W.a(a)
return a},
$S:15}
A.eu.prototype={
$1(a){u.W.a(a)
return new A.M(a,a.f)},
$S:14}
A.ev.prototype={
$1(a){return A.B(a)<27},
$S:1}
A.ew.prototype={
$1(a){u.W.a(a)
return new A.M(a,this.a?a.d:a.e)},
$S:14}
A.ex.prototype={
$1(a){return u.g.a(a).b>0},
$S:8}
A.eb.prototype={
$1(a){return u.o.a(a).a===B.v},
$S:0}
A.ec.prototype={
$1(a){return u.o.a(a).b},
$S:11}
A.ed.prototype={
$1(a){var t=u.o.a(a).a
return t===B.n||t===B.f},
$S:0}
A.ee.prototype={
$1(a){return u.o.a(a).b},
$S:11}
A.ei.prototype={
$1(a){var t
if(a<31){t=this.a
t=a===t.b||a===t.c}else t=!0
return t},
$S:1}
A.ef.prototype={
$1(a){return A.B(a)===this.a},
$S:1}
A.eg.prototype={
$1(a){return u.o.a(a).a===B.f},
$S:0}
A.eh.prototype={
$1(a){return u.o.a(a).b>=31},
$S:0}
A.T.prototype={
gY(){var t=this.a
if(this.b){t=A.r(t)
if(1>=t.length)return A.a(t,1)
t="0"+t[1]}else t=A.r(t)
return t},
W(a,b){if(b==null)return!1
return b instanceof A.T&&b.a===this.a&&b.b===this.b},
gu(a){var t=this.b?1:0
return this.a*2+t},
l(a){return this.gY()}}
A.bP.prototype={
I(){return"PaifuEventType."+this.b}}
A.ar.prototype={
T(){var t,s,r,q,p,o,n=this,m=u.N,l=u.z,k=A.ap(m,l),j=n.a
k.j(0,"type",j.b)
k.j(0,"seat",n.b)
t=j===B.A
if(!t){s=n.c
k.j(0,"tile",s==null?null:s.gY())}if(j===B.i)k.F(0,A.y(["tsumogiri",n.d,"riichi",n.e],m,l))
if(t){t=A.c([],u.s)
for(s=n.x,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=s[q]
o=p.a
if(p.b){o=A.r(o)
if(1>=o.length)return A.a(o,1)
o="0"+o[1]}else o=A.r(o)
t.push(o)}k.F(0,A.y(["kind",n.r,"from",n.w,"tiles",t],m,l))}m=n.f
l=m==null
if(!l||j===B.z){if(l)m=null
else{l=A.c([],u.s)
for(j=m.length,q=0;q<m.length;m.length===j||(0,A.h)(m),++q){p=m[q]
t=p.a
if(p.b){t=A.r(t)
if(1>=t.length)return A.a(t,1)
t="0"+t[1]}else t=A.r(t)
l.push(t)}m=l}k.j(0,"hand",m)}m=n.y
if(m!=null)k.j(0,"at",m)
if(n.z)k.j(0,"guess",!0)
return k}}
A.di.prototype={
T(){var t,s,r,q,p=this,o=u.N,n=A.ap(o,u.z)
n.j(0,"dir",p.a)
n.j(0,"box",p.b)
n.j(0,"side",p.c)
t=p.d
if(t!=null)n.j(0,"start_ms",t)
t=p.e
if(t!=null)n.j(0,"end_ms",t)
t=p.f
if(t!=null){o=A.ap(o,u.H)
for(s=0;s<4;++s){r=B.I[s]
q=t.k(0,r)
if(q!=null)o.j(0,r,q)}n.j(0,"boxes",o)}return n}}
A.dj.prototype={
$1(a){return typeof a!="number"},
$S:38}
A.bQ.prototype={
T(){var t,s,r,q,p,o=A.c([],u.s)
for(t=this.b,s=t.length,r=0;r<t.length;t.length===s||(0,A.h)(t),++r){q=t[r]
p=q.a
if(q.b){p=A.r(p)
if(1>=p.length)return A.a(p,1)
p="0"+p[1]}else p=A.r(p)
o.push(p)}return A.y(["kind",this.a,"tiles",o],u.N,u.z)}}
A.dl.prototype={
$1(a){return u._.a(a).a===B.a.gG(this.a).a},
$S:10}
A.dk.prototype={
T(){var t,s,r,q,p,o,n=this,m=A.ap(u.N,u.z)
m.j(0,"type",n.a)
m.j(0,"winner",n.b)
m.j(0,"loser",n.c)
t=n.d
m.j(0,"win_tile",t==null?null:t.gY())
t=n.e
if(t==null)t=null
else{s=A.c([],u.s)
for(r=t.length,q=0;q<t.length;t.length===r||(0,A.h)(t),++q){p=t[q]
o=p.a
if(p.b){o=A.r(o)
if(1>=o.length)return A.a(o,1)
o="0"+o[1]}else o=A.r(o)
s.push(o)}t=s}m.j(0,"hand",t)
t=A.c([],u.Y)
for(s=n.f,r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)t.push(s[q].T())
m.j(0,"melds",t)
t=n.r
if(t!=null)m.j(0,"flags",t)
t=n.w
if(t!=null)m.j(0,"tenpai",t)
return m}}
A.aS.prototype={}
A.aC.prototype={}
A.bb.prototype={}
A.dh.prototype={
T(){var t,s,r,q,p,o,n,m=this,l=A.ap(u.N,u.z)
l.j(0,"version",1)
l.j(0,"id",m.a)
l.j(0,"title",m.b)
l.j(0,"round",m.c)
l.j(0,"honba",m.d)
l.j(0,"dealer",m.e)
l.j(0,"hero",m.f)
l.j(0,"names",m.r)
t=m.ch
if(t!=null)l.j(0,"start_scores",t)
t=m.CW
if(t!=null)l.j(0,"kyotaku",t)
t=u.s
s=A.c([],t)
for(r=m.w,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p]
n=o.a
if(o.b){n=A.r(n)
if(1>=n.length)return A.a(n,1)
n="0"+n[1]}else n=A.r(n)
s.push(n)}l.j(0,"dora_indicators",s)
s=A.c([],t)
for(r=m.x,q=r.length,p=0;p<r.length;r.length===q||(0,A.h)(r),++p){o=r[p]
n=o.a
if(o.b){n=A.r(n)
if(1>=n.length)return A.a(n,1)
n="0"+n[1]}else n=A.r(n)
s.push(n)}l.j(0,"ura_indicators",s)
l.j(0,"note",m.y)
s=m.z
if(s!=null){t=A.c([],t)
for(r=s.length,p=0;p<s.length;s.length===r||(0,A.h)(s),++p){o=s[p]
q=o.a
if(o.b){q=A.r(q)
if(1>=q.length)return A.a(q,1)
q="0"+q[1]}else q=A.r(q)
t.push(q)}l.j(0,"start_hand",t)}t=A.c([],u.Y)
for(s=m.Q,r=s.length,p=0;p<s.length;s.length===r||(0,A.h)(s),++p)t.push(s[p].T())
l.j(0,"events",t)
t=m.as
if(t!=null)l.j(0,"result",t.T())
t=m.at
if(t!=null)l.j(0,"frames",t.T())
t=m.ax
if(t!=null)l.j(0,"hand_source",t)
t=m.ay
if(t!=null)l.j(0,"restore",t)
return l},
gbu(){var t,s=this,r=s.cx
if(r===$){t=s.z!=null||B.a.R(s.Q,new A.du(s))
s.cx!==$&&A.hP()
r=s.cx=t}return r},
gaC(){var t,s=this,r=s.cy
if(r===$){t=s.bd()
s.cy!==$&&A.hP()
s.cy=t
r=t}return r},
bd(){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3=this,a4={},a5=A.c([],u.h)
for(t=u.cY,s=0;s<4;++s)a5.push(A.c([],t))
t=A.c([],u.a)
for(r=u.bD,s=0;s<4;++s)t.push(A.c([],r))
q=A.c([!1,!1,!1,!1],u.bx)
a4.a=a3.z
a4.b=!1
a4.c=null
a4.d=0
p=new A.dt(a4,a5,t,q)
o=A.c([p.$2(0,null)],u.aj)
for(r=a3.Q,n=A.d6(r,0,u.O),m=J.aa(n.a),l=n.b,n=new A.a_(m,l,A.l(n).h("a_<1>")),k=a3.f,j=!1;n.n();){i={}
h=n.c
h=h>=0?new A.au(l+h,m.gp()):A.a8(A.aN())
i.a=null
g=i.a=h.b
switch(g.a.a){case 0:if(g.b===k){++a4.d
a4.a=g.f
a4.b=!0
a4.c=g.c}f=g
break
case 1:f=g.b
if(!(f>=0&&f<a5.length))return A.a(a5,f)
e=a5[f]
d=g.c
d.toString
c=g.e
B.a.i(e,new A.aS(d,g.d,c,!1))
if(c)B.a.j(q,f,!0)
if(f===k){if(!a4.b&&!j)++a4.d
a4.a=g.f
a4.b=!1
a4.c=null}else if(!j)++a4.d
f=g
j=!1
break
case 2:b=g.w
f=!1
if(b!=null)if(b!==g.b){if(b>>>0!==b||b>=a5.length)return A.a(a5,b)
f=a5[b].length!==0}if(f){if(b>>>0!==b||b>=a5.length)return A.a(a5,b)
f=a5[b]
e=f.length
d=B.a.gb_(f)
B.a.j(f,e-1,new A.aS(d.a,d.b,d.c,!0))}a=g.r
if(a==null)a="pon"
f=g.x
a0=new A.aC(a,f,b)
if(a==="kakan"&&f.length!==0){f=g.b
if(!(f>=0&&f<t.length))return A.a(t,f)
a1=B.a.aY(t[f],new A.ds(i))}else a1=-1
f=i.a
e=t.length
f=f.b
if(a1>=0){if(!(f>=0&&f<e))return A.a(t,f)
B.a.j(t[f],a1,a0)}else{if(!(f>=0&&f<e))return A.a(t,f)
B.a.i(t[f],a0)}j=!A.l9(a,"kan",0)
f=i.a
if(f.b===k){a4.a=f.f
a4.b=!1
a4.c=null}break
default:f=g}B.a.i(o,p.$2(h.a+1,f))}a2=a3.as
if(a2!=null){if(a2.b===k&&a2.e!=null)a4.a=a2.e
a4.b=!1
a4.c=null
B.a.i(o,p.$3$finished(r.length+1,null,!0))}return o}}
A.du.prototype={
$1(a){u.O.a(a)
return a.b===this.a.f&&a.f!=null},
$S:21}
A.dt.prototype={
$3$finished(a,b,c){var t,s,r,q,p,o,n=this,m=A.c([],u.h)
for(t=n.b,s=t.length,r=u.d1,q=0;q<t.length;t.length===s||(0,A.h)(t),++q){p=A.f4(t[q],!1,r)
p.$flags=3
m.push(p)}t=A.c([],u.a)
for(s=n.c,r=s.length,o=u.x,q=0;q<s.length;s.length===r||(0,A.h)(s),++q){p=A.f4(s[q],!1,o)
p.$flags=3
t.push(p)}return new A.bb(m,t,A.ad(n.d,u.y),n.a.d)},
$2(a,b){return this.$3$finished(a,b,!1)},
$S:22}
A.ds.prototype={
$1(a){u.x.a(a)
return a.a==="pon"&&B.a.gG(a.b).a===B.a.gG(this.a.a.x).a},
$S:23}
A.dw.prototype={}
A.as.prototype={
I(){return"ReviewGrade."+this.b}}
A.a6.prototype={
I(){return"ReviewStatus."+this.b}}
A.V.prototype={}
A.bS.prototype={
I(){return"PushFoldAction."+this.b}}
A.dv.prototype={}
A.eL.prototype={
$1(a){var t=this.a.k(0,a)
t.toString
if(!isFinite(t))t=0
return t},
$S:24}
A.cH.prototype={
K(a){var t=this.a,s=A.w(t)
return new A.v(t,s.h("j(1)").a(new A.dm(a)),s.h("v<1>")).gm(0)},
b5(a){var t=this.a,s=A.w(t)
return new A.v(t,s.h("j(1)").a(new A.dn(a)),s.h("v<1>")).gm(0)},
gaW(){return this.K(B.L)+this.K(B.m)+this.K(B.M)},
bA(){var t,s,r,q,p,o,n,m=A.c([],u.U)
for(t=this.a,s=A.w(t),r=s.h("j(1)"),s=s.h("v<1>"),q=s.h("e.E"),p=0;p<3;++p){o=B.aK[p]
n=A.H(new A.v(t,r.a(new A.dp(o)),s),q)
B.a.a5(n,new A.dq(o))
B.a.F(m,n)}return A.fZ(m,0,A.hF(3,"count",u.S),u.T).b1(0)},
gaU(){var t,s,r,q,p,o,n,m,l,k,j=$.a9(),i=$.aj()
for(t=this.a,s=t.length,r=0,q=0;q<t.length;t.length===s||(0,A.h)(t),++q){p=t[q]
if(p.r!==B.d)continue;++r
if(p.ay===B.k){o=$.a9()
n=$.aj()}else{m=p.Q.c
if(m.gC()===0){o=$.aj()
n=o}else{o=A.dH(p.z.c.gC())
n=A.dH(m.gC())}}j=j.a_(0,n).aA(0,o.a_(0,i))
i=i.a_(0,n)
l=j.b4(0,i)
if(l.U(0,$.aj())>0){if(l.c===0)A.a8(B.E)
j=j.a8(l)
i=i.a8(l)}}if(r===0)return null
k=i.a_(0,A.dH(r))
return A.dH(200).a_(0,j).aA(0,k).ag(0,$.fB().a_(0,k)).P(0)}}
A.dm.prototype={
$1(a){return u.T.a(a).r===this.a},
$S:3}
A.dn.prototype={
$1(a){return u.T.a(a).ay===this.a},
$S:3}
A.dp.prototype={
$1(a){u.T.a(a)
return a.r===B.d&&a.ay===this.a},
$S:3}
A.dq.prototype={
$2(a,b){var t,s,r,q=u.T
q.a(a)
q.a(b)
q=this.a===B.k
if(q){t=a.as
s=t==null?0:t}else{t=a.at
s=t==null?0:t}if(q){q=b.as
r=q==null?0:q}else{q=b.at
r=q==null?0:q}if(s!==r)return r-s
return a.b-b.b},
$S:26}
A.e4.prototype={
$1(a){var t,s=u._.a(a).a
if(s>=0&&s<34){t=this.a
if(!(s>=0&&s<34))return A.a(t,s)
B.a.j(t,s,t[s]+1)}},
$S:27}
A.e1.prototype={
$1(a){var t,s=this,r=null,q=s.a.a
q=q==null?r:q.c
t=s.w
return A.h0(r,r,r,s.e,q,s.d,s.z,r,s.x,r,r,r,r,r,B.Z,r,r,t.e,A.ad(s.y,u.S),r,r,B.j,r,B.j,r,r,a,t.d,s.r,r)},
$S:28}
A.e2.prototype={
$1(a){return u.L.a(a).a===this.a.a},
$S:5}
A.e3.prototype={
$1(a){var t,s,r
u.L.a(a)
t=a.b
s=this.a
r=s.b
if(t>=r)t=t===r&&a.c.gC()>s.c.gC()
else t=!0
return t},
$S:5}
A.bW.prototype={
I(){return"ReviewStageKind."+this.b}}
A.U.prototype={}
A.eS.prototype={
$1(a){u.bG.a(a)
return a!=null&&a.length===13&&B.a.S(a,new A.eT())},
$S:30}
A.eT.prototype={
$1(a){var t=u._.a(a).a
return t>=0&&t<34},
$S:10}
A.eN.prototype={
$1(a){return u.q.a(a).b===this.a},
$S:31}
A.eO.prototype={
$2(a,b){var t=u.q
return t.a(a).b-t.a(b).b},
$S:32}
A.dr.prototype={}
A.eP.prototype={
$0(){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,b0,b1,b2,b3,b4,b5,b6,b7,b8=null,b9=A.hx(this.a),c0=b9.as
if(c0==null)return B.h.Z(A.y(["kind","none","rules",A.e5(B.o)],u.N,u.K),b8)
t=c0.a
if(t!=="ron"&&t!=="tsumo")return B.h.Z(A.y(["kind","draw","result",A.fo(c0),"rules",A.e5(B.o)],u.N,u.K),b8)
s=A.hN(b9,B.o)
if(s==null)return B.h.Z(A.y(["kind","win","result",A.fo(c0),"score",null,"rules",A.e5(B.o)],u.N,u.X),b8)
r=s.c
q=r.r
t=A.fo(c0)
p=A.e5(B.o)
o=r.a
n=o==null
m=u.J
l=A.c([],m)
for(k=r.b,j=k.length,i=u.N,h=u.K,g=0;g<k.length;k.length===j||(0,A.h)(k),++g){f=k[g]
e=f.a
l.push(A.y(["name",e.c,"han",f.b,"yakuman",e.f>0,"label",A.jG(f)],i,h))}k=r.c
j=r.d
e=j.a
d=A.c([],m)
for(j=j.b,c=j.length,g=0;g<j.length;j.length===c||(0,A.h)(j),++g){b=j[g]
d.push(A.y(["label",b.a,"fu",b.b],i,h))}j=r.e
c=j===B.r
a=r.gae()
a0=n?A.ke(r):""
a1=r.gaD()
a2=n&&!c?""+k+"\ud310 "+e+"\ubd80":""
a3=A.y(["ron",q.a,"tsumoFromDealer",q.b,"tsumoFromNonDealer",q.c,"total",q.d,"honba",q.e,"display",q.gaT(),"honbaNote",q.gaX()],i,h)
a4=n?A.k2(q):""
a5=A.k9(s.b)
a6=u.s
a7=A.c([],a6)
for(a8=c0.e,a9=a8.length,g=0;g<a8.length;a8.length===a9||(0,A.h)(a8),++g){b0=a8[g]
b1=b0.a
if(b0.b){b1=A.r(b1)
if(1>=b1.length)return A.a(b1,1)
b1="0"+b1[1]}else b1=A.r(b1)
a7.push(b1)}a8=c0.d.gY()
m=A.c([],m)
for(a9=c0.f,b1=a9.length,g=0;g<a9.length;a9.length===b1||(0,A.h)(a9),++g){b2=a9[g]
b3=A.c([],a6)
for(b4=b2.b,b5=b4.length,b6=0;b6<b4.length;b4.length===b5||(0,A.h)(b4),++b6){b0=b4[b6]
b7=b0.a
if(b0.b){b7=A.r(b7)
if(1>=b7.length)return A.a(b7,1)
b7="0"+b7[1]}else b7=A.r(b7)
b3.push(b7)}m.push(A.y(["kind",b2.a,"tiles",b3],i,h))}return B.h.Z(A.y(["kind","win","result",t,"rules",p,"score",A.y(["valid",n,"error",o,"yaku",l,"han",k,"fu",e,"fuItems",d,"limit",j.b,"limitLabel",j.c,"yakuman",c,"yakumanCount",a,"stamp",a0,"summary",a1,"hanFu",a2,"basePoints",r.f,"payment",a3,"paymentLine",a4,"situation",a5,"hand",A.y(["closed",a7,"winTile",a8,"melds",m],i,h)],i,u.X)],i,h),b8)},
$S:2}
A.dW.prototype={
$1(a){return u.L.a(a).a===this.a.a},
$S:5}
A.ek.prototype={
$1(a){return B.b3.A(0,u.T.a(a).r)},
$S:3}
A.ea.prototype={
$1(a){var t=this.a
if(t!=null&&a>=0&&a<t.length){if(!(a>=0&&a<t.length))return A.a(t,a)
t=t[a]}else t=""+(a+1)+"\ubc88"
return t},
$S:7}
A.eM.prototype={
$0(){var t,s,r,q,p,o,n="seatLabels",m=A.hx(this.a),l=this.b,k=null
if(l!=null&&l.length!==0){t=B.h.aS(l,null)
if(u.f.b(t)&&u.j.b(t.k(0,n))){l=A.c([],u.s)
for(s=u.j.a(t.k(0,n)),r=s.length,q=0;q<s.length;s.length===r||(0,A.h)(s),++q)l.push(A.o(s[q]))
k=l}}p=A.l_(m,B.ah)
l=A.kk(m,p)
s=A.c([],u.d)
for(r=p.a,o=r.length,q=0;q<r.length;r.length===o||(0,A.h)(r),++q)s.push(A.km(r[q]))
return B.h.Z(A.y(["summary",l,"turns",s,"stages",A.kd(m,p,k)],u.N,u.K),null)},
$S:2}
A.eI.prototype={
$1(a){return A.hz(new A.eH(a))},
$S:35}
A.eH.prototype={
$0(){return A.l4(A.hB(this.a))},
$S:2}
A.eJ.prototype={
$2(a,b){return A.hz(new A.eG(a,b))},
$1(a){return this.$2(a,null)},
$S:36}
A.eG.prototype={
$0(){var t=A.hB(this.a),s=this.b
return A.kZ(t,s!=null&&typeof s==="string"?A.Y(s):null)},
$S:2};(function aliases(){var t=J.aB.prototype
t.b9=t.l
t=A.e.prototype
t.b8=t.bE})();(function installTearOffs(){var t=hunkHelpers._static_2,s=hunkHelpers._static_1
t(J,"jL","ix",37)
s(A,"ky","jy",13)
s(A,"kB","jB",25)
s(A,"lh","kl",0)
s(A,"lf","iU",6)
s(A,"fy","iR",1)
s(A,"ld","dB",1)
s(A,"le","iT",1)
s(A,"lc","iS",1)
s(A,"lb","iQ",1)
s(A,"hQ","r",7)})();(function inheritance(){var t=hunkHelpers.mixin,s=hunkHelpers.inherit,r=hunkHelpers.inheritMany
s(A.p,null)
r(A.p,[A.f_,J.ct,A.bX,J.aI,A.e,A.br,A.u,A.ay,A.x,A.dz,A.aQ,A.bG,A.c2,A.a_,A.S,A.aG,A.c5,A.aD,A.dC,A.dg,A.dc,A.bF,A.bE,A.dK,A.dU,A.ag,A.cS,A.cW,A.a1,A.cV,A.aW,A.z,A.cn,A.cp,A.dQ,A.E,A.dM,A.bY,A.dN,A.b6,A.cs,A.N,A.bN,A.bf,A.bd,A.I,A.b5,A.aT,A.dE,A.ac,A.K,A.aA,A.d4,A.dA,A.dx,A.aq,A.ax,A.bc,A.cL,A.M,A.T,A.ar,A.di,A.bQ,A.dk,A.aS,A.aC,A.bb,A.dh,A.dw,A.V,A.dv,A.cH,A.U,A.dr])
r(J.ct,[J.cv,J.by,J.bz,J.b8,J.b9,J.b7,J.aO])
r(J.bz,[J.aB,J.k,A.aR,A.bK])
r(J.aB,[J.cI,J.bh,J.am])
s(J.cu,A.bX)
s(J.d7,J.k)
r(J.b7,[J.bx,J.cw])
r(A.e,[A.bj,A.i,A.af,A.v,A.bw,A.aY])
s(A.aJ,A.bj)
s(A.c4,A.aJ)
r(A.u,[A.aK,A.an,A.cT])
r(A.ay,[A.cm,A.d1,A.cl,A.cN,A.eC,A.eE,A.dd,A.dJ,A.e8,A.dZ,A.d3,A.eo,A.d5,A.ej,A.ep,A.eq,A.er,A.es,A.et,A.eu,A.ev,A.ew,A.ex,A.eb,A.ec,A.ed,A.ee,A.ei,A.ef,A.eg,A.eh,A.dj,A.dl,A.du,A.dt,A.ds,A.eL,A.dm,A.dn,A.dp,A.e4,A.e1,A.e2,A.e3,A.eS,A.eT,A.eN,A.dW,A.ek,A.ea,A.eI,A.eJ])
r(A.cm,[A.d2,A.d8,A.eD,A.de,A.dR,A.dI,A.dy,A.e6,A.e7,A.e_,A.dF,A.ey,A.en,A.dq,A.eO])
r(A.x,[A.bC,A.c0,A.cx,A.cP,A.cK,A.cR,A.bB,A.cj,A.ab,A.c1,A.cO,A.bZ,A.co])
r(A.i,[A.D,A.aP,A.bD])
r(A.D,[A.c_,A.L,A.bV,A.cU])
s(A.bu,A.af)
s(A.bt,A.bw)
s(A.bk,A.aG)
s(A.au,A.bk)
r(A.aD,[A.bs,A.ca])
s(A.aM,A.bs)
s(A.bO,A.c0)
r(A.cN,[A.cM,A.b4])
s(A.bA,A.an)
r(A.bK,[A.cz,A.ba])
r(A.ba,[A.c6,A.c8])
s(A.c7,A.c6)
s(A.bI,A.c7)
s(A.c9,A.c8)
s(A.bJ,A.c9)
r(A.bI,[A.cA,A.cB])
r(A.bJ,[A.cC,A.cD,A.cE,A.cF,A.cG,A.bL,A.bM])
s(A.cb,A.cR)
s(A.aV,A.ca)
s(A.cy,A.bB)
s(A.d9,A.cn)
r(A.cp,[A.db,A.da])
s(A.dP,A.dQ)
r(A.ab,[A.bT,A.cr])
r(A.dM,[A.be,A.bv,A.aU,A.bH,A.ao,A.f,A.bP,A.as,A.a6,A.bS,A.bW])
r(A.cl,[A.eP,A.eM,A.eH,A.eG])
t(A.c6,A.z)
t(A.c7,A.S)
t(A.c8,A.z)
t(A.c9,A.S)})()
var v={G:typeof self!="undefined"?self:globalThis,typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{b:"int",q:"double",Z:"num",n:"String",j:"bool",bN:"Null",m:"List",p:"Object",ae:"Map",C:"JSObject"},mangledNames:{},types:["j(I)","j(b)","n()","j(V)","b(b,M)","j(ac)","b(b)","n(b)","j(M)","b(b,b)","j(T)","b(I)","~(p?,p?)","@(@)","M(f)","f(f)","b(b,b,b,b)","b(b,K)","b(ac,ac)","j(aq)","b(b,aT)","j(ar)","bb(b,ar?{finished:j})","j(aC)","q(b)","I(aq)","b(V,V)","~(T)","V(a6)","@(n)","j(m<T>?)","j(U)","b(U,U)","b(m<b>)","@(@,n)","n(p?)","n(p?[p?])","b(@,@)","j(@)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti"),rttc:{"2;":(a,b)=>c=>c instanceof A.au&&a.b(c.a)&&b.b(c.b)}}
A.jg(v.typeUniverse,JSON.parse('{"cI":"aB","bh":"aB","am":"aB","lm":"aR","cv":{"j":[],"t":[]},"by":{"t":[]},"bz":{"C":[]},"aB":{"C":[]},"k":{"m":["1"],"i":["1"],"C":[],"e":["1"]},"cu":{"bX":[]},"d7":{"k":["1"],"m":["1"],"i":["1"],"C":[],"e":["1"]},"aI":{"G":["1"]},"b7":{"q":[],"Z":[],"a4":["Z"]},"bx":{"q":[],"b":[],"Z":[],"a4":["Z"],"t":[]},"cw":{"q":[],"Z":[],"a4":["Z"],"t":[]},"aO":{"n":[],"a4":["n"],"fT":[],"t":[]},"bj":{"e":["2"]},"br":{"G":["2"]},"aJ":{"bj":["1","2"],"e":["2"],"e.E":"2"},"c4":{"aJ":["1","2"],"bj":["1","2"],"i":["2"],"e":["2"],"e.E":"2"},"aK":{"u":["3","4"],"ae":["3","4"],"u.K":"3","u.V":"4"},"bC":{"x":[]},"i":{"e":["1"]},"D":{"i":["1"],"e":["1"]},"c_":{"D":["1"],"i":["1"],"e":["1"],"D.E":"1","e.E":"1"},"aQ":{"G":["1"]},"af":{"e":["2"],"e.E":"2"},"bu":{"af":["1","2"],"i":["2"],"e":["2"],"e.E":"2"},"bG":{"G":["2"]},"L":{"D":["2"],"i":["2"],"e":["2"],"D.E":"2","e.E":"2"},"v":{"e":["1"],"e.E":"1"},"c2":{"G":["1"]},"bw":{"e":["+(b,1)"],"e.E":"+(b,1)"},"bt":{"bw":["1"],"i":["+(b,1)"],"e":["+(b,1)"],"e.E":"+(b,1)"},"a_":{"G":["+(b,1)"]},"bV":{"D":["1"],"i":["1"],"e":["1"],"D.E":"1","e.E":"1"},"au":{"bk":[],"aG":[]},"c5":{"G":["1"]},"bs":{"aD":["1"],"i":["1"],"e":["1"]},"aM":{"bs":["1"],"aD":["1"],"i":["1"],"e":["1"]},"bO":{"x":[]},"cx":{"x":[]},"cP":{"x":[]},"ay":{"aL":[]},"cl":{"aL":[]},"cm":{"aL":[]},"cN":{"aL":[]},"cM":{"aL":[]},"b4":{"aL":[]},"cK":{"x":[]},"an":{"u":["1","2"],"f1":["1","2"],"ae":["1","2"],"u.K":"1","u.V":"2"},"aP":{"i":["1"],"e":["1"],"e.E":"1"},"bF":{"G":["1"]},"bD":{"i":["N<1,2>"],"e":["N<1,2>"],"e.E":"N<1,2>"},"bE":{"G":["N<1,2>"]},"bA":{"an":["1","2"],"u":["1","2"],"f1":["1","2"],"ae":["1","2"],"u.K":"1","u.V":"2"},"bk":{"aG":[]},"aR":{"C":[],"t":[]},"bK":{"C":[]},"cz":{"C":[],"t":[]},"ba":{"a0":["1"],"C":[]},"bI":{"z":["q"],"m":["q"],"a0":["q"],"i":["q"],"C":[],"e":["q"],"S":["q"]},"bJ":{"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"]},"cA":{"z":["q"],"m":["q"],"a0":["q"],"i":["q"],"C":[],"e":["q"],"S":["q"],"t":[],"z.E":"q"},"cB":{"z":["q"],"m":["q"],"a0":["q"],"i":["q"],"C":[],"e":["q"],"S":["q"],"t":[],"z.E":"q"},"cC":{"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"],"t":[],"z.E":"b"},"cD":{"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"],"t":[],"z.E":"b"},"cE":{"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"],"t":[],"z.E":"b"},"cF":{"f9":[],"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"],"t":[],"z.E":"b"},"cG":{"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"],"t":[],"z.E":"b"},"bL":{"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"],"t":[],"z.E":"b"},"bM":{"z":["b"],"m":["b"],"a0":["b"],"i":["b"],"C":[],"e":["b"],"S":["b"],"t":[],"z.E":"b"},"cR":{"x":[]},"cb":{"x":[]},"a1":{"G":["1"]},"aY":{"e":["1"],"e.E":"1"},"aV":{"aD":["1"],"i":["1"],"e":["1"]},"aW":{"G":["1"]},"u":{"ae":["1","2"]},"aD":{"i":["1"],"e":["1"]},"ca":{"aD":["1"],"i":["1"],"e":["1"]},"cT":{"u":["n","@"],"ae":["n","@"],"u.K":"n","u.V":"@"},"cU":{"D":["n"],"i":["n"],"e":["n"],"D.E":"n","e.E":"n"},"bB":{"x":[]},"cy":{"x":[]},"fF":{"a4":["fF"]},"q":{"Z":[],"a4":["Z"]},"b":{"Z":[],"a4":["Z"]},"m":{"i":["1"],"e":["1"]},"Z":{"a4":["Z"]},"n":{"a4":["n"],"fT":[]},"E":{"a4":["fF"]},"cj":{"x":[]},"c0":{"x":[]},"ab":{"x":[]},"bT":{"x":[]},"cr":{"x":[]},"c1":{"x":[]},"cO":{"x":[]},"bZ":{"x":[]},"co":{"x":[]},"bY":{"x":[]},"cs":{"x":[]},"bf":{"iO":[]},"is":{"m":["b"],"i":["b"],"e":["b"]},"iX":{"m":["b"],"i":["b"],"e":["b"]},"iW":{"m":["b"],"i":["b"],"e":["b"]},"iq":{"m":["b"],"i":["b"],"e":["b"]},"f9":{"m":["b"],"i":["b"],"e":["b"]},"ir":{"m":["b"],"i":["b"],"e":["b"]},"iV":{"m":["b"],"i":["b"],"e":["b"]},"io":{"m":["q"],"i":["q"],"e":["q"]},"ip":{"m":["q"],"i":["q"],"e":["q"]}}'))
A.jf(v.typeUniverse,JSON.parse('{"ba":1,"ca":1,"cn":2,"cp":2}'))
var u=(function rtii(){var t=A.ch
return{B:t("a4<@>"),L:t("ac"),R:t("i<@>"),C:t("x"),G:t("K"),Z:t("aL"),bi:t("e<@>"),cL:t("k<b5>"),V:t("k<ac>"),v:t("k<K>"),a:t("k<m<aC>>"),h:t("k<m<aS>>"),J:t("k<ae<n,p>>"),Y:t("k<ae<n,@>>"),d:t("k<ae<n,p?>>"),c:t("k<aq>"),cw:t("k<ar>"),bD:t("k<aC>"),b_:t("k<bQ>"),cY:t("k<aS>"),aj:t("k<bb>"),ch:t("k<T>"),E:t("k<as>"),c0:t("k<U>"),s:t("k<n>"),p:t("k<I>"),U:t("k<V>"),a6:t("k<aT>"),e:t("k<f>"),l:t("k<M>"),bx:t("k<j>"),b:t("k<@>"),t:t("k<b>"),u:t("by"),m:t("C"),M:t("am"),da:t("a0<@>"),j:t("m<@>"),H:t("m<b>"),cg:t("ae<n,@>"),f:t("ae<@,@>"),a3:t("L<f,f>"),c9:t("L<f,M>"),k:t("aq"),P:t("bN"),K:t("p"),O:t("ar"),x:t("aC"),d1:t("aS"),_:t("T"),c1:t("ln"),F:t("+()"),bd:t("bV<n>"),q:t("U"),N:t("n"),o:t("I"),bW:t("t"),T:t("V"),r:t("aT"),cr:t("bh"),W:t("f"),g:t("M"),A:t("M(f)"),bJ:t("f(f)"),aZ:t("E"),D:t("aY<m<I>>"),y:t("j"),i:t("q"),z:t("@"),S:t("b"),bc:t("fL<bN>?"),aQ:t("C?"),bG:t("m<T>?"),Q:t("m<@>?"),X:t("p?"),aD:t("n?"),w:t("cV?"),cG:t("j?"),dd:t("q?"),I:t("b?"),ae:t("Z?"),n:t("Z"),cQ:t("~(n,@)")}})();(function constants(){var t=hunkHelpers.makeConstList
B.ay=J.ct.prototype
B.a=J.k.prototype
B.b=J.bx.prototype
B.e=J.b7.prototype
B.p=J.aO.prototype
B.az=J.am.prototype
B.aA=J.bz.prototype
B.aV=A.bM.prototype
B.a3=J.cI.prototype
B.N=J.bh.prototype
B.aD=new A.ao("\uc0bc\ubc30\ub9cc",4,"sanbaiman")
B.a7=new A.ax(6000,B.aD)
B.aH=new A.ao("\ubc30\ub9cc",3,"baiman")
B.a8=new A.ax(4000,B.aH)
B.aG=new A.ao("\ub9cc\uad00",1,"mangan")
B.Q=new A.ax(2000,B.aG)
B.aF=new A.ao("\ud558\ub124\ub9cc",2,"haneman")
B.a9=new A.ax(3000,B.aF)
B.aE=new A.ao("\ud5e4\uc544\ub9bc \uc5ed\ub9cc",5,"kazoeYakuman")
B.aa=new A.ax(8000,B.aE)
B.E=new A.cs()
B.R=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.ab=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof HTMLElement == "function";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
B.ag=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var userAgent = navigator.userAgent;
    if (typeof userAgent != "string") return hooks;
    if (userAgent.indexOf("DumpRenderTree") >= 0) return hooks;
    if (userAgent.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
B.ac=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.af=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
B.ae=function(hooks) {
  if (typeof navigator != "object") return hooks;
  var userAgent = navigator.userAgent;
  if (typeof userAgent != "string") return hooks;
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
B.ad=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
B.S=function(hooks) { return hooks; }

B.h=new A.d9()
B.ah=new A.dw()
B.o=new A.dx()
B.F=new A.dz()
B.H=new A.bv(2,"kokushi")
B.Y=t([],u.p)
B.D=new A.aU(4,"tanki")
B.ai=new A.b5(B.H,B.Y,-1,B.D)
B.aj=new A.b6("\ud328\ubcf4 JSON \uc774 \uac1d\uccb4\uac00 \uc544\ub2d9\ub2c8\ub2e4")
B.ak=new A.b6("\ud328\ubcf4 JSON \uae00\uc744 \ub118\uae30\uc138\uc694")
B.al=new A.b6("\ubc84\ub9bc\uc5d0 \ud328\uac00 \uc5c6\uc2b5\ub2c8\ub2e4")
B.ao=new A.K("\ub2e8\uae30 \ub300\uae30",2)
B.T=new A.K("\uba58\uc820 \ub860",10)
B.ap=new A.K("\ucbd4\ubaa8",2)
B.aq=new A.K("\uc6b8\uace0 \ud551\ud6c4\ud615 \ubcf4\uc815",10)
B.ar=new A.K("\ubcc0\uc9f1 \ub300\uae30",2)
B.U=new A.K("\uae30\ubcf8",20)
B.at=new A.K("\uac04\uc9f1 \ub300\uae30",2)
B.as=new A.K("\uce58\ub610\uc774\ucbd4",25)
B.aI=t([B.as],u.v)
B.au=new A.aA(25,B.aI)
B.an=new A.K("\uc5ed\ub9cc",0)
B.aL=t([B.an],u.v)
B.av=new A.aA(0,B.aL)
B.am=new A.K("\ud551\ud6c4 \ucbd4\ubaa8",20)
B.aR=t([B.am],u.v)
B.aw=new A.aA(20,B.aR)
B.aM=t([B.U,B.T],u.v)
B.ax=new A.aA(30,B.aM)
B.W=new A.bv(0,"standard")
B.G=new A.bv(1,"chiitoitsu")
B.aB=new A.da(null)
B.aC=new A.db(null)
B.r=new A.ao("\uc5ed\ub9cc",6,"yakuman")
B.x=new A.ao("",0,"none")
B.c=t(["1\ub9cc","2\ub9cc","3\ub9cc","4\ub9cc","5\ub9cc","6\ub9cc","7\ub9cc","8\ub9cc","9\ub9cc","1\ud1b5","2\ud1b5","3\ud1b5","4\ud1b5","5\ud1b5","6\ud1b5","7\ud1b5","8\ud1b5","9\ud1b5","1\uc0ad","2\uc0ad","3\uc0ad","4\uc0ad","5\uc0ad","6\uc0ad","7\uc0ad","8\uc0ad","9\uc0ad","\ub3d9","\ub0a8","\uc11c","\ubd81","\ubc31","\ubc1c","\uc911"],u.s)
B.t=new A.as(0,"best")
B.a4=new A.as(1,"good")
B.B=new A.as(2,"inaccuracy")
B.C=new A.as(3,"mistake")
B.k=new A.as(4,"blunder")
B.aJ=t([B.t,B.a4,B.B,B.C,B.k],u.E)
B.aK=t([B.k,B.C,B.B],u.E)
B.X=t([0,8,9,17,18,26,27,28,29,30,31,32,33],u.t)
B.I=t(["bottom","right","top","left"],u.s)
B.Z=t([],u.V)
B.aN=t([],u.c)
B.aO=t([],u.s)
B.j=t([],u.t)
B.y=t([],u.b)
B.aQ=t([2,3,4,6,8],u.t)
B.J=t(["m","p","s","z"],u.s)
B.a0=t([3,1,1,1,1,1,1,1,3],u.t)
B.aS=t(["\ub3d9","\ub0a8","\uc11c","\ubd81"],u.s)
B.aT=new A.bH(0,"chi")
B.aU=new A.bH(1,"pon")
B.a1=new A.bH(2,"kan")
B.z=new A.bP(0,"draw")
B.i=new A.bP(1,"discard")
B.A=new A.bP(2,"call")
B.aW=new A.bS(0,"push")
B.aX=new A.bS(1,"fold")
B.aY=new A.bS(2,"between")
B.aZ=new A.bW(0,"start")
B.K=new A.bW(1,"riichi")
B.b_=new A.bW(2,"end")
B.d=new A.a6(0,"graded")
B.u=new A.a6(1,"forced")
B.l=new A.a6(2,"defense")
B.q=new A.a6(3,"complete")
B.L=new A.a6(4,"unknownHand")
B.m=new A.a6(5,"inconsistent")
B.M=new A.a6(6,"guessed")
B.a_=t([],u.l)
B.aP=t([],u.v)
B.V=new A.aA(0,B.aP)
B.a2=new A.bc(0,0,0,0,0)
B.b0=new A.bd("\ud654\ub8cc \ud615\ud0dc\uac00 \uc544\ub2d9\ub2c8\ub2e4",B.a_,0,B.V,B.x,0,B.a2,null)
B.b1=new A.bd("\uc5ed\uc774 \uc5c6\uc2b5\ub2c8\ub2e4",B.a_,0,B.V,B.x,0,B.a2,null)
B.v=new A.be(0,"sequence")
B.n=new A.be(1,"triplet")
B.f=new A.be(2,"kan")
B.w=new A.be(3,"pair")
B.b2=new A.aM([B.B,B.C,B.k],A.ch("aM<as>"))
B.b3=new A.aM([B.d,B.u,B.l,B.q],A.ch("aM<a6>"))
B.b4=A.ah("li")
B.b5=A.ah("lj")
B.b6=A.ah("io")
B.b7=A.ah("ip")
B.b8=A.ah("iq")
B.b9=A.ah("ir")
B.ba=A.ah("is")
B.bb=A.ah("p")
B.bc=A.ah("f9")
B.bd=A.ah("iV")
B.be=A.ah("iW")
B.bf=A.ah("iX")
B.O=new A.aU(0,"ryanmen")
B.bg=new A.aU(1,"kanchan")
B.a5=new A.aU(2,"penchan")
B.P=new A.aU(3,"shanpon")
B.bh=new A.f("\uc911",1,1,0,11,"chun")
B.bi=new A.f("\ud63c\uc77c\uc0c9",3,2,0,26,"honitsu")
B.bj=new A.f("\uc77c\ubc1c",1,0,0,2,"ippatsu")
B.a6=new A.f("\ud551\ud6c4",1,0,0,4,"pinfu")
B.bk=new A.f("\uccad\uc77c\uc0c9",6,5,0,29,"chinitsu")
B.bl=new A.f("\uc0bc\uc0c9\ub3d9\uac01",2,2,0,19,"sanshokuDoukou")
B.bm=new A.f("\ub4b7\ub3c4\ub77c",1,1,0,32,"uraDora")
B.bn=new A.f("\ud574\uc800\ub85c\uc6d4",1,1,0,12,"haitei")
B.bo=new A.f("\uc0b0\uae61\ucbd4",2,2,0,22,"sankantsu")
B.bp=new A.f("\ub354\ube14 \ub9ac\uce58",2,0,0,1,"doubleRiichi")
B.bq=new A.f("\ucc2c\ud0c0",2,1,0,16,"chanta")
B.br=new A.f("\uc21c\uc815 \uad6c\ub828\ubcf4\ub4f1",26,0,2,44,"chuuren9")
B.bs=new A.f("\uad6d\uc0ac\ubb34\uc30d",13,0,1,33,"kokushi")
B.bt=new A.f("\uc0bc\uc0c9\ub3d9\uc21c",2,1,0,18,"sanshokuDoujun")
B.bu=new A.f("\ub7c9\ud398\ucf54",3,0,0,28,"ryanpeikou")
B.bv=new A.f("\uc900\ucc2c\ud0c0",3,2,0,27,"junchan")
B.bw=new A.f("\ub9ac\uce58",1,0,0,0,"riichi")
B.bx=new A.f("\uad6d\uc0ac\ubb34\uc30d 13\uba74 \ub300\uae30",26,0,2,34,"kokushi13")
B.by=new A.f("\uad6c\ub828\ubcf4\ub4f1",13,0,1,43,"chuuren")
B.bz=new A.f("\uc0ac\uae61\ucbd4",13,13,1,45,"suukantsu")
B.bA=new A.f("\ud558\uc800\ub85c\uc5b4",1,1,0,13,"houtei")
B.bB=new A.f("\uccad\ub178\ub450",13,13,1,41,"chinroutou")
B.bC=new A.f("\uc0b0\uc548\ucee4",2,2,0,21,"sanankou")
B.bD=new A.f("\uc77c\uae30\ud1b5\uad00",2,1,0,17,"ittsu")
B.bE=new A.f("\uc0ac\uc554\uac01 \ub2e8\uae30 \ub300\uae30",26,0,2,36,"suuankouTanki")
B.bF=new A.f("\ubc1c",1,1,0,10,"hatsu")
B.bG=new A.f("\uc7a5\ud48d\ud328",1,1,0,8,"roundWind")
B.bH=new A.f("\uc801\ub3c4\ub77c",1,1,0,31,"akaDora")
B.bI=new A.f("\uc790\uc77c\uc0c9",13,13,1,40,"tsuuiisou")
B.bJ=new A.f("\uc18c\uc0ac\ud76c",13,13,1,38,"shousuushi")
B.bK=new A.f("\ub179\uc77c\uc0c9",13,13,1,42,"ryuuiisou")
B.bL=new A.f("\uc601\uc0c1\uac1c\ud654",1,1,0,14,"rinshan")
B.bM=new A.f("\uc9c0\ud654",13,0,1,47,"chiihou")
B.bN=new A.f("\ub610\uc774\ub610\uc774",2,2,0,20,"toitoi")
B.bO=new A.f("\ub3c4\ub77c",1,1,0,30,"dora")
B.bP=new A.f("\uc774\ud398\ucf54",1,0,0,6,"iipeikou")
B.bQ=new A.f("\uc18c\uc0bc\uc6d0",2,2,0,25,"shousangen")
B.bR=new A.f("\ubc31",1,1,0,9,"haku")
B.bS=new A.f("\ud0d5\uc57c\uc624",1,1,0,5,"tanyao")
B.bT=new A.f("\ub300\uc0ac\ud76c",26,26,2,39,"daisuushi")
B.bU=new A.f("\ud63c\ub178\ub450",2,2,0,24,"honroutou")
B.bV=new A.f("\uba58\uc820 \ucbd4\ubaa8",1,0,0,3,"menzenTsumo")
B.bW=new A.f("\uce58\ub610\uc774\ucbd4",2,0,0,23,"chiitoitsu")
B.bX=new A.f("\uc0ac\uc554\uac01",13,0,1,35,"suuankou")
B.bY=new A.f("\ucc9c\ud654",13,0,1,46,"tenhou")
B.bZ=new A.f("\ucc3d\uae61",1,1,0,15,"chankan")
B.c_=new A.f("\ub300\uc0bc\uc6d0",13,13,1,37,"daisangen")
B.c0=new A.f("\uc790\ud48d\ud328",1,1,0,7,"seatWind")})();(function staticFields(){$.dO=null
$.a3=A.c([],A.ch("k<p>"))
$.fU=null
$.fI=null
$.fH=null
$.hI=null
$.hD=null
$.hL=null
$.ez=null
$.eF=null
$.ft=null
$.dS=A.c([],A.ch("k<m<p>?>"))
$.h3=null
$.h4=null
$.h5=null
$.h6=null
$.fa=A.dL("_lastQuoRemDigits")
$.fb=A.dL("_lastQuoRemUsed")
$.c3=A.dL("_lastRemUsed")
$.fc=A.dL("_lastRem_nsh")
$.k0=A.ap(u.S,u.H)
$.jH=A.ap(u.S,u.H)})();(function lazyInitializers(){var t=hunkHelpers.lazyFinal
t($,"ll","hU",()=>A.eA("_$dart_dartClosure"))
t($,"lk","fz",()=>A.eA("_$dart_dartClosure_dartJSInterop"))
t($,"lG","i7",()=>A.c([new J.cu()],A.ch("k<bX>")))
t($,"lo","hV",()=>A.at(A.dD({
toString:function(){return"$receiver$"}})))
t($,"lp","hW",()=>A.at(A.dD({$method$:null,
toString:function(){return"$receiver$"}})))
t($,"lq","hX",()=>A.at(A.dD(null)))
t($,"lr","hY",()=>A.at(function(){var $argumentsExpr$="$arguments$"
try{null.$method$($argumentsExpr$)}catch(s){return s.message}}()))
t($,"lu","i0",()=>A.at(A.dD(void 0)))
t($,"lv","i1",()=>A.at(function(){var $argumentsExpr$="$arguments$"
try{(void 0).$method$($argumentsExpr$)}catch(s){return s.message}}()))
t($,"lt","i_",()=>A.at(A.h1(null)))
t($,"ls","hZ",()=>A.at(function(){try{null.$method$}catch(s){return s.message}}()))
t($,"lx","i3",()=>A.at(A.h1(void 0)))
t($,"lw","i2",()=>A.at(function(){try{(void 0).$method$}catch(s){return s.message}}()))
t($,"lE","i6",()=>A.iE(0))
t($,"lD","a9",()=>A.cQ(0))
t($,"lB","aj",()=>A.cQ(1))
t($,"lC","fB",()=>A.cQ(2))
t($,"lA","fA",()=>$.aj().N(0))
t($,"ly","i4",()=>A.cQ(1e4))
t($,"lz","i5",()=>new Uint8Array(A.jt(8)))
t($,"lF","eV",()=>A.fw(B.bb))})();(function nativeSupport(){!function(){var t=function(a){var n={}
n[a]=1
return Object.keys(hunkHelpers.convertToFastObject(n))[0]}
v.getIsolateTag=function(a){return t("___dart_"+a+v.isolateTag)}
var s="___dart_isolate_tags_"
var r=Object[s]||(Object[s]=Object.create(null))
var q="_ZxYxX"
for(var p=0;;p++){var o=t(q+"_"+p+"_")
if(!(o in r)){r[o]=1
v.isolateTag=o
break}}v.dispatchPropertyName=v.getIsolateTag("dispatch_record")}()
hunkHelpers.setOrUpdateInterceptorsByTag({ArrayBuffer:A.aR,SharedArrayBuffer:A.aR,ArrayBufferView:A.bK,DataView:A.cz,Float32Array:A.cA,Float64Array:A.cB,Int16Array:A.cC,Int32Array:A.cD,Int8Array:A.cE,Uint16Array:A.cF,Uint32Array:A.cG,Uint8ClampedArray:A.bL,CanvasPixelArray:A.bL,Uint8Array:A.bM})
hunkHelpers.setOrUpdateLeafTags({ArrayBuffer:true,SharedArrayBuffer:true,ArrayBufferView:false,DataView:true,Float32Array:true,Float64Array:true,Int16Array:true,Int32Array:true,Int8Array:true,Uint16Array:true,Uint32Array:true,Uint8ClampedArray:true,CanvasPixelArray:true,Uint8Array:false})
A.ba.$nativeSuperclassTag="ArrayBufferView"
A.c6.$nativeSuperclassTag="ArrayBufferView"
A.c7.$nativeSuperclassTag="ArrayBufferView"
A.bI.$nativeSuperclassTag="ArrayBufferView"
A.c8.$nativeSuperclassTag="ArrayBufferView"
A.c9.$nativeSuperclassTag="ArrayBufferView"
A.bJ.$nativeSuperclassTag="ArrayBufferView"})()
Function.prototype.$0=function(){return this()}
Function.prototype.$1=function(a){return this(a)}
Function.prototype.$2=function(a,b){return this(a,b)}
Function.prototype.$3=function(a,b,c){return this(a,b,c)}
Function.prototype.$4=function(a,b,c,d){return this(a,b,c,d)}
Function.prototype.$2$0=function(){return this()}
Function.prototype.$1$1=function(a){return this(a)}
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var t=document.scripts
function onLoad(b){for(var r=0;r<t.length;++r){t[r].removeEventListener("load",onLoad,false)}a(b.target)}for(var s=0;s<t.length;++s){t[s].addEventListener("load",onLoad,false)}})(function(a){v.currentScript=a
var t=A.kT
if(typeof dartMainRunner==="function"){dartMainRunner(t,[])}else{t([])}})})()
//# sourceMappingURL=mj_engine.js.map
