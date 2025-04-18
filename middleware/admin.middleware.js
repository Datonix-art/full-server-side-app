// admin check middleware
export default function isAdmin(req, res, next) {
    if(!req.session.isLoggedIn) {
        req.flash('danger', 'you have to be logged in to enter this page')
        return res.redirect('/auth/login')
    }    
    if(req.session.isLoggedIn && req.session.role !== 'admin') {
        req.flash('danger', 'You do not have permissions to access this page');
        return res.redirect('/')
    }
    next();
}

