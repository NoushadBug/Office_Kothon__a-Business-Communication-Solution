
function changeEmoji() {
    if (document.querySelector('.emoji-picker') != null) {
        let emojiDiv = document.querySelector('.emoji-picker');
        let emojiPickerDiv = document.querySelector('.emoji-picker__tabs');
        let emojiPickedName = document.querySelector('.emoji-picker__preview-name');
        let emojiPickedEmo = document.querySelector('.emoji-picker__preview-emoji ');
        let emojiSearchBar = document.querySelector('.emoji-picker__search');
        let emojiSearchBarIcon = document.querySelector('.emoji-picker__search-icon');
        let theme = localStorage.getItem('theme')
        let revTheme = theme == 'light' ? 'dark' : 'light';
        let emojiBar = document.querySelectorAll('.emoji-picker__tab-body .emoji-picker__emojis');
        emojiDiv.classList.remove('bg-' + revTheme);
        emojiSearchBar.classList.remove('bg-' + revTheme);
        for (var i = 0; i < emojiBar.length; ++i) {
            emojiBar[i].classList.add('scrollbar');
            emojiBar[i].classList.add('thumb' + theme.charAt(0).toUpperCase() + theme.slice(1));
            emojiBar[i].classList.add('bg-transparent');
        }
        $('.emoji-picker__search').css('border-radius', '2em')
        $('.emoji-picker').css('border-radius', '1.5em')
        emojiDiv.classList.add('bg-' + theme);
        emojiSearchBar.classList.add('bg-' + theme);
        emojiSearchBar.classList.add('form-control');
        emojiSearchBarIcon.style.top = 'calc(50% - 0.4em)';
        emojiPickerDiv.classList.remove('text-' + theme);
        emojiPickedName.classList.remove('text-' + theme);
        emojiPickedName.innerHTML = 'click on any emoji';
        emojiPickerDiv.classList.add('text-' + revTheme);
        emojiPickerDiv.classList.add('my-auto');
        emojiPickedName.classList.add('my-auto');
        emojiPickedEmo.classList.add('my-auto');
        emojiPickedName.classList.add('text-' + revTheme);

        $('.emoji-picker__emoji').mouseleave(function () {
            emojiPickedName.innerHTML = 'click on any emoji';
        }
        )
    }
}

function changeTheme() {

    localStorage.getItem('theme') ?? localStorage.setItem('theme', 'dark');

    if (localStorage.getItem('theme') == 'light') {
        if (window.location.pathname == "/dashboard.html") {
            // dashboard css 
            $('.dashboard-main').css("background", " #cad1d8")
            $('.dashboard-container').css("background", " #ffffff")
            $('.hello-bar').css("background", "rgb(204, 220, 255)")
            $('#myInput').css('color', 'black')
            $('.scrollbar').css("background", "#ccdcff")
            $('.leftbar').css('background', 'rgb(29 59 88)')
            $('.feeditem').removeClass('bg-dark')
            $('.feeditem').addClass('panelColor')
            $('.infoButton').css('background', 'rgb(29 59 88)')
            $('.date-section').removeClass('text-light')
            $('#date').css('color', 'darkblue')
            $('#date').css('font-weight', 'bold')
            $('#time').css('color', 'rgb(4 4 29)')
            $('#signout i').removeClass('text-secondary')
            $('#signout i').addClass('text-light')
            // modal
            $('.modal-content').removeClass('bg-dark')
            $('.modal-body').css('background', 'rgb(204, 220, 255)')
            $('.modal-title').addClass('text-dark')
            $('.modal-title').css('font-weight', 'bold')
            $('.btnClose').removeClass('text-light')
            $('.modalPanel').removeClass('bg-dark')
            $('.modalPanel').css('background', 'azure')
            $('.panel-title').css('color', 'darkblue')
            $('.panel-title').css('font-weight', 'bold')
            $('.panelFile').css('background', '#07223e')





            $('.panel-collapse').css('color', 'black')
            $('#calTitle button ').css('background', 'darkblue')
            $('#calTitle').css('color', 'darkblue')
            $('#calTitle').css('font-weight', 'bold')
            $('#calendar').css("background", "#ccdcff")
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
            $('.weather').addClass('weather-container')

            $('.feeditem ').removeClass('text-light')
            $('.panel-title').css('font-weight', 'bold')
            $('#userName').css('color', 'darkBlue')
            $('.search-btn').css('color', 'darkred')
            $('.panel-title').css('color', 'darkblue')
            $('#force-overflow').css('color', '#70B8DE')
            $('.hello-bar').removeClass('borderDark')
            $('.hello-bar').addClass('borderLight')
            $('.scrollbar').css('color', ' rgb(29 59 88)')
            $('.scrollbar').removeClass('thumbDark')
            $('.scrollbar').addClass('thumbLight')



        }
        if (window.location.pathname == "/chat.html") {
            changeEmoji()

            $('.dashboard-main').css("background", " rgb(202, 209, 216)")
            $('.leftbar').css('background', 'rgb(29 59 88)')
            $('.dashboard-container').css("background", "#BCC2D0")
            $('.member').removeClass('text-light')
            $('.member').css('color', 'darkblue')
            $('.userName ').removeClass('text-light')
            $('.userName ').css('color', 'darkblue')
            $('.click').removeClass('text-info')
            $('.dfeed-bar .card').removeClass('bg-dark')
            $('.dfeed-bar .card').css('background-color', 'rgb(29 59 88)')
            $('.scrollbar').removeClass('thumbDark')
            $('.scrollbar').addClass('thumbLight')
            $('.messages ').removeClass('bg-dark')
            $('.content .messages ').css('background', 'lavender');
            $('.userName ').removeClass('text-light')
            $('.contact-profile').removeClass('bg-info')
            $('.contact-profile').css('background', 'rgb(29, 59, 88)')
            $('#sendInput').css('background', 'rgb(29, 59, 88)')

            $('#signout i').removeClass('text-secondary')
            $('#signout i').addClass('text-light')
            // $('.designation ').removeClass('text-info')
            // $('.designation').css('color','darkblue')
            $('.submit').removeClass('bg-info')
            $('.submit').css('background', '#5f0f0f')




        }
        if (window.location.pathname == "/addTask.html") {
            $('.dashboard-main').css("background", " rgb(202, 209, 216)")
            $('.leftbar').css('background', 'rgb(29 59 88)')
            $('.dashboard-container').css("background", "#BCC2D0")
            $('.taskAssign').removeClass('text-light')
            $('.taskAssign').css('color', 'darkblue')
            $('#myInput ').removeClass('bg-dark')
            $('#myInput ').addClass('border-dark')
            $('.clickMsg').removeClass('darkH6')
            $('.clickMsg').addClass('LightH6')
            $('.designation').removeClass('text-info')
            $('.completedTask').removeClass('text-light')
            $('.incompletedTask').removeClass('text-light')
            $('.deadlineCrossed').removeClass('text-light')
            $('.status').removeClass('text-light')
            $('#completedTask').removeClass('text-info')
            $('#incompletedTask').removeClass('text-info')
            $('#deadlineCrossed').removeClass('text-info')
            $('#status').removeClass('text-info')
            $('.completedTask').css('color', 'darkblue')
            $('.deadlineCrossed').css('color', 'darkblue')
            $('.incompletedTask').css('color', 'darkblue')
            $('.status').css('color', 'darkblue')
            $('.title h6 ').css('color', 'darkblue')
            $('.taskListDiv  ').css('background', 'lavender')
            $('.taskForm   ').css('background', 'lavender')
            $('.taskCap').removeClass('text-light')
            $('.taskCap').addClass('text-secondary')
            $('.form-control').removeClass('bg-dark')
            $('.form-control').removeClass('text-light')
            $('#fileLabel').removeClass('bg-dark')
            $('#inlineFormCustomSelect').removeClass('bg-dark')
            $('#inlineFormCustomSelect').removeClass('bg-dark')
            $('.submitBtn').removeClass('btn btn-secondary')
            $('.submitBtn').addClass('btn btn-info')
            $('#startTime').addClass('dateLight')
            $('#startTime').addClass('text-light')
            $('#endTime').addClass('dateLight')
            $('#endTime').addClass('text-light')
            $('#taskHeading').removeClass('text-light')
            $('#filterTask').addClass('designcardLight')
            $('.selection-div i').removeClass('iconDark')
            $('.selection-div i').addClass('iconLight')
            $('#scrollbar .card').removeClass('bg-dark')
            $('#scrollbar .card').css('background', 'rgb(29, 59, 88)')
            $(' #viewTaskDetail  i').addClass('text-light')
            $('.userName ').removeClass('text-light')
            $('.userName ').css('color', 'darkblue')
            $('.click').removeClass('text-info')
            $('.dfeed-bar .card').removeClass('bg-dark')
            $('.dfeed-bar .card').css('background-color', 'rgb(29 59 88)')
            $('.scrollbar').removeClass('thumbDark')
            $('.scrollbar').addClass('thumbLight')
            $('.userName ').removeClass('text-light')
            $('.contact-profile').removeClass('bg-info')
            $('.contact-profile').css('background', 'rgb(29, 59, 88)')
            $('#sendInput').css('background', 'rgb(29, 59, 88)')

            $('#signout i').removeClass('text-secondary')
            $('#signout i').addClass('text-light')
            // $('.designation ').removeClass('text-info')
            // $('.designation').css('color','darkblue')
            $('.submit').removeClass('bg-info')
            $('.submit').css('background', '#5f0f0f')

            // modal
            $('.modal-content').removeClass('bg-dark')
            $('.modal-body').css('background', 'rgb(204, 220, 255)')
            $('.modal-title').addClass('text-dark')
            $('.modal-title').css('font-weight', 'bold')
            $('.btnClose').removeClass('text-light')
            $('.modalPanel').removeClass('bg-dark')
            $('.modalPanel').css('background', 'azure')
            $('.panel-title').css('color', 'darkblue')
            $('.panel-title').css('font-weight', 'bold')
            $('.panelFile').css('background', '#07223e')
            $('.smallP small').removeClass('text-info')
            $('.smallP p').addClass('text-dark')
            $('.smallP small').css('color', 'darkblue')
            $('.secondSp small').removeClass('text-info')
            $('.secondSp p').addClass('text-dark')
            $('.secondSp small').css('color', 'darkblue')
            $('.mainS').removeClass('text-info')
            $('.mainP').addClass('text-dark')
            $('.mainS').css('color', 'darkblue')

        }
        if (window.location.pathname == "/settings.html") {
            $('.dashboard-main').css("background", " rgb(202, 209, 216)")
            $('.leftbar').css('background', 'rgb(29 59 88)')
            $('.dashboard-container').css("background", "#BCC2D0")
            $('.userName ').removeClass('text-light')
            $('.userName ').css('color', 'darkblue')
            $('.designation').removeClass('text-info')
            $('.verticalalign').css('border-left', '0.4vw solid rgb(29, 59, 88)')
            $('.date-section').removeClass('text-light')
            $('#date').css('color', 'darkblue')
            $('#date').css('font-weight', 'bold')
            $('#time').css('color', 'rgb(4 4 29)')
            $('.favQuta').removeClass('text-secondary')
            $('.favQuta ').css('color', 'darkblue')
            $('.quote-text').removeClass('text-light')
            $('.infoUpdate').removeClass('text-light')
            $('.infoUpdate').css('color', 'darkblue')
            $('#settings-name').removeClass('bg-dark')
            $('#settings-name').removeClass('text-light')
            $('#settings-pass').removeClass('bg-dark')
            $('#bioDetails').removeClass('bg-dark')
            $('#bioDetails').removeClass('text-light')
            $('#userPass').removeClass('bg-dark')

            $('.taskForm ').css('background', 'lavender')
            $('.fake-btn').css('background-color', '#7777bd')
            $('.fake-btn').css('color', 'white')
            $('.file-drop-area ').css('background', '#cbcbe6')
            $('.file-drop-area ').css('color', 'black')
            $('.file-drop-area ').css('border-color', 'rgb(29 59 88)')
            $('.labelcol').removeClass('text-info')
            $('.labelcol').css('color', 'black')
            $('.profileLabel').removeClass('text-info')
            $('.profileLabel').css('color', 'black')
            $('.currentPassword').removeClass('text-info')
            $('.currentPassword').css('color', 'black')
            $('.toogle').removeClass('text-info')
            $('.toogle').css('color', 'black')


            $('#signout i').removeClass('text-secondary')
            $('.formSubmit').removeClass('btn btn-secondary')
            $('.formSubmit').addClass('btn btn-info')

            $('#signout i').addClass('text-light')




        }
    }
    // // dashboard css
    // $('.dashboard-main').css("background"," #cad1d8")
    // $('.dashboard-container').css("background"," #ECF0F3")
    // $('.hello-bar').css("background","rgb(204, 220, 255)")
    // $('.leftbar').css('background','rgb(29 59 88)')

    if (localStorage.getItem('theme') == 'dark') {
    //else {
        if (window.location.pathname == "/dashboard.html") {
            $('.dashboard-main').css("background", " #212529")
            $('.dashboard-container').css("background", " #393c45")
            $('.hello-bar').css("background", "#2d3346")
            $('.feeditem').removeClass('panelColor')
            $('#myInput').css('color', 'white')
            $('.scrollbar').css("background", "#576075")
            $('.leftbar').css('background', '#2e3035')
            $('.feeditem').addClass('bg-dark')
            $('.infoButton').css('background', '#2b3035')
            $('.date-section').addClass('text-light')
            $('#date').css('color', 'white')
            $('#time').css('color', 'white')
            $('#date').css('font-weight', '100')
            $('#signout i').removeClass('text-light')
            $('#signout i').addClass('text-secondary')
            $('.panel-collapse').css('color', 'white')
            $('#calTitle button ').css('background', 'rgba(0, 0, 0, 0.1)')
            $('#calTitle').css('color', 'white')
            $('#calTitle').css('font-weight', 'bold')
            $('#calendar').css("background", "#22252e")
            $('#calThead').css('color', 'white')
            $('#calTbody').css('color', 'white')
            $('#calTbody .a-date.current').css('background-color', '#5d646b')
            $('#calTbody .a-date.current').css('color', '#d2d2d2')
            $('#eventTitle').css('color', 'white')
            $('#calLink').css('color', '#67aff8')
            $('.temperature-value').css('color', 'white')
            $('.temperature-description').addClass('text-info')
            $('.location').css('font-weight', 'bold')
            $('.location').removeClass('text-dark')
            $('.location').addClass('text-light')
            $('.weather').removeClass('weather-container')
            $('.feeditem ').addClass('text-light')
            $('.panelFile').css('background', '#2b3035')
            $('#userName').css('color', 'white')
            $('.search-btn').addClass('text-info')
            $('.panel-title').css('color', 'white')
            $('#force-overflow').css('color', '#212529')
            $('.hello-bar').removeClass('borderLight')
            $('.hello-bar').addClass('borderDark')
            $('.scrollbar').css('color', ' #212529')
            $('.scrollbar').removeClass('thumbLight')
            $('.scrollbar').addClass('thumbDark')
            // modal
            $('.modal-content').addClass('bg-dark')
            $('.modal-body').css('background', '#2e3035')
            $('.modal-title').removeClass('text-dark')
            $('.modal-title').css('font-weight', '100')
            $('.btnClose').addClass('text-light')
            $('.modalPanel').addClass('bg-dark')
            // $('.modalPanel').css('background','azure')
            $('.panel-title').css('color', 'white')
            // $('.panel-title').css('font-weight', 'bold')
        }

        if (window.location.pathname == "/chat.html") {

            changeEmoji();

            $('.dashboard-main').css("background", " #212529")
            $('.dashboard-container').css("background", " #393c45")
            $('.leftbar').css('background', '#2e3035')
            $('.member').addClass('text-light')
            $('.userName ').addClass('text-light')
            $('.click').addClass('text-info')
            $('.dfeed-bar .card').addClass('bg-dark')
            $('.scrollbar').removeClass('thumbLight')
            $('.scrollbar').addClass('thumbDark')
            $('.messages ').addClass('bg-dark')
            $('.userName ').addClass('text-light')
            $('.contact-profile').addClass('bg-info')
            $('#sendInput').css('background', 'darkslategray')
            $('#signout i').addClass('text-secondary')
            // $('#signout i').addClass('text-light')
            // $('.designation ').removeClass('text-info')
            // $('.designation').css('color','darkblue')
            $('.submit').addClass('bg-info')
            $('.submit').css('background', 'darkslategray')
        }

        if (window.location.pathname == "/addTask.html") {
            $('.dashboard-main').css("background", " #212529")
            $('.dashboard-container').css("background", " #393c45")
            $('.leftbar').css('background', '#2e3035')
            $('.taskAssign').addClass('text-light')
            $('#myInput ').addClass('bg-dark')
            $('#myInput ').removeClass('border-dark')
            $('#myInput ').addClass('border-info')
            $('.clickMsg').removeClass('LightH6')
            $('.clickMsg').addClass('darkH6')
            $('.designation').addClass('text-info')
            $('.completedTask').addClass('text-light')
            $('.incompletedTask').addClass('text-light')
            $('.deadlineCrossed').addClass('text-light')
            $('.status').addClass('text-light')
            $('#completedTask').addClass('text-info')
            $('#incompletedTask').addClass('text-info')
            $('#deadlineCrossed').addClass('text-info')
            $('#status').addClass('text-info')
            $('#filterTask').removeClass('designcardLight')
            $('.title h6 ').addClass('text-light')
            $('.taskListDiv  ').css('background', 'rgb(46, 48, 53)')
            $('.taskForm   ').css('background', 'rgb(46, 48, 53)')
            $('.taskCap').addClass('text-light')
            $('.form-control').addClass('bg-dark')
            $('.form-control').addClass('text-light')
            $('#fileLabel').addClass('bg-dark')
            $('#inlineFormCustomSelect').addClass('bg-dark')
            $('#inlineFormCustomSelect').addClass('bg-dark')
            $('.submitBtn').addClass('btn btn-secondary')
            $('#startTime').addClass('dateDark')
            $('#startTime').addClass('text-light')
            $('#endTime').addClass('dateDark')
            $('#endTime').addClass('text-light')
            $('#taskHeading').addClass('text-light')

            // $('#filterTask').addClass('designcardLight')   
            $('.selection-div i').removeClass('iconLight')
            $('.selection-div i').addClass('iconDark')
            $('#scrollbar .card').addClass('bg-dark')
            //  $('#scrollbar .card').css('background','rgb(29, 59, 88)')
            $(' #viewTaskDetail  i').removeClass('text-light')
            $('.userName ').addClass('text-light')
            // $('.userName ').css('color','darkblue')
            $('.click').addClass('text-info')
            $('.dfeed-bar .card').addClass('bg-dark')
            // $('.dfeed-bar .card').css('background-color','rgb(29 59 88)')
            $('.scrollbar').removeClass('thumbLight')
            $('.scrollbar').addClass('thumbDark')
            $('.userName ').addClass('text-light')
            $('.contact-profile').addClass('bg-info')
            // $('.contact-profile').css('background','rgb(29, 59, 88)')
            // $('#sendInput').css('background','rgb(29, 59, 88)')

            $('#signout i').addClass('text-secondary')
            // $('#signout i').addClass('text-light')
            // $('.designation ').removeClass('text-info')
            // $('.designation').css('color','darkblue')
            $('.submit').addClass('bg-info')
            // $('.submit').css('background','#5f0f0f')
            // modal
            $('.modal-content').addClass('bg-dark')
            $('.modal-body').css('background', '#2e3035')
            $('.modal-title').removeClass('text-dark')
            $('.btnClose').addClass('text-light')
            $('.modalPanel').addClass('bg-dark')
            $('.panel-title').css('color', 'white')
            $('.panelFile').css('background', '#2b3035')
            $('.smallP small').addClass('text-info')
            $('.smallP p').removeClass('text-dark')
            $('.secondSp small').addClass('text-info')
            $('.secondSp p').removeClass('text-dark')
            $('.mainS').addClass('text-info')
            $('.mainP').removeClass('text-dark')

        }

        if (window.location.pathname == "/settings.html") {
            $('.dashboard-main').css("background", " #212529")
            $('.dashboard-container').css("background", " #393c45")
            $('.leftbar').css('background', '#2e3035')
            $('.userName ').addClass('text-light')
            $('.verticalalign').css('border-left', '0.4vw solid #2e3035')
            $('.designation').addClass('text-info')
            $('.date-section').addClass('text-light')
            $('#date').css('color', 'white')
            $('#time').css('color', 'white')
            $('#date').css('font-weight', '100')
            $('#signout i').removeClass('text-light')
            $('#signout i').addClass('text-secondary')
            $('.favQuta').addClass('text-secondary')
            $('.quote-text').addClass('text-light')
            $('.infoUpdate').addClass('text-light')
            $('#settings-name').addClass('bg-dark')
            $('#settings-name').addClass('text-light')
            $('#settings-pass').addClass('bg-dark')
            $('#bioDetails').addClass('bg-dark')
            $('#bioDetails').addClass('text-light')
            $('#userPass').addClass('bg-dark')

            $('.taskForm   ').css('background', 'rgb(46, 48, 53)')
            $('.fake-btn').css('background-color', 'rgba(255, 255, 255, 0.04)')
            $('.file-drop-area ').css('background', '#2e3035')
            $('.file-drop-area ').css('color', '#D7D7EF')
            $('.file-drop-area ').css('border-color', 'rgba(255, 255, 255, 0.4)')
            $('.labelcol').addClass('text-info')
            $('.profileLabel').addClass('text-info')
            // $('.profileLabel').css('color','black')
            $('.currentPassword').addClass('text-info')
            // $('.currentPassword').css('color','black')
            $('.toogle').addClass('text-info')
            // $('.toogle').css('color','black')

            $('.formSubmit').addClass('btn btn-secondary')
            $('.formSubmit').removeClass('btn btn-info')

        }
    }
}
