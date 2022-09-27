import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import { Prize } from './prize.model';
import { PrizeService } from './prize.service';

@Service()
export class PrizeController {
  constructor(
    private prizeService: PrizeService
  ) {}

  /** Only admins and stores are allowed
   * @api POST stores/:id/prizes || admins/:id/stores/:id/prizes
   *
   * This method creates a new prize
   *
   * @param req expected all prize data in body and store id in params
   * @param res entire prize
   * @param next error codes
   */
  create(req: any, res: any, next: any) {
    if (req.body && req.params.idstore) {
      const idstore = parseInt(req.params.idstore);
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idstore === req.user.id || (idadmin && idadmin === req.user.id)) {
        let prize = req.body;
        prize.points = parseInt(prize.points);
        prize.idstore = idstore;

        this.prizeService
          .create(prize)
          .then((newPrize: Prize) => {
            res.send(newPrize);
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

  /** All users are allowed
   * @api GET store/:id/prizes || admins/:id/stores/:id/prizes || customers/:id/stores/:id/prizes 
   *
   * @param req expect store id in params
   * @param res all prizes from store
   * @param next error codes
   */
  getAll(req: any, res: any, next: any) {
    if (req.params.idstore) {
      const idstore = parseInt(req.params.idstore);
      const idadmin = parseInt(req.params.idadmin);
      const idcustomer = parseInt(req.params.idcustomer);
      // Authorization
      if (idstore === req.user.id || (idadmin && idadmin === req.user.id) || (idcustomer && idcustomer === req.user.id)) {

        this.prizeService
          .findAll(idstore)
          .then((prizeList: Prize[]) => {
            res.send(prizeList);
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

  /** All users are allowed
   * @api GET store/:id/prizes/:id
   *
   * @param req expected id of store and prize in params
   * @param res entire prize
   * @param next error codes
   */
  getById(req: any, res: any, next: any) {
    if (req.params.idstore && req.params.idprize) {
      const idstore = parseInt(req.params.idstore);
      const idadmin = parseInt(req.params.idadmin);
      const idcustomer = parseInt(req.params.idcustomer);
      const idprize = parseInt(req.params.idprize);

      // Authorization
      if (idstore === req.user.id || (idadmin && idadmin === req.user.id) || (idcustomer && idcustomer === req.user.id)) {
        this.prizeService
          .findById(idprize, idstore)
          .then((prize: Prize | null) => {
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

  /** Only admins and stores are allowed
   * @api PUT store/:id/prizes/:id
   *
   * @param req expected id in params and updates in body
   * @param res entire edited prize
   * @param next error codes
   */
  edit(req: any, res: any, next: any) {
    if (req.params.idstore && req.params.idprize && req.body) {
      const idstore = parseInt(req.params.idstore);
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idstore === req.user.id || (idadmin && idadmin === req.user.id)) {
        const prize = req.body;
        prize.id = parseInt(req.params.idprize);
        prize.idstore = idstore;
        prize.points = parseInt(prize.points);
        this.prizeService
          .edit(prize)
          .then((updatedPrize: Prize) => {
            res.send(updatedPrize);
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

  /** Only admins and stores are allowed
   * @api DELETE store/:id/prizes/:id
   *
   * @param req expected id in params
   * @param res entire deleted prize
   * @param next error codes
   */
  delete(req: any, res: any, next: any) {
    if (req.params.idstore && req.params.idprize) {
      const idstore = parseInt(req.params.idstore);
      const idprize = parseInt(req.params.idprize);
      const idadmin = parseInt(req.params.idadmin);

      // Authorization
      if (idstore === req.user.id || (idadmin && idadmin === req.user.id)) {
        this.prizeService
          .delete(idprize)
          .then((deletedPrize: Prize) => {
            res.send(deletedPrize);
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
