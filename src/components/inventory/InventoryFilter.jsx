import { Search, RotateCcw } from 'lucide-react'

function Select({ label, value, onChange, options }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
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
    branch,
    setBranch,
    categories,
    statuses,
    branches,
    onReset,
}) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="w-full lg:max-w-xs">
                    <label className="text-xs font-medium text-gray-500">Search</label>
                    <div className="relative mt-1">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by SKU, model, or brand..."
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
                    <Select label="Category" value={category} onChange={setCategory} options={categories} />
                    <Select label="Status" value={status} onChange={setStatus} options={statuses} />
                    <Select label="Branch" value={branch} onChange={setBranch} options={branches} />
                </div>

                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>
        </div>
    )
}

export default InventoryFilter