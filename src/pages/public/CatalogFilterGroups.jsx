import { useState } from 'react'
import { Circle, ChevronDown, Glasses, RectangleHorizontal, Square } from 'lucide-react'
import CatalogPriceRange from '@/pages/public/CatalogPriceRange'

const GEOMETRIES = [
  { value: 'Round', icon: Circle },
  { value: 'Square', icon: Square },
  { value: 'Rectangular', icon: RectangleHorizontal },
  { value: 'Aviator', icon: Glasses },
]

function FilterGroup({ label, openByDefault = false, badge, children }) {
  const [open, setOpen] = useState(openByDefault)
  return (
    <div className="border-b border-neutral-200 pb-5 dark:border-neutral-700">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {label}
          {badge != null && badge > 0 && (
            <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest dark:bg-leaf/10 dark:text-leaf">{badge}</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform duration-300 dark:text-neutral-500 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg py-1.5 pr-1 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5">
      <span className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 rounded accent-forest dark:accent-leaf"
        />
        {label}
      </span>
      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">{count}</span>
    </label>
  )
}

export default function CatalogFilterGroups({
  categories,
  categoryCounts,
  selectedCategories,
  toggleCategory,
  materials,
  materialCounts,
  selectedMaterials,
  toggleMaterial,
  geometryCounts,
  selectedGeometries,
  toggleGeometry,
  priceBounds,
  price,
  onPriceChange,
  lens,
  setLens,
  lensCounts,
  stock,
  setStock,
  stockCounts,
}) {
  return (
    <div className="space-y-5">
      <FilterGroup label="Category" badge={selectedCategories.length}>
        {categories.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No categories yet.</p>
        ) : (
          <div className="space-y-1">
            {categories.map((c) => (
              <CheckRow
                key={c}
                label={c}
                count={categoryCounts[c] || 0}
                checked={selectedCategories.includes(c)}
                onChange={() => toggleCategory(c)}
              />
            ))}
          </div>
        )}
      </FilterGroup>

      <FilterGroup label="Frame Material" badge={selectedMaterials.length}>
        <div className="space-y-1">
          {materials.map((m) => (
            <CheckRow
              key={m}
              label={m}
              count={materialCounts[m] || 0}
              checked={selectedMaterials.includes(m)}
              onChange={() => toggleMaterial(m)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Frame Geometry" badge={selectedGeometries.length}>
        <div className="grid grid-cols-2 gap-2">
          {GEOMETRIES.map(({ value, icon: Icon }) => {
            const active = selectedGeometries.includes(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleGeometry(value)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium transition-colors ${
                  active
                    ? 'border-forest bg-forest/10 text-forest'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-forest/50 dark:border-neutral-700 dark:bg-[#0E1A15] dark:text-neutral-300 dark:hover:border-leaf/50'
                }`}
              >
                <Icon size={18} />
                {value}
                <span className="text-[10px] font-normal text-neutral-400 dark:text-neutral-500">
                  {geometryCounts[value] || 0}
                </span>
              </button>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Price Range">
        <CatalogPriceRange bounds={priceBounds} value={price} onChange={onPriceChange} />
      </FilterGroup>

      <FilterGroup label="Clinical Lens Ready" badge={lens !== 'all' ? 1 : 0}>
        <div className="space-y-1">
          <CheckRow
            label="Standard Rx Ready"
            count={lensCounts.standard}
            checked={lens === 'standard'}
            onChange={() => setLens(lens === 'standard' ? 'all' : 'standard')}
          />
          <CheckRow
            label="Prescription Titanium"
            count={lensCounts.prescription}
            checked={lens === 'prescription'}
            onChange={() => setLens(lens === 'prescription' ? 'all' : 'prescription')}
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Stock Status" badge={stock !== 'all' ? 1 : 0}>
        <div className="space-y-1">
          <CheckRow
            label="In Stock Only"
            count={stockCounts.in}
            checked={stock === 'in'}
            onChange={() => setStock(stock === 'in' ? 'all' : 'in')}
          />
          <CheckRow
            label="Out of Stock"
            count={stockCounts.out}
            checked={stock === 'out'}
            onChange={() => setStock(stock === 'out' ? 'all' : 'out')}
          />
        </div>
      </FilterGroup>
    </div>
  )
}