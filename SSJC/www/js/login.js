const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');


// References
// https://firebase.google.com/docs/database/web/start
// https://firebase.google.com/docs/database/web/read-and-write?authuser=0
// https://firebase.google.com/docs/database/web/structure-data?authuser=0


var firebaseConfig = {
  apiKey: "AIzaSyCkk-GqhhRAap7D7vwKzPuAGUZRDwYNAcs",
  authDomain: "ssjcfinance.firebaseapp.com",
  databaseURL: "https://ssjcfinance.firebaseio.com",
  projectId: "ssjcfinance",
  storageBucket: "ssjcfinance.appspot.com",
  messagingSenderId: "714960398494",
  appId: "1:714960398494:web:9134fab235ffefe699f38f",
  measurementId: "G-R0J4JC8WH3"
};

firebase.initializeApp(firebaseConfig);

var firebaseRef = firebase.database().ref();

function submitLogin(){
  var accountName = document.getElementById("login");
  var password = document.getElementById("password");
  firebaseRef.child(accountName.value).set(password.value);
}
