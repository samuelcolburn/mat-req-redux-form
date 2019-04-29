import useDebouncedCallback from 'use-debounce/lib/callback';
import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';

const DebouncedTextField = ({ input, meta: { error, dirty }, ...custom }) => {
  const [value, setValue] = useState(input.value);

  const [debouncedFunction, cancel] = useDebouncedCallback(
    useCallback(() => {
      input.onChange(value);
    }, [input, value]),
    1000
  );

  // When the component goes to be unmounted, we will fetch data if the input has changed.
  useEffect(() => {
    debouncedFunction(value);

    return () => {
      cancel();
    };
  }, [debouncedFunction, cancel, value]);

  return (
    <TextField
      {...input}
      {...custom}
      onChange={e => setValue(e.target.value)}
      value={value}
      error={error && dirty}
      helperText={error && dirty ? error : null}
    />
  );
};

export default DebouncedTextField;
