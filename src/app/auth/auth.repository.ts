import { Service } from 'typedi';
import { DatabaseService, DBQuery, DBQueryResult } from '../../database/src/index';
import { Admin } from '../admin/admin.model';
import { Customer } from '../customer/customer.model';
import { CustomerRepository } from '../customer/customer.repository';
import { Store } from '../store/store.model';
import { StoreRepository } from '../store/store.repository';
import { AdminRepository } from './../admin/admin.repository';
import { User } from './auth.model';

@Service()
export class AuthRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storeRepository: StoreRepository,
    private readonly adminRepository: AdminRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  create(user: User): DBQuery {
    return {
      sql:
        'INSERT INTO public.auth (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      params: [user.email, user.password, user.name]
    };
  }

  delete(userId: number): DBQuery {
    return {
      sql:
      'DELETE FROM public.auth WHERE idauth = $1 RETURNING *',
      params: [userId]
    };
  }

  async createStore(_store: Store): Promise<Store> {
    const transaction = await this.databaseService.startTransaction();
    const newUser: DBQueryResult = await transaction.addQuery(
      this.create(_store)
    );
    if (newUser === null || newUser.rows === null) return null;

    _store.iduser = newUser.rows[0].idauth;
    const store: DBQueryResult = await transaction.addQuery(
      this.storeRepository.create(_store)
    );
    if (store === null || store.rows === null) return null;

    transaction.commit();

    return store.rows[0];
  }

  async createAdmin(admin: Admin): Promise<Admin> {
    const transaction = await this.databaseService.startTransaction();

    const newUser: DBQueryResult = await transaction.addQuery(
      this.create(admin)
    );
    if(newUser === null || newUser.rows === null) return null;

    admin.iduser = newUser.rows[0].idauth;
    const newAdmin = await transaction.addQuery(
      this.createAdmins(admin)
    );
    if (newAdmin === null || newAdmin.rows === null) return null;

    transaction.commit();

    return newAdmin.rows[0];
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    const transaction = await this.databaseService.startTransaction();

    const newUser: DBQueryResult = await transaction.addQuery(
      this.create(customer)
    );
    if (newUser === null || newUser.rows === null) return null;

    customer.iduser = newUser.rows[0].idauth;
    const newCustomer = await transaction.addQuery(
      this.customerRepository.create(customer)
    );
    if (newCustomer === null || newCustomer.rows === null) return null;

    transaction.commit();

    return newCustomer.rows[0];
  }

  async deleteAdmin(idAdmin: number): Promise<Admin> {
    const transaction = await this.databaseService.startTransaction();
    // Delete user
    let user = await transaction.addQuery(
      this.delete(idAdmin)
    );
    if(user === null || user.rows === null) {
      return null;
    }
    
    // Delete admin
    let ad = await transaction.addQuery(
      this.adminRepository.delete(idAdmin)
    );
    if (ad === null || ad.rows === null) {
      return null;
    }
    let admin: Admin = ad.rows[0];

    transaction.commit();

    return admin;
  }

  async deleteCustomer(idCustomer: number): Promise<Customer> {
    const transaction = await this.databaseService.startTransaction();
    // Delete user
    let user = await transaction.addQuery(
      this.delete(idCustomer)
    );
    if(user === null || user.rows === null) {
      return null;
    }
    // Delete customer
    let cust = await transaction.addQuery(
      this.customerRepository.delete(idCustomer)
    );
    if (cust === null || cust.rows === null) {
      return null;
    }
    let customer: Customer = cust.rows[0];
    
    transaction.commit();

    return customer;
  }

  async deleteStore(idStore: number): Promise<Store> {
    const transaction = await this.databaseService.startTransaction();
    // Delete user
    let user = await transaction.addQuery(
      this.delete(idStore)
    );
    if(user === null || user.rows === null) {
      return null;
    }
    // Delete store
    let st = await transaction.addQuery(
      this.storeRepository.delete(idStore)
    );
    if (st === null || st.rows === null) {
      return null;
    }
    let store: Store = st.rows[0];

    transaction.commit();

    return store;
  }

  createAdmins(admin: Admin): DBQuery {
    return {
      sql:
        'INSERT INTO public.admin (iduser, role) VALUES ($1, $2) RETURNING *',
      params: [admin.iduser, admin.role]
    };
  }
}
