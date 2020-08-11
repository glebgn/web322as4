const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const fakeDB = require("./meal");

let userSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    admin:{
        type:Boolean,
        default:false
    }

});

module.exports.confirmRegistration = (data) => {
    return new Promise((resolve, reject) => {
        data.errors = [];
        const sample = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        const re = /^[A-Za-z0-9]+$/;

        var temp = true;

        if (data.fname == "") {
            data.errors.push("First name is required");
            temp = false;
        }

        if (data.lname == "") {
            data.errors.push("Last name is required");
            temp = false;
        }

        if (data.email == "") {
            data.errors.push("Email is required");
            temp = false;
        } else if (!sample.test(data.email)) {
            data.errors.push("Correct E-mail form is something@something.ca");
            temp = false;
        }

        if (data.password == "") {
            data.errors.push("Password is required");
            temp = false;
        }


        if (data.password.length < 6 || data.password.length > 12) {
            data.errors.push("Password must be 6 to 12 characters long");
            temp = false;
        } else if (!re.test(data.password)) {
            data.errors.push("Password must contain letters and numbers only");
            temp = false;
        }

        if (!temp) {
            reject(data);
        } else {
            this.acceptEmail(data.email)
                .then((user) => {
                    data.errors.push("This email is already registered!");
                    reject(data);
                })
                .catch(() => {
                    resolve(data);
                });
        }

    });
}

module.exports.validateUserLogin = (data) => {
    return new Promise((resolve, reject) => {
        data.errors = [];
        if (data.email == "") {
            data.errors.push("Email is required");
        }
        if (data.password == "") {
            data.errors.push("Password is required");
        }
        if (data.email == "" || data.email == "") {
            reject(data);
        }
        this.acceptEmail(data.email)
            .then((user) => {
                bcrypt
                    .compare(data.password, user[0].password)
                    .then((res) => {
                        if (res) {
                            resolve(user[0]);
                        } else {
                            data.errors.push("Wrong password or email, try again");
                            reject(data);
                        }
                    })
                    .catch((err) => {
                        console.log("Cannot compare passwords " + err);
                        reject(data);
                    });
            })
            .catch((err) => {
                console.log("Cannot get by email " + err);
                data.errors.push("Wrong password or email, try again");
                reject(data);
            });
    });
};


let packageSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    category: String,
    noOfmeals: Number,
    desc: String,
    top: { type: Boolean, default: false }
});

var Users;
var Packages;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://dbUser:cs203256@senecaweb322.m5jr9.mongodb.net/web322_week8?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

        db.on("error", (err) => {
            reject(err);
        });

        db.once("open", () => {
            Packages = db.model("packages", packageSchema);
            Users = db.model("users", userSchema);
            resolve();
        });
    });
}

module.exports.bestMeals = () => {
    return new Promise((resolve, reject) => {
        Packages.find({ top: true })
            .exec()
            .then((meals) => {
                resolve(meals.map((meal) => meal.toObject()));
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports.mealPacks = () => {
    return new Promise((resolve, reject) => {
        Packages.find()
            .exec()
            .then((package) => {
                resolve(package.map((package) => package.toObject()));
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports.addUser = (data) => {
    return new Promise((resolve, reject) => {
        let newUser = new Users({
            email: data.email,
            fname: data.fname,
            lname: data.lname,
            password: data.password,
            admin: data.admin
        });

        bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(newUser.password, salt))
            .then(hash => {
                newUser.password = hash;
                newUser.save((err) => {
                    if (err) {
                        console.log(+ err);
                        reject(err);
                    } else {
                        console.log("New User registered with E-mail: " + data.email);
                        resolve(newUser);
                    }
                });
            })
            .catch(err => {
                console.log(err);
                reject("invalid password!");
            });
    });
}

module.exports.acceptEmail = function(Email) {
    return new Promise((resolve, reject) => {
        Users.find({ email: Email })
            .exec()
            .then((fetchedUsers) => {
                if (fetchedUsers.length != 0)
                    resolve(fetchedUsers.map(user => user.toObject()));
                else
                    reject("User not found!");
            }).catch((err) => {
                console.log("Error finding the user with email:" + err);
                reject(err);
            });
    });
}


//
//
// AS4 





module.exports.getPacks = (ttitle) => {
    return new Promise((resolve, reject) => {
        Packages.find({ title: ttitle })
            .exec()
            .then((package) => {
                if (package.length != 0) {
                    resolve(package.map((ppackage) => ppackage.toObject()));
                } else {
                    reject("No meals have been found");
                }

            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports.packageErrors = (data) => {
    return new Promise((resolve, reject) => {
        data.errors = [];
        const numbersCheck = /[0-9]+[.]?[0-9]*/;
        data.top = (data.top) ? true : false;

        let temp = true;

        if (data.title == "") {
            data.errors.push("Title is requried");
            temp = false;
        }

        if (data.category == "") {
            data.errors.push("Category of Meal is required");
            temp = false;
        }

        if (data.price == "") {
            data.errors.push("Price is required");
            temp = false;
        } else {

            if (!data.price.match(numbersCheck)) {
                data.errors.push("Only numbers!");
                temp = false;
            }
        }

        if (data.description == "") {
            data.errors.push("Description is required");
            temp = false;
        }

        if (!temp) {
            reject(data);
        } else {
            this.getPacks(data.title)
                .then((meal) => {
                    data.errors.push("This meal is already registered ");
                    reject(data);
                })
                .catch(() => {
                    resolve(data);
                });
        }
    });
}


module.exports.addMeal = (data) => {
    return new Promise((resolve, reject) => {
        let newPackage = new Packages({
            title: data.title,
            category: data.category,
            price: data.price,
            meals: data.meals,
            description: data.description,
            top: data.top,
            img: data.img

        });

        newPackage.save((err) => {
            if (err) {
                console.log("Error: " + err);
                reject(err);
            } else {
                console.log("Meal to add: " + data.title);
                resolve(newPackage);
            }
        });
    });
}

// EDIT THING 
module.exports.MealEditErrors = function(data) {
    return new Promise((resolve, reject) => {
        data.errors = {};
        var check = true;

        data.top = (data.top) ? true : false;

        
        if (data.title == "") {
            data.errors.title = "Title is required";
            check = false;
        }

        if (data.category == "") {
            data.errors.category = "Category is required";
            check = false;
        }

        if (data.img == "") {
            data.errors.img = "Image is required";
            check = false;
        }


        if (data.price == "") {
            data.errors.price = "Price is required";
            check = false;
        } else {
            var numbersonly = /[0-9]+[.]?[0-9]*/;
            if (!data.price.match(numbersonly)) {
                data.errors.price = "This field should only include numbers";
                check = false;
            }
        }

        if (data.description == "") {
            data.errors.description = "Description is required";
            check = false;
        }

        if (!check) {
            reject(data);
        } else {
            resolve(data);
        }
    });
}

module.exports.mealUpdate = (data) => {
    return new Promise((resolve, reject) => {
        data.top = (data.top) ? true : false;
        Packages.updateOne({ title: data.title }, {
                $set: {
                    img: data.img,
                    category: data.category,
                    price: data.price,
                    meals: data.meals,
                    description: data.description,
                    top: data.top
                }
            })
            .exec()
            .then(() => {
                console.log(`Meal ${data.title} has been updated`);
                resolve();
            }).catch((err) => {
                reject(err);
            });
    });
}