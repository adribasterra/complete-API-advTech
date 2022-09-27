import { isDate, isNumber, isString } from 'lodash';
import { Service } from 'typedi';
import { History } from '../history/history.model';
import { Prize } from '../prize/prize.model';
import { PrizeRepository } from './../prize/prize.repository';
import { StoreCustomerRepository } from './../storeCustomer/storeCustomer.repository';
import { Customer } from './customer.model';
import { CustomerRepository } from './customer.repository';

@Service()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly storeCustomerRepository: StoreCustomerRepository,
    private readonly prizeRepository: PrizeRepository
  ) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }

  async findById(idcustomer: number): Promise<Customer> {
    if (!this.isValidNumber(idcustomer)) {
      return Promise.reject(new Error('InvalidCustomerIdError'));
    }

    return await this.customerRepository.findById(idcustomer);
  }

  async findByEmail(email: string): Promise<Customer> {
    if (!this.isValidEmail(email)) {
      return Promise.reject(new Error('InvalidCustomerEmailError'));
    }

    return await this.customerRepository.findByEmail(email);
  }

  async edit(customer: Customer): Promise<Customer> {
    if (!this.isValidCustomer(customer)) {
      return Promise.reject(new Error('InvalidCustomerError'));
    }

    return await this.customerRepository.edit(customer);
  }

  async exchangePrize(idstore: number, idcustomer: number, idprize: number): Promise<Prize> {
    if (!this.isValidNumber(idcustomer) || !this.isValidNumber(idstore) || !this.isValidNumber(idprize)) {
      return Promise.reject(new Error('InvalidIdError'));
    }
    let storeCustomer: any = await this.storeCustomerRepository.findById(idstore, idcustomer);
    const prize: any = await this.prizeRepository.findById(idprize, idstore);
    const customer = await this.findById(idcustomer);
    const customerAge = this.getAge(new Date(customer.birthdate));

    if(storeCustomer == null || prize == null || customer == null) return null;
    if(storeCustomer.points >= prize.points) {
      storeCustomer.points -= prize.points;
      // Create history for later
      let history: History = {
        id: 0,
        idstore,
        sector: 'tech',
        age: customerAge,
        date: new Date(),
        idcustomer,
        idprize,
        category: prize.category,
        points: prize.points,
        name: prize.name
      };
      const result = await this.customerRepository.exchangePrize(history, storeCustomer);
      if (result != null) return prize;
      return null;
    }
    return Promise.reject(new Error('NotEnoughPoints'));
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
  
  private isValidCustomer(customer: Customer): boolean {
    return (
      customer != null && this.isValidNumber(customer.id)
      && this.isValidDate(customer.birthdate) && this.isValidString(customer.postcode)
    )
  }

  private getAge(date: Date): number {
    var today = new Date();
    var age = today.getFullYear() - date.getFullYear();
    var month = today.getMonth() - date.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  }

  //#endregion
}
