const express = require("express");
const db = require("../db.js");
const router = express.Router();
const {
    requiredNotSigned,
    requireLoggedIn,
} = require("../middleware/stats.js");

//############################################################################### PETITION ROUTES

router.get("/petition", requiredNotSigned, requireLoggedIn, (req, res) => {
    res.render("petition", {
        layout: "main",
    });
});

router.post("/petition", (req, res) => {
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

module.exports.petitionRouter = router;
