/* 原創可離線執行 SVG 實驗室。線條/比例為教學示意，不是即時觀測或地質實測圖。 */
const NS='http://www.w3.org/2000/svg';
const esc=(s)=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const txt=(x,y,t,c='#dcefff',size=14,weight=800,anchor='start')=>`<text x="${x}" y="${y}" fill="${c}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="system-ui,Microsoft JhengHei">${esc(t)}</text>`;
const defs=`<defs><linearGradient id="land" x2="0" y2="1"><stop offset="0" stop-color="#b1d381"/><stop offset=".25" stop-color="#96bc69"/><stop offset=".26" stop-color="#b98b5f"/><stop offset="1" stop-color="#614431"/></linearGradient><linearGradient id="ocean" x2="0" y2="1"><stop stop-color="#2389c1"/><stop offset="1" stop-color="#0f426b"/></linearGradient><linearGradient id="slab" x2="0" y2="1"><stop stop-color="#6ba4cc"/><stop offset=".25" stop-color="#365c81"/><stop offset="1" stop-color="#1b344f"/></linearGradient><linearGradient id="mantle" x2="0" y2="1"><stop stop-color="#ae6341"/><stop offset="1" stop-color="#603d39"/></linearGradient><radialGradient id="core"><stop offset="0" stop-color="#fff9ad"/><stop offset=".55" stop-color="#f8d460"/><stop offset="1" stop-color="#d57638"/></radialGradient><filter id="shiny" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="5"/></filter><filter id="rockgrain"><feTurbulence baseFrequency=".09" numOctaves="3" seed="4" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter><marker id="arr" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#7ce3ff"/></marker><marker id="warmarr" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#ffba72"/></marker></defs>`;
const stage=(inner,h=350)=>`<svg viewBox="0 0 760 ${h}" role="img" aria-label="可操作地科圖像"><rect width="760" height="${h}" rx="14" fill="#10324e"/>${defs}${inner}</svg>`;
const rect=(x,y,w,h,fill,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const ln=(x1,y1,x2,y2,col='#7fe0fa',sw=3,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
const circle=(x,y,r,fill,stroke='none',sw=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const controlRange=(id,label,value,min,max,step=1)=>`<div class="lab-control"><label for="${id}">${label}　<output id="${id}Out">${value}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;
const optionTabs=(xs,chosen,attr='data-mode')=>`<div class="lab-tabs">${xs.map(([k,n])=>`<button ${attr}="${k}" class="${k===chosen?'active':''}">${n}</button>`).join('')}</div>`;
const labRenders={};
function mountLab(id,host){
  const render=(labRenders[id]||labRenders.seismo);
  const center=()=>{const v=host.querySelector('.lab-viewport');if(v&&window.innerWidth<=700&&!v.dataset.centered){v.scrollLeft=Math.max(0,(v.scrollWidth-v.clientWidth)/2);v.dataset.centered='true'}};
  const obs=new MutationObserver(()=>center());obs.observe(host,{childList:true});
  render(host);center();
}
// === 1 Earthquake detection lab ===
labRenders.seismo=(host)=>{
 let tab='focus',depth=18,distance=160,phase=30,ringCount=0;
 const rerender=()=>{
  const tabs=optionTabs([['focus','① 震源與深度'],['wave','② P/S 波動'],['travel','③ P−S 時差'],['locate','④ 三站定位']],tab);
  let picture='',ctrl='',desc='';
  if(tab==='focus'){
   const fy=75+depth/700*218,fx=380;
   picture=stage(rect(0,0,760,70,'#104d74')+rect(0,70,760,280,'url(#mantle)')+
    `<path d="M0 70 Q145 42 280 75 Q470 90 595 64 Q660 48 760 72 L760 102 L0 102Z" fill="#95b977"/><path d="M0 102 Q240 119 450 105 Q570 112 760 98" stroke="#dbb080" fill="none" stroke-width="12" opacity=".4"/>`+
    [35,70,108].map(r=>`<circle cx="${fx}" cy="${fy}" r="${r}" fill="none" stroke="#ffc179" stroke-width="2" stroke-dasharray="6 7" opacity=".65"/>`).join('')+
    ln(fx,70,fx,fy,'#ffdf85',3,'7 5')+circle(fx,fy,10,'#ffce73','#fff3bd',3)+circle(fx,70,9,'#4de1f4','#fff',2)+
    ln(fx+11,70,505,53,'#b7faff',2)+txt(516,55,'震央','#a9efff',16)+ln(fx+11,fy,495,fy+22,'#ffddb0',2)+txt(505,Math.min(fy+32,326),'震源','#ffda91',16)+txt(24,42,'地表','#d3f0f6',15)+txt(24,140,'岩石圈／地函（示意）','#dfbca0',14)+(depth>70?txt(425,(fy+70)/2,'深度垂直量','#ffefcb',13):'')+
    rect(24,286,245,42,'#0b2237',10)+txt(39,313,`震源深度 ${depth} 公里 · ${depth<=30?'極淺層':depth<=70?'淺層':depth<=300?'中層':'深層'}`,'#fff0d8',15));
   ctrl=controlRange('depthSlider','震源深度（km）',depth,0,700);desc='上方地表藍點是震央、地下發光點是震源；這裡使用垂直距離定義深度，圖示不按實際比例。';
  }else if(tab==='wave'){
   let pp=[],ss=[];for(let i=0;i<17;i++){const x=65+i*39;const shift=12*Math.sin(i*.82-phase*.12), sy=255+23*Math.sin(i*.72-phase*.15);pp.push(circle(x+shift,130,7,'#88ecff','#c3f8ff',1));ss.push(circle(x,sy,7,'#ffd39a','#fff2dc',1));}
   picture=stage(txt(35,40,'P 波：粒子前後推擠（振動方向 ∥ 傳播方向）','#adebff',17)+ln(55,87,700,87,'#52daff',3)+`<path d="M685 79L706 87L685 95Z" fill="#52daff"/>`+pp.join('')+txt(35,212,'S 波：粒子上下搖動（振動方向 ⟂ 傳播方向）','#ffdba9',17)+ln(55,294,700,294,'#ffd5a2',3)+ss.join('')+txt(570,330,'波向右傳 →','#a7dff3',13));
   ctrl=controlRange('phaseSlider','向右拖動，觀察振動',phase,0,100);desc='模型刻意把粒子位移放大，方便觀察。注意：粒子只在附近振動，並不是跟著波一路旅行。';
  }else if(tab==='travel'){
   const pt=distance/8,st=distance/4.5,dt=st-pt;const maxT=130;
   const X=d=>65+d/600*650,Y=t=>290-t/maxT*210;
   const path=v=>Array.from({length:61},(_,i)=>{let d=i*10;return `${i?'L':'M'}${X(d)},${Y(d/v)}`}).join(' ');
   picture=stage(rect(48,38,675,260,'#123853',12)+
    Array.from({length:5},(_,i)=>ln(65,80+i*53,715,80+i*53,'#255474',1)).join('')+
    ln(65,290,715,290,'#9ac2d9',2)+ln(65,65,65,290,'#9ac2d9',2)+
    `<path d="${path(8)}" stroke="#66dfff" stroke-width="4" fill="none"/><path d="${path(4.5)}" stroke="#ffbe86" stroke-width="4" fill="none"/>`+
    ln(X(distance),Y(pt),X(distance),Y(st),'#ffe48f',4)+ln(X(distance),Y(st),X(distance),290,'#fff6ce',1,'5 4')+
    circle(X(distance),Y(pt),7,'#67e0ff')+circle(X(distance),Y(st),7,'#ffba80')+
    txt(78,33,'到時（秒）','#b7d7e9',13)+txt(593,323,'測站距離（km）','#b7d7e9',13)+txt(560,72,'P 藍線 · S 橘線','#fff2df',14)+txt(120,95,'Δt = S 到時 − P 到時','#fff0c5',14));
   ctrl=controlRange('distanceSlider','測站距離（km）',distance,30,600,10)+`<div class="lab-stat"><small>P 波到達</small><b>${pt.toFixed(1)} 秒</b></div><div class="lab-stat"><small>S 波到達</small><b>${st.toFixed(1)} 秒</b></div><div class="lab-stat"><small>P−S 時差</small><b>${dt.toFixed(1)} 秒</b></div>`;
   desc='此處採均勻介質示範速度 P=8、S=4.5 km/s；真實地球波速隨深度變化，正式地震定位使用走時模型。';
  }else{
   const sts=[{x:130,y:92,k:'A'},{x:608,y:110,k:'B'},{x:396,y:286,k:'C'}],ep={x:340,y:154};
   const circles=sts.map((s,i)=>{const r=Math.hypot(s.x-ep.x,s.y-ep.y);return (ringCount>i?circle(s.x,s.y,r,'none',['#59d7ff','#ffe09f','#b3f8ca'][i],2):'')+circle(s.x,s.y,8,['#59d7ff','#ffe09f','#b3f8ca'][i]) +txt(s.x+12,s.y-8,s.k,'#effaff',16)}).join('');
   picture=stage(`<rect width="760" height="350" rx="14" fill="#123a55"/>`+Array.from({length:15},(_,i)=>ln(24+i*50,16,24+i*50,334,'#2a5470',1)).join('')+Array.from({length:7},(_,i)=>ln(18,22+i*50,742,22+i*50,'#2a5470',1)).join('')+circles+(ringCount===3?circle(ep.x,ep.y,10,'#ff8c72','#fff',3)+txt(ep.x+18,ep.y-12,'三圈交會：震央','#fff1df',18):txt(260,35,'按下「多看一站」讓圓圈逐步出現','#bfefff',16)));
   ctrl=`<button class="lab-btn" id="revealStation">${ringCount===3?'重新開始':`多看一站（已顯示 ${ringCount}/3）`}</button><div class="lab-stat"><small>定位提示</small><b>${ringCount<2?'一個圓只有距離':ringCount===2?'兩圓仍可能有兩點':'三站交會定點'}</b></div>`;
   desc='各圓半徑代表「測站到震央的估計距離」。這是理想二維示意；實際定位考慮站點分布、速度模型和誤差。';
  }
  host.innerHTML=tabs+`<div class="lab-viewport">${picture}</div><div class="lab-controls">${ctrl}</div><div class="lab-note">🔎 ${desc}</div>`;
  host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{tab=b.dataset.mode;rerender()});
  const d=host.querySelector('#depthSlider');if(d)d.oninput=e=>{depth=+e.target.value;rerender()};
  const t=host.querySelector('#distanceSlider');if(t)t.oninput=e=>{distance=+e.target.value;rerender()};
  const p=host.querySelector('#phaseSlider');if(p)p.oninput=e=>{phase=+e.target.value;rerender()};
  const r=host.querySelector('#revealStation');if(r)r.onclick=()=>{ringCount=ringCount===3?0:ringCount+1;rerender()};
 };rerender();
};
// === 2 Earth interior ===
labRenders.earth=(host)=>{
 let tab='chem',depth=2900;
 function draw(){
  const R=135,cx=265,cy=172;
  let s=rect(0,0,760,355,'#102b46')+`<circle cx="265" cy="172" r="147" fill="#ffa35b" opacity=".22" filter="url(#shiny)"/>`+
  circle(cx,cy,138,'#8ecba8')+circle(cx,cy,135,'#d9a074')+circle(cx,cy,76,'#f48352')+circle(cx,cy,29,'url(#core)')+
  `<path d="M265 172L265 34 A138 138 0 0 1 403 172Z" fill="#08243b" opacity=".72"/>`+
  `<path d="M265 172L265 35 A137 137 0 0 0 128 172" fill="none" stroke="#8ddce6" stroke-width="7"/>`+
  `<path d="M265 172L265 97 A75 75 0 0 0 190 172" fill="none" stroke="#ffc58b" stroke-width="3"/>`+
  circle(265,172,30,'url(#core)')+
  ln(383,102,512,62,'#7fe5e3',2)+circle(383,102,5,'#7fe5e3')+txt(527,68,tab==='chem'?'地殼':'岩石圈','#d9faff',17)+ln(347,172,512,144,'#dfb98c',2)+circle(347,172,5,'#dfb98c')+txt(527,150,tab==='chem'?'地函':'軟流圈等地函','#fff0d6',16)+ln(309,198,512,229,'#ff9a6f',2)+circle(309,198,5,'#ff9a6f')+txt(527,235,'外核・液態','#ffdabd',16)+ln(280,183,512,296,'#f8d75e',2)+circle(280,183,5,'#f8d75e')+txt(527,302,'內核・固態','#fff1b0',16)+
  txt(34,330,'切面為概念圖，尺寸刻意放大地殼厚度方便理解','#aecedf',12);
  if(tab==='mech'){s+=`<path d="M265 34 A138 138 0 0 1 403 172" fill="none" stroke="#60d8e9" stroke-width="9"/><path d="M265 58 A114 114 0 0 1 379 172" fill="none" stroke="#f6d579" stroke-width="24" opacity=".62"/>`}
  let segment=depth<35?'地殼（大陸平均厚度示意）':depth<2900?'地函':depth<5150?'外核・液態':'內核・固態';
  let details=`<div class="lab-inline"><b>現在查詢 ${depth} km：</b>${segment}。波速在某些深度會突變，反映材料或物態變化；重點不是看顏色背答案，而是透過波的傳播找證據。</div>`;
  host.innerHTML=optionTabs([['chem','依成分分層'],['mech','依力學性質分層'],['speed','地震波速曲線'],['crust','海洋／大陸地殼']],tab)+
  `<div class="lab-viewport">${tab==='speed'?speedSvg():tab==='crust'?crustSvg():stage(s)}</div><div class="lab-controls">${tab==='speed'||tab==='crust'?'':controlRange('depthEarth','從地表往下看（km）',depth,0,6371,1)}</div>`+
  (tab==='speed'?`<div class="lab-inline">🔍 看見 S 波在約 2900 km 後不再穿過外核；P 波速明顯下降。圖是幫助理解的趨勢示意，非正式實測曲線。</div>`:tab==='crust'?`<div class="lab-inline">🔍 記住「大陸厚、平均較輕；海洋薄、平均較密」。莫氏面是兩種地殼的底界。</div>`:details)+
  `<div class="lab-note">資料概念：莫氏不連續面（地殼／地函）；古氏不連續面約 2900 km（地函／外核）；內核界面約 5150 km。</div>`;
  host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{tab=b.dataset.mode;draw()});let x=host.querySelector('#depthEarth');if(x)x.oninput=e=>{depth=+e.target.value;draw()};
 }
 function speedSvg(){const P='M74 300 L85 248 L140 210 L168 192 L270 150 L365 125 L390 116 L394 220 L470 193 L530 168 L532 154 L590 128 L690 95';const S='M74 300 L85 265 L138 237 L165 228 L268 203 L366 190 L390 181';return stage(rect(40,30,684,295,'#10354f',12)+Array.from({length:6},(_,i)=>ln(60,56+i*49,704,56+i*49,'#325a75',1)).join('')+`<path d="${P}" fill="none" stroke="#73dfff" stroke-width="4"/><path d="${S}" fill="none" stroke="#ffb279" stroke-width="4"/>`+ln(394,42,394,316,'#fff1ba',2,'5 5')+ln(532,42,532,316,'#fff1ba',2,'5 5')+txt(344,45,'2900 km','#ffeca5',12)+txt(507,45,'5150 km','#ffeca5',12)+txt(94,70,'P 波（藍）','#73dfff',15)+txt(94,92,'S 波（橘）','#ffb279',15)+txt(405,268,'S 無法穿過液態外核','#fff0db',14)+txt(250,338,'深度由左至右增加 →','#bfd9e7',12));}
 function crustSvg(){return stage(rect(10,35,330,74,'url(#ocean)',14)+rect(10,109,330,31,'#718ea1')+rect(10,140,330,175,'url(#mantle)')+rect(395,35,355,74,'#a9d88c',14)+rect(395,109,355,112,'url(#land)')+rect(395,221,355,94,'url(#mantle)')+ln(10,140,340,140,'#ffefae',3)+ln(395,221,750,221,'#ffefae',3)+txt(95,25,'海洋地殼','#8bdeff',19)+txt(500,25,'大陸地殼','#bceba7',19)+txt(80,165,'較薄 · 以玄武質為代表','#fff0d0',15)+txt(448,246,'較厚 · 常見花崗質岩石','#fff0d0',15)+txt(52,291,'莫氏不連續面','#fff8be',14)+txt(422,288,'莫氏不連續面','#fff8be',14));}
 draw();
};
// === 3 Rock lab: distinguish rocks and cycle ===
const rockSamples=[
{name:'花崗岩',type:'火成岩・深成岩',color:'#c4b8aa',pattern:'grain',why:'地下緩慢冷卻；石英、長石等礦物晶體較粗。',hint:'大顆粒、花斑狀'},
{name:'玄武岩',type:'火成岩・火山岩',color:'#43515b',pattern:'speck',why:'岩漿快速冷卻，通常深色、細粒，有時有氣孔。',hint:'暗色、細粒'},
{name:'安山岩',type:'火成岩・火山岩',color:'#84898b',pattern:'speck',why:'中性火山岩，臺灣火山弧岩石常見。',hint:'灰色、部分可見斑晶'},
{name:'砂岩',type:'沉積岩',color:'#c4aa72',pattern:'layers',why:'砂粒沉積後壓密膠結，常可辨認顆粒與層理。',hint:'粒粒、層層'},
{name:'板岩',type:'變質岩・片理',color:'#53646b',pattern:'slate',why:'泥質沉積岩經低度變質，發育板劈理。',hint:'薄片狀劈理'},
{name:'片麻岩',type:'變質岩・片理',color:'#9c9794',pattern:'gneiss',why:'較高程度的變質作用常可形成深淺相間的條帶。',hint:'深淺條帶'}
];
function specimen(r,i){
 const x=18+(i%3)*244,y=30+Math.floor(i/3)*158;
 let layer='';if(r.pattern==='layers')layer=Array.from({length:7},(_,j)=>`<path d="M${x+27} ${y+45+j*12}Q${x+100} ${y+40+j*11} ${x+188} ${y+43+j*12}" stroke="#76512e" stroke-width="4" opacity=".55" fill="none"/>`).join('');
 if(r.pattern==='gneiss')layer=Array.from({length:7},(_,j)=>`<path d="M${x+27} ${y+39+j*13}Q${x+90} ${y+48+j*10} ${x+192} ${y+38+j*12}" stroke="${j%2?'#e0d9d1':'#42464d'}" stroke-width="9" opacity=".76" fill="none"/>`).join('');
 if(r.pattern==='slate')layer=Array.from({length:13},(_,j)=>ln(x+32,y+32+j*6,x+195,y+28+j*6,'#b0bcc0',2)).join('');
 return rect(x,y,225,150,'#0b263d',13)+`<path d="M${x+28} ${y+40} L${x+95} ${y+20} L${x+186} ${y+31} L${x+201} ${y+98} L${x+147} ${y+126} L${x+38} ${y+115} Z" fill="${r.color}" stroke="#b7c8d1" stroke-width="2" filter="url(#rockgrain)"/>`+layer+txt(x+115,y+141,r.name,'#e6f8ff',15,850,'middle');
}
labRenders.rocks=(host)=>{
 let tab='samples',idx=0,rockState='火成岩',cycleMessage='先選下方一個地質作用，看看這塊火成岩的下一站。';
 function draw(){let art='',controls='',note='';
 if(tab==='samples'){
  art=stage(rockSamples.map(specimen).join(''),355); controls=`<div class="lab-control" style="flex:2"><label>選一塊岩石，看判別線索</label><select id="rockChoice">${rockSamples.map((r,i)=>`<option value="${i}" ${i===idx?'selected':''}>${r.name}</option>`).join('')}</select></div><div class="lab-stat"><small>你應先找</small><b>${rockSamples[idx].hint}</b></div>`;note=`${rockSamples[idx].name}｜${rockSamples[idx].type}。${rockSamples[idx].why} 這些是教學紋理示意，並非實際標本照片。`;
 }else if(tab==='cycle'){
  const nodes=[[136,170,'岩漿','#f6a36f'],[363,81,'火成岩','#9ac1ce'],[610,170,'沉積岩','#e0c392'],[363,273,'變質岩','#bb9fcf']];
  art=stage(`<path d="M203 125Q255 82 294 85M432 90Q505 95 552 134M553 218Q482 264 427 273M290 277Q210 249 193 212" fill="none" stroke="#6da5bd" stroke-width="4" stroke-dasharray="8 7"/>`+
    nodes.map(([x,y,t,col])=>circle(x,y,t===rockState?70:57,t===rockState?'#f6e6b2':col,t===rockState?'#ffffff':'#9cb8cd',t===rockState?5:2)+
      circle(x-11,y-18,t===rockState?32:24,'#ffffff24')+txt(x,y+6,t,t===rockState?'#3e3827':'#092940',20,950,'middle')+
      (t===rockState?txt(x,y-84,'★ 目前所在','#ffeab6',16,900,'middle'):'')).join('')+
    txt(26,336,'試試其他路線：不是只能「火成 → 沉積 → 變質」單向循環。','#ccebf4',13));
  controls=`<div class="lab-control" style="flex:2"><label>目前：${rockState}　｜　你想施加什麼作用？</label><div style="display:flex;gap:7px;flex-wrap:wrap"><button class="lab-btn" data-process="冷卻">❄ 冷卻</button><button class="lab-btn" data-process="風化沉積">🌧 風化沉積</button><button class="lab-btn" data-process="高溫高壓">♨ 高溫高壓</button><button class="lab-btn" data-process="熔融">🔥 熔融</button><button class="lab-btn" data-process="reset">↻ 重來</button></div></div>`;
  note=cycleMessage+' 岩石循環中，各箭頭對應真實地質作用；「風化沉積」包含風化、侵蝕、搬運、沉積與壓密膠結。';
 }else{
  art=stage(`<rect width="760" height="355" fill="#11314b"/>`+[[50,'礫石','>2 mm','#ba9571'],[230,'砂粒','0.0625–2 mm','#d0b074'],[410,'粉砂','更細','#afa47a'],[590,'黏土','最細','#7f8981']].map(([x,n,s,c],i)=>rect(x,85,140,168,c,10)+Array.from({length:18+i*10},(_,j)=>circle(x+12+(j*43)%112,102+((j*37)%124),Math.max(1,8-i*2),['#876445','#e9d3aa','#737e73','#43544b'][i])).join('')+txt(x+70,277,n,'#e9f5ff',17,850,'middle')+txt(x+70,299,s,'#afcfe5',12,700,'middle')).join('')+txt(20,46,'碎屑粒徑由左到右變小','#a6e4fe',19));
  note='礫岩、砂岩、粉砂岩、頁岩／泥岩（含黏土）常依顆粒大小區分；單用顆粒大小無法直接確定水流速度，還要一起判讀沉積環境。';
 }
 host.innerHTML=optionTabs([['samples','① 猜岩石'],['cycle','② 岩石循環'],['grain','③ 沉積粒徑']],tab)+`<div class="lab-viewport">${art}</div><div class="lab-controls">${controls}</div><div class="lab-inline">🔍 ${note}</div>`;
 host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{tab=b.dataset.mode;draw()});const c=host.querySelector('#rockChoice');if(c)c.onchange=e=>{idx=+e.target.value;draw()};
 host.querySelectorAll('[data-process]').forEach(b=>b.onclick=()=>{
   const act=b.dataset.process,old=rockState;
   if(act==='reset'){rockState='火成岩';cycleMessage='重來：現在從火成岩出發。'}
   else if(act==='冷卻'&&rockState==='岩漿'){rockState='火成岩';cycleMessage='岩漿慢慢或快速冷卻固結，形成火成岩！'}
   else if(act==='風化沉積'&&rockState!=='岩漿'){rockState='沉積岩';cycleMessage=`${old} 風化成沉積物，再經搬運、沉積、壓密膠結，形成沉積岩！`}
   else if(act==='高溫高壓'&&rockState!=='岩漿'){rockState='變質岩';cycleMessage=`${old} 在尚未完全熔融下受熱壓改造，形成變質岩！`}
   else if(act==='熔融'&&rockState!=='岩漿'){rockState='岩漿';cycleMessage=`${old} 熔融，變成岩漿！`}
   else cycleMessage=`現在是${rockState}，這個作用暫不適用；試選另一個地質作用。`;
   draw();
 });
 }draw();
};
// === 4 Drift, sea floor spreading, magnetic stripes ===
labRenders.drift=(host)=>{
 let tab='stripe',age=4;
 function draw(){
 let art='',ctrl='',note='';
 if(tab==='stripe'){
   let stripes=''; const w=23+age*5;
   for(let i=0;i<=8;i++){let col=['#68c1e8','#d3a86a','#68c1e8','#d3a86a','#d3a86a','#68c1e8','#d3a86a','#68c1e8','#d3a86a'][i];let x1=380-(i+1)*w,x2=380+i*w;stripes+=rect(x1,113,w,109,col)+rect(x2,113,w,109,col)}
   art=stage(rect(0,0,760,103,'#145783')+rect(0,103,760,146,'#36526d')+stripes+`<path d="M355 123Q373 76 380 58Q390 88 405 123 L404 232 L355 232Z" fill="#eb734f"/><path d="M0 235Q210 222 350 232 Q380 242 410 232 Q550 222 760 235 L760 350 L0 350Z" fill="url(#mantle)"/>`+txt(315,47,'中洋脊（新海床）','#bceeff',18)+txt(110,75,'海水','#abdffc',16)+ln(344,272,135,272,'#89dff4',5)+ln(416,272,630,272,'#89dff4',5)+txt(118,302,'← 向西移動','#bcefff',15)+txt(494,302,'向東移動 →','#bcefff',15)+txt(18,337,'條帶寬度是教學示意；真正極性年代長短不同。','#b9d7e9',12));
   ctrl=controlRange('stripeAge','擴張後時間（情境階段）',age,1,8);note='海底兩側磁條帶幾乎鏡像；從中洋脊向外海床逐漸變老。改變「擴張階段」後，新海底不斷填在中央，舊條帶被帶往兩邊。';
 }else if(tab==='puzzle'){
   art=stage(`<path d="M180 58 Q270 47 308 92 Q345 110 303 155 L268 196 Q235 231 262 280 Q218 302 190 261 L163 218 Q130 183 153 140Z" fill="#b8c87f" stroke="#e5e1b3" stroke-width="4"/><path d="M468 45 Q549 48 569 98 Q537 130 514 177 Q487 200 480 256 Q441 275 414 230 Q426 196 403 154 Q427 112 434 80Z" fill="#a8bd78" stroke="#e5e1b3" stroke-width="4"/>`+ln(319,160,409,160,'#f5dc9a',3,'5 6')+txt(153,35,'南美洲','#e8f8ff',18)+txt(458,35,'非洲','#e8f8ff',18)+txt(285,325,'岩層、化石與古氣候可跨洲連線','#c2e6f5',14));
   note='海岸線像拼圖是直觀起點，但不是唯一證據。古生物化石、地層、古氣候與冰川痕跡的對應，才是更有說服力的證據。圖是抽象形狀示意，不作精確古地理重建。';
 }else{
   const dist=180; art=stage(rect(0,0,760,350,'#11364e')+`<path d="M100 215Q200 165 335 205Q380 220 425 205Q560 175 660 215" stroke="#70bcd7" stroke-width="16" fill="none"/>`+circle(380,215,11,'#efaa68')+ln(380,215,635,215,'#ffe39b',3)+txt(350,179,'中洋脊','#a9effa',18)+txt(498,198,'120 km','#ffe0a2',18)+txt(497,246,'300 萬年','#d1dff1',17)+txt(170,70,'單側平均擴張速率','#b8e8ff',19)+txt(205,117,'120 km ÷ 3 百萬年 = 4 cm／年','#fff4da',22)+txt(170,311,'兩側對稱且同速 → 總張開速率約 8 cm／年','#e0f5ff',17));
   note='題目若問「某一側移動速度」，只取單側距離；若問兩側板塊「相對張開速度」，需合計左右兩側速率。';
 }
 host.innerHTML=optionTabs([['stripe','① 磁條帶'],['puzzle','② 大陸證據'],['speed','③ 速度推理']],tab)+`<div class="lab-viewport">${art}</div><div class="lab-controls">${ctrl}</div><div class="lab-inline">🧭 ${note}</div>`;
 host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{tab=b.dataset.mode;draw()});let r=host.querySelector('#stripeAge');if(r)r.oninput=e=>{age=+e.target.value;draw()};
 }draw();
};
// === 5 plate boundary cross sections + hotspot ===
labRenders.plates=(host)=>{
 let tab='sub';
 const options=[['div','張裂'],['sub','洋－陸聚合'],['island','洋－洋聚合'],['collide','陸－陸碰撞'],['transform','錯動'],['hotspot','熱點']];
 function draw(){let art='',note='';
 const bg=rect(0,0,760,105,'url(#ocean)')+rect(0,250,760,100,'url(#mantle)');
 const arrow=(x,y,dir=1,col='#80e6ff')=>ln(x,y,x+dir*92,y,col,5)+`<polygon points="${x+dir*106},${y} ${x+dir*91},${y-9} ${x+dir*91},${y+9}" fill="${col}"/>`;
 const quake=(x,y)=>circle(x,y,5,'#ffe284','#ffecc5',1);
 if(tab==='div'){
  art=stage(bg+`<path d="M0 106 L314 106 L343 151 L366 151 L389 106 L760 106 L760 240 L395 240 L368 189 L343 189 L308 240 L0 240Z" fill="url(#slab)"/><path d="M346 265L358 173L381 137L405 265Z" fill="#fa8855"/>`+arrow(310,84,-1)+arrow(445,84,1)+txt(290,38,'張裂：新海洋地殼在中洋脊形成','#b8edff',21)+txt(335,209,'岩漿上湧','#ffd6a0',15)+quake(295,172)+quake(430,164)+txt(20,330,'淺源地震常見','#c9e4ef',14));
  note='中洋脊張裂、地函減壓熔融產生玄武質岩漿，形成新的海洋地殼；大陸上張裂可形成裂谷。';
 }else if(tab==='sub'||tab==='island'){
  const land=tab==='sub';
  art=stage(rect(0,0,760,103,'url(#ocean)')+rect(0,103,760,247,'url(#mantle)')+`<path d="M0 119L286 119Q313 138 337 146Q405 172 590 350 L515 350Q375 222 317 203 L0 183Z" fill="url(#slab)" stroke="#9fd6ff" stroke-width="4"/>`+
    `<path d="M343 139Q380 121 432 125Q467 126 502 ${land?105:125}L760 ${land?105:125} L760 217 Q600 184 478 170Z" fill="${land?'url(#land)':'url(#slab)'}"/>`+
    `<path d="M443 179Q482 200 492 163Q506 135 515 126" stroke="#ff9a66" stroke-width="7" fill="none" stroke-dasharray="10 7"/>`+
    `<path d="M492 ${land?109:128}L520 52L548 ${land?109:128}" fill="#86644c" stroke="#a87a53" stroke-width="5"/>`+
    `<path d="M512 84L520 57L530 84" stroke="#ffb36f" stroke-width="6" fill="none"/>`+arrow(197,78,1)+arrow(628,78,-1)+txt(24,40,land?'海洋板塊向大陸下方隱沒':'海洋板塊隱沒形成島弧','#e6f8ff',19)+txt(266,128,'海溝','#b9eafa',14)+txt(545,54,land?'大陸火山弧':'火山島弧','#fff0d9',15)+
    [[329,157],[363,187],[403,220],[448,264],[492,300]].map(p=>quake(p[0],p[1])).join('')+txt(536,309,'震源由淺向深排列','#ffe7b3',15));
  note=land?'海洋板塊較冷較密時可向下隱沒；海溝靠近下沉端，水帶入地函楔促進部分熔融，在大陸邊緣形成火山弧。':'洋－洋聚合時也會形成海溝、島弧與傾斜的淺中深源地震帶，如馬里亞納海溝。';
 }else if(tab==='collide'){
   art=stage(rect(0,0,760,105,'#264d63')+rect(0,250,760,100,'url(#mantle)')+`<path d="M0 145L245 145L295 115L326 68L365 119L388 73L440 142L760 145L760 250L0 250Z" fill="url(#land)"/><path d="M0 228Q200 203 280 239Q380 275 490 237Q640 205 760 230" stroke="#edd6b7" stroke-width="10" fill="none"/>`+arrow(190,105,1)+arrow(564,105,-1)+txt(224,40,'大陸碰撞 → 地殼變厚，擠皺抬升','#ecffdc',21)+txt(339,146,'褶皺山脈','#f3f5ed',15,800,'middle')+txt(50,325,'喜馬拉雅山屬此類','#ffe2b0',14));
   note='兩側大陸岩石圈不易像冷老海洋岩石圈一樣大量隱沒，擠壓可令地殼增厚、形成高大山脈與高原。';
 }else if(tab==='transform'){
   art=stage(rect(0,0,760,350,'#143b51')+`<path d="M0 38L355 38L355 325L0 325Z" fill="#bb915f"/><path d="M405 38L760 38L760 325L405 325Z" fill="#94734c"/>`+
     ln(380,30,380,330,'#e6e0ba',6,'13 8')+arrow(175,145,1)+arrow(592,218,-1)+txt(315,26,'平移斷層','#f0f0d5',17)+txt(170,310,'沿邊界水平滑動','#e4faee',18)+quake(380,165)+quake(380,218));
   note='兩側沿斷層水平相對運動，卡住時可累積應力，突然錯動就造成淺源地震；通常不會產生大量新地殼。';
 }else{
   const pts=[[115,110,48],[245,116,34],[355,123,24],[460,129,14]];
   art=stage(rect(0,0,760,85,'url(#ocean)')+rect(0,85,760,135,'url(#slab)')+rect(0,220,760,130,'url(#mantle)')+`<path d="M390 340Q412 255 445 178" stroke="#ff945b" stroke-width="13" fill="none" stroke-dasharray="22 7"/>`+
    pts.map(([x,y,r],i)=>`<path d="M${x-r} ${y}L${x} ${y-r}L${x+r} ${y}Z" fill="#b48659" stroke="#ffd7ad" stroke-width="2"/>`+txt(x,y-65,i===0?'最老':i===3?'最新':'','#ffe4a6',15,800,'middle')).join('')+arrow(320,60,-1)+txt(455,53,'熱點近乎固定，板塊移動','#d5f7fc',16)+txt(478,297,'地函上湧（示意）','#ffdca4',15));
   note='同一板塊經過熱點，上方火山形成後被帶走；火山鏈隨距離與年齡出現系統性變化。並非每座火山都在板塊邊界。';
 }
 host.innerHTML=optionTabs(options,tab,'data-mode')+`<div class="lab-viewport">${art}</div><div class="lab-inline">🔎 ${note}</div><div class="lab-note">各剖面都是原創教學示意，特意放大厚度與岩漿位置；不代表真實地形比例或實測震源位置。</div>`;
 host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{tab=b.dataset.mode;draw()});
 }draw();
};
// === 6 Taiwan: interaction via mapped regions and rocks ===
labRenders.taiwan=(host)=>{
 let tab='north';
 const info={north:{title:'北部｜琉球隱沒＋沖繩海槽張裂',note:'在臺灣東北外海，菲律賓海板塊向北隱沒，北臺灣也受沖繩海槽張裂與火山作用影響。',col:'#7ae5ff'},middle:{title:'中部｜弧陸碰撞抬升山脈',note:'呂宋島弧與歐亞大陸邊緣碰撞，中央山脈隆升；花東縱谷是重要縫合帶。',col:'#ffd994'},south:{title:'南部｜馬尼拉海溝向東隱沒',note:'歐亞板塊的海洋部分於馬尼拉海溝向東隱沒到菲律賓海板塊之下。',col:'#c7a4ff'},rocks:{title:'岩石分布｜西部沉積、中部變質、東部火山與沉積',note:'中央山脈常見板岩、片岩；西部麓山帶常見沉積岩；海岸山脈有安山岩、火山碎屑岩與沉積岩。分布為概略示意。',col:'#8ee5b4'}};
 function draw(){
   const colors={north:'#7ae5ff',middle:'#ffd994',south:'#c7a4ff',rocks:'#8ee5b4'};
   const taiwanPath='M383 33Q419 50 423 80L418 126Q402 160 413 196Q415 234 395 258Q366 285 343 313Q325 327 319 303Q312 276 315 246Q307 219 312 184Q313 157 328 131Q343 108 349 82Q355 57 383 33Z';
   const coast=`<path d="${taiwanPath}" fill="#9aba7e" stroke="#daeeaf" stroke-width="4"/>`;
   const region=tab==='north'?`<ellipse cx="377" cy="98" rx="39" ry="47" fill="#78dcf8" opacity=".65"/>`:tab==='middle'?`<ellipse cx="358" cy="193" rx="39" ry="65" fill="#ffce78" opacity=".65"/>`:tab==='south'?`<ellipse cx="348" cy="266" rx="30" ry="44" fill="#ba93ec" opacity=".65"/>`:
     `<path d="M330 115L350 68L359 280L337 310Q311 277 318 224Z" fill="#d5b374" opacity=".85"/><path d="M354 70L385 42L395 255L357 288Z" fill="#89bda1" opacity=".85"/><path d="M395 91L422 92L411 228L394 253Z" fill="#ba8f92" opacity=".85"/>`;
   const labels=tab==='rocks'?txt(175,113,'西部：沉積岩','#ffd49f',16)+txt(179,150,'中部：變質岩','#b1e8bd',16)+txt(457,180,'東部：火成＋沉積','#e4c9d3',15):
    txt(38,58,info[tab].title,colors[tab],20)+
    (tab==='north'?txt(480,86,'琉球海溝 →','#85e8ff',15):tab==='south'?txt(465,259,'← 馬尼拉海溝','#d7b9ff',15):txt(466,184,'← 擠壓造山 →','#ffe1a6',15));
   const arrow=tab==='north'?`<path d="M470 136Q432 92 411 65" fill="none" stroke="#80e2ff" stroke-width="6" marker-end="url(#arr)"/>`:tab==='south'?`<path d="M180 260Q245 270 312 254" fill="none" stroke="#c9a8ff" stroke-width="6" marker-end="url(#arr)"/>`:tab==='middle'?ln(235,191,300,191,'#ffe3a2',5)+ln(500,191,428,191,'#ffe3a2',5):'';
   const art=stage(rect(0,0,760,350,'#123d59')+`<path d="M0 0H760V350H0Z" fill="url(#ocean)" opacity=".45"/>`+Array.from({length:7},(_,i)=>ln(0,45+i*45,760,45+i*45,'#3e7e9c',1)).join('')+
       coast+region+`<path d="${taiwanPath}" fill="none" stroke="#e9ffe8" stroke-width="3"/>`+
       `<path d="M371 52Q367 117 355 177Q349 235 337 289" fill="none" stroke="#e9e3be" stroke-width="4" stroke-dasharray="8 6"/>`+
       txt(290,34,'臺灣','#e8faff',15)+labels+arrow+
       txt(28,334,'教學定位示意｜方位與構造概念，非比例尺地質圖','#b4d5e7',12));
   host.innerHTML=optionTabs([['north','北部'],['middle','中部'],['south','南部'],['rocks','岩石區']],tab)+`<div class="lab-viewport">${art}</div><div class="lab-inline">🧭 ${info[tab].note}</div>`;
   host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{tab=b.dataset.mode;draw()});
 }draw();
};
