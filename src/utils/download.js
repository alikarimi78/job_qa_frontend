const UNSAFE = /[\\/:*?"<>|\n\r\t]+/g;

export function safeFileName(name, fallback) {
  const cleaned = String(name ?? "")
    .replace(UNSAFE, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return cleaned || fallback;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
