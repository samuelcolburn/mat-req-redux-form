import React from 'react';
// import uniqueId from 'lodash/fp/uniqueId';
import compose from 'lodash/fp/compose';
// import getOr from 'lodash/fp/getOr';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// import LineItemsHeader from './LineItemsHeader';
// import LineItemsColumns from './LineItemsColumns';
import LineItem from './LineItem';
import { makeLineItemWithId } from '../helpers';

// const useStyles = makeStyles(theme => ({
//   root: {
//     marginTop: theme.spacing(12)
//   }
// }));

const LineItems = ({ fields, meta: { error, form }, job, shopDrawing }) => {
  // const classes = useStyles();

  const addLineItem = compose(
    fields.push,
    makeLineItemWithId
  );

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        {fields.map((name, index, fields) => (
          <LineItem
            lineItem={name}
            form={form}
            fields={fields}
            index={index}
            key={fields.get(index).id}
            job={job}
            shopDrawing={shopDrawing}
          />
        ))}

        <Grid item xs={12}>
          <Button color="primary" onClick={e => addLineItem(e)}>
            Add Line Item
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LineItems;
