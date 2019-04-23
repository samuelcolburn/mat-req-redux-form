// export const REQUEST_REQUISITION = 'REQUEST_REQUISITION'
// function fetchRequisition
import { doQuery, getData, getRandomData, getLineItemsForReq } from "./data/mockAPI";

import {
  AUTOCOMPLETE_FETCH_INIT,
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_SUCCESS,
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
  SAVE_QUERY
} from "./actionTypes";

import orm from './orm'

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

const createRequisition = requisition => {
  return {
      type: CREATE_REQUISITION,
      payload: requisition
  }
}

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

export const selectRequisition = id => {
  return {
    type: SELECT_REQUISITION,
    payload: id
  };
};

const reqRequisitionInit = id => {
  return {
    type: REQ_REQUISITION,
    payload: id
  }
}
const reqRequisitionSuccess = (requisition) => {
  return (dispatch, getState) => {
    dispatch(createRequisition(requisition))
    dispatch({
      type: REQ_REQUISITION_SUCCESS
    })

    const dbState = getState().db;
    const sess = orm.session(dbState);

    if (!sess.Job.idExists(requisition.relatedJob)) {
      dispatch(createJob(requisition.job))
    }

    if (!sess.ShopDrawing.idExists(requisition.relatedShopDrawing)) {
      dispatch(createShopDrawing(requisition.shopDrawing))
    }
  }
}

const reqRequisitionError = error => {
  return {
    type: REQ_REQUISITION_ERROR,
    error
  }
}
const fetchRequisition = id => {
  console.log('fetching Requisition: ', id)
  return (dispatch, getState) => {
    dispatch(reqRequisitionInit(id))
    dispatch(selectRequisition(id));

    return getData({ table: 'requisitions', id })
/*       .then(
        res => dispatch(reqRequisitionSuccess(res)),
        error => dispatch(reqRequisitionError(error))
      ) */
  }
}

const fetchLineItemsForReq = (id) => {
  return (dispatch, getState) => getLineItemsForReq({id})
}

export const loadRequisitionById = ({ id }) => {
  console.log("loadRequisitionById", id);
  return (dispatch, getState) => {
    Promise.all([
        dispatch(fetchRequisition(id)),
        dispatch(fetchLineItemsForReq(id))
      ]).then(
      data => {
        console.log("load req done fetching: ", data);
        dispatch(reqRequisitionSuccess(data[0]));
        dispatch(createManyRequisitionLineItem(data[1]));
      },
      error => {
        console.log('error fetching data: ', error.message)
        console.error(error)
        dispatch(reqRequisitionError(error))
      }
    );
  };
};

const fetchRandomRequisition = () => {
  return (dispatch, getState) => {
    dispatch(reqRequisitionInit())

    return getRandomData({ table: 'requisitions' })
  }
}
export const loadRandomRequisition = () => {
  return (dispatch, getState) => {
      dispatch(fetchRandomRequisition())
      .then(
      data => Promise.all([
        data,
        dispatch(fetchLineItemsForReq(data.id))
      ])
      .then(
        data => {
          console.log("load req done fetching: ", data);
          dispatch(reqRequisitionSuccess(data[0]));
          dispatch(createManyRequisitionLineItem(data[1]));
          dispatch(selectRequisition(data[0].id))
        },
        error => {
          console.log('error fetching data: ', error.message)
          console.error(error)
          dispatch(reqRequisitionError(error))
        }
      )
    );
  };
}

const autocompleteFetchInit = () => {
  return {
    type: AUTOCOMPLETE_FETCH_INIT
  }
}
const autocompleteFetchSuccess = props => {
  return {
    type: AUTOCOMPLETE_FETCH_SUCCESS,
    payload: props
  }
}
const autocompleteFetchError = error => {
  return {
    type: AUTOCOMPLETE_FETCH_ERROR,
    error: error
  }
}

const saveQuery = props => {
  return {
    type: SAVE_QUERY,
    payload: props
  }
}

export const getQuery = ({ table, params }) => {
  return (dispatch, getState) => {
    if (getState().autocomplete.loading) {
      // bail out early if we are already loading
      return Promise.resolve();
    }

    dispatch(autocompleteFetchInit());

    return doQuery({ table, params })
      .then(
        data => dispatch(autocompleteFetchSuccess({ table, params, data })),
        err => dispatch(autocompleteFetchError(err))
      );

    /*
      return {
    type: FETCH_INIT
  }
  */
  };
};
