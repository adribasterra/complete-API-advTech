import { Service } from 'typedi';
import { DatabaseService, DBQuery } from '../../database/src/index';
import { StoreCustomer } from './storeCustomer.model';

@Service()
export class StoreCustomerRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAllStores(idcustomer: number): Promise<StoreCustomer[]> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.store_customer WHERE idcustomer = $1',
      params: [idcustomer]
    };

    const storeCustomers = await this.databaseService.execQuery(queryDoc);
    return storeCustomers.rows;
  }

  async findAllCustomers(idstore: number): Promise<StoreCustomer[]> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.store_customer WHERE idstore = $1',
      params: [idstore]
    };

    const storeCustomers = await this.databaseService.execQuery(queryDoc);
    return storeCustomers.rows;
  }

  async findById(idstore: number, idcustomer: number): Promise<StoreCustomer> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.store_customer WHERE idstore = $1 AND idcustomer = $2',
      params: [idstore, idcustomer]
    };

    const storeCustomers = await this.databaseService.execQuery(queryDoc);
    if (storeCustomers == null || storeCustomers.rows == null) return null;
    return storeCustomers.rows[0];
  }

  async create(storeCustomer: StoreCustomer): Promise<StoreCustomer> {
    const queryDoc: DBQuery = {
      sql:
        'INSERT INTO public.store_customer (idcustomer, idstore, points) VALUES ($1, $2, $3) RETURNING *',
      params: [storeCustomer.idcustomer, storeCustomer.idstore, storeCustomer.points]
    };

    const storeCustomers = await this.databaseService.execQuery(queryDoc);
    if (storeCustomers == null || storeCustomers.rows == null) return null;
    return storeCustomers.rows[0];
  }

  async edit(storeCustomer: StoreCustomer): Promise<StoreCustomer> {
    const queryDoc: DBQuery = {
      sql:
        'UPDATE public.store_customer SET points = $1 WHERE idcustomer = $2 AND idstore = $3 RETURNING *',
      params: [storeCustomer.points, storeCustomer.idcustomer, storeCustomer.idstore]
    };

    const storeCustomers = await this.databaseService.execQuery(queryDoc);
    if (storeCustomers == null || storeCustomers.rows == null) return null;
    return storeCustomers.rows[0];
  }

  editPoints(storeCustomer: StoreCustomer): DBQuery {
    return {
      sql:
        'UPDATE public.store_customer SET points = $1 WHERE idcustomer = $2 AND idstore = $3 RETURNING *',
      params: [storeCustomer.points, storeCustomer.idcustomer, storeCustomer.idstore]
    };
  }
  
  async delete(storeCustomer: StoreCustomer): Promise<StoreCustomer> {
    const queryDoc: DBQuery = {
      sql:
        'DELETE FROM public.store_customer WHERE idstore = $1 AND idcustomer = $2 RETURNING *',
      params: [storeCustomer.idstore, storeCustomer.idcustomer]
    };
    
    const storeCustomers = await this.databaseService.execQuery(queryDoc);
    if (storeCustomers == null || storeCustomers.rows == null) return null;
    return storeCustomers.rows[0];
  }
}
