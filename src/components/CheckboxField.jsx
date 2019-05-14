import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const CheckboxField = ({ input, ...custom }) => (
  <Checkbox
    value={input.name}
    checked={input.value ? true : false}
    onChange={input.onChange}
    {...custom}
  />
);

export default CheckboxField;
