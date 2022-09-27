import { Pool, PoolClient } from 'pg';
import { Service } from 'typedi';

import { DBOptions } from './models/db-options';
import { DBQuery } from './models/db-query';
import { DBQueryResult } from './models/db-query-result';
import { DBTransaction } from './models/db-transaction';

@Service()
export class DatabaseService {
  private dbPool: Pool;

  /**
   * Función que conecta con la base de datos e inicializa el pool de conexiones
   */
  initConnectionPool(dbOptions: DBOptions): void {
    this.dbPool = this.createPostgreSQLInstance(dbOptions);
  }

  /**
   * Esta función tiene el objetivo de ejecutar una determinada consulta SQL y
   * devolver los resultados de la ejecución.
   */
  async execQuery(query: DBQuery): Promise<DBQueryResult> {
    const dbClient = await this.getConnection();
    const { sql, params } = query;

    try {
      const { rows, rowCount } = await dbClient.query({
        text: sql,
        values: params
      });

      return { rows, rowCount };
    } finally {
      dbClient.release();
    }
  }

  /**
   * Esta función tiene el objetivo de crear una nueva conexión con el pool e
   * inicializar la transacción, no cerramos la conexión del pool ya que esta
   * tiene que estar activa hasta que se haga el COMMIT o el ROLLBACK
   * correspondiente.
   */
  async startTransaction(): Promise<DBTransaction> {
    const dbClient = await this.getConnection();
    return new DBTransaction(dbClient);
  }

  /**
   * Si hay una instancia creada la devolvemos, sino creamos un nuevo pool de
   * conexiones.
   */
  private createPostgreSQLInstance(dbOptions: DBOptions): Pool {
    if (this.dbPool != null) {
      return this.dbPool;
    }

    return new Pool({
      user: dbOptions.user,
      host: dbOptions.host,
      database: dbOptions.database,
      password: dbOptions.password,
      port: dbOptions.port
    });
  }

  /**
   * Esta función permite devolver el cliente resultante de conectarse al pool.
   */
  private getConnection(): Promise<PoolClient> {
    return this.dbPool.connect();
  }
}
