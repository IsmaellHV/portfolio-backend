import { ErrorObject } from 'ajv';
import { IRequest } from '../../../rest/IRequest';
import { EntityLogDocument } from '../Domain/EntityLogDocument';
import fs from 'fs';
import path from 'path';

export class AdapterGenerico {
  public static generateLogEntity = (data: IRequest): EntityLogDocument => {
    return {
      fecha: new Date(),
      origen: data.paramLog.origen,
      ip: data.paramLog.ip,
      agente: data.paramLog.agente,
      usuario: {
        _id: data.paramLog.usuario._id,
        username: data.paramLog.usuario.username,
        tipoDocumentoIdentidad: data.paramLog.usuario.tipoDocumentoIdentidad,
        numeroDocumentoIdentidad: data.paramLog.usuario.numeroDocumentoIdentidad,
        primerApellido: data.paramLog.usuario.primerApellido,
        segundoApellido: data.paramLog.usuario.segundoApellido,
        nombres: data.paramLog.usuario.nombres,
        telefono: data.paramLog.usuario.telefono,
        correoElectronico: data.paramLog.usuario.correoElectronico,
      },
    };
  };

  public static convertDate(fecha: string | Date = new Date()): string {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(new Date(fecha).getTime() - tzoffset).toISOString().slice(0, -1);
  }

  public static generateRandomNumbers(length: number): string {
    let result = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      result += digits.charAt(randomIndex);
    }
    return result;
  }

  public static saludo(): string {
    try {
      const CurrentDate = new Date();
      const CurrentHour = CurrentDate.getHours();

      let Greeting = '';
      if (CurrentHour < 12) {
        Greeting = 'Buenos días';
      } else if (CurrentHour < 19) {
        Greeting = 'Buenas tardes';
      } else {
        Greeting = 'Buenas noches';
      }
      return Greeting;
    } catch (error) {
      console.error(error);
    }
  }

  public static getMessage(language) {
    const projectRoot = process.cwd();
    const localesPath = path.join(projectRoot, 'src', 'language');
    const filePath = path.join(localesPath, `${language}.json`);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  }

  public static decodeErrorAJV(error: ErrorObject): string {
    let parent = [];
    let error_message = '';
    if (error.instancePath) {
      parent = error.instancePath
        .split('/')
        .filter(row => row.trim() !== '')
        .map(row =>
          row
            .replace(/([A-Z0-9])/g, ' $1')
            .trim()
            .toLowerCase(),
        );
    }
    if (parent.length > 0) {
      error_message += `el campo ${parent.join(' de ')} `;
    }

    switch (error.keyword) {
      case 'required':
        error_message += `parámetros de ingreso no presenta la propiedad ${error.params.missingProperty.replace(/([A-Z0-9])/g, ' $1').trim()}`;
        break;
      case 'type':
        // error_message += !error.instancePath ? `data debe ser de tipo ${error.params.type}` : `parámetro de ingreso ${error.schemaPath.split('/')[3].replace(/%20/g, ' ')} debe ser de tipo ${error.params.type}`;
        error_message += !error.instancePath ? `data debe ser de tipo ${error.params.type}` : `parámetro de ingreso ${error.schemaPath.split('/').pop().replace(/%20/g, ' ')} debe ser de tipo ${error.params.type}`;
        break;
      case 'additionalProperties':
        error_message = `parámetros de ingreso no debe poseer campos adicionales como ${error.params.additionalProperty}`;
        break;
      case 'minLength':
        error_message = `parámetro de ingreso: ${parent} debe tener como mínimo ${error.params.limit} caracteres`;
        break;
      case 'maxLength':
        error_message = `parámetro de ingreso: ${parent} debe tener como máximo ${error.params.limit} caracteres`;
        break;
      case 'length':
        error_message = `parámetro de ingreso: ${parent} debe tener ${error.params.limit} caracteres`;
        break;
      case 'pattern':
        error_message = `parámetro de ingreso: ${parent} no cumple con expresión regular ${error.params.pattern}`;
        break;
      case 'format':
        error_message = `parámetro de ingreso: ${parent} no cumple con formato ${error.params.format}`;
        break;
      case 'enum':
        error_message = `parámetro de ingreso: ${parent} con valor no válido. Solo se permite ${error.params.allowedValues.join(', ')}`;
        break;
      case 'minItems':
        error_message = `parámetro de ingreso: ${parent} debe tener como mínimo ${error.params.limit} elemento(s)`;
        break;
      default:
        error_message = `${error.params.type}`;
        break;
    }
    return error_message;
  }

  public static ocultarCorreoElectronico(correo: string): string {
    const partes = correo.split('@');
    const nombre = partes[0];
    const parteVisible = nombre[0] + '**********' + nombre.substring(nombre.length - 2);
    return parteVisible + '@**********';
  }
}
