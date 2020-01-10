require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");

const authCtrl = require("./controller/authController")

const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env;

const app = express();
app.use(express.json());

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("Database connection verified");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.listen(SERVER_PORT, () =>
  console.log(`Server listening on PORT ${SERVER_PORT}!`)
);

//! STEP 2 PART 2