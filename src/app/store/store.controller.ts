import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { AuthService } from '../auth/auth.service';
import { StoreCustomer } from './../storeCustomer/storeCustomer.model';
import { Store } from './store.model';
import { StoreService } from './store.service';

@Service()
export class StoreController {

  constructor(
    private storeService: StoreService,
    private authService: AuthService
  ) {}

  /** Only admins are allowed
   * @api POST admins/:id/stores/
   *
   * This method creates a new store
   *
   * @param req expected all store data in body
   * @param res entire store
   * @param next error codes
   */
  create(req: any, res: any, next: any) {
    if (req.body) {
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idadmin && idadmin === req.user.id) {
        const store = req.body;

        this.authService
          .createStore(store)
          .then((newStore: Store) => {
            res.send(newStore);
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

  /** Every user is allowed, no further verification is needed
   * @api GET /stores
   *
   * @param _req no body nor params
   * @param res all stores
   * @param _next error codes
   */
  getAll(_req: any, res: any, _next: any) {
    this.storeService
      .findAll()
      .then((storeList: Store[]) => {
        res.send(storeList);
      })
      .catch(() => {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      });
  }

  /** Every user is allowed, no further verification is needed
   * @api GET /stores/:id
   * 
   * @param req expected id in params
   * @param res entire store
   * @param next error codes
   */
  getById(req: any, res: any, next: any) {
    if (req.params.idstore) {
      this.storeService
        .findById(parseInt(req.params.idstore))
        .then((store: Store | null) => {
          res.send(store);
        })
        .catch(() => {
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    else {
      return next(res.sendStatus(StatusCodes.BAD_REQUEST));
    }
  }

  /** Only stores an admins are allowed
   * @api PUT /stores/:id || PUT /admins/:id/stores/:id
   *
   * @param req expected id in params and updates in body
   * @param res entire edited store
   * @param next error codes
   */
  edit(req: any, res: any, next: any) {
    if (req.params.idstore && req.body) {
      const idstore = parseInt(req.params.idstore);
      const idadmin = parseInt(req.params.idadmin);
      // Authorization
      if (req.user.id === idstore || (idadmin && idadmin === req.user.id)) {
        let store = req.body;
        store.id = idstore;
        store.phone = parseInt(store.phone);
        this.storeService
          .edit(store)
          .then((updatedStore: Store) => {
            res.send(updatedStore);
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

  /** Only customers are allowed
   * @api PUT /stores/:id/customers/:id/points
   *
   * @param req expected id of store and customer and body
   * @param res entire storeCustomer
   * @param next error codes
   */
  points(req: any, res: any, next: any) {
    if (req.params.idstore && req.params.idcustomer && req.body.income) {
      const idcustomer = parseInt(req.params.idcustomer);
      req.body.income = parseInt(req.body.income);
      // Authorization
      if (req.user.id === idcustomer) {

        const idstore = parseInt(req.params.idstore);

        this.storeService
          .points(idstore, idcustomer, req.body)
          .then((storeCustomer: StoreCustomer) => {
            res.send(storeCustomer);
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
}
