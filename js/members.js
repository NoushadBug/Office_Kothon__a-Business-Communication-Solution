var firstTime = false;
var entryText = 'Click on any card to give a designation and approve';
var addressCard = $('.fa-address-card').clone();
var docIds = [];
var docDatas = [];
var dbPhrase, cardClicked = false;
var passRecord = new Map();

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var autoSignOut = false;
var updateTime = false;
var adminMail;
//make firebase consts
const auth = firebase.auth();
auth.onAuthStateChanged(function (user) {
    if (!user && !autoSignOut) {
        window.location.replace('./index.html');
    }
    if (user) {
        if (user.displayName != 'admin' && user.displayName.indexOf('isNewUser') == -1 && user.displayName.indexOf('isUnknown') == -1 &&  !autoSignOut) {
            window.location.replace('./dashboard.html');
        }
        else if (user.displayName == 'isUnknown') {
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


function validateDesignation(element){
    var decision;
    if(element.val().toLowerCase() == ''){
        toastr['error'](`Provide a designation`, 'Invalid designation');
        decision = false;
    }
    if(element.val().toLowerCase() == 'admin'){
        toastr['error'](`Provide a different designation instead 'admin'`, 'Invalid designation');
        decision = false;
    }
    else{
        decision = true;
    }
    return decision;
}


function showModalDialog(param){
    var text,id,placeholder,title,dsgntn,uId, modalId,type, modalName,submitId;
    if(typeof(param) == 'string'){
        uId = param.split('edit')[1];
        dsgntn = docDatas[parseInt(uId)].designation
        text = 'Enter new designation to update:';
        placeholder = 'enter designation';
        type='text'
        title = 'Edit '+docDatas[parseInt(uId)].displayName
        modalId = 'editDesignation'
        id = 'Edit';
        modalName = 'editModal'
        submitId = 'confirmDesignation'+uId;
        $('#'+modalName+uId).find("input[type=text], textarea").val(dsgntn);
    }
    else{
        title = 'Enter Admin Password';
        text = 'Enter your password to continue:'
        placeholder = 'enter your password'
        modalId = 'adminPass'
        type = 'password'
        dsgntn = '';
        modalName = 'confirmModal'
        id = param == undefined? '': param.toString();
        uId = id;
        submitId = 'submitPass';
        $('#'+modalName+uId).find("input[type=password], textarea").val("");
    }

    if($('#'+modalName+uId).length == 0){
        $(`<!-- Modal -->
        <div class="modal fade" id="${modalName+uId}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
        <div class="modal-dialog modal-dialog-centered " role="document">
            <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                <div class="modal-header shadow-lg" style="border: 0;">
                <h6 class="modal-title" id="exampleModalLongTitle">${title}</h6>
                <button type="button" class="close btn text-light shadow-none" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body shadow-lg " style="background:#2e3035">
                <p class="text-info">${text}</p>
                <input id="${modalId+uId}" placeholder="${placeholder}" class="text-light bg-dark border-info rounded-pill form-control" type="${type}" value="${dsgntn}" required >
            </div>
            <div class="modal-footer shadow-lg" style="border: 0;">
                <button type="button" id="${submitId}" class="submitPass ml-auto btn px-5 btn-info rounded-pill shadow-lg" >Continue</button>
            </div>
        </div>
        </div>
        </div>
    </div>`).appendTo('body');}
    $('#'+modalName+uId).modal('show');
}

$(document).ready(function () {

    function update(){
        updateTime = false;
        docIds = [];
        docDatas = [];
        var index = -1;
        db.collection("users").get()
        .then(function (querySnapshot) {
            $('#force-overflow1').empty();
            $('#force-overflow').empty();
            console.log('updated')
            $('.loader').fadeOut('slow');
            querySnapshot.forEach(function (doc) {
                index++;
                docIds.push(doc.id);
                docDatas.push(doc.data());
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
                                <button class="btn py-1 fa fa-pencil text-secondary" id="editMember${index}"  data-id="${doc.data().designation}"></button>
                                <button class="btn fa py-1 fa-trash text-secondary" id="deleteMember${index}"></button>
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
                                <button class="py-1 btn fa fa-pencil text-secondary" id="editMember${index}" data-id="${doc.data().designation}"></button>
                                <button class="fa py-1 btn fa-trash text-secondary" id="deleteMember${index}"></button>
                            </div>
                            </div>`).appendTo('#force-overflow');
                    }
                }
                //console.log(doc.id, " => ", doc.data());
            });

            $('#force-overflow .fa-pencil').click(function () {
                var clickedIndex = $(this).attr('id').split("editMember")[1];
                console.log(clickedIndex)
                showModalDialog('edit'+clickedIndex);
                $('#confirmDesignation'+clickedIndex).on("click", function (e) {
                    if(validateDesignation($('#editDesignation'+clickedIndex)) && $('#editDesignation'+clickedIndex).val()!=''){
                        $('#editModal'+clickedIndex).modal('hide')
                        var desVal = $('#editDesignation'+clickedIndex).val();
                        db.collection("users").doc(docIds[clickedIndex]).set({
                            designation : desVal
                        }, { merge: true })
                        .then(() => {
                            update()
                            $('#editModal'+clickedIndex).remove();
                            toastr['success']('updated designation successfully! ', 'updated '+docDatas[clickedIndex].displayName.split('isNewUser')[0]);
                        });
                    }
                })
            })

            $('#force-overflow .fa-trash').click(function () {
                var userID = $(this).attr('id').split("deleteMember")[1];
                var userMail = docIds[userID]
                console.log(dbPhrase)
                var selectedPass = CryptoJS.AES.decrypt(passRecord.get(userMail), dbPhrase).toString(CryptoJS.enc.Utf8);
                showModalDialog(4);
                $('#confirmModal4 #submitPass').on("click", function (e) {
                    var adminPass = $('#confirmModal4 #adminPass4').val()
                        auth.signInWithEmailAndPassword(adminMail, adminPass).then((user) => { 
                            $('.uploader').fadeIn('slow');
                            $('#confirmModal4').modal('hide');
                            autoSignOut = true;
                            // sign up the user
                            auth.signInWithEmailAndPassword(userMail, selectedPass).then(cred => {
                                            auth.currentUser.delete().then(data => {
                                                auth.signOut().then(() => {
                                                    auth.signInWithEmailAndPassword(adminMail, adminPass).then(() => {
                                                        const userCollection = db.collection("users").where(firebase.firestore.FieldPath.documentId(),'==', userMail);
                                                        userCollection.get().then(function(querySnap) {
                                                            querySnap.forEach(function(doc) {
                                                                doc.ref.delete()
                                                                .then(function () {
                                                                    update();
                                                                    db.collection("users").onSnapshot(function (snapshot) {
                                                                        update();
                                                                    });
                                                                    db.collection("pass").where(firebase.firestore.FieldPath.documentId(),'==', userMail).get().then(function(querySnap) {
                                                                        querySnap.forEach(function(document) {
                                                                            document.ref.delete();
                                                                        })
                                                                    }).then(function () {
                                                                            clearStuffs();
                                                                            $('.uploader').fadeOut('slow');
                                                                            toastr["success"]("Successfully!", userMail+" deleted")
                                                                        })
                                                                        clearStuffs();
                                                                    })
                                                })
                                            });
                                        }).catch(function (error) {
                                            $('.uploader').fadeOut('slow');
                                            $('#confirmModal4').modal('hide');
                                            toastr["error"](error.message, error.code)
                                        });
                                        });
                                })
                            })
                        }).catch(error => {
                            $('.uploader').fadeOut('slow');
                            $('#confirmModal4').modal('hide');
                            toastr["error"](error.code, error.message)
                        });
            });

            })

            $('.deleteApproval').click(function () {
                var selectedMail = $(this).closest(".card").attr('id')
                var encPass = $(this).closest(".card").attr('data-value').split('isUnknown')[1];
                var selectPass = CryptoJS.AES.decrypt(encPass, dbPhrase).toString(CryptoJS.enc.Utf8);
                console.log(selectPass)
                console.log(dbPhrase)
                showModalDialog(3);
                $('#confirmModal3 #submitPass').on("click", function (e) {
                    var adminPass = $('#confirmModal3 #adminPass3').val()
                    auth.signInWithEmailAndPassword(adminMail, adminPass).then((user) => {
                        $('.uploader').fadeIn('slow');
                        $('#confirmModal3').modal('hide');
                        autoSignOut = false;
                        // sign up the user
                        auth.signInWithEmailAndPassword(selectedMail, selectPass).then(cred => {
                                auth.currentUser.delete().then(data => {
                                    autoSignOut = true;
                                    auth.signOut().then(() => {
                                        auth.signInWithEmailAndPassword(adminMail, adminPass).then(() => {
                                            const userCollection = db.collection("users").where(firebase.firestore.FieldPath.documentId(),'==', selectedMail);
                                            userCollection.get().then(function(querySnap) {
                                                querySnap.forEach(function(doc) {
                                                    doc.ref.delete();
                                                });
                                            }).then(function () {
                                                update()
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

            // member approval section
            $('#force-overflow1 .card').click(function () {
                cardClicked = true;
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
                    showModalDialog(2);
                    $('#confirmModal2 #submitPass').on("click", function (e) {
                        var adminPass = $('#confirmModal2 #adminPass2').val()
                        auth.signInWithEmailAndPassword(adminMail, adminPass).then((user) => { 
                            $('#confirmModal2').modal('hide');
                            var email = thisId;
                            var designation = $('#designationField').val();
                            var encrPass = thisValue.split('isUnknown')[1];
                            var newDisplay = thisValue.split('isUnknown')[0];
                            autoSignOut = false;
                            var password = CryptoJS.AES.decrypt(encrPass, dbPhrase).toString(CryptoJS.enc.Utf8);
                            // sign up the user

                            if(validateDesignation($('#designationField'))){
                                $('.uploader').fadeIn('slow');
                                auth.signInWithEmailAndPassword(email, password).then(cred => {
                                    auth.currentUser.updateProfile({
                                        displayName: thisValue.split('isUnknown')[0]+ 'isNewUser', //setting up the user name with account display name
                                        photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                    }).then(data => {
                                            autoSignOut = true;
                                            auth.signOut().then(() => {
                                                auth.signInWithEmailAndPassword(adminMail, adminPass).then(() => {
                                                    const userCollection = db.collection("users");
                                                    userCollection.doc(email).set({
                                                        displayName: newDisplay.split('isUnknown')[0]+ 'isNewUser',
                                                        designation: designation,
                                                        bio: 'Bio not updated yet',
                                                        photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                                    }).then(function () {
                                                        db.collection("pass").doc(email).set({
                                                            pass: encrPass
                                                        }).then(function () {
                                                            clearStuffs();
                                                            update();
                                                            db.collection("users").onSnapshot(function (snapshot) {
                                                                update();
                                                            });
                                                            $('.uploader').fadeOut('slow');
                                                            toastr["success"]("Successfully!", "New member created ")
                                                        })
                                                })
                                            })
                                        }).catch(function (error) {
                                            $('.uploader').fadeOut('slow');
                                            toastr["error"](error.message, error.code)
                                        });
                                    });
                                })
                            }
                        }).catch(error => {
                                $('.uploader').fadeOut('slow');
                                $('#confirmModal2').modal('hide');
                                toastr["error"](error.code, error.message)
                                console.log(error.code, error.message)
                        });
                });
                });
            });
        })
        .catch(function (error) {
            toastr['error']('Error getting documents: ', error);
        });
    }

    db.collection("pass").doc('phrase').onSnapshot(function(snap) {
        dbPhrase = snap.data().passPhrase
    })
    update();

    db.collection("users").onSnapshot(function (snapshot) {
        if(firstTime){update();}else{firstTime = true;}
    },
    error => {
        if (error.code == 'resource-exhausted') {
            window.location.replace("../quotaExceeded.html");
        }
    });

    db.collection("pass").get().then(function(snap) {
         passRecord = new Map();
         snap.forEach(function (doc) {
            if (doc.id != 'phrase') {
                passRecord.set(doc.id, doc.data().pass);
            }
        });
    })

    $('.uploader').fadeOut('slow');
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".dfeed-bar .card").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
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

    if(cardClicked){
        $('#selected_name').text(entryText);
        $('.cardDiv').empty();
        $('.approvalBar p').html('<br>')
        $(addressCard).appendTo('.approvalBar');
        cardClicked = false;
    }

    $('.uploader').fadeOut('slow');
    db.collection("pass").get().then(function(snap) {
        passRecord = new Map();
        snap.forEach(function (doc) {
            if(doc.id != 'phrase'){
                passRecord.set(doc.id, doc.data().pass);
            }
       });
   })
    autoSignOut = false;
}

signUpform.on('submit', function (event) {

    event.preventDefault();
    showModalDialog();
    $('#confirmModal #submitPass').on("click", function (e) {
        var adminPass = $('#confirmModal #adminPass').val()
        auth.signInWithEmailAndPassword(auth.currentUser.email, adminPass).then((user) => {
            $('#confirmModal').modal('hide');
            var name = $('.taskForm2 #name').val();
            var email = $('.taskForm2 #email').val();
            var designation = $('.taskForm2 #designation').val();
            var password = $('.taskForm2 #password').val();
            var encryptedPass = CryptoJS.AES.encrypt(password, dbPhrase).toString()
            // sign up the user
            if(validateDesignation($('.taskForm2 #designation'))){
                $('.uploader').fadeIn('slow');
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
                                    console.log(auth.currentUser.email)
                                    db.collection("pass").doc(email).set({
                                        pass: encryptedPass
                                    }).then(function () {
                                        update();
                                        db.collection("users").onSnapshot(function (snapshot) {
                                            update();
                                        });
                                        clearStuffs();
                                        $('.uploader').fadeOut('slow');
                                        toastr["success"]("Successfully!", "New member created ")
                                     })
                                })
                            }).catch(function (error) {
                                toastr["error"](error.message, error.code)
                            });
                        }).catch(function (error) {
                            toastr["error"](error.message, error.code)
    
                        });
                    });
                })
            }

        }).catch(error => {
            $('#confirmModal').modal('hide');
            toastr["error"](error.code, error.message)
        });
    })
});



document.getElementById('signout').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        localStorage.setItem("theme",'dark') 
        toastr['info']('You are signed out! ', 'see you soon');
    });
    window.location.replace("./index.html");
});

});