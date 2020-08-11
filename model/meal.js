var mealPackages = {
    fakedb: [],
    MealsData() {
        this.fakedb.push({
            title: "American Food",
            category: "American",
            price: "$120.00",
            description: "North American food",
            img: "Amer.jpg",
            top:true,

        });

        this.fakedb.push({
            title: "Japanese Food",
            category: "Japanese",
            price: "$110.00",  
            description: "Japanise food: Sushi and so on..",
            img: "Japan.jpg",
            top:true,

        });

        this.fakedb.push({
            title: "Italian Food",
            category: "Italian",
            price: "$105.00",
            description: "Italian cuisine: pizza, macaroni, etc..",
            img: "Ital.jpg",
            top:true,

        });

        this.fakedb.push({
            title: "Mexican Food",
            category: "Mexican",
            price: "$99.00",
            description: "Mexican cuisine: tacos and so on..",
            img: "Mex.jpg",
            top: true,
        });

        this.fakedb.push({
            title: "Spaghetti Meal",
            category: "Italian",
            price: "$90.00",
            description: "Meal consists on Spaghetti 10-pack",
            img: "spag.jpg",
        });

        this.fakedb.push({
            title: "Sushi Meal",
            category: "Japanese",
            price: "$134.00",
            description: "Meal of 10 sushi pack for 20 sushi each",
            img: "sushi.jpg",
        });

        this.fakedb.push({
            title: "Hamburger Meal",
            category: "American",
            price: "$117.00",
            description: "10 Big hamburgers Meal",
            img: "hamburger.jpg",
        });

        this.fakedb.push({
            title: "Ramen Meal",
            category: "Chinese",
            price: "$129.00",
            description: "10-pieces Ramen Soup with Meat/Fish",
            img: "raman.jpg",
        });
    },

    getAllMeals() {
        return this.fakedb;
    },


    bestMeals() {

        topDB = [];

        for (var i = 0; i < this.fakedb.length; i++)
            if (this.fakedb[i].top == true)
                topDB.push(this.fakedb[i]);
        return topDB;
    }


}

mealPackages.MealsData();
module.exports = mealPackages;