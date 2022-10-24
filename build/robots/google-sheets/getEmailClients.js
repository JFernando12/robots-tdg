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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailClients = void 0;
const currentSheet_1 = require("../../settings/currentSheet");
const getEmailClients = () => __awaiter(void 0, void 0, void 0, function* () {
    let emails = yield currentSheet_1.currentSheet.get({
        nombre: 'General',
        celdaInicio: 'AF2',
        celdaFinal: 'AF900',
    });
    emails = emails === null || emails === void 0 ? void 0 : emails.filter((email) => email.length !== 0).filter((email) => email[0].includes('@')).map((email) => email[0]);
    return emails;
});
exports.getEmailClients = getEmailClients;
