# 實作計畫：LINE 貼圖自動化助手 (Line Sticker Factory)

## 專案目標 (Goal)
開發一個純前端的 Web 應用程式，協助創作者使用 AI 生成 LINE 貼圖，並進行圖片後製處理與打包上架。

## 系統架構 (Architecture)
- **類型**：單頁式應用程式 (SPA)。
- **技術棧**：HTML5, CSS3, Vanilla JavaScript (原生 JS)。
- **隱私權**：零伺服器處理。所有圖片運算皆在瀏覽器 Canvas 端完成。

## 已實作功能 (Implemented Features)

### 1. AI 提示詞生成器 (AI Prompt Generator)
- **輸入**：使用者選擇「主題 (Topic)」與「畫風 (Style)」，可選填「角色描述」。
- **邏輯**：
  - 基於 `app.js` 資料庫動態注入模板。
  - 支援 10 種主題（節日、日常、上班族、情侶、迷因、旅行、校園、健身等）。
  - 支援 10 種畫風（3D 渲染、寫實、動漫、像素風、水彩、波普藝術、扁平插畫等）。
  - 自動調整 Prompt 內容（若欄位留空則自動移除）。

### 2. 圖片處理工廠 (Image Processor)
- **核心引擎**：使用 HTML5 Canvas API 的 `image-processor.js` 類別。
- **工作流**：
  1. **上傳**：使用者提供一張 4x3 網格圖片（綠色背景）。
  2. **切割**：系統將其切割為 12 個獨立 Canvas。
  3. **綠幕去背**：像素級操作，移除 #00FF00，並支援可調整的容忍度/平滑度。
  4. **縮放**：將每張貼圖縮放至符合規範的 370x320px (保持長寬比)。
- **介面 (UI)**：
  - 分割佈局：左側上傳區 + 右側步驟指引。
  - 處理控制台：參數滑桿、網格預覽結果。
  - **手動選擇**：使用者在網格中點擊按鈕切換「Main (封面)」與「Tab (標籤)」圖片。
  - **縮放檢視**：燈箱 (Modal) 模式可檢查圖片細節。

### 3. 打包與下載 (Packaging & Download)
- **函式庫**：`JSZip` 用於打包。
- **輸出**：`line_stickers_pack.zip`。
- **內容物**：
  - `01.png` ~ `12.png`：12 張標準貼圖。
  - `main.png`：從使用者選定的 Main 貼圖生成，強制縮放/置中為 **240x240 px** (必要時補透明邊框)。
  - `tab.png`：從使用者選定的 Tab 貼圖生成，強制縮放/置中為 **96x74 px**。
- **下載方式**：使用 Data URI (`data:application/octet-stream`) 與動態 `<a>` 標籤，繞過本地檔案安全限制並強制指定檔名。

## 檔案結構 (File Structure)
- `index.html`：結構與佈局。
- `style.css`：視覺樣式 (深色模式、玻璃擬態)。
- `app.js`：互動邏輯、事件處理。
- `image-processor.js`：核心圖片處理類別。
- `docs/`：專案文件。

## 驗證清單 (Verification Checklist)
- [x] UI 響應式檢查 (手機/桌面)。
- [x] Prompt 生成準確度。
- [x] 圖片切割 (12 格)。
- [x] 綠幕去背效果。
- [x] Zip 下載包含正確檔案。
- [x] `main.png` 與 `tab.png` 尺寸精確。
- [x] Modal 大圖檢視功能正常。
