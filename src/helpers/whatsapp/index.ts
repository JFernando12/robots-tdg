import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox'],
  },
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

const number = '7551005114';
client.on('ready', async () => {
  console.log('Client is ready!');
  await client.sendMessage(`521${number}@c.us`, 'pong');
  console.log('Mensaje enviado');
  setTimeout(closeConnection, 5000);
});

const closeConnection = () => {
  client.destroy();
};

client.initialize();

export default client;
