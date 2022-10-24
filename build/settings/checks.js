"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGuideCreated = exports.isGuideSentEmail = exports.isGuideSentWhatsapp = void 0;
const ValueChecks_1 = require("../interfaces/ValueChecks");
const isTrueOrFalse = (status, keyWord) => {
    if (status === keyWord) {
        return true;
    }
    else {
        return false;
    }
};
const isGuideSentWhatsapp = (status) => {
    return isTrueOrFalse(status, ValueChecks_1.ValuesGuideSentWhatsapp.true);
};
exports.isGuideSentWhatsapp = isGuideSentWhatsapp;
const isGuideSentEmail = (status) => {
    return isTrueOrFalse(status, ValueChecks_1.ValuesGuideSentEmail.true);
};
exports.isGuideSentEmail = isGuideSentEmail;
const isGuideCreated = (status) => {
    return isTrueOrFalse(status, ValueChecks_1.ValuesGuideCreated.true);
};
exports.isGuideCreated = isGuideCreated;
