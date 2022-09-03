// Type definitions for aws-credstash
//
// Forked from node-credtash v2.0.0 types:
// Project: https://github.com/DavidTanner/nodecredstash
// Definitions by: Mike Cook <https://github.com/migstopheles>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node"/>
import {DynamoDBClientConfig} from '@aws-sdk/client-dynamodb';
import {KMSClientConfig} from '@aws-sdk/client-kms';

interface CredStashConfig {
  table?: string;
  awsOpts?: DynamoDBClientConfig & KMSClientConfig;
  dynamoOpts?: DynamoDBClientConfig;
  kmsKey?: string;
  kmsOpts?: KMSClientConfig;
}

interface CredStashContext {
  [key: string]: string;
}

interface PutSecretOptions {
  name: string;
  secret: string;
  context?: CredStashContext;
  digest?: string;
  version?: number;
}

export class CredStash {
  constructor(config: CredStashConfig);
  getHighestVersion: (options: {
    name: string;
  }) => Promise<AWS.DynamoDB.AttributeMap>;
  incrementVersion: (options: {name: string}) => Promise<string>;
  putSecret: (
    options: PutSecretOptions,
  ) => Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>;
  decryptStash: (
    stash: {key: string},
    context?: CredStashContext,
  ) => Promise<AWS.KMS.DecryptResponse>;
  getAllVersions: (options: {
    name: string;
    context?: CredStashContext;
    limit?: number;
  }) => Promise<Array<{version: string; secret: string}>>;
  getSecret: (options: {
    name: string;
    context?: CredStashContext;
    version?: number;
  }) => Promise<string>;
  deleteSecrets: (options: {
    name: string;
  }) => Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput[]>;
  deleteSecret: (options: {
    name: string;
    version: number;
  }) => Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>;
  listSecrets: () => Promise<string[]>;
  getAllSecrets: (options: {
    version?: number;
    context?: CredStashContext;
    startsWith?: string;
  }) => Promise<{[key: string]: string}>;
  createDdbTable: () => Promise<void>;
}

export function credStashInit(config: CredStashConfig): CredStash;
