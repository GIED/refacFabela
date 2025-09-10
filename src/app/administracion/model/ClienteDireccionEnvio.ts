import { Model } from "src/app/shared/utils/model";

export class ClienteDireccionEnvio implements Model{
  nId?: number;
  nIdCliente?: number;
  sReceptor?: string;
  sTel?: string;
  sCorreo?: string;
  sCalle?: string;
  sNumExt?: string;
  sNumInt?: string;
  sColonia?: string;
  nCp?: number; // O string si decides manejar CP con ceros iniciales
  sMunicipio?: string;
  sEstado?: string;
  sReferencias?: string;
  bPredeterminada?: boolean;
  nEstatus?: number;
}