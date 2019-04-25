import { union, get } from 'lodash';
import { stringify } from '../helpers';
import {
  AUTOCOMPLETE_FETCH_INIT,
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_SUCCESS
} from '../actionTypes';

import createReducer from './createReducer';

const fetchInit = (state, { type, payload }) => ({
  ...state,
  [payload.table]: {
    ...state[payload.table],
    error: false,
    loading: true
  }
});

const fetchSuccess = (state, { type, payload }) => {
  const { table, params, data } = payload;
  const searchKey = stringify(params);

  // this autocomplete has never been searched before
  if (!state[table]) {
    return {
      ...state,
      [table]: {
        error: false,
        loading: false,
        byId: {
          [searchKey]: data.map(item => item.id)
        },
        allIds: [searchKey]
      }
    };
  }

  // there have been previous queries, but this one is new
  const searches = get(state, [table, 'byId']);
  if (!searches || !searches[searchKey]) {
    return {
      ...state,
      [table]: {
        error: false,
        loading: false,
        byId: {
          ...searches,
          [searchKey]: data.map(item => item.id)
        },
        allIds: union(get(state, [table, 'allIds']), [searchKey])
      }
    };
  }

  return {
    ...state,
    [table]: {
      ...state[table],
      error: false,
      loading: false
    }
  };
};

const fetchError = (state, { type, payload }) => ({
  ...state,
  [payload.table]: {
    ...state[payload.table],
    error: payload.error.message,
    loading: false
  }
});

const autocompletesReducer = createReducer(
  {},
  {
    [AUTOCOMPLETE_FETCH_INIT]: fetchInit,
    [AUTOCOMPLETE_FETCH_SUCCESS]: fetchSuccess,
    [AUTOCOMPLETE_FETCH_ERROR]: fetchError
  }
);

export default autocompletesReducer;
