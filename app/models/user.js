var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
  name    : String,
  gender  : String,
  company : String,
  email   : String,
  phone   : String,
  address : String
});

module.exports = mongoose.model("User", UserSchema);
