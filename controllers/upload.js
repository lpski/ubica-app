/**
 * GET /
 * Devices page.
 */
const webAudioBuilder = require('waveform-data/webaudio');
//const audioContext = new AudioContext();
var mp3Duration = require('mp3-duration');

const Study = require('../models/Study');
const Device = require('../models/Device');

exports.getUpload = (req, res) => {

    Study.find({'id': req.params.id}, function (err, studies) {
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
                res.render('upload', {
                    title: 'Upload - Manual',
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

exports.getUploadWithData = (req, res) => {

    Study.find({'id': req.params.id}, function (err, studies) {
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
                res.render('upload', {
                    title: 'Upload',
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

function splitUp(arr, n) {
    var rest = arr.length % n, // how much to divide
        restUsed = rest, // to keep track of the division over the elements
        partLength = Math.floor(arr.length / n),
        result = [];

    for(var i = 0; i < arr.length; i += partLength) {
        var end = partLength + i,
            add = false;

        if(rest !== 0 && restUsed) { // should add one element for the division
            end++;
            restUsed--; // we've used one division element now
            add = true;
        }

        result.push(arr.slice(i, end)); // part of the array

        if(add) {
            i++; // also increment i in the case we added an extra element for division
        }
    }

    return result;
}

exports.postUpload = (req, res) => {

    if (!req.files){
        console.log(req.body);
        console.log(req.file);
        console.log(req.files);
        return res.status(400).send('No files were uploaded.');
    } 

    let audioFile = req.files.audio;
    //let node = AnalyserNode();
    //console.log('\ndata');
    console.log(audioFile);

    var sum = 0
    var min = 255;
    var max = 0;
    for(i=0;i<audioFile.data.length;i++){
        let hexVal = audioFile.data[i].toString(16);
        let decVal = parseInt(hexVal, 16);
        sum += decVal;
        if (min > decVal) {
            min = decVal;
        }
        if (max < decVal) {
            max = decVal;
        }
    }

    //console.log('average = ' + Math.floor(sum/audioFile.data.length));
    //console.log('min = ' + min);
    //console.log('max = ' + max);
    mp3Duration(audioFile.data, function (err, duration) {
        if (err) return console.log(err.message);
        
        let dur = Math.floor(duration);

        var arrs = splitUp(audioFile.data, dur * 4);
        //console.log(arrs);
        var newData = [];
        for(i=0;i<arrs.length;i++){
            var cur = arrs[i];
            var sum = 0
            for(j=0;j<cur.length;j++){
                sum = sum + cur[j];
            }
            newData.push(Math.floor(sum/cur.length));
        }


        res.render('monitor/test', {
            title: 'Analysis Results',
            waveData: newData
          });

      });

};


