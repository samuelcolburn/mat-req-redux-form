import React from 'react';
import compose from 'lodash/fp/compose';

import Button from '@material-ui/core/Button';
import useMediaQueryWithTheme from '../../components/useMediaQueryWithTheme';

import { makeLineItemWithId } from '../../helpers';

import LineItem from './LineItem';

const LineItems = ({
  fields,
  meta: { error, form },
  job,
  shopDrawing,
  classes
}) => {
  const smAndDown = useMediaQueryWithTheme(theme =>
    theme.breakpoints.down('sm')
  );

  const addLineItem = compose(
    fields.push,
    makeLineItemWithId
  );

  return (
    <React.Fragment>
      {fields.map((name, index, fields) => {
        const { id } = fields.get(index);
        return (
          <LineItem
            lineItem={name}
            form={form}
            fields={fields}
            index={index}
            key={id}
            id={id}
            job={job}
            shopDrawing={shopDrawing}
            classes={classes}
          />
        );
      })}

      <div className={classes.buttonsContainer}>
        <div className={classes.buttonWrapper}>
          <Button
            color="primary"
            onClick={e => addLineItem(e)}
            fullWidth={smAndDown}
          >
            Add Line Item
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LineItems;
