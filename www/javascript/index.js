var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months=["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
var db = firebase.firestore();
var auth = firebase.auth();
(function(){
  const btnSignOut=document.getElementById('btnSignOut');
  btnSignOut.addEventListener('click',e=>{
    auth.signOut();
    var x = setTimeOut(function() {
      window.location.replace("volunteer.html");
    }, 1000);
  });
}());
