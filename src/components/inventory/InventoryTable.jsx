import { formatCurrency } from '@/utils/format'

const STATUS_BADGE = {
    'In Stock': 'bg-green-100 text-green-700',
    'Low Stock': 'bg-orange-100 text-orange-700',
    'Out Of Stock': 'bg-red-100 text-red-700',
}

const STATUS_DOT = {
    'In Stock': 'bg-green-500',
    'Low Stock': 'bg-orange-500',
    'Out Of Stock': 'bg-red-500',
}

function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-700'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] || 'bg-gray-400'}`} aria-hidden="true" />
            {status}
        </span>
    )
}

function InventoryTable({ products }) {
    if (!products.length) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
                No inventory found
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">SKU</th>
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">Product</th>
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">Brand</th>
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">Category</th>
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">Quantity</th>
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">Cost Price</th>
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">Sale Price</th>
                            <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50">
                                <td className="px-5 py-4 font-medium text-gray-900">{p.sku}</td>
                                <td className="px-5 py-4">
                                    <p className="font-medium text-gray-900">{p.model}</p>
                                    <p className="text-xs text-gray-500">{p.color} · {p.size}</p>
                                </td>
                                <td className="px-5 py-4 text-gray-900">{p.brand}</td>
                                <td className="px-5 py-4 text-gray-900">{p.category}</td>
                                <td className="px-5 py-4 text-gray-900">{p.quantity}</td>
                                <td className="px-5 py-4 text-gray-500">{formatCurrency(p.cost_price)}</td>
                                <td className="px-5 py-4 font-medium text-gray-900">{formatCurrency(p.sale_price)}</td>
                                <td className="px-5 py-4">
                                    <StatusBadge status={p.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InventoryTable