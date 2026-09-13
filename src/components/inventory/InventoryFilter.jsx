import { Search, RotateCcw } from 'lucide-react'
import FilterBar from '@/components/data/FilterBar'

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
    const filterOptions = [
        { key: 'category', label: 'Category', value: category, options: categories.map((c) => ({ value: c, label: c })) },
        { key: 'status', label: 'Status', value: status, options: statuses.map((s) => ({ value: s, label: s })) },
    ]

    const handleFilterChange = (key, value) => {
        if (key === 'category') setCategory(value)
        else if (key === 'status') setStatus(value)
    }

    const handleClearAll = () => {
        setCategory('all')
        setStatus('all')
    }

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm transition-colors duration-300 dark:bg-[#1c1c28]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="w-full shrink-0 lg:max-w-xs">
                    {/* <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400">Search</label> */}
                    <div className="relative">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 dark:text-neutral-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by SKU, model, or brand..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-colors duration-300 dark:border-neutral-700 dark:bg-[#1c1c28] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-violet-400"
                        />
                    </div>
                </div>

                <FilterBar filters={filterOptions} onFilterChange={handleFilterChange} onClearAll={handleClearAll} />

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