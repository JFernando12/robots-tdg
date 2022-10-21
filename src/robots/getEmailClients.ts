import { currentSheet } from './currentSheet';

const getEmailClients = async () => {
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
