export interface IAdjustForm {
  times: number;
  speed: number;
  volume: number;
  spliceCount: number;
}

export interface INvrDeviceInfo {
  ip: string;
  port: number;
  username: string;
  password: string;
}

export interface IPTZControl {
  PTZAuto: boolean;
  direction: number;
  speed: number;
  volume: number;
  zoom: boolean;
}

export interface ISelectedNode {
  ip: string;
  port: number;
  username: string;
  password: string;
}

export interface Channels {
  id: string;
  name: string;
  ipAddress?: string;
}