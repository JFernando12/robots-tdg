import { ValueInputOption } from '../../interfaces/ValueInputOption';
import { currentSheet } from '../../settings/currentSheet';
import { isGuideCreated, isGuideSentWhatsapp } from '../../settings/checks';
import { ValuesGuideSentWhatsapp } from '../../interfaces/ValueChecks';
import { whatsappClient } from '../../helpers/whatsapp/Whatsapp';
import { PosGuide } from '../../interfaces/PositionsGuide';
const getData = async (): Promise<Array<Array<string>>> => {
  let data = await currentSheet.get({
    nombre: 'prueba',
    celdaInicio: 'A2',
    celdaFinal: 'H1000',
  });

  if (!data) {
    return [];
  }

  return data;
};

const notSentWhatsapp = (
  data: Array<Array<string>>
): Array<Array<string>> | [] => {
  data = data
    .filter((order) => isGuideCreated(order[PosGuide.guideCreated]))
    .filter((order) => !isGuideSentWhatsapp(order[PosGuide.guideSentWhatsapp]));
  return data;
};

const sendTrackingGuide = async () => {
  let data = await getData();
  if (!data) {
    throw new Error('No hay data disponible');
  }
  let dataWhatsapp = notSentWhatsapp(data);
  console.log(dataWhatsapp);

  await whatsappClient.start();

  let i = 0;
  while (dataWhatsapp.length > i) {
    let order = dataWhatsapp[i];
    let noteOrder = order[PosGuide.noteOrder];
    const guide = order[PosGuide.guide];
    const whatsapp = order[PosGuide.whatsapp];

    try {
      await whatsappClient.sendMessage(whatsapp, guide);
      order[PosGuide.guideSentWhatsapp] = ValuesGuideSentWhatsapp.true;
    } catch (error) {
      console.log(error);
    }
    dataWhatsapp[i] = order;
    i++;
  }

  // Actualizando data comparando con dataWhatsapp
  dataWhatsapp.map((orderWhats) => {
    const orderId = data?.findIndex(
      (order) => order[PosGuide.orderId] === orderWhats[PosGuide.orderId]
    );
    data[orderId!][PosGuide.guideSentWhatsapp] =
      orderWhats[PosGuide.guideSentWhatsapp];
  });

  // Preparando informacion que se va a mandar a Sheet
  const listSent = data?.map((order) => [
    order[PosGuide.guideSentWhatsapp],
    order[PosGuide.noteOrder],
  ]);

  if (!listSent) {
    throw new Error('No hay nada para actualizar');
  }

  // Updating sheet
  await currentSheet.update(
    {
      nombre: 'prueba',
      celdaInicio: 'F2',
    },
    listSent,
    ValueInputOption.USER_ENTERED
  );

  await whatsappClient.stop();
};

export { sendTrackingGuide };
