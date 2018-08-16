var auth = firebase.auth();
var name;
var email;
var correctId;
var type;
var db = firebase.firestore();
(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name=auth.currentUser.displayName;
      var img2 = document.getElementById('myimg2');
      email=auth.currentUser.email;
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
          db.collection("Users").where("email", "==", email)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc1) {
              correctId=doc1.data().articleOn;
              db.collection("Articles").doc(correctId)
              .get()
              .then(function(doc) {
                var name=doc.data().name;
                var article=doc.data().article;
                var title=doc.data().title;
                var startDate=doc.data().startDate;
                var endDate=doc.data().endDate;
                var image=doc.data().image;
                $("#article").append("<img class=\"articleImage\" src=\""+image+"\"/>"+
                "<div class=\"text\"><h3 class=\"name\">"+name+"</h3>"+
                "<h6 class=\"date\">"+startDate+"-"+endDate+"</h6>"+
                "<h3 class=\"title\">"+title+"</h3>"+
                "<p class=\"actualArticle>\"\t><span class=\"tab\"></span>"+article+"</p><div>");
              });
            })
          });
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
          "<a href=\"createEvents.html\"><i class=\"far fa-calendar-plus\"></i></a>"+
          "<a href=\"eventsManagement.html\"><i class=\"fa fa-tasks\"></i></a>"+
          "<a href=\"#\"><i class=\"fas fa-donate\"></i></a>"+
          "</div>")
          db.collection("Shelters").where("email", "==", email)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc1) {
              correctId=doc1.data().articleOn;
              db.collection("Articles").doc(correctId)
              .get()
              .then(function(doc) {
                var name=doc.data().name;
                var article=doc.data().article;
                var title=doc.data().title;
                var startDate=doc.data().startDate;
                var endDate=doc.data().endDate;
                var image=doc.data().image;
                $("#article").append("<img class=\"articleImage\" src=\""+image+"\"/>"+
                "<div class=\"text\"><h3 class=\"name\">"+name+"</h3>"+
                "<h6 class=\"date\">"+startDate+"-"+endDate+"</h6>"+
                "<h3 class=\"title\">"+title+"</h3>"+
                "<p class=\"actualArticle>\"\t><span class=\"tab\"></span>"+article+"</p><div>");
              });
            })
          });
        })
      });

      if(user.photoURL==null){
        img2.src="../images/white.png";;
      }else{
        img2.src = user.photoURL;
      }
    }else {
      console.log("boi");
    }
  });
}());
