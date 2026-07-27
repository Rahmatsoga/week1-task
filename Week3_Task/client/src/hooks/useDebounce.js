import { useEffect, useState } from "react";

/**
 * Returns a "delayed echo" of the given value that only updates after
 * the value has stopped changing for `delayMs`. Used on the search
 * input so we don't fire an API request on every keystroke — only
 * once the user pauses typing.
 *
 * How it works: every time `value` changes, we schedule a timer to
 * update `debouncedValue` after `delayMs`. If `value` changes again
 * before that timer fires, the cleanup function cancels the old timer
 * before a new one is scheduled — so only the *last* pause in typing
 * ever actually results in an update.
 */
export default function useDebounce(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timer); // cancel if value changes before the timer fires
  }, [value, delayMs]);

  return debouncedValue;
}
