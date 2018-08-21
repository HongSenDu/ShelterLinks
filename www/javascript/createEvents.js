var imagePath="";
var paperworked="";
var auth = firebase.auth();
var storage = firebase.storage();
var name;
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
  var tags=[];
  const nameOfEvent=document.getElementById('nameOfEvent');
  const description=document.getElementById('description');
  const address=document.getElementById('address');
  const borough=document.getElementById('borough');
  const zip=document.getElementById('zip');
  const startDateTime=document.getElementById('startDateTime');
  const endDateTime=document.getElementById('EndDateTime');
  const minAge=document.getElementById('minAge');
  const numOfVolunteers=document.getElementById('numOfVolunteers');
  const requirement=document.getElementById('requirements');
  const duty=document.getElementById('duties');
  const organizer=document.getElementById('organizerName');
  const phoneNumber=document.getElementById('phoneNumber');
  const contactEmail=document.getElementById('contactEmail');
  var org;
  var db = firebase.firestore();
  db.collection("Shelters").where("sheltername", "==", name)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var ourData=doc.data();
      organizer.value=ourData.manager+" ";
      phoneNumber.value=ourData.phone+"";
      zip.value=ourData.zip+"";
      address.value=ourData.address+"";
      borough.value=ourData.city+"";
      contactEmail.value=ourData.email+"";
    });
  })
  btnSubmit.addEventListener('click',e=>{

    if ($('#soup').is(':checked')) {
      tags.push("Soup Kitchen");
    }
    if ($('#pantry').is(':checked')) {
      tags.push("Food Pantry");
    }
    if ($('#1day').is(':checked')) {
      tags.push("Single Day");
    }
    if ($('#boi').is(':checked')) {
      tags.push("Continuing");
    }
    if ($('#donations').is(':checked')) {
      tags.push("Donations");
    }
    if ($('#Drive').is(':checked')) {
      tags.push("Drive");
    }
    if ($('#teens').is(':checked')) {
      tags.push("Teens allowed");
    }
    if ($('#date').is(':checked')) {
      endDateTime.type="text";
      endDateTime.value="Ongoing"
    }
    if ($('#noCap').is(':checked')) {
      numOfVolunteers.type="text";
      numOfVolunteers.value="No Limit";
    }
    const names=nameOfEvent.value;
    const descriptions=description.value;
    const addresses=address.value;
    const boroughs=borough.value+"";
    const zips=zip.value;
    const startDateTimes=startDateTime.value;
    const endDateTimes=endDateTime.value;
    const ages=minAge.value;
    const numOfVolunteer=numOfVolunteers.value;
    const requirements=requirement.value;
    const duties=duty.value;
    const organizers=organizer.value;
    const contactNum=phoneNumber.value;
    const contactEmails=contactEmail.value;
    var user;
    user = firebase.auth().currentUser;
    org=user.displayName+"";
    var db = firebase.firestore();
    var endDate=endDateTimes;
    var endTime=endDateTimes;
    var pointsGained;
    if (endTime=="Ongoing"){
      pointsGained="Varying Amount of";
    }else{
      pointsGained=pointsConverter(startDateTimes.substring(11,13),endDateTimes.substring(11,13));
    }
    if (!(endTime=="Ongoing")){
      endDate=endDateTimes.substring(5,7)+"/"+endDateTimes.substring(8,10)+"/"+endDateTimes.substring(0,4)
      endTime=endDateTimes.substring(11);
      endTime=timeConverter(endTime);
    }
    var startDate=startDateTimes.substring(5,7)+"/"+startDateTimes.substring(8,10)+"/"+startDateTimes.substring(0,4)
    var startTime=startDateTimes.substring(11);
    startTime=timeConverter(startTime);
    db.collection("Events").doc().set({
      name:names,
      organization: org,
      description:descriptions,
      address:addresses,
      borough:boroughs,
      zipCode:zips,
      startDate:startDate,
      endDate:endDate,
      startTime:startTime,
      endTime:endTime,
      minAge:ages,
      numOfVolunteer:numOfVolunteer,
      numOfVolunteerRemaining:numOfVolunteer,
      requirements:requirements,
      duties:duties,
      volunteersGoing:[],
      volunteersNotConfirmed:[],
      tags:tags,
      imagePath:imagePath,
      paperwork:paperworked,
      pointsGained:pointsGained,
      organizer:organizers,
      contactNumber:contactNum,
      contactEmail:contactEmails,
      isOn:true,
      confirmVolunteers:false,
      updateEvent:false
    }).then(function() {
      window.location.replace("eventsManagement.html");
})
  });
}());


var uploader=document.getElementById("fileUpload");
var paperwork=document.getElementById("paperwork");
fileUpload.addEventListener('change',function(e){

  var file=e.target.files[0];
  var UserName="/"+name+"/";
  var stored='Events/' +UserName+ file.name;
  var storageRef =storage.ref(stored);
  storageRef.put(file).then(function(snapshot) {
    storageRef.getDownloadURL().then(function(url) {
      var img = document.getElementById('myimg');
      img.src = url;
      imagePath=url;
    });
  })
});
paperwork.addEventListener('change',function(e){
  var file=e.target.files[0];
  var UserName="/"+name+"/";
  var stored='Events/' +UserName+ file.name;
  var storageRef =storage.ref(stored);
  storageRef.put(file).then(function(snapshot) {
    storageRef.getDownloadURL().then(function(url) {
      var dudu = document.getElementById('fileUploaded');
      dudu.innerHTML="File Uploaded : "+file.name;
      paperworked=url;
    });
  })
});
function timeConverter(time){
  var firstPart=parseInt(time.substring(0,2));
  if ((firstPart<12)&&(firstPart>0)){
    time+="AM";
  }else if(firstPart==0){
    time=12+time.substring(2)+"AM";
  }else if(firstPart==12){
    time+="PM";
  }else{
    var firstPart=firstPart-12;
    time=firstPart+time.substring(2)+"PM";
  }
  return time;
}
function pointsConverter(time1,time2){
  var firstPart=parseInt(time1.substring(0,2));
  var secondPart=parseInt(time2.substring(0,2));
  return ((secondPart-firstPart)*150);
}
