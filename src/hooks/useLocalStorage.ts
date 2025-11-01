import { useState, useCallback } from "react";

/**
 * Custom Hook to manage localStorage
 * @param key - localStorage key
 * @param initialValue - initial value if not exists in localStorage
 * @returns Tuple [value, setter] similar to useState
 */
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prevValue) => {
          const valueToStore =
            value instanceof Function ? value(prevValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [key]
  );

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
