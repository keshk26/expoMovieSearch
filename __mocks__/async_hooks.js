class AsyncLocalStorage {
  constructor() {
    this._store = undefined;
  }
  getStore() {
    return this._store;
  }
  run(store, callback, ...args) {
    this._store = store;
    try {
      return callback(...args);
    } finally {
      this._store = undefined;
    }
  }
  enterWith(store) {
    this._store = store;
  }
  disable() {
    this._store = undefined;
  }
}

module.exports = { AsyncLocalStorage };
