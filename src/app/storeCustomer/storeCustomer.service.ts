import { isNumber } from 'lodash';
import { Service } from 'typedi';
import { StoreCustomer } from './storeCustomer.model';
import { StoreCustomerRepository } from './storeCustomer.repository';

@Service()
export class StoreCustomerService {
  constructor(private readonly storeCustomerRepository: StoreCustomerRepository) { }

  async findAllStores(idcustomer: number): Promise<StoreCustomer[]> {
    if (!this.isValidNumber(idcustomer)) {
      return Promise.reject(new Error('InvalidCustomerIdError'));
    }

    return await this.storeCustomerRepository.findAllStores(idcustomer);
  }

  async findAllCustomers(idstore: number): Promise<StoreCustomer[]> {
    if (!this.isValidNumber(idstore)) {
      return Promise.reject(new Error('InvalidStoreIdError'));
    }

    return await this.storeCustomerRepository.findAllCustomers(idstore);
  }

  async findById(idstore: number, idcustomer: number): Promise<StoreCustomer> {
    if (!this.isValidNumber(idstore) || !this.isValidNumber(idcustomer)) {
      return Promise.reject(new Error('InvalidStoreCustomerIdError'));
    }

    return await this.storeCustomerRepository.findById(idstore, idcustomer);
  }

  async create(storeCustomer: StoreCustomer): Promise<StoreCustomer> {
    if (!this.isValidStoreCustomer(storeCustomer)) {
      return Promise.reject(new Error('InvalidStoreCustomerError'));
    }

    return await this.storeCustomerRepository.create(storeCustomer);
  }

  async edit(storeCustomer: StoreCustomer): Promise<StoreCustomer> {
    if (!this.isValidStoreCustomer(storeCustomer)) {
      return Promise.reject(new Error('InvalidStoreCustomerError'));
    }

    return await this.storeCustomerRepository.edit(storeCustomer);
  }

  async delete(storeCustomer: StoreCustomer): Promise<StoreCustomer> {
    if (!this.isValidStoreCustomer(storeCustomer)) {
      return Promise.reject(new Error('InvalidStoreCustomerError'));
    }

    return await this.storeCustomerRepository.delete(storeCustomer);
  }

  //#region Private methods

  private isValidNumber(number: number): boolean {
    return number != null && isNumber(number) && number >= 0;
  }
  
  private isValidStoreCustomer(storeCustomer: StoreCustomer): boolean {
    return (
      storeCustomer != null && this.isValidNumber(storeCustomer.idcustomer) 
      && this.isValidNumber(storeCustomer.idstore) && this.isValidNumber(storeCustomer.points)
    );
  }

  //#endregion
}
