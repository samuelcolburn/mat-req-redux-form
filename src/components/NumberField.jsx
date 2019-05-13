import useDebouncedCallback from 'use-debounce/lib/callback';

import React, { useState, useEffect, useCallback } from 'react';

import TextField from '@material-ui/core/TextField';

import NumberFormat from 'react-number-format';

const NumberFormatCustom = props => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.floatValue
          }
        });
      }}
      thousandSeparator
      decimalScale={2}
    />
  );
};

const DebouncedTextField = ({
  input,
  meta: { error, dirty },
  InputProps,
  ...custom
}) => {
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
      prevValue !== input.value ? input.value : prevValue
    );
  }, [input.value]);

  function handleChange(e) {
    if (e.target.value !== value) setValue(e.target.value);
  }

  return (
    <TextField
      {...input}
      {...custom}
      value={value}
      onChange={handleChange}
      error={error && dirty}
      helperText={error && dirty ? error : null}
      InputProps={{
        inputComponent: NumberFormatCustom,
        ...InputProps
      }}
    />
  );
};

export default DebouncedTextField;
