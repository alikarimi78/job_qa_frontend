// One table for the three management sections, so «عملیات‌ها» lands in the same place
// and looks the same in all of them. Columns are declared rather than written as JSX:
// `{ key, header, cell, align, className }`, where `cell(row)` returns the node.
//
// The wrapper scrolls horizontally by itself. The actions column is the widest thing
// in these tables at a phone width, and without it the whole page would scroll
// sideways instead — which on an RTL page moves the sidebar, not just the table.
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

// The last column of every management table: the round buttons, packed at the end of
// the row. A helper rather than a class string repeated four times, because the gap
// and the alignment are what make the three tables read as one.
//
// `justify-end` anchors the group at the *left* under `dir="rtl"`, so the last child
// keeps its position whatever else the row does or does not offer. That is why delete
// is written last everywhere — a row with one extra action must not slide the
// destructive button under the pointer that was aiming at something else. Reading
// right to left the buttons then come out edit, view, delete, which is the order
// admin_panel.mp4 puts them in.
export function RowActions({ children }) {
  return <div className="flex items-center justify-end gap-2">{children}</div>;
}
