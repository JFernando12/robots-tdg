import { ValueInputOption } from '../../interfaces/ValueInputOption';
import { isGuideCreated, isGuideSentWhatsapp } from '../../settings/checks';
import { ValuesGuideSentWhatsapp } from '../../interfaces/ValueChecks';
import { whatsappClient } from '../../helpers/whatsapp/Whatsapp';
import { PosGuide } from '../../interfaces/PositionsGuide';
import { addNote } from '../../helpers/google-sheets/addNote';
import { alertWhatsapp } from '../../helpers/whatsapp/alertWhatsapp';
import { Sheets } from '../../helpers/google-sheets/Sheets';
import { TabsName } from '../../interfaces/TabsName';

const tabName = TabsName.guides;

const getData = async (currentSheet: Sheets): Promise<Array<Array<string>>> => {
  let data = await currentSheet.get({
    nombre: tabName,
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

const sendTrackingGuide = async (currentSheet: Sheets) => {
  try {
    await whatsappClient.start();

    let data = await getData(currentSheet);
    if (!data) {
      throw new Error('No hay data disponible');
    }
    let dataWhatsapp = notSentWhatsapp(data);
    console.log(dataWhatsapp);

    let i = 0;
    while (dataWhatsapp.length > i) {
      let order = dataWhatsapp[i];
      const orderId = order[PosGuide.orderId];
      let noteOrder = order[PosGuide.noteOrder];
      const guide = order[PosGuide.guide];
      const whatsapp = order[PosGuide.whatsapp];

      try {
        await whatsappClient.sendMessage(whatsapp, guide);
        order[PosGuide.guideSentWhatsapp] = ValuesGuideSentWhatsapp.true;
      } catch (error) {
        console.log(`Order ${orderId}: `, (error as Error).message);
        order[PosGuide.noteOrder] = addNote(
          noteOrder,
          (error as Error).message
        );
        alertWhatsapp(
          `Sending guides: order ${orderId}, ${(error as Error).message}.`
        );
      }
      dataWhatsapp[i] = order;
      i++;
    }

    // Actualizando data comparando con dataWhatsapp
    dataWhatsapp.map((orderWhats) => {
      const orderId = data?.findIndex(
        (order) => order[PosGuide.orderId] === orderWhats[PosGuide.orderId]
      );
      data[orderId][PosGuide.guideSentWhatsapp] =
        orderWhats[PosGuide.guideSentWhatsapp];
      data[orderId][PosGuide.noteOrder] = orderWhats[PosGuide.noteOrder];
    });

    // Preparando informacion que se va a mandar a Sheet
    const listSent = data?.map((order) => [
      order[PosGuide.guideSentWhatsapp],
      order[PosGuide.guideSentEmail],
      order[PosGuide.noteOrder],
    ]);

    // Updating sheet
    if (dataWhatsapp.length > 0) {
      await currentSheet.update(
        {
          nombre: tabName,
          celdaInicio: 'F2',
        },
        listSent,
        ValueInputOption.USER_ENTERED
      );
    }

    await alertWhatsapp('Guides sent correctly');
  } catch (error) {
    await alertWhatsapp(`Sending guides: ${(error as Error).message}`);
  }
  await whatsappClient.stop();
};

export { sendTrackingGuide };
