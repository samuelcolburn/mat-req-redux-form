import React from 'react';
import { Field } from 'redux-form';
import { createNumberMask } from 'redux-form-input-masks';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '../components/TextField';
import Autocomplete from '../components/Autocomplete';

const currencyMask = createNumberMask({
  decimalPlaces: 2,
  locale: 'en-US'
});

const LineItem = (
  job,
  shopDrawing,
  phaseToString,
  vendorToString,
  itemTypeToString,
  inventoryItemToString
) => (lineItem, index, fields) => (
  <Grid key={fields.get(index).id} container>
    <Grid item xs={12} md={3} lg={3}>
      <Grid container>
        <Grid item xs={12} sm={4} lg={5}>
          <Field
            name={`${lineItem}.status`}
            label="Status"
            component={TextField}
          />
        </Grid>

        <Grid item xs={12} sm={4} lg={5}>
          <Field
            name={`${lineItem}.phase`}
            label="Phase"
            placeholder="Search for a Phase..."
            table="phases"
            params={{
              related: [
                {
                  key: 'relatedJob',
                  value: job && job.id ? job.id : 0
                },
                {
                  key: 'relatedShopDrawing',
                  value: shopDrawing && shopDrawing.id ? shopDrawing.id : 0
                }
              ]
            }}
            itemToString={phaseToString}
            component={Autocomplete}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={3}>
          <Field
            name={`${lineItem}.vendor`}
            label="Vendor"
            placeholder="Search for a Vendor..."
            table="vendors"
            itemToString={vendorToString}
            component={Autocomplete}
          />
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} md={6} lg={5} xl={6}>
      <Grid container>
        <Grid item xs={12} lg={4}>
          <Field
            name={`${lineItem}.type`}
            label="Type"
            placeholder="Search for an Item Type..."
            table="itemTypes"
            itemToString={itemTypeToString}
            component={Autocomplete}
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <Field
            name={`${lineItem}.inventoryItem`}
            label="Inventory Item"
            placeholder="Search for an Item..."
            table="inventoryItems"
            /*             params={{
              related: [
                {
                  key: 'relatedItemType',
                  value: job && job.id ? job.id : 0
                }
              ]
            }} */
            itemToString={inventoryItemToString}
            component={Autocomplete}
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <Field
            name={`${lineItem}.description`}
            label="Description"
            component={TextField}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} sm={6} md={2} lg={2}>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.startingInventory`}
            label="Inventory"
            // type="number"
            component={TextField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityRequested`}
            label="Requested"
            // type="number"
            component={TextField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityNeeded`}
            label="Needed"
            // type="number"
            component={TextField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityOrdered`}
            label="Ordered"
            // type="number"
            component={TextField}
          />
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} sm={6} md={1} lg={2} xl={1}>
      <Grid container>
        <Grid item xs={6} sm={6} md={12} lg={6}>
          <Field
            name={`${lineItem}.estimatedCost`}
            label="Est Cost"
            // type="number"
            component={TextField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
            {...currencyMask}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={12} lg={6}>
          <Field
            name={`${lineItem}.currentCost`}
            label="Curr Cost"
            component={TextField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
            {...currencyMask}
          />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export default LineItem;
