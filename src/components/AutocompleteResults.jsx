import React, { useEffect } from "react";
import { connect } from 'react-redux';
import get from 'lodash/get'
import { stringify } from '../helpers'
import { search } from '../actions';
import { autocompleteStateSelector, tableQuerySelector } from '../selectors';

let AutocompleteResults = ({
  table,
  params,
  children,
  search,
  data,
  loading,
  error
 }) => {
  useEffect(() => {
    search({ table, params: { q: params.q, related: params.related } })
  }, [search, table, params.q, params.related]);

  return (
    <React.Fragment>
      {children({
        data,
        loading,
        error
       })}
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => {
  const searchKey = stringify(ownProps.params)
  const searchCache = get(state, ['autocomplete', ownProps.table, 'byId', searchKey])

  return ({
    data: tableQuerySelector(state, ownProps.table, searchCache),
    loading: autocompleteStateSelector(state, 'loading', ownProps.table),
    error: autocompleteStateSelector(state, 'error', ownProps.table)
  });
}

const mapDispatchToProps = {
  search: search
};

AutocompleteResults = connect(
  mapStateToProps,
  mapDispatchToProps
)(AutocompleteResults);

export default React.memo(AutocompleteResults);
