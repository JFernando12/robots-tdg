"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendTrackingGuide_1 = require("./robots/google-sheets/sendTrackingGuide");
console.log('Iniciando programa');
(0, sendTrackingGuide_1.sendTrackingGuide)().then().catch(console.log);
