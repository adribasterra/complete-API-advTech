import { Service } from 'typedi';
import { DatabaseService, DBQuery } from '../../database/src/index';
import { History } from '../history/history.model';
import { StoreCustomer } from '../storeCustomer/storeCustomer.model';
import { HistoryRepository } from './../history/history.repository';
import { StoreCustomerRepository } from './../storeCustomer/storeCustomer.repository';
import { Customer } from './customer.model';

@Service()
export class CustomerRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storeCustomerRepository: StoreCustomerRepository,
    private readonly historyRepository: HistoryRepository
  ) {}

  async findAll(): Promise<Customer[]> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT c.*, a.email, a.name FROM public.customer c inner join public.auth a on c.iduser = a.idauth',
      params: []
    };

    const customers = await this.databaseService.execQuery(queryDoc);
    console.log(customers);
    return customers.rows;
  }

  async findById(idcustomer: number): Promise<Customer> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT c.*, a.email, a.name FROM public.customer c inner join public.auth a on c.iduser = a.idauth WHERE c.id = $1',
      params: [idcustomer]
    };

    const customers = await this.databaseService.execQuery(queryDoc);
    if(customers == null || customers.rows == null) return null;
    return customers.rows[0];
  }

  async findByEmail(email: string): Promise<Customer> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT c.*, a.* FROM public.customer c inner join public.auth a on c.iduser = a.idauth WHERE a.email = $1',
      params: [email]
    };

    const customers = await this.databaseService.execQuery(queryDoc);
    if(customers == null || customers.rows == null) return null;
    return customers.rows[0];
  }

  find(customerId: number): DBQuery {
    return {
      sql:
        'SELECT * FROM public.customer WHERE id = $1',
      params: [customerId]
    };
  }

  create(customer: Customer): DBQuery {
    return {
      sql:
        'INSERT INTO public.customer (iduser, birthdate, postcode) VALUES ($1, $2, $3) RETURNING *',
      params: [customer.iduser, customer.birthdate, customer.postcode]
    };
  }

  async edit(customer: Customer): Promise<Customer> {
    const queryDoc: DBQuery = {
      sql:
        'UPDATE public.customer SET birthdate = $1, postcode = $2 WHERE id = $3 RETURNING *',
      params: [customer.birthdate, customer.postcode, customer.id]
    };

    const customers = await this.databaseService.execQuery(queryDoc);
    if (customers == null || customers.rows == null) return null;
    return customers.rows[0];
  }

  delete(idCustomer: number): DBQuery {
    return {
      sql:
        'DELETE FROM public.customer WHERE id = $1 RETURNING *',
      params: [idCustomer]
    };
  }

  async exchangePrize(history: History, storeCustomer: StoreCustomer): Promise<History> {
    const transaction = await this.databaseService.startTransaction();
    
    // Substract points to user
    const editedSC = await transaction.addQuery(
      this.storeCustomerRepository.editPoints(storeCustomer)
    )
    if (editedSC == null || editedSC.rows == null) return null;

    // Create history
    const createdHistory = await transaction.addQuery(
      this.historyRepository.create(history)
    )
    if (createdHistory == null || createdHistory.rows == null) return null;

    transaction.commit();

    return createdHistory.rows[0];
  }
}
