const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "myPetition";

const db = spicedPg(
    `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);
console.log("[db] Connecting to:", database);

//INSERT the user's signature and name
// SELECT first and last names of every signer
// SELECT to get a total number of signers

module.exports.insertSignatureName = (
    userSignature,
    userFirstName,
    userLastName
) => {
    const q = `INSERT INTO setup (signature, first, last)
                VALUES($1, $2, $3)`;
    const params = [userSignature, userFirstName, userLastName];
    return db.query(q, params);
};

module.exports.selectFirstandLast = (userFirstName, userLastName) => {
    const q = `SELECT (first, last) FROM setup`;
    const params = [userFirstName, userLastName];
    return db.query(q, params);
};

//COUNT(*) returns the number of rows in a specified table, and it preserves duplicate rows.( SQL COUNT function to get the number of items in a group)

module.exports.totalNum = () => {
    return db.query("SELECT COUNT(*) FROM signatures");
};
