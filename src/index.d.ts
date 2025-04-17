import { UserPayload } from './user/interfaces/user-payload.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser: UserPayload;
    }
  }
}
