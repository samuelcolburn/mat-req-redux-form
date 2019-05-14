import React from 'react';
import uniqueId from 'lodash/fp/uniqueId';
import compose from 'lodash/fp/compose';
import getOr from 'lodash/fp/getOr';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import LineItem from './LineItem';
import { makeLineItem } from '../helpers';

const phaseToString = phase => getOr('', 'phase', phase);
const vendorToString = vendor => getOr('', 'name', vendor);
const itemTypeToString = itemType => getOr('', 'fullName', itemType);
const inventoryItemToString = inventoryItem =>
  inventoryItem ? `${inventoryItem.name}` : '';

const LineItems = ({ fields, meta: { error }, job, shopDrawing }) => {
  // const classes = useStyles()

  const lineItemIdPrefix = () => 'lineItem_';

  const addLineItem = compose(
    fields.push,
    makeLineItem,
    uniqueId,
    lineItemIdPrefix
  );

  return (
    <React.Fragment>
      <Grid item xs={12}>
        {fields.map(
          LineItem(
            job,
            shopDrawing,
            phaseToString,
            vendorToString,
            itemTypeToString,
            inventoryItemToString
          )
        )}
      </Grid>

      <Grid item xs={12}>
        <Button color="primary" onClick={e => addLineItem(e)}>
          Add Line Item
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default LineItems;
