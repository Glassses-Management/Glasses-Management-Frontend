import SearchBar from '@/components/data/SearchBar'
import FilterBar from '@/components/data/FilterBar'

function AppointmentFilter({ search, onSearchChange, filters, onFilterChange, onClearAll, statusOptions }) {
    const filterOptions = [
        { key: 'status', label: 'Status', value: filters.status, options: statusOptions },
    ]

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="w-full shrink-0 lg:max-w-xs">
                <SearchBar
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search by customer name…"
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

export default AppointmentFilter
