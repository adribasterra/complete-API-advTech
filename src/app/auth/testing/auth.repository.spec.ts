import 'reflect-metadata';
import { Container } from 'typedi';
import { DatabaseService, DBQuery } from '../../../database/src/index';
import { Admin } from '../../admin/admin.model';
import { Customer } from '../../customer/customer.model';
import { Store } from '../../store/store.model';
import { User } from '../auth.model';
import { AuthRepository } from '../auth.repository';

describe('Auth repository module', () => {
  let authRepository: AuthRepository;
  let databaseServiceMock: any;
  let transactionMock: any;

  let transactionSpy: jest.SpyInstance;
  let addQuerySpy: jest.SpyInstance;

  let admin: Admin;
  let store: Store;
  let customer: Customer;
  let user: User;

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
    addQuerySpy = jest.spyOn(transactionMock, 'addQuery');
    transactionSpy = jest.spyOn(databaseServiceMock, 'startTransaction');
  });

  beforeAll(() => {
    Container.set(DatabaseService, databaseServiceMock);
    authRepository = Container.get(AuthRepository);
  });

  beforeAll(() => {
    user = {
      id: 1,
      name: 'User',
      email: 'rnovoa@usj.es',
      password: 'pwd'
    };
    admin = {
      id: 1,
      iduser: 1,
      name: 'Raul Novoa',
      email: 'rnovoa@usj.es',
      password: 'pwd',
      role: 'admin'
    }
    store = {
      id: 1,
      iduser: 1,
      name: '10labs',
      email: 'store@usj.es',
      password: 'pwd',
      sector: 'tech',
      phone: 638471923
    };
    customer = {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        birthdate: new Date(),
        postcode: '24123B'
      },

    transactionMock.addQuery
      .mockImplementationOnce(() => ({
        rows: [user],
        rowCount: 1
      }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#createAdmin', () => {
    beforeAll(() => {
      transactionMock.addQuery
        .mockImplementationOnce(() => ({
          rows: [admin],
          rowCount: 1
        }));
    })
    it('should start a new transaction', async () => {
      await authRepository.createAdmin(admin);
      expect(transactionSpy).toHaveBeenCalled();
      expect(transactionSpy).toHaveBeenCalledTimes(1);
      
      expect(addQuerySpy).toHaveBeenCalled();
      expect(addQuerySpy).toHaveBeenCalledTimes(2);
    })
  });

  describe('#createCustomer', () => {
    beforeAll(() => {
      transactionMock.addQuery
        .mockImplementationOnce(() => ({
          rows: [customer],
          rowCount: 1
        }));
    })
    it('should start a new transaction', async () => {
      await authRepository.createCustomer(customer);
      expect(transactionSpy).toHaveBeenCalled();
      expect(transactionSpy).toHaveBeenCalledTimes(1);
      
      expect(addQuerySpy).toHaveBeenCalled();
      expect(addQuerySpy).toHaveBeenCalledTimes(2);
    })
  });

  describe('#createStore', () => {
    beforeAll(() => {
      transactionMock.addQuery
        .mockImplementationOnce(() => ({
          rows: [store],
          rowCount: 1
        }));
    })
    it('should start a new transaction', async () => {
      await authRepository.createStore(store);
      expect(transactionSpy).toHaveBeenCalled();
      expect(transactionSpy).toHaveBeenCalledTimes(1);
      
      expect(addQuerySpy).toHaveBeenCalled();
      expect(addQuerySpy).toHaveBeenCalledTimes(2);
    })
  });

  describe('#delete', () => {
    let query : DBQuery;
    beforeAll(() => {
      query = {
        sql:
        'DELETE FROM public.auth WHERE idauth = $1 RETURNING *',
        params: [user.id]
      }
    })
    beforeAll(() => {
      user = {
        id: 1,
        name: 'User',
        email: 'rnovoa@usj.es',
        password: 'pwd'
      };
    })
    it('should call delete function', async () => {
      const _query = await authRepository.delete(1);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });

});
