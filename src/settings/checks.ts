import {
  ValuesCreated,
  ValuesSentEmail,
  ValuesSentWhatsapp,
} from '../interfaces/ValueChecks';

const isTrueOrFalse = (status: string, keyWord: string): boolean => {
  if (status === keyWord) {
    return true;
  } else {
    return false;
  }
};

export const isSentWhatsapp = (status: string): boolean => {
  return isTrueOrFalse(status, ValuesSentWhatsapp.true);
};

export const isSentEmail = (status: string): boolean => {
  return isTrueOrFalse(status, ValuesSentEmail.true);
};

export const isCreated = (status: string): boolean => {
  return isTrueOrFalse(status, ValuesCreated.true);
};
