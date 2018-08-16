var storage = firebase.storage();
var userdude;
var db = firebase.firestore();
var auth = firebase.auth();
var email;
var idOfUser;
var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
(function(){
  var username=document.getElementById("username");
  var name, photoUrl, uid, emailVerified;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name=auth.currentUser.displayName;
      email = auth.currentUser.email;
      var img = document.getElementById('myimg');
      var img2 = document.getElementById('myimg2');
      if(user.photoURL==null){
        img.src = "../images/white.png";
        img2.src="../images/white.png";
      }else{
        img.src = user.photoURL;
        img2.src = user.photoURL;
      }
      username.innerHTML=name;
      db.collection("Users").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          idOfUser=doc.id;
          type="user";
          $("#nav-bar").append("<div class=\"icon-bar\">"+
            "<a href=\"homepage.html\"><i class=\"fas fa-home\"></i></a>"+
            "<a href=\"eventsPage.html\"><i class=\"fa fa-calendar\"></i></a>"+
            "<a href=\"sheltercoins.html\"><i class=\"fas fa-link\"></i></a>"+
            "<a href=\"#\"><i class=\"fas fa-donate\"></i></a>"+
          "</div>")
          $("#eventsSigned").append("Events you signed up for<hr>")
          $("#eventsSign").append("Your Links<hr>");
          var eventsGoing=doc.data().eventsGoing;
          if (eventsGoing.length==0){
              $("#signedUpEvents").append("<br><br><i class=\"noEvents\">You didn't sign up for any events!</i><br><br><br><br>");
          }
          eventsGoing.forEach(function(event) {
            db.collection("Events").doc(event).get().then(function(doc){
              var name = doc.data().name;
              var startDate = doc.data().startDate;
              var day = new Date(startDate);
              var dayOfWeek =day.getDay();
              dayOfWeek=days[dayOfWeek];
              var months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
              var month = day.getMonth();
              month=months[month];
              var day = startDate.substring(3,5);
              if (day.indexOf("0")==0){
                day=day.substring(1);
              }
              var endDate = doc.data().endDate;
              var startTime = doc.data().startTime;
              var endTime = doc.data().endTime;
              var borough=doc.data().borough;
              var numOfVolunteerRemaining=doc.data().numOfVolunteerRemaining;
              if (borough=="Bronx"){
                borough="the Bronx";
              }
              var dateString = "";

              if(startDate == endDate) {
                dateString = dayOfWeek + ", " + startTime + " - " + endTime;
              } else if (endDate == "Ongoing" || endTime == "Ongoing") {
                dateString = dayOfWeek + ", " + startTime + " - Ongoing" ;
              } else if (endDate != startDate) {
                dateString = dayOfWeek + " - " + endDate + " | " + startTime + " - " + endTime;
              }
              var location = doc.data().location;
              var locationURL = encodeURI(location);
              var imageSrc = "";
              if(doc.data().imagePath == null) {
                imageSrc = "https://maps.googleapis.com/maps/api/staticmap?"+ "center=" + locationURL + "&size=1024x250&markers=red" + "&key=AIzaSyCQgxFBpg7lC0ij4Z_q-kSG9M11W58wof0";
              } else {
                imageSrc = doc.data().imagePath;
              }
              var volunteers = doc.data().numOfVolunteer;
              var organization = doc.data().organization;
              var counter=0;
              $("#signedUpEvents").append(
                "<div class=\"myEvent\" ><div class=\"insertedEvent\"><a class=\"eventsLink\" id=\""+organization+"\">"+
                "<div class=\"eventInformation\"id=\""+organization+"\">" +
                "<div class=\"inlineboi\"><img class=\"shelterImage\" src=\"\"/>"+
                "<h1 class=\"eventName\">" + name + "</h1>" +
                "<h6 class=\"eventTime\">"+ dateString +" in "+borough+"<span class=\"nope\">"+startDate+"</span></h6>" +
                "<h4 class=\"eventOrg\">Hosted by: "+ organization +"</h2>"+
                "<h3 class=\"easyDate\">"+month+"<br>"+day+"</h3></div>")
            });
          })
        })
        document.onclick = function(event) {
          var target = $(event.target.parentElement.parentElement);
          var target2 = $(event.target.parentElement);
          var data=target[0].innerHTML;
          var eventNamed=data.substring(data.indexOf("eventName")+11,data.indexOf("<",data.indexOf("eventName")+11));
          var startDatee=data.substring(data.indexOf("nope")+6,data.indexOf("<",data.indexOf("nope")+7));
          var timed=data.indexOf("eventTime");
          var timeds=data.indexOf(",",timed+1);
          var startTimed=data.substring(timeds+2,(data.indexOf("-",timed+1))-1).replace(" ","");
          var organization=target[0].id;
          db.collection("Events").where("organization", "==", organization).where("startDate", "==",startDatee).where("startTime", "==", startTimed).where("name", "==", eventNamed)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              return db.collection("Events").doc(doc.id).update({
                isOn: true
              })
              .then(function() {
                window.location.replace("eventsInfo.html");
              })
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
        };
      });
      db.collection("Shelters").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          idOfUser=doc.id;
          type="shelter";
          $("#nav-bar").append("<div class=\"icon-bar\">"+
            "<a href=\"homepage.html\"><i class=\"fas fa-home\"></i></a>"+
            "<a href=\"createEvents.html\"><i class=\"far fa-calendar-plus\"></i></a>"+
            "<a href=\"eventsManagement.html\"><i class=\"fa fa-tasks\"></i></a>"+
            "<a href=\"#\"><i class=\"fas fa-donate\"></i></a>"+
          "</div>")
        })
      });
    } else {
      console.log("boi");
    }
  });
}());
var uploader=document.getElementById("fileUpload");
fileUpload.addEventListener('change',function(e){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name=auth.currentUser.displayName;
      userdude = firebase.auth().currentUser;
    } else {
      console.log("boi");
    }
  });
  var file=e.target.files[0];
  var UserName="/"+name+"/";
  var stored='UserPictures/' +UserName+ file.name;
  var storageRef =storage.ref(stored);
  storageRef.put(file).then(function(snapshot) {
    storageRef.getDownloadURL().then(function(url) {
      db.collection("Users").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          return db.collection("Users").doc(doc.id).update({
            photoURL:url
          })
          .then(function(querySnapshot){
            userdude.updateProfile({
              photoURL: url
            }).then(function() {
              location.reload();
            }).catch(function(error) {
              console.log(error);
            })
          })
        });
      })
      db.collection("Shelters").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          return db.collection("Shelters").doc(doc.id).update({
            photoURL:url
          })
          .then(function(querySnapshot){
            userdude.updateProfile({
              photoURL: url
            }).then(function() {
              location.reload();
            }).catch(function(error) {
              console.log(error);
            })
          })
        });
      })
    }).catch(function(error) {
      console.log(error);
    });
  })
});
