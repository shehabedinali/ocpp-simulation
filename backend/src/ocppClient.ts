import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

export class OCPPClient {
  private ws?: WebSocket;
  private readonly url: string;
  private readonly chargePointId: string;

  constructor(url: string, chargePointId: string) {
    this.url = `${url}/${chargePointId}`;
    this.chargePointId = chargePointId;
  }

  connect(onMessage: (msg: string) => void) {
    this.ws = new WebSocket(this.url);
    this.ws.on('open', () => console.log(`Connected as ${this.chargePointId}`));
    this.ws.on('message', (msg) => onMessage(msg.toString()));
    this.ws.on('close', () => console.log('Connection closed'));
    this.ws.on('error', (err) => console.error('WebSocket error', err));
  }

  sendBootNotification() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('Connection not open.');
      return;
    }
    const id = uuidv4();
    const payload = {
      chargePointVendor: 'DemoChargerCo',
      chargePointModel: 'DC-01',
      firmwareVersion: '1.0.0',
    };
    const message = [2, id, 'BootNotification', payload];
    this.ws.send(JSON.stringify(message));
  }
}
