import { Archive, PackageCheck, AlertTriangle, PackageX } from 'lucide-react'

const cards = [
    {
        key: 'total',
        label: 'Total Products',
        icon: Archive,
        iconClass: 'bg-blue-100 text-blue-600',
    },
    {
        key: 'inStock',
        label: 'In Stock',
        icon: PackageCheck,
        iconClass: 'bg-green-100 text-green-600',
    },
    {
        key: 'lowStock',
        label: 'Low Stock',
        icon: AlertTriangle,
        iconClass: 'bg-orange-100 text-orange-600',
    },
    {
        key: 'outOfStock',
        label: 'Out Of Stock',
        icon: PackageX,
        iconClass: 'bg-red-100 text-red-600',
    },
]

function InventoryStats({ stats }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon
                return (
                    <div
                        key={card.key}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="mt-1 text-[28px] font-semibold leading-tight text-gray-900">
                                    {stats[card.key]}
                                </p>
                            </div>
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}>
                                <Icon size={20} />
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default InventoryStats