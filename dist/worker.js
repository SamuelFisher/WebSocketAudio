//
// Copyright (c) 2016 Samuel Fisher//
// Licensed under the MIT License. See LICENSE.txt file in the project root for full license information.
//
function initWebSocket(url) {
    var connection = new WebSocket(url);
    connection.onerror = function (error) {
        console.log(error);
    };
    connection.onmessage = function (e) {
        self.postMessage(e.data);
    };
}
;
self.addEventListener('message', function (e) {
    var command = e.data.command;
    switch (command) {
        case 'init':
            initWebSocket(e.data.url);
            break;
        default:
            self.postMessage('Unknown command: ' + command, "*");
    }
    ;
}, false);
