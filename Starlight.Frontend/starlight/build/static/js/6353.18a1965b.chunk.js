"use strict";(self.webpackChunkstarlight=self.webpackChunkstarlight||[]).push([[6353,20,2309],{7639:(e,s,a)=>{a.r(s),a.d(s,{default:()=>N});var n=a(5043),c=a(6213),i=(a(4166),a(3216)),l=a(5475),t=a(4320),r=a(6494),o=a(9883),d=a(653),h=a(1832),g=a(8440),m=a(4797),x=a(9895),v=a(3900),j=a(3204),u=a(579);const p="https://cluster1.swyrin.id.vn";const N=function(){var e,s;const a=(0,i.zy)(),N=(null===(e=a.state)||void 0===e?void 0:e.currentSong)||null,f=(null===(s=a.state)||void 0===s?void 0:s.currentSongIndex)||0,[A,b]=(0,n.useState)(N),[S,B]=(0,n.useState)(f);let y;const[w,C]=(0,n.useState)(!1),[k,P]=(0,n.useState)(!1),[L,H]=(0,n.useState)([]),[E,G]=(0,n.useState)(""),F=new v.A(L,{keys:["title"],threshold:.3}),U=E?F.search(E).map((e=>e.item)):L;(0,n.useEffect)((()=>{b(N),B(f)}),[N,f]),(0,n.useEffect)((()=>{b(N)}),[N]),(0,n.useEffect)((()=>{(async()=>{try{const e=(await c.A.get(`${p}/api/track/all`,{headers:{"Content-Type":"application/json"}})).data;H(e),e.length>0&&B(0)}catch(e){console.error("Error fetching data:",e)}})()}),[]),(0,n.useEffect)((()=>{S>=L.length&&B(0)}),[S,L.length]),(0,n.useEffect)((()=>{const e=e=>{27===e.keyCode&&(e.preventDefault(),M())};return window.addEventListener("keydown",e),()=>{window.removeEventListener("keydown",e)}}),[]);const M=()=>{P(!0)};return(0,u.jsxs)("div",{className:"eventpage",children:[(0,u.jsxs)("header",{className:"navbar",children:[(0,u.jsxs)("div",{id:"nav-icon1",className:w?"open":"",onClick:()=>{C(!w)},children:[(0,u.jsx)("span",{}),(0,u.jsx)("span",{}),(0,u.jsx)("span",{})]}),(0,u.jsxs)("nav",{className:"nav-links left",children:[(0,u.jsxs)(l.N_,{to:"/songpage",children:[(0,u.jsx)("img",{src:o,alt:"Songs",className:"nav-icon"}),(0,u.jsx)("span",{children:"Songs"})]}),(0,u.jsxs)(l.N_,{to:"/historypage",children:[(0,u.jsx)("img",{src:d,alt:"History",className:"nav-icon"}),(0,u.jsx)("span",{children:"History"})]})]}),(0,u.jsx)("div",{className:"logo-container",children:(0,u.jsx)(l.N_,{to:"/songpage",className:"logo",children:(0,u.jsxs)("span",{className:"star-light",children:[(0,u.jsx)("span",{children:"STAR"}),(0,u.jsx)("img",{src:t,alt:"Logo",className:"logo-icon",style:{verticalAlign:"middle"}}),(0,u.jsx)("span",{className:"light",children:"LIGHT"})]})})}),(0,u.jsxs)("nav",{className:"nav-links right",children:[(0,u.jsxs)(l.N_,{to:"/eventpage",state:{currentSong:A,currentSongIndex:S},children:[(0,u.jsx)("img",{src:h,alt:"Events",className:"nav-icon"}),(0,u.jsx)("span",{children:"Events"})]}),(0,u.jsxs)(l.N_,{to:"/storepage",state:{currentSong:A,currentSongIndex:S},children:[(0,u.jsx)("img",{src:g,alt:"Store",className:"nav-icon"}),(0,u.jsx)("span",{children:"Store"})]})]}),(0,u.jsx)("div",{className:"leave-button",children:(0,u.jsx)("img",{src:r,alt:"Leave",className:"leave-icon",style:{width:"26px",height:"26px"},onClick:M})})]}),(0,u.jsxs)("div",{className:"content-layer",children:[(0,u.jsx)("div",{className:"background-image",children:(0,u.jsx)("img",{src:A&&A.backgroundUrl?`${A.backgroundUrl}`:"",alt:"Background"})}),(0,u.jsx)("div",{className:"overlay-layer",style:{height:"1000px"}}),(0,u.jsx)("div",{className:"coming-soon-text",children:"Coming soon..."})]}),(0,u.jsxs)("div",{className:"sidebar "+(w?"open":""),style:{backgroundImage:`url(${m})`},children:[(0,u.jsx)("div",{className:"search-bar-container",children:(0,u.jsxs)("form",{className:"search-form",onSubmit:e=>{e.preventDefault()},children:[(0,u.jsx)("label",{htmlFor:"search",className:"screen-reader-text",children:"Search"}),(0,u.jsx)("input",{type:"search",id:"search",placeholder:"Search songs...",value:E,onChange:e=>{G(e.target.value)},className:"search-field"}),(0,u.jsx)("button",{type:"submit",className:"search-submit",children:(0,u.jsx)(j.KSO,{className:"search-bar-icon"})})]})}),(0,u.jsx)("ul",{children:U.map(((e,s)=>(0,u.jsxs)("li",{className:"song-item",onClick:()=>b(e),children:[(0,u.jsxs)("div",{className:"song-info-sidebar",children:[(0,u.jsx)("img",{src:x,alt:"Song Sidebar Icon",className:"song-sidebar-icon"}),(0,u.jsx)("span",{className:"sidebar-song",children:e.title})]}),(0,u.jsx)("div",{className:"song-bg",style:{backgroundImage:`url(${p}${e.backgroundFileLocation})`}}),(0,u.jsx)("span",{className:"sidebar-song-title",children:e.title})]},s)))})]}),k&&(0,u.jsx)("div",{className:"popup-overlay",children:(0,u.jsxs)("div",{className:"popup-content",children:[(0,u.jsx)("h2",{children:"Confirm Leave"}),(0,u.jsx)("p",{children:"Are you sure you want to leave the game?"}),(0,u.jsx)("button",{className:"stay-button",onClick:()=>{P(!1)},children:"Stay"}),(0,u.jsx)("button",{className:"leave-button",onClick:()=>{y&&(y.pause(),y=null),window.location.href="/"},children:"Leave"})]})})]})}},6353:(e,s,a)=>{a.r(s),a.d(s,{default:()=>A});var n=a(5043),c=a(6213),i=(a(6306),a(3216)),l=a(5475),t=a(2100),r=a(5203),o=a(2472),d=a(7639),h=a(4690),g=a(7653),m=a(4320),x=a(6494),v=a(9883),j=a(653),u=a(1832),p=a(8440);var N=a(8093),f=a(579);const A=function(){const[e,s]=(0,n.useState)({}),[a,A]=(0,n.useState)(!1),[b,S]=(0,n.useState)(!1),[B,y]=(0,n.useState)([{id:1,sender:"Phong",message:"\xca, \u0111i \u0111\xe1 banh k",color:"green",time:"02:02:34 PM",avatar:N},{id:2,sender:"X\xedch",message:"Meo meo",color:"red",time:"3:35:13 AM",avatar:N},{id:3,sender:"Lan",message:"C\u1eadu \u0103n c\u01a1m ch\u01b0a",color:"orange",time:"08:07:23 AM",avatar:N}]),[w,C]=(0,n.useState)(""),[k,P]=(0,n.useState)("scoreRecord"),[L,H]=(0,n.useState)(!1);(0,i.Zp)(),(0,n.useEffect)((()=>{(async()=>{try{const e=await c.A.get("https://cluster1.swyrin.id.vn/api/user",{headers:{"Content-Type":"application/json"},withCredentials:!0});if(200===e.status){const a=e.data;s({id:a.id||123456,name:a.name||"Sanraku",profilePic:a.avatar||g}),H(!0)}else console.error("Error fetching user data:",e.statusText)}catch(e){console.error("Error fetching data:",e)}})()}),[]);const E=e=>{P(e)};return(0,f.jsxs)("div",{children:[(0,f.jsxs)(i.BV,{children:[(0,f.jsx)(i.qh,{path:"/SongPage",element:(0,f.jsx)(o.default,{})}),(0,f.jsx)(i.qh,{path:"/HistoryPage",element:(0,f.jsx)(r.default,{})}),(0,f.jsx)(i.qh,{path:"/EventPage",element:(0,f.jsx)(d.default,{})}),(0,f.jsx)(i.qh,{path:"/StorePage",element:(0,f.jsx)(h.default,{})}),(0,f.jsx)(i.qh,{path:"/Logout",element:(0,f.jsx)(t.default,{})})]}),(0,f.jsxs)("div",{className:"profile-page",children:[(0,f.jsxs)("header",{className:"nav3h",children:[(0,f.jsxs)("nav",{className:"nav3",children:[(0,f.jsxs)(l.N_,{to:"/SongPage",children:[(0,f.jsx)("img",{src:v,alt:"Songs",className:"nav-iconh"}),(0,f.jsx)("span",{children:"Songs"})]}),(0,f.jsxs)(l.N_,{to:"/HistoryPage",children:[(0,f.jsx)("img",{src:j,alt:"History",className:"nav-iconh"}),(0,f.jsx)("span",{children:"History"})]}),(0,f.jsxs)(l.N_,{to:"/EventPage",children:[(0,f.jsx)("img",{src:u,alt:"Events",className:"nav-iconh"}),(0,f.jsx)("span",{children:"Events"})]}),(0,f.jsxs)(l.N_,{to:"/StorePage",children:[(0,f.jsx)("img",{src:p,alt:"Store",className:"nav-iconh"}),(0,f.jsx)("span",{children:"Store"})]})]}),(0,f.jsx)("div",{className:"logo-container",children:(0,f.jsx)("a",{href:"/SongPage",className:"logo",children:(0,f.jsxs)("span",{className:"star-light",children:[(0,f.jsx)("span",{children:"STAR"}),(0,f.jsx)("img",{src:m,alt:"Logo",className:"logo-icon",style:{verticalAlign:"middle"}}),(0,f.jsx)("span",{className:"light",children:"LIGHT"})]})})}),(0,f.jsx)("div",{className:"leave-button",children:(0,f.jsx)("img",{src:x,alt:"Leave",className:"leave-icon",style:{width:"26px",height:"26px"},onClick:()=>{A(!0)}})})]}),(0,f.jsxs)("div",{className:"profile-container",children:[(0,f.jsxs)("div",{className:"profile-avatar-container",children:[(0,f.jsxs)("div",{className:"profile-avatar-section",children:[(0,f.jsx)("img",{src:e.profilePic||g,alt:"Profile",className:"profile-img-avatar"}),(0,f.jsx)("div",{className:"profile-username-avatar",children:e.name||"Sanraku"}),(0,f.jsxs)("div",{className:"profile-userid-avatar",children:["ID: #",e.id||"12345"]})]}),(0,f.jsx)("div",{className:"profile-tabs-section",children:(0,f.jsxs)("div",{className:"profile-tabs",children:[(0,f.jsx)("span",{className:"profile-tab "+("scoreRecord"===k?"active":""),onClick:()=>E("scoreRecord"),children:"Score Record"}),(0,f.jsx)("span",{className:"profile-tab "+("achievements"===k?"active":""),onClick:()=>E("achievements"),children:"Achievements"}),(0,f.jsx)("span",{className:"profile-tab "+("accountSetting"===k?"active":""),onClick:()=>E("accountSetting"),children:"Account Setting"})]})}),(0,f.jsxs)("div",{className:"profile-playtime-section",children:[(0,f.jsx)("div",{children:"Play time:"}),(0,f.jsx)("div",{children:"Last Played:"})]})]}),(0,f.jsxs)("div",{className:"profile-info-container",children:["scoreRecord"===k&&(0,f.jsxs)("div",{className:"profile-score-record",children:[(0,f.jsx)("div",{children:"No"}),(0,f.jsx)("div",{children:"Song Name"}),(0,f.jsx)("div",{children:"Record"}),(0,f.jsx)("div",{children:"Accuracy"}),(0,f.jsx)("div",{children:"Max Combo"}),(0,f.jsx)("div",{children:"CP"}),(0,f.jsx)("div",{children:"P"}),(0,f.jsx)("div",{children:"G"}),(0,f.jsx)("div",{children:"B"}),(0,f.jsx)("div",{children:"M"}),(0,f.jsx)("div",{children:"Tier"})]}),"achievements"===k&&(0,f.jsx)("div",{className:"profile-achievements"}),"accountSetting"===k&&(0,f.jsx)("div",{className:"profile-account-setting"})]})]}),(0,f.jsx)("div",{className:"userprofile",children:(0,f.jsx)("table",{children:(0,f.jsx)("tbody",{children:(0,f.jsxs)("tr",{children:[(0,f.jsxs)("td",{children:[(0,f.jsx)("div",{className:"username",children:e.name||"Sanraku"}),(0,f.jsxs)("div",{className:"userid",children:["ID: #",e.id||"12345"]})]}),(0,f.jsx)("td",{children:(0,f.jsx)("img",{src:e.profilePic||g,alt:"Profile",className:"profileimg"})})]})})})}),(0,f.jsxs)("div",{className:"chat-container",children:[(0,f.jsx)("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAxoSURBVFhHzZh5VFXXvce/54ImadNX13pN30u63mr+yVtp8tqYaKsmElAGwYF5HmV0iHBBRHEg3EhBFMIgSJjkggxCVQyxSBziVRQ1MgkCAkc4cBkUh2gUE8d83zocSM3N0Makab9rfde53HP23p/z27+9f/sCjEunxvMtMUi4lI6uzwrBz8vA2+Xg9TLwaiE4nAP2poOfbod+MBMjYgZG2tMx0pymuGncjamPeAtGGlMw0piIkYYJJyvPdWRipH87RoYKMXJzN/RiLjhcBH66E/zsL+CdCvDe+PVWGdizTeCB1UZpWjWmTDBjrx+mHF6OwsFN4N0c8F4hOFoIXsoT2JpizPYUYaA+Bv17QtB17T14SMkIaE9GwNlkBNR9lzcioG4zAupiH/Em5Z7cVspBgD4HATfK4LErHF3HEzDQnYv+we0Y6M0ErxWCt3eC93eB98rA5nhV18EoPPcl+MEAPNcYga47qeDDHPDzfHA4Q+Cpd4xZFfnkBV2scXTdGgQUecLzy0Y/soqC4XlwI4LasuHfkox1tesh9qTh2pV88F45+FCe/RyhqzYaW3Ry1LV+mPLBYlRci0UfU8CHGeC1VPDjtSoWBU7qzQ940qc05OlfGQ70z9SBSPy8OgyW5zYhoTcFg7fywPtFSkBbNcKpE3LU9/niN8eW4PStd8AvksEH74L6GLAmWNWX6fJEcGzIsz8z7PinUlM8nml5G+pLKej7PBu8J6+DZAzvXjpJh9pQPNMShj2jseAXco7Hg90r0b3fXxWe8y+EnlBVIFy63kbfzVTwThZ4NQXcH6oaRIIlpAsRuDm6AXyoAUfXg01L0FHhAlfDTia0ZsETZhsWTZL+7KiSNrsLUpIHpHc9IKV5Qkof91ZPSFlekHJ9IBUshlQUCKkoGFJRCKQdIZC2+0PK9YKU5ipIMQsgGY4xoTxnBH2sxshIAjiaBl5LAY9HohtbF6FLWgXeWg/eXQdejQR1PujMnA8Pw05KvCfx1FoVWxPBtiSBYioopoNiGnghDexNA/vSQSkd7NsK9meA+kxwIBMcygaHcsHBfIH6PFDKAnsywI6tKp7cMpk1Cf/FP4f85htfoDkC/noNum8kg1eTwBOREJFlD7FPBl8L3o4Gh9VgjTu606y+uoNsdkbHyQ3GHEwHr+eBozuUvf6zMnC0BBwtVnxb/lwK3pIt35Prgbw3l4O3/wKO7gJvVoDXS8FPisErJUYcLH6KHTn/zaKoZwseHXNCtUsR1rkO+iubwYubwGNqiMh1hChFgp+uBW+uBvtX4M4eR5yMnwPHRxtnBgl5TUkqXswFb+xQitPnu5RiMVoOju4cv8oFowK8UQ5+UqYUsE9llyvfXZe/3ykDg5eLwItF4GCRih2ZTzN3+X/kPTrmhA4HQ926GvrheHAwHjwWDhHbZfCV4PVo8HoU2LsCYp037A0bx7oLu49rVOzLAC/ng9dLwBsl4CdFSqGYsPz3lULcF7fhi66tYHeGkhI9mYp7tylp0iunyjbl/vk08HD0JGpsJ1cYjiurJgDqpijo9XGg7GMrZXAniD0R4LXVSn53LoH+sCvcDRurFxqlvR9ppG2Mh7YjCdqebdD2ZEDbnQZt57jlzz3pKOhMw1ZtIEa2LwYLg8DSYLB8Kbh7OVi1AqwJBw+vBo+tBWvXgDWhYKIN7oZZGMUZjitrny/UDaug74sDZdfK4AVOEC9EgFeiwJGVYFuIoP+rk+prC/P7KsYGS2NtoIlbBM1mB2jedYIm3QWaHA9otD7QlAZCs2cZNHuXQFPsBU3EDKwx7GNClb5Q10dCL8WBvRvB2olUEcPBy1HgpQiwJUjQV/0I4D+mKrwU8L6NCviXOS6qwcurwEvhYEugoK+y/zcDd4O6Phz6gY2g9M74rlLgAFEMAy9HgiNqsFUG/zeL+G43qBvU0A9pQEkDHg2Twe0hiqHg5ZXgSCjYGgB9ldPXi4+sZVMn6xJNjHWZc6HLsoQuxwK6nLnQ5VoozpoDXcLrgi70NZVuySt43rD946rSDeqmMOiHZfBY8KNQGdwOoviWEu2LK8Cz/tBX2X8zuOaNyUdKrI1YaQt+4ABWO4A19uABB8XVdmCFjcCUOZO44fUnJYcXn9IZ9vE4qvaCulUN/cjbYG8MeGCZDL4QYtcy8FIoOPQW2OQHfeW3gOfPVe370F6gzgU87gae9gDrH7U7eNwVfN/WiNvMJ9P/90/tNOzjcXQkAOquCOivxIBSDLh/qbw4F0LsXAJeegscWAo2eEO/6xvOKbIqbVRVxxzBk64KaIsn2OqpXGWf9QAb3EGdg8BiK2NGTv9FqWEfj6PGQKzoW4m+qxvA3nVgdRBE5C+AeD4YHF4G6kPAeq9vB6+wMj50xA6scwHPuIHNbmCTC1jvAp52BuscwROOYNUCgVvnPMEV03/xg1NFa4opzb5Yow9H35Vo8EIUuNdPPqssgNgRBA4vVcAbPL8dPMtMpcszAcstBVbOU3GvFVhuBu4wBQveBLNNwFILNGeaQbdq+pM/GDr2FTxfaoH8ei88HJA3kFVgZzhY7g4ROfMhdgSCw0tAfTDY4AF95bxvBpe1+mVoE6YL2ndnGms3T4c27v+gjXkZ2uiXoY34HbTLX8BUwzaPq00zEVphjasdi8GBFeBwOHhuKai1U3Ujx0YBHwoB+4PGcvQ7wX8KrX8Vv90yE74V85B61BFSlz/Y/xY4GAY2BoJbLVXDyLGGeD4AHAoG+wPBBlfod1n8a8ATp+GX8X/CuiwT5Oab4sEhO3zR4AF2B4LScrB3GVjrhXMJbwpbkDMPYof/OHjA2EL7p4Ovn4bZcX/Ehs0zoEmaBU26CTR55tCUmGPTe6a4u9sa9w8uAhvcwHO+YFcw2L0EbPYHyxbhXL4FnkOOJUQ5h4aCwD5/sMHl+6VK3B+NrJNmCdkF5oK23ErQ7rGBttIG2n020FbbKt5vC+1BW2gPOaLgkD2yd8zFyWxTPMyfC2otwBIrcM9C8EM73JMLWZ0r2OgBnvMB2/3B9kAFutoFjXlWWJZqiinItoDY5gcOBICSP/ixHPF/ADx2Kl5KnWVUUWQutBSbCw/2LxB4xFbgUXuwVh7cATzlDJ52GeuT9W5Kgap3x4MTznhwxAnUOSs+6gLWuoOnPMEzXmCTN9jqB7b5g22BYJM/eMhdYJKZcHXNjPGjRNZciK2+SrR7/MA6Z+gr/g541FS8EPuqUFk8x+jOUVvcP+UANrsobpTtrFybXJW9/qz73wrVWS+wWYbzAhu9xrZf1sv2As94g40+YLPf2JmJrf5KpHWeArcvMGK8mbH6S4iMORDP+ijR7vIDTzhDX/Yd4AH/g+fCXsSJ3Nm4U2cvsM0VPO8OdsiV1B1sdB1LtzFPwMvgLR5KZT07UWnHX6DZc/wlvMEG+UVke4P1PuBxD7DGWeB7lsZMNDUOjzX95d/+4ZluBlGemp7F4HlfsNYJ/eWWX//pNqHoF/GfKX/CvqOLFOBub7DTS4lovSt4wgk85gDWjlfRU07gGflF5GPCRLrIR4Nxn/FQzjwn5KOCG3jICdxvD1YuArdbCUw1FTSGDGNKfROiPF2iL9juDeqc0JdnAf/lL+Fpw2eDX8SzidNx+gNrsN0NFL2UduflCLmBB+3BXfPB4nlgkZVArbmKheYqllqqWDZPxTJrFUutVSyZp2LFfOF65UJIu+dDqrCBtMMKUra5IKWZQIqfCWndNKQZjv8VJZsIopxj3b5gmzd4yB5MfB19QS9hseGzK/8XB0rngI1OYKf8sn7KLMnbVvVC8D0zgYlvCM0bZgm6qOkqXfhUY13YH4x1q1411kW9pnjVa8a6lVONdepXjMwM+/9eSjJRdctT1+ULnvMCD9mBabPRGfGHr6ZL/iz8NnMG9p2yB9vdwfNe49DuYPUCMHs2pKjfC7qgFyb9aCX/O7XpddXFM+5glzfY7gnq7MYOS23RU+Ey8UzxTLxWPBsffjSeInJqdPooi+2v88Gs2UJz3DT8sAh+XyXMEracdkVbt5cy/acdwIo5GC6YgcyaGVh8Zi6895pg32Er3G13AkVvJUVk8GP2YIGZoNs07QdO++NovzOeqXUSPuj2BC/I1coJPGIFVpvg6kezITVZ4kK9NT7rcAB73EHJV1mQZ91ws9oG7+e98RNHekJ7LPHrvdaqg+0uYJ8bKLmA523B1vlgx3xQsgOHnMFBD1DvA/bKBcINfN8Sdze/igTD/n4q/T9+pbO9f53QYgAAAABJRU5ErkJggg==",alt:"Chat",className:"chatimage"}),(0,f.jsx)("h3",{children:"Online Chat"}),(0,f.jsx)("div",{className:"chat-body",children:B.map((e=>(0,f.jsxs)("div",{className:`chat-message ${e.color}`,children:[(0,f.jsx)("img",{src:e.avatar,alt:"Avatar",className:"chat-avatar"}),(0,f.jsxs)("div",{className:"chat-message-content",children:[(0,f.jsx)("div",{className:"message-sender",children:e.sender}),(0,f.jsx)("div",{className:"message-content",children:e.message})]}),(0,f.jsx)("div",{className:"message-time",children:e.time})]},e.id)))}),(0,f.jsxs)("div",{className:"chat-footer",children:[(0,f.jsx)("input",{type:"text",placeholder:"Write a message...",value:w,onChange:e=>C(e.target.value)}),(0,f.jsx)("button",{onClick:()=>{if(""!==w.trim()){const s={id:B.length+1,sender:"You",message:w,color:"blue",time:(new Date).toLocaleTimeString(),avatar:e.profilePic||g};y([...B,s]),C("")}},children:"Send"})]})]}),a&&(0,f.jsx)("div",{className:"popup-overlay",children:(0,f.jsxs)("div",{className:"popup-content",children:[(0,f.jsx)("h2",{children:"Confirm Leave"}),(0,f.jsx)("p",{children:"Are you sure you want to leave the game?"}),(0,f.jsx)("button",{className:"stay-button",onClick:()=>{A(!1)},children:"Stay"}),(0,f.jsx)("button",{className:"leave-button",onClick:()=>{window.location.href="/"},children:"Leave"})]})})]})]})}},4690:(e,s,a)=>{a.r(s),a.d(s,{default:()=>N});var n=a(5043),c=a(6213),i=(a(4166),a(3216)),l=a(5475),t=a(4320),r=a(6494),o=a(9883),d=a(653),h=a(1832),g=a(8440),m=a(4797),x=a(9895),v=a(3900),j=a(3204),u=a(579);const p="https://cluster1.swyrin.id.vn";const N=function(){var e,s;const a=(0,i.zy)(),N=(null===(e=a.state)||void 0===e?void 0:e.currentSong)||null,f=(null===(s=a.state)||void 0===s?void 0:s.currentSongIndex)||0,[A,b]=(0,n.useState)(N),[S,B]=(0,n.useState)(f);let y;const[w,C]=(0,n.useState)(!1),[k,P]=(0,n.useState)(!1),[L,H]=(0,n.useState)([]),[E,G]=(0,n.useState)(""),F=new v.A(L,{keys:["title"],threshold:.3}),U=E?F.search(E).map((e=>e.item)):L;(0,n.useEffect)((()=>{b(N),B(f)}),[N,f]),(0,n.useEffect)((()=>{b(N)}),[N]),(0,n.useEffect)((()=>{(async()=>{try{const e=(await c.A.get(`${p}/api/track/all`,{headers:{"Content-Type":"application/json"}})).data;H(e),e.length>0&&B(0)}catch(e){console.error("Error fetching data:",e)}})()}),[]),(0,n.useEffect)((()=>{S>=L.length&&B(0)}),[S,L.length]),(0,n.useEffect)((()=>{const e=e=>{27===e.keyCode&&(e.preventDefault(),M())};return window.addEventListener("keydown",e),()=>{window.removeEventListener("keydown",e)}}),[]);const M=()=>{P(!0)};return(0,u.jsxs)("div",{className:"storepage",children:[(0,u.jsxs)("header",{className:"navbar",children:[(0,u.jsxs)("div",{id:"nav-icon1",className:w?"open":"",onClick:()=>{C(!w)},children:[(0,u.jsx)("span",{}),(0,u.jsx)("span",{}),(0,u.jsx)("span",{})]}),(0,u.jsxs)("nav",{className:"nav-links left",children:[(0,u.jsxs)(l.N_,{to:"/songpage",children:[(0,u.jsx)("img",{src:o,alt:"Songs",className:"nav-icon"}),(0,u.jsx)("span",{children:"Songs"})]}),(0,u.jsxs)(l.N_,{to:"/historypage",children:[(0,u.jsx)("img",{src:d,alt:"History",className:"nav-icon"}),(0,u.jsx)("span",{children:"History"})]})]}),(0,u.jsx)("div",{className:"logo-container",children:(0,u.jsx)(l.N_,{to:"/songpage",className:"logo",children:(0,u.jsxs)("span",{className:"star-light",children:[(0,u.jsx)("span",{children:"STAR"}),(0,u.jsx)("img",{src:t,alt:"Logo",className:"logo-icon",style:{verticalAlign:"middle"}}),(0,u.jsx)("span",{className:"light",children:"LIGHT"})]})})}),(0,u.jsxs)("nav",{className:"nav-links right",children:[(0,u.jsxs)(l.N_,{to:"/eventpage",state:{currentSong:A,currentSongIndex:S},children:[(0,u.jsx)("img",{src:h,alt:"Events",className:"nav-icon"}),(0,u.jsx)("span",{children:"Events"})]}),(0,u.jsxs)(l.N_,{to:"/storepage",state:{currentSong:A,currentSongIndex:S},children:[(0,u.jsx)("img",{src:g,alt:"Store",className:"nav-icon"}),(0,u.jsx)("span",{children:"Store"})]})]}),(0,u.jsx)("div",{className:"leave-button",children:(0,u.jsx)("img",{src:r,alt:"Leave",className:"leave-icon",style:{width:"26px",height:"26px"},onClick:M})})]}),(0,u.jsxs)("div",{className:"content-layer",children:[(0,u.jsx)("div",{className:"background-image",children:(0,u.jsx)("img",{src:A&&A.backgroundUrl?`${A.backgroundUrl}`:"",alt:"Background"})}),(0,u.jsx)("div",{className:"overlay-layer",style:{height:"1000px"}}),(0,u.jsx)("div",{className:"coming-soon-text",children:"Coming soon..."})]}),(0,u.jsxs)("div",{className:"sidebar "+(w?"open":""),style:{backgroundImage:`url(${m})`},children:[(0,u.jsx)("div",{className:"search-bar-container",children:(0,u.jsxs)("form",{className:"search-form",onSubmit:e=>{e.preventDefault()},children:[(0,u.jsx)("label",{htmlFor:"search",className:"screen-reader-text",children:"Search"}),(0,u.jsx)("input",{type:"search",id:"search",placeholder:"Search songs...",value:E,onChange:e=>{G(e.target.value)},className:"search-field"}),(0,u.jsx)("button",{type:"submit",className:"search-submit",children:(0,u.jsx)(j.KSO,{className:"search-bar-icon"})})]})}),(0,u.jsx)("ul",{children:U.map(((e,s)=>(0,u.jsxs)("li",{className:"song-item",onClick:()=>b(e),children:[(0,u.jsxs)("div",{className:"song-info-sidebar",children:[(0,u.jsx)("img",{src:x,alt:"Song Sidebar Icon",className:"song-sidebar-icon"}),(0,u.jsx)("span",{className:"sidebar-song",children:e.title})]}),(0,u.jsx)("div",{className:"song-bg",style:{backgroundImage:`url(${p}${e.backgroundFileLocation})`}}),(0,u.jsx)("span",{className:"sidebar-song-title",children:e.title})]},s)))})]}),k&&(0,u.jsx)("div",{className:"popup-overlay",children:(0,u.jsxs)("div",{className:"popup-content",children:[(0,u.jsx)("h2",{children:"Confirm Leave"}),(0,u.jsx)("p",{children:"Are you sure you want to leave the game?"}),(0,u.jsx)("button",{className:"stay-button",onClick:()=>{P(!1)},children:"Stay"}),(0,u.jsx)("button",{className:"leave-button",onClick:()=>{y&&(y.pause(),y=null),window.location.href="/"},children:"Leave"})]})})]})}}}]);
//# sourceMappingURL=6353.18a1965b.chunk.js.map