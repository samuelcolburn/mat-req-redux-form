import React, { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import { doQuery } from "../data/api";

const AutocompleteResults = props => {
  const { table, params, children } = props;

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
    }, 200);

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
  }, [table, params.q, params.related]);

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

export default React.memo(AutocompleteResults);
