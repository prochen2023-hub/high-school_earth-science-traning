
const D=window.CURRICULUM,S=D.sections,C=D.chapters;
let stars=Number(localStorage.getItem("geo_stars")||0);
let scope=JSON.parse(localStorage.getItem("geo_scope")||'null')||{name:"第一次段考",chapters:["ch1","ch2"]};
let teachIndex=Number(localStorage.getItem("geo_teach_index")||5);
let onlyTaught=localStorage.getItem("geo_only_taught")==="1";
const done=()=>new Set(JSON.parse(localStorage.getItem("geo_done")||"[]"));
const cname=id=>C.find(x=>x.id===id)?.title||id;
function saveDone(x){localStorage.setItem("geo_done",JSON.stringify([...x]))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function updateStars(){document.getElementById("starCount").textContent="⭐ "+stars}
function addStar(n=1){stars+=n;localStorage.setItem("geo_stars",stars);updateStars()}
function toggleLow(){document.body.classList.toggle("lowtext")}
function speak(t){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang="zh-TW";u.rate=.92;speechSynthesis.speak(u)}
function speakVisible(){let t=document.querySelector("#lessonApp:not(.hidden)")||document.querySelector(".page.active");if(t)speak(t.innerText)}
function eligibleSections(){
 let arr=S.filter(x=>scope.chapters.includes(x.ch));
 if(onlyTaught)arr=arr.filter(x=>S.indexOf(x)<=teachIndex);
 return arr.length?arr:S.filter(x=>scope.chapters.includes(x.ch))
}
function showPage(p){
 document.getElementById("mainApp").classList.remove("hidden");document.getElementById("lessonApp").classList.add("hidden");
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById("page-"+p).classList.add("active");
 document.querySelectorAll(".navtab").forEach(x=>x.classList.toggle("active",x.dataset.page===p));
 if(p==="chapters")renderChapters();if(p==="range")renderRange();updateScopeUI();scrollTo({top:0,behavior:"smooth"})
}
function renderHome(){
 let picks=["2-3","3-5","4-2","5-2"].map(id=>S.find(x=>x.id===id));
 document.getElementById("lifeGrid").innerHTML=picks.map(x=>`<div class="card lifeCard"><div style="font-size:36px">${x.emoji}</div><b>${x.hook}</b><span class="mini">${x.one}</span><br><button class="secondary" style="margin-top:9px" onclick="openLesson('${x.id}')">看看原理 →</button></div>`).join("")
}
function updateScopeUI(){
 document.getElementById("scopeName").textContent=scope.name;
 document.getElementById("scopeSummary").textContent=scope.chapters.map(cname).join("＋");
 let sec=S.filter(x=>scope.chapters.includes(x.ch)),ds=done(),n=sec.filter(x=>ds.has(x.id)).length,p=sec.length?Math.round(n/sec.length*100):0;
 document.getElementById("scopeMeter").style.width=p+"%";document.getElementById("scopeProgress").textContent=`已完成 ${n}/${sec.length} 小節（${p}%）`
}
function renderChapters(){
 let ds=done();
 document.getElementById("chapterGrid").innerHTML=C.map(ch=>{
  let ss=S.filter(x=>x.ch===ch.id),n=ss.filter(x=>ds.has(x.id)).length;
  return `<article class="card chapterCard"><div class="chapterHead"><div class="chapterIcon">${ch.emoji}</div><div><div class="eyebrow">${ch.num}</div><h3>${ch.title}</h3><div class="muted">${ch.tagline}</div></div></div><div class="meter" style="margin-top:12px"><i style="width:${Math.round(n/ss.length*100)}%"></i></div><div class="mini">${n}/${ss.length} 小節完成</div><div class="sectionList">${ss.map(x=>`<div class="sectionRow ${ds.has(x.id)?"done":""}"><span class="secid">${x.id}</span><div><b>${x.emoji} ${x.title}</b><div class="mini">${x.one}</div></div><button class="secondary" onclick="openLesson('${x.id}')">${ds.has(x.id)?"再複習":"開始"}</button></div>`).join("")}</div></article>`
 }).join("")
}
function renderRange(){
 document.getElementById("teachSlider").value=teachIndex;document.getElementById("onlyTaught").checked=onlyTaught;updateTeachProgress(teachIndex,false);
 document.getElementById("rangeChecks").innerHTML=C.map(ch=>`<label class="check"><input type="checkbox" class="scopeCheck" value="${ch.id}" ${scope.chapters.includes(ch.id)?"checked":""}><span><b>${ch.num} ${ch.title}</b><br><span class="mini">${S.filter(x=>x.ch===ch.id).map(x=>x.id).join("、")}</span></span></label>`).join("")
}
function applyPreset(k){
 let n={exam1:"第一次段考",exam2:"第二次段考",exam3:"第三次段考／期末"}[k];
 scope={name:n,chapters:[...D.defaultScopes[k]]};localStorage.setItem("geo_scope",JSON.stringify(scope));renderRange();updateScopeUI()
}
function saveCustomScope(){
 let ch=[...document.querySelectorAll(".scopeCheck:checked")].map(x=>x.value);if(!ch.length){alert("至少選一章");return}
 scope={name:"自訂段考範圍",chapters:ch};localStorage.setItem("geo_scope",JSON.stringify(scope));updateScopeUI()
}
function selectAllScope(v){document.querySelectorAll(".scopeCheck").forEach(x=>x.checked=v)}
function updateTeachProgress(v,save=true){teachIndex=Number(v);let s=S[teachIndex];document.getElementById("teachLabel").innerHTML=`目前教到：<b>${s.id} ${s.title}</b>｜前面 ${teachIndex+1} 小節視為已教`;if(save)localStorage.setItem("geo_teach_index",teachIndex)}
function saveOnlyTaught(){onlyTaught=document.getElementById("onlyTaught").checked;localStorage.setItem("geo_only_taught",onlyTaught?"1":"0")}
function makeToday(){
 let a=eligibleSections(),s=a[Math.floor(Math.random()*a.length)],q=s.questions[Math.floor(Math.random()*s.questions.length)];showPage("home");
 document.getElementById("todayArea").innerHTML=`<div class="card"><div class="eyebrow">今天只學 ${s.id}</div><h3>${s.emoji} ${s.hook}</h3><p><b>先懂一句：</b>${s.one}</p><p class="muted">${s.chain}</p><button class="primary" onclick="openLesson('${s.id}')">用 5 分鐘看懂</button></div><div class="card"><div class="eyebrow">最後只做 1 題</div><div class="qtext">${q[1]}</div><div class="choices" style="margin-top:9px">${q[2].map((c,i)=>`<button class="choice" onclick="answerInline(this,${i},${q[3]},'${esc(q[4])}')">${String.fromCharCode(65+i)}. ${c}</button>`).join("")}</div><div class="feedback hidden"></div></div>`
}
function answerInline(btn,i,a,why){let box=btn.closest(".card"),cs=box.querySelectorAll(".choice");cs.forEach((x,j)=>{x.disabled=true;if(j===a)x.classList.add("ok")});if(i!==a)btn.classList.add("bad");let f=box.querySelector(".feedback");f.classList.remove("hidden");f.innerHTML=(i===a?"✅ 對！ ":"❌ 差一點。 ")+why;if(i===a)addStar()}
function openLesson(id){
 let s=S.find(x=>x.id===id),ch=C.find(x=>x.id===s.ch);
 document.getElementById("mainApp").classList.add("hidden");document.getElementById("lessonApp").classList.remove("hidden");
 document.getElementById("lessonView").innerHTML=`<div class="lessonTop"><button class="secondary" onclick="showPage('chapters')">← 回章節</button><div><div class="eyebrow">${ch.num}｜${ch.title}｜${s.id}</div><h1 class="lessonTitle">${s.emoji} ${s.title}</h1><div class="hook">${s.hook}</div></div></div>
 <div class="modebar"><button class="mode active" onclick="lessonMode(this,'easy')">🙂 白話先懂</button><button class="mode" onclick="lessonMode(this,'textbook')">📘 高中正式</button><button class="mode" onclick="lessonMode(this,'quiz')">🎯 題目模式</button><button class="mode" onclick="lessonMode(this,'sim')">🕹️ 動手看</button></div>
 <div id="mode-easy" class="lessonMode"><div class="chunk bigOne"><div class="mini">先只記這一句</div>${s.one}</div><div class="chunk chain"><h3>🧩 一條因果鏈</h3><p style="font-weight:900">${s.chain}</p></div><div class="chunk"><h3>三塊就懂</h3><div class="concepts">${s.concepts.map(c=>`<div class="concept"><b>${c[0]}</b><p>${c[1]}</p></div>`).join("")}</div></div>${rescueHTML(s)}</div>
 <div id="mode-textbook" class="lessonMode hidden"><div class="chunk"><h3>📘 高中正式名詞</h3><div class="termRow">${s.terms.map(x=>`<span class="term">${x}</span>`).join("")}</div></div><div class="chunk trap"><h3>⚠️ 最容易搞混</h3><ul>${s.traps.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="chunk"><h3>🧠 解題地圖</h3><p>看到什麼？ → 什麼在動？ → 誰提供力量或能量？ → 留下什麼證據？ → 圖表對應哪一步？</p></div></div>
 <div id="mode-quiz" class="lessonMode hidden"><div class="chunk"><h3>🎯 3題就收工</h3>${quizHTML(s.questions)}</div></div>
 <div id="mode-sim" class="lessonMode hidden">${simHTML(s.ch)}</div>
 <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="primary" onclick="markDone('${s.id}')">✅ 這節我懂到可以往下</button><button class="secondary" onclick="speakVisible()">🔊 聽這一頁</button></div>`;
 scrollTo({top:0})
}
function rescueHTML(s){return `<div class="chunk rescue"><h3>🆘 我真的看不懂</h3><div class="rescueLevels"><div class="rescueLevel"><strong>國小版</strong>先別背：自然現象一定有原因。</div><div class="rescueLevel"><strong>國中版</strong>${s.hook}</div><div class="rescueLevel"><strong>高中一句</strong>${s.one}</div><div class="rescueLevel"><strong>只背箭頭</strong>${s.chain}</div></div></div>`}
function lessonMode(btn,m){document.querySelectorAll(".mode").forEach(x=>x.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".lessonMode").forEach(x=>x.classList.add("hidden"));document.getElementById("mode-"+m).classList.remove("hidden")}
function quizHTML(qs){return qs.map((q,n)=>`<div class="examQ"><div class="mini">${q[0]}級｜第 ${n+1} 題</div><div class="qtext">${q[1]}</div><div class="choices">${q[2].map((c,i)=>`<button class="choice" onclick="answerQuiz(this,${i},${q[3]},'${esc(q[4])}')">${String.fromCharCode(65+i)}. ${c}</button>`).join("")}</div><div class="feedback hidden"></div></div>`).join("")}
function answerQuiz(btn,i,a,why){let b=btn.closest(".examQ"),cs=b.querySelectorAll(".choice");cs.forEach((x,j)=>{x.disabled=true;if(j===a)x.classList.add("ok")});if(i!==a)btn.classList.add("bad");let f=b.querySelector(".feedback");f.classList.remove("hidden");f.textContent=(i===a?"✅ 找到因果了。 ":"❌ 先別背答案。 ")+why;if(i===a)addStar()}
function markDone(id){let ds=done();ds.add(id);saveDone(ds);addStar(2);alert("已記錄完成 ⭐ +2")}
function simHTML(ch){
 if(ch==="ch1")return `<div class="chunk"><h3>🕰️ 地球歷史縮成24小時</h3><div class="simGrid"><div class="simStage"><div id="timeText" style="text-align:center;margin-top:70px;font-size:28px;font-weight:900">00:00 地球形成</div></div><div class="simControls"><input type="range" min="0" max="100" value="0" oninput="simTime(this.value)"><p id="timeExplain">拖曳感受尺度：人類歷史只在非常接近午夜的最後一瞬。</p></div></div></div>`;
 if(ch==="ch2")return `<div class="chunk"><h3>〰️ P、S波賽跑</h3><div class="simGrid"><div class="simStage"><b>P波</b><div class="waveTrack"><div id="pbar" class="waveBar pbar"></div></div><b>S波</b><div class="waveTrack"><div id="sbar" class="waveBar sbar"></div></div><div id="waveResult"></div></div><div class="simControls"><button class="primary" onclick="runWaves()">開始地震</button><p>P波較快先到；速報就是利用先到的資訊搶時間。</p></div></div></div>`;
 if(ch==="ch3")return `<div class="chunk"><h3>🎈 把空氣團往上抬</h3><div class="simGrid"><div class="simStage"><div id="parcel" class="airParcel">30°C</div></div><div class="simControls"><input type="range" min="0" max="100" value="0" oninput="airUp(this.value)"><div id="airText">上升 → 膨脹 → 冷卻。</div></div></div></div>`;
 if(ch==="ch4")return `<div class="chunk"><h3>🌙 潮汐概念模型</h3><div class="simGrid"><div class="simStage"><div class="ocean"></div><div class="moon" id="moon"></div><div class="tideBulge" id="bulge"></div></div><div class="simControls"><input type="range" min="0" max="360" value="0" oninput="tide(this.value)"><p>拖曳月球方向；真實潮汐還受海盆形狀與水深影響。</p></div></div></div>`;
 if(ch==="ch5")return `<div class="chunk"><h3>☀️ 公轉＋地軸傾斜＝季節</h3><div class="simGrid"><div class="simStage"><div class="sun"></div><div class="orbitEarth" id="orbitEarth"><div class="axis"></div></div></div><div class="simControls"><input type="range" min="0" max="11" value="0" oninput="season(this.value)"><div id="seasonText">1月：北半球日照角較低、白晝較短。</div></div></div></div>`;
 if(ch==="ch6")return `<div class="chunk"><h3>🌡️ 能量平衡概念模型</h3><div class="simGrid"><div class="simStage"><div class="climateBar"><div id="climateFill" class="climateFill"></div></div></div><div class="simControls"><input type="range" min="0" max="100" value="40" oninput="climate(this.value)"><div id="climateText">這是概念模型，不是實際溫度計算。</div></div></div></div>`;
 return `<div class="chunk"><h3>⚖️ 風險不是只看危害</h3><div class="simGrid"><div class="simStage"><div class="riskEq">危害 × 暴露 × 脆弱</div><div id="riskScore" style="text-align:center;font-size:34px">風險 27</div></div><div class="simControls"><label>危害<input id="hz" type="range" min="1" max="5" value="3" oninput="risk()"></label><label>暴露<input id="ex" type="range" min="1" max="5" value="3" oninput="risk()"></label><label>脆弱<input id="vu" type="range" min="1" max="5" value="3" oninput="risk()"></label><p>教學概念模型，不是正式風險定量公式。</p></div></div></div>`
}
function simTime(v){let lab=v<20?"早期地球":v<50?"生命與大氣演化":v<90?"複雜生命增加":v<99?"恐龍與哺乳類":"人類極晚出現";let h=Math.floor(v/100*24);document.getElementById("timeText").textContent=String(h).padStart(2,"0")+":00 "+lab}
function runWaves(){document.getElementById("pbar").style.width="100%";document.getElementById("sbar").style.width="65%";document.getElementById("waveResult").textContent="P波先到！";setTimeout(()=>document.getElementById("sbar").style.width="100%",900)}
function airUp(v){let p=document.getElementById("parcel");p.style.bottom=(20+v*1.2)+"px";p.textContent=Math.round(30-v*.1)+"°C";document.getElementById("airText").textContent=v>65?"若冷卻到飽和，就可能凝結成雲。":"上升時外界壓力降低，空氣膨脹冷卻。"}
function tide(v){document.getElementById("bulge").style.transform=`translate(-50%,-50%) rotate(${v}deg)`}
function season(v){v=+v;let a=v/12*2*Math.PI,x=50+35*Math.cos(a),y=50+35*Math.sin(a),e=document.getElementById("orbitEarth");e.style.left=`calc(${x}% - 28px)`;e.style.top=`calc(${y}% - 28px)`;let m=v+1;document.getElementById("seasonText").textContent=`${m}月：${m>=5&&m<=8?"北半球接近夏半年，日照角較高、白晝較長。":m>=11||m<=2?"北半球接近冬半年，日照角較低、白晝較短。":"春秋過渡季節。"} `}
function climate(v){document.getElementById("climateFill").style.height=(25+v*.65)+"%";document.getElementById("climateText").textContent=`概念強度 ${v}：溫室氣體增加會改變向外散熱，系統累積能量直到建立新平衡。`}
function risk(){let a=+document.getElementById("hz").value,b=+document.getElementById("ex").value,c=+document.getElementById("vu").value;document.getElementById("riskScore").textContent="風險 "+a*b*c}
function pool(){let ids=new Set(eligibleSections().map(x=>x.id)),o=[];S.forEach(s=>s.questions.forEach(q=>{if(ids.has(s.id))o.push({s,q})}));return o}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function startChallenge(level){showPage("challenge");let all=pool(),f=all.filter(o=>o.q[0]===(level==="D"?"C":level));if(f.length<5)f=all;let p=shuffle(f).slice(0,5);document.getElementById("challengeArea").innerHTML=`<div class="card" style="margin-top:14px"><h3>${level}級｜目前範圍 5 題</h3><p class="mini">${level==="A"?"核心概念":level==="B"?"關係與判讀":level==="C"?"生活與應用":"素養挑戰（以C級題變形練習）"}</p>${renderExamQs(p,"c"+level)}</div>`}
function renderExamQs(items,prefix){return items.map((o,n)=>`<div class="examQ" data-answer="${o.q[3]}"><div class="mini">${o.s.id} ${o.s.title}</div><div class="qtext">${n+1}. ${o.q[1]}</div><div class="choices">${o.q[2].map((c,i)=>`<label class="choice"><input type="radio" name="${prefix}_${n}" value="${i}"> ${String.fromCharCode(65+i)}. ${c}</label>`).join("")}</div></div>`).join("")+`<button class="primary" onclick="gradeBlock(this)">交卷</button>`}
function gradeBlock(btn){let r=btn.parentElement,qs=[...r.querySelectorAll(".examQ")],ok=0;qs.forEach(q=>{let p=q.querySelector("input:checked");if(p&&+p.value===+q.dataset.answer)ok++});let sc=Math.round(ok/qs.length*100);btn.insertAdjacentHTML("afterend",`<div class="feedback"><b>${sc} 分</b>｜答對 ${ok}/${qs.length} 題。${sc>=80?"可以升級。":"先回錯題對應小節，不要盲刷。"}</div>`);addStar(ok)}
function startExam(v){showPage("exam");let p=shuffle(pool());while(p.length<20)p=p.concat(shuffle(pool()));p=p.slice(0,20);document.getElementById("examArea").innerHTML=`<div class="card" style="margin-top:14px"><div class="eyebrow">${scope.name}</div><h3>${v} 卷｜20題・100分</h3><p class="muted">建議 40–50 分鐘。</p>${renderExamQs(p,"e"+v)}</div>`}
updateStars();renderHome();renderChapters();renderRange();updateScopeUI();
