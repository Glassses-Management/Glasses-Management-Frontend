export const INVENTORY_STATUS = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
}

export const INVENTORY_STATUS_LABEL = {
  [INVENTORY_STATUS.IN_STOCK]: 'In Stock',
  [INVENTORY_STATUS.LOW_STOCK]: 'Low Stock',
  [INVENTORY_STATUS.OUT_OF_STOCK]: 'Out of Stock',
}

export const INVENTORY_STATUS_OPTIONS = Object.entries(INVENTORY_STATUS_LABEL).map(([value, label]) => ({ value, label }))

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export function inventoryStatus(quantity, reorder) {
  const qty = toNumber(quantity)
  const reorderLevel = toNumber(reorder)
  if (qty <= 0) return INVENTORY_STATUS.OUT_OF_STOCK
  if (qty <= reorderLevel) return INVENTORY_STATUS.LOW_STOCK
  return INVENTORY_STATUS.IN_STOCK
}