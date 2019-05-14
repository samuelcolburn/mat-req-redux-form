import React from 'react';
import get from 'lodash/fp/get';
import { Field, Fields } from 'redux-form';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

import SelectField from '../components/SelectField';
import Autocomplete from '../components/Autocomplete';
import DebouncedTextField from '../components/DebouncedTextField';
import NumberField from '../components/NumberField';
import CheckboxField from '../components/CheckboxField';

const statusOptions = [
  { label: 'Needs Review', value: 'needsReview' },
  { label: 'Needs Pricing', value: 'needsPricing' },
  { label: 'Needs Approval', value: 'needsApproval' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Ordered', value: 'ordered' },
  { label: 'Received', value: 'received' },
  { label: 'Complete', value: 'complete' }
];

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
) => (lineItem, index, fields) => (
  <Grid key={fields.get(index).id} container>
    <div className="">
      <Field
        name={`${lineItem}.selected`}
        component={CheckboxField}
        type="checkbox"
        color="primary"
      />
    </div>

    <Grid item xs={12} md={3} lg={3}>
      <Grid container>
        <Grid item xs={12} sm={4} lg={5}>
          <Field
            name={`${lineItem}.status`}
            label="Status"
            component={SelectField}
            options={statusOptions}
            native
            placeholder
          >
            {({ options, native }) => {
              return options.map((option, index) => {
                return native ? (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ) : (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                );
              });
            }}
          </Field>
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
    </Grid>

    <Grid item xs={12} sm={6} md={2} lg={2}>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.startingInventory`}
            label="Inventory"
            // type="number"
            component={NumberField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityRequested`}
            label="Requested"
            // type="number"
            component={NumberField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityNeeded`}
            label="Needed"
            // type="number"
            component={NumberField}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={6} lg={3}>
          <Field
            name={`${lineItem}.quantityOrdered`}
            label="Ordered"
            // type="number"
            component={NumberField}
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
            component={NumberField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={12} lg={6}>
          <Field
            name={`${lineItem}.currentCost`}
            label="Curr Cost"
            component={NumberField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export default LineItem;
