import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import InventoryStats from '@/components/inventory/InventoryStats'
import InventoryFilter from '@/components/inventory/InventoryFilter'
import InventoryTable from '@/components/inventory/InventoryTable'
import { getInventories } from '@/api/inventoryApi'

const ITEMS_PER_PAGE = 10

const deriveStatus = (item) => {
    if (item.quantity <= 0) return 'Out Of Stock'
    if (item.reorder_threshold != null && item.quantity <= item.reorder_threshold) return 'Low Stock'
    return 'In Stock'
}

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
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [status, setStatus] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            try {
                const data = await getInventories()
                if (cancelled) return
                setItems(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('InventoryList: failed to load inventory:', err?.response?.status || err?.message || err)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [])

    const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(), [items])
    const statuses = useMemo(() => ['In Stock', 'Low Stock', 'Out Of Stock'], [])

    const stats = useMemo(() => ({
        total: items.length,
        inStock: items.filter((i) => deriveStatus(i) === 'In Stock').length,
        lowStock: items.filter((i) => deriveStatus(i) === 'Low Stock').length,
        outOfStock: items.filter((i) => deriveStatus(i) === 'Out Of Stock').length,
    }), [items])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return items.filter((i) => {
            const itemStatus = deriveStatus(i)
            const matchesSearch =
                !q ||
                (i.sku || '').toLowerCase().includes(q) ||
                (i.model || '').toLowerCase().includes(q) ||
                (i.brand || '').toLowerCase().includes(q)
            const matchesCategory = category === 'all' || i.category === category
            const matchesStatus = status === 'all' || itemStatus === status
            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [items, search, category, status])

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const effectivePage = Math.min(currentPage, totalPages)
    const paginatedProducts = filtered
        .map((i) => ({ ...i, status: deriveStatus(i) }))
        .slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE)

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

    const resetFilters = () => {
        setSearch('')
        setCategory('all')
        setStatus('all')
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen p-4 text-gray-900 md:p-6 transition-colors duration-300 dark:text-neutral-100">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold dark:text-neutral-50">Inventory</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Manage product stock levels.
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
                    categories={categories}
                    statuses={statuses}
                    onReset={resetFilters}
                />

                {loading ? (
                    <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm transition-colors duration-300 dark:bg-[#1c1c28] dark:text-neutral-400">
                        Loading inventory...
                    </div>
                ) : (
                    <>
                        <InventoryTable products={paginatedProducts} />

                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <p className="text-sm text-gray-500 dark:text-neutral-400">
                                Showing{' '}
                                {filtered.length === 0 ? 0 : (effectivePage - 1) * ITEMS_PER_PAGE + 1}–
                                {Math.min(effectivePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} records
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    disabled={effectivePage <= 1}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors duration-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-neutral-400 dark:hover:bg-white/10 dark:disabled:text-neutral-600"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {buildPageNumbers(effectivePage, totalPages).map((page, i) =>
                                    page === '...' ? (
                                        <span key={`ellipsis-${i}`} className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-400 dark:text-neutral-500">
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
                                                    : 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-white/10'
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
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors duration-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-neutral-400 dark:hover:bg-white/10 dark:disabled:text-neutral-600"
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default InventoryList
