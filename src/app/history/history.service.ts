import { isNumber, isString } from 'lodash';
import { Service } from 'typedi';
import { History } from './history.model';
import { HistoryRepository } from './history.repository';

@Service()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) { }

  async findAll(): Promise<History[]> {
    return await this.historyRepository.findAll();
  }

  async findById(historyId: number): Promise<History> {
    if (!this.isValidNumber(historyId)) {
      return Promise.reject(new Error('InvalidHistoryIdError'));
    }

    return await this.historyRepository.findById(historyId);
  }

  async findByStoreId(idstore: number): Promise<History> {
    if (!this.isValidNumber(idstore)) {
      return Promise.reject(new Error('InvalidStoreIdError'));
    }

    return await this.historyRepository.findByStoreId(idstore);
  }

  async findByCustomerId(idcustomer: number): Promise<History> {
    if (!this.isValidNumber(idcustomer)) {
      return Promise.reject(new Error('InvalidCustomerIdError'));
    }

    return await this.historyRepository.findByCustomerId(idcustomer);
  }

  async findBySector(sector: string): Promise<History> {
    if (!this.isValidString(sector)) {
      return Promise.reject(new Error('InvalidSectorError'));
    }

    return await this.historyRepository.findBySector(sector);
  }

  //#region Private methods

  private isValidNumber(number: number): boolean {
    return number != null && isNumber(number) && number > 0;
  }

  private isValidString(string: string): boolean {
    return string != null && isString(string) && string.length >= 3;
  }

  //#endregion
}
