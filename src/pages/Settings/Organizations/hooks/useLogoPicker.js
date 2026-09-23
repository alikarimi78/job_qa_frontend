/** Logo field of the organization form: reads a chosen image as a data URI after checking its type and size, can clear it, and reports what to preview. `null` means "unchanged", an empty string means "remove the logo". */
import { useRef, useState } from "react";
import { LOGO_MAX_BYTES, LOGO_TYPES } from "../constants";

function readAsDataUrl(file, onLoad, onError) {
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result));
  reader.onerror = onError;
  reader.readAsDataURL(file);
}

export default function useLogoPicker(initialLogo) {
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const reset = () => {
    setLogo(null);
    setError("");
    clearFileInput();
  };

  const pickFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) {
      setError("فقط PNG، JPG، WEBP یا GIF");
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      setError(`حجم لوگو حداکثر ${LOGO_MAX_BYTES / 1024} کیلوبایت است`);
      return;
    }
    readAsDataUrl(
      file,
      (dataUrl) => {
        setLogo(dataUrl);
        setError("");
      },
      () => setError("خواندن فایل ممکن نشد")
    );
  };

  const clear = () => {
    setLogo("");
    setError("");
    clearFileInput();
  };

  return {
    logo,
    error,
    preview: logo === null ? initialLogo : logo || null,
    fileInputRef,
    openFilePicker: () => fileInputRef.current?.click(),
    pickFile,
    clear,
    reset,
  };
}
