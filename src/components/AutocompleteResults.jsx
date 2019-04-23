import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { getQuery } from '../actions';
import { tableQuerySelector } from '../selectors';

/*
import React, { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { doQuery } from "../data/api";

const debounceTime = 2000;
const [search, setSearch] = useState('');
const [data, setData] = useState(undefined);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);

useEffect(() => {
  console.log("AXOIS PARAMAS HAVE CHANGED: UPDATE RESUTLS");
  console.log("table: ", table);

  const makeNetworkRequest = debounce(() => {
    console.log("making fake network request: ");

    doQuery({
      table,
      params: {
        q: params.q,
        related: params.related
      }
    })
      .then(res => {
        console.log("data: ", res);
        setData({ items: res });
        setLoading(false);
        setError(false);
      })
      .catch(e => {
        // Early return if request was cancelled
        setData(undefined);
        setLoading(false);
        setError(e.message);
        console.error(e);
      });
  }, debounceTime);

  const someRelatedParamsAreMissing = params =>
    params.related.some(relation => !relation.value || relation.value <= 0);

  const fetchData = () => {
    if (!params.q || !params.q.length || !params.q.trim().length) return;

    setError(false);

    if (
      params.related &&
      params.related.length &&
      someRelatedParamsAreMissing(params)
    ) {
      setError("Please enter all dependent values.");
      return;
    }

    setLoading(true);

    makeNetworkRequest();
  };

  fetchData();
}, [table, params.q, params.related]); */


let AutocompleteResults = ({
  table,
  params,
  children,
  getQuery,
  data,
  loading,
  error
}) => {
  useEffect(() => {
    let didCancel = false;

    const fetchData = () => {
      getQuery({ table, params: { q: params.q, related: params.related } })
        .then(res => {
          console.log("getQuery return: ", res);
        })
        .catch(e => {
          console.log("getQuery error: ", e);
        });
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [getQuery, table, params.q, params.related]);

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

/* const makeMapStateToProps = () => {
  const filteredTableSelector = makeFilteredTableSelector();

  const mapStateToProps = (state, props) => ({
    data: filteredTableSelector(state, props),
    loading: state.loading,
    error: state.error
  });

  return mapStateToProps;
}; */

const mapStateToProps = (state, props) => ({
  data: tableQuerySelector(state, props.table, props.params),
  loading: state.autocomplete.loading,
  error: state.autocomplete.error
});

const mapDispatchToProps = {
  getQuery: getQuery
};

AutocompleteResults = connect(
  mapStateToProps,
  mapDispatchToProps
)(AutocompleteResults);

export default React.memo(AutocompleteResults);
