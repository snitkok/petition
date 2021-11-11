function requireNotLoggedIn(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/petition");
    }
    next();
}

function requireLoggedIn(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/register");
    }
    next();
}

function requiredSigned(req, res, next) {
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }
    next();
}

function requiredNotSigned(req, res, next) {
    if (req.session.signatureId) {
        return res.redirect("/thanks");
    }
    next();
}

module.exports = {
    requireNotLoggedIn,
    requireLoggedIn,
    requiredSigned,
    requiredNotSigned,
};
