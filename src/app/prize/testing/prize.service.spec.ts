import 'reflect-metadata';
import { Container } from 'typedi';
import { Prize } from './../prize.model';
import { PrizeRepository } from './../prize.repository';
import { PrizeService } from './../prize.service';

describe('Prize service module', () => {
  let prizeService: PrizeService;
  let prizeRepositoryMock: any;
  let prizes: Prize[];

  beforeAll(() => {
    prizes = [
      {
        id: 1,
        idstore: 2,
        name: 'Pillow',
        category: 'Home',
        points: 200
      },
      {
        id: 2,
        idstore: 2,
        name: 'Bed',
        category: 'Home',
        points: 1000
      }
    ];

    prizeRepositoryMock = {
      findAll: jest.fn().mockImplementation(() => prizes),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(PrizeRepository, prizeRepositoryMock);
    prizeService = Container.get(PrizeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let prizeSpy: jest.SpyInstance;

    beforeAll(() => {
      prizeSpy = jest.spyOn(prizeRepositoryMock, 'findAll');
    });

    describe('when the idstore is valid', () => {
      it('should get all prizes of that store in the database', () => {
        return prizeService.findAll(2).then((_prizes) => {
          expect(_prizes).not.toBeNull();
          expect(_prizes).toHaveLength(prizes.length);
          expect(_prizes).toEqual(prizes);

          expect(prizeSpy).toHaveBeenCalled();
          expect(prizeSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('when the idstore is not valid', () => {
      it('should throw a InvalidStoreIdError', () => {
        return expect(prizeService.findAll(-1)).rejects.toThrow(
          'InvalidStoreIdError'
        );
      });
    });
  });

  describe('#findById', () => {
    let prizeSpy: jest.SpyInstance;

    beforeAll(() => {
      prizeSpy = jest.spyOn(prizeRepositoryMock, 'findById');
    });

    describe('when the idprize is valid', () => {
      it('should call to findById method', async () => {
        await prizeService.findById(1, 1);
        expect(prizeSpy).toHaveBeenCalled();
        expect(prizeSpy).toHaveBeenCalledTimes(1);
        expect(prizeSpy).toHaveBeenCalledWith(1, 1);
      });
    });

    describe('when the idprize is not valid', () => {
      it('should throw a InvalidPrizeIdsError', () => {
        return expect(prizeService.findById(-1, 1)).rejects.toThrow(
          'InvalidPrizeIdsError'
        );
      });
    });

    describe('when the idstore is not valid', () => {
      it('should throw a InvalidPrizeIdsError', () => {
        return expect(prizeService.findById(1, -1)).rejects.toThrow(
          'InvalidPrizeIdsError'
        );
      });
    });
  });

  describe('#create', () => {
    let prizeSpy: jest.SpyInstance;
    let prize: Prize;

    beforeAll(() => {
      prizeSpy = jest.spyOn(prizeRepositoryMock, 'create');
    });

    beforeAll(() => {
      prize = {
        id: 1,
        idstore: 1,
        name: 'Pillow',
        category: 'Home',
        points: 200
      };
    });

    describe('when the prize is valid', () => {
      it('should call to create method', async () => {
        await prizeService.create(prize);
        expect(prizeSpy).toHaveBeenCalled();
        expect(prizeSpy).toHaveBeenCalledTimes(1);
        expect(prizeSpy).toHaveBeenCalledWith(prize);
      });
    });

    describe('when the prize is not valid', () => {
      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: '',
          points: 200
        };
      });
      it('should throw a InvalidPrizeError', () => {
        return expect(prizeService.create(prize)).rejects.toThrow(
          'InvalidPrizeError'
        );
      });
    });

    describe('when the prize is not valid', () => {
      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: -200
        };
      });
      it('should throw a InvalidPrizeError', () => {
        return expect(prizeService.create(prize)).rejects.toThrow(
          'InvalidPrizeError'
        );
      });
    });
  });

  describe('#edit', () => {
    let prizeSpy: jest.SpyInstance;
    let prize: Prize;

    beforeAll(() => {
      prizeSpy = jest.spyOn(prizeRepositoryMock, 'edit');
    });

    beforeAll(() => {
      prize = {
        id: 1,
        idstore: 1,
        name: 'Pillow',
        category: 'Home',
        points: 200
      };
    });

    describe('when the prize is valid', () => {
      it('should call to edit method', async () => {
        await prizeService.edit(prize);
        expect(prizeSpy).toHaveBeenCalled();
        expect(prizeSpy).toHaveBeenCalledTimes(1);
        expect(prizeSpy).toHaveBeenCalledWith(prize);
      });
    });

    describe('when the prize is not valid', () => {
      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: '',
          points: 200
        };
      });
      it('should throw a InvalidPrizeError', () => {
        return expect(prizeService.edit(prize)).rejects.toThrow(
          'InvalidPrizeError'
        );
      });
    });

    describe('when the prize is not valid', () => {
      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: -200
        };
      });
      it('should throw a InvalidPrizeError', () => {
        return expect(prizeService.edit(prize)).rejects.toThrow(
          'InvalidPrizeError'
        );
      });
    });
  });

  describe('#delete', () => {
    let prizeSpy: jest.SpyInstance;

    beforeAll(() => {
      prizeSpy = jest.spyOn(prizeRepositoryMock, 'delete');
    });

    describe('when the idprize is valid', () => {
      it('should call to delete method', async () => {
        await prizeService.delete(1);
        expect(prizeSpy).toHaveBeenCalled();
        expect(prizeSpy).toHaveBeenCalledTimes(1);
        expect(prizeSpy).toHaveBeenCalledWith(1);
      });
    });

    describe('when the idprize is not valid', () => {
      it('should throw a InvalidPrizeIdError', () => {
        return expect(prizeService.delete(-1)).rejects.toThrow(
          'InvalidPrizeIdError'
        );
      });
    });
  });
});
