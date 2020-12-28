var userBio,userPhoto,userDesignation;
$(document).ready(function(){
  if(localStorage.getItem("theme") == "dark"){
    $('.toggle-checkbox').click();
  }

  db.collection("users").onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.id == auth.currentUser.email) {
        $('#userImage').attr("src", `${doc.data().photoURL}`);
        $('.userName').html(`${doc.data().displayName}`);
        $('#settings-name').val(`${doc.data().displayName}`);
        $('.designation').html(`${doc.data().designation}`);
        $('.bio').text(`${doc.data().bio}`);
        $('#bioDetails').val(`${doc.data().bio}`);
        userBio = doc.data().bio;
        userPhoto = doc.data().photoURL;
        userDesignation = doc.data().designation;
      }
  });
  $('.loader').fadeOut('slow');
});

// drag box js
var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');

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
  var filesCount = $(this)[0].files.length;
  var $textContainer = $(this).prev();

  if (filesCount === 1) {
    // if single file is selected, show file name
    var fileName = $(this).val().split('\\').pop();
    $textContainer.text(fileName);
  } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
  }
});
// time js

})


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
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();

  m = checkTime(m);

  var formattedTime = twelveHour(h, m);

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
        var AmOrPm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + m + ' ' + AmOrPm;
    }


    $('.taskForm form').on('submit',function(e){
      e.preventDefault();
      var currentPass = $('#userPass').val();
      var newPass = $('#settings-pass').val() == ''? 'oldPass' : $('#settings-pass').val();
      var displayName = $('#settings-name').val() == ''? auth.currentUser.displayName : $('#settings-name').val();
      var bioDetails = $('#bioDetails').val() == ''? userBio : $('#bioDetails').val();
      var profilePic = $('#profilePic')[0].files;

      //console.log(auth);
      // alert(profilePic[0].name);
      auth.signInWithEmailAndPassword(auth.currentUser.email, currentPass)
        .then((user) => {
          // profile pic change
          if(profilePic.length > 0){
            let file = profilePic[0];
            let storageRef = storage.ref("Users/"+auth.currentUser.email+"/"+'profilePic.jpg');
            let uploadProgress = storageRef.put(file);

          uploadProgress.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                    toastr['error']('Error uploading file', error.code);
              }, function() {
                uploadProgress.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        // Add a new document in collection "tasks"
                        db.collection("users").doc(auth.currentUser.email).set({
                          displayName: displayName,
                          bio: bioDetails,
                          photoURL: downloadURL,
                          designation: userDesignation
                        })
                        .then(function() {
                            if(newPass != 'oldPass'){
                                auth.currentUser.updatePassword(newPass).then(function() {
                                  auth.currentUser.updateProfile({
                                    displayName: displayName,
                                    photoURL: downloadURL,
                                  }).then(function() {
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
                                  displayName: displayName,
                                  photoURL: userPhoto,
                                }).then(function() {
                                  toastr['success']('updated user information sucessfully', 'updated information');
                                }).catch(function(error) {
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
              bio: bioDetails,
              photoURL: userPhoto,
              designation: userDesignation
            })
            .then(function() {
              if(newPass != 'oldPass'){
                auth.currentUser.updatePassword(newPass).then(function() {
                  auth.currentUser.updateProfile({
                    displayName: displayName,
                    photoURL: userPhoto,
                  }).then(function() {
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
                  displayName: displayName,
                  photoURL: userPhoto,
                }).then(function() {
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
        })
        .catch((error) => {
          toastr['error']('Your provided current password may not matched', "Profile updation irterrupted");
        });
   });

   