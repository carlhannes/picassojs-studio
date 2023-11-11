const storage = {
  getLocalStorage(key: string, initialValue: any) {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  },
  setLocalStorage(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
};

export default storage;
