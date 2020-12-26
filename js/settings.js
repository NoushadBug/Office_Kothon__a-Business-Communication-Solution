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
  