import { User } from '../auth/auth.model';

export class Customer extends User {
  id: number;
  iduser: number;
  birthdate: Date;
  postcode: string;
}
