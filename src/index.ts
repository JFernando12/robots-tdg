import { sendTrackingGuide } from './robots/google-sheets/sendTrackingGuide';

sendTrackingGuide().then(console.log).catch(console.log);
