'use strict';

import {
  AttributeValue,
  CreateTableCommand,
  DeleteItemCommand,
  DescribeTableCommand,
  DynamoDB as DynamoDBClient,
  DynamoDBClientConfig,
  GetItemCommand,
  PutItemCommand,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandOutput,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';

const debug = require('debug')('credstash');

// function combineResults(curr, next) {
//   if (!curr) {
//     return next;
//   }

//   const combined = Object.assign({}, next, {
//     Items: curr.Items.concat(next.Items),
//     Count: curr.Count + next.Count,
//   });

//   return combined;
// }

// function pageResults(that, fn, parameters, curr) {
//   const params = Object.assign({}, parameters);

//   if (curr) {
//     params.ExclusiveStartKey = curr.LastEvaluatedKey;
//   }
//   return utils.asPromise(that, fn, params).then(next => {
//     const combined = combineResults(curr, next);
//     const nextStep = next.LastEvaluatedKey
//       ? pageResults(that, fn, params, combined)
//       : combined;
//     return nextStep;
//   });
// }

function createAllVersionsQuery(table: string, name: string) {
  const params = {
    TableName: table,
    ConsistentRead: true,
    ScanIndexForward: false,
    KeyConditionExpression: '#name = :name',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': {
        S: name,
      },
    },
    Limit: 100,
  };
  return params;
}

class DynamoDb {
  docClient: DynamoDBClient;
  table: string;
  constructor(table: string, awsOpts: DynamoDBClientConfig) {
    const awsConfig = Object.assign({}, awsOpts);
    this.table = table;
    this.docClient = new DynamoDBClient(awsConfig);
    // const ddb = new AWS.DynamoDB(awsConfig);
  }

  async getAllVersions(name: string, opts: {limit: number}) {
    const options = Object.assign({}, opts);
    const params = createAllVersionsQuery(this.table, name);
    params.Limit = options.limit;
    const out: QueryCommandOutput = await this.docClient.query(params);
    return out;
  }

  async getAllSecretsAndVersions(opts: {limit: number}) {
    const options = Object.assign({}, opts);
    const params = {
      TableName: this.table,
      Limit: options.limit,
      ProjectionExpression: '#name, #version',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#version': 'version',
      },
    };
    const out: ScanCommandOutput = await this.docClient.send(
      new ScanCommand({
        ...params,
      }),
    );
    return out.Items;
  }

  async getLatestVersion(name: string) {
    return this.getAllVersions(name, {
      limit: 1,
    });
  }

  async getByVersion(name: string, version: string) {
    const params = {
      TableName: this.table,
      Key: {
        name: {
          S: name,
        },
        version: {
          S: version,
        },
      },
    };
    return this.docClient.send(new GetItemCommand(params));
  }

  async createSecret(item: {[key: string]: AttributeValue}) {
    const params = {
      Item: item,
      ConditionExpression: 'attribute_not_exists(#name)',
      TableName: this.table,
      ExpressionAttributeNames: {
        '#name': 'name',
      },
    };
    return this.docClient.send(new PutItemCommand(params));
  }

  async deleteSecret(name: string, version: string) {
    const params = {
      TableName: this.table,
      Key: {
        name: {
          S: name,
        },
        version: {
          S: version,
        },
      },
    };
    return this.docClient.send(new DeleteItemCommand(params));
  }

  async createTable() {
    const params = {
      TableName: this.table,
      KeySchema: [
        {
          AttributeName: 'name',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'version',
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'name',
          AttributeType: 'S',
        },
        {
          AttributeName: 'version',
          AttributeType: 'S',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };

    try {
      await this.docClient.send(
        new DescribeTableCommand({TableName: this.table}),
      );
      debug('Table already exists');
    } catch (err) {
      if (err.name !== 'ResourceNotFoundException') {
        throw err;
      }
      debug('Creating table...');
      await this.docClient.send(new CreateTableCommand(params));
      await waitUntilTableExists(
        {
          client: this.docClient,
          maxWaitTime: 15000,
        },
        {
          TableName: this.table,
        },
      );
      debug(
        'Table has been created ' +
          'Go read the README about how to create your KMS key',
      );
    }
  }
}

module.exports = DynamoDb;
