let userImage;
let docAvailable;
let selectedUserName;
let selectedUserImage;
let selectedUserDesignation;
let selectedUserId;
let animationTriggered = false;
let selectedReplies= [];
let loadSvg = true;

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
            selectedReplies= [];
            $(".social-media .fa-check").remove();
            openMessageThread($(this).attr('data'));
          });
    })
    .catch(function(error) {
        toastr['error']('Error getting documents: ', error);
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

function renderLoadingSvg(){
    if ($(".messages ul").children().length == 0 ){
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
     }
}

// function of opening message threads
    function openMessageThread(clickedUser){
        if(loadSvg) $('.messages ul').empty();
        renderLoadingSvg();
        let queryDoc = createDocQuery(clickedUser);
        selectedUserName = $("[data='"+clickedUser+"'] h6")[0].currentSrc;
        selectedUserImage = $("[data='"+clickedUser+"'] img")[0].currentSrc;
        selectedUserDesignation = $("[data='"+clickedUser+"'] small").text();
        selectedUserId = clickedUser;
        let clickedUserName = $("[data='"+clickedUser+"'] h6").text();

        db.collection('chats').doc(queryDoc).get().then((querySnapshot) => {
            docAvailable = true;
            $('.messages ul').empty();
            if(loadSvg){
                $('.contact-profile p').fadeOut(function(){$(this).text(clickedUserName).fadeIn(300);})
                $('.contact-profile img').fadeOut(function(){$(this).attr("src", $("[data='"+clickedUser+"'] img")[0].currentSrc ).fadeIn(300);})
                $('.sent img').fadeOut(function(){$(this).attr("src", selectedUserImage ).fadeIn(300);})
                $('.replies img').fadeOut(function(){$(this).attr("src", userImage ).fadeIn(300);})
            }
            else{
                $('.contact-profile p').text(clickedUserName);
                $('.contact-profile img').attr("src", $("[data='"+clickedUser+"'] img")[0].currentSrc );
                $('.sent img').attr("src", selectedUserImage );
                $('.replies img').attr("src", userImage );
            }
            if(querySnapshot.exists){
                renderLoadingSvg();
                if(!Object.getOwnPropertyNames(querySnapshot).length){
                    $(".messages ul").append( `<div id="newThread"><img id="userImage" class="col-md-2 mt-3 text-right" alt="" src="${selectedUserImage}" style="align-items: end;border-radius: 50em;display: block;float: right;">
                    <div class="container" style="display:unset;"><h4 class="text-right text-light userName mb-0 mx-auto">${clickedUserName}</h4><h6 class="text-right text-secondary userName mb-0 mx-auto">${selectedUserDesignation}</h6><small class="text-info text-right d-block">Send a new message</small></ul></div></div>`).hide().fadeIn(500);
                }
                renderMessages(querySnapshot.data());
            }
            else{
                renderLoadingSvg();
                $('.messages ul').empty();
                $(".messages ul").append( `<div id="newThread"><img id="userImage" class="col-md-2 mt-3 text-right" alt="" src="${selectedUserImage}" style="align-items: end;border-radius: 50em;display: block;float: right;">
                <div class="container" style="display:unset;"><h4 class="text-right text-light userName mb-0 mx-auto">${clickedUserName}</h4><h6 class="text-right text-secondary userName mb-0 mx-auto">${selectedUserDesignation}</h6><small class="text-info text-right d-block">Send a new message</small></ul></div></div>`).hide().fadeIn(500);
                docAvailable = false;
            }
            //db.collection('chats').doc(queryDoc);
        });
    }

// render the messages inside HTML
    function renderMessages(messageInfos){

        // clearing docs
        var numberOfKeys = Object.values(messageInfos).length;
        if (numberOfKeys === 0 || numberOfKeys > 300) {
             db.collection('chats').doc(createDocQuery(selectedUserId)).delete();
             openMessageThread(selectedUserId);
        }
        // clearing docs

        $('.messages ul').empty();
         for (let i = 0; i < Object.getOwnPropertyNames(messageInfos).length; i++) {
            if(auth.currentUser.email === Object.values(messageInfos)[i].senderID){
               var renderReplyList =  `<li class="replies" data-position="${parseInt(Object.getOwnPropertyNames(messageInfos)[i])}">
                <small class="messageTime text-right text-secondary mr-5">sent at ${new Date(parseInt(Object.getOwnPropertyNames(messageInfos)[i])).toLocaleString()}</small>
                <img src='${userImage}' alt="">
                <p class="bg-secondary text-light shadow-lg">${chunk(Object.values(messageInfos)[i].message).join('-\n')}</p>
              </li>`;
              animationTriggered? $(renderReplyList).appendTo('.messages ul'): $(renderReplyList).appendTo('.messages ul').hide().fadeIn(300);
            }
            else{
               var renderSentList = `<li class="sent" data-position="${parseInt(Object.getOwnPropertyNames(messageInfos)[i])}">
                <small class="messageTime text-left text-secondary ml-5">sent at ${new Date(parseInt(Object.getOwnPropertyNames(messageInfos)[i])).toLocaleString()}</small>
                <img src='${selectedUserImage}' alt="">
                <p class="text-light shadow-lg">${chunk(Object.values(messageInfos)[i].message).join('-\n')}</p>
              </li>`;
              animationTriggered?  $(renderSentList).appendTo('.messages ul'):  $(renderSentList).appendTo('.messages ul').hide().fadeIn(300);
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
            }, { merge: true })
           .catch(function(error) {
                toastr['error']('Error sending message: ', error);
            });
        }
    }


   // on enter key press submit message
   $("#sendInput").keyup(function(e){ 
        animationTriggered = true;
        var code = e.key; // recommended to use e.key, it's normalized across devices and languages
        if(code==="Enter"){
            e.preventDefault();
            sendMessage($(this).val(), new Date().getTime());
        }
    });

    // on clicking send button submit message
    $('#submitMessageBtn').on( "click", function() {
        animationTriggered = true;
        sendMessage($("#sendInput").val(),new Date().getTime());
    });


    // on storage data change listener
    db.collection("chats").onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {

            //console.log("change => "+Object.values(change)[0])
            // if (change.type === "added") {
                 //console.log("New: ", change.doc.data());
            // }
            // if (change.type === "removed") {
            // }
            if (change.type === "modified") {
                loadSvg = false;
                animationTriggered = true;
           }
            openMessageThread(selectedUserId);
        });
    });


    // on click trigger deletion
    $(".social-media .fa-trash").on( "click", function() {
        var checkboxLength = $('.replies input[type=checkbox]').length
        if(checkboxLength){
            if($('.replies input[type=checkbox]').is(":hidden")){$('.replies input[type=checkbox]').show();
            }else{$('.replies input[type=checkbox]').hide();}}
        else{
                $('.replies').append('<input type="checkbox" style="margin:.81em;float:right;" /><br />');
            }
            $(".replies input[type=checkbox]").change(function() {
                if($(this).prop("checked") == true) {
                    if(!$(".social-media .fa-check").length){
                        $(".social-media").prepend(`<i class="fa fa-check mt-1 pt-3" aria-hidden="true"></i>`);
                        $(".social-media .fa-check").on( "click", function() {
                            deleteReplies();
                          });
                    }
                    selectedReplies.push($(this).closest(".replies").data("position"));
                }
                else{
                    selectedReplies.splice( $.inArray($(this).closest(".replies").data("position"), selectedReplies), 1 );
                }
            });
      });

    //  reply deletion
    function deleteReplies(){
        selectedReplies.sort();
        for (let index = 0; index < selectedReplies.length; index++) {
            db.collection('chats').doc(createDocQuery(selectedUserId)).update({
                [selectedReplies[index]]: firebase.firestore.FieldValue.delete()
            });
        }
        selectedReplies= [];
        $(".social-media .fa-check").remove();
    }

 
    // message chunk string rendering beautifier
    function chunk(str) {
        var ret = [];
        var i;
        var len;
        for(i = 0, len = str.length; i < len; i += 40) {
           ret.push(str.substr(i, 40))
        }
        return ret;
    }


    // notification renderer
    // function notificationRenderer(){
    //     db.collection('chats').doc(queryDoc).get().then((querySnapshot) => {

    //     })
    // }