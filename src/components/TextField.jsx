import React from 'react';
import TextField from '@material-ui/core/TextField';

const TextFieldField = ({ input, meta: { error, dirty }, ...custom }) => (
  <TextField
    error={error && dirty}
    helperText={error && dirty ? error : null}
    {...input}
    {...custom}
  />
);

export default TextFieldField;
