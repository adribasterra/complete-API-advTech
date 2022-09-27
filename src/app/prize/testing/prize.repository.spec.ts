import 'reflect-metadata';
import { Container } from 'typedi';
import { DatabaseService } from '../../../database/src/index';
import { Prize } from '../prize.model';
import { PrizeRepository } from '../prize.repository';

describe('Prize repository module', () => {
  let prizeRepository: PrizeRepository;
  let databaseServiceMock: any;

  beforeAll(() => {
    databaseServiceMock = {
      execQuery: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(DatabaseService, databaseServiceMock);
    prizeRepository = Container.get(PrizeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let prizeFindAllSpy: jest.SpyInstance;
    let prizes: Prize[];
    beforeAll(() => {
      prizeFindAllSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

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

      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: prizes,
        rowCount: prizes.length
      }));
    });

    describe('when there are not any filter options', () => {
      it('should get all prizes of the database', () => {
        return prizeRepository.findAll(2).then((_prizes) => {
          expect(_prizes).not.toBeNull();
          expect(_prizes).toHaveLength(prizes.length);
          expect(_prizes).toEqual(prizes);

          expect(prizeFindAllSpy).toHaveBeenCalled();
          expect(prizeFindAllSpy).toHaveBeenCalledTimes(1);
          expect(prizeFindAllSpy).toHaveBeenCalledWith({
            sql:
              'SELECT * FROM public.prize WHERE idstore = $1',
            params: [prizes[0].idstore]
          });
        });
      });
    });

  });

  describe('#findById', () => {
    describe('when the prize exists in the database', () => {
      let prize: Prize;

      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [prize],
          rowCount: 1
        }));
      });

      it('should return the prize queried', () => {
        return prizeRepository.findById(1, 1).then((_prize) => {
          expect(_prize).not.toBeNull();
          expect(_prize).toEqual(prize);
        });
      });
    });

    describe('when the prize not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return prizeRepository.findById(10, 1).then((_prize) => {
          expect(_prize).toBeNull();
        });
      });
    });
  });

  describe('#create', () => {
    describe('when the prize does not exist in the database', () => {
      let prizeDeleteSpy: jest.SpyInstance;
      let prize: Prize;

      beforeAll(() => {
        prizeDeleteSpy = jest.spyOn(databaseServiceMock, 'execQuery');
      });

      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [prize],
          rowCount: 1
        }));
      });

      it('should return the introduced prize', () => {
        return prizeRepository.create(prize).then((_prize) => {
          expect(_prize).not.toBeNull();
          expect(_prize).toEqual(prize);
        });
      });
    });

    describe('when the function returns null', () => {
      let prizeDeleteSpy: jest.SpyInstance;
      let prize: Prize;

      beforeAll(() => {
        prizeDeleteSpy = jest.spyOn(databaseServiceMock, 'execQuery');
      });

      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => (null as any));
      });

      it('should return the introduced prize', () => {
        return prizeRepository.create(prize).then((_prize) => {
          expect(_prize).toBeNull();
        });
      });
    });

    describe('when the function returns rows as null', () => {
      let prizeDeleteSpy: jest.SpyInstance;
      let prize: Prize;

      beforeAll(() => {
        prizeDeleteSpy = jest.spyOn(databaseServiceMock, 'execQuery');
      });

      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: (null as any),
          rowCount: 0
        }));
      });

      it('should return the introduced prize', () => {
        return prizeRepository.create(prize).then((_prize) => {
          expect(_prize).toBeNull();
        });
      });
    });
  });

  describe('#delete', () => {
    let prizeDeleteSpy: jest.SpyInstance;
    let prizes: Prize[];

    beforeAll(() => {
      prizeDeleteSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    beforeAll(() => {
      prizes = [
        {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: 200
        },
        {
          id: 2,
          idstore: 1,
          name: 'Coach',
          category: 'Home',
          points: 400
        }
      ];
      
      const count = prizes.length -1;
      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: [prizes[1]],
        rowCount: count
      }));
    });

    describe('when id is correct', () => {
      it('should delete the prize of the database', () => {
        return prizeRepository.delete(1).then((_prize) => {
          expect(_prize).toEqual(prizes[1]);

          expect(prizeDeleteSpy).toHaveBeenCalled();
          expect(prizeDeleteSpy).toHaveBeenCalledTimes(1);
          expect(prizeDeleteSpy).toHaveBeenCalledWith({
            sql:
              'DELETE FROM public.prize WHERE id = $1 RETURNING *',
            params: [prizes[0].id]
          });
        });
      });
    });

    describe('when there is an error', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => (null as any));
      });

      it('should return a null value', () => {
        return prizeRepository.delete(1).then((_prize) => {
          expect(_prize).toBeNull();
        });
      });
    });

    describe('when the prize not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return prizeRepository.delete(1).then((_prize) => {
          expect(_prize).toBeNull();
        });
      });
    });
  });

  describe('#edit', () => {
    describe('when the prize exists in the database', () => {
      let prize: Prize;

      beforeAll(() => {
        prize = {
          id: 1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [prize],
          rowCount: 1
        }));
      });

      it('should return the prize queried', () => {
        return prizeRepository.edit(prize).then((_prize) => {
          expect(_prize).not.toBeNull();
          expect(_prize).toEqual(prize);
        });
      });
    });

    describe('when the prize not exists in the database', () => {
      let prize: Prize;
      beforeAll(() => {
        prize = {
          id: -1,
          idstore: 1,
          name: 'Pillow',
          category: 'Home',
          points: 200
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return prizeRepository.edit(prize).then((_prize) => {
          expect(_prize).toBeNull();
        });
      });
    });
  });

});
