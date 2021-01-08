
document.getElementById('signout').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
      localStorage.clear();
      toastr['info']('You are signed out! ', 'see you soon');
      });
      window.location.replace("./index.html");
  });

$(document).ready(function () {


  db.collection("users").onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.id == auth.currentUser.email) {
        $('#userImage').attr("src", `${doc.data().photoURL}`);
        $('.userName').html(`${doc.data().displayName}`);
        $('#settings-name').val(`${doc.data().displayName}`);
        $('.designation').html(`${doc.data().designation}`);
        $('.bio').text(`${doc.data().bio}`);
        $('#bioDetails').val(`${doc.data().bio}`);
        userBio = doc.data().bio;
        userPhoto = doc.data().photoURL;
        userDesignation = doc.data().designation;
      }
  });
  $('.loader').fadeOut('slow');
})

  
 








  
    })