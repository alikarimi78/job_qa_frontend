/** Logo field of the organization form: preview of the current or chosen image, choose/change and remove buttons, and the hidden file input. */
import { LOGO_TYPES } from "../constants";

export default function LogoPicker({ picker }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">لوگوی سازمان</span>

      <div className="flex items-center gap-3">
        {picker.preview && (
          <img
            src={picker.preview}
            alt="لوگوی انتخاب‌شده"
            className="w-11 h-11 shrink-0 rounded-xl object-contain bg-white border border-slate-200"
          />
        )}
        <button
          type="button"
          onClick={picker.openFilePicker}
          className="flex-1 h-11 px-4 rounded-xl text-sm font-medium cursor-pointer
                     text-emerald-800 bg-white border border-emerald-700/40
                     hover:bg-emerald-50 hover:border-emerald-700
                     transition-colors duration-200"
        >
          {picker.preview ? "تغییر لوگو" : "انتخاب لوگو"}
        </button>
        {picker.preview && (
          <button
            type="button"
            onClick={picker.clear}
            className="shrink-0 h-11 px-3 rounded-xl text-sm cursor-pointer
                       text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            حذف
          </button>
        )}
      </div>

      <input
        ref={picker.fileInputRef}
        type="file"
        accept={LOGO_TYPES.join(",")}
        onChange={picker.pickFile}
        className="hidden"
      />

      {picker.error ? (
        <span className="text-xs text-red-600">{picker.error}</span>
      ) : (
        <span className="text-xs text-slate-400">
          اختیاری — PNG، JPG، WEBP یا GIF، حداکثر ۵۱۲ کیلوبایت
        </span>
      )}
    </div>
  );
}
