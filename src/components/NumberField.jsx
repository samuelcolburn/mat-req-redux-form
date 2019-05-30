import useDebouncedCallback from 'use-debounce/lib/callback';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { toString } from 'lodash/fp';
import { toBoolean } from '../helpers';

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

const useLabelStyles = makeStyles(theme => ({
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

const NumberInputLabel = React.memo(props => {
  const classes = useLabelStyles(props);

  const { label, shrink, name, numberType, ...rest } = props;

  return label ? (
    <InputLabel shrink={shrink} htmlFor={name} classes={classes} {...rest}>
      {label}
    </InputLabel>
  ) : null;
});

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

const useStyles = makeStyles(theme => ({
  input: {
    paddingBottom: theme.spacing(2)
  }
}));

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
    if (input.value !== value) {
      debouncedFunction(value);
    }

    return () => {
      cancel();
    };
  }, [debouncedFunction, cancel, input.value, value]);

  function handleChange(e) {
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
        classes={classes}
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
