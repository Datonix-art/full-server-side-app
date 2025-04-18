/* controllers / functionalities for client */
import { validatePassword, validateUsername } from "../utils/secureForm.util.js"
import { hashPassword, comparePassword } from "../utils/hash.util.js"
import db from "../database/db.js"


// signup controllers
export const renderSignup = async (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('signup.ejs', { message: req.flash('danger') });
}

export const handleSignup = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        req.flash('danger', 'All Fields are required');
        return res.redirect('/auth/signup');
    }

    try {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, rows) => {
            if (err) {
                console.log(err.message)
                req.flash("danger", "Couldn't create user");
                return res.redirect('/auth/signup');
            }
            if (rows) {
                req.flash("danger", "Account with such email already exists");
                return res.redirect('/auth/signup');
            }

            const validUsername = await validateUsername(username, req, res);
            if (!validUsername) return;

            const validPassword = await validatePassword(password, req, res);
            if (!validPassword) return;

            const hashed_password = await hashPassword(password);

            db.run(`INSERT INTO users (username, email, password) VALUES (?,?,?)`, [username, email, hashed_password], (err) => {
                if (err) {
                    console.log(err.message)
                    req.flash("danger", "Couldn't create user");
                    return res.redirect('/auth/signup');
                }
                req.flash('success', "User has been created succesfully");
                return res.redirect('/');
            })
        })
    } catch (err) {
        console.error('Error hashing password or inserting into DB:', err);
        req.flash('danger', 'Something went wrong');
        return res.redirect('/auth/signup');
    }
}

// login controllers
export const renderLogin = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('login.ejs', { message: req.flash('danger') });
}

export const handleLogin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash('danger', 'All fields are required');
        return res.redirect('/auth/login');
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
        if (err) {
            console.error(err.message);
            req.flash('danger', 'Something went wrong');
            return res.redirect('/auth/login');
        }

        if (!row) {
            req.flash('danger', 'Account with specified email was not found');
            return res.redirect('/auth/login');
        }

        try {
            const compare = await comparePassword(password, row.password);

            if (compare) {
                req.session.role = row.role;
                req.session.LoggedInEmail = email;
                req.session.isLoggedIn = true;
                req.flash('success', 'Succesfuly logged in to account');
                return res.redirect('/');
            }
            req.flash('danger', 'Incorrect email or password');
            return res.redirect('/auth/login');
        } catch (err) {
            console.error("Couldn't Compare passwords:", err);
            return res.redirect('/auth/login');
        }
    })
}

// logout controller
export const LogoutUser = (req, res) => {
    req.session.regenerate((err) => {
        if (err) {
            req.flash('danger', 'Could not logout');
        }
        res.redirect('/');
    });
}

// profile controller
export const renderProfile = (req, res) => {
    if (!req.session.isLoggedIn) {
        req.flash('danger', 'You have to be logged in to enter this page');
        return res.redirect('/auth/signup');
    }
    const email = req.session.LoggedInEmail;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
            req.flash('danger', `Error getting data from database: ${err}`);
            return res.redirect('/');
        }
        if (!row) {
            req.flash('danger', 'User not found');
            return res.redirect('/');
        }
        return res.render('profile.ejs', {
            message: req.flash('danger'),
            user: row
        })
    })
}
