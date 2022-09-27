import { StatusCodes } from 'http-status-codes';
import { ExtractJwt } from 'passport-jwt';
import { Service } from 'typedi';

import { AuthJwtService } from '../../auth/auth-jwt.service';
import { AuthMiddleware } from './auth-middleware';

@Service()
export class JwtMiddleware implements AuthMiddleware {
  constructor(private readonly jwtService: AuthJwtService) {}

  validateRequest(req: any, res: any, next: any): Promise<void> {
    try {
      const token = this.getTokenFromRequest(req);
      
      if (token != null) {
        const decodeToken = this.jwtService.decodeToken(token);
        if (this.jwtService.validateUser(decodeToken)) {
          req.user = decodeToken;
          return next();
        }
      }

      return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
    } catch (err) {
      return next(res.sendStatus(StatusCodes.UNAUTHORIZED));
    }
  }

  private getTokenFromRequest(req: any): string | null {
    return (
      ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
      ExtractJwt.fromUrlQueryParameter('access_token')(req)
    );
  }
}
