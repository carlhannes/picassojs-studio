import nodeSlug from 'slug';
import storage from './generic/store';

if (!storage.customexamples) {
  storage.customexamples = [];
}

let examples = storage.customexamples;

function slugify(text) {
  return nodeSlug(text.toLowerCase());
}

const localRepo = {
  list: () => {
    // Since examples is a proxied array,
    // rebuild it as an actual array
    // to let react/ant handle it like a real array
    // this is not very performant however... but oh well :)
    const arr = [];
    for (let i = 0; i < examples.length; i += 1) {
      arr.push({ ...examples[i] });
    }
    return arr;
  },

  new: (item) => {
    if (!item.title) {
      return 'No item title';
    }

    const defaults = {
      code: '',
      data: '',
    };

    const newItem = { ...defaults, ...item, id: slugify(item.title) };

    if (localRepo.idExists(newItem.id)) {
      return 'Duplicate item';
    }

    examples.push(newItem);

    return newItem;
  },

  idExists: (id) => {
    for (let i = 0; i < examples.length; i += 1) {
      const cur = examples[i];
      if (cur.id === id) {
        return true;
      }
    }
    return false;
  },

  fork: (item) => {
    let tryName = `${item.title} (forked) `;

    if (!localRepo.idExists(slugify(tryName))) {
      return localRepo.new({ ...item, title: tryName });
    }

    for (let tries = 0; tries < 99; tries += 1) {
      tryName = `${item.title} (fork ${tries + 2}) `;

      if (!localRepo.idExists(slugify(tryName))) {
        return localRepo.new({ ...item, title: tryName });
      }
    }

    return 'Could not find suitable fork name';
  },

  update: (item) => {
    for (let i = 0; i < examples.length; i += 1) {
      if (examples[i].id === item.id) {
        examples[i] = {
          ...examples[i],
          ...item,
        };
      }
    }
  },

  get: (id) => {
    for (let i = 0; i < examples.length; i += 1) {
      const cur = examples[i];
      if (cur.id === id) {
        return cur;
      }
    }
    return false;
  },

  delete: (id) => {
    // Since we can't slice proxies we need to rebuild the array
    const arr = [];
    for (let i = 0; i < examples.length; i += 1) {
      if (examples[i].id !== id) {
        arr.push({ ...examples[i] });
      }
    }
    storage.customexamples = arr;
    examples = storage.customexamples;
    return true;
  },
};

export default localRepo;
