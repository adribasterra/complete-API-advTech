import 'reflect-metadata';
import { Container } from 'typedi';
import { History } from './../history.model';
import { HistoryRepository } from './../history.repository';
import { HistoryService } from './../history.service';

describe('History service module', () => {
  let historyService: HistoryService;
  let historyRepositoryMock: any;
  let historys: History[];

  beforeAll(() => {
    historys = [
      {
        id: 1,
        date: new Date(),
        idcustomer: 1,
        age: 20,
        idstore: 1,
        sector: 'Tech',
        idprize: 2,
        points: 200,
        name: 'Pillow',
        category: 'Home',
      },
      {
        id: 2,
        date: new Date(),
        idcustomer: 2,
        age: 24,
        idstore: 1,
        sector: 'Tech',
        idprize: 2,
        points: 200,
        name: 'Pillow',
        category: 'Home',
      }
    ];

    historyRepositoryMock = {
      findAll: jest.fn().mockImplementation(() => historys),
      findById: jest.fn(),
      findByStoreId: jest.fn(),
      findByCustomerId: jest.fn(),
      findBySector: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(HistoryRepository, historyRepositoryMock);
    historyService = Container.get(HistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let historySpy: jest.SpyInstance;

    beforeAll(() => {
      historySpy = jest.spyOn(historyRepositoryMock, 'findAll');
    });

    it('should get all history of the database', () => {
      return historyService.findAll().then((_historys) => {
        expect(_historys).not.toBeNull();
        expect(_historys).toHaveLength(historys.length);
        expect(_historys).toEqual(historys);

        expect(historySpy).toHaveBeenCalled();
      });
    });
  });

  describe('#findById', () => {
    let historySpy: jest.SpyInstance;

    beforeAll(() => {
      historySpy = jest.spyOn(historyRepositoryMock, 'findById');
    });

    describe('when the historyId is valid', () => {
      it('should call to findById method', async () => {
        await historyService.findById(1);
        expect(historySpy).toHaveBeenCalled();
        expect(historySpy).toHaveBeenCalledTimes(1);
        expect(historySpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the historyId is not valid', () => {
      it('should throw a InvalidHistoryIdError', () => {
        return expect(historyService.findById(-1)).rejects.toThrow(
          'InvalidHistoryIdError'
        );
      });
    });
  });

  describe('#findByStoreId', () => {
    let historySpy: jest.SpyInstance;

    beforeAll(() => {
      historySpy = jest.spyOn(historyRepositoryMock, 'findByStoreId');
    });

    describe('when the historyId is valid', () => {
      it('should call to findByStoreId method', async () => {
        await historyService.findByStoreId(1);
        expect(historySpy).toHaveBeenCalled();
        expect(historySpy).toHaveBeenCalledTimes(1);
        expect(historySpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the idstore is not valid', () => {
      it('should throw a InvalidStoreIdError', () => {
        return expect(historyService.findByStoreId(-1)).rejects.toThrow(
          'InvalidStoreIdError'
        );
      });
    });
  });

  describe('#findByCustomerId', () => {
    let historySpy: jest.SpyInstance;

    beforeAll(() => {
      historySpy = jest.spyOn(historyRepositoryMock, 'findByCustomerId');
    });

    describe('when the idcustomer is valid', () => {
      it('should call to findByCustomerId method', async () => {
        await historyService.findByCustomerId(1);
        expect(historySpy).toHaveBeenCalled();
        expect(historySpy).toHaveBeenCalledTimes(1);
        expect(historySpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the idcustomer is not valid', () => {
      it('should throw a InvalidCustomerIdError', () => {
        return expect(historyService.findByCustomerId(-1)).rejects.toThrow(
          'InvalidCustomerIdError'
        );
      });
    });
  });

  describe('#findBySector', () => {
    let historySpy: jest.SpyInstance;

    beforeAll(() => {
      historySpy = jest.spyOn(historyRepositoryMock, 'findBySector');
    });

    describe('when the sector is valid', () => {
      it('should call to findBySector method', async () => {
        await historyService.findBySector('Tech');
        expect(historySpy).toHaveBeenCalled();
        expect(historySpy).toHaveBeenCalledTimes(1);
        expect(historySpy).toHaveBeenCalledWith('Tech');
      });
    });

    describe('when the sector is not valid', () => {
      it('should throw a InvalidSectorError', () => {
        return expect(historyService.findBySector('')).rejects.toThrow(
          'InvalidSectorError'
        );
      });
    });
  });

});
