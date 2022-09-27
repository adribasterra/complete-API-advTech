import { Router } from 'express';
import { Service } from 'typedi';
import { AuthController } from '../../app/auth/auth.controller';

@Service()
export class AuthApi {
  private apiAuthRouter: Router;

  constructor(private authController: AuthController) {
    this.initRouterAndSetApiAuthRoutes();
  }

  getApiAuthRouter(): Router {
    return this.apiAuthRouter;
  }

  private initRouterAndSetApiAuthRoutes(): void {
    this.apiAuthRouter = Router();

    this.setAuthRoutes();
  }

  private setAuthRoutes(): void {

    this.apiAuthRouter.post('/customers/login', (req, res, next) =>
      this.authController.loginCustomer(req, res, next)
    );
    this.apiAuthRouter.post('/customers/signup', (req, res, next) =>
      this.authController.signupCustomer(req, res, next)
    );
    this.apiAuthRouter.post('/admins/login', (req, res, next) =>
      this.authController.loginAdmin(req, res, next)
    );
    this.apiAuthRouter.post('/admins/signup', (req, res, next) =>
      this.authController.signupAdmin(req, res, next)
    );
    this.apiAuthRouter.post('/stores/login', (req, res, next) =>
      this.authController.loginStore(req, res, next)
    );
    this.apiAuthRouter.post('/stores/signup', (req, res, next) =>
      this.authController.signupStore(req, res, next)
    );
  }
}
