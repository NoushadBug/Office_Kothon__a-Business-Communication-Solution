
$(document).ready(function () {

    // $('#approve_form').h6.val("");


    db.collection("users").get()
        .then(function (querySnapshot) {
            $('.loader').fadeOut('slow');
            $('#force-overflow1 .card').click(function () {
                $('#selected_name').text($(this).first('h6').text())
            });

            querySnapshot.forEach(function (doc) {
                if (doc.id === auth.currentUser.email) {
                    if (doc.data().designation == 'unknown') {
                        window.location.replace('./userNotVerified.html');
                    }
                    else {
                        $('#userImage').attr("src", `${doc.data().photoURL}`);
                        $('.userName').html(`${doc.data().displayName}`);
                        userImage = doc.data().photoURL;
                    }
                }
                else {
                    if (doc.data().designation != 'admin' && doc.data().designation != 'unknown') {
                        $(`<div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${doc.id}">
                <div class="row m-auto">
                <div class="col-md-4 rounded my-auto"><img src="${doc.data().photoURL}" alt="" class="img-responsive" width="100%"></div>
                  <div class="col-md-6 pl-0 m-auto">
                    <h6 class="text-light m-0 d-block">${doc.data().displayName}</h6>
                    <small class="text-info m-0">${doc.data().designation}</small>
                    <div class="dropdown-menu bg-dark shadow-lg text-center" aria-labelledby="dropdownMenuButton" id="myselect">
                    <li class="text-light edit " ><i class="fa fa-pencil text-info mr-2  "></i> Edit</li>
                    <li class="text-light delete" ><i class="fa fa-trash text-info mr-2 " ></i> Delete</li>
                  </div>
                </div>
                    <i class="fa fa-ellipsis-v text-secondary col-md-2 my-auto  " id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                </div>`).appendTo('#force-overflow');
                    }
                }
                //console.log(doc.id, " => ", doc.data());
            });

        })
        .catch(function (error) {
            toastr['error']('Error getting documents: ', error);
        });


    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".dfeed-bar .card").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

const signUpform = $('.user_forms-signup')

function clearStuffs(){
    $('#adminPass').val('')
    $('.taskForm2 #name').val('');
    $('.taskForm2 #email').val('');
    $('.taskForm2 #designation').val('');
    $('.taskForm2 #password').val('');

}

signUpform.on('submit', function (event) {

    event.preventDefault();
    $(`<!-- Modal -->
    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
      <div class="modal-dialog modal-dialog-centered " role="document">
          <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
              <div class="modal-header shadow-lg" style="border: 0;">
                  <h6 class="modal-title" id="exampleModalLongTitle">Confirm Deletion</h6>
                  <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">×</span>
                  </button>
              </div>
              <div class="modal-body shadow-lg " style="background:#2e3035">
                  <p class="text-info">Enter your password to continue:</p>
                  <input id="adminPass" placeholder="enter your password" class="text-light bg-dark border-info rounded-pill form-control" type="password" >
              </div>
              <div class="modal-footer shadow-lg" style="border: 0;">
                  <button type="button" id="submitPass" class="submitPass ml-auto btn px-5 btn-info rounded-pill shadow-lg" >Continue</button>
              </div>
          </div>
        </div>
        </div>
  </div>`).appendTo('body');
  $('#confirmModal').modal('show');

  $('#submitPass').on( "click",function(e) {
    var adminPass = $('#adminPass').val()
    auth.signInWithEmailAndPassword(auth.currentUser.email, adminPass).then((user) => {
    $('#confirmModal').modal('hide');
    var name = $('.taskForm2 #name').val();
    var email = $('.taskForm2 #email').val();
    var designation = $('.taskForm2 #designation').val();
    var password = $('.taskForm2 #password').val();
    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        var newUser = auth.currentUser;
        console.log(newUser)
        //console.log(cred)
        newUser.updateProfile({
            displayName: name+'isNewUser', //setting up the user name with account display name
            photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
        }).then(data => {
            console.log(data)
            const userCollection = db.collection("users");
            userCollection.doc(email).set({
                displayName: name,
                designation: designation,
                photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            }).then(function () {
                auth.signInWithEmailAndPassword(auth.currentUser.email, adminPass).then(() => {
                    clearStuffs();
                    toastr["success"]("Successfully!", "New member created ")
                })
            }).catch(function (error) {
                    console.log("Error writing document: ", error);
            });
            });
    });



    }).catch(error => {
        toastr["error"](error.code, error.message)
     });
  })
});


document.getElementById('signout').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        localStorage.clear()
        toastr['info']('You are signed out! ', 'see you soon');
    });
    window.location.replace("./index.html");
});

