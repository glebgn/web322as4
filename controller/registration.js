const express = require('express');
const router = express.Router();
const db = require("../model/db");

router.get("/", (req, res) => {


    res.render("login/registration", {
        title: "Signing Up"
    });

});


router.post("/", (req, res) => {

    let infoData = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password
    };

    db.confirmRegistration(req.body).then((data) => {
        db.addUser(data).then((user) => {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: `${req.body.email}`,
                from: 'scrabblebub@gmail.com',
                subject: 'Welcome!',
                text: 'Welcome to Glib`s Gnennyi meals!',
                html: `Thank you for registering!`
            };
            sgMail.send(msg);

            req.session.user = user;
            if (user.admin) {
                res.redirect("/Dashboard/DataClerk")
            } else {
                res.redirect("/Dashboard/Customer");
            }

        }).catch((err) => {
            console.log("Error in registration: " + err);
        });
    }).catch((data) => {
        res.render("login/registration", {
            title: "Registration Page",
            errorMessages: data.errors,
            infoData: infoData
        });
    });
});

module.exports = router;