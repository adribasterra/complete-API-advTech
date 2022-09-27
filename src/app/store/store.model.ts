import { User } from '../auth/auth.model';

export class Store extends User {
  id: number;
  iduser: number;
  sector: string;
  phone: number;
}
