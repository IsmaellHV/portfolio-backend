export interface EntityToken {
  i: number;
  _id: string;
  tokenType: string;
  accessToken: string;
  expAccessToken: Date;
  refreshToken: string;
  expRefreshToken: Date;
  sistema: string;
  tipoSistema: string | null;
  tipoUsuario: string | null;
  versionApp: string | null;
  numeroDocumentoIdentidad: string | null;
  username: string | null;
  estado: boolean | null;
  device_id: string | null;
}
