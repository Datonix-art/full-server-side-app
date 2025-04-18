// username validaiton
export const validateUsername = async (username, req, res) => {
    const user = username.trim();
    const allowedCharacters = /^[a-zA-Z0-9_]+$/;

    if (user.length < 3 || user.length > 20) {
        req.flash('danger', 'Username can be between 3 and 20 letters');
        res.redirect('/auth/signup');
        return null;
    }

    if (!allowedCharacters.test(user)) {
        req.flash('danger', 'Username can contain only letters, numbers, or underscores.');
        res.redirect('/auth/signup');
        return null;
    }

    return user;
};

// password validation
export const validatePassword = async (password, req, res) => {
    if (password.length < 6 || password.length > 30) {
        req.flash('danger', 'Password must be between 6 and 30 characters');
        res.redirect('/auth/signup');
        return null;
    }

    return password;
};
