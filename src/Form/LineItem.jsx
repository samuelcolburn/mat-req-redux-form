import React from 'react';
import get from 'lodash/fp/get';
import { Field, Fields } from 'redux-form';
import { createNumberMask } from 'redux-form-input-masks';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '../components/TextField';
import Autocomplete from '../components/Autocomplete';
import DebouncedTextField from '../components/DebouncedTextField';

const numberMask = createNumberMask({
  locale: 'en-US'
});

const currencyMask = createNumberMask({
  decimalPlaces: 2,
  locale: 'en-US'
});

const renderItemInput = props => {
  const { itemTypeToString, inventoryItemToString, names } = props;

  const itemType = get(props.names[0], props);
  const inventoryItem = get(props.names[1], props);
  const description = get(props.names[2], props);

  const itemInput =
    get(['input', 'value', 'name'], itemType) === 'Custom' ? (
      <DebouncedTextField
        name={names[2]}
        multiline
        fullWidth
        label="Description"
        {...description}
      />
    ) : (
      <Autocomplete
        name={names[1]}
        label="Inventory Item"
        placeholder="Search for an Item..."
        table="inventoryItems"
        params={{
          related: [
            {
              key: 'relatedItemType',
              value: get(['input', 'value', 'id'], itemType)
            }
          ]
        }}
        itemToString={inventoryItemToString}
        {...inventoryItem}
      />
    );

  return (
    <React.Fragment>
      <Grid item xs={12} lg={4}>
        <Autocomplete
          {...itemType}
          name={names[0]}
          label="Type"
          placeholder="Search for an Item Type..."
          table="itemTypes"
          itemToString={itemTypeToString}
        />
      </Grid>
      <Grid item xs={12} lg={8}>
        {itemInput}
      </Grid>
    </React.Fragment>
  );
};

const LineItem = (
  job,
  shopDrawing,
  phaseToString,
  vendorToString,
  itemTypeToString,
  inventoryItemToString
) => (lineItem, index, fields) => {
  console.group('LineItem: ');
  console.log('fields', fields);
  console.log('relatedItemType: ', fields.get(index).relatedItemType);
  console.log('ItemType:', get(['itemType', 'id'], fields.get(index)));
  console.groupEnd();
  return (
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
          <Fields
            names={[
              `${lineItem}.itemType`,
              `${lineItem}.inventoryItem`,
              `${lineItem}.description`
            ]}
            component={renderItemInput}
            itemTypeToString={itemTypeToString}
            inventoryItemToString={inventoryItemToString}
            index={index}
            lineItem={lineItem}
          />
        </Grid>

        {/*         <Grid container>
          <Grid item xs={12} lg={4}>
            <Field
              name={`${lineItem}.itemType`}
              label="Type"
              placeholder="Search for an Item Type..."
              table="itemTypes"
              itemToString={itemTypeToString}
              component={Autocomplete}
            />
          </Grid>
          {renderItemInput(fields, lineItem, index, inventoryItemToString)}
        </Grid> */}
      </Grid>

      <Grid item xs={12} sm={6} md={2} lg={2}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3} md={6} lg={3}>
            <Field
              name={`${lineItem}.startingInventory`}
              label="Inventory"
              // type="number"
              component={TextField}
              {...numberMask}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={6} lg={3}>
            <Field
              name={`${lineItem}.quantityRequested`}
              label="Requested"
              // type="number"
              component={TextField}
              {...numberMask}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={6} lg={3}>
            <Field
              name={`${lineItem}.quantityNeeded`}
              label="Needed"
              // type="number"
              component={TextField}
              {...numberMask}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={6} lg={3}>
            <Field
              name={`${lineItem}.quantityOrdered`}
              label="Ordered"
              // type="number"
              component={TextField}
              {...numberMask}
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
};

export default LineItem;
