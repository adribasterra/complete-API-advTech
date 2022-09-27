import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { Application } from 'express';
import express from 'express';
import * as http from 'http';
import morgan from 'morgan';
import { Service } from 'typedi';

import { config } from '../config/environment';
import { Api } from './api/api';
import { AuthApi } from './api/auth-api';
import { JwtMiddleware } from './middlewares/jwt-auth-middleware';

@Service()
export class Server {
  app: Application;
  httpServer: http.Server;

  constructor(
    private readonly api: Api,
    private readonly authApi: AuthApi,
    private readonly authMiddleware: JwtMiddleware
  ) {
    this.app = express();
    this.setupServer();
  }

  private setupServer(): void {
    this.app.use(cors());
    this.app.use(json({ limit: '5mb' }));
    this.app.use(urlencoded({ extended: false }));
    this.app.use(morgan('dev'));

    this.httpServer = this.app.listen(config.port, this.onHttpServerListening);

    this.app.use(
      '/api',
      (req, res, next) => this.authMiddleware.validateRequest(req, res, next),
      this.api.getApiRouter()
    );
    this.app.use('/auth', this.authApi.getApiAuthRouter());
  }

  private onHttpServerListening(): void {
    console.log(
      'Server Express iniciado en modo %s (ip: %s, puerto: %s)',
      config.env,
      config.ip,
      config.port
    );
  }
}