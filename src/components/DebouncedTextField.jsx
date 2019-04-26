import { useDebounce } from 'use-debounce';
import React, { useState, useRef, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

const DebouncedTextField = ({ input, meta: { error, dirty }, ...custom }) => {
  const [text, setText] = useState(input.value);
  const [value] = useDebounce(text, 1000);

  const handleChange = e => {
    e.persist();
    console.log('handle debounced change: ', e);
    setText(e.target.value);
  };

  // When the component goes to be unmounted, we will fetch data if the input has changed.
  useEffect(() => input.onChange(value), [input, value]);

  return (
    <TextField
      {...input}
      {...custom}
      onChange={handleChange}
      value={text}
      error={error && dirty}
      helperText={error && dirty ? error : null}
    />
  );
};

export default DebouncedTextField;
