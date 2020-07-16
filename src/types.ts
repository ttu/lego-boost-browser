export type DeviceInfo = {
  ports: {
    A: { action: string; angle: number };
    B: { action: string; angle: number };
    AB: { action: string; angle: number };
    C: { action: string; angle: number };
    D: { action: string; angle: number };
    LED: { action: string; angle: number };
  };
  tilt: { roll: 0; pitch: 0 };
  distance: number;
  rssi: number;
  color: string;
  error: string;
  connected: boolean;
  err?: any;
};

export type ControlData = {
  input: any;
  speed: number;
  turnAngle: number;
  tilt: { roll: number; pitch: number };
  forceState: any;
  updateInputMode: any;
  driveInput?: number;
  state?: string;
};

export type RawData = {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9?: number;
  10?: number;
  11?: number;
  12?: number;
  13?: number;
  14?: number;
};
