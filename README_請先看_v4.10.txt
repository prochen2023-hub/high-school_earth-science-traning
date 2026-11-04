高中一年級｜地科秘笈 v4.10 · 38 張獨立圖解連結修復版

【這次修正了什麼】
你所提供的截圖右下角顯示「✓ 用圖理解」。這是 v4.8 裡「不可點擊的文字」，不是 v4.9 的圖解按鈕。
為了徹底排除「有外觀沒有功能」、「上傳版本沒更新」及彈出視窗被阻擋等問題，本版不再使用彈窗開啟圖解。

本版每張正式知識卡：
1. 上方是對應概念的新 SVG 圖像預覽（離線 webp）。
2. 整張卡本身是一個真正的 HTML <a href=...> 連結。
3. 卡片右下角會顯示：「🔎 開啟圖解與互動 ↗」。
4. 點擊之後，進入 guides/<單元>-<序號>.html 的獨立網頁。
5. 圖解頁有可操作的 SVG、觀察提示、因果解釋、變化題、點擊揭曉答案與上一張／下一張。
6. 若互動 SVG 無法啟動，仍顯示本地靜態圖卡，不會整塊空白。

【最簡單的兩個驗收方法】
A. 解壓縮後直接開啟 index.html → 進入「板塊邊界與火山地震」→ 找第 2 張「海洋—大陸聚合」→ 點藍色「開啟圖解與互動 ↗」。
B. 不需要進入首頁，直接開啟 guides/index.html；應當看見完整 38 張縮圖目錄，而且每張都能點進獨立網頁。

【更新 GitHub Pages 請注意】
1. ZIP 需完整解壓縮。把 ZIP 根目錄的 index.html、app.js、style.css、content.js、visuals.js、questions.js、guide-pages.js、guide-pages.css、assets/、guides/ 和 legacy/ 一起上傳到網站發布目錄。
2. 不能只更新 index.html，也不能把整個 ZIP 當成一個檔案直接上傳（GitHub Pages 不會自動替你解壓）。
3. 如果原檔案沒有覆蓋、上傳到不相同的 repo/branch/folder，看到的依然是 v4.8。請至 Repo 的 Settings → Pages 查看實際發佈來源，例如 main / (root)。
4. 等新的網站內容顯示後，請重新整理（Windows Chrome：Ctrl+Shift+R），或使用無痕模式驗證。
5. 正確版本：網站左上角顯示 v4.10；卡片底部是「🔎 開啟圖解與互動 ↗」，且帶有圖片縮圖。
   若還看到「✓ 用圖理解」，目前打開的仍是舊版 HTML。
6. 網頁無需外部圖片 CDN，課程圖片與圖解預覽均內建。

【目錄內容】
index.html                  主課程首頁
app.js / content.js         教學頁面、內容
visuals.js                  SVG 教學實驗
questions.js                題庫與模擬考
guide-pages.css/js          獨立圖解頁外觀及互動啟動器
guides/index.html           38 張圖解的獨立總目錄
guides/*.html               38 張獨立圖解教材頁
assets/previews/*.webp      38 張對應縮圖／失敗後靜態圖
assets/*.webp               原網站情境圖
legacy/                     原 v4.3 的既有學期網站
QA_v4.10_驗收報告.md           逐項檢查結果

※科學內容採高中地科教學簡化示意，並非真實地形比例圖、即時地震觀測或實測地質剖面。
