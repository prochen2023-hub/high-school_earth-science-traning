'use strict';
const KEY='earthsciences-v48-completion';
const STORE={getItem(k){try{return window.localStorage.getItem(k)}catch{return null}},setItem(k,v){try{window.localStorage.setItem(k,v)}catch{}}};
const completed=new Set(JSON.parse(STORE.getItem(KEY)||'[]'));
let view='home',lessonId=null,quiz=null,examTimer=null,examSeconds=0,voiceActive=false;
const main=document.getElementById('main'),side=document.getElementById('sidebar'),toast=document.getElementById('toast');
const unitById=id=>UNITS.find(u=>u.id===id);
const rich=t=>String(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const fmt=(t)=>String(t).replaceAll('［','[').replaceAll('］',']');
const setCompleted=(id)=>{completed.add(id);STORE.setItem(KEY,JSON.stringify([...completed]));refreshNav();};
const toastMsg=(s)=>{toast.textContent=s;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)};
function refreshNav(){
 document.getElementById('unitNav').innerHTML=UNITS.map(u=>`<button class="unit-link ${view==='lesson'&&lessonId===u.id?'active':''}" data-unit="${u.id}"><span class="num">${u.n}</span><span class="meta"><b>${u.emoji} ${u.name}</b><small>${u.range}</small></span><span class="done">${completed.has(u.id)?'✓':''}</span></button>`).join('');
 if(document.body.dataset.activeChapter==='all')document.getElementById('progressTag').textContent='兩章並列｜第二次段考';else if(document.body.dataset.activeChapter!=='ch4')document.getElementById('progressTag').textContent=`第三章進度 ${completed.size} / ${UNITS.length}`;
 document.querySelectorAll('[data-view]').forEach(btn=>btn.classList.toggle('active',view!=='lesson'&&btn.dataset.view===view));
 document.querySelectorAll('[data-unit]').forEach(btn=>btn.onclick=()=>go('lesson',btn.dataset.unit));
 document.querySelectorAll('[data-view]').forEach(btn=>btn.onclick=()=>go(btn.dataset.view));
 document.querySelectorAll('[data-atlas-open]').forEach(a=>a.onclick=e=>{e.preventDefault();go('atlas',a.dataset.atlasOpen)});
 document.querySelectorAll('[data-ch3-hub]').forEach(b=>b.onclick=()=>go('gallery'));
 document.querySelectorAll('#resetProgress').forEach(btn=>btn.onclick=()=>{if(confirm('要清除第三章已完成的學習記錄嗎？')){completed.clear();STORE.setItem(KEY,'[]');refreshNav();toastMsg('進度已清除')} });
}
function go(dest,id){if(typeof guideClose==='function')guideClose();if(examTimer){clearInterval(examTimer);examTimer=null}if('speechSynthesis' in window)window.speechSynthesis.cancel();voiceActive=false;
 view=dest;lessonId=dest==='lesson'?id:null;
 window.activateChapter?.(dest==='home'?'all':'ch3');
 side.classList.remove('open');document.getElementById('menuToggle').setAttribute('aria-expanded','false');
 if(dest==='chapter3')renderChapter3Home();else if(dest==='lesson')renderLesson(unitById(id));else if(dest==='review')renderReview();else if(dest==='challenge')renderChallenge();else if(dest==='exam')renderExamHome();else if(dest==='atlas')renderAtlas(id||'geology');else if(dest==='gallery')renderGalleryHub();else if(dest==='today')startRound('today');else renderHome();
 refreshNav();window.scrollTo({top:0,behavior:'instant'});document.title=`地科秘笈 v4.16｜${dest==='lesson'?unitById(id).name:'第三章 山川壯麗的大地'}`;
}
function renderAtlas(tab='geology'){
  const tpl=document.getElementById('atlasInlineTemplate');
  if(!tpl){main.innerHTML='<p>圖像資料未完整載入，請確認 atlas-integrated.js 等檔案已上傳。</p>';return;}
  main.replaceChildren(tpl.content.cloneNode(true));
  window.initializeAtlas(tab);
  bindLinks();
}
function sectionTitle(num,title,aside=''){return `<div class="block-heading"><span class="num">${num}</span><h2>${title}</h2>${aside?`<span class="aside">${aside}</span>`:''}</div>`}
function previewCard(u){return `<button class="unit-card" data-unit="${u.id}"><div class="photo" style="background-image:url('${u.image}')"><span class="number">${u.n}</span><span class="unit-emoji">${u.emoji}</span></div><div class="words"><h3>${u.name}</h3><p>${u.title}</p><div class="foot"><span>▶ 進入完整圖解與實驗</span><span class="status">${completed.has(u.id)?'✓ 已學過':'未完成'}</span></div></div></button>`}
function renderGalleryHub(){ main.innerHTML=window.renderCh3GalleryHome();bindLinks();refreshNav(); }
window.openEarthChapter=(dest)=>go(dest||'home');
function renderHome(){
 window.activateChapter?.('all');
 main.innerHTML=`<section class="parallel-hero"><span class="parallel-eyebrow">高一地科・第二次段考｜雙章完整學習</span><h1>地球會動，天空也會變。<br><em>從看懂一張圖開始。</em></h1><p>第三章和第四章是兩個同樣完整的學習世界：各有課程、圖卡、互動與挑戰；學完再進入第三＋四章共同的第二次段考。</p></section>
 <section class="parallel-chapters" aria-label="選擇學習章節">
 <article class="parallel-chapter-card land"><img src="assets/chapter3/taiwan-master.webp" alt="第三章：臺灣地質、海底構造與板塊示意" loading="eager"><div class="parallel-card-body"><span class="parallel-index">CHAPTER 03 · 6 個任務</span><h2>山川壯麗的大地</h2><p>為什麼會地震？科學家怎麼知道地球內部？岩石與板塊又如何把臺灣變成高山？</p><div class="parallel-pills"><span>地震波</span><span>地球分層</span><span>真實岩石</span><span>板塊地形</span><span>臺灣構造</span></div><button class="parallel-primary" data-view="chapter3">⛰️ 進入第三章課程 →</button><div class="parallel-quick"><button data-ch3-hub>看圖理解</button><button data-view="challenge">分級練習</button><button data-view="exam">單章試題</button></div></div></article>
 <article class="parallel-chapter-card air"><img src="assets/weather/forecast.webp" alt="第四章：大氣層與鋒面天氣圖教材" loading="eager"><div class="parallel-card-body"><span class="parallel-index">CHAPTER 04 · 4 個任務</span><h2>風起雲湧的大氣</h2><p>高山為什麼冷？雲雨怎麼來？東北季風與颱風、梅雨鋒面為何造成不同天氣？</p><div class="parallel-pills"><span>氣壓溫度</span><span>水氣與雲</span><span>風場</span><span>鋒面</span><span>颱風</span></div><button class="parallel-primary" data-weather-nav="home">☁️ 進入第四章課程 →</button><div class="parallel-quick"><button data-weather-nav="a1">大氣分層</button><button data-weather-nav="a3">季風風場</button><button data-weather-nav="a4">天氣圖</button></div></div></article>
 </section>
 <section class="parallel-exam"><div><span class="parallel-eyebrow">COMMON MISSION · 兩章一起挑戰</span><h2>第二次段考 A／B 卷</h2><p>地質＋大氣各占一半；20 題、100 分、40 分鐘。資料表、剖面、風場、等壓線、震源分布與臺灣情境，交卷後提供完整詳解。</p></div><button data-weather-nav="exam">📝 前往雙章段考 →</button></section>
 <section class="parallel-reading"><h2>🔎 怎麼學最容易記住？</h2><p>每章先從生活提問、看圖觀察，再操作實驗與判斷數據，最後練相同概念的變化題。題目是依你的課本與兩份互動式講義範圍重新編寫，不是照抄原題。</p></section>`;
 bindLinks();
}
function renderChapter3Home(){
 main.innerHTML=`
 <section class="hero"><div class="inner"><span class="eyebrow">THE EARTH IS ALIVE · CH.03</span><h1>地球不是靜止的。<br>它一直在動。</h1><p class="lead">地震從哪裡來？科學家沒挖到地核卻知道它是液態？大陸真的會漂移？臺灣的山又怎麼長出來？這一章，我們把六個疑問串成一個可以親手探索的故事。</p><p class="hero-tag">不是背更多，而是終於看懂。</p><div class="hero-actions"><button class="action gold" data-unit="quake">▶ 從第一個疑問開始</button><button class="action outline" data-view="review">⚡ 先看全章地圖</button></div></div><span class="hero-counter">全章互動 × 臺灣真實標本 × 實際地形底圖 · 全離線</span></section>
 ${sectionTitle('01','六個任務，走完一整章','課本 p.66–99 全章對照')}
 <div class="unit-grid">${UNITS.map(previewCard).join('')}</div>
    <section class="ch3-home-showcase"><span class="eyebrow" style="color:#9ee6ff">NEW · v4.15 圖像課</span><h2>第三章四張全新名師圖卡，直接帶你進入六組圖解</h2><p>每節不只貼一張總覽：可以切換觀察鏡頭、放大中文圖說、先看線索再推原因，還有一題老師變化題。真實岩石標本與臺灣海底地形資料也保留。</p><div class="ch3-home-tiles">${[['earth-master.webp','地球分層與地震波','interior'],['plate-master.webp','板塊三種運動與隱沒','plate'],['rock-master.webp','岩石分類與岩石循環','rocks'],['taiwan-master.webp','臺灣地質與周邊海底','taiwan']].map(([im,txt,id])=>`<button type="button" data-unit="${id}"><img src="assets/chapter3/${im}" loading="lazy" alt="${txt}，點擊前往教學"><span>${txt} ↗</span></button>`).join('')}</div><button class="ch3-home-cta" data-ch3-hub type="button">🖼️ 進入第三章完整圖像學堂 →</button></section>
 <section class="atlas-feature"><div class="atlas-feature-top"><div><b class="atlas-kicker">NEW · 突破原來的簡易地圖</b><h2>臺灣地質 × 海底地形 × 真正岩石標本</h2><p>以臺灣真實海岸與海底地形為底，分別查看地質帶、深海構造、立體隱沒及岩石實物照片。每一張圖都有自己的教學任務。</p></div><a href="#atlas-geology" data-atlas-open="geology" class="atlas-mainlink">開啟完整圖像學院 ↗</a></div><div class="atlas-feature-grid"><a href="#atlas-geology" data-atlas-open="geology"><img src="assets/atlas/taiwan-zones.webp" alt="臺灣地質帶的實際海岸線圖" loading="lazy"><span>① 地質帶精細對照</span></a><a href="#atlas-seafloor" data-atlas-open="seafloor"><img src="assets/atlas/taiwan-seafloor.webp" alt="臺灣周邊海溝、海槽、海底地形地圖" loading="lazy"><span>② 海溝海槽分清楚</span></a><a href="#atlas-mechanism" data-atlas-open="mechanism"><img src="assets/atlas/subduction-3d.webp" alt="立體隱沒機制" loading="lazy"><span>③ 立體隱沒的地質作用</span></a><a href="#atlas-specimens" data-atlas-open="specimens"><img src="assets/atlas/rock-marble.webp" alt="大理岩真實岩石標本照片" loading="lazy"><span>④ 11 張真實岩石樣本</span></a></div></section>
 ${sectionTitle('02','這六件事其實只是一條線','從現象到機制，再回到生活')}
 <div class="flow-board">${[['💥','震源破裂'],['〰️','地震波傳遞'],['🌍','發現地球分層'],['🪨','岩石形成改變'],['🌋','板塊持續運動'],['🇹🇼','解釋臺灣']].map(([e,t])=>`<div class="flow-tile"><span>${e}</span><b>${t}</b></div>`).join('')}</div>
 ${sectionTitle('03','學生可以選自己的進度','每一節都有圖、互動和錯誤觀念整理')}
 <div class="feature-row"><button class="feature" data-view="review"><span class="badge-emoji">⚡</span><span>30 秒救命<br><small>考前一眼串起來</small></span></button><button class="feature" data-view="today"><span class="badge-emoji">⏱</span><span>8 分鐘快速練<br><small>一次只練 5 題</small></span></button><button class="feature" data-view="challenge"><span class="badge-emoji">🎮</span><span>ABCD 四級闖關<br><small>基礎到素養</small></span></button><button class="feature" data-view="exam"><span class="badge-emoji">📝</span><span>第三章練習 A／B<br><small>兩份單章練習</small></span></button></div>
 <div class="update-note"><strong>🎯 你現在看到的是 v4.15 第三、四章雙章平行精修版</strong>：請找「🔎 開啟圖解與互動 ↗」及每張卡的縮圖；如果仍看到「✓ 用圖理解」，代表瀏覽器或 GitHub Pages 還是舊版。<a href="guides/index.html">直接看 38 張圖解總目錄 →</a></div>
 <p class="tiny section-space">設計原則：第 3 章內容以你提供的課本頁面作為範圍依據；圖像改採實際地形底圖、立體藝術示意及使用者提供的實物標本局部照片；精細地質界線須參考官方地圖，並參考中央氣象署、USGS 與臺灣地質資料核對科學概念。</p>`;
 bindLinks();
}
function scenarioHtml(u){return `<div class="scenario" id="scenario"><div class="scene-step">🧩 生活情境　→　先猜想　→　揭開答案</div><div class="question">${u.hook}</div><div class="choice-group">${u.choices.map((t,i)=>`<button class="choice" data-hook="${i}"><b>${['A','B','C'][i]}</b>　${t}</button>`).join('')}</div><div id="hookExplain" hidden></div></div>`}
function renderLesson(u){if(!u)return renderHome();
 const ix=UNITS.findIndex(x=>x.id===u.id);const next=UNITS[ix+1];
 main.innerHTML=`<section class="lesson-cover" style="--lesson-image:url('${u.image}');--lesson-color:${u.accent}"><div><span class="quest">QUEST ${u.n} · ${u.range}</span><h1>${u.title}</h1><p class="lesson-sub">${u.hook} 這一節不急著背名字，先看得見、動得了，再把完整知識裝回去。</p></div></section>
 <div class="lesson-sticky"><span class="crumb">首頁／第三章／<b>${u.name}</b></span><button class="action secondary" data-view="chapter3">← 第三章總覽</button><button class="action secondary" data-view="challenge">🎮 檢查理解</button></div>
 ${sectionTitle('1','先從生活裡提出一個問題','勇敢猜，不用先會')}
 ${scenarioHtml(u)}
 <div class="bigline">🧠 這節的故事只有一條：${rich(u.line)}</div>
 ${sectionTitle('2','名師看圖理解：先看、再推、最後用題目確認','每張圖卡都能放大、切換、揭曉答案')}
 ${window.renderCh3Visual(u.id)}
 ${(['taiwan','plate','rocks'].includes(u.id)) ? `<section class="atlas-lesson-portal"><div><b>🎓 必看：臺灣地質與海底構造真圖鑑</b><h2>${u.id==='rocks'?'11 張真實岩石標本，不再看假石頭':u.id==='taiwan'?'從臺灣地質帶走到海底，岩石和板塊一次串起來':'精緻立體隱沒：海溝、增積岩體、火山弧、深淺震帶'}</h2><p>這裡用實際地形底圖、來源可查的學術資料和真正的岩石實物照片，讓每一種概念都有不同的圖像證據。</p><a href="#atlas-${u.id==='rocks'?'specimens':u.id==='plate'?'mechanism':'geology'}" data-atlas-open="${u.id==='rocks'?'specimens':u.id==='plate'?'mechanism':'geology'}" class="action">▶ 進入新版完整圖像教學 ↗</a></div><img src="${u.id==='rocks'?'assets/atlas/rock-granite.webp':u.id==='plate'?'assets/atlas/subduction-3d.webp':'assets/atlas/taiwan-seafloor.webp'}" alt="${u.name}新版圖像學習" loading="lazy"></section>` : ''}
 ${sectionTitle('3','圖上自己動手，眼睛先懂','可反覆調參數、切換情境')}
 <div class="lab-panel"><div class="lab-header"><div><h3>🔬 ${u.labTitle}</h3><p>${u.labIntro}</p></div><span class="pill dark">SVG 原創 · 離線可動</span></div><div id="lab"></div></div>
 ${sectionTitle('4','把實驗結果接回正式知識','每張卡都能開啟對應圖解')}
 <div class="guide-invite">✅ <b>真正可點的獨立圖解頁：</b>每張卡都有新的圖像預覽，點卡片或「開啟圖解與互動 ↗」即可看到操作、觀察、推理與答案。<a class="guide-list-link" href="guides/index.html">直接瀏覽全章 38 張圖解 ↗</a></div>
 <div class="three">${u.concepts.map((c,i)=>`<a class="concept-card" href="guides/${u.id}-${String(i+1).padStart(2,'0')}.html" aria-label="開啟${c.title}的獨立圖解課堂" style="--concept-color:${u.accent}"><div class="concept-preview"><img src="assets/previews/${u.id}-${String(i+1).padStart(2,'0')}.webp" alt="${c.title}互動圖像預覽" loading="lazy"></div><span class="chip">${c.tag}</span><div class="concept-icon">${({pin:'📍',depth:'📏',wave:'〰️',surface:'🏠',clock:'⏱',rings:'◎',layers:'🌍',boundary:'◍',crust:'🪨',igneous:'🔥',sedimentary:'🏞',metamorphic:'💎',cycle:'🔁',puzzle:'🧩',ridge:'🌊',magnetic:'🧲',plates:'🧭',div:'↔️',sub:'↘️',coll:'⛰️',trans:'⇆',volcano:'🌋',density:'⚖️',tw:'🇹🇼',rockmap:'🗺️'})[c.visual]||'🧩'}</div><span class="micro">${c.key}</span><h3>${c.title}</h3><p>${rich(c.text)}</p><div class="inspect"><span>課本概念 ${i+1}／${u.concepts.length}</span><span class="inspect-action">🔎 開啟圖解與互動 ↗</span></div></a>`).join('')}</div>
 ${sectionTitle('5','老師最想提醒你的三種陷阱','先拆掉容易答錯的誤解')}
 <div class="trap-grid">${u.traps.map(([a,b])=>`<div class="trap"><div class="bad">✕ 「${a}」</div><div class="good">✔ ${b}</div></div>`).join('')}</div>
 ${sectionTitle('6','圖表題先看哪裡？','考試不會只問定義')}
 <div class="eyes">${u.eyes.map((e,i)=>`<div class="eye"><span>${String(i+1).padStart(2,'0')}</span><div>${rich(e)}</div></div>`).join('')}</div>
 <div class="memory"><h3>⚡ 30 秒救命口訣</h3><div class="words">${u.memory}</div><div class="faded">口訣只是提示，必須能用剛剛的圖自己解釋，才是真正記住。</div></div>
 ${window.ENRICHMENT?.lesson('ch3',u.id)||''}
 ${sectionTitle('7','剛學完，立刻試一題','答案後會說明理由')}
 <div class="quiz-card" id="miniQuiz"></div>
 <div class="source-bar"><b>知識核對來源：</b>${u.sources.map(([t,l])=>`<a href="${l}" target="_blank" rel="noopener noreferrer">${t} ↗</a>`).join('')}<span>｜教學圖由本站重新設計</span></div>
 <div class="lesson-end"><p>${completed.has(u.id)?'✅ 你已標記學過這節。':'這節理解了嗎？先勾完成，再前往下一關。'}</p><div class="actions"><button class="action secondary" id="markDone">${completed.has(u.id)?'✓ 已完成':'✓ 我已理解這一節'}</button>${next?`<button class="action" data-unit="${next.id}">下一關：${next.name} →</button>`:`<button class="action" data-view="chapter3">返回第三章全章 →</button>`}</div></div>`;
 bindLinks();window.mountCh3Visual(u.id);mountLab(u.lab,document.getElementById('lab'));
 document.querySelectorAll('[data-hook]').forEach(b=>b.onclick=()=>{
  const ans=+b.dataset.hook;
  document.querySelectorAll('[data-hook]').forEach(bb=>{const i=+bb.dataset.hook;bb.disabled=true;bb.classList.toggle('correct',i===u.answer);bb.classList.toggle('wrong',i===ans&&i!==u.answer)});
  const ex=document.getElementById('hookExplain');ex.hidden=false;ex.className='reveal';ex.innerHTML=`<b>${ans===u.answer?'你抓到線索了！':'這個猜測值得釐清。'}</b> ${u.hookExplain}`;
 });
 document.getElementById('markDone').onclick=()=>{setCompleted(u.id);document.getElementById('markDone').textContent='✓ 已完成';toastMsg('這一節已加入學習記錄！')};
 renderMiniQuiz(u.id);
}
function renderMiniQuiz(unit){const pool=QUESTIONS.filter(q=>q.unit===unit);const q=pool[Math.floor(Math.random()*pool.length)];const box=document.getElementById('miniQuiz');let selected=-1,locked=false;
 box.innerHTML=`<div class="quiz-meta">課後即時檢核｜${LEVEL_LABEL[q.level]}</div><h2>${q.stem}</h2><div class="options">${q.opts.map((o,i)=>`<button class="option" data-opt="${i}"><b>${'ABCD'[i]}.</b> ${o}</button>`).join('')}</div><div class="quiz-actions"><button class="action" id="miniSubmit">確認答案</button><button class="action secondary" id="miniNext">換一題</button></div><div id="miniFeedback"></div>`;
 box.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>{if(locked)return;selected=+b.dataset.opt;box.querySelectorAll('[data-opt]').forEach(x=>x.classList.toggle('selected',+x.dataset.opt===selected))});
 box.querySelector('#miniSubmit').onclick=()=>{if(selected<0){toastMsg('先選一個答案。');return}locked=true;box.querySelectorAll('[data-opt]').forEach(x=>{const i=+x.dataset.opt;x.disabled=true;x.classList.toggle('good',i===q.answer);x.classList.toggle('bad',i===selected&&i!==q.answer)});box.querySelector('#miniFeedback').innerHTML=`<div class="feedback"><b>${selected===q.answer?'✔ 答對，真的理解了！':'↗ 先記下正確判讀方法。'}</b><p>${q.explain}</p></div>`};
 box.querySelector('#miniNext').onclick=()=>renderMiniQuiz(unit);
}
function renderReview(){
 main.innerHTML=`<div class="review-hero"><span class="eyebrow" style="color:#95e6ff">QUICK MEMORY LAB</span><h1>第三章一眼總整理</h1><p>不需要一天把名詞全部背好。先抓住六句話，再用圖、案例與題目把它們接起來。</p><div class="scoreline"><span>目前已學 ${completed.size} / 6 節</span><button class="action gold" data-view="challenge">開始闖關 →</button></div></div>
 <div class="flow-board">${[['💥','地下震源'],['〰️','地震波'],['🌍','地球分層'],['🪨','岩石變身'],['🌋','板塊移動'],['🇹🇼','臺灣造山']].map(([e,t])=>`<div class="flow-tile"><span>${e}</span><b>${t}</b></div>`).join('')}</div>
 ${sectionTitle('01','六句口訣＋完整理解','記口訣，也看它究竟在說什麼')}
 <div class="review-grid">${UNITS.map(u=>`<article class="review-card"><span class="pill">${u.range}</span><h3>${u.emoji} ${u.name}</h3><p>${u.line}</p><div class="keyline">${u.memory}</div><button class="action secondary" style="margin-top:12px" data-unit="${u.id}">回到圖解教學 ↗</button></article>`).join('')}</div>
 ${sectionTitle('02','最常搞混的十二組觀念','先用這張圖卡補洞')}
 <div class="trap-grid">${UNITS.flatMap(u=>u.traps.slice(0,2).map(([a,b])=>`<div class="trap"><div class="bad">✕ ${a}</div><div class="good">✔ ${b}</div></div>`)).join('')}</div>
 ${sectionTitle('03','真正段考會出的六種圖','看到哪張圖，先抓哪個線索')}
 <div class="eyes">${[['P/S 走時','先找第一次 P 到與 S 到，計算時差。'],['震源深度圖','沿板塊向下分布的地震，指向隱沒方向。'],['P/S 波速—深度','波速突變可找不連續面，S 消失找液態外核。'],['岩石照片／紋理','先看顆粒、層理、片理，再推形成過程。'],['海床年齡／磁條帶','先找中洋脊軸線，左右對稱且越遠越老。'],['臺灣板塊構造','先分北琉球、南馬尼拉、中部碰撞，別把方向混成一條。']].map(([a,b],i)=>`<div class="eye"><span>${i+1}</span><div><b>${a}：</b>${b}</div></div>`).join('')}</div>`;
 bindLinks();
}
function renderChallenge(){main.innerHTML=`<div class="review-hero"><span class="eyebrow" style="color:#85e3ff">CHALLENGE</span><h1>ABCD 四級闖關</h1><p>所有難度都能自由開始。每關 5 題，答完立即知道原因；不靠背選項，練的是判讀。</p></div><div class="challenge-levels">${['A','B','C','D'].map(x=>`<button class="levelcard" data-startlevel="${x}"><b>${x}</b><h3>${LEVEL_LABEL[x]}</h3><p>${{A:'基本概念重建',B:'概念與關係',C:'情境數字變形',D:'整合判圖與迷思'}[x]}</p></button>`).join('')}</div><div class="quiz-card"><h3>也可以只練某一節</h3><div class="filterline"><label for="unitSelect">練習範圍</label><select id="unitSelect"><option value="all">全部第三章</option>${UNITS.map(u=>`<option value="${u.id}">${u.name}</option>`).join('')}</select><button class="action" id="startFive">▶ 隨機 5 題</button><button class="action secondary" data-view="exam">去做第三章練習卷</button></div><p class="tiny">本版收錄 ${QUESTIONS.length} 題新編題目，含波速換算、海床擴張速率、岩類辨認、斜向震源帶等題型。</p></div>`;
 bindLinks();document.querySelectorAll('[data-startlevel]').forEach(b=>b.onclick=()=>startRound('challenge',b.dataset.startlevel,document.getElementById('unitSelect').value));
 document.getElementById('startFive').onclick=()=>startRound('challenge','all',document.getElementById('unitSelect').value);
}
function renderExamHome(){main.innerHTML=`<div class="review-hero"><span class="eyebrow" style="color:#99f2d4">CHAPTER EXAM</span><h1>第三章單章練習 A／B 卷</h1><p>正式第二次段考需同時包含第四章大氣篇，本區目前只做第三章 20 題練習，不假稱完整段考。真正的「學會」是換一種問法仍然看得懂。A 卷著重基礎與判讀，B 卷提高情境整合比例。</p></div><div class="exam-start"><article class="exam-card"><span class="pill">A 卷 · 35 分鐘</span><h3>扎穩觀念</h3><p>20 題 × 5 分＝100 分，兼顧六個任務，含基礎與關係判讀。</p><button class="action" data-startexam="A">開始 A 卷 →</button></article><article class="exam-card"><span class="pill">B 卷 · 35 分鐘</span><h3>素養變形</h3><p>20 題 × 5 分＝100 分，強化圖像概念、數值推論與臺灣應用。</p><button class="action" data-startexam="B">開始 B 卷 →</button></article></div><p class="tiny section-space">每次抽題都會自動重新組卷，送出後提供全題詳解；倒數時間會顯示於題目上方。</p>`;document.querySelectorAll('[data-startexam]').forEach(b=>b.onclick=()=>startRound('exam',b.dataset.startexam));}
function shuffled(a){const copy=[...a];for(let i=copy.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function balancedExam(which){const pool=which==='A'?QUESTIONS.filter(q=>['A','B','C'].includes(q.level)):QUESTIONS.filter(q=>['B','C','D'].includes(q.level));let chosen=[];
 UNITS.forEach((u,i)=>{let local=shuffled(pool.filter(q=>q.unit===u.id));chosen.push(...local.slice(0,i<2?4:3))});return shuffled(chosen).slice(0,20);
}
function startRound(mode,level='all',unit='all'){
 if(examTimer)clearInterval(examTimer);
 let pool=mode==='today'?QUESTIONS.filter(q=>completed.size===0||completed.has(q.unit)):QUESTIONS.filter(q=>(unit==='all'||q.unit===unit)&&(level==='all'||q.level===level));
 if(mode==='exam')pool=balancedExam(level);else pool=shuffled(pool).slice(0,5);
 if(pool.length===0){toastMsg('這個條件下沒有題目；換個難度即可。');return}
 view=mode==='exam'?'exam':mode==='today'?'today':'challenge';quiz={mode,level,unit,pool,idx:0,answers:Array(pool.length).fill(null),checked:false};examSeconds=35*60;
 renderQuestion();if(mode==='exam')examTimer=setInterval(()=>{examSeconds--;const x=document.getElementById('examClock');if(x)x.textContent=clock(examSeconds);if(examSeconds<=0){clearInterval(examTimer);examTimer=null;finishRound()}},1000);refreshNav();window.scrollTo(0,0);
}
const clock=sec=>`${String(Math.floor(Math.max(0,sec)/60)).padStart(2,'0')}:${String(Math.max(0,sec)%60).padStart(2,'0')}`;
function renderQuestion(){if(!quiz)return;const {pool,idx,answers,mode}=quiz;const q=pool[idx];const selected=answers[idx];const exam=mode==='exam';
 main.innerHTML=`<div class="review-hero"><span class="eyebrow" style="color:#b8f0ff">${exam?'SIMULATED EXAM':'DAILY CHALLENGE'}</span><h1>${exam?`第三章練習 ${quiz.level} 卷`:mode==='today'?'8 分鐘快練':`闖關 ${quiz.level==='all'?'混合':quiz.level} 級`}</h1><div class="scoreline"><span>第 ${idx+1} / ${pool.length} 題</span>${exam?'<span class="timer" id="examClock">'+clock(examSeconds)+'</span>':''}<span>${LEVEL_LABEL[q.level]}</span></div><div class="progressbar" style="margin-top:15px"><i style="width:${(idx+1)/pool.length*100}%"></i></div></div><div class="quiz-card"><div class="quiz-meta">${q.id.toUpperCase()} · ${unitById(q.unit).name} · ${q.level} 級</div><h2>${q.stem}</h2><div class="options">${q.opts.map((o,i)=>`<button class="option ${selected===i?'selected':''}" data-answer="${i}"><b>${'ABCD'[i]}.</b> ${o}</button>`).join('')}</div><div id="quizFeedback">${!exam&&quiz.checked?`<div class="feedback">${selected===q.answer?'✔ 答對！':'↗ 答案是 '+('ABCD'[q.answer])+'。'} ${q.explain}</div>`:''}</div><div class="quiz-actions">${!exam?`<button class="action gold" id="checkBtn">先核對這題</button>`:''}<button class="action" id="nextBtn">${idx===pool.length-1?'完成並看結果':'下一題 →'}</button><button class="action secondary" id="abortBtn">返回章節</button></div></div>`;
 const optionBtns=main.querySelectorAll('[data-answer]');optionBtns.forEach(b=>{b.onclick=()=>{if(!exam&&quiz.checked)return;quiz.answers[idx]=+b.dataset.answer;optionBtns.forEach(bb=>bb.classList.toggle('selected',bb===b))}});
 if(!exam){const check=document.getElementById('checkBtn');check.onclick=()=>{if(quiz.answers[idx]===null){toastMsg('先選一個答案。');return}quiz.checked=true;optionBtns.forEach(b=>{b.disabled=true;let i=+b.dataset.answer;b.classList.toggle('good',i===q.answer);b.classList.toggle('bad',i===quiz.answers[idx]&&i!==q.answer)});document.getElementById('quizFeedback').innerHTML=`<div class="feedback"><b>${quiz.answers[idx]===q.answer?'✔ 這題學會了。':'↗ 答案是 '+('ABCD'[q.answer])+'。'}</b> ${q.explain}</div>`}}
 document.getElementById('nextBtn').onclick=()=>{if(quiz.answers[idx]===null&&!confirm('這題還沒有選答案，要直接跳過嗎？'))return;if(idx===pool.length-1)finishRound();else{quiz.idx++;quiz.checked=false;renderQuestion();window.scrollTo(0,0)}};
 document.getElementById('abortBtn').onclick=()=>go('home');
}
function finishRound(){if(examTimer){clearInterval(examTimer);examTimer=null}if(!quiz)return;const {pool,answers,mode}=quiz;const n=pool.reduce((s,q,i)=>s+(q.answer===answers[i]),0);const score=mode==='exam'?n*5:Math.round(n/pool.length*100);const wrong=pool.filter((q,i)=>q.answer!==answers[i]);
 main.innerHTML=`<div class="result"><div class="eyebrow" style="color:#7ce4fd">THIS IS WHAT YOU LEARNED</div><h2>${mode==='exam'?score+' 分':n+' / '+pool.length+' 題'}</h2><p class="sub">${score>=85?'概念已經非常穩了，下一次可以升級難度。':score>=60?'主要想法有了，再補幾個容易混淆的圖就能前進。':'先看懂錯的那幾題，回到圖上一眼就能補起來。'}</p><button class="action gold" id="resultRetry">再挑戰一回</button><button class="action secondary" id="resultHome">回第三章首頁</button></div>${sectionTitle('錯題','逐題檢討與回到來源概念',`答對 ${n} 題，還可以救回 ${wrong.length} 題`)}<div class="review-answers">${pool.map((q,i)=>`<article class="review-answer"><b>${q.answer===answers[i]?'✓':'✕'} ${q.id}　${q.stem}</b><p style="margin:5px 0">你的回答：${answers[i]===null?'未作答':q.opts[answers[i]]} ｜ <b>正解：${q.opts[q.answer]}</b></p><small>${q.explain}</small><button class="action secondary" style="margin-top:9px;padding:7px 12px" data-unit="${q.unit}">回到「${unitById(q.unit).name}」圖解</button></article>`).join('')}</div>`;
 document.getElementById('resultRetry').onclick=()=>mode==='exam'?startRound('exam',quiz.level):startRound(mode,quiz.level,quiz.unit);
 document.getElementById('resultHome').onclick=()=>go('home');bindLinks();window.scrollTo(0,0);
}
function bindLinks(){main.querySelectorAll('[data-ch3-hub]').forEach(b=>b.onclick=()=>go('gallery'));main.querySelectorAll('[data-atlas-open]').forEach(a=>a.onclick=e=>{e.preventDefault();go('atlas',a.dataset.atlasOpen)});main.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>go(b.dataset.view));main.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>go('lesson',b.dataset.unit));}
document.getElementById('menuToggle').addEventListener('click',()=>{const yes=side.classList.toggle('open');document.getElementById('menuToggle').setAttribute('aria-expanded',String(yes))});
document.getElementById('ttsButton').onclick=()=>{
 if(!('speechSynthesis' in window)){toastMsg('此瀏覽器暫不支援語音朗讀');return}
 if(voiceActive){speechSynthesis.cancel();voiceActive=false;toastMsg('已停止朗讀');return}
 const text=[...main.querySelectorAll('h1,h2,h3,.concept-card p,.review-card p')].slice(0,22).map(n=>n.textContent).join('。');
 if(!text){toastMsg('沒有可朗讀的內容');return}
 const u=new SpeechSynthesisUtterance(text);u.lang='zh-TW';u.rate=.94;u.onend=()=>voiceActive=false;u.onerror=()=>voiceActive=false;speechSynthesis.cancel();speechSynthesis.speak(u);voiceActive=true;toastMsg('開始朗讀這一頁')
};
refreshNav();
const initialLesson = window.location.hash.match(/^#lesson=(quake|interior|rocks|drift|plate|taiwan)$/);
if(initialLesson){go('lesson',initialLesson[1])}else if(/^#atlas-(geology|seafloor|mechanism|specimens|practice)$/.test(location.hash)){go('atlas',location.hash.slice(7))}else{renderHome();bindLinks()}
window.addEventListener('hashchange',()=>{const m=location.hash.match(/^#lesson=(quake|interior|rocks|drift|plate|taiwan)$/);if(m)go('lesson',m[1]);else if(/^#atlas-(geology|seafloor|mechanism|specimens|practice)$/.test(location.hash)&&view!=='atlas')go('atlas',location.hash.slice(7));});
