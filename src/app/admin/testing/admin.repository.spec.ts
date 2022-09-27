import 'reflect-metadata';

import { DatabaseService, DBQuery } from '../../../database/src/index';
import { Container } from 'typedi';

import { Admin } from '../admin.model';
import { AdminRepository } from '../admin.repository';

describe('Admin repository module', () => {
  let adminRepository: AdminRepository;
  let databaseServiceMock: any;
  let transactionMock: any;

  beforeAll(() => {
    transactionMock = {
      addQuery: jest.fn().mockImplementation(() => ({ rows: [], rowCount: 0 })),
      commit: jest.fn()
    };

    databaseServiceMock = {
      execQuery: jest.fn(),
      startTransaction: jest.fn().mockImplementation(() => transactionMock)
    };
  });

  beforeAll(() => {
    Container.set(DatabaseService, databaseServiceMock);
    adminRepository = Container.get(AdminRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#findAll', () => {
    let adminFindAllSpy: jest.SpyInstance;
    let admin: Admin[];
    beforeAll(() => {
      adminFindAllSpy = jest.spyOn(databaseServiceMock, 'execQuery');
    });

    beforeAll(() => {
      admin = [
        {
          id: 1,
          iduser: 1,
          name: 'Raul Novoa',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          role: 'admin'
        },
        {
          id: 2,
          iduser: 2,
          name: 'Luis Fernandez',
          email: 'luis@usj.es',
          password: 'pwd',
          role: 'user'
        }
      ];

      databaseServiceMock.execQuery.mockImplementation(() => ({
        rows: admin,
        rowCount: admin.length
      }));
    });

    describe('when there are not any filter options', () => {
      it('should get all admin of the database', () => {
        return adminRepository.findAll().then((_admin) => {
          expect(_admin).not.toBeNull();
          expect(_admin).toHaveLength(admin.length);
          expect(_admin).toEqual(admin);

          expect(adminFindAllSpy).toHaveBeenCalled();
          expect(adminFindAllSpy).toHaveBeenCalledTimes(1);
          expect(adminFindAllSpy).toHaveBeenCalledWith({
            sql:
              'SELECT ad.*, a.email, a.name FROM public.admin ad inner join public.auth a on ad.iduser = a.idauth',
            params: []
          });
        });
      });
    });

  });

  describe('#findById', () => {
    describe('when the admin exists in the database', () => {
      let admin: Admin;

      beforeAll(() => {
        admin = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          role: 'admin'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [admin],
          rowCount: 1
        }));
      });

      it('should return the admin queried', () => {
        return adminRepository.findById(1).then((_admin) => {
          expect(_admin).not.toBeNull();
          expect(_admin).toEqual(admin);
        });
      });
    });

    describe('when the admin not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return adminRepository.findById(10).then((_admin) => {
          expect(_admin).toBeNull();
        });
      });
    });
  });

  describe('#findByEmail', () => {
    describe('when the admin exists in the database', () => {
      let admin: Admin;

      beforeAll(() => {
        admin = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          role: 'admin'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [admin],
          rowCount: 1
        }));
      });

      it('should return the admin queried', () => {
        return adminRepository.findByEmail('rnovoa@usj.es').then((_admin) => {
          expect(_admin).not.toBeNull();
          expect(_admin).toEqual(admin);
        });
      });
    });

    describe('when the admin not exists in the database', () => {
      beforeAll(() => {
        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return adminRepository.findByEmail('rnovoa@usj.es').then((_admin) => {
          expect(_admin).toBeNull();
        });
      });
    });
  });
  
  describe('#find', () => {
    let query : DBQuery;
    let admin : Admin;

    beforeAll(() => {
      admin = {
        id: 1,
        iduser: 1,
        name: 'Raul Novoa',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        role: 'admin'
      };
    });
    beforeAll(() => {
      query = {
        sql:
        'SELECT * FROM public.admin WHERE id = $1',
        params: [admin.id]
        }
    });
    it('should call find function', async () => {
      const _query = await adminRepository.find(1);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });

  describe('#edit', () => {
    describe('when the admin exists in the database', () => {
      let admin: Admin;

      beforeAll(() => {
        admin = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          role: 'admin'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rows: [admin],
          rowCount: 1
        }));
      });

      it('should return the admin queried', () => {
        return adminRepository.edit(admin).then((_admin) => {
          expect(_admin).not.toBeNull();
          expect(_admin).toEqual(admin);
        });
      });
    });

    describe('when the admin not exists in the database', () => {
      let admin: Admin;
      beforeAll(() => {
        admin = {
          id: 1,
          iduser: 1,
          name: '10labs',
          email: 'rnovoa@usj.es',
          password: 'pwd',
          role: 'admin'
        };

        databaseServiceMock.execQuery.mockImplementationOnce(() => ({
          rowCount: 0
        }));
      });

      it('should return a null value', () => {
        return adminRepository.edit(admin).then((_admin) => {
          expect(_admin).toBeNull();
        });
      });
    });
  });

  describe('#create', () => {
    let query: DBQuery;
    let admin: Admin;

    beforeAll(() => {
      admin = {
        id: 1,
        iduser: 1,
        name: '10labs',
        email: 'rnovoa@usj.es',
        password: 'pwd',
        role: 'admin'
      };
    });
    beforeAll(() => {
      query = {
        sql:
          'INSERT INTO public.admin (iduser, role) VALUES ($1, $2) RETURNING *',
        params: [admin.iduser, admin.role]
      }
    });
    it('should call create function', async () => {
      const _query = await adminRepository.create(admin);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });

  describe('#delete', () => {
    let query: DBQuery;

    beforeAll(() => {
      query = {
        sql:
          'DELETE FROM public.admin WHERE id = $1 RETURNING *',
        params: [1]
      }
    });
    it('should call delete function', async () => {
      const _query = await adminRepository.delete(1);
      expect(_query).toBeTruthy();
      expect(_query).toEqual(query)
    })
  });
});
