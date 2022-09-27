import { Service } from 'typedi';
import { DatabaseService, DBQuery } from '../../database/src/index';
import { Prize } from './prize.model';

@Service()
export class PrizeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(idstore: number): Promise<Prize[]> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.prize WHERE idstore = $1',
      params: [idstore]
    };

    const prizes = await this.databaseService.execQuery(queryDoc);
    return prizes.rows;
  }

  async findById(idprize: number, idstore: number): Promise<Prize> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT * FROM public.prize WHERE id = $1 AND idstore = $2',
      params: [idprize, idstore]
    };
    
    const prizes = await this.databaseService.execQuery(queryDoc);
    if(prizes == null || prizes.rows == null) return null;
    return prizes.rows[0];
  }

  async create(prize: Prize): Promise<Prize> {
    const queryDoc: DBQuery = {
      sql:
        'INSERT INTO public.prize (idstore, name, category, points) VALUES ($1, $2, $3, $4) RETURNING *',
      params: [prize.idstore, prize.name, prize.category, prize.points]
    };

    const prizes = await this.databaseService.execQuery(queryDoc);
    if (prizes == null || prizes.rows == null) return null;
    return prizes.rows[0];
  }

  async edit(prize: Prize): Promise<Prize> {
    const queryDoc: DBQuery = {
      sql:
        'UPDATE public.prize SET name = $1, category = $2, points = $3 WHERE id = $4 RETURNING *',
      params: [prize.name, prize.category, prize.points, prize.id]
    };
    
    const prizes = await this.databaseService.execQuery(queryDoc);
    if (prizes == null || prizes.rows == null) return null;
    return prizes.rows[0];
  }

  async delete(idprize: number): Promise<Prize> {
    const queryDoc: DBQuery = {
      sql:
        'DELETE FROM public.prize WHERE id = $1 RETURNING *',
      params: [idprize]
    };

    const prizes = await this.databaseService.execQuery(queryDoc);
    if (prizes == null || prizes.rows == null) return null;
    return prizes.rows[0];
  }
}
