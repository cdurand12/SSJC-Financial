const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');



// References
//https://www.npmjs.com/package/firebase
// https://firebase.google.com/docs/database/web/start
// https://firebase.google.com/docs/database/web/read-and-write?authuser=0
// https://firebase.google.com/docs/database/web/structure-data?authuser=0


var firebaseConfig = {
    apiKey: "AIzaSyARLvXIXTz6MVLcY17rRq3eT1f-A7VuH8c",
    authDomain: "ssjcfinancial.firebaseapp.com",
    databaseURL: "https://ssjcfinancial.firebaseio.com",
    projectId: "ssjcfinancial",
    storageBucket: "ssjcfinancial.appspot.com",
    messagingSenderId: "291022424761",
    appId: "1:291022424761:web:48f6f25b07481385266968",
    measurementId: "G-W9E6LMT1EK"
};

firebase.initializeApp(firebaseConfig);

var firebaseRef = firebase.database().ref();

//displays either the login screen or logout screen
//if the user is not logged in, it will display the login screen
//if the user is logged in, it will display the logout screen





// Perform session logout and redirect to homepage after 300 seconds(5 minutes)
var IDLE_TIMEOUT = 300; //seconds
var _idleSecondsCounter = 0;
document.onclick = function() {
    _idleSecondsCounter = 0;
};
document.onmousemove = function() {
    _idleSecondsCounter = 0;
};
document.onkeypress = function() {
    _idleSecondsCounter = 0;
};
window.setInterval(CheckIdleTime, 1000);

function CheckIdleTime() {
    _idleSecondsCounter++;
    var oPanel = document.getElementById("SecondsUntilExpire");
    if (oPanel)
        oPanel.innerHTML = (IDLE_TIMEOUT - _idleSecondsCounter) + "";
    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
        alert("Time expired!");
        document.location.href = "login.html";
    }
}



function login()
{
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;

    //this will check if the user logs in with the correct email and password

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        alert("Error: " + errorMessage);

      });

      //sets window the main portfolio window index.html


    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    // User is signed in.
    setTimeout(() => {window.location.assign('index.html');}, 2000);
    }
});

}




function new_user()
{
    window.location.href = "signup.html";

}


function relogin()
{
  window.location.assign('login.html');

}





function logout()
{
    firebase.auth().signOut();
    window.location.assign('logout.html');

}



//writes a new user to real-time database and sets up an empty portfolio
function writeNewUser(databaseReference, userId) {

    databaseReference.child("users").child(userId).child("portfolio").set("Empty");

}

function getStocksArray(){
  var table = document.getElementById('stocktable');
  var stocksList = [];
  var stocksNumbersList = [];

  var tableLength = document.getElementById("stocktable").rows.length;
  //console.log(tableLength);
  for(var i=1; i < tableLength; i++){
    if(document.getElementById("stck" + i).value != "" && document.getElementById("num" + i).value != "")
    {
      stocksList.push(document.getElementById("stck" + i).value);
      stocksNumbersList.push(document.getElementById("num" + i).value);

    }
  }

  //alert([stocksList, stocksNumbersList]);

  //console.log(returnList);
  return [stocksList, stocksNumbersList];
}

function writeNewPortfolio()
{

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var stockid = getStocksArray()
      var stockidArray = stockid[0]
      var stockNumberArray = stockid[1]

      var user = firebase.auth().currentUser;
      var userid = user.uid;

      for(var i = 0; i < stockidArray.length; i++){
        var stockSym = stockidArray[i];
        var shareNum = stockNumberArray[i];
        firebaseRef.child("users").child(userid).child("portfolio").child(stockSym).set(shareNum);
        //firebaseRef.child("users").child(userid).child("portfolio").child("stock").set(stockSym);
        //firebaseRef.child("users").child(userid).child("portfolio").child("stock").child(stockSym).child("shares").set(shareNum);
      }

    //  firebase.database().ref().child("users").child(userid).child("test").set("Empty");

    } else {
      // No user is signed in.
    }
  });

}


function resetPassword()
{

  var userEmail = document.getElementById("email").value;

  var emailAddress = userEmail;

  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
  }).catch(function(error) {
    // An error happened.

    var errorCode = error.code;
    var errorMessage = error.message;
    // ...

    alert("Error: " + errorMessage);

  });

}

function popPortfolio(){

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var user = firebase.auth().currentUser;
      var userid = user.uid;

      firebaseRef.child("users").child(userid).child("portfolio").once('value').then(function(snapshot){
        var userPortfolio = (snapshot.toJSON());
        //console.log(userPortfolio);

        var i = 1;
        for(var key in userPortfolio){
          if(i+1 >= document.getElementById("stocktable").rows.length)
            addrow(0);
          //console.log("Key: " + key);
          document.getElementById("stck" + i).value = key;
          //console.log("Value: " + userPortfolio[key]);
          document.getElementById("num" + i).value = userPortfolio[key];
          i++;
        }
      });
    } else {
      // No user is signed in.
    }

  });
}





function sellButton() {
      var user = firebase.auth().currentUser;
      var userid = user.uid;



      var td = event.target.parentNode;
      var tr = td.parentNode;

      alert(tr.cells[1].value);

      firebaseRef.child("users").child(userid).child("portfolio").child(td.cells[0].value).remove();

      tr.parentNode.removeChild(tr);


}
