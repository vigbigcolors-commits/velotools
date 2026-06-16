const {
  normalizeUrl,
  buildEmailData,
  buildLocationData,
  buildWifiData,
} = require('../qr/js/qr-data-core');

describe('qr-data-core', () => {
  it('normalizes URL without protocol', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com');
    expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    expect(normalizeUrl('')).toBe('');
  });

  it('builds mailto with encoded params', () => {
    const data = buildEmailData('hello@site.com', 'Hello there', 'Line 1 & Line 2');
    expect(data).toBe('mailto:hello@site.com?subject=Hello%20there&body=Line%201%20%26%20Line%202');
  });

  it('builds geo string with fixed precision', () => {
    expect(buildLocationData('40.1234567', '-74.1234567')).toBe('geo:40.123457,-74.123457');
    expect(buildLocationData('bad', '12')).toBe('');
  });

  it('builds WIFI payload and escapes special chars', () => {
    expect(buildWifiData('Cafe:Main', 'pa;ss', 'WPA', true)).toBe(
      'WIFI:T:WPA;S:Cafe\\:Main;P:pa\\;ss;H:true;;'
    );
    expect(buildWifiData('Public Net', '', 'nopass', false)).toBe('WIFI:T:nopass;S:Public Net;;');
  });
});
