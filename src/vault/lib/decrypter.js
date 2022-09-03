'use strict';

const aesjs = require('aes-js');

const utils = require('./utils');

module.exports = {
  decryptAes(key, encrypted) {
    const decoded = utils.b64decode(encrypted);
    const counter = new aesjs.Counter(1);

    const aesCtr = new aesjs.ModeOfOperation.ctr(key, counter);
    const encoded = aesCtr.decrypt(decoded);
    const decrypted = aesjs.utils.utf8.fromBytes(encoded);

    return decrypted;
  },

  decrypt(item, kms) {
    const {name, contents, hmac, digest} = item;

    const keys = utils.splitKmsKey(kms.Plaintext);

    const hmacCalc = utils.calculateHmac(digest.S, keys.hmacKey, contents.S);

    if (hmacCalc !== hmac.S) {
      throw new Error(`Computed HMAC on ${name.S} does not match stored HMAC`);
    }

    const decrypted = this.decryptAes(keys.dataKey, contents.S);
    return decrypted;
  },
};
