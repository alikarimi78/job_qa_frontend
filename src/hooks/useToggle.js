/** A boolean that can be flipped, for show/hide sections. */
import { useCallback, useState } from "react";

export default function useToggle(initialValue = false) {
  const [isOn, setIsOn] = useState(initialValue);
  const toggle = useCallback(() => setIsOn((wasOn) => !wasOn), []);
  return [isOn, toggle, setIsOn];
}
