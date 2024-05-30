export interface IMailServiceError {
  name: string;
  errorCode: string;
  message: string;
  details: string;
  status: number;
}

export enum GenericValidInvalidEnum {
  VALID,
  INVALID,
}