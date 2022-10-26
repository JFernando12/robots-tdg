import { whatsappClient } from './helpers/whatsapp/Whatsapp';
import { sendFinalPhoto } from './robots/google-sheets/sendFinalPhoto';
import { sendReview } from './robots/google-sheets/sendReview';
import { sendTrackingGuide } from './robots/google-sheets/sendTrackingGuide';
import { sheetNovDic2022, sheetOctNov2021 } from './settings/bimestralSheets';

console.log('Iniciando programa');
const start = async () => {
  await whatsappClient.start();

  await sendTrackingGuide(sheetNovDic2022);
  await sendFinalPhoto(sheetNovDic2022);
  await sendReview(sheetNovDic2022);

  await whatsappClient.stop();
};

start();
