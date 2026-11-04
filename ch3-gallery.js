/* v4.13｜第三章圖像教材。主圖為教學資訊圖，不取代實測圖；標本照片與地形底圖另行標示。 */
(function(){
'use strict';
const BASE='assets/chapter3/';
const figureSets={
 quake:{label:'01｜地震與地震波',topic:'地震波不是名詞表，是地下傳來的訊息',tease:'先認震源、震央、深度，再用 P/S 波做一個真正的推理。',items:[
  {title:'一張圖認識震源、震央與走時',src:BASE+'earthquake-evidence.svg',kind:'精確關係圖',look:'先找地下紅色震源和正上方藍色震央，再看右下方兩條到時線。',reason:'震源到測站的距離越大，兩種波的抵達時間通常都會增加，P−S 時差也變大。',ask:'只知道單一測站的 P−S 時差，可以直接指出震央在哪嗎？',answer:'不行。可以估算距離，但不知道方向；需要多站資料交會。',note:'走時曲線是定性示意，真實計算要用地震波速度模型。'},
  {title:'P、S 波為什麼能看出地球裡面？',src:BASE+'earth-quake.webp',kind:'名師圖卡局部',look:'看右側的 P（縱波）與 S（橫波）示意；尤其注意兩種波能否通過液體。',reason:'P 波能穿過固、液、氣體；S 波無法在流體中傳播剪力波，這是推論液態外核的關鍵之一。',ask:'S 波不見了，是否就能單憑一個測站判斷外核是液態？',answer:'不能靠單一測站；須綜合全球波到時、路徑及 P/S 波行為證據。',note:'此圖整理物理機制，波形不是實際地震儀紀錄。'},
  {title:'地震波如何連上地球內部',src:BASE+'earth-master.webp',kind:'全章橋接總覽',look:'先看地核，再看 P/S 波與分層方式，最後回到「我們怎麼知道」這個問題。',reason:'地震波穿過不同物質時會折射、改變速度；科學家用大量測站的紀錄反推地下分層。',ask:'「地震波快慢改變」與「外核液態」，哪個是觀測？哪個是推論？',answer:'波到時與波形是觀測；外核液態是綜合波的傳播特性與觀測得到的科學推論。',note:'視覺化地球剖面非地層比例圖；精確深度以文字與實測教材為準。'}]},
 interior:{label:'02｜地球的分層',topic:'人類挖不到地核，卻能用地震波「照 X 光」',tease:'一張剖面、一張分類比較表，再用地震波把兩者串起來。',items:[
  {title:'把整顆地球剖開',src:BASE+'earth-cutaway.webp',kind:'立體構造圖',look:'沿著中心看最外層的地殼、最厚的地函、液態外核與固態內核。',reason:'地殼與地函的化學組成不同；外核與內核則還涉及物質狀態差異。',ask:'地函裡有熱對流，是否代表整層地函都是液態岩漿？',answer:'不是。地函絕大部分為固態岩石，只是在地質時間尺度上能緩慢流動。',note:'藝術化高亮剖面非按深度或熔融比例繪製。'},
  {title:'兩種分層方式絕對不能混',src:BASE+'earth-methods.webp',kind:'易錯比較圖',look:'左邊看物質組成，右邊看物理力學性質；相同深度可在兩張圖裡有不同名稱。',reason:'岩石圈是地殼加最上部堅硬地函；它不是地殼的另一個名字。',ask:'同樣在海洋板塊中，地殼與岩石圈哪個範圍通常比較厚？',answer:'岩石圈；它包含海洋地殼與其下方較冷硬的最上部地函。',note:'不同版本的力學分層名稱可能略異；以學校課綱的分類為準。'},
  {title:'用 P、S 波辨認外核狀態',src:BASE+'earth-quake.webp',kind:'觀測證據圖',look:'看 P 波、S 波的穿透能力，注意液體與固體的差異。',reason:'S 波不能穿過液態外核，P 波則在核幔邊界改變速度與路徑。',ask:'推知外核為液態的最直接線索之一是什麼？',answer:'全球地震波資料中的 S 波陰影與 P 波路徑、速度變化。',note:'圖片波形為原理示意，不是單次地震的實測紀錄。'}]},
 rocks:{label:'03｜岩石種類與循環',topic:'先看真實岩石，再判讀它的形成故事',tease:'火成岩看晶體、沉積岩看層理、變質岩看片理；岩石循環可以走不同路。',items:[
  {title:'岩石三大類的形成脈絡',src:BASE+'rock-master.webp',kind:'總覽教學資訊圖',look:'先從火成岩、沉積岩、變質岩的成因出發，再看中間的循環箭頭。',reason:'岩石在不同環境下可能被風化、沉積、埋藏變質或熔融，不必照固定順序循環。',ask:'變質岩一定要先變成岩漿，才能形成火成岩嗎？',answer:'若要變成火成岩需要先熔融成岩漿再冷卻；但變質岩也能先風化形成沉積物，轉成沉積岩，不是必經岩漿。',note:'主圖中的岩石形象是視覺化示例，真實標本請切換下一張。'},
  {title:'真正的岩石：照片看紋理',photos:[['assets/atlas/rock-granite.webp','花崗岩｜粗粒晶體','金門、馬祖等'],['assets/atlas/rock-basalt.webp','玄武岩｜細粒與氣孔','澎湖玄武岩群'],['assets/atlas/rock-sandstone.webp','砂岩｜砂粒、層理','西部麓山帶'],['assets/atlas/rock-conglomerate.webp','礫岩｜可見礫石','苗栗火炎山'],['assets/atlas/rock-slate.webp','板岩｜劈理清楚','中央山脈部分區域'],['assets/atlas/rock-marble.webp','大理岩｜重結晶','太魯閣地區']],kind:'教材實物照片',look:'先放大看「晶體」「顆粒」「層理」「片理」，不要只看顏色。',reason:'照片是實物標本的外觀示例；括號中的臺灣地點是可見相似岩石的區域，照片不保證取自該處。',ask:'怎麼分辨片岩的片理與砂岩的層理？',answer:'片理多為變質時礦物定向排列；層理多為沉積環境中逐層堆積留下的結構。',note:'照片來自你提供的教材裁切；標示地點是產出或典型露頭區，不代表照片採集點。'},
  {title:'岩石循環：每條箭頭代表哪一種作用',src:BASE+'rock-cycle.webp',kind:'作用流程放大',look:'逐條追「冷卻」「風化／侵蝕」「沉積／膠結」「變質」「熔融」等箭頭。',reason:'岩石循環是多條可能路徑，無論起始岩類如何，都可能因外營力或內營力走不同方向。',ask:'花崗岩能否直接變成變質岩？',answer:'可以。若受到足夠的高溫與壓力，即使沒有先變成沉積物，也可能轉為變質岩。',note:'圖片為路徑示意，不表示所有岩石必須依序通過全部階段。'},
  {title:'把岩石放回臺灣地理位置',src:'assets/atlas/rock-localities.webp',kind:'臺灣岩石位置圖',look:'找澎湖、金門、馬祖、太魯閣、廬山、火炎山與海岸山脈。',reason:'岩石類型分布反映臺灣本島的造山與變質史、島弧火山作用，也包括離島的不同地質成因。',ask:'「北部出火成岩」就能斷定全臺其他地區沒有火成岩嗎？',answer:'不能。簡化口訣不是排他性分區；例如東部海岸山脈也有島弧火山岩。',note:'地點圖為教學位置參照，具體岩性與地層界線需查官方地質圖。',atlas:'specimens'}]},
 drift:{label:'04｜大陸漂移與海底擴張',topic:'韋格納只有線索；海底擴張才補上機制',tease:'把「拼圖」「化石」「海床年齡」「古地磁」串成同一場科學推理。',items:[
  {title:'中洋脊向兩側形成新海底',src:BASE+'seafloor-evidence.svg',kind:'證據導向圖',look:'看中洋脊最年輕、兩側海底越遠越老，再看磁性條帶近似對稱。',reason:'新地殼在中洋脊形成，隨板塊往兩側移動；磁極反轉紀錄隨岩石冷卻留下近似對稱的條帶。',ask:'同一中洋脊兩側，相距脊軸相同的位置海底年齡是否總是完全相同？',answer:'理想對稱擴張模型下相近；真實海床可能受擴張速率變化與斷層位移影響，不應機械假設完全相同。',note:'磁條帶為定性教學示意，沒有套用任何實測年代或擴張速率。'},
  {title:'海底真的有中洋脊',src:'assets/ridge.webp',kind:'海底景觀',look:'先找到隆起的中洋脊，再想像剖面中心持續形成新洋殼。',reason:'中洋脊常伴隨張裂、熱流異常、玄武岩質火山活動與淺源地震。',ask:'中洋脊和海溝是一樣的地形嗎？',answer:'不一樣。中洋脊通常在張裂邊界，海溝多與隱沒帶有關。',note:'為輔助想像的藝術性圖片，實際位置需看海床地形與測線。'},
  {title:'最後如何統整到板塊構造',src:BASE+'plate-boundaries.webp',kind:'三種運動方式',look:'找張裂、聚合與錯動；只看運動方向，想它可能留下什麼地形。',reason:'海底擴張解釋海床如何生成，隱沒解釋海洋岩石圈如何返回地函；板塊邊界不只有張裂。',ask:'海底擴張若一直形成新地殼，地球半徑為什麼沒有持續增大？',answer:'因為地球其他區域的聚合／隱沒可讓老的海洋岩石圈返回地函。',note:'示意圖幫助辨識機制，不能以其海陸地形比例當作測量資料。'}]},
 plate:{label:'05｜板塊邊界與隱沒帶',topic:'板塊一接觸，海底和地面就換了模樣',tease:'看清海溝、增積岩體、火山弧、震源帶，不再只背三種邊界的名字。',items:[
  {title:'五秒看懂拉開、撞上與錯過',src:BASE+'plate-boundaries.webp',kind:'三邊界對照',look:'先看白色箭頭的相對運動，再找中洋脊、火山弧、斷層。',reason:'張裂形成新洋殼；聚合可能造成隱沒或碰撞造山；錯動以水平滑移和淺源地震為主。',ask:'所有火山都位在板塊邊界嗎？',answer:'不是。熱點型火山（如夏威夷）可以位在板塊內部。',note:'不同邊界的剖面為原理示意，非按比例繪圖。'},
  {title:'立體隱沒帶：海溝到火山弧',src:'assets/atlas/subduction-3d.webp',kind:'立體機制藝術示意',look:'從海向陸依序看海溝、增積岩體、隱沒板塊、地震帶與火山弧。',reason:'隱沒板塊釋出流體促進上覆地函局部熔融，與火山弧形成有關；深淺震帶沿下沉板塊分布。',ask:'「海溝下方整片地函都是液態岩漿」對嗎？',answer:'錯。多數地函是固態，只有特定環境的局部熔融與岩漿上升。',note:'強光、發光岩漿為藝術視覺，不能視為真實熔融範圍。'},
  {title:'沿地震深度找到隱沒方向',src:BASE+'plate-seismic-depth.webp',kind:'段考判圖重點',look:'由淺震的位置沿著震源帶移向深震的位置，判斷板塊向哪側下沉。',reason:'淺到深的傾斜地震分布與隱沒板塊幾何關係密切，但需配合地形及板塊資料判定。',ask:'海溝附近的淺震很密集，能否直接斷定該區沒有中深源地震？',answer:'不能。中、深源震可能分布在隱沒板塊深入地函的區段，需看更大剖面範圍。',note:'圖內深度帶屬教學概念；地震分類與正式地震目錄統計須用實測資料。'},
  {title:'整體看板塊互動的結果',src:BASE+'plate-master.webp',kind:'總覽與易錯整理',look:'檢查張裂、聚合、錯動，以及海洋–大陸、海洋–海洋、大陸–大陸三種聚合的地形。',reason:'同樣是聚合，兩塊大陸碰撞以擠壓增厚、抬升為主，海洋板塊下沉則可能有海溝與火山弧。',ask:'把臺灣完全當成「兩塊大陸板塊碰撞」的典型例子正確嗎？',answer:'不精確。臺灣主要有菲律賓海板塊呂宋島弧與歐亞大陸邊緣的弧陸碰撞，以及南北不同的隱沒系統。',note:'部分主圖以生活比喻簡化機制，臺灣應以弧陸碰撞與隱沒的區域解說為準。'}]},
 taiwan:{label:'06｜臺灣地質與周邊海底',topic:'把岩石、海溝、海槽、板塊活動疊在同一座島上',tease:'先認識真實地圖，再讀總覽圖，最後從海底剖面解釋臺灣高山。',items:[
  {title:'可對照地理位置的臺灣地質帶',src:'assets/atlas/taiwan-zones.webp',kind:'地質帶位置圖',look:'由西往東認平原、麓山、雪山與中央山脈、縱谷和海岸山脈。',reason:'不同地質帶的岩性、地質年代與變形程度不同，反映長期的沉積、造山與變質歷史。',ask:'圖上的地質帶邊界可以直接拿來判斷工程地質界線嗎？',answer:'不行。這是高中概化分區；精細地層界線、構造與地質圖幅應查官方地質雲。',note:'概化分區有實際海岸線，地質邊界為教學示意。',atlas:'geology'},
  {title:'把臺灣地質帶講成一張完整故事圖',src:BASE+'taiwan-master.webp',kind:'名師總覽圖',look:'先看島上的地質帶，再對照東北的琉球海溝、沖繩海槽與南方馬尼拉海溝。',reason:'臺灣是造山帶，周邊海域同時存在隱沒、島弧和弧後張裂系統；不能用單一板塊剖面解釋全部。',ask:'「沖繩海槽就是琉球海溝」對嗎？',answer:'不對。琉球海溝位於隱沒帶；沖繩海槽是琉球島弧後方的弧後張裂海槽。',note:'主圖為教學概化；經緯度與海底構造位置請切換實際地形底圖。'},
  {title:'真實海底地形：海溝與海槽分開看',src:'assets/atlas/taiwan-seafloor.webp',kind:'地形底圖',look:'找臺灣東北的琉球海溝、沖繩海槽，與西南方馬尼拉海溝，核對相對方位。',reason:'海溝通常與隱沒帶相連；沖繩海槽則與弧後張裂有關。兩者不只名詞不同，形成機制也不同。',ask:'沿島弧後方伸展形成的狹長海底地形，比較可能是海溝還是海槽？',answer:'弧後張裂形成的通常為海槽；隱沒板塊彎折下沉的深長地形常為海溝。',note:'以地形資料製作的概覽底圖；構造線為教學提示，非精密測線。',atlas:'seafloor'},
  {title:'臺灣怎麼長出高山？',src:BASE+'taiwan-crosssection.webp',kind:'碰撞造山剖面',look:'看板塊擠壓、岩層褶皺與抬升，再對照中央山脈、花東縱谷和海岸山脈。',reason:'臺灣造山涉及呂宋島弧與歐亞大陸邊緣碰撞，伴隨岩層變形、抬升與侵蝕。',ask:'「臺灣很高的山，是一排板塊隱沒帶火山長成的」對嗎？',answer:'不對。臺灣中央山脈主要涉及擠壓、增厚與抬升造山，不能與一般火山弧混為一談。',note:'剖面為教學概念，北／中／南部構造差異請參照更精細的研究圖。',atlas:'mechanism'}]}
};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const lensBtn=(x,i)=>`<button type="button" class="ch3-lens ${i===0?'active':''}" data-ch3-lens="${i}" aria-pressed="${i===0?'true':'false'}"><span class="ch3-lens-n">${String(i+1).padStart(2,'0')}</span><span>${esc(x.title)}</span></button>`;
function photoGroup(photos){return `<div class="ch3-real-rocks">${photos.map(p=>`<figure><img loading="lazy" src="${p[0]}" alt="${esc(p[1])}的岩石實物標本示例"><figcaption><strong>${esc(p[1])}</strong><small>${esc(p[2])}</small></figcaption></figure>`).join('')}</div>`;}
function viewerMedia(x){return x.photos?photoGroup(x.photos):`<img class="ch3-media-img" loading="lazy" src="${x.src}" alt="${esc(x.title)}，詳細觀察重點見右側教學指引">`;}
function info(x){return `<div class="ch3-facts"><div><span class="ch3-pill">👁 先看線索</span><p>${esc(x.look)}</p></div><div><span class="ch3-pill">💡 再推原因</span><p>${esc(x.reason)}</p></div><div class="ch3-quiz"><span class="ch3-pill">🎯 老師變化題</span><p>${esc(x.ask)}</p><button class="ch3-reveal" type="button" aria-expanded="false">揭曉答案與推理</button><p class="ch3-answer" hidden>${esc(x.answer)}</p></div></div>`;}
function renderCh3Visual(unitId){const d=figureSets[unitId];if(!d)return '';
 const x=d.items[0];return `<section class="ch3-visual-section" id="ch3-visual-${unitId}">
  <div class="ch3-titlebar"><span class="ch3-flag">VISUAL MASTERCLASS · 第三章圖像學堂</span><h2>${esc(d.topic)}</h2><p>${esc(d.tease)}</p></div>
  <div class="ch3-visual-frame" data-ch3-unit="${unitId}">
   <div class="ch3-toolbar"><span>目前正在看</span><strong class="ch3-current">${esc(x.title)}</strong><span class="ch3-media-type">${esc(x.kind)}</span></div>
   <div class="ch3-viewer"><div class="ch3-image-well"><div class="ch3-media">${viewerMedia(x)}</div><div class="ch3-magnify"><button class="ch3-zoom" type="button">⛶ 放大圖卡</button><span>可放大閱讀中文標註</span></div></div><div class="ch3-explanation">${info(x)}<p class="ch3-footnote">${esc(x.note)}</p>${x.atlas?`<button type="button" class="ch3-atlas-link" data-ch3-atlas="${x.atlas}">🗺️ 進入臺灣地質圖鑑的對應模組</button>`:''}</div></div>
   <nav class="ch3-lenses" aria-label="${esc(d.label)}切換其他圖解">${d.items.map(lensBtn).join('')}</nav>
  </div>
  <div class="ch3-viewer-footer"><span>這一組有 ${d.items.length} 張不同的圖像教學。主圖的藝術化標示不能代替數據判讀。</span><button class="ch3-hublink" type="button" data-ch3-hub>查看第三章完整圖像地圖 →</button></div>
 </section>`;}
function mountCh3Visual(unitId){const frame=document.querySelector(`[data-ch3-unit="${unitId}"]`);const d=figureSets[unitId];if(!frame||!d)return;
 function load(i){const x=d.items[i];frame.querySelector('.ch3-current').textContent=x.title;frame.querySelector('.ch3-media-type').textContent=x.kind;
 frame.querySelector('.ch3-media').innerHTML=viewerMedia(x);
 frame.querySelector('.ch3-explanation').innerHTML=info(x)+`<p class="ch3-footnote">${esc(x.note)}</p>`+(x.atlas?`<button class="ch3-atlas-link" type="button" data-ch3-atlas="${x.atlas}">🗺️ 進入臺灣地質圖鑑的對應模組</button>`:'');
 frame.querySelectorAll('[data-ch3-lens]').forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-pressed',String(j===i))});
 bindLocal();
 }
 function bindLocal(){const b=frame.querySelector('.ch3-reveal');if(b)b.onclick=()=>{let a=frame.querySelector('.ch3-answer');a.hidden=!a.hidden;b.setAttribute('aria-expanded',String(!a.hidden));b.textContent=a.hidden?'揭曉答案與推理':'收起答案';};
 const a=frame.querySelector('[data-ch3-atlas]');if(a)a.onclick=()=>{if(typeof go==='function')go('atlas',a.dataset.ch3Atlas);};}
 frame.querySelectorAll('[data-ch3-lens]').forEach(b=>b.onclick=()=>load(Number(b.dataset.ch3Lens)));
 frame.querySelector('.ch3-zoom').onclick=()=>openZoom(frame.querySelector('.ch3-media'));
 bindLocal();}
function openZoom(media){if(!media)return;const dlg=document.getElementById('ch3ZoomDialog');if(!dlg)return;const inside=dlg.querySelector('.ch3-zoom-inner');inside.innerHTML=media.innerHTML;inside.querySelectorAll('img').forEach(im=>im.loading='eager');try{dlg.showModal()}catch{dlg.setAttribute('open','')} }
function renderCh3GalleryHome(){return `<div class="ch3-hero"><span>CHAPTER 03 · VISUAL MASTERCLASS</span><h1>第三章｜一眼記住地球的故事</h1><p>這不是把四張海報放在同一頁。先選你最想破解的問題，進入後可切換局部放大、真實標本、科學證據和判讀題。</p><div class="ch3-hub-grid">${['quake','interior','rocks','drift','plate','taiwan'].map(id=>{const d=figureSets[id];let im=d.items[0].photos?BASE+'rock-master.webp':d.items[0].src;return `<button type="button" class="ch3-hub-card" data-unit="${id}"><img loading="lazy" src="${im}" alt="${esc(d.label)}教學圖"><span><b>${esc(d.label)}</b><small>${d.items.length} 張／組圖像　→</small></span></button>`;}).join('')}</div><p class="ch3-hub-note">重要：圖卡以教學視覺化與觀念歸納為主，原始地理位置、岩石標本及精確數據以網站的真實地形底圖、標本照片與可互動資料為準。</p><button class="ch3-hubback" type="button" data-view="home">← 回章節首頁</button></div>`;}
window.renderCh3Visual=renderCh3Visual;
window.mountCh3Visual=mountCh3Visual;
window.renderCh3GalleryHome=renderCh3GalleryHome;
window.CH3_FIGURE_SETS=figureSets;
})();
