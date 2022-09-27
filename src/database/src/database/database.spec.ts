import { Pool } from 'pg';

import { DatabaseService } from './database';
import { DBTransaction } from './models/db-transaction';

// #############################################################################
// Mocks implementation

const mPoolClient = {
  query: jest.fn().mockImplementation((query) => ({ rows: [], rowCount: 0 })),
  release: jest.fn().mockImplementation((dbOptions) => null)
};

const mPool = {
  connect: jest.fn().mockImplementation((dbOptions) => mPoolClient)
};

jest.mock('pg', () => {
  return { Pool: jest.fn(() => mPool) };
});

// #############################################################################

describe('Database module', () => {
  let databaseService: DatabaseService;
  let pool: any;

  beforeAll(() => {
    databaseService = new DatabaseService();
    pool = new Pool();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#initConnectionPool', () => {
    it('should be called with the db options', () => {
      const dbOptions = {
        user: 'test',
        host: '127.0.0.1',
        database: 'test',
        password: 'test',
        port: 9000
      };

      databaseService.initConnectionPool(dbOptions);

      expect(Pool).toHaveBeenCalledWith(dbOptions);
    });

    it('should not be called because the instance is already created', () => {
      const dbOptions = {
        user: 'test',
        host: '127.0.0.1',
        database: 'test',
        password: 'test',
        port: 9000
      };

      databaseService.initConnectionPool(dbOptions);

      expect(Pool).not.toHaveBeenCalledWith(dbOptions);
    });
  });

  describe('#execQuery', () => {
    let connectSpy: jest.SpyInstance;
    let querySpy: jest.SpyInstance;
    let releaseSpy: jest.SpyInstance;

    let queryOptions: any;

    beforeEach(() => {
      connectSpy = jest.spyOn(mPool, 'connect');
      querySpy = jest.spyOn(mPoolClient, 'query');
      releaseSpy = jest.spyOn(mPoolClient, 'release');
    });

    beforeEach(async () => {
      queryOptions = { sql: 'select now()', params: [] };
      await databaseService.execQuery(queryOptions);
    });

    it('should get the pool connection', () => {
      expect(connectSpy).toHaveBeenCalled();
    });

    it('should be called with the query options', () => {
      expect(querySpy).toHaveBeenCalledWith({
        text: queryOptions.sql,
        values: queryOptions.params
      });
    });

    it('should be release the pool', () => {
      expect(releaseSpy).toHaveBeenCalled();
    });
  });

  describe('#startTransaction', () => {
    let connectSpy: jest.SpyInstance;

    beforeEach(() => {
      connectSpy = jest.spyOn(mPool, 'connect');
    });

    it('should get the pool connection', async () => {
      await databaseService.startTransaction();
      expect(connectSpy).toHaveBeenCalled();
    });

    it('should returns "DBTransaction" instance', async () => {
      const dbTransaction = await databaseService.startTransaction();
      expect(dbTransaction).toBeInstanceOf(DBTransaction);
    });
  });
});
