import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default ({
  input,
  meta: { error, dirty },
  label,
  formControlProps,
  labelProps,
  inputProps,
  children,
  ...custom
}) => {
  return (
    <FormControl {...formControlProps}>
      <InputLabel htmlFor="filled-age-simple">Age</InputLabel>
      <Select {...input} {...custom}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {children}
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};
