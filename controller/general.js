const express = require('express');
const router = express.Router();
const meals = require("../model/meal");
const db = require("../model/db");

router.get("/", (req, res) => {

    res.render("home", {
        title: "Home Page",
        data: meals.bestMeals()
    });

});

router.get("/mealspackages", (req, res) => {



    res.render("mealpackages", {
        title: "Meal Packages Page",
        data: meals.getAllMeals()
    })
});


module.exports = router;