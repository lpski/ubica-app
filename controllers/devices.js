/**
 * GET /
 * Devices page.
 */

const Device = require('../models/Device');

exports.getAllDevices = (req, res) => {

  Device.find({'creatorEmail': req.user.email}, function (err, devices) {
    if (err == null) {

        res.render('devices', {
            title: 'Devices', 
            devices: devices
        });
    } else {
        console.log("Error getting devices: " + err);
        res.redirect('../');
    }
  });

};
