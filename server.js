const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db.js");
const cookieSession = require("cookie-session");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.use(
    cookieSession({
        secret: `I'm always happy.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});

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
    if (req.session.signatureId) {
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
        .then((val) => {
            req.session.signatureId = val.rows[0].id;
            console.log("val---------------------------", val);
            res.redirect("/thanks");
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
    if (req.session.signatureId) {
        Promise.all([
            db.totalNum(),
            db.selectSignature(req.session.signatureId),
        ])
            .then((val) => {
                res.render("thanks", {
                    layout: "main",
                    total: val[0].rows[0].count,
                    userSig: val[1].rows[0].signature,
                });
            })
            .catch((err) => {
                console.log("Error in  db.totalNum, db.selectSignature", err);
            });
    } else {
        res.redirect("/petition");
    }
});

app.get("/signers", (req, res) => {
    if (req.session.signatureId) {
        db.selectFirstandLast()
            .then((val) => {
                const { rows } = val;
                console.log("rows", rows);
                res.render("signers", {
                    layout: "main",
                    rows,
                });
            })
            .catch((err) => {
                console.log("Error in  selectFirstandLast", err);
            });
    } else {
        res.redirect("/petition");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/petition");
});

app.listen(8080, () => console.log("Petition server, listening 🦻"));
