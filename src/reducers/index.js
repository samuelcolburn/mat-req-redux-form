import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import ormReducer from "./ormReducer";

import { SELECT_REQUISITION, SELECT_ITEM, DESELECT_ITEM } from "../actionTypes";

function selectedRequisitionReducer(state = 0, action) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_REQUISITION:
      return payload;
    default:
      return state;
  }
}

function selectedItemReducer(state = {}, action) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_ITEM:
      return payload;

    case DESELECT_ITEM:
      return {};

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  form: formReducer,
  db: ormReducer,
  selectedRequisitionId: selectedRequisitionReducer,
  selectedItem: selectedItemReducer
});

export default rootReducer;
