'use strict';
const request = require('request');
var stream;
var source;
var partialMessage;

//Real-time Stream Event Increment 1second, 5second
var streamTimer = "1second";


function addrow(table){
  if(table == 0)
  {
    var rowNum = document.getElementById("stocktable").rows.length;
    if(rowNum == 50){ return; }
    var table = document.getElementById("stocktable");
    var row = table.insertRow(-1);
    var text = "row" + rowNum.toString();
    row.setAttribute("id", text);

    var stck = document.createElement("td");
    var snum = document.createElement("td");
    var ask = document.createElement("td");
    var bid = document.createElement("td");
    var asize = document.createElement("td");
    var bsize = document.createElement("td");
    var change = document.createElement("td");
    var cpercent = document.createElement("td");
    var tvalue = document.createElement("td");
    var ppercent = document.createElement("td");
    var xbutton = document.createElement("td");
    xbutton.setAttribute("class", "xb");
    row.appendChild(stck);
    row.appendChild(snum);
    row.appendChild(ask);
    row.appendChild(bid);
    row.appendChild(asize);
    row.appendChild(bsize);
    row.appendChild(change);
    row.appendChild(cpercent);
    row.appendChild(tvalue);
    row.appendChild(ppercent);
    row.appendChild(xbutton);

    var cell1 = document.createElement("input");
    cell1.setAttribute("oninput", "this.value = this.value.toUpperCase()");
    cell1.setAttribute("type", "text");
    cell1.setAttribute("onchange", "iexconnect2()");
    text = "stck" + rowNum.toString();
    cell1.setAttribute("placeholder", "symbol");
    cell1.setAttribute("id", text);
    cell1.setAttribute("class", "stock");
    stck.appendChild(cell1);
    var cell2 = document.createElement("input");
    cell2.setAttribute("type", "number");
    cell2.setAttribute("placeholder", "0");
    cell2.setAttribute("min","0");
    cell2.setAttribute("onchange", "writeNewPortfolio()");
    text = "ask" + rowNum.toString();
    var funcText = "calcValue(\'" + text + "\')";
    cell2.setAttribute("oninput", funcText);
    cell2.setAttribute("id", ("num" + rowNum.toString()));
    cell2.setAttribute("class", "num");
    snum.appendChild(cell2);
    var cell3 = document.createElement("input");
    cell3.setAttribute("disabled", "true");
    cell3.setAttribute("type", "text");
    cell3.setAttribute("placeholder", "Last Price");
    cell3.setAttribute("oninput", funcText);
    cell3.setAttribute("id", text);
    cell3.setAttribute("class", "ask");
    ask.appendChild(cell3);
    var cell4 = document.createElement("input");
    cell4.setAttribute("disabled", "true");
    cell4.setAttribute("type", "text");
    cell4.setAttribute("placeholder", "Bid Price");
    text = "bid" + rowNum.toString();
    cell4.setAttribute("id", text);
    cell4.setAttribute("class", "bid");
    bid.appendChild(cell4);
    var cell5 = document.createElement("input");
    cell5.setAttribute("disabled", "true");
    cell5.setAttribute("placeholder", "Size")
    cell5.setAttribute("id", "asize"+rowNum);
    cell5.setAttribute("class", "absize");
    asize.appendChild(cell5);
    var cell6 = document.createElement("input");
    cell6.setAttribute("disabled", "true");
    cell6.setAttribute("placeholder", "Size");
    cell6.setAttribute("id", "bsize"+rowNum);
    cell6.setAttribute("class", "absize");
    bsize.appendChild(cell6);
    var cell7 = document.createElement("input");
    cell7.setAttribute("disabled", "true");
    cell7.setAttribute("type", "text");
    cell7.setAttribute("placeholder", "Net Change");
    text = "change" + rowNum.toString();
    cell7.setAttribute("oninput", ("color(\'" + text + "\')"))
    cell7.setAttribute("id", text);
    cell7.setAttribute("class", "net");
    change.appendChild(cell7);
    var cell8 = document.createElement("input");
    cell8.setAttribute("disabled", "true");
    cell8.setAttribute("type", "text");
    cell8.setAttribute("placeholder", "Change %");
    text = "percent" + rowNum.toString();
    cell8.setAttribute("oninput", ("color(\'" + text + "\')"))
    cell8.setAttribute("id", text);
    cell8.setAttribute("class", "perc");
    cpercent.appendChild(cell8);
    var cell9 = document.createElement("input");
    cell9.setAttribute("type", "text");
    cell9.setAttribute("disabled", "true");
    cell9.setAttribute("placeholder", "Total Value");
    text = "value" + rowNum.toString();
    cell9.setAttribute("id", text)
    tvalue.appendChild(cell9);
    var cell10 = document.createElement("input");
    cell10.setAttribute("disabled", "true");
    cell10.setAttribute("placeholder", "%");
    cell10.setAttribute("id", "ppr"+rowNum);
    cell10.setAttribute("class", "ppr");
    ppercent.appendChild(cell10);
    var xb = document.createElement("img");
    xb.setAttribute("src", "img/redx.png");
    xb.setAttribute("onclick", "sellButton()");
    xb.setAttribute("height", "10");
    xb.setAttribute("width", "10");
    xb.setAttribute("vspace", "5");
    xbutton.appendChild(xb);
  }
  else if(table == 1)
  {
    var rowNum = document.getElementById("watchlist").rows.length;
    if(rowNum == 50){ return; }
    var table = document.getElementById("watchlist");
    var row = table.insertRow(-1);
    var text = "wrow" + rowNum.toString();
    row.setAttribute("id", text);

    var stck = document.createElement("td");
    var ask = document.createElement("td");
    var bid = document.createElement("td");
    var asize = document.createElement("td");
    var bsize = document.createElement("td");
    var change = document.createElement("td");
    var cpercent = document.createElement("td");
    var xbutton = document.createElement("td");
    xbutton.setAttribute("class", "xb");
    row.appendChild(stck);
    row.appendChild(ask);
    row.appendChild(bid);
    row.appendChild(asize);
    row.appendChild(bsize);
    row.appendChild(change);
    row.appendChild(cpercent);
    row.appendChild(xbutton);

    var cell1 = document.createElement("input");
    cell1.setAttribute("oninput", "this.value = this.value.toUpperCase()");
    cell1.setAttribute("type", "text");
    cell1.setAttribute("placeholder", "symbol");
    cell1.setAttribute("onchange", "iexconnect2()");
    cell1.setAttribute("id", "wstck"+rowNum.toString());
    cell1.setAttribute("class", "stock");
    stck.appendChild(cell1);
    var cell3 = document.createElement("input");
    cell3.setAttribute("disabled", "true");
    cell3.setAttribute("type", "text");
    cell3.setAttribute("placeholder", "Last Price");
    cell3.setAttribute("id", "wask"+rowNum.toString());
    cell3.setAttribute("class", "ask");
    ask.appendChild(cell3);
    var cell4 = document.createElement("input");
    cell4.setAttribute("disabled", "true");
    cell4.setAttribute("type", "text");
    cell4.setAttribute("placeholder", "Bid Price");
    cell4.setAttribute("id", "wbid"+rowNum.toString());
    cell4.setAttribute("class", "bid");
    bid.appendChild(cell4);
    var cell5 = document.createElement("input");
    cell5.setAttribute("disabled", "true");
    cell5.setAttribute("placeholder", "Size");
    cell5.setAttribute("id", "wasize"+rowNum.toString());
    cell5.setAttribute("class", "absize");
    asize.appendChild(cell5);
    var cell6 = document.createElement("input");
    cell6.setAttribute("disabled", "true");
    cell6.setAttribute("placeholder", "Size");
    cell6.setAttribute("id", "wbsize"+rowNum.toString());
    cell6.setAttribute("class", "absize");
    bsize.appendChild(cell6);
    var cell7 = document.createElement("input");
    cell7.setAttribute("disabled", "true");
    cell7.setAttribute("type", "text");
    cell7.setAttribute("placeholder", "Net Change");
    //cell7.setAttribute("oninput", ("color(\'" + text + "\')"))
    cell7.setAttribute("id", "wchange"+rowNum.toString());
    cell7.setAttribute("class", "net");
    change.appendChild(cell7);
    var cell8 = document.createElement("input");
    cell8.setAttribute("disabled", "true");
    cell8.setAttribute("type", "text");
    cell8.setAttribute("placeholder", "Change %");
    cell8.setAttribute("id", "wpercent"+rowNum.toString());
    //cell8.setAttribute("oninput", ("color(\'" + text + "\')"))
    cell8.setAttribute("class", "perc");
    cpercent.appendChild(cell8);
    var xb = document.createElement("img");
    xb.setAttribute("src", "img/redx.png");
    xb.setAttribute("onclick", "watchlistDelete()");
    xb.setAttribute("height", "10");
    xb.setAttribute("width", "10");
    xb.setAttribute("vspace", "5");
    xbutton.appendChild(xb);
  }
}

function color(id)
{
  var tag = id;
  //console.log(tag);
  var num = document.getElementById(tag).value;
  //console.log(num);
  if(num[0] == "-"){ document.getElementById(tag).style.color="#ff0000"; }
  else if(num == 0){ document.getElementById(tag).style.color="#999999"; }
  else{ document.getElementById(tag).style.color="#27ae60"; }
}


function calcValue(asknumber)
{
  var row = asknumber.toString();
  var askP = Number(document.getElementById(row).value);
  if(asknumber.length == 4){ row = asknumber.substr(-1); }
  else if(asknumber.length == 5){ row = asknumber.substr(-2); }
  var num = Number(document.getElementById("num" + row).value);
  if(num < 0){ document.getElementById("num" + row).value = 0; num = 0; }
  var multVal = askP * num;
  var input = document.getElementById("value" + row);
  multVal = Math.round(multVal * 100 + Number.EPSILON) / 100;
  input.value = multVal;

  var totalAcc = 0;
  for(var i = 1; i < document.getElementById("stocktable").rows.length; i++){
    if(document.getElementById("value" + i).value != ""){
    totalAcc += parseFloat(document.getElementById("value" + i).value);
    }
  }
  var totalValue = (multVal / totalAcc) * 100;
  totalValue = Math.round(totalValue * 100 + Number.EPSILON) / 100;
  document.getElementById("ppr"+row).value = totalValue;
}

function iexconnect2(){
  if(source != null && source.readyState !== 2){
    console.log("stream stopped");
    source.close();
  }

  var stocks = getStocks();
  source = new EventSource(`https://cloud-sse.iexapis.com/stable/stocksUSNoUTP${streamTimer}?token=${iextoken}&symbols=${stocks}`);

  //TEST SOURCE
  //source = new EventSource(`https://sandbox-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=Tsk_4750097c011b4f69aa37b5bcaec5ebbe&symbols=${stocks}`);

  source.onmessage = function(){
    var chunk = event.data.toString();
    var cleanedChunk = chunk.replace(/data: /g, '');

    if (partialMessage) {
        cleanedChunk = partialMessage + cleanedChunk;
        partialMessage = "";
    }

    var chunkArray = cleanedChunk.split('\r\n\r\n');

    chunkArray.forEach(function (message) {
            //try {
              for(var i = 1; i < document.getElementById("stocktable").rows.length; i++){
                console.log("data recieved from iexconnect2");
                var quote = JSON.parse(message)[0];
                //console.log(quote);
                //console.log(quote.symbol, "ask"+i, document.getElementById("stck" + i).value);
                if(quote == null){ return; }
                if(document.getElementById("stck"+i).value != "" && quote.symbol == document.getElementById("stck" + i).value){
                  document.getElementById("ask" + i).value = quote.latestPrice;
                  calcValue("ask"+i);
                  document.getElementById("bid" + i).value = quote.iexBidPrice;
                  document.getElementById("change" + i).value = quote.change;
                  document.getElementById("percent" + i).value = quote.changePercent;
                  document.getElementById("asize" + i).value = quote.iexAskSize;
                  document.getElementById("bsize" + i).value = quote.iexBidSize;
                  color("change" + i);
                  color("percent" + i);
                  // if(quote.change > 0)
                  //   document.getElementById("change" + i).style.color = "green";
                  // elseif(quote.change < 0)
                  //   document.getElementById("change" + i).style.color = "red";
                  // else{
                  //   document.getElementById("change" + i).style.color = "black";
                  // }

                }

                if(document.getElementById("stck" + i).value == ""){
                  document.getElementById("ask" + i).value = "";
                  document.getElementById("bid" + i).value = "";
                  document.getElementById("change" + i).value = "";
                  document.getElementById("percent" + i).value = "";
                  document.getElementById("asize" + i).value = "";
                  document.getElementById("bsize" + i).value = "";
                  document.getElementById("value" + i).value = "";
                  document.getElementById("ppr" + i).value = "";
                }
                //JSON example https://cloud.iexapis.com/stable/stock/aapl/quote?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4
                //console.log(quote.symbol,quote.latestPrice, quote.iexBidPrice);
                }
                for(var i = 1; i < document.getElementById("watchlist").rows.length; i++){
                  console.log("watchlist time");
                  var quote = JSON.parse(message)[0];
                  if(quote == null){ return; }
                  if(document.getElementById("wstck"+i).value != "" && quote.symbol == document.getElementById("wstck"+i).value){
                    document.getElementById("wask" + i).value = quote.latestPrice;
                    document.getElementById("wbid" + i).value = quote.iexBidPrice;
                    document.getElementById("wchange" + i).value = quote.change;
                    document.getElementById("wpercent" + i).value = quote.changePercent;
                    document.getElementById("wasize" + i).value = quote.iexAskSize;
                    document.getElementById("wbsize" + i).value = quote.iexBidSize;
                    color("wchange" + i);
                    color("wpercent" + i);
                  }

                  if(document.getElementById("wstck"+i).value == ""){
                    document.getElementById("wask" + i).value = "";
                    document.getElementById("wbid" + i).value = "";
                    document.getElementById("wchange" + i).value = "";
                    document.getElementById("wpercent" + i).value = "";
                    document.getElementById("wasize" + i).value = "";
                    document.getElementById("wbsize" + i).value = "";
                  }
                }
            //} catch (error) {
                //partialMessage = message;
            //}
    });
  }
}

function getStocks(){
  var table = document.getElementById('stocktable');
  var stocksList = "";
  var tableLength = document.getElementById("stocktable").rows.length;
  //console.log(tableLength);
  for(var i=1; i < tableLength; i++){
    if(document.getElementById("stck" + i).value != ""){
      stocksList += (document.getElementById("stck" + i).value + ",");
    }
  }
  table = document.getElementById('watchlist');
  tableLength = document.getElementById("watchlist").rows.length;
  for(var i=1; i < tableLength; i++){
    if(document.getElementById("wstck" + i).value != ""){
      stocksList += (document.getElementById("wstck" + i).value + ",");
    }
  }
  var returnList = stocksList.substring(0, stocksList.length - 1);
  return returnList;
}
