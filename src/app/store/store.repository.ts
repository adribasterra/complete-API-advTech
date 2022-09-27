import { Service } from 'typedi';
import { DatabaseService, DBQuery } from '../../database/src/index';
import { AuthRepository } from './../auth/auth.repository';
import { Store } from './store.model';

@Service()
export class StoreRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly authRepository: AuthRepository
  ) {}

  async findAll(): Promise<Store[]> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT s.*, a.email, a.name FROM public.store s inner join public.auth a on s.iduser = a.idauth',
      params: []
    };

    const stores = await this.databaseService.execQuery(queryDoc);
    return stores.rows;
  }

  async findById(idstore: number): Promise<Store> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT s.*, a.email, a.name FROM public.store s inner join public.auth a on s.iduser = a.idauth WHERE s.id = $1',
      params: [idstore]
    };

    const stores = await this.databaseService.execQuery(queryDoc);
    if(stores == null || stores.rows == null) return null;
    return stores.rows[0];
  }

  async findByEmail(email: string): Promise<Store> {
    const queryDoc: DBQuery = {
      sql:
        'SELECT s.*, a.* FROM public.store s inner join public.auth a on s.iduser = a.idauth WHERE a.email = $1',
      params: [email]
    };

    const stores = await this.databaseService.execQuery(queryDoc);
    if(stores == null || stores.rows == null) return null;
    return stores.rows[0];
  }

  find(storeId: number): DBQuery {
    return {
      sql:
        'SELECT s.*, a.email, a.name FROM public.store s inner join public.auth a on s.iduser = a.idauth WHERE s.id = $1',
      params: [storeId]
    };
  }

  create(store: Store): DBQuery {
    return {
      sql:
        'INSERT INTO public.store (iduser, sector, phone) VALUES ($1, $2, $3) RETURNING *',
      params: [store.iduser, store.sector, store.phone]
    };
  }

  async edit(store: Store): Promise<Store> {
    const queryDoc: DBQuery = {
      sql:
        'UPDATE public.store SET sector = $1, phone = $2 WHERE id = $3 RETURNING *',
      params: [store.sector, store.phone, store.id]
    };

    const stores = await this.databaseService.execQuery(queryDoc);
    if (stores == null || stores.rows == null) return null;
    return stores.rows[0];
  }

  delete(idStore: number): DBQuery {
    return {
      sql:
      'DELETE FROM public.store WHERE id = $1 RETURNING *',
      params: [idStore]
    };
  }
}
