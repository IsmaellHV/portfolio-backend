export type TypeLanguage = 'es' | 'en';

export interface EntityLanguage {
  code: TypeLanguage;
  validationErrors: IValidationErrors;
  unauthorizedError: IUnauthorizedError;
}

interface IValidationErrors {
  duplicateRecord: string;
  emailAlreadyRegistered: string;
}

interface IUnauthorizedError {
  notAuthorized: string;
}
