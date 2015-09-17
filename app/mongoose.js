var mongoose = require('mongoose');
var path = require('path');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

//replace with what we have from mongolabs, revisit this

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(){

  var userSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true}
  });
    
  var linkSchema = new mongoose.Schema({
    url: {
      type: String,
      required: true,
      index: {unique: true}
    },
    base_url: {
      type: String,
      required: true
    },
    code: {
      type: String, 
      required: true
    },
    title: {
      type: String,
      required: true
    },
    visits: {
      type: Number,
      required: true
    }
  });

  userSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      if(err) return callback(err)
      callback(null, isMatch);
    });
  };

  userSchema.methods.hashPassword = function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.find('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  };

  exports.User = mongoose.model('User', userSchema);
  exports.Link = mongoose.model('Link', linkSchema);
});


mongoose.connect('mongodb://localhost/test');


