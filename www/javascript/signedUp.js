var name;
var email;
var volunteerArray;
var storage = firebase.storage();
(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      name=auth.currentUser.displayName;
      email=auth.currentUser.email;
      db.collection("Users").where("email", "==", email)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc1) {
          correctId=doc1.data().signedUp;
          db.collection("Events").doc(correctId)
          .get()
          .then(function(doc) {
            var ourData=doc.data();
            volunteerArray=doc.data().volunteersGoing;
            var name = doc.data().name;
            var startDate = doc.data().startDate;
            var day = new Date(startDate);
            var dayOfWeek =day.getDay();
            dayOfWeek=days[dayOfWeek];
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
              dateString =  startTime + " - " + endTime;
            } else if (endDate == "Ongoing" || endTime == "Ongoing") {
              dateString =  ", " + startTime + " - Ongoing" ;
            } else if (endDate != startDate) {
              dateString = " - " + endDate + " | " + startTime + " - " + endTime;
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
            var address = doc.data().address;
            var zipCode=doc.data().zipCode;
            var points=doc.data().pointsGained;
            volunteerArray=doc.data().volunteersGoing;
            var volunteersGoing=doc.data().volunteersGoing;
            var volunteersNotConfirmed=doc.data().volunteersNotConfirmed;
            var volunteerGoingString="";
            var displayVolunteers="";
            var tagString = "";
            doc.data().tags.forEach(function(tag) {
              tagString += "<span class=\"eventTag\"> " + tag +" </span>";
            });
            volunteerArray.forEach(function(individuals) {
              db.collection("Users").where("email", "==", individuals)
              .get()
              .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  var individualPhoto=doc.data().photoURL;
                  displayVolunteers = "<img class=\"imagePhoto\" src=\""+individualPhoto+"\" />";
                });
                $("#displayVolunteers").append(displayVolunteers);
              })
            });
            $("#signed").append(
              "<div class=\"myEvent\" ><div class=\"insertedEvent\"><a class=\"eventsLink\" id=\""+organization+"\">"+
              "<div class=\"eventInformation\"id=\""+organization+"\">" +
              "<div class=\"eventImageDiv\"><img class=\"eventImage\" src=\"" + imageSrc + "\" alt=\"Map Location\"></div>" +
              "<div class=\"inlineboi\"><img class=\"shelterImage\" src=\"\"/>"+
              "<p class=\"hosted\">Hosted By</p>"+
              "<h1 class=\"eventName\">" + name + "</h1>" +
              "<br><h2 class=\"eventOrg\">"+ organization +"</h2>"+
              "<h6 class=\"eventTime\">"+ dayOfWeek+", "+month+" "+day+", "+dateString+"<span class=\"nope\">"+startDate+"</span></h6>" +
              "<h5 class=\"address\">" +address+", "+borough+", New York City, "+zipCode + "</h5>"+
              "<h5 class=\"pointsAvaliable\">"+points+" ShelterCoins avaliable</h5>"+
              "<div class=\"tags\">"+tagString+"</div></div><br><br>"+
              "<hr><div class=\"voluns\">Volunteer Spots Left: "+"<span id=\"remain\">"+doc.data().numOfVolunteerRemaining+"</span>"+"</div><div id=\"displayVolunteers\"></div>"+
              "<div class=\"volunteer\"><button type=\"button\" id=\"signedUp\" class=\"btn btn-primary volunteered\">Confirm</button></div>"
            )
            signedUp.addEventListener('click',e => {
              volunteerArray.push(email);
              volunteersNotConfirmed.push(email);
              var newNumber;
              if (doc.data().numOfVolunteerRemaining=="No Limit"){
                newNumber="No Limit";
              }else{
                newNumber=doc.data().numOfVolunteerRemaining-1;
              }
              return db.collection("Events").doc(doc.id).update({
                volunteersGoing:volunteerArray,
                volunteersNotConfirmed:volunteersNotConfirmed,
                numOfVolunteerRemaining:newNumber
              })
              .then(function() {
                db.collection("Users").where("email", "==", email)
                .get()
                .then(function(querySnapshot) {
                  querySnapshot.forEach(function(docd) {
                    var eventsGoing=docd.data().eventsGoing;
                    eventsGoing.push(doc.id)
                    return db.collection("Users").doc(docd.id).update({
                      eventsGoing:eventsGoing
                    })
                    .then(function(querySnapshot){
                      window.location.replace("eventsInfo.html");
                    })
                  });
                })
              })
            });
          });
        })
      });
    }else {
      console.log("boi");
    }
  });
}());
