import React from 'react';
import TextField from '@material-ui/core/TextField';

export default ({ input, meta: { error, dirty }, ...custom }) => (
  <TextField
    error={error && dirty}
    helperText={error && dirty ? error : null}
    {...input}
    {...custom}
  />
);
