export default function DataTable({ columns, rows, rowKey = (row) => row.id, empty }) {
  if (!rows.length) {
    return <p className="text-sm text-slate-500">{empty ?? "موردی برای نمایش وجود ندارد."}</p>;
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  text-xs font-medium text-slate-500 px-3 py-3 whitespace-nowrap
                  border-b border-slate-200
                  ${column.align === "end" ? "text-end" : "text-start"}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-slate-50/70 transition-colors duration-150">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-3 py-3 border-b border-slate-200 align-middle
                    ${column.align === "end" ? "text-end" : "text-start"}
                    ${column.className ?? ""}
                  `}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RowActions({ children }) {
  return <div className="flex items-center justify-end gap-2">{children}</div>;
}
