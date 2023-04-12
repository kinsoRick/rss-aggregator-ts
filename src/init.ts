import { createInstance } from 'i18next';
import { translationType } from './types/translation';
import resources from './locales';

interface Iinit {
  translation: translationType;
}

const init = (): Iinit => {
  const i18n = createInstance();
  const initialization = i18n.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  return {
    translation: {
      instance: i18n,
      promise: initialization,
    },
  };
}

export default init;