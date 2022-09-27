import 'reflect-metadata';

import request = require('supertest');
import { Container } from 'typedi';
import * as HttpStatus from 'http-status-codes';
import { DatabaseService, DBQuery } from '../../../database/src/index';

import { Server } from '../../../server/server';
import { Application } from 'express';
import { Api } from '../../../server/api/api';
import { config } from '../../../config/environment';

describe('message API module', () => {
  let app: Application;
  let server: Server;
  let id: number;
  let idstore: number;
  let idcustomer: number;

  let token: string = null;

  beforeAll(async () => {
    const containterDB = Container.get(DatabaseService);

    try {
      containterDB.initConnectionPool(config.postgres);
      server = Container.get(Server);
      Container.get(Api);
      app = server.app;

      await containterDB
        .execQuery({
          sql: 'DELETE FROM public.customer WHERE id is not null',
          params: []
        })
        .then(() => { });
      await containterDB
        .execQuery({
          sql: 'DELETE FROM public.store WHERE id is not null',
          params: []
        })
        .then(() => { });
      await containterDB
        .execQuery({ sql: 'DELETE FROM public.admin WHERE id is not null', params: [] })
        .then(() => { });
      await containterDB
        .execQuery({
          sql: 'DELETE FROM public.auth WHERE idauth is not null',
          params: []
        })
        .then(() => { });
    } catch (err) {
      console.error('Database connection error: ' + err);
    }
  });

  afterAll(() => {
    server.httpServer.close(() => {
    });
  });

  describe('POST admin signup', () => {
    describe('when all data is correct', () => {
    it('should signup an admin', () => {
      const req = request(app).post(
        '/auth/admins/signup'
      ).send({ name: 'Raul', email: 'rnovoa@usj.es', password: 'pwd', role: 'admin' }
      );
      return req.then((res: any) => {
        id = res.body.id;
        expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
      });
    });
    });

    describe('when data is missing', () => {
      it('should fail signup an admin', () => {
        const req = request(app)
          .post('/auth/admins/signup')
          .send({ name: 'Raul', email: 'rnovoa@usj.es' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.BAD_REQUEST);
        });
      });
    });
  });

  describe('POST admin login', () => {
    describe('when all data is correct', () => {
      it('should login an admin', () => {
        const req = request(app)
          .post('/auth/admins/login')
          .send({ email: 'rnovoa@usj.es', password: 'pwd' });
        return req.then((res: any) => {
          token = res.body.token;
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when data is incorrect', () => {
      it('should fail login an admin', () => {
        const req = request(app)
          .post('/auth/admins/login')
          .send({ email: 'rnovoa@usj.es', pwd: 'aaaa' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });

  describe('GET admin', () => {
    describe('when all data is correct', () => {
      it('should get admin', () => {
        const req = request(app)
          .get(`/api/admins/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get admin', () => {
        const req = request(app)
          .get(`/api/admins/${id}`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });

  describe('PUT admin', () => {
    describe('when all data is correct', () => {
      it('should edit admin', () => {
        const req = request(app)
          .put(`/api/admins/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ role: 'user' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail edit admin', () => {
        const req = request(app)
          .put(`/api/admins/${id}`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail edit admin', () => {
        const req = request(app)
          .put(`/api/admins/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });

  describe('DELETE admin', () => {
    describe('when all data is correct', () => {
      it('should delete admin', () => {
        const req = request(app)
          .delete(`/api/admins/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail delete admin', () => {
        const req = request(app)
          .delete(`/api/admins/${id}`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is incorrect', () => {
      it('should fail delete admin', () => {
        const req = request(app)
          .delete(`/api/admins/-1`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });

  describe('GET stores', () => {
    describe('when all data is correct', () => {
      it('should get list of stores', () => {
        const req = request(app)
          .get('/api/stores/')
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get list of stores', () => {
        const req = request(app)
          .get('/api/stores/');
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });

  describe('POST store', () => {
    describe('when data is correct', () => {
      it('should signup an store', () => {
        const req = request(app)
          .post('/auth/stores/signup')
          .send({ name: 'Store', email: 'store@usj.es', password: 'pwd', sector: 'Tech', phone: 68402472 });
        return req.then((res: any) => {
          idstore = parseInt(res.body.id);
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail signup an store', () => {
        const req = request(app)
          .post('/auth/stores/signup')
          .send({ name: 'Store', email: 'store@usj.es' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.BAD_REQUEST);
        });
      });
    });

    describe('when body is missing', () => {
      it('should fail signup an store', () => {
        const req = request(app)
          .post('/auth/stores/signup')
          .send();
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.BAD_REQUEST);
        });
      });
    });
  });

  describe('GET store', () => {
    describe('when all data is correct', () => {
      it('should get store', () => {
        const req = request(app)
          .get(`/api/admins/${id}/stores/${idstore}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get store', () => {
        const req = request(app)
          .get(`/api/admins/${id}/stores/${idstore}`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is incorrect', () => {
      it('should fail get store', () => {
        const req = request(app)
          .get(`/api/admins/${id}/stores/${idstore-1}`)
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });

  describe('GET customers', () => {
    describe('when all data is correct', () => {
      it('should get list of customers', () => {
        const req = request(app)
          .get(`/api/admins/${id}/customers`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get list of customers', () => {
        const req = request(app)
          .get(`/api/admins/${id}/customers`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is incorrect', () => {
      it('should fail get list of customers when incorrect id', () => {
        const req = request(app)
          .get(`/api/admins/${id - 1}/customers`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });

  describe('POST customer signup', () => {
    describe('when all data is correct', () => {
      it('should signup an customer', () => {
        const req = request(app)
          .post('/auth/customers/signup')
          .send({ name: 'Customer', email: 'customer@usj.es', password: 'pwd', birthdate: new Date(), postcode: '50005' }
        );
        return req.then((res: any) => {
          idcustomer = res.body.id;
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail signup an customer', () => {
        const req = request(app)
          .post('/auth/customers/signup')
          .send({ name: 'Customer', email: 'customer@usj.es' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.BAD_REQUEST);
        });
      });
    });
  });

  describe('GET customer', () => {
    describe('when all data is correct', () => {
      it('should get customer', () => {
        const req = request(app)
          .get(`/api/admins/${id}/customers/${idcustomer}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get customer', () => {
        const req = request(app)
          .get(`/api/admins/${id}/customers/${idcustomer}`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is incorrect', () => {
      it('should fail get customer', () => {
        const req = request(app)
          .get(`/api/admins/${id}/customers/${idcustomer - 1}`)
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });

  describe('GET stats', () => {
    describe('when token is missing', () => {
      it('should fail get stats', () => {
        const req = request(app)
          .get(`/api/admins/${id}/stats`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is incorrect', () => {
      it('should fail get stats', () => {
        const req = request(app)
          .get(`/api/admins/${id - 1}/stats`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });
});
