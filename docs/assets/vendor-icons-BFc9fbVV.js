import{a as Nt,r as Da}from"./vendor-react-raKv_udW.js";import"./vendor-mui-C38_mOQ1.js";/*!
 * Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2026 Fonticons, Inc.
 */function Ie(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,n=Array(t);a<t;a++)n[a]=e[a];return n}function Wa(e){if(Array.isArray(e))return e}function Ua(e){if(Array.isArray(e))return Ie(e)}function Ya(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Ha(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,Lt(n.key),n)}}function Ga(e,t,a){return t&&Ha(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function oe(e,t){var a=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=De(e))||t){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,o=!0,s=!1;return{s:function(){a=a.call(e)},n:function(){var l=a.next();return o=l.done,l},e:function(l){s=!0,i=l},f:function(){try{o||a.return==null||a.return()}finally{if(s)throw i}}}}function h(e,t,a){return(t=Lt(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Xa(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Ba(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var n,r,i,o,s=[],l=!0,u=!1;try{if(i=(a=a.call(e)).next,t===0){if(Object(a)!==a)return;l=!1}else for(;!(l=(n=i.call(a)).done)&&(s.push(n.value),s.length!==t);l=!0);}catch(c){u=!0,r=c}finally{try{if(!l&&a.return!=null&&(o=a.return(),Object(o)!==o))return}finally{if(u)throw r}}return s}}function Va(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ka(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Qe(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),a.push.apply(a,n)}return a}function f(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?Qe(Object(a),!0).forEach(function(n){h(e,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Qe(Object(a)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))})}return e}function de(e,t){return Wa(e)||Ba(e,t)||De(e,t)||Va()}function F(e){return Ua(e)||Xa(e)||De(e)||Ka()}function Ja(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var n=a.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Lt(e){var t=Ja(e,"string");return typeof t=="symbol"?t:t+""}function fe(e){"@babel/helpers - typeof";return fe=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},fe(e)}function De(e,t){if(e){if(typeof e=="string")return Ie(e,t);var a={}.toString.call(e).slice(8,-1);return a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set"?Array.from(e):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?Ie(e,t):void 0}}var Ze=function(){},We={},Tt={},_t=null,jt={mark:Ze,measure:Ze};try{typeof window<"u"&&(We=window),typeof document<"u"&&(Tt=document),typeof MutationObserver<"u"&&(_t=MutationObserver),typeof performance<"u"&&(jt=performance)}catch{}var qa=We.navigator||{},et=qa.userAgent,tt=et===void 0?"":et,M=We,x=Tt,at=_t,re=jt;M.document;var j=!!x.documentElement&&!!x.head&&typeof x.addEventListener=="function"&&typeof x.createElement=="function",Mt=~tt.indexOf("MSIE")||~tt.indexOf("Trident/"),be,Qa=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Za=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,zt={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},en={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},$t=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],I="classic",ee="duotone",Rt="sharp",Dt="sharp-duotone",Wt="chisel",Ut="etch",Yt="graphite",Ht="jelly",Gt="jelly-duo",Xt="jelly-fill",Bt="notdog",Vt="notdog-duo",Kt="slab",Jt="slab-press",qt="thumbprint",Qt="utility",Zt="utility-duo",ea="utility-fill",ta="whiteboard",tn="Classic",an="Duotone",nn="Sharp",rn="Sharp Duotone",on="Chisel",sn="Etch",ln="Graphite",fn="Jelly",un="Jelly Duo",cn="Jelly Fill",dn="Notdog",mn="Notdog Duo",vn="Slab",hn="Slab Press",pn="Thumbprint",gn="Utility",bn="Utility Duo",yn="Utility Fill",xn="Whiteboard",aa=[I,ee,Rt,Dt,Wt,Ut,Yt,Ht,Gt,Xt,Bt,Vt,Kt,Jt,qt,Qt,Zt,ea,ta];be={},h(h(h(h(h(h(h(h(h(h(be,I,tn),ee,an),Rt,nn),Dt,rn),Wt,on),Ut,sn),Yt,ln),Ht,fn),Gt,un),Xt,cn),h(h(h(h(h(h(h(h(h(be,Bt,dn),Vt,mn),Kt,vn),Jt,hn),qt,pn),Qt,gn),Zt,bn),ea,yn),ta,xn);var Sn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},wn={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},An=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),kn={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},na=["fak","fa-kit","fakd","fa-kit-duotone"],nt={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},In=["kit"],Pn="kit",En="kit-duotone",Fn="Kit",Cn="Kit Duotone";h(h({},Pn,Fn),En,Cn);var On={kit:{"fa-kit":"fak"}},Nn={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Ln={kit:{fak:"fa-kit"}},rt={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},ye,ie={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Tn=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],_n="classic",jn="duotone",Mn="sharp",zn="sharp-duotone",$n="chisel",Rn="etch",Dn="graphite",Wn="jelly",Un="jelly-duo",Yn="jelly-fill",Hn="notdog",Gn="notdog-duo",Xn="slab",Bn="slab-press",Vn="thumbprint",Kn="utility",Jn="utility-duo",qn="utility-fill",Qn="whiteboard",Zn="Classic",er="Duotone",tr="Sharp",ar="Sharp Duotone",nr="Chisel",rr="Etch",ir="Graphite",or="Jelly",sr="Jelly Duo",lr="Jelly Fill",fr="Notdog",ur="Notdog Duo",cr="Slab",dr="Slab Press",mr="Thumbprint",vr="Utility",hr="Utility Duo",pr="Utility Fill",gr="Whiteboard";ye={},h(h(h(h(h(h(h(h(h(h(ye,_n,Zn),jn,er),Mn,tr),zn,ar),$n,nr),Rn,rr),Dn,ir),Wn,or),Un,sr),Yn,lr),h(h(h(h(h(h(h(h(h(ye,Hn,fr),Gn,ur),Xn,cr),Bn,dr),Vn,mr),Kn,vr),Jn,hr),qn,pr),Qn,gr);var br="kit",yr="kit-duotone",xr="Kit",Sr="Kit Duotone";h(h({},br,xr),yr,Sr);var wr={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},Ar={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Pe={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},kr=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],ra=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(Tn,kr),Ir=["solid","regular","light","thin","duotone","brands","semibold"],ia=[1,2,3,4,5,6,7,8,9,10],Pr=ia.concat([11,12,13,14,15,16,17,18,19,20]),Er=["aw","fw","pull-left","pull-right"],Fr=[].concat(F(Object.keys(Ar)),Ir,Er,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",ie.GROUP,ie.SWAP_OPACITY,ie.PRIMARY,ie.SECONDARY]).concat(ia.map(function(e){return"".concat(e,"x")})).concat(Pr.map(function(e){return"w-".concat(e)})),Cr={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},T="___FONT_AWESOME___",Ee=16,oa="fa",sa="svg-inline--fa",D="data-fa-i2svg",Fe="data-fa-pseudo-element",Or="data-fa-pseudo-element-pending",Ue="data-prefix",Ye="data-icon",it="fontawesome-i2svg",Nr="async",Lr=["HTML","HEAD","STYLE","SCRIPT"],la=["::before","::after",":before",":after"],fa=function(){try{return!0}catch{return!1}}();function te(e){return new Proxy(e,{get:function(a,n){return n in a?a[n]:a[I]}})}var ua=f({},zt);ua[I]=f(f(f(f({},{"fa-duotone":"duotone"}),zt[I]),nt.kit),nt["kit-duotone"]);var Tr=te(ua),Ce=f({},kn);Ce[I]=f(f(f(f({},{duotone:"fad"}),Ce[I]),rt.kit),rt["kit-duotone"]);var ot=te(Ce),Oe=f({},Pe);Oe[I]=f(f({},Oe[I]),Ln.kit);var He=te(Oe),Ne=f({},wr);Ne[I]=f(f({},Ne[I]),On.kit);te(Ne);var _r=Qa,ca="fa-layers-text",jr=Za,Mr=f({},Sn);te(Mr);var zr=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],xe=en,$r=[].concat(F(In),F(Fr)),K=M.FontAwesomeConfig||{};function Rr(e){var t=x.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function Dr(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(x&&typeof x.querySelector=="function"){var Wr=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];Wr.forEach(function(e){var t=de(e,2),a=t[0],n=t[1],r=Dr(Rr(a));r!=null&&(K[n]=r)})}var da={styleDefault:"solid",familyDefault:I,cssPrefix:oa,replacementClass:sa,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};K.familyPrefix&&(K.cssPrefix=K.familyPrefix);var X=f(f({},da),K);X.autoReplaceSvg||(X.observeMutations=!1);var m={};Object.keys(da).forEach(function(e){Object.defineProperty(m,e,{enumerable:!0,set:function(a){X[e]=a,J.forEach(function(n){return n(m)})},get:function(){return X[e]}})});Object.defineProperty(m,"familyPrefix",{enumerable:!0,set:function(t){X.cssPrefix=t,J.forEach(function(a){return a(m)})},get:function(){return X.cssPrefix}});M.FontAwesomeConfig=m;var J=[];function Ur(e){return J.push(e),function(){J.splice(J.indexOf(e),1)}}var U=Ee,C={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Yr(e){if(!(!e||!j)){var t=x.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var a=x.head.childNodes,n=null,r=a.length-1;r>-1;r--){var i=a[r],o=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(n=i)}return x.head.insertBefore(t,n),e}}var Hr="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function st(){for(var e=12,t="";e-- >0;)t+=Hr[Math.random()*62|0];return t}function B(e){for(var t=[],a=(e||[]).length>>>0;a--;)t[a]=e[a];return t}function Ge(e){return e.classList?B(e.classList):(e.getAttribute("class")||"").split(" ").filter(function(t){return t})}function ma(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Gr(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,'="').concat(ma(e[a]),'" ')},"").trim()}function me(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,": ").concat(e[a].trim(),";")},"")}function Xe(e){return e.size!==C.size||e.x!==C.x||e.y!==C.y||e.rotate!==C.rotate||e.flipX||e.flipY}function Xr(e){var t=e.transform,a=e.containerWidth,n=e.iconWidth,r={transform:"translate(".concat(a/2," 256)")},i="translate(".concat(t.x*32,", ").concat(t.y*32,") "),o="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),s="rotate(".concat(t.rotate," 0 0)"),l={transform:"".concat(i," ").concat(o," ").concat(s)},u={transform:"translate(".concat(n/2*-1," -256)")};return{outer:r,inner:l,path:u}}function Br(e){var t=e.transform,a=e.width,n=a===void 0?Ee:a,r=e.height,i=r===void 0?Ee:r,o="";return Mt?o+="translate(".concat(t.x/U-n/2,"em, ").concat(t.y/U-i/2,"em) "):o+="translate(calc(-50% + ".concat(t.x/U,"em), calc(-50% + ").concat(t.y/U,"em)) "),o+="scale(".concat(t.size/U*(t.flipX?-1:1),", ").concat(t.size/U*(t.flipY?-1:1),") "),o+="rotate(".concat(t.rotate,"deg) "),o}var Vr=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function va(){var e=oa,t=sa,a=m.cssPrefix,n=m.replacementClass,r=Vr;if(a!==e||n!==t){var i=new RegExp("\\.".concat(e,"\\-"),"g"),o=new RegExp("\\--".concat(e,"\\-"),"g"),s=new RegExp("\\.".concat(t),"g");r=r.replace(i,".".concat(a,"-")).replace(o,"--".concat(a,"-")).replace(s,".".concat(n))}return r}var lt=!1;function Se(){m.autoAddCss&&!lt&&(Yr(va()),lt=!0)}var Kr={mixout:function(){return{dom:{css:va,insertCss:Se}}},hooks:function(){return{beforeDOMElementCreation:function(){Se()},beforeI2svg:function(){Se()}}}},_=M||{};_[T]||(_[T]={});_[T].styles||(_[T].styles={});_[T].hooks||(_[T].hooks={});_[T].shims||(_[T].shims=[]);var E=_[T],ha=[],pa=function(){x.removeEventListener("DOMContentLoaded",pa),ue=1,ha.map(function(t){return t()})},ue=!1;j&&(ue=(x.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(x.readyState),ue||x.addEventListener("DOMContentLoaded",pa));function Jr(e){j&&(ue?setTimeout(e,0):ha.push(e))}function ae(e){var t=e.tag,a=e.attributes,n=a===void 0?{}:a,r=e.children,i=r===void 0?[]:r;return typeof e=="string"?ma(e):"<".concat(t," ").concat(Gr(n),">").concat(i.map(ae).join(""),"</").concat(t,">")}function ft(e,t,a){if(e&&e[t]&&e[t][a])return{prefix:t,iconName:a,icon:e[t][a]}}var we=function(t,a,n,r){var i=Object.keys(t),o=i.length,s=a,l,u,c;for(n===void 0?(l=1,c=t[i[0]]):(l=0,c=n);l<o;l++)u=i[l],c=s(c,t[u],u,t);return c};function ga(e){return F(e).length!==1?null:e.codePointAt(0).toString(16)}function ut(e){return Object.keys(e).reduce(function(t,a){var n=e[a],r=!!n.icon;return r?t[n.iconName]=n.icon:t[a]=n,t},{})}function Le(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=a.skipHooks,r=n===void 0?!1:n,i=ut(t);typeof E.hooks.addPack=="function"&&!r?E.hooks.addPack(e,ut(t)):E.styles[e]=f(f({},E.styles[e]||{}),i),e==="fas"&&Le("fa",t)}var Q=E.styles,qr=E.shims,ba=Object.keys(He),Qr=ba.reduce(function(e,t){return e[t]=Object.keys(He[t]),e},{}),Be=null,ya={},xa={},Sa={},wa={},Aa={};function Zr(e){return~$r.indexOf(e)}function ei(e,t){var a=t.split("-"),n=a[0],r=a.slice(1).join("-");return n===e&&r!==""&&!Zr(r)?r:null}var ka=function(){var t=function(i){return we(Q,function(o,s,l){return o[l]=we(s,i,{}),o},{})};ya=t(function(r,i,o){if(i[3]&&(r[i[3]]=o),i[2]){var s=i[2].filter(function(l){return typeof l=="number"});s.forEach(function(l){r[l.toString(16)]=o})}return r}),xa=t(function(r,i,o){if(r[o]=o,i[2]){var s=i[2].filter(function(l){return typeof l=="string"});s.forEach(function(l){r[l]=o})}return r}),Aa=t(function(r,i,o){var s=i[2];return r[o]=o,s.forEach(function(l){r[l]=o}),r});var a="far"in Q||m.autoFetchSvg,n=we(qr,function(r,i){var o=i[0],s=i[1],l=i[2];return s==="far"&&!a&&(s="fas"),typeof o=="string"&&(r.names[o]={prefix:s,iconName:l}),typeof o=="number"&&(r.unicodes[o.toString(16)]={prefix:s,iconName:l}),r},{names:{},unicodes:{}});Sa=n.names,wa=n.unicodes,Be=ve(m.styleDefault,{family:m.familyDefault})};Ur(function(e){Be=ve(e.styleDefault,{family:m.familyDefault})});ka();function Ve(e,t){return(ya[e]||{})[t]}function ti(e,t){return(xa[e]||{})[t]}function R(e,t){return(Aa[e]||{})[t]}function Ia(e){return Sa[e]||{prefix:null,iconName:null}}function ai(e){var t=wa[e],a=Ve("fas",e);return t||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function z(){return Be}var Pa=function(){return{prefix:null,iconName:null,rest:[]}};function ni(e){var t=I,a=ba.reduce(function(n,r){return n[r]="".concat(m.cssPrefix,"-").concat(r),n},{});return aa.forEach(function(n){(e.includes(a[n])||e.some(function(r){return Qr[n].includes(r)}))&&(t=n)}),t}function ve(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.family,n=a===void 0?I:a,r=Tr[n][e];if(n===ee&&!e)return"fad";var i=ot[n][e]||ot[n][r],o=e in E.styles?e:null,s=i||o||null;return s}function ri(e){var t=[],a=null;return e.forEach(function(n){var r=ei(m.cssPrefix,n);r?a=r:n&&t.push(n)}),{iconName:a,rest:t}}function ct(e){return e.sort().filter(function(t,a,n){return n.indexOf(t)===a})}var dt=ra.concat(na);function he(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.skipLookups,n=a===void 0?!1:a,r=null,i=ct(e.filter(function(v){return dt.includes(v)})),o=ct(e.filter(function(v){return!dt.includes(v)})),s=i.filter(function(v){return r=v,!$t.includes(v)}),l=de(s,1),u=l[0],c=u===void 0?null:u,d=ni(i),p=f(f({},ri(o)),{},{prefix:ve(c,{family:d})});return f(f(f({},p),li({values:e,family:d,styles:Q,config:m,canonical:p,givenPrefix:r})),ii(n,r,p))}function ii(e,t,a){var n=a.prefix,r=a.iconName;if(e||!n||!r)return{prefix:n,iconName:r};var i=t==="fa"?Ia(r):{},o=R(n,r);return r=i.iconName||o||r,n=i.prefix||n,n==="far"&&!Q.far&&Q.fas&&!m.autoFetchSvg&&(n="fas"),{prefix:n,iconName:r}}var oi=aa.filter(function(e){return e!==I||e!==ee}),si=Object.keys(Pe).filter(function(e){return e!==I}).map(function(e){return Object.keys(Pe[e])}).flat();function li(e){var t=e.values,a=e.family,n=e.canonical,r=e.givenPrefix,i=r===void 0?"":r,o=e.styles,s=o===void 0?{}:o,l=e.config,u=l===void 0?{}:l,c=a===ee,d=t.includes("fa-duotone")||t.includes("fad"),p=u.familyDefault==="duotone",v=n.prefix==="fad"||n.prefix==="fa-duotone";if(!c&&(d||p||v)&&(n.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(n.prefix="fab"),!n.prefix&&oi.includes(a)){var y=Object.keys(s).find(function(S){return si.includes(S)});if(y||u.autoFetchSvg){var b=An.get(a).defaultShortPrefixId;n.prefix=b,n.iconName=R(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||i==="fa")&&(n.prefix=z()||"fas"),n}var fi=function(){function e(){Ya(this,e),this.definitions={}}return Ga(e,[{key:"add",value:function(){for(var a=this,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];var o=r.reduce(this._pullDefinitions,{});Object.keys(o).forEach(function(s){a.definitions[s]=f(f({},a.definitions[s]||{}),o[s]),Le(s,o[s]);var l=He[I][s];l&&Le(l,o[s]),ka()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,n){var r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(function(i){var o=r[i],s=o.prefix,l=o.iconName,u=o.icon,c=u[2];a[s]||(a[s]={}),c.length>0&&c.forEach(function(d){typeof d=="string"&&(a[s][d]=u)}),a[s][l]=u}),a}}])}(),mt=[],H={},G={},ui=Object.keys(G);function ci(e,t){var a=t.mixoutsTo;return mt=e,H={},Object.keys(G).forEach(function(n){ui.indexOf(n)===-1&&delete G[n]}),mt.forEach(function(n){var r=n.mixout?n.mixout():{};if(Object.keys(r).forEach(function(o){typeof r[o]=="function"&&(a[o]=r[o]),fe(r[o])==="object"&&Object.keys(r[o]).forEach(function(s){a[o]||(a[o]={}),a[o][s]=r[o][s]})}),n.hooks){var i=n.hooks();Object.keys(i).forEach(function(o){H[o]||(H[o]=[]),H[o].push(i[o])})}n.provides&&n.provides(G)}),a}function Te(e,t){for(var a=arguments.length,n=new Array(a>2?a-2:0),r=2;r<a;r++)n[r-2]=arguments[r];var i=H[e]||[];return i.forEach(function(o){t=o.apply(null,[t].concat(n))}),t}function W(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),n=1;n<t;n++)a[n-1]=arguments[n];var r=H[e]||[];r.forEach(function(i){i.apply(null,a)})}function $(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return G[e]?G[e].apply(null,t):void 0}function _e(e){e.prefix==="fa"&&(e.prefix="fas");var t=e.iconName,a=e.prefix||z();if(t)return t=R(a,t)||t,ft(Ea.definitions,a,t)||ft(E.styles,a,t)}var Ea=new fi,di=function(){m.autoReplaceSvg=!1,m.observeMutations=!1,W("noAuto")},mi={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return j?(W("beforeI2svg",t),$("pseudoElements2svg",t),$("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot;m.autoReplaceSvg===!1&&(m.autoReplaceSvg=!0),m.observeMutations=!0,Jr(function(){hi({autoReplaceSvgRoot:a}),W("watch",t)})}},vi={icon:function(t){if(t===null)return null;if(fe(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:R(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var a=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=ve(t[0]);return{prefix:n,iconName:R(n,a)||a}}if(typeof t=="string"&&(t.indexOf("".concat(m.cssPrefix,"-"))>-1||t.match(_r))){var r=he(t.split(" "),{skipLookups:!0});return{prefix:r.prefix||z(),iconName:R(r.prefix,r.iconName)||r.iconName}}if(typeof t=="string"){var i=z();return{prefix:i,iconName:R(i,t)||t}}}},P={noAuto:di,config:m,dom:mi,parse:vi,library:Ea,findIconDefinition:_e,toHtml:ae},hi=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot,n=a===void 0?x:a;(Object.keys(E.styles).length>0||m.autoFetchSvg)&&j&&m.autoReplaceSvg&&P.dom.i2svg({node:n})};function pe(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(n){return ae(n)})}}),Object.defineProperty(e,"node",{get:function(){if(j){var n=x.createElement("div");return n.innerHTML=e.html,n.children}}}),e}function pi(e){var t=e.children,a=e.main,n=e.mask,r=e.attributes,i=e.styles,o=e.transform;if(Xe(o)&&a.found&&!n.found){var s=a.width,l=a.height,u={x:s/l/2,y:.5};r.style=me(f(f({},i),{},{"transform-origin":"".concat(u.x+o.x/16,"em ").concat(u.y+o.y/16,"em")}))}return[{tag:"svg",attributes:r,children:t}]}function gi(e){var t=e.prefix,a=e.iconName,n=e.children,r=e.attributes,i=e.symbol,o=i===!0?"".concat(t,"-").concat(m.cssPrefix,"-").concat(a):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:f(f({},r),{},{id:o}),children:n}]}]}function bi(e){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(a){return a in e})}function Ke(e){var t=e.icons,a=t.main,n=t.mask,r=e.prefix,i=e.iconName,o=e.transform,s=e.symbol,l=e.maskId,u=e.extra,c=e.watchable,d=c===void 0?!1:c,p=n.found?n:a,v=p.width,y=p.height,b=[m.replacementClass,i?"".concat(m.cssPrefix,"-").concat(i):""].filter(function(g){return u.classes.indexOf(g)===-1}).filter(function(g){return g!==""||!!g}).concat(u.classes).join(" "),S={children:[],attributes:f(f({},u.attributes),{},{"data-prefix":r,"data-icon":i,class:b,role:u.attributes.role||"img",viewBox:"0 0 ".concat(v," ").concat(y)})};!bi(u.attributes)&&!u.attributes["aria-hidden"]&&(S.attributes["aria-hidden"]="true"),d&&(S.attributes[D]="");var w=f(f({},S),{},{prefix:r,iconName:i,main:a,mask:n,maskId:l,transform:o,symbol:s,styles:f({},u.styles)}),A=n.found&&a.found?$("generateAbstractMask",w)||{children:[],attributes:{}}:$("generateAbstractIcon",w)||{children:[],attributes:{}},k=A.children,O=A.attributes;return w.children=k,w.attributes=O,s?gi(w):pi(w)}function vt(e){var t=e.content,a=e.width,n=e.height,r=e.transform,i=e.extra,o=e.watchable,s=o===void 0?!1:o,l=f(f({},i.attributes),{},{class:i.classes.join(" ")});s&&(l[D]="");var u=f({},i.styles);Xe(r)&&(u.transform=Br({transform:r,width:a,height:n}),u["-webkit-transform"]=u.transform);var c=me(u);c.length>0&&(l.style=c);var d=[];return d.push({tag:"span",attributes:l,children:[t]}),d}function yi(e){var t=e.content,a=e.extra,n=f(f({},a.attributes),{},{class:a.classes.join(" ")}),r=me(a.styles);r.length>0&&(n.style=r);var i=[];return i.push({tag:"span",attributes:n,children:[t]}),i}var Ae=E.styles;function je(e){var t=e[0],a=e[1],n=e.slice(4),r=de(n,1),i=r[0],o=null;return Array.isArray(i)?o={tag:"g",attributes:{class:"".concat(m.cssPrefix,"-").concat(xe.GROUP)},children:[{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(xe.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(xe.PRIMARY),fill:"currentColor",d:i[1]}}]}:o={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:t,height:a,icon:o}}var xi={found:!1,width:512,height:512};function Si(e,t){!fa&&!m.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function Me(e,t){var a=t;return t==="fa"&&m.styleDefault!==null&&(t=z()),new Promise(function(n,r){if(a==="fa"){var i=Ia(e)||{};e=i.iconName||e,t=i.prefix||t}if(e&&t&&Ae[t]&&Ae[t][e]){var o=Ae[t][e];return n(je(o))}Si(e,t),n(f(f({},xi),{},{icon:m.showMissingIcons&&e?$("missingIconAbstract")||{}:{}}))})}var ht=function(){},ze=m.measurePerformance&&re&&re.mark&&re.measure?re:{mark:ht,measure:ht},V='FA "7.2.0"',wi=function(t){return ze.mark("".concat(V," ").concat(t," begins")),function(){return Fa(t)}},Fa=function(t){ze.mark("".concat(V," ").concat(t," ends")),ze.measure("".concat(V," ").concat(t),"".concat(V," ").concat(t," begins"),"".concat(V," ").concat(t," ends"))},Je={begin:wi,end:Fa},se=function(){};function pt(e){var t=e.getAttribute?e.getAttribute(D):null;return typeof t=="string"}function Ai(e){var t=e.getAttribute?e.getAttribute(Ue):null,a=e.getAttribute?e.getAttribute(Ye):null;return t&&a}function ki(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(m.replacementClass)}function Ii(){if(m.autoReplaceSvg===!0)return le.replace;var e=le[m.autoReplaceSvg];return e||le.replace}function Pi(e){return x.createElementNS("http://www.w3.org/2000/svg",e)}function Ei(e){return x.createElement(e)}function Ca(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.ceFn,n=a===void 0?e.tag==="svg"?Pi:Ei:a;if(typeof e=="string")return x.createTextNode(e);var r=n(e.tag);Object.keys(e.attributes||[]).forEach(function(o){r.setAttribute(o,e.attributes[o])});var i=e.children||[];return i.forEach(function(o){r.appendChild(Ca(o,{ceFn:n}))}),r}function Fi(e){var t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var le={replace:function(t){var a=t[0];if(a.parentNode)if(t[1].forEach(function(r){a.parentNode.insertBefore(Ca(r),a)}),a.getAttribute(D)===null&&m.keepOriginalSource){var n=x.createComment(Fi(a));a.parentNode.replaceChild(n,a)}else a.remove()},nest:function(t){var a=t[0],n=t[1];if(~Ge(a).indexOf(m.replacementClass))return le.replace(t);var r=new RegExp("".concat(m.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(" ").reduce(function(s,l){return l===m.replacementClass||l.match(r)?s.toSvg.push(l):s.toNode.push(l),s},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",i.toNode.join(" "))}var o=n.map(function(s){return ae(s)}).join(`
`);a.setAttribute(D,""),a.innerHTML=o}};function gt(e){e()}function Oa(e,t){var a=typeof t=="function"?t:se;if(e.length===0)a();else{var n=gt;m.mutateApproach===Nr&&(n=M.requestAnimationFrame||gt),n(function(){var r=Ii(),i=Je.begin("mutate");e.map(r),i(),a()})}}var qe=!1;function Na(){qe=!0}function $e(){qe=!1}var ce=null;function bt(e){if(at&&m.observeMutations){var t=e.treeCallback,a=t===void 0?se:t,n=e.nodeCallback,r=n===void 0?se:n,i=e.pseudoElementsCallback,o=i===void 0?se:i,s=e.observeMutationsRoot,l=s===void 0?x:s;ce=new at(function(u){if(!qe){var c=z();B(u).forEach(function(d){if(d.type==="childList"&&d.addedNodes.length>0&&!pt(d.addedNodes[0])&&(m.searchPseudoElements&&o(d.target),a(d.target)),d.type==="attributes"&&d.target.parentNode&&m.searchPseudoElements&&o([d.target],!0),d.type==="attributes"&&pt(d.target)&&~zr.indexOf(d.attributeName))if(d.attributeName==="class"&&Ai(d.target)){var p=he(Ge(d.target)),v=p.prefix,y=p.iconName;d.target.setAttribute(Ue,v||c),y&&d.target.setAttribute(Ye,y)}else ki(d.target)&&r(d.target)})}}),j&&ce.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Ci(){ce&&ce.disconnect()}function Oi(e){var t=e.getAttribute("style"),a=[];return t&&(a=t.split(";").reduce(function(n,r){var i=r.split(":"),o=i[0],s=i.slice(1);return o&&s.length>0&&(n[o]=s.join(":").trim()),n},{})),a}function Ni(e){var t=e.getAttribute("data-prefix"),a=e.getAttribute("data-icon"),n=e.innerText!==void 0?e.innerText.trim():"",r=he(Ge(e));return r.prefix||(r.prefix=z()),t&&a&&(r.prefix=t,r.iconName=a),r.iconName&&r.prefix||(r.prefix&&n.length>0&&(r.iconName=ti(r.prefix,e.innerText)||Ve(r.prefix,ga(e.innerText))),!r.iconName&&m.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=e.firstChild.data)),r}function Li(e){var t=B(e.attributes).reduce(function(a,n){return a.name!=="class"&&a.name!=="style"&&(a[n.name]=n.value),a},{});return t}function Ti(){return{iconName:null,prefix:null,transform:C,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function yt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=Ni(e),n=a.iconName,r=a.prefix,i=a.rest,o=Li(e),s=Te("parseNodeAttributes",{},e),l=t.styleParser?Oi(e):[];return f({iconName:n,prefix:r,transform:C,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:l,attributes:o}},s)}var _i=E.styles;function La(e){var t=m.autoReplaceSvg==="nest"?yt(e,{styleParser:!1}):yt(e);return~t.extra.classes.indexOf(ca)?$("generateLayersText",e,t):$("generateSvgReplacementMutation",e,t)}function ji(){return[].concat(F(na),F(ra))}function xt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!j)return Promise.resolve();var a=x.documentElement.classList,n=function(d){return a.add("".concat(it,"-").concat(d))},r=function(d){return a.remove("".concat(it,"-").concat(d))},i=m.autoFetchSvg?ji():$t.concat(Object.keys(_i));i.includes("fa")||i.push("fa");var o=[".".concat(ca,":not([").concat(D,"])")].concat(i.map(function(c){return".".concat(c,":not([").concat(D,"])")})).join(", ");if(o.length===0)return Promise.resolve();var s=[];try{s=B(e.querySelectorAll(o))}catch{}if(s.length>0)n("pending"),r("complete");else return Promise.resolve();var l=Je.begin("onTree"),u=s.reduce(function(c,d){try{var p=La(d);p&&c.push(p)}catch(v){fa||v.name==="MissingIcon"&&console.error(v)}return c},[]);return new Promise(function(c,d){Promise.all(u).then(function(p){Oa(p,function(){n("active"),n("complete"),r("pending"),typeof t=="function"&&t(),l(),c()})}).catch(function(p){l(),d(p)})})}function Mi(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;La(e).then(function(a){a&&Oa([a],t)})}function zi(e){return function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(t||{}).icon?t:_e(t||{}),r=a.mask;return r&&(r=(r||{}).icon?r:_e(r||{})),e(n,f(f({},a),{},{mask:r}))}}var $i=function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=a.transform,r=n===void 0?C:n,i=a.symbol,o=i===void 0?!1:i,s=a.mask,l=s===void 0?null:s,u=a.maskId,c=u===void 0?null:u,d=a.classes,p=d===void 0?[]:d,v=a.attributes,y=v===void 0?{}:v,b=a.styles,S=b===void 0?{}:b;if(t){var w=t.prefix,A=t.iconName,k=t.icon;return pe(f({type:"icon"},t),function(){return W("beforeDOMElementCreation",{iconDefinition:t,params:a}),Ke({icons:{main:je(k),mask:l?je(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:w,iconName:A,transform:f(f({},C),r),symbol:o,maskId:c,extra:{attributes:y,styles:S,classes:p}})})}},Ri={mixout:function(){return{icon:zi($i)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=xt,a.nodeCallback=Mi,a}}},provides:function(t){t.i2svg=function(a){var n=a.node,r=n===void 0?x:n,i=a.callback,o=i===void 0?function(){}:i;return xt(r,o)},t.generateSvgReplacementMutation=function(a,n){var r=n.iconName,i=n.prefix,o=n.transform,s=n.symbol,l=n.mask,u=n.maskId,c=n.extra;return new Promise(function(d,p){Promise.all([Me(r,i),l.iconName?Me(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(v){var y=de(v,2),b=y[0],S=y[1];d([a,Ke({icons:{main:b,mask:S},prefix:i,iconName:r,transform:o,symbol:s,maskId:u,extra:c,watchable:!0})])}).catch(p)})},t.generateAbstractIcon=function(a){var n=a.children,r=a.attributes,i=a.main,o=a.transform,s=a.styles,l=me(s);l.length>0&&(r.style=l);var u;return Xe(o)&&(u=$("generateAbstractTransformGrouping",{main:i,transform:o,containerWidth:i.width,iconWidth:i.width})),n.push(u||i.icon),{children:n,attributes:r}}}},Di={mixout:function(){return{layer:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.classes,i=r===void 0?[]:r;return pe({type:"layer"},function(){W("beforeDOMElementCreation",{assembler:a,params:n});var o=[];return a(function(s){Array.isArray(s)?s.map(function(l){o=o.concat(l.abstract)}):o=o.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(m.cssPrefix,"-layers")].concat(F(i)).join(" ")},children:o}]})}}}},Wi={mixout:function(){return{counter:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var r=n.classes,i=r===void 0?[]:r,o=n.attributes,s=o===void 0?{}:o,l=n.styles,u=l===void 0?{}:l;return pe({type:"counter",content:a},function(){return W("beforeDOMElementCreation",{content:a,params:n}),yi({content:a.toString(),extra:{attributes:s,styles:u,classes:["".concat(m.cssPrefix,"-layers-counter")].concat(F(i))}})})}}}},Ui={mixout:function(){return{text:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.transform,i=r===void 0?C:r,o=n.classes,s=o===void 0?[]:o,l=n.attributes,u=l===void 0?{}:l,c=n.styles,d=c===void 0?{}:c;return pe({type:"text",content:a},function(){return W("beforeDOMElementCreation",{content:a,params:n}),vt({content:a,transform:f(f({},C),i),extra:{attributes:u,styles:d,classes:["".concat(m.cssPrefix,"-layers-text")].concat(F(s))}})})}}},provides:function(t){t.generateLayersText=function(a,n){var r=n.transform,i=n.extra,o=null,s=null;if(Mt){var l=parseInt(getComputedStyle(a).fontSize,10),u=a.getBoundingClientRect();o=u.width/l,s=u.height/l}return Promise.resolve([a,vt({content:a.innerHTML,width:o,height:s,transform:r,extra:i,watchable:!0})])}}},Ta=new RegExp('"',"ug"),St=[1105920,1112319],wt=f(f(f(f({},{FontAwesome:{normal:"fas",400:"fas"}}),wn),Cr),Nn),Re=Object.keys(wt).reduce(function(e,t){return e[t.toLowerCase()]=wt[t],e},{}),Yi=Object.keys(Re).reduce(function(e,t){var a=Re[t];return e[t]=a[900]||F(Object.entries(a))[0][1],e},{});function Hi(e){var t=e.replace(Ta,"");return ga(F(t)[0]||"")}function Gi(e){var t=e.getPropertyValue("font-feature-settings").includes("ss01"),a=e.getPropertyValue("content"),n=a.replace(Ta,""),r=n.codePointAt(0),i=r>=St[0]&&r<=St[1],o=n.length===2?n[0]===n[1]:!1;return i||o||t}function Xi(e,t){var a=e.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(t),r=isNaN(n)?"normal":n;return(Re[a]||{})[r]||Yi[a]}function At(e,t){var a="".concat(Or).concat(t.replace(":","-"));return new Promise(function(n,r){if(e.getAttribute(a)!==null)return n();var i=B(e.children),o=i.filter(function(ne){return ne.getAttribute(Fe)===t})[0],s=M.getComputedStyle(e,t),l=s.getPropertyValue("font-family"),u=l.match(jr),c=s.getPropertyValue("font-weight"),d=s.getPropertyValue("content");if(o&&!u)return e.removeChild(o),n();if(u&&d!=="none"&&d!==""){var p=s.getPropertyValue("content"),v=Xi(l,c),y=Hi(p),b=u[0].startsWith("FontAwesome"),S=Gi(s),w=Ve(v,y),A=w;if(b){var k=ai(y);k.iconName&&k.prefix&&(w=k.iconName,v=k.prefix)}if(w&&!S&&(!o||o.getAttribute(Ue)!==v||o.getAttribute(Ye)!==A)){e.setAttribute(a,A),o&&e.removeChild(o);var O=Ti(),g=O.extra;g.attributes[Fe]=t,Me(w,v).then(function(ne){var $a=Ke(f(f({},O),{},{icons:{main:ne,mask:Pa()},prefix:v,iconName:A,extra:g,watchable:!0})),ge=x.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(ge,e.firstChild):e.appendChild(ge),ge.outerHTML=$a.map(function(Ra){return ae(Ra)}).join(`
`),e.removeAttribute(a),n()}).catch(r)}else n()}else n()})}function Bi(e){return Promise.all([At(e,"::before"),At(e,"::after")])}function Vi(e){return e.parentNode!==document.head&&!~Lr.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Fe)&&(!e.parentNode||e.parentNode.tagName!=="svg")}var Ki=function(t){return!!t&&la.some(function(a){return t.includes(a)})},Ji=function(t){if(!t)return[];var a=new Set,n=t.split(/,(?![^()]*\))/).map(function(l){return l.trim()});n=n.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(u){return u.trim()})});var r=oe(n),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;if(Ki(o)){var s=la.reduce(function(l,u){return l.replace(u,"")},o);s!==""&&s!=="*"&&a.add(s)}}}catch(l){r.e(l)}finally{r.f()}return a};function kt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(j){var a;if(t)a=e;else if(m.searchPseudoElementsFullScan)a=e.querySelectorAll("*");else{var n=new Set,r=oe(document.styleSheets),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;try{var s=oe(o.cssRules),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,c=Ji(u.selectorText),d=oe(c),p;try{for(d.s();!(p=d.n()).done;){var v=p.value;n.add(v)}}catch(b){d.e(b)}finally{d.f()}}}catch(b){s.e(b)}finally{s.f()}}catch(b){m.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(o.href," (").concat(b.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(b){r.e(b)}finally{r.f()}if(!n.size)return;var y=Array.from(n).join(", ");try{a=e.querySelectorAll(y)}catch{}}return new Promise(function(b,S){var w=B(a).filter(Vi).map(Bi),A=Je.begin("searchPseudoElements");Na(),Promise.all(w).then(function(){A(),$e(),b()}).catch(function(){A(),$e(),S()})})}}var qi={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=kt,a}}},provides:function(t){t.pseudoElements2svg=function(a){var n=a.node,r=n===void 0?x:n;m.searchPseudoElements&&kt(r)}}},It=!1,Qi={mixout:function(){return{dom:{unwatch:function(){Na(),It=!0}}}},hooks:function(){return{bootstrap:function(){bt(Te("mutationObserverCallbacks",{}))},noAuto:function(){Ci()},watch:function(a){var n=a.observeMutationsRoot;It?$e():bt(Te("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},Pt=function(t){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(n,r){var i=r.toLowerCase().split("-"),o=i[0],s=i.slice(1).join("-");if(o&&s==="h")return n.flipX=!0,n;if(o&&s==="v")return n.flipY=!0,n;if(s=parseFloat(s),isNaN(s))return n;switch(o){case"grow":n.size=n.size+s;break;case"shrink":n.size=n.size-s;break;case"left":n.x=n.x-s;break;case"right":n.x=n.x+s;break;case"up":n.y=n.y-s;break;case"down":n.y=n.y+s;break;case"rotate":n.rotate=n.rotate+s;break}return n},a)},Zi={mixout:function(){return{parse:{transform:function(a){return Pt(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-transform");return r&&(a.transform=Pt(r)),a}}},provides:function(t){t.generateAbstractTransformGrouping=function(a){var n=a.main,r=a.transform,i=a.containerWidth,o=a.iconWidth,s={transform:"translate(".concat(i/2," 256)")},l="translate(".concat(r.x*32,", ").concat(r.y*32,") "),u="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),c="rotate(".concat(r.rotate," 0 0)"),d={transform:"".concat(l," ").concat(u," ").concat(c)},p={transform:"translate(".concat(o/2*-1," -256)")},v={outer:s,inner:d,path:p};return{tag:"g",attributes:f({},v.outer),children:[{tag:"g",attributes:f({},v.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:f(f({},n.icon.attributes),v.path)}]}]}}}},ke={x:0,y:0,width:"100%",height:"100%"};function Et(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function eo(e){return e.tag==="g"?e.children:[e]}var to={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-mask"),i=r?he(r.split(" ").map(function(o){return o.trim()})):Pa();return i.prefix||(i.prefix=z()),a.mask=i,a.maskId=n.getAttribute("data-fa-mask-id"),a}}},provides:function(t){t.generateAbstractMask=function(a){var n=a.children,r=a.attributes,i=a.main,o=a.mask,s=a.maskId,l=a.transform,u=i.width,c=i.icon,d=o.width,p=o.icon,v=Xr({transform:l,containerWidth:d,iconWidth:u}),y={tag:"rect",attributes:f(f({},ke),{},{fill:"white"})},b=c.children?{children:c.children.map(Et)}:{},S={tag:"g",attributes:f({},v.inner),children:[Et(f({tag:c.tag,attributes:f(f({},c.attributes),v.path)},b))]},w={tag:"g",attributes:f({},v.outer),children:[S]},A="mask-".concat(s||st()),k="clip-".concat(s||st()),O={tag:"mask",attributes:f(f({},ke),{},{id:A,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[y,w]},g={tag:"defs",children:[{tag:"clipPath",attributes:{id:k},children:eo(p)},O]};return n.push(g,{tag:"rect",attributes:f({fill:"currentColor","clip-path":"url(#".concat(k,")"),mask:"url(#".concat(A,")")},ke)}),{children:n,attributes:r}}}},ao={provides:function(t){var a=!1;M.matchMedia&&(a=M.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var n=[],r={fill:"currentColor"},i={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:f(f({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var o=f(f({},i),{},{attributeName:"opacity"}),s={tag:"circle",attributes:f(f({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||s.children.push({tag:"animate",attributes:f(f({},i),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:f(f({},o),{},{values:"1;0;1;1;0;1;"})}),n.push(s),n.push({tag:"path",attributes:f(f({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:f(f({},o),{},{values:"1;0;0;0;0;1;"})}]}),a||n.push({tag:"path",attributes:f(f({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:f(f({},o),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},no={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-symbol"),i=r===null?!1:r===""?!0:r;return a.symbol=i,a}}}},ro=[Kr,Ri,Di,Wi,Ui,qi,Qi,Zi,to,ao,no];ci(ro,{mixoutsTo:P});P.noAuto;var Z=P.config;P.library;P.dom;var _a=P.parse;P.findIconDefinition;P.toHtml;var io=P.icon;P.layer;P.text;P.counter;function oo(e){return e=e-0,e===e}function ja(e){return oo(e)?e:(e=e.replace(/[_-]+(.)?/g,(t,a)=>a?a.toUpperCase():""),e.charAt(0).toLowerCase()+e.slice(1))}function so(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Y=new Map,lo=1e3;function fo(e){if(Y.has(e))return Y.get(e);const t={};let a=0;const n=e.length;for(;a<n;){const r=e.indexOf(";",a),i=r===-1?n:r,o=e.slice(a,i).trim();if(o){const s=o.indexOf(":");if(s>0){const l=o.slice(0,s).trim(),u=o.slice(s+1).trim();if(l&&u){const c=ja(l);t[c.startsWith("webkit")?so(c):c]=u}}}a=i+1}if(Y.size===lo){const r=Y.keys().next().value;r&&Y.delete(r)}return Y.set(e,t),t}function Ma(e,t,a={}){if(typeof t=="string")return t;const n=(t.children||[]).map(c=>Ma(e,c)),r=t.attributes||{},i={};for(const[c,d]of Object.entries(r))switch(!0){case c==="class":{i.className=d;break}case c==="style":{i.style=fo(String(d));break}case c.startsWith("aria-"):case c.startsWith("data-"):{i[c.toLowerCase()]=d;break}default:i[ja(c)]=d}const{style:o,role:s,"aria-label":l,...u}=a;return o&&(i.style=i.style?{...i.style,...o}:o),s&&(i.role=s),l&&(i["aria-label"]=l,i["aria-hidden"]="false"),e(t.tag,{...i,...u},...n)}var uo=Ma.bind(null,Nt.createElement),Ft=(e,t)=>{const a=Da.useId();return e||(t?a:void 0)},co=class{constructor(e="react-fontawesome"){this.enabled=!1;let t=!1;try{t=typeof process<"u"&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}},mo="searchPseudoElementsFullScan"in Z?"7.0.0":"6.0.0",vo=Number.parseInt(mo)>=7,q="fa",N={beat:"fa-beat",fade:"fa-fade",beatFade:"fa-beat-fade",bounce:"fa-bounce",shake:"fa-shake",spin:"fa-spin",spinPulse:"fa-spin-pulse",spinReverse:"fa-spin-reverse",pulse:"fa-pulse"},ho={left:"fa-pull-left",right:"fa-pull-right"},po={90:"fa-rotate-90",180:"fa-rotate-180",270:"fa-rotate-270"},go={"2xs":"fa-2xs",xs:"fa-xs",sm:"fa-sm",lg:"fa-lg",xl:"fa-xl","2xl":"fa-2xl","1x":"fa-1x","2x":"fa-2x","3x":"fa-3x","4x":"fa-4x","5x":"fa-5x","6x":"fa-6x","7x":"fa-7x","8x":"fa-8x","9x":"fa-9x","10x":"fa-10x"},L={border:"fa-border",fixedWidth:"fa-fw",flip:"fa-flip",flipHorizontal:"fa-flip-horizontal",flipVertical:"fa-flip-vertical",inverse:"fa-inverse",rotateBy:"fa-rotate-by",swapOpacity:"fa-swap-opacity",widthAuto:"fa-width-auto"};function bo(e){const t=Z.cssPrefix||Z.familyPrefix||q;return t===q?e:e.replace(new RegExp(String.raw`(?<=^|\s)${q}-`,"g"),`${t}-`)}function yo(e){const{beat:t,fade:a,beatFade:n,bounce:r,shake:i,spin:o,spinPulse:s,spinReverse:l,pulse:u,fixedWidth:c,inverse:d,border:p,flip:v,size:y,rotation:b,pull:S,swapOpacity:w,rotateBy:A,widthAuto:k,className:O}=e,g=[];return O&&g.push(...O.split(" ")),t&&g.push(N.beat),a&&g.push(N.fade),n&&g.push(N.beatFade),r&&g.push(N.bounce),i&&g.push(N.shake),o&&g.push(N.spin),l&&g.push(N.spinReverse),s&&g.push(N.spinPulse),u&&g.push(N.pulse),c&&g.push(L.fixedWidth),d&&g.push(L.inverse),p&&g.push(L.border),v===!0&&g.push(L.flip),(v==="horizontal"||v==="both")&&g.push(L.flipHorizontal),(v==="vertical"||v==="both")&&g.push(L.flipVertical),y!=null&&g.push(go[y]),b!=null&&b!==0&&g.push(po[b]),S!=null&&g.push(ho[S]),w&&g.push(L.swapOpacity),vo?(A&&g.push(L.rotateBy),k&&g.push(L.widthAuto),(Z.cssPrefix||Z.familyPrefix||q)===q?g:g.map(bo)):g}var xo=e=>typeof e=="object"&&"icon"in e&&!!e.icon;function Ct(e){if(e)return xo(e)?e:_a.icon(e)}function So(e){return Object.keys(e)}var Ot=new co("FontAwesomeIcon"),za={border:!1,className:"",mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},wo=new Set(Object.keys(za)),Ao=Nt.forwardRef((e,t)=>{const a={...za,...e},{icon:n,mask:r,symbol:i,title:o,titleId:s,maskId:l,transform:u}=a,c=Ft(l,!!r),d=Ft(s,!!o),p=Ct(n);if(!p)return Ot.error("Icon lookup is undefined",n),null;const v=yo(a),y=typeof u=="string"?_a.transform(u):u,b=Ct(r),S=io(p,{...v.length>0&&{classes:v},...y&&{transform:y},...b&&{mask:b},symbol:i,title:o,titleId:d,maskId:c});if(!S)return Ot.error("Could not find icon",p),null;const{abstract:w}=S,A={ref:t};for(const k of So(a))wo.has(k)||(A[k]=a[k]);return uo(w[0],A)});Ao.displayName="FontAwesomeIcon";/*!
 * Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2026 Fonticons, Inc.
 */var Po={prefix:"fas",iconName:"trash",icon:[448,512,[],"f1f8","M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"]},Eo={prefix:"fas",iconName:"expand",icon:[448,512,[],"f065","M32 32C14.3 32 0 46.3 0 64l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 32zM64 352c0-17.7-14.3-32-32-32S0 334.3 0 352l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96z"]},Fo={prefix:"fas",iconName:"circle-half-stroke",icon:[512,512,[9680,"adjust"],"f042","M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"]},Co={prefix:"fas",iconName:"sun",icon:[576,512,[9728],"f185","M288-32c8.4 0 16.3 4.4 20.6 11.7L364.1 72.3 468.9 46c8.2-2 16.9 .4 22.8 6.3S500 67 498 75.1l-26.3 104.7 92.7 55.5c7.2 4.3 11.7 12.2 11.7 20.6s-4.4 16.3-11.7 20.6L471.7 332.1 498 436.8c2 8.2-.4 16.9-6.3 22.8S477 468 468.9 466l-104.7-26.3-55.5 92.7c-4.3 7.2-12.2 11.7-20.6 11.7s-16.3-4.4-20.6-11.7L211.9 439.7 107.2 466c-8.2 2-16.8-.4-22.8-6.3S76 445 78 436.8l26.2-104.7-92.6-55.5C4.4 272.2 0 264.4 0 256s4.4-16.3 11.7-20.6L104.3 179.9 78 75.1c-2-8.2 .3-16.8 6.3-22.8S99 44 107.2 46l104.7 26.2 55.5-92.6 1.8-2.6c4.5-5.7 11.4-9.1 18.8-9.1zm0 144a144 144 0 1 0 0 288 144 144 0 1 0 0-288zm0 240a96 96 0 1 1 0-192 96 96 0 1 1 0 192z"]},Oo={prefix:"fas",iconName:"link",icon:[576,512,[128279,"chain"],"f0c1","M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z"]},No={prefix:"fas",iconName:"play",icon:[448,512,[9654],"f04b","M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"]},Lo={prefix:"fas",iconName:"check",icon:[448,512,[10003,10004],"f00c","M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"]},To={prefix:"fas",iconName:"sliders",icon:[512,512,["sliders-h"],"f1de","M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 224zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384z"]},_o={prefix:"fas",iconName:"right-left",icon:[512,512,["exchange-alt"],"f362","M502.6 150.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9S352 236.9 352 224l0-64-320 0c-17.7 0-32-14.3-32-32S14.3 96 32 96l320 0 0-64c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c12.5 12.5 12.5 32.8 0 45.3zm-397.3 352l-96-96c-12.5-12.5-12.5-32.8 0-45.3l96-96c9.2-9.2 22.9-11.9 34.9-6.9S160 275.1 160 288l0 64 320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-320 0 0 64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9z"]},jo={prefix:"fas",iconName:"xmark",icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"]},Mo={prefix:"fas",iconName:"moon",icon:[512,512,[127769,9214],"f186","M256 0C114.6 0 0 114.6 0 256S114.6 512 256 512c68.8 0 131.3-27.2 177.3-71.4 7.3-7 9.4-17.9 5.3-27.1s-13.7-14.9-23.8-14.1c-4.9 .4-9.8 .6-14.8 .6-101.6 0-184-82.4-184-184 0-72.1 41.5-134.6 102.1-164.8 9.1-4.5 14.3-14.3 13.1-24.4S322.6 8.5 312.7 6.3C294.4 2.2 275.4 0 256 0z"]},zo={prefix:"fas",iconName:"rotate-left",icon:[512,512,["rotate-back","rotate-backward","undo-alt"],"f2ea","M24 192l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-46.7-46.7c75.3-58.6 184.3-53.3 253.5 15.9 75 75 75 196.5 0 271.5s-196.5 75-271.5 0c-10.2-10.2-19-21.3-26.4-33-9.5-14.9-29.3-19.3-44.2-9.8s-19.3 29.3-9.8 44.2C49.7 408.7 61.4 423.5 75 437 175 537 337 537 437 437S537 175 437 75C342.8-19.3 193.3-24.7 92.7 58.8L41 7C34.1 .2 23.8-1.9 14.8 1.8S0 14.3 0 24L0 168c0 13.3 10.7 24 24 24z"]},$o={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"]},Ro={prefix:"fas",iconName:"copy",icon:[448,512,[],"f0c5","M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z"]},Do={prefix:"fas",iconName:"compress",icon:[448,512,[],"f066","M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"]},Wo={prefix:"fas",iconName:"pause",icon:[384,512,[9208],"f04c","M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"]};export{Ao as F,No as a,Wo as b,zo as c,Lo as d,Oo as e,_o as f,Ro as g,$o as h,Po as i,Do as j,Eo as k,To as l,jo as m,Fo as n,Co as o,Mo as p};
