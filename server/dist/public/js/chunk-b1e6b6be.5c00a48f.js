(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b1e6b6be"],{"0464":function(e,t,n){},"0f1c":function(e,t,n){},3663:function(e,t,n){"use strict";n("0464")},5900:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return o}));var r="Во время загрузки файла произошла ошибка!",a="Загрузить можно только файлы с расширением jpeg, jpg, png, webp!",o="Загрузить можно только файлы с расширением xlsx!"},"725f":function(e,t,n){},"7c0b":function(e,t,n){"use strict";n("725f")},"845d":function(e,t,n){"use strict";var r=n("f2bf"),a={class:"inputs"};function o(e,t,n,o,i,c){var l=Object(r["resolveComponent"])("Input");return Object(r["openBlock"])(),Object(r["createElementBlock"])("div",a,[(Object(r["openBlock"])(!0),Object(r["createElementBlock"])(r["Fragment"],null,Object(r["renderList"])(e.module.inputs,(function(t){return Object(r["openBlock"])(),Object(r["createBlock"])(l,{key:t.id,data:e.module.data,input:t,onToggleDrop:e.toggleDrop,onSelectDropElement:e.selectDropElement},null,8,["data","input","onToggleDrop","onSelectDropElement"])})),128))])}n("d3b7"),n("159b"),n("b0c0");var i=n("8afd"),c={class:"input"},l={key:0},d=["placeholder","data-id"],s=["type","data-id","placeholder"],u=["type","data-id","placeholder"],p=["type","data-id","placeholder"],m=["id","type","data-id","placeholder"],b=["type","data-id","placeholder"],f={key:0,class:"drop"},h=["onClick"];function j(e,t,n,a,o,i){var j=Object(r["resolveDirective"])("mask");return Object(r["openBlock"])(),Object(r["createElementBlock"])("div",c,[e.input.show?(Object(r["openBlock"])(),Object(r["createElementBlock"])("span",l,Object(r["toDisplayString"])(e.input.name),1)):Object(r["createCommentVNode"])("",!0),"textarea"===e.input.type?Object(r["withDirectives"])((Object(r["openBlock"])(),Object(r["createElementBlock"])("textarea",{key:1,placeholder:e.input.placeholder,"onUpdate:modelValue":t[0]||(t[0]=function(t){return e.data[e.input.id]=t}),"data-id":e.input.id},null,8,d)),[[r["vModelText"],e.data[e.input.id]]]):e.input.mask?Object(r["withDirectives"])((Object(r["openBlock"])(),Object(r["createElementBlock"])("input",{key:2,type:e.input.type,ref:e.input.id,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.data[e.input.id]=t}),"data-id":e.input.id,placeholder:e.input.placeholder,class:Object(r["normalizeClass"])({error:e.input.error}),maxlength:"80"},null,10,s)),[[j,e.input.mask],[r["vModelDynamic"],e.data[e.input.id]]]):e.input.formula_element?Object(r["withDirectives"])((Object(r["openBlock"])(),Object(r["createElementBlock"])("input",{key:3,type:e.input.type,ref:e.input.id,"onUpdate:modelValue":t[2]||(t[2]=function(t){return e.data[e.input.id]=t}),"data-id":e.input.id,placeholder:e.input.placeholder,class:Object(r["normalizeClass"])({error:e.input.error}),maxlength:"80"},null,10,u)),[[r["vModelDynamic"],e.data[e.input.id]]]):e.input.drop?Object(r["withDirectives"])((Object(r["openBlock"])(),Object(r["createElementBlock"])("input",{key:4,onClick:t[3]||(t[3]=function(t){return e.$emit("toggleDrop",e.input)}),type:e.input.type,"onUpdate:modelValue":t[4]||(t[4]=function(t){return e.data[e.input.id]=t}),"data-id":e.input.id,placeholder:e.input.placeholder,class:Object(r["normalizeClass"])({error:e.input.error,active:e.input.showDrop}),maxlength:"80"},null,10,p)),[[r["vModelDynamic"],e.data[e.input.id]]]):e.input.datepicker?Object(r["withDirectives"])((Object(r["openBlock"])(),Object(r["createElementBlock"])("input",{key:5,id:e.input.id,type:e.input.type,"onUpdate:modelValue":t[5]||(t[5]=function(t){return e.data[e.input.id]=t}),"data-id":e.input.id,placeholder:e.input.placeholder,class:Object(r["normalizeClass"])({error:e.input.error})},null,10,m)),[[r["vModelDynamic"],e.data[e.input.id]]]):Object(r["withDirectives"])((Object(r["openBlock"])(),Object(r["createElementBlock"])("input",{key:6,type:e.input.type,"onUpdate:modelValue":t[6]||(t[6]=function(t){return e.data[e.input.id]=t}),"data-id":e.input.id,placeholder:e.input.placeholder,class:Object(r["normalizeClass"])({error:e.input.error}),maxlength:"80"},null,10,b)),[[r["vModelDynamic"],e.data[e.input.id]]]),e.input.drop?(Object(r["openBlock"])(),Object(r["createElementBlock"])("img",{key:7,class:Object(r["normalizeClass"])({active:e.input.showDrop}),onClick:t[7]||(t[7]=function(t){return e.$emit("toggleDrop",e.input)}),src:"/images/common/arrow.svg",alt:"arrow"},null,2)):Object(r["createCommentVNode"])("",!0),Object(r["createVNode"])(r["Transition"],{name:"fade"},{default:Object(r["withCtx"])((function(){return[e.input.drop&&e.input.showDrop?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",f,[Object(r["createElementVNode"])("ul",null,[(Object(r["openBlock"])(!0),Object(r["createElementBlock"])(r["Fragment"],null,Object(r["renderList"])(e.input.drop_data,(function(t){return Object(r["openBlock"])(),Object(r["createElementBlock"])("li",{onClick:function(n){return e.$emit("selectDropElement",t,e.input)},key:t._id},Object(r["toDisplayString"])(t.name||t.instrument),9,h)})),128))])])):Object(r["createCommentVNode"])("",!0)]})),_:1})])}n("7db0"),n("ac1f"),n("5319"),n("25f0");var O=n("3a60"),v=n("39c1"),g=Object(i["defineComponent"])({name:"Input",emits:["selectDropElement","toggleDrop"],directives:{mask:O["mask"]},props:{input:{type:Object,required:!0},data:{type:Object,required:!0},target:Object,investments:Array},data:function(){return{datepicker:{}}},mounted:function(){var e=this;this.datepicker=new v["a"]("#days",{range:!0,multipleDates:!0,toggleSelected:!1,multipleDatesSeparator:" - ",onSelect:function(t){var n=t.date;Array.isArray(n)&&2===n.length&&e.selectedDates(n)}})},methods:{selectedDates:function(e){this.datepicker.hide(),this.generateDate(e)},months:function(e){var t;return(null===(t=[{id:0,name:"января"},{id:1,name:"февраля"},{id:2,name:"марта"},{id:3,name:"апреля"},{id:4,name:"мая"},{id:5,name:"июня"},{id:6,name:"июля"},{id:7,name:"августа"},{id:8,name:"сентября"},{id:9,name:"октября"},{id:10,name:"ноября"},{id:11,name:"декабря"}].find((function(t){return t.id===e})))||void 0===t?void 0:t.name)||""},generateDate:function(e){var t="с FIRST MONTH1 по SECOND MONTH2",n=new Date(e[0]),r=new Date(e[1]),a=Math.ceil(Math.abs(r.getTime()-n.getTime())/864e5);t=t.replace("FIRST",n.getDate().toString()),t=t.replace("SECOND",r.getDate().toString()),t=n.getMonth()===r.getMonth()?t.replace("MONTH1 ",""):t.replace("MONTH1",this.months(n.getMonth())),t=t.replace("MONTH2",this.months(r.getMonth())),this.data.dayLength=a+1,this.data.days=t}}}),k=(n("3663"),n("6b0d")),y=n.n(k);const w=y()(g,[["render",j],["__scopeId","data-v-6439ba08"]]);var D=w,E=Object(i["defineComponent"])({emits:["amountInflation"],name:"Inputs",props:{module:{type:Object,required:!0}},data:function(){return{amount:""}},methods:{toggleDrop:function(e){var t=this;this.module.inputs.forEach((function(t){t.id!==e.id&&(t.showDrop=!1)})),e.showDrop=!e.showDrop,e.showDrop?this.jq("body").bind("click",(function(n){0===t.jq(n.target).closest(".drop").length&&0===t.jq(n.target).siblings(".drop").length&&(e.showDrop=!1)})):this.jq("body").unbind("click")},selectDropElement:function(e,t){this.module.data[t.id]=e.name,this.module.data[t.id+"_id"]=e._id,t.showDrop=!1}},components:{Input:D}});n("ad28");const B=y()(E,[["render",o],["__scopeId","data-v-05086464"]]);t["a"]=B},ad28:function(e,t,n){"use strict";n("0f1c")},c66d:function(e,t,n){"use strict";n.r(t);var r=n("f2bf");function a(e,t,n,a,o,i){var c=Object(r["resolveComponent"])("ProfileMain");return Object(r["openBlock"])(),Object(r["createBlock"])(c)}var o=n("8afd"),i=function(e){return Object(r["pushScopeId"])("data-v-63a6c9fa"),e=e(),Object(r["popScopeId"])(),e},c=i((function(){return Object(r["createElementVNode"])("div",{class:"profile--title"},"Настройки профиля",-1)})),l={class:"profile--container flex"},d={key:0,class:"left"},s={class:"avatar"},u=["src"],p=["src"],m={key:2,src:"/images/common/avatar.svg",alt:""},b=i((function(){return Object(r["createElementVNode"])("div",{class:"description"},[Object(r["createElementVNode"])("span",null,"Рекомендовано (615x884) (jpeg, jpg, webp)")],-1)})),f={class:"actions flex justify-between"},h=i((function(){return Object(r["createElementVNode"])("div",{class:"btn btn--green"},"Добавить",-1)})),j={class:"right flex direction-column items-end"},O={class:"chat flex items-center"},v=i((function(){return Object(r["createElementVNode"])("span",null,"Отображать информацию по чату в итоговом отчёте",-1)}));function g(e,t,n,a,o,i){var g=Object(r["resolveComponent"])("inputs"),k=Object(r["resolveComponent"])("password"),y=Object(r["resolveComponent"])("courses"),w=Object(r["resolveComponent"])("profile-comments");return Object(r["openBlock"])(),Object(r["createElementBlock"])("section",{class:Object(r["normalizeClass"])(["edit flex wrap-wrap",{"justify-center":e.student}])},[Object(r["createElementVNode"])("div",{class:Object(r["normalizeClass"])(["profile settings",{student:e.student}])},[c,Object(r["createElementVNode"])("div",l,[e.user&&"EXPERT"===e.user.role?(Object(r["openBlock"])(),Object(r["createElementBlock"])("div",d,[Object(r["createElementVNode"])("div",s,[e.preview_avatar&&!e.deleteAvatar?(Object(r["openBlock"])(),Object(r["createElementBlock"])("img",{key:0,loading:"lazy",src:e.preview_avatar,alt:""},null,8,u)):e.user&&e.user.avatar&&!e.preview_avatar&&!e.deleteAvatar?(Object(r["openBlock"])(),Object(r["createElementBlock"])("img",{key:1,loading:"lazy",src:e.user.avatar.src,alt:""},null,8,p)):(Object(r["openBlock"])(),Object(r["createElementBlock"])("img",m)),b,Object(r["createElementVNode"])("div",f,[Object(r["createElementVNode"])("label",null,[Object(r["createElementVNode"])("input",{type:"file",name:"avatar",ref:"avatar",onChange:t[0]||(t[0]=function(){return e.uploadFile&&e.uploadFile.apply(e,arguments)})},null,544),h]),Object(r["createElementVNode"])("div",{class:"btn btn--orange",onClick:t[1]||(t[1]=function(){return e.onDeleteAvatar&&e.onDeleteAvatar.apply(e,arguments)})},"Удалить")])])])):Object(r["createCommentVNode"])("",!0),Object(r["createElementVNode"])("div",j,[Object(r["createVNode"])(g,{module:e.module,datas:[]},null,8,["module"]),Object(r["createElementVNode"])("label",O,[Object(r["withDirectives"])(Object(r["createElementVNode"])("input",{type:"checkbox","onUpdate:modelValue":t[2]||(t[2]=function(t){return e.module.data.showChat=t})},null,512),[[r["vModelCheckbox"],e.module.data.showChat]]),v]),Object(r["createElementVNode"])("div",{class:"btn btn--green",onClick:t[3]||(t[3]=function(){return e.updateProfile&&e.updateProfile.apply(e,arguments)})},"Сохранить")])])],2),e.student||e.support?(Object(r["openBlock"])(),Object(r["createBlock"])(k,{key:0,user:e.user},null,8,["user"])):Object(r["createCommentVNode"])("",!0),Object(r["createVNode"])(y,{user:e.user},null,8,["user"]),e.expert?(Object(r["openBlock"])(),Object(r["createBlock"])(w,{key:1,user:e.user},null,8,["user"])):Object(r["createCommentVNode"])("",!0)],2)}var k=n("1da1"),y=n("5530"),w=(n("96cf"),n("d3b7"),n("3ca3"),n("ddb0"),n("caad"),n("2532"),n("2b3d"),n("9861"),n("5502")),D=n("7ae0"),E=n("845d"),B=n("f349"),C=n("5900"),N=Object(o["defineAsyncComponent"])((function(){return n.e("chunk-663a008f").then(n.bind(null,"8d0b"))})),V=Object(o["defineAsyncComponent"])((function(){return n.e("chunk-4e45a8ec").then(n.bind(null,"3a7b"))})),x=Object(o["defineAsyncComponent"])((function(){return n.e("chunk-9cf48042").then(n.bind(null,"fe22"))})),A=Object(o["defineComponent"])({name:"ProfileMain",data:function(){return{module:{data:{},inputs:B["b"]},preview_avatar:null,file:"",deleteAvatar:!1}},created:function(){for(var e=["name","phone","times","days","dayLength","showChat"],t=0,n=e;t<n.length;t++){var r=n[t];this.module.data[r]=this.user[r]}this.user&&this.user.role&&(this.user.role===D["g"].STUDENT||this.user.role===D["g"].SUPPORT)&&(this.module.inputs=[{id:"name",placeholder:"ФИО",name:"ФИО",grid:"1 / 10",type:"text",drop:!1,error:!1,required:!1,show:!0},{id:"phone",placeholder:"+71234567890",name:"Телефон",mask:"+############",grid:"1 / 10",type:"phone",drop:!1,error:!1,required:!1,show:!0}])},computed:Object(y["a"])(Object(y["a"])({},Object(w["b"])(["user","Authorization"])),{},{expert:function(){var e=this.user;return e&&e.role===D["g"].EXPERT},student:function(){var e=this.user;return e&&e.role===D["g"].STUDENT},support:function(){var e=this.user;return e&&e.role===D["g"].SUPPORT},staff:function(){var e=this.user;return e&&e.role===D["g"].OWNER||e.accesses.includes(D["g"].EXPERT)}}),methods:{updateProfile:function(){var e=this;return Object(k["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.API.user.updateProfile(e.module.data);case 2:n=t.sent,e.file&&e.updateAvatar(),e.deleteAvatar&&e.removeAvatar(),e.$store.commit("updateUser",n.data);case 6:case"end":return t.stop()}}),t)})))()},updateAvatar:function(){var e=this;return Object(k["a"])(regeneratorRuntime.mark((function t(){var n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=new FormData,n.append("avatar",e.file),n.append("_id",e.user._id),t.next=5,e.API.user.updateAvatar(n,{_id:e.user._id});case 5:r=t.sent,e.$store.commit("updateUserModel",r.data);case 7:case"end":return t.stop()}}),t)})))()},removeAvatar:function(){var e=this;return Object(k["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.API.user.removeAvatar(e.user._id);case 2:n=t.sent,e.$store.commit("updateUser",n.data);case 4:case"end":return t.stop()}}),t)})))()},onDeleteAvatar:function(){this.deleteAvatar=!0,this.file="",this.preview_avatar=null,this.user.avatar=null,this.$refs.avatar.files=null},uploadFile:function(){var e=this,t=this.$refs.avatar.files[0];if(this.deleteAvatar=!1,this.file=t,!t)return this.$store.commit("createNotification",{status:"error",message:C["a"]});if(!(t.type.includes("jpeg")||t.type.includes("png")||t.type.includes("webp")))return this.$store.commit("createNotification",{status:"error",message:C["b"]});var n=new Image;n.onload=function(){var n=new FileReader;n.onload=function(){return function(t){e.preview_avatar=t.target.result}}(),n.readAsDataURL(t)},n.src=URL.createObjectURL(t)}},components:{Inputs:E["a"],courses:N,profileComments:V,Password:x}}),_=(n("7c0b"),n("6b0d")),M=n.n(_);const T=M()(A,[["render",g],["__scopeId","data-v-63a6c9fa"]]);var P=T,S=Object(o["defineComponent"])({name:"Profile",components:{ProfileMain:P}});const R=M()(S,[["render",a]]);t["default"]=R},f349:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return a}));var r=[{id:1,name:"Цель",sections:[{id:"target",name:"Комментарий по формированию цели"}]},{id:2,name:"Стартовый портфель",sections:[{id:"existing",name:"Комментарии эксперта на стартовый портфель"}]},{id:3,name:"Портфель студента",sections:[{id:"stock",name:"Обзор рисковой части"},{id:"bond",name:"Обзор консервативной части"},{id:"alternative",name:"Обзор защитной части"},{id:"tactic",name:"Тактические идеи"}]},{id:3,name:"Портфель эксперта",sections:[{id:"expert",name:"Комментарии эксперта на портфель"}]},{id:4,name:"Итоговый комментарий",sections:[{id:"common",name:"Итоговый комментарий"}]}],a=[{id:"name",placeholder:"ФИО",name:"ФИО",grid:"1 / 10",type:"text",drop:!1,error:!1,required:!1,show:!0},{id:"phone",placeholder:"+71234567890",name:"Телефон",mask:"+############",grid:"1 / 10",type:"phone",drop:!1,error:!1,required:!1,show:!0},{id:"days",placeholder:"Выберите даты работы в чате",datepicker:!0,name:"Даты работы в чате",grid:"1 / 10",type:"text",drop:!1,error:!1,required:!1,show:!0},{id:"times",placeholder:"00:00 - 00:00",name:"Время работы в чате",mask:"##:## - ##:##",grid:"1 / 10",type:"text",drop:!1,error:!1,required:!1,show:!0},{id:"password",placeholder:"Введите новый пароль",name:"Пароль",grid:"1 / 10",type:"password",drop:!1,error:!1,required:!1,show:!0},{id:"reset_password",placeholder:"Повторите пароль",name:"Повторите пароль",grid:"1 / 10",type:"password",drop:!1,error:!1,required:!1,show:!0}]}}]);
//# sourceMappingURL=chunk-b1e6b6be.5c00a48f.js.map