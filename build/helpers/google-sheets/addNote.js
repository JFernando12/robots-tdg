"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNote = void 0;
const addNote = (note, newNote) => {
    note = note + ' | ' + newNote;
    return note;
};
exports.addNote = addNote;
