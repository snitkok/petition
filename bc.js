const { hash, compare, genSalt } = require("bcryptjs");

exports.hash = (password) => {
    return genSalt().then((salt) => {
        console.log("password", password);
        console.log("salt", salt);
        return hash(password, salt);
    });
};

exports.compare = compare; //returns a boolean, and compares a hashed password
