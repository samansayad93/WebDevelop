//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { rateLimit } from "express-rate-limit";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(limiter);

var userIsAuthorised = false;

app.use(bodyParser.urlencoded({extended: true}));

function Checker(req,res,next){
    if(req.body["password"] === "ILoveProgramming"){
        userIsAuthorised = true;
    }
    else{
        userIsAuthorised = false;
    }
    next();
}

app.use(Checker);

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req,res) => {
    if(userIsAuthorised){
        res.sendFile(__dirname + "/public/secret.html");
    }
    else{
        res.redirect("/");
    }
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});