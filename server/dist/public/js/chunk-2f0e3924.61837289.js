(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2f0e3924"],{"07ac":function(e,t,n){var r=n("23e7"),o=n("6f53").values;r({target:"Object",stat:!0},{values:function(e){return o(e)}})},"0a14":function(e,t,n){"use strict";n("7db0"),n("d3b7");function r(e,t){if(e<=10||e>=20){if(e%10===1)return t[1];if(e%10>=2&&e%10<=4)return t[2]}return t[0]}t["a"]=function(e){var t=[{id:"MONTH",desc:["месяцев","месяц","месяца"]},{id:"YEAR",desc:["лет","год","года"]},{id:"DAYS",desc:["дней","день","дня"]}],n=t.find((function(t){return t.id===e.duration_id}));return n?r(e.term,n.desc):""}},1148:function(e,t,n){"use strict";var r=n("da84"),o=n("5926"),i=n("577e"),c=n("1d80"),a=r.RangeError;e.exports=function(e){var t=i(c(this)),n="",r=o(e);if(r<0||r==1/0)throw a("Wrong number of repetitions");for(;r>0;(r>>>=1)&&(t+=t))1&r&&(n+=t);return n}},"388a":function(e,t,n){"use strict";n("45a4")},"45a4":function(e,t,n){},"5b0b":function(e,t,n){"use strict";n.r(t);var r=n("f2bf");function o(e,t,n,o,i,c){var a=Object(r["resolveComponent"])("PreviewMain");return Object(r["openBlock"])(),Object(r["createBlock"])(a)}var i=n("8afd"),c={class:"page"},a={key:1,id:"element-to-print2",style:{position:"relative"},class:"pdf other second1"},s={key:2,id:"element-to-print3",class:"pdf other"},u={key:3,class:"pdf other",id:"element-to-print4"},d={class:"page"},l={key:4,class:"pdf other",id:"element-to-print5"},m={key:5,class:"pdf other",id:"element-to-print6"},f={class:"page"};function h(e,t,n,o,i,h){var p=Object(r["resolveComponent"])("CommonQuestionnaireActions"),v=Object(r["resolveComponent"])("FirstQuestionnaireTemplate"),g=Object(r["resolveComponent"])("SecondQuestionnaireTemplate"),b=Object(r["resolveComponent"])("common-questionnaire-template-portfolios"),y=Object(r["resolveComponent"])("common-questionnaire-template-comment"),O=Object(r["resolveComponent"])("common-questionnaire-template-chart"),C=Object(r["resolveComponent"])("common-questionnaire-template-info");return Object(r["openBlock"])(),Object(r["createElementBlock"])(r["Fragment"],null,[Object(r["createVNode"])(p,{pending:e.pending,questionnaire_id:e.questionnaire_id,pendingStudent:e.pendingStudent,pendingOnePage:e.pendingOnePage,loading:e.loading,onCreate:e.create,onCreateOnePage:e.createOnePage},null,8,["pending","questionnaire_id","pendingStudent","pendingOnePage","loading","onCreate","onCreateOnePage"]),e.ready?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",{key:0,class:Object(r["normalizeClass"])(["pdf",e.course]),id:"element-to-print1"},[Object(r["createElementVNode"])("div",c,["one"===e.course?(Object(r["openBlock"])(),Object(r["createBlock"])(v,{key:0,expert:e.expert,student:e.student,targets:e.targets},null,8,["expert","student","targets"])):Object(r["createCommentVNode"])("",!0),"two"===e.course?(Object(r["openBlock"])(),Object(r["createBlock"])(g,{key:1,expert:e.expert,student:e.student,targets:e.targets},null,8,["expert","student","targets"])):Object(r["createCommentVNode"])("",!0)])],2)):Object(r["createCommentVNode"])("",!0),e.ready&&e.targets[0]?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",a,[Object(r["createVNode"])(b,{course:e.course,target:e.targets[0]},null,8,["course","target"])])):Object(r["createCommentVNode"])("",!0),e.ready&&e.targets[1]?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",s,[Object(r["createVNode"])(b,{course:e.course,target:e.targets[1]},null,8,["course","target"])])):Object(r["createCommentVNode"])("",!0),e.ready?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",u,[e.targets[2]?(Object(r["openBlock"])(),Object(r["createBlock"])(b,{key:0,course:e.course,target:e.targets[2]},null,8,["course","target"])):Object(r["createCommentVNode"])("",!0),Object(r["createElementVNode"])("div",d,[Object(r["createVNode"])(y,{course:e.course,commonComment:e.commonComment},null,8,["course","commonComment"])])])):Object(r["createCommentVNode"])("",!0),e.ready?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",l,[(Object(r["openBlock"])(!0),Object(r["createElementBlock"])(r["Fragment"],null,Object(r["renderList"])(e.targets,(function(t){return Object(r["openBlock"])(),Object(r["createBlock"])(O,{course:e.course,chart:t.chart,number:t.number,key:t.id},null,8,["course","chart","number"])})),128))])):Object(r["createCommentVNode"])("",!0),e.ready?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",m,[Object(r["createElementVNode"])("div",f,[Object(r["createElementVNode"])("main",{class:Object(r["normalizeClass"])(e.course)},[Object(r["createVNode"])(C,{course:e.course,content:"one"===e.course?e.preview.firstQuestionnaireInfo:e.preview.secondQuestionnaireInfo},null,8,["course","content"])],2)])])):Object(r["createCommentVNode"])("",!0)],64)}var p=n("b85c"),v=n("2909"),g=n("1da1"),b=n("5530"),y=(n("96cf"),n("d3b7"),n("3ca3"),n("ddb0"),n("159b"),n("a9e3"),n("ac1f"),n("5319"),n("b0c0"),n("99af"),n("b680"),n("d81d"),n("4de4"),n("7db0"),n("caad"),n("2532"),n("498a"),n("07ac"),n("e439"),n("5c40")),O=n("5502"),C=n("0a14"),j=[{id:"NOT_PERIOD",period:0,months:0},{id:"MONTHLY",period:12,months:1},{id:"QUARTERLY",period:4,months:3},{id:"SEMIANNUALLY",period:2,months:6},{id:"ANNUALLY",period:1,months:12}],_=[{id:12,list:[{id:[0,0],value:"Январь"},{id:[1,1],value:"Февраль"},{id:[2,2],value:"Март"},{id:[3,3],value:"Апрель"},{id:[4,4],value:"Май"},{id:[5,5],value:"Июнь"},{id:[6,6],value:"Июль"},{id:[7,7],value:"Август"},{id:[8,8],value:"Сентябрь"},{id:[9,9],value:"Октябрь"},{id:[10,10],value:"Ноябрь"},{id:[11,11],value:"Декабрь"}]},{id:4,list:[{id:[0,2],value:"Первый квартал"},{id:[3,5],value:"Второй квартал"},{id:[6,8],value:"Третий квартал"},{id:[9,11],value:"Четвертый квартал"}]},{id:2,list:[{id:[0,5],value:"Первое полугодие"},{id:[6,11],value:"Второе полугодие"}]},{id:1,list:[{id:[0,11],value:""}]}],w=function(e,t){var n;if(0!==t){var r=new Date(e),o=r.getMonth(),i=null===(n=_.find((function(e){return e.id===t})))||void 0===n?void 0:n.list;if(!i)return"";var c=i.find((function(e){return e.id[0]<=o&&e.id[1]>=o}));return c?"".concat(c.value," ").concat(r.getFullYear()," г."):""}},k=function(e){return"MONTH"===e.duration_id?Number(e.term)/12:Number(e.term)},x=function(e){var t;return(null===(t=j.find((function(t){return t.id===e})))||void 0===t?void 0:t.period)||0},P=function(e){var t;return(null===(t=j.find((function(t){return t.id===e})))||void 0===t?void 0:t.months)||0},N=function(e,t,n){return e*Math.pow(1+t,n)},E=function(e,t,n){return e*Math.pow(1+t,n)},M=function(e,t,n,r,o,i,c,a,s,u){if(0===n)return[];var d=[],l=0,m=new Date;m.setDate(m.getDate()+7),Number(u(e,a))>0&&e.forEach((function(e){l+=Number(u([e],a)),d=[].concat(Object(v["a"])(d),[{date:w(m,n),amount:e.data.amount,sign:e.data.currency_sign,profitability:0,capital:l,currency:a}])}));for(var f=function(t){m.setMonth(m.getMonth()+r);var c=d.length-1;e.forEach((function(e){l+=Number(u([e],a));var t=d[c]?Number((l*i/n).toFixed(1)):0,r=d[c]?Number((l+t).toFixed(1)):0;d=[].concat(Object(v["a"])(d),[{date:w(m,n),amount:o,sign:s,profitability:t,capital:r,currency:a}])}))},h=0;h<t*n;h++)f(h);return d},B={currentTerm:k,currentPeriod:x,currentMonths:P,FV:N,FV1:E,chartFill:M};function S(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function T(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function q(e,t,n){return t&&T(e.prototype,t),n&&T(e,n),e}n("cb29");var A=function(e,t,n,r,o){var i=document.getElementById(e+r),c=document.getElementById(t+r);if(i&&c){c.width=500,c.height=500;var a=n,s=function(){function e(t){S(this,e),this.options=t,this.canvas=t.canvas,this.ctx=this.canvas.getContext("2d"),this.colors=t.colors}return q(e,[{key:"draw",value:function(){var e=0,t=0;for(var n in this.options.data)e+=Number(this.options.data[n]);var r=0;for(var i in this.options.data){var c=2*Math.PI*Number(this.options.data[i])/e;d(this.ctx,this.canvas.width/2,this.canvas.height/2,Math.min(this.canvas.width/2,this.canvas.height/2),r,r+c,this.colors[t%this.colors.length]),r+=c,t++}for(var a in this.options.doughnutHoleSize&&d(this.ctx,this.canvas.width/2,this.canvas.height/2,this.options.doughnutHoleSize*Math.min(this.canvas.width/2,this.canvas.height/2),0,2*Math.PI,"#ff0000"),r=0,this.options.data){var s=2*Math.PI*Number(this.options.data[a])/e,u=Math.min(this.canvas.width/2,this.canvas.height/2);this.canvas.width,Math.cos(r+s/2),this.canvas.height,Math.sin(r+s/2);if(this.options.doughnutHoleSize){var l=u*this.options.doughnutHoleSize/2;this.canvas.width/2+(l+u/2)*Math.cos(r+s/2),this.canvas.height/2+(l+u/2)*Math.sin(r+s/2)}r+=s}if(this.options.legend){t=0;var m="";for(var f in this.options.data)2===o.length?m+="<div style='margin-bottom: 5px;'><span style='display:inline-block;position:relative;top:-2px;margin-right:5px;width:12px;height:12px;border-radius:50%;background-color:"+this.colors[t++]+";'>&nbsp;</span> "+f+" "+this.options.data[f]+"%</div>":m+="<div style='display: flex; align-items: center; line-height: 6pt; margin-bottom: 5px; max-width: 100%; height: 15px; vertical-align: top; margin-right: 10px;'><div style='margin-right: 5px; min-width: 12px; width: 12px; height: 12px; border-radius: 50%; background-color:"+this.colors[t++]+";'>&nbsp;</div> <div style=''>"+f+" "+this.options.data[f]+"%</div></div>";this.options.legend.innerHTML=m}}}]),e}(),u=new s({canvas:c,data:a,colors:o,legend:i});u.draw()}function d(e,t,n,r,o,i,c){e.fillStyle=c,e.beginPath(),e.moveTo(t,n),e.arc(t,n,r,o,i),e.closePath(),e.fill()}},F=function(e,t){var n,r=Object(p["a"])(e);try{for(r.s();!(n=r.n()).done;){var o,i=n.value,c=Object(p["a"])(i.portfolios);try{for(c.s();!(o=c.n()).done;){var a=o.value;if(1===Number(i.status[a.id])){var s=a.ct_percents,u=a.core.class_percents,d=a.core.country_percents,l=a.core.currency_percents,m=a.core.section_percents,f=a.core.conserv_percents,h=a.core.stock_percents,v=a.core.bond_period_percents,g=a.core.stock_risk_percents,b=a.core.index,y=i.number;A(y+"myLegend",y+"myCanvas",s,b,t),A(y+"myLegend1",y+"myCanvas1",u,b,t),A(y+"myLegend2",y+"myCanvas2",d,b,t),A(y+"myLegend3",y+"myCanvas3",l,b,t),A(y+"myLegend4",y+"myCanvas4",m,b,t),A(y+"myLegend5",y+"myCanvas5",f,b,t),A(y+"myLegend6",y+"myCanvas6",h,b,t),A(y+"myLegend7",y+"myCanvas7",v,b,t),A(y+"myLegend8",y+"myCanvas8",g,b,t)}}}catch(O){c.e(O)}finally{c.f()}}}catch(O){r.e(O)}finally{r.f()}},L=n("7ae0"),R=n("357b"),Q=Object(y["D"])((function(){return n.e("chunk-436f9ff2").then(n.bind(null,"3322"))})),D=Object(y["D"])((function(){return n.e("chunk-73a04834").then(n.bind(null,"f561"))})),V=Object(y["D"])((function(){return n.e("chunk-a54e6bc6").then(n.bind(null,"213b"))})),I=Object(y["D"])((function(){return n.e("chunk-58bac524").then(n.bind(null,"ffad"))})),U=Object(y["D"])((function(){return n.e("chunk-f246f344").then(n.bind(null,"628c"))})),Y=Object(y["D"])((function(){return n.e("chunk-33fb9f5a").then(n.bind(null,"55cf"))})),H=Object(y["D"])((function(){return n.e("chunk-9b14eb30").then(n.bind(null,"f33e"))})),z=Object(y["E"])({name:"PreviewMain",data:function(){return{targets:[],periods:{NOT_PERIOD:"без пополнений",MONTHLY:"мес.",QUARTERLY:"кварт.",SEMIANNUALLY:"раз в полгода",ANNUALLY:"год"},student:{},expert:{},commonComment:"",ready:!1,loading:!0,avatar:"",pending:!1,pendingStudent:!1,pendingOnePage:!1,questionnaire_id:this.$attrs._id,course:"",mixedAssets:[],combine:!1}},computed:Object(b["a"])({},Object(O["b"])(["preview","currencies"])),created:function(){this.getMixedAssets()},mounted:function(){if(!this.questionnaire_id)return this.$router.push("/");this.jq("#app > main > header").remove(),this.getQuestionnaire(),this.emitter.on("sendQuestionnaire",this.sendQuestionnaireEmitter)},unmounted:function(){this.emitter.off("sendQuestionnaire",this.sendQuestionnaireEmitter)},methods:{getMixedAssets:function(){var e=this;return Object(g["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.API.common.getMixeds();case 2:n=t.sent,e.mixedAssets=n.data;case 4:case"end":return t.stop()}}),t)})))()},getQuestionnaire:function(){var e=this;return Object(g["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.API.questionnaire.getQuestionnaire(e.questionnaire_id);case 2:n=t.sent,setTimeout((function(){e.combine=!!n.data.content_COMBINE_EXPERT,e.course=n.data.course.type,e.transformData(n.data.content_EXPERT,n.data.expert),setTimeout((function(){F(e.targets,e.preview["one"===e.course?"firstQuestionnaireColors":"secondQuestionnaireColors"]),"true"===e.$router.currentRoute.value.query.collection?setTimeout((function(){e.loading=!1}),2e4):e.loading=!1}),200)}),100);case 4:case"end":return t.stop()}}),t)})))()},transformData:function(e,t){var n=this;this.student=e.student.data.module.data,this.expert=t,this.commonComment=e.comment.data.module.data.comment,e.targets.data.forEach((function(e){var t=e.type.sections[1].modules[0].data,r=e.conclusion.sections[0].modules[0].data.period_id,o=e.main.data.currency_id,i=e.main.data.currency_sign,c=B.currentTerm(t),a=n.getCorrectCurrency(e.type.sections[0].modules,o),s=n.getCorrectCurrency(e.type.sections[4].modules,o),u=e.main.data,d=u.profitability,l=u.inflation,m=d/100,f=l/100,h=B.FV(a,f,c),p=12*h/m;2===e.type.id&&(h=p),n.combine&&(h=Number(e.type.sections[3].modules[0].data.fv.replace(" ".concat(e.main.data.currency_sign),"")));var g={id:e.id,number:e.id,name:e.main.data.name,mainCurrency:o,type:e.type.id,income:a,resourses:s,term:"".concat(t.term," ").concat(Object(C["a"])(t)),riskPortfolio:n.getCorrectPortfolioTag(e.type.sections[5].modules[0].data.portfolio),conclusion:{amount:0,period:n.getCorrectPeriod(r),replenishment:n.getCorrectCurrency(e.conclusion.sections[1].modules,o),comment:e.conclusion.sections[3].modules[0].data.comment},chart:[],portfolios:n.getCurrentPortfolios(e,h),status:e.status,capital:0,passive:0,percent:0},b=B.FV(a,f,c);n.combine&&(b=Number(e.type.sections[3].modules[0].data.fv.replace(" ".concat(e.main.data.currency_sign),"")));var y=B.FV1(s,m,c),O=y/h*100,j=h-y,_=j/((Math.pow(1+m,c)-1)/m),w=B.currentPeriod(r),k=B.currentMonths(r),x=_/w<0?0:Number((_/w).toFixed(1));g.capital=Math.ceil10(p,-1),g.passive=Math.ceil10(b,-1),g.percent=O>100?100:Math.ceil10(O,-1),g.conclusion.amount=j<0?0:Math.ceil10(j,-1),g.chart=B.chartFill(e.type.sections[4].modules,c,w,k,x,m,g,o,i,n.getCorrectCurrency),n.targets=[].concat(Object(v["a"])(n.targets),[g])})),this.ready=!0},getCurrentPortfolios:function(e,t){var n,r=[],o=0,i=Object.typedKeys(e.portfolios),c=Object(p["a"])(i);try{for(c.s();!(n=c.n()).done;){var a=n.value;if(Object.hasOwnProperty.call(e.portfolios,a)){var s=e.portfolios[a],u=s.sections[1].modules.filter((function(e){return e.data.name&&e.data.price})).map((function(e){return e.data})),d="expert"!==a?s.sections[2].modules.filter((function(e){return e.data.name&&e.data.price})).map((function(e){return e.data})):[];r=[].concat(Object(v["a"])(r),[{id:a,ct_percents:{"Ядро":s.sections[0].modules[0].data.core,"Тактическая часть":s.sections[0].modules[0].data.tactic},mainAmount:"expert"!==a?this.getCorrectAmountCurrency([].concat(Object(v["a"])(u),Object(v["a"])(d)),e.main.data.currency_id,this.course):t.toFixed(2),core:{selected:!!u.find((function(e){return e.name&&e.price})),instruments:u,class_percents:this.getCorrectStructurePercents(a,!1,u,"class_"+this.course),country_percents:this.getCorrectStructurePercents(a,!1,u,"country_"+this.course),currency_percents:this.getCorrectStructurePercents(a,!1,u,"base_currency_".concat(this.course,"_id")),section_percents:this.getCorrectStructurePercents(a,!1,u,"section_"+this.course),conserv_percents:this.getCorrectStructurePercents(a,!1,u,"instrument_type_"+this.course),stock_risk_percents:this.getCorrectStructurePercents(a,!1,u,"instrument_type_"+this.course,"instrument_type_"+this.course,["Акции","Отраслевые ETF и БПИФ","ETF и БПИФ на акции широкого рынка (не отраслевые)"]),bond_period_percents:this.getCorrectStructurePercents(a,!1,u,"matdate"),stock_percents:this.getCorrectStructurePercents(a,!1,u,"section_"+this.course,"instrument_type_"+this.course,["Акции","Отраслевые ETF и БПИФ"]),index:o},tactic:{selected:!!s.sections[2]&&s.sections[2].selected,instruments:d},comments:{common:this.getCorrectComment(s,"conclusion-comment"),stock:this.getCorrectComment(s,"stock-comment"),bond:this.getCorrectComment(s,"bond-comment"),alternative:this.getCorrectComment(s,"alternative-comment"),tactic:this.getCorrectComment(s,"tactic-comment")}}]),o++}}}catch(l){c.e(l)}finally{c.f()}return r},getCurrentInstruments:function(e,t,n,r){var o=this;if(n&&r){if(t.includes("section_")||t.includes("instrument_type_"))return e.filter((function(e){return"stock"===e["class_".concat(o.course,"_id")]&&e["section_"+o.course]&&r.includes(e[n])}))}else{if("matdate"===t)return e.filter((function(e){return"bond"===e["class_".concat(o.course,"_id")]}));if(t.includes("section_"))return e.filter((function(e){return"stock"===e["class_".concat(o.course,"_id")]&&e["section_"+o.course]}));if(t.includes("instrument_type_"))return e.filter((function(e){return"bond"===e["class_".concat(o.course,"_id")]&&e["instrument_type_"+o.course]}))}return e},getCorrectComment:function(e,t){var n=e.sections.find((function(e){return e.default===t}));return n?this.parseLinks(n.modules[0].data.comment):""},parseLinks:function(e){return"<div>".concat(e.replace(/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g,'<a style="color: rgb(0, 89, 255);" href="$1">$1</a>').replace(/([*].+?[*])/g,"<strong>$1</strong>").replace(/\*/g,""),"</div>")},getCorrectStructurePercents:function(e,t,n,r,o,i){var c=this,a={},s=this.getCurrentInstruments(n,r,o,i);if(s.forEach((function(n){var o=n[r]?n[r].trim():n[r];if(a[o]||"matdate"===r||(a[o]=0),"expert"===e&&t)a[o]+=Number(n.percent);else{var i=c.course===L["b"].TWO&&n.lot?n.lot:1,s=n.price*n.number_papers*i,u=c.course===L["b"].ONE?Number(c.getUSDCurrency(s,n["currency_".concat(c.course,"_id")])):Number(c.getRUBCurrency(s,n["currency_".concat(c.course,"_id")]));if((r.includes("class_")||r.includes("section_"))&&"Фонды смешанных активов"===n["instrument_type_".concat(c.course)]){var d=c.mixedAssets.find((function(e){return e.name.toLowerCase().trim()===n.name.toLowerCase().trim()}));if(d){var l=R["b"];r.includes("section_")&&(a[o]+=u*(d.stock/100)),r.includes("class_")&&l.forEach((function(e){a[e[c.course]]||(a[e[c.course]]=0),a[e[c.course]]+=u*(d[e.id]/100)}))}}else if("matdate"===r){var m=new Date(n.matdate);if(+m){var f=new Date;f.setDate(f.getDate()+1460),f<=m?(a["Долгосрочные"]||(a["Долгосрочные"]=0),a["Долгосрочные"]+=u):(a["Краткосрочные"]||(a["Краткосрочные"]=0),a["Краткосрочные"]+=u)}}else a[o]+=u}})),Object.values(a).length>0&&"expert"===e&&t)for(var u in a)a[u]=Math.ceil10(a[u],-1);if(Object.values(a).length>0&&("expert"!==e||!t)){var d=Object.values(a).reduce((function(e,t){return e+t}));for(var l in a)Object.hasOwnProperty.call(a,l)&&(a[l]=(a[l]/d*100).toFixed(1))}return a&&a["Акции"]&&r===o&&r==="instrument_type_".concat(this.course)&&(Object.defineProperty(a,"Акции отдельных компаний",Object.getOwnPropertyDescriptor(a,"Акции")||""),delete a["Акции"]),a},getCorrectCurrency:function(e,t){var n=this.currencies;return Math.ceil10(e.reduce((function(e,r){return e+r.data.amount/n[r.data.currency_id]*n[t]}),0),-1)},getCorrectAmountCurrency:function(e,t,n){var r=this.currencies;return e=e.filter((function(e){return e.name})),e.reduce((function(e,o){return e+o.number_papers*("two"===n&&o.lot?o.lot:1)*o.price/r[o["currency_".concat(n,"_id")]]*r[t]}),0).toFixed(0)},getOtherCurrency:function(e,t,n){var r=this.currencies;return Math.ceil10(e/r[t]*r[n],-1)},getUSDCurrency:function(e,t){var n=this.currencies;return Math.ceil10(e/n[t],-1)},getRUBCurrency:function(e,t){var n=this.currencies;return Math.ceil10(e/n[t]*n["RUB"],-1)},division:function(e){var t=this,n=document.querySelectorAll("*");n.forEach((function(n){var r=t.jq(n).closest(e?".second2":".second1")||[],o=!!(r.length>0);o&&t.jq(n).addClass("eew")}));var r=this.jq(e?".second2":".second1").offset()||{top:0},o=r.top;this.jq("".concat(e?".second2":".second1"," .eew")).toArray().forEach((function(n){var r=t.jq(n).offset()||{top:o};e?r.top-o<7500&&(t.jq(n).height()||0)<2e3&&t.jq(n).addClass("hiddenEEW"):r.top-o>7500&&(t.jq(n).height()||0)<2e3&&t.jq(n).addClass("hiddenEEW")})),this.jq("".concat(e?".second2":".second1"," .hiddenEEW")).remove()},sendQuestionnaireEmitter:function(){this.createStudentFile()},createStudentFile:function(){var e=this;return Object(g["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.pendingStudent=!0,t.next=3,e.API.questionnaire.createStudentFile(e.questionnaire_id);case 3:e.pendingStudent=!1;case 4:case"end":return t.stop()}}),t)})))()},createOnePage:function(){var e=this;return Object(g["a"])(regeneratorRuntime.mark((function t(){var n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.pendingOnePage=!0,t.next=3,e.API.questionnaire.createPDFOnePage(e.questionnaire_id);case 3:n=t.sent,r=document.createElement("a"),r.href=n.data.src,r.download=n.data.name,r.click(),e.pendingOnePage=!1;case 9:case"end":return t.stop()}}),t)})))()},create:function(){var e=this;return Object(g["a"])(regeneratorRuntime.mark((function t(){var n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.pending=!0,t.next=3,e.API.questionnaire.createPDF(e.questionnaire_id);case 3:n=t.sent,r=document.createElement("a"),r.href=n.data.src,r.download=n.data.name,r.click(),e.pending=!1;case 9:case"end":return t.stop()}}),t)})))()},getCorrectPeriod:function(e){return this.periods[e]},getCorrectPortfolioTag:function(e){var t="one"===this.course?this.preview.firstQuestionnaireRisks.find((function(t){return t.name===e})):this.preview.secondQuestionnaireRisks.find((function(t){return t.name===e}));return t.icon=t.src,t}},components:{FirstQuestionnaireTemplate:Q,SecondQuestionnaireTemplate:D,CommonQuestionnaireActions:V,CommonQuestionnaireTemplateInfo:I,CommonQuestionnaireTemplateChart:U,CommonQuestionnaireTemplateComment:Y,CommonQuestionnaireTemplatePortfolios:H}}),$=(n("388a"),n("6b0d")),W=n.n($);const J=W()(z,[["render",h],["__scopeId","data-v-6e2c9c1d"]]);var X=J,K=Object(i["defineComponent"])({name:"Preview",components:{PreviewMain:X}});const G=W()(K,[["render",o]]);t["default"]=G},"6f53":function(e,t,n){var r=n("83ab"),o=n("e330"),i=n("df75"),c=n("fc6a"),a=n("d1e7").f,s=o(a),u=o([].push),d=function(e){return function(t){var n,o=c(t),a=i(o),d=a.length,l=0,m=[];while(d>l)n=a[l++],r&&!s(o,n)||u(m,e?[n,o[n]]:o[n]);return m}};e.exports={entries:d(!0),values:d(!1)}},"81d5":function(e,t,n){"use strict";var r=n("7b0b"),o=n("23cb"),i=n("07fa");e.exports=function(e){var t=r(this),n=i(t),c=arguments.length,a=o(c>1?arguments[1]:void 0,n),s=c>2?arguments[2]:void 0,u=void 0===s?n:o(s,n);while(u>a)t[a++]=e;return t}},b680:function(e,t,n){"use strict";var r=n("23e7"),o=n("da84"),i=n("e330"),c=n("5926"),a=n("408a"),s=n("1148"),u=n("d039"),d=o.RangeError,l=o.String,m=Math.floor,f=i(s),h=i("".slice),p=i(1..toFixed),v=function(e,t,n){return 0===t?n:t%2===1?v(e,t-1,n*e):v(e*e,t/2,n)},g=function(e){var t=0,n=e;while(n>=4096)t+=12,n/=4096;while(n>=2)t+=1,n/=2;return t},b=function(e,t,n){var r=-1,o=n;while(++r<6)o+=t*e[r],e[r]=o%1e7,o=m(o/1e7)},y=function(e,t){var n=6,r=0;while(--n>=0)r+=e[n],e[n]=m(r/t),r=r%t*1e7},O=function(e){var t=6,n="";while(--t>=0)if(""!==n||0===t||0!==e[t]){var r=l(e[t]);n=""===n?r:n+f("0",7-r.length)+r}return n},C=u((function(){return"0.000"!==p(8e-5,3)||"1"!==p(.9,0)||"1.25"!==p(1.255,2)||"1000000000000000128"!==p(0xde0b6b3a7640080,0)}))||!u((function(){p({})}));r({target:"Number",proto:!0,forced:C},{toFixed:function(e){var t,n,r,o,i=a(this),s=c(e),u=[0,0,0,0,0,0],m="",p="0";if(s<0||s>20)throw d("Incorrect fraction digits");if(i!=i)return"NaN";if(i<=-1e21||i>=1e21)return l(i);if(i<0&&(m="-",i=-i),i>1e-21)if(t=g(i*v(2,69,1))-69,n=t<0?i*v(2,-t,1):i/v(2,t,1),n*=4503599627370496,t=52-t,t>0){b(u,0,n),r=s;while(r>=7)b(u,1e7,0),r-=7;b(u,v(10,r,1),0),r=t-1;while(r>=23)y(u,1<<23),r-=23;y(u,1<<r),b(u,1,1),y(u,2),p=O(u)}else b(u,0,n),b(u,1<<-t,0),p=O(u)+f("0",s);return s>0?(o=p.length,p=m+(o<=s?"0."+f("0",s-o)+p:h(p,0,o-s)+"."+h(p,o-s))):p=m+p,p}})},cb29:function(e,t,n){var r=n("23e7"),o=n("81d5"),i=n("44d2");r({target:"Array",proto:!0},{fill:o}),i("fill")}}]);
//# sourceMappingURL=chunk-2f0e3924.61837289.js.map