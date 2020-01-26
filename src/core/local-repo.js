import nodeSlug from 'slug';
import storage from './generic/store';

if (!storage.customexamples) {
  storage.customexamples = [];
}

let examples = storage.customexamples;

function slugify(text) {
  return nodeSlug(text.toLowerCase());
}

const localPrefix = '@local/';

const localRepo = {
  list: async () => {
    // Since examples is a proxied array,
    // rebuild it as an actual array
    // to let react/ant handle it like a real array
    // this is not very performant however... but oh well :)
    const arr = [];
    for (let i = 0; i < examples.length; i += 1) {
      arr.push({
        ...examples[i],
        id: `${localPrefix}${examples[i].id}`,
      });
    }
    return arr;
  },

  new: async (item) => {
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

    return {
      ...newItem,
      id: `${localPrefix}${newItem.id}`,
    };
  },

  idExists: (prefixedId) => {
    const id = prefixedId.replace(localPrefix, '');
    for (let i = 0; i < examples.length; i += 1) {
      const cur = examples[i];
      if (cur.id === id) {
        return true;
      }
    }
    return false;
  },

  fork: async (item) => {
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

  update: async (updateItem) => {
    const item = updateItem;
    item.id = item.id.replace(localPrefix, '');
    for (let i = 0; i < examples.length; i += 1) {
      if (examples[i].id === item.id) {
        examples[i] = {
          ...examples[i],
          ...item,
        };
      }
    }
  },

  get: async (prefixedId) => {
    const id = prefixedId.replace(localPrefix, '');
    for (let i = 0; i < examples.length; i += 1) {
      const cur = examples[i];
      if (cur.id === id.replace(localPrefix, '')) {
        return cur;
      }
    }
    return false;
  },

  delete: async (prefixedId) => {
    const id = prefixedId.replace(localPrefix, '');
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
