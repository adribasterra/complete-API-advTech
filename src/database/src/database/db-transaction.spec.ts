import { Pool } from 'pg';

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

describe('DBTransaction module', () => {
  let transactionService: DBTransaction;
  let pool: any;

  beforeEach(async () => {
    pool = new Pool();
    transactionService = new DBTransaction(await pool.connect());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#On init', () => {
    let querySpy: jest.SpyInstance;

    beforeEach(() => {
      querySpy = jest.spyOn(mPoolClient, 'query');
    });

    it('should be started the transaction', () => {
      expect(querySpy).toHaveBeenCalledWith('BEGIN');
    });
  });

  describe('#commit', () => {
    let querySpy: jest.SpyInstance;
    let releaseSpy: jest.SpyInstance;

    beforeEach(() => {
      querySpy = jest.spyOn(mPoolClient, 'query');
      releaseSpy = jest.spyOn(mPoolClient, 'release');
    });

    it('should be committed the transaction', async () => {
      await transactionService.commit();
      expect(querySpy).toHaveBeenCalledWith('COMMIT');
    });

    it('should be release the pool', async () => {
      await transactionService.commit();
      expect(releaseSpy).toHaveBeenCalled();
    });
  });

  describe('#rollback', () => {
    let querySpy: jest.SpyInstance;
    let releaseSpy: jest.SpyInstance;

    beforeEach(() => {
      querySpy = jest.spyOn(mPoolClient, 'query');
      releaseSpy = jest.spyOn(mPoolClient, 'release');
    });

    it('should be cancelled the transaction', async () => {
      await transactionService.rollback();
      expect(querySpy).toHaveBeenCalledWith('ROLLBACK');
    });

    it('should be release the pool', async () => {
      await transactionService.rollback();
      expect(releaseSpy).toHaveBeenCalled();
    });
  });

  describe('#addQuery', () => {
    let querySpy: jest.SpyInstance;
    let releaseSpy: jest.SpyInstance;

    beforeEach(() => {
      querySpy = jest.spyOn(mPoolClient, 'query');
      releaseSpy = jest.spyOn(mPoolClient, 'release');
    });

    describe('When the transaction has not been closed', () => {
      let queryOptions: any;

      beforeEach(async () => {
        queryOptions = { sql: 'select now()', params: [] };
        await transactionService.addQuery(queryOptions);
      });

      it('should be called with the query options', () => {
        expect(querySpy).toHaveBeenCalledWith({
          text: queryOptions.sql,
          values: queryOptions.params
        });
      });

      it('should not be release the pool because the transaction is not finished', async () => {
        expect(releaseSpy).not.toHaveBeenCalled();
      });
    });

    describe('When the transaction has been closed with a commit', () => {
      beforeEach(async () => {
        await transactionService.commit();
      });

      it('should throw a TransactionError', () => {
        const queryOptions = { sql: 'select now()' };

        expect(transactionService.addQuery(queryOptions)).rejects.toThrow(
          'TransactionError: The transaction has already been completed.'
        );
      });
    });

    describe('When the transaction has been closed with a rollback', () => {
      beforeEach(async () => {
        await transactionService.rollback();
      });

      it('should throw a TransactionError', () => {
        const queryOptions = { sql: 'select now()' };

        expect(transactionService.addQuery(queryOptions)).rejects.toThrow(
          'TransactionError: The transaction has already been completed.'
        );
      });
    });
  });
});
