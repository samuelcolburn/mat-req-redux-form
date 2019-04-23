import {
  REQ_REQUISITION,
  REQ_REQUISITION_ERROR,
  REQ_REQUISITION_SUCCESS
} from "../actionTypes";


export default function loadingReducer(state = false, action) {
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
