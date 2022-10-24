export const addNote = (note: string, newNote: string): string => {
  note = note + ' | ' + newNote;
  return note;
};
