let userImage;
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
            console.log(doc.id, " => ", doc.data());
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
        let queryDoc = createDocQuery(clickedUser);
        db.collection('chats').doc(queryDoc).get().then((querySnapshot) => {
            let clickedUserName = $("[data='"+clickedUser+"'] h6").text();
            $('.contact-profile p').text(clickedUserName);
            $('.contact-profile img').attr("src", $("[data='"+clickedUser+"'] img")[0].currentSrc );
            $('.sent img').attr("src", $("[data='"+clickedUser+"'] img")[0].currentSrc );
            $('.replies img').attr("src", userImage );
            if(!querySnapshot.exists){
                db.collection('chats').doc(queryDoc).get().then(function(messageDatas) {
                    console.log(messageDatas);
                    // messageDatas.forEach(function(doc) { 
                    //     console.log(doc.id);
                    // })
                })
            }else{sendMessage("new")}
            //db.collection('chats').doc(queryDoc);
        });
    }

// send messages function
    function sendMessage(docStatus){
        
    }