import { Router } from 'express';
import { Service } from 'typedi';
import { AdminController } from '../../app/admin/admin.controller';
import { CustomerController } from '../../app/customer/customer.controller';
import { StoreController } from '../../app/store/store.controller';
import { PrizeController } from '../../app/prize/prize.controller';
import { AuthController } from '../../app/auth/auth.controller';

@Service()
export class Api {
  private apiRouter: Router;

  constructor(
    private customerController: CustomerController,
    private storeController: StoreController,
    private adminController: AdminController,
    private prizeController: PrizeController,
    private authController: AuthController
  ) {
    this.initRouterAndSetApiRoutes();
  }

  getApiRouter(): Router {
    return this.apiRouter;
  }

  private initRouterAndSetApiRoutes(): void {
    this.apiRouter = Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    
    //#region Customer private routes

    this.apiRouter.get('/customers', (req, res, next) =>
      this.customerController.getAll(req, res, next)
    );
    this.apiRouter.get('/customers/:idcustomer', (req, res, next) =>
      this.customerController.getById(req, res, next)
    );
    this.apiRouter.put('/customers/:idcustomer', (req, res, next) =>
      this.customerController.edit(req, res, next)
    );
    this.apiRouter.delete('/customers/:idcustomer', (req, res, next) =>
      this.authController.deleteCustomer(req, res, next)
    );

    //#endregion

    //#region Store private routes

    this.apiRouter.get('/stores', (req, res, next) =>
      this.storeController.getAll(req, res, next)
    );
    this.apiRouter.get('/stores/:idstore', (req, res, next) =>
      this.storeController.getById(req, res, next)
    );
    this.apiRouter.put('/stores/:idstore', (req, res, next) =>
      this.storeController.edit(req, res, next)
    );
    this.apiRouter.delete('/stores/:idstore', (req, res, next) =>
      this.authController.deleteStore(req, res, next)
    );
    
      //#region Store prize private routes

      this.apiRouter.get('/stores/:idstore/prizes', (req, res, next) =>
        this.prizeController.getAll(req, res, next)
      );
      this.apiRouter.get('/stores/:idstore/prizes/:idprize', (req, res, next) =>
        this.prizeController.getById(req, res, next)
      );
      this.apiRouter.post('/stores/:idstore/prizes', (req, res, next) =>
        this.prizeController.create(req, res, next)
      );
      this.apiRouter.put('/stores/:idstore/prizes/:idprize', (req, res, next) =>
        this.prizeController.edit(req, res, next)
      );
      this.apiRouter.delete('/stores/:idstore/prizes/:idprize', (req, res, next) =>
        this.prizeController.delete(req, res, next)
      );

      //#endregion


      //#region Store customer private routes

      this.apiRouter.put('/stores/:idstore/customers/:idcustomer/points', (req, res, next) =>
        this.storeController.points(req, res, next)
      );

      this.apiRouter.post('/stores/:idstore/customers/:idcustomer/prizes/:idprize', (req, res, next) =>
        this.customerController.exchangePrize(req, res, next)
      );

      //#endregion

    //#endregion

    //#region Admin private routes

    this.apiRouter.get('/admins/:idadmin', (req, res, next) =>
      this.adminController.getById(req, res, next)
    );
    this.apiRouter.put('/admins/:idadmin', (req, res, next) =>
      this.adminController.edit(req, res, next)
    );
    this.apiRouter.delete('/admins/:idadmin', (req, res, next) =>
      this.authController.deleteAdmin(req, res, next)
    );
    this.apiRouter.get('/admins/:idadmin/stats', (req, res, next) =>
      this.adminController.stats(req, res, next)
    );

      //#region Admin store private routes

      this.apiRouter.get('/admins/:idadmin/stores/:idstore', (req, res, next) =>
        this.storeController.getById(req, res, next)
      );
      this.apiRouter.put('/admins/:idadmin/stores/:idstore', (req, res, next) =>
        this.storeController.edit(req, res, next)
      );
      this.apiRouter.delete('/admins/:idadmin/stores/:idstore', (req, res, next) =>
        this.authController.deleteStore(req, res, next)
      );

        //#region Store prize private routes

        this.apiRouter.get('/admins/:idadmin/stores/:idstore/prizes', (req, res, next) =>
          this.prizeController.getAll(req, res, next)
        );
        this.apiRouter.get('/admins/:idadmin/stores/:idstore/prizes/:idprize', (req, res, next) =>
          this.prizeController.getById(req, res, next)
        );
        this.apiRouter.post('/admins/:idadmin/stores/:idstore/prizes/', (req, res, next) =>
          this.prizeController.create(req, res, next)
        );
        this.apiRouter.put('/admins/:idadmin/stores/:idstore/prizes/:idprize', (req, res, next) =>
          this.prizeController.edit(req, res, next)
        );
        this.apiRouter.delete('/admins/:idadmin/stores/:idstore/prizes/:idprize', (req, res, next) =>
          this.prizeController.delete(req, res, next)
        );

        //#endregion
        
      //#endregion

      //#region Admin customer private routes

      this.apiRouter.get('/admins/:idadmin/customers', (req, res, next) =>
        this.customerController.getAll(req, res, next)
      );
      this.apiRouter.get('/admins/:idadmin/customers/:idcustomer', (req, res, next) =>
        this.customerController.getById(req, res, next)
      );
      this.apiRouter.put('/admins/:idadmin/customers/:idcustomer', (req, res, next) =>
        this.customerController.edit(req, res, next)
      );
      this.apiRouter.delete('/admins/:idadmin/customers/:idcustomer', (req, res, next) =>
        this.authController.deleteCustomer(req, res, next)
      );

      //#endregion

    //#endregion

  }
}
