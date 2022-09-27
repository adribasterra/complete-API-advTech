import 'reflect-metadata';
import { Container } from 'typedi';
import { DatabaseService, DBQuery } from '../../../database/src/index';
import { StoreCustomer } from '../storeCustomer.model';
import { StoreCustomerRepository } from '../storeCustomer.repository';

describe('StoreCustomer repository module', () => {
  let storeCustomerRepository: StoreCustomerRepository;
  let databaseServiceMock: any;

  beforeAll(() => {
    databaseServiceMock = {
      execQuery: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(DatabaseService, databaseServiceMock);
    storeCustomerRepository = Container.get(StoreCustomerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAllCustomers', () => {
    let storeCustomerFindAllSpy: jest.SpyInstance;
    let storeCustomers: StoreCustomer[];
    beforeAll(() => {
      storeCustomerFindAllSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    beforeAll(() => {
      storeCustomers = [
        {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: 200
        }
      ];

      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: storeCustomers,
        rowCount: storeCustomers.length
      }));
    });

    describe('when there are not any filter options', () => {
      it('should get all storeCustomers of the database', () => {
        return storeCustomerRepository.findAllCustomers(1).then((_storeCustomers) => {
          expect(_storeCustomers).not.toBeNull();
          expect(_storeCustomers).toHaveLength(storeCustomers.length);
          expect(_storeCustomers).toEqual(storeCustomers);

          expect(storeCustomerFindAllSpy).toHaveBeenCalled();
          expect(storeCustomerFindAllSpy).toHaveBeenCalledTimes(1);
          expect(storeCustomerFindAllSpy).toHaveBeenCalledWith({
            sql:
              'SELECT * FROM public.store_customer WHERE idstore = $1',
            params: [storeCustomers[0].id]
          });
        });
      });
    });

  });

  describe('#findAllStores', () => {
    let storeCustomerFindAllSpy: jest.SpyInstance;
    let storeCustomers: StoreCustomer[];
    beforeAll(() => {
      storeCustomerFindAllSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    beforeAll(() => {
      storeCustomers = [
        {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: 200
        },
        {
          id: 2,
          idstore: 1,
          idcustomer: 2,
          points: 400
        }
      ];

      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: storeCustomers,
        rowCount: storeCustomers.length
      }));
    });

    describe('when there are not any filter options', () => {
      it('should get all storeCustomers of the database', () => {
        return storeCustomerRepository.findAllStores(1).then((_storeCustomers) => {
          expect(_storeCustomers).not.toBeNull();
          expect(_storeCustomers).toHaveLength(storeCustomers.length);
          expect(_storeCustomers).toEqual(storeCustomers);

          expect(storeCustomerFindAllSpy).toHaveBeenCalled();
          expect(storeCustomerFindAllSpy).toHaveBeenCalledTimes(1);
          expect(storeCustomerFindAllSpy).toHaveBeenCalledWith({
            sql:
              'SELECT * FROM public.store_customer WHERE idcustomer = $1',
            params: [storeCustomers[0].idstore]
          });
        });
      });
    });

  });

  describe('#findById', () => {
    describe('when the storeCustomer exists in the database', () => {
      let storeCustomer: StoreCustomer;

      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: 1,
          idcustomer: 3,
          points: 0
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [storeCustomer],
          rowCount: 1
        }));
      });

      it('should return the storeCustomer queried', () => {
        return storeCustomerRepository.findById(1, 3).then((_storeCustomer) => {
          expect(_storeCustomer).not.toBeNull();
          expect(_storeCustomer).toEqual(storeCustomer);
        });
      });
    });

    describe('when the storeCustomer not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: null as any,
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return storeCustomerRepository.findById(1, 3).then((_storeCustomer) => {
          expect(_storeCustomer).toBeNull();
        });
      });
    });
  });

  describe('#create', () => {
    let storeCustomer: StoreCustomer;

    beforeAll(() => {
      storeCustomer = {
        id: 1,
        idstore: 1,
        idcustomer: 1,
        points: 200
      };
    });

    describe('when the storeCustomer does not exist in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [storeCustomer],
          rowCount: 1
        }));
      });

      it('should return the introduced storeCustomer', () => {
        return storeCustomerRepository.create(storeCustomer).then((_storeCustomer) => {
          expect(_storeCustomer).not.toBeNull();
          expect(_storeCustomer).toEqual(storeCustomer);
        });
      });
    });

    describe('when the storeCustomer not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return storeCustomerRepository.create(storeCustomer).then((_storeCustomer) => {
          expect(_storeCustomer).toBeNull();
        });
      });
    });

    describe('when there is an error', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => (null as any));
      });

      it('should return a null value', () => {
        return storeCustomerRepository.create(storeCustomer).then((_storeCustomer) => {
          expect(_storeCustomer).toBeNull();
        });
      });
    });
  });

  describe('#delete', () => {
    let storeCustomerDeleteSpy: jest.SpyInstance;
    let storeCustomers: StoreCustomer[];

    beforeAll(() => {
      storeCustomerDeleteSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    beforeAll(() => {
      storeCustomers = [
        {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: 200
        },
        {
          id: 2,
          idstore: 1,
          idcustomer: 2,
          points: 400
        }
      ];

      const count = storeCustomers.length - 1;
      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: [storeCustomers[1]],
        rowCount: count
      }));
    });

    describe('when id is correct', () => {
      
      it('should delete the storeCustomer of the database', () => {
        return storeCustomerRepository.delete(storeCustomers[1]).then((_storeCustomer) => {
          expect(_storeCustomer).toEqual(storeCustomers[1]);

          expect(storeCustomerDeleteSpy).toHaveBeenCalled();
          expect(storeCustomerDeleteSpy).toHaveBeenCalledTimes(1);
          expect(storeCustomerDeleteSpy).toHaveBeenCalledWith({
            sql:
              'DELETE FROM public.store_customer WHERE idstore = $1 AND idcustomer = $2 RETURNING *',
            params: [storeCustomers[1].idstore, storeCustomers[1].idcustomer]
          });
        });
      });
    });

    describe('when the storeCustomer not exists in the database', () => {
      let storeCustomer: StoreCustomer;

      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return storeCustomerRepository.delete(storeCustomer).then((_storeCustomer) => {
          expect(_storeCustomer).toBeNull();
        });
      });
    });

    describe('when there is an error', () => {
      let storeCustomer: StoreCustomer;

      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => (null as any));
      });

      it('should return a null value', () => {
        return storeCustomerRepository.delete(storeCustomer).then((_storeCustomer) => {
          expect(_storeCustomer).toBeNull();
        });
      });
    });
  });

  describe('#edit', () => {
    describe('when the storeCustomer exists in the database', () => {
      let storeCustomer: StoreCustomer;

      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [storeCustomer],
          rowCount: 1
        }));
      });

      it('should return the storeCustomer queried', () => {
        return storeCustomerRepository.edit(storeCustomer).then((_storeCustomer) => {
          expect(_storeCustomer).not.toBeNull();
          expect(_storeCustomer).toEqual(storeCustomer);
        });
      });
    });

    describe('when the storeCustomer not exists in the database', () => {
      let storeCustomer: StoreCustomer;
      beforeAll(() => {
        storeCustomer = {
          id: -1,
          idstore: 1,
          idcustomer: 1,
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return storeCustomerRepository.edit(storeCustomer).then((_storeCustomer) => {
          expect(_storeCustomer).toBeNull();
        });
      });
    });
  });

  describe('#editPoints', () => {
    let query: DBQuery;
    let storeCustomer: StoreCustomer;

    beforeAll(() => {
      storeCustomer = {
        id: 1,
        idstore: 1,
        idcustomer: 1,
        points: 200
      };
    });
    beforeAll(() => {
      query = {
        sql:
          'UPDATE public.store_customer SET points = $1 WHERE idcustomer = $2 AND idstore = $3 RETURNING *',
        params: [storeCustomer.points, storeCustomer.idcustomer, storeCustomer.idstore]
      }
    });
    it('should call editPoints function', async () => {
      const _query = await storeCustomerRepository.editPoints(storeCustomer);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });

});
