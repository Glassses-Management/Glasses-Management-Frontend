import DataTable from '@/components/data/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDateTime } from '@/utils/format'

const STATUS_VARIANT = {
  PENDING_REVIEW: 'warning',
  SCHEDULED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
}

function AppointmentTable({ appointments, onOpenSchedule, onEdit, onCancel, onDelete }) {
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => <span className="font-medium text-gray-900 dark:text-neutral-100">#{row.id}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-neutral-100">{row.customer_name || `Customer #${row.customer_id || '?'}`}</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400">ID: {row.customer_id || '—'}</p>
        </div>
      ),
    },
    {
      key: 'optometrist',
      header: 'Optometrist',
      render: (row) => (
        <span className="text-gray-900 dark:text-neutral-100">
          {row.optometrist_name || (row.optometrist_id ? `#${row.optometrist_id}` : 'Unassigned')}
        </span>
      ),
    },
    {
      key: 'scheduled_at',
      header: 'Scheduled Time',
      render: (row) => (
        <span className="text-gray-900 dark:text-neutral-100">
          {row.scheduled_at ? formatDateTime(row.scheduled_at) : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge text={row.status} variant={STATUS_VARIANT[row.status] || 'neutral'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {row.status === 'PENDING_REVIEW' && (
            <Button size="sm" onClick={() => onOpenSchedule?.(row)}>
              Schedule
            </Button>
          )}
          <Button variant="blue" size="sm" onClick={() => onEdit?.(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete?.(row)}>
            Delete
          </Button>
          {row.status !== 'CANCELLED' && (
            <Button variant="outline" size="sm" onClick={() => onCancel?.(row)}>
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={appointments} />
}

export default AppointmentTable