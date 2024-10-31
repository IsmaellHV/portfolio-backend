import { EntityLogDocument } from '../EntityLogDocument';

export interface EntityLimaReportaEvidencia {
  i: number | null; //Se genera automaticamente
  _id: string; //Se genera automaticamente
  placa: string; //Viene del app
  comentarioApp: string; //Viene del app
  fechaApp: Date; //Viene del app
  departamento: { _id: string; nombre: string } | null; //Se calcula con la longitud y latitud
  provincia: { _id: string; nombre: string } | null; //Se calcula con la longitud y latitud
  distrito: { _id: string; nombre: string } | null; //Se calcula con la longitud y latitud
  direccion: string | null; //Se calcula con la longitud y latitud
  longitud: number; //Viene del app
  latitud: number; //Viene del app
  zonaRigida: boolean; //Se calcula con la longitud y latitud, catalogo de zona rigida
  referencia: string | null; //Se completa al sancionar
  estadoEvidencia: { _id: string; codigo: string; nombre: string }; //Inicia con estado registrado
  codigoInfraccion: {
    _id: string;
    codigo: string;
    nombre: string;
    puntaje: number | null;
    porcentajeUit: number | null;
  } | null; //Se completa al sancionar o no sancionar
  gradularidad: { _id: string; codigo: string; nombre: string } | null; //Se completa al sancionar o no sancionar
  tipoInfraccion: { _id: string; codigo: string; nombre: string } | null; //Se completa al sancionar o no sancionar
  motivoNoSancion: string | null; //Se completa al no sancionar
  observacionAdicional: string | null; //Se completa al sancionar o no sancionar
  correlativoNoSancion: string | null; //Se completa al no sancionar
  ciudadano: {
    tipoDocumentoIdentidad: string;
    numeroDocumentoIdentidad: string;
    primerApellido: string;
    segundoApellido: string;
    nombres: string;
    direccion: string;
    departamento: { _id: string; nombre: string } | null;
    provincia: { _id: string; nombre: string } | null;
    distrito: { _id: string; nombre: string } | null;
  } | null; //Se completa al sancionar
  vehiculo: {
    excluir: boolean;
    sustento: string;
    origen: string;
    serie: string;
    vin: string;
    nro_motor: string;
    color: string;
    marca: string;
    modelo: string;
    anioFabricacion: string;
    codCategoria: string;
    codTipoCarr: string;
    carroceria: string;
    propietarios: string[];
  } | null; //Se completa al sancionar
  licencia: {
    nroLicencia: string;
    categoria: string;
    estadolicencia: string;
    fechaEmision: string;
    fechaExpedicion: string;
    fechaRevalidacion: string;
  } | null; //Se completa al sancionar
  evaluacionAprobacion: boolean;
  estadoAprobacion: { _id: string; codigo: string; nombre: string } | null;
  codigoPapeleta: string | null;
  estadoPapeleta: { _id: string; codigo: string; nombre: string } | null;
  numeroOficio: string | null;
  entidad: { _id: string; codigo: string; nombre: string } | null;
  registrar: EntityLogDocument;
  actualizar: EntityLogDocument | null;
  sancionar: EntityLogDocument | null; //se genera al sancionar o no sancionar
  aprobar: EntityLogDocument | null; //se genera al aprobar o rechazar
  asociarNroOficio: EntityLogDocument | null; //se genera al asociar oficio
  enviarSAT: EntityLogDocument | null; //se genera al enviar a SAT
  eliminar: EntityLogDocument | null;
  estado: boolean;

  //cinemometro
  cinemometro: { _id: string; codigo: string; numeroSerie: string; numeroCertificacionInacal: string } | null;
  velocidadPermitida: number;
  velocidadDetectada: number;
  ubigeo: string;
  tipoRegistro: number;
  datosCinemometro: { direccion: string; distrito: string };

  //Datos descriptivos
  origen: {
    _id: string;
    codigo: string;
    nombre: string;
  };
  tipoDocumento: {
    _id: string;
    codigo: string;
    nombre: string;
  };
  estadoArchivoPapeletaNoFirmada: boolean;
  estadoArchivoPapeletaFirmada: boolean;
}
