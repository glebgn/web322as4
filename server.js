const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const db = require("./model/db");
const clientSessions = require("client-sessions");

require('dotenv').config({ path: "./config/keys.env" });

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(clientSessions({
    cookieName: "session", 
    secret: "web322", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
}));

const generalController = require("./controller/general");
const formsController = require("./controller/registration");
const loginController = require("./controller/login");
const dashboardController = require("./controller/dboard");

app.use("/", generalController);
app.use("/Registration", formsController);
app.use("/Login", loginController);
app.use("/Dashboard", dashboardController);

db.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Web-Server is up and running!");
        })
    })
    .catch((err) => {
        console.log(err);
    });