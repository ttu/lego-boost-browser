import { HubControl } from '../hub-control';

const MIN_DISTANCE = 75;
const OK_DISTANCE = 100;

const EXECUTE_TIME_SEC = 60;
const CHECK_TIME_MS = 59000;

// Speeds must be between -100 and 100
const TURN_SPEED = 30;
const TURN_SPEED_OPPOSITE = -10;
const DRIVE_SPEED = 30;
const REVERSE_SPEED = -15;

const seek = (hubControl: HubControl) => {
  if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
    hubControl.control.controlUpdateTime = Date.now();
    hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, TURN_SPEED, TURN_SPEED_OPPOSITE);
  }

  if (Date.now() - hubControl.control.controlUpdateTime < 250) return;

  if (hubControl.device.distance > hubControl.prevDevice.distance) {
    hubControl.control.turnDirection = 'right';
    hubControl.setNextState('Turn');
  } else {
    hubControl.control.turnDirection = 'left';
    hubControl.setNextState('Turn');
  }
}

const turn = (hubControl: HubControl) => {
  if (hubControl.device.distance < MIN_DISTANCE) {
    hubControl.control.turnDirection = null;
    hubControl.setNextState('Back');
    return;
  } else if (hubControl.device.distance > OK_DISTANCE) {
    hubControl.control.turnDirection = null;
    hubControl.setNextState('Drive');
    return;
  }

  if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
    const motorA = hubControl.control.turnDirection === 'right' ? TURN_SPEED : TURN_SPEED_OPPOSITE;
    const motorB = hubControl.control.turnDirection === 'right' ? TURN_SPEED_OPPOSITE : TURN_SPEED;

    hubControl.control.controlUpdateTime = Date.now();
    hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, motorA, motorB);
  }
}


const drive = (hubControl: HubControl) => {
  if (hubControl.device.distance < MIN_DISTANCE) {
    hubControl.setNextState('Back');
    return;
  } else if (hubControl.device.distance < OK_DISTANCE) {
    hubControl.setNextState('Seek');
    return;
  }

  if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
    hubControl.control.controlUpdateTime = Date.now();
    const speed = hubControl.configuration.leftMotor === 'A' ? DRIVE_SPEED : DRIVE_SPEED * -1;
    hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, speed, speed);
  }
}

const back = (hubControl: HubControl) => {
  if (hubControl.device.distance > OK_DISTANCE) {
    hubControl.setNextState('Seek');
    return;
  }

  if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
    hubControl.control.controlUpdateTime = Date.now();
    const speed = hubControl.configuration.leftMotor === 'A' ? REVERSE_SPEED : REVERSE_SPEED * -1;
    hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, speed, speed);
  }
}


const stop = (hubControl: HubControl) => {
  hubControl.control.speed = 0;
  hubControl.control.turnAngle = 0;

  if (!hubControl.control.controlUpdateTime || Date.now() - hubControl.control.controlUpdateTime > CHECK_TIME_MS) {
    hubControl.control.controlUpdateTime = Date.now();
    hubControl.hub.motorTimeMulti(EXECUTE_TIME_SEC, 0, 0);
  }
}

export { stop, back, drive, turn, seek };
