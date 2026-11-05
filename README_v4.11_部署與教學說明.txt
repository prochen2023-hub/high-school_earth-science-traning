此檔為 v4.11.1「主站整合版」最新部署說明。

真正的完整網站入口只要開 index.html。
全部臺灣地質、海底構造、隱沒剖面、岩石標本與判圖練習都已直接嵌入主站，不再需要開獨立的 taiwan-atlas.html。

請先看 README_請先看_v4.11.1.txt。
Github Desktop：把 ZIP 解壓縮的所有內容覆蓋 repo 根目錄，Commit to main → Push origin，再到 Actions 確認最新 commit 的部署顯示 Success。
若新網站尚未顯示，請檢查 index.html 的 Code 畫面是否確實寫著 v4.11.1，並確認 Pages 是否已針對該 commit 完成部署；網址不會因為改成單頁就自動觸發部署。
