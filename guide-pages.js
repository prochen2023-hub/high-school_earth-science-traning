/* v4.10 獨立圖解頁，互動失敗時保留靜態圖。 */
(function(){
  const stage = document.getElementById('guideLab');
  if (!stage) return;
  const lab = document.body.dataset.lab;
  const mode = document.body.dataset.mode;
  try {
    if (typeof mountLab !== 'function') throw new Error('missing local visuals.js');
    mountLab(lab, stage);
    const tab = Array.from(stage.querySelectorAll('.lab-tabs [data-mode]')).find(x=>x.dataset.mode===mode);
    if (tab) tab.click();
    if (!stage.querySelector('.lab-viewport svg')) throw new Error('missing SVG lab');
    document.body.classList.add('lab-ok');
    window.__guideReady = true;
  } catch (e) {
    console.error('無法啟用互動圖，改顯示靜態圖：', e);
    stage.innerHTML = '<p class="static-note">互動圖暫時無法啟動。下方保留同一主題的離線圖像，以及完整的看圖步驟與解答。</p>';
    window.__guideReady = false;
  }
})();
