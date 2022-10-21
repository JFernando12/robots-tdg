import { ValueInputOption } from '../interfaces/ValueInputOption';
import { currentSheet } from './currentSheet';

const getData = async () => {
  let data = await currentSheet.get({
    nombre: 'prueba',
    celdaInicio: 'A2',
    celdaFinal: 'E1000',
  });

  data = data
    ?.filter((order) => order.length !== 0)
    .filter((order) => order[3] === 'Elaborada');

  console.log(data);
  return data;
};

const sendTrackingGuide = async () => {
  const data = await getData();

  let i = 0;
  while (5 > i) {
    const order = data![i];
    if (order[4] === 'FALSE') {
      if (order[1].includes('@')) {
        try {
          await currentSheet.update(
            {
              nombre: 'prueba',
              celdaInicio: `E${order[0]}`,
            },
            [['true']],
            ValueInputOption.USER_ENTERED
          );
          console.log(`Guide of order ${order[0]} sent`);
        } catch (error) {
          console.log(error);
          console.log(`Problem sending guide of order ${order[0]}`);
        }
      } else {
        try {
          await currentSheet.update(
            {
              nombre: 'prueba',
              celdaInicio: `F${order[0]}`,
            },
            [['No hay un correo valido']]
          );
          console.log(`Note of order ${order[0]}`);
        } catch (error) {
          console.log(error);
          console.log(`Problems sending note of order ${order[0]}`);
        }
      }
    } else {
      console.log(`Already sent guide of order ${order[0]}`);
    }

    i++;
  }
};

export { sendTrackingGuide };
