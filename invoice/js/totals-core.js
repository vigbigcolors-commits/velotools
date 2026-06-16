'use strict';

function toNumber(value) {
  var num = parseFloat(value);
  return Number.isFinite(num) ? num : 0;
}

function calculateInvoiceTotals(payload) {
  var items = Array.isArray(payload.items) ? payload.items : [];
  var discountRate = toNumber(payload.discount);
  var tax1Rate = toNumber(payload.tax1Rate);
  var tax2Rate = toNumber(payload.tax2Rate);
  var shipping = toNumber(payload.shipping);
  var tax2Enabled = Boolean(payload.tax2Enabled);

  var subtotal = items.reduce(function (sum, item) {
    return sum + toNumber(item.qty) * toNumber(item.rate);
  }, 0);

  var discountAmount = subtotal * (discountRate / 100);
  var afterDiscount = subtotal - discountAmount;
  var tax1Amount = afterDiscount * (tax1Rate / 100);
  var tax2Amount = tax2Enabled ? afterDiscount * (tax2Rate / 100) : 0;
  var total = afterDiscount + tax1Amount + tax2Amount + shipping;

  return {
    subtotal: subtotal,
    discountAmount: discountAmount,
    afterDiscount: afterDiscount,
    tax1Amount: tax1Amount,
    tax2Amount: tax2Amount,
    shippingAmount: shipping,
    total: total,
  };
}

module.exports = {
  calculateInvoiceTotals: calculateInvoiceTotals,
};
