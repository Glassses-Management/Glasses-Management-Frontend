import DataTable from '@/components/data/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/utils/format'

const PAYMENT_STATUS_VARIANT = {
    PAID: 'success',
    PARTIAL: 'info',
    UNPAID: 'warning',
}

function OrderTable({ orders, onViewDetail }) {
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
            header: 'Action',
            render: (row) => (
                <Button variant="outline" size="sm" onClick={() => onViewDetail(row)}>
                    View Detail
                </Button>
            ),
        },
    ]

    return <DataTable columns={columns} data={orders} />
}

export default OrderTable