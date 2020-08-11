const express = require('express')
const router = express.Router();

const multer = require("multer");
const db = require("../model/db");
const path = require("path");


function LoggingIn(req, res, next) {
    if (!req.session.user) {
        res.redirect("/Login");
    } else {
        next();
    }
}

function Admins(req, res, next) {
    if (!req.session.user || !req.session.user.admin) {
        res.redirect("/Login");
    } else {
        next();
    }
}

router.get("/Logout", function(req, res) {
    req.session.reset();
    res.redirect("/Login");
});


router.get("/Customer", LoggingIn, (req, res) => {
    res.render("dashboard", {
        title: "Dashboard Page",
        user: req.session.user
    });
});




router.get("/DataClerk", Admins, (req, res) => {
    res.render("dashboardAdmin", {
        title: "Clerk Dashboard Page",
        user: req.session.user
    });
});




module.exports = router;
//
//
// Assignment 4 


const storage = multer.diskStorage({
    destination: "./public/img/",
    filename: function(req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imgOnly = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    } else {
        return cb(new Error('Not an image! Please upload an image.', 400), false);
    }
};

const upload = multer({ storage: storage, fileFilter: imgOnly });

//


router.get("/viewMeals", function(req, res) {
    db.bestMeals(false).then((data) => {
        res.render("viewMeals", {
            title: "View all the meals page",
            data: data,
            added: true
        });
    }).catch((err) => {
        if (err == "No meals yet!") {
            res.render("viewMeals", {
                title: "View all the meals page",
                data: [],
                added: false
            });
        } else {
            console.log(err);
        }
    });
});

router.post("/editMeals", function(req, res) {
    db.getPacks(req.body.title).then((meals) => {
        let information = {
            titleholder: meals[0].title,
            category: meals[0].category,
            price: meals[0].price,
            meals: meals[0].meals,
            description: meals[0].description
        };
        res.render("editPage", {
            title: "Meal Edit Page",
            information: information,
            succUpdated: false,
            user: req.session.user
        });
    }).catch((err) => {
        if (err == "No meals found")
            res.render("editMeals", {
                title: "Meal Edit Page",
                titleholder: req.body.title,
                titleError: "Package not found",
                user: req.session.user
            });
        else
            console.log(err);
    });
});

router.get("/editMeals", function(req, res) {
    res.render("editMeals", {
        title: "Meal Edit Page",
        user: req.session.user
    });
});



router.post("/editPage", upload.single("picture"), (req, res) => {
    let information = {
        titleholder: req.body.title,
        category: req.body.category,
        price: req.body.price,
        meals: req.body.meals,
        description: req.body.description
    };
    try {
        req.body.img = req.file.filename;
    } catch (err) {
        res.render("dashboard/editPage", {
            title: "Edit Page",
            imgError: "This field is required",
            information: information,
            succUpdated: false,
            user: req.session.user
        });
        return;
    }
    db.MealEditErrors(req.body).then((data) => {
        db.mealUpdate(data).then(() => {
            res.render("dashboard/editPage", {
                title: "Edit Page",
                information: information,
                succUpdated: true,
                user: req.session.user
            });
        }).catch((err) => {
            console.log("Error while editing a meal: " + err);
            res.render("dashboard/editPage", {
                title: "Edit Page",
                information: information,
                succUpdated: false,
                user: req.session.user
            });
        });
    }).catch((data) => {
        res.render("dashboard/editing", {
            title: "Edit Page",
            imgError: data.errors.img,
            catError: data.errors.category,
            priceError: data.errors.price,
            nmealsError: data.errors.meals,
            descError: data.errors.description,
            information: information,
            succUpdated: false,
            user: req.session.user
        });
    });
});


// 
router.get("/addMeals", function(req, res) {
    res.render("addMeals", {
        title: "Add New Package",
        succAdded: false,
        user: req.session.user
    });
});




router.post("/addMeals", upload.single("picture"), (req, res) => {

    var info = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        meals: req.body.meals,
        description: req.body.description,
        top: req.body.top
    };
    try {
        req.body.img = req.file.filename;
    } catch (err) {
        res.render("addMeals", {
            title: "Add New Package",
            ifAdded: false,
            error: true,
            info: info,
            user: req.session.user
        });
        return;
    }

    db.validateNewPackage(req.body).then((data) => {
        db.addMeal(data).then((meal) => {
            res.render("addMeals", {
                title: "Add New Package",
                ifAdded: true,
                error: false,
                user: req.session.user
            });
        }).catch((err) => {
            console.log("Meal is not added because " + err);
        });
    }).catch((data) => {
        res.render("addMeals", {
            title: "Add New Package",
            error: true,
            info: info,
            user: req.session.user
        });
    });
});


//
//

