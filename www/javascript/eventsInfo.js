var auth = firebase.auth();
var name;
var email;
var volunteerArray;
var doced;
var correctId;
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
        querySnapshot.forEach(function(doc1) {
          correctId=doc1.data().eventsInfo;
          db.collection("Events").doc(correctId)
          .get()
          .then(function(doc) {
            var doced=doc;
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
              dateString =   startTime + " - Ongoing" ;
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
            var paperworkVolunteers="";
            if (doc.data().paperwork.length>0){
              paperworkVolunteers="<a style=\"text-decoration:underline;\" href=\""+doc.data().paperwork+"\" download>Click to Download Paperwork</a>";
            }else{
              paperworkVolunteers="Yay! No paperwork!";
            }
            var real=doc.data().numOfVolunteerRemaining;
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
            volunteersGoing.forEach(function(volunteerGo){
              volunteerGoingString+="<span class=\"volunteerGoing\"> " +volunteerGo +" </span>"
            })
            var counter=0;
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
                $("#info").append(displayVolunteers);
              })
            });
            $("#info").append("<div class=\"myEvent\" ><div class=\"insertedEvent\"><a class=\"eventsLink\" id=\""+organization+"\">"+
            "<div class=\"eventInformation\"id=\""+organization+"\">" +
            "<div class=\"eventImageDiv\"><img class=\"eventImage\" src=\"" + imageSrc + "\" alt=\"Map Location\"></div>" +
            "<div class=\"inlineboi\"><img class=\"shelterImage\" src=\"\"/>"+
            "<p class=\"hosted\">Hosted By</p>"+
            "<h1 class=\"eventName\">" + name + "</h1>" +
            "<br><h2 class=\"eventOrg\">"+ organization +"</h2>"+
            "<h6 class=\"eventTime\">"+ dayOfWeek+", "+month+" "+day+", "+dateString+"<span class=\"nope\">"+startDate+"</span></h6>" +
            "<h5 class=\"address\">" +address+", "+borough+", New York City, "+zipCode + "</h5>"+
            "<h5 class=\"pointsAvaliable\">"+points+" ShelterCoins avaliable</h5>"+
            "<div class=\"tags\">"+tagString+"</div></div><br><br><hr>"+
            "<div class=\"eachInfo\"><h6 class=\"knows\">Description<br></h6><p class=\"info\">"+doc.data().description+"</p></div>"+
            "<div class=\"eachInfo\"><h6 class=\"knows\">Duties<br></h6><p class=\"info\">"+doc.data().duties+"</p></div>"+
            "<div class=\"eachInfo\"><h6 class=\"knows\">Requirements<br></h6><p class=\"info\">The Minimum Age is "+doc.data().minAge+". "+doc.data().requirements+"</p></div>"+
            "<div class=\"eachInfo\"><h6 class=\"knows\">Contact Information<br></h6><p class=\"info\">Event Cordinator: "+doc.data().organizer+"</p><p class=\"dudu\">Contact Number: "+doc.data().contactNumber+"</p><p class=\"dudu\">Contact Email: "+doc.data().contactEmail+"</p></div>"+
            "<div class=\"eachInfo\"><h6 class=\"knows\">Paperwork for Volunteers(Bring on Day)<br></h6><p class=\"info\">"+paperworkVolunteers+"</p></div>"+
            "<hr><div class=\"voluns\">Volunteer Spots Left: "+"<span id=\"remain\">"+doc.data().numOfVolunteerRemaining+"</span>"+"</div><div id=\"displayVolunteers\"></div><hr>"+
            "<div class=\"volunteer\"><button type=\"button\" id=\"signedUp\" class=\"btn btn-primary volunteered\">I want to volunteer</button></div>")
            var signedUp=document.getElementById("signedUp");
            if (numOfVolunteerRemaining==0&&(!(volunteerArray.indexOf(email)>=0))){
              signedUp.disabled=true;
            }
            if (volunteerArray.indexOf(email)>=0){
              signedUp.innerHTML="I can not make it";
              signedUp.addEventListener('click',e => {
                db.collection("Users").where("email","==",email)
                .get()
                .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc2) {
                    var eventsGoing=doc2.data().eventsGoing;
                    if (eventsGoing.indexOf(doc.id)>=0){
                      eventsGoing.splice(eventsGoing.indexOf(doc.id),1);
                    }
                    return db.collection("Users").doc(doc2.id).update({
                      eventsGoing: eventsGoing,
                    })
                    .then(function() {
                      volunteersNotConfirmed.splice(volunteersNotConfirmed.indexOf(email),1);
                      volunteerArray.splice(volunteerArray.indexOf(email),1);
                      if(!(real=="No Limit")){
                        real+=1;
                      }
                      return db.collection("Events").doc(doc.id).update({
                        volunteersGoing: volunteerArray,
                        volunteersNotConfirmed:volunteersNotConfirmed,
                        numOfVolunteerRemaining:real
                      }).then(function() {
                        window.location.href="eventsPage.html";
                      })

                    })

                  });
                });
              });
            }else{
              signedUp.addEventListener('click',e => {
                return db.collection("Users").doc(doc1.id).update({
                  signedUp: doc.id
                }).then(function() {
                  window.location.href="signedUp.html";
                })
              });
            }
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
