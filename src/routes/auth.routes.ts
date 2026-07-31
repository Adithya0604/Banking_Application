import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { RegisterUserSchema } from "../schemas/auth.schema";
import { LoginUserSchema } from "../schemas/login.schema";
import { LoginController } from "../controllers/login.controller";

const router = Router();
const authController = new AuthController();
const loginController = new LoginController();

router.post("/register", validate(RegisterUserSchema), authController.register);
router.post("/login", validate(LoginUserSchema), loginController.Login);
export default router;
