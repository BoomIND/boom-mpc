// Type definitions for aws-credstash
//
// Forked from node-credtash v2.0.0 types:
// Project: https://github.com/DavidTanner/nodecredstash
// Definitions by: Mike Cook <https://github.com/migstopheles>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node"/>
import {AttributeValue, DeleteItemOutput, DynamoDBClientConfig, PutItemOutput} from '@aws-sdk/client-dynamodb';
import {DecryptResponse, KMSClientConfig} from '@aws-sdk/client-kms';


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
  }) => Promise<AttributeValue>;
  incrementVersion: (options: {name: string}) => Promise<string>;
  putSecret: (
    options: PutSecretOptions,
  ) => Promise<PutItemOutput>;
  decryptStash: (
    stash: {key: string},
    context?: CredStashContext,
  ) => Promise<DecryptResponse>;
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
  }) => Promise<DeleteItemOutput[]>;
  deleteSecret: (options: {
    name: string;
    version: number;
  }) => Promise<DeleteItemOutput>;
  listSecrets: () => Promise<string[]>;
  getAllSecrets: (options: {
    version?: number;
    context?: CredStashContext;
    startsWith?: string;
  }) => Promise<{[key: string]: string}>;
  createDdbTable: () => Promise<void>;
}

export function credStashInit(config: CredStashConfig): CredStash;
