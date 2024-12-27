import express from 'express';
import http from 'http';
import {WebSocketServer} from 'ws';
import {state} from './model/state.js';

const app = express();
// const server = http();

app.get("/",(req, res) => {
    res.json({ message:"Server is Working..." })
});


const server = http.createServer(app);

const wss = new WebSocketServer({ server: server});

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log(`Received Message = ${message}`);
        // ws.send(`Server Received Message = ${message}`);


        try{
            const data = JSON.parse(message);

            if(data.message === "fetch") {

                const ledState = state[0];

                ws.send(JSON.stringify(ledState));
                
            }
            else if(data.message === "update") {
                state[0] = {
                    name: "Led",
                    state: data.state
                }

                wss.clients.forEach(
                    (client) => {
                        client.send(JSON.stringify(state[0]));
                })
            }
            else{
                ws.send(JSON.stringify(
                    {message: "Invalid Command !!!"
                    
                    }
                ));
            }

        }catch(e){
            console.log(e.message);
            ws.send(JSON.stringify(
                {message: e.messagewhw

                }
            ));

        }



    });

});

server.listen(443, () => {
    console.log("Server is Running on port 443.");
});

