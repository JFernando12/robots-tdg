import { ValueInputOption } from '../../interfaces/ValueInputOption';
import { isCreated, isSentWhatsapp } from '../../settings/checks';
import { ValuesSentWhatsapp } from '../../interfaces/ValueChecks';
import { whatsappClient } from '../../helpers/whatsapp/Whatsapp';
import { PosFinalPhoto } from '../../interfaces/Positions';
import { addNote } from '../../helpers/google-sheets/addNote';
import { alertWhatsapp } from '../../helpers/whatsapp/alertWhatsapp';
import { Sheets } from '../../helpers/google-sheets/Sheets';
import { TabsName } from '../../interfaces/TabsName';
import { templateFinalPhoto } from '../../templates/templateFinalPhoto';

const tabName = TabsName.finalPhotos;
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
    .filter((order) => isCreated(order[PosFinalPhoto.photoCreated]))
    .filter((order) => !isSentWhatsapp(order[PosFinalPhoto.photoSentWhatsapp]));
  return data;
};

const sendFinalPhoto = async (currentSheet: Sheets) => {
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
      const orderId = order[PosFinalPhoto.orderId];
      let noteOrder = order[PosFinalPhoto.noteOrder];
      const photo = order[PosFinalPhoto.photo];
      const whatsapp = order[PosFinalPhoto.whatsapp];

      try {
        await whatsappClient.sendMessage(whatsapp, templateFinalPhoto(photo));
        order[PosFinalPhoto.photoSentWhatsapp] = ValuesSentWhatsapp.true;
      } catch (error) {
        console.log(`Order ${orderId}: `, (error as Error).message);
        order[PosFinalPhoto.noteOrder] = addNote(
          noteOrder,
          (error as Error).message
        );
        alertWhatsapp(
          `Sending finalPhoto: order ${orderId}, ${(error as Error).message}.`
        );
      }
      dataWhatsapp[i] = order;
      i++;
    }

    // Actualizando data comparando con dataWhatsapp
    dataWhatsapp.map((orderWhats) => {
      const orderId = data?.findIndex(
        (order) =>
          order[PosFinalPhoto.orderId] === orderWhats[PosFinalPhoto.orderId]
      );
      data[orderId][PosFinalPhoto.photoSentWhatsapp] =
        orderWhats[PosFinalPhoto.photoSentWhatsapp];
      data[orderId][PosFinalPhoto.noteOrder] =
        orderWhats[PosFinalPhoto.noteOrder];
    });

    // Preparando informacion que se va a mandar a Sheet
    const listSent = data?.map((order) => [
      order[PosFinalPhoto.photoSentWhatsapp],
      order[PosFinalPhoto.photoSentEmail],
      order[PosFinalPhoto.noteOrder],
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

    await alertWhatsapp('FinalPhoto sent correctly');
  } catch (error) {
    await alertWhatsapp(`Sending finalPhotos: ${(error as Error).message}`);
  }
};

export { sendFinalPhoto };
