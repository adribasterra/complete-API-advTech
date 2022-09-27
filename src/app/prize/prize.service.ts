import { isNumber, isString } from 'lodash';
import { Service } from 'typedi';
import { Prize } from './prize.model';
import { PrizeRepository } from './prize.repository';

@Service()
export class PrizeService {
  constructor(private readonly prizeRepository: PrizeRepository) {}

  async findAll(idstore: number): Promise<Prize[]> {
    if (!this.isValidNumber(idstore)) {
      return Promise.reject(new Error('InvalidStoreIdError'));
    }

    return await this.prizeRepository.findAll(idstore);
  }

  async findById(idprize: number, idstore: number): Promise<Prize> {
    if (!this.isValidNumber(idprize) || !this.isValidNumber(idstore)) {
      return Promise.reject(new Error('InvalidPrizeIdsError'));
    }

    return await this.prizeRepository.findById(idprize, idstore);
  }

  async create(prize: Prize): Promise<Prize> {
    if (!this.isValidPrize(prize)) {
      return Promise.reject(new Error('InvalidPrizeError'));
    }

    return await this.prizeRepository.create(prize);
  }


  async edit(prize: Prize): Promise<Prize> {
    if (!this.isValidPrize(prize)) {
      return Promise.reject(new Error('InvalidPrizeError'));
    }
    
    return await this.prizeRepository.edit(prize);
  }

  async delete(idprize: number): Promise<Prize> {
    if (!this.isValidNumber(idprize)) {
      return Promise.reject(new Error('InvalidPrizeIdError'));
    }

    return await this.prizeRepository.delete(idprize);
  }


  //#region Private methods

  private isValidNumber(number: number): boolean {
    return number != null && isNumber(number) && number > 0;
  }

  private isValidString(string: string): boolean {
    return string != null && isString(string) && string.length >= 3;
  }

  private isValidPrize(prize: Prize): boolean {
    return (
      prize != null
      && this.isValidNumber(prize.idstore) && this.isValidString(prize.name)
      && this.isValidString(prize.category) && this.isValidNumber(prize.points)
    );
  }

  //#endregion
}
