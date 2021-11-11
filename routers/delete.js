const express = require("express");
const db = require("../db.js");
const router = express.Router();
const { requiredSigned, requireLoggedIn } = require("../middleware/stats.js");

router.post(
    "/signature/delete",
    requiredSigned,
    requireLoggedIn,
    (req, res) => {
        const { userId } = req.session;

        db.deleteSig(userId)
            .then(() => {
                req.session.signatureId = null;
                res.redirect("/petition");
            })
            .catch((err) => {
                console.log("error in POST /thanks/delete", err);
                res.render("thanks", {
                    error: "TRY again!",
                });
            });
    }
);

module.exports.deleteRouter = router;
