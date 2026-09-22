import { Boxes, Image, Layers, Tag } from 'lucide-react'

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#1c1c28]">
      <div className="flex items-center gap-2">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tint}`}>
          <Icon size={16} />
        </span>
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-gray-900 dark:text-neutral-50">{value}</p>
    </div>
  )
}

function ProductStats({ total, categories, brands, withImages }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Boxes}
        label="Total Products"
        value={total}
        tint="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
      />
      <StatCard
        icon={Layers}
        label="Product Categories"
        value={categories}
        tint="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
      />
      <StatCard
        icon={Tag}
        label="Brands"
        value={brands}
        tint="bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
      />
      <StatCard
        icon={Image}
        label="Products With Images"
        value={withImages}
        tint="bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-neutral-300"
      />
    </div>
  )
}

export default ProductStats