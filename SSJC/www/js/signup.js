const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');


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




function signup()
{
  var signupuserEmail = document.getElementById("signupemail").value;
  var signupuserPassword = document.getElementById("signuppassword").value;



      if (document.getElementById('signuppassword').value == document.getElementById('re_enter').value)
      {
          alert("Welcome!");
      } else {
          alert("INCORRECT TRY AGAIN");
      }


      // this is for the new user sign up
          firebase.auth().createUserWithEmailAndPassword(signupuserEmail, signupuserPassword).catch(function(error) {
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
          writeNewUserWatchlist(firebaseRef, user.uid);
          writeNewUserFunds(firebaseRef, user.uid);


          setTimeout(() => {window.location.assign('index.html');}, 2000);
        } else {
          // No user is signed in.
        }
      });

}//signup

//writes a new user to real-time database and sets up an empty portfolio
function writeNewUser(databaseReference, userId) {

    databaseReference.child("users").child(userId).child("portfolio").set("Empty");

}


//writes a new user to real-time database and sets up an empty portfolio
function writeNewUserWatchlist(databaseReference, userId) {

    databaseReference.child("users").child(userId).child("watchlist").set("Empty");

}


//writes a new user to real-time database and sets up an empty portfolio
function writeNewUserFunds(databaseReference, userId) {

    databaseReference.child("users").child(userId).child("unallocatedFunds").set("Empty");

}






function backButton()
{
  window.location.href = "login.html";
}
