$('.bg-dark').each(function(i, obj) {
    
    $(this).removeClass('bg-dark');
    $(this).addClass('.bg-light');

    //test
});


if(localStorage.getItem('theme') == 'dark')
    {
        $('.dashboard-main').css("background"," #cad1d8")
        $('.dashboard-container').css("background"," #ffffff")
        $('.hello-bar').css("background","#ccdcff")
        $('.scrollbar').css("background","#ccdcff")
        $('.leftbar').css('background','rgb(29 59 88)')
        $('.feeditem').removeClass('bg-dark')
        $('.feeditem').addClass('bg-light')
        $('.date-section').removeClass('text-light')
        $('#date').css('color','darkblue')
        $('#date').css('font-weight','bold')
        $('#time').css('color','rgb(4 4 29)')
        $('#time').css('font-weight','bold')
        $('#calTitle button ').css('background','darkblue')
        $('#calTitle').css('color','darkblue')
        $('#calTitle').css('font-weight','bold')
        $('#calendar').css("background","#ccdcff")
        $('#calThead').css('color', 'black')
        $('#calTbody').css('color', 'black')
 $('#calTbody .a-date.current.event.focused').css('background-color', '#0e345a')       
 $('#calTbody .a-date.current.event.focused').css('color', 'white')       
        $('#eventTitle').css('color', '#0e345a')
        $('#calLink').css('color', 'darkblue')
        $('.temperature-value').css('color', 'white')
        $('.temperature-description').removeClass('text-secondary')
        $('.location').css('color', '#060a0a')
        $('.location').css('font-weight', 'bold')
        $('.weather-container').css('background', 'rgb(29 59 88)')
        $('.weather-container').css('border-radius', '2em')
        $('.feeditem ').removeClass('text-light')
        $('.panel-title').css('font-weight', 'bold')
        $('#userName').css('color', 'darkblue')
        $('.search-btn').css('color', 'darkred')
        $('.panel-title').css('color', 'darkblue')
        $('#force-overflow').css('color', '#70B8DE')




    }
  
