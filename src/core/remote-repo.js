import API from './api/api';
import debounce from './generic/debounce';

let examples = [];

const refetch = debounce(async () => {
  const result = await API.get('api/sandboxes');
  console.log(result);
  examples = result.sandboxes;
}, 1000, true);

const remoteRepo = {
  list: async () => {
    await refetch();
    return examples;
  },

  new: async (item) => {
    if (!item.title) {
      return 'No item title';
    }

    const defaults = {
      code: '',
      data: '',
    };

    const newItem = { ...defaults, ...item };

    const result = await API.post('api/sandboxes', newItem);

    examples.push(result);

    return result;
  },

  fork: item => remoteRepo.new({ code: item.code, data: item.data, title: `${item.title} (forked) ` }),

  update: (updateItem) => {
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

  get: (prefixedId) => {
    const id = prefixedId.replace(localPrefix, '');
    for (let i = 0; i < examples.length; i += 1) {
      const cur = examples[i];
      if (cur.id === id.replace(localPrefix, '')) {
        return cur;
      }
    }
    return false;
  },

  delete: (prefixedId) => {
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

export default remoteRepo;
