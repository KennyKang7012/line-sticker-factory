document.addEventListener('DOMContentLoaded', () => {
    // --- Prompt Generator Logic (Same as before) ---
    const charDescInput = document.getElementById('char-desc');
    const generatedPrompt = document.getElementById('generated-prompt');
    const copyBtn = document.getElementById('copy-btn');
    const topicGroup = document.getElementById('topic-group');
    const styleGroup = document.getElementById('style-group');

    // State
    let currentTopic = 'festival';
    let currentStyle = '3d-render';

    // Data: Styles
    const styles = {
        '3d-render': '通用 Q 版, 3D Render, 盲盒公仔風格, C4D rendering, 迪士尼皮克斯風格',
        'realistic': '寫實風格, Realistic, 擬真質感, 細膩光影',
        '3d-clay': '3D 立體, Claymorphism, 黏土質感, 圓潤可愛',
        'hand-drawn': '手繪塗鴉, Hand drawn doodle, 蠟筆筆觸, 童趣',
        'pixel-art': '像素風, Pixel art, 8-bit, 復古遊戲風格',
        'anime': '日系動漫, Anime style, 賽璐璐風格, 鮮豔色彩',
        // New Styles
        'flat-illustration': '扁平插畫, Flat Illustration, Vector Art, 簡約色塊, 現代風格, Corporate Memphis',
        'watercolor': '水彩暈染, Watercolor style, Wet wash, Soft pastel colors, 藝術感, 溫柔質感',
        'retro-cartoon': '復古卡通, Vintage 1930s cartoon, Rubber hose animation, 懷舊風格, Disney style old',
        'pop-art': '美式波普, Pop Art, Comic book style, 半調網點, 強烈對比, 漫畫感'
    };

    // Data: Topics & Text Content
    const topics = {
        'festival': {
            label: '節日祝福',
            text: '【新年快樂、恭喜發財、生日快樂、聖誕快樂、情人節快樂、中秋快樂、母親節快樂、父親節快樂、端午安康、萬聖節快樂、Happy New Year、紅包拿來】',
            actions: '【雙手拿紅包、點燃鞭炮、捧著生日蛋糕、送出禮物盒、舉杯慶祝、扮鬼臉、跳舞、送康乃馨、吃肉粽、戴聖誕帽】'
        },
        'daily': {
            label: '日常用語',
            text: '【早安、晚安、好的、謝謝、對不起、沒問題、因該的、辛苦了、哈哈、OK、不客氣、加油】',
            actions: '【招手打招呼、點頭比OK、鞠躬道謝、擦汗、比讚、趴著睡覺、大笑、握拳加油、疑惑抓頭、比愛心、喝咖啡、滑手機】'
        },
        'greeting': {
            label: '打招呼',
            text: '【Hi、Hello、你好、安安、在嗎、吃飽沒、好久不見、早、午安、晚安、Yo、嘿】',
            actions: '【揮手、探頭、微笑、眨眼、舉手牌、大聲公、探頭探腦、開心跳躍、比YA、敬禮、擁抱、握手】'
        },
        'response': {
            label: '回應篇',
            text: '【好喔、收到、了解、沒問題、嗯嗯、傻眼、真的假的、笑死、原來如此、這是什麼、好唷、再見】',
            actions: '【比OK手勢、敬禮、點頭如搗蒜、張大嘴驚訝、翻白眼、捧腹大笑、思考、滿頭問號、比叉叉、流汗、揮手道別、比讚】'
        },
        'work': {
            label: '上班族',
            text: '【收到、馬上處理、開會中、加班中、辛苦了、准奏、報告長官、請過目、確認中、謝謝老闆、下班囉、累】',
            actions: '【打電腦、看公文、敬禮、趴桌崩潰、喝蠻牛、比讚、拿著文件、講電話、眼神死、比OK、奔跑、鞠躬】'
        },
        'couple': {
            label: '老公老婆',
            text: '【想你、愛你、抱抱、親一個、早點回來、飯好了、老公、老婆、對不起、森氣氣、啾咪、辛苦了】',
            actions: '【擁抱、飛吻、撒嬌、生氣插腰、煮飯、比愛心、害羞、跪算盤、摸頭、依偎、送禮物、牽手】'
        },
        'meme': {
            label: '迷因搞笑',
            text: '【我就爛、歸剛欸、是在哈囉、嚇到吃手手、眼神死、我就靜靜看著你裝B、可憐哪、哭啊、笑死、真香、阿姨我不想努力了、確實】',
            actions: '【癱軟、傻眼貓咪、黑人問號、捧腹大笑、鄙視眼神、吃爆米花、攤手、崩潰大哭、流口水、滑跪、墨鏡裝酷、無言】'
        },
        'travel': {
            label: '旅行出遊',
            text: '【出發囉、到了、好美、拍張照、吃美食、迷路了、好累、買買買、Check in、登機中、想回家、下次再來】',
            actions: '【拉行李箱奔跑、拿相機拍照、戴墨鏡喝椰子水、看地圖抓頭、大口吃漢堡、提大包小包戰利品、比YA自拍、坐飛機、泡溫泉、在沙灘曬太陽】'
        },
        'school': {
            label: '校園生活',
            text: '【上課囉、考試加油、Pass、當掉了、肚子餓、想睡覺、作業借我、老師來了、放學沒、要去哪、讀書中、All PA】',
            actions: '【背書包轉圈、埋頭苦讀、偷吃零食、趴桌流口水、舉手發問、拿著考卷哭泣、推眼鏡耍帥、和同學擊掌、趕公車、被書本淹沒】'
        },
        'fitness': {
            label: '健身運動',
            text: '【動起來、健身中、好喘、肌肉、瘦了、胖了、堅持住、休息一下、喝水、今天練腿、跑步、汗水】',
            actions: '【舉啞鈴、跑步機上氣不接氣、秀二頭肌、量體重驚訝、瑜珈動作、大口喝水、平板支撐發抖、深蹲、拳擊、擦汗微笑】'
        }
    };

    function updatePrompt() {
        // Get inputs
        const charDescValue = charDescInput.value.trim();

        const styleDesc = styles[currentStyle];
        const topicData = topics[currentTopic];

        let charDescLine = '';
        if (charDescValue) {
            charDescLine = `角色描述：${charDescValue}\n`;
        }

        const prompt = `✅ 12 格角色貼圖集｜Prompt 建議
請參考角色描述（若有上傳圖片則以圖片為主），生成 一張包含 12 個不同動作的角色貼圖集，也不要使用任何emoji表情符號。

[角色與風格設定]
${charDescLine}角色一致性：必須完全維持角色的髮型、服裝、五官與整體外觀特徵。
構圖風格：畫面僅包含「角色 + 文字」，不包含任何場景背景。
畫風設定：【${styleDesc}】。
貼紙風格（去背友善）：角色與文字外圍皆需加入 粗白色外框（Sticker Style）。背景統一為 #00FF00（純綠色），不可有雜點。

[畫面佈局與尺寸規格]
整體為 4 × 3 佈局，共 12 張貼圖。總尺寸：1480 × 960 px。
每張小圖約 370 × 320 px（自動等比縮放填滿排列）。每張貼圖四周預留約 0.2 cm Padding，避免畫面互相黏住。
鏡頭多樣化：全身 + 半身混合，必須包含正面、側面、俯角等不同視角。

[文字設計]
語言：【台灣繁體中文】
文字內容：${topicData.text}
字型風格：【可愛 Q 版字型，顏色鮮豔、易讀，多色彩混合，絕對禁止使用任何綠色（包含深綠、淺綠、螢光綠、藍綠）與黑色，因為會導致去背錯誤。請改用紅、藍、紫、橘、黃等高對比色彩。】
排版：文字大小約佔單張貼圖 1/3，文字可適度壓在衣服邊角等非重要區域，不能遮臉,也不要使用任何emoji表情符號。

[表情與動作設計]
表情必須明顯、誇張、情緒豐富：【喜氣洋洋、興奮、溫馨、大笑、感動、派對臉】
角色動作需與文字情境一致：例如${topicData.actions}
12 格皆須為 不同動作與不同表情。

[輸出格式]
一張大圖，內含 4 × 3 的 12 張貼圖。背景必須為 純綠色 #00FF00。每格角色 + 文字均附上粗白邊。`;

        generatedPrompt.value = prompt;

        // Auto-resize textarea to fit content
        generatedPrompt.style.height = 'auto';
        generatedPrompt.style.height = generatedPrompt.scrollHeight + 'px';
    }

    // Event Listeners for Buttons
    function handleButtonGroup(groupElement, callback) {
        groupElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-select')) {
                groupElement.querySelectorAll('.btn-select').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                callback(e.target.dataset.value);
            }
        });
    }

    handleButtonGroup(topicGroup, (val) => {
        currentTopic = val;
        updatePrompt();
    });

    handleButtonGroup(styleGroup, (val) => {
        currentStyle = val;
        updatePrompt();
    });

    charDescInput.addEventListener('input', updatePrompt);

    copyBtn.addEventListener('click', () => {
        generatedPrompt.select();
        document.execCommand('copy');

        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> 已複製';
        copyBtn.classList.add('btn-accent');

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('btn-accent');
        }, 2000);
    });

    updatePrompt();


    // --- Image Processor Logic ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const processorInitial = document.getElementById('processor-initial');
    const processorUi = document.getElementById('processor-ui');
    const stickersGrid = document.getElementById('stickers-grid');
    const downloadBtn = document.getElementById('download-btn');
    const processBtn = document.getElementById('process-btn');
    const resetBtn = document.getElementById('reset-btn');
    const toleranceInput = document.getElementById('tolerance');
    const smoothingInput = document.getElementById('smoothing');
    const toleranceVal = document.getElementById('tolerance-val');
    const smoothingVal = document.getElementById('smoothing-val');

    // Modal elements
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('caption');
    const closeModal = document.querySelector('.close-modal');

    let currentImage = null;
    let processor = null;

    let processedStickers = [];
    let selectedMainId = 1;
    let selectedTabId = 1;

    // Drag and Drop
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('請上傳圖片檔案！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                currentImage = img;
                if (!processor) {
                    processor = new ImageProcessor();
                }

                processorInitial.classList.add('hidden');
                processorUi.classList.remove('hidden');

                runProcessing();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    resetBtn.addEventListener('click', () => {
        currentImage = null;
        fileInput.value = '';
        processorUi.classList.add('hidden');
        processorInitial.classList.remove('hidden');
        stickersGrid.innerHTML = '';
        processedStickers = [];
    });

    toleranceInput.addEventListener('input', (e) => {
        toleranceVal.textContent = e.target.value;
    });

    smoothingInput.addEventListener('input', (e) => {
        smoothingVal.textContent = e.target.value;
    });

    processBtn.addEventListener('click', runProcessing);

    async function runProcessing() {
        if (!currentImage || !processor) return;

        const tolerance = parseInt(toleranceInput.value);
        const smoothing = parseInt(smoothingInput.value);

        processBtn.disabled = true;
        processBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 處理中...';

        try {
            processedStickers = await processor.processImage(currentImage, {
                rows: 3,
                cols: 4,
                tolerance: tolerance,
                smoothing: smoothing,
                targetWidth: 370,
                targetHeight: 320
            });

            selectedMainId = 1;
            selectedTabId = 1;

            renderPreview(processedStickers);

            // Re-bind download button to avoid event listeners stacking
            const newDownloadBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);

            newDownloadBtn.onclick = () => {
                newDownloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 打包中...';

                setTimeout(async () => {
                    try {
                        // Returns Data URI string (data:application/zip;base64,...)
                        const dataUri = await processor.downloadZip(processedStickers, selectedMainId, selectedTabId);

                        // Robust Download Method: Create <a> tag with Data URI
                        if (dataUri) {
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = dataUri;
                            a.download = 'line_stickers_pack.zip'; // Force filename
                            document.body.appendChild(a);

                            a.click();

                            // Cleanup
                            document.body.removeChild(a);
                        }
                    } catch (e) {
                        console.error(e);
                        alert('打包下載失敗，請重試或檢查瀏覽器權限。');
                    } finally {
                        newDownloadBtn.innerHTML = '<i class="fa-solid fa-file-zipper"></i> 下載貼圖包 (Zip)';
                    }
                }, 100);
            };

        } catch (err) {
            console.error(err);
            alert('處理圖片時發生錯誤');
        } finally {
            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> 重新處理';
        }
    }

    function renderPreview(stickers) {
        stickersGrid.innerHTML = '';
        stickers.forEach(sticker => {
            const div = document.createElement('div');
            div.className = 'sticker-item';

            const isMain = sticker.id === selectedMainId ? 'active' : '';
            const isTab = sticker.id === selectedTabId ? 'active' : '';

            // Explicitly add 'zoomable-img' class
            div.innerHTML = `
                <span class="sticker-badge">${sticker.fileName}</span>
                <img src="${sticker.dataUrl}" alt="Sticker ${sticker.id}" class="zoomable-img">
                <div class="sticker-actions">
                    <button class="btn-toggle ${isMain}" data-id="${sticker.id}" data-type="main">
                        <i class="fa-solid fa-star"></i> Main
                    </button>
                    <button class="btn-toggle ${isTab}" data-id="${sticker.id}" data-type="tab">
                        <i class="fa-solid fa-tag"></i> Tab
                    </button>
                </div>
            `;
            stickersGrid.appendChild(div);
        });
    }

    // Delegation for Sticker Selection and Zoom
    stickersGrid.addEventListener('click', (e) => {
        // Handle Button Clicks
        const btn = e.target.closest('.btn-toggle');
        if (btn) {
            const id = parseInt(btn.dataset.id);
            const type = btn.dataset.type;

            if (type === 'main') {
                selectedMainId = id;
            } else if (type === 'tab') {
                selectedTabId = id;
            }
            updateSelectionUI();
            return;
        }

        // Handle Image Click (Zoom)
        // Check if the clicked target (or its parent, though img is leaf) has the class
        if (e.target.classList.contains('zoomable-img')) {
            modal.style.display = "block";
            setTimeout(() => modal.classList.add('show'), 10); // Small delay for animation
            modalImg.src = e.target.src;
            modalCaption.innerText = e.target.alt;
        }
    });

    // Close Modal Logic
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = "none", 300); // Wait for transition if any
    });

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = "none", 300);
        }
    }

    function updateSelectionUI() {
        const mainBtns = stickersGrid.querySelectorAll('.btn-toggle[data-type="main"]');
        const tabBtns = stickersGrid.querySelectorAll('.btn-toggle[data-type="tab"]');

        mainBtns.forEach(btn => {
            if (parseInt(btn.dataset.id) === selectedMainId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        tabBtns.forEach(btn => {
            if (parseInt(btn.dataset.id) === selectedTabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
});
