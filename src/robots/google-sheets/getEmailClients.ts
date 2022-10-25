import { Sheets } from '../../helpers/google-sheets/Sheets';

const getEmailClients = async (currentSheet: Sheets) => {
  let emails = await currentSheet.get({
    nombre: 'General',
    celdaInicio: 'AF2',
    celdaFinal: 'AF900',
  });

  emails = emails
    ?.filter((email) => email.length !== 0)
    .filter((email) => email[0].includes('@'))
    .map((email) => email[0]);

  return emails;
};

export { getEmailClients };
