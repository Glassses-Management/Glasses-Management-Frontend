import SearchBar from '@/components/data/SearchBar'
import FilterBar from '@/components/data/FilterBar'

function OrderFilter({ search, onSearchChange, filters, onFilterChange, onClearAll, statusOptions, customerOptions }) {
    const filterOptions = [
        { key: 'status', label: 'Order Status', value: filters.status, options: statusOptions },
        { key: 'customer', label: 'Customer', value: filters.customer, options: customerOptions },
    ]

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="w-full shrink-0 lg:max-w-xs">
                <SearchBar
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search by order ID or customer name..."
                />
            </div>
            <FilterBar
                filters={filterOptions}
                onFilterChange={onFilterChange}
                onClearAll={onClearAll}
            />
        </div>
    )
}

export default OrderFilter