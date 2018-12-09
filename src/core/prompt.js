/* global window */

export default function prompt(name, value, callback) {
  const result = window.prompt(name, value);

  if (result !== null) {
    callback(result);
  }
}
