const D=window.CURRICULUM;
const S=D.sections;
const C=D.chapters;
let stars=Number(localStorage.getItem('geo_stars')||0);
let scope=JSON.parse(localStorage.getItem('geo_scope')||'null')||{name:'第一次段考',chapters:['ch1','ch2']};
let teachIndex=Number(localStorage.getItem('geo_teach_index')||5);
let onlyTaught=localStorage.getItem('geo_only_taught')==='1';
let currentLessonId=null;

const PLANETS={
 '水星':{au:.39,year:'88天',rot:'58.6天',note:'最靠近太陽，幾乎沒有厚大氣保溫。'},
 '金星':{au:.72,year:'225天',rot:'約243天（逆向）',note:'濃厚CO₂大氣造成強烈溫室效應，表面比水星更熱。'},
 '地球':{au:1,year:'365.25天',rot:'約24小時',note:'第3顆行星，有液態海洋與生命。'},
 '火星':{au:1.52,year:'687天',rot:'約24.6小時',note:'一天長度與地球接近，但一年更長。'},
 '木星':{au:5.20,year:'11.86年',rot:'約9.9小時',note:'太陽系最大行星，自轉很快。'},
 '土星':{au:9.58,year:'29.5年',rot:'約10.7小時',note:'以明顯環系統聞名。'},
 '天王星':{au:19.2,year:'84年',rot:'約17小時（近側躺）',note:'自轉軸傾斜非常大，季節很特殊。'},
 '海王星':{au:30.1,year:'164.8年',rot:'約16小時',note:'八大行星中離太陽最遠。'},
 '冥王星':{au:39.5,year:'248年',rot:'約6.4天',note:'2006年起正式列為矮行星，不是第九大行星。'}
};

const LABS={
 '1-1':{title:'☄️ 把地球做出來',sub:'先看「從塵埃到行星」的故事，不背一串名詞。',tabs:[['form','吸積動畫'],['diff','密度分異']]},
 '1-2':{title:'🌊 藍色地球誕生',sub:'冷卻、海洋、氧氣是一條時間故事。',tabs:[['ocean','海洋怎麼來'],['oxygen','氧氣怎麼增加']]},
 '1-3':{title:'🦴 地球歷史偵探',sub:'先排先後，再用放射性時鐘估年齡。',tabs:[['strata','地層排順序'],['half','半衰期時鐘']]},
 '2-1':{title:'〰️ 看不見地心也能推理',sub:'看波怎麼走，就能知道裡面是固體還液體。',tabs:[['waves','P/S粒子運動'],['inside','地球內部透視']]},
 '2-2':{title:'🌋 板塊構造證據實驗室',sub:'先讀真實圖資，再用動畫解釋機制；不拿簡圖冒充地圖。',tabs:[['evidence','真實全球證據'],['age','海床年齡'],['mag','地磁錄音帶'],['cycle','中洋脊→海溝']]},
 '2-3':{title:'🚨 地震：從波到災害',sub:'先分震源、規模、震度，再理解速報與場址效應。',tabs:[['warning','P/S波與速報'],['site','規模≠震度'],['cwa','氣象署延伸']]},
 '3-1':{title:'🎈 往上飛的大氣',sub:'氣壓一路降，溫度卻不是一路降。',tabs:[['layers','大氣分層'],['pressure','高度與氣壓']]},
 '3-2':{title:'☁️ 把雲做出來',sub:'空氣冷到飽和，水氣才容易凝結。',tabs:[['dew','露點與凝結'],['parcel','空氣上山']]},
 '3-3':{title:'💨 風為什麼會轉彎',sub:'先有氣壓差，再談科氏偏轉與摩擦。',tabs:[['wind','風向三步驟']]},
 '3-4':{title:'🗺️ 天氣圖不再滿版亂碼',sub:'永遠照同一順序讀圖。',tabs:[['map','四步讀圖']]},
 '3-5':{title:'🌀 颱風熱機',sub:'暖海餵水氣，凝結放熱，登陸後常失去能量。',tabs:[['typhoon','暖海→增強'],['damage','災害不只強風']]},
 '4-1':{title:'🧂 海水不是整缸一樣',sub:'溫度、鹽度改變密度，於是海洋會分層。',tabs:[['profile','溫鹽密度']]},
 '4-2':{title:'🌊 浪・潮・流分清楚',sub:'先問「到底是誰在移動？」',tabs:[['wave','海浪傳能量'],['tide','日月潮汐'],['current','洋流轉彎']]},
 '4-3':{title:'🌏 海洋和大氣互相拉扯',sub:'海溫、風、湧升一起變，才是ENSO。',tabs:[['enso','聖嬰／反聖嬰']]},
 '5-1':{title:'🛰️ 從太空看地球',sub:'遙測、衛星軌道、火箭與極光都要回答「為什麼要放在這裡」。',tabs:[['remote','遙測怎麼看'],['orbit','LEO/MEO/GEO'],['spacex','SpaceX案例'],['aurora','極光怎麼來'],['spaceResource','官方太空資源']]},
 '5-2':{title:'🌌 站在臺灣抬頭看',sub:'先從觀測者的位置出發，再解釋日夜、季節、北極星與月球。',tabs:[['day','自轉＝日夜'],['season','四季・日照・永晝永夜'],['polaris','臺灣看北極星'],['moon','月球有沒有自轉'],['seasonResource','NASA季節圖解']]},
 '5-3':{title:'✨ 太陽系到宇宙',sub:'不只背順序：要分得出層級、運動、尺度與分類。',tabs:[['address','宇宙地址'],['solar','八大行星＋冥王星'],['motion','公轉×自轉'],['distance','距太陽遠近'],['light','光年時光機'],['solarResource','NASA太陽系']]},
 '6-1':{title:'📈 天氣不是氣候',sub:'把時間拉長，才看得到氣候。',tabs:[['timescale','時間尺度']]},
 '6-2':{title:'🧊 小變化怎麼放大',sub:'冰雪回饋與海平面是最直觀的兩條鏈。',tabs:[['ice','冰雪回饋'],['sea','海平面來源']]},
 '6-3':{title:'🏭 暖化歸因不是猜',sub:'看能量、來源與多種證據是否同時對上。',tabs:[['greenhouse','溫室能量'],['finger','證據指紋']]},
 '6-4':{title:'🛡️ 減緩還是調適',sub:'一個處理原因，一個處理衝擊。',tabs:[['response','分類挑戰']]},
 '7-1':{title:'⚖️ 永續不是只看環保',sub:'把環境、社會、經濟與未來一起放上桌。',tabs:[['balance','三角取捨']]},
 '7-2':{title:'🔋 資源的一生',sub:'從開採到回收都算，才叫完整。',tabs:[['life','生命週期'],['energy','能源取捨']]}
};


const TEACHER_GUIDE={
 '2-2':{
  standard:'課綱核心：大陸漂移、海底擴張、板塊構造三套想法如何由證據逐步建立；能辨識張裂、聚合、錯動邊界，並用地質構造與震源分布解釋臺灣。',
  must:['板塊是「岩石圈」的一部分，不等於地殼。','中洋脊附近海床最年輕，離開中洋脊後通常愈老。','交替磁條帶近似對稱，是海底擴張的重要證據。','聚合邊界若有海洋岩石圈隱沒，常出現海溝、不同深度地震與火山弧。'],
  traps:['「海洋板塊因海水重所以沉」錯；關鍵是海洋岩石圈冷卻後整體密度與負浮力。','地震不是只在板塊邊界；但全球大型地震分布與邊界有高度關聯。','中洋脊造成的是新洋殼形成，不是地磁倒轉；它保存倒轉紀錄。'],
  exam:'看到全球地震分布圖時，先找「帶狀」；看到中洋脊剖面先找「最年輕」；看到斜向深震源帶要想到隱沒板塊。'
 },
 '2-3':{
  standard:'課綱核心：用地震波、震源與地表震動描述地震，並能分辨規模、震度、速報與預測。',
  must:['規模描述一次地震的大小；震度描述某地搖晃程度。','P波較快、S波較慢；速報利用先到資訊，不等於提前知道地震會發生。','同一地震在不同地點震度可不同，距離與場址條件都會影響。'],
  traps:['收到警報不代表「預測成功」，而是地震已發生後快速測報。','規模6不是每個地方都震度6。'],
  exam:'題目給測站到時差，要先判斷P先S後；題目比較兩地搖晃，要把距離與地盤條件一起看。'
 },
 '5-1':{
  standard:'高中重點不是背衛星名稱，而是理解遙測「不接觸量測」與不同軌道高度／用途之間的關係。',
  must:['自然衛星與人造衛星都靠重力維持軌道。','LEO、MEO、GEO是不同高度與任務取捨，不是越高越好。','遙測以不同波段獲得地表或大氣資訊，假色影像不是造假。'],
  traps:['衛星在軌道上仍受重力；不是到了太空就沒有重力。','SpaceX與Tesla是不同公司；可把SpaceX當成可重複使用火箭與衛星部署的現代案例。'],
  exam:'先問「要觀測得細、要覆蓋得廣、還是要固定看同一區？」再判斷軌道。'
 },
 '5-2':{
  standard:'課綱核心：由地球觀測天體的周日／周年視運動，並理解太陽每日位置會隨季節改變。',
  must:['地球自轉造成日夜與多數天體東升西落的周日視運動。','季節主因是地軸傾斜＋公轉，造成太陽高度與日照時間改變。','北極星仰角約等於觀測者北緯；在臺灣約二十多度。','月球有自轉；同步自轉使它長期以同一面朝地球。'],
  traps:['北半球夏季不是因為地球比較靠近太陽。','永晝永夜不是極區停止自轉，而是地軸傾斜造成太陽整日位於地平線上／下。','月相不是天天被地球影子遮住。'],
  exam:'題目問季節，先看日照角與日長；問北極星先看緯度；問月球同一面先抓「自轉週期≈公轉週期」。'
 },
 '5-3':{
  standard:'高中要建立尺度觀：地球屬太陽系，太陽系位於銀河系；光年是距離；八大行星與矮行星分類要正確。',
  must:['現行正式分類是八大行星；冥王星是矮行星。','行星公轉＝繞太陽；自轉＝繞自身軸。','距太陽越遠通常公轉週期越長，但表面溫度不能只用距離判斷。','光年是光一年走的距離，不是時間單位。'],
  traps:['銀河系不是太陽系的別名。','金星比水星更熱，提醒你溫度還受大氣影響。'],
  exam:'排序題先背「水金地火木土天海」；尺度題先問「誰包含誰」；光年題先翻成「我們看到多久以前的光」。'
 }
};
function teacherStandardHTML(s){const g=TEACHER_GUIDE[s.id];if(!g)return '';return `<div class="chunk teacherStandard"><div class="eyebrow">🎓 高中教師審核：這節到底要會什麼</div><p><b>${esc(g.standard)}</b></p><div class="standardGrid"><div><h4>必會</h4><ul>${g.must.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>最容易失分</h4><ul>${g.traps.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><div class="examCue"><b>考題判讀：</b>${esc(g.exam)}</div></div>`;}
function officialCard(title,desc,url,label='開啟官方資源'){return `<div class="officialCard"><div><b>${esc(title)}</b><p>${esc(desc)}</p></div><a class="primary officialLink" href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a></div>`;}
const done=()=>new Set(JSON.parse(localStorage.getItem('geo_done')||'[]'));
const cname=id=>C.find(x=>x.id===id)?.title||id;
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const on=code=>esc(code);
function saveDone(x){localStorage.setItem('geo_done',JSON.stringify([...x]));}
function updateStars(){document.getElementById('starCount').textContent='⭐ '+stars;}
function addStar(n=1){stars+=n;localStorage.setItem('geo_stars',stars);updateStars();renderSkillShelf();}
function toggleLow(){document.body.classList.toggle('lowtext');}
function cleanSpeech(t){return String(t).replace(/[🌏🌋🌊☀️☀🌙⭐✨🛰️🛰🚀🧲👀💡📘⚠️🎯😎🧠🧩🆘✅❌🌀☁️💨🗺️🎈🦴☄️🛡️♻️🔋📈🧊🏭⚖️]/g,'').replace(/\s+/g,' ').trim();}
function speak(t){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(cleanSpeech(t));u.lang='zh-TW';u.rate=.93;speechSynthesis.speak(u);}
function speakVisible(){let root=document.querySelector('#lessonApp:not(.hidden) .lessonMode:not(.hidden)')||document.querySelector('.page.active');if(root)speak(root.innerText);}
function eligibleSections(){let arr=S.filter(x=>scope.chapters.includes(x.ch));if(onlyTaught)arr=arr.filter(x=>S.indexOf(x)<=teachIndex);return arr.length?arr:S.filter(x=>scope.chapters.includes(x.ch));}

function showPage(p){
 document.getElementById('mainApp').classList.remove('hidden');
 document.getElementById('lessonApp').classList.add('hidden');
 document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
 document.getElementById('page-'+p).classList.add('active');
 document.querySelectorAll('.navtab').forEach(x=>x.classList.toggle('active',x.dataset.page===p));
 if(p==='chapters')renderChapters();
 if(p==='range')renderRange();
 if(p==='home')renderSkillShelf();
 updateScopeUI();
 scrollTo({top:0,behavior:'smooth'});
}

function renderHome(){
 const picks=['2-2','3-5','4-2','5-2'].map(id=>S.find(x=>x.id===id));
 document.getElementById('lifeGrid').innerHTML=picks.map(x=>`<div class="card lifeCard"><div class="lifeEmoji">${x.emoji}</div><b>${esc(x.hook)}</b><span class="mini">${esc(x.one)}</span><button class="secondary" onclick="${on(`openLesson('${x.id}')`)}">看看原理 →</button></div>`).join('');
 renderSkillShelf();
}
function renderSkillShelf(){
 const box=document.getElementById('skillShelf'); if(!box)return;
 const ds=done(); const mastered=S.filter(s=>ds.has(s.id));
 if(!mastered.length){box.innerHTML='<div class="card"><b>😎 高手招式還沒解鎖</b><p class="muted">每完成一節，就會留下那節可以拿去教同學的30秒絕招。</p></div>';return;}
 box.innerHTML=mastered.slice(-6).reverse().map(s=>`<div class="skillCard"><span>${s.id}</span><b>${esc(s.teach?.brag||s.one)}</b><button class="tinyBtn" onclick="${on(`openLesson('${s.id}')`)}">再練一次</button></div>`).join('');
}
function updateScopeUI(){
 document.getElementById('scopeName').textContent=scope.name;
 document.getElementById('scopeSummary').textContent=scope.chapters.map(cname).join('＋');
 let sec=S.filter(x=>scope.chapters.includes(x.ch)),ds=done(),n=sec.filter(x=>ds.has(x.id)).length,p=sec.length?Math.round(n/sec.length*100):0;
 document.getElementById('scopeMeter').style.width=p+'%';
 document.getElementById('scopeProgress').textContent=`已完成 ${n}/${sec.length} 小節（${p}%）`;
}
function renderChapters(){
 let ds=done();
 document.getElementById('chapterGrid').innerHTML=C.map(ch=>{
  let ss=S.filter(x=>x.ch===ch.id),n=ss.filter(x=>ds.has(x.id)).length;
  return `<article class="card chapterCard"><div class="chapterHead"><div class="chapterIcon">${ch.emoji}</div><div><div class="eyebrow">${ch.num}</div><h3>${esc(ch.title)}</h3><div class="muted">${esc(ch.tagline)}</div></div></div><div class="meter"><i style="width:${Math.round(n/ss.length*100)}%"></i></div><div class="mini">${n}/${ss.length} 小節完成</div><div class="sectionList">${ss.map(x=>`<div class="sectionRow ${ds.has(x.id)?'done':''}"><span class="secid">${x.id}</span><div><b>${x.emoji} ${esc(x.title)}</b><div class="mini">${esc(x.one)}</div></div><button class="secondary" onclick="${on(`openLesson('${x.id}')`)}">${ds.has(x.id)?'再複習':'開始'}</button></div>`).join('')}</div></article>`;
 }).join('');
}
function renderRange(){
 document.getElementById('teachSlider').max=S.length-1;document.getElementById('teachSlider').value=teachIndex;document.getElementById('onlyTaught').checked=onlyTaught;updateTeachProgress(teachIndex,false);
 document.getElementById('rangeChecks').innerHTML=C.map(ch=>`<label class="check"><input type="checkbox" class="scopeCheck" value="${ch.id}" ${scope.chapters.includes(ch.id)?'checked':''}><span><b>${ch.num} ${esc(ch.title)}</b><br><span class="mini">${S.filter(x=>x.ch===ch.id).map(x=>x.id).join('、')}</span></span></label>`).join('');
}
function applyPreset(k){let n={exam1:'第一次段考',exam2:'第二次段考',exam3:'第三次段考／期末'}[k];scope={name:n,chapters:[...D.defaultScopes[k]]};localStorage.setItem('geo_scope',JSON.stringify(scope));renderRange();updateScopeUI();}
function saveCustomScope(){let ch=[...document.querySelectorAll('.scopeCheck:checked')].map(x=>x.value);if(!ch.length){alert('至少選一章');return;}scope={name:'自訂段考範圍',chapters:ch};localStorage.setItem('geo_scope',JSON.stringify(scope));updateScopeUI();}
function selectAllScope(v){document.querySelectorAll('.scopeCheck').forEach(x=>x.checked=v);}
function updateTeachProgress(v,save=true){teachIndex=Number(v);let s=S[teachIndex];document.getElementById('teachLabel').innerHTML=`目前教到：<b>${s.id} ${esc(s.title)}</b>｜前面 ${teachIndex+1} 小節視為已教`;if(save)localStorage.setItem('geo_teach_index',teachIndex);}
function saveOnlyTaught(){onlyTaught=document.getElementById('onlyTaught').checked;localStorage.setItem('geo_only_taught',onlyTaught?'1':'0');}

function makeToday(){
 let a=eligibleSections(),s=a[Math.floor(Math.random()*a.length)],q=s.questions[Math.floor(Math.random()*s.questions.length)];showPage('home');
 document.getElementById('todayArea').innerHTML=`<div class="card"><div class="eyebrow">今天只學 ${s.id}</div><h3>${s.emoji} ${esc(s.hook)}</h3><p><b>先懂一句：</b>${esc(s.one)}</p><p class="muted">${esc(s.chain)}</p><div class="encourage">先不用背。今天抓住這一條就算贏。</div><button class="primary" onclick="${on(`openLesson('${s.id}')`)}">用 5 分鐘看懂</button></div><div class="card inlineQuiz" data-answer="${q[3]}" data-why="${esc(q[4])}"><div class="eyebrow">最後只做 1 題</div><div class="qtext">${esc(q[1])}</div><div class="choices">${q[2].map((c,i)=>`<button class="choice" onclick="answerInline(this,${i})">${String.fromCharCode(65+i)}. ${esc(c)}</button>`).join('')}</div><div class="feedback hidden"></div></div>`;
}
function answerInline(btn,i){let box=btn.closest('.inlineQuiz'),a=Number(box.dataset.answer),why=box.dataset.why,cs=box.querySelectorAll('.choice');cs.forEach((x,j)=>{x.disabled=true;if(j===a)x.classList.add('ok')});if(i!==a)btn.classList.add('bad');let f=box.querySelector('.feedback');f.classList.remove('hidden');f.innerHTML=i===a?`🌟 對，就是這個關係。${esc(why)}<br><b>快練成了！</b>`:`👀 還差一小步。提示：${esc(why)}<br>不用重讀整頁，回去看那條因果鏈就好。`;if(i===a)addStar();}

function coachLine(s){
 const lines=['先不用背，這一節只抓一件事。','先看現象，再補名字；你不用一次懂完。','把圖動一次，比重讀三遍有效。','快練成了：先能用自己的話說，就已經跨過最難的一步。'];
 return lines[S.indexOf(s)%lines.length];
}
function openLesson(id){
 let s=S.find(x=>x.id===id);if(!s)return;currentLessonId=id;let ch=C.find(x=>x.id===s.ch);
 document.getElementById('mainApp').classList.add('hidden');document.getElementById('lessonApp').classList.remove('hidden');
 document.getElementById('lessonView').innerHTML=`<div class="lessonTop"><button class="secondary" onclick="showPage('chapters')">← 回章節</button><div><div class="eyebrow">${ch.num}｜${esc(ch.title)}｜${s.id}</div><h1 class="lessonTitle">${s.emoji} ${esc(s.title)}</h1><div class="hook">${esc(s.hook)}</div><div class="coach">💬 ${coachLine(s)}</div></div></div>
 <div class="modebar"><button class="mode active" onclick="lessonMode(this,'easy')">🙂 白話先懂</button><button class="mode" onclick="lessonMode(this,'sim')">🕹️ 動手看</button><button class="mode" onclick="lessonMode(this,'textbook')">📘 高中正式</button><button class="mode" onclick="lessonMode(this,'quiz')">🎯 3題收工</button></div>
 <div id="mode-easy" class="lessonMode"><div class="chunk bigOne"><div class="mini">先只記這一句</div><div class="bigSentence">${esc(s.one)}</div><button class="microSpeak" onclick="${on(`speak(${JSON.stringify(s.one)})`)}">🔊 聽重點</button></div>${chainHTML(s)}<div class="chunk"><div class="chunkHead"><h3>三塊就懂</h3><button class="microSpeak" onclick="${on(`speak(${JSON.stringify(s.concepts.map(x=>x[0]+'。'+x[1]).join(' '))})`)}">🔊 聽解釋</button></div><div class="concepts">${s.concepts.map(c=>`<div class="concept"><b>${esc(c[0])}</b><p>${esc(c[1])}</p></div>`).join('')}</div></div>${teacherStandardHTML(s)}${deepDiveHTML(s)}${teachFriendHTML(s)}${rescueHTML(s)}</div>
 <div id="mode-sim" class="lessonMode hidden">${sectionLabHTML(s)}</div>
 <div id="mode-textbook" class="lessonMode hidden"><div class="chunk"><div class="chunkHead"><h3>📘 高中正式名詞</h3><button class="microSpeak" onclick="${on(`speak(${JSON.stringify('正式名詞：'+s.terms.join('、'))})`)}">🔊 聽名詞</button></div><div class="termRow">${s.terms.map(x=>`<span class="term">${esc(x)}</span>`).join('')}</div></div>${teacherStandardHTML(s)}<div class="chunk trap"><div class="chunkHead"><h3>⚠️ 最容易搞混</h3><button class="microSpeak" onclick="${on(`speak(${JSON.stringify(s.traps.join(' '))})`)}">🔊 考試容易錯</button></div><ul>${s.traps.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="chunk"><h3>🧠 解題五步</h3><div class="solveSteps"><span>① 看現象</span><span>② 找誰在動</span><span>③ 找力量／能量</span><span>④ 找留下的證據</span><span>⑤ 才套正式名詞</span></div></div></div>
 <div id="mode-quiz" class="lessonMode hidden"><div class="chunk"><h3>🎯 3題就收工</h3><p class="muted">不用刷題海。三題都能說出為什麼，就可以往下。</p>${quizHTML(s.questions)}</div></div>
 <div class="lessonFooter"><button class="primary" onclick="${on(`markDone('${s.id}')`)}">✅ 這節我懂到可以教人</button><button class="secondary" onclick="speakVisible()">🔊 聽目前這一頁</button></div>`;
 scrollTo({top:0});
}
function chainHTML(s){let parts=s.chain.split(/→|；/).map(x=>x.trim()).filter(Boolean);return `<div class="chunk chain"><h3>🧩 只記這條故事</h3><div class="chainFlow">${parts.map((p,i)=>`<span>${esc(p)}</span>${i<parts.length-1?'<b>→</b>':''}`).join('')}</div></div>`;}
function deepDiveHTML(s){if(!s.deep?.length)return '';return `<details class="chunk deep"><summary>🔍 想再懂一點（不是現在必背）</summary><div class="deepBody">${s.deep.map(x=>`<p>${esc(x)}</p>`).join('')}</div></details>`;}
function teachFriendHTML(s){let t=s.teach||{script:s.one,challenge:s.chain,brag:'能說給別人聽，就是真的懂。'};return `<div class="chunk teachFriend"><div class="teachBadge">😎 教同學這一招</div><h3>30 秒講懂，不用背整頁</h3><p><b>你可以這樣說：</b>${esc(t.script)}</p><p class="teachChallenge"><b>再考同學一題：</b>${esc(t.challenge)}</p><p class="brag"><b>${esc(t.brag)}</b></p><div class="encourage">✨ 能用自己的話教別人，就真的快練成了。</div></div>`;}
function rescueHTML(s){return `<details class="chunk rescue"><summary>🆘 我真的看不懂，幫我降一級</summary><div class="rescueLevels"><div class="rescueLevel"><strong>先看生活版</strong>${esc(s.hook)}</div><div class="rescueLevel"><strong>只留一句</strong>${esc(s.one)}</div><div class="rescueLevel"><strong>只背箭頭</strong>${esc(s.chain)}</div></div></details>`;}
function lessonMode(btn,m){document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.lessonMode').forEach(x=>x.classList.add('hidden'));document.getElementById('mode-'+m).classList.remove('hidden');if(m==='sim')initCurrentLab();}
function quizHTML(qs){return qs.map((q,n)=>`<div class="examQ quizBox" data-answer="${q[3]}" data-why="${esc(q[4])}"><div class="mini">${q[0]}級｜第 ${n+1} 題</div><div class="qtext">${esc(q[1])}</div><div class="choices">${q[2].map((c,i)=>`<button class="choice" onclick="answerQuiz(this,${i})">${String.fromCharCode(65+i)}. ${esc(c)}</button>`).join('')}</div><div class="feedback hidden"></div></div>`).join('');}
function answerQuiz(btn,i){let b=btn.closest('.quizBox'),a=Number(b.dataset.answer),why=b.dataset.why,cs=b.querySelectorAll('.choice');cs.forEach((x,j)=>{x.disabled=true;if(j===a)x.classList.add('ok')});if(i!==a)btn.classList.add('bad');let f=b.querySelector('.feedback');f.classList.remove('hidden');f.textContent=i===a?'🌟 對，就是這個關係！ '+why+' 快練成了。':'👀 還差一小步。提示：'+why+'。先回圖上找原因，不用重背整段。';if(i===a)addStar();}
function markDone(id){let ds=done(),first=!ds.has(id);ds.add(id);saveDone(ds);if(first)addStar(2);let s=S.find(x=>x.id===id);alert(`⭐ 這節完成！\n${s.teach?.brag||'你已經不是只會背答案了。'}\n快練成地科達人！${first?' +2':''}`);renderChapters();renderSkillShelf();}

function sectionLabHTML(s){let d=LABS[s.id];if(!d)return `<div class="chunk"><h3>🕹️ 這節先用白話與題目練習</h3></div>`;return `<div class="chunk labShell"><div class="labIntro"><div class="eyebrow">${s.id} 專屬互動</div><h3>${d.title}</h3><p class="muted">${d.sub}</p></div><div class="labTabs">${d.tabs.map((x,i)=>`<button class="labTab ${i?'':'active'}" onclick="labTab(this,'${s.id}','${x[0]}')">${x[1]}</button>`).join('')}</div><div id="labBody">${labBody(s.id,d.tabs[0][0])}</div></div>`;}
function labTab(btn,id,mode){let shell=btn.closest('.labShell');shell.querySelectorAll('.labTab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');shell.dataset.mode=mode;document.getElementById('labBody').innerHTML=labBody(id,mode);initLab(id,mode);} 
function initCurrentLab(){let shell=document.querySelector('#mode-sim .labShell');if(shell)initLab(shell.dataset.id,shell.dataset.mode);}
function initLab(id,mode){
 if(id==='2-2'&&mode==='mag')magneticTape(0);
 if(id==='2-3'&&mode==='warning')warningCalc(80);
 if(id==='5-2'&&mode==='season')seasonCalc();
 if(id==='5-2'&&mode==='moon')moonMove(0);
 if(id==='5-3'&&mode==='motion')planetMotionInfo('地球');
 if(id==='5-3'&&mode==='distance')planetDistance('地球');
 if(id==='6-2'&&mode==='sea')seaLevel();
}

function labBody(id,m){
 if(id==='1-1'&&m==='form')return `<div class="labStage spaceStage"><div id="formObj" class="formObj">☁️</div><div id="formLabel" class="stageLabel">星雲：氣體＋塵埃</div></div><div class="labControls"><div class="controlCard"><b>把時間往後拖</b><input type="range" min="0" max="4" step="1" value="0" oninput="earthForm(this.value)"><p id="formText">先看到很多微小物質，不急著背「吸積」。</p></div><div class="controlCard"><b>你只要抓住</b><p>小東西碰撞聚集 → 越來越大 → 原始地球形成。</p></div></div>`;
 if(id==='1-1')return `<div class="labStage diffStage"><div class="protoEarth"><i class="heavy">重</i><i class="light">輕</i></div></div><div class="labControls"><div class="controlCard"><b>地球熔得夠熱時</b><input type="range" min="0" max="100" value="0" oninput="differentiate(this.value)"><p id="diffText">拖動看看：密度大的物質較容易往中心移。</p></div><div class="controlCard"><p>這就是「分異」：不是把元素分成好壞，而是密度差讓內部重新排列。</p></div></div>`;
 if(id==='1-2'&&m==='ocean')return `<div class="labStage earlyEarth"><div id="steam" class="steam">☁️☁️☁️</div><div id="oceanFill" class="oceanFill"></div><div class="hotEarth">🌍</div></div><div class="labControls"><div class="controlCard"><b>讓地表慢慢冷卻</b><input type="range" min="0" max="100" value="10" oninput="coolEarth(this.value)"><p id="coolText">很熱：水多以水氣存在。</p></div><div class="controlCard"><p>冷卻到能穩定存在液態水 → 水氣凝結、降水、長期累積成海洋。</p></div></div>`;
 if(id==='1-2')return `<div class="labStage oxygenStage"><div class="oxyBar"><i id="oxyFill"></i></div><div class="stageLabel">生命活動逐步改造大氣</div></div><div class="labControls"><div class="controlCard"><b>時間往後</b><input type="range" min="0" max="100" value="0" oninput="oxygenRise(this.value)"><p id="oxyText">早期氧氣很少。</p></div><div class="controlCard"><p>光合作用產生氧氣，但不是一有生命就立刻變成今天的大氣。</p></div></div>`;
 if(id==='1-3'&&m==='strata')return `<div class="labStage strataStage"><div class="layer l1">最上層 C</div><div class="layer l2">中層 B</div><div class="layer l3">最下層 A</div><div class="dyke">岩脈 D</div></div><div class="labNote"><b>先猜：</b>如果地層沒有翻轉，A、B、C誰最老？岩脈D又切過它們，D通常更早還更晚？<div class="encourage">答得出來，你已經會相對定年的核心了。</div></div>`;
 if(id==='1-3')return `<div class="labStage simpleStage"><div id="halfRead" class="bigReadout">母元素 100%</div><div id="halfBlocks" class="halfBlocks">████████</div></div><div class="labControls"><div class="controlCard"><b>經過幾個半衰期？</b><input type="range" min="0" max="4" value="0" step="1" oninput="halfLife(this.value)"><p id="halfText">0 個半衰期。</p></div><div class="controlCard"><p>100% → 50% → 25% → 12.5%。每次是「剩一半」，不是減固定量。</p></div></div>`;

 if(id==='2-1'&&m==='waves')return `<div class="labStage waveParticleStage"><div class="waveRow"><b>P波</b><div id="pParticles" class="particles">● ● ● ● ● ●</div></div><div class="waveRow"><b>S波</b><div id="sParticles" class="particles">● ● ● ● ● ●</div></div></div><div class="labControls"><div class="controlCard"><button class="primary" onclick="runParticles('p')">看P波</button><button class="secondary" onclick="runParticles('s')">看S波</button><p id="particleText">P波：粒子振動方向和波前進方向平行。</p></div><div class="controlCard"><p><b>P＝Push/Pull</b> 可先記壓縮；<b>S＝Sideways</b> 可先記剪切。先懂動作再記名稱。</p></div></div>`;
 if(id==='2-1')return `<div class="labStage earthInside"><div class="earthCut"><span class="crust">地殼</span><span class="mantle">地函</span><span class="outer">液態外核</span><span class="inner">固態內核</span></div><div id="sPath" class="sPath">S波 ✕</div><div class="pPath">P波 ↘︎↗︎</div></div><div class="labNote"><b>關鍵：</b>S波無法在液體傳遞剪切，因此不能穿過液態外核；P波能進入但會因速度改變而折射。</div>`;

 if(id==='2-2'&&m==='cycle')return `<div class="labStage plateScene" id="plateScene"><div class="seaSurface">海面 0 km</div><div id="waterLayer" class="waterLayer"></div><div class="depthScale"><span>0</span><span>-2</span><span>-4</span><span>-6</span><span>-8</span><span>-11 km</span></div><div class="ridge">🔥<small>中洋脊<br>新洋殼</small></div><div class="oceanPlate leftPlate">←</div><div class="oceanPlate rightPlate">→</div><div class="trench">海溝<small>海床凹陷</small></div><div class="slab">老海洋岩石圈 ↘</div><div class="volcanoArc">🌋 火山弧</div><div class="quakes">•<br> •<br>  •<br>   •</div></div><div class="labControls"><div class="controlCard"><button class="primary" onclick="toggleWater()">把海水變透明</button><p id="waterText">海溝是在海面以下的海床凹陷，不是海面裂開。</p></div><div class="controlCard"><b>為什麼會隱沒？</b><p>不是海水比較重。老的海洋岩石圈冷卻、整體密度增加，在聚合邊界較容易下沉。</p><p class="mini">馬里亞納海溝挑戰者深淵約近11 km深；聖母峰約8.85 km高，用來建立尺度感。</p></div></div>`;
 if(id==='2-2'&&m==='mag')return `<div class="labStage magneticStage"><div class="magRidge">🔥<small>中洋脊＝錄音機</small></div><div id="magStripes" class="magStripes"></div><div class="magArrow left">← 海床往外</div><div class="magArrow right">海床往外 →</div></div><div class="labControls"><div class="controlCard"><b>① 岩石怎麼錄？</b><input type="range" min="0" max="8" value="0" step="1" oninput="magneticTape(this.value)"><p id="magText">岩漿還很熱時不先背名詞；冷卻後，磁性礦物把當時地磁方向留下。</p></div><div class="controlCard"><b>② 為什麼會倒轉？</b><div class="coreMini"><div id="outerCore" class="outerCoreMini">液態外核 ↻↺</div><div class="innerCoreMini">內核</div></div><input type="range" min="0" max="2" step="1" value="0" oninput="coreDynamo(this.value)"><p id="coreText">外核導電流體持續運動，形成地磁發電機；地磁不是地心藏了一根永久大磁鐵。</p></div></div><div class="labNote"><b>完整但不難的一條線：</b>外核流動產生地磁 → 地磁長期會變、偶爾反轉 → 新海床冷卻把當時方向記住 → 海床往兩側走 → 形成近似對稱磁條帶。<details class="miniDetail"><summary>考試名稱再打開</summary><p>岩漿中的磁性礦物在很高溫時不會穩定保存磁化；冷到各礦物的居里溫度以下後，會保留當時地磁方向，這種紀錄常稱「熱剩磁」。</p></details><div class="encourage">😎 高手句：不是中洋脊讓地磁倒轉，它只是地球的「磁帶錄音機」。</div>${officialCard('USGS｜Magnetic striping','官方圖文：磁鐵礦在岩漿冷卻時鎖定當時地磁極性，海床擴張後形成近似對稱磁條帶。','https://pubs.usgs.gov/gip/dynamic/developing.html','看USGS原始圖解')}</div>`;
 if(id==='2-2'&&m==='evidence')return `<div class="officialMapPanel"><div class="mapFrame"><iframe title="USGS全球板塊地震火山圖" src="https://pubs.usgs.gov/imap/2800/TDPfront-screen.pdf#view=FitH"></iframe><div class="mapFallback">若裝置無法直接顯示PDF，請按下方「開啟USGS官方全圖」。</div></div><div class="observeGrid"><div><b>先不要看答案，找3件事</b><ol><li>地震點是不是隨機散滿全球？</li><li>太平洋四周為什麼特別密？</li><li>大西洋中央為什麼也有一條帶？</li></ol></div><div><b>看完再揭曉</b><details><summary>我看好了，公布答案</summary><p>全球地震與火山多沿板塊邊界成帶狀分布；環太平洋聚合／隱沒邊界很醒目，而大西洋中央則對應中洋脊張裂邊界。</p></details></div></div>${officialCard('USGS｜This Dynamic Planet','全球板塊、地震、火山與海底地形的正式教學圖。','https://pubs.usgs.gov/imap/2800/TDPfront-screen.pdf','開啟USGS官方全圖')}</div>`;
 if(id==='2-2'&&m==='age')return `<div class="officialImagePanel"><img src="https://sos.noaa.gov/img/education/data-lens/week9map.png" alt="NOAA全球海床年齡圖" loading="lazy"><div class="sourceCap">NOAA Science On a Sphere｜Age of the Seafloor</div></div><div class="observeGrid"><div><b>像地科偵探一樣讀圖</b><ol><li>大西洋中央附近海床較新還較老？</li><li>往美洲／非洲兩側，年齡怎麼變？</li><li>全球海床最老的地方是否集中在中洋脊？</li></ol></div><div><b>把圖變成一句話</b><p>中洋脊製造新海床 → 海床往兩側移動 → 離中洋脊愈遠通常愈老。這是海底擴張的重要證據。</p><p class="mini">注意：這是全球資料圖，不要求死背每一種顏色；考試要抓的是年齡分布規律。</p></div></div>${officialCard('NOAA｜Age of the Seafloor','用真實海床年齡資料觀察海底擴張。','https://sos.noaa.gov/education/data-lens/sea-floor-age/','開啟NOAA教學頁')}</div>`;

 if(id==='2-3'&&m==='warning')return `<div class="labStage warningStage"><div class="source">💥 震源</div><div class="station">📡 測站</div><div class="city">🏙️ 城市</div><div id="pRace" class="raceDot p">P</div><div id="sRace" class="raceDot s">S</div></div><div class="labControls"><div class="controlCard"><b>城市離震源多遠？</b><input id="warnDist" type="range" min="10" max="200" value="80" oninput="warningCalc(this.value)"><p id="warningText"></p></div><div class="controlCard"><p>速報先偵測較快的P波，再用通訊與計算送出警報；真正破壞性強震動到達前能剩多少時間，跟距離與系統處理時間都有關。</p><p class="mini">這裡是概念估算，不是真實地震預報。</p></div></div>`;

 if(id==='2-3'&&m==='cwa')return `<div class="resourceStack">${officialCard('中央氣象署｜天搖地動感受地震波','中文科普資源，適合補P波、S波與地震觀測。','https://edu.cwa.gov.tw/PopularScience/ec/SubMenu/update.html','開啟氣象署地震科普')}${officialCard('中央氣象署｜地震主題資源','包含震源、震央、震度、地震帶、測報與防災。','https://edu.cwa.gov.tw/PopularScience/ec/SubMenu/top.html','看更多官方教材')}</div>`;
 if(id==='2-3')return `<div class="labStage siteStage"><div class="rockCity">硬岩 🏢</div><div id="softCity" class="softCity">軟弱沉積層 🏢</div></div><div class="labControls"><div class="controlCard"><b>把沉積層變厚</b><input type="range" min="0" max="100" value="20" oninput="siteEffect(this.value)"><p id="siteText">同一場地震，不同地盤條件可能有不同震動。</p></div><div class="controlCard"><p>地震規模是震源本身的量；某地搖多大還會受距離、地盤與建物等影響。</p></div></div>`;

 if(id==='3-1'&&m==='layers')return `<div class="labStage atmosphereStage"><div class="atmLayer thermo">高層</div><div class="atmLayer meso">中氣層</div><div class="atmLayer strato">平流層</div><div class="atmLayer tropo">對流層</div><div id="balloon" class="balloon">🎈</div></div><div class="labControls"><div class="controlCard"><b>把氣球往上升</b><input type="range" min="0" max="100" value="5" oninput="atmosphereUp(this.value)"><p id="atmText">近地面先在對流層，多數天氣都在這裡。</p></div><div class="controlCard"><p>溫度不是一路降低：平流層因臭氧吸收紫外線，會出現隨高度增溫的區段。</p></div></div>`;
 if(id==='3-1')return `<div class="labStage pressureStage"><div class="pressureColumn"><i id="pressureFill"></i></div><div id="pressureRead" class="bigReadout">海平面約 100%</div></div><div class="labControls"><div class="controlCard"><b>高度增加</b><input type="range" min="0" max="12" value="0" oninput="pressureHeight(this.value)"><p>上方壓著你的空氣柱越少，氣壓就越低。</p></div></div>`;
 if(id==='3-2'&&m==='dew')return `<div class="labStage dewStage"><div id="glass" class="coldGlass">🥤</div><div id="drops" class="drops">••••</div></div><div class="labControls"><div class="controlCard"><b>把杯子變冷</b><input type="range" min="0" max="20" value="20" oninput="dewPoint(this.value)"><p id="dewText">杯面20°C：還不一定凝結。</p></div><div class="controlCard"><p>水珠來自周圍空氣中的水氣，不是飲料穿過杯壁。</p></div></div>`;
 if(id==='3-2')return `<div class="labStage mountainStage"><div class="mountain">▲</div><div id="airParcel" class="airParcel">30°C</div><div class="cloudIcon">☁️</div></div><div class="labControls"><div class="controlCard"><b>把空氣團往上抬</b><input type="range" min="0" max="100" value="0" oninput="airUp(this.value)"><p id="airText">上升 → 外界壓力較低 → 膨脹 → 冷卻。</p></div></div>`;
 if(id==='3-3')return `<div class="labStage windStage"><div class="highP">H 高壓</div><div class="lowP">L 低壓</div><div id="windArrow" class="windArrow">➜</div></div><div class="labControls"><div class="controlCard"><b>一步一步加力量</b><input type="range" min="0" max="2" step="1" value="0" oninput="windForces(this.value)"><p id="windText">第1步：氣壓梯度力先把空氣從高壓推向低壓。</p></div><div class="controlCard"><p>北半球移動中的空氣相對偏右；近地面摩擦又會讓風速變慢、斜穿等壓線。</p></div></div>`;
 if(id==='3-4')return `<div class="labStage weatherMap"><div class="H">H</div><div class="L">L</div><div class="isobars">)))　　((((</div><div class="coldFront">▲▲▲ 冷鋒</div><div class="rainArea">☁️🌧️</div><div class="you">📍你</div></div><div class="labControls"><div class="controlCard"><b>固定四步</b><ol><li>找 H / L</li><li>看等壓線疏密</li><li>找鋒面</li><li>對照雲雨和自己位置</li></ol></div><div class="controlCard"><p>等壓線密 → 水平氣壓差較大 → 風通常較強。雷達更適合看正在下哪裡；衛星更適合看大範圍雲系。</p></div></div>`;
 if(id==='3-5'&&m==='typhoon')return `<div class="labStage typhoonStage"><div id="typhoonSpin" class="typhoonSpin">🌀</div><div id="seaHeat" class="seaHeat">暖海</div></div><div class="labControls"><div class="controlCard"><b>海面供能</b><input type="range" min="24" max="31" value="27" oninput="typhoonHeat(this.value)"><p id="typhoonText">海面較暖、水氣充足時，較有利強對流維持。</p></div><div class="controlCard"><button class="secondary" onclick="typhoonLand()">讓颱風登陸</button><p>登陸後暖海供能減少、地表摩擦增加，常會減弱。</p></div></div>`;
 if(id==='3-5')return `<div class="labStage hazardStage"><div>💨 強風</div><div>🌧️ 豪雨</div><div>🌊 暴潮／巨浪</div><div>⛰️ 崩塌土石流</div></div><div class="labNote">颱風災害不是只看最大風速。臺灣山地多，豪雨加上坡地條件常造成複合災害。</div>`;

 if(id==='4-1')return `<div class="labStage oceanProfile"><div class="mix">混合層</div><div class="thermo">溫躍層</div><div class="deepSea">深水層</div><div id="probe" class="probe">●</div></div><div class="labControls"><div class="controlCard"><b>把探針往下</b><input type="range" min="0" max="100" value="5" oninput="oceanProbe(this.value)"><p id="oceanText">表層受太陽與風浪影響較大。</p></div><div class="controlCard"><p>一般而言冷、鹹海水密度較大；但真實海洋還受區域、季節與混合影響。</p></div></div>`;
 if(id==='4-2'&&m==='wave')return `<div class="labStage oceanLab"><div class="movingWave"></div><div id="floatBall" class="floatBall">●</div></div><div class="labNote"><b>盯住黃色浮標：</b>波峰往前走，但浮標主要在附近上下／繞動。主要往前傳的是能量，不是整團水。</div>`;
 if(id==='4-2'&&m==='tide')return `<div class="labStage tideStage"><div class="earthDot">🌏</div><div id="moonDot" class="moonDot">🌙</div><div id="tideBulge" class="tideBulge"></div></div><div class="labControls"><div class="controlCard"><b>拖月球位置</b><input type="range" min="0" max="360" value="0" oninput="tideMove(this.value)"><p>朔、望附近日月潮汐作用較同向，常見較大潮差的大潮。</p></div></div>`;
 if(id==='4-2')return `<div class="labStage currentStage"><div id="oceanArrow" class="oceanArrow">➜➜</div><div class="coastBlock">陸地</div></div><div class="labControls"><div class="controlCard"><b>緯度／科氏效果</b><input type="range" min="0" max="60" value="20" oninput="currentTurn(this.value)"><p id="currentText">盛行風推水；科氏效應與海陸邊界讓洋流轉彎。</p></div></div>`;
 if(id==='4-3')return `<div class="labStage ensoStage"><div class="pacific"><span>西太平洋</span><i id="warmPool"></i><span>東太平洋</span></div><div id="tradeWind" class="tradeWind">←← 信風</div><div id="upwelling" class="upwelling">↑ 湧升</div></div><div class="labControls"><div class="controlCard"><b>ENSO狀態</b><input type="range" min="-1" max="1" step="1" value="0" oninput="enso(this.value)"><p id="ensoText">正常：信風把表層暖水推向西側，東側較有湧升。</p></div><div class="controlCard"><p>聖嬰不是「海水變暖」單一事件，而是海溫、信風、湧升與降雨位置一起改變。</p></div></div>`;


 if(id==='5-1'&&m==='spaceResource')return `<div class="resourceStack">${officialCard('NASA｜Satellite / Orbit','把「衛星」與「軌道」放回真正的太空任務情境。','https://spaceplace.nasa.gov/menu/explore/explore/','開啟NASA Space Place')}${officialCard('SpaceX｜Falcon 9','現代可重複使用軌道級火箭案例；用來理解「發射衛星」而不是把它當地科必背品牌。','https://www.spacex.com/vehicles/falcon-9/','看Falcon 9官方頁')}</div>`;
 if(id==='5-1'&&m==='remote')return `<div class="labStage remoteStage"><div id="remoteEarth" class="remoteEarth">🌏</div><div id="remoteOverlay" class="remoteOverlay visible">可見光</div><div class="satelliteIcon">🛰️</div></div><div class="labControls"><div class="controlCard"><button class="secondary" onclick="remoteBand('visible')">可見光</button><button class="secondary" onclick="remoteBand('ir')">紅外線</button><button class="secondary" onclick="remoteBand('false')">假色</button><p id="remoteText">可見光接近日間肉眼看到的反射光。</p></div><div class="controlCard"><p>假色不是造假，而是把人眼看不到或不容易分辨的波段映射成顏色，讓特徵更清楚。</p></div></div>`;
 if(id==='5-1'&&m==='orbit')return `<div class="labStage satStage"><div class="earthCenter">🌏</div><div class="orbitRing leo">LEO</div><div class="orbitRing meo">MEO</div><div class="orbitRing geo">GEO</div><div id="satDot" class="satDot leo">🛰️</div></div><div class="labControls"><div class="controlCard"><b>選一個軌道</b><select onchange="satOrbit(this.value)"><option value="leo">LEO 低地球軌道</option><option value="meo">MEO 中地球軌道</option><option value="geo">GEO 地球靜止軌道</option></select><p id="satText">LEO：通常低於約2,000 km，近地、週期短；ISS、許多遙測衛星與Starlink位於低軌。</p></div><div class="controlCard"><p><b>MEO：</b>GPS 約20,200 km。<br><b>GEO：</b>約35,786 km、赤道上空，週期配合地球自轉，因此能持續看近同一地區。</p><p class="mini">圖為壓縮比例，否則GEO會遠到畫面外。</p></div></div>`;
 if(id==='5-1'&&m==='spacex')return `<div class="labStage rocketStage"><div id="rocket" class="rocket">🚀</div><div class="earthCurve">地球</div><div id="starlinks" class="starlinks">🛰️　🛰️　🛰️</div></div><div class="labControls"><div class="controlCard"><button class="primary" onclick="launchRocket()">發射 → 部署低軌衛星</button><p id="launchText">SpaceX 是獨立的航太公司，不是 Tesla 的「太空部門」。</p></div><div class="controlCard"><p><b>生活化重點：</b>Falcon 系列把「火箭一部分能回收再用」變成重要工程特色；Starlink 則用大量低軌衛星提供通訊覆蓋。</p><p class="mini">Elon Musk 同時領導 Tesla 與 SpaceX，但兩家公司不同。</p></div></div>`;
 if(id==='5-1')return `<div class="labStage auroraStage"><div class="auroraSun">☀️<small>太陽風 →→→</small></div><div class="magEarth">🌏<i></i></div><div id="auroraOval" class="auroraOval">極光橢圓</div></div><div class="labControls"><div class="controlCard"><b>太陽／地磁活動</b><input type="range" min="1" max="5" value="2" oninput="auroraLevel(this.value)"><p id="auroraText">太陽風把能量帶入磁層；帶電粒子沿磁場進入高層大氣，碰撞後發光。</p></div><div class="controlCard"><p>極光主要集中在高磁緯的「極光橢圓」，不是只在地理北極正上方。活動強時範圍可向較低緯擴展。</p></div></div>`;


 if(id==='5-2'&&m==='seasonResource')return `<div class="resourceStack">${officialCard('NASA｜What Causes the Seasons?','用地軸傾斜、南北半球與日照方向破解「夏天因為離太陽較近」的迷思。','https://spaceplace.nasa.gov/seasons/en/','開啟NASA季節圖解')}</div><div class="labNote"><b>高中教師提醒：</b>看圖時不要只背「23.5°」。真正要回答的是：傾斜如何改變太陽高度、白晝長度，以及南北半球為何季節相反。</div>`;
 if(id==='5-2'&&m==='day')return `<div class="labStage dayNightStage"><div class="sunLamp">☀️</div><div id="dayEarth" class="dayEarth"><span>🌏</span><i></i></div></div><div class="labControls"><div class="controlCard"><b>讓地球自轉</b><input type="range" min="0" max="360" value="0" oninput="earthRotate(this.value)"><p id="dayText">自轉＝自己轉。面向太陽的一半是白天，背向太陽的一半是夜晚。</p></div><div class="controlCard"><p>地球由西向東自轉，所以我們看到太陽、星星多數呈現東升西落的周日視運動。</p></div></div>`;
 if(id==='5-2'&&m==='season')return `<div class="labStage seasonStage"><div class="seasonSun">☀️</div><div id="seasonEarth" class="seasonEarth">🌏<i></i></div><div class="orbitOval"></div><div class="latBadge" id="latBadge">臺灣約 24°N</div></div><div class="labControls"><div class="controlCard"><b>月份</b><input id="monthSlider" type="range" min="1" max="12" value="6" oninput="seasonCalc()"><b>緯度</b><input id="latSlider" type="range" min="-80" max="80" value="24" oninput="seasonCalc()"><div class="presetButtons"><button onclick="setLat(24)">臺灣</button><button onclick="setLat(0)">赤道</button><button onclick="setLat(67)">北極圈內</button><button onclick="setLat(-67)">南極圈內</button></div></div><div class="controlCard"><p id="seasonText"></p><div class="dayMeter"><i id="dayMeterFill"></i></div><p class="mini">概念計算以地軸傾斜與日照幾何估算白晝長度；不含地形、大氣折射等日出日落細節。</p></div></div>`;
 if(id==='5-2'&&m==='polaris')return `<div class="labStage polarisStage"><div class="horizon">臺灣北方地平線</div><div id="polarisStar" class="polarisStar">★<small>北極星</small></div><div id="dipper" class="dipper">✦—✦—✦<br>　✦—✦—✦—✦</div><div class="northMark">北</div></div><div class="labControls"><div class="controlCard"><b>同一鐘點看四季</b><input type="range" min="0" max="3" step="1" value="0" oninput="polarisSeason(this.value)"><p id="polarisText">春：北極星大致留在北方約二十多度高，周圍星座位置會隨季節改變。</p></div><div class="controlCard"><b>換觀察緯度</b><input type="range" min="0" max="90" value="24" oninput="polarisLat(this.value)"><p id="polarisLatText">臺灣約24°N → 北極星仰角約24°。</p><p class="mini">北極星不是完全不動，而是非常靠近北天極，所以視運動很小。</p></div></div>`;
 if(id==='5-2')return `<div class="labStage moonStage"><div class="sunSide">☀️</div><div class="earthCenter">🌏</div><div id="moonOrb" class="moonOrb"><span>🌙</span><i>●</i></div><div class="moonOrbitPath"></div></div><div class="labControls"><div class="controlCard"><b>月球繞一圈</b><input id="moonAngle" type="range" min="0" max="360" value="0" oninput="moonMove(this.value)"><div class="presetButtons"><button onclick="moonMode='sync';moonMove(document.getElementById('moonAngle').value)">同步自轉</button><button onclick="moonMode='fixed';moonMove(document.getElementById('moonAngle').value)">假設不自轉</button></div><p id="moonText">同步自轉：月球繞地球一圈時自己也轉一圈，所以同一面長期朝向地球。</p></div><div class="controlCard"><p>最容易錯：<b>「永遠看到同一面」不是因為月球沒有自轉，剛好相反。</b></p></div></div>`;


 if(id==='5-3'&&m==='solarResource')return `<div class="resourceStack">${officialCard('NASA｜About the Planets','現行八大行星與矮行星分類；冥王星2006年改列矮行星。','https://science.nasa.gov/solar-system/planets/','開啟NASA行星總覽')}${officialCard('NASA｜Solar System Facts','太陽系位於銀河系，並可延伸到太陽系在銀河中的位置與尺度。','https://science.nasa.gov/solar-system/solar-system-facts/','開啟NASA太陽系資料')}</div>`;
 if(id==='5-3'&&m==='address')return `<div class="labStage addressStage"><div id="addressIcon" class="addressIcon">🌏</div><div id="addressTitle" class="bigReadout">地球</div></div><div class="labControls"><div class="controlCard"><b>把鏡頭往外拉</b><input type="range" min="0" max="6" value="0" step="1" oninput="cosmicAddress(this.value)"><p id="addressText">我們的起點：地球。</p></div><div class="controlCard"><div class="addressTrail">地球 → 地月系 → 太陽系 → 銀河系 → 本星系群 → 更大尺度 → 可觀測宇宙</div><p class="mini">這是「地址層級」概念，不代表每一層都有像盒子一樣的硬邊界。</p></div></div>`;
 if(id==='5-3'&&m==='solar')return `<div class="labStage solarStage"><div class="solarSun">☀️</div><div class="planetRow"><button onclick="planetInfo('水星')">☿<small>水</small></button><button onclick="planetInfo('金星')">♀<small>金</small></button><button onclick="planetInfo('地球')">🌍<small>地</small></button><button onclick="planetInfo('火星')">♂<small>火</small></button><button onclick="planetInfo('木星')">♃<small>木</small></button><button onclick="planetInfo('土星')">♄<small>土</small></button><button onclick="planetInfo('天王星')">♅<small>天王</small></button><button onclick="planetInfo('海王星')">♆<small>海王</small></button><button class="dwarf" onclick="planetInfo('冥王星')">●<small>冥王</small></button></div><div class="notScale">順序示意｜大小與距離非等比例</div></div><div class="labControls"><div class="controlCard"><p id="planetInfo"><b>地球</b>：第3顆｜1 AU｜公轉365.25天｜自轉約24小時。</p></div><div class="controlCard"><p><b>以前九大行星，現在八大行星。</b>2006年後冥王星正式列為矮行星。不是「消失」，是分類改變。</p></div></div>`;
 if(id==='5-3'&&m==='motion')return `<div class="labStage planetMotionStage"><div class="motionSun">☀️</div><div class="motionOrbit"></div><div id="motionPlanet" class="motionPlanet">🌍<i></i></div></div><div class="labControls"><div class="controlCard"><b>選行星</b><select id="motionSelect" onchange="planetMotionInfo(this.value)">${Object.keys(PLANETS).map(n=>`<option ${n==='地球'?'selected':''}>${n}</option>`).join('')}</select><b>公轉位置</b><input id="orbitAngle" type="range" min="0" max="360" value="0" oninput="planetMotion()"><b>自轉角度</b><input id="spinAngle" type="range" min="0" max="360" value="0" oninput="planetMotion()"><p id="motionText"><b>地球：</b>公轉＝繞太陽；自轉＝自己轉。兩件事可以同時發生。</p></div><div class="controlCard"><p><b>先分清楚就好：</b>公轉決定「繞誰走、多久一圈」；自轉決定「自己多久轉一圈」。不同行星兩個週期都不同，金星甚至是逆向自轉。</p><div class="encourage">✨ 你能把「自己轉」和「繞別人轉」分開，天文已經少一半難度。</div></div></div>`;
 if(id==='5-3'&&m==='distance')return `<div class="labStage distanceStage"><div class="distanceSun">☀️</div><div id="distancePlanet" class="distancePlanet">🌍</div><div class="distanceLine"></div></div><div class="labControls"><div class="controlCard"><b>選行星</b><select onchange="planetDistance(this.value)">${Object.keys(PLANETS).map(n=>`<option ${n==='地球'?'selected':''}>${n}</option>`).join('')}</select><p id="distanceText"></p></div><div class="controlCard"><p>離太陽越遠，平均收到的太陽輻射通常越少；但「行星表面溫度」還受大氣與反照率等影響。<b>金星就是不能只用距離猜溫度的好例子。</b></p></div></div>`;
 if(id==='5-3')return `<div class="labStage lightStage"><div class="starA">★ 遠方天體</div><div class="lightBeam">→ → → → →</div><div class="observer">👀 地球</div></div><div class="labControls"><div class="controlCard"><b>距離</b><input type="range" min="1" max="10000" value="1000" step="100" oninput="lightYear(this.value)"><p id="lightText">1000 光年：看到的是約1000年前出發的光。</p></div><div class="controlCard"><p><b>光年是距離，不是時間。</b>因為光速有限，距離也同時告訴我們「往回看了多久」。</p></div></div>`;

 if(id==='6-1')return `<div class="labStage climateStage"><div id="weatherDots" class="weatherDots"></div><div class="trendLine"></div></div><div class="labControls"><div class="controlCard"><b>看幾天？幾年？</b><input type="range" min="1" max="30" value="1" oninput="climateScale(this.value)"><p id="climateText">只看1個時間點：你看到的是天氣，不足以判斷長期氣候。</p></div></div>`;
 if(id==='6-2'&&m==='ice')return `<div class="labStage iceStage"><div id="iceCap" class="iceCap"></div><div class="sunRay">☀️ ↘↘</div></div><div class="labControls"><div class="controlCard"><b>冰雪面積</b><input type="range" min="10" max="100" value="80" oninput="iceAlbedo(this.value)"><p id="iceText">冰雪多 → 反射較多太陽能量。</p></div></div>`;
 if(id==='6-2')return `<div class="labStage seaLevelStage"><div id="seaLevelFill" class="seaLevelFill"></div><div class="coastalCity">🏙️</div></div><div class="labControls"><div class="controlCard"><b>海水變暖</b><input id="thermal" type="range" min="0" max="5" value="1" oninput="seaLevel()"><b>陸地冰融化</b><input id="landIce" type="range" min="0" max="5" value="1" oninput="seaLevel()"><p id="seaLevelText"></p></div><div class="controlCard"><p>海平面上升不只一個來源：<b>海水熱膨脹＋陸地冰融水進海</b>都重要。</p></div></div>`;
 if(id==='6-3'&&m==='greenhouse')return `<div class="labStage greenhouseStage"><div class="earthHeat">🌏 ↑↑</div><div id="heatTrap" class="heatTrap">大氣</div><div class="sunIn">☀️ →</div></div><div class="labControls"><div class="controlCard"><b>額外溫室氣體</b><input type="range" min="0" max="100" value="30" oninput="greenhouse(this.value)"><p id="greenText">天然溫室效應讓地球維持較適居溫度；增加濃度會改變向外散熱。</p></div></div>`;
 if(id==='6-3')return `<div class="labStage fingerprintStage"><div>🌡️ 長期升溫</div><div>🌊 海洋增熱</div><div>🧊 冰雪減少</div><div>🏭 CO₂來源與增加</div></div><div class="labNote">科學歸因不靠單一曲線，而是看多種觀測、物理機制與模式模擬能不能一起對上。</div>`;
 if(id==='6-4')return `<div class="labStage responseStage"><button onclick="classifyResponse(this,'m')">提高能源效率</button><button onclick="classifyResponse(this,'a')">加高防洪牆</button><button onclick="classifyResponse(this,'m')">增加低碳能源</button><button onclick="classifyResponse(this,'a')">熱浪預警</button></div><div class="labControls"><div class="controlCard"><p id="responseText">點一個措施：判斷它主要是在處理「原因」還是「衝擊」。</p></div></div>`;

 if(id==='7-1')return `<div class="labStage sustainStage"><div class="sustain environmental">環境</div><div class="sustain social">社會</div><div class="sustain economy">經濟</div><div class="future">未來世代</div></div><div class="labControls"><div class="controlCard"><b>調整三個考量</b><label>環境<input id="env" type="range" min="1" max="5" value="3" oninput="sustain()"></label><label>社會<input id="soc" type="range" min="1" max="5" value="3" oninput="sustain()"></label><label>經濟<input id="eco" type="range" min="1" max="5" value="3" oninput="sustain()"></label><p id="sustainText">永續不是只把其中一項拉到最高，而是透明地看取捨。</p></div></div>`;
 if(id==='7-2'&&m==='life')return `<div class="labStage lifeCycle"><span>⛏️ 原料</span><b>→</b><span>🏭 製造</span><b>→</b><span>🚚 運輸</span><b>→</b><span>📱 使用</span><b>→</b><span>♻️ 回收／處置</span></div><div class="labNote">只看「使用時很省電」還不夠；完整評估要把原料、製造、運輸、使用與最後處置都算進來。</div>`;
 if(id==='7-2')return `<div class="labStage energyStage"><div id="energyCards" class="energyCards"><span>☀️ 太陽能</span><span>💨 風能</span><span>🔥 火力</span><span>⚛️ 核能</span><span>🌋 地熱</span></div></div><div class="labControls"><div class="controlCard"><b>選你最在意的指標</b><select onchange="energyMetric(this.value)"><option value="carbon">碳排</option><option value="stable">穩定供電</option><option value="land">土地／空間</option><option value="cost">成本</option></select><p id="energyText">不同能源沒有一個指標可以決定全部；要看多目標取捨。</p></div></div>`;
 return '<div class="labNote">這一節先把白話故事講懂，再回題目。</div>';
}

// --- 互動函式 ---
function earthForm(v){let objs=['☁️','•  •  •','●  ●','🌑','🌍'],labs=['星雲：氣體＋塵埃','微粒碰撞','微行星','原始地球','分異後的地球'],texts=['先看到很多微小物質，不急著背「吸積」。','顆粒碰撞後能黏在一起，開始變大。','越聚越大，形成微行星。','碰撞、壓縮與放射性衰變等讓原始地球升溫。','夠熱時，密度大的物質較易下沉，形成分層。'];document.getElementById('formObj').textContent=objs[v];document.getElementById('formLabel').textContent=labs[v];document.getElementById('formText').textContent=texts[v];}
function differentiate(v){let h=document.querySelector('.protoEarth .heavy'),l=document.querySelector('.protoEarth .light');h.style.transform=`translateY(${v*.55}px)`;l.style.transform=`translateY(${-v*.25}px)`;document.getElementById('diffText').textContent=v>60?'密度大的物質往內集中、較輕的物質相對在外，地球內部逐漸分層。':'拖動看看：密度大的物質較容易往中心移。';}
function coolEarth(v){document.getElementById('oceanFill').style.height=(v*.45)+'%';document.getElementById('steam').style.opacity=1-v/130;document.getElementById('coolText').textContent=v<40?'仍很熱：水多以水氣存在。':v<75?'開始冷卻：水氣凝結、降水增加。':'液態水長期累積，海洋逐步形成。';}
function oxygenRise(v){document.getElementById('oxyFill').style.height=v+'%';document.getElementById('oxyText').textContent=v<25?'早期氧氣很少。':v<65?'光合作用讓氧氣逐步增加，但會先參與許多化學反應。':'氧氣長期累積，大氣成分明顯改變。';}
function halfLife(v){let pct=100/Math.pow(2,v);document.getElementById('halfRead').textContent=`母元素 ${pct}%`;document.getElementById('halfBlocks').textContent='█'.repeat(Math.max(1,8>>v));document.getElementById('halfText').textContent=`${v} 個半衰期：剩下原本的 ${pct}%。`;}
function runParticles(type){let p=document.getElementById('pParticles'),s=document.getElementById('sParticles');p.className='particles';s.className='particles';if(type==='p'){p.classList.add('pulseP');document.getElementById('particleText').textContent='P波：粒子前後推拉，振動方向與傳播方向平行。';}else{s.classList.add('pulseS');document.getElementById('particleText').textContent='S波：粒子上下／左右剪切，振動方向與傳播方向垂直；液體無法承受這種剪切。';}}
function toggleWater(){let w=document.getElementById('waterLayer'),t=document.getElementById('waterText');w.classList.toggle('clear');t.textContent=w.classList.contains('clear')?'海水變透明後：看到海床先形成中洋脊，再向海溝下凹，板塊從這裡開始隱沒。':'海溝是在海面以下的海床凹陷，不是海面裂開。';}
function magneticTape(v){let box=document.getElementById('magStripes');let n=Number(v)+2,arr=[];for(let i=0;i<n;i++)arr.push(`<i class="${i%2?'reverse':'normal'}">${i%2?'↓':'↑'}</i>`);box.innerHTML=[...arr.slice().reverse(),...arr].join('');document.getElementById('magText').textContent=v==0?'岩漿冷卻後，磁性礦物把當時地磁方向鎖進岩石；正式名稱可在最後再記成「熱剩磁」。':`海床形成到第 ${n} 段：地磁極性曾改變，新岩石記下新方向；兩側同時被帶走，因此出現鏡像條帶。`;}
function coreDynamo(v){let e=document.getElementById('outerCore'),t=document.getElementById('coreText');e.className='outerCoreMini state'+v;t.textContent=v==0?'外核導電流體持續運動，形成地磁發電機；地磁不是地心藏了一根永久大磁鐵。':v==1?'外核流動樣式會隨時間改變，全球磁場強弱與形狀也會變。':'外核流動是一個複雜、非穩定的動態系統；某些時期偶極場會減弱、結構變複雜，之後重新建立時主要極性可能相反。科學家能用地磁發電機理解這種可能性，但無法預先算出下一次何時倒轉；倒轉沒有固定週期，也不是瞬間完成。';}
function toggleLayer(id,onv){document.getElementById(id).style.opacity=onv?1:.08;}
function warningCalc(d){d=Number(d);let p=d/6,s=d/3.5,process=4,lead=Math.max(0,s-p-process);document.getElementById('warningText').innerHTML=`距離約 <b>${d} km</b>｜概念估算 P波 ${p.toFixed(1)}秒、S波 ${s.toFixed(1)}秒抵達。扣除約4秒偵測／處理後，可用時間約 <b>${lead.toFixed(1)}秒</b>。${lead<3?' 距震源很近，可能落在預警盲區或時間極短。':' 有機會先做自動停機、開門等快速動作。'}`;let pDot=document.getElementById('pRace'),sDot=document.getElementById('sRace');pDot.style.left=Math.min(82,18+d*.28)+'%';sDot.style.left=Math.min(75,14+d*.22)+'%';}
function siteEffect(v){let e=document.getElementById('softCity');e.style.transform=`translateY(${Math.sin(v/8)*8}px) rotate(${(v-50)/80}deg)`;document.getElementById('siteText').textContent=v>60?'軟弱、厚沉積層可能讓某些頻率的地震動放大；同一地震在不同地盤不一定搖一樣。':'同一場地震，不同地盤條件可能有不同震動。';}
function atmosphereUp(v){document.getElementById('balloon').style.bottom=(8+v*.75)+'%';document.getElementById('atmText').textContent=v<25?'對流層：多數天氣在這裡，溫度大致隨高度下降。':v<55?'進入平流層：臭氧吸收紫外線，溫度趨勢可反轉。':v<80?'更高層又有不同能量吸收方式。':'到很高處時，已不能用「越高永遠越冷」一句話概括。';}
function pressureHeight(km){let f=Math.exp(-Number(km)/8.4),pct=Math.round(f*100);document.getElementById('pressureFill').style.height=pct+'%';document.getElementById('pressureRead').textContent=`${km} km：約海平面 ${pct}% 氣壓（概念）`;}
function dewPoint(t){t=Number(t);let drops=document.getElementById('drops');drops.style.opacity=t<=12?1:.1;document.getElementById('dewText').textContent=t<=12?`杯面${t}°C：低到接近／低於示意露點，周圍水氣開始凝結成水滴。`:`杯面${t}°C：還沒冷到示意露點，凝結較少。`;}
function airUp(v){let p=document.getElementById('airParcel');p.style.bottom=(8+v*.72)+'%';p.textContent=Math.round(30-v*.1)+'°C';document.getElementById('airText').textContent=v>65?'上升膨脹冷卻，若降到露點附近就可能凝結成雲。':'上升 → 外界壓力較低 → 膨脹 → 冷卻。';}
function windForces(v){let a=document.getElementById('windArrow');a.className='windArrow w'+v;document.getElementById('windText').textContent=v==0?'第1步：氣壓梯度力先把空氣從高壓推向低壓。':v==1?'第2步：空氣已經在動，北半球受科氏效應相對偏右。':'第3步：近地面摩擦降低風速，科氏效應變弱，風會斜穿等壓線吹向低壓。';}
function typhoonHeat(v){let e=document.getElementById('typhoonSpin');e.style.transform=`translate(-50%,-50%) rotate(${v*30}deg) scale(${.7+(v-24)*.07})`;document.getElementById('seaHeat').style.opacity=.45+(v-24)/10;document.getElementById('typhoonText').textContent=v<26?'海面偏涼：不利於持續提供大量水氣與能量。':'海面較暖、水氣充足時，較有利強對流維持；但實際強度還受風切、乾空氣等影響。';}
function typhoonLand(){let e=document.getElementById('typhoonSpin');e.style.filter='grayscale(.7)';e.style.transform='translate(-50%,-50%) scale(.65)';document.getElementById('typhoonText').textContent='登陸：少了暖海供能＋摩擦增加，環流通常逐步減弱。';}
function oceanProbe(v){let p=document.getElementById('probe');p.style.top=(8+v*.82)+'%';let t=28-v*.22,s=34.5+v*.012;document.getElementById('oceanText').textContent=v<25?`表層：約 ${t.toFixed(1)}°C，受風浪混合較明顯。`:v<65?`溫躍層：約 ${t.toFixed(1)}°C，溫度隨深度快速下降。`:`深層：約 ${Math.max(2,t).toFixed(1)}°C，水溫低、變化較慢。示意鹽度 ${s.toFixed(1)}。`;}
function tideMove(v){let a=Number(v)*Math.PI/180,x=50+37*Math.cos(a),y=50+37*Math.sin(a);document.getElementById('moonDot').style.left=x+'%';document.getElementById('moonDot').style.top=y+'%';document.getElementById('tideBulge').style.transform=`translate(-50%,-50%) rotate(${v}deg)`;}
function currentTurn(v){let a=document.getElementById('oceanArrow');a.style.transform=`rotate(${Number(v)*.55}deg)`;document.getElementById('currentText').textContent=`緯度概念 ${v}°：離赤道越遠，科氏效果通常更明顯；洋流還會被海岸邊界迫使轉向。`;}
function enso(v){v=Number(v);let w=document.getElementById('warmPool'),wind=document.getElementById('tradeWind'),up=document.getElementById('upwelling'),t=document.getElementById('ensoText');if(v<0){w.style.left='8%';w.style.width='46%';wind.textContent='←←← 較強信風';up.style.opacity=1;t.textContent='反聖嬰概念：信風較強，西側暖水堆積更明顯，東側湧升常較強。';}else if(v>0){w.style.left='30%';w.style.width='58%';wind.textContent='← 較弱信風';up.style.opacity=.25;t.textContent='聖嬰概念：信風減弱，暖水較向中東太平洋擴展，東側湧升受抑制。';}else{w.style.left='12%';w.style.width='40%';wind.textContent='←← 信風';up.style.opacity=.75;t.textContent='正常：信風把表層暖水推向西側，東側較有湧升。';}}
function remoteBand(b){let o=document.getElementById('remoteOverlay'),t=document.getElementById('remoteText');o.className='remoteOverlay '+b;if(b==='visible'){o.textContent='可見光';t.textContent='可見光接近日間肉眼看到的反射光，夜間受限制。';}if(b==='ir'){o.textContent='紅外線';t.textContent='紅外線可利用物體放射特性估計溫度資訊，夜間仍能觀測。';}if(b==='false'){o.textContent='假色';t.textContent='把不同波段映射成顏色，讓植生、雲頂或地表差異更容易看出來。';}}
function satOrbit(v){let d=document.getElementById('satDot'),t=document.getElementById('satText');d.className='satDot '+v;if(v==='leo')t.textContent='LEO：通常低於約2,000 km，近地、週期短；ISS、許多遙測衛星與Starlink位於低軌。';if(v==='meo')t.textContent='MEO：介於低軌與地球同步高度之間；GPS 約在20,200 km，約12小時繞地球一圈。';if(v==='geo')t.textContent='GEO：高度約35,786 km、赤道上空，週期與地球自轉匹配，因此從地面看起來可固定在同一方向。';}
function launchRocket(){let r=document.getElementById('rocket'),s=document.getElementById('starlinks');r.classList.add('launching');s.classList.add('deployed');document.getElementById('launchText').textContent='火箭把酬載送入軌道；可回收級段降低「每次都整支丟掉」的程度，衛星再被部署到低軌。';setTimeout(()=>r.classList.remove('launching'),1800);}
function auroraLevel(v){let e=document.getElementById('auroraOval');e.style.opacity=.25+v*.14;e.style.transform=`translate(-50%,-50%) scale(${.8+v*.08})`;document.getElementById('auroraText').textContent=v>=4?'活動較強：更多能量進入磁層，極光可能更亮，極光橢圓也可能向較低緯度擴張。':'太陽風把能量帶入磁層；帶電粒子沿磁場進入高層大氣，碰撞後發光。';}
function earthRotate(v){document.getElementById('dayEarth').style.transform=`translate(-50%,-50%) rotate(${v}deg)`;document.getElementById('dayText').textContent=`自轉 ${v}°：地球自己轉，造成日夜與星空周日運動；不是地球每天繞太陽一圈。`;}
function dayOfYearForMonth(m){return [15,46,74,105,135,166,196,227,258,288,319,349][m-1];}
function seasonCalc(){let m=Number(document.getElementById('monthSlider').value),lat=Number(document.getElementById('latSlider').value),n=dayOfYearForMonth(m),decl=23.44*Math.sin(2*Math.PI*(284+n)/365),phi=lat*Math.PI/180,del=decl*Math.PI/180,x=-Math.tan(phi)*Math.tan(del),day;if(x>=1)day=0;else if(x<=-1)day=24;else day=2*Math.acos(x)*180/Math.PI/15;let a=(m-1)/12*2*Math.PI,xp=50+35*Math.cos(a),yp=50+28*Math.sin(a),e=document.getElementById('seasonEarth');e.style.left=xp+'%';e.style.top=yp+'%';document.getElementById('latBadge').textContent=`${lat>=0?'北':'南'}緯 ${Math.abs(lat)}°`;document.getElementById('dayMeterFill').style.width=(day/24*100)+'%';let special=day>23.8?'永晝：24小時太陽不落。':day<.2?'永夜：24小時太陽不升。':`白晝約 ${day.toFixed(1)} 小時。`;let polar=Math.abs(lat)<66.5?'這個緯度不會出現真正的永晝或永夜。':'跨進極圈後，接近夏至／冬至時可能出現永晝或永夜。';let hemi=lat<0?'南半球的季節和北半球相反。':'';document.getElementById('seasonText').innerHTML=`${m}月｜太陽赤緯約 ${decl.toFixed(1)}°｜${special}<br>${polar} ${hemi}<br><b>重點：</b>四季來自地軸傾斜＋公轉，改變太陽高度與日照時間，不是單靠日地距離。`;}
function setLat(v){document.getElementById('latSlider').value=v;seasonCalc();}
function polarisSeason(v){let names=['春','夏','秋','冬'],deg=Number(v)*90;document.getElementById('dipper').style.transform=`translate(-50%,-50%) rotate(${deg}deg)`;document.getElementById('polarisText').textContent=`${names[v]}：同一鐘點看，周圍星座大約換了方位；北極星仍大致停在北天極附近。`;}
function polarisLat(v){v=Number(v);let star=document.getElementById('polarisStar');star.style.bottom=(22+v*.6)+'%';document.getElementById('polarisLatText').textContent=v===24?'臺灣約24°N → 北極星仰角約24°。':`北緯 ${v}° → 北極星仰角約 ${v}°。${v>70?'接近北極時，北極星會越靠近頭頂。':''}`;}
let moonMode='sync';
function moonMove(v){let a=Number(v),r=a*Math.PI/180,x=50+35*Math.cos(r),y=50+35*Math.sin(r),m=document.getElementById('moonOrb');m.style.left=x+'%';m.style.top=y+'%';m.style.transform=`translate(-50%,-50%) rotate(${moonMode==='sync'?a:0}deg)`;document.getElementById('moonText').textContent=moonMode==='sync'?`同步自轉：公轉 ${a}°，月球自己也轉約 ${a}°，所以同一面長期朝向地球。`:`假設不自轉：公轉 ${a}°，月球表面方向不變，地球會陸續看到不同面；這和真實情況不符。`;}
function cosmicAddress(v){let levels=[['🌏','地球','我們的起點：地球。'],['🌍🌙','地月系','地球和天然衛星月球。'],['☀️','太陽系','太陽的引力控制八大行星與許多小天體。'],['🌌','銀河系','太陽系位於銀河系的一個局部旋臂區域。'],['✨✨','本星系群','銀河系和仙女座等星系同屬本星系群。'],['✦✦✦','更大尺度','星系群還能形成更大的宇宙網狀結構。'],['∞','可觀測宇宙','我們能看到的是光有時間抵達我們的範圍。']][v];document.getElementById('addressIcon').textContent=levels[0];document.getElementById('addressTitle').textContent=levels[1];document.getElementById('addressText').textContent=levels[2];}
function planetInfo(n){let p=PLANETS[n];let order=['水星','金星','地球','火星','木星','土星','天王星','海王星'].indexOf(n)+1;document.getElementById('planetInfo').innerHTML=`<b>${n}</b>：${n==='冥王星'?'矮行星':'第'+order+'顆行星'}｜約 ${p.au} AU｜公轉 ${p.year}｜自轉 ${p.rot}<br>${p.note}`;}
function planetMotionInfo(n){let p=PLANETS[n];document.getElementById('motionText').innerHTML=`<b>${n}：</b>公轉 ${p.year}｜自轉 ${p.rot}。拖上面兩個滑桿，把「繞太陽」和「自己轉」分開看。`;planetMotion();}
function planetMotion(){let n=document.getElementById('motionSelect')?.value||'地球',a=Number(document.getElementById('orbitAngle')?.value||0),spin=Number(document.getElementById('spinAngle')?.value||0),r=a*Math.PI/180,x=50+34*Math.cos(r),y=50+30*Math.sin(r),e=document.getElementById('motionPlanet');if(!e)return;e.style.left=x+'%';e.style.top=y+'%';e.style.transform=`translate(-50%,-50%) rotate(${spin}deg)`;e.childNodes[0].textContent=n==='地球'?'🌍':'●';}
function planetDistance(n){let p=PLANETS[n],d=Math.min(92,12+Math.log10(p.au+.2)*42+25);document.getElementById('distancePlanet').textContent=n==='地球'?'🌍':'●';document.getElementById('distancePlanet').style.left=d+'%';document.getElementById('distanceText').innerHTML=`<b>${n}</b> 距太陽平均約 ${p.au} AU｜公轉 ${p.year}。${p.note}`;}
function lightYear(v){document.getElementById('lightText').textContent=`${v} 光年：你現在收到的是約 ${v} 年前從那裡出發的光。光年本身仍然是距離單位。`;}
function climateScale(v){v=Number(v);document.getElementById('climateText').textContent=v<3?`只看 ${v} 個時間點：像在看今天、明天，這是天氣。`:v<15?`拉長到 ${v} 個單位：開始看平均與變動，但還要注意尺度是否足夠。`:`拉長到 ${v} 個長期單位：才更接近「氣候＝長期統計」的概念。`;}
function iceAlbedo(v){document.getElementById('iceCap').style.width=v+'%';document.getElementById('iceText').textContent=v>60?'冰雪多 → 反照率較高 → 更多太陽能被反射。':'冰雪少 → 暗色地表／海面暴露更多 → 吸收更多太陽能 → 可進一步促進升溫。';}
function seaLevel(){let a=Number(document.getElementById('thermal').value),b=Number(document.getElementById('landIce').value),h=35+(a+b)*4;document.getElementById('seaLevelFill').style.height=h+'%';document.getElementById('seaLevelText').textContent=`概念貢獻：熱膨脹 ${a} ＋ 陸地冰融水 ${b}。兩條路都能讓平均海平面上升。`;}
function greenhouse(v){let e=document.getElementById('heatTrap');e.style.opacity=.18+v/130;e.style.borderWidth=(1+v/25)+'px';document.getElementById('greenText').textContent=v<25?'天然溫室效應讓地球不至於過冷，是自然現象。':'額外增加溫室氣體會讓部分向外長波輻射更難直接逸散，系統累積能量直到形成新的平衡。';}
function classifyResponse(btn,k){document.querySelectorAll('.responseStage button').forEach(x=>x.classList.remove('picked'));btn.classList.add('picked');document.getElementById('responseText').textContent=k==='m'?'這主要是「減緩」：降低造成氣候變遷的驅動或排放。':'這主要是「調適」：降低已經或預期會發生的衝擊。';}
function sustain(){let a=+document.getElementById('env').value,b=+document.getElementById('soc').value,c=+document.getElementById('eco').value;let spread=Math.max(a,b,c)-Math.min(a,b,c);document.getElementById('sustainText').textContent=spread<=1?'三面相對平衡：接下來還要看未來世代與具體情境。':'有一個面向被拉得很高或很低：這正是永續決策最需要說清楚的取捨。';}
function energyMetric(v){let t={carbon:'看碳排：低碳很重要，但還要看穩定性、土地與成本。',stable:'看穩定供電：可調度性很重要，但也不能忽略排放與風險。',land:'看土地／空間：能源密度與場址會影響環境與社會接受度。',cost:'看成本：不能只看發電單價，也要看系統、備援、環境與長期成本。'}[v];document.getElementById('energyText').textContent=t;}

// --- 闖關與模擬考 ---
function pool(){let ids=new Set(eligibleSections().map(x=>x.id)),o=[];S.forEach(s=>s.questions.forEach(q=>{if(ids.has(s.id))o.push({s,q})}));return o;}
function shuffle(a){let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function startChallenge(level){showPage('challenge');let all=pool(),target=level==='D'?'C':level,f=all.filter(o=>o.q[0]===target);if(f.length<5)f=all;let p=shuffle(f).slice(0,5);document.getElementById('challengeArea').innerHTML=`<div class="card examBlock"><h3>${level}級｜目前範圍 5 題</h3><p class="mini">${level==='A'?'核心概念':level==='B'?'關係與判讀':level==='C'?'生活與應用':'素養變形'}</p>${renderExamQs(p,'c'+level)}</div>`;}
function renderExamQs(items,prefix){return items.map((o,n)=>`<div class="examQ" data-answer="${o.q[3]}"><div class="mini">${o.s.id} ${esc(o.s.title)}</div><div class="qtext">${n+1}. ${esc(o.q[1])}</div><div class="choices">${o.q[2].map((c,i)=>`<label class="choice"><input type="radio" name="${prefix}_${n}" value="${i}"> ${String.fromCharCode(65+i)}. ${esc(c)}</label>`).join('')}</div></div>`).join('')+`<button class="primary" onclick="gradeBlock(this)">交卷</button>`;}
function gradeBlock(btn){let r=btn.parentElement,qs=[...r.querySelectorAll('.examQ')],ok=0;qs.forEach(q=>{let p=q.querySelector('input:checked');if(p&&+p.value===+q.dataset.answer)ok++;});let sc=Math.round(ok/qs.length*100);let msg=sc>=80?'快練成了，可以去教同學兩題。':'不用盲刷。回錯題對應小節看一次互動，再回來。';btn.disabled=true;btn.insertAdjacentHTML('afterend',`<div class="feedback"><b>${sc} 分</b>｜答對 ${ok}/${qs.length} 題。${msg}</div>`);addStar(ok);}
function startExam(v){showPage('exam');let source=pool();if(!source.length)return;let p=shuffle(source);while(p.length<20)p=p.concat(shuffle(source));p=p.slice(0,20);document.getElementById('examArea').innerHTML=`<div class="card examBlock"><div class="eyebrow">${scope.name}</div><h3>${v} 卷｜20題・100分</h3><p class="muted">建議40–50分鐘。先做會的，再回頭處理卡住的。</p>${renderExamQs(p,'e'+v)}</div>`;}

updateStars();
renderHome();
renderChapters();
renderRange();
updateScopeUI();
