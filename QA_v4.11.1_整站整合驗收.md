# 高一地科秘笈 v4.11.1｜整站整合驗收

## 改版目標
- 全部臺灣地質圖鑑教材直接嵌在 `index.html` 的「臺灣地質圖鑑」課程視圖；不再另開教學頁。
- 完整保留地質分區 8 區、海底構造 10 項、隱沒機制 5 步、11 張岩石樣本、8 題配圖判圖實戰。
- 網站其餘六節課程、38 張獨立概念圖、第三章 ABCD 練習與 A/B 單章練習不受影響。
- 從主頁、側欄、岩石／板塊／臺灣課程導向同一個主網站視圖。
- 過去 bookmarked `taiwan-atlas.html#specimens` 僅轉址至 `index.html#atlas-specimens`，不包含重複教學內容。

## 實作
- `index.html` 內建 `<template id="atlasInlineTemplate">`，展示時複製至同頁 `#main`。
- `atlas-integrated.js` 負責初始化模組切換；`atlas-embedded.css` 只套用於 `.atlas-scope`，與主站樣式隔離。
- 原來指向 `taiwan-atlas.html` 的入口已替換成 `#atlas-<tab>` 同頁導覽；概念圖頁反向入口改為 `../index.html#atlas-<tab>`。
- 完整教材圖像仍存放於同包 `assets/atlas`，不使用易失效的遠端資源作為核心圖片。

## 本機測試（Chromium 1440×900／390×844，HTML/JS/CSS 本機載入）
- 桌面與手機都成功開啟「臺灣地質圖鑑」，五個 tab 均有對應內容；無 JavaScript pageerror。
- 地質區 5 切換有效且地圖載入（naturalWidth 760）。
- 海底地形「海槽」切換有效；隱沒機制第 4 步可更新說明。
- 岩石真實照片 11 張資料卡呈現；玄武岩細節可開啟。
- 判圖題可答題並顯示解析。
- 返回首頁後六個課程卡仍在；岩石課程的圖鑑入口直接打開「真實岩石標本」。
- 桌面與 390px 手機畫面均無水平溢出。
- 第三章 A/B 練習入口存在（未更動題庫）。
- 42 個 HTML 的相對檔案路徑：未發現缺少本地檔案。

## 限制
- 測試是本地 Chromium 渲染與互動測試，**不是** GitHub Pages 線上新版已成功部署的證明。
- 第二次段考的第三、四章正式 A/B 卷，仍等完整整合大氣篇後製作。
