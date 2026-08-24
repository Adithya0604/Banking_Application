import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { RegisterUserSchema } from "../schemas/auth.schema";
import { LoginUserSchema } from "../schemas/login.schema";
import { refreshTokenScheme } from "../schemas/refresh.schema";
import { LoginController } from "../controllers/login.controller";
import { RefreshTokenController } from "../controllers/refresh.controller";
import { LogOutController } from "../controllers/logout.controller";
import { LogoutSchema } from "../schemas/logout.schema";

const router = Router();
const authController = new AuthController();
const loginController = new LoginController();
const refreshtokencontroller = new RefreshTokenController();
const logOutController = new LogOutController();

router.post("/register", validate(RegisterUserSchema), authController.register);
router.post("/login", validate(LoginUserSchema), loginController.Login);
router.post(
  "/refreshtoken",
  validate(refreshTokenScheme),
  refreshtokencontroller.RotateRefreshToken,
);
router.post(
  "/LogOut",
  (req, _res, next) => {
    console.log("[Logout][Route] Matched POST /LogOut");
    next();
  },
  validate(LogoutSchema),
  logOutController.Logout,
);
export default router;
