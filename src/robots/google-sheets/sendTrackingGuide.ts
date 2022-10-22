import { ValueInputOption } from '../../interfaces/ValueInputOption';
import { currentSheet } from '../../settings/currentSheet';
import { isGuideCreated, isGuideSentWhatsapp } from '../../settings/checks';
import { ValuesGuideSentWhatsapp } from '../../interfaces/ValueChecks';

const getData = async () => {
  let data = await currentSheet.get({
    nombre: 'prueba',
    celdaInicio: 'A2',
    celdaFinal: 'H1000',
  });

  data = data
    ?.filter((order) => order.length !== 0)
    .filter((order) => isGuideCreated(order[4]));

  return data;
};

const sendTrackingGuide = async () => {
  let data = await getData();

  let i = 0;
  while (5 > i) {
    let order = data![i];
    let noteOrder = order[7];
    let guideSentEmail = order[6];
    let guideSentWhatsapp = order[5];
    let guideCreated = order[4];
    const guide = order[3];
    const email = order[2];
    const whatsapp = order[1];
    const orderId = order[0];

    const acumNotes = '';
    try {
      if (!isGuideSentWhatsapp(guideSentWhatsapp)) {
        order[5] = ValuesGuideSentWhatsapp.true;
      }
    } catch (error) {
      console.log(error);
    }
    data![i] = order;
    i++;
  }

  const listSent = data?.map((order) => [order[5], order[7]]);

  if (!listSent) {
    throw new Error('No hay nada para actualizar');
  }

  // Update sheet
  await currentSheet.update(
    {
      nombre: 'prueba',
      celdaInicio: 'F2',
    },
    listSent,
    ValueInputOption.USER_ENTERED
  );
};

export { sendTrackingGuide };
