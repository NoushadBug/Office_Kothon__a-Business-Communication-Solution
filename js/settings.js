let userBio,userPhoto,userDesignation, myBlob, convertedImage, height, width,dbPhrase;

document.getElementById('signout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    localStorage.setItem("theme","dark") 
      toastr['info']('You are signed out! ', 'see you soon');
      });
      window.location.replace("./index.html");
  });

$(document).ready(function(){
  $('.uploader').fadeOut();
  if(localStorage.getItem("theme") == "dark"){
    $('.toggle-checkbox').click();
  }

  $(".toggle-checkbox").click(function(){

   var temp;
    if(localStorage.getItem("theme") == "dark")
    {
      temp = "light";
      console.log(localStorage.getItem("temp"))
    }
    if(localStorage.getItem("theme") == "light")
    {
      temp ="dark"
      
    }
 
    localStorage.setItem("theme",temp) 
    changeTheme();
  });



  db.collection("users").onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.id == auth.currentUser.email) {
        if(doc.data().designation == 'unknown'){
          window.location.replace('./userNotVerified.html');
        }else{
        $('#userImage').attr("src", `${doc.data().photoURL}`);
        $('.userName').html(`${doc.data().displayName}`);
        $('#settings-name').val(`${doc.data().displayName}`);
        $('.designation').html(`${doc.data().designation}`);
        $('.bio').text(`${doc.data().bio}`);
        $('#bioDetails').val(`${doc.data().bio}`);
        userBio = doc.data().bio;
        userPhoto = doc.data().photoURL;
        userDesignation = doc.data().designation;}
      }
  });

  db.collection("pass").doc("phrase").onSnapshot(function(snap) { dbPhrase = snap.data().passPhrase})
  changeTheme();

  $('.loader').fadeOut('slow');
},
error => {
    if(error.code == 'resource-exhausted'){
        window.location.replace("../quotaExceeded.html");
    }
})

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
          //  height = this.height;
          //  width = this.width;
          // if(height / width != 1) {
            done(reader.result);
          // }
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
			width: 200,
			height: 200
		});

		canvas.toBlob(function(blob){
      myBlob = blob;
			let url = URL.createObjectURL(blob);
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

    $('.taskForm form').on('submit',function(e){
      e.preventDefault();
      let currentPass = $('#userPass').val();
      let newPass = $('#settings-pass').val() == ''? 'oldPass' : $('#settings-pass').val();
      let displayName = $('#settings-name').val() == ''? auth.currentUser.displayName : $('#settings-name').val();
      let bioDetails = $('#bioDetails').val() == ''? userBio : $('#bioDetails').val();
      let profilePic = $('#profilePic')[0].files;

      //console.log(auth);
      if(displayName.toLowerCase() == 'admin'){
        $('#settings-name').val('');
        toastr['error'](`Provide a different display name instead 'admin'`, 'Invalid display name');
      }
      else{
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
                                    db.collection("pass").doc(auth.currentUser.email).set({pass: CryptoJS.AES.encrypt(newPass, dbPhrase)})
                                    .then(function() {
                                      $('.uploader').fadeOut('slow');
                                      toastr['success']('updated user information sucessfully', 'updated information');
                                    })
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
                    db.collection("pass").doc(auth.currentUser.email).set({pass: CryptoJS.AES.encrypt(newPass, dbPhrase)})
                    .then(function() {
                      $('.uploader').fadeOut('slow');
                      toastr['success']('updated user information sucessfully', 'updated information');
                    })
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
        })
        .catch((error) => {
          $('.uploader').fadeOut()
          toastr['error']('Your provided current password may not matched', "Profile updation irterrupted");
        });
      }

   });

   