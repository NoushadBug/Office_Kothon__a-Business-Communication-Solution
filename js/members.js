let userImage;
let docAvailable;
let selectedUserName;
let selectedUserImage;
let selectedUserDesignation;
let selectedUserId;
let animationTriggered = false;
let selectedReplies= [];
let loadSvg = true;
let unreadMessage = 0;
let unreadThread;
let serverUpdated = false;
let docLists = [];
let selectedDocInfo = [];
var queryExists;
var queriedInfo;
var renderedChats = [];
// TODO:global variables

$(document).ready(function(){
    $(".edit").click(function(){
        alert('hi ');
        $("#exampleModalCenter").modal('show');
    });

    db.collection("users").get()
    .then(function(querySnapshot) {
        $('.loader').fadeOut('slow');
      
    
        querySnapshot.forEach(function(doc) {
            if(doc.id === auth.currentUser.email){
                if(doc.data().designation == 'unknown'){
                    window.location.replace('./userNotVerified.html');
                }
                else{
                $('#userImage').attr("src", `${doc.data().photoURL}`);
                $('.userName').html(`${doc.data().displayName}`);
                userImage = doc.data().photoURL;}
            }
            else{
                if(doc.data().designation != 'admin' && doc.data().designation != 'unknown'){
                $(`<div class="text-left btn card shadow-lg bg-dark p-2 mb-2" data="${doc.id}">
                <div class="row m-auto">
                  <img src="${doc.data().photoURL}" class="col-md-4 rounded" alt="">
                  <div class="col-md-6 pl-0 m-auto">
                    <h6 class="text-light m-0 d-block">${doc.data().displayName}</h6>
                    <small class="text-info m-0">${doc.data().designation}</small>
                   
                    <div class="dropdown-menu bg-dark shadow-lg text-center" aria-labelledby="dropdownMenuButton" id="myselect">

    <li class="text-light edit " ><i class="fa fa-pencil text-info mr-2  "></i> Edit</li>
    <li class="text-light delete" ><i class="fa fa-trash text-info mr-2 " ></i> Delete</li>
    
  </div>
  </div>
  <i class="fa fa-ellipsis-v text-secondary col-md-2 my-auto  " id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
   



            </div>`).appendTo('#force-overflow');
            }
        }
            //console.log(doc.id, " => ", doc.data());
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
        localStorage.clear()
        toastr['info']('You are signed out! ', 'see you soon');
        });
        window.location.replace("./index.html");
    });

