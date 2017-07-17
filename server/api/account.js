import Accounts from '../models/Accounts';
import express from 'express';
import config from '../config.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
const router = express.Router();

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
/*
router.post('/signup',function(){
  var account = new Accounts({
    email: 'tmqps78@naver.com',
    username: 'godsenal',
  });
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync('lee3737', salt);
  account.password = hash;

  account.save();
});
*/
router.post('/signin', (req, res, next) => {
  if(typeof req.body.password !== 'string') {
    return res.status(401).json({
      error: 'SIGNIN FAILED',
      code: 1
    });
  }

  passport.authenticate('local-signin', function(err, token, data) {
    if (err) {
      return res.status(401).json({
        error: 'SIGNIN FAILED',
        code : 2,
      });
    }
    if (!data) {
      return res.status(401).json({
        error: 'CAN NOT FIND USER',
        code : 3,
      });
    }
    //user has authenticated correctly thus we create a JWT token
    return res.json({
      token : token,
      email: data.email,
      username: data.username,
    });

  })(req, res, next);

/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/
});

router.get('/getinfo', (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: 'INVALID STATUS',
      code: 1
    });
  }

  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, config.jwtSecret,(err, decoded) => {

    if (err) {
      return res.status(401).json({
        error: 'CANNOT DECODED TOKEN',
        code: 2
      });
    }

    Accounts.findOne({email: decoded.email},{id: 1},function(err,user){
      if(err) {
        return res.status(401).json({
          error: 'MONGO ERROR',
          code: 2
        });
      }

      return res.json({info: user});
    });
  });
});

/*
    LOGOUT: POST /api/account/logout     ///지워도됨 JWT에서는 필요가 없다.
*/
router.post('/signout', (req, res) => {
  req.session.destroy();
  return res.json({ success: true });
});




export default router;
