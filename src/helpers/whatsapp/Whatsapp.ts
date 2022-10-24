import { Client, ClientSession, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { numberValidation } from './numberValidation';

class Whatsapp {
  private conexionStatus: boolean = false;
  private client: Client = new Client({
    puppeteer: {
      args: ['--no-sandbox'],
    },
    authStrategy: new LocalAuth(),
  });

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.conexionStatus) {
        resolve();
      }
      this.client.initialize();
      this.client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
      });
      this.client.on('ready', () => {
        this.conexionStatus = true;
        console.log('Whatsapp is ready!');
        resolve();
      });
      this.client.on('auth_failure', () => {
        reject();
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      const stopConnection = async () => {
        try {
          if (this.conexionStatus) {
            await this.client.destroy();
            this.conexionStatus = false;
            console.log('WhatsApp closed!');
          }
          resolve();
        } catch (error) {
          reject('No se pudo cerra la sesion correctamente');
        }
      };
      setTimeout(stopConnection, 5000);
    });
  }

  async sendMessage(phoneNumber: string, message: string): Promise<void> {
    if (!this.conexionStatus) {
      throw new Error('No hay conexion y no se puede enviar mensaje');
    }

    numberValidation(phoneNumber);

    await this.client.sendMessage(`521${phoneNumber}@c.us`, message);
    console.log(`Message sent to: ${phoneNumber}`);
  }
}

export const whatsappClient = new Whatsapp();
