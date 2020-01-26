import storage from '../generic/store';

const BASEURL = 'http://localhost:3000';

const toQueryString = params => `?${Object.entries(params)
  .map(
    ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
  )
  .join('&')}`;

const methods = {
  getToken: () => storage.apikey,
};

const call = (method, route, params, auth = true) => {
  let modroute = route;
  if (method === 'GET' && params) {
    modroute += toQueryString(params);
  }
  const url = `${BASEURL}/${modroute}`;
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(auth && methods.getToken() && { Authorization: `Bearer ${methods.getToken()}` }), // EDIT here based on your api
    },
    ...(params && method !== 'GET' && { body: JSON.stringify(params) }),
  };
  const currentFetch = () => fetch(url, options).then(
    res => (res.ok ? res.json() : Promise.reject(res)), // ERROR handling highly depends on your api
  );

  return currentFetch();
};

methods.login = async () => {
  const data = await call('GET', 'api/users/login', null, false);
  window.location = data.loginpage;
};

methods.refreshToken = async (code) => {
  const data = await call('POST', 'api/users/login', { code }, false);
  if (data && data.user && data.user.id && data.user.token) {
    storage.apikey = data.user.token;
    window.location = '/';
  }
};

methods.logout = async () => {
  storage.apikey = null;
  window.location = '/';
};

['POST', 'PUT', 'DELETE', 'PATCH', 'GET'].forEach((curmethod) => {
  methods[curmethod.toLowerCase()] = (...data) => call(curmethod, ...data);
});

export default methods;
