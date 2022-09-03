'use strict';

import {
  DecryptCommand,
  GenerateDataKeyCommand,
  KMS as KMSClient,
  KMSClientConfig,
} from '@aws-sdk/client-kms';
import utils from './utils.js';

class KMS {
  kms: KMSClient;
  kmsKey: string;

  constructor(kmsKey: string, awsOpts: KMSClientConfig) {
    this.kms = new KMSClient(awsOpts);
    this.kmsKey = kmsKey;
  }

  async decrypt(
    key: string,
    context: {
      [key: string]: string;
    },
  ) {
    return this.kms.send(
      new DecryptCommand({
        CiphertextBlob: utils.b64decode(key),
        EncryptionContext: context,
      }),
    );
  }

  async getEncryptionKey(context: {[key: string]: string}) {
    return this.kms.send(
      new GenerateDataKeyCommand({
        KeyId: this.kmsKey,
        EncryptionContext: context,
        NumberOfBytes: 64,
      }),
    );
  }
}

module.exports = KMS;
