import { sendTrackingGuide } from './robots/google-sheets/sendTrackingGuide';

console.log('Iniciando programa');
sendTrackingGuide().then().catch(console.log);
