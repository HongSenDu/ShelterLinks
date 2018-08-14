var imagePath="";
var paperworked="";
var auth=firebase.auth();
var db = firebase.firestore();
var storage = firebase.storage();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    name=auth.currentUser.displayName;
    var img2 = document.getElementById('myimg2');
    if(user.photoURL==null){
      img2.src="../images/white.png";
    }else{
      img2.src = user.photoURL;
    }
  }else {
    console.log("boi");
  }
});
(function(){
  db.collection("Events").where("confirmVolunteers", "==", true).where("organization","==",name)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var volunteersNotConfirmed=doc.data().volunteersNotConfirmed;
      var volunteersString;
      if(volunteersNotConfirmed.length==0)
      {
        $("#volunteers").append("<h6 class=\"allConfirmed\"><i>All Volunteers have been confirmed.<br>Thank you!</i></h6>");
      }
      volunteersNotConfirmed.forEach(function(individuals) {
        db.collection("Users").where("email", "==", individuals)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc2) {
            var individualPhoto=doc2.data().photoURL;
            volunteersString = "<div class=\"eachVolunteer\"><img class=\"imagePhoto\" src=\""+individualPhoto+"\" /><h6 class=\"name\">"+doc2.data().name+"</h6>"+
            "<label class=\"container\"><input id=\""+doc2.data().email+"\" type=\"checkbox\" ><span class=\"checkmark\"></span></label></div>";
          });
          $("#volunteers").append(volunteersString);
        })
      });
      btnSubmit.addEventListener('click',e=>{
        var confirmedList=[];
        $('input[type=checkbox]').each(function () {
          confirmedList.push($(this).attr("id"));
        });
        var volunteersNotConfirmed=doc.data().volunteersNotConfirmed;
        confirmedList.forEach(function(eachPerson){
          db.collection("Users").where("email", "==", eachPerson)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc3) {
              var newPoints=doc3.data().points+doc.data().pointsGained;
              volunteersNotConfirmed.splice(volunteersNotConfirmed.indexOf(eachPerson),1);
              return db.collection("Users").doc(doc3.id).update({
                points: newPoints
              })
            });
            return db.collection("Events").doc(doc.id).update({
              volunteersNotConfirmed: volunteersNotConfirmed
            }).then(function() {
              window.location.replace("eventsManagement.html");
            })
          })
        })
      });
      return db.collection("Events").doc(doc.id).update({
        confirmVolunteers:false
      })
    });
  })
}());
