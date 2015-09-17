var mongoose = require('mongoose');
var path = require('path');

//replace with what we have from mongolabs
mongoose.connect('mongodb://localhost:4568');

//SCHEMA

//urls

//users schema
exports.User = new mongoose.Schema({
  username: String,
  password: String
});

//links schema

exports.Link = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});