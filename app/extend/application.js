'use strict';

const Web3 = require('web3');
const ZeroClientProvider = require('web3-provider-engine/zero.js');

const WEB3 = Symbol('Application#web33');

// 为了兼容数据(etherscan为小写,但是web3是区分大小写)一致, 全部hack为小写
// @see https://ethereum.stackexchange.com/questions/2045/is-ethereum-wallet-address-case-sensitiveif (Web3.utils.toChecksumAddress) Web3.utils.toChecksumAddress = address => address.toLowerCase();

module.exports = {

  get web3() {
    if (!this[WEB3]) {
      const providerEngine = ZeroClientProvider(this.config.web3);
      this[WEB3] = new Web3(providerEngine);
    }
    return this[WEB3];
  },
};

