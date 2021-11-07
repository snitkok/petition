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
    userFirstName,
    userLastName,
    userSignature
) => {
    const q = `INSERT INTO signatures (first, last, signature)
                VALUES($1, $2, $3)
                RETURNING id`;

    const params = [userFirstName, userLastName, userSignature];
    return db.query(q, params);
};

module.exports.selectFirstandLast = () => {
    const q = `SELECT first, last FROM signatures`;
    return db.query(q);
};

//COUNT(*) returns the number of rows in a specified table, and it preserves duplicate rows.( SQL COUNT function to get the number of items in a group)

module.exports.totalNum = () => {
    const q = `SELECT COUNT(*) FROM signatures`;
    return db.query(q);
};

module.exports.selectSignature = (val) => {
    //don't forget to add an argument here
    const q = `SELECT signature FROM signatures
    WHERE id = ${val}`;
    return db.query(q);
};
