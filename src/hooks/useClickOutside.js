/** Calls a handler when the user presses the mouse anywhere outside the element the returned ref is attached to (used to close dropdowns). */
import { useEffect, useRef } from "react";

export default function useClickOutside(onOutsideClick) {
  const ref = useRef(null);
  const handlerRef = useRef(onOutsideClick);
  handlerRef.current = onOutsideClick;

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handlerRef.current();
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  return ref;
}
