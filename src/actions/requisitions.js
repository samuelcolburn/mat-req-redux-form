import {
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
  REMOVE_REQUISITION_LINE_ITEM
} from '../constants';
import {
  getData,
  getRandomData,
  getLineItemsForReq,
  getNotesForLineItems
} from '../data/api';
import orm from '../orm';

import { createJob } from './jobs';
import { createShopDrawing } from './shopDrawings';
import { createManyLineItemNotes } from './notes';

export const createManyRequisitionLineItem = props => ({
  type: CREATE_MANY_REQUISITION_LINE_ITEM,
  payload: props
});

export const createRequisitionLineItem = props => ({
  type: CREATE_REQUISITION_LINE_ITEM,
  payload: props
});

export const updateRequisitionLineItem = (id, props) => ({
  type: UPDATE_REQUISITION_LINE_ITEM,
  payload: {
    id,
    ...props
  }
});

export const removeRequisitionLineItem = id => ({
  type: REMOVE_REQUISITION_LINE_ITEM,
  payload: {
    id
  }
});

const createRequisition = requisition => ({
  type: CREATE_REQUISITION,
  payload: requisition
});

export const updateRequisition = (id, props) => ({
  type: UPDATE_REQUISITION,
  payload: {
    id,
    ...props
  }
});

export const removeRequisition = id => ({
  type: REMOVE_REQUISITION,
  payload: {
    id
  }
});

export const selectRequisition = id => ({
  type: SELECT_REQUISITION,
  payload: id
});

const reqRequisitionInit = id => ({
  type: REQ_REQUISITION,
  payload: id
});

const reqRequisitionSuccess = requisition => (dispatch, getState) => {
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

const reqRequisitionError = error => {
  return {
    type: REQ_REQUISITION_ERROR,
    error
  };
};
const fetchRequisition = id => (dispatch, getState) => {
  dispatch(reqRequisitionInit(id));

  return getData({ table: 'requisitions', id });
};

const fetchLineItemsForReq = id => (dispatch, getState) =>
  getLineItemsForReq({ id });

const fetchNotesForLineItems = lineItems => (dispatch, getState) =>
  getNotesForLineItems(lineItems);

export const loadRequisitionById = ({ id }) => (dispatch, getState) => {
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

const fetchRandomRequisition = () => (dispatch, getState) => {
  dispatch(reqRequisitionInit());

  return getRandomData({ table: 'requisitions' });
};

export const loadRandomRequisition = () => (dispatch, getState) => {
  dispatch(fetchRandomRequisition()).then(data =>
    Promise.all([data, dispatch(fetchLineItemsForReq(data.id))])
      .then(([requisition, lineItems]) =>
        Promise.all([
          requisition,
          lineItems,
          dispatch(fetchNotesForLineItems(lineItems))
        ])
      )
      .then(
        ([requisition, lineItems, lineItemNotes]) => {
          console.log('load req done fetching: ', data);
          dispatch(reqRequisitionSuccess(requisition));
          dispatch(createManyRequisitionLineItem(lineItems));
          dispatch(createManyLineItemNotes(lineItemNotes));

          dispatch(selectRequisition(requisition.id));
        },
        error => {
          console.log('error fetching data: ', error.message);
          console.error(error);
          dispatch(reqRequisitionError(error));
        }
      )
  );
};
