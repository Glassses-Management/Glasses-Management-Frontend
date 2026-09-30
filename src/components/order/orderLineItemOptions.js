// Option lists and the blank-row factory for the order line item editor.
// Kept out of OrderLineItems.jsx so that file only exports components and stays
// fast-refresh friendly.

export const LENS_TYPES = ['Single Vision', 'Progressive', 'Bifocal', 'Standard']
export const COATINGS = ['Standard', 'Anti-Glare', 'Blue Light']
export const LENS_INDEXES = [1.5, 1.6, 1.67, 1.74]

export function newRow() {
  return {
    rowId: Date.now() + Math.random(),
    productId: '',
    quantity: 1,
    lenType: 'Single Vision',
    coating: 'Standard',
    lenIndex: 1.6,
    lensPrice: '',
  }
}
