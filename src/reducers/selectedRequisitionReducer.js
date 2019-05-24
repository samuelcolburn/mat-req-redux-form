import { SELECT_REQUISITION } from '../constants';

const selectedRequisitionReducer = (state = 'new_req_form', action) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_REQUISITION:
      return payload;
    default:
      return state;
  }
};

export default selectedRequisitionReducer;
