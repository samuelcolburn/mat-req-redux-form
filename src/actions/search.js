import { get } from 'lodash/fp';
import debounce from 'lodash/debounce';
import { stringify } from '../helpers';
import { doQuery } from '../data/api';
import {
  AUTOCOMPLETE_FETCH_INIT,
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_SUCCESS
} from '../constants';

const autocompleteFetchInit = props => ({
  type: AUTOCOMPLETE_FETCH_INIT,
  payload: props
});

const autocompleteFetchSuccess = props => ({
  type: AUTOCOMPLETE_FETCH_SUCCESS,
  payload: props
});

const autocompleteFetchError = props => ({
  type: AUTOCOMPLETE_FETCH_ERROR,
  payload: props
});

export const getQuery = ({ table, params }) => (dispatch, getState) => {
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

const debouncedGetQuery = debounce(
  (dispatch, ...args) => dispatch(getQuery(...args)),
  200
);

export const search = ({ table, params }) => (dispatch, getState) => {
  // if (!params) return Promise.resolve();
  // if (!params.q) return Promise.resolve();
  // if (!params.q.length) return Promise.resolve();
  // if (!params.q.trim().length) return Promise.resolve();

  // console.log('search action');
  // console.log('table: ', table);
  // console.log('params: ', params);
  const { autocomplete } = getState();
  // console.log('autcomplete state: ', autocomplete);
  const searchKey = stringify(params);
  // console.log('searchKey: ', searchKey);

  const cachedSearch = get([table, 'byId', searchKey], autocomplete);
  // console.log('cachedSearch: ', cachedSearch);

  if (cachedSearch) {
    // console.log('already searched this value, returning resolved promise: ');
    return Promise.resolve();
  }

  debouncedGetQuery(dispatch, { table, params });
};
