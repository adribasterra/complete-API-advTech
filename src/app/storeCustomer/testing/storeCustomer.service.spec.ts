import 'reflect-metadata';
import { Container } from 'typedi';
import { StoreCustomer } from './../storeCustomer.model';
import { StoreCustomerRepository } from './../storeCustomer.repository';
import { StoreCustomerService } from './../storeCustomer.service';

describe('StoreCustomer service module', () => {
  let storeCustomerService: StoreCustomerService;
  let storeCustomerRepositoryMock: any;
  let storeCustomers: StoreCustomer[];

  beforeAll(() => {
    storeCustomers = [
      {
        id: 1,
        idstore: 1,
        idcustomer: 1,
        points: 0
      },
      {
        id: 2,
        idstore: 1,
        idcustomer: 3,
        points: 0
      }
    ];

    storeCustomerRepositoryMock = {
      findAllStores: jest.fn().mockImplementation(() => storeCustomers),
      findAllCustomers: jest.fn().mockImplementation(() => storeCustomers),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(StoreCustomerRepository, storeCustomerRepositoryMock);
    storeCustomerService = Container.get(StoreCustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAllCustomers', () => {
    let storeCustomerSpy: jest.SpyInstance;

    beforeAll(() => {
      storeCustomerSpy = jest.spyOn(storeCustomerRepositoryMock, 'findAllCustomers');
    });

    describe('when the idStore is valid', () => {
      it('should get all customers of store in the database', () => {
        return storeCustomerService.findAllCustomers(1).then((_storeCustomers) => {
          expect(_storeCustomers).not.toBeNull();
          expect(_storeCustomers).toHaveLength(storeCustomers.length);
          expect(_storeCustomers).toEqual(storeCustomers);

          expect(storeCustomerSpy).toHaveBeenCalled();
        });
      });
    });

    describe('when the idStore is not valid', () => {
      it('should throw a InvalidStoreIdError', () => {
        return expect(storeCustomerService.findAllCustomers(-1)).rejects.toThrow(
          'InvalidStoreIdError'
        );
      });
    });
  });

  describe('#findAllStores', () => {
    let storeCustomerSpy: jest.SpyInstance;

    beforeAll(() => {
      storeCustomerSpy = jest.spyOn(storeCustomerRepositoryMock, 'findAllStores');
    });

    describe('when the idCustomer is valid', () => {
      it('should get all stores of customer in the database', () => {
        return storeCustomerService.findAllStores(1).then((_storeCustomers) => {
          expect(_storeCustomers).not.toBeNull();
          expect(_storeCustomers).toHaveLength(storeCustomers.length);
          expect(_storeCustomers).toEqual(storeCustomers);

          expect(storeCustomerSpy).toHaveBeenCalled();
        });
      });
    });

    describe('when the idCustomer is not valid', () => {
      it('should throw a InvalidCustomerIdError', () => {
        return expect(storeCustomerService.findAllStores(-1)).rejects.toThrow(
          'InvalidCustomerIdError'
        );
      });
    });
  });

  describe('#findById', () => {
    let storeCustomerSpy: jest.SpyInstance;

    beforeAll(() => {
      storeCustomerSpy = jest.spyOn(storeCustomerRepositoryMock, 'findById');
    });

    describe('when the idStoreCustomer is valid', () => {
      it('should call to findById method', async () => {
        await storeCustomerService.findById(1, 3);
        expect(storeCustomerSpy).toHaveBeenCalled();
        expect(storeCustomerSpy).toHaveBeenCalledTimes(1);
        expect(storeCustomerSpy).toHaveBeenCalledWith(1, 3);
      });
    });

    describe('when the idStoreCustomer is not valid', () => {
      it('should throw a InvalidStoreCustomerIdError', () => {
        return expect(storeCustomerService.findById(-1, 0)).rejects.toThrow(
          'InvalidStoreCustomerIdError'
        );
      });
    });
  });

  describe('#create', () => {
    let storeCustomerSpy: jest.SpyInstance;
    let storeCustomer: StoreCustomer;

    beforeAll(() => {
      storeCustomerSpy = jest.spyOn(storeCustomerRepositoryMock, 'create');
    });

    beforeAll(() => {
      storeCustomer = {
        id: 1,
        idstore: 1,
        idcustomer: 1,
        points: 200
      };
    });

    describe('when the storeCustomer is valid', () => {
      it('should call to create method', async () => {
        await storeCustomerService.create(storeCustomer);
        expect(storeCustomerSpy).toHaveBeenCalled();
        expect(storeCustomerSpy).toHaveBeenCalledTimes(1);
        expect(storeCustomerSpy).toHaveBeenCalledWith(storeCustomer);
      });
    });

    describe('when the storeCustomer is not valid', () => {
      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: -20
        };
      });
      it('should throw a InvalidStoreCustomerError', () => {
        return expect(storeCustomerService.create(storeCustomer)).rejects.toThrow(
          'InvalidStoreCustomerError'
        );
      });
    });

    describe('when the storeCustomer is not valid', () => {
      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: -1,
          idcustomer: 1,
          points: 200
        };
      });
      it('should throw a InvalidStoreCustomerError', () => {
        return expect(storeCustomerService.create(storeCustomer)).rejects.toThrow(
          'InvalidStoreCustomerError'
        );
      });
    });
  });

  describe('#edit', () => {
    let storeCustomerSpy: jest.SpyInstance;
    let storeCustomer: StoreCustomer;

    beforeAll(() => {
      storeCustomerSpy = jest.spyOn(storeCustomerRepositoryMock, 'edit');
    });

    beforeAll(() => {
      storeCustomer = {
        id: 1,
        idstore: 1,
        idcustomer: 1,
        points: 200
      };
    });

    describe('when the storeCustomer is valid', () => {
      it('should call to edit method', async () => {
        await storeCustomerService.edit(storeCustomer);
        expect(storeCustomerSpy).toHaveBeenCalled();
        expect(storeCustomerSpy).toHaveBeenCalledTimes(1);
        expect(storeCustomerSpy).toHaveBeenCalledWith(storeCustomer);
      });
    });

    describe('when the storeCustomer is not valid', () => {
      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: -20
        };
      });
      it('should throw a InvalidStoreCustomerError', () => {
        return expect(storeCustomerService.edit(storeCustomer)).rejects.toThrow(
          'InvalidStoreCustomerError'
        );
      });
    });

    describe('when the storeCustomer is not valid', () => {
      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: -1,
          idcustomer: 1,
          points: 200
        };
      });
      it('should throw a InvalidStoreCustomerError', () => {
        return expect(storeCustomerService.edit(storeCustomer)).rejects.toThrow(
          'InvalidStoreCustomerError'
        );
      });
    });
  });

  describe('#delete', () => {
    let storeCustomerSpy: jest.SpyInstance;
    let storeCustomer: StoreCustomer;

    beforeAll(() => {
      storeCustomerSpy = jest.spyOn(storeCustomerRepositoryMock, 'delete');
    });

    beforeAll(() => {
      storeCustomer = {
        id: 1,
        idstore: 1,
        idcustomer: 1,
        points: 200
      };
    });

    describe('when the storeCustomer is valid', () => {
      it('should call to delete method', async () => {
        await storeCustomerService.delete(storeCustomer);
        expect(storeCustomerSpy).toHaveBeenCalled();
        expect(storeCustomerSpy).toHaveBeenCalledTimes(1);
        expect(storeCustomerSpy).toHaveBeenCalledWith(storeCustomer);
      });
    });

    describe('when the storeCustomer is not valid', () => {
      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: 1,
          idcustomer: 1,
          points: -20
        };
      });
      it('should throw a InvalidStoreCustomerError', () => {
        return expect(storeCustomerService.delete(storeCustomer)).rejects.toThrow(
          'InvalidStoreCustomerError'
        );
      });
    });

    describe('when the storeCustomer is not valid', () => {
      beforeAll(() => {
        storeCustomer = {
          id: 1,
          idstore: -1,
          idcustomer: 1,
          points: 200
        };
      });
      it('should throw a InvalidStoreCustomerError', () => {
        return expect(storeCustomerService.delete(storeCustomer)).rejects.toThrow(
          'InvalidStoreCustomerError'
        );
      });
    });
  });
});
