const mongoose = require('mongoose');
const uid = require('uid-safe');

/*const studySchema = new mongoose.Schema({

    title: { type: String, default: '', unique: false},

    id: {type: String, unique: true, required: true, default: uid.sync(18)},
    _id: {type: String},

    creatorEmail: { type: String, required: true, unique: false},


    teams: {type: [[Number]], default: [[]], unique: false},

    memberCount: {type: Number, default: 0, unique: false},

    teamCount: {type: Number, default: 0, unique: false},

    shareGroup: { type: String, default: uid.sync(18), unique: false },

  }, { timestamps: true }
);*/

const studySchema = new mongoose.Schema({

  title: String,

  id: String,

  teams: [[Number]],

  creatorEmail: String,

  memberCount: Number,

  teamCount: Number,

  createdAt: Date,

  status: String
}
);


var Study = mongoose.model('Study', studySchema);

module.exports = Study;