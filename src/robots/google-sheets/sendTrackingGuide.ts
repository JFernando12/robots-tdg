import { ValueInputOption } from "../../interfaces/ValueInputOption";
import { currentSheet } from "../../settings/currentSheet";
import { isGuideCreated, isGuideSentWhatsapp } from "../../settings/checks";
import { ValuesGuideSentWhatsapp } from "../../interfaces/ValueChecks";

const getData = async () => {
  let data = await currentSheet.get({
    nombre: "prueba",
    celdaInicio: "A2",
    celdaFinal: "H1000",
  });

  data = data
    ?.filter((order) => order.length !== 0)
    .filter((order) => isGuideCreated(order[PosGuide.guideCreated]));

  return data;
};

const sendTrackingGuide = async () => {
  let data = await getData();

  let i = 0;
  while (5 > i) {
    let order = data![i];
    let noteOrder = order[PosGuide.noteOrder];
    let guideSentEmail = order[PosGuide.guideSentEmail];
    let guideSentWhatsapp = order[PosGuide.guideSentWhatsapp];
    let guideCreated = order[PosGuide.guideCreated];
    const guide = order[PosGuide.guide];
    const email = order[PosGuide.email];
    const whatsapp = order[PosGuide.whatsapp];
    const orderId = order[PosGuide.orderId];

    const acumNotes = "";
    try {
      if (!isGuideSentWhatsapp(guideSentWhatsapp)) {
        order[PosGuide.guideSentWhatsapp] = ValuesGuideSentWhatsapp.true;
      }
    } catch (error) {
      console.log(error);
    }
    data![i] = order;
    i++;
  }

  const listSent = data?.map((order) => [
    order[PosGuide.guideSentWhatsapp],
    order[PosGuide.noteOrder],
  ]);

  if (!listSent) {
    throw new Error("No hay nada para actualizar");
  }

  // Update sheet
  await currentSheet.update(
    {
      nombre: "prueba",
      celdaInicio: "F2",
    },
    listSent,
    ValueInputOption.USER_ENTERED
  );
};

export { sendTrackingGuide };
