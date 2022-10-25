import { whatsappClient } from './Whatsapp';

const phoneNumbers = ['7551005114'];

export const alertWhatsapp = async (message: string) => {
  let i = 0;
  while (phoneNumbers.length > i) {
    const phoneNumber = phoneNumbers[i];
    await whatsappClient.sendMessage(phoneNumber, message);
    i++;
  }
  console.log('Alert sent to: ', phoneNumbers);
};
