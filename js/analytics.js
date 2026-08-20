(function () {
  var GA_ID = 'G-9FBE4JKG3R';

  function boot() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_ID);
    };
    document.head.appendChild(s);
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(boot, { timeout: 3500 });
  } else {
    window.addEventListener('load', boot, { once: true });
  }
})();
