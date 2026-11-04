/* 第三章臺灣地質圖像學院 v4.11：純前端、離線可讀；所有 img 有隨檔素材。 */
const $=(q,base=document)=>base.querySelector(q);
const $$=(q,base=document)=>Array.from(base.querySelectorAll(q));
const imgBase='assets/atlas/';
let currentTab='geology';
function setTab(id,updateHash=true){
 if(!$('.tab-pane[data-pane="'+id+'"]'))id='geology';
 currentTab=id;
 $$('.tab').forEach(btn=>{const yes=btn.dataset.tab===id;btn.classList.toggle('active',yes);btn.setAttribute('aria-selected',String(yes));});
 $$('.tab-pane').forEach(el=>el.classList.toggle('active',el.dataset.pane===id));
 if(updateHash)history.replaceState(null,'','#'+id);
 if(updateHash)$('#atlasNav').scrollIntoView({behavior:'smooth',block:'start'});
}
$$('.tab').forEach(btn=>btn.addEventListener('click',()=>setTab(btn.dataset.tab)));
const regionData={
 1:{name:'西部海岸平原',words:'河川從山上搬運砂、泥、礫，在海岸平原堆出年輕的沖積層。這一帶主要是鬆散沉積物，不是所有地方都有完整膠結的岩石。',rocks:'砂、泥、礫等沖積物；河川與海岸沉積。',places:'彰化平原、嘉南平原、高屏平原。',memory:'看地形：比較平坦；看岩性：年輕沖積層。',related:['sandstone','conglomerate']},
 2:{name:'西部麓山帶',words:'臺灣西部丘陵帶多為第三紀至第四紀的沉積岩層，受到造山擠壓出現褶皺、逆斷層，常見砂岩、頁岩與礫岩。',rocks:'砂岩、頁岩、礫岩；砂頁岩互層很典型。',places:'苗栗火炎山礫岩、野柳一帶砂岩地層、西部丘陵帶。',memory:'西部麓山先找層理、砂頁岩與褶皺。',related:['sandstone','shale','conglomerate']},
 3:{name:'雪山山脈地質帶',words:'位於臺灣北中部偏西的古第三紀沉積岩及弱變質岩分布區，受造山作用後形成山脈，板岩、硬頁岩與砂岩常可見到。',rocks:'硬頁岩、板岩、變質砂岩。',places:'雪山山脈與其周圍高山帶。',memory:'從較年輕沉積層向東進入更明顯的構造變形與變質作用。',related:['slate','sandstone']},
 4:{name:'脊樑山脈西翼：廬山板岩帶',words:'中央山脈西側的板岩帶是變質作用較明顯的例子，泥質岩在造山作用下轉成板岩、千枚岩等；深部變形也讓岩石更容易沿片理劈開。',rocks:'板岩、千枚岩、變質砂岩。',places:'南投廬山附近與中央山脈西側山區。',memory:'看到板理、薄片狀剝離，就想泥質岩受到變質。',related:['slate','schist']},
 5:{name:'脊樑山脈東翼：大南澳變質岩帶',words:'以古老變質岩為代表，包含片岩、片麻岩與大理岩等，能看見海洋沉積物與其他岩石受到構造擠壓與變質的結果。',rocks:'片岩、片麻岩、大理岩，局部可有蛇紋岩與其他變質岩。',places:'花蓮太魯閣、南澳一帶；太魯閣大理岩最容易有印象。',memory:'太魯閣大理岩＝變質作用可以形成的典型岩石。',related:['schist','gneiss','marble']},
 6:{name:'花東縱谷構造帶',words:'花東縱谷是中央山脈與海岸山脈之間的重要構造分界，與活動斷層和板塊碰撞縫合有關；不能把它當作某一種單一岩石的分布帶。',rocks:'河谷沖積物、不同地體交界的複雜沉積與構造。',places:'花蓮玉里、瑞穗、池上、關山、臺東縱谷。',memory:'花東縱谷的考點是構造縫合與斷層，不是「某種岩石獨占」。',related:['conglomerate']},
 7:{name:'海岸山脈',words:'海岸山脈承接呂宋火山島弧的地質背景，以安山岩質火山岩、火山碎屑岩及深海沉積岩為重要組成，是認識島弧與碰撞的窗口。',rocks:'安山岩、火山角礫岩、凝灰岩、深海沉積岩與混同層。',places:'花蓮石梯坪、臺東都蘭山一帶。',memory:'海岸山脈帶有「島弧火山＋深海沉積」的身世。',related:['andesite','conglomerate']},
 8:{name:'北部火山地帶',words:'臺灣北部存在大屯火山群等第四紀火山系統，與北臺灣複雜構造演化及沖繩海槽張裂背景相關。龜山島同為重要火山地質教材。',rocks:'安山岩及其他火山岩、火山碎屑物。',places:'陽明山大屯火山群、宜蘭龜山島（近岸離島）。',memory:'北部有火山，不代表全臺灣各個地區都處在同一條隱沒邊界上。',related:['andesite','basalt']}
};
function renderRegion(num){
 const d=regionData[num];if(!d)return;
 $$('#regionBtns .region').forEach(b=>b.classList.toggle('active',Number(b.dataset.region)===num));
 $('#zoneMap').src=imgBase+'zone-'+num+'.webp';
 $('#regionInfo').innerHTML=`<h4>${num}. ${d.name}</h4><p>${d.words}</p><dl><dt>主要岩性</dt><dd>${d.rocks}</dd><dt>對應地點</dt><dd>${d.places}</dd><dt>一眼抓重點</dt><dd>${d.memory}</dd></dl><button class="link-chip" type="button" id="showRegionRocks">看這裡對應的岩石樣本 ↗</button>`;
 $('#showRegionRocks').addEventListener('click',()=>{setTab('specimens');setRockFilter('all');const first=rockData.find(r=>d.related.includes(r.id)); if(first)showRock(first.id);});
}
$$('#regionBtns .region').forEach(b=>b.addEventListener('click',()=>renderRegion(Number(b.dataset.region))));
renderRegion(1);

const featureData={
 trench:{title:'海溝｜Trench',where:'臺灣東北外海的琉球海溝、臺灣西南方連向呂宋的馬尼拉海溝',process:'聚合板塊邊界附近，一塊岩石圈向下隱沒，海床形成狹長、很深的凹地。',exam:'在剖面上先找深而窄的低地，再看是否連向下傾的隱沒板塊。',dont:'「海溝」通常對應隱沒系統；不要把沖繩海槽也當作海溝。'},
 trough:{title:'海槽｜Trough',where:'沖繩海槽（臺灣東北外海，琉球島弧的後方）',process:'廣義的細長海底凹地，可能與張裂、沉降或不同構造作用有關。沖繩海槽是很典型的弧後張裂海盆。',exam:'看到沖繩海槽要聯想「琉球弧後盆地」，不是「菲律賓海板塊就在這裡隱沒」。',dont:'海槽不一定是隱沒產生的海溝。'},
 basin:{title:'海盆｜Basin',where:'臺灣東南方花東海盆、臺灣西南方南海深海盆地',process:'面積較廣的海底低地，可累積深海沉積物；成因可以是洋殼形成、板塊變形與長期沉降等。',exam:'地形圖上看大片較深的海底區，與狹長海溝比較。',dont:'有海盆不一定代表有正在活動的隱沒帶。'},
 arc:{title:'島弧／火山弧｜Island arc',where:'臺灣東北的琉球島弧、臺灣南方延伸的呂宋火山島弧',process:'隱沒作用促使上覆地函局部熔融，岩漿上升，可形成弧形排列的火山島。',exam:'海溝與火山弧往往在地理上呈平行帶狀分布；弧位於隱沒板塊的上覆側。',dont:'島弧不等於中洋脊，兩者板塊運動方向不同。'},
 prism:{title:'增積岩體｜Accretionary prism',where:'馬尼拉海溝一帶、臺灣南方恆春海脊相關構造',process:'隱沒板塊帶來的沉積物，部分被刮起並擠皺、堆積成楔形岩體，像被推皺的地毯。',exam:'在海溝與陸地／島弧之間找複雜褶皺與逆斷層的楔形區。',dont:'不是「整塊沉積物都直接進入地函」；部分會被刮起。'},
 shelf:{title:'大陸棚｜Continental shelf',where:'臺灣海峽的多數海域屬相對淺的陸棚環境',process:'陸地向海延伸、坡度通常較緩的淺海地帶。',exam:'西部海域相對平坦、較淺；與臺灣東側急遽加深的海底坡地比較。',dont:'大陸棚是地形／地質概念，不表示海面上是陸地。'},
 slope:{title:'大陸坡｜Continental slope',where:'東臺灣近岸海底常向深海快速下降',process:'由較淺棚區或陸緣進入深海盆地的陡坡，常有海底峽谷切割。',exam:'海底剖面若深度短距離急增，常表示陸坡或斜坡。',dont:'大陸坡不是隱沒板塊本身；地形位置與構造機制要分開看。'},
 canyon:{title:'海底峽谷｜Submarine canyon',where:'臺灣東部岸外與西南海域可見多處峽谷系統',process:'沿海底坡地切割的狹長深槽，可將河流與陸棚沉積物輸往深海。',exam:'與狹長海溝不同，峽谷常沿坡面向下切割並通往更深海區。',dont:'海底峽谷不一定由板塊隱沒直接形成。'},
 ridge:{title:'中洋脊｜Mid-ocean ridge',where:'全球洋盆張裂邊界的代表地形；臺灣附近的主要聚合構造不應誤認為大洋中脊',process:'板塊分離、新洋殼生成，形成延續很長的海底山脈，伴隨玄武岩質岩漿活動。',exam:'看到新生地殼、兩側年齡與古地磁對稱，通常是中洋脊。',dont:'海溝為聚合，洋脊為張裂；別看到海底山就叫洋脊。'},
 forearc:{title:'弧前盆地／弧後盆地',where:'琉球系統：琉球海溝內側有弧前地區；沖繩海槽是琉球島弧後方張裂盆地',process:'以火山弧為界，朝海溝的一側稱弧前，另一側稱弧後。張裂可能使弧後區形成盆地。',exam:'先找「海溝—島弧」順序，才能判斷哪裡是弧前、哪裡是弧後。',dont:'海溝本身不是弧前盆地；弧後盆地也不等於海溝。'}
};
function showFeature(id){const d=featureData[id];if(!d)return;
 $$('#seaBtns .feature').forEach(b=>b.classList.toggle('active',b.dataset.feature===id));
 $('#seaInfo').innerHTML=`<h4>${d.title}</h4><dl><dt>臺灣例子</dt><dd>${d.where}</dd><dt>怎麼形成</dt><dd>${d.process}</dd><dt>考試先看</dt><dd>${d.exam}</dd><dt>最怕搞錯</dt><dd>${d.dont}</dd></dl>`;
}
$$('#seaBtns .feature').forEach(b=>b.addEventListener('click',()=>showFeature(b.dataset.feature)));
showFeature('trench');

const mechanismSteps=[
 {title:'① 海洋岩石圈為什麼比較容易下沉？',body:'海洋岩石圈形成後持續冷卻，厚度與平均密度會逐漸增加。板塊聚合時，部分較冷、較密的海洋岩石圈可以向下隱沒；不是單純「海水很重」或「海洋地殼比較薄」就決定一切。'},
 {title:'② 海溝不只是地上的裂縫',body:'板塊開始彎折下沉的位置附近形成深海溝；海底沉積物部分被刮起、褶皺並堆疊成增積岩體。你可以在立體圖左側看到海溝與被擠皺的沉積層。'},
 {title:'③ 地震能把隱沒板塊的方向畫出來',body:'隱沒板塊內可發生從淺到深的地震，震源沿傾斜帶排列，形成和達－貝尼奧夫帶。判圖時請沿著震源的「淺 → 深」方向，尋找板塊向哪一側下沉。'},
 {title:'④ 岩漿不是整個地函融成液體',body:'板塊隱沒時釋出的流體改變上覆地函楔的熔融條件，使局部岩石產生部分熔融，岩漿上升。地函的絕大部分仍然是固態，在地質時間尺度下能緩慢流變。'},
 {title:'⑤ 海溝、火山弧與造山各有位置',body:'火山弧通常在海溝內側、上覆板塊之上；當島弧與大陸邊緣進一步碰撞時，臺灣會發生強烈褶皺、逆衝斷層、隆升與變質作用，才逐漸形成山脈。'}
];
function showMechanism(i){let d=mechanismSteps[i];$$('#mechanismSteps .step').forEach(b=>b.classList.toggle('active',Number(b.dataset.step)===i));$('#mechanismInfo').innerHTML=`<h3>${d.title}</h3><p>${d.body}</p>`;}
$$('#mechanismSteps .step').forEach(b=>b.addEventListener('click',()=>showMechanism(Number(b.dataset.step))));
showMechanism(0);

const rockData=[
 {id:'granite',name:'花崗岩',type:'igneous',zone:0,local:'金門、馬祖（離島花崗岩／花崗質岩體）',observe:'顆粒粗，能看見多種淺色與黑色礦物',process:'岩漿在地下較慢冷卻形成，通常有石英、長石等明顯晶體。',clue:'粗顆粒、礦物鑲嵌；花崗質成分。',warning:'金門常見花崗片麻岩，不是把全島一律稱作未變質花崗岩。'},
 {id:'basalt',name:'玄武岩',type:'igneous',zone:0,local:'澎湖群島（火山岩地景）',observe:'顏色深、結晶細，部分帶氣孔',process:'偏鎂鐵質岩漿較快速冷卻，常形成細粒、深色的火山岩。',clue:'深色細粒、氣孔與澎湖柱狀節理的地景連結。',warning:'柱狀節理是岩體冷卻收縮產生的節理，不代表每塊樣本都有柱狀外形。'},
 {id:'andesite',name:'安山岩',type:'igneous',zone:8,local:'大屯火山群、龜山島；海岸山脈都蘭山層亦有火山岩',observe:'灰色、常見斑晶和較細的基質',process:'中性岩漿冷卻形成的火山岩，常在板塊隱沒相關火山弧出現。',clue:'斑狀組織，深淺灰色火山岩外觀。',warning:'安山岩並非只會出現在大屯；海岸山脈也具有島弧火山岩背景。'},
 {id:'peridotite',name:'橄欖岩',type:'igneous',zone:0,local:'地函主要岩石之一；臺灣東部局部超基性岩與蛇紋岩有地體關聯',observe:'粒狀、深綠或黑綠色，常富含橄欖石',process:'超基性岩，以橄欖石、輝石為主要成分，是認識上部地函物質的典型岩種。',clue:'偏綠色粗粒，不能與普通深色玄武岩直接混淆。',warning:'這裡是岩種標本教學，不表示此照片採自臺灣某一指定地點。'},
 {id:'conglomerate',name:'礫岩',type:'sedimentary',zone:2,local:'苗栗火炎山一帶（厚層礫岩與礫石地景）',observe:'有明顯大顆礫石，被細料膠結',process:'礫石經搬運、堆積與膠結形成，常反映相對較高能量的搬運／沉積環境。',clue:'大於 2 mm 的礫石顆粒，可見圓磨程度。',warning:'堆積環境要綜合層理、粒徑、圓磨度判斷，不能只憑一顆礫石斷言成因。'},
 {id:'sandstone',name:'砂岩',type:'sedimentary',zone:2,local:'野柳、苗栗等西部麓山帶沉積岩地層',observe:'砂粒組成，表面常帶顆粒感',process:'砂粒堆積後經壓密、膠結形成，常保留沉積層理。',clue:'能辨認砂粒或顆粒感，常有層理。',warning:'野柳的特殊外形多與差異侵蝕有關，不是所有砂岩都長得像蕈狀岩。'},
 {id:'shale',name:'頁岩',type:'sedimentary',zone:2,local:'西部麓山帶，例如新竹、苗栗的砂頁岩互層',observe:'細粒、層理或薄片狀裂理',process:'黏土與細粒沉積物堆積、壓密而成，通常比砂岩細。',clue:'泥質細粒，沿層面易裂開。',warning:'頁岩沿沉積層面裂開，和變質板岩的板理需分辨。'},
 {id:'slate',name:'板岩',type:'metamorphic',zone:4,local:'南投廬山、中央山脈西側板岩帶',observe:'細密、平坦的板理，常可裂成薄片',process:'泥質岩受較低度變質及定向壓力作用，形成板理。',clue:'常呈細密板狀劈理，與頁岩層理要分開。',warning:'僅靠一張照片可能無法判斷全部變質程度；需看礦物及片理。'},
 {id:'schist',name:'片岩',type:'metamorphic',zone:5,local:'花蓮太魯閣與中央山脈東翼變質岩帶',observe:'片狀礦物排列，常具閃光與明顯片理',process:'岩石在高溫壓力下重結晶，雲母等片狀礦物定向排列。',clue:'片理與片狀礦物，是比單純顏色更可靠的線索。',warning:'片岩有不同礦物組合，不是所有片岩都會閃亮。'},
 {id:'gneiss',name:'片麻岩',type:'metamorphic',zone:5,local:'花蓮太魯閣、南澳一帶變質雜岩',observe:'明暗礦物條帶清楚，常粗粒',process:'較高級變質條件下，不同礦物常重新分布成相間條帶。',clue:'明暗相間的片麻狀條帶。',warning:'片麻岩形成歷史可很複雜，不能把所有條帶都當作沉積層理。'},
 {id:'marble',name:'大理岩',type:'metamorphic',zone:5,local:'花蓮太魯閣峽谷（最經典的臺灣案例）',observe:'結晶質、常呈白或灰色，表面有晶粒感',process:'石灰岩或白雲岩經變質再結晶，可形成大理岩。',clue:'方解石類再結晶，沒有典型的碎屑砂粒。',warning:'「白色岩石」不一定都是大理岩，需結合組織與礦物辨識。'}
];
let currentFilter='all',searchText='';
function setRockFilter(f){currentFilter=f;$$('#rockFilters .filter').forEach(btn=>btn.classList.toggle('active',btn.dataset.filter===f));renderRocks();}
$$('#rockFilters .filter').forEach(btn=>btn.addEventListener('click',()=>setRockFilter(btn.dataset.filter)));
$('#rockSearch').addEventListener('input',e=>{searchText=e.target.value.trim().toLowerCase();renderRocks();});
function renderRocks(){
 const selected=rockData.filter(r=>(currentFilter==='all'||r.type===currentFilter)&&(!searchText||(r.name+r.local+r.observe+r.process).toLowerCase().includes(searchText)));
 $('#rockGrid').innerHTML=selected.map(r=>`<button type="button" class="rock-card" data-rock="${r.id}" aria-label="觀看${r.name}真實標本與臺灣相關產地"><img src="${imgBase}rock-${r.id}.webp" loading="lazy" alt="${r.name}實物岩石標本照片局部裁切"><span class="rock-body"><span class="rock-type">${{igneous:'🔥 火成岩',sedimentary:'🌊 沉積岩',metamorphic:'⛰ 變質岩'}[r.type]}</span><span class="rock-name">${r.name}</span><span class="rock-local">📍 ${r.local}</span><span class="rock-observe">👀 ${r.observe}</span><span class="more">點開看特徵與地質分區 ↗</span></span></button>`).join('')||'<p>沒有符合的標本，試著改用「花蓮」「礫岩」等搜尋。</p>';
 $$('#rockGrid [data-rock]').forEach(b=>b.addEventListener('click',()=>showRock(b.dataset.rock)));
}
function showRock(id){const r=rockData.find(x=>x.id===id);if(!r)return;
 const target=$('#rockDetail');target.hidden=false;
 target.innerHTML=`<div class="rock-detail-layout"><img src="${imgBase}rock-${r.id}.webp" alt="${r.name}標本實際照片"><div><h3>${r.name}｜實物照片細看</h3><p><b>眼睛先看到：</b>${r.observe}</p><p><b>它怎麼形成：</b>${r.process}</p><p><b>臺灣可見地點：</b>${r.local}</p><div class="rock-evidence">📌 <strong>判讀線索：</strong>${r.clue}<br>⚠️ <strong>常見誤會：</strong>${r.warning}</div><button type="button" id="rockBackMap">${r.zone?`在臺灣地質帶圖找相關區域 ${r.zone} ↗`:'離島或地函岩種，不以本島地質帶直接對應 ↗'}</button></div></div>`;
 $('#rockBackMap').addEventListener('click',()=>{setTab('geology');if(r.zone)renderRegion(r.zone);});
 target.scrollIntoView({behavior:'smooth',block:'nearest'});
}
renderRocks();

// Map/specimen comparison: intentionally not the full second mid-term exam, which must include Chapter 4.
const practice=[
 {img:'taiwan-zones.webp',q:'臺灣地質帶圖上，哪一帶最容易找到太魯閣的大理岩與片岩？',a:['1 西部海岸平原','2 西部麓山帶','5 大南澳變質岩帶','7 海岸山脈'],answer:2,why:'太魯閣位於中央山脈東翼的變質岩帶，片岩與大理岩是重要代表。'},
 {img:'taiwan-seafloor.webp',q:'臺灣東北側的「沖繩海槽」與「琉球海溝」，最重要的差別是？',a:['兩者都位於相同的隱沒起點','沖繩海槽是弧後張裂海盆，琉球海溝與隱沒有關','沖繩海槽在臺灣西南方','兩者都是海底山脈'],answer:1,why:'海溝通常是聚合隱沒形成的深海槽狀地形；沖繩海槽位於琉球島弧後方，是弧後張裂系統。'},
 {img:'rock-basalt.webp',q:'照片中深色細粒岩石與澎湖常見的柱狀節理地景，最可能對應哪一種岩石？',a:['花崗岩','玄武岩','大理岩','片岩'],answer:1,why:'澎湖以玄武岩地質著稱。玄武岩冷卻較快、細粒；柱狀節理則是較大岩體冷卻收縮形成的構造。'},
 {img:'subduction-3d.webp',q:'看立體隱沒圖：海溝旁被擠皺、堆疊成楔形的沉積岩體是什麼？',a:['大陸棚','增積岩體','中洋脊','地球內核'],answer:1,why:'隱沒板塊攜帶的沉積物部分被刮起與擠壓，形成增積岩體；不是全都進入地函。'},
 {img:'rock-slate.webp',q:'細粒岩石沿平行板理剝離，與臺灣廬山一帶相連，最可能是？',a:['板岩','玄武岩','礫岩','大理岩'],answer:0,why:'廬山板岩帶最經典的是變質泥質岩，板岩具有細密板理；頁岩的沉積層理並不等同於板理。'},
 {img:'taiwan-seafloor.webp',q:'臺灣海峽大部分海底較淺、坡度較緩；東臺灣近岸海底則常快速變深。哪個概念最適合解釋？',a:['兩側都只是中洋脊','海峽有較廣的淺海棚區，東側靠近活動陸緣深水坡地','兩側海域深度完全相同','東部全是無深海的沙洲'],answer:1,why:'臺灣西側有寬廣淺海地形；臺灣東側靠近活動造山帶與深水海盆，海底常較陡。'},
 {img:'rock-andesite.webp',q:'在大屯火山群與海岸山脈的島弧火山岩中，都能找到哪一類岩石代表？',a:['安山岩','板岩','大理岩','礫岩'],answer:0,why:'安山岩是中性成分火山岩，臺灣大屯火山群及海岸山脈都具有相關火山岩地質。'},
 {img:'taiwan-zones.webp',q:'花東縱谷最主要的地質意義是什麼？',a:['全線只有一種火成岩','中央山脈與海岸山脈之間的重要構造分界與斷層帶','玄武岩柱狀節理分布地','臺灣海峽的大陸棚延伸'],answer:1,why:'花東縱谷是中央山脈與海岸山脈間的構造帶，與板塊碰撞縫合、活動斷層有關。'}
];
let currentQ=0,correct=0,answered=false;
function showQuestion(i){const q=practice[i];answered=false;
 $('#practiceFigure').src=imgBase+q.img;$('#practiceFigure').alt='題目 '+(i+1)+' 判讀圖片';
 $('#practiceCount').textContent=`題目 ${i+1} / ${practice.length}`;$('#practiceScore').textContent=`目前答對 ${correct} 題`;
 $('#practiceQuestion').textContent=q.q;
 $('#practiceOptions').innerHTML=q.a.map((option,n)=>`<button class="practice-option" data-choice="${n}" type="button">${'ABCD'[n]}. ${option}</button>`).join('');
 $('#practiceFeedback').textContent='先觀察左側圖片，再選答案。';$('#practiceNext').textContent=i===practice.length-1?'重新練習 ↺':'下一題 →';
 $$('#practiceOptions .practice-option').forEach(b=>b.addEventListener('click',()=>answerQuestion(Number(b.dataset.choice))));
}
function answerQuestion(i){if(answered)return;answered=true;const q=practice[currentQ];if(q.answer===i)correct++;
 $$('#practiceOptions .practice-option').forEach(b=>{let n=Number(b.dataset.choice);b.disabled=true;if(n===q.answer)b.classList.add('ok');else if(n===i)b.classList.add('no');});
 $('#practiceScore').textContent=`目前答對 ${correct} 題`;
 $('#practiceFeedback').innerHTML=`<b>${q.answer===i?'✓ 答對！':'↗ 再觀察一次圖像線索。'}</b><p>${q.why}</p>`;
}
$('#practiceNext').addEventListener('click',()=>{if(currentQ===practice.length-1){currentQ=0;correct=0;}else currentQ++;showQuestion(currentQ);});
showQuestion(0);

// Local lightbox; no external dependencies, no dead links.
const zoomDlg=$('#zoomDialog');const zoomImg=$('#zoomImage');
$$('[data-zoom]').forEach(btn=>btn.addEventListener('click',()=>{const selector=btn.dataset.zoom;const el=$(selector);if(!el)return;zoomImg.src=el.currentSrc||el.src;zoomImg.alt=el.alt;try{zoomDlg.showModal();}catch(e){window.open(zoomImg.src,'_blank');}}));
$('.lightbox-close').addEventListener('click',()=>zoomDlg.close());
zoomDlg.addEventListener('click',e=>{if(e.target===zoomDlg)zoomDlg.close();});

const incoming=location.hash.slice(1);
if(['geology','seafloor','mechanism','specimens','practice'].includes(incoming)){setTab(incoming,false);window.addEventListener('load',()=>{try{$('#atlasNav').scrollIntoView({block:'start'});}catch(e){}},{once:true});}
window.addEventListener('hashchange',()=>{const key=location.hash.slice(1);if(['geology','seafloor','mechanism','specimens','practice'].includes(key))setTab(key,false);});
window.__atlasReady=true;
