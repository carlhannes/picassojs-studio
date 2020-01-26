import API from './api/api';

let USER_STATE = {
  loggedin: false,
};

let userStatePromiseResolver = null;
let userStatePromise = new Promise((resolve) => {
  userStatePromiseResolver = resolve;
});

export async function refresh() {
  try {
    const newUserState = await API.get('api/user');
    USER_STATE = {
      loggedin: true,
      ...newUserState,
    };
  } catch (e) {
    // ignore
  }

  userStatePromiseResolver(USER_STATE);
  userStatePromise = null;

  return USER_STATE;
}

export function getUser() {
  if (userStatePromise) {
    return userStatePromise;
  }
  return Promise.resolve(USER_STATE);
}
