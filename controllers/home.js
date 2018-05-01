/**
 * GET /
 * Home page.
 */

const Study = require('../models/Study');

exports.index = (req, res) => {
  var studies = null;

  Study.find({'creatorEmail': req.user.email}, function (err, studies) {
    if (err == null) {
      studies = studies;
      
      res.render('home', {
        title: 'Home', 
        studies: studies.reverse()
      });

    } else {
      console.log("Error getting studies: " + err)
      res.render('home', {
        title: 'Home', 
        studies: null
      });
    }
  });

};
