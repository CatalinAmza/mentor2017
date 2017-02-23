/**
 * Created by goten on 23/02/17.
 */

"use strict";

let filename = 'test.in';

function show(output) {
    console.log(JSON.stringify(output, null, 4));
}

let fs = require('fs');

let input = fs.readFileSync(filename, 'utf8').split('\n');

let firstLine = input[0].split(' '),
    videoCount = parseInt(firstLine[0]),
    endpointCount = parseInt(firstLine[1]),
    requestCount = parseInt(firstLine[2]),
    cacheCount = parseInt(firstLine[3]),
    cacheSize = parseInt(firstLine[4]);

//show(videoCount, endpointCount, requestCount, cacheCount, cacheSize);

let secondLine = input[1].split(' '),
    videoSize = [];

secondLine.forEach(
    size => {
        videoSize.push(parseInt(size));
    }
);

//show(videoSize);

let endpointInfo = [];

let temp,
    temp2,
    currentLine = 2;

for (let i = 0; i < endpointCount; ++i) {

    temp = input[currentLine].split(' ');

    endpointInfo.push(
        {
            dataCenterLatency: parseInt(temp[0]),
            cachesConnected: parseInt(temp[1])
        }
    );

    endpointInfo[i].latencyTo = {};

    for (let j = 1; j <= temp[1]; ++j) {
        temp2 = input[currentLine + j].split(' ');
        endpointInfo[i].latencyTo[parseInt(temp2[0])] = parseInt(temp2[1]);
    }

    currentLine += endpointInfo[i].cachesConnected + 1;
}

let requests = [];

for (let i = 0; i < requestCount; ++i) {
    temp = input[currentLine + i].split(' ');

    requests.push({
        video: parseInt(temp[0]),
        endpoint: parseInt(temp[1]),
        count: parseInt(temp[2])
    });
}

//show(endpointInfo);

let l_min;

requests.forEach(
    request => {
        l_min = endpointInfo[request.endpoint].dataCenterLatency;
        endpointInfo[request.endpoint].cachesConnected.forEach(
            cache => {
                if()
            }
        )
    }
);