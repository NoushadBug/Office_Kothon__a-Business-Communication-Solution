var eventsInfo = [];
var events = [];

function noticeColor(color)
{
  var reply;
  switch(color)
  {
     case 'Meeting':
      reply = `<i class="fa fa-circle text-info"></i>`
      break;
      case 'Notice':
        reply = `<i class="fa fa-circle text-warning"></i>`
        break;
      case 'Event':
        reply = `<i class="fa fa-circle text-danger"></i>`
        break;

  }
  return reply ;

}







function checkFileAvailability(str,dec){
  if(str === 'null'){
  return `<i class="fa fa-paperclip text-secondary${dec}"></i>`;
  }
  else{
    return  `<i class="fa fa-paperclip text-light${dec}"></i>`
  }
}

function renderPriorities(priority){
  var returnedCode;
  switch(priority){
    case 'low':
      returnedCode =  `<i class="fa fa-bolt text-info"></i>`;
    break;
    case 'moderate':
      returnedCode = `<i class="fa fa-bolt text-danger"></i>`;
    break;
    case 'hard':
      returnedCode =  `<i class="fa fa-bolt text-warning"></i>`;
    break;
    default:
      returnedCode =   `<i class="fa fa-bolt text-light"></i>`;
    break;
  }
return returnedCode;
}

function eventcalender(docs)
{
  events = [];
  var renderedToastrs = false;
  docs.forEach(function(doc, index)
  {
    if(doc.data().postType == 'Event')
    {
      events.push(doc.data());
      eventsInfo.push({
        title: doc.data().title ,
        date: new Date(doc.data().EventDate) ,
        link:doc.data().EventLink,
        });
        console.log( new Date(doc.data().EventDate).toISOString().substring(0, 10))
        console.log( new Date().toISOString().substring(0, 10))

          if (new Date(doc.data().EventDate).toISOString().substring(0, 10) == new Date().toISOString().substring(0, 10))
          {
            if(localStorage.getItem("firsttime")!="true" && localStorage.getItem("hasEventToday") == 'false')
            {
              toastr['success']( "Today's Event: "+doc.data().title, 'On this day');
              localStorage.setItem("firesttime" ,"true")
            }
            renderedToastrs = true;
          }
          else{
            if(localStorage.getItem("hasEventToday") == 'false'){
              localStorage.setItem("firesttime" ,"false")
            }
          }
    }
    if((index+1) == docs.length && renderedToastrs){
      localStorage.setItem("hasEventToday" ,"true")
    }
  })

$("#calendar").MEC({
  events: eventsInfo,
});


$('#calendar #calLink').on("click", function(e){
  if($('#calendar #calLink').text() != 'VIEW EVENT'){
    e.preventDefault();
    e.stopPropagation();
    if($('#eventListModal').length == 0){
      $(`<!-- Modal -->
      <div class="modal fade" id="eventListModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
        <div class="modal-dialog modal-dialog-centered " role="document">
            <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                <div class="modal-header shadow-lg" style="border: 0;">
                    <h6 class="modal-title" id="exampleModalLongTitle">All Events</h6>
                    <button type="button" class="close btn text-light shadow-none btnClose" data-dismiss="modal" onclick="${$('#eventListModal').modal('hide')}" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body shadow-lg scrollbar" id="eventListDiv" style="background:#2e3035;font-size: 88% !important;">
  
                </div>
                <div class="modal-footer shadow-lg" style="border: 0;">
                    <button type="button" id="submitPass" data-dismiss="modal" class="submitPass container btn px-5 btn-info rounded-pill shadow-lg" >Close</button>
                </div>
            </div>
          </div>
          </div>
    </div>`).appendTo('body');
  }
  $('#eventListModal').modal('show');
  $('#eventListDiv').empty()
  events.forEach(function(doc, index)
  {
    $(` <div class="panel panel-default feeditem shadow-lg bg-dark modalPanel text-light mb-2 rounded shadow-lg" id="${events.id}" style="">
          <div class="panel-heading p-3 row p-3 collapsed" href="#collapseModal${index}" data-toggle="collapse"
            data-parent="#accordion" aria-expanded="false">
            <div class="title-header col-6">
              <h6 class="panel-title d-inline" aria-label="view" data-microtip-position="right" role="tooltip">
              ${events[index].title}
              </h6>
            </div>
            <div class="header-side col-6 m-auto">
              <div class=" shadow-lg border  border-info d-inline  px-3 py-1" style="border-radius: 2em;">
                <span aria-label="${events[index].priority}"
                    data-microtip-position="left" role="tooltip">${renderPriorities(events[index].priority.toLowerCase())}</span>
                <a href="#0">${checkFileAvailability(events[index].file, ' mr-0')}</a>
              </div>
            </div>
          </div>
          <div id="collapseModal${index}" class="panel-collapse collapse in">
            <div class="collapse-header row mt-3 mx-auto">
              <div class="col-4">
                <p> ${new Date(parseInt(events[index].date)).toLocaleString()}</p>
              </div>
              <div class="status col-4">
                <i class="fa fa-circle"></i>
                <p class="d-inline"> ${events[index].postType}</p>
              </div>
              <div class="view-button col-4">
                <a href="#" class="btn btn-primary btn-sm disabled" role="button" aria-pressed="true">View File</a>
              </div>
            </div>
            <div class="panel-body row mx-3 pb-3">
            ${events[index].description}
            </div>
          </div>
        </div>
  
        </div>`).appendTo('#eventListDiv');
  })
  
  console.log(events)
  changeTheme();
  }
})

 // calLink

// $('#calLink').on("click", function(){
//   alert('fsd')
// })
}

function renderFiles(fileString){
  var returnedElement,
    res = fileString.split("`");
    for (let index = 1; index < res.length; index++) {
      if(index%2 != 0){
        if(index == 1){returnedElement = `<br><small class="text-center mx-2">${res[index]}</small><a style="font-size:0.75em !important;" class="text-light m-0 font-italic" href="${res[index+1]}" target="_blank" ><i class="fa fa-external-link mr-1 text-info" style="font-size: 115%;"></i></a>`;}
      else{returnedElement = returnedElement + `<small class="text-center mx-2">${res[index]}</small><a style="font-size:0.75em !important;" class="text-light m-0 font-italic" href="${res[index+1]}" target="_blank" ><i class="fa fa-external-link mr-1 text-info" style="font-size: 115%;"></i></a>`;}
      }
         //console.log(index + " => "+ returnedElement)
    }
    return returnedElement;

}

function renderList(docs)
{
  $('#accordion').empty();
      docs.forEach(function(doc, index)
      {
        var fileElement = doc.data().file == 'null'? `<a href="#0" class="btn btn-primary disabled btn-sm viewFile" role="button" aria-pressed="true" id="${index}">View File</a>` : `<a href="#0" class="btn btn-primary btn-sm viewFile" role="button" aria-pressed="true" id="${index}">View File</a>`;
        $(` <div class="panel panel-default feeditem shadow-lg bg-dark text-light mb-2 rounded shadow-lg" id="${doc.id}" style="">
        <div class="panel-heading p-3 row p-3 collapsed" href="#collapse${index}" data-toggle="collapse"
          data-parent="#accordion" aria-expanded="false">
          <div class="title-header col-6">
            <h6 class="panel-title d-inline" aria-label="view" data-microtip-position="right" role="tooltip">
            ${doc.data().title}
            </h6>
          </div>
          <div class="header-side col-6 m-auto">
            <div class=" shadow-lg border  border-info d-inline  px-3 py-1 panelFile" style="border-radius: 2em;">
            ${checkFileAvailability(doc.data().file,'')}
              <span aria-label="${doc.data().priority}"
                  data-microtip-position="left" role="tooltip">${renderPriorities(doc.data().priority.toLowerCase())}</span>
              <a href="#0"><i class="fa fa-bell text-secondary mr-0"></i></a>
            </div>
          </div>
        </div>
        <div id="collapse${index}" class="panel-collapse collapse in">
          <div class="collapse-header row mt-3 mx-auto">
            <div class="col-4">
              <p> ${new Date(parseInt(doc.data().date)).toLocaleString()}</p>
            </div>
            <div class="status col-4">
           ${noticeColor(doc.data().postType)}
              <p class="d-inline"> ${doc.data().postType}</p>
            </div>
            <div class="view-button col-4">
            ${fileElement}</div>
          </div>
          <div class="panel-body row mx-3 pb-3">
          ${doc.data().description}
          </div>
        </div>
      </div>

      </div>`).appendTo('#accordion');
      });
      window.addEventListener('storage', function(e) {  
        changeTheme();
       });
       changeTheme();
      $('.loader').fadeOut('slow');

      $('.viewFile').on( "click",function(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = $(this).attr('id');
        let str = docs[id].data().file;
        if($('#fileModal'+id).length == 0){
          $(`<!-- Modal -->
          <div class="modal fade" id="fileModal${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" style="display: block;">
            <div class="modal-dialog modal-dialog-centered " role="document">
                <div class="modal-content shadow-lg text-light bg-dark" style="border-radius: 2em; box-shadow: 0px 2px 15px #041f4b !important;">
                    <div class="modal-header shadow-lg" style="border: 0;">
                        <h6 class="modal-title" id="exampleModalLongTitle">View Files</h6>
                        <button type="button" class="close btn text-light shadow-none btnClose" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body shadow-lg ">
                        <p class="text-center text-light m-auto">${renderFiles(str)}</p>
                    </div>
                    <div class="modal-footer shadow-lg" style="border: 0;">
                        <button type="button" data-dismiss="modal" class="mx-auto btn px-5 btn-secondary rounded-pill shadow-lg">close</button>
                    </div>
                </div>
              </div>
              </div>
        </div>`).appendTo('body');
        }
        let $modal = $('#fileModal'+id);
        $modal.modal('show');
      })

}





$(document).ready(function () {

  db.collection("users").get()
  .then(function (querySnapshot) {

      querySnapshot.forEach(function (doc) {
          if (doc.id == auth.currentUser.email) {
            if(doc.data().displayName.indexOf('isNewUser') !== -1){
              db.collection("users").doc(doc.id).set({
                displayName: doc.data().displayName.split('isNewUser')[0],
            },{merge:true})
          }
            if(doc.data().designation == 'unknown'){
              window.location.replace('./userNotVerified.html');
            }else{
              $('#userimage').attr("src", `${doc.data().photoURL}`);
              console.log('photo load ')
            }

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
        timeOut: '10000',
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
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

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

var firstTime = false;

db.collection("notice").onSnapshot(function(snapshot) {

    console.log(snapshot)
    eventcalender(snapshot.docs);
    renderList(snapshot.docs);

  if(firstTime)
  {
    snapshot.docChanges().forEach(function(change)
    {
      toastr['info']('Notice ' + change.type + ' on notice list' , 'Notice Update');

    })

  }
  else{
    firstTime = true;
  }

  },
  error => {
      if(error.code == 'resource-exhausted'){
          window.location.replace("../quotaExceeded.html");
      }
  });

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

})