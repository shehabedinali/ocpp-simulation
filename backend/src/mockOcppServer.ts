// src/mockOcppServer.ts
import WebSocket from 'ws';
const wss = new WebSocket.Server({ port: 9000 });
console.log('Mock OCPP Server on ws://localhost:9000');

wss.on('connection', (ws:WebSocket, req) => {
  const chargePointId = req.url?.split('/').pop() || 'UNKNOWN';
  console.log(`⚡ Charge Point [${chargePointId}] connected.`);

  ws.on('message', (msg) => {
    const [type, id, action] = JSON.parse(msg.toString());
    console.log('Received', action);
    if (action === 'BootNotification') {
      const response = [3, id, {
        status: 'Accepted',
        currentTime: new Date().toISOString(),
        interval: 300,
      }];
      ws.send(JSON.stringify(response));
    }
  });
});
