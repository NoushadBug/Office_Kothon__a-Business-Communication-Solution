$(document).ready(function () {

  
  
  if(auth.currentUser && localStorage.getItem('welcomed')==null )
  {
    alert('sorte dukce');
    localStorage.setItem("welcomed", true);
    toastr["info"]("Signed in as "+ auth.currentUser.displayName, "Welcome to Office Kothon")
  }
  


 

  db.collection("users").get()
  .then(function (querySnapshot) {

      querySnapshot.forEach(function (doc) {
          if (doc.id == auth.currentUser.email) {
            $('#userimage').attr("src", `${doc.data().photoURL}`);
            console.log('photo load ')
            
        
          }
         
         
      });
      console.log('loader fadeout start')
      $('.loader').fadeOut('slow');
      toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        onclick: null,
        showDuration: '300',
        hideDuration: '1000',
        timeOut: '5000',
        extendedTimeOut: '1000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
      };
    
    
     
     


      $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".panel-group .panel").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

  




  $(sliCont).css('width', '0');
  $('[data-toggle="tooltip"]').tooltip();
 
});
// calender
var sampleEvents = [
  {
    title: "Soulful sundays bay area",
    date: new Date().setDate(new Date().getDate() - 7), // last week
    link: "#"
  },
  {
    title: "London Comicon",
    date: new Date().getTime(), // today
    link: "#"
  },
  {
    title: "Youth Athletic Camp",
    date: new Date().setDate(new Date().getDate() + 31), // next month
    link: "#"
  }
];

$("#calendar").MEC({
  events: sampleEvents
});

$("#calendar").MEC({
  events: sampleEvents,
  from_monday: true
});

//// slide out search
var sliBtn = '.search-btn',
  sliCont = '.search-slide',
  sliTxt = '.search-slide input[type=text]',
  sliSpd = 300;
let searchClicked = false;

$(sliBtn).click(function () {
  if (!searchClicked) {
    // $(sliTxt).val('');
    $(sliCont).animate({ width: '46vw' }, sliSpd);
    $(sliTxt).focus();
    searchClicked = true;
  } else {
    $(sliCont).animate({ width: 0 }, sliSpd);
    searchClicked = false;
  }
});
// weather js
// api key : 82005d27a116c2880c8f0fcb866998a0

// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const locationElement = document.querySelector(".location p");


// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "4219c65233a9df06329c72c8bee9f117";
const descElement = document.querySelector(".temperature-description p");
// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}



// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
  toastr['error']('Weather update will not be shown', 'Location denied by user');
    // notificationElement.style.display = "block";
    // notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    descElement.innerHTML = weather.description;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

  })