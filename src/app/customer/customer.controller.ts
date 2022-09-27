import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { AuthService } from '../auth/auth.service';
import { Prize } from '../prize/prize.model';
import { Customer } from './customer.model';
import { CustomerService } from './customer.service';

@Service()
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  /** Only admins are allowed
   * @api POST admins/:id/customers
   *
   * This method creates a new customer
   *
   * @param req expected all customer data in body
   * @param res entire customer
   * @param next error codes
   */
  create(req: any, res: any, next: any) {
    if (req.body) {
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idadmin && idadmin === req.user.id) {
        const customer = req.body;

        this.authService
          .createCustomer(customer)
          .then((newCustomer: Customer) => {
            res.send(newCustomer);
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

  /** Only admins are allowed
   * @api GET admins/:id/customers
   *
   * @param req no body nor params
   * @param res all customers
   * @param next error codes
   */
  getAll(req: any, res: any, next: any) {
    const idadmin = parseInt(req.params.idadmin);

    // Authorization
    if (idadmin && idadmin === req.user.id) {
      this.customerService
        .findAll()
        .then((customerList: Customer[]) => {
          res.send(customerList);
        })
        .catch(() => {
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }
    else {
      return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
    }
  }

  /** Only admins and customers are allowed
   * @api GET /customers/:id || /admins/:id/customers/:id
   *
   * @param req expected id in params
   * @param res entire customer
   * @param next error codes
   */
  getById(req: any, res: any, next: any) {
    if (req.params.idcustomer) {
      const idcustomer = parseInt(req.params.idcustomer);
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idcustomer === req.user.id || (idadmin && idadmin === req.user.id)) {
        this.customerService
          .findById(idcustomer)
          .then((customer: Customer | null) => {
            res.send(customer);
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
   * @api PUT /customers/:id
   *
   * @param req expected id in params and updates in body
   * @param res entire edited customer
   * @param next error codes
   */
  edit(req: any, res: any, next: any) {
    if (req.params.idcustomer && req.body) {
      const idcustomer = parseInt(req.params.idcustomer);
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idcustomer === req.user.id || (idadmin && idadmin === req.user.id)) {
        const customer = req.body;
        customer.id = idcustomer;
        customer.birthdate = new Date(customer.birthdate);
        this.customerService
          .edit(customer)
          .then((updatedCustomer: Customer) => {
            res.send(updatedCustomer);
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
   * @api POST /stores/:id/customers/:id/prizes/:id
   *
   * @param req expected id of store, customer and prize in params
   * @param res entire prize
   * @param next error codes
   */
  exchangePrize(req: any, res: any, next: any) {
    if (req.params.idstore && req.params.idcustomer && req.params.idprize) {
      const idcustomer = parseInt(req.params.idcustomer);

      // Authorization
      if (req.user.id === idcustomer) {

        const idstore = parseInt(req.params.idstore);
        const idprize = parseInt(req.params.idprize);

        // Get storeCustomer
        this.customerService
          .exchangePrize(idstore, idcustomer, idprize)
          .then((prize: Prize) => {
            res.send(prize);
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
