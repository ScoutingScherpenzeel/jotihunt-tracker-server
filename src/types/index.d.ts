import { UserType } from "../models/user.model";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserType;
    }
  }
}
