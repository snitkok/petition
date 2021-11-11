const express = require("express");
const db = require("../db.js");
const { hash, compare } = require("../bc.js");
const router = express.Router();
const { requireNotLoggedIn } = require("../middleware/stats.js");

//********************************************************************************* REGISTER routs

router.get("/", (req, res) => res.redirect("/register"));

router.get("/register", requireNotLoggedIn, (req, res) => {
    res.render("register", {
        layout: "main",
    });
});

router.post("/register", requireNotLoggedIn, (req, res) => {
    console.log("req.body", req.body);
    const { firstname, lastname, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            console.log("hash ====> ", hashedPw);
            db.insertRegisterData(firstname, lastname, email, hashedPw)
                .then((val) => {
                    req.session.userId = val.rows[0].id;
                    console.log("val*******************", val);
                    return res.redirect("/profile");
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

//********************************************************************************* LOG IN routs
router.get("/login", requireNotLoggedIn, (req, res) => {
    return res.render("login", {
        layout: "main",
    });
});

router.post("/login", requireNotLoggedIn, (req, res) => {
    console.log("req.body /login***************", req.body);
    const { email, password } = req.body;
    db.selectEmail(email)
        .then((val) => {
            console.log("val", val.rows[0]);
            compare(password, val.rows[0].password)
                .then((match) => {
                    console.log("are the passwords a match??? ==>", match);
                    if (match) {
                        req.session.userId = val.rows[0].id;
                        req.session.signatureId = val.rows[0].sig_id;
                        if (req.session.signatureId) {
                            return res.redirect("/thanks");
                        } else {
                            return res.redirect("/petition");
                        }
                    } else {
                        return res.render("login", {
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

//********************************************************************************* LOG OUT routs
router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

module.exports.authRouter = router;
