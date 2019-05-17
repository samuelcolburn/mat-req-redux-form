import { union } from 'lodash';
import {
  SELECT_LINE_ITEM,
  DESELECT_LINE_ITEM,
  SELECT_LINE_ITEMS,
  DESELECT_LINE_ITEMS
} from '../constants';

import createReducer from './createReducer';

const selectLineItem = (state, { type, payload }) => {
  const { form, id } = payload;
  return {
    ...state,
    [form]: union(state[form], [id])
  };
};

const deselectLineItem = (state, { type, payload }) => {
  const { form, id } = payload;
  console.group('deselectLineItem');
  console.log('state:', state);
  console.log('form: ', form);
  console.log('id: ', id);

  console.groupEnd();
  return {
    ...state,
    [form]: state[form] ? state[form].filter(_id => _id !== id) : []
  };
};

const selectLineItems = (state, { type, payload }) => {
  const { form, lineItems } = payload;

  return {
    ...state,
    [form]: lineItems.map(item => item.id)
  };
};

const deselectAll = (state, { type, payload }) => ({
  ...state,
  [payload.form]: []
});

const selectedLineItemsReducer = createReducer(
  {},
  {
    [SELECT_LINE_ITEM]: selectLineItem,
    [DESELECT_LINE_ITEM]: deselectLineItem,
    [SELECT_LINE_ITEMS]: selectLineItems,
    [DESELECT_LINE_ITEMS]: deselectAll
  }
);

export default selectedLineItemsReducer;
