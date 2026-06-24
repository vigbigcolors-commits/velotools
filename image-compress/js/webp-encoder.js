/**
 * WASM WebP encoder — works on iOS Safari where canvas.toBlob('image/webp') returns PNG.
 * Powered by @jsquash/webp (libwebp, Apache-2.0).
 */
import encode from '../vendor/jsquash-webp/encode.js';

function encodeCanvas(canvas, quality, lossless) {
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var opts = lossless ? { lossless: true } : { quality: Math.round(quality) };
  return encode(imageData, opts).then(function (buf) {
    return new Blob([buf], { type: 'image/webp' });
  });
}

var warmPromise = null;

window.VWebPEncoder = {
  /** Pre-load WASM (~300 KB, once per session). */
  load: function () {
    if (!warmPromise) {
      warmPromise = encode(
        new ImageData(new Uint8ClampedArray([255, 0, 0, 255]), 1, 1),
        { quality: 80 }
      ).catch(function () { return null; });
    }
    return warmPromise;
  },

  encodeCanvas: encodeCanvas,
};

window.VWebPEncoder.load();
