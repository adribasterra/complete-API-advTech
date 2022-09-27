import 'reflect-metadata';
import { Container } from 'typedi';
import { DatabaseService, DBQuery } from '../../../database/src/index';
import { StoreCustomer } from '../../storeCustomer/storeCustomer.model';
import { Customer } from '../customer.model';
import { CustomerRepository } from '../customer.repository';
import { History } from './../../history/history.model';

describe('Customer repository module', () => {
  let customerRepository: CustomerRepository;
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
    customerRepository = Container.get(CustomerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let customerFindAllSpy: jest.SpyInstance;
    let customer: Customer[];
    beforeAll(() => {
      customerFindAllSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    beforeAll(() => {
      customer = [
        {
          id: 1,
          iduser: 1,
          name: 'Raul Novoa',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          birthdate: new Date(),
          postcode: '24123B'
        },
        {
          id: 2,
          iduser: 2,
          name: 'Luis Fernandez',
          email: 'luis@usj.es',
          password: 'pwd',
          birthdate: new Date(),
          postcode: '24123B'
        }
      ];

      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: customer,
        rowCount: customer.length
      }));
    });

    describe('when there are not any filter options', () => {
      it('should get all customer of the database', () => {
        return customerRepository.findAll().then((_customer) => {
          expect(_customer).not.toBeNull();
          expect(_customer).toHaveLength(customer.length);
          expect(_customer).toEqual(customer);

          expect(customerFindAllSpy).toHaveBeenCalled();
          expect(customerFindAllSpy).toHaveBeenCalledTimes(1);
          expect(customerFindAllSpy).toHaveBeenCalledWith({
            sql:
              'SELECT c.*, a.email, a.name FROM public.customer c inner join public.auth a on c.iduser = a.idauth',
            params: []
          });
        });
      });
    });

  });

  describe('#findById', () => {
    let customerFindByIdSpy: jest.SpyInstance;
    beforeAll(() => {
      customerFindByIdSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    describe('when the customer exists in the database', () => {
      let customer: Customer;

      beforeAll(() => {
        customer = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          birthdate: new Date(),
          postcode: '24123B'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [customer],
          rowCount: 1
        }));
      });

      it('should return the customer queried', () => {
        return customerRepository.findById(1).then((_customer) => {
          expect(_customer).not.toBeNull();
          expect(_customer).toEqual(customer);

          expect(customerFindByIdSpy).toHaveBeenCalled();
          expect(customerFindByIdSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('when the customer not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return customerRepository.findById(10).then((_customer) => {
          expect(_customer).toBeNull();
          
          expect(customerFindByIdSpy).toHaveBeenCalled();
          expect(customerFindByIdSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('#findByEmail', () => {
    describe('when the customer exists in the database', () => {
      let customer: Customer;

      beforeAll(() => {
        customer = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          birthdate: new Date(),
          postcode: '24123B'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [customer],
          rowCount: 1
        }));
      });

      it('should return the customer queried', () => {
        return customerRepository.findByEmail('rnovoa@usj.es').then((_customer) => {
          expect(_customer).not.toBeNull();
          expect(_customer).toEqual(customer);
        });
      });
    });

    describe('when the customer not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return customerRepository.findByEmail('alu.90100@usj.es').then((_customer) => {
          expect(_customer).toBeNull();
        });
      });
    });
  });

  describe('#find', () => {
    let query: DBQuery;
    let customer: Customer;

    beforeAll(() => {
      customer = {
        id: 1,
        iduser: 1,
        name: '10labs',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        birthdate: new Date(),
        postcode: '24123B'
      };
    });
    beforeAll(() => {
      query = {
        sql:
          'SELECT * FROM public.customer WHERE id = $1',
        params: [customer.id]
      }
    });
    it('should call find function', async () => {
      const _query = await customerRepository.find(1);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });

  describe('#edit', () => {
    describe('when the customer exists in the database', () => {
      let customer: Customer;

      beforeAll(() => {
        customer = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          birthdate: new Date(),
          postcode: '24123B'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [customer],
          rowCount: 1
        }));
      });

      it('should return the customer queried', () => {
        return customerRepository.edit(customer).then((_customer) => {
          expect(_customer).not.toBeNull();
          expect(_customer).toEqual(customer);
        });
      });
    });

    describe('when the customer not exists in the database', () => {
      let customer: Customer;
      beforeAll(() => {
        customer = {
          id: 0,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          birthdate: new Date(),
          postcode: '24123B'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return customerRepository.edit(customer).then((_customer) => {
          expect(_customer).toBeNull();
        });
      });
    });
  });

  describe('#delete', () => {
    let query: DBQuery;

    beforeAll(() => {
      query = {
        sql:
          'DELETE FROM public.customer WHERE id = $1 RETURNING *',
        params: [1]
      }
    });
    it('should call delete function', async () => {
      const _query = await customerRepository.delete(1);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });

  describe('#exchangePrize', () => {
    let history: History;
    let storeCustomer: StoreCustomer;

    beforeAll(() => {
      history = {
        id: 1,
        date: new Date(),
        idcustomer: 1,
        age: 20,
        idstore: 1,
        sector: 'Tech',
        idprize: 2,
        points: 200,
        name: 'Pillow',
        category: 'Home',
      };
      storeCustomer = {
        id: 1,
        idstore: 1,
        idcustomer: 3,
        points: 0
      };
    })
    describe('when the customer exists in the database', () => {
      beforeAll(() => {
        transactionMock.addQuery.mockImplementationOnce(() => ({
          rows: [storeCustomer],
          rowCount: 1
        }));
        transactionMock.addQuery.mockImplementationOnce(() => ({
          rows: [history],
          rowCount: 1
        }));
      });

      it('should return the customer queried', () => {
        return customerRepository.exchangePrize(history, storeCustomer).then((_history) => {
          expect(_history).not.toBeNull();
          expect(_history).toEqual(history);
        });
      });
    });

    describe('when the storeCustomer not exists in the database', () => {
      beforeAll(() => {
        transactionMock.addQuery.mockImplementationOnce(() => ({
          rows: null as any,
          rowCount: 0
        }));

        transactionMock.addQuery.mockImplementationOnce(() => ({
          rows: [history],
          rowCount: 1
        }));
      });

      it('should return a null value', () => {
        return customerRepository.exchangePrize(history, storeCustomer).then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });

    describe('when the history cannot be created in the database', () => {
      beforeAll(() => {
        transactionMock.addQuery.mockImplementationOnce(() => ({
          rows: null as any,
          rowCount: 1
        }));

        transactionMock.addQuery.mockImplementationOnce(() => ({
          rows: null as any,
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return customerRepository.exchangePrize(history, storeCustomer).then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });
  });
});
