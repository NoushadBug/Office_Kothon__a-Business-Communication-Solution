$(document).ready(function () {
  $(sliCont).css('width', '0');
  $('[data-toggle="tooltip"]').tooltip();
  $('#calender').simpleCalendar({
    fixedStartDay: 0, // begin weeks by sunday
    disableEmptyDetails: true,
    events: [
      // generate new event after tomorrow for one hour
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() + 24)
        ).toDateString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() + 25)
        ).toISOString(),
        summary: 'Visit of the Eiffel Tower',
      },
      // generate new event for yesterday at noon
      {
        startDate: new Date(
          new Date().setHours(
            new Date().getHours() - new Date().getHours() - 12,
            0
          )
        ).toISOString(),
        endDate: new Date(
          new Date().setHours(
            new Date().getHours() - new Date().getHours() - 11
          )
        ).getTime(),
        summary: 'Restaurant',
      },
      // generate new event for the last two days
      {
        startDate: new Date(
          new Date().setHours(new Date().getHours() - 48)
        ).toISOString(),
        endDate: new Date(
          new Date().setHours(new Date().getHours() - 24)
        ).getTime(),
        summary: 'Visit of the Louvre',
      },
    ],
  });
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
