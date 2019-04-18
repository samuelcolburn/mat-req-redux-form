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
    console.log("params: ", params);

    const makeNetworkRequest = debounce(() => {
      console.log("making fake network request: ");
      doQuery({ table, params })
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

    const fetchData = () => {
      if (!params.q || !params.q.length || !params.q.trim().length) return;

      setLoading(true);
      setError(false);

      makeNetworkRequest();
    };

    fetchData();
  }, [table, params.q]);

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
