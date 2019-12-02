'use strict';
const request = require('request');
var stream;
var partialMessage;

function connect() {
    stream = request({
        url: 'https://sandbox-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=Tpk_ec167a483a264ef180330c1780cce7a4&symbols=AAPL',
        headers: {
            'Content-Type': 'text/event-stream'
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
        if (message) {
            try {
                var quote = JSON.parse(message)[0];
                console.log(quote);
            } catch (error) {
                partialMessage = message;
            }
        }
    });
});

function wait () {
    setTimeout(wait, 1000);
};

wait();
