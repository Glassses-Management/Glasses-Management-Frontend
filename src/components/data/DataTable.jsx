// Generic table that renders whatever columns/data it's given.
// A column can supply a custom render(row); otherwise the cell shows row[key] directly.

function DataTable({ columns, data, onRowClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id ?? rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={
                'cursor-pointer transition-colors hover:bg-gray-50' +
                (rowIndex < data.length - 1 ? ' border-b border-gray-100' : '')
              }
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable