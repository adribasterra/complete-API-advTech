import 'reflect-metadata';
import { Container } from 'typedi';
import { Store } from './../store.model';
import { StoreRepository } from './../store.repository';
import { StoreService } from './../store.service';

describe('Store service module', () => {
  let storeService: StoreService;
  let storeRepositoryMock: any;
  let stores: Store[];

  beforeAll(() => {
    stores = [
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

    storeRepositoryMock = {
      findAll: jest.fn().mockImplementation(() => stores),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(StoreRepository, storeRepositoryMock);
    storeService = Container.get(StoreService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let storeSpy: jest.SpyInstance;

    beforeAll(() => {
      storeSpy = jest.spyOn(storeRepositoryMock, 'findAll');
    });

    it('should get all store of the database', () => {
      return storeService.findAll().then((_stores) => {
        expect(_stores).not.toBeNull();
        expect(_stores).toHaveLength(stores.length);
        expect(_stores).toEqual(stores);

        expect(storeSpy).toHaveBeenCalled();
      });
    });
  });

  describe('#findById', () => {
    let storeSpy: jest.SpyInstance;

    beforeAll(() => {
      storeSpy = jest.spyOn(storeRepositoryMock, 'findById');
    });

    describe('when the idstore is valid', () => {
      it('should call to findById method', async () => {
        await storeService.findById(1);
        expect(storeSpy).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalledTimes(1);
        expect(storeSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the idstore is not valid', () => {
      it('should throw a InvalidStoreIdError', () => {
        return expect(storeService.findById(-1)).rejects.toThrow(
          'InvalidStoreIdError'
        );
      });
    });
  });

  describe('#findByEmail', () => {
    let storeSpy: jest.SpyInstance;

    beforeAll(() => {
      storeSpy = jest.spyOn(storeRepositoryMock, 'findByEmail');
    });

    describe('when the StoreEmail is valid', () => {
      it('should call to findByEmail method', async () => {
        await storeService.findByEmail('rnovoa@usj.es');
        expect(storeSpy).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalledTimes(1);
        expect(storeSpy).toHaveBeenCalledWith('rnovoa@usj.es');
      });
    });

    describe('when the StoreEmail is not valid', () => {
      it('should throw a InvalStoreEmailError', () => {
        return expect(storeService.findByEmail('')).rejects.toThrow(
          'InvalidStoreEmailError'
        );
      });
    });

    describe('when the StoreEmail is not valid', () => {
      it('should throw a InvalStoreEmailError', () => {
        return expect(storeService.findByEmail('usj')).rejects.toThrow(
          'InvalidStoreEmailError'
        );
      });
    });
  });

  describe('#edit', () => {
    let storeSpy: jest.SpyInstance;
    let store: any;

    beforeAll(() => {
      storeSpy = jest.spyOn(storeRepositoryMock, 'edit');
    });

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
    });

    describe('when the store is valid', () => {
      it('should call to edit method', async () => {
        await storeService.edit(store);
        expect(storeSpy).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalledTimes(1);
        expect(storeSpy).toHaveBeenCalledWith(store);
      });
    });

    describe('when the store is not valid', () => {
      beforeAll(() => {
        store = {
          id: 1,
          role: ''
        };
      });
      it('should throw a InvalidStoreError', () => {
        return expect(storeService.edit(store)).rejects.toThrow(
          'InvalidStoreError'
        );
      });
    });

    describe('when the store is not valid', () => {
      beforeAll(() => {
        store = {
          id: -1,
          role: 'store'
        };
      });
      it('should throw a InvalidStoreError', () => {
        return expect(storeService.edit(store)).rejects.toThrow(
          'InvalidStoreError'
        );
      });
    });
  });

  describe('#points', () => {
    let body: any;

    describe('when store id is not valid', () => {
      beforeAll(() => {
        body = {
          income: 100
        };
      });
      it('should throw a InvalidCustomerOrStoreIdError', () => {
        return expect(storeService.points(-1, 2, body)).rejects.toThrow(
          'InvalidCustomerOrStoreIdError'
        );
      });
    });

    describe('when customer id is not valid', () => {
      beforeAll(() => {
        body = {
          income: 100
        };
      });
      it('should throw a InvalidCustomerOrStoreIdError', () => {
        return expect(storeService.points(1, -2, body)).rejects.toThrow(
          'InvalidCustomerOrStoreIdError'
        );
      });
    });

    describe('when the body is not valid', () => {
      beforeAll(() => {
        body = {
          others: 100
        };
      });
      it('should throw a InvalidIncomeError', () => {
        return expect(storeService.points(1, 2, body)).rejects.toThrow(
          'InvalidIncomeError'
        );
      });
    });

  });
});
