/** Resets a react-hook-form form to fresh values every time its dialog opens (and when the record it edits changes), so a dialog never shows what was typed the last time. */
import { useEffect, useRef } from "react";

export default function useFormResetOnOpen(methods, isOpen, buildValues, dependencies = []) {
  const buildValuesRef = useRef(buildValues);
  buildValuesRef.current = buildValues;

  useEffect(() => {
    if (isOpen) methods.reset(buildValuesRef.current());
  }, [isOpen, methods, ...dependencies]);
}
