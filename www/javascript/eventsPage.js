var data=[];
var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var db = firebase.firestore();
var idOfUser;
(function(){
  var auth = firebase.auth();
  var name;
  var email;
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
        })
      });
    }else {
      console.log("boi");
    }
  });
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd = '0'+dd
  }

  if(mm<10) {
    mm = '0'+mm
  }

  today = mm + '/' + dd + '/' + yyyy;
  db.collection("Events").where("isOn", "==", true)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (!(doc.data().endDate=="Ongoing")&&(doc.data().endDate<today)){
        db.collection("Events").doc(doc.id).delete().then(function() {
        }).catch(function(error) {
          console.error("Error removing document: ", error);
        });
        db.collection("Users").where("email","==",email)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc2) {
            var eventsGoing=doc2.data().eventsGoing;
            if (eventsGoing.indexOf(doc.id)>=0){
              eventsGoing.splice(eventsGoing.indexOf(doc.id),1);
            }
            return db.collection("Users").doc(doc2.id).update({
              eventsGoing: eventsGoing
            })
            .then(function() {
              location.reload();
            })
          });
        });
      }
    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });
  db.collection("Events").where("isOn", "==", true).orderBy("startDate")
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      data.push({
        key:doc.id,
        value:doc.data()
      });
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
      var tagString = "";
      doc.data().tags.forEach(function(tag) {
        tagString += "<span class=\"eventTag\"> " + tag +" </span>";
      });
      $("#events").append("<div class=\"myEvent\" ><div class=\"insertedEvent\"><a class=\"eventsLink\" id=\""+organization+"\">"+
      "<div class=\"eventInformation\"id=\""+organization+"\">" +
      "<div class=\"eventImageDiv\"><img class=\"eventImage\" src=\"" + imageSrc + "\" alt=\"Map Location\"></div>" +
      "<div class=\"inlineboi\"><img class=\"shelterImage\" src=\"\"/>"+
      "<h1 class=\"eventName\">" + name + "</h1>" +
      "<h6 class=\"eventTime\">"+ dateString +" in "+borough+"<span class=\"nope\">"+startDate+"</span></h6>" +
      "<h4 class=\"eventOrg\">Hosted by: "+ organization +"</h2>"+
      "<h3 class=\"easyDate\">"+month+"<br>"+day+"</h3></div>"+
      "<h5 class=\"eventVolunteers\">Volunteer Spots Left: " + numOfVolunteerRemaining + "</h5>"+
      "<div class=\"tags\">"+tagString+"</div></div>")
      counter++;
    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });



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
        return db.collection("Users").doc(idOfUser).update({
          eventsInfo: doc.id
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
}());
