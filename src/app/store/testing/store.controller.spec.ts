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

  describe('POST store signup', () => {
    describe('when data is correct', () => {
      it('should signup an store', () => {
        const req = request(app)
          .post('/auth/stores/signup')
          .send({ name: 'Store', email: 'store@usj.es', password: 'pwd', sector: 'Tech', phone: 68402472 });
        return req.then((res: any) => {
          id = parseInt(res.body.id);
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

  describe('POST store login', () => {
    describe('when data is correct', () => {
      it('should login an store', () => {
        const req = request(app)
          .post('/auth/stores/login')
          .send({ email: 'store@usj.es', password: 'pwd' });
        return req.then((res: any) => {
          token = res.body.token;
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail login an store', () => {
        const req = request(app)
          .post('/auth/stores/login')
          .send({ email: 'store@usj.es', pwd: 'aaaa' });
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when body is missing', () => {
      it('should fail login an store', () => {
        const req = request(app)
          .post('/auth/stores/login')
          .send();
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
        });
      });
    });
  });

  describe('GET stores', () => {
    describe('when data is correct', () => {
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
      it('should fail get list of stores not given token', () => {
        const req = request(app)
          .get('/api/stores/');
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });

  describe('GET store', () => {
    describe('when data is correct', () => {
      it('should get store', () => {
        const req = request(app)
          .get(`/api/stores/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get store', () => {
        const req = request(app)
          .get(`/api/stores/${id}`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });
  
  describe('PUT store', () => {
    describe('when data is correct', () => {
      it('should put store', () => {
        const req = request(app)
          .put(`/api/stores/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ sector: 'Tech', phone: 684930538 });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail put store', () => {
        const req = request(app)
          .put(`/api/stores/${id}`)
          .send({ sector: 'Tech', phone: 684930538 });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail put store', () => {
        const req = request(app)
          .put(`/api/stores/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });

  describe('DELETE store', () => {
    describe('when all data is correct', () => {
      it('should delete store', () => {
        const req = request(app)
          .delete(`/api/stores/${id}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail delete store', () => {
        const req = request(app)
          .delete(`/api/stores/${id}`)
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });
  });

});
