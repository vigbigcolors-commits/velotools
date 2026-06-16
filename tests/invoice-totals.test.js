const { calculateInvoiceTotals } = require('../invoice/js/totals-core');

describe('calculateInvoiceTotals', () => {
  it('calculates totals with discount, taxes and shipping', () => {
    const result = calculateInvoiceTotals({
      items: [
        { qty: 2, rate: 100 },
        { qty: 1.5, rate: 80 },
      ],
      discount: 10,
      tax1Rate: 20,
      tax2Rate: 5,
      tax2Enabled: true,
      shipping: 15,
    });

    expect(result.subtotal).toBe(320);
    expect(result.discountAmount).toBe(32);
    expect(result.afterDiscount).toBe(288);
    expect(result.tax1Amount).toBe(57.6);
    expect(result.tax2Amount).toBe(14.4);
    expect(result.total).toBe(375);
  });

  it('handles empty and invalid values safely', () => {
    const result = calculateInvoiceTotals({
      items: [{ qty: 'abc', rate: 100 }],
      discount: 'x',
      tax1Rate: null,
      tax2Rate: undefined,
      tax2Enabled: false,
      shipping: 'foo',
    });

    expect(result.subtotal).toBe(0);
    expect(result.discountAmount).toBe(0);
    expect(result.tax1Amount).toBe(0);
    expect(result.tax2Amount).toBe(0);
    expect(result.total).toBe(0);
  });
});
