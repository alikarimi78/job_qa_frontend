/** Remembers which of a page's dialogs is open and the row it was opened for, so a table can drive several dialogs from one piece of state. */
import { useCallback, useState } from "react";

export default function useDialogState() {
  const [dialog, setDialog] = useState(null);

  const open = useCallback((kind, target = null) => setDialog({ kind, target }), []);
  const close = useCallback(() => setDialog(null), []);
  const isOpen = (kind) => dialog?.kind === kind;

  return { target: dialog?.target ?? null, open, close, isOpen };
}
