import * as jwt from 'jsonwebtoken';
import { User } from '../app/auth/auth.model';
import { Service } from 'typedi';

import { config } from '../config/environment';

const JWT_WEB_SECRET = config.secrets.session;

@Service()
export class AuthJwtService {
  createToken(user: User, id: number): string {
    const jwtOptions = { expiresIn: config.secrets.expiresIn };
    return jwt.sign(
      { id, userId: user.id, email: user.email, name: user.name },
      JWT_WEB_SECRET,
      jwtOptions
    );
  }

  decodeToken(token: string): any {
    return jwt.verify(token, JWT_WEB_SECRET);
  }

  validateUser(token: any): boolean {
    if (token && token.userId && token.email && token.name && token.id) {
      return true;
    }

    return false;
  }
}
