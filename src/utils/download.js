// Saving a blob the API answered with. RTK Query hands back the body and nothing else,
// so the file's name is decided here rather than read from Content-Disposition — the
// backend still sets that header (`job-report-<jalali date>.pdf`) for anyone calling the
// endpoint directly, but a person downloading three reports in a row wants to tell them
// apart, and the job's name does that where a shared date does not.

// Characters a filesystem or a browser would object to, plus the ones that make a name
// awkward to type back. Persian letters are left alone: every modern browser writes them.
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
  // Revoked on the next tick, not inline: Safari has been known to cancel the download
  // when the object URL disappears in the same frame as the click.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
