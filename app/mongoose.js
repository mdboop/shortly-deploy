var mongoose = require('mongoose');
var path = require('path');

//replace with what we have from mongolabs
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


//SCHEMA

//urls

//users schema
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

//links schema

var linkSchema = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

exports.User = mongoose.model('User', userSchema);

exports.Link = mongoose.model('Link', linkSchema);

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.find('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.find('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
    });
};