'use strict';
const request = require('request');
var stream;
var partialMessage;

var rowNum = 3;
function addrow(){
  var table = document.getElementById("stocktable");
  var row = table.insertRow(-1);
  rowNum = rowNum + 1;

  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(td3);
  row.appendChild(td4);
  row.appendChild(td5);

  var cell1 = document.createElement("input");
  cell1.setAttribute("style", "text-transform: uppercase");
  cell1.setAttribute("type", "text");
  var text = "stck" + rowNum.toString();
  cell1.setAttribute("placeholder", text);
  cell1.setAttribute("id", text);
  td1.appendChild(cell1);
  var cell2 = document.createElement("input");
  cell2.setAttribute("type", "text");
  cell2.setAttribute("placeholder", "# of Stocks");
  //cell2.setAttribute("onchange")
  td2.appendChild(cell2);
  var cell3 = document.createElement("input");
  cell3.setAttribute("disabled", "true");
  cell3.setAttribute("type", "text");
  cell3.setAttribute("placeholder", "Asking Price");
  text = "ask" + rowNum.toString();
  cell3.setAttribute("id", text);
  td3.appendChild(cell3);
  var cell4 = document.createElement("input");
  cell4.setAttribute("disabled", "true");
  cell4.setAttribute("type", "text");
  cell4.setAttribute("placeholder", "Bid Price");
  text = "bid" + rowNum.toString();
  cell4.setAttribute("id", text)
  td4.appendChild(cell4);
  var cell5 = document.createElement("input");
  cell5.setAttribute("type", "text");
  cell5.setAttribute("disabled", "true");
  cell5.setAttribute("placeholder", "Total Value");
  //cell5.setAttribute("id", "value4")
  td5.appendChild(cell5);
}

function deleterow() {
  if(document.getElementById("stocktable").rows.length > 2){
    document.getElementById("stocktable").deleteRow(-1);
    rowNum = rowNum - 1;
  }

}

function iexconnect(){

  if(stream){
  stream.abort();
  console.log("stream stopped");
  }

function connect() {
  var stocks = getStocks();
  console.log(stocks);
    stream = request({
        url: (`https://cloud-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4&symbols=${stocks}`),
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        }
    })
}
connect();

stream.on('socket', () => {
    console.log("Connected");
});

stream.on('end', () => {
    console.log("Reconnecting");
    connect();
});

stream.on('complete', () => {
    console.log("Reconnecting");
    connect();
});

stream.on('error', (err) => {
    console.log("Error", err);
    connect();
});

stream.on('data', (response) => {
    var chunk = response.toString();
    var cleanedChunk = chunk.replace(/data: /g, '');

    if (partialMessage) {
        cleanedChunk = partialMessage + cleanedChunk;
        partialMessage = "";
    }

    var chunkArray = cleanedChunk.split('\r\n\r\n');

    chunkArray.forEach(function (message) {
            try {
              console.log(document.getElementById("stocktable").rows.length);

              for(var i = 1; i < document.getElementById("stocktable").rows.length; i++){
                var quote = JSON.parse(message)[0];
                console.log(quote);
                console.log(quote.symbol, "ask"+i, document.getElementById("stck" + i).value);
                if(quote.symbol == document.getElementById("stck" + i).value){
                  document.getElementById("ask" + i).value = quote.latestPrice;
                  document.getElementById("bid" + i).value = quote.iexBidPrice;
                }
                //console.log(quote.symbol,quote.latestPrice, quote.iexBidPrice);
                }
            } catch (error) {
                partialMessage = message;
            }
    });
console.log("data recieved");
});

function wait () {
    setTimeout(wait, 1000);
};

wait();
}


function getStocks(){
  var table = document.getElementById('stocktable');
  var stocksList = "";
  var tableLength = document.getElementById("stocktable").rows.length;
  console.log(tableLength);
  for(var i=1; i < tableLength; i++){
    if(document.getElementById("stck" + i).value != ""){
      stocksList += (document.getElementById("stck" + i).value + ",");
    }
  }
  var returnList = stocksList.substring(0, stocksList.length - 1);
  console.log(returnList);
  return returnList;
}
