import useDebouncedCallback from 'use-debounce/lib/callback';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { toString } from 'lodash/fp';
import { toBoolean } from '../helpers';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/styles';

import NumberFormat from 'react-number-format';

// Numeric Input allows users to input numbers with
// thousands separators and decimals, and no letters
// type="number" is not used because of the arrow blocks
// and because it doesn't allow thousands separators
// TODO: Make as type="number" on mobile

const useStyles = makeStyles(theme => ({
  root: {
    transform: props =>
      props.numberType && props.numberType === 'currency'
        ? 'translate(13px, 24px) scale(1)'
        : undefined,
    '&$shrink': {
      transform: 'translate(0, 1.5px) scale(0.75)'
    }
  },
  shrink: {}
}));

const NumberInputLabel = props => {
  const classes = useStyles(props);

  const { label, shrink, name, numberType, ...rest } = props;

  return label ? (
    <InputLabel shrink={shrink} htmlFor={name} classes={classes} {...rest}>
      {label}
    </InputLabel>
  ) : null;
};

const NumberFormatCustom = props => {
  const { inputRef, onChange, numberType, ...other } = props;

  return (
    <NumberFormat
      // classes={classes}
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

const shouldShrink = value => {
  try {
    const str = toString(value);
    return toBoolean(str && str.length);
  } catch (error) {
    return true;
  }
};

const NumberField = props => {
  const {
    input,
    meta: { error, dirty },
    InputLabelProps,
    InputProps,
    numberType,
    label,
    placeholder,
    ...custom
  } = props;

  const classes = useStyles(props);

  const [value, setValue] = useState(input.value);

  const [debouncedFunction, cancel] = useDebouncedCallback(
    useCallback(() => {
      // console.group('NumberField useCallback: useDebouncedCallback');
      // console.log('Deps: [input.onChange, value]');
      // console.log('input.onChange: ', input.onChange);
      // console.log('value: ', value);
      // console.groupEnd();

      const onChange = input.onChange;
      onChange(value);
    }, [input.onChange, value]),
    1000
  );

  useEffect(() => {
    // console.group('NumberField useEffect: Debounce value change');
    // console.log('Deps: [debouncedFunction, cancel, value]');
    // // console.log('debouncedFunction: ', debouncedFunction);
    // // console.log('cancel: ', cancel);
    // console.log('value: ', value);
    // console.groupEnd();

    if (input.value !== value) {
      debouncedFunction(value);
    }

    return () => {
      cancel();
    };
  }, [debouncedFunction, cancel, input.value, value]);

  // Update value when changes are passed down from redux-form
  // Normally we wouldn't need this, since we init with the input.value,
  // and then send updates to redux-form, but if new values are loaded,
  // then need to send that update here
  // to avoid an infinite event loop we do an equality check
  // useEffect(() => {
  //   console.group('NumberField useEffect: ');
  //   console.log('Deps: [input.value]: ', input.value);
  //   console.groupEnd();
  //   setValue(prevValue =>
  //     prevValue !== input.value ? input.value : prevValue
  //   );
  // }, [input.value]);

  // Accept input value changes
  function handleChange(e) {
    // console.group('NumberField handleChange: ');
    // console.log('Input: ', input.name + custom.label);
    // console.log('local value: ', value);
    // console.log('input value: ', input.value);
    // console.log('event value: ', e.target.value);
    // console.groupEnd();

    // only update the local state if the value is different
    if (e.target.value !== value) setValue(e.target.value);
  }

  const memoShrink = useMemo(() => shouldShrink(value), [value]);

  return (
    <FormControl error={error && dirty} fullWidth>
      <NumberInputLabel
        name={input.name}
        label={label}
        numberType={numberType}
        shrink={memoShrink}
        {...InputLabelProps}
      />

      <Input
        {...input}
        {...custom}
        placeholder={placeholder}
        className={classes.input}
        value={value}
        onChange={handleChange}
        error={error && dirty}
        inputComponent={NumberFormatCustom}
        {...InputProps}
      />
      {error && dirty ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
};

export default NumberField;
