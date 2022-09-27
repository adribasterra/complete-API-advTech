import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { AuthJwtService } from '../../auth/auth-jwt.service';
import { Admin } from '../admin/admin.model';
import { AdminService } from '../admin/admin.service';
import { Customer } from '../customer/customer.model';
import { CustomerService } from '../customer/customer.service';
import { Store } from '../store/store.model';
import { StoreService } from '../store/store.service';
import { User } from './auth.model';
import { AuthService } from './auth.service';

@Service()
export class AuthController {
  constructor(
    private authJwtService: AuthJwtService,
    private authService: AuthService,
    private storeService: StoreService,
    private customerService: CustomerService,
    private adminService: AdminService
  ) {}

  //#region Customer

  /**
   * @api POST /customer/login
   *
   * This method logins a customer
   *
   * @param req expected email & password
   * @param res JWT
   * @param next error codes
   */
  loginCustomer(req: any, res: any, next: any) {
    if (req.body) {
      const user = req.body;

      this.customerService
        .findByEmail(user.email)
        .then((customer: Customer) => {
          if (customer && customer.password === this.authService.encryptPassword(user.password)) {
            const token: string = this.createUserToken(customer, customer.id);
            res.send({ token: token });
          } else {
            return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
          }
        })
        .catch(() => {
          res.sendStatus(StatusCodes.UNAUTHORIZED);
        });
    } else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }

  /**
   * @api POST /customer/signup
   *
   * This method signsup a customer
   *
   * @param req expected all data of customer model
   * @param res all data except password and iduser
   * @param next error codes
   */
  signupCustomer(req: any, res: any, next: any) {
    if (req.body) {
      const customer = req.body;
      customer.birthdate = new Date(customer.birthdate);
      this.authService
        .createCustomer(customer)
        .then((newCustomer: Customer) => {
          res.send({
            id: newCustomer.id,
            email: newCustomer.email,
            name: newCustomer.name,
            birthdate: newCustomer.birthdate,
            postcode: newCustomer.postcode
          });
        })
        .catch(() => {
          // Info in body is wrong or missing
          res.sendStatus(StatusCodes.BAD_REQUEST);
        });
    } else {
      // Body is missing
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }
  //#endregion

  //#region Admin

  /**
   * @api POST /admin/login
   *
   * This method logins a admin
   *
   * @param req expected email & password
   * @param res JWT
   * @param next error codes
   */
  loginAdmin(req: any, res: any, next: any) {
    if (req.body) {
      const user = req.body;

      this.adminService
        .findByEmail(user.email)
        .then((admin: Admin) => {
          if (admin && admin.password === this.authService.encryptPassword(user.password)) {
            const token: string = this.createUserToken(admin, admin.id);
            res.send({ token: token });
          } else {
            return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
          }
        })
        .catch(() => {
          res.sendStatus(StatusCodes.UNAUTHORIZED);
        });
    } else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }

  /**
   * @api POST /admin/signup
   *
   * This method signsup an admin
   *
   * @param req expected all data of admin model
   * @param res all data except password and iduser
   * @param next error codes
   */
  signupAdmin(req: any, res: any, next: any) {
    if (req.body) {
      const admin = req.body;

      this.authService
        .createAdmin(admin)
        .then((newAdmin: Admin) => {
          res.send({
            id: newAdmin.id,
            email: newAdmin.email,
            name: newAdmin.name,
            role: newAdmin.role
          });
        })
        .catch(() => {
          res.sendStatus(StatusCodes.BAD_REQUEST);
        });
    } else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }
  //#endregion

  //#region Store

  /**
   * @api POST /store/login
   *
   * This method logins a store
   *
   * @param req expected email & password
   * @param res JWT
   * @param next error codes
   */
  loginStore(req: any, res: any, next: any) {
    if (req.body) {
      const user = req.body;
      user.password = this.authService.encryptPassword(user.password);
      this.storeService
        .findByEmail(user.email)
        .then((store: Store) => {
          if (store && store.password === user.password) {
            const token: string = this.createUserToken(store, store.id);
            res.send({ token: token });
          } else {
            return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
          }
        })
        .catch(() => {
          res.sendStatus(StatusCodes.UNAUTHORIZED);
        });
    } else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }

  /**
   * @api POST /customer/signup
   *
   * This method signsup a customer
   *
   * @param req expected all data of store model
   * @param res all data except password and iduser
   * @param next error codes
   */
  signupStore(req: any, res: any, next: any) {
    if (req.body) {
      const store = req.body;
      store.phone = parseInt(store.phone);
      this.authService
        .createStore(store)
        .then((newStore: Store) => {
          res.send({
            id: newStore.id,
            email: newStore.email,
            name: newStore.name,
            sector: newStore.sector,
            phone: newStore.phone
          });
        })
        .catch(() => {
          res.sendStatus(StatusCodes.BAD_REQUEST);
        });
    } else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }


  /** Only admins are allowed
   * @api DELETE /admins/:id
   *
   * @param req expected id in params
   * @param res entire deleted admin
   * @param next error codes
   */
  deleteAdmin(req: any, res: any, next: any) {
    if (req.params.idadmin) {
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idadmin && idadmin === req.user.id) {
        // Delete user and admin
        this.authService
          .deleteAdmin(idadmin)
          .then((deletedAdmin: Admin) => {
            res.send(deletedAdmin);
          })
          .catch(() => {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          });
      }
      else {
        return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
      }
    }
    else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }
  
  /** Only admins and customers are allowed
   * @api DELETE /customers/:id || /admins/:id/customers/:id
   *
   * @param req expected id in params
   * @param res entire deleted customer
   * @param next error codes
   */
  deleteCustomer(req: any, res: any, next: any) {
    if (req.params.idcustomer) {
      const idcustomer = parseInt(req.params.idcustomer);
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idcustomer === req.user.id || (idadmin && idadmin === req.user.id)) {
        // Delete user and customer
        this.authService
          .deleteCustomer(idcustomer)
          .then((deletedCustomer: Customer) => {
            res.send(deletedCustomer);
          })
          .catch(() => {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          });
      }
      else {
        return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
      }
    }
    else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }

  /** Only stores an admins are allowed
   * @api DELETE /stores/:id || /admins/:id/stores/:id
   *
   * @param req expected id in params
   * @param res entire deleted store
   * @param next error codes
   */
  deleteStore(req: any, res: any, next: any) {
    if (req.params.idstore) {
      const idstore = parseInt(req.params.idstore);
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (req.user.id === idstore || (idadmin && idadmin === req.user.id)) {
        // Delete user and store
        this.authService
          .deleteStore(idstore)
          .then((deletedStore: Store) => {
            res.send(deletedStore);
          })
          .catch(() => {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          });
      }
      else {
        return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
      }
    }
    else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }

  //#endregion

  //#region Private methods

  private createUserToken(user: User, id: number): string {
    return this.authJwtService.createToken(user, id);
  }
  
  
  //#endregion
}
