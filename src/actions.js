// export const REQUEST_REQUISITION = 'REQUEST_REQUISITION'
// function fetchRequisition
import { fetchData, fetchLineItemsForReq } from "./data/mockAPI";

import {
  CREATE_JOB,
  UPDATE_JOB,
  REMOVE_JOB,
  CREATE_SHOP_DRAWING,
  UPDATE_SHOP_DRAWING,
  REMOVE_SHOP_DRAWING,
  CREATE_PHASE,
  UPDATE_PHASE,
  REMOVE_PHASE,
  REQ_REQUISITION,
  REQ_REQUISITION_SUCCESS,
  REQ_REQUISITION_ERROR,
  CREATE_REQUISITION,
  UPDATE_REQUISITION,
  REMOVE_REQUISITION,
  SELECT_REQUISITION,
  CREATE_MANY_REQUISITION_LINE_ITEM,
  CREATE_REQUISITION_LINE_ITEM,
  UPDATE_REQUISITION_LINE_ITEM,
  REMOVE_REQUISITION_LINE_ITEM,
  SELECT_ITEM,
  DESELECT_ITEM
} from "./actionTypes";

export const createJob = props => {
  return {
    type: CREATE_JOB,
    payload: props
  };
};

export const updateJob = (id, props) => {
  return {
    type: UPDATE_JOB,
    payload: {
      id,
      ...props
    }
  };
};

export const removeJob = id => {
  return {
    type: REMOVE_JOB,
    payload: {
      id
    }
  };
};

export const createShopDrawing = props => {
  return {
    type: CREATE_SHOP_DRAWING,
    payload: props
  };
};

export const updateShopDrawing = (id, props) => {
  return {
    type: UPDATE_SHOP_DRAWING,
    payload: {
      id,
      ...props
    }
  };
};

export const removeShopDrawing = id => {
  return {
    type: REMOVE_SHOP_DRAWING,
    payload: {
      id
    }
  };
};

export const createPhase = props => {
  return {
    type: CREATE_PHASE,
    payload: props
  };
};

export const updatePhase = (id, props) => {
  return {
    type: UPDATE_PHASE,
    payload: {
      id,
      ...props
    }
  };
};

export const removePhase = id => {
  return {
    type: REMOVE_PHASE,
    payload: {
      id
    }
  };
};

export const createManyRequisitionLineItem = props => {
  return {
    type: CREATE_MANY_REQUISITION_LINE_ITEM,
    payload: props
  };
};

export const createRequisitionLineItem = props => {
  console.log("createRequisitionLineItem: ", props);
  return {
    type: CREATE_REQUISITION_LINE_ITEM,
    payload: props
  };
};

export const updateRequisitionLineItem = (id, props) => {
  return {
    type: UPDATE_REQUISITION_LINE_ITEM,
    payload: {
      id,
      ...props
    }
  };
};

export const removeRequisitionLineItem = id => {
  return {
    type: REMOVE_REQUISITION_LINE_ITEM,
    payload: {
      id
    }
  };
};

export const selectRequisition = id => {
  return {
    type: SELECT_REQUISITION,
    payload: id
  };
};

export const loadRequisitionById = ({ id }) => {
  console.log("loadRequisitionById", id);
  return (dispatch, getState) => {
    Promise.all([fetchData("requisitions", id), fetchLineItemsForReq(id)]).then(
      data => {
        console.log("load req done fetching: ", data);
        dispatch(createRequisition(data[0]));
        dispatch(createManyRequisitionLineItem(data[1]));
        dispatch(selectRequisition(id));
      }
    );
  };
};

export const createRequisition = props => {
  console.log("createRequistion action, props: ", props);
  return {
    type: CREATE_REQUISITION,
    payload: props
  };
};

export const updateRequisition = (id, props) => {
  return {
    type: UPDATE_REQUISITION,
    payload: {
      id,
      ...props
    }
  };
};

export const removeRequisition = id => {
  return {
    type: REMOVE_REQUISITION,
    payload: {
      id
    }
  };
};

export const selectItem = item => {
  return {
    type: SELECT_ITEM,
    item
  };
};

export const deselectItem = item => {
  return {
    type: DESELECT_ITEM,
    item
  };
};
