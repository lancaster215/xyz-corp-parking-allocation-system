import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { ADD_NEW_CAR, SET_POTENTIAL_SLOT, SET_CP, SET_CAR_EXITED, SET_CAR_RETURNED } from "./actions";

const initialState = {
  carDetails: {},
  potentialSlot: {},
  c_p: false,
  carExited: false,
  carReturned: false,
};

const instanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NEW_CAR:
      return { ...state, carDetails: action.payload };
    case SET_POTENTIAL_SLOT:
      return { ...state, potentialSlot: action.payload};
    case SET_CP:
      return { ...state, c_p: action.payload};
    case SET_CAR_EXITED:
      return { ...state, carExited: action.payload};
    case SET_CAR_RETURNED:
      return { ...state, carReturned: action.payload};
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["instances", "ui"],
};

const rootReducer = combineReducers({
  instances: instanceReducer,
  dispatch: (state = {}) => state,
  subscribe: (state = {}) => state,
  getState: (state = {}) => state,
  replaceReducer: (state = {}) => state,
  liftedStore: (state = {}) => state,
});

export default persistReducer(persistConfig, rootReducer);
