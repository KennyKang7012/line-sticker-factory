class ImageProcessor {
    constructor() {
        // JSZip should be available globally via script tag
    }

    /**
     * Process the main image: Slice -> Remove BG -> Resize
     * @param {HTMLImageElement} image - The source image
     * @param {Object} options - { rows, cols, tolerance, smoothing, targetWidth, targetHeight }
     * @returns {Promise<Array>} - Array of processed sticker objects
     */
    async processImage(image, options) {
        const { rows, cols, tolerance, smoothing } = options;
        const stickers = [];

        const chunkWidth = image.width / cols;
        const chunkHeight = image.height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // 1. Crop
                const canvas = document.createElement('canvas');
                canvas.width = chunkWidth;
                canvas.height = chunkHeight;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(
                    image,
                    c * chunkWidth, r * chunkHeight, chunkWidth, chunkHeight, // Source
                    0, 0, chunkWidth, chunkHeight // Dest
                );

                // 2. Remove Green Screen
                const processedImageData = this.removeGreenScreen(ctx, canvas.width, canvas.height, tolerance, smoothing);
                ctx.putImageData(processedImageData, 0, 0);

                // 3. Resize to fit target box (370x320) while maintaining aspect ratio
                const finalCanvas = this.resizeToFit(canvas, options.targetWidth, options.targetHeight);

                // Get Result
                const dataUrl = finalCanvas.toDataURL('image/png');
                const i = r * cols + c + 1;
                const fileName = i.toString().padStart(2, '0') + '.png';

                stickers.push({
                    id: i,
                    fileName: fileName,
                    dataUrl: dataUrl,
                    blob: await this.canvasToBlob(finalCanvas),
                    originalCanvas: finalCanvas // Keep canvas for re-scaling Main/Tab
                });
            }
        }

        // Note: We NO LONGER auto-generate Main/Tab here. 
        // We will generate them on demand during Zip download based on user selection.

        return stickers;
    }

    removeGreenScreen(ctx, width, height, tolerance = 40, smoothing = 2) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Calculate distance in RGB space to (0, 255, 0)
            const dist = Math.sqrt(
                Math.pow(r - 0, 2) +
                Math.pow(g - 255, 2) +
                Math.pow(b - 0, 2)
            );

            // Tolerance scaled
            const threshold = (tolerance / 100) * 200 + 30;

            if (dist < threshold) {
                // Green -> Transparent
                data[i + 3] = 0;
            } else if (dist < threshold + smoothing * 10) {
                // Feather edge
                const alpha = (dist - threshold) / (smoothing * 10);
                data[i + 3] = Math.floor(255 * alpha);
            }
        }
        return imageData;
    }

    resizeToFit(sourceCanvas, maxWidth, maxHeight) {
        const outputCanvas = document.createElement('canvas');

        // Calculate Aspect Ratio
        const ratio = Math.min(maxWidth / sourceCanvas.width, maxHeight / sourceCanvas.height);

        // New dimensions
        const newWidth = Math.round(sourceCanvas.width * ratio);
        const newHeight = Math.round(sourceCanvas.height * ratio);

        outputCanvas.width = newWidth;
        outputCanvas.height = newHeight;

        const ctx = outputCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight);

        return outputCanvas;
    }

    /**
     * Generate Zip with the 12 stickers PLUS selected Main and Tab images.
     * @param {Array} stickers - Array of processed stickers
     * @param {number|string} mainId - ID of the sticker to use as Main
     * @param {number|string} tabId - ID of the sticker to use as Tab
     * @returns {Promise<string>} - The zip content as Base64 Data URI
     */
    async downloadZip(stickers, mainId, tabId) {
        const zip = new JSZip();

        // 1. Add normal stickers
        stickers.forEach(s => {
            zip.file(s.fileName, s.blob);
        });

        // 2. Generate Main Image (240x240)
        const mainSticker = stickers.find(s => s.id == mainId) || stickers[0];
        if (mainSticker) {
            // Use resizeAndCenter to force exact 240x240 canvas
            const mainCanvas = this.resizeAndCenter(mainSticker.originalCanvas, 240, 240);
            const mainBlob = await this.canvasToBlob(mainCanvas);
            zip.file('main.png', mainBlob);
        }

        // 3. Generate Tab Image (96x74)
        const tabSticker = stickers.find(s => s.id == tabId) || stickers[0];
        if (tabSticker) {
            // Use resizeAndCenter to force exact 96x74 canvas
            const tabCanvas = this.resizeAndCenter(tabSticker.originalCanvas, 96, 74);
            const tabBlob = await this.canvasToBlob(tabCanvas);
            zip.file('tab.png', tabBlob);
        }

        // 4. Generate & Reference
        // INFO: Using base64 to avoid 'blob:null' issues on local file system (file://)
        // INFO: Using application/octet-stream to force download logic in some browsers
        const base64 = await zip.generateAsync({ type: "base64" });
        return "data:application/octet-stream;base64," + base64;
    }

    // New helper to force exact canvas size with centered image
    resizeAndCenter(sourceCanvas, targetWidth, targetHeight) {
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = targetWidth;
        outputCanvas.height = targetHeight;

        const ctx = outputCanvas.getContext('2d');

        // 1. Calculate scaling to fit WITHIN target
        const ratio = Math.min(targetWidth / sourceCanvas.width, targetHeight / sourceCanvas.height);
        const newWidth = Math.round(sourceCanvas.width * ratio);
        const newHeight = Math.round(sourceCanvas.height * ratio);

        // 2. Calculate centering position
        const offsetX = (targetWidth - newWidth) / 2;
        const offsetY = (targetHeight - newHeight) / 2;

        // 3. Draw
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, offsetX, offsetY, newWidth, newHeight);

        return outputCanvas;
    }

    // Helper: Canvas to Blob
    canvasToBlob(canvas) {
        return new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });
    }

    // Helper: Blob to Image
    blobToImage(blob) {
        return new Promise(resolve => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.src = url;
        });
    }
}
