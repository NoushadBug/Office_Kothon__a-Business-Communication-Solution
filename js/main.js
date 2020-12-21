/**
 * Variables
 */
$('#signup-form').hide();
var w = window.outerWidth;
var h = window.outerHeight;
resizeTrigger();

const signupButton = document.getElementById('signup-button'),
    loginButton = document.getElementById('login-button'),
    userForms = document.getElementById('user_options-forms')

/**
 * Add event listener to the "Sign Up" button
 */
signupButton.addEventListener('click', () => {
  userForms.classList.remove('bounceRight')
  userForms.classList.add('bounceLeft')
}, false)

/**
 * Add event listener to the "Login" button
 */
loginButton.addEventListener('click', () => {
  userForms.classList.remove('bounceLeft')
  userForms.classList.add('bounceRight')
}, false)

function resizeTrigger(){
  if(window.innerWidth < 697){
    $(".kausa").css("display","content");
    var elem_position = $('.form-modal').offset().top;
    var window_height = $(window).height();
    var y = elem_position - window_height/2;
    window.scrollTo(0,y+150);
    $('.user').hide();
    $('.form-modal').show();
  }
  else if(window.innerWidth < 835 && window.innerWidth > 699){
    $(".kausa").css("display","block");
    $('.user').show();
    $('.form-modal').hide();
  }
  else
  {
    $(".kausa").css("display","");
    $(".kausa").css("display","content");
    $('.user').show();
    $('.form-modal').hide();
  }
}

$(window).on('load', function() {
  // initialization of header
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        if(user.v.b == 4 && !$('.user_forms-signup').data('clicked')){
          window.location.replace("./dashboard.html");
        }
    }
    $('.loader').fadeOut('slow');
  });
  $('#signup-form').hide('slow');
});

function toggleSignup(){
   document.getElementById("login-toggle").style.backgroundColor="rgb(219, 253, 251)";
   document.getElementById("login-toggle").style.color="#222";
   document.getElementById("signup-toggle").style.backgroundColor="#7615b6";
   document.getElementById("signup-toggle").style.color="rgb(219, 253, 251)";
   $('#login-form').hide('slow');
   $('#signup-form').show('slow');
}

function toggleLogin(){
  document.getElementById("login-toggle").style.backgroundColor="#7615b6";
  document.getElementById("login-toggle").style.color="rgb(219, 253, 251)";
  document.getElementById("signup-toggle").style.backgroundColor="rgb(219, 253, 251)";
  document.getElementById("signup-toggle").style.color="#222";
  $('#signup-form').hide('slow');
  $('#login-form').show('slow');
}
