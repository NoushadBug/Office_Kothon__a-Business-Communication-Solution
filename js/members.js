var firstTime = false;
var entryText = 'Click on any card to give a designation and approve';
var addressCard = $('.fa-address-card').clone();

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var autoSignOut = false;
var adminMail;
//make firebase consts
const auth = firebase.auth();
auth.onAuthStateChanged(function (user) {
    if (!user && !autoSignOut) {
        window.location.replace('./index.html');
    }
    if (user) {
        if (user.displayName != 'admin' && user.displayName.indexOf('isNewUser') == -1 && user.displayName.indexOf('isUnknown') == -1) {
            window.location.replace('./dashboard.html');
        }
        else if (user.displayName == 'unknown') {
            window.location.replace('./userNotVerified.html');
        }
        else if (user.displayName == 'admin'){
            adminMail = user.email;
        }
    }
});
const db = firebase.firestore();

//update firebase settings
db.settings({ timestampsInSnapshots: true });

function update(){
    $('#force-overflow1').empty();
    $('#force-overflow').empty();

    db.collection("users").get()
    .then(function (querySnapshot) {
        $('.loader').fadeOut('slow');
        querySnapshot.forEach(function (doc, index) {
            var dName = doc.data().displayName;
            var dispName = dName.split('isNewUser')[0];
            if (doc.id === auth.currentUser.email) {
                if (doc.data().designation == 'unknown') {
                    window.location.replace('./userNotVerified.html');
                }
                if (doc.data().displayName.indexOf('isNewUser') != -1) {
                    $(`<div class="text-left btn card shadow-lg bg-dark p-2 mb-2" id="${doc.id}">
                    <div class="row mx-0 my-auto">
                    <div class="col-md-4 rounded my-auto"><img src="${doc.data().photoURL}" alt="" class="img-responsive" width="100%"></div>
                    <div class="col-md-6 pl-0 m-auto">
                        <h6 class="text-light m-0 d-block">${dispName}</h6>
                        <small class="text-info m-0">${doc.data().designation}</small>
                        </div>
                        <div class="py-2 col-md-2 bg-dark m-auto border border-dark">
                            <i class="py-1 fa fa-pencil text-secondary"></i>
                            <i class="fa py-1 fa-trash text-secondary"></i>
                        </div>
                    </div>`).appendTo('#force-overflow');
                }
            }
            else {
                if (doc.data().designation == 'unknown') {
                    $(`<div class="text-left m-3 px-4 btn card shadow-lg bg-dark py-3 mb-2" id="${doc.id}" data-value="${doc.data().displayName}">
                     <div class="row my-3 cardbar" >
                         <div class="col-md-6 pl-2 m-auto  ">
                             <h6 class="text-light m-0 d-block">${dispName.split('isUnknown')[0]}</h6>
                         </div>
                         <div class="col-md-6  my-auto text-right ">
                             <i class="fa btn deleteApproval fa-times ml-2 text-danger"></i>
                         </div>
                     </div>
                     </div> `).appendTo('#force-overflow1');
                }

                if (doc.data().designation != 'admin' && doc.data().designation != 'unknown'){
                    $(`<div class="text-left btn card shadow-lg bg-dark p-2 mb-2" id="${doc.id}">
                        <div class="row mx-0 my-auto">
                        <div class="col-md-4 rounded my-auto"><img src="${doc.data().photoURL}" alt="" class="img-responsive" width="100%"></div>
                        <div class="col-md-6 pl-0 m-auto">
                            <h6 class="text-light m-0 d-block">${dispName}</h6>
                            <small class="text-info m-0">${doc.data().designation}</small>

                        </div>
                        <div class="py-2 col-md-2 bg-dark m-auto border border-dark">
                            <i class="py-1 fa fa-pencil text-secondary"></i>
                            <i class="fa py-1 fa-trash text-secondary"></i>
                        </div>
                        </div>`).appendTo('#force-overflow');
                }
            }
            //console.log(doc.id, " => ", doc.data());
        });

        $('.deleteApproval').click(function () {
            var selectedMail = $(this).closest(".card").attr('id')
            var encPass = $(this).closest(".card").attr('data-value').split('isUnknown')[1];
            var selectPass = CryptoJS.AES.decrypt(encPass, "Secret Passphrase").toString(CryptoJS.enc.Utf8);

            if($('#confirmModal3').length == 0){
                $(`<!-- Modal -->
                <div class="modal fade" id="confirmModal3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
                <div class="modal-dialog modal-dialog-centered " role="document">
                    <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                        <div class="modal-header shadow-lg" style="border: 0;">
                            <h6 class="modal-title" id="exampleModalLongTitle">Enter Admin Password</h6>
                            <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body shadow-lg " style="background:#2e3035">
                            <p class="text-info">Enter your password to continue:</p>
                            <input id="adminPass" placeholder="enter your password" class="text-light bg-dark border-info rounded-pill form-control" type="password" required />
                        </div>
                        <div class="modal-footer shadow-lg" style="border: 0;">
                            <button type="button" id="submitPass" class="submitPass ml-auto btn px-5 btn-info rounded-pill shadow-lg" >Continue</button>
                        </div>
                    </div>
                    </div>
                    </div>
            </div>`).appendTo('body');
            }
            $('#confirmModal3').modal('show');
            $('#confirmModal3 #submitPass').on("click", function (e) {
                var adminPass = $('#confirmModal3 #adminPass').val()
                auth.signInWithEmailAndPassword(adminMail, adminPass).then((user) => { 
                    $('.uploader').fadeIn('slow');
                    $('#confirmModal3').modal('hide');
                    autoSignOut = false;
                    // sign up the user
                    auth.signInWithEmailAndPassword(selectedMail, selectPass).then(cred => {
                        const userCollection = db.collection("users").where(firebase.firestore.FieldPath.documentId(),'==', selectedMail);
                        userCollection.get().then(function(querySnap) {
                            querySnap.forEach(function(doc) {
                                doc.ref.delete();
                              });
                        }).then(function () {
                            auth.currentUser.delete().then(data => {
                                autoSignOut = true;
                                auth.signOut().then(() => {
                                    auth.signInWithEmailAndPassword(adminMail, adminPass).then(() => {
                                        clearStuffs();
                                        $('.uploader').fadeOut('slow');
                                        $('#selected_name').text(entryText);
                                        $('.cardDiv').empty();
                                        $('.approvalBar p').html('<br>')
                                        $(addressCard).appendTo('.approvalBar');
                                        toastr["success"]("Successfully!", "Member approval deleted")
                                    })
                                })
                            });
                        }).catch(function (error) {
                            $('.uploader').fadeOut('slow');
                            $('#confirmModal3').modal('hide');
                            toastr["error"](error.message, error.code)
                        });
                    })
                }).catch(error => {
                    $('.uploader').fadeOut('slow');
                    $('#confirmModal3').modal('hide');
                    toastr["error"](error.code, error.message)
                });
            })
        })

        $('#force-overflow1 .card').click(function () {
            $('.cardDiv').empty();
            $('#selected_name').removeClass('my-5');
            $('#selected_name').addClass('mt-5');
            $('#selected_name').text($(this).first('h6').text())
            $('.fa-address-card').remove();
            $('#confirmModal').modal('show');
            $('.approvalBar p').text($(this).attr('id'))
            $(`
            <div class="form-group"><input type="text" class="form-control bg-dark shadow-lg text-light  border-info is-disabled" id="designationField" placeholder="Enter Designation" value="" required />
            </div><button type="submit" id="designationConfirm" class="text-center form-control btn btn-secondary  rounded-pill border-info shadow-lg mt-2">submit</button></div>`).appendTo('.cardDiv');
            $('#designationField').focus();
            var thisId = $(this).attr('id');
            var thisValue = $(this).data('value');
            console.log(thisId, thisValue)
            $('.approvalBar').on('submit', function (event) {
                event.preventDefault();
                if($('#confirmModal2').length == 0){
                    $(`<!-- Modal -->
                    <div class="modal fade" id="confirmModal2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
                    <div class="modal-dialog modal-dialog-centered " role="document">
                        <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                            <div class="modal-header shadow-lg" style="border: 0;">
                                <h6 class="modal-title" id="exampleModalLongTitle">Enter Admin Password</h6>
                                <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body shadow-lg " style="background:#2e3035">
                                <p class="text-info">Enter your password to continue:</p>
                                <input id="adminPass" placeholder="enter your password" class="text-light bg-dark border-info rounded-pill form-control" type="password" required />
                            </div>
                            <div class="modal-footer shadow-lg" style="border: 0;">
                                <button type="button" id="submitPass" class="submitPass ml-auto btn px-5 btn-info rounded-pill shadow-lg" >Continue</button>
                            </div>
                        </div>
                        </div>
                        </div>
                </div>`).appendTo('body');
                }
                $('#confirmModal2').modal('show');
                $('#confirmModal2 #submitPass').on("click", function (e) {
                    var adminPass = $('#confirmModal2 #adminPass').val()
                    auth.signInWithEmailAndPassword(adminMail, adminPass).then((user) => { 
                        $('.uploader').fadeIn('slow');
                        $('#confirmModal2').modal('hide');
                        var email = thisId;
                        var designation = $('#designationField').val();
                        var oldDisplay = thisValue.split('isUnknown')[1];
                        var newDisplay = thisValue.split('isUnknown')[0];
                        autoSignOut = false;
                        var password = CryptoJS.AES.decrypt(oldDisplay, "Secret Passphrase").toString(CryptoJS.enc.Utf8);
                        // sign up the user
                        auth.signInWithEmailAndPassword(email, password).then(cred => {
                            auth.currentUser.updateProfile({
                                displayName: thisValue.split('isUnknown')[0]+ 'isNewUser', //setting up the user name with account display name
                                photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                            }).then(data => {
                                const userCollection = db.collection("users");
                                userCollection.doc(email).set({
                                    displayName: newDisplay.split('isUnknown')[0]+ 'isNewUser',
                                    designation: designation,
                                    photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                }).then(function () {
                                    autoSignOut = true;
                                    auth.signOut().then(() => {
                                        auth.signInWithEmailAndPassword(adminMail, adminPass).then(() => {
                                            clearStuffs();
                                            $('.uploader').fadeOut('slow');
                                            toastr["success"]("Successfully!", "New member created ")
                                        })
                                    })
                                }).catch(function (error) {
                                    $('.uploader').fadeOut('slow');
                                    toastr["error"](error.message, error.code)
                                });
                            });
                        })
                    }).catch(error => {
                        $('.uploader').fadeOut('slow');
                        $('#confirmModal2').modal('hide');
                        toastr["error"](error.code, error.message)
                    });
            });
            });
        });




    })
    .catch(function (error) {
        toastr['error']('Error getting documents: ', error);
    });

}

$(document).ready(function () {
    $('.uploader').fadeOut('slow');


    update();

    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".dfeed-bar .card").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    firstTime = true;
});

const signUpform = $('.user_forms-signup')

function clearStuffs() {
    $('#adminPass').val('')
    $('.taskForm2 #name').val('');
    $('.taskForm2 #email').val('');
    $('.taskForm2 #designation').val('');
    $('.taskForm2 #password').val('');
    $('#designationField').val('');
    $('#confirmModal').remove();
    $('#selected_name').text(entryText);
    $('.cardDiv').empty();
    $('.approvalBar p').html('<br>')
    $(addressCard).appendTo('.approvalBar');
    $('.uploader').fadeOut('slow');
    autoSignOut = false;
}

signUpform.on('submit', function (event) {

    event.preventDefault();
    if($('#confirmModal').length == 0){
    $(`<!-- Modal -->
    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
      <div class="modal-dialog modal-dialog-centered " role="document">
          <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
              <div class="modal-header shadow-lg" style="border: 0;">
                  <h6 class="modal-title" id="exampleModalLongTitle">Enter Admin Password</h6>
                  <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">×</span>
                  </button>
              </div>
              <div class="modal-body shadow-lg " style="background:#2e3035">
                  <p class="text-info">Enter your password to continue:</p>
                  <input id="adminPass" placeholder="enter your password" class="text-light bg-dark border-info rounded-pill form-control" type="password" required />
              </div>
              <div class="modal-footer shadow-lg" style="border: 0;">
                  <button type="button" id="submitPass" class="submitPass ml-auto btn px-5 btn-info rounded-pill shadow-lg" >Continue</button>
              </div>
          </div>
        </div>
        </div>
  </div>`).appendTo('body');}
    $('#confirmModal').modal('show');

    $('#submitPass').on("click", function (e) {
        var adminPass = $('#adminPass').val()
        auth.signInWithEmailAndPassword(auth.currentUser.email, adminPass).then((user) => {
            $('.uploader').fadeIn('slow');
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
                    displayName: name + 'isNewUser', //setting up the user name with account display name
                    photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }).then(data => {
                    const userCollection = db.collection("users");
                    userCollection.doc(email).set({
                        bio: 'Bio is not updated yet',
                        displayName: name,
                        designation: designation,
                        photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                    }).then(function () {
                        autoSignOut = true;
                        auth.signOut().then(() => {
                            auth.signInWithEmailAndPassword(adminMail, adminPass).then(() => {
                                clearStuffs();
                                toastr["success"]("Successfully!", "New member created ")
                            })
                        })
                    }).catch(function (error) {
                        toastr["error"](error.message, error.code)

                    });
                });
            })
        }).catch(error => {
            $('#confirmModal').modal('hide');
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

db.collection("users").onSnapshot(function (snapshot) {
    console.log(snapshot)
    if(firstTime){
        firstTime = false;
    }
    else{
        update();
    }
},
    error => {
        if (error.code == 'resource-exhausted') {
            window.location.replace("../quotaExceeded.html");
        }
    });
