
$(document).ready(function(){

    // $('#approve_form').h6.val("");
   
    
    db.collection("users").get()
    .then(function(querySnapshot) {

        $('.loader').fadeOut('slow');
   $('#force-overflow1 .card').click(function(){
         
             $('#selected_name').text($(this).first('h6').text())
             });   
    
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
    
const signUpform = $('.user_forms-signup')



signUpform.on('submit',function(event){
   
    event.preventDefault();
    const name = $('.taskForm2 #name').val();
    const email = $('.taskForm2 #email').val();
    const designation = $('.taskForm2 #designation').val();
    const password = $('.taskForm2 #password').val();
    // sign up the user
    auth2.createUserWithEmailAndPassword(email, password).then(cred => {
        var currentUser = auth.currentUser;
        currentUser.updateProfile({
            displayName: name, //setting up the user name with account display name
        })
        .then(function() {
            const userCollection = db.collection("users");
                userCollection.doc(email).set({
                    displayName: name,
                    designation: designation,
                    photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }).then(function() {
                    toastr["success"]("Successfully!", "New member created ")
                })
                .catch(function(error) {
                    console.log("Error writing document: ", error);
                });
          });
         
    

    }).catch( error => {
        toastr["error"](error.code, error.message)
 });
 });


    document.getElementById('signout').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        localStorage.clear()
        toastr['info']('You are signed out! ', 'see you soon');
        });
        window.location.replace("./index.html");
    });

