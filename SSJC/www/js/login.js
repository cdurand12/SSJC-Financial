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

}





function logout()
{
    firebase.auth().signOut();
}




function send_verification()
{
    var user = firebase.auth().currentUser;

    user.updateEmail("user@example.com").then(function() {
      // Update successful.

      alert("Verification Sent");

    }).catch(function(error) {
      // An error happened.

      alert("Error: " + errorMessage);

    });

}

/*

var firebaseRef = firebase.database().ref();

function submitLogin(){
  var accountName = document.getElementById("login");
  var password = document.getElementById("password");
  firebaseRef.child("Test").set("test");
  firebaseRef.child(accountName.value).set(password.value);
}

*/
