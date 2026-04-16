import { User, Admin } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      admin?: Admin;
    }
  }
}
