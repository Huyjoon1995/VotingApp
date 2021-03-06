var mongoose = require('mongoose');
var db = mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://Huyjoon1995:Iamlegend3000!@ds139844.mlab.com:39844/votingdatabase');

var PollSchema = new mongoose.Schema({
    username: String,
    question: String,
    options: Array
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback) {
    newPoll.save(callback);
};

module.exports.getPollsByUsername = function(username, callback) {
  var query = {username: username};
  Poll.find(query, callback);
};

module.exports.getAllPolls = function(callback) {
  Poll.find({}, {}, callback);
};

module.exports.getSinglePoll = function(id, callback) {
  Poll.findById(id, callback);
};

module.exports.castVote = function(id, userChoice) {
  Poll.update({_id: id, "options.choice": userChoice},
              {$inc: {"options.$.votes": 1}},
              false,
              true
  );
};
