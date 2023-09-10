const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const url = require('url');

//This function generates ids
wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return 'USER' + '-' + s4() + '-' + s4();
};

//This function checks if the client is a driver. If not gives an id to the client
// wss.checkClient = function (ws) {
//     if (ws.id) {
//         console.log(ws.id);
//     } else {
//         if (ws.upgradeReq.url.slice(1)) {
//             ws.id = ws.upgradeReq.url.slice(1)}
//         else {
//             ws.id = wss.getUniqueID();
//         }
//     }
// }
server.listen(8080, () => {
  console.log("Listening to port 8080");
});

wss.on("connection", function connection(ws, req) {
    //Check the id for driver
    // wss.checkClient(ws);
    
    console.log("new client connected");

    //We have a connection
    ws.on("message", function incoming(message, isBinary) {
        
        // if (ws.id.length > 3) {
        //     wss.clients.forEach(function each(client) {
        //         //Check if the user is connected
        //         if (client.readyState === WebSocket.OPEN && client.id == 123) {
                    
        //             //Send the message to the user
        //             client.send(message.toString());
        //         }
        //     });
        // } 
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});


