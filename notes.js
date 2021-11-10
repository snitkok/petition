const { decodeBase64 } = require("bcryptjs");
const { urlencoded } = require("body-parser");
const { appendFile } = require("fs");
const { brotliCompress } = require("zlib");

const parsedAge = Number.parseInt(age);
if (url.startsWith(http){
    res.render(console.error())
}


before adding city information make all lower case;

//or 
//best option
WHERE LOWER(profiles.city) = LOWER("$");


app.get("/city/:cityName", req, res) {
const cityName = req.params.cityName;
console.log("req.params.cityName;", req.params.cityName);
if(cityName.toLowercase() =)
}


//10.11




nsert into table XXX (id another columns, attack)  VALUES (id, 10)
ON CONFLICT (pokemon_id) DO UPDATE SET  column = value //example attack=10;

DELETE FROM POKEMONS WHERE id=1;



app.post("/edit", (req, res) => {
    const {password} = req.body;
    if(password){
        bc.hash(password).then(hash =>{
            return db.UpdateUserwithpassword(hash);
        }).then(() =>{
            return db.upsertProfil()
        }).then(() => {
            res.redirect("/thanks");
        }).catch((err) =>{
            res.render("edit", {
               error: "TRy again!" 
            })
        })

    }else{
        db.UpdateUser().then(() =>{
            return db.upsertProfil()
        }).then(() => {
            res.redirect("/thanks");
        })
    }
})


//alternatively PROMISE ALL
create a variable holding if(){}

let UpdateUserPromise;
if(password){
    UpdateUserPromise = bc.hash(password).then(() => {db.UpdateUserwithpassword});
} else{
//update user without password
}

Promise.all([
    UpdateUserPromise,
    db.upsertProfil();
]).then(() => {
            res.redirect("/thanks");
        }).catch((err) =>{
            res.render("edit", {
               error: "TRy again!" 
            })
        })
