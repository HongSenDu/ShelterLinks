
var db = firebase.firestore();
(function(){
  var auth = firebase.auth();
  var name;
  var email;
  var type;
  var idOfUser;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name=auth.currentUser.displayName;
      email=auth.currentUser.email;
      var img2 = document.getElementById('myimg2');
      if(user.photoURL==null){
        img2.src="../images/white.png";
      }else{
        img2.src = user.photoURL;
      }
      db.collection("Users").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          idOfUser=doc.id;
          type="user";
          $("#nav-bar").append("<div class=\"icon-bar\">"+
            "<a style=\"color:#ba3b21;\" href=\"homepage.html\"><i class=\"fas fa-home\"></i></a>"+
            "<a href=\"eventsPage.html\"><i class=\"fa fa-calendar\"></i></a>"+
            "<a href=\"sheltercoins.html\"><i class=\"fas fa-link\"></i></a>"+
            "<a href=\"#\"><i class=\"fas fa-donate\"></i></a>"+
          "</div>")
        })
      });
      db.collection("Shelters").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          idOfUser=doc.id;
          type="shelter";
          $("#nav-bar").append("<div class=\"icon-bar\">"+
            "<a style=\"color:#ba3b21;\" href=\"homepage.html\"><i class=\"fas fa-home\"></i></a>"+
            "<a href=\"createEvents.html\"><i class=\"fa fa-calendar\"></i></a>"+
            "<a href=\"eventsManagement.html\"><i class=\"fas fa-link\"></i></a>"+
            "<a href=\"#\"><i class=\"fas fa-donate\"></i></a>"+
          "</div>")
        })
      });
    }else {
      console.log("boi");
    }
  });
  db.collection("Articles").get().then(function(querySnapshot) {
    var name;
    var article;
    var title;
    var startDate;
    var endDate;
    var image;
    querySnapshot.forEach(function(doc) {
        name=doc.data().name;
        article=doc.data().article;
        title=doc.data().title;
        startDate=doc.data().startDate;
        endDate=doc.data().endDate;
        image=doc.data().image;
        if (doc.id=="ShelterOfTheWeek"){
          $("#shelterOfWeek").append("<div id=\"article1\">"+
          "<img class=\"articleImage\" src=\""+image+"\"/>"+
          "<h3 class=\"name\">"+name+"</h3>"+
          "<h6 class=\"date\">"+startDate+"-"+endDate+"</h6>"+
          "<h3 class=\"title\">"+title+"</h3>"+
          "</div>");
          var article1=document.getElementById("article1");
          article1.addEventListener('click',function(e){
            if (type=="user"){
              return db.collection("Users").doc(idOfUser).update({
                articleOn: "ShelterOfTheWeek"
              })
              .then(function() {
                window.location.href="articles.html";
              })
            }else{
              return db.collection("Shelters").doc(idOfUser).update({
                articleOn: "ShelterOfTheWeek"
              })
              .then(function() {
                window.location.href="articles.html";
              })
            }
          });
        }
        if (doc.id=="VolunteerOfTheWeek"){
          $("#volunteerOfWeek").append("<div id=\"article2\">"+
          "<img class=\"articleImage2\" src=\""+image+"\"/>"+
          "<h3 class=\"name2\">"+name+"</h3>"+
          "<h3 class=\"title2\">"+title+"</h3>"+
          "</div>");
          var article2=document.getElementById("article2");
          article2.addEventListener('click',function(e){
            if (type=="user"){
              return db.collection("Users").doc(idOfUser).update({
                articleOn: "VolunteerOfTheWeek"
              })
              .then(function() {
                window.location.href="articles.html";
              })
            }else{
              return db.collection("Shelters").doc(idOfUser).update({
                articleOn: "ShelterOfTheWeek"
              })
              .then(function() {
                window.location.href="articles.html";
              })
            }
          });
        }
        if (doc.id=="HomelessOfTheWeek"){
          $("#homelessOfWeek").append("<div id=\"article3\">"+
          "<img class=\"articleImage2\" src=\""+image+"\"/>"+
          "<h3 class=\"name2\">"+name+"</h3>"+
          "<h3 class=\"title2\">"+title+"</h3>"+
          "</div>");
          var article3=document.getElementById("article3");
          article3.addEventListener('click',function(e){
            if (type=="user"){
              return db.collection("Users").doc(idOfUser).update({
                articleOn: "HomelessOfTheWeek"
              })
              .then(function() {
                window.location.href="articles.html";
              })
            }else{
              return db.collection("Shelters").doc(idOfUser).update({
                articleOn: "ShelterOfTheWeek"
              })
              .then(function() {
                window.location.href="articles.html";
              })
            }
          });
        }
    });
});
}());
