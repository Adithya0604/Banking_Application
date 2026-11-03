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
import { KycDocumentsController } from "../controllers/kyc.controller";
import { autenticate } from "../middlewares/auth.middleware";
import { KycCards } from "../schemas/kyc.schema";
import { AccountCreation } from "../controllers/account.controller";

const router = Router();
const authController = new AuthController();
const loginController = new LoginController();
const refreshtokencontroller = new RefreshTokenController();
const logOutController = new LogOutController();
const kycdocumentsdontroller = new KycDocumentsController();
const accountcreation = new AccountCreation();

router.post("/register", validate(RegisterUserSchema), authController.register);
router.post("/login", validate(LoginUserSchema), loginController.Login);
router.post(
  "/refreshtoken",
  autenticate,
  validate(refreshTokenScheme),
  refreshtokencontroller.RotateRefreshToken,
);
router.post(
  "/LogOut",
  autenticate,
  validate(LogoutSchema),
  logOutController.Logout,
);
router.get("/KycDocuments", autenticate, kycdocumentsdontroller.generateUrl);
router.put(
  "/KycDocuments",
  autenticate,
  validate(KycCards),
  kycdocumentsdontroller.submitKyc,
);
router.post(
  "/verificationKyc",
  autenticate,
  kycdocumentsdontroller.verificationKyc,
);
router.post("/AccountCreation", autenticate, accountcreation.account);
// router.post("/AccountCreation", accountcreation.account); // <-- this has been created because we are load testing account number logic. The autnication can create the issue that customer ID which we are getting from requests are not present inside DB
export default router;
