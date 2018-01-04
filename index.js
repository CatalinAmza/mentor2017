/**
 * Created by goten on 23/02/17.
 */

"use strict";

let filename = 'kittens';

function show(output) {
    console.log(JSON.stringify(output, null, 4));
}

let fs = require('fs');

let input = fs.readFileSync(filename + '.in', 'utf8').split('\n');

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
            cachesConnectedCount: parseInt(temp[1])
        }
    );

    endpointInfo[i].cachesConnected = [];

    endpointInfo[i].latencyTo = {};

    for (let j = 1; j <= temp[1]; ++j) {
        temp2 = input[currentLine + j].split(' ');
        endpointInfo[i].latencyTo[parseInt(temp2[0])] = parseInt(temp2[1]);
        endpointInfo[i].cachesConnected.push(parseInt(temp2[0]));
    }

    currentLine += endpointInfo[i].cachesConnectedCount + 1;
}

let requests = [];

for (let i = 0; i < requestCount; ++i) {
    temp = input[currentLine + i].split(' ');

    requests.push({
        video: parseInt(temp[0]),
        endpoint: parseInt(temp[1]),
        count: parseInt(temp[2]),
        id: i
    });
}

//show(endpointInfo);

let cacheInfo;

function initialize() {

    cacheInfo = [];

    for (let i = 0; i < cacheCount; ++i) {
        cacheInfo.push({
            currentSize: 0,
            videos: []
        });
    }
}

function put(video, cache) {
    if (cacheInfo[cache].videos.indexOf(video) == -1) {
        cacheInfo[cache].videos.push(video);
        cacheInfo[cache].currentSize += videoSize[video];
    }

}

function canPut(video, cache) {
    if (cacheInfo[cache].videos.indexOf(video) != -1) {
        return true;
    }
    else {
        return cacheInfo[cache].currentSize + videoSize[video] <= cacheSize;
    }
}

initialize();

let l_min;

let preferredCache;

let score = [];

requests.forEach(
    request => {
        score.push({
            request: request,
            value: 0
        })
    }
);

let newScore;

let request;

function refresh() {
    preferredCache = {};
    newScore = [];
    score.forEach(
        score => {
            request = score.request;
            l_min = endpointInfo[request.endpoint].dataCenterLatency;
            endpointInfo[request.endpoint].cachesConnected.forEach(
                cache => {
                    if (canPut(request.video, cache)) {
                        if (l_min > endpointInfo[request.endpoint].latencyTo[cache]) {
                            l_min = endpointInfo[request.endpoint].latencyTo[cache];
                            preferredCache[request.id] = cache;
                        }
                    }
                }
            );

            if (preferredCache[request.id] !== undefined) {
                newScore.push({
                    request: request,
                    value: l_min * request.count
                })
            }
        }
    );

    score = newScore;
    if (score.length) {
        console.log('1 ', score.length);
        score.sort((a, b) => b.value - a.value);
        request = score.pop().request;
        while (score.length && canPut(request.video, preferredCache[request.id])) {
            put(request.video, preferredCache[request.id]);
            request = score.pop().request;
        }
        refresh();
    }
}

function getMin(criteria, input) {
    let min = criteria(input[0]),
        res = 0;

    for (let i = 1; i < input.length; ++i) {
        if (min > criteria(input[i])) {
            min = criteria(input[i]);
            res = i;
        }
    }

    return res;
}

//show(score.sort((a, b) => a.value - b.value))
//show(preferredCache);
//show(score);

refresh();

function getValue(score) {
    return score.value;
}

let used_caches = 0;

let res = '';

cacheInfo.forEach(
    (cache, index) => {
        if (cache.videos.length) {
            ++used_caches;
            res += index + ' ';
            cache.videos.forEach(
                video => {
                    res += video + ' ';
                }
            );
            res += '\n'
        }
    }
);

res = used_caches + '\n' + res;

fs.writeFileSync(filename + '.out', res);