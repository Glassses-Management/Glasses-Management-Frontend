import { Search, RotateCcw } from 'lucide-react'

function Select({ label, value, onChange, options }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none transition-colors duration-300 dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-100 dark:focus:border-blue-400"
            >
                <option value="all">All</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    )
}

function InventoryFilter({
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    categories,
    statuses,
    onReset,
}) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm transition-colors duration-300 dark:bg-[#1c1c28]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="w-full lg:max-w-xs">
                    <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Search</label>
                    <div className="relative mt-1">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 dark:text-neutral-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by SKU, model, or brand..."
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-blue-400"
                        />
                    </div>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select label="Category" value={category} onChange={setCategory} options={categories} />
                    <Select label="Status" value={status} onChange={setStatus} options={statuses} />
                </div>

                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-white/5"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>
        </div>
    )
}

export default InventoryFilter