import { ValueInputOption } from '../../interfaces/ValueInputOption';
import { isCreated, isSentWhatsapp } from '../../settings/checks';
import { ValuesSentWhatsapp } from '../../interfaces/ValueChecks';
import { whatsappClient } from '../../helpers/whatsapp/Whatsapp';
import { PosReview } from '../../interfaces/Positions';
import { addNote } from '../../helpers/google-sheets/addNote';
import { alertWhatsapp } from '../../helpers/whatsapp/alertWhatsapp';
import { Sheets } from '../../helpers/google-sheets/Sheets';
import { TabsName } from '../../interfaces/TabsName';
import { templateReview } from '../../templates/templateReview';

const tabName = TabsName.reviews;
const celdaInicioGet = 'A2';
const celdaIncioUpdate = 'F2';
const celdaFinal = 'H1000';

const getData = async (currentSheet: Sheets): Promise<Array<Array<string>>> => {
  let data = await currentSheet.get({
    nombre: tabName,
    celdaInicio: celdaInicioGet,
    celdaFinal,
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
    .filter((order) => isCreated(order[PosReview.reviewCreated]))
    .filter((order) => !isSentWhatsapp(order[PosReview.reviewSentWhatsapp]));
  return data;
};

const sendReview = async (currentSheet: Sheets) => {
  try {
    let data = await getData(currentSheet);
    if (!data) {
      throw new Error('No hay data disponible');
    }
    let dataWhatsapp = notSentWhatsapp(data);
    console.log(dataWhatsapp);

    let i = 0;
    while (dataWhatsapp.length > i) {
      let order = dataWhatsapp[i];
      const orderId = order[PosReview.orderId];
      let noteOrder = order[PosReview.noteOrder];
      const review = order[PosReview.review];
      const whatsapp = order[PosReview.whatsapp];

      try {
        await whatsappClient.sendMessage(whatsapp, templateReview(review));
        order[PosReview.reviewSentWhatsapp] = ValuesSentWhatsapp.true;
      } catch (error) {
        console.log(`Order ${orderId}: `, (error as Error).message);
        order[PosReview.noteOrder] = addNote(
          noteOrder,
          (error as Error).message
        );
        alertWhatsapp(
          `Sending reviews: order ${orderId}, ${(error as Error).message}.`
        );
      }
      dataWhatsapp[i] = order;
      i++;
    }

    console.log(dataWhatsapp);

    // Actualizando data comparando con dataWhatsapp
    dataWhatsapp.map((orderWhats) => {
      const orderId = data?.findIndex(
        (order) => order[PosReview.orderId] === orderWhats[PosReview.orderId]
      );
      data[orderId][PosReview.reviewSentWhatsapp] =
        orderWhats[PosReview.reviewSentWhatsapp];
      data[orderId][PosReview.noteOrder] = orderWhats[PosReview.noteOrder];
    });

    // Preparando informacion que se va a mandar a Sheet
    const listSent = data?.map((order) => [
      order[PosReview.reviewSentWhatsapp],
      order[PosReview.reviewSentEmail],
      order[PosReview.noteOrder],
    ]);

    // Updating sheet
    if (dataWhatsapp.length > 0) {
      await currentSheet.update(
        {
          nombre: tabName,
          celdaInicio: celdaIncioUpdate,
        },
        listSent,
        ValueInputOption.USER_ENTERED
      );
    }

    await alertWhatsapp('Reviews sent correctly');
  } catch (error) {
    await alertWhatsapp(`Sending reviews: ${(error as Error).message}`);
  }
};

export { sendReview };
