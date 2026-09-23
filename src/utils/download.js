/** Browser download helpers: cleans a title into a safe file name and saves a Blob (such as a PDF report) to disk. */
const UNSAFE_FILENAME_CHARACTERS = /[\\/:*?"<>|\n\r\t]+/g;
const MAX_FILENAME_LENGTH = 80;

export function safeFileName(name, fallback) {
  const cleaned = String(name ?? "")
    .replace(UNSAFE_FILENAME_CHARACTERS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_FILENAME_LENGTH);
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
