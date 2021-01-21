let userBio,userPhoto,userDesignation, myBlob, convertedImage, height, width ,totalUsers = 0 ,totalUnknowns=0  , totalNewUser = 0 , approveMembers = 0 ,totalCompleted = 0 ,totalDeadlineCrossed = 0,totalIncompleted = 0 ,currentMonth = 0 ,currentyear = 0, crntmonTotaltask = 0 ,totalPost = 0 ;

var totalEvent;
var totalMeeting;
var totalNotice;
var totalLow;
var totalHard;
var totalModerate;
var months = ['January','February','March','April','May','June','	July','August','September','October','November','December'];
var firstVisited = false;

document.getElementById('signout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
      localStorage.clear();
      toastr['info']('You are signed out! ', 'see you soon');
      });
      window.location.replace("./index.html");
  });
  
  // chart js implementation
  function updateCharts(){
    $(`<h6 class="text-light text-center m-auto ">Total Events: ${totalEvent}</h6>`).appendTo('.UnapproveMembers');

    // chart js implementation
  var ctx = document.getElementById('noticeTypes').getContext('2d');
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
  var ctx1 = document.getElementById('noticePriority').getContext('2d');
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

  function renderList(docs)
  {

    totalPost = docs.length;
$(`<h6 class="text-light text-center m-auto ">Total Notice: ${totalPost}</h6>`).appendTo('.totalPost');

    
      totalEvent = 0;
      totalMeeting = 0;
      totalNotice = 0;
      totalLow = 0;
      totalHard = 0;
      totalModerate = 0;
    
        docs.forEach(function(doc)
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
          switch(doc.data().priority.toLowerCase()){
            case 'low':
              totalLow++;
              
            break;
            case 'moderate':
              totalModerate++;
             
            break;
            case 'hard':
              totalHard++;
              
            break;
          
            
            
          }
        
  
        });
  
      
  
        updateCharts();
  }
 
$(document).ready(function(){
  $('.uploader').fadeOut();
  if(localStorage.getItem("theme") == "dark"){
    $('.toggle-checkbox').click();
  }

  db.collection("users").onSnapshot(function(querySnapshot) {
    totalUnknowns = 0;
    totalNewUser = 0;
    totalUsers = querySnapshot.docChanges().length;
    $(`<h6 class="text-light text-center m-auto ">Total Users: ${totalUsers}</h6>`).appendTo('.totalUser');
    
      
    querySnapshot.forEach(function (doc) {

      if (doc.id == auth.currentUser.email) {
        $('#userImage').attr("src", `${doc.data().photoURL}`);
        $('.userName').html(`${doc.data().displayName}`);
        $('#settings-name').val(`${doc.data().displayName}`);
        $('.designation').html(`${doc.data().designation}`);

      }
    if(doc.data().displayName.indexOf('isUnknown') > -1)
    {
      totalUnknowns++;
    
    }
    if(doc.data().displayName.indexOf('isNewUser') > -1)
    {
      totalNewUser++;
    }
    
  
    

      
    
  });
  
// console.log(totalNewUser);
approveMembers = totalUsers - totalUnknowns ;

// console.log(approveMembers);
// console.log(totalUnknowns);
// console.log(totalNewUser);

  let ctx3 = document.getElementById('myChart2').getContext('2d');
  let labels = ['Approved','Unapproved','New Users'];
  let colorHex = ['#253D5B','#EFCA08','#FB3640'];

  new Chart(ctx3,{

    type: 'doughnut',
    data:{
      datasets:[
        {
          data:[approveMembers,totalUnknowns,totalNewUser],
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






  $('.loader').fadeOut('slow');
},
error => {
    if(error.code == 'resource-exhausted'){
        window.location.replace("../quotaExceeded.html");
    }
}),

db.collection("notice").onSnapshot(function(snapshot) {
 
  renderList(snapshot.docs);
},
error => {
    if(error.code == 'resource-exhausted'){
        window.location.replace("../quotaExceeded.html");
    }
});

function currentMonth(doc)
{
  totalCompleted = doc.data().totalCompleted ;
  totalDeadlineCrossed = doc.data().totalDeadlineCrossed;
  totalIncompleted = doc.data().totalIncompleted;
  crntmonTotaltask = doc.data().totalTasks

currentyear = doc.data().month.year;

console.log(totalCompleted)
console.log(months[doc.data().month.month])
console.log(currentyear)
console.log(totalDeadlineCrossed)
console.log(totalIncompleted)
console.log(crntmonTotaltask)
$(`<h6 class="text-light text-center m-auto ">Total Task: ${crntmonTotaltask}</h6>`).appendTo('.totalTask');

var ctx = document.getElementById('currentMonth');
var myChart = new Chart(ctx, {
    type: 'line',
   data : {
      labels: ["Completed", "Incompleted", "Deadline", "Total"],
      datasets: [
          {
              label: "Current Month Task",
              backgroundColor :'#04004A',
              borderCapStyle : 'round',
              borderJoinStyle : 'miter',
              borderColor : '#C34A36', 
              borderWidth : 4,
              pointHoverRadius : 4,
              pointStyle : 'rectRounded',
             
              pointBackgroundColor : '#4B4453',
              pointBorderColor : 'white',
              fill : true,
              fillColor: "black",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [ totalCompleted, totalIncompleted,totalDeadlineCrossed,crntmonTotaltask ]
          },
         
      ]
  },
    options: {
       
    }
});
var ctx = document.getElementById('previousMonth');
var myChart1 = new Chart(ctx, {
    type: 'line',
   data : {
      labels: ["Completed", "Incompleted", "Deadline", "Total"],
      datasets: [
          {
              label: "Previous Month Task",
              backgroundColor :'#FEFEDF',
              borderCapStyle : 'round',
              borderJoinStyle : 'round',
              borderColor : '#C34A36', 
              borderWidth : 4,
              pointHoverRadius : 4,
              pointStyle : 'rectRounded',
             
              pointBackgroundColor : '#4B4453',
              pointBorderColor : 'white',
              fill : true,
              fillColor: "black",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [ totalCompleted, totalIncompleted,totalDeadlineCrossed,crntmonTotaltask ]
          },
         
      ]
  },
    options: {
       
    }
});


}



  
 db.collection("tasks") .doc('crnt_month').get().then(function (doc) { 

  currentMonth(doc);
  
  firstVisited = true;
 

  })
    
  db.collection("tasks").doc('crnt_month').onSnapshot(function(snapshot) {
    if(  firstVisited == false)
    {
      currentMonth(snapshot);

    }
    else
    {
      firstVisited = false;
    }
   

  
  },
  error => {
      if(error.code == 'resource-exhausted'){
          window.location.replace("../quotaExceeded.html");
      }
  });
 db.collection("tasks") .doc('prev_month').get().then(function (doc) { 

  currentMonth(doc);
  
  firstVisited = true;
 

  })
    
  db.collection("tasks").doc('prev_month').onSnapshot(function(snapshot) {
    if(  firstVisited == false)
    {
      currentMonth(snapshot);

    }
    else
    {
      firstVisited = false;
    }
   

  
  },
  error => {
      if(error.code == 'resource-exhausted'){
          window.location.replace("../quotaExceeded.html");
      }
  });
 
 
  
  
    
   
    
   

      

// console.log( totalCompleted);
// console.log( totalDeadlineCrossed);
// console.log( totalIncompleted);







// drag box js
let $fileInput = $('.file-input');
let $droparea = $('.file-drop-area');

// highlight drag area
$fileInput.on('dragenter focus click', function() {
  $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
  $droparea.removeClass('is-active');
});

// change inner text
$fileInput.on('change', function() {
  let filesCount = $(this)[0].files.length;
  let $textContainer = $(this).prev();

  if (filesCount === 1) {
    // if single file is selected, show file name
    let fileName = $(this).val().split('\\').pop();
    $textContainer.text(fileName);
  } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
  }
});
// time js


    function startTime() {
      let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      let today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();

      m = checkTime(m);

      let formattedTime = twelveHour(h, m);

      document.getElementById('time').innerHTML = formattedTime;
      document.getElementById('date').innerHTML =
        days[today.getDay()] + ', ' + today.getDate();
      setTimeout(startTime, 500);
    }

    function checkTime(i) {
        if (i < 10) {
            i = '0' + i;
        } // add zero in front of numbers < 10
        return i;
    }
    // twelve hour formatted time
    function twelveHour(h, m) {
        let AmOrPm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + m + ' ' + AmOrPm;
    }

    function blobToFile(theBlob, fileName){
      //A Blob() is almost a File() - it's just missing the two properties below which we will add
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    }

// TODO:head
  let $modal = $('#exampleModalCenter');
	let image = document.getElementById('sample_image');
	let cropper;

	$('#profilePic').change(function(event){
		let files = event.target.files;
		let done = function(url){
			image.src = url;
			$modal.modal('show');
		};

		if(files && files.length > 0)
		{
			let reader = new FileReader();
      reader.onload = function(e)
			{
         //Initiate the JavaScript Image object.
        var img = new Image();
        //Set the Base64 string return from FileReader as source.
        img.src = e.target.result;
        //Validate the File Height and Width.
        img.onload = function () {
           height = this.height;
           width = this.width;
          if(height / width != 1) {
            done(reader.result);
          }
        };
			};
			reader.readAsDataURL(files[0]);
		}
	});

	$modal.on('shown.bs.modal', function() {
		cropper = new Cropper(image, {
			aspectRatio: 1,
			viewMode: 2,
		});
	}).on('hidden.bs.modal', function(){
		cropper.destroy();
   		cropper = null;
	});

	$('#crop').click(function(){
		let canvas = cropper.getCroppedCanvas({
			width: height<width? height:width,
			height: height<width? height:width
		});

		canvas.toBlob(function(blob){
      myBlob = blob;
			URL.createObjectURL(blob);
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function(){
          // let base64data = reader.result;
          $modal.modal('hide');
          // var renderImage = new Image();
          // renderImage.src = base64data;
          // $('#userImage').append(renderImage);
          // $('#userImage').attr('src', url);
      };
		});
  });

  function clearInputs(){
    $('#userPass').val('');
    $('#settings-pass').val('');
    $("#profilePic")[0].value = null;
  }

    $('.taskForm form').on('submit',function(e){
      e.preventDefault();
      let currentPass = $('#userPass').val();
      let newPass = $('#settings-pass').val() == ''? 'oldPass' : $('#settings-pass').val();
      let displayName = $('#settings-name').val() == ''? $('.userName').text() : $('#settings-name').val();
      let profilePic = $('#profilePic')[0].files;

      //console.log(auth);
      // alert(profilePic[0].name);
      auth.signInWithEmailAndPassword(auth.currentUser.email, currentPass)
        .then((user) => {
          $('.uploader').fadeIn('slow');
          // profile pic change
          if(profilePic.length > 0){
            let file;
            if(myBlob == undefined){
              file = profilePic[0];
            }
            else{
              file = blobToFile(myBlob, "profilePicture.jpg");
            }

            let storageRef = storage.ref("Users/"+auth.currentUser.email+"/"+'profilePic.jpg');
            let uploadProgress = storageRef.put(file);

          uploadProgress.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
            console.log('asd')

                  let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                    clearInputs();
                    toastr['error']('Error uploading file', error.code);
              }, function() {
                uploadProgress.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        $("#profilePic")[0].value = null;
                        db.collection("users").doc(auth.currentUser.email).set({
                          displayName: displayName,
                          photoURL: downloadURL,
                          designation: userDesignation
                        })
                        .then(function() {
                            if(newPass != 'oldPass'){
                                auth.currentUser.updatePassword(newPass).then(function() {
                                  auth.currentUser.updateProfile({
                                    photoURL: downloadURL,
                                  }).then(function() {
                                    $('.uploader').fadeOut('slow');
                                    clearInputs();
                                    toastr['success']('updated user information sucessfully', 'updated information');
                                  }).catch(function(error) {
                                    clearInputs();
                                    toastr['error']('Error updating info', error.code);
                                  });
                                }).catch(function(error) {
                                  clearInputs();
                                  toastr['error']('Error updating password', error.code);
                                });
                              }
                              else{
                                auth.currentUser.updateProfile({
                                  photoURL: userPhoto,
                                }).then(function() {
                                  $('.uploader').fadeOut('slow');
                                  clearInputs();
                                  toastr['success']('updated user information sucessfully', 'updated information');
                                }).catch(function(error) {
                                  clearInputs();
                                  toastr['error']('Error updating info', error.code);
                                });
                              }
                          })
                        .catch(function(error) {
                          console.error("Error writing document: ", error);
                        });
                });
              });
          }
          else{
            db.collection("users").doc(auth.currentUser.email).set({
              displayName: displayName,
              photoURL: userPhoto,
              designation: userDesignation
            })
            .then(function() {
              if(newPass != 'oldPass'){
                auth.currentUser.updatePassword(newPass).then(function() {
                  auth.currentUser.updateProfile({
                    photoURL: userPhoto,
                  }).then(function() {
                    $('.uploader').fadeOut('slow');
                    clearInputs();
                    toastr['success']('updated user information sucessfully', 'updated information');
                  }).catch(function(error) {
                    toastr['error']('Error updating info', error.code);
                  });
                }).catch(function(error) {
                  toastr['error']('Error updating password', error.code);
                });
              }
              else{
                auth.currentUser.updateProfile({
                  photoURL: userPhoto,
                }).then(function() {
                  $('.uploader').fadeOut('slow');
                  toastr['success']('updated user information sucessfully', 'updated information');
                }).catch(function(error) {
                  toastr['error']('Error updating info', error.code);
                });
              }
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
          }
          clearInputs();
        })
        .catch((error) => {
          clearInputs();
          $('.uploader').fadeOut()
          toastr['error']('Your provided current password may not matched', "Profile updation irterrupted");
        });
   });

  })
