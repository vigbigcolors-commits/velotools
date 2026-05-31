/**
 * VeloTools — state.js
 * Single source of truth for the single-image editor.
 */
window.VState = {
  /* source */
  file: null, origUrl: null, origImg: null,
  origW: 0, origH: 0, ar: 1, fileMime: 'image/jpeg',
  /* settings */
  quality: 80, format: 'original', rotation: null,
  lockAR: true, targetW: 0, targetH: 0,
  blurType: 'gaussian', blurAmt: 5,
  brightness: 100, contrast: 100, saturation: 100,
  hue: 0, sharpness: 0, denoise: 0,
  activePanel: 'compress',
  /* result */
  resultBlob: null, resultUrl: null, resultExt: 'jpg',

  reset: function () {
    Object.assign(this, {
      file:null,origUrl:null,origImg:null,origW:0,origH:0,ar:1,
      fileMime:'image/jpeg',quality:80,format:'original',rotation:null,
      lockAR:true,targetW:0,targetH:0,blurType:'gaussian',blurAmt:5,
      brightness:100,contrast:100,saturation:100,hue:0,sharpness:0,denoise:0,
      activePanel:'compress',resultBlob:null,resultUrl:null,resultExt:'jpg'
    });
  }
};
