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
  var form_ele = '.form';

// make eveything disabled
var disableFormEdit = function(selector){	
  $(selector).removeClass('form--enabled').addClass('form--disabled');
	$(selector + ' input, textarea,' + selector + ' select, ' + selector + ' button').prop('disabled', true);
}


// make eveything enabled
var enableFormEdit = function(selector){	
	$(selector + ' input,textarea, ' + selector + ' select, ' + selector + ' button ').prop('disabled', false);
  $(selector).removeClass('form--disabled').addClass('form--enabled');
}


disableFormEdit(form_ele);


$('.js-toggleForm').click(function(){
   // get the status of form
  var form_status = $(form_ele).hasClass('form--disabled') ? 'disabled' : 'enabled';
  
  // check if disabled or enabled
  switch (form_status){
    case 'disabled':
      enableFormEdit(form_ele);
      $(this).text('undo')
      break;
    case 'enabled':
      disableFormEdit(form_ele);
      $(this).text('click to edit')
      break;
  }
});

  
    })