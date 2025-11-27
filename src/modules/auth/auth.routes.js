import { Router } from "express";
import * as AC from "./auth.controller.js";

const authRouter = Router();

authRouter.get("/", AC.getAllUsers);
authRouter.post("/signUp", AC.signUp);
authRouter.post("/provider", AC.signUp_provider);
authRouter.post("/signIn", AC.signIn);
authRouter.patch("/provider/confirm_provider", AC.confirm_provider);

export default authRouter;
