import { getEmailClients } from './robots/getEmailClients';
import { sendTrackingGuide } from './robots/sendTrackingGuide';

sendTrackingGuide().then(console.log).catch(console.log);
