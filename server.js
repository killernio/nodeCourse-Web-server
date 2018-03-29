
const express = require("express");
const hbs = require("hbs");     // handlebars
const fs = require("fs");

let app = express();

hbs.registerPartials(__dirname + "/views/partials");        // nastavime odkud budeme pouzivat partials (napr pro header nebo footer)
app.set("view engine", "hbs");               // konfigurace (treba co chceme pouzit za engine)


//register middleware
app.use((req, res, next) => {        // next = kdyz je express done kdyz dame next() tak pak aplikace pokracuje
    let now = new Date().toString();

    let log = (`${now}: ${req.method} ${req.url}`);
    console.log(log);
    fs.appendFile("server.log", log + "\n", (err) => {
        if (err) {
            console.log("Unable to append to server.log")
        }
    });
    // pokud nezadame next tak nepokracuje server dal (nenacte se dalsi middleware), porad se nacita
    next();
})

app.use((req, res, next) => {        // next = kdyz je express done kdyz dame next() tak pak aplikace pokracuje
    res.render("maintance.hbs");      // druhy argument je objekt(data), ktera budou dostupna v about.hbs   
    // nic po tomhle se neprovede (z app)
})

app.use(express.static(__dirname + "/public"));   // dirname obsahuje cestu k nasemu projektu
// pak zadame localhost:3000/help.html

hbs.registerHelper("getCurrentYear", () => {        // vytvori funkci, ktera pak jde pouzit v handlebars
    return new Date().getFullYear();    // pak volame jen pres {{getCurrentYear}}
})

hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
})


// request = request coming in - headers, body information, method made with request
// response = data we send back, http statusCode ...
app.get("/", (request, response) => {    // app.get(url, method)
    //response.send("<h1>Hello!</h1>");
    response.render("home.hbs", {       // defaultne bere slozku views
        pageTitle: "Home Page",
        welcomeMessage: "Welcome to my website",
    })
});
// localhost:3000/about
app.get("/about", (request, response) => {    // app.get(url, method)
    response.render("about.hbs", {      // druhy argument je objekt(data), ktera budou dostupna v about.hbs
        pageTitle: "About Page",
    });                              // render generuje obsah pres nas zvoleny engine (v set)
});

app.get("/bad", (request, response) => {
    response.send({
        errorMessage: "Unable to handle request"
    })
});

app.listen(3000, () => {
    console.log("Server is up on port 3000");
});       // localhost:3000   // muze obsahovat druhy argument (fci, ktera se provede kdyz je server nacten)