import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import InventoryStats from '@/components/inventory/InventoryStats'
import InventoryFilter from '@/components/inventory/InventoryFilter'
import InventoryTable from '@/components/inventory/InventoryTable'
import mockData from '@/mockData/mockInventory.json'

const ITEMS_PER_PAGE = 10

function buildPageNumbers(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const set = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
    const ordered = [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
    const result = []
    for (let i = 0; i < ordered.length; i++) {
        if (i > 0 && ordered[i] - ordered[i - 1] > 1) result.push('...')
        result.push(ordered[i])
    }
    return result
}

function InventoryList() {
    const items = mockData.items

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [status, setStatus] = useState('all')
    const [branch, setBranch] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    const categories = useMemo(() => [...new Set(items.map((i) => i.category))].sort(), [items])
    const statuses = useMemo(() => ['In Stock', 'Low Stock', 'Out Of Stock'], [])
    const branches = useMemo(() => [...new Set(items.map((i) => i.branch))].sort(), [items])

    const stats = useMemo(() => ({
        total: items.length,
        inStock: items.filter((i) => i.status === 'In Stock').length,
        lowStock: items.filter((i) => i.status === 'Low Stock').length,
        outOfStock: items.filter((i) => i.status === 'Out Of Stock').length,
    }), [items])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return items.filter((i) => {
            const matchesSearch =
                !q ||
                i.sku.toLowerCase().includes(q) ||
                (i.model || '').toLowerCase().includes(q) ||
                (i.brand || '').toLowerCase().includes(q)
            const matchesCategory = category === 'all' || i.category === category
            const matchesStatus = status === 'all' || i.status === status
            const matchesBranch = branch === 'all' || i.branch === branch
            return matchesSearch && matchesCategory && matchesStatus && matchesBranch
        })
    }, [items, search, category, status, branch])

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const effectivePage = Math.min(currentPage, totalPages)
    const paginatedProducts = filtered.slice(
        (effectivePage - 1) * ITEMS_PER_PAGE,
        effectivePage * ITEMS_PER_PAGE,
    )

    const updateSearch = (value) => {
        setSearch(value)
        setCurrentPage(1)
    }

    const updateCategory = (value) => {
        setCategory(value)
        setCurrentPage(1)
    }

    const updateStatus = (value) => {
        setStatus(value)
        setCurrentPage(1)
    }

    const updateBranch = (value) => {
        setBranch(value)
        setCurrentPage(1)
    }

    const resetFilters = () => {
        setSearch('')
        setCategory('all')
        setStatus('all')
        setBranch('all')
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 text-gray-900 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Inventory</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage product stock levels across all branches.
                    </p>
                </div>

                <InventoryStats stats={stats} />

                <InventoryFilter
                    search={search}
                    setSearch={updateSearch}
                    category={category}
                    setCategory={updateCategory}
                    status={status}
                    setStatus={updateStatus}
                    branch={branch}
                    setBranch={updateBranch}
                    categories={categories}
                    statuses={statuses}
                    branches={branches}
                    onReset={resetFilters}
                />

                <InventoryTable products={paginatedProducts} />

                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-sm text-gray-500">
                        Showing{' '}
                        {filtered.length === 0 ? 0 : (effectivePage - 1) * ITEMS_PER_PAGE + 1}–
                        {Math.min(effectivePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} records
                    </p>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => p - 1)}
                            disabled={effectivePage <= 1}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {buildPageNumbers(effectivePage, totalPages).map((page, i) =>
                            page === '...' ? (
                                <span key={`ellipsis-${i}`} className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-400">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={
                                        page === effectivePage
                                            ? 'inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-medium text-white'
                                            : 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-600 transition-colors hover:bg-gray-100'
                                    }
                                >
                                    {page}
                                </button>
                            ),
                        )}

                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={effectivePage >= totalPages}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                            aria-label="Next page"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InventoryList