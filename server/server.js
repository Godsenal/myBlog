import config from './config';
import mongoose from 'mongoose';
import api from './api';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';

const passport = require('passport');

var credentials = {
  key: fs.readFileSync(config.pathToKey,'utf8'),
  cert: fs.readFileSync(config.pathToCert,'utf8'),
};

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

const localSigninStrategy = require('./passport/local-signin');
passport.use('local-signin', localSigninStrategy);
/*
const localSignupStrategy = require('./passport/local-signup');
const facebookSigninStrategy = require('./passport/facebook-signin');
const otherSignupStrategy = require('./passport/other-signup');
passport.use('local-signup', localSignupStrategy);
passport.use('facebook-signin', facebookSigninStrategy);
passport.use('other-signup', otherSignupStrategy);
*/



app.use( bodyParser.urlencoded({ extended: true }) );
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(path.join(__dirname, './../public'),{ maxAge: 86400000 })); // 정적인 페이지 로드

app.use('/api',api);

app.get('*', (req,res)=>{
  //req.params.contestId에 따라 다른 페이지를 만들어야함. route일 땐 undefined
  res.sendFile(path.resolve(__dirname, './../public/index.html'));

});



var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(config.port, config.host, () => {
  console.info('HTTP Express listening on port', config.port);
});

httpsServer.listen(config.portHttps, config.host, () => {
  console.info('HTTPS Express listening on port', config.portHttps);
});
