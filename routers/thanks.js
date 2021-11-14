const express = require("express");
const db = require("../db.js");
const router = express.Router();
const { requiredSigned, requireLoggedIn } = require("../middleware/stats.js");

router.get("/thanks", requiredSigned, requireLoggedIn, (req, res) => {
    console.log("req.session.signatureId", req.session.signatureId);
    Promise.all([
        db.totalNum(),
        db.selectSignature(req.session.signatureId),
        db.selectUserInfo(req.session.userId),
    ])
        .then((val) => {
            console.log("val in GET /Thanks ************************", val);
            console.log(
                "val[3].rows in GET /Thanks ************************",
                val[2].rows[0].first
            );
            res.render("thanks", {
                layout: "main",
                total: val[0].rows[0].count,
                userSig: val[1].rows[0].signature,
                first: val[2].rows[0].first,
            });
        })
        .catch((err) => {
            console.log("Error in  db.totalNum, db.selectSignature", err);
        });
});

module.exports.thanksRouter = router;
