export const development: any = {
  postgres: {
    user: 'root',
    host: '127.0.0.1',
    database: 'loyalty',
    password: 'root',
    port: 5432
  },
  secrets: {
    session: 'xxx.hhhh.abcd',
    expiresIn: 60 * 60 * 24 * 30
  }
};
