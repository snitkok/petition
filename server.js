const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db.js");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

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
    if (req.cookies.signed) {
        res.redirect("/thanks");
    } else {
        res.render("petition", {
            layout: "main",
        });
    }
});

app.post("/petition", (req, res) => {
    const { firstname, lastname, signature } = req.body;
    console.log("req.body", req.body);
    db.insertSignatureName(firstname, lastname, signature)
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
    console.log("req.cookies", req.cookies);
    if (req.cookies.signed) {
        db.totalNum().then((val) => {
            res.render("thanks", {
                layout: "main",
                total: val.rows[0].count,
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.get("/signers", (req, res) => {
    if (req.cookies.signed) {
        db.selectFirstandLast().then((val) => {
            const { rows } = val;

            console.log("rows", rows);
            res.render("signers", {
                layout: "main",
                rows,
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.listen(8080, () => console.log("Petition server, listening 🦻"));
