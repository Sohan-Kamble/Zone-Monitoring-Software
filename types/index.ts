export interface User {
  id: string;
  name: string;
  email: string;
  zone: string;
  role: string;
  company: string;
}

export interface Station {
  STN_NAME: string;
  STN_ADDRESS0: string;
  STN_ADDRESS1: string;
  STN_ADDRESS2: string;
  OHT_NAME: string;
  OHT_REMOTE: string;
  TYPE: string;
  PUMP_CAPACITY: string;
  STARTER_CAPACITY: string;
  SIM_CARD: string;
  OPERATOR_NAME: string;
  OPERATOR_NO: string;
  INSTALL_DATE: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface LiveData {
  STN: string;
  eTimeStamp: Date;
  [key: string]: any; // For P1-P150 parameters
}

export interface SystemStatus {
  total_tw: number;
  power_avail: number;
  power_fail: number;
  active_sites: number;
  inactive_sites: number;
  auto_mode: number;
  manual_mode: number;
  pump_on: number;
  pump_off: number;
  trip_sites: number;
}

export interface ZoneMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'warning';
  stationCount: number;
}