// worker.js
self.importScripts('https://unpkg.com/@zxing/library@latest/umd/index.min.js');

self.onmessage = function(e) {
    const { imageData, width, height } = e.data;
    const source = new ZXing.HTMLCanvasElementLuminanceSource({ width, height, getPixel: (x, y) => imageData[y * width + x] });
    const binaryBitmap = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(source));
    const reader = new ZXing.MultiFormatReader();

    const hints = new Map();
    hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
        ZXing.BarcodeFormat.DATA_MATRIX,
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.CODE_128,
        ZXing.BarcodeFormat.QR_CODE
    ]);
    hints.set(ZXing.DecodeHintType.TRY_HARDER, true);

    try {
        const result = reader.decode(binaryBitmap, hints);
        self.postMessage({ text: result.text, format: result.getBarcodeFormat() });
    } catch (error) {
        self.postMessage({ error: error.name });
    }
};