
$(document).ready(function(){
    let counter = 0
    db.collection("users").get()
    .then(function(querySnapshot) {
        $('.loader').fadeOut('slow');
        $('#frame').hide();
        $('#welcome').slideDown("slow");
        querySnapshot.forEach(function(doc) {
            counter++;
            if(doc.id === auth.currentUser.email){
                $('#userImage').attr("src", `${doc.data().photoURL}`);
                $('.userName').html(`${doc.data().displayName}`);
            }
            else{
                $(`<div class="text-left btn card shadow-lg bg-dark p-2 mb-2" id="${doc.id}">
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

