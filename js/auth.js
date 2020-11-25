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
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
         toastr["success"]("you are good to go!", "successfully signed up")
         signUpform.find('input:not(#signUpButton)').val('');
        //  auth.signOut().then(() => {
        //     console.log(prevUser+' has been logged out');
        // })
        $('#login-button').click();
    })
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
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
         toastr["success"]("you are good to go!", "Successfully signed up")
         signUpformSmall.find('input:not(#signUpButton)').val('');
         auth.signOut().then(() => {
             console.log('user has been logged out');
         })
         toggleLogin();
    })
    
 });


//  login functionalities

const loginForm = $('.user_forms-login');
loginForm.on('submit', function(e) {
    e.preventDefault();
    const email = loginForm.find('#email')[0].value;
    const password = loginForm.find('#password')[0].value;

    auth.signInWithEmailAndPassword(email, password).then( cred => {
        console.log(cred.user);
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
         toastr["info"]("you are logged in!", "hello "+auth.currentUser.displayName);
         document.cookie = "username="+encodeURIComponent(auth.currentUser.displayName);
         window.location.replace("./success.html");
    })
})