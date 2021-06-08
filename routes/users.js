var express = require('express');
var router = express.Router();
const usersService = require('../services/UsersService');
const accessTokenSecret = require('../Auth/auth');
const authenticateJWT = require('../services/Auth');
const jwt = require('jsonwebtoken');

router.get("/", async (req, res) => {
  res.status(200).json(await usersService.getAll());
});


router.post('/login', async (req, res) => {
  const { username, password }  = req.body;
  const isLoginSuccessful = await usersService.authenticateUser(username, password);

  if(isLoginSuccessful) {
    const accessToken = jwt.sign({ username }, accessTokenSecret);
    res.send({accessToken});
  } else {
    res.status(401);
  }
});

module.exports = router;
