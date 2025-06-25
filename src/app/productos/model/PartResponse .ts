import {  LocationPart } from "./PartLocation ";

export interface PartResponse {
 strPartNumber: string;
  strDescrip1: string;
  intWeigthPnd: string;
  dblWeigthKgs: string;
  dblLengthIn: string;
  dblWidthIn: string;
  dblHeightIn: string;
  dblVolumeIn3: string;
  intPackQty: string;
  obsPackQty: string;
  dblListPrice: string;
  strFlgCtpPho: string;
  strFlgPrdItm: string;
  strFlgHazardM: string;
  strFlgNonRet: string;
  strMajorDsc: string;
  strCategoryDs: string;
  strSbCatDsc: string;
  strMinorDsc: string;
  strHTSCCode: string;
  codError: string;
  obsError: string;
  qteToken: string;
  Locations: Record<string, LocationPart>;
}