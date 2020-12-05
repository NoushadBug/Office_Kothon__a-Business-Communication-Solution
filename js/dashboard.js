$(document).ready(function () {
  $(sliCont).css('width', '0');
  $('[data-toggle="tooltip"]').tooltip();
  $('#calender').simpleCalendar({
    //Defaults options below
    //string of months starting from january
    months: [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ],
    days: [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ],
    displayYear: true, // Display year in header
    fixedStartDay: true, // Week begin always by monday or by day set by number 0 = sunday, 7 = saturday, false = month always begin by first day of the month
    displayEvent: true, // Display existing event
    disableEventDetails: false, // disable showing event details
    disableEmptyDetails: false, // disable showing empty date details
    events: [], // List of events
    onInit: function (calendar) {}, // Callback after first initialization
    onMonthChange: function (month, year) {}, // Callback on month change
    onDateSelect: function (date, events) {}, // Callback on date selection
    onEventSelect: function () {}, // Callback on event selection - use $(this).data('event') to access the event
    onEventCreate: function ($el) {}, // Callback fired when an HTML event is created - see $(this).data('event')
    onDayCreate: function ($el, d, m, y) {},
    // Callback fired when an HTML day is created   - see $(this).data('today'), .data('todayEvents')
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
  var t = setTimeout(startTime, 500);
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
