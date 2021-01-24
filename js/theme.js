
function changeTheme()
{
    if(localStorage.getItem('theme') == 'light')
    {
        $('.dashboard-main').css("background"," #cad1d8")
        $('.dashboard-container').css("background"," #ffffff")
        $('.hello-bar').css("background","#ccdcff")
        $('#myInput').css('color' , 'black')
        $('.scrollbar').css("background","#ccdcff")
        $('.leftbar').css('background','rgb(29 59 88)')
        $('.feeditem').removeClass('bg-dark')
        $('.feeditem').addClass('bg-light')
        $('.infoButton').css('background' , 'rgb(29 59 88)')
        $('.date-section').removeClass('text-light')
        $('#date').css('color','darkblue')
        $('#date').css('font-weight','bold')
        $('#time').css('color','rgb(4 4 29)')
        $('#signout i').removeClass('text-secondary')
        $('#signout i').addClass('text-light')
        $('.panel-collapse').css('color' , 'black')
        $('#calTitle button ').css('background','darkblue')
        $('#calTitle').css('color','darkblue')
        $('#calTitle').css('font-weight','bold')
        $('#calendar').css("background","#ccdcff")
        $('#calThead').css('color', 'black')
        $('#calTbody').css('color', 'black')
        $('#calTbody .a-date.current').css('background-color', '#0e345a')     
        $('#calTbody .a-date.current').css('color', 'white')    
        $('#eventTitle').css('color', '#0e345a')
        $('#calLink').css('color', 'darkblue')
        $('.temperature-value').css('color', 'white')
        $('.temperature-description').removeClass('text-secondary')
        $('.location').css('color', '#060a0a')
        $('.location').css('font-weight', 'bold')
        $('.location').removeClass('text-info')
        $('.location').addClass('text-light')
        $('.weather-container').css('background', 'rgb(29 59 88)')
        $('.weather-container').css('border-radius', '2em')
        $('.feeditem ').removeClass('text-light')
        $('.panel-title').css('font-weight', 'bold')
        $('#userName').css('color', 'darkblue')
        $('.search-btn').css('color', 'darkred')
        $('.panel-title').css('color', 'darkblue')
        $('#force-overflow').css('color', '#70B8DE')
        // $('.modal-content').removeClass('bg-dark')
        // $('.modal-content').css('background-color', '#f1f8ff')
        // $('.modal-title').css('color', 'black')
        // $('.modal-header button').removeClass('text-light')
        // $('.modal-body').css('background', '#c9d9ff')
        // $('.modal-body .feeditem').removeClass('bg-dark')
        // $('.modal-body .feeditem').addClass('bg-light')




    }
}


  
