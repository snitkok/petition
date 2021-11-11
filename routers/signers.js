const express = require("express");
const db = require("../db.js");
const router = express.Router();
const { requiredSigned, requireLoggedIn } = require("../middleware/stats.js");

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ SIGNERS ROUTES

router.get("/signers", requiredSigned, requireLoggedIn, (req, res) => {
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
});

router.get("/signers/:city", requiredSigned, requireLoggedIn, (req, res) => {
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

module.exports.signersRouter = router;
