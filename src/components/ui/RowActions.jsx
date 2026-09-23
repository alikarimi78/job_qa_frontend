/** Right-aligned row of icon buttons for the last column of a DataTable. */
export default function RowActions({ children }) {
  return <div className="flex items-center justify-end gap-2">{children}</div>;
}
