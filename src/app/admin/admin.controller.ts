import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { AuthService } from '../auth/auth.service';
import { Admin } from './admin.model';
import { AdminService } from './admin.service';

@Service()
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) { }

  /** Only admins are allowed
   * @api POST /admins
   *
   * This method creates a new admin
   *
   * @param req expected all admin data in body
   * @param res entire admin
   * @param next error codes
   */
  create(req: any, res: any, next: any) {
    if (req.body) {
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idadmin && idadmin === req.user.id) {
        const admin = req.body;

        this.authService
          .createAdmin(admin)
          .then((newAdmin: Admin) => {
            res.send(newAdmin);
          })
          .catch(() => {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          });
      }
      else {
        return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
      }
    }
  }

  /** Only admins are allowed
   * @api GET /admins/:id
   *
   * @param req expected id in params
   * @param res entire admin
   * @param next error codes
   */
  getById(req: any, res: any, next: any) {
    if (req.params.idadmin) {
      const idadmin = parseInt(req.params.idadmin);
      // Authorization
      if (idadmin && idadmin === req.user.id) {
        this.adminService
          .findById(idadmin)
          .then((admin: Admin | null) => {
            res.send(admin);
          })
          .catch(() => {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          });
      }
      else {
        return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
      }
    }
  }

  /** Only admins are allowed
   * @api PUT /admins/:id
   *
   * @param req expected id in params and updates in body
   * @param res entire edited admin
   * @param next error codes
   */
  edit(req: any, res: any, next: any) {
    if (req.params.idadmin && req.body) {
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idadmin && idadmin === req.user.id) {
        let admin = req.body;
        admin.id = idadmin;
        this.adminService
          .edit(admin)
          .then((updatedAdmin: Admin) => {
            res.send(updatedAdmin);
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
   * @api GET /admins/:id/stats
   *
   * @param req expected id in params and updates in body
   * @param res entire edited admin
   * @param next error codes
   */
  stats(req: any, res: any, next: any) {
    if (req.params.idadmin && req.query) {
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idadmin && idadmin === req.user.id) {

        if (req.query.type == 'demographics') {
          this.adminService
            .statsDemographics()
            .then((stats: any) => {
              res.send(stats);
            })
            .catch(() => {
              res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            });
        }
        else if (req.query.type == 'purchases') {
          this.adminService
            .statsPurchases()
            .then((stats: any) => {
              res.send(stats);
            })
            .catch(() => {
              res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            });
        }
        else if (req.query.type == 'economics') {
          this.adminService
            .statsEconomics()
            .then((stats: any) => {
              res.send(stats);
            })
            .catch(() => {
              res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
            });
        }

        else {
          return next(res.sendStatus(StatusCodes.BAD_REQUEST));
        }
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
