import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { toBoolean } from '../helpers';

const ErrorMessage = ({ error, dirty }) =>
  error && dirty ? <FormHelperText error>{error}</FormHelperText> : null;

const Placeholder = ({ placeholder, label, native }) => {
  const Option = value =>
    !value ? null : native ? (
      <option value="" disabled defaultValue />
    ) : (
      <MenuItem value="" disabled>
        <em>{value}</em>
      </MenuItem>
    );

  return placeholder === true ? (
    <Option value={label} native={native} />
  ) : placeholder && placeholder.length ? (
    <Option value={placeholder} native={native} />
  ) : null;
};

const SelectField = ({
  input,
  meta: { error, dirty },
  label,
  placeholder,
  formControlProps,
  labelProps,
  inputProps,
  children,
  options,
  renderOption,
  native,
  ...custom
}) => (
  <FormControl {...formControlProps} fullWidth>
    {label && (
      <InputLabel shrink={toBoolean(placeholder)} htmlFor={input.name}>
        {label}
      </InputLabel>
    )}
    <Select native={native} {...input} {...custom}>
      <Placeholder placeholder={placeholder} label={label} native={native} />
      {!children
        ? null
        : typeof children === 'function'
        ? children({ options, native })
        : children}
    </Select>
    <ErrorMessage error={error} dirty={dirty} />
  </FormControl>
);

export default SelectField;
