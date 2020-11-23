/**
 * Variables
 */
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
    $('.user').children().hide();
  }
  else
  {
    $('.user').children().show();
  }
}