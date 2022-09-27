import 'reflect-metadata';
import { Container } from 'typedi';
import { DatabaseService, DBQuery } from '../../../database/src/index';
import { History } from '../history.model';
import { HistoryRepository } from '../history.repository';

describe('History repository module', () => {
  let historyRepository: HistoryRepository;
  let databaseServiceMock: any;

  beforeAll(() => {
    databaseServiceMock = {
      execQuery: jest.fn()
    };
  });

  beforeAll(() => {
    Container.set(DatabaseService, databaseServiceMock);
    historyRepository = Container.get(HistoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let historyFindAllSpy: jest.SpyInstance;
    let historys: History[];
    beforeAll(() => {
      historyFindAllSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

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

      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: historys,
        rowCount: historys.length
      }));
    });

    describe('when there are not any filter options', () => {
      it('should get all historys of the database', () => {
        return historyRepository.findAll().then((_historys) => {
          expect(_historys).not.toBeNull();
          expect(_historys).toHaveLength(historys.length);
          expect(_historys).toEqual(historys);

          expect(historyFindAllSpy).toHaveBeenCalled();
          expect(historyFindAllSpy).toHaveBeenCalledTimes(1);
          expect(historyFindAllSpy).toHaveBeenCalledWith({
            sql:
              'SELECT * FROM public.history',
            params: []
          });
        });
      });
    });

  });

  describe('#findById', () => {
    describe('when the history exists in the database', () => {
      let history: History;

      beforeAll(() => {
        history = {
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
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [history],
          rowCount: 1
        }));
      });

      it('should return the history queried', () => {
        return historyRepository.findById(1).then((_history) => {
          expect(_history).not.toBeNull();
          expect(_history).toEqual(history);
        });
      });
    });

    describe('when the history not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return historyRepository.findById(10).then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });
  });

  describe('#findByStoreId', () => {
    let history: History;

    beforeAll(() => {
      history = {
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
      };
    });
    describe('when the history exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [history],
          rowCount: 1
        }));
      });

      it('should return the history queried', () => {
        return historyRepository.findByStoreId(1).then((_history) => {
          expect(_history).not.toBeNull();
          expect(_history).toEqual(history);
        });
      });
    });

    describe('when the history not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return historyRepository.findByStoreId(1).then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });

    describe('when there is an error', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => (null as any));
      });

      it('should return a null value', () => {
        return historyRepository.findByStoreId(1).then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });
  });

  describe('#findByCustomerId', () => {
    describe('when the history exists in the database', () => {
      let history: History;

      beforeAll(() => {
        history = {
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
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [history],
          rowCount: 1
        }));
      });

      it('should return the history queried', () => {
        return historyRepository.findByCustomerId(1).then((_history) => {
          expect(_history).not.toBeNull();
          expect(_history).toEqual(history);
        });
      });
    });

    describe('when the history not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return historyRepository.findByCustomerId(10).then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });

    describe('when there is an error', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => (null as any));
      });

      it('should return a null value', () => {
        return historyRepository.findByCustomerId(1).then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });
  });

  describe('#findBySector', () => {
    describe('when the history exists in the database', () => {
      let history: History;

      beforeAll(() => {
        history = {
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
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [history],
          rowCount: 1
        }));
      });

      it('should return the history queried', () => {
        return historyRepository.findBySector('Tech').then((_history) => {
          expect(_history).not.toBeNull();
          expect(_history).toEqual(history);
        });
      });
    });

    describe('when the history not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return historyRepository.findBySector('Other').then((_history) => {
          expect(_history).toBeNull();
        });
      });
    });
  });

  describe('#create', () => {
    let query: DBQuery;
    let history: History;
    
    beforeAll(() => {
      history = {
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
      };
    })
    beforeAll(() => {
      query = {
        sql:
          'INSERT INTO public.history (date, idcustomer, age, idstore, sector, idprize, points, name, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        params: [history.date, history.idcustomer, history.age, history.idstore, history.sector, history.idprize, history.points, history.name, history.category]
      }
    })
    it('should call create function', async () => {
      const _query = await historyRepository.create(history);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });
});
