'use strict';

const loader = require('../../lib/loader');

const WEB3 = Symbol('Application#web33');

module.exports = {
  get web3() {
    if (!this[WEB3]) {
      this[WEB3] = loader(this);
    }
    return this[WEB3];
  },
};

