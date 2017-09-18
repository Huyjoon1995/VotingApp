var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://Huyjoon1995:Iamlegend3000!@ds139844.mlab.com:39844/votingdatabase');

var db = mongoose.connection;

//User Schema
var userSchema = mongoose.Schema({
    username: {
      type: String,
      index: true
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    name : {
      type: String
    },
    profileimage: {
      type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
}
module.exports.getUserByUsername = function(username,callback){
  var query = {username:  username};
  User.findOne(query,callback);
}
module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
  // res === true
  if(err) return callback(err);
  callback(null,isMatch);
  });
}

module.exports.createUser = function(newUser, callback){
var bcrypt = require('bcryptjs');
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        // Store hash in your password DB.
        newUser.password = hash;
        newUser.save(callback);
    });
});
}
