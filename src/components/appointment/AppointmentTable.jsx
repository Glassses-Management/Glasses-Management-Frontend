import { Ban, Trash2 } from 'lucide-react'
import DataTable from '@/components/data/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DropdownMenu from '@/components/ui/DropdownMenu'
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
          {row.scheduled_at ? formatDateTime(row.scheduled_at) : <span className="text-amber-600 dark:text-amber-400">Not scheduled yet</span>}
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
      header: '',
      render: (row) => {
        const menuItems = []
        if (row.status !== 'CANCELLED') {
          menuItems.push({
            label: 'Cancel appointment',
            icon: <Ban size={14} />,
            onSelect: () => onCancel?.(row),
          })
        }
        menuItems.push({
          label: 'Delete',
          icon: <Trash2 size={14} />,
          danger: true,
          onSelect: () => onDelete?.(row),
        })

        return (
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {(row.status === 'PENDING_REVIEW' || !row.scheduled_at) && (
              <Button size="sm" onClick={() => onOpenSchedule?.(row)}>
                Schedule
              </Button>
            )}
            <DropdownMenu items={menuItems} label={`Actions for appointment #${row.id}`} />
          </div>
        )
      },
    },
  ]

  // Clicking anywhere on a row opens Edit, which also covers changing the
  // status. Cancel and Delete sit behind the "..." menu so a row stays quiet.
  return <DataTable columns={columns} data={appointments} onRowClick={onEdit} />
}

export default AppointmentTable