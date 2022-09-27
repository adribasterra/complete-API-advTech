import { isNumber, isString } from 'lodash';
import { Service } from 'typedi';
import { StoreCustomer } from '../storeCustomer/storeCustomer.model';
import { StoreCustomerRepository } from '../storeCustomer/storeCustomer.repository';
import { Store } from './store.model';
import { StoreRepository } from './store.repository';

@Service()
export class StoreService {

  code: number;
  pointsPerCode: number;
  pointsPerDate: number;
  promotionDuration: number;
  date: Date;

  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeCustomerRepository: StoreCustomerRepository
  ) {
    this.generateCode();
    this.pointsPerCode = 50;
    this.pointsPerDate = 100;
    this.promotionDuration = 7;  // Days
    this.date = new Date();
  }

  async findAll(): Promise<Store[]> {
    return await this.storeRepository.findAll();
  }

  async findById(idstore: number): Promise<Store> {
    if (!this.isValidNumber(idstore)) {
      return Promise.reject(new Error('InvalidStoreIdError'));
    }

    return await this.storeRepository.findById(idstore);
  }

  async findByEmail(email: string): Promise<Store> {
    if (!this.isValidEmail(email)) {
      return Promise.reject(new Error('InvalidStoreEmailError'));
    }

    return await this.storeRepository.findByEmail(email);
  }

  async edit(store: Store): Promise<Store> {
    if (!this.isValidStore(store)) {
      return Promise.reject(new Error('InvalidStoreError'));
    }
    
    return await this.storeRepository.edit(store);
  }


  async points(idstore: number, idcustomer: number, body: any): Promise<StoreCustomer> {
    if (!this.isValidNumber(idstore) || !this.isValidNumber(idcustomer)) {
      return Promise.reject(new Error('InvalidCustomerOrStoreIdError'));
    }
    if (!this.isValidNumber(body.income)) {
      return Promise.reject(new Error('InvalidIncomeError'));
    }
    let storeCustomer = await this.storeCustomerRepository.findById(idstore, idcustomer);

    // If first time in this store, create storeCustomer relation
    if (storeCustomer == null) {
      const sc: StoreCustomer = {
        idstore,
        idcustomer,
        id: 0,
        points: 0
      }
      storeCustomer = await this.storeCustomerRepository.create(sc);
      if (storeCustomer == null) return null;
    }

    // Add points depending on content
    const date = new Date(body.date);

    if (body.code && parseInt(body.code) == this.code) {
      storeCustomer.points += this.pointsPerCode;
      this.generateCode();
    }

    else if (date && date.getFullYear() == this.date.getFullYear() && date.getMonth() == this.date.getMonth()) {
      const checkPeriod: number = date.getDay() - this.date.getDay();
      console.log(checkPeriod);
      if(Math.abs(checkPeriod) < this.promotionDuration){
        storeCustomer.points += this.pointsPerDate;
      } 
    }
    storeCustomer.points += body.income * 10;

    return await this.storeCustomerRepository.edit(storeCustomer);
  }

  //#region Private methods

  private generateCode() {
    this.code = Math.floor(Math.random() * 9000) + 1000;
  }

  private isValidNumber(number: number): boolean {
    return number != null && isNumber(number) && number > 0;
  }

  private isValidEmail(email: string): boolean {
    return email != null && isString(email) && email.includes('@');
  }
  
  private isValidString(string: string): boolean {
    return string != null && isString(string) && string.length >= 3;
  }

  private isValidStore(store: Store): boolean {
    return (
      store != null && this.isValidNumber(store.id)
      && this.isValidString(store.sector) && this.isValidNumber(store.phone)
    );
  }

  //#endregion
}
