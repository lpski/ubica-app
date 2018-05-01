
const Study = require('../models/Study');
const Device = require('../models/Device');

/**
 * GET /
 * Get active study monitoring page.
 */
exports.getActive = (req, res) => {

  Study.find({'id': req.params.id}, function (err, studies) {
    if (err == null) {

      Device.find({'creatorEmail': req.user.email}, function (err, d) {
        var sorted_devices = d.sort(function(a, b){
          var keyA = a.title,
              keyB = b.title;
          // Compare the 2 titles
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });

        /*var devices = [];
        var teams = studies[0].teams;
        for(var i = 0; i<devices.length;i++) {
          devices.push
          deviceDict[i] = sorted_devices[i];
        }*/


        for(i=0; i<d.length; i++){
          var randVal = Math.floor(Math.random() * 13);
          if(parseInt(sorted_devices[i].battery) < 25){
            sorted_devices[i].issue = "Low Battery"
          } else if (randVal === 5) {
            sorted_devices[i].issue = "Issue recording voice data"
          } else if (randVal === 3) {
            sorted_devices[i].issue = "Issue with bluetooth transmission"
          } else {
            sorted_devices[i].issue = "No Issues"
          }
        }

        if (err == null) {
          console.log(sorted_devices);
          res.render('monitor/active', {
            title: 'Monitor',
            study: studies[0],
            devices: sorted_devices
          });

        } else {
          console.log("Error retrieving user devices for monitoring: " + err);
            
          req.flash('error', { msg: 'Issue retrieving devices'});
          res.redirect('../home');
        }

      });
      
    } else {
      console.log("Error retrieving study from id in team setup: " + err);
        
      req.flash('error', { msg: 'Issue retrieving study'});
      res.redirect('../monitor');
    }
  });
};
  


/**
 * GET /
 * Get no active studies page.
 */
exports.getInactive = (req, res) => {

  var studies = [];

  Study.find({'creatorEmail': req.user.email}, function (err, s) {
    if (err == null) {

      if (s!=null && s.length > 0) {
        for(i=0;i<s.length;i++){
          if (s[i].status === "active" || s[i].status === "paused") {
            studies.push(s[i]);
          }
        }
      }

      if (studies.length > 0) {
        res.render('monitor/inactive', {
          title: 'Monitor', 
          studies: studies.reverse()
        });
      } else {
        res.render('monitor/inactive', {
          title: 'Monitor', 
          studies: null
        });
      }

    } else {
      console.log("Error getting studies: " + err)
      res.render('home', {
        title: 'Home', 
        studies: null
      });
    }
  });
};

/**
 * GET /
 * Get finish
 */
exports.getEndStudy = (req, res) => {

  Study.update({'id': req.params.id}, {'status': 'ended'}, function (err, raw) {
    if (err == null) {
      res.redirect('../../upload/' + req.params.id);
    } else {
        console.log("error setting study finished: " + err);
    }
  });
};

/**
 * GET /
 * Get pause
 */
exports.getPauseStudy = (req, res) => {

  Study.update({'id': req.params.id}, {'status': 'paused'}, function (err, raw) {
    if (err == null) {
      res.redirect('../../monitor/' + req.params.id);
    } else {
        console.log("error setting study paused: " + err);
    }
  });
};

/**
 * GET /
 * Get resume
 */
exports.getResumeStudy = (req, res) => {

  Study.update({'id': req.params.id}, {'status': 'active'}, function (err, raw) {
    if (err == null) {
      res.redirect('../../monitor/' + req.params.id);
    } else {
        console.log("error setting study active: " + err);
    }
  });
};


