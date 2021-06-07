var express = require('express');
var router = express.Router();
const usersService = require('../services/UsersService');
const accessTokenSecret = require('../Auth/auth');
const authenticateJWT = require('../services/Auth');

/* GET users listing. */
router.get("/", authenticateJWT, async (req, res) => {
  res.status(200).json(await usersService.getAll());
});


//login
router.post('/login', async (req, res) => {
  const { username, password }  = req.body;

  const user = authenticateUser(username, password);

  if(user) {

    const accessToken = jwt.sign({username: user.username}, accessTokenSecret);
  
    res.json({accessToken});
  } else {
    res.send('Username or password incorrect');
  }
});

// router.get('/me', async (req, res) => {
//   const { token } = req.body;

//   const user = authenticateUser(username, password);

//   if(user) {

//     const accessToken = jwt.sign({username: user.username, role: user.role}, accessTokenSecret);
  
//     res.json({accessToken});
//   } else {
//     res.send('Username or password incorrect');
//   }
// });

module.exports = router;
