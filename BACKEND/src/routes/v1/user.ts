import { Router } from "express";
import { getUserDetails, googleLogin, login, signup } from "../../controllers/user.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/google/login', googleLogin);

router.get('/info', authMiddleware, getUserDetails)

export default router