
function changeTheme()
{
    if(localStorage.getItem('theme') == 'light')
    {
         if (window.location.pathname == "/dashboard.html") {
          
        // dashboard css 
        $('.dashboard-main').css("background"," #cad1d8")
        $('.dashboard-container').css("background"," #ffffff")
        $('.hello-bar').css("background","rgb(204, 220, 255)")
        $('#myInput').css('color' , 'black')
        $('.scrollbar').css("background","#ccdcff")
        $('.leftbar').css('background','rgb(29 59 88)')
        $('.feeditem').removeClass('bg-dark')
        $('.feeditem').addClass('panelColor')
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
        $('.location').removeClass('text-light')
        $('.location').addClass('text-dark')
        $('.weather-container').css('background', 'rgb(29 59 88)')
        $('.weather-container').css('border-radius', '2em')
        $('.feeditem ').removeClass('text-light')
        $('.panel-title').css('font-weight', 'bold')
        $('#userName').css('color', 'darkBlue')
        $('.search-btn').css('color', 'darkred')
        $('.panel-title').css('color', 'darkblue')
        $('#force-overflow').css('color', '#70B8DE')
        $('.hello-bar').removeClass('borderDark')
        $('.hello-bar').addClass('borderLight')
        $('.scrollbar').css('color',' rgb(29 59 88)')
        $('.scrollbar').removeClass('thumbDark')
        $('.scrollbar').addClass('thumbLight')

       

    }
    if (window.location.pathname == "/chat.html") 
    {
        $('.dashboard-main').css("background"," rgb(202, 209, 216)")
        $('.leftbar').css('background','rgb(29 59 88)')
        $('.dashboard-container').css("background","#BCC2D0")
        $('.member').removeClass('text-light')
        $('.member').css('color','darkblue')
        $('.userName ').removeClass('text-light')
        $('.userName ').css('color','darkblue')
        $('.click').removeClass('text-info')
        $('.dfeed-bar .card').removeClass('bg-dark')
        $('.dfeed-bar .card').css('background-color','rgb(29 59 88)')
        $('.scrollbar').removeClass('thumbDark')
        $('.scrollbar').addClass('thumbLight')
        $('.messages ').removeClass('bg-dark')
        $('.content .messages ').css('background','lavender');
        $('.userName ').removeClass('text-light')
        $('.contact-profile').removeClass('bg-info')
        $('.contact-profile').css('background','rgb(29, 59, 88)')
        $('#sendInput').css('background','rgb(29, 59, 88)')

    $('#signout i').removeClass('text-secondary')
        $('#signout i').addClass('text-light')
        // $('.designation ').removeClass('text-info')
        // $('.designation').css('color','darkblue')
        $('.submit').removeClass('bg-info')
        $('.submit').css('background','#5f0f0f')
       



    }

}

     
        
          
        // // dashboard css 
        // $('.dashboard-main').css("background"," #cad1d8")
        // $('.dashboard-container').css("background"," #ECF0F3")
        // $('.hello-bar').css("background","rgb(204, 220, 255)")
       
        // $('.leftbar').css('background','rgb(29 59 88)')
        
            if (localStorage.getItem('theme') == 'dark'){
                if (window.location.pathname == "/dashboard.html") 
                {
                    $('.dashboard-main').css("background"," #212529")
                    $('.dashboard-container').css("background"," #393c45")
                    $('.hello-bar').css("background","#2d3346")
                    $('.feeditem').removeClass('panelColor')
                    $('#myInput').css('color' , 'white')
                    $('.scrollbar').css("background","#576075")
                    $('.leftbar').css('background','#2e3035')
                    $('.feeditem').addClass('bg-dark')
                    $('.panel-title').css('font-weight', '100')
                    $('.infoButton').css('background' , '#2b3035')
                    $('.date-section').addClass('text-light')
                    $('#date').css('color','white')
                    $('#time').css('color','white')
                    $('#date').css('font-weight','100')
                    $('#signout i').removeClass('text-light')
                    $('#signout i').addClass('text-secondary')
                    // $('.panel-collapse').css('color' , 'black')
                    $('#calTitle button ').css('background','rgba(0, 0, 0, 0.1)')
                    $('#calTitle').css('color','white')
                    $('#calTitle').css('font-weight','bold')
                    $('#calendar').css("background","#22252e")
                    $('#calThead').css('color', 'white')
                    $('#calTbody').css('color', 'white')
                    $('#calTbody .a-date.current').css('background-color', '#5d646b')     
                    $('#calTbody .a-date.current').css('color', '#d2d2d2')    
                    $('#eventTitle').css('color', 'white')
                    $('#calLink').css('color', '#67aff8')
                    $('.temperature-value').css('color', 'white')
                    $('.temperature-description').addClass('text-secondary')
                    $('.location').css('font-weight', 'bold')
                    $('.location').addClass('text-info')
                    // $('.weather-container').css('background', 'rgb(29 59 88)')
                    // $('.weather-container').css('border-radius', '2em')
                    $('.feeditem ').addClass('text-light')
                    
                    $('#userName').css('color', 'white')
                    $('.search-btn').addClass('text-info')
                    $('.panel-title').css('color', 'white')
                    $('#force-overflow').css('color', '#212529')
                    $('.hello-bar').removeClass('borderLight')
                    $('.hello-bar').addClass('borderDark')
                    $('.scrollbar').css('color',' #212529')
                    $('.scrollbar').removeClass('thumbLight')
                    $('.scrollbar').addClass('thumbDark')
    
                
           
                }
              

    
     
   
}
}



  
