const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./db.js");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc.js");
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
    const { signature } = req.body; //get the user id out of the cookie
    console.log("req.body POST/petition-----------------", req.body);
    const newuserId = req.session.userId;
    console.log("userId********", newuserId);
    db.insertSignatureName(newuserId, signature)
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
        console.log("req.session.signatureId", req.session.signatureId);
        Promise.all([
            db.totalNum(),
            db.selectSignature(req.session.signatureId),
        ])
            .then((val) => {
                console.log("val in GET /Thanks ************************", val);
                console.log(
                    "val[0].rows in GET /Thanks ************************",
                    val[0].rows
                );
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

//Register routs

app.get("/", (req, res) => res.redirect("/register"));

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main",
    });
});

app.post("/register", (req, res) => {
    console.log("req.body", req.body);
    const { firstname, lastname, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            console.log("hash ====> ", hashedPw);
            db.insertRegisterData(firstname, lastname, email, hashedPw)
                .then((val) => {
                    req.session.userId = val.rows[0].id;
                    console.log("val*******************", val);
                    res.redirect("/profile"); //changed redirection here
                })
                .catch((err) => {
                    console.log("Error in insertRegisterData", err);
                    res.render("register", {
                        layout: "main",
                        unvalidData: true,
                    });
                });
        })
        .catch((err) => {
            console.log("err in POST register hash", err);
            res.statusCode = 500;
        });
});

//Log In routes
app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
    });
});

app.post("/login", (req, res) => {
    console.log("req.body /login***************", req.body);
    //Part4
    const { email, password } = req.body;
    db.selectEmail(email) ///signature id
        .then((val) => {
            console.log("val", val.rows[0]);
            compare(password, val.rows[0].password)
                .then((match) => {
                    console.log("are the passwords a match??? ==>", match);
                    if (match) {
                        req.session.userId = val.rows[0].id;
                        req.session.signatureId = val.rows[0].sig_id;
                        if (req.session.signatureId) {
                            res.redirect("/thanks");
                        } else {
                            res.redirect("/thanks");
                        }
                    } else {
                        res.render("login", {
                            layout: "main",
                            unvalidData: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log("Error inside POST/login..... then()", err);
                });
        })
        .catch((err) => {
            console.log("Error in POST/login.....", err);
            res.render("login", {
                layout: "main",
                unvalidData: true,
            });
        });
});

//Profile routes
app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
    });
});

app.post("/profile", (req, res) => {
    const newuserId = req.session.userId;
    const { age, city, url } = req.body;
    db.addProfile(newuserId, age, city, url)
        .then(() => {
            res.redirect("/petition");
        })
        .catch((err) => {
            console.log("Error in POST/profile.....", err),
            res.render("profile", {
                layout: "main",
                unvalidData: true,
            });
        });
});

//GET signers route

app.get("/signers/:city", (req, res) => {
    const city = req.params.city;
    db.selectCity(city)
        .then((val) => {
            console.log("val////////////////", val);
            const { rows } = val;
            res.render("city", {
                layout: "main",
                city: city,
                rows,
            });
        })
        .catch((err) => {
            console.log("Error in GET//signers/:city.....", err),
            res.render("signers", {
                layout: "main",
                unvalidData: true,
            });
        });
});

//Log out
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.listen(8080, () => console.log("Petition server, listening 🦻"));
