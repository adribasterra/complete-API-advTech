import { isNumber, isString } from 'lodash';
import { Service } from 'typedi';
import { Admin } from './admin.model';
import { AdminRepository } from './admin.repository';
import { Demographics } from './stats/demographics.model';
import { Economics } from './stats/economics.model';
import { Purchases } from './stats/purchases.model';

@Service()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.findAll();
  }

  async findById(idAdmin: number): Promise<Admin> {
    if (!this.isValidNumber(idAdmin)) {
      return Promise.reject(new Error('InvalidAdminIdError'));
    }

    return await this.adminRepository.findById(idAdmin);
  }

  async findByEmail(email: string): Promise<Admin> {
    if (!this.isValidEmail(email)) {
      return Promise.reject(new Error('InvalidAdminEmailError'));
    }
    
    return await this.adminRepository.findByEmail(email);
  }
  
  async edit(admin: Admin): Promise<Admin> {
    if (!this.isValidAdmin(admin)) {
      return Promise.reject(new Error('InvalidAdminError'));
    }

    return await this.adminRepository.edit(admin);
  }
  
  async statsDemographics(): Promise<any> {
    const data: Demographics = await this.adminRepository.statsDemographics();

    let stats = {
      '<18': data['<18'],
      '18-30': data['18-30'],
      '40-65': data['40-65'],
      '+65': data['+65']
    }

    return stats;
  }
  
  async statsPurchases(): Promise<any> {
    const data: Purchases = await this.adminRepository.statsPurchases();
    if (data == null || data.averagePurchases == null || data.customerNumPurchases == null || data.maxPurchases == null) return null;

    const stats = {
      'Number of purchases per customer': data.customerNumPurchases,
      'Max number of purchases': data.maxPurchases,
      'Average per customer': data.averagePurchases
    }

    return stats;
  }
  
  async statsEconomics(): Promise<any> {
    const data: Economics = await this.adminRepository.statsEconomics();
    if (data == null || data.averageExpenses == null || data.customerSumExpenses == null || data.maxSpent == null) return null;

    let stats = {
      'Average spending per Customer': data.customerSumExpenses,
      'Max spent': data.maxSpent,
      'Total spent': data.averageExpenses
    }

    return stats;
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

  private isValidAdmin(admin: Admin): boolean {
    return (
      admin != null && this.isValidNumber(admin.id) && this.isValidString(admin.role)
    );
  }
  
  //#endregion
}
