const Study = require('../models/Study');

/**
 * GET /
 * View all studies page.
 */
exports.getViewAll = (req, res) => {

  var studies = null;

  Study.find({'creatorEmail': req.user.email}, function (err, studies) {
    if (err == null) {
      studies = studies;

      res.render('results/allResults', {
        title: 'View Studies', 
        studies: studies
      });
    } else {
      console.log("Error getting studies: " + err)
      res.render('results/allResults', {
        title: 'Error', 
        studies: []
      });
    }
  });
};





/**
 * GET /
 * View study results page.
 */
exports.getStudyResults = (req, res) => {

  var study = null;

  Study.find({'id': req.params.id}, function (err, studies) {
    if (err == null) {
      study = studies[0];

      

      res.render('results/studyResults', {
        title: 'Study Results',
        study: study
      });

    } else {
      console.log("Error getting studies: " + err)
      res.redirect('../results');
    }
  });

};


/**
 * GET /
 * Delete study
 */
  
exports.deleteStudy = (req, res) => {

  Study.remove({'id': req.params.id}, function (err, studies){
    if (err == null) {
      req.flash('success', { msg: 'Successfully deleted study'});
      res.redirect('../');
    } else {
      console.log('error deleting study: ' + err);
      
      res.redirect('../');
    }
  });

};