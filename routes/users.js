var express = require('express');
var router = express.Router();
const usersService = require('../services/UsersService');

/* GET users listing. */
router.get("/", async (req, res) => {
  res.status(200).json(await usersService.getAll());
});

router.post('/', async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  }

  if(findByUsernameAndPassword(username, password)) {

  }
});

module.exports = router;
