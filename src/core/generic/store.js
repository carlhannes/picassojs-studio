/* global window */

import watch from './watch';

window.localStorage.simpleStore = window.localStorage.simpleStore || '{}';

const rawStore = JSON.parse(window.localStorage.simpleStore);

const storage = watch(rawStore, () => {
  setTimeout(() => {
    window.localStorage.simpleStore = JSON.stringify(storage);
  }, 1);
});

export default storage;
