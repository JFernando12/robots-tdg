"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappClient = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const numberValidation_1 = require("./numberValidation");
class Whatsapp {
    constructor() {
        this.conexionStatus = false;
        this.client = new whatsapp_web_js_1.Client({
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
            authStrategy: new whatsapp_web_js_1.LocalAuth(),
        });
    }
    start() {
        return new Promise((resolve, reject) => {
            if (this.conexionStatus) {
                resolve();
            }
            this.client.initialize();
            this.client.on('qr', (qr) => {
                qrcode_terminal_1.default.generate(qr, { small: true });
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
    stop() {
        return new Promise((resolve, reject) => {
            const stopConnection = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (this.conexionStatus) {
                        yield this.client.destroy();
                        this.conexionStatus = false;
                        console.log('WhatsApp closed!');
                    }
                    resolve();
                }
                catch (error) {
                    reject('No se pudo cerra la sesion correctamente');
                }
            });
            setTimeout(stopConnection, 5000);
        });
    }
    sendMessage(phoneNumber, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conexionStatus) {
                throw new Error('No hay conexion y no se puede enviar mensaje');
            }
            (0, numberValidation_1.numberValidation)(phoneNumber);
            yield this.client.sendMessage(`521${phoneNumber}@c.us`, message);
            console.log(`Message sent to: ${phoneNumber}`);
        });
    }
}
exports.whatsappClient = new Whatsapp();
