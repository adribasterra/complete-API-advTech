import { Application } from 'express';
import * as HttpStatus from 'http-status-codes';
import 'reflect-metadata';
import { Container } from 'typedi';
import { config } from '../../../config/environment';
import { DatabaseService } from '../../../database/src/index';
import { Api } from '../../../server/api/api';
import { Server } from '../../../server/server';

import request = require('supertest');

describe('message API module', () => {
  let app: Application;
  let server: Server;
  
  let id: number;
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
        .execQuery({
          sql: 'DELETE FROM public.admin WHERE id is not null',
          params: []
        })
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

  describe('POST customer signup', () => {
    describe('when all data is correct', () => {
      it('should signup an customer', () => {
        const req = request(app).post(
          '/auth/customers/signup'
        ).send({ name: 'Customer', email: 'customer@usj.es', password: 'pwd', birthdate: new Date(), postcode: '50005' }
        );
        return req.then((res: any) => {
          id = res.body.id;
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

  describe('POST customer login', () => {
    describe('when all data is correct', () => {
      it('should login an customer', () => {
        const req = request(app)
          .post('/auth/customers/login')
          .send({ email: 'customer@usj.es', password: 'pwd' });
        return req.then((res: any) => {
          token = res.body.token;
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when data is incorrect', () => {
      it('should fail login an customer', () => {
        const req = request(app)
          .post('/auth/customers/login')
          .send({ email: 'customer@usj.es', pwd: 'aaaa' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail login an customer', () => {
        const req = request(app)
          .post('/auth/customers/login')
          .send();
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

  });

  describe('GET customers/:id', () => {
    describe('when all data is correct', () => {
      it('should get required customer', () => {
        const req = request(app)
          .get(`/api/customers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get customer', () => {
        const req = request(app)
          .get(`/api/customers/${id}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

  });

  describe('PUT customers/:id', () => {
    describe('when all data is correct', () => {
      it('should edit required customer', () => {
        const req = request(app)
          .put(`/api/customers/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ birthdate: new Date(), postcode: '5345B' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when there is no token', () => {
      it('should fail get customer', () => {
        const req = request(app)
          .put(`/api/customers/${id}`)
          .send({ birthdate: new Date(), postcode: '5345B' });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail get customer', () => {
        const req = request(app)
          .put(`/api/customers/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send();
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });

  describe('DELETE customer', () => {
    describe('when all data is correct', () => {
      it('should delete customer', () => {
        const req = request(app)
          .delete(`/api/customers/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail delete customer', () => {
        const req = request(app)
          .delete(`/api/customers/${id}`)
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

  describe('POST exchange prize', () => {
    describe('when token is missing', () => {
      it('should fail get prize', () => {
        const req = request(app)
          .get('/api/stores/1/customers/2/prizes/3');
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

  });

});
