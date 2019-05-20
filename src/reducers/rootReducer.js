import { combineReducers } from 'redux';

import { SET_CURRENT_USER, SELECT_REQUISITION } from '../constants';

import { reducer as formReducer } from 'redux-form';
import ormReducer from './ormReducer';
import autocompleteReducer from './autocompleteReducer';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
// import selectedLineItemsReducer from './selectedLineItemsReducer';

function selectedRequisitionReducer(state = 'new_req_form', action) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_REQUISITION:
      return payload;
    default:
      return state;
  }
}

function currentUserReducer(
  state = {
    id: 'userid',
    email: 'sam@walterafurman.com',
    firstName: 'Sam',
    lastName: 'Colburn',
    login: '',
    screenName: ''
  },
  action
) {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENT_USER:
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
  autocomplete: autocompleteReducer,
  currentUser: currentUserReducer
  // selectedLineItems: selectedLineItemsReducer
});

export default rootReducer;
