(function(t){function e(e){for(var s,o,l=e[0],r=e[1],c=e[2],u=0,f=[];u<l.length;u++)o=l[u],Object.prototype.hasOwnProperty.call(n,o)&&n[o]&&f.push(n[o][0]),n[o]=0;for(s in r)Object.prototype.hasOwnProperty.call(r,s)&&(t[s]=r[s]);d&&d(e);while(f.length)f.shift()();return i.push.apply(i,c||[]),a()}function a(){for(var t,e=0;e<i.length;e++){for(var a=i[e],s=!0,l=1;l<a.length;l++){var r=a[l];0!==n[r]&&(s=!1)}s&&(i.splice(e--,1),t=o(o.s=a[0]))}return t}var s={},n={app:0},i=[];function o(e){if(s[e])return s[e].exports;var a=s[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=t,o.c=s,o.d=function(t,e,a){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)o.d(a,s,function(e){return t[e]}.bind(null,s));return a},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],r=l.push.bind(l);l.push=e,l=l.slice();for(var c=0;c<l.length;c++)e(l[c]);var d=r;i.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"034f":function(t,e,a){"use strict";a("85ec")},"03ae":function(t,e,a){"use strict";a("a2c9")},"313f":function(t,e,a){"use strict";a("de84")},"354c":function(t,e,a){},3721:function(t,e,a){"use strict";a("da91")},4678:function(t,e,a){var s={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn-bd":"9686","./bn-bd.js":"9686","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-in":"ec2e","./en-in.js":"ec2e","./en-nz":"6f50","./en-nz.js":"6f50","./en-sg":"b7e9","./en-sg.js":"b7e9","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-mx":"b5b7","./es-mx.js":"b5b7","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fil":"d69a","./fil.js":"d69a","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-deva":"aaf2","./gom-deva.js":"aaf2","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./oc-lnc":"167b","./oc-lnc.js":"167b","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tk":"5aff","./tk.js":"5aff","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-mo":"3a6c","./zh-mo.js":"3a6c","./zh-tw":"90ea","./zh-tw.js":"90ea"};function n(t){var e=i(t);return a(e)}function i(t){if(!a.o(s,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return s[t]}n.keys=function(){return Object.keys(s)},n.resolve=i,t.exports=n,n.id="4678"},"4d38":function(t,e,a){},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var s=a("2b0e"),n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{style:{padding:t.mainPpadding},attrs:{id:"wrap"}},[a("Header"),a("Menu",{on:{closeNav:t.closeNavEvt}}),a("router-view")],1)},i=[],o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"Header"},[s("router-link",{attrs:{to:"/"}},[s("img",{attrs:{alt:"logo",src:a("cf05")}})]),s("div",{attrs:{id:"headerTitle"}},[t._v(t._s(t.headerTitle))])],1)},l=[],r={name:"Header",data:function(){return{headerTitle:"CNC 툴 부하 모니터링"}}},c=r,d=(a("6391"),a("2877")),u=Object(d["a"])(c,o,l,!1,null,"14ebea9e",null),f=u.exports,h=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"navigation",style:{left:t.navPosition}},[t._l(t.items,(function(e){return a("v-list",{key:e.title,attrs:{dark:""},model:{value:e.active,callback:function(a){t.$set(e,"active",a)},expression:"item.active"}},[e.items?a("v-list-group",{attrs:{"no-action":""},scopedSlots:t._u([{key:"activator",fn:function(){return[a("v-list-item-title",[t._v(t._s(e.title))])]},proxy:!0}],null,!0)},t._l(e.items,(function(e){return a("div",{key:e.title},[e.items?a("v-list-group",{attrs:{"no-action":"","sub-group":""},scopedSlots:t._u([{key:"activator",fn:function(){return[a("v-list-item-content",[a("v-list-item-title",[t._v(t._s(e.title))])],1)]},proxy:!0}],null,!0)},t._l(e.items,(function(e,s){return a("v-list-item",{key:s,attrs:{to:e.route}},[a("v-list-item-title",[t._v(t._s(e.title))]),a("v-list-item-icon",[a("v-icon",[t._v(t._s(e.icon))])],1)],1)})),1):a("v-list-item",{attrs:{to:e.route}},[a("v-list-item-title",[t._v(t._s(e.title))]),a("v-list-item-icon",[a("v-icon",[t._v(t._s(e.icon))])],1)],1)],1)})),0):a("div",[a("v-list-item",{attrs:{to:e.route}},[a("v-list-item-icon",[a("v-icon",[t._v(t._s(e.icon))])],1),a("v-list-item-title",[t._v(t._s(e.title))])],1)],1)],1)})),a("div",{style:{left:t.closePosition},attrs:{id:"closeNav"},on:{click:t.closeNav}})],2)},p=[],m={name:"navigation",data:function(){return{navPosition:"0px",closePosition:"200px",items:[{title:"제 1 공장",items:[{title:"1 라인",items:[{icon:"mdi-factory",title:"공정 1",route:"/op1"},{icon:"mdi-factory",title:"공정 2",route:"/op2"}]},{title:"2 라인",items:[{icon:"mdi-factory",title:"공정 3",route:"/op3"},{icon:"mdi-factory",title:"공정 4",route:"/op4"}]}]},{title:"제 2 공장",items:[{title:"3 라인",items:[{icon:"mdi-factory",title:"공정 5",route:"/op5"}]}]}]}},methods:{closeNav:function(){"0px"==this.navPosition?(this.navPosition="-200px",this.closePosition="0px",this.$emit("closeNav","true")):(this.navPosition="0px",this.closePosition="200px",this.$emit("closeNav","false"))}}},v=m,b=(a("efa6"),Object(d["a"])(v,h,p,!1,null,null,null)),y=b.exports,j={name:"App",components:{Header:f,Menu:y},data:function(){return{mainPpadding:"80px 30px 30px 250px",stateMessage:!1}},methods:{closeNavEvt:function(t){"true"==t?this.mainPpadding="80px 30px 30px 40px":"false"==t&&(this.mainPpadding="80px 30px 30px 240px")}}},g=j,_=(a("034f"),Object(d["a"])(g,n,i,!1,null,null,null)),A=_.exports,x=a("2f62"),T=a("5132"),C=a.n(T),k=a("ce5b"),w=a.n(k);a("bf40");s["default"].use(w.a);var S={},O=new w.a(S),P=a("2ead"),M=a.n(P),E=a("8c4f"),L=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"Breadcrumbs"},[a("div",{attrs:{id:"headerTitle"}},[a("span",{staticClass:"headerTitleTxt",staticStyle:{"padding-left":"0px"}},[t._v(t._s(t.headerFac))]),t._v(" "),a("span",{staticClass:"headerTitleTxt"},[t._v(t._s(t.headerLine))]),t._v(" "),a("span",{staticClass:"headerTitleTxt",staticStyle:{border:"none"}},[t._v(t._s(t.headerOP))])])]),a("div",{attrs:{id:"topPanel"}},[a("div",{attrs:{id:"statusArea"}},[t._m(0),a("StatusPanel")],1),a("div",{attrs:{id:"aipanelArea"}},[t._m(1),a("AIPanel")],1)]),a("ChartArea")],1)},I=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{color:"white"},attrs:{id:"statusPTitle"}},[a("p",{staticClass:"topPanelTitle"},[t._v("가동 현황")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{color:"white"},attrs:{id:"aiPTitle"}},[a("p",{staticClass:"topPanelTitle"},[t._v("AI 판정")])])}],z=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"TopPanel"},[a("div",{attrs:{id:"panel"}},[a("div",{attrs:{id:"opsituation"}},[a("Opsituation")],1),a("div",{attrs:{id:"product"}},[a("Product")],1),a("div",{attrs:{id:"cycleTime"}},[a("CycleTime")],1)])])},$=[],V=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"opsituation",style:{background:t.stateColor}},[a("p",{attrs:{id:"opsituationTitle"}},[t._v("Running Status")]),a("p",{attrs:{id:"opsituationState"}},[t._v(t._s(t.op))])])},N=[],D={name:"opsituation",created:function(){this.$socket.emit("setWork")},sockets:{isWork:function(t){"start"==t?(this.op="가동",this.stateColor="#465942"):(this.op="비가동",this.stateColor="#C4162A")}},data:function(){return{op:"비가동",stateColor:"#C4162A"}}},F=D,H=(a("a3db"),Object(d["a"])(F,V,N,!1,null,null,null)),B=H.exports,R=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"Product",on:{keyup:function(e){if(!e.type.indexOf("key")&&t._k(e.keyCode,"esc",27,e.key,["Esc","Escape"]))return null;t.showModal=!1}}},[s("span",{attrs:{id:"productTitle"}},[t._v("Total Production ")]),s("div",{staticStyle:{float:"right","margin-right":"10px","margin-top":"3.5px"}},[s("button",{attrs:{id:"productEvt"},on:{click:t.modalShow}},[s("img",{staticStyle:{width:"16px","z-index":"8"},attrs:{src:a("9417")}})])]),s("p",{attrs:{id:"totalproductVal"}},[t._v(t._s(t.productVal))])]),t.showModal?s("Modal",{on:{close:function(e){t.showModal=!1}}},[s("h3",{attrs:{slot:"header"},slot:"header"},[s("span",{staticStyle:{"margin-left":"15px"}},[t._v("Production History")]),s("i",{staticClass:"fa fa-times closeModalBtn",staticStyle:{float:"right","font-size":"23px",cursor:"point"},on:{click:function(e){t.showModal=!1}}})]),s("div",{attrs:{slot:"body"},slot:"body"},[s("v-card",{attrs:{dark:""}},[s("v-tabs",{attrs:{"fixed-tabs":""}},[s("v-tab",[t._v(" 일간 누적 생산량 ")]),s("v-tab",[t._v(" 주간 누적 생산량 ")]),s("v-tab",[t._v(" 월간 누적 생산량 ")]),s("v-tab-item",[s("v-card",{attrs:{flat:""}},[s("v-data-table",{staticClass:"elevation-1",attrs:{headers:t.headers,items:t.day,dark:"","hide-default-footer":"","disable-pagination":"","sort-by":["date","count"],"sort-desc":["true","false"]}})],1)],1),s("v-tab-item",[s("v-card",{attrs:{flat:""}},[s("v-data-table",{staticClass:"elevation-2",attrs:{headers:t.headers,items:t.weekly,dark:"","hide-default-footer":"","disable-pagination":""}})],1)],1),s("v-tab-item",[s("v-card",{attrs:{flat:""}},[s("v-data-table",{staticClass:"elevation-3",attrs:{headers:t.headers,items:t.monthly,dark:"","hide-default-footer":"","disable-pagination":""}})],1)],1)],1)],1)],1)]):t._e()],1)},Q=[],U=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"modal"}},[a("div",{attrs:{id:"mask"},on:{click:function(e){return t.$emit("close")}}}),a("div",{staticClass:"modal-mask"},[a("div",{staticClass:"modal-wrapper"},[a("div",{staticClass:"modal-container"},[a("div",{staticClass:"modal-header"},[t._t("header",[t._v(" default header ")])],2),a("div",{staticClass:"modal-body"},[t._t("body",[t._v(" default body ")])],2)])])])])},J=[],q={},W=q,X=(a("7388"),Object(d["a"])(W,U,J,!1,null,null,null)),Z=X.exports,Y={components:{Modal:Z},created:function(){this.$socket.emit("setCount1Day"),this.$socket.emit("setCount1Week"),this.$socket.emit("setCount1Month"),this.$socket.emit("setCount")},sockets:{count:function(t){this.productVal=t},days:function(t){"number"==typeof t?(this.day[this.day.length-1].count=t,this.weekly[this.weekly.length-1].count++,this.monthly[this.monthly.length-1].count++):this.day=t,this.$socket.emit("setMeanCycleTime"),this.$socket.emit("setCycleTimeList")},weeklys:function(t){this.weekly=t},monthlys:function(t){this.monthly=t}},data:function(){return{productVal:"-",startlist:"",endlist:"",doItem:"",showModal:!1,headers:[{text:"Date",align:"start",sortable:!1,value:"date"},{text:"Count",value:"count"}],day:"",weekly:"",monthly:""}},methods:{productEvt:function(){this.productVal="result"},modalShow:function(){this.showModal=!0},clearInput:function(){this.doItem=""}}},G=Y,K=(a("d9a9"),Object(d["a"])(G,R,Q,!1,null,null,null)),tt=K.exports,et=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"CycleTime",on:{keyup:function(e){if(!e.type.indexOf("key")&&t._k(e.keyCode,"esc",27,e.key,["Esc","Escape"]))return null;t.showModal=!1}}},[s("a",{attrs:{id:"cycleTimeTitle"}},[t._v("Cycle Time(Latest 5)")]),s("div",{staticStyle:{float:"right","margin-right":"10px","margin-top":"3.5px"}},[s("button",{attrs:{id:"productEvt"},on:{click:t.addTodo}},[s("img",{staticStyle:{width:"16px","z-index":"8"},attrs:{src:a("9417")}})])]),s("p",{attrs:{id:"cycleVal"}},[t._v(t._s(t.cycleTimeVal))]),t.showModal?s("Modal",{on:{close:function(e){t.showModal=!1}}},[s("h3",{staticStyle:{"margin-top":"20px"},attrs:{slot:"header"},slot:"header"},[s("span",{staticStyle:{"margin-left":"15px"}},[t._v("Cycle Time History")]),s("i",{staticClass:"fa fa-times closeModalBtn",staticStyle:{float:"right","font-size":"23px cursor:pointer"},on:{click:function(e){t.showModal=!1}}})]),s("div",{attrs:{slot:"body"},slot:"body"},[s("PlanetChart",{staticStyle:{"margin-bottom":"15px"}}),s("p",{attrs:{id:"ct100"}},[t._v("Cycle Time(Latest 100)")]),s("v-data-table",{staticClass:"elevation-1",attrs:{"sort-by":["start","end","ct"],"sort-desc":["true","false","false"],headers:t.headers,items:t.ctAvgVal,dark:"","hide-default-footer":"","disable-pagination":""}})],1)]):t._e()],1)},at=[],st=(a("ac1f"),a("1276"),function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)}),nt=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("canvas",{attrs:{id:"planet-chart",height:"100"}})])}],it=a("30ef"),ot=a.n(it),lt=a("a9be"),rt=a.n(lt),ct={name:"PlanetChart",mounted:function(){var t=document.getElementById("planet-chart");ot.a.defaults.global.defaultFontColor="#D3D3D3",ot.a.plugins.register(rt.a),new ot.a(t,this.$store.state.ctLineData)}},dt=ct,ut=Object(d["a"])(dt,st,nt,!1,null,null,null),ft=ut.exports,ht={components:{Modal:Z,PlanetChart:ft},name:"CycleTime",created:function(){this.$socket.emit("setMeanCycleTime")},sockets:{cycleTimeMean:function(t){var e=this.numToMS(t);this.cycleTimeVal=e},cycleTimeHistory:function(t){for(var e=[],a=0;a<t.length;a++)"undefined"!=typeof t[a]&&e.push(t[a]);this.ctAvgVal=e},ctChart:function(t){var e=this.$store.state.ctLineData;e.data.labels=t[0],e.data.datasets[0].data=t[1];for(var a=0;a<e.data.labels.length;a++)"undefined"!=typeof e.data.labels[a]&&(e.data.labels[a]=e.data.labels[a].split(" ")[1]);this.$store.dispatch("callCTHistory",{ctHistory:e})}},data:function(){return{cycleTimeVal:"-",ctAvgVal:"-",doItem:"",showModal:!1,headers:[{text:"Start Time",align:"start",sortable:!1,value:"start"},{text:"End Time",value:"end"},{text:"Cycle Time",value:"ct"}]}},methods:{numToMS:function(t){var e=t/1e3,a=parseInt(e/60);e%=60;var s="";return a>0&&(s=parseInt(a)+"분"),e>0&&(s=s+" "+parseInt(e)+"초"),s},addTodo:function(){this.showModal=!0}}},pt=ht,mt=(a("313f"),Object(d["a"])(pt,et,at,!1,null,null,null)),vt=mt.exports,bt={name:"TopPanel",components:{Opsituation:B,Product:tt,CycleTime:vt}},yt=bt,jt=(a("9b31"),Object(d["a"])(yt,z,$,!1,null,null,null)),gt=jt.exports,_t=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"AIPanel"},[a("div",{attrs:{id:"panel"}},[a("div",{attrs:{id:"loss1s"}},[a("Loss1s")],1),a("div",{attrs:{id:"anomalyData"}},[a("AnomalyData")],1)])])},At=[],xt=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"Loss1s",style:{background:t.lossStateColor}},[a("p",{attrs:{id:"loss1sTitle"}},[t._v("MAE(s)")]),a("p",{style:{color:t.lossTxtColor},attrs:{id:"loss1sVal"}},[t._v(t._s(t.loss))])])},Tt=[],Ct=(a("caad"),a("2532"),a("b680"),0),kt={name:"Loss1s",sockets:{loss:function(t){t.includes("n")?this.loss="-":this.loss=parseFloat(t).toFixed(4)},alert:function(){this.anomalyAlarm()}},data:function(){return{loss:"-",lossStateColor:"#3F6164",lossTxtColor:"#ffffff"}},methods:{anomalyAlarm:function(){var t=this;this.stateMessage=!1;var e=new Date;Ct=e.getTime(),this.lossTxtColor="#ffffff",setTimeout((function(){t.lossTxtColor="#ff0500"}),300),setTimeout((function(){var e=new Date,a=e.getTime();a-Ct>=2e3&&(t.lossTxtColor="#ffffff",t.stateMessage=!0,t.$store.dispatch("callAnomaly",{anomalyState:t.stateMessage}))}),2e3),this.$store.dispatch("callAnomaly",{anomalyState:this.stateMessage})}}},wt=kt,St=(a("b7d4"),Object(d["a"])(wt,xt,Tt,!1,null,null,null)),Ot=St.exports,Pt=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"anomalyData",style:{background:t.stateColor}},[a("p",{attrs:{id:"anomalyTitle"}},[t._v("Anomaly Detection")]),a("p",{style:{color:t.stateTxt},attrs:{id:"anomalyState"}},[t._v(t._s(t.anomalyState))])])},Mt=[],Et=0,Lt={name:"anomalyData",sockets:{alert:function(){this.anomalyAlarm()},anomalyDetection:function(t){this.anomalyState=t}},data:function(){return{anomalyState:"-",stateColor:"#3F6164",stateTxt:"#ffffff"}},methods:{anomalyAlarm:function(){var t=this;this.stateMessage=!1;var e=new Date;Et=e.getTime(),this.stateTxt="#ffffff",setTimeout((function(){t.stateTxt="#ff0500"}),300),setTimeout((function(){var e=new Date,a=e.getTime();a-Et>=2e3&&(t.stateTxt="#ffffff",t.stateMessage=!0,t.$store.dispatch("callAnomaly",{anomalyState:t.stateMessage}))}),2e3),this.$store.dispatch("callAnomaly",{anomalyState:this.stateMessage})}}},It=Lt,zt=(a("77d3"),Object(d["a"])(It,Pt,Mt,!1,null,null,null)),$t=zt.exports,Vt={name:"AIPanel",components:{Loss1s:Ot,AnomalyData:$t}},Nt=Vt,Dt=(a("d3b7"),Object(d["a"])(Nt,_t,At,!1,null,null,null)),Ft=Dt.exports,Ht=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ChartArea"},[a("iframe",{attrs:{src:t.iframeSource,width:"100%",height:"700",frameborder:"0"}})])},Bt=[],Rt={name:"ChartArea",data:function(){return{iframeSource:"http://9.8.100.156:3000/d/-Vt3X0qGk/hninc-cnc-tul-buha-moniteoring-solrusyeon?orgId=1&from=now-2m&to=now&refresh=5s&kiosk=tv"}}},Qt=Rt,Ut=(a("03ae"),Object(d["a"])(Qt,Ht,Bt,!1,null,"4a53de22",null)),Jt=Ut.exports,qt={components:{StatusPanel:gt,ChartArea:Jt,AIPanel:Ft},data:function(){return{headerFac:"제 1 공장",headerLine:"1 라인",headerOP:"공정 1"}}},Wt=qt,Xt=(a("5970"),Object(d["a"])(Wt,L,I,!1,null,"0f0c24d6",null)),Zt=Xt.exports,Yt=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"Breadcrumbs"},[a("div",{attrs:{id:"headerTitle"}},[a("span",{staticClass:"headerTitleTxt",staticStyle:{"padding-left":"0px"}},[t._v(t._s(t.headerFac))]),t._v(" "),a("span",{staticClass:"headerTitleTxt"},[t._v(t._s(t.headerLine))]),t._v(" "),a("span",{staticClass:"headerTitleTxt",staticStyle:{border:"none"}},[t._v(t._s(t.headerOP))])])])])},Gt=[],Kt={data:function(){return{headerFac:"제 1 공장",headerLine:"1 라인",headerOP:"공정 2"}}},te=Kt,ee=(a("3721"),Object(d["a"])(te,Yt,Gt,!1,null,"2ed0e1e6",null)),ae=ee.exports,se=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"Breadcrumbs"},[a("div",{attrs:{id:"headerTitle"}},[a("span",{staticClass:"headerTitleTxt",staticStyle:{"padding-left":"0px"}},[t._v(t._s(t.headerFac))]),t._v(" "),a("span",{staticClass:"headerTitleTxt"},[t._v(t._s(t.headerLine))]),t._v(" "),a("span",{staticClass:"headerTitleTxt",staticStyle:{border:"none"}},[t._v(t._s(t.headerOP))])])])])},ne=[],ie={data:function(){return{headerFac:"제 1 공장",headerLine:"2 라인",headerOP:"공정 3"}}},oe=ie,le=(a("c92a"),Object(d["a"])(oe,se,ne,!1,null,"ad8d8ba4",null)),re=le.exports,ce=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"Breadcrumbs"},[a("div",{attrs:{id:"headerTitle"}},[a("span",{staticClass:"headerTitleTxt",staticStyle:{"padding-left":"0px"}},[t._v(t._s(t.headerFac))]),t._v(" "),a("span",{staticClass:"headerTitleTxt"},[t._v(t._s(t.headerLine))]),t._v(" "),a("span",{staticClass:"headerTitleTxt",staticStyle:{border:"none"}},[t._v(t._s(t.headerOP))])])])])},de=[],ue={data:function(){return{headerFac:"제 1 공장",headerLine:"2 라인",headerOP:"공정 4"}}},fe=ue,he=(a("e63a"),Object(d["a"])(fe,ce,de,!1,null,"509df6e4",null)),pe=he.exports,me=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"Breadcrumbs"},[a("div",{attrs:{id:"headerTitle"}},[a("span",{staticClass:"headerTitleTxt",staticStyle:{"padding-left":"0px"}},[t._v(t._s(t.headerFac))]),t._v(" "),a("span",{staticClass:"headerTitleTxt"},[t._v(t._s(t.headerLine))]),t._v(" "),a("span",{staticClass:"headerTitleTxt",staticStyle:{border:"none"}},[t._v(t._s(t.headerOP))])])])])},ve=[],be={data:function(){return{headerFac:"제 2 공장",headerLine:"3 라인",headerOP:"공정 5"}}},ye=be,je=(a("9ff5"),Object(d["a"])(ye,me,ve,!1,null,"23dc7a0e",null)),ge=je.exports;s["default"].use(E["a"]);var _e=new E["a"]({mode:"history",routes:[{path:"/",name:"Op1Main",component:Zt},{path:"/op1",name:"Op1Main",component:Zt},{path:"/op2",name:"Op2Main",component:ae},{path:"/op3",name:"Op3Main",component:re},{path:"/op4",name:"Op4Main",component:pe},{path:"/op5",name:"Op5Main",component:ge}]});s["default"].use(M.a),s["default"].prototype.$socket=new C.a({debug:!1,connection:"http://9.8.100.153:1234",options:{transports:["websocket"]},upgrade:!1}),s["default"].use(s["default"].prototype.$socket),s["default"].use(x["a"]);var Ae=new x["a"].Store({state:{anomaly:!0,interval:"5s",refresh:!1,ctLineData:{type:"bar",data:{labels:[],datasets:[{label:"Cycle Time(Latest 10)",data:[],backgroundColor:"#465942",borderColor:"#465942",borderWidth:1}]},options:{legend:{display:!0,position:"top",align:"end"},responsive:!0,lineTension:1,scales:{yAxes:[{scaleLabel:{display:!0,labelString:"sec"},ticks:{beginAtZero:!0,padding:25}}]}}}},mutations:{changeAnomalyState:function(t,e){t.anomaly=e},changeInterval:function(t,e){t.interval=e},changeCTHistory:function(t,e){t.ctLineData=e}},actions:{callAnomaly:function(t,e){var a=t.commit,s=e.anomalyState;a("changeAnomalyState",s)},callInterval:function(t,e){var a=t.commit,s=e.selInterval;a("changeInterval",s)},callCTHistory:function(t,e){var a=t.commit,s=e.ctHistory;a("changeCTHistory",s)}}});s["default"].config.productionTip=!1,new s["default"]({router:_e,store:Ae,vuetify:O,render:function(t){return t(A)}}).$mount("#app")},5970:function(t,e,a){"use strict";a("89df")},6391:function(t,e,a){"use strict";a("7f22")},7388:function(t,e,a){"use strict";a("354c")},"74e4":function(t,e,a){},"754f":function(t,e,a){},"77d3":function(t,e,a){"use strict";a("74e4")},"7f22":function(t,e,a){},"85ec":function(t,e,a){},"89df":function(t,e,a){},"8d50":function(t,e,a){},9417:function(t,e,a){t.exports=a.p+"img/info.2476d52e.png"},"95ff":function(t,e,a){},"9b31":function(t,e,a){"use strict";a("4d38")},"9ff5":function(t,e,a){"use strict";a("a723")},a2c9:function(t,e,a){},a3db:function(t,e,a){"use strict";a("d70f")},a723:function(t,e,a){},a80f:function(t,e,a){},b7d4:function(t,e,a){"use strict";a("754f")},c92a:function(t,e,a){"use strict";a("fb24")},cbcd:function(t,e,a){},cf05:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAoCAQAAAAr6QChAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflARoGESTjzgWpAAAC/UlEQVRIx62XS2jUQBjHf5PNVlvUghVRFBTXpXqyKLWgiIggelEsHqRSvFQtBVEpePCgB0GwF+vjIiLiE6VILT5wwVaEgo+DYK1ixYu1UuujVquydtt8HpLdTTbpJgP+c8l++80vM//MN5NROBKAUg6zAYvoipHiGKOqWI4giJKD8lf01ClJsTtWFI3Uyg9N9FNJ2G3D4Al5qYkekNXR0DE5o4nOyN5QtANfI8Oa8HsyPRralMua6J+yIRTtwKvlqya8TUrC4QYAW6mIMqlzSnOJMVAhaSZQwUYtNLyg2x51VtnHeMdiAMuo1ISn+O43N7jnqygriPZzljRQzg4SrvhNuolhcQeoo4YJFBP0couRXE6SXcQRFCmkRNp9r+uxlDpV2+SJ75ZsNSu5kotacl7K7L4Lsl4yTvyowSySvvEoTOfuExNeE5Xtr7jiinq2uRwad+4sg3nMDjZWud9UccU5wHx8vhvMZ5rm6wxSFXv8QYO5lBRppIh5bfFpwln/G1hZ+JdJhad5ofq56kK+DcgYpJeNwBya2UnaCy9uyjPqQwz5ywmSJIDNbOGG1xYzpLF4riBjX3EaC5hKM7Pcm6QRsmMalDAldwUbqLjIIwCqacA1aUz+FIWv4lDOc8Up7gbCR2hhBTOARsby3TX5jhU4C2zNYZPrV8ekeQ+4RiOwgCbi+WEP5Soq2HF3hU5u4TitvAMgkZ/aBh9DjImqPk4VPtxggOH/AofLPCyEf+b9ZI4EhXzzMb8EjXCcH174L3oi921pSFV00eJa2VEC27lSMIO/cJ8xFBaLWOdaGUfp5BsZWuljLZVYKEa5zW+VHalJNUswERTPEWSxfNDc+w9IQOE+wRcVJC5tmvCUvVOFyQAydHhmc7hqWB4lza7NTl5rwcupQxH+UaQABrmuBYdaqiLlCYIslDeavp+XeBTfbfx+sbTgv6Q2wie0A58pXZp977GPLNHwa2VIE98uFVEPAMg+SWviL9j4YKk8HijlJHVaR0XhHEfs8vfrH3608+EcP0SeAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAxLTI2VDA2OjE3OjI5KzAwOjAwH/EigwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMS0yNlQwNjoxNzoyOSswMDowMG6smj8AAAAASUVORK5CYII="},d3b7:function(t,e,a){"use strict";a("a80f")},d70f:function(t,e,a){},d9a9:function(t,e,a){"use strict";a("95ff")},da91:function(t,e,a){},de84:function(t,e,a){},e63a:function(t,e,a){"use strict";a("cbcd")},efa6:function(t,e,a){"use strict";a("8d50")},fb24:function(t,e,a){}});
//# sourceMappingURL=app.8070f364.js.map