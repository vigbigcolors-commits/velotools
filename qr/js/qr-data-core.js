'use strict';

function normalizeUrl(url) {
  var value = String(url || '').trim();
  if (!value) return '';

  if (!/^https?:\/\//i.test(value) && value.indexOf('.') !== -1) {
    return 'https://' + value;
  }
  return value;
}

function buildEmailData(to, subject, body) {
  var addr = String(to || '').trim();
  if (!addr) return '';

  var parts = [];
  var cleanSubject = String(subject || '').trim();
  var cleanBody = String(body || '').trim();

  if (cleanSubject) parts.push('subject=' + encodeURIComponent(cleanSubject));
  if (cleanBody) parts.push('body=' + encodeURIComponent(cleanBody));

  return 'mailto:' + addr + (parts.length ? '?' + parts.join('&') : '');
}

function buildLocationData(lat, lng) {
  var latNum = parseFloat(lat);
  var lngNum = parseFloat(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return '';

  return 'geo:' + latNum.toFixed(6) + ',' + lngNum.toFixed(6);
}

function escapeWifi(value) {
  return String(value || '').replace(/[\\"';,:]/g, function (char) {
    return '\\' + char;
  });
}

function buildWifiData(ssid, pass, security, isHidden) {
  var cleanSsid = String(ssid || '').trim();
  if (!cleanSsid) return '';

  var sec = security || 'WPA';
  if (sec === 'nopass') {
    return 'WIFI:T:nopass;S:' + escapeWifi(cleanSsid) + ';;';
  }

  var hidden = isHidden ? 'true' : 'false';
  return (
    'WIFI:T:' +
    sec +
    ';S:' +
    escapeWifi(cleanSsid) +
    ';P:' +
    escapeWifi(pass) +
    ';H:' +
    hidden +
    ';;'
  );
}

module.exports = {
  normalizeUrl: normalizeUrl,
  buildEmailData: buildEmailData,
  buildLocationData: buildLocationData,
  buildWifiData: buildWifiData,
  escapeWifi: escapeWifi,
};
