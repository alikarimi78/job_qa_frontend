/** Simple table driven by a column list (`header`, `cell(row)`, optional `align` and `className`); shows the `empty` text when there are no rows. */
const alignmentClass = (column) => (column.align === "end" ? "text-end" : "text-start");

export default function DataTable({ columns, rows, empty }) {
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
                  ${alignmentClass(column)}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/70 transition-colors duration-150">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-3 py-3 border-b border-slate-200 align-middle
                    ${alignmentClass(column)}
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
