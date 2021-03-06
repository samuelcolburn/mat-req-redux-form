import React, { useState, useEffect, useCallback } from 'react';
import get from 'lodash/fp/get';
import useDebouncedCallback from 'use-debounce/lib/callback';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  datePicker: {},
  inputAdornment: {
    '& button': {
      padding: 3,
      fontSize: '1.125rem'
    }
  }
}));

const DebouncedDatePickerField = ({
  input,
  meta: { error, dirty },
  dateFormat,
  ...custom
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(get('', ['value'], input));

  const [debouncedFunction, cancel] = useDebouncedCallback(
    useCallback(() => {
      input.onChange(value);
    }, [input, value]),
    1000,
    [input.onChange]
  );

  // When the component goes to be unmounted, we will fetch data if the input has changed.
  useEffect(() => {
    // console.log('datepicker value changed: ', value);
    debouncedFunction(value);

    return () => {
      cancel();
    };
  }, [debouncedFunction, cancel, value]);

  useEffect(() => {
    // console.log('datepicker input changed: ', input.value);
    setValue(input.value);
  }, [input.value]);

  const handleChange = e => setValue(e);

  return (
    <KeyboardDatePicker
      {...input}
      {...custom}
      value={value}
      autoOk
      variant="inline"
      InputAdornmentProps={{
        position: 'end',
        className: classes.inputAdornment
      }}
      disablePast
      onlyCalendar
      format={dateFormat}
      maskChar="-"
      error={error && dirty}
      helperText={error && dirty ? error : null}
      // onError={(_, error) => form.setFieldError(field.name, error)}
      onChange={handleChange}
    />
  );
};

export default DebouncedDatePickerField;
