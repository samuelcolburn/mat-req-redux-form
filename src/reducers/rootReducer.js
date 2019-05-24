import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
// import uppyReduxStore from '@uppy/store-redux';

import ormReducer from './ormReducer';
import autocompleteReducer from './autocompleteReducer';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import selectedRequisitionReducer from './selectedRequisitionReducer';
import currentUserReducer from './currentUserReducer';

const rootReducer = combineReducers({
  form: formReducer,
  db: ormReducer,
  selectedRequisitionId: selectedRequisitionReducer,
  loading: loadingReducer,
  error: errorReducer,
  autocomplete: autocompleteReducer,
  currentUser: currentUserReducer
  // uppy: uppyReduxStore
});

export default rootReducer;
