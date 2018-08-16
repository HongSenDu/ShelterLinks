var db = firebase.firestore();
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear()+"";
yyyy=yyyy.substring(2);
if(dd<10) {
  dd = '0'+dd
}

if(mm<10) {
  mm = '0'+mm
}

today = mm + '/' + dd + '/' + yyyy;
(function(){
  console.log(today);
  db.collection("Donations").where("date", "==", today)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      $("#donations").append("<img id=\"shelter\" src=\""+doc.data().image+"\">");
    });
  })
  var testing=document.getElementById("testing");
  var circle=document.getElementById("circle");
  testing.addEventListener('click',e=>{
    circle.style.display='block';
  circle.src="../images/logo.png";
  circle.style.animation='animation 50080ms linear both';
  circle.style.animation='animation 50080ms linear  both';
  })
  function stop(circle){
    circle.style.display="none";
  }

}());
