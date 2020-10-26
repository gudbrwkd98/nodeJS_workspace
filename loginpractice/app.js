const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
dotenv.config({  path: './.env' });

const app = express();

const db = mysql.createConnection({
    url: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password : process.env.DATABSAE_PASSWORD,
    database : process.env.DATABASE
});

var sessionStore = new MySQLStore(db);


app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

db.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log("MySQL Connected....");
    }
});

const publicDirectory = path.join(__dirname,"./public");

app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');


//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false}));
//parse JSON bodies(as sent by API clients)
app.use(express.json());
app.use(cookieParser());


//Define Routes
app.use("/",require('./routes/pages'));
app.use('/auth',require('./routes/auth'));


app.listen(5001, () => {
    console.log("Server started on port 5000");
});