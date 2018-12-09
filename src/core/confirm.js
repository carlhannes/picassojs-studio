/* global window */

export default function confirm(name, callback) {
  const result = window.confirm(name);

  if (result !== null) {
    callback(result);
  }
}
