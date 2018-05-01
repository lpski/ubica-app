const mongoose = require('mongoose');
const uid = require('uid-safe');

const deviceSchema = new mongoose.Schema({

  title: String,

  id: String,

  creatorEmail: String,

  color: String,

  status: String,

  issue: String,

  battery: Number
}
);


var Device = mongoose.model('Device', deviceSchema);

module.exports = Device;