var mealPackages = {
    fakedb: [],
    MealsData() {
        this.fakedb.push({
            title: "American Food",
            price: "$120.00",
            description: "North American food",
            img: "Amer.jpg",
            top:true,

        });

        this.fakedb.push({
            title: "Japanese Food",
            price: "$110.00",  
            description: "Japanise food: Sushi and so on..",
            img: "Japan.jpg",
            top:true,

        });

        this.fakedb.push({
            title: "Italian Food",
            price: "$105.00",
            description: "Italian cuisine: pizza, macaroni, etc..",
            img: "Ital.jpg",
            top:true,

        });

        this.fakedb.push({
            title: "Mexican Food",
            price: "$99.00",
            description: "Mexican cuisine: tacos and so on..",
            img: "Mex.jpg",
            top: true,
        });

        this.fakedb.push({
            title: "Spaghetti Meal",
            price: "$90.00",
            description: "Meal consists on Spaghetti 10-pack",
            img: "spag.jpg",
        });

        this.fakedb.push({
            title: "Sushi Meal",
            price: "$134.00",
            description: "Meal of 10 sushi pack for 20 sushi each",
            img: "sushi.jpg",
        });

        this.fakedb.push({
            title: "Hamburger Meal",
            price: "$117.00",
            description: "10 Big hamburgers Meal",
            img: "hamburger.jpg",
        });

        this.fakedb.push({
            title: "Ramen Meal",
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