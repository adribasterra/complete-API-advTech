import 'reflect-metadata';
import { Container } from 'typedi';
import { Customer } from '../../customer/customer.model';
import { Store } from '../../store/store.model';
import { Admin } from './../../admin/admin.model';
import { AuthRepository } from './../auth.repository';
import { AuthService } from './../auth.service';

describe('Auth service module', () => {
  let authService: AuthService;
  let authRepositoryMock: any;
  let admin: Admin;
  let customer: Customer;
  let store: Store;

  beforeAll(() => {
    admin = {
      id: 1,
      iduser: 1,
      name: 'Raul Novoa',
      email: 'rnovoa@usj.es',
      password: 'pwd',
      role: 'admin'
    };
    customer = {
      id: 1,
      iduser: 1,
      name: 'Raul Novoa',
      email: 'rnovoa@usj.es',
      password: 'pwd',
      birthdate: new Date(),
      postcode: '24123B'
    };
    store = {
      id: 1,
      iduser: 1,
      name: '10labs',
      email: 'rnovoa@usj.es',
      password: 'pwd',
      sector: 'tech',
      phone: 638471923
    };

    authRepositoryMock = {
      createAdmin: jest.fn().mockImplementation(() => admin),
      createCustomer: jest.fn().mockImplementation(() => customer),
      createStore: jest.fn().mockImplementation(() => store),
      deleteAdmin: jest.fn().mockImplementation(() => admin),
      deleteCustomer: jest.fn().mockImplementation(() => customer),
      deleteStore: jest.fn().mockImplementation(() => store)
    };
  });

  beforeAll(() => {
    Container.set(AuthRepository, authRepositoryMock);
    authService = Container.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#createAdmin', () => {
    let authSpy: jest.SpyInstance;
    let admin: Admin;

    beforeAll(() => {
      authSpy = jest.spyOn(authRepositoryMock, 'createAdmin');
    });

    beforeAll(() => {
      admin = {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        role: 'admin'
      };
    })

    describe('when the admin input object is valid', () => {
      it('should call to admin creation method', async () => {
        await authService.createAdmin(admin);
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledWith(admin);
      });
    });

    describe('when the admin input object is not valid', () => {
      let admin: Admin = {
        name: 'Raúl',
        email: 'rnovoa@usj.es',
        role: 'admin',
        password: null,
        id: null,
        iduser: null
      };

      it('should throw a AdminInputValidationError', () => {
        return expect(authService.createAdmin(admin)).rejects.toThrow(
          'AdminInputValidationError'
        );
      });

      admin = {
        name: 'Raúl',
        email: null,
        password: 'pwd',
        role: 'admin',
        id: null,
        iduser: null
      };

      it('should throw a AdminInputValidationError', () => {
        return expect(authService.createAdmin(admin)).rejects.toThrow(
          'AdminInputValidationError'
        );
      });

      admin = {
        name: null,
        email: 'rnovoa@usj.es',
        password: 'pwd',
        role: 'admin',
        id: null,
        iduser: null
      };

      it('should throw a AdminInputValidationError', () => {
        return expect(authService.createAdmin(admin)).rejects.toThrow(
          'AdminInputValidationError'
        );
      });
    });
  });

  describe('#createCustomer', () => {
    let authSpy: jest.SpyInstance;
    let customer: Customer;

    beforeAll(() => {
      authSpy = jest.spyOn(authRepositoryMock, 'createCustomer');
    });

    beforeAll(() => {
      customer = {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        birthdate: new Date(),
        postcode: '24123B'
      };
    })

    describe('when the customer input object is valid', () => {
      it('should call to customer creation method', async () => {
        await authService.createCustomer(customer);
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledWith(customer);
      });
    });

    describe('when the customer input object is not valid', () => {
      let customer: Customer = {
        id: 1,
        iduser: -1,
        name: 'Raul Novoa',
        email: 'customer@usj.es',
        password: 'pwd',
        birthdate: new Date(),
        postcode: '24123B'
      };

      it('should throw a CustomerInputValidationError', () => {
        return expect(authService.createCustomer(customer)).rejects.toThrow(
          'CustomerInputValidationError'
        );
      });

      customer = {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'usj.es',
        password: 'pwd',
        birthdate: new Date(),
        postcode: '24123B'
      };

      it('should throw a CustomerInputValidationError', () => {
        return expect(authService.createCustomer(customer)).rejects.toThrow(
          'CustomerInputValidationError'
        );
      });

      customer = {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        birthdate: new Date(),
        postcode: ''
      };

      it('should throw a CustomerInputValidationError', () => {
        return expect(authService.createCustomer(customer)).rejects.toThrow(
          'CustomerInputValidationError'
        );
      });
    });
  });

  describe('#createStore', () => {
    let authSpy: jest.SpyInstance;
    let store: Store;

    beforeAll(() => {
      authSpy = jest.spyOn(authRepositoryMock, 'createStore');
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
    })

    describe('when the store input object is valid', () => {
      it('should call to store creation method', async () => {
        await authService.createStore(store);
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledWith(store);
      });
    });

    describe('when the store input object is not valid', () => {
      let store: Store = {
        id: 1,
        iduser: -1,
        name: '10labs',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        sector: 'tech',
        phone: 638471923
      };

      it('should throw a StoreInputValidationError', () => {
        return expect(authService.createStore(store)).rejects.toThrow(
          'StoreInputValidationError'
        );
      });

      store = {
        id: 1,
        iduser: 1,
        name: '10labs',
        email: 'usj.es',
        password: 'pwd',
        sector: 'tech',
        phone: 638471923
      };

      it('should throw a StoreInputValidationError', () => {
        return expect(authService.createStore(store)).rejects.toThrow(
          'StoreInputValidationError'
        );
      });

      store = {
        id: 1,
        iduser: 1,
        name: '10labs',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        sector: '',
        phone: 638471923
      };

      it('should throw a StoreInputValidationError', () => {
        return expect(authService.createStore(store)).rejects.toThrow(
          'StoreInputValidationError'
        );
      });
    });
  });

  describe('#deleteAdmin', () => {
    let authSpy: jest.SpyInstance;

    beforeAll(() => {
      authSpy = jest.spyOn(authRepositoryMock, 'deleteAdmin');
    });

    describe('when the store input object is valid', () => {
      it('should call to store delete method', async () => {
        await authService.deleteAdmin(1);
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the store input object is not valid', () => {
      it('should throw a InvalidAdminIdError', () => {
        return expect(authService.deleteAdmin(-1)).rejects.toThrow(
          'InvalidAdminIdError'
        );
      });
    });
  });

  describe('#deleteCustomer', () => {
    let authSpy: jest.SpyInstance;

    beforeAll(() => {
      authSpy = jest.spyOn(authRepositoryMock, 'deleteCustomer');
    });

    describe('when the store input object is valid', () => {
      it('should call to store delete method', async () => {
        await authService.deleteCustomer(1);
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the store input object is not valid', () => {
      it('should throw a InvalidCustomerIdError', () => {
        return expect(authService.deleteCustomer(-1)).rejects.toThrow(
          'InvalidCustomerIdError'
        );
      });
    });
  });

  describe('#deleteStore', () => {
    let authSpy: jest.SpyInstance;

    beforeAll(() => {
      authSpy = jest.spyOn(authRepositoryMock, 'deleteStore');
    });

    describe('when the store input object is valid', () => {
      it('should call to store delete method', async () => {
        await authService.deleteStore(1);
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the store input object is not valid', () => {
      it('should throw a InvalidStoreIdError', () => {
        return expect(authService.deleteStore(-1)).rejects.toThrow(
          'InvalidStoreIdError'
        );
      });
    });
  });
});
