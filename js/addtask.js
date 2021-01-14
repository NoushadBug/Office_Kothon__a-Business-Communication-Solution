var docLinks;
var assignedTO;
var firstEntered = false;
var taskSnapshot = null;
var offlineDB= {};
var currentMonthInfo;
var prevMonthInfo;
var incompletedTaskLists = [];
var completedTaskLists = [];
var deadlineCrossedTaskLists = [];
var unapprovedTaskLists = [];
var myUnapproved= {};
var myClicked= {};
var myDeadlineCrossed= {};
var myCompleted= {};
var myIncompleted= {};
var copyDeadlineCrossed= {};
var copyCompleted= {};
var copyIncompleted= {};
var myAssigned= {};

var svgClone = $(".svg-div").clone(); // making zeh' clones!
var taskListDiv = $(".taskListDiv").clone();
var taskForm = $('#taskformbar').clone();


var updateChart = function(completed,incompleted,deadlineCrossed){
  $('#completedTask').text(completed);
  $('#incompletedTask').text(incompleted);
  $('#deadlineCrossed').text(deadlineCrossed);
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
  new Chart(ctx,{

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
      responsive: true,
      maintainAspectRatio: true,
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
}

function getNotified(snapshot){
  snapshot.docChanges().forEach(function(change) {
    var docSplitter = change.doc.id.split(",");
    var assignedBy;
      // collect incompleted and assigned tasks
      if(change.type == 'added'){
        if(change.doc.id.indexOf(':') !== -1){
          assignedBy = docSplitter[0].split(":")[0];
          var assignedTo = docSplitter[0].split(":")[1];
          if(assignedTo == auth.currentUser.email){
            toastr['info']($("[data='"+assignedBy+"'] h6").text()+' have assigned you a task','New task arrived');
          }
          if(assignedBy == auth.currentUser.email){
            toastr['success']('you have assigned '+$("[data='"+assignedTo+"'] h6").text()+' a task','Task assignment succeed');
          }
        }
        // collect completed tasks
        if(change.doc.id.indexOf('>') !== -1){
          assignedTo = docSplitter[0].split(">")[1];
          assignedBy = docSplitter[0].split(">")[0];
          if(assignedTo == auth.currentUser.email){
            toastr['success']($("[data='"+assignedBy+"'] h6").text()+' have approved your task','Your task is approved');
          }
        }
        // collect deadline crossed tasks
        if(change.doc.id.indexOf('<') !== -1){
          assignedTo = docSplitter[0].split("<")[1];
          assignedBy = docSplitter[0].split("<")[0];
          if(assignedTo == auth.currentUser.email){
            toastr['error']($("[data='"+assignedBy+"'] h6").text()+"'s given task crossed the deadline','Your task deadline expired");
          }
        }
        // collect tasks that you have unapproved
        if(change.doc.id.indexOf('|') !== -1){
          assignedBy = docSplitter[0].split("|")[0];
          assignedTo = docSplitter[0].split("|")[1];
          if(assignedBy == auth.currentUser.email){
            toastr['info']($("[data='"+assignedTo+"'] h6").text()+" has requested a task to approve","New assigned task is waiting for approval");
          }
          if(assignedTo == auth.currentUser.email){
            toastr['info']('please wait for '+$("[data='"+assignedBy+"'] h6").text()+"'s approval","Your task is in review");
          }
        }
      }

  });
}

function copyToTemp(selectedID){
  for (let i = 0; i < taskSnapshot.docs.length; i++) {
    if(selectedID == taskSnapshot.docs[i].id){
      return taskSnapshot.docs[i].data();
    }
  }
}

function showTaskFiles(fileData){
  if(fileData == 'null'){
    return `<p style="font-size: 0.8em;" class="text-light font-italic">no file is attached</p>`;
  }
  else{
    var returnedElement,
    res = fileData.split("`");
    for (let index = 1; index < res.length; index++) {
      if(index%2 != 0){
        if(index == 1){returnedElement = `<br><i class="fa fa-circle mr-1 text-secondary" style="font-size: 0.75em !important;"></i><a style="font-size:0.75em !important;" class="text-light m-0 font-italic" href="${res[index+1]}" target="_blank" ><u>${res[index]}</u></a>`;}
      else{returnedElement = returnedElement + `<br><i class="fa fa-circle mr-1 text-secondary" style="font-size: 0.75em !important;"></i><a style="font-size:0.75em !important;" class="text-light m-0 font-italic" href="${res[index+1]}" target="_blank"><u>${res[index]}</u></a>`;}
      }
         //console.log(index + " => "+ returnedElement)
    }
    return returnedElement;
  }
}

// while the new month arrives delete the previous infos from db
var resetOldTasks = function() {
  var todaysDate = new Date();
  if(todaysDate > new Date(currentMonthInfo.month.month, currentMonthInfo.month.year)){
    var tempInfo = currentMonthInfo;

    db.collection("tasks").doc('crnt_month').set({
      month: {year:todaysDate.getFullYear(), month: todaysDate.getMonth()}, totalCompleted: 0, totalDeadlineCrossed: 0, totalIncompleted: 0, totalTasks: 0,
    }, { merge: true })
    .then(function() {
      db.collection("tasks").doc('prev_month').set({
        month: tempInfo.month, totalCompleted: tempInfo.totalCompleted, totalDeadlineCrossed: tempInfo.totalDeadlineCrossed, totalIncompleted: tempInfo.totalIncompleted, totalTasks: tempInfo.totalTasks,
      }, { merge: true }).then(function() {
          // TODO:delete =>  1.  old deadline crossed
        //  TODO: 2. old completed tasks
        })
      })
    .catch(function(error) {

      });

  }
}

function updationFromDB(){
  firstEntered = true;
  myUnapproved= {};
  myDeadlineCrossed= {};
  myCompleted= {};
  myIncompleted= {};
  myAssigned= {};
  db.collection("tasks").get().then(function(snap) {
    taskSnapshot = snap;}).then(function() {
      if(taskSnapshot != null){
        console.log(taskSnapshot.docChanges())
        taskSnapshot.docChanges().forEach(function(change) {
          let data = change.doc.data()
          offlineDB[change.doc.id]= {data};
          var assignedBy;
          var docSplitter = change.doc.id.split(",");
           if(change.doc.id == 'crnt_month'){
             currentMonthInfo = {
               "month":change.doc.data().month,
               "totalCompleted":change.doc.data().totalCompleted,
               "totalDeadlineCrossed":change.doc.data().totalDeadlineCrossed,
               "totalIncompleted":change.doc.data().totalIncompleted,
               "totalTasks":change.doc.data().totalTasks
              };
           }
           if(change.doc.id == 'prev_month'){
             prevMonthInfo = {
               "month":change.doc.data().month,
               "totalCompleted":change.doc.data().totalCompleted,
               "totalDeadlineCrossed":change.doc.data().totalDeadlineCrossed,
               "totalIncompleted":change.doc.data().totalIncompleted,
               "totalTasks":change.doc.data().totalTasks
              };
           }

           if(change.doc.id != 'prev_month' && change.doc.id != 'crnt_month'){
              // collect incompleted and assigned tasks
              if(change.doc.id.indexOf(':') !== -1){
                assignedBy = docSplitter[0].split(":")[0];
                var assignedTo = docSplitter[0].split(":")[1];
                if(assignedBy == auth.currentUser.email){
                    myAssigned[change.doc.id]= {data};
                }
                if(assignedTo == auth.currentUser.email){
                    myIncompleted[change.doc.id]= {data};
                    copyIncompleted[change.doc.id]= {data};
                }
              }
              // collect completed tasks
              if(change.doc.id.indexOf('>') !== -1){
                assignedTo = docSplitter[0].split(">")[1];
                if(assignedTo == auth.currentUser.email){
                    myCompleted[change.doc.id]= {data};
                    copyCompleted[change.doc.id]= {data};
                }
              }
              // collect deadline crossed tasks
              if(change.doc.id.indexOf('<') !== -1){
                assignedTo = docSplitter[0].split("<")[1];
                if(assignedTo == auth.currentUser.email){
                    myDeadlineCrossed[change.doc.id]= {data};
                    copyDeadlineCrossed[change.doc.id]= {data};
                }
              }
              // collect tasks that you have unapproved
              if(change.doc.id.indexOf('|') !== -1){
                assignedBy = docSplitter[0].split("|")[0];
                assignedTo = docSplitter[0].split("|")[1];
                if(assignedBy == auth.currentUser.email){
                    myUnapproved[change.doc.id]= {data};
                }
                if(assignedTo == auth.currentUser.email){
                    myClicked[change.doc.id]= {data};
                }
              }
          }
        });
        resetOldTasks();
        // if((Object.keys(myCompleted).length != Object.keys(copyCompleted).length) || (Object.keys(myIncompleted).length != Object.keys(copyIncompleted).length) || (Object.keys(myDeadlineCrossed).length != Object.keys(copyDeadlineCrossed).length) ){
          updateChart(Object.keys(myCompleted).length,Object.keys(myIncompleted).length,Object.keys(myDeadlineCrossed).length);
        // }
        if($("#filterTask").val()){
            switch($('#filterTask').val()) {
              case 'incompleted':
                renderIncompleted();
                  break;
                case 'completed':
                  renderCompleted();
                  break;
                case 'deadlineCrossed':
                  renderDeadlineCrossed();
                  break;
                case 'unapproved':
                  renderUnapproved();
                  break;
                case 'assignedTasks':
                  renderAssignedTasks();
                  break;
                case 'tasksApproval':
                  renderTasksApproval();
                  break;
                default:
                  // code block
              }
        }
      }

  }).catch(function(error) {
    console.log("Error getting document:", error);});

}

function renderIncompleted(){
  $('#scrollbar').empty();
  Object.keys(myIncompleted).forEach(function(key,index) {
    var docSplitter = key.split(",");
    var time = docSplitter[1];
    var assignedBy = docSplitter[0].split(":")[0];
    $(` <div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${key}">
    <div class="row my-auto mx-0">
      <div class="col-md-3 rounded my-auto"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="100%"></div>
      <div class="col-md-6 pl-0 mx-0 my-auto">
        <h6 class="text-light d-block m-0">${myIncompleted[key].data.name}</h6>
        <small class="text-secondary m-0">Deadline: </small><br>
        <small class="text-info m-0">${new Date(parseInt(time)).toLocaleString()}</small>
      </div>
      <div class="m-auto"><a href="#0" class="clickToComplete" class="mx-1"> <i class="fa fa-check text-info font-weight-bold" aria-hidden="true"></i></a>
<a href="#0" data-toggle="modal" data-target="#task${index}" id="viewTaskDetail" class="mx-1"> <i class="fa fa-file-text-o text-secondary " aria-hidden="true"></i></a></div>
    </div>
    <!-- Modal -->
<div class="modal fade" id="task${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content bg-dark" style="border-radius: 2em;">
    <div class="modal-header border-0 shadow-lg text-secondary">
      <h5 class="modal-title" id="exampleModalCenterTitle">Task Details</h5>
      <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="modal-body text-light">
      <div class="row">
        <div class="col-md-6 my-auto">
        <div class="container">
         <small class="text-info mb-0">Name</small>
         <p style="font-size: 0.9em;">${myIncompleted[key].data.name}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Description</small>
         <p style="font-size: 0.9em;">${myIncompleted[key].data.description}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Priority</small>
         <p style="font-size: 0.9em;">${myIncompleted[key].data.priority}</p>
         </div>
         <div class="container" id="docLinksList">
         <small class="text-info mb-0">attached files</small>
         ${showTaskFiles(myIncompleted[key].data.doc)}
         </div>
    </div>
    <div class="col-md-6 my-auto text-right">
    <div class="col-md-12 rounded ml-auto container"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="50%"></div>
    <small class="text-info mb-0 container">Assigned by:</small>
      <p style="font-size: 0.9em;" class="container">${$("[data='"+assignedBy+"'] h6").text()}</p>

    <div class="container">
      <small class="text-info mb-0">Start Time</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(myIncompleted[key].data.start)).toLocaleString()}</p>
     </div>
    <div class="container">
      <small class="text-info mb-0">Deadline</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(time)).toLocaleString()}</p>
    </div>
    </div>
    </div>
    <div class="modal-footer border-0 m-0 p-0 shadow-lg rounded-pill">
      <button type="button" class="shadow-lg btn btn-info container rounded-pill" data-dismiss="modal">Close</button>
    </div>
  </div>
  </div>
  </div>`).appendTo('#scrollbar');
  });


  $(".clickToComplete").on("click", function(){
      var clickedTaskId =  $(this).closest(".card").attr('data');
      var docSplitter = clickedTaskId.split(",");
      var time = docSplitter[1];
      var tempdata = copyToTemp(clickedTaskId);
      var assignedBy = docSplitter[0].split(":")[0];
      var assignedTo = docSplitter[0].split(":")[1];
      //console.log(copyToTemp(clickedTaskId).name) 
      db.collection("tasks").doc(clickedTaskId).delete().then(function() {
        db.collection("tasks").doc(assignedBy+'|'+assignedTo+','+time).set({
          description: tempdata.description,
          start: tempdata.start,
          name: tempdata.name,
          doc: tempdata.doc,
          priority: tempdata.priority
        })
        .then(function() {
        
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
  });

}

function renderCompleted(){
  $('#scrollbar').empty();
  Object.keys(myCompleted).forEach(function(key,index) {
    var docSplitter = key.split(",");
    var time = docSplitter[1];
    var assignedBy = docSplitter[0].split(">")[0];
  $(` <div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${key}">
    <div class="row my-auto mx-0">
      <div class="col-md-3 rounded my-auto"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="100%"></div>
      <div class="col-md-8 pl-0 mx-0 my-auto">
        <h6 class="text-light d-block m-0">${myCompleted[key].data.name}</h6>
        <small class="text-secondary m-0">Deadline: </small><br>
        <small class="text-info m-0">${new Date(parseInt(time)).toLocaleString()}</small>
      </div>
      <div class="my-auto"><a href="#0" data-toggle="modal" data-target="#task${index}" id="viewTaskDetail" class="mx-1"> <i class="fa fa-file-text-o text-secondary " aria-hidden="true"></i></a></div>
    </div>
    <!-- Modal -->
<div class="modal fade" id="task${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content bg-dark" style="border-radius: 2em;">
    <div class="modal-header border-0 shadow-lg text-secondary">
      <h5 class="modal-title" id="exampleModalCenterTitle">Task Details</h5>
      <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="modal-body text-light">
      <div class="row">
        <div class="col-md-6 my-auto">
        <div class="container">
         <small class="text-info mb-0">Name</small>
         <p style="font-size: 0.9em;">${myCompleted[key].data.name}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Description</small>
         <p style="font-size: 0.9em;">${myCompleted[key].data.description}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Priority</small>
         <p style="font-size: 0.9em;">${myCompleted[key].data.priority}</p>
         </div>
         <div class="container" id="docLinksList">
         <small class="text-info mb-0">attached files</small>
         ${showTaskFiles(myCompleted[key].data.doc)}
         </div>
    </div>
    <div class="col-md-6 my-auto text-right">
    <div class="col-md-12 rounded ml-auto container"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="50%"></div>
    <small class="text-info mb-0 container">Assigned by:</small>
      <p style="font-size: 0.9em;" class="container">${$("[data='"+assignedBy+"'] h6").text()}</p>

    <div class="container">
      <small class="text-info mb-0">Start Time</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(myCompleted[key].data.start)).toLocaleString()}</p>
     </div>
    <div class="container">
      <small class="text-info mb-0">Deadline</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(time)).toLocaleString()}</p>
    </div>
    </div>
    </div>
    <div class="modal-footer border-0 m-0 p-0 shadow-lg rounded-pill">
      <button type="button" class="shadow-lg btn btn-info container rounded-pill" data-dismiss="modal">Close</button>
    </div>
  </div>
  </div>
  </div>`).appendTo('#scrollbar');
  });
}

function renderDeadlineCrossed(){
  $('#scrollbar').empty();
  Object.keys(myDeadlineCrossed).forEach(function(key,index) {
    var docSplitter = key.split(",");
    var time = docSplitter[1];
    var assignedBy = docSplitter[0].split(">")[0];
    $(` <div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${key}">
    <div class="row my-auto mx-0">
      <div class="col-md-3 rounded my-auto"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="100%"></div>
      <div class="col-md-8 pl-0 mx-0 my-auto">
        <h6 class="text-light d-block m-0">${myDeadlineCrossed[key].data.name}</h6>
        <small class="text-secondary m-0">Deadline: </small><br>
        <small class="text-info m-0">${new Date(parseInt(time)).toLocaleString()}</small>
      </div>
      <div class="my-auto"><a href="#0" data-toggle="modal" data-target="#task${index}" id="viewTaskDetail" class="mx-1"> <i class="fa fa-file-text-o text-secondary " aria-hidden="true"></i></a></div>
    </div>
    <!-- Modal -->
<div class="modal fade" id="task${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content bg-dark" style="border-radius: 2em;">
    <div class="modal-header border-0 shadow-lg text-secondary">
      <h5 class="modal-title" id="exampleModalCenterTitle">Task Details</h5>
      <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="modal-body text-light">
      <div class="row">
        <div class="col-md-6 my-auto">
        <div class="container">
         <small class="text-info mb-0">Name</small>
         <p style="font-size: 0.9em;">${myDeadlineCrossed[key].data.name}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Description</small>
         <p style="font-size: 0.9em;">${myDeadlineCrossed[key].data.description}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Priority</small>
         <p style="font-size: 0.9em;">${myDeadlineCrossed[key].data.priority}</p>
         </div>
         <div class="container" id="docLinksList">
         <small class="text-info mb-0">attached files</small>
         ${showTaskFiles(myDeadlineCrossed[key].data.doc)}
         </div>
    </div>
    <div class="col-md-6 my-auto text-right">
    <div class="col-md-12 rounded ml-auto container"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="50%"></div>
    <small class="text-info mb-0 container">Assigned by:</small>
      <p style="font-size: 0.9em;" class="container">${$("[data='"+assignedBy+"'] h6").text()}</p>

    <div class="container">
      <small class="text-info mb-0">Start Time</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(myDeadlineCrossed[key].data.start)).toLocaleString()}</p>
     </div>
    <div class="container">
      <small class="text-info mb-0">Deadline</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(time)).toLocaleString()}</p>
    </div>
    </div>
    </div>
    <div class="modal-footer border-0 m-0 p-0 shadow-lg rounded-pill">
      <button type="button" class="shadow-lg btn btn-info container rounded-pill" data-dismiss="modal">Close</button>
    </div>
  </div>
  </div>
  </div>`).appendTo('#scrollbar');
  });
}

function renderUnapproved(){
  $('#scrollbar').empty();
  Object.keys(myClicked).forEach(function(key,index) {
    var docSplitter = key.split(",");
    var time = docSplitter[1];
    var assignedBy = docSplitter[0].split("|")[0];
    $(` <div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${key}">
    <div class="row my-auto mx-0">
      <div class="col-md-3 rounded my-auto"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="100%"></div>
      <div class="col-md-8 pl-0 mx-0 my-auto">
        <h6 class="text-light d-block m-0">${myClicked[key].data.name}</h6>
        <small class="text-secondary m-0">Deadline: </small><br>
        <small class="text-info m-0">${new Date(parseInt(time)).toLocaleString()}</small>
      </div>
      <div class="my-auto"><a href="#0" data-toggle="modal" data-target="#task${index}" id="viewTaskDetail" class="mx-1"> <i class="fa fa-file-text-o text-secondary " aria-hidden="true"></i></a></div>
    </div>
    <!-- Modal -->
<div class="modal fade" id="task${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content bg-dark" style="border-radius: 2em;">
    <div class="modal-header border-0 shadow-lg text-secondary">
      <h5 class="modal-title" id="exampleModalCenterTitle">Task Details</h5>
      <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="modal-body text-light">
      <div class="row">
        <div class="col-md-6 my-auto">
        <div class="container">
         <small class="text-info mb-0">Name</small>
         <p style="font-size: 0.9em;">${myClicked[key].data.name}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Description</small>
         <p style="font-size: 0.9em;">${myClicked[key].data.description}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Priority</small>
         <p style="font-size: 0.9em;">${myClicked[key].data.priority}</p>
         </div>
         <div class="container" id="docLinksList">
         <small class="text-info mb-0">attached files</small>
         ${showTaskFiles(myClicked[key].data.doc)}
         </div>
    </div>
    <div class="col-md-6 my-auto text-right">
    <div class="col-md-12 rounded ml-auto container"><img src="${$("[data='"+assignedBy+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="50%"></div>
    <small class="text-info mb-0 container">Assigned by:</small>
      <p style="font-size: 0.9em;" class="container">${$("[data='"+assignedBy+"'] h6").text()}</p>

    <div class="container">
      <small class="text-info mb-0">Start Time</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(myClicked[key].data.start)).toLocaleString()}</p>
     </div>
    <div class="container">
      <small class="text-info mb-0">Deadline</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(time)).toLocaleString()}</p>
    </div>
    </div>
    </div>
    <div class="modal-footer border-0 m-0 p-0 shadow-lg rounded-pill">
      <button type="button" class="shadow-lg btn btn-info container rounded-pill" data-dismiss="modal">Close</button>
    </div>
  </div>
  </div>
  </div>`).appendTo('#scrollbar');
  });
}

function renderTasksApproval(){
  $('#scrollbar').empty();
  Object.keys(myUnapproved).forEach(function(key,index) {
    var docSplitter = key.split(",");
    var time = docSplitter[1];
    var assignedTo = docSplitter[0].split("|")[1];
    $(` <div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${key}">
    <div class="row mt-auto mb-2 mx-0">
      <div class="col-md-3 rounded my-auto"><img src="${$("[data='"+assignedTo+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="100%"></div>
      <div class="col-md-8 pl-0 mx-0 my-auto">
        <h6 class="text-light d-block m-0">${myUnapproved[key].data.name}</h6>
        <small class="text-secondary m-0">Deadline: </small><br>
        <small class="text-info m-0">${new Date(parseInt(time)).toLocaleString()}</small>
      </div>
      <div class="my-auto"><a href="#0" data-toggle="modal" data-target="#task${index}" id="viewTaskDetail" class="mx-1"> <i class="fa fa-file-text-o text-secondary " aria-hidden="true"></i></a></div>
    </div>
    <div class="container text-center mt-5 px-2 py-1 my-auto btn-secondary shadow-lg rounded-pill clickToApprove" style="font-size: 0.8em;">approve</div>
    <!-- Modal -->
<div class="modal fade" id="task${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content bg-dark" style="border-radius: 2em;">
    <div class="modal-header border-0 shadow-lg text-secondary">
      <h5 class="modal-title" id="exampleModalCenterTitle">Task Details</h5>
      <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="modal-body text-light">
      <div class="row">
        <div class="col-md-6 my-auto">
        <div class="container">
         <small class="text-info mb-0">Name</small>
         <p style="font-size: 0.9em;">${myUnapproved[key].data.name}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Description</small>
         <p style="font-size: 0.9em;">${myUnapproved[key].data.description}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Priority</small>
         <p style="font-size: 0.9em;">${myUnapproved[key].data.priority}</p>
         </div>
         <div class="container" id="docLinksList">
         <small class="text-info mb-0">attached files</small>
         ${showTaskFiles(myUnapproved[key].data.doc)}
         </div>
    </div>
    <div class="col-md-6 my-auto text-right">
    <div class="col-md-12 rounded ml-auto container"><img src="${$("[data='"+assignedTo+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="50%"></div>
    <small class="text-info mb-0 container">Assigned To:</small>
      <p style="font-size: 0.9em;" class="container">${$("[data='"+assignedTo+"'] h6").text()}</p>

    <div class="container">
      <small class="text-info mb-0">Start Time</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(myUnapproved[key].data.start)).toLocaleString()}</p>
     </div>
    <div class="container">
      <small class="text-info mb-0">Deadline</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(time)).toLocaleString()}</p>
    </div>
    </div>
    </div>
    <div class="modal-footer border-0 m-0 p-0 shadow-lg rounded-pill">
      <button type="button" class="shadow-lg btn btn-info container rounded-pill" data-dismiss="modal">Close</button>
    </div>
  </div>
  </div>
  </div>`).appendTo('#scrollbar');
  });


  $(".clickToApprove").on("click", function(){
    var clickedTaskId =  $(this).closest(".card").attr('data');
    var docSplitter = clickedTaskId.split(",");
      var time = docSplitter[1];
      var tempdata = copyToTemp(clickedTaskId);
      var assignedBy = docSplitter[0].split("|")[0];
      var assignedTo = docSplitter[0].split("|")[1];
      //console.log(copyToTemp(clickedTaskId).name) 
      db.collection("tasks").doc(clickedTaskId).delete().then(function() {
        db.collection("tasks").doc(assignedBy+'>'+assignedTo+','+time).set({
          description: tempdata.description,
          start: tempdata.start,
          name: tempdata.name,
          doc: tempdata.doc,
          priority: tempdata.priority
        })
        .then(function() {
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
  });
}

function renderAssignedTasks(){
  $('#scrollbar').empty();
  Object.keys(myAssigned).forEach(function(key,index) {
    var docSplitter = key.split(",");
    var time = docSplitter[1];
    var assignedTo = docSplitter[0].split(":")[1];
    $(` <div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${key}">
    <div class="row my-auto mx-0">
      <div class="col-md-3 rounded my-auto"><img src="${$("[data='"+assignedTo+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="100%"></div>
      <div class="col-md-8 pl-0 mx-0 my-auto">
        <h6 class="text-light d-block m-0">${myAssigned[key].data.name}</h6>
        <small class="text-secondary m-0">Deadline: </small><br>
        <small class="text-info m-0">${new Date(parseInt(time)).toLocaleString()}</small>
      </div>
      <div class="my-auto"><a href="#0" data-toggle="modal" data-target="#task${index}" id="viewTaskDetail" class="mx-1"> <i class="fa fa-file-text-o text-secondary " aria-hidden="true"></i></a></div>
    </div>
    <!-- Modal -->
<div class="modal fade" id="task${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content bg-dark" style="border-radius: 2em;">
    <div class="modal-header border-0 shadow-lg text-secondary">
      <h5 class="modal-title" id="exampleModalCenterTitle">Task Details</h5>
      <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="modal-body text-light">
      <div class="row">
        <div class="col-md-6 my-auto">
        <div class="container">
         <small class="text-info mb-0">Name</small>
         <p style="font-size: 0.9em;">${myAssigned[key].data.name}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Description</small>
         <p style="font-size: 0.9em;">${myAssigned[key].data.description}</p>
         </div>
         <div class="container">
         <small class="text-info mb-0">Priority</small>
         <p style="font-size: 0.9em;">${myAssigned[key].data.priority}</p>
         </div>
         <div class="container" id="docLinksList">
         <small class="text-info mb-0">attached files</small>
         ${showTaskFiles(myAssigned[key].data.doc)}
         </div>
    </div>
    <div class="col-md-6 my-auto text-right">
    <div class="col-md-12 rounded ml-auto container"><img src="${$("[data='"+assignedTo+"'] img")[0].currentSrc}" alt="" class="img-responsive" width="50%"></div>
    <small class="text-info mb-0 container">Assigned To:</small>
      <p style="font-size: 0.9em;" class="container">${$("[data='"+assignedTo+"'] h6").text()}</p>

    <div class="container">
      <small class="text-info mb-0">Start Time</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(myAssigned[key].data.start)).toLocaleString()}</p>
     </div>
    <div class="container">
      <small class="text-info mb-0">Deadline</small>
      <p style="font-size: 0.9em;">${new Date(parseInt(time)).toLocaleString()}</p>
    </div>
    </div>
    </div>
    <div class="modal-footer border-0 m-0 p-0 shadow-lg rounded-pill">
      <button type="button" class="shadow-lg btn btn-info container rounded-pill" data-dismiss="modal">Close</button>
    </div>
  </div>
  </div>
  </div>`).appendTo('#scrollbar');
  });
}


$(document).ready(function(){
  $('.taskListDiv').hide();
  $('.uploader').fadeOut();
  toastr.options = {
    "closeButton": true,"debug": false,"newestOnTop": false,"progressBar": true,"positionClass": "toast-top-right","preventDuplicates": false,"onclick": null,"showDuration": "300","hideDuration": "1000","timeOut": "5000","extendedTimeOut": "1000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"
  }
  $('#taskformbar').hide();
  db.collection("users").get()
  .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
          if (doc.id != auth.currentUser.email) {
            if(doc.data().designation != 'admin' && doc.data().designation != 'unknown'){
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
          }
          else{
            if(doc.data().designation == 'unknown'){
              window.location.replace('./userNotVerified.html');
            }else{
              $('#userImage').attr("src", `${doc.data().photoURL}`);
              $('.userName').html(`${doc.data().displayName}`);
              $('.designation').html(`${doc.data().designation}`);
            }
          }
          //console.log(doc.id, " => ", doc.data());
      });
      $('.loader').fadeOut('slow');

      $("#filterTask").change(function () {

        switch($('#filterTask').val()) {
          case 'incompleted':
            renderIncompleted();
              break;
            case 'completed':
              renderCompleted();
              break;
            case 'deadlineCrossed':
              renderDeadlineCrossed();
              break;
            case 'unapproved':
              renderUnapproved();
              break;
            case 'assignedTasks':
              renderAssignedTasks();
              break;
            case 'tasksApproval':
              renderTasksApproval();
              break;
            default:
              // code block
          }
      });

      $("#force-overflow .card").on("click", function () {
          //$(".rightbar-div").after(taskForm).fadeIn('slow');
          //$('.taskForm').fadeOut(function(){$(this).fadeIn(400);})
          $('#taskformbar').show()
          $('.taskListDiv').hide();
          $('.svg-div').remove();
          $("#customFile")[0].value = null;
          $("#fileLabel").text('choose upto 3 files');
          var cardName = $("[data='"+$(this).attr('data')+"'] h6").text();
          $("form h4").text("Task for "+cardName)
          assignedTO = ($(this).attr('data'));
          $('#taskName').val('');
          $('#startDate').val('');
          $('#endDate').val('');
          $('#taskDetails').val('');
          $("#customFile").text("Choose multiple files");
      });
  })

  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#force-overflow .card").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

})

$('#closeForm').on("click", function(event){
  event.preventDefault();
  $('#taskformbar').hide();
  $(".rightbar-div").after(svgClone).fadeIn('slow', function(){
    $('#viewTasksBtn').on("click", function(){
      //$('#taskformbar').hide();
      $('.svg-div').remove();
      $('.taskListDiv').show();
      renderIncompleted();
    });
  });
});
$('#closeLists').on("click", function(event){
  event.preventDefault();
  $('.taskListDiv').hide();
  $(".rightbar-div").after(svgClone).fadeIn('slow', function(){
    $('#viewTasksBtn').on("click", function(){
      //$('#taskformbar').hide();
      $('.svg-div').remove();
      $('.taskListDiv').show();
      renderIncompleted();
    });
  });
});
$('#viewTasksBtn').on("click", function(){
  $('.svg-div').remove();
  $('.taskListDiv').show();
  renderIncompleted();
});

document.getElementById('signout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    localStorage.clear()
    toastr['info']('You are signed out! ', 'see you soon');
      });
      window.location.replace("./index.html");
});



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


  $("#filterTask").click(function(){
    switch(this.value) {
      case 'incompleted':
        $("#taskHeading").text('Your incompleted tasks');
        break;
      case 'completed':
        $("#taskHeading").text('Your completed tasks');
        break;
      case 'deadlineCrossed':
        $("#taskHeading").text('Deadline crossed tasks');
        break;
      case 'assignedTasks':
        $("#taskHeading").text('Your assigned tasks');
        break;
      case 'tasksApproval':
        $("#taskHeading").text('Approve assigned tasks');
        break;
      case 'unapproved':
        $("#taskHeading").text('Your unapproved tasks');
        break;
      default:
        $("#taskHeading").text('...');
    }
    
  });

// TODO: file size not more than 10mb
  // File validation
  $("#customFile").change(function() {
    if ($("#customFile")[0].files.length > 3) {
      $("#customFile")[0].value = null;
      $('#fileLabel').text("You can select only 3 files");
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



  // assign a task
  $('#taskForm').on('submit',function(e){
    e.preventDefault();
    let taskName = $('#taskName').val();
    let startTime = $('#startTime').val();
    let startDate = new Date($('#startDate').val()+' '+startTime).getTime();
    let endTime = $('#endTime').val();
    let endDate = new Date($('#endDate').val()+' '+endTime).getTime();
    let taskDetails = $('#taskDetails').val();
    let taskPriority = $('#inlineFormCustomSelect').val();
    let timestamp = new Date().getTime();

    if( $("#customFile")[0].files.length == 0 ){
          // Add a new document in collection "tasks"
          $('.uploader').fadeIn('slow');
          db.collection("tasks").doc(auth.currentUser.email+':'+assignedTO+','+endDate).set({
            description: taskDetails,
            start: startDate,
            name: taskName,
            doc: 'null',
            priority: taskPriority
          })
          .then(function() {
            $('.uploader').fadeOut('slow');
            toastr['success']('Document successfully written!', 'Task successfully assigned to '+assignedTo);
            console.log("");
          })
          .catch(function(error) {
            $('.uploader').fadeOut('slow');
            console.error("Error writing document: ", error);
          });
    }
    else{
        var count = 0;
        for (var i = 0; i < $("#customFile")[0].files.length; i++)
        {
          let file = $("#customFile")[0].files[i];
          let storageRef = storage.ref("Tasks/"+timestamp+"/"+file.name);
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
                    if(count == $("#customFile")[0].files.length){
                        // Add a new document in collection "tasks"
                        db.collection("tasks").doc(auth.currentUser.email+':'+assignedTo+','+endDate).set({
                          description: taskDetails,
                          start: startDate,
                          name: taskName,
                          doc: docLinks,
                          priority: taskPriority
                        })
                        .then(function() {
                          $('.uploader').fadeOut('slow');
                          toastr['success']('Document successfully written!', 'Task successfully assigned to '+assignedTo);
                        })
                        .catch(function(error) {
                          console.error("Error writing document: ", error);
                        });
                    }
                });
              });
        }
    }
    $(".rightbar-div").after(svgClone).fadeIn('slow', function(){
      $('#viewTasksBtn').on("click", function(){
        $('.svg-div').remove();
        $('.taskListDiv').show();
      });
    });

    $('#taskformbar').hide();
 });


// snap on task database changes
db.collection("tasks").onSnapshot(function(snapshot) {
  if(firstEntered != false){
    getNotified(snapshot);
  }
  updationFromDB();
});
