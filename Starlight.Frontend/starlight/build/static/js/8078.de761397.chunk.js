(self.webpackChunkstarlight=self.webpackChunkstarlight||[]).push([[8078],{446:function(t){t.exports=function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",s="second",i="minute",u="hour",a="day",o="week",c="month",h="quarter",f="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,M=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,_={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},y=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},m={s:y,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),s=n%60;return(e<=0?"+":"-")+y(r,2,"0")+":"+y(s,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),s=e.clone().add(r,c),i=n-s<0,u=e.clone().add(r+(i?-1:1),c);return+(-(r+(n-s)/(i?s-u:u-s))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:f,w:o,d:a,D:d,h:u,m:i,s:s,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",p={};p[D]=_;var S="$isDayjsObject",v=function(t){return t instanceof b||!(!t||!t[S])},g=function t(e,n,r){var s;if(!e)return D;if("string"==typeof e){var i=e.toLowerCase();p[i]&&(s=i),n&&(p[i]=n,s=i);var u=e.split("-");if(!s&&u.length>1)return t(u[0])}else{var a=e.name;p[a]=e,s=a}return!r&&s&&(D=s),s||!r&&D},w=function(t,e){if(v(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new b(n)},Y=m;Y.l=g,Y.i=v,Y.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var b=function(){function _(t){this.$L=g(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[S]=!0}var y=_.prototype;return y.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(Y.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var s=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(e)}(t),this.init()},y.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},y.$utils=function(){return Y},y.isValid=function(){return!(this.$d.toString()===l)},y.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},y.isAfter=function(t,e){return w(t)<this.startOf(e)},y.isBefore=function(t,e){return this.endOf(e)<w(t)},y.$g=function(t,e,n){return Y.u(t)?this[e]:this.set(n,t)},y.unix=function(){return Math.floor(this.valueOf()/1e3)},y.valueOf=function(){return this.$d.getTime()},y.startOf=function(t,e){var n=this,r=!!Y.u(e)||e,h=Y.p(t),l=function(t,e){var s=Y.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?s:s.endOf(a)},$=function(t,e){return Y.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},M=this.$W,_=this.$M,y=this.$D,m="set"+(this.$u?"UTC":"");switch(h){case f:return r?l(1,0):l(31,11);case c:return r?l(1,_):l(0,_+1);case o:var D=this.$locale().weekStart||0,p=(M<D?M+7:M)-D;return l(r?y-p:y+(6-p),_);case a:case d:return $(m+"Hours",0);case u:return $(m+"Minutes",1);case i:return $(m+"Seconds",2);case s:return $(m+"Milliseconds",3);default:return this.clone()}},y.endOf=function(t){return this.startOf(t,!1)},y.$set=function(t,e){var n,o=Y.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[c]=h+"Month",n[f]=h+"FullYear",n[u]=h+"Hours",n[i]=h+"Minutes",n[s]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===f){var M=this.clone().set(d,1);M.$d[l]($),M.init(),this.$d=M.set(d,Math.min(this.$D,M.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},y.set=function(t,e){return this.clone().$set(t,e)},y.get=function(t){return this[Y.p(t)]()},y.add=function(r,h){var d,l=this;r=Number(r);var $=Y.p(h),M=function(t){var e=w(l);return Y.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===f)return this.set(f,this.$y+r);if($===a)return M(1);if($===o)return M(7);var _=(d={},d[i]=e,d[u]=n,d[s]=t,d)[$]||1,y=this.$d.getTime()+r*_;return Y.w(y,this)},y.subtract=function(t,e){return this.add(-1*t,e)},y.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",s=Y.z(this),i=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,h=n.meridiem,f=function(t,n,s,i){return t&&(t[n]||t(e,r))||s[n].slice(0,i)},d=function(t){return Y.s(i%12||12,t,"0")},$=h||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(M,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return Y.s(e.$y,4,"0");case"M":return a+1;case"MM":return Y.s(a+1,2,"0");case"MMM":return f(n.monthsShort,a,c,3);case"MMMM":return f(c,a);case"D":return e.$D;case"DD":return Y.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return f(n.weekdaysMin,e.$W,o,2);case"ddd":return f(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(i);case"HH":return Y.s(i,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(i,u,!0);case"A":return $(i,u,!1);case"m":return String(u);case"mm":return Y.s(u,2,"0");case"s":return String(e.$s);case"ss":return Y.s(e.$s,2,"0");case"SSS":return Y.s(e.$ms,3,"0");case"Z":return s}return null}(t)||s.replace(":","")}))},y.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},y.diff=function(r,d,l){var $,M=this,_=Y.p(d),y=w(r),m=(y.utcOffset()-this.utcOffset())*e,D=this-y,p=function(){return Y.m(M,y)};switch(_){case f:$=p()/12;break;case c:$=p();break;case h:$=p()/3;break;case o:$=(D-m)/6048e5;break;case a:$=(D-m)/864e5;break;case u:$=D/n;break;case i:$=D/e;break;case s:$=D/t;break;default:$=D}return l?$:Y.a($)},y.daysInMonth=function(){return this.endOf(c).$D},y.$locale=function(){return p[this.$L]},y.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=g(t,e,!0);return r&&(n.$L=r),n},y.clone=function(){return Y.w(this.$d,this)},y.toDate=function(){return new Date(this.valueOf())},y.toJSON=function(){return this.isValid()?this.toISOString():null},y.toISOString=function(){return this.$d.toISOString()},y.toString=function(){return this.$d.toUTCString()},_}(),O=b.prototype;return w.prototype=O,[["$ms",r],["$s",s],["$m",i],["$H",u],["$W",a],["$M",c],["$y",f],["$D",d]].forEach((function(t){O[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,b,w),t.$i=!0),w},w.locale=g,w.isDayjs=v,w.unix=function(t){return w(1e3*t)},w.en=p[D],w.Ls=p,w.p={},w}()},8078:function(t,e,n){t.exports=function(t){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var n=e(t),r={name:"en-ca",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),ordinal:function(t){return t},formats:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"}};return n.default.locale(r,null,!0),r}(n(446))}}]);
//# sourceMappingURL=8078.de761397.chunk.js.map