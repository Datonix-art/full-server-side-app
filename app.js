// imports
import express from 'express';
import adminRouter from './routes/admin.routes.js';
import authRouter from './routes/auth.routes.js';
import session from 'express-session';
import flash from 'express-flash';
import helmet from 'helmet';
import path from 'node:path'
import 'dotenv/config';

// variables
const PORT = process.env.PORT;
const SECRETKEY = process.env.SECRET_KEY;
const app = express();

// config
app.set('view engine', 'ejs')
app.set('views', 'views')

app.set(express.static(path.join(path.resolve(), 'scripts')))

// settings
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"], // controls from which domain can be loaded scripts and prevents XSS attacks
        }
    }
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: SECRETKEY,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24, }, // 1 day
}))

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
})

// routes
app.get('/', (req, res) => {
    res.render('home.ejs', { successMessage: req.flash('success'), dangerMessage: req.flash('danger')})
})

app.use('/auth', authRouter)
app.use('/users', adminRouter)

// run server
app.listen(PORT);

export default app;