(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{"4vZ2":function(e,t,r){"use strict";r.r(t);r("x0IH"),r("daAu")},FTq8:function(e,t,r){"use strict";r.r(t),r.d(t,"default",function(){return y});var a=r("FQm9"),o=r("tAgL"),n=r("H9x3"),s=r("3DUy");function l(e){return l="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(e)}function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},i.apply(this,arguments)}function p(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function c(e,t,r){return t&&u(e.prototype,t),r&&u(e,r),e}function d(e,t){return!t||"object"!==l(t)&&"function"!==typeof t?f(e):t}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},m(e)}function g(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}function v(e,t){return v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},v(e,t)}var h=function(e,t){var r={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(r[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(e);o<a.length;o++)t.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(e,a[o])&&(r[a[o]]=e[a[o]])}return r},y=function(e){function t(){var e;return p(this,t),e=d(this,m(t).apply(this,arguments)),e.saveTooltip=function(t){e.tooltip=t},e.renderPopover=function(t){var r=t.getPrefixCls,n=e.props,s=n.prefixCls,l=h(n,["prefixCls"]);delete l.title;var p=r("popover",s);return a["createElement"](o["default"],i({},l,{prefixCls:p,ref:e.saveTooltip,overlay:e.getOverlay(p)}))},e}return g(t,e),c(t,[{key:"getPopupDomNode",value:function(){return this.tooltip.getPopupDomNode()}},{key:"getOverlay",value:function(e){var t=this.props,r=t.title,o=t.content;return Object(s["a"])(!("overlay"in this.props),"Popover","`overlay` is removed, please use `content` instead, see: https://u.ant.design/popover-content"),a["createElement"]("div",null,r&&a["createElement"]("div",{className:"".concat(e,"-title")},r),a["createElement"]("div",{className:"".concat(e,"-inner-content")},o))}},{key:"render",value:function(){return a["createElement"](n["a"],null,this.renderPopover)}}]),t}(a["Component"]);y.defaultProps={placement:"top",transitionName:"zoom-big",trigger:"hover",mouseEnterDelay:.1,mouseLeaveDelay:.1,overlayStyle:{}}},daAu:function(e,t,r){e.exports={"ant-popover":"ant-popover","ant-popover-hidden":"ant-popover-hidden","ant-popover-placement-top":"ant-popover-placement-top","ant-popover-placement-topLeft":"ant-popover-placement-topLeft","ant-popover-placement-topRight":"ant-popover-placement-topRight","ant-popover-placement-right":"ant-popover-placement-right","ant-popover-placement-rightBottom":"ant-popover-placement-rightBottom","ant-popover-placement-rightTop":"ant-popover-placement-rightTop","ant-popover-placement-bottom":"ant-popover-placement-bottom","ant-popover-placement-bottomLeft":"ant-popover-placement-bottomLeft","ant-popover-placement-bottomRight":"ant-popover-placement-bottomRight","ant-popover-placement-left":"ant-popover-placement-left","ant-popover-placement-leftBottom":"ant-popover-placement-leftBottom","ant-popover-placement-leftTop":"ant-popover-placement-leftTop","ant-popover-inner":"ant-popover-inner","ant-popover-title":"ant-popover-title","ant-popover-inner-content":"ant-popover-inner-content","ant-popover-message":"ant-popover-message",anticon:"anticon","ant-popover-message-title":"ant-popover-message-title","ant-popover-buttons":"ant-popover-buttons","ant-popover-arrow":"ant-popover-arrow","ant-popover-content":"ant-popover-content"}},qq80:function(e,t,r){"use strict";var a=r("mZ4U"),o=r("fbTi");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,r("yjJ+");var n=a(r("Y+yF"));r("VA60");var s=a(r("nZdv"));r("sq8Z");var l=a(r("BJ+/"));r("4vZ2");var i=a(r("FTq8"));r("29CH");var p=a(r("RwpS")),u=a(r("mK77"));r("gN+B");var c=a(r("fw9S")),d=a(r("43Yg")),f=a(r("/tCh")),m=a(r("scpF")),g=a(r("O/V9")),v=a(r("8aBX"));r("r9xz");var h=a(r("WlFR"));r("ugSQ");var y=a(r("KZOz"));r("esdl");var b,w,E,O=a(r("tJ5a")),P=r("+91m"),S=o(r("FQm9")),F=a(r("YjOg")),x=r("LneV"),C=a(r("jxwP")),k=a(r("vyRF")),M=r("Zy2x"),j=O.default.Item,N=y.default.Option,R=h.default.Group,T={ok:S.default.createElement("div",{className:k.default.success},S.default.createElement(P.FormattedMessage,{id:"user-register.strength.strong"})),pass:S.default.createElement("div",{className:k.default.warning},S.default.createElement(P.FormattedMessage,{id:"user-register.strength.medium"})),poor:S.default.createElement("div",{className:k.default.error},S.default.createElement(P.FormattedMessage,{id:"user-register.strength.short"}))},q={ok:"success",pass:"normal",poor:"exception"},z=(b=(0,x.connect)(function(e){var t=e.userRegister,r=e.loading;return{userRegister:t,submitting:r.effects["userRegister/submit"]}}),b((E=function(e){function t(){var e,r;(0,d.default)(this,t);for(var a=arguments.length,o=new Array(a),n=0;n<a;n++)o[n]=arguments[n];return r=(0,m.default)(this,(e=(0,g.default)(t)).call.apply(e,[this].concat(o))),r.state={count:0,confirmDirty:!1,visible:!1,help:"",prefix:"86"},r.interval=void 0,r.onGetCaptcha=function(){var e=59,t=r.props.form.getFieldValue("phone");r.setState({count:e}),(0,M.getCaptcha)(t),c.default.success("\u9a8c\u8bc1\u7801\u5df2\u53d1\u9001\uff01"),r.interval=window.setInterval(function(){e-=1,r.setState({count:e}),0===e&&clearInterval(r.interval)},1e3)},r.getPasswordStatus=function(){var e=r.props.form,t=e.getFieldValue("password");return t&&t.length>9?"ok":t&&t.length>5?"pass":"poor"},r.handleSubmit=function(e){e.preventDefault();var t=r.props,a=t.form,o=t.dispatch;a.validateFields({force:!0},function(e,t){if(!e){var a=r.state.prefix;o({type:"userRegister/submit",payload:(0,u.default)({},t,{prefix:a})})}})},r.checkConfirm=function(e,t,a){var o=r.props.form;t&&t!==o.getFieldValue("password")?a((0,P.formatMessage)({id:"user-register.password.twice"})):a()},r.checkPassword=function(e,t,a){var o=r.state,n=o.visible,s=o.confirmDirty;if(t)if(r.setState({help:""}),n||r.setState({visible:!!t}),t.length<6)a("error");else{var l=r.props.form;t&&s&&l.validateFields(["confirm"],{force:!0}),a()}else r.setState({help:(0,P.formatMessage)({id:"user-register.password.required"}),visible:!!t}),a("error")},r.changePrefix=function(e){r.setState({prefix:e})},r.renderPasswordProgress=function(){var e=r.props.form,t=e.getFieldValue("password"),a=r.getPasswordStatus();return t&&t.length?S.default.createElement("div",{className:k.default["progress-".concat(a)]},S.default.createElement(p.default,{status:q[a],className:k.default.progress,strokeWidth:6,percent:10*t.length>100?100:10*t.length,showInfo:!1})):null},r}return(0,v.default)(t,e),(0,f.default)(t,[{key:"componentDidUpdate",value:function(){var e=this.props,t=e.userRegister,r=e.form,a=r.getFieldValue("mail");"ok"===t.status&&(c.default.success("\u6ce8\u518c\u6210\u529f\uff01"),C.default.push({pathname:"/user/register-result",state:{account:a}}))}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"render",value:function(){var e=this.props,t=e.form,r=e.submitting,a=t.getFieldDecorator,o=this.state,p=o.count,u=o.prefix,c=o.help,d=o.visible;return S.default.createElement("div",{className:k.default.main},S.default.createElement("h3",null,S.default.createElement(P.FormattedMessage,{id:"user-register.register.register"})),S.default.createElement(O.default,{onSubmit:this.handleSubmit},S.default.createElement(j,null,S.default.createElement(R,{compact:!0},S.default.createElement(y.default,{size:"large",value:u,onChange:this.changePrefix,style:{width:"20%"}},S.default.createElement(N,{value:"86"},"+86")),a("phone",{rules:[{required:!0,message:(0,P.formatMessage)({id:"user-register.phone-number.required"})},{pattern:/^\d{11}$/,message:(0,P.formatMessage)({id:"user-register.phone-number.wrong-format"})}]})(S.default.createElement(h.default,{size:"large",style:{width:"80%"},placeholder:(0,P.formatMessage)({id:"user-register.phone-number.placeholder"})})))),S.default.createElement(j,{help:c},S.default.createElement(i.default,{getPopupContainer:function(e){return e&&e.parentNode?e.parentNode:e},content:S.default.createElement("div",{style:{padding:"4px 0"}},T[this.getPasswordStatus()],this.renderPasswordProgress(),S.default.createElement("div",{style:{marginTop:10}},S.default.createElement(P.FormattedMessage,{id:"user-register.strength.msg"}))),overlayStyle:{width:240},placement:"right",visible:d},a("password",{rules:[{validator:this.checkPassword}]})(S.default.createElement(h.default,{size:"large",type:"password",placeholder:(0,P.formatMessage)({id:"user-register.password.placeholder"})})))),S.default.createElement(j,null,a("confirm",{rules:[{required:!0,message:(0,P.formatMessage)({id:"user-register.confirm-password.required"})},{validator:this.checkConfirm}]})(S.default.createElement(h.default,{size:"large",type:"password",placeholder:(0,P.formatMessage)({id:"user-register.confirm-password.placeholder"})}))),S.default.createElement(j,null,S.default.createElement(n.default,{gutter:8},S.default.createElement(l.default,{span:16},a("captcha",{rules:[{required:!1,message:(0,P.formatMessage)({id:"user-register.verification-code.required"})}]})(S.default.createElement(h.default,{size:"large",placeholder:(0,P.formatMessage)({id:"user-register.verification-code.placeholder"})}))),S.default.createElement(l.default,{span:8},S.default.createElement(s.default,{size:"large",disabled:!!p,className:k.default.getCaptcha,onClick:this.onGetCaptcha},p?"".concat(p," s"):(0,P.formatMessage)({id:"user-register.register.get-verification-code"}))))),S.default.createElement(j,null,S.default.createElement(s.default,{size:"large",loading:r,className:k.default.submit,type:"primary",htmlType:"submit"},S.default.createElement(P.FormattedMessage,{id:"user-register.register.register"})),S.default.createElement(F.default,{className:k.default.login,to:"/user/login"},S.default.createElement(P.FormattedMessage,{id:"user-register.register.sign-in"})))))}}]),t}(S.Component),w=E))||w),D=O.default.create()(z);t.default=D},vyRF:function(e,t,r){e.exports={main:"antd-pro-pages-user-register-style-main",getCaptcha:"antd-pro-pages-user-register-style-getCaptcha",submit:"antd-pro-pages-user-register-style-submit",login:"antd-pro-pages-user-register-style-login",error:"antd-pro-pages-user-register-style-error",success:"antd-pro-pages-user-register-style-success",warning:"antd-pro-pages-user-register-style-warning","progress-pass":"antd-pro-pages-user-register-style-progress-pass",progress:"antd-pro-pages-user-register-style-progress"}}}]);