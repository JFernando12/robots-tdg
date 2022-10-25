export const addNote = (note: string, newNote: string): string => {
  if (!note.includes(newNote)) {
    note = note + ' | ' + newNote;
  }
  return note;
};
