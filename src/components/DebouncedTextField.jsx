import isEqual from 'lodash/fp/isEqual';

import useDebouncedCallback from 'use-debounce/lib/callback';
import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';

const DebouncedTextField = ({ input, meta: { error, dirty }, ...custom }) => {
  const [value, setValue] = useState(input.value);

  const [debouncedFunction, cancel] = useDebouncedCallback(
    useCallback(() => {
      console.group('DebouncedTextField useCallback: ');
      console.log('local value: ', value);
      console.groupEnd();
      const onChange = input.onChange;

      onChange(value);
    }, [input.onChange, value]),
    1000
  );

  useEffect(() => {
    // console.group('DebouncedTextField useEffect: ');
    // console.log('local value: ', value);
    // console.log('input.value', input.value);
    // console.log('isEqual(value, input.value)', isEqual(value, input.value));
    // console.groupEnd();

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
    // console.group('DebouncedTextField handleChange: ');
    // console.log('Input: ', custom.label);
    // console.log('local value: ', value);
    // console.log('input value: ', input.value);
    // console.log('event value: ', e.target.value);
    // console.groupEnd();

    if (e.target.value !== value) setValue(e.target.value);
    // setValue(e.target.value);
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
