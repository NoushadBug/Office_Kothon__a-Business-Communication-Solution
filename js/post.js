var totalEvent;
var totalMeeting;
var totalNotice;
var totalLow;
var totalHard;
var totalModerate;
var docResponse = [];
var docIds = [];

function renderFiles(fileString){
  var returnedElement,
    res = fileString.split("`");
    for (let index = 1; index < res.length; index++) {
      if(index%2 != 0){
        if(index == 1){returnedElement = `<br><small class="text-center mx-2">${res[index]}</small><a style="font-size:0.75em !important;" class="text-light m-0 font-italic" href="${res[index+1]}" target="_blank" ><i class="fa fa-external-link mr-1 text-info" style="font-size: 115%;"></i></a>`;}
      else{returnedElement = returnedElement + `<small class="text-center mx-2">${res[index]}</small><a style="font-size:0.75em !important;" class="text-light m-0 font-italic" href="${res[index+1]}" target="_blank" ><i class="fa fa-external-link mr-1 text-info" style="font-size: 115%;"></i></a>`;}
      }
    }
    return returnedElement;
}

function deleteFolderFiles(path){
  const ref = storage.ref('Notice/'+path);
  ref.listAll().then(dir => {
      dir.items.forEach(fileRef => {
        deleteFile(ref.fullPath, fileRef.name);
      });
      dir.prefixes.forEach(folderRef => {
        deleteFolderFiles(folderRef.fullPath);
      })
    })
    .catch(error => {
      //console.log('c: '+error);
    });
}

function deleteFile(pathToFile, fileName) {
  const ref = firebase.storage().ref(pathToFile);
  const childRef = ref.child(fileName);
  childRef.delete();
}

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
  console.log(docs[0].data().date)
    docResponse = [];
    docIds = [];
    totalEvent = 0;
    totalMeeting = 0;
    totalNotice = 0;
    totalLow = 0;
    totalHard = 0;
    totalModerate = 0;

    $('#accordion').empty();
      docs.forEach(function(doc, index)
      {
        var fileElement = doc.data().file == 'null'? `<a href="#0" class="btn btn-primary disabled btn-sm viewFile" role="button" aria-pressed="true" id="${index}">View File</a>` : `<a href="#0" class="btn btn-primary btn-sm viewFile" role="button" aria-pressed="true" id="${index}">View File</a>`;
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
        docIds.push(doc.id);
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
              <a id="${index}" class="deleteNotice"><i class="fa fa-trash text-secondary mr-0"></i></a>
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
            <div class="view-button col-4">${fileElement}
            </div>
          </div>
          <div class="panel-body row mx-3 pb-3">
          ${doc.data().description}
          </div>
        </div>
      </div>
      `).appendTo('#accordion');

      });

      $('.viewFile').on( "click",function(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = $(this).attr('id');
        let str = docs[id].data().file;
        if($('#fileModal'+id).length == 0){
          $(`<!-- Modal -->
          <div class="modal fade" id="fileModal${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
            <div class="modal-dialog modal-dialog-centered " role="document">
                <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                    <div class="modal-header shadow-lg" style="border: 0;">
                        <h6 class="modal-title" id="exampleModalLongTitle">View Files</h6>
                        <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body shadow-lg ">
                        <p class="text-center text-light m-auto">${renderFiles(str)}</p>
                    </div>
                    <div class="modal-footer shadow-lg" style="border: 0;">
                        <button type="button" data-dismiss="modal" class="mx-auto btn px-5 btn-secondary rounded-pill shadow-lg">close</button>
                    </div>
                </div>
              </div>
              </div>
        </div>`).appendTo('body');
        }
        let $modal = $('#fileModal'+id);
        $modal.modal('show');
      })

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
        let ref = $(this).attr('id');
        let $modal = $('#myModal'), id = docs[parseInt($(this).attr('id'))].id;
        $modal.modal('show');

        $('#deleteBtn').on( "click",function() {
          db.collection("notice").doc(id).delete().then(function() {
            $modal.modal('hide');
            toastr['success']('Notice deleted successfully');
            deleteFolderFiles(docs[ref].data().date);
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
                        <h6 class="modal-title" id="exampleModalLongTitle">Edit Notice</h6>
                        <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body shadow-lg my-auto">
                    <div class="row scrollbar bg-transparent" >
                    <div class="col-md-6 my-auto">
                        <div class="form-group">
                        <small class="text-info mb-0 container">Name</small>
                        <input type="text" id="postName" class="form-control text-light bg-dark rounded-pill border border-info" style="font-size: 0.9em;" value="${docResponse[id].title}" required/>
                        </div>
                        <div class="form-group">
                        <small class="text-info mb-0 container">Description</small>
                        <textarea  rows="4"  class="form-control text-light bg-dark border border-info scrollbar"  style="font-size: 0.9em; border-radius:1em; resize: none;">${docResponse[id].description}</textarea>
                        </div>
                        <div class="container" id="docLinksList">
                    </div>
                    </div>
                    <div class="col-md-6 my-auto" id='noticeSelect${id}'>
                    <div class="form-group">
                        <small class="text-info mb-0 container">Priority</small>
                        <select class="custom-select mr-sm-2 bg-dark shadow-lg text-light  border-info rounded-pill" id="editPriority${id}" required="">
                                <option disabled="" class="choose" value="editPriority" required>Select Priority
                                </option>
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Hard">Hard</option>
                        </select>
                        </div>
                        <div class="form-group">
                        <small class="text-info mb-0 container">Notice Type</small>
                        <select class="custom-select mr-sm-2 bg-dark shadow-lg text-light  border-info rounded-pill" id="noticeType${id}" required="">
                                <option class="choose " value="type" disabled="" required>Select Type</option>
                                <option value="Meeting">Meeting</option>
                                <option value="Notice">Notice</option>
                                <option value="Event">Event</option>
                        </select>
                        </div>
                        
                </div>
              </div>
              <div class="modal-footer shadow-lg mx-auto rounded-pill" style="border: 0;">
                <button type="button" id="${id}" data="${id}" class="updateBtn ml-auto btn px-5 btn-info rounded-pill shadow-lg" >update</button>
                <button type="button" id="cancel"  data-dismiss="modal" class=" mr-auto btn px-5 btn-secondary rounded-pill shadow-lg" >cancel</button>
            </div>
              </div>
         </div>`).appendTo('body');
         }

         $('#editPriority'+id).val(docResponse[id].priority)
         $('#noticeType'+id).val(docResponse[id].postType)

         if($('#editDate'+id).length == 0 || $('#EventLink'+id).length == 0){
          if(docResponse[id].postType == 'Event'){
            $(`<div class="form-group">
            <small class="text-info mb-0 container">Event Link</small>
            <input type="text" id="EventLink${id}" class="form-control text-light bg-dark rounded-pill border border-info" style="font-size: 0.9em;" value="${docResponse[id].EventLink}" required />
            </div>
            <div class="form-group">
            <small class="text-info mb-0 container">Event Date</small>
            <input id="editDate${id}" name="editDate" type="date" class="datePicker form-control bg-dark shadow-lg text-light mb-2 border border-info" placeholder="select event date" value="${docResponse[id].EventDate}" required />
            </div>`).appendTo('#noticeSelect'+id);
          }
         }

         let $modal = $('#myModal'+id);
         $modal.modal('show');


         $('.updateBtn').on( "click",function() {
          let eventDate = $('#myModal'+id+" #editDate"+id).val();
          let eventLink = $('#myModal'+id+" #EventLink"+id).val();
          let noticeType = $('#myModal'+id+" #noticeType"+id).val();
          let editPriority = $('#myModal'+id+" #editPriority"+id).val();
          let desc = $('#myModal'+id+" textarea").val();
          let title = $('#myModal'+id+" #postName").val();
          $('#myModal'+id).modal('hide');
          if(docResponse[id].postType == 'Event'){
            $('.uploader').fadeIn();
            db.collection("notice").doc(docIds[id]).set({
                  title: title,
                  description: desc,
                  postType: noticeType,
                  priority: editPriority,
                  EventDate: eventDate,
                  EventLink: eventLink,
                },{merge: true}) .then(function() {
                  cleanValues()
                  $('.uploader').fadeOut();
                  toastr['success']('Post updated sucessfully');
                }).catch(function(error) {
                  $('.uploader').fadeOut();
                  cleanValues()
                  toastr['error']('Fail to create post', error.code);
                });
          }
          else{
            $('.uploader').fadeIn();
            db.collection("notice").doc(docIds[id]).set({
              title: title,
              description: desc,
              postType: noticeType,
              priority: editPriority,
            },{merge: true}) .then(function() {
              cleanValues()
              $('.uploader').fadeOut();
              toastr['success']('Post updated sucessfully');
            }).catch(function(error) {
              $('.uploader').fadeOut();
              cleanValues()
              toastr['error']('Fail to create post', error.code);
            });
          }
       })

      });

      updateCharts();
}

$(".fileUpload").change(function() {
  if ($(".fileUpload")[0].files.length > 5) {
    $(".fileUpload")[0].value = null;
    toastr['error']("You can select maximum 5 files");
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

function datePckr(){
  
$('.datePicker').datePicker({

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
  $('[data-toggle="popover"]').popover();
  datePckr();
  $(".picker").hide(); 
  $('.uploader').fadeOut();
  $('#taskformbar').on('submit',function(e){
    e.preventDefault();
    let validated = 0;
    let tasktitle = $('#taskName').val();
    let taskdetails = $('#taskDetails').val();
    let posttype = $('#add_fields_placeholder').val();
    let selectedPriority = $('#selectedPriority').val();
    let EventDate = $('#startDate').val();
    let EventLink =     $('#eventLink').val();
    let myDate = new Date().getTime();
    // let FileUpload = $('.fileUpload').val();

    if(posttype == undefined){
      toastr["error"]("Post type is not selected", "Select a Post Type")
    }else{
      validated++;
    }
    if(selectedPriority ==  undefined){
      toastr["error"]("Post Priority is not selected", "Select a Post Priority")
    }else{
      validated++;
    }
    if(validated == 2){
      var docRef = db.collection("notice").doc();
      if(posttype == 'Event'){
        if( $(".fileUpload")[0].files.length == 0 ){
          $('.uploader').fadeIn();
          docRef.set({
            title: tasktitle,
            description: taskdetails,
            postType: posttype,
            priority: selectedPriority,
            file: 'null',
            EventDate: EventDate,
            EventLink: EventLink,
            date : myDate
          }) .then(function() {
            cleanValues()
            $('.uploader').fadeOut();
            toastr['success']('Post created sucessfully');
          }).catch(function(error) {
            $('.uploader').fadeOut();
            cleanValues()
            toastr['error']('Fail to create post', error.code);
          });
        }
        else{
          var count = 0;
          var docLinks;
  
          for (var i = 0; i < $(".fileUpload")[0].files.length; i++)
          {
            let file = $(".fileUpload")[0].files[i];
            let storageRef = storage.ref("Notice/"+myDate+"/"+file.name);
            let uploadProgress = storageRef.put(file);
  
            uploadProgress.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if(progress == 0){
                      $('.uploader').fadeIn('slow');
                    }
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                      case firebase.storage.TaskState.PAUSED: // or 'paused'
                            toastr['warning']('Your file uploading is paused', 'uploading paused, retrying');
                            uploadProgress.resume();  
                            break;
                      case firebase.storage.TaskState.RUNNING: // or 'running'
                            //toastr['info']('Your file is uploading', 'upload running');
                            break;
                    }
                  }, function(error) {
                      toastr['error']('Error uploading files', error.code);
                }, function() {
                  uploadProgress.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    docLinks == undefined? docLinks = "`"+file.name+"`"+downloadURL : docLinks += "`"+file.name+"`"+downloadURL;
                    count++;
                      if(count == $(".fileUpload")[0].files.length){
                        docRef.set({
                            title: tasktitle,
                            description: taskdetails,
                            postType: posttype,
                            priority: selectedPriority,
                            file: docLinks,
                            EventDate: EventDate,
                            EventLink: EventLink,
                            date : myDate
                          })
                          .then(function() {
                            $('.uploader').fadeOut('slow');
                            toastr['success']('Document successfully written!', 'Task successfully assigned to '+assignedTO);
                          })
                          .catch(function(error) {
                            console.error("Error writing document: ", error);
                          });
                      }
                  });
                });
          }
        }
  
      }
      else{
        $('#startDate').val('');
        if( $(".fileUpload")[0].files.length > 0 ){ 
          var counter = 0;
          var docLink;
  
          for (var j = 0; j < $(".fileUpload")[0].files.length; j++)
          {
            let file = $(".fileUpload")[0].files[j];
            let storageRef = storage.ref("Notice/"+myDate+"/"+file.name);
            let uploadProgress = storageRef.put(file);
  
            uploadProgress.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if(progress == 0){
                      $('.uploader').fadeIn('slow');
                    }
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                      case firebase.storage.TaskState.PAUSED: // or 'paused'
                            toastr['warning']('Your file uploading is paused', 'uploading paused, retrying');
                            uploadProgress.resume();  
                            break;
                      case firebase.storage.TaskState.RUNNING: // or 'running'
                            //toastr['info']('Your file is uploading', 'upload running');
                            break;
                    }
                  }, function(error) {
                      toastr['error']('Error uploading files', error.code);
                }, function() {
                  uploadProgress.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    docLink == undefined? docLink = "`"+file.name+"`"+downloadURL : docLink += "`"+file.name+"`"+downloadURL;
                    counter++;
                      if(counter == $(".fileUpload")[0].files.length){
                        docRef.set({
                            file: docLink,
                            title: tasktitle,
                            description: taskdetails,
                            postType: posttype,
                            priority: selectedPriority,
                            date : myDate
                          })
                          .then(function() {
                            $('.uploader').fadeOut('slow');
                            toastr['success']('Document successfully written!', 'Task successfully assigned to '+assignedTO);
                          })
                          .catch(function(error) {
                            console.error("Error writing document: ", error);
                          });
                      }
                  });
                });
          }
        }
        else{
          $('.uploader').fadeIn();
          docRef.set({
            title: tasktitle,
            description: taskdetails,
            postType: posttype,
            priority: selectedPriority,
            file: 'null',
            date : myDate
          }) .then(function() {
            $('.uploader').fadeOut();
            cleanValues()
            toastr['success']('Post created sucessfully');
          }).catch(function(error) {
            $('.uploader').fadeOut();
            cleanValues()
            toastr['error']('Fail to create post', error.code);
          });
        }
        
      }
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