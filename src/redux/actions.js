export const ADD_NEW_CAR = "ADD_NEW_CAR";
export const ADD_PARKING_SLOT = "ADD_PARKING_SLOT";
export const SET_POTENTIAL_SLOT = "SET_POTENTIAL_SLOT";
export const SET_CP = "SET_CP";
export const SET_CAR_EXITED = "SET_CAR_EXITED";
export const SET_CAR_RETURNED = "SET_CAR_RETURNED";

function dispatchHelper(type, payload) {
  return { type, payload };
}

export function addNewCar(...args) {
  return dispatchHelper(ADD_NEW_CAR, ...args);
}

export function addParkingSlot(...args) {
  return dispatchHelper(ADD_PARKING_SLOT, ...args);
}

export function setPotentialSlot(...args) {
  return dispatchHelper(SET_POTENTIAL_SLOT, ...args);
}

export function setCP(...args) {
  return dispatchHelper(SET_CP, ...args);
}

export function setCarExited(...args) {
  return dispatchHelper(SET_CAR_EXITED, ...args);
}

export function setCarReturned(...args) {
  return dispatchHelper(SET_CAR_RETURNED, ...args);
}
