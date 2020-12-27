$(document).ready(function(){
  db.collection("users").get()
  .then(function (querySnapshot) {

      querySnapshot.forEach(function (doc) {
          if (doc.id == auth.currentUser.email) {
            $('#userImage').attr("src", `${doc.data().photoURL}`);
            $('.userName').html(`${doc.data().displayName}`);
            $('#settings-name').val(`${doc.data().displayName}`);
            $('.designation').html(`${doc.data().designation}`);
            $('.bio').text(`${doc.data().bio}`);
          }
         
         
      });
      $('.loader').fadeOut('slow');
    
  })

// setting form js
$('.js-edit').on('click', function(){
  $('#settings-pass').val('');
  var $form = $(this).closest('form');
  $form.toggleClass('is-readonly is-editing');
  var isReadonly  = $form.hasClass('is-readonly');
  $form.find('input,textarea').prop('disabled', isReadonly);
});
// drag box js
var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');

// highlight drag area
$fileInput.on('dragenter focus click', function() {
  $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
  $droparea.removeClass('is-active');
});

// change inner text
$fileInput.on('change', function() {
  var filesCount = $(this)[0].files.length;
  var $textContainer = $(this).prev();

  if (filesCount === 1) {
    // if single file is selected, show file name
    var fileName = $(this).val().split('\\').pop();
    $textContainer.text(fileName);
  } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
  }
});
// time js

function startTime() {
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();

  m = checkTime(m);

  var formattedTime = twelveHour(h, m);

  document.getElementById('time').innerHTML = formattedTime;
  document.getElementById('date').innerHTML =
    days[today.getDay()] + ', ' + today.getDate();
  setTimeout(startTime, 500);
}
    function checkTime(i) {
        if (i < 10) {
            i = '0' + i;
        } // add zero in front of numbers < 10
        return i;
    }
    // twelve hour formatted time
    function twelveHour(h, m) {
        var AmOrPm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + m + ' ' + AmOrPm;
    }

})






  