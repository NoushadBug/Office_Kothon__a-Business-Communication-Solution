let userImage;
let docAvailable;
let selectedUserName;
let selectedUserImage;
let selectedUserDesignation;
let selectedUserId;

$(document).ready(function(){
    db.collection("users").get()
    .then(function(querySnapshot) {
        $('.loader').fadeOut('slow');
        $('#frame').hide();
        $('#welcome').slideDown("slow");
        querySnapshot.forEach(function(doc) {
            if(doc.id === auth.currentUser.email){
                $('#userImage').attr("src", `${doc.data().photoURL}`);
                $('.userName').html(`${doc.data().displayName}`);
                userImage = doc.data().photoURL;
            }
            else{
                $(`<div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${doc.id}">
                <div class="row m-auto">
                  <img src="${doc.data().photoURL}" class="col-md-4 rounded" alt="">
                  <div class="col-md-8 pl-0 m-auto">
                    <h6 class="text-light m-0 d-block">${doc.data().displayName}</h6>
                    <small class="text-info m-0">${doc.data().designation}</small>
                  </div>
                </div>
            </div>`).appendTo('#force-overflow');
            }
            //console.log(doc.id, " => ", doc.data());
        });
        $(".card").on( "click", function() {
            $('#frame').show(500);
            $('#welcome').remove();
            openMessageThread($(this).attr('data'));
          });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".dfeed-bar .card").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    });


    document.getElementById('signout').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        toastr['info']('You are signed out! ', 'see you soon');
        });
        window.location.replace("./index.html");
    });

// creating document query
    function createDocQuery(clickedUser){
        let queryDoc;
        auth.currentUser.email>clickedUser? queryDoc = auth.currentUser.email+"{"+clickedUser : queryDoc = clickedUser+"{"+auth.currentUser.email;
        return queryDoc;
    }

// function of opening message threads
    function openMessageThread(clickedUser){
        $('.messages ul').empty();
        $(".messages ul").append( `<svg style="margin: auto;position: absolute;bottom: 48%;left: 30%;" version="1.1" xmlns="http://www.w3.org/2000/svg"
        width="60px" height="10px" viewBox="0 0 80 20">
        <circle cx="10" cy="10" r="10" fill="#666" >
          <animate attributeName="cx" from="10" to="40" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" />
        </circle>
        <circle cx="10" cy="10" r="0" fill="#555">
          <animate attributeName="r" from="0" to="10" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="10" r="10" fill="#777">
          <animate attributeName="cx" from="40" to="70" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="10" r="10" fill="#666">
          <animate attributeName="r" from="10" to="0" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" />
        </circle>
      </svg>`);
        let queryDoc = createDocQuery(clickedUser);
        selectedUserName = $("[data='"+clickedUser+"'] h6")[0].currentSrc;
        selectedUserImage = $("[data='"+clickedUser+"'] img")[0].currentSrc;
        selectedUserDesignation = $("[data='"+clickedUser+"'] small").text();
        selectedUserId = clickedUser;
        db.collection('chats').doc(queryDoc).get().then((querySnapshot) => {
            docAvailable = true;
            $('.messages ul').empty();
            let clickedUserName = $("[data='"+clickedUser+"'] h6").text();
            $('.contact-profile p').fadeOut(function(){$(this).text(clickedUserName).fadeIn(300);})
            $('.contact-profile img').fadeOut(function(){$(this).attr("src", $("[data='"+clickedUser+"'] img")[0].currentSrc ).fadeIn(300);})
            $('.sent img').fadeOut(function(){$(this).attr("src", selectedUserImage ).fadeIn(300);})
            $('.replies img').fadeOut(function(){$(this).attr("src", userImage ).fadeIn(300);})
            if(querySnapshot.exists){
                db.collection('chats').doc(queryDoc).get()
                .then(function(messageDatas) {
                     renderMessages(messageDatas.data());
                })
            }
            else{
                $(".messages ul").append( `<div id="newThread"><img id="userImage" class="col-md-2 mt-3 text-right" alt="" src="${selectedUserImage}" style="align-items: end;border-radius: 50em;display: block;float: right;">
                <div class="container" style="display:unset;"><h4 class="text-right text-light userName mb-0 mx-auto">${clickedUserName}</h4><h6 class="text-right text-secondary userName mb-0 mx-auto">${selectedUserDesignation}</h6><small class="text-info text-right d-block">Send a new message</small></ul></div></div>`).hide().fadeIn(500);
                docAvailable = false;
        }
            //db.collection('chats').doc(queryDoc);
        });
    }

// render the messages inside HTML
    function renderMessages(messageInfos){
         for (let i = 0; i < Object.getOwnPropertyNames(messageInfos).length; i++) {
            // console.log(Object.getOwnPropertyNames(messageInfos)[i]);
            // console.log(Object.values(messageInfos)[i].message);
            if(auth.currentUser.email === Object.values(messageInfos)[i].senderID){
                $(`<li class="replies" data-position="${parseInt(Object.getOwnPropertyNames(messageInfos)[i])}">
                <small class="messageTime text-right text-secondary mr-5">sent at ${new Date(parseInt(Object.getOwnPropertyNames(messageInfos)[i])).toLocaleString()}</small>
                <img src='${userImage}' alt="">
                <p class="bg-secondary text-light shadow-lg">${Object.values(messageInfos)[i].message}</p>
              </li>`).appendTo('.messages ul').hide().fadeIn(500);
            }
            else{
                $(`<li class="sent" data-position="${parseInt(Object.getOwnPropertyNames(messageInfos)[i])}">
                <small class="messageTime text-left text-secondary ml-5">sent at ${new Date(parseInt(Object.getOwnPropertyNames(messageInfos)[i])).toLocaleString()}</small>
                <img src='${selectedUserImage}' alt="">
                <p class="text-light shadow-lg">${Object.values(messageInfos)[i].message}</p>
              </li>`).appendTo('.messages ul').hide().fadeIn(500);
            }
            if(i>0){
                $(".messages ul").html($('.messages ul').children('li').sort(function(a, b){
                    return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;
                }));
            }
        }
    }


// send messages function
    function sendMessage(messageString, timestamp){
        $("#sendInput").val('');
        var senderIdVal = auth.currentUser.email;
        var receiverIdVal = selectedUserId;

        if(messageString){
            //alert(createDocQuery(selectedUserId));
            db.collection("chats").doc(createDocQuery(selectedUserId)).set({
                [timestamp] : {file: "null", message: messageString, receiverID: receiverIdVal, senderID: senderIdVal}
            }, { merge: true });
        }
    }


   // on enter key press submit message
   $("#sendInput").keyup(function(e){ 
        var code = e.key; // recommended to use e.key, it's normalized across devices and languages
        if(code==="Enter"){
            e.preventDefault();
            sendMessage($(this).val(), new Date().getTime());
        }
    });

    // on clicking send button submit message
    $('#submitMessageBtn').on( "click", function() {
        sendMessage($("#sendInput").val(),new Date().getTime());
    });


    // on storage data change listener
    db.collection("chats").onSnapshot(function (){
        openMessageThread(selectedUserId);
    });