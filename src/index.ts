import { sendTrackingGuide } from './robots/google-sheets/sendTrackingGuide';
import { sheetOctNov2021 } from './settings/bimestralSheets';

console.log('Iniciando programa');
sendTrackingGuide(sheetOctNov2021).then().catch(console.log);
