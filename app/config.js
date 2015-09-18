var http = require('http');
var mongoose = require('mongoose');

var uristring = process.env.MONGOLAB_URI || 
                process.env.MONGOHQ_URL ||
                'mongodb://localhost/test';

mongoose.connect(uristring);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected to Mongodb shortly server!')
});

module.exports = db;


