import config from './config';
import mongoose from 'mongoose';
import api from './api';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';

const passport = require('passport');


var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  if(config.nodeEnv !== 'development'){
    console.log('Connected to mongod server');
  }
  else{
    console.log('Connected to mongolab server');
  }

});

mongoose.Promise = require('bluebird');
mongoose.connect(config.dbUrl);


const app = express();

/*
const localSignupStrategy = require('./passport/local-signup');
const localSigninStrategy = require('./passport/local-signin');
const facebookSigninStrategy = require('./passport/facebook-signin');
const otherSignupStrategy = require('./passport/other-signup');
passport.use('local-signup', localSignupStrategy);
passport.use('local-signin', localSigninStrategy);
passport.use('facebook-signin', facebookSigninStrategy);
passport.use('other-signup', otherSignupStrategy);
*/



app.use( bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(path.join(__dirname, './../public'))); // 정적인 페이지 로드

app.use('/api',api);

app.get('*', (req,res)=>{
  //req.params.contestId에 따라 다른 페이지를 만들어야함. route일 땐 undefined
  res.sendFile(path.resolve(__dirname, './../public/index.html'));

});




var server = app.listen(config.port, () => {
  console.info('Express listening on port', config.port);
});
