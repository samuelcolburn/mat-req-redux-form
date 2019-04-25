import { combineReducers } from 'redux';

import { SELECT_REQUISITION } from '../actionTypes';

import { reducer as formReducer } from 'redux-form';
import ormReducer from './ormReducer';
import autocompleteReducer from './autocompleteReducer';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';

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
