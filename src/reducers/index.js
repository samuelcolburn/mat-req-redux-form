import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import ormReducer from "./ormReducer";

import {
  AUTOCOMPLETE_FETCH_INIT,
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_SUCCESS,
  SELECT_REQUISITION,
  REQ_REQUISITION,
  REQ_REQUISITION_ERROR,
  REQ_REQUISITION_SUCCESS
} from "../actionTypes";

function autocompleteReducer(state = { error: false, loading: false }, action) {
  switch (action.type) {
    case AUTOCOMPLETE_FETCH_INIT:
      return {
        ...state,
        error: false,
        loading: true
      };

    case AUTOCOMPLETE_FETCH_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false
      };

    case AUTOCOMPLETE_FETCH_ERROR:
     return {
       ...state,
       error: action.error.message,
       loading: false
     };

     default:
      return state;
  }
}

function loadingReducer(state = false, action) {
  switch (action.type) {
    case REQ_REQUISITION:
      return true; // action.payload ||

    case REQ_REQUISITION_SUCCESS:
    case REQ_REQUISITION_ERROR:
      return false;

    default:
      return state;
  }
}


function errorReducer(state = false, action) {
  switch (action.type) {
    case REQ_REQUISITION:
    case REQ_REQUISITION_SUCCESS:
      return false;

    case REQ_REQUISITION_ERROR:
      return action.error.message;

    default:
      return state;
  }
}

function selectedRequisitionReducer(state = 0, action) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_REQUISITION:
      return payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  form: formReducer,
  db: ormReducer,
  selectedRequisitionId: selectedRequisitionReducer,
  loading: loadingReducer,
  error: errorReducer,
  autocomplete: autocompleteReducer
});

export default rootReducer;
