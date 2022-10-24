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
exports.sendTrackingGuide = void 0;
const ValueInputOption_1 = require("../../interfaces/ValueInputOption");
const currentSheet_1 = require("../../settings/currentSheet");
const checks_1 = require("../../settings/checks");
const ValueChecks_1 = require("../../interfaces/ValueChecks");
const Whatsapp_1 = require("../../helpers/whatsapp/Whatsapp");
const PositionsGuide_1 = require("../../interfaces/PositionsGuide");
const addNote_1 = require("../../helpers/google-sheets/addNote");
const alertWhatsapp_1 = require("../../helpers/whatsapp/alertWhatsapp");
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield currentSheet_1.currentSheet.get({
        nombre: 'prueba',
        celdaInicio: 'A2',
        celdaFinal: 'H1000',
    });
    if (!data) {
        return [];
    }
    return data;
});
const notSentWhatsapp = (data) => {
    data = data
        .filter((order) => (0, checks_1.isGuideCreated)(order[PositionsGuide_1.PosGuide.guideCreated]))
        .filter((order) => !(0, checks_1.isGuideSentWhatsapp)(order[PositionsGuide_1.PosGuide.guideSentWhatsapp]));
    return data;
};
const sendTrackingGuide = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Whatsapp_1.whatsappClient.start();
        let data = yield getData();
        if (!data) {
            throw new Error('No hay data disponible');
        }
        let dataWhatsapp = notSentWhatsapp(data);
        console.log(dataWhatsapp);
        let i = 0;
        while (dataWhatsapp.length > i) {
            let order = dataWhatsapp[i];
            const orderId = order[PositionsGuide_1.PosGuide.orderId];
            let noteOrder = order[PositionsGuide_1.PosGuide.noteOrder];
            const guide = order[PositionsGuide_1.PosGuide.guide];
            const whatsapp = order[PositionsGuide_1.PosGuide.whatsapp];
            try {
                yield Whatsapp_1.whatsappClient.sendMessage(whatsapp, guide);
                order[PositionsGuide_1.PosGuide.guideSentWhatsapp] = ValueChecks_1.ValuesGuideSentWhatsapp.true;
            }
            catch (error) {
                console.log(`Order ${orderId}: `, error.message);
                order[PositionsGuide_1.PosGuide.noteOrder] = (0, addNote_1.addNote)(noteOrder, error.message);
                (0, alertWhatsapp_1.alertWhatsapp)(`Sending guides: order ${orderId}, ${error.message}.`);
            }
            dataWhatsapp[i] = order;
            i++;
        }
        // Actualizando data comparando con dataWhatsapp
        dataWhatsapp.map((orderWhats) => {
            const orderId = data === null || data === void 0 ? void 0 : data.findIndex((order) => order[PositionsGuide_1.PosGuide.orderId] === orderWhats[PositionsGuide_1.PosGuide.orderId]);
            data[orderId][PositionsGuide_1.PosGuide.guideSentWhatsapp] =
                orderWhats[PositionsGuide_1.PosGuide.guideSentWhatsapp];
            data[orderId][PositionsGuide_1.PosGuide.noteOrder] = orderWhats[PositionsGuide_1.PosGuide.noteOrder];
        });
        // Preparando informacion que se va a mandar a Sheet
        const listSent = data === null || data === void 0 ? void 0 : data.map((order) => [
            order[PositionsGuide_1.PosGuide.guideSentWhatsapp],
            order[PositionsGuide_1.PosGuide.guideSentEmail],
            order[PositionsGuide_1.PosGuide.noteOrder],
        ]);
        // Updating sheet
        if (dataWhatsapp.length > 0) {
            yield currentSheet_1.currentSheet.update({
                nombre: 'prueba',
                celdaInicio: 'F2',
            }, listSent, ValueInputOption_1.ValueInputOption.USER_ENTERED);
        }
        yield Whatsapp_1.whatsappClient.sendMessage('7551005114', 'Guides sent correctly');
    }
    catch (error) {
        yield (0, alertWhatsapp_1.alertWhatsapp)(`Sending guides: ${error.message}`);
    }
    yield Whatsapp_1.whatsappClient.stop();
});
exports.sendTrackingGuide = sendTrackingGuide;
