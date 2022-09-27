import 'reflect-metadata';
import { Container } from 'typedi';
import { Customer } from './../customer.model';
import { CustomerRepository } from './../customer.repository';
import { CustomerService } from './../customer.service';

describe('Customer service module', () => {
  let customerService: CustomerService;
  let customerRepositoryMock: any;
  let customers: Customer[];

  beforeAll(() => {
    customers = [
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

    customerRepositoryMock = {
      findAll: jest.fn().mockImplementation(() => customers),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn(),
      exchangePrize: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(CustomerRepository, customerRepositoryMock);
    customerService = Container.get(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let customerSpy: jest.SpyInstance;

    beforeAll(() => {
      customerSpy = jest.spyOn(customerRepositoryMock, 'findAll');
    });

    it('should get all customer of the database', () => {
      return customerService.findAll().then((_customers) => {
        expect(_customers).not.toBeNull();
        expect(_customers).toHaveLength(customers.length);
        expect(_customers).toEqual(customers);

        expect(customerSpy).toHaveBeenCalled();
      });
    });
  });

  describe('#findById', () => {
    let customerSpy: jest.SpyInstance;

    beforeAll(() => {
      customerSpy = jest.spyOn(customerRepositoryMock, 'findById');
    });

    describe('when the idcustomer is valid', () => {
      it('should call to findById method', async () => {
        await customerService.findById(1);
        expect(customerSpy).toHaveBeenCalled();
        expect(customerSpy).toHaveBeenCalledTimes(1);
        expect(customerSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the idcustomer is not valid', () => {
      it('should throw a InvalidCustomerIdError', () => {
        return expect(customerService.findById(-1)).rejects.toThrow(
          'InvalidCustomerIdError'
        );
      });
    });
  });

  describe('#findByEmail', () => {
    let customerSpy: jest.SpyInstance;

    beforeAll(() => {
      customerSpy = jest.spyOn(customerRepositoryMock, 'findByEmail');
    });

    describe('when the CustomerEmail is valid', () => {
      it('should call to findByEmail method', async () => {
        await customerService.findByEmail('rnovoa@usj.es');
        expect(customerSpy).toHaveBeenCalled();
        expect(customerSpy).toHaveBeenCalledTimes(1);
        expect(customerSpy).toHaveBeenCalledWith('rnovoa@usj.es');
      });
    });

    describe('when the CustomerEmail is not valid', () => {
      it('should throw a InvalCustomerEmailError', () => {
        return expect(customerService.findByEmail('')).rejects.toThrow(
          'InvalidCustomerEmailError'
        );
      });
    });

    describe('when the CustomerEmail is not valid', () => {
      it('should throw a InvalCustomerEmailError', () => {
        return expect(customerService.findByEmail('usj')).rejects.toThrow(
          'InvalidCustomerEmailError'
        );
      });
    });
  });

  describe('#edit', () => {
    let customerSpy: jest.SpyInstance;
    let customer: any;

    beforeAll(() => {
      customerSpy = jest.spyOn(customerRepositoryMock, 'edit');
    });

    beforeAll(() => {
      customer = {
        id: 1,
        birthdate: new Date(),
        postcode: '24123B'
      };
    });

    describe('when the customer is valid', () => {
      it('should call to edit method', async () => {
        await customerService.edit(customer);
        expect(customerSpy).toHaveBeenCalled();
        expect(customerSpy).toHaveBeenCalledTimes(1);
        expect(customerSpy).toHaveBeenCalledWith(customer);
      });
    });

    describe('when the customer is not valid', () => {
      beforeAll(() => {
        customer = {
          id: 1,
          birthdate: '',
          postcode: '24123B'
        };
      });
      it('should throw a InvalidCustomerError', () => {
        return expect(customerService.edit(customer)).rejects.toThrow(
          'InvalidCustomerError'
        );
      });
    });

    describe('when the customer is not valid', () => {
      beforeAll(() => {
        customer = {
          id: 1,
          birthdate: new Date(),
          postcode: ''
        };
      });
      it('should throw a InvalidCustomerError', () => {
        return expect(customerService.edit(customer)).rejects.toThrow(
          'InvalidCustomerError'
        );
      });
    });

    describe('when the customer is not valid', () => {
      beforeAll(() => {
        customer = {
          id: -1,
          birthdate: new Date(),
          postcode: ''
        };
      });
      it('should throw a InvalidCustomerError', () => {
        return expect(customerService.edit(customer)).rejects.toThrow(
          'InvalidCustomerError'
        );
      });
    });
  });

  describe('#exchangePrize', () => {
    let ids: any;

    describe('when the store is not valid', () => {
      beforeAll(() => {
        ids = {
          store: -1,
          customer: 1,
          prize: 2
        };
      });
      it('should throw a InvalidIdError', () => {
        return expect(customerService.exchangePrize(ids.store, ids.customer, ids.prize)).rejects.toThrow(
          'InvalidIdError'
        );
      });
    });

    describe('when the customer is not valid', () => {
      beforeAll(() => {
        ids = {
          store: 1,
          customer: -1,
          prize: 2
        };
      });
      it('should throw a InvalidIdError', () => {
        return expect(customerService.exchangePrize(ids.store, ids.customer, ids.prize)).rejects.toThrow(
          'InvalidIdError'
        );
      });
    });

    describe('when the prize is not valid', () => {
      beforeAll(() => {
        ids = {
          store: 1,
          customer: 1,
          prize: -2
        };
      });
      it('should throw a InvalidIdError', () => {
        return expect(customerService.exchangePrize(ids.store, ids.customer, ids.prize)).rejects.toThrow(
          'InvalidIdError'
        );
      });
    });
  });

});
