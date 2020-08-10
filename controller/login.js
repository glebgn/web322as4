const express = require('express');
const router = express.Router();
const db = require("../model/db");

router.get("/", (req, res) => {

    res.render("login/login", {
        title: "Logging In"
    });

});

router.post("/", (req, res) => {
    let information = {

    };
    information.email = req.body.email;
    information.password = req.body.password;

    db.validateUserLogin(req.body)
        .then((user) => {
            req.session.user = user;
            if (user.admin) {

                res.redirect("/Dashboard/DataClerk");

            } else {
                res.redirect("/Dashboard/Customer");

            }
        })
        .catch((user) => {
            console.log(user.errors);
            res.render("login/login", {

                title: "Login Page",
                errorMessages: user.errors,
                information: information

            });
        });
});
module.exports = router;