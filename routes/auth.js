var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

// check if the username exists
router.get("/Register", async (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); // Prevent caching
  
  try {
    const { username } = req.query;
    const users = await DButils.execQuery(`SELECT username FROM users WHERE username = '${username}'`);
    if (users.length > 0) {
      res.json({ available: false }); // Username is taken
    } else {
      res.json({ available: true }); // Username is available
    }
  } catch (error) {
    next(error);
  }
});



router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email
    }
    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users (username, firstname, lastname, country, password, email) VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.country}', '${hash_password}', '${user_details.email}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Retrieve the user details from the database based on the username
    const userResults = await DButils.execQuery(`SELECT * FROM users WHERE username = '${username}'`);

    // If no user is found
    if (userResults.length === 0) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    const user = userResults[0]; // Get the first result (since execQuery returns an array)

    // Check that the password is correct
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set the user_id in the session
    req.session.user_id = user.userID; // Ensure your DB column is 'userID'

    // Log session data to verify it's correctly set
    console.log("Session Data after setting userID:", req.session);

    // Return success response
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    // Handle any errors and send appropriate response
    console.error(error);
    res.status(error.status || 500).send({ message: error.message || "Login failed", success: false });
  }
});

router.get("/Login", (req, res) => {
  if (req.session && req.session.user_id) {
    res.status(200).send({ loggedIn: true, userId: req.session.user_id });
  } else {
    res.status(200).send({ loggedIn: false });
  }
});



router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;