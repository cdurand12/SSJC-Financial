'use strict';
const request = require('request');
var stream;
var partialMessage;

var rowNum = 3;
function addrow(){
  if(rowNum == 50){ return; }
  var table = document.getElementById("stocktable");
  var row = table.insertRow(-1);
  rowNum = rowNum + 1;

  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  var td6 = document.createElement("td");
  var td7 = document.createElement("td");
  var xbutton = document.createElement("td");
  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(td3);
  row.appendChild(td4);
  row.appendChild(td5);
  row.appendChild(td6);
  row.appendChild(td7);
  row.appendChild(xbutton);

  var cell1 = document.createElement("input");
  cell1.setAttribute("style", "text-transform: uppercase");
  cell1.setAttribute("oninput", "this.value = this.value.toUpperCase()");
  cell1.setAttribute("type", "text");
  var text = "stck" + rowNum.toString();
  cell1.setAttribute("placeholder", text);
  cell1.setAttribute("id", text);
  td1.appendChild(cell1);
  var cell2 = document.createElement("input");
  cell2.setAttribute("type", "number");
  cell2.setAttribute("placeholder", "# of Stocks");
  cell2.setAttribute("min","0");
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
  cell4.setAttribute("id", text);
  td4.appendChild(cell4);
  var cell5 = document.createElement("input");
  cell5.setAttribute("disabled", "true");
  cell5.setAttribute("type", "text");
  cell5.setAttribute("placeholder", "Change");
  text = "change" + rowNum.toString();
  cell5.setAttribute("id", text);
  td5.appendChild(cell5);
  var cell6 = document.createElement("input");
  cell6.setAttribute("disabled", "true");
  cell6.setAttribute("type", "text");
  cell6.setAttribute("placeholder", "Change %");
  text = "percent" + rowNum.toString();
  cell6.setAttribute("id", text);
  td6.appendChild(cell6);
  var cell7 = document.createElement("input");
  cell7.setAttribute("type", "text");
  cell7.setAttribute("disabled", "true");
  cell7.setAttribute("placeholder", "Total Value");
  //cell7.setAttribute("id", "value4")
  td7.appendChild(cell7);
  var cell8 = document.createElement("img");
  cell8.setAttribute("src","img/redx.png");
  cell8.setAttribute("onclick","deletespecificrow()");
  cell8.setAttribute("height","10");
  cell8.setAttribute("width","10");
  cell8.setAttribute("vspace","5");
  xbutton.appendChild(cell8);
}

function deleterow() {
  if(document.getElementById("stocktable").rows.length > 2){
    document.getElementById("stocktable").deleteRow(-1);
    rowNum = rowNum - 1;
  }
}

function deletespecificrow() {
      // event.target will be the input element.
      var td = event.target.parentNode;
      var tr = td.parentNode;
      tr.parentNode.removeChild(tr);
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
              for(var i = 1; i < document.getElementById("stocktable").rows.length; i++){
                var quote = JSON.parse(message)[0];
                console.log(quote);
                console.log(quote.symbol, "ask"+i, document.getElementById("stck" + i).value);
                if(quote.symbol == document.getElementById("stck" + i).value){
                  document.getElementById("ask" + i).value = quote.latestPrice;
                  document.getElementById("bid" + i).value = quote.iexBidPrice;
                  document.getElementById("change" + i).value = quote.change;
                  document.getElementById("percent" + i).value = quote.changePercent;
                }
                //JSON example https://cloud.iexapis.com/stable/stock/aapl/quote?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4
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
