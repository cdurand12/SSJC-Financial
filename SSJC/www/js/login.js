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

function submitLogin(){
  var accountName = document.getElementById("login");
  var password = document.getElementById("password");
  firebaseRef.child("Test").set("test");
  firebaseRef.child(accountName.value).set(password.value);
}
