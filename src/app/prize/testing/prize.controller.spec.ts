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

  let idstore: number;
  let idprize: number;
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
          sql: 'DELETE FROM public.store WHERE id is not null',
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
    describe('when all data is correct', () => {
      it('should signup an store', () => {
        const req = request(app)
          .post('/auth/stores/signup')
          .send({ name: 'Store', email: 'store@usj.es', password: 'pwd', sector: 'Tech', phone: 68402472 });
        return req.then((res: any) => {
          idstore = res.body.id;
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });

  describe('POST store login', () => {
    describe('when all data is correct', () => {
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
  });

  describe('POST prize', () => {
    describe('when token is missing', () => {
      it('should fail create a prize', () => {
        const req = request(app)
          .post(`/auth/stores/${idstore}/prizes`)
          .send({ idstore, name: 'Pillow' });
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });

  describe('GET prizes', () => {
    describe('when all data is correct', () => {
      it('should get list of prizes', () => {
        const req = request(app)
          .get(`/api/stores/${idstore}/prizes/`)
          .set('Authorization', `Bearer ${token}`)
          .set('Authorization', `Bearer ${token}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });

    describe('when token is missing', () => {
      it('should fail get list of prizes', () => {
        const req = request(app)
          .get(`/api/stores/${idstore}/prizes/`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

  });

  describe('GET prize', () => {
    describe('when token is missing', () => {
      it('should fail get prize', () => {
        const req = request(app)
          .get(`/api/stores/${idstore}/prizes/${idprize}`);
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

  });

  describe('PUT prize', () => {
    describe('when token is missing', () => {
      it('should fail put prize', () => {
        const req = request(app)
          .put(`/api/stores/${idstore}/prizes/${idprize}`)
          .send({ name: 'Pillow', category: 'Furniture', points: 200 });
        return req.then((res: any) => {
          expect(res.statusCode).toEqual(HttpStatus.StatusCodes.UNAUTHORIZED);
        });
      });
    });

    describe('when data is missing', () => {
      it('should fail put prize', () => {
        const req = request(app)
          .put(`/api/stores/${idstore}/prizes/${idprize}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Pillow' });
        return req.then((res: any) => {
          expect(res.statusCode).not.toEqual(HttpStatus.StatusCodes.OK);
        });
      });
    });
  });
});
