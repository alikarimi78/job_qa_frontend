/** Read-only dialog listing a record's properties as label/value rows. */
import Modal from "@components/ui/Modal";
import DialogCloseButton from "./DialogCloseButton";

export default function DetailsDialog({ open, title, rows, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="md"
      footer={<DialogCloseButton onClose={onClose} />}
    >
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 flex-wrap py-3
                       border-t border-slate-100 first:border-t-0 first:pt-0"
          >
            <dt className="text-sm text-slate-500">{row.label}</dt>
            <dd className="text-sm font-medium text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
