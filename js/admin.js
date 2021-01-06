let userPhoto,userDesignation, myBlob, convertedImage, height, width;

document.getElementById('signout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
      localStorage.clear();
      toastr['info']('You are signed out! ', 'see you soon');
      });
      window.location.replace("./index.html");
  });

$(document).ready(function(){
  $('.uploader').fadeOut();
  if(localStorage.getItem("theme") == "dark"){
    $('.toggle-checkbox').click();
  }

  db.collection("users").onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.id == auth.currentUser.email) {
        userPhoto = doc.data().photoURL;
        userDesignation = doc.data().designation;
      }
  });
  $('.loader').fadeOut('slow');
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
                                    $('.uploader').fadeOut('slow');
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
                    $('.uploader').fadeOut('slow');
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
          toastr['error']('Your provided current password may not matched', "Profile updation irterrupted");
        });
   });

   