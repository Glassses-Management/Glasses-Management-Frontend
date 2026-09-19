// Pure helpers for the public catalog: demo filler data, facet counts,
// search/filter matching and sorting. Kept free of JSX so the page stays thin.

const toPrice = (p) => Number(p.sale_price) || 0
const toWords = (p) => [p.model, p.brand, p.category, p.material, p.color, p.size].filter(Boolean).join(' ').toLowerCase()

// Frame Geometry is derived from free-text fields (the backend has no dedicated
// shape column yet). Once it does, swap this for `p.frameShape`.
const GEOMETRY_KEYWORDS = [
  { value: 'Round', words: ['round'] },
  { value: 'Square', words: ['square', 'sqr'] },
  { value: 'Rectangular', words: ['rectangle', 'rectangular', 'rect'] },
  { value: 'Aviator', words: ['aviator', 'pilot', 'teardrop'] },
  { value: 'Cat-Eye', words: ['cat-eye', 'cateye', 'cat eye'] },
  { value: 'Oversized', words: ['oversize', 'oversized', 'large'] },
]

export function geometryOf(p) {
  const text = toWords(p)
  return (GEOMETRY_KEYWORDS.find((g) => g.words.some((w) => text.includes(w))) || {}).value || null
}

// "Clinical Lens Ready" is another placeholder facet until a real flag exists.
const lensReadyOf = (p) => (p.material && /titanium/i.test(p.material) ? 'prescription' : 'standard')

const uniq = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)))

export function buildFacetOptions(products) {
  const priceValues = products.map(toPrice).filter((v) => v > 0)
  return {
    categories: uniq(products.map((p) => p.category)),
    materials: uniq(products.map((p) => p.material)),
    priceBounds:
      priceValues.length > 0
        ? { min: Math.min(...priceValues), max: Math.max(...priceValues) }
        : { min: 0, max: 1000 },
  }
}

export function buildFacetCounts(products) {
  const categories = {}
  const materials = {}
  const geometries = {}
  const lens = { prescription: 0, standard: 0 }
  const stock = { in: 0, out: 0 }
  products.forEach((p) => {
    if (p.category) categories[p.category] = (categories[p.category] || 0) + 1
    if (p.material) materials[p.material] = (materials[p.material] || 0) + 1
    const g = geometryOf(p)
    if (g) geometries[g] = (geometries[g] || 0) + 1
    const l = lensReadyOf(p)
    if (l) lens[l] += 1
    const inStock = p.quantity == null ? true : Number(p.quantity) > 0
    stock[inStock ? 'in' : 'out'] += 1
  })
  return { categories, materials, geometries, lens, stock }
}

export const LENS_OPTIONS = [
  { value: 'standard', label: 'Standard Rx Ready' },
  { value: 'prescription', label: 'Prescription Titanium' },
]

export const STOCK_OPTIONS = [
  { value: 'in', label: 'In Stock Only' },
  { value: 'out', label: 'Out of Stock' },
]

export function matchesFilters(product, filters) {
  const { search, categories, materials, geometries, price, stock, lens } = filters

  if (search && !toWords(product).includes(search.trim().toLowerCase())) return false
  if (categories.length && !categories.includes(product.category)) return false
  if (materials.length && !materials.includes(product.material)) return false
  if (geometries.length && !geometries.includes(geometryOf(product))) return false

  const bounded = price?.min != null || price?.max != null
  const val = toPrice(product)
  if (bounded) {
    if (price.min != null && val < price.min) return false
    if (price.max != null && val > price.max) return false
  }

  const inStock = product.quantity == null ? true : Number(product.quantity) > 0
  if (stock === 'in' && !inStock) return false
  if (stock === 'out' && inStock) return false
  if (lens && lens !== 'all' && lensReadyOf(product) !== lens) return false

  return true
}

export function applyFilters(products, filters) {
  return products.filter((p) => matchesFilters(p, filters))
}

export function applySort(items, sort) {
  const list = [...items]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => toPrice(a) - toPrice(b))
    case 'price-desc':
      return list.sort((a, b) => toPrice(b) - toPrice(a))
    case 'popularity':
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0))
    case 'name-asc':
      return list.sort((a, b) => String(a.model).localeCompare(String(b.model)))
    default:
      return list
  }
}

// Small deterministic storefront sample so the catalog and its facets render
// something meaningful even before the backend has seeded products.
export const DEMO_FRAMES = [
  { id: -101, model: 'Monarch Lite', brand: 'Norda', category: 'Optical', material: 'Titanium', color: 'Matte Black', size: 'Round 52', sale_price: 320, quantity: 8, rating: 4.8, reviewCount: 42, badge: 'BEST SELLER', gender: 'men' },
  { id: -102, model: 'Venture Classic', brand: 'Meraki', category: 'Sun', material: 'Acetate', color: 'Tortoise', size: 'Square 50', sale_price: 240, quantity: 5, rating: 4.6, reviewCount: 28, gender: 'unisex' },
  { id: -103, model: 'Aurelin Thin', brand: 'Norda', category: 'Optical', material: 'Titanium', color: 'Gunmetal', size: 'Rectangular 54', sale_price: 410, quantity: 3, rating: 4.9, reviewCount: 51, badge: 'NEW', gender: 'men' },
  { id: -104, model: 'Skyline Pilot', brand: 'Ferra', category: 'Sun', material: 'Stainless Steel', color: 'Gold', size: 'Aviator 58', sale_price: 275, quantity: 0, rating: 4.4, reviewCount: 19, gender: 'women' },
  { id: -105, model: 'Muse Cat-Eye', brand: 'Forme', category: 'Optical', material: 'Acetate', color: 'Crystal Rose', size: 'Cat-Eye 50', sale_price: 190, quantity: 12, rating: 4.7, reviewCount: 33, gender: 'women' },
  { id: -106, model: 'Studio Wide', brand: 'Ferra', category: 'Optical', material: 'Acetate', color: 'Havana', size: 'Oversized 56', sale_price: 260, quantity: 7, rating: 4.5, reviewCount: 22, gender: 'unisex' },
  { id: -107, model: 'Prism Reader', brand: 'Meraki', category: 'Reading', material: 'Titanium', color: 'Silver', size: 'Rectangular 48', sale_price: 150, quantity: 25, rating: 4.3, reviewCount: 15, gender: 'unisex' },
  { id: -108, model: 'Trail Sport', brand: 'Forme', category: 'Sport', material: 'Polyamide', color: 'Neon', size: 'Round 46', sale_price: 120, quantity: 9, rating: 4.2, reviewCount: 11, gender: 'unisex' },
  { id: -109, model: 'Regal Aviator', brand: 'Norda', category: 'Sun', material: 'Acetate', color: 'Black Onyx', size: 'Aviator 60', sale_price: 300, quantity: 0, rating: 4.6, reviewCount: 27, gender: 'unisex' },
  { id: -110, model: 'Cradle Flex', brand: 'Meraki', category: 'Optical', material: 'TR90', color: 'Navy', size: 'Square 52', sale_price: 175, quantity: 14, rating: 4.4, reviewCount: 18, gender: 'men' },
]

// Fallback fill used only when the backend returned nothing at all.
export const fallbackCatalog = (live) => (live && live.length > 0 ? live : [...live, ...DEMO_FRAMES])