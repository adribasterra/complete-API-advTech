import { Service } from 'typedi';
import { DatabaseService, DBQuery } from '../../database/src/index';
import { History } from './history.model';

@Service()
export class HistoryRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll(): Promise<History[]> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.history',
      params: []
    };

    const historys = await this.databaseService.execQuery(queryDoc);
    return historys.rows;
  }

  async findById(historyId: number): Promise<History> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.history WHERE id = $1',
      params: [historyId]
    };

    const historys = await this.databaseService.execQuery(queryDoc);
    if (historys == null || historys.rows == null) return null;
    return historys.rows[0];
  }

  async findByStoreId(idstore: number): Promise<History> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.history WHERE idstore = $1',
      params: [idstore]
    };

    const historys = await this.databaseService.execQuery(queryDoc);
    if (historys == null || historys.rows == null) return null;
    return historys.rows[0];
  }

  async findByCustomerId(idcustomer: number): Promise<History> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.history WHERE idcustomer = $1',
      params: [idcustomer]
    };

    const historys = await this.databaseService.execQuery(queryDoc);
    if (historys == null || historys.rows == null) return null;
    return historys.rows[0];
  }

  async findBySector(sector: string): Promise<History> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.history WHERE sector = $1',
      params: [sector]
    };

    const historys = await this.databaseService.execQuery(queryDoc);
    if (historys == null || historys.rows == null) return null;
    return historys.rows[0];
  }

  create(history: History): DBQuery {
    return {
      sql:
        'INSERT INTO public.history (date, idcustomer, age, idstore, sector, idprize, points, name, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      params: [history.date, history.idcustomer, history.age, history.idstore, history.sector, history.idprize, history.points, history.name, history.category]
    };
  }
}
