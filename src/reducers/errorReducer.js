import {
  REQ_REQUISITION,
  REQ_REQUISITION_ERROR,
  REQ_REQUISITION_SUCCESS
} from '../actionTypes';

export default function errorReducer(state = false, action) {
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
