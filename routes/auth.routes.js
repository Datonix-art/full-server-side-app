import { Router } from "express"
import { handleLogin, LogoutUser, renderProfile, handleSignup, renderLogin, renderSignup } from "../controllers/auth.controllers.js"
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({ // limits requests per ip adress and per window for 5 minutes
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: 'Too many logging attempts. Please try again later',
    standardHeaders: 'draft-8',
    legacyHeaders: false
})

const authRouter = Router();

// signup
authRouter.get('/signup', renderSignup)
authRouter.post('/signup', authLimiter, handleSignup)

// login
authRouter.get('/login', renderLogin)
authRouter.post('/login',authLimiter, handleLogin)

// logout
authRouter.get('/logout', LogoutUser)

// profile
authRouter.get('/profile', renderProfile)

export default authRouter;