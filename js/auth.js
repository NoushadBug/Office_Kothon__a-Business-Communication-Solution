$(document).ready(function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            // first time signin= 1 => (signout) => login = 4

            if(user.v.b == 4) window.location.replace("./success.html");
        }
    });

    toastr.options = {
        "closeButton": true,"debug": false,"newestOnTop": false,"progressBar": true,"positionClass": "toast-top-right","preventDuplicates": false,"onclick": null,"showDuration": "300","hideDuration": "1000","timeOut": "5000","extendedTimeOut": "1000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"
      }
  });

// signup functionalities

const signUpform = $('.user_forms-signup')
const signUpformSmall = $('#signup-form')


signUpform.on('submit',function(event){
    event.preventDefault();
    const name = signUpform.find('#name')[0].value;
    const email = signUpform.find('#email')[0].value;
    const password = signUpform.find('#password')[0].value;
    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        var currentUser = auth.currentUser;
        currentUser.updateProfile({
            displayName: name, //setting up the user name with account display name
        });
        console.log(cred.user);
         toastr["success"]("you are good to go!", "successfully signed up")
         signUpform.find('input:not(#signUpButton)').val('');
         auth.signOut().then(() => {
            console.log('user has been logged out');
        })
        $('#login-button').click();      
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
        });
        console.log(cred.user);
         toastr["success"]("you are good to go!", "Successfully signed up")
         signUpformSmall.find('input:not(#signUpButton)').val('');
         auth.signOut().then(() => {
             console.log('user has been logged out');
         })
          
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
        console.log(typeof(cred));
         toastr["info"]("you are logged in!", "hello "+auth.currentUser.displayName);
        //  document.cookie = "username="+encodeURIComponent(auth.currentUser.displayName);
         window.location.replace("./success.html");
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
        console.log(typeof(cred));
         toastr["info"]("you are logged in!", "hello "+auth.currentUser.displayName);
        //  document.cookie0 = "username="+encodeURIComponent(auth.currentUser.displayName);
         window.location.replace("./success.html");
    }).catch( error => {
        toastr["error"](error.code, error.message)
    });
})
