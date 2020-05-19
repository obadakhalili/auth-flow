module.exports = async (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        res.redirect(401, '../dashboard');
    }
};