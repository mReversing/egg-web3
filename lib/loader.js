'use strict';

const Web3 = require('web3');

// 为了兼容数据(etherscan为小写,但是web3是区分大小写)一致, 全部hack为小写
// @see https://ethereum.stackexchange.com/questions/2045/is-ethereum-wallet-address-case-sensitive
if (Web3.utils.toChecksumAddress) Web3.utils.toChecksumAddress = address => address.toLowerCase();

module.exports = app => {
  const { engine, ...config } = app.config.web3;
  let provider;
  let web3;

  if (engine === 'web3') {
    const type = getConnectionType(config.rpcUrl);
    const Provider = Web3.providers[type === 'ws' ? 'WebsocketProvider' : 'HttpProvider'];

    // TODO remove if issue fixed
    if (type === 'ws') { // @see https://github.com/ethereum/web3.js/issues/1354#issuecomment-389722913
      const send = Provider.prototype.send;
      let reconnect = 0;
      Provider.prototype.send = function () {
        if (
          [ this.connection.CLOSED, this.connection.CLOSING ].indexOf(this.connection.readyState) >= 0 &&
          reconnect <= 3 // reconnect 3 times
        ) {
          provider = new Provider(config.rpcUrl);
          web3.setProvider(provider);
          reconnect++;

          setTimeout(() => {
            send.apply(provider, arguments)
          }, 10);
          return;
        }
        return send.apply(this, arguments);
      };
    }

    provider = new Provider(config.rpcUrl);
  } else {
    throw new Error(`The web3 provider ${engine} is not support yet.`);
  }
  return web3 = new Web3(provider);
};

function getConnectionType(rpcUrl) {
  if (!rpcUrl) return undefined

  const protocol = rpcUrl.split(':')[0]
  switch (protocol) {
    case 'http':
    case 'https':
      return 'http';
    case 'ws':
    case 'wss':
      return 'ws';
    default:
      throw new Error(`rpcUrl "${rpcUrl}" protocol is not support yet.`);
  }
}
