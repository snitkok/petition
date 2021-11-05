const express = require("express");
const app = express();
const hb = require("express-handlebars");
// to run db functions we want to require our db module
const db = require("./db.js");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "./public"));

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use((req, res, next) => {
    console.log(`${req.method} | ${req.url}`);
    next();
});

app.get("/petition", (req, res) => {
    const cookies = req.cookies.signedUser;
    if (cookies) {
        res.redirect("/thanks");
    } else {
        res.render("petition", {
            layout: "main",
        });
    }
});

app.post("/petition", (req, res) => {
    res.cookie("signed", "true");
    const { firstName, lastName, signature } = req.body;
    db.insertSignatureName(firstName, lastName, " My Signature")
        .then(() => {
            res.cookie("signed", "true"), res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("Error in insertSignatureName", err);
            res.render("petition", {
                layout: "main",
                unvalidData: true,
            });
        });
});

app.get("/thanks", (req, res) => {
    const cookies = req.cookies.signedUser;
    if (cookies) {
        db.totalNum().then((val) => {
            //The count() function is used to count the number of collections in the element
            res.render("thanks", {
                layout: "main",
                total: val.rows[0].count,
            });
        });
    } else {
        res.redirect("/thanks");
    }
});

app.get("/signers", (req, res) => {
    const cookies = req.cookies.signedUser;
    if (cookies) {
        db.selectFirstandLast().then(() => {
            res.render("signers", {
                layout: "main",
                //something is missing here
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.listen(8080, () => console.log("Petition server, listening 🦻"));
// app.get("/actors", (req, res) => {
//     db.getActors()
//         .then(({ rows }) => {
//             console.log("results from getActors:", rows);
//         })
//         .catch((err) => console.log("err in getActors:", err));
// });

// app.post("/add-actor", (req, res) => {
//     db.addActor("Janelle Monáe", 36)
//         .then(() => {
//             console.log("yay this worked 🎉");
//         })
//         .catch((err) => console.log("err in addActor:", err));
// });

