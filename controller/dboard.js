const express = require('express')
const router = express.Router();

function LoggingIn(req, res, next) {
    if (!req.session.user) {
        res.redirect("/Login");
    } else {
        next();
    }
}

router.get("/Logout", function(req, res) {
    req.session.reset();
    res.redirect("/Home");
});


router.get("/Customer", LoggingIn, (req, res) => {
    res.render("dashboard", {
        title: "Dashboard Page",
        user: req.session.user
    });
});

function Admins(req, res, next) {
    if (!req.session.user || !req.session.user.admin) {
        res.redirect("/Login");
    } else {
        next();
    }
}


router.get("/DataClerk", Admins, (req, res) => {
    res.render("dashboard", {
        title: "Clerk Dashboard Page",
        user: req.session.user
    });
});




module.exports = router;