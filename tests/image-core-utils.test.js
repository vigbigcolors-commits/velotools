const { fmtBytes, escHtml } = require('../image-compress/js/core-utils');

describe('image-compress core-utils', () => {
  it('formats byte sizes', () => {
    expect(fmtBytes(512)).toBe('512 B');
    expect(fmtBytes(2048)).toBe('2 KB');
    expect(fmtBytes(1572864)).toBe('1.5 MB');
  });

  it('escapes HTML entities', () => {
    expect(escHtml('<img src="x">')).toBe('&lt;img src=&quot;x&quot;&gt;');
  });
});
