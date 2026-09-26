import DataTable from '@/components/data/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProductImage from '@/components/product/ProductImage'
import { formatCurrency, formatDate } from '@/utils/format'

const PAYMENT_STATUS_VARIANT = {
    PAID: 'success',
    PARTIAL: 'info',
    UNPAID: 'warning',
}

const MAX_THUMBS = 3

function OrderProducts({ items = [], images = {} }) {
    if (items.length === 0) {
        return <span className="text-gray-400 dark:text-neutral-600">&mdash;</span>
    }

    const shown = items.slice(0, MAX_THUMBS)
    const extra = items.length - shown.length

    return (
        <div className="flex items-center gap-1.5">
            {shown.map((item) => (
                <ProductImage
                    key={item.id}
                    className="h-9 w-9 shrink-0 rounded-md object-contain"
                    src={images[item.product_id] || ''}
                    alt={item.product?.model || `Product #${item.product_id}`}
                />
            ))}
            {extra > 0 && (
                <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">+{extra}</span>
            )}
        </div>
    )
}

function OrderTable({ orders, images, onRowClick, onEdit, onDelete }) {
    const columns = [
        {
            key: 'id',
            header: 'Order ID',
            render: (row) => <span className="font-medium text-gray-900 dark:text-neutral-100">#{row.id}</span>,
        },
        {
            key: 'customer',
            header: 'Customer',
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-100">{row.customer_name || '—'}</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">Customer #{row.customer_id ?? '—'}</p>
                </div>
            ),
        },
        {
            key: 'products',
            header: 'Products',
            render: (row) => <OrderProducts items={row.items} images={images} />,
        },
        {
            key: 'total',
            header: 'Total',
            render: (row) => <span className="font-medium text-gray-900 dark:text-neutral-100">{formatCurrency(row.total)}</span>,
        },
        {
            key: 'payment_status',
            header: 'Payment Status',
            render: (row) => (
                <Badge text={row.payment_status} variant={PAYMENT_STATUS_VARIANT[row.payment_status]} />
            ),
        },
        {
            key: 'status',
            header: 'Order Status',
            render: (row) => <Badge text={row.status} />,
        },
        {
            key: 'order_date',
            header: 'Order Date',
            render: (row) => <span className="text-gray-900 dark:text-neutral-100">{formatDate(row.order_date)}</span>,
        },
        {
            key: 'action',
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Button variant="blue" size="sm" onClick={() => onEdit?.(row)}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete?.(row)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ]

    return <DataTable columns={columns} data={orders} onRowClick={onRowClick} />
}

export default OrderTable