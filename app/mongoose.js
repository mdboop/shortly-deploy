var mongoose = require('mongoose');
var path = require('path');
var Schema = mongoose.Schema;
var bcrypt = require(bcrypt);
var SALT_WORK_FACTOR = 10;

//replace with what we have from mongolabs, revisit this
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


//SCHEMA

//urls

//users schema
var userSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true}
});

userSchema.pre('save', {
//only hash the password if it has been modified or its new
// if (!user.isModified('password')) {
//   return next();
// }
//generate a salt

bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
  if(err) return next(err)

    //hash the password along with our new salt

    bcrypt.hash(this.password, salt, function(err, hash){
      if(err) return next(err);

      //override the cleartext password with the hashed one
      this.password = hash;
      next();
    })
})
})

//links schema

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

exports.User = mongoose.model('User', userSchema);

exports.Link = mongoose.model('Link', linkSchema);

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

module.exports.User = mongoose.model(User, userSchema);
module.exports.Link = mongoose.model(Link, linkSchema);
