import React, { useState, useEffect } from 'react';
import debounce from './debounce';

const useResize = (
  ref: React.RefObject<HTMLElement>, 
  callback: (rect: DOMRectReadOnly) => void
  ) => {
  useEffect(() => {
    let resizeObserver: ResizeObserver;
    if (ref && ref.current) {
      const debouncer = debounce(callback, 200);
      resizeObserver = new ResizeObserver((entries) => {
        // should only be one
        debouncer(entries[0].contentRect);
      });

      resizeObserver.observe(ref.current);
    }
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [ref, callback]);
};

const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };

  return [storedValue, setValue];
};

export { useResize, useLocalStorage };
