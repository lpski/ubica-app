
var bar_index = 0;
var last_value = 1;
$(document).ready(() => {


  // set up monitoring table if necessary
  if(document.title === 'Monitor') {
    $('#monitor-table').DataTable({
      paging: false,
      searching: false,
      bInfo: false,
      'columnDefs': [
        { 'targets': [3, 4], 'orderable': false}
      ],
      order: [[ 1, "asc" ]]
    });

    $('canvas').each(function( index ) {
      var ctx = this.getContext('2d');

      var ampData = {
        labels: ["0s", "5s", "10s", "15s", "20s", "25s", "30s", "35s", "40s", "45s", "50s", "55s", "60s"],
        datasets: [{
          data: [20, 22, 50, 22, 22, 20, 20, 0, 4, 0, 50, 60, 65],
        }],
        backgroundColor: '2980b9',
        borderColor: '2980b9',
        pointBorderColor: 'orange',
        pointBackgroundColor: 'rgba(255,150,0,0.5)',
        pointRadius: 5,
        pointHoverRadius: 10,
        pointHitRadius: 30,
        pointBorderWidth: 2,
        pointStyle: 'rectRounded'
      };
      var chartOptions = {
        legend: {
          display: false,
          position: 'top',
          labels: {
            boxWidth: 80,
            fontColor: 'black'
          }
        }
      };

      var myChart = new Chart(ctx, {
        type: 'line',
        data: ampData,
        options: chartOptions
      });
    });
  } else if(document.title === 'Upload') {
    
    bar_index = 0;
    var bars = $('.progress-container');

    $('.progress-container').each(function( index ) {

      var bar = new ProgressBar.Line(this, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1500 * (index + 1),
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: {width: '100%', height: '100%'},
        text: {
          style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: '#999',
            position: 'absolute',
            right: '0',
            top: '30px',
            padding: 0,
            margin: 0,
            transform: null
          },
          autoStyleContainer: false
        },
        from: {color: '#FFEA82'},
        to: {color: '#ED6A5A'},
        step: (state, bar) => {
          bar.setText(Math.round(bar.value() * 100) + ' %');
        }
      });
      
      bar.animate(1.0);  // Number from 0.0 to 1.0

      
    });

  } else if(document.title === 'Upload - Manual') {
    last_value = 1;
    $("#teams").on("input", function() {
      if (this.value > last_value) {
        last_value = last_value + 1;
        $('.teams-container').append("<div class='team-group'> <label class='col-sm-12' style='margin-top: 20px'>Team " + last_value + "</label>\
        <form-group><label class='col-sm-2 control-label' for='members-" + last_value + "'> Members </label>\
        <div class='col-sm-1'> <input class='form-control' type='number' name='members-" + last_value +"' id='members-" + last_value + "' value=1 min=1> </input> </div> </form-group>\
        <form-group> <label class='col-sm-2 control-label' for='device- " + last_value + "'> Select Device 1 </label> <div class='col-sm-9'> <dropdown style='display:inline-block' name='device-" + last_value + "'> \
        <button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown'> Device 1 </button> <ul class='dropdown-menu'> </ul> </dropdown> </div> </form-group> </team-group>");
      } else {
        last_value = last_value - 1;
        $('.teams-container').children().last().remove();
      }
    });
  } else if(document.title === 'Study Results') {

    // set up speaking chart 
    alert('setting up charts');

    var speakingCtx = $('speaking-time').getContext('2d');
    var speakingData = {
      label: 'Speaking Time (minutes)',
      data: [42, 67]
    };

    var barChart = new Chart(speakingCtx, {
      type: 'bar',
      data: {
        labels: ["Team 1", "Team 2"],
        datasets: [speakingData]
      }
    });


    // set up interactions chart
    var interactionsCtx = $('interactions').getContext('2d');
    var interactionsData = {
      labels: ["Team 1", "Team 2"],
      datasets: [{
        data: [22, 41],
      }],
      backgroundColor: '2980b9',
      borderColor: '2980b9',
      pointBorderColor: 'orange',
      pointBackgroundColor: 'rgba(255,150,0,0.5)',
      pointRadius: 5,
      pointHoverRadius: 10,
      pointHitRadius: 30,
      pointBorderWidth: 2,
      pointStyle: 'rectRounded'
    };
    var cOptions = {
      legend: {
        display: false,
        position: 'top',
        labels: {
          boxWidth: 80,
          fontColor: 'black'
        }
      }
    };

    var myChart = new Chart(interactionsCtx, {
      type: 'line',
      data: interactionsData,
      options: cOptions
    });
  }
});


function changeStatus(team, item) {
  // set selected item active/inactive
  var isActive = false;
  var team_group = document.getElementsByClassName('team')[team];
  
  var device = team_group.getElementsByClassName("device")[item];
  if (device.classList.contains('list-group-item-success')) {
    device.classList.remove('list-group-item-success');
    device.classList.add('list-group-item-secondary');
  } else {
    isActive = true;
    device.classList.add('list-group-item-success');
    device.classList.remove('list-group-item-secondary');
  }

  if (isActive) { // check if already active in other team
    var allTeams = document.getElementsByClassName("team");
    for (var i = 0; i < allTeams.length; i++){
      if (i != team) {
        var ot_device = allTeams[i].getElementsByClassName("device")[item];
        if (ot_device.classList.contains('list-group-item-success')) {
          ot_device.classList.remove('list-group-item-success');
          ot_device.classList.add('list-group-item-secondary');
        }
      }
    }

  } 
  
  // set active in device panel if necessary
  var indicators = document.getElementById("devicePanel").getElementsByClassName("deviceIndicator");
  
  if (isActive && indicators[item].classList.contains('list-group-item-warning')) {
    indicators[item].classList.remove('list-group-item-warning');
    indicators[item].classList.add('list-group-item-success');
  } else if (!isActive && indicators[item].classList.contains('list-group-item-success')) {
    indicators[item].classList.remove('list-group-item-success');
    indicators[item].classList.add('list-group-item-warning');
  }
  
}



// validates team data configuration before submission to review page
function validateTeamData(id, memberCount) {

  // set up data for devices per team
  var allTeams = document.getElementsByClassName("team");
  var device_data = [];
  var selectedCount = 0


  // set up device data
  for (var i = 0; i < allTeams.length; i++) {
    device_data.push([]);
    var devices = allTeams[i].getElementsByClassName("device")
    for (var j = 0; j < devices.length; j++) {
      if (devices[j].classList.contains('list-group-item-success')) {
        selectedCount += 1;
        //device_data[i].push(devices[j].textContent);
        device_data[i].push(j);
      }
    }

  }

  if (selectedCount > memberCount) {
    alert('Too many devices selected. Select one device per study participant (' + memberCount + ' particpants selected)');
  } else if (selectedCount < memberCount) {
    alert('Too few devices selected. Select one device per study participant (' + memberCount + ' participants selected)');
  } else {

    // set up url for successful attempt
    var newUrl = '/setup/review/' + id + '/';
    for (var i = 0; i < allTeams.length; i++) {
      var devices = allTeams[i].getElementsByClassName("device")
      newUrl += '[' + device_data[i] + ']';
      if (i != allTeams.length - 1) {
        newUrl += ','
      }
    }

    window.location.replace(newUrl);
  }


}


/*


                
                    label.col-sm-12(style={'margin-top':'20px'}) Team 1
                    .form-group
                        label.col-sm-2.control-label(for='members-1') Members
                        .col-sm-1
                            input.form-control(type='number', name='members-1', id='members-1', value=1, min=1)
                    .form-group
                        label.col-sm-2.control-label(for='device-1') Select Device 1



*/