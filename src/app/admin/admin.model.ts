import { User } from '../auth/auth.model';

export class Admin extends User {
  id: number;
  iduser: number;
  role: string;
}
