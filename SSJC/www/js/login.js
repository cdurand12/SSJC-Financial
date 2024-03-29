const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');
require('jquery');



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



/*

// SESSION TIME OUT
// USE IF WANTED

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

*/


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

//Enter Listeners
var input = document.getElementById("password");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("login_button").click();
  }
});

var input = document.getElementById("email");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("login_button").click();
  }
});




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


/*
//this is now located in signup.js
//writes a new user to real-time database and sets up an empty portfolio
function writeNewUser(databaseReference, userId) {

    databaseReference.child("users").child(userId).child("portfolio").set("Empty");

}
*/








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





function getStocksArrayWatchlist(){
  var table = document.getElementById('watchlist');
  var stocksList = [];
  var stocksNumbersList = [];

  var tableLength = document.getElementById("watchlist").rows.length;
  //console.log(tableLength);
  for(var i=1; i < tableLength; i++){
    if(document.getElementById("wstck" + i).value != "")
    {
      stocksList.push(document.getElementById("wstck" + i).value);

    }
  }

  //alert([stocksList, stocksNumbersList]);

  //console.log(returnList);
  return [stocksList, stocksNumbersList];
}

function writeNewPortfolioWatchlist()
{

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var stockid = getStocksArrayWatchlist()
      var stockidArray = stockid[0]

      var user = firebase.auth().currentUser;
      var userid = user.uid;

      for(var i = 0; i < stockidArray.length; i++){
        var stockSym = stockidArray[i];



        firebaseRef.child("users").child(userid).child("watchlist").child(stockSym).set(0);
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


      //Populates Stock list from database added to stock table
      firebaseRef.child("users").child(userid).child("portfolio").once('value').then(function(snapshot){
        var userPortfolio = (snapshot.toJSON());
        if(userPortfolio != "Empty"){
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
      }
      });

      //Populates Watch list from database added to watchlist table
      firebaseRef.child("users").child(userid).child("watchlist").once('value').then(function(snapshot){
        var userWatchlist = (snapshot.toJSON());
        if(userWatchlist != "Empty"){
        var i = 1;
        for(var key in userWatchlist){
          if(i+1 >= document.getElementById("watchlist").rows.length)
            addrow(1);
          //console.log("Key: " + key);
          document.getElementById("wstck" + i).value = key;
          //console.log("Value: " + userPortfolio[key]);
          i++;
        }
      }
      });

      //Populate unallocated funds from database
      firebaseRef.child("users").child(userid).child("unallocatedFunds").once('value').then(function(snapshot){
        var unallocatedFunds = (snapshot.toJSON());
        console.log(unallocatedFunds);
        document.getElementById("ufunds").value = unallocatedFunds;
      });
    } else {
      // No user is signed in.
    }

  });
}



function unallocatedFunds()
{

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        var user = firebase.auth().currentUser;
        var userid = user.uid;
        var ufunds = document.getElementById("ufunds").value;


      firebaseRef.child("users").child(userid).child("unallocatedFunds").set(ufunds);
    } else {
      // No user is signed in.
    }
  });

}

/*



/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//WORK ON THIS!!!!!!!!!!
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////




function sellButtonWatchlist()
{

  if(document.getElementById("watchlist").rows.length > 2){
    var user = firebase.auth().currentUser;
    var userid = user.uid;
    var td = event.target.parentNode;
    var tr = td.parentNode;
    var Row = tr.getAttribute("id");
    var Cell = document.getElementById(Row).childNodes[0];
    var Symbol;

    if(Cell.firstChild){
      Symbol = Cell.firstChild.value;
    }
    else{
      Cell = document.getElementById(Row).childNodes[1];
      Symbol = Cell.firstChild.value;
    }
  firebaseRef.child("users").child(userid).child("watchlist").child(Symbol).remove();

  tr.parentNode.removeChild(tr);


  }
}
*/






function sellButton() {
  if(document.getElementById("stocktable").rows.length > 2){
      var user = firebase.auth().currentUser;
      var userid = user.uid;
      var td = event.target.parentNode;
      var tr = td.parentNode;
      var Row = tr.getAttribute("id");
      var Cell = document.getElementById(Row).childNodes[0];
      var Symbol;

      if(Cell.firstChild){
        Symbol = Cell.firstChild.value;
      }
      else{
        Cell = document.getElementById(Row).childNodes[1];
        Symbol = Cell.firstChild.value;
      }

      //Removes specified symbol from the database
      if(Symbol!=""){firebaseRef.child("users").child(userid).child("portfolio").child(Symbol).remove();}
      //Removes the line from the portfolio
      tr.parentNode.removeChild(tr);

      //console.log(tr);


    //RESETTING INDECIES OF IDS
      var id=1;
    // select all elements with id starting with "refItem", and loop
    $("tr[id^=row]").each(function(item) {
        // update the "id" properties
        $(this).prop("id", "row"+id);
        var stcktd =$(this).find('input')[0];
        var $domObj1 = $(stcktd);
        $domObj1.prop("id", "stck"+id)
        //console.log(stcktd);

        var numtd =$(this).find('input')[1];
        var $domObj2 = $(numtd);
        $domObj2.prop("id", "num"+id);
        $domObj2.prop("oninput", "calcValue(ask"+id+")");

        var asktd =$(this).find('input')[2];
        var $domObj3 = $(asktd);
        $domObj3.prop("id", "ask"+id);

        var bidtd =$(this).find('input')[3];
        var $domObj4 = $(bidtd);
        $domObj4.prop("id", "bid"+id);

        var asizetd =$(this).find('input')[4];
        var $domObj5 = $(asizetd);
        $domObj5.prop("id", "asize"+id);

        var bsizetd =$(this).find('input')[5];
        var $domObj6 = $(bsizetd);
        $domObj6.prop("id", "bsize"+id);

        var changetd =$(this).find('input')[6];
        var $domObj7 = $(changetd);
        $domObj7.prop("id", "change"+id);
        $domObj7.prop("oninput", "color(change"+id+")");

        var percenttd =$(this).find('input')[7];
        var $domObj8 = $(percenttd);
        $domObj8.prop("id", "percent"+id);
        $domObj8.prop("oninput", "color(percent"+id+")");

        var valuetd =$(this).find('input')[8];
        var $domObj9 = $(valuetd);
        $domObj9.prop("id", "value"+id);

        var pprtd =$(this).find('input')[9];
        var $domObj9 = $(pprtd);
        $domObj9.prop("id", "ppr"+id);

        id++;
    });
  }


}

function watchlistDelete() {
  if(document.getElementById("watchlist").rows.length > 2){
      var user = firebase.auth().currentUser;
      var userid = user.uid;
      var td = event.target.parentNode;
      var tr = td.parentNode;
      var Row = tr.getAttribute("id");
      var Cell = document.getElementById(Row).childNodes[0];
      var Symbol;


      if(Cell.firstChild){
        Symbol = Cell.firstChild.value;
      }
      else{
        Cell = document.getElementById(Row).childNodes[1];
        Symbol = Cell.firstChild.value;
      }

      //Removes specified symbol from the database
      if(Symbol!=""){firebaseRef.child("users").child(userid).child("watchlist").child(Symbol).remove();}
      //Removes the line from the portfolio
      tr.parentNode.removeChild(tr);

      //console.log(tr);


    //RESETTING INDECIES OF IDS
      var id=1;
    // select all elements with id starting with "refItem", and loop
    $("tr[id^=wrow]").each(function(item) {
        // update the "id" properties
        $(this).prop("id", "wrow"+id);
        var stcktd =$(this).find('input')[0];
        var $domObj1 = $(stcktd);
        $domObj1.prop("id", "wstck"+id)
        //console.log(stcktd);

        var asktd =$(this).find('input')[1];
        var $domObj3 = $(asktd);
        $domObj3.prop("id", "wask"+id);

        var bidtd =$(this).find('input')[2];
        var $domObj4 = $(bidtd);
        $domObj4.prop("id", "wbid"+id);

        var asizetd =$(this).find('input')[3];
        var $domObj5 = $(asizetd);
        $domObj5.prop("id", "wasize"+id);

        var bsizetd =$(this).find('input')[4];
        var $domObj6 = $(bsizetd);
        $domObj6.prop("id", "wbsize"+id);

        var changetd =$(this).find('input')[5];
        var $domObj7 = $(changetd);
        $domObj7.prop("id", "wchange"+id);
        $domObj7.prop("oninput", "color(wchange"+id+")");

        var percenttd =$(this).find('input')[6];
        var $domObj8 = $(percenttd);
        $domObj8.prop("id", "wpercent"+id);
        $domObj8.prop("oninput", "color(wpercent"+id+")");

        var valuetd =$(this).find('input')[7];
        var $domObj9 = $(valuetd);
        $domObj9.prop("id", "value"+id);

        id++;
    });
  }


}
