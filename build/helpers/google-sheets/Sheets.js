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
exports.Sheets = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const local_auth_1 = require("@google-cloud/local-auth");
const googleapis_1 = require("googleapis");
const ValueInputOption_1 = require("../../interfaces/ValueInputOption");
class Sheets {
    constructor(spreadsheetId) {
        this.SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
        this.TOKEN_PATH = path_1.default.join(process_1.default.cwd(), 'token.json');
        this.CREDENTIALS_PATH = path_1.default.join(process_1.default.cwd(), 'credentials.json');
        this.spreadsheetId = spreadsheetId;
    }
    loadSavedCredentialsIfExist() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield fs_1.promises.readFile(this.TOKEN_PATH);
                //@ts-ignore
                const credentials = JSON.parse(content);
                return googleapis_1.google.auth.fromJSON(credentials);
            }
            catch (err) {
                return null;
            }
        });
    }
    saveCredentials(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield fs_1.promises.readFile(this.CREDENTIALS_PATH);
            //@ts-ignore
            const keys = JSON.parse(content);
            const key = keys.installed || keys.web;
            const payload = JSON.stringify({
                type: 'authorized_user',
                client_id: key.client_id,
                client_secret: key.client_secret,
                refresh_token: client.credentials.refresh_token,
            });
            yield fs_1.promises.writeFile(this.TOKEN_PATH, payload);
        });
    }
    authorize() {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield this.loadSavedCredentialsIfExist();
            if (client) {
                return client;
            }
            client = yield (0, local_auth_1.authenticate)({
                scopes: this.SCOPES,
                keyfilePath: this.CREDENTIALS_PATH,
            });
            if (client.credentials) {
                yield this.saveCredentials(client);
            }
            return client;
        });
    }
    sheets() {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = yield this.authorize();
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            return sheets;
        });
    }
    get(range) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = yield this.sheets();
            let rangeSpreadsheet;
            if (range.celdaFinal) {
                rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}:${range.celdaFinal}`;
            }
            else {
                rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}`;
            }
            try {
                const res = yield sheets.spreadsheets.values.get({
                    spreadsheetId: this.spreadsheetId,
                    range: rangeSpreadsheet,
                });
                return res.data.values;
            }
            catch (error) {
                throw new Error(`Unable to parse range: ${rangeSpreadsheet}`);
            }
        });
    }
    update(range, values, valueInputOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = yield this.sheets();
            let rangeSpreadsheet;
            if (range.celdaFinal) {
                rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}:${range.celdaFinal}`;
            }
            else {
                rangeSpreadsheet = `${range.nombre}!${range.celdaInicio}`;
            }
            if (!valueInputOption) {
                valueInputOption = ValueInputOption_1.ValueInputOption.RAW;
            }
            try {
                //@ts-ignore
                const res = yield sheets.spreadsheets.values.update({
                    spreadsheetId: this.spreadsheetId,
                    range: rangeSpreadsheet,
                    valueInputOption,
                    resource: {
                        values,
                    },
                });
                console.log('Sheet updated');
                //@ts-ignore
                return res.data;
            }
            catch (error) {
                throw new Error(`Unable to parse range: ${rangeSpreadsheet}`);
            }
        });
    }
}
exports.Sheets = Sheets;
