const express = require("express");
const db = require("../db.js");
const { hash, compare } = require("../bc.js");
const router = express.Router();
const { requireLoggedIn, requiredSigned } = require("../middleware/stats.js");

//---------------------------------------------------------------------------GET /profile/
router.get("/profile", requireLoggedIn, (req, res) => {
    res.render("profile", {
        layout: "main",
    });
});

//----------------------------------------------------------------------------POST /profile/
router.post("/profile", requiredSigned, (req, res) => {
    const newuserId = req.session.userId;
    let { age, city, url } = req.body;
    if (url && !url.startsWith("https://")) {
        url = "https://" + url;
        console.log("Error in POST/profile if statement.....");
        return res.render("profile", {
            layout: "main",
            unvalidData: true,
        });
    }
    if (!age) {
        age = null;
    }

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

//----------------------------------------------------------------------------GET /profile/edit
router.get("/profile/edit", (req, res) => {
    const { userId } = req.session;
    db.selectUserInfo(userId)
        .then((val) => {
            const { rows } = val;
            res.render("edit", {
                layout: "main",
                rows,
            });
        })
        .catch((err) => {
            console.log("Error in GET/profile.....", err),
                res.render("edit", {
                    layout: "main",
                });
        });
});

//----------------------------------------------------------------------------POST /profile/edit

router.post("/profile/edit", (req, res) => {
    let { first, last, email, password, age, city, url } = req.body;
    const { userId } = req.session;
    console.log("***********req.body**********", req.body);

    if (url && !url.startsWith("https://")) {
        url = "https://" + url;
        console.log("Error in POST/profile if statement.....");
        return res.render("profile", {
            layout: "main",
            unvalidData: true,
        });
    }
    if (!age) {
        age = null;
    }

    let userUpdatePromise;

    if (password) {
        console.log("inside //POST /profile/edit if statement ##############");
        userUpdatePromise = hash(password).then((hashedPW) => {
            return db.updateUserwithpassword({
                userId,
                first,
                last,
                email,
                hashedPW,
            });
        });
    } else {
        console.log();
        userUpdatePromise = db.updateUser({
            userId,
            first,
            last,
            email,
        });
    }

    console.log("password check done!!!!!!!!!!!!!!!!!");

    Promise.all([
        userUpdatePromise,
        db.upsertProfile({ userId, age, city, url }),
    ])
        .then(() => {
            console.log("Inside of the then()");
            return res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("WE HAVE AN ERROR", err);
            return db.selectUserInfo(userId).then((val) => {
                const { rows } = val;
                res.render("edit", {
                    layout: "main",
                    rows,
                    unvalidData: true,
                });
            });
        });
});

module.exports.profileRouter = router;
