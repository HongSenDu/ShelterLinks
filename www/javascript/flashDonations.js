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
var email;
var name;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    name=auth.currentUser.displayName;
    var img2 = document.getElementById('myimg2');
    email=auth.currentUser.email;
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
          "<a href=\"homepage.html\"><i class=\"fas fa-home\"></i></a>"+
          "<a href=\"eventsPage.html\"><i class=\"fa fa-calendar\"></i></a>"+
          "<a href=\"sheltercoins.html\"><i class=\"fas fa-link\"></i></a>"+
          "<a style=\"color:#ba3b21;\" href=\"flashDonations.html\"><i class=\"fas fa-donate\"></i></a>"+
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
          "<a href=\"createEvents.html\"><i class=\"far fa-calendar-plus\"></i></a>"+
          "<a href=\"eventsManagement.html\"><i class=\"fa fa-tasks\"></i></a>"+
          "<a style=\"color:#ba3b21;\" href=\"flashDonations.html\"><i class=\"fas fa-donate\"></i></a>"+
        "</div>")
      })
    });
  }else {
    console.log("boi");
  }
});
(function(){
  console.log(today);
  db.collection("Donations").where("date", "==", today)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      $("#donations").append("<img id=\"shelter\" src=\""+doc.data().image+"\">");
      $("#hosted").append(""+doc.data().name);
      $("#totalAmount").append("$"+doc.data().totalDonations);
      var countDownDate = new Date("Aug 22, 2018 20:30").getTime();
      $("#donateNow").append("<button id=\"five\" type=\"button\" class=\"btn btn-primary\">$5</button><button id=\"ten\" type=\"button\" class=\"btn btn-primary\">$10</button>"+
      "<button id=\"twenty\" type=\"button\" class=\"btn btn-primary\">$20</button>"+
      "<button id=\"twentyFive\" type=\"button\" class=\"btn btn-primary\">$25</button>"+
      "<button id=\"fifty\" type=\"button\" class=\"btn btn-primary\">$50</button>"+
      "<div class=\"form-group\"><label for=\"txtName\">Other Amount</label><input id=\"txtName\" type=\"text\" class=\"form-control\" placeholder=\"$0.00\"></input></div><br>"+
      "<button type=\"button\" id=\"testing\" class=\"btn btn-primary\">Chip in Now!</button>");
      var testing=document.getElementById("testing");
      var bubble=document.getElementById("bubble");
      var toDonate=0;
      document.getElementById('five').onclick = function() {
        toDonate=5;
      };
      document.getElementById('ten').onclick = function() {
        toDonate=10;
      };
      document.getElementById('twenty').onclick = function() {
        toDonate=20;
      };
      document.getElementById('twentyFive').onclick = function() {
        toDonate=25;
      };
      document.getElementById('fifty').onclick = function() {
        toDonate=50;
      };
      testing.addEventListener('click',e=>{
        db.collection("Users").where("email","==",email)
        .get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc2) {
            if (toDonate==0){
              toDonate=parseInt(document.getElementById('txtName').value);
            }
            var individualPhoto=doc2.data().photoURL;
            var named=doc2.data().name;
            db.collection("Donations").doc(doc.id).collection("Donators").where("email","==",email)
            .get().then(function(querySnapshot) {
              if (querySnapshot.empty){
                db.collection("Donations").doc(doc.id).collection("Donators").doc().set({
                  totalAmountDonated:toDonate,
                  email:email,
                  isOn:true,
                  name:name
                }).then(function() {
                  db.collection("Donations").doc(doc.id).collection("toAppear").doc().set({
                    image:individualPhoto,
                    name:named,
                    delete:true,
                    amountDonated:toDonate
                  }).then(function() {
                    console.log("boi");
                  })
                })
              }else{
                querySnapshot.forEach(function(doc3) {
                  var boi=parseInt(doc3.data().totalAmountDonated+toDonate);
                  db.collection("Donations").doc(doc.id).collection("Donators").doc(doc3.id).update({
                    totalAmountDonated:boi
                  }).then(function() {
                    db.collection("Donations").doc(doc.id).collection("toAppear").doc().set({
                      image:individualPhoto,
                      name:named,
                      delete:true,
                      amountDonated:toDonate
                    }).then(function() {
                      console.log("boi");
                    })
                  })
                });
              }
            });
          });
        });
      })
      var counter=1;
      var volunteersString="";
      db.collection("Donations").doc(doc.id).collection("Donators").where("isOn","==",true).orderBy("totalAmountDonated","desc")
      .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var individualPhoto=doc.data().image;
          var ranking=doc.data().totalAmountDonated;
          volunteersString += "<div class=\"eachVolunteer\"><span class=\"counter\" id=\"the"+counter+"\">#"+counter+"</span><h6 class=\"name\">"+doc.data().name+"</h6><h6 class=\"rankings\">$"+ranking+"</h6></div>";
          counter++;
        });
        $("#leaderboard").append(volunteersString);
        $('#the1').after('<img class=\"trophy\" src="../images/gold.png" />');
        $('#the2').after('<img class=\"trophy\" src="../images/silver.png" />');
        $('#the3').after('<img class=\"trophy\" src="../images/bronze.png" />');

      });


      var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("remaining").innerHTML = hours + "h "
        + minutes + "m " + seconds + "s ";
        db.collection("Donations").doc(doc.id).collection("toAppear").where("delete","==",true)
        .get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc1) {
            var image=doc1.data().image;
            $("#bubble").append("<div id=\"theAnim\" style=\"display:block;animation:animation 70080ms linear both;\"><img src=\""+image+"\" id=\"circle\"/><h1 id=\"names\">"+doc1.data().name+"</h1><h6 id=\"appear\">Donated $"+doc1.data().amountDonated+"</h6></div>");
            var counter=1;
            document.getElementById("leaderboard").innerHTML="";
            var volunteersString="";
            var totalDonated=0;
            db.collection("Donations").doc(doc.id).collection("Donators").where("isOn","==",true).orderBy("totalAmountDonated","desc")
            .get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                document.getElementById("bubble").style.display="block";
                var individualPhoto=doc.data().image;
                var ranking=doc.data().totalAmountDonated;
                totalDonated+=ranking;
                volunteersString += "<div class=\"eachVolunteer\"><span class=\"counter\" id=\"the"+counter+"\">#"+counter+"</span><h6 class=\"name\">"+doc.data().name+"</h6><h6 class=\"rankings\">$"+ranking+"</h6></div>";
                counter++;
              });
              $("#leaderboard").append(volunteersString);
              $('#the1').after('<img class=\"trophy\" src="../images/gold.png" />');
              $('#the2').after('<img class=\"trophy\" src="../images/silver.png" />');
              $('#the3').after('<img class=\"trophy\" src="../images/bronze.png" />');
              return db.collection("Donations").doc(doc.id).update({
                totalDonations:totalDonated
              }).then(function() {
                document.getElementById("totalAmount").innerHTML="$"+totalDonated;
              })
            });
          });
        });
      }, 1000);
    });
  })


}());
