/* v4.9：38 個「用圖理解」概念入口。所有素材在本機執行，無外部圖片依賴。 */
'use strict';
// 每項依照 content.js 同單元 concepts 順序：所對應的互動實驗頁籤、觀察指令、因果解釋、辨認題、參考解答。
const CONCEPT_GUIDES = {
quake:[
 ['focus','拖動「震源深度」，先找地下發光點，再找地表藍點。注意兩點是否必須在同一條垂直線？','地下破裂釋放能量處叫震源，垂直投影到地面的位置才叫震央；海面和山谷都不影響這個定義。','新聞說震央在花蓮，是否代表岩石在花蓮地表破裂？','不一定。震央只是震源在地表的投影；地下才是真正破裂處。'],
 ['focus','把震源由 20 公里拖到 120 公里，再拖到 400 公里，注意深度分類的文字如何改變。','震源深度是由震源向上量到地表的垂直距離；在中央氣象署的分類中，極淺層 0–30、淺層 30–70、中層 70–300、深層 300–700 公里。','兩次地震規模相同，深度 20 與 200 公里，就一定前者震度較大嗎？','不一定。震源深度會影響地表震度，但距離、破裂特性、地質條件等也有影響。'],
 ['wave','切到 P/S 波動，先盯著藍色粒子沿前進方向推擠，再比橘色粒子上下擺動。','P 是壓縮波，粒子振動平行波的傳播方向；S 是剪力波，粒子振動垂直傳播方向。地震波把能量送出去，不是整塊岩石一路從震源移過來。','橫波 S 波是不是一定向地球右側傳？','不是。「橫」描述的是粒子振動與傳播方向垂直，不是固定向左或向右。'],
 ['wave','把 P 波與 S 波兩條粒子列看成先後通過的能量，再回想地表實際的上下、左右、前後搖晃。','表面波沿地表附近傳播，某些表面波會使地表粒子呈橢圓或水平剪切運動；地表破壞不能簡單用「P 波或 S 波誰先到」判斷。','地震破壞一定由 S 波造成，和表面波無關嗎？','不對。表面波常在強烈地表搖晃與建物破壞中扮演重要角色。'],
 ['travel','在 P−S 走時圖把測站拉遠，找同一個距離上的 P 線與 S 線；比較兩個到達時間的垂直差。','P 波速度較快，離震源越遠累積的領先時間通常越大；單站由時差只能估「離多遠」，無法直接知道震央在哪個方向。','P−S 到時差比較大的測站，代表地震規模一定比較大嗎？','不是。相同速度模型下，P−S 時差主要反映震源距離，不是規模直接指標。'],
 ['locate','按「多看一站」依序畫出 A、B、C 三個測站的距離圓，觀察交點如何從多種可能縮成一處。','每站由走時推估一個距離；地圖上圓圈是可能震央位置，兩圓常有兩個交點，第三站有助消除歧義。','只靠一個測站的 P−S 時差，能確定震央在測站東邊嗎？','不能，還需要其他測站的距離資訊。']
],
interior:[
 ['chem','先點「依成分分層」，再切「依力學性質分層」，觀察同一個地球怎麼被劃成兩套不同的層。','成分分層問「是什麼物質」；力學分層問「冷硬或易流變」。岩石圈跨越地殼與地函上部，所以不能把兩個名稱畫上等號。','岩石圈只包含地殼，沒有地函的一部分嗎？','錯。岩石圈包括地殼及最上部堅硬的地函。'],
 ['speed','切到波速曲線，注意地表附近的 P、S 波速如何改變；再切回成分分層確認分界的上下層。','地殼與地函的主要分界是莫氏不連續面；地震波速在此通常增加。海洋地殼較薄，大陸地殼較厚，莫氏面深度不一。','「莫氏面是地殼與岩石圈的分界」對不對？','不對。莫氏面分開地殼與地函，不是整個岩石圈底界。'],
 ['speed','在速度圖找 2,900 公里附近波速明顯轉折；比較 P 波降速與 S 波後來不再傳遞的現象。','地函—外核交界稱古氏不連續面。由岩石進入液態外核後，剪力波無法穿過；P 波也發生明顯折射與速度改變。','只要在某層收不到 S 波，就可以直接認定那裡是真空嗎？','不能。液態外核就會讓剪力波無法通過；還要配合其他地震波證據判讀。'],
 ['chem','觀察地球切面最內部的黃色內核，再到波速圖找約 5,150 公里深度的界面。','高壓讓以鐵、鎳為主的內核保持固態；外核則是液態。兩者物態不同，雖然都屬地核。','外核與內核都由金屬構成，所以都一定是液體嗎？','不對。外核為液態，內核主要為固態。'],
 ['mech','在力學分層頁籤先找到冷硬的岩石圈，再看它下方更容易長時間變形的區域。','岩石圈是一整塊可運動的堅硬板塊；軟流圈多為固態、在地質時間尺度下會緩慢變形，不是充滿液態岩漿的海洋。','「板塊浮在一大盆完全液態岩漿上」是好的地球剖面嗎？','不是。軟流圈主要是固態岩石，具長時間尺度的可流變性。'],
 ['crust','切換「海洋／大陸地殼」，比較厚度與材料；刻意把「地殼厚度」和「岩石密度」分開看。','海洋地殼較薄、平均密度較大，以玄武質材料為主；大陸地殼一般較厚、平均密度較小。隱沒還要考慮整塊岩石圈的冷卻與浮力。','海洋地殼厚度較小，就能推論它密度一定較小嗎？','不能。厚度與密度是不同物理量；海洋地殼通常較薄但密度較大。']
],
rocks:[
 ['samples','先選一個粗粒結晶的火成岩標本，再和細粒或多氣孔的標本比較。','岩漿在地底慢冷有較長結晶時間，常形成較粗大晶體；靠近地表快冷較容易形成細粒、玻璃質或氣孔，但岩漿化學成分也是辨認岩種的重要依據。','花崗岩和玄武岩的所有差異，都只是冷卻速度不同嗎？','不對。花崗岩與玄武岩的礦物成分及二氧化矽含量也不同。'],
 ['grain','在「沉積粒徑」中沿著礫→砂→粉砂→黏土看顆粒變小，聯想溪流搬運與海底沉積。','碎屑岩由舊岩石經風化侵蝕、搬運沉積，再壓密與膠結形成；生物及化學作用也能產生沉積岩，別把所有沉積岩都當砂堆。','有化石、有層理的岩石，通常應先想到哪類？','優先考慮沉積岩，因為化石保存與沉積層理都常見於沉積過程。'],
 ['samples','比較呈現定向紋理或片狀構造的標本；再回想它經歷了怎樣的高溫高壓。','變質作用可讓礦物重結晶或定向排列，不需先完全融化。片理通常與定向壓力和礦物重新排列有關。','有片理的變質岩，一定是由砂岩變成的嗎？','不是。多種原岩都可能在變質作用下產生片理。'],
 ['samples','在標本模擬中選粗粒火成岩與細粒火成岩，問自己：晶體大小和岩石顏色是哪兩種線索？','晶體粗細主要與冷卻條件有關；顏色受礦物組成影響，兩條分類線要分開看，不能用白色直接判斷深成。','「顏色淺」能直接確定某岩石是在地下慢冷形成的嗎？','不能。顏色偏向成分線索，晶粒大小才較接近冷卻條件線索。'],
 ['grain','看四種碎屑粒徑的圖，依「礫最大、砂中間、粉砂及黏土更細」建立視覺尺。','粒徑提供沉積作用線索，但流速、搬運距離與沉積環境還需搭配淘選、圓磨度等共同判讀。','砂粒通常比礫石更大嗎？','不對，礫石顆粒大於砂粒。'],
 ['cycle','在岩石循環按「風化沉積」「高溫高壓」「熔融」「冷卻」，嘗試從同一種岩石出發走不同路線。','岩石循環的箭頭代表地質過程，不是規定必須照一個順序輪流轉。火成岩可以先變沉積岩，也可直接變質，變質岩同樣可能熔融。','岩石一定按火成岩→沉積岩→變質岩→岩漿循環，不能跳步嗎？','不對。不同作用可以改變岩石轉變路徑。']
],
drift:[
 ['puzzle','看看兩塊大陸外形是否像拼圖，接著想想：除了形狀，還能蒐集哪些相同的岩層或化石？','韋格納從海岸線、化石、岩層、古冰川與古氣候整理出大陸曾相連的證據，但當時無法令人信服地提出移動機制。','大陸漂移說從一開始就因為有完整動力機制而被全面接受嗎？','不是。缺乏可信機制是早期的重要質疑。'],
 ['stripe','切到磁條帶頁，先看中洋脊中央新形成的海底，再往左右追蹤已生成的岩層。','中洋脊附近板塊張裂、地函物質上升，玄武質岩漿凝固形成新海洋地殼；舊海底逐漸離開脊軸。','同一洋盆中洋脊附近通常比較老，還是比較年輕？','通常比較年輕，越遠離擴張中心的海床越老。'],
 ['stripe','找顏色交錯的條帶，想像磁場每隔一段時間反轉，凝固的玄武岩會記錄當時磁場方向。','地磁正、反轉紀錄會在脊軸兩側呈大致鏡像對稱；配合測年的海床年齡是海底擴張的重要證據。','磁條帶左右對稱，通常支持哪一個機制？','支持海底由中洋脊向兩側擴張。'],
 ['puzzle','先從拼圖證據想到「大陸會動」，再回到磁條帶圖想到「海底也會生成與移動」。','板塊包括岩石圈的海洋與大陸部分；大陸不是在固定海底上單獨滑動，而是隨板塊一起移動。','板塊只能由大陸地殼組成嗎？','不能。板塊是岩石圈的一部分，可含海洋及大陸地殼。'],
 ['stripe','中洋脊為對稱軸，看左右條帶排列順序；不是只看一條帶的顏色是否相同。','因磁場反轉時序對兩側共同作用，若擴張相近，地磁條帶從中軸往外的順序大致對稱；近軸最年輕。','判讀地磁對稱條帶時，最重要的軸線通常是哪裡？','中洋脊的擴張軸線。'],
 ['speed','進入速率圖：同樣 120 km 的距離，若經過 300 萬年，先算單側速率，再分辨是否要把兩側合計。','速率＝距離÷時間。1 km/百萬年＝0.1 cm/年。題目寫單側與兩側相對張開，答案通常差一倍。','若單側 100 km、經過 200 萬年，單側速率是多少？','100 km÷200 萬年＝5 cm／年。']
],
plate:[
 ['div','看兩個板塊箭頭朝相反方向離開、中央岩漿上升，觀察中洋脊所在的位置。','張裂讓地函減壓、部分熔融並形成新的海洋地殼；海底有中洋脊，大陸上可能形成裂谷，地震多偏淺。','張裂型邊界最典型的海底地形是海溝嗎？','不是，海底張裂的代表是中洋脊。'],
 ['sub','選「洋－陸聚合」，看海溝、向下彎曲的海洋板塊、火山弧與深淺地震位置。','較冷且負浮力較強的海洋岩石圈隱沒，讓上覆地函楔受水影響產生熔融，於大陸邊緣形成火山弧。','聚合型隱沒帶的岩漿，都是整塊下沉板塊直接融化嗎？','通常不是；水進入上覆地函楔、促進部分熔融非常重要。'],
 ['island','改選「洋－洋聚合」，找看起來同樣的海溝，但火山改長在哪一塊海洋板塊上。','其中一塊海洋岩石圈隱沒，島弧火山在上覆板塊形成，震源也可能沿著隱沒板塊向下排列。','海洋板塊和海洋板塊碰撞，也能產生火山島弧嗎？','可以，例如馬里亞納系統。'],
 ['collide','選「陸－陸碰撞」，比較沒有長串下沉海洋板塊時，地表岩層如何被擠皺變厚。','兩側大陸岩石圈浮力較大，碰撞常造成地殼增厚、褶皺與巨大山脈；喜馬拉雅山是代表例子。','高山就一定是因為火山噴發堆起來嗎？','不對。陸－陸碰撞可以擠壓抬升出巨大山脈。'],
 ['transform','切換「錯動」，沿斷層看兩側箭頭沿水平方向相對滑移；留意斷層附近地震。','平移邊界通常不大量創造或消耗地殼，但斷層鎖定、累積應力後突然滑動，仍可能有強烈淺源地震。','錯動型板塊邊界因沒有隱沒就不會地震嗎？','錯。平移斷層正是常見的淺源地震來源。'],
 ['hotspot','切到「熱點」，沿火山鏈找最年輕與最老火山的位置。','熱點與板塊相對運動可以留下由新到老的火山鏈；這一類火山活動不必發生在板塊邊界。','「所有火山都在板塊交界」能解釋夏威夷嗎？','不能；夏威夷是典型板塊內熱點火山鏈。'],
 ['sub','在洋－陸聚合圖，先觀察下沉的整塊板塊，而不只看上面薄薄的海洋地殼。','海洋岩石圈遠離中洋脊後冷卻、增厚；其平均密度與浮力條件改變，較可能在聚合邊界隱沒。','「海洋地殼比大陸地殼薄，所以海洋板塊比較會隱沒」是充分解釋嗎？','不是。要看整個海洋岩石圈的密度、溫度、年齡與構造。'],
 ['sub','沿下沉板塊上的黃色震源點由淺到深依序連起來，看看整條線朝哪邊傾斜。','這條斜向震源帶稱隱沒帶中的瓦達蒂—班尼奧夫帶。淺震靠海溝，往板塊隱沒方向可能出現較深的地震。','震源從左側淺逐漸變成右側深，隱沒方向可能往哪邊？','推論板塊朝右側下傾隱沒。']
],
taiwan:[
 ['north','選「北部」，先看臺灣東北外海琉球海溝一帶，找向北隱沒的海洋板塊。','東北臺灣附近菲律賓海板塊向北隱沒；沖繩海槽張裂與大屯、龜山島等火山活動呈複雜關係。','臺灣北部與南部的板塊隱沒方向一模一樣嗎？','不一樣。北側琉球與南側馬尼拉是不同隱沒系統。'],
 ['south','切到「南部」，看臺灣南方馬尼拉海溝的位置與下沉的板塊方向。','臺灣南方歐亞板塊海洋部分向東隱沒在菲律賓海板塊之下，與北部琉球系統方向不同。','馬尼拉海溝主要是哪個板塊的海洋部分隱沒？','歐亞板塊的海洋部分，向東隱沒到菲律賓海板塊之下。'],
 ['middle','切到「中部」，注意兩側碰撞如何造成地殼增厚和山脈。','呂宋島弧與歐亞大陸邊緣碰撞擠壓，形成臺灣造山；花東縱谷一帶是重要縫合帶。','中央山脈主要是河流把地面堆得越來越高嗎？','不是。板塊碰撞與造山抬升才是主要原因。'],
 ['rocks','切換到「岩石區」看看西部、中部與東部的分布，分別聯想沉積、變質與火山岩的形成。','中央山脈常見變質岩，西部麓山帶與平原沉積岩重要，海岸山脈火山岩及沉積岩常見；這是教學簡化，區域有例外。','臺灣全島的岩石都屬於變質岩嗎？','不是。西部有廣泛沉積岩，東部和北部也有火成岩。'],
 ['north','從北部切到中部再切到南部，體會不同構造環境的震源深度與地震型態不完全一樣。','不同隱沒幾何、碰撞帶與活動斷層造成不同深度和空間分布；解析真正的震源深度圖必須配合測站資料。','震央都在臺灣附近，就能說震源深度一定相同嗎？','不能。位置、板塊構造與震源深度是不同資訊。'],
 ['north','北部圖先找隱沒作用，再想沖繩海槽後弧張裂，理解火山不一定只會在一個簡單海溝正上方。','北臺灣火山與琉球隱沒、後弧伸張等複雜地球動力條件有關，不能畫成整個臺灣都坐在同一條火山弧上。','「整個臺灣都在同一條單純的火山弧上」是合理概括嗎？','不合理。臺灣各區的板塊構造差異很大。']
]
};
const GUIDE_STAGES=[['👀','先看線索','先不要背名詞，請用眼睛在圖上找到指定的線索。'],['💡','再推原因','看完現象，把剛才看到的圖接回正式知識與因果。'],['🎯','一題收束','換一種問法，你能不能自己判斷？']];
let guideState={unit:null,index:0,stage:0,revealed:false};
function guideEscapeHTML(s){return esc(s);}
function guideData(){return CONCEPT_GUIDES[guideState.unit.id][guideState.index]}
function guideDialog(){return document.getElementById('conceptDialog')}
function guideOpen(unit,index){
 if(!unit||!CONCEPT_GUIDES[unit.id]||!CONCEPT_GUIDES[unit.id][index])return;
 guideState={unit,index,stage:0,revealed:false};
 const dlg=guideDialog();
 if(!dlg.open){if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','')}
 document.body.classList.add('guide-open');
 renderGuide();
}
function guideClose(){
 const dlg=guideDialog();if(dlg.open){if(dlg.close)dlg.close();else dlg.removeAttribute('open')}
 document.body.classList.remove('guide-open');
}
function guideSetStage(i){guideState.stage=Math.max(0,Math.min(2,i));guideState.revealed=false;renderGuideStage();}
function guideChangeConcept(delta){
 const count=guideState.unit.concepts.length;guideState.index=(guideState.index+delta+count)%count;
 guideState.stage=0;guideState.revealed=false;renderGuide();
}
function renderGuide(){
 const {unit,index}=guideState;const concept=unit.concepts[index],d=guideData();
 document.getElementById('guideCounter').textContent=`${unit.n}｜${unit.name}　·　圖解 ${index+1} / ${unit.concepts.length}`;
 document.getElementById('guideTitle').textContent=concept.title;
 document.getElementById('guideSummary').textContent=concept.key;
 const container=document.getElementById('guideLab');container.innerHTML='';
 try {labRenders[unit.lab](container)} catch(err){container.innerHTML='<p class="guide-fallback">互動圖目前無法顯示，請先閱讀右側的觀察與推理提示。</p>';console.error('圖解實驗失敗',err)}
 const target=container.querySelector(`.lab-tabs [data-mode="${d[0]}"]`);
 if(target&&!target.classList.contains('active'))target.click();
 // 手機圖框寬度大於畫面，預先移至圖中央；操作滑桿／切換頁籤後仍保留好讀的視野。
 const centerGuideImage=()=>{const v=container.querySelector('.lab-viewport');if(v&&window.innerWidth<=910)v.scrollLeft=Math.max(0,(v.scrollWidth-v.clientWidth)/2)};
 centerGuideImage();
 container.onclick=e=>{if(e.target.closest('.lab-tabs button'))requestAnimationFrame(centerGuideImage)};
 renderGuideStage();
 const guideContent=document.getElementById('guideContent');if(guideContent)guideContent.scrollTop=0;
}
function renderGuideStage(){
 const [tab,obs,why,ask,answer]=guideData();
 const s=guideState.stage;const stage=GUIDE_STAGES[s];
 const copy=s===0?obs:s===1?why:ask;
 document.getElementById('guideSteps').innerHTML=GUIDE_STAGES.map(([emoji,title],i)=>`<button class="guide-step ${s===i?'active':''}" data-guide-step="${i}" aria-current="${s===i?'step':'false'}"><span>${emoji}</span>${title}</button>`).join('');
 document.getElementById('guideStageHeading').textContent=`${stage[0]} ${stage[1]}`;
 document.getElementById('guideStageLead').textContent=stage[2];
 document.getElementById('guideStageCopy').textContent=copy;
 document.getElementById('guideReveal').innerHTML=s===2?`<button class="guide-answer-btn" id="guideRevealBtn" type="button">${guideState.revealed?'再看一次重點':'👀 我想好了，揭開答案'}</button><div class="guide-answer ${guideState.revealed?'show':''}" id="guideAnswer">${guideEscapeHTML(answer)}</div>`:'';
 const current=guideState.unit.concepts[guideState.index];
 document.getElementById('guideMemory').innerHTML=s===2?`<strong>⚡ 本題口訣</strong><span>${guideEscapeHTML(current.key)}</span>`:'';
 document.getElementById('guideBack').textContent=s===0?'← 前一個概念':'← 上一步';
 document.getElementById('guideNext').textContent=s===2?'下一個概念 →':'下一步 →';
 document.querySelectorAll('[data-guide-step]').forEach(b=>b.onclick=()=>guideSetStage(Number(b.dataset.guideStep)));
 const reveal=document.getElementById('guideRevealBtn');if(reveal)reveal.onclick=()=>{guideState.revealed=!guideState.revealed;renderGuideStage()};
}
function bindConceptGuideCards(unit){
 document.querySelectorAll('.concept-card').forEach((card,index)=>{
  const open=()=>guideOpen(unit,index);
  card.addEventListener('click',open);
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  const btn=card.querySelector('.inspect-action');if(btn)btn.addEventListener('click',e=>{e.stopPropagation();open()});
 });
}
function setupConceptGuides(){
 const dlg=guideDialog();
 dlg.addEventListener('close',()=>document.body.classList.remove('guide-open'));
 dlg.addEventListener('click',e=>{if(e.target===dlg)guideClose()});
 document.getElementById('guideExit').onclick=guideClose;
 document.getElementById('guideBack').onclick=()=>guideState.stage>0?guideSetStage(guideState.stage-1):guideChangeConcept(-1);
 document.getElementById('guideNext').onclick=()=>guideState.stage<2?guideSetStage(guideState.stage+1):guideChangeConcept(1);
 document.getElementById('guidePrevConcept').onclick=()=>guideChangeConcept(-1);
 document.getElementById('guideNextConcept').onclick=()=>guideChangeConcept(1);
}
// 自動一致性檢核：教材新增概念時不可悄悄出現無作用的圖解入口。
function validateConceptGuides(){
 UNITS.forEach(u=>{
  if(!CONCEPT_GUIDES[u.id]||CONCEPT_GUIDES[u.id].length!==u.concepts.length)
   console.warn(`圖解資料數量不符：${u.name}：概念=${u.concepts.length}，圖解=${CONCEPT_GUIDES[u.id]?.length}`);
 });
}
