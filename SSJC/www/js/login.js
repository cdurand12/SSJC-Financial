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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.

        document.getElementById("logoutDiv").style.display = "block";
        document.getElementById("loginDiv").style.display = "none";

        var user = firebase.auth().currentUser;

        if(user != null)
        {

          var email_id = user.email;

          document.getElementById("user_para").innerHTML = "Welcome User : " + "<br>" + email_id;

        }
    } else {
      // No user is signed in.

      document.getElementById("logoutDiv").style.display = "none";
      document.getElementById("loginDiv").style.display = "block";

    }
  });


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



function signup()
{
    var userEmail = document.getElementById("email").value;
    var userPassword = document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...

      alert("Error: " + errorMessage);

    });

    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var user = firebase.auth().currentUser;
    console.log(user);
    console.log(user.uid);
    writeNewUser(firebaseRef, user.uid);

    setTimeout(() => {window.location.assign('index.html');}, 2000);
  } else {
    // No user is signed in.
  }
});

}



function logout()
{
    firebase.auth().signOut();
    window.location.assign('login.html');

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

  alert([stocksList, stocksNumbersList]);

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
          console.log("Key: " + key);
          document.getElementById("stck" + i).value = key;
          console.log("Value: " + userPortfolio[key]);
          document.getElementById("num" + i).value = userPortfolio[key];
          i++;
        }
      });
    } else {
      // No user is signed in.
    }

  });
}
