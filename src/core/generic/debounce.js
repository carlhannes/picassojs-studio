// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export default function debounce(func, wait, immediate) {
  let timeout;
  return function debouncedFunc(...args) {
    const context = this;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    if (immediate && !timeout) func.apply(context, args);
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
