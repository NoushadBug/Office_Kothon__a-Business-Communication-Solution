$(document).ready(function(){
    toastr.options = {
        "closeButton": true,"debug": false,"newestOnTop": false,"progressBar": true,"positionClass": "toast-top-right","preventDuplicates": false,"onclick": null,"showDuration": "300","hideDuration": "1000","timeOut": "5000","extendedTimeOut": "1000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"
      }
  });

// signup functionalities

const signUpform = $('.user_forms-signup')
const signUpformSmall = $('#signup-form')


signUpform.on('submit',function(event){
    $(this).data('clicked', true);
    event.preventDefault();
    const name = signUpform.find('#name')[0].value;
    const email = signUpform.find('#email')[0].value;
    const password = signUpform.find('#password')[0].value;
    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        var currentUser = auth.currentUser;
        currentUser.updateProfile({
            displayName: name, //setting up the user name with account display name
        })
        .then(function() {
            const userCollection = db.collection("users");
                userCollection.doc(email).set({
                    displayName: name,
                    designation: 'unknown',
                    photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }).then(function() {
                    console.log("Document successfully written!");
                    auth.signOut().then(() => {
                        console.log('user has been logged out');
                    })
                })
                .catch(function(error) {
                    console.log("Error writing document: ", error);
                });
          });
          toastr["success"]("you are good to go!", "successfully signed up")
          signUpform.find('input:not(#signUpButton)').val('');
            $('#login-button').click();
          console.log(cred.user);

    }).catch( error => {
        toastr["error"](error.code, error.message)
 });
 });

signUpformSmall.on('submit',function(event){
    event.preventDefault();
    const name = signUpformSmall.find('#name')[0].value;
    const email = signUpformSmall.find('#email')[0].value;
    const password = signUpformSmall.find('#password')[0].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        var currentUser = auth.currentUser;
        currentUser.updateProfile({
            displayName: name, //setting up the user name with account display name
        })
        .then(function() {
            const userCollection = db.collection("users");
            userCollection.doc(email).set({
                displayName: name,
            }).then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.log("Error writing document: ", error);
            });
          });

        console.log(cred.user);
         toastr["success"]("you are good to go!", "Successfully signed up")
         firebase.firestore().collection("users").doc(email).set({
            displayName: name,
            // state: "CA",
            // country: "USA"
        }).then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
         signUpformSmall.find('input:not(#signUpButton)').val('');
         auth.signOut().then(() => {
             console.log('user has been logged out');
         })
        toggleLogin();
          
    }).catch( error => {
        toastr["error"](error.code, error.message)
 });
})





//  login functionalities

const loginForm = $('.user_forms-login');
loginForm.on('submit', function(e) {
    e.preventDefault();
    const email = loginForm.find('#email')[0].value;
    const password = loginForm.find('#password')[0].value;

    auth.signInWithEmailAndPassword(email, password).then( cred => {
        console.log(cred);
         toastr["info"]("you are logged in!", "hello "+auth.currentUser.displayName);
         window.location.replace("./dashboard.html");
    }).catch( error => {
        toastr["error"](error.code, error.message)
    });
})

const loginSmallForm = $('#login-form')
loginSmallForm.on('submit', function(e) {
    e.preventDefault();
    const email = loginSmallForm.find('#email')[0].value;
    const password = loginSmallForm.find('#password')[0].value;

    auth.signInWithEmailAndPassword(email, password).then( cred => {
        console.log(cred);
         toastr["info"]("you are logged in!", "hello "+auth.currentUser.displayName);
         window.location.replace("./dashboard.html");
    }).catch( error => {
        toastr["error"](error.code, error.message)
    });
})
