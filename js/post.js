var totalEvent;
var totalMeeting;
var totalNotice;
var totalLow;
var totalHard;
var totalModerate;
var docResponse = [];

function updateCharts(){
  // chart js implementation
var ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
   // The type of chart we want to create
   type: 'horizontalBar',

   // The data for our dataset
   data: {
       labels: ['Event', 'Meeting', 'Notice' ],
       datasets: [{
          
           backgroundColor: ['#68a5dc','#bf2d44','#d4ab5b'],
          
           data: [totalEvent, totalMeeting, totalNotice],
         
       }]
   },


   // Configuration options go here
   options: {
     animation: 
     {
      duration : 2000,
        
     },
  
     title: {
       display: true,
       text: 'Notice Types',
       fontColor: "cyan",
       fontSize: 19,
       
   },
     
     legend: {
       display : false,
        
     },
     scales: {
       yAxes: [{
           ticks: {
               fontColor: "white",
               fontSize: 10,
               
               beginAtZero: true
           }
       }],
       xAxes: [{
           ticks: {
               fontColor: "white",
               fontSize: 11,
               
               beginAtZero: true
           }
       }]
   }
   

 }
  
});
// chart js implementation
var ctx1 = document.getElementById('myChart1').getContext('2d');
new Chart(ctx1, {
   // The type of chart we want to create
   type: 'horizontalBar',

   // The data for our dataset
   data: {
       labels: ['Hard', 'Moderate', 'Low', ],
       datasets: [{
           
           backgroundColor: ['#6252E9','#F74301','#d1da1e'],
           data: [totalHard, totalModerate, totalLow],
       }]
   },

   options: {
     
     animation: 
     {
      duration : 2000,
        
     },
     title: {
       display: true,
       text: 'Notice Priorities',
       
       fontColor: "cyan",
       fontSize: 19,
   },
     
     legend: {
       display : false,
        
     },
     scales: {
       yAxes: [{
           ticks: {
             reverse: true,
               
               fontColor: "white",
               fontSize: 10,
             
               beginAtZero: true
           }
       }],
       xAxes: [{
           ticks: {
             reverse: true,
               
               fontColor: "white",
               fontSize: 11,
              
               beginAtZero: true
           }
       }]
   }

 }
});
}

function renderPriorities(priority){
  var returnedCode;
  switch(priority){
    case 'low':
      totalLow++;
      returnedCode =  `<i class="fa fa-bolt text-info"></i>`;
    break;
    case 'moderate':
      totalModerate++;
      returnedCode = `<i class="fa fa-bolt text-danger"></i>`;
    break;
    case 'hard':
      totalHard++;
      returnedCode =  `<i class="fa fa-bolt text-warning"></i>`;
    break;
    default:
      returnedCode =   `<i class="fa fa-bolt text-light"></i>`;
    break;
  }
return returnedCode;
}

function renderList(docs)
{
    docResponse = [];
    totalEvent = 0;
    totalMeeting = 0;
    totalNotice = 0;
    totalLow = 0;
    totalHard = 0;
    totalModerate = 0;
    $('#accordion').empty();
      docs.forEach(function(doc, index)
      {
        switch(doc.data().postType.toLowerCase()){
          case 'meeting':
            totalMeeting++;
          break;
          case 'notice':
            totalNotice++;
          break;
          case 'event':
            totalEvent++;
          break;
        }
        docResponse.push(doc.data());
        $(` <div class="panel panel-default feeditem shadow-lg bg-dark text-light mb-2 rounded shadow-lg" style="">
        <div class="panel-heading p-3 row p-3 collapsed" href="#panel${doc.id}" data-toggle="collapse"
          data-parent="#accordion" aria-expanded="false">
          <div class="title-header col-6">
            <h6 class="panel-title d-inline" aria-label="view" data-microtip-position="right" role="tooltip">
            ${doc.data().title}
            </h6>
          </div>
          <div class="header-side col-6 m-auto">
            <div class=" shadow-lg border  border-info d-inline  px-3 py-1" style="border-radius: 2em;">
              <span aria-label="${doc.data().priority}"
                  data-microtip-position="left" role="tooltip">${renderPriorities(doc.data().priority.toLowerCase())}</span>
              <a data-id="${index}" class="editNotice"><i class="fa fa-pencil text-secondary "></i></a>
              <a id="${doc.id}" class="deleteNotice"><i class="fa fa-trash text-secondary mr-0"></i></a>
            </div>
          </div>
        </div>
        <div id="panel${doc.id}" class="panel-collapse collapse in">
          <div class="collapse-header row mt-3 mx-auto">
            <div class="col-4">
              <p> ${new Date(parseInt(doc.data().date)).toLocaleString()}</p>
            </div>
            <div class="status col-4">
              <i class="fa fa-circle"></i>
              <p class="d-inline"> ${doc.data().postType}</p>
            </div>
            <div class="view-button col-4">
              <a href="#" class="btn btn-primary btn-sm disabled" role="button" aria-pressed="true">View File</a>
            </div>
          </div>
          <div class="panel-body row mx-3 pb-3">
          ${doc.data().description}
          </div>
        </div>
      </div>
      `).appendTo('#accordion');

      });

      $('.deleteNotice').on( "click",function(e) {
        e.preventDefault();
        e.stopPropagation();
        if($('#myModal').length == 0){
          $(`<!-- Modal -->
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
            <div class="modal-dialog modal-dialog-centered " role="document">
                <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                    <div class="modal-header shadow-lg" style="border: 0;">
                        <h6 class="modal-title" id="exampleModalLongTitle">Confirm Deletion</h6>
                        <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body shadow-lg ">
                        <p class="text-center text-light m-auto">are you sure you want to delete?</p>
                    </div>
                    <div class="modal-footer shadow-lg" style="border: 0;">
                        <button type="button" id="deleteBtn" class="deleteBtn ml-auto btn px-5 btn-info rounded-pill shadow-lg" >yes</button>
                        <button type="button" data-dismiss="modal" class="mr-auto btn px-5 btn-secondary rounded-pill shadow-lg">no</button>
                    </div>
                </div>
              </div>
              </div>
        </div>`).appendTo('body');
        }
        console.log($(this).attr('id'));
        let $modal = $('#myModal'), id = $(this).attr('id');
        $modal.modal('show');

        $('#deleteBtn').on( "click",function() {
          db.collection("notice").doc(id).delete().then(function() {
            $modal.modal('hide');
            toastr['success']('Notice deleted successfully');
          }).catch((error) => {
            $modal.modal('hide');
            toastr['error'](error, "Notice deletion interrupted");
          });
        })
      });

      $('.editNotice').on( "click",function(e) {
        e.preventDefault();
        e.stopPropagation();
        var id = $(this).attr("data-id");
        console.log(docResponse[id])
        if($('#myModal'+id).length == 0){
          $(`<!-- Modal -->
          <div class="modal fade" id="myModal${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
            <div class="modal-dialog modal-dialog-centered " role="document">
                <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                    <div class="modal-header shadow-lg" style="border: 0;">
                        <h6 class="modal-title" id="exampleModalLongTitle">Confirm Deletion</h6>
                        <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body shadow-lg ">
                    <div class="row">
                    <div class="col-md-6 my-auto">
                        <div class="form-group">
                        <small class="text-info mb-0 container">Name</small>
                        <input type="text" id="postName" class="form-control text-light bg-dark rounded-pill border border-info" style="font-size: 0.9em;" value="${docResponse[id].title}"/>
                        </div>
                        <div class="form-group">
                        <small class="text-info mb-0 container">Description</small>
                        <textarea class="form-control text-light bg-dark border border-info scrollbar"  style="font-size: 0.9em; border-radius:1em;">${docResponse[id].description}</textarea>
                        </div>
                        <div class="container">
                        <small class="text-info mb-0 container">Priority</small>
                        
                        </div>
                        <div class="container" id="docLinksList">
                        <small class="text-info mb-0">attached files</small>
                       
                    </div>
                    </div>
                    <div class="modal-footer shadow-lg mx-auto rounded-pill" style="border: 0;">
                        <button type="button" id="updateBtn" class="updateBtn ml-auto btn px-5 btn-info rounded-pill shadow-lg" >update</button>
                        <button type="button" id="cancel"  data-dismiss="modal" class=" ml-auto btn px-5 btn-secondary rounded-pill shadow-lg" >cancel</button>
                    </div>
                </div>
              </div>
              </div>
         </div>`).appendTo('body');
         }

         let $modal = $('#myModal'+id);
         $modal.modal('show');

        // $('#deleteBtn').on( "click",function() {
        //   db.collection("notice").doc(id).delete().then(function() {
        //     $modal.modal('hide');
        //     toastr['success']('Notice deleted successfully');
        //   }).catch((error) => {
        //     $modal.modal('hide');
        //     toastr['error'](error, "Notice deletion interrupted");
        //   });
        // })
      });

      updateCharts();
}

document.getElementById('signout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
      localStorage.clear();
      toastr['info']('You are signed out! ', 'see you soon');
      });
      window.location.replace("./index.html");
  });

  function cleanValues(){
    $('#taskName').val('');
    $('#taskDetails').val('');
    $('#add_fields_placeholder').val('');
    $('#selectedPriority').val('selectedPriority');
    $('#startDate').val('');
    $('#eventLink').val('');
  }

$(document).ready(function () {
  $(".picker").hide(); 
  $('#taskformbar').on('submit',function(e){
    e.preventDefault();
    let tasktitle = $('#taskName').val();
    let taskdetails = $('#taskDetails').val();
    let posttype = $('#add_fields_placeholder').val();
    let selectedPriority = $('#selectedPriority').val();
    let EventDate = $('#startDate').val();
    let EventLink =     $('#eventLink').val();
    // let FileUpload = $('.fileUpload').val();
    var docRef = db.collection("notice").doc();
    if(posttype == 'Event'){
      docRef.set({
        title: tasktitle,
        description: taskdetails,
        postType: posttype,
        priority: selectedPriority,
        file: 'null',
        EventDate: EventDate,
        EventLink: EventLink,
        date : new Date().getTime()
      }) .then(function() {
        cleanValues()
        toastr['success']('Post created sucessfully');
      }).catch(function(error) {
        cleanValues()
        toastr['error']('Fail to create post', error.code);
      });
    }
    else{
      $('#startDate').val('');
      docRef.set({
        title: tasktitle,
        description: taskdetails,
        postType: posttype,
        priority: selectedPriority,
        file: 'null',
        date : new Date().getTime()
      }) .then(function() {
        cleanValues()
        toastr['success']('Post created sucessfully');
      }).catch(function(error) {
        cleanValues()
        toastr['error']('Fail to create post', error.code);
      });
    }

  })

$("#add_fields_placeholder").change(function() {
     if($(this).val() == "Event") {
         $(".picker").show();
     }
     else {
         $(".picker").hide();
     }
 });


$("#myInput").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $(".panel-group .panel").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});


$(".c-link").click(function(){
  $('#taskName').val("");
  $('#taskDetails').val("");
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

db.collection("users").get()
.then(function (querySnapshot) {
  querySnapshot.forEach(function (doc) {
    if (doc.id == auth.currentUser.email) {
      if(doc.data().designation == 'unknown'){
        window.location.replace('./userNotVerified.html');
      }else{
      $('#userImage').attr("src", `${doc.data().photoURL}`);}
    }
  
});
$('.loader').fadeOut('slow');

})

db.collection("notice").onSnapshot(function(snapshot) {
  console.log(snapshot)
  renderList(snapshot.docs);
},
error => {
    if(error.code == 'resource-exhausted'){
        window.location.replace("../quotaExceeded.html");
    }
});

})