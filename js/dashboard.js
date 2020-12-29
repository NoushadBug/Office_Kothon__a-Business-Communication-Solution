$(document).ready(function () {
 

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
    
      toastr["info"]("Signed in as "+ auth.currentUser.displayName, "Welcome to Office Kothon")
     
     


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

  })