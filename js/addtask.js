
var assignedTo;

$(document).ready(function(){
  toastr.options = {
    "closeButton": true,"debug": false,"newestOnTop": false,"progressBar": true,"positionClass": "toast-top-right","preventDuplicates": false,"onclick": null,"showDuration": "300","hideDuration": "1000","timeOut": "5000","extendedTimeOut": "1000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"
  }
  $('.taskForm').hide();
  db.collection("users").get()
  .then(function (querySnapshot) {
    $('.loader').fadeOut('slow');
      querySnapshot.forEach(function (doc) {
          if (doc.id != auth.currentUser.email) {
              $(`<div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${doc.id}">
              <div class="row m-auto">
                <img src="${doc.data().photoURL}" class="col-md-4 rounded" alt="">
                <div class="col-md-8 pl-0 m-auto">
                  <h6 class="text-light m-0 d-block">${doc.data().displayName}</h6>
                  <small class="text-info m-0">${doc.data().designation}</small>
                </div>
              </div>
          </div>`).appendTo('#force-overflow');
          }
          else{
              $('#userImage').attr("src", `${doc.data().photoURL}`);
              $('.userName').html(`${doc.data().displayName}`);
              $('.designation').html(`${doc.data().designation}`);
          }
          console.log(doc.id, " => ", doc.data());
      });
      $(".card").on("click", function () {
          $('.taskForm').fadeOut(function(){$(this).fadeIn(400);})
          $('.svg-div').remove();
          var cardName = $("[data='"+$(this).attr('data')+"'] h6").text();
          $("form h4").fadeOut(function(){$(this).text("Task for "+cardName).fadeIn(400);})
          assignedTo = ($(this).attr('data'));
          $('#taskName').fadeOut(function(){$(this).val('').fadeIn(400);});
          $('#startDate').fadeOut(function(){$(this).val('').fadeIn(400);});
          $('#endDate').fadeOut(function(){$(this).val('').fadeIn(400);});
          $('#taskDetails').fadeOut(function(){$(this).val('').fadeIn(400);});
          $('#inlineFormCustomSelect').fadeOut(function(){$(this).val('').fadeIn(400);});
      });
  })

  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".dfeed-bar .card").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});
})

document.getElementById('signout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
      toastr['info']('You are signed out! ', 'see you soon');
      });
      window.location.replace("./index.html");
  });



  $('#startDate').datePicker({

    // use cache
    useCache: false,
  
    // the selector for the input fields
    elements: [],
  
    // element the picker should be depended on
    body: document.body,
  
    // attribute used for internal date transfer
    pickerAttribute: 'data-picker',
  
    // class name of the datePicker wrapper
    datePickerClass: 'date-picker',
  
    // class name for date representing the value of input field
    selectedDayClass: 'selected-day',
  
    // class name for disabled events
    disabledClass: 'disabled',
  
    // called right after datePicker is instantiated
    initCallback: function(elements) {},
  
    // called every time the picker gets toggled or redrawn
    renderCallback: function(container, element, toggled) {
      var bounds = element.getBoundingClientRect();
  
      container.style.cssText = !this.isOpen ? 'display: none' :
        'left:' + (window.pageXOffset + bounds.left) + 'px;' +
        'top:' + (window.pageYOffset + element.offsetHeight + bounds.top) + 'px;';
    },
  
    // when date is picked, the value needs to be transferred to input
    renderValue: function(container, element, value) {
      element.value = value;
    },
  
    // when toggling the datePicker, this will pick up the value of the input field
    readValue: function(element) {
      return element.value;
    },
  
  
    // the HTML rendered before the display of the month. The following strings will be replaced:
    // {{disable-prev}}, {{prev}}, {{disable-next}}, {{next}}, {{day}}, {{month}}, {{months}}, {{year}}, {{years}}
    // look at the code (original option HTML) and it's clear what all those placeholders mean
    header:
      '<div class="dp-title">' +
        '<button class="dp-prev" type="button"{{disable-prev}}>{{prev}}</button>' +
        '<button class="dp-next" type="button"{{disable-next}}>{{next}}</button>' +
        '<div class="dp-label dp-label-month">{{month}}' +
          '<select class="dp-select dp-select-month" tabindex="-1">' +
            '{{months}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label dp-label-year">{{year}}' +
          '<select class="dp-select dp-select-year" tabindex="-1">' +
            '{{years}}' +
          '</select>' +
        '</div>' +
      '</div>',
  
    // label text for next month
    nextLabel: 'Next month',
  
    // label tetx for previous month
    prevLabel: 'Previous month',
  
    // min / max dates
    minDate: '1969-01-01',
    maxDate: '2050-12-31',
  
    // data attributes for min/max dates
    minDateAttribute: 'data-mindate',
    maxDateAttribute: 'data-maxdate',
  
    // classes for event listeners
    nextButtonClass: 'dp-next',
    prevButtonClass: 'dp-prev',
    selectYearClass: 'dp-select-year',
    selectMonthClass: 'dp-select-month',
  
    // the HTML rendered after the display of the month. The following strings will be replaced:
    // {{hour}}, {{hours}}, {{minute}}, {{minutes}}, {{second}}, {{seconds}}, {{am-pm}}, {{am-pms}}
    footer:
      '<div class="dp-footer">' +
        '<div class="dp-label">{{hour}}' +
          '<select class="dp-select dp-select-hour" tabindex="-1">' +
            '{{hours}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label">{{minute}}' +
          '<select class="dp-select dp-select-minute" tabindex="-1">' +
            '{{minutes}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label">{{second}}' +
          '<select class="dp-select dp-select-second" tabindex="-1">' +
            '{{seconds}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label">{{am-pm}}' +
          '<select class="dp-select dp-select-am-pm" tabindex="-1">' +
            '{{am-pms}}' +
          '</select>' +
        '</div>' +
      '</div>',
  
    // HH:MM:SS AM, HH:MM AM, HH:MM:SS or HH:MM 
    timeFormat: '',
  
    // data attribute for time format
    timeFormatAttribute:'data-timeformat',
  
    // switch for standard AM / PM rendering
    doAMPM: false,
  
    // steps of minutes displayed as options in
    minuteSteps: 5,
  
    // steps of seconds displayed as options in
    secondSteps: 10,
  
    // rendered strings in picker options and input fields
    AMPM: ['AM', 'PM'],
  
    // classes for event listeners
    selectHourClass: 'dp-select-hour',
    selectMinuteClass: 'dp-select-minute',
    selectSecondClass: 'dp-select-second',
    selectAMPMClass: 'dp-select-am-pm',
  
    // data attributes for rangeStart & rangeEnd
    rangeStartAttribute: 'data-from',
    rangeEndAttribute: 'data-to'
    
  });
  //endDate

  $('#endDate').datePicker({
  
    // use cache
    useCache: false,
  
    // the selector for the input fields
    elements: [],
  
    // element the picker should be depended on
    body: document.body,
  
    // attribute used for internal date transfer
    pickerAttribute: 'data-picker',
  
    // class name of the datePicker wrapper
    datePickerClass: 'date-picker',
  
    // class name for date representing the value of input field
    selectedDayClass: 'selected-day',
  
    // class name for disabled events
    disabledClass: 'disabled',
  
    // called right after datePicker is instantiated
    initCallback: function(elements) {},
  
    // called every time the picker gets toggled or redrawn
    renderCallback: function(container, element, toggled) {
      var bounds = element.getBoundingClientRect();
  
      container.style.cssText = !this.isOpen ? 'display: none' :
        'left:' + (window.pageXOffset + bounds.left) + 'px;' +
        'top:' + (window.pageYOffset + element.offsetHeight + bounds.top) + 'px;';
    },
  
    // when date is picked, the value needs to be transferred to input
    renderValue: function(container, element, value) {
      element.value = value;
    },
  
    // when toggling the datePicker, this will pick up the value of the input field
    readValue: function(element) {
      return element.value;
    },
  
  
    // the HTML rendered before the display of the month. The following strings will be replaced:
    // {{disable-prev}}, {{prev}}, {{disable-next}}, {{next}}, {{day}}, {{month}}, {{months}}, {{year}}, {{years}}
    // look at the code (original option HTML) and it's clear what all those placeholders mean
    header:
      '<div class="dp-title">' +
        '<button class="dp-prev" type="button"{{disable-prev}}>{{prev}}</button>' +
        '<button class="dp-next" type="button"{{disable-next}}>{{next}}</button>' +
        '<div class="dp-label dp-label-month">{{month}}' +
          '<select class="dp-select dp-select-month" tabindex="-1">' +
            '{{months}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label dp-label-year">{{year}}' +
          '<select class="dp-select dp-select-year" tabindex="-1">' +
            '{{years}}' +
          '</select>' +
        '</div>' +
      '</div>',
  
    // label text for next month
    nextLabel: 'Next month',
  
    // label tetx for previous month
    prevLabel: 'Previous month',
  
    // min / max dates
    minDate: '1969-01-01',
    maxDate: '2050-12-31',
  
    // data attributes for min/max dates
    minDateAttribute: 'data-mindate',
    maxDateAttribute: 'data-maxdate',
  
    // classes for event listeners
    nextButtonClass: 'dp-next',
    prevButtonClass: 'dp-prev',
    selectYearClass: 'dp-select-year',
    selectMonthClass: 'dp-select-month',
  
    // the HTML rendered after the display of the month. The following strings will be replaced:
    // {{hour}}, {{hours}}, {{minute}}, {{minutes}}, {{second}}, {{seconds}}, {{am-pm}}, {{am-pms}}
    footer:
      '<div class="dp-footer">' +
        '<div class="dp-label">{{hour}}' +
          '<select class="dp-select dp-select-hour" tabindex="-1">' +
            '{{hours}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label">{{minute}}' +
          '<select class="dp-select dp-select-minute" tabindex="-1">' +
            '{{minutes}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label">{{second}}' +
          '<select class="dp-select dp-select-second" tabindex="-1">' +
            '{{seconds}}' +
          '</select>' +
        '</div>' +
        '<div class="dp-label">{{am-pm}}' +
          '<select class="dp-select dp-select-am-pm" tabindex="-1">' +
            '{{am-pms}}' +
          '</select>' +
        '</div>' +
      '</div>',
  
    // HH:MM:SS AM, HH:MM AM, HH:MM:SS or HH:MM 
    timeFormat: '',
  
    // data attribute for time format
    timeFormatAttribute:'data-timeformat',
  
    // switch for standard AM / PM rendering
    doAMPM: false,
  
    // steps of minutes displayed as options in
    minuteSteps: 5,
  
    // steps of seconds displayed as options in
    secondSteps: 10,
  
    // rendered strings in picker options and input fields
    AMPM: ['AM', 'PM'],
  
    // classes for event listeners
    selectHourClass: 'dp-select-hour',
    selectMinuteClass: 'dp-select-minute',
    selectSecondClass: 'dp-select-second',
    selectAMPMClass: 'dp-select-am-pm',
  
    // data attributes for rangeStart & rangeEnd
    rangeStartAttribute: 'data-from',
    rangeEndAttribute: 'data-to'
    
  });

  Chart.defaults.global.legend.labels.usePointStyle = true; 
  let ctx = document.getElementById('myChart').getContext('2d');
  let labels = ['completed','incompleted','deadline cross'];
  let colorHex = ['#253D5B','#EFCA08','#FB3640'];
  let total = parseInt($('#completedTask').text())+parseInt($('#incompletedTask').text())+parseInt($('#deadlineCrossed').text())
  let completedTask = Math.round(parseInt($('#completedTask').text()) / total * 100);
  if(completedTask>50) {
    $('#status').text('good')
  }
  else if(completedTask<30) {
    $('#status').text('bad')
  }
  else{
    $('#status').text('average')
  }

  let myChart = new Chart(ctx,{

    type: 'doughnut',
    data:{
      datasets:[
        {
          data:[$('#completedTask').text(),$('#incompletedTask').text(),$('#deadlineCrossed').text()],
          backgroundColor:colorHex,
          borderColor: '#393c45'
        }
      ],
      labels:labels,
      
    },
    options:{
      responsive: false,
      circular: true,
      legend:{
        display: true,
        position: 'bottom',
        usePointStyle: true,
        pointStyle: 'd'
      },
       plugins:{
       datalabels:{
         color : 'white',
         anchor:'end',
         align:'start',
         offset:-10,
         borderWidth:2,
         borderColor:'#2e3035',
         borderRadius:25,
         backgroundColor:(context)=>{
           return 'darkslategrey';
         },
         font:{
           weight:'bold',
           size:'13'
         },
         formatter:(value)=>{
           return Math.round(value / total * 100) + ' %';
         }
       }
     }
    }

  })

  $("#customFile").change(function() {
    if ($("#customFile")[0].files.length > 3) {
      $("#customFile")[0].value = null;
      $('#fileLabel').text("You can select only 2 images");
    }
    else {
      if(this.files[0].name != undefined){
        for (var i = 0; i < this.files.length; i++)
        {
          if(i == 0){
            $('#fileLabel').text(this.files[i].name);
          }
          else{
            if(i < this.files.length){
              $('#fileLabel').text($('#fileLabel').text()+", "+this.files[i].name);
            }
          }
        }
        
      }
    }
  });

  $('#taskForm').on('submit',function(e){
    e.preventDefault();
    let taskName = $('#taskName').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let taskDetails = $('#taskDetails').val();
    let taskPriority = $('#inlineFormCustomSelect').val();
    let timestamp = new Date().getTime();

    if( $("#customFile")[0].files.length == 0 ){
          // Add a new document in collection "tasks"
          db.collection("tasks").doc(assignedTo).set({
            [timestamp]: {
            assignedBy: auth.currentUser.email,
            description: taskDetails,
            end: endDate,
            start: startDate,
            name: taskName,
            doc: 'null',
            priority: taskPriority}
          })
          .then(function() {
            toastr["success"]("success", "Task successfully assigned!")
            console.log("");
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
    }
    else{
        for (var i = 0; i < $("#customFile")[0].files.length; i++)
        {
          let file = $("#customFile")[0].files[i];
          let storageRef = storage.ref("Tasks/"+timestamp+"/"+file.name);
          let uploadProgress = storageRef.put(file);
          uploadProgress.on('state_changed', function progress(snapshot){
            console.log(snapshot.state)
            switch(snapshot.state){
                case firebase.storage.TaskState.PAUSED:
                  toastr['warning']('Your file uploading is paused', 'uploading paused, retrying');
                  uploadProgress.resume();
                  break;

                case firebase.storage.TaskState.RUNNING:
                  toastr['info']('Your file is uploading', 'upload running');
                  break;

                case firebase.storage.TaskState.SUCCESS:
                  toastr['success']('Your file uploaded successfully', 'uploading success');
                  break;

                case firebase.storage.TaskState.ERROR:
                  toastr['error']('Error uploading files', 'uploading paused');
                  break;
              }
            })
        }

          // Add a new document in collection "tasks"
          // db.collection("tasks").doc(assignedTo).set({
          //   assignedBy: auth.currentUser.email,
          //   description: taskDetails,
          //   end: endDate,
          //   start: startDate,
          //   name: taskName,
          //   doc: 'null',
          //   priority: taskPriority
          // })
          // .then(function() {
          //   console.log("Document successfully written!");
          // })
          // .catch(function(error) {
          //   console.error("Error writing document: ", error);
          // });
    }

 });