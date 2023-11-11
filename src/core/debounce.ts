export type DebouncedFn = (value: any) => void;

const debouncer = (
  callback: (value: any) => void,
  delay: number = 200
  ): ((value: any) => void) => {
  let handler: NodeJS.Timeout | null = null;
  return (value: any) => {
    if (handler) {
      clearTimeout(handler);
    }
    handler = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

export default debouncer;
