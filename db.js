const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "myPetition";
\
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);
console.log("[db] Connecting to:", database);

module.exports.insertSignatureName = (userId, userSignature) => {
    const q = `INSERT INTO signatures (user_id, signature)
                VALUES($1, $2)
                RETURNING id`;
    const params = [userId, userSignature];
    return db.query(q, params);
};

module.exports.selectFirstandLast = () => {
    const q = `SELECT users.first, users.last, profiles.age, profiles.city, profiles.url
    FROM signatures
    JOIN users 
    ON users.id = signatures.user_id
    LEFT JOIN profiles 
    ON users.id = profiles.user_id`;
    return db.query(q);
};

//COUNT(*) returns the number of rows in a specified table, and it preserves duplicate rows.( SQL COUNT function to get the number of items in a group)

module.exports.totalNum = () => {
    const q = `SELECT COUNT(*) FROM signatures`;
    return db.query(q);
};

module.exports.selectSignature = (id) => {
    //don't forget to add an argument here
    const q = `SELECT signature FROM signatures
    WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

// Part 3
module.exports.insertRegisterData = (
    userFirstName,
    userLastName,
    userEmail,
    userPassword
) => {
    const q = `INSERT INTO users (first, last, email, password)
                VALUES($1, $2, $3, $4)
                RETURNING id`;

    const params = [userFirstName, userLastName, userEmail, userPassword];
    return db.query(q, params);
};

module.exports.selectEmail = (val) => {
    //don't forget to add an argument here
    const q = `SELECT users.password, users.id, signatures.id AS sig_id
    FROM users
    LEFT JOIN signatures
    ON users.id = signatures.user_id
    WHERE email = $1`;
    const params = [val];
    return db.query(q, params);
};

//New queries part 4
module.exports.addProfile = (userID, userAge, userCity, userUrl) => {
    const q = `INSERT INTO profiles (user_id, age, city, url)
                VALUES($1, $2, $3, $4)
                RETURNING id`;

    const params = [userID, userAge, userCity, userUrl];
    return db.query(q, params);
};

module.exports.selectCity = (val) => {
    const q = `SELECT users.first, users.last, profiles.age, profiles.city, profiles.url
    FROM signatures
    JOIN users 
    ON users.id = signatures.user_id
    LEFT JOIN profiles 
    ON users.id = profiles.user_id
    WHERE LOWER(profiles.city) = LOWER($1)`;
    const params = [val];
    return db.query(q, params);
};
