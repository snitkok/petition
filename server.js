const express = require("express");
const app = express();
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

const { authRouter } = require("./routers/auth-router.js");
const { profileRouter } = require("./routers/profile.js");
const { petitionRouter } = require("./routers/petition.js");
const { signersRouter } = require("./routers/signers.js");
const { thanksRouter } = require("./routers/thanks.js");
const { deleteRouter } = require("./routers/delete.js");
//

if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("./public"));
app.use(
    cookieSession({
        secret: COOKIE_SECRET,
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



app.use(authRouter);
app.use(profileRouter);
app.use(petitionRouter);
app.use(signersRouter);
app.use(thanksRouter);
app.use(deleteRouter);


app.listen(process.env.PORT || 8080, () =>
    console.log("Petition server, listening 🦻")
);