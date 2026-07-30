import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { RegisterUserSchema } from "../schemas/auth.schema";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(RegisterUserSchema), authController.register);

export default router;
