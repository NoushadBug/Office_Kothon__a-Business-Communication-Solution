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
    $('.user').children().remove();

  }
  else
  {
    $('.user').children().add();
  }
}

$(window).on('load', function() {
  // initialization of header
  $('.loader').fadeOut('slow');
  $('#signup-form').hide('slow'); 
});


function toggleSignup(){
   document.getElementById("login-toggle").style.backgroundColor="#fff";
   document.getElementById("login-toggle").style.color="#222";
   document.getElementById("signup-toggle").style.backgroundColor="#57b846";
   document.getElementById("signup-toggle").style.color="#fff";
   $('#login-form').hide('slow'); 
   $('#signup-form').show('slow');
}

function toggleLogin(){
  document.getElementById("login-toggle").style.backgroundColor="#57B846";
  document.getElementById("login-toggle").style.color="#fff";
  document.getElementById("signup-toggle").style.backgroundColor="#fff";
  document.getElementById("signup-toggle").style.color="#222";
  $('#signup-form').hide('slow'); 
  $('#login-form').show('slow');
}
