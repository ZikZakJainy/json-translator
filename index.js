const Translate = require('@google-cloud/translate');
const express = require('express')
const app = express();
// import mongoose from 'mongoose';
var mongoose=require('mongoose');
// import expressJwt from 'express-jwt';
const expressJwt=require('express-jwt');
var cors = require('cors');
app.use(cors());
// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://root:root@ds135917.mlab.com:35917/test3");
mongoose.Promise = require('bluebird');

const LocalStrategy = require('passport-local').Strategy;


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// var sourceJSON = require('./wordsJSON.json');
const translate = new Translate({
  keyFilename: './serviceaccount.json'
});

// var nameSchema = new mongoose.Schema({
//   username: String,
//   password: String
// });


// var User = mongoose.model("User", nameSchema);

// app.post("/addname", (req, res) => {
//   console.log('asf'+JSON.stringify(req.body));
//     var myData = new User(req.body);
//     myData.save().then(item => {
//       res.send("item saved to database");
//     }).catch(err => {
//       res.status(400).send("unable to save to database");
//     });
// });

// Connect to MongoDB
mongoose.connect('mongodb://root:root@ds135917.mlab.com:35917/test3');
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// require('./routes').default(app);
// var target = 'ru';
app.get('/api/emails', function (req, res) {
    res.json({status: 'GET /api/users'});
});
app.post('/translate/:target', (req, res) => {
//   console.log('hitting...'+JSON.stringify(req.params.target));
// console.log('hitting...'+JSON.stringify(req.body));
var sourceJSON = req.body.sourceJSON;
  var sourceKeyArry = Object.keys(sourceJSON);
  var sourceValArry = Object.values(sourceJSON);
  console.log('key '+JSON.stringify(sourceKeyArry));
  console.log('val '+JSON.stringify(sourceValArry));
  // console.log('hitting...key'+JSON.stringify(sourceKeyArry));
  // console.log('hitting...values'+JSON.stringify(sourceKeyArry));
  translate.translate(sourceValArry, req.params.target).then(results => {
    const translation = results[0];
    console.log(translation);
    res.send(arry2obj(sourceKeyArry, translation));
  }).catch(err => {
    console.error('ERROR:', err);
  });
});
app.listen(2800, () => console.log('Translator app listening on port 2800!'));

function arry2obj(sourceKeyArry, translation) {
  var destination = {};
  for (var i = 0; i < sourceKeyArry.length; i++) {
    if (sourceKeyArry[i] !== undefined) destination[sourceKeyArry[i]] = translation[i];
  }
  return destination;
}
