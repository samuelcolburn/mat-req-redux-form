import isEqual from 'lodash/fp/isEqual';

import useDebouncedCallback from 'use-debounce/lib/callback';
import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';

const DebouncedTextField = ({ input, meta: { error, dirty }, ...custom }) => {
  const [value, setValue] = useState(input.value);

  const [debouncedFunction, cancel] = useDebouncedCallback(
    useCallback(() => {
      const onChange = input.onChange;
      onChange(value);
    }, [input.onChange, value]),
    1000
  );

  useEffect(() => {
    debouncedFunction(value);

    return () => {
      cancel();
    };
  }, [debouncedFunction, cancel, value]);

  useEffect(() => {
    setValue(prevValue =>
      !isEqual(prevValue, input.value) ? input.value : prevValue
    );
  }, [input.value]);

  function handleChange(e) {
    e.persist();
    if (e.target.value !== value) setValue(e.target.value);
  }

  return (
    <TextField
      {...input}
      {...custom}
      onChange={handleChange}
      value={value}
      error={error && dirty}
      helperText={error && dirty ? error : null}
    />
  );
};

export default DebouncedTextField;
