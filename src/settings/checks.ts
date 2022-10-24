import {
  ValuesGuideCreated,
  ValuesGuideSentEmail,
  ValuesGuideSentWhatsapp,
} from '../interfaces/ValueChecks';

const isTrueOrFalse = (status: string, keyWord: string): boolean => {
  if (status === keyWord) {
    return true;
  } else {
    return false;
  }
};

export const isGuideSentWhatsapp = (status: string): boolean => {
  return isTrueOrFalse(status, ValuesGuideSentWhatsapp.true);
};

export const isGuideSentEmail = (status: string): boolean => {
  return isTrueOrFalse(status, ValuesGuideSentEmail.true);
};

export const isGuideCreated = (status: string): boolean => {
  return isTrueOrFalse(status, ValuesGuideCreated.true);
};
