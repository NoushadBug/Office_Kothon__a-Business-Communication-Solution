$(document).ready(function () {
  $(sliCont).css('width', '0')
  $('[data-toggle="tooltip"]').tooltip();   
});



//// slide out search
var sliBtn = '.search-btn',
  sliCont = '.search-slide',
  sliTxt = '.search-slide input[type=text]',
  sliSpd = 300;
let searchClicked = false;

$(sliBtn).click(function () {
  if(!searchClicked) {
   // $(sliTxt).val('');
    $(sliCont).animate(
      { 'width': '46vw' }, sliSpd
    );
    $(sliTxt).focus();
    searchClicked = true;
  }
  else {
    $(sliCont).animate(
      { 'width': 0 }, sliSpd
    );
    searchClicked = false;
  }
});
