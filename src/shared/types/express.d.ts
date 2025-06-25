import { JwtPayload } from "@/shared/utils/jwt.helper";
import "multer";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
