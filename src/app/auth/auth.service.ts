import crypto from 'crypto';
import { isDate, isNumber, isString } from 'lodash';
import { Service } from 'typedi';
import { Admin } from '../admin/admin.model';
import { Customer } from '../customer/customer.model';
import { Store } from '../store/store.model';
import { AuthRepository } from './auth.repository';

@Service()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createAdmin(admin: Admin): Promise<Admin> {
    if (!this.isValidAdmin(admin)) {
      return Promise.reject(new Error('AdminInputValidationError'));
    }
    admin.password = this.encryptPassword(admin.password);
    return await this.authRepository.createAdmin(admin);
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    if (!this.isValidCustomer(customer)) {
      return Promise.reject(new Error('CustomerInputValidationError'));
    }
    customer.password = this.encryptPassword(customer.password);
    return await this.authRepository.createCustomer(customer);
  }

  async createStore(store: Store): Promise<Store> {
    if (!this.isValidStore(store)) {
      return Promise.reject(new Error('StoreInputValidationError'));
    }
    store.password = this.encryptPassword(store.password);
    return await this.authRepository.createStore(store);
  }

  async deleteAdmin(idAdmin: number): Promise<Admin> {
    if (!this.isValidNumber(idAdmin)) {
      return Promise.reject(new Error('InvalidAdminIdError'));
    }

    return await this.authRepository.deleteAdmin(idAdmin);
  }

  async deleteCustomer(idCustomer: number): Promise<Customer> {
    if (!this.isValidNumber(idCustomer)) {
      return Promise.reject(new Error('InvalidCustomerIdError'));
    }

    return await this.authRepository.deleteCustomer(idCustomer);
  }

  async deleteStore(idStore: number): Promise<Store> {
    if (!this.isValidNumber(idStore)) {
      return Promise.reject(new Error('InvalidStoreIdError'));
    }

    return await this.authRepository.deleteStore(idStore);
  }

  //#region Private methods
  
  private isValidNumber(number: number): boolean {
    return number != null && isNumber(number) && number > 0;
  }

  private isValidEmail(email: string): boolean {
    return email != null && isString(email) && email.includes('@');
  }
  
  private isValidString(string: string): boolean {
    return string != null && isString(string) && string.length >= 3;
  }
  
  private isValidDate(date: Date): boolean {
    return date != null && isDate(date);
  }

  private isValidAdmin(admin: Admin): boolean {
    return (
      admin != null && this.isValidEmail(admin.email) && this.isValidString(admin.name)
      && this.isValidString(admin.password) && this.isValidString(admin.role)
    );
  }

  private isValidCustomer(customer: Customer): boolean {
    return (
      customer != null && this.isValidString(customer.name)
      && this.isValidEmail(customer.email) && this.isValidString(customer.password)
      && this.isValidDate(customer.birthdate) && this.isValidString(customer.postcode)
    )
  }

  private isValidStore(store: Store): boolean {
    return (
      store != null && this.isValidString(store.name)
      && this.isValidEmail(store.email) && this.isValidString(store.password)
      && this.isValidString(store.sector) && this.isValidNumber(store.phone)
    );
  }

  //#endregion

  //#region Public methods

  public encryptPassword(password: string): string {
    const encryptedPwd = crypto.pbkdf2Sync(
      password,
      'salt',
      2000,
      64,
      'sha512'
    );
    return encryptedPwd.toString('hex');
  }

  //#endregion
}
