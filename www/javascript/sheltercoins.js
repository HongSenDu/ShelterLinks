var couponRedirect;
var names=[];
var idOfUser;
var email;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    name=auth.currentUser.displayName;
    var img2 = document.getElementById('myimg2');
    if(user.photoURL==null){
      img2.src="../images/white.png";
    }else{
      img2.src = user.photoURL;
    }
    email=auth.currentUser.email;
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
(function(){
  var sheltercoins=document.getElementById("sheltercoins");
  var couponsHave=document.getElementById("couponsHave");
  db.collection("Users").where("name", "==", name)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      points=doc.data().points;
      sheltercoins.innerHTML=points;
      couponsHave.innerHTML=Math.round(parseInt(points)/300);
      sheltercoinsNeeded.innerHTML=300-(points%300);

    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });

  db.collection("Coupons").where("isOn", "==", true).orderBy("business")
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshot
      var data=doc.data();
      var date=data.date;
      var counter=0;
      names.push(data.business);
      $("#coupons").append("<div class=\"myCoupon\">"+
      "<img class=\"couponImage\" src=\""+data.image+"\">"+
      "<div id=\""+doc.id+"\" class=\"couponInfo\"><a id=\""+doc.id+"\" class=\"btn btn-primary redeem couponRedirect\" href=\"#\" role=\"button\">View</a>"+
      "<h2 class=\"couponBusiness\">"+data.business+"</h2>"+
      "<h6 class=\"couponDescription\">"+data.description+" </h6>"+
      "<h6 class=\"couponAvaliable\"> <i> Scan the QR code at "+data.business+" to claim coupon </i></h6></div></div>")
    });
    couponRedirect=document.getElementsByClassName("couponRedirect");
    for (var i=0;i<couponRedirect.length;i++){
      couponRedirect[i].addEventListener('click',e => {
        db.collection("Coupons").doc(e.path[0].id)
        .get()
        .then(function(doc) {
            return db.collection("Users").doc(idOfUser).update({
              individualCoupon: e.path[0].id
            })
            .then(function() {
              window.location.href="individualCoupon.html";
            })
          })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
      })
  }
  });
}());
