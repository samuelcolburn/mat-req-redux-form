import { get } from 'lodash/fp';
import debounce from 'lodash/debounce';

import { stringify } from './helpers';

import {
  doQuery,
  getData,
  getRandomData,
  getLineItemsForReq
} from './data/api';

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
} from './actionTypes';

import orm from './orm';

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
  console.log('createRequisitionLineItem: ', props);
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
  };
};
const reqRequisitionSuccess = requisition => {
  return (dispatch, getState) => {
    dispatch(createRequisition(requisition));
    dispatch({
      type: REQ_REQUISITION_SUCCESS
    });

    const dbState = getState().db;
    const sess = orm.session(dbState);

    if (!sess.Job.idExists(requisition.relatedJob)) {
      dispatch(createJob(requisition.job));
    }

    if (!sess.ShopDrawing.idExists(requisition.relatedShopDrawing)) {
      dispatch(createShopDrawing(requisition.shopDrawing));
    }
  };
};

const reqRequisitionError = error => {
  return {
    type: REQ_REQUISITION_ERROR,
    error
  };
};
const fetchRequisition = id => {
  console.log('fetching Requisition: ', id);
  return (dispatch, getState) => {
    dispatch(reqRequisitionInit(id));

    return getData({ table: 'requisitions', id });
    /*       .then(
        res => dispatch(reqRequisitionSuccess(res)),
        error => dispatch(reqRequisitionError(error))
      ) */
  };
};

const fetchLineItemsForReq = id => {
  return (dispatch, getState) => getLineItemsForReq({ id });
};

export const loadRequisitionById = ({ id }) => {
  console.log('loadRequisitionById', id);
  return (dispatch, getState) => {
    Promise.all([
      dispatch(fetchRequisition(id)),
      dispatch(fetchLineItemsForReq(id))
    ]).then(
      data => {
        console.log('load req done fetching: ', data);
        dispatch(reqRequisitionSuccess(data[0]));
        dispatch(createManyRequisitionLineItem(data[1]));
        dispatch(selectRequisition(data[0].id));
      },
      error => {
        console.log('error fetching data: ', error.message);
        console.error(error);
        dispatch(reqRequisitionError(error));
      }
    );
  };
};

const fetchRandomRequisition = () => {
  return (dispatch, getState) => {
    dispatch(reqRequisitionInit());

    return getRandomData({ table: 'requisitions' });
  };
};
export const loadRandomRequisition = () => {
  return (dispatch, getState) => {
    dispatch(fetchRandomRequisition()).then(data =>
      Promise.all([data, dispatch(fetchLineItemsForReq(data.id))]).then(
        data => {
          console.log('load req done fetching: ', data);
          dispatch(reqRequisitionSuccess(data[0]));
          dispatch(createManyRequisitionLineItem(data[1]));
          dispatch(selectRequisition(data[0].id));
        },
        error => {
          console.log('error fetching data: ', error.message);
          console.error(error);
          dispatch(reqRequisitionError(error));
        }
      )
    );
  };
};

const autocompleteFetchInit = props => {
  return {
    type: AUTOCOMPLETE_FETCH_INIT,
    payload: props
  };
};
const autocompleteFetchSuccess = props => {
  return {
    type: AUTOCOMPLETE_FETCH_SUCCESS,
    payload: props
  };
};
const autocompleteFetchError = props => {
  return {
    type: AUTOCOMPLETE_FETCH_ERROR,
    payload: props
  };
};

const saveQuery = props => {
  return {
    type: SAVE_QUERY,
    payload: props
  };
};

export const getQuery = ({ table, params }) => {
  return (dispatch, getState) => {
    const { autocomplete } = getState();
    if (get(`${table}.loading`, autocomplete)) {
      // bail out early if we are already loading
      return Promise.resolve();
    }

    dispatch(autocompleteFetchInit({ table, params }));

    return doQuery({ table, params }).then(
      data => dispatch(autocompleteFetchSuccess({ table, params, data })),
      err => dispatch(autocompleteFetchError({ table, error: err }))
    );

    /*
      return {
    type: FETCH_INIT
  }
  */
  };
};

const debouncedGetQuery = debounce(
  (dispatch, ...args) => dispatch(getQuery(...args)),
  200
);

export const search = ({ table, params }) => (dispatch, getState) => {
  // if (!params) return Promise.resolve();
  // if (!params.q) return Promise.resolve();
  // if (!params.q.length) return Promise.resolve();
  // if (!params.q.trim().length) return Promise.resolve();

  console.log('search action');
  console.log('table: ', table);
  console.log('params: ', params);
  const { autocomplete } = getState();
  console.log('autcomplete state: ', autocomplete);
  const searchKey = stringify(params);
  console.log('searchKey: ', searchKey);

  const cachedSearch = get([table, 'byId', searchKey], autocomplete);
  console.log('cachedSearch: ', cachedSearch);

  if (cachedSearch) {
    console.log('already searched this value, returning resolved promise: ');
    return Promise.resolve();
  }

  debouncedGetQuery(dispatch, { table, params });
};

/**
 * @name determineNewSubject
 *
 * @description When the Shop Drawing is updated, check if we need to update the Subject
 * The subject should be updated to match the current Shop Drawing, unless the user has modified it.
 *
 * @param {object} previousValues the form values prior to this change
 * @param {object} newShopDrawing the new shop drawing object
 * @return {string} the new Requisition subject for the form
 */
const determineNewSubject = (previousValues, newShopDrawing) => {
  // get the relevant subjects from the provided data
  const prevSubject = get('subject', previousValues);
  const previousShopDrawingSubject = get(
    ['shopDrawing', 'subject'],
    previousValues
  );
  const newShopDrawingSubject = get('subject', newShopDrawing) || '';

  // If there wasn't a subject previously, put in the new subject
  if (!prevSubject && newShopDrawingSubject) return newShopDrawingSubject;

  // If the previous subject matches the previous Shop Drawing's subject
  // then should update it to the new subject
  if (prevSubject === previousShopDrawingSubject) return newShopDrawingSubject;

  // If the subject was modified by the user, then assume they want to keep their custom subject,
  // and do not change it
  console.log('new subject: ', prevSubject);
  return prevSubject;
};

const logChange = (values, dispatch, props, previousValues, ...rest) => {
  console.group('ONCHANGE ACTION');
  console.log('values: ', values);
  console.log('dispatch: ', dispatch);
  console.log('props: ', props);
  console.log('previousValues: ', previousValues);
  rest.forEach((arg, i) => console.log(`arg ${i}: `, arg));
  console.groupEnd();
};

const handleJobChange = (values, dispatch, props, previousValues) => {
  const getId = get(['job', 'id']);
  const prevId = getId(previousValues);
  const id = getId(values);

  if (prevId && id !== prevId) {
    // console.log("CHANGE HANDLER: JOB");
    dispatch(props.change('relatedJob', id ? id : null));
    dispatch(props.change('relatedShopDrawing', null));
    dispatch(props.change('shopDrawing', null));
  }
};

const handleShopDrawingChange = (values, dispatch, props, previousValues) => {
  const prevId = get(['shopDrawing', 'id'], previousValues);
  const shopDrawing = get('shopDrawing', values);
  const id = get('id', shopDrawing);

  if (id !== prevId) {
    // console.log("CHANGE HANDLER: SHOP DRAWING");
    dispatch(props.change('relatedShopDrawing', id ? id : null));
    dispatch(props.change('number', id ? `${shopDrawing.number}.1` : ''));
    const newSubject = determineNewSubject(previousValues, shopDrawing);
    dispatch(props.change('subject', newSubject));

    const previousLineItems = get('lineItems', previousValues);
    const lineItems = get('lineItems', values);
    if (previousLineItems && previousLineItems.length) {
      lineItems.forEach((lineItem, index) => {
        dispatch(props.change(`lineItems[${index}].phase`, null));
        dispatch(props.change(`lineItems[${index}].relatedPhase`, null));
      });
    }
  }
};

const handleItemTypeChange = (values, dispatch, props, previousValues) => (
  lineItem,
  index
) => {
  const getId = get(['lineItems', index, 'itemType', 'id']);
  const prevId = getId(previousValues);
  const id = getId(values);

  if (id !== prevId) {
    dispatch(props.change(`lineItems[${index}].relatedItemType`, id || null));
    dispatch(props.change(`lineItems[${index}].relatedInventoryItem`, null));
    dispatch(props.change(`lineItems[${index}].inventoryItem`, null));
  }
};

const handleLineItemItemTypeChange = (
  values,
  dispatch,
  props,
  previousValues
) => {
  const lineItems = get('lineItems', values);
  if (!lineItems || !lineItems.length) return;

  lineItems.forEach(
    handleItemTypeChange(values, dispatch, props, previousValues)
  );
};

export const onChange = (values, dispatch, props, previousValues) => {
  // console.log('CHANGE HANDLER');
  // console.log('get: ', get);
  // logChange(values, dispatch, props, previousValues);

  if (props.pristine) {
    // console.log("pristine values, do nothing");
    return;
  }

  handleJobChange(values, dispatch, props, previousValues);
  handleShopDrawingChange(values, dispatch, props, previousValues);
  handleLineItemItemTypeChange(values, dispatch, props, previousValues);
};
