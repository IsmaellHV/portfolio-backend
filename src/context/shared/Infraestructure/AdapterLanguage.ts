import { EntityLanguage, TypeLanguage } from '../Domain/EntityLanguage';

export const AdapterLanguage: { [key in TypeLanguage]: EntityLanguage } = {
  es: {
    code: 'es',
    validationErrors: {
      duplicateRecord: 'Ya existe un usuario con el mismo número de documento de identidad',
      emailAlreadyRegistered: 'El correo electrónico ya está registrado',
    },
    unauthorizedError: {
      notAuthorized: 'No está autorizado para utilizar este servicio',
    },
  },
  en: {
    code: 'en',
    validationErrors: {
      duplicateRecord: 'A user with the same identification number already exists',
      emailAlreadyRegistered: 'The email is already registered',
    },
    unauthorizedError: {
      notAuthorized: 'You are not authorized to use this service',
    },
  },
};
