
const Study = require('../models/Study');
const Device = require('../models/Device');
const uid = require('uid-safe');
const mongoose = require('mongoose');

/**
 * GET /
 * Setup page.
 */
  
exports.getSetup = (req, res) => {
    res.redirect('setup/configure')
};
exports.getConfigure = (req, res) => {
    res.render('setup/setup', {
        title: 'Setup'
    });
};
exports.getConfigureWithInfo = (req, res) => {
    Study.find({'id': req.params.id}, function (err, studies) {
        if (err == null) {
            res.render('setup/setup', {
                title: 'Setup',
                study: studies[0]
            });
        } else {
            console.log("Error retrieving study from id in configure: " + err);
            
            res.redirect('/setup/');
        }
    });
};

/**
 * POST /setup/configure
 * Validate configaration info and redirect to teams setup
 */
exports.postConfigure = (req, res) => {
    let fromName;
    let fromMembers;
    let fromTeams;
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('members', 'Members cannot be blank').notEmpty();
    req.sanitize('members').toInt();
    req.assert('teams', 'Teams cannot be blank').notEmpty();
    req.sanitize('teams').toInt();
  
    const errors = req.validationErrors();
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/setup');
    }
    
    fromName = req.body.name;
    fromMembers = req.body.members;
    fromTeams = req.body.teams;

    var s = new Study();
    s.title = fromName;
    s.memberCount = fromMembers;
    s.teamCount = fromTeams;
    s.creatorEmail = req.user.email;
    s.id = uid.sync(18);
    s.createdAt = Date.now();
    s.status = "active"
    //s._id = uid.sync(18);
    console.log("Saving study");
    
    s.save(function (err) {
        if (err != null) {
            console.log("Error with initial save of study: " + err);
        }
    });
    
    res.redirect('/setup/teams/' + s.id);
};





exports.getTeams = (req, res) => {

    var id = req.params.id;

    Study.find({'id': id}, function (err, studies) {
        Device.find({'creatorEmail': req.user.email}, function (err, devices) {
            var sorted_devices = devices.sort(function(a, b){
                var keyA = a.title,
                    keyB = b.title;
                // Compare the 2 titles
                if(keyA < keyB) return -1;
                if(keyA > keyB) return 1;
                return 0;
            });
            if (err == null) {
                res.render('setup/teams', {
                    title: 'Teams',
                    study: studies[0], 
                    devices: sorted_devices
                });
            } else {
                console.log("Error retrieving study from id in team setup: " + err);
                
                res.redirect('/setup/');
            }
        });
    });

};

exports.getReviewWithInfo = (req, res) => {
    console.log(req.params.teams);
    let id = req.params.id;
    let teams = req.params.teams.split('],');
    var dataArrs = [];
    for(var i = 0; i < teams.length; i++) {
        var teamVals = teams[i];
        if (i<teams.length - 1) {
            teamVals += ']';
        }
        dataArrs.push(JSON.parse(teamVals));
    }

    Study.update({'id': id}, {'teams': dataArrs}, {}, function (err, raw) {
        if (err == null) {
            res.render('setup/review', {
                title: 'Review',
                selections: dataArrs,
                id: id
            });
        } else {
            console.log("error updating study team data: " + err);
        }
    });





};