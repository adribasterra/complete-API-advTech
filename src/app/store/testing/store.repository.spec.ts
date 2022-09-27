import 'reflect-metadata';
import { Container } from 'typedi';
import { DatabaseService, DBQuery } from '../../../database/src/index';
import { Store } from '../store.model';
import { StoreRepository } from '../store.repository';

describe('Store repository module', () => {
  let storeRepository: StoreRepository;
  let databaseServiceMock: any;
  let transactionMock: any;

  beforeAll(() => {
    transactionMock = {
      addQuery: jest.fn().mockImplementation(() => ({ rows: [], rowCount: 0 })),
      commit: jest.fn()
    };

    databaseServiceMock = {
      execQuery: jest.fn(),
      startTransaction: jest.fn().mockImplementation(() => transactionMock)
    };
  });

  beforeAll(() => {
    Container.set(DatabaseService, databaseServiceMock);
    storeRepository = Container.get(StoreRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let storeFindAllSpy: jest.SpyInstance;
    let store: Store[];
    beforeAll(() => {
      storeFindAllSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    beforeAll(() => {
      store = [
        {
          id: 1,
          iduser: 1,
          name: 'Raul Novoa',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          sector: 'tech',
          phone: 638471923
        },
        {
          id: 2,
          iduser: 2,
          name: 'Luis Fernandez',
          email: 'luis@usj.es',
          password: 'pwd',
          sector: 'textil',
          phone: 624434223
        }
      ];

      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: store,
        rowCount: store.length
      }));
    });

    describe('when there are not any filter options', () => {
      it('should get all store of the database', () => {
        return storeRepository.findAll().then((_store) => {
          expect(_store).not.toBeNull();
          expect(_store).toHaveLength(store.length);
          expect(_store).toEqual(store);

          expect(storeFindAllSpy).toHaveBeenCalled();
          expect(storeFindAllSpy).toHaveBeenCalledTimes(1);
          expect(storeFindAllSpy).toHaveBeenCalledWith({
            sql:
              'SELECT s.*, a.email, a.name FROM public.store s inner join public.auth a on s.iduser = a.idauth',
            params: []
          });
        });
      });
    });

  });

  describe('#findById', () => {
    describe('when the store exists in the database', () => {
      let store: Store;

      beforeAll(() => {
        store = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          sector: 'tech',
          phone: 638471923
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [store],
          rowCount: 1
        }));
      });

      it('should return the store queried', () => {
        return storeRepository.findById(1).then((_store) => {
          expect(_store).not.toBeNull();
          expect(_store).toEqual(store);
        });
      });
    });

    describe('when the store not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return storeRepository.findById(10).then((_store) => {
          expect(_store).toBeNull();
        });
      });
    });
  });

  describe('#findByEmail', () => {
    describe('when the store exists in the database', () => {
      let store: Store;

      beforeAll(() => {
        store = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          sector: 'tech',
          phone: 638471923
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [store],
          rowCount: 1
        }));
      });

      it('should return the store queried', () => {
        return storeRepository.findByEmail('rnovoa@usj.es').then((_store) => {
          expect(_store).not.toBeNull();
          expect(_store).toEqual(store);
        });
      });
    });

    describe('when the store not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return storeRepository.findByEmail('alu.90100@usj.es').then((_store) => {
          expect(_store).toBeNull();
        });
      });
    });
  });

  describe('#find', () => {
    let query: DBQuery;
    let store: Store;

    beforeAll(() => {
      store = {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        sector: 'tech',
        phone: 638471923
      };
    });
    beforeAll(() => {
      query = {
        sql:
          'SELECT s.*, a.email, a.name FROM public.store s inner join public.auth a on s.iduser = a.idauth WHERE s.id = $1',
        params: [store.id]
      }
    });
    it('should call find function', async () => {
      const _query = await storeRepository.find(1);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });

  describe('#edit', () => {
    describe('when the store exists in the database', () => {
      let store: Store;

      beforeAll(() => {
        store = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          sector: 'tech',
          phone: 638471923
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [store],
          rowCount: 1
        }));
      });

      it('should return the store queried', () => {
        return storeRepository.edit(store).then((_store) => {
          expect(_store).not.toBeNull();
          expect(_store).toEqual(store);
        });
      });
    });

    describe('when the store not exists in the database', () => {
      let store: Store;
      beforeAll(() => {
        store = {
          id: -1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          sector: 'tech',
          phone: 638471923
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return storeRepository.edit(store).then((_store) => {
          expect(_store).toBeNull();
        });
      });
    });
  });

});
