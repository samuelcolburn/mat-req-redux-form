import React from 'react';
import { Field, Fields } from 'redux-form';

import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import SelectField from '../components/SelectField';
import Autocomplete from '../components/Autocomplete';
import DebouncedTextField from '../components/DebouncedTextField';
import NumberField from '../components/NumberField';
import CheckboxField from '../components/CheckboxField';

import useMediaQueryWithTheme from '../components/useMediaQueryWithTheme';
import LineItemNotes from './LineItemNotes';

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

const phaseToString = phase => getOr('', 'number', phase);
const vendorToString = vendor => getOr('', 'name', vendor);
const itemTypeToString = itemType => getOr('', 'fullName', itemType);
const inventoryItemToString = inventoryItem =>
  inventoryItem ? `${inventoryItem.name}` : '';

const renderItemInput = props => {
  const { itemTypeToString, inventoryItemToString, names, mdAndDown } = props;

  const itemType = get(props.names[0], props);
  const inventoryItem = get(props.names[1], props);
  const description = get(props.names[2], props);

  const itemInput =
    get(['input', 'value', 'name'], itemType) === 'Custom' ? (
      <DebouncedTextField
        name={names[2]}
        multiline
        fullWidth
        label={mdAndDown ? 'Description' : ''}
        placeholder={mdAndDown ? '' : 'Description'}
        {...description}
        margin="dense"
      />
    ) : (
      <Autocomplete
        name={names[1]}
        label={mdAndDown ? 'Inventory Item' : ''}
        placeholder={mdAndDown ? '' : 'Inventory Item'}
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
        InputLabelProps={{
          shrink: mdAndDown
        }}
        {...inventoryItem}
        margin="dense"
      />
    );

  return (
    <React.Fragment>
      <Grid item xs={12} lg={4}>
        <Autocomplete
          {...itemType}
          name={names[0]}
          label={mdAndDown ? 'Type' : ''}
          placeholder={mdAndDown ? '' : 'Type'}
          table="itemTypes"
          itemToString={itemTypeToString}
          InputLabelProps={{
            shrink: mdAndDown
          }}
          margin="dense"
        />
      </Grid>
      <Grid item xs={12} lg={8}>
        {itemInput}
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',

    // TODO: this is a big performance hit, need to optimze somehow
    // backgroundColor: ({ fields, index }) =>
    //   fields.get(index).selected && theme.palette.action.selected,
    // '&$selected, &$selected:hover': {
    //   backgroundColor: theme.palette.action.selected
    // },
    '&::before': {
      content: '""',
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.action.hover
    },
    '&:hover::before': {
      opacity: 1
    }
  },
  // container: {
  //   flexWrap: 'nowrap',
  // },
  selectedWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  selectedCheckbox: {
    // padding: theme.spacing(4, 1)
    height: 25,
    width: 25
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 30,
    minWidth: 30,
    maxWidth: 30
  }
  // selected: {}
}));

const LineItem = props => {
  const {
    lineItem,
    index,
    id,
    fields,
    job,
    form,
    shopDrawing
    // selected
  } = props;

  // const classes = useStyles({ fields, index });
  const mdAndDown = useMediaQueryWithTheme(theme =>
    theme.breakpoints.down('md')
  );
  const classes = useStyles(props);

  return (
    <Grid item xs={12} className={classes.root}>
      <Grid container wrap="nowrap">
        {/* Select Checkbox */}
        <Hidden smDown>
          <div className={classes.selectedWrapper}>
            <Field
              name={`${lineItem}.selected`}
              component={CheckboxField}
              options={statusOptions}
              // value="selected"
              color="primary"
              type="checkbox"
              className={classes.selectedCheckbox}
              margin="dense"
            />
          </div>
        </Hidden>

        {/* Form Values */}
        <Grid item>
          <Grid container spacing={2}>
            {/* Status, Phase, Vendor */}
            <Grid item xs={12} md={3} lg={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={5}>
                  <Field
                    name={`${lineItem}.status`}
                    label={mdAndDown && 'Status'}
                    component={SelectField}
                    options={statusOptions}
                    native
                    // placeholder
                    margin="dense"
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

                <Grid item xs={12} sm={5} md={4} lg={3}>
                  <Field
                    name={`${lineItem}.phase`}
                    label={mdAndDown ? 'Phase' : ''}
                    placeholder={mdAndDown ? '' : 'Phase'}
                    disabled={!(shopDrawing && shopDrawing.id)}
                    table="phases"
                    params={{
                      related: [
                        {
                          key: 'relatedJob',
                          value: job && job.id ? job.id : 0
                        },
                        {
                          key: 'relatedShopDrawing',
                          value:
                            shopDrawing && shopDrawing.id ? shopDrawing.id : 0
                        }
                      ]
                    }}
                    itemToString={phaseToString}
                    component={Autocomplete}
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={12} sm={7} md={8} lg={4}>
                  <Field
                    name={`${lineItem}.vendor`}
                    label={mdAndDown ? 'Vendor' : ''}
                    placeholder={mdAndDown ? '' : 'Vendor'}
                    table="vendors"
                    itemToString={vendorToString}
                    component={Autocomplete}
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Item Type, Item, Description */}
            <Grid item xs={12} md={6} lg={5} xl={6}>
              <Grid container spacing={2}>
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
                  mdAndDown={mdAndDown}
                />
              </Grid>
            </Grid>

            {/* Quantities: starting inv, qty req, qty needed, qty ordered */}
            <Grid item xs={12} sm={6} md={2} lg={2}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Field
                    name={`${lineItem}.startingInventory`}
                    label={mdAndDown && 'Inventory'}
                    placeholder={mdAndDown ? '' : 'Inventory'}
                    // type={xsOnly ? 'number' : undefined}
                    component={NumberField}
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Field
                    name={`${lineItem}.quantityRequested`}
                    label={mdAndDown ? 'Requested' : ''}
                    placeholder={mdAndDown ? '' : 'Requested'}
                    // type={xsOnly ? 'number' : undefined}
                    component={NumberField}
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Field
                    name={`${lineItem}.quantityNeeded`}
                    label={mdAndDown ? 'Needed' : ''}
                    placeholder={mdAndDown ? '' : 'Needed'}
                    // type={xsOnly ? 'number' : undefined}
                    component={NumberField}
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Field
                    name={`${lineItem}.quantityOrdered`}
                    label={mdAndDown ? 'Ordered' : ''}
                    placeholder={mdAndDown ? '' : 'Ordered'}
                    // type={xsOnly ? 'number' : undefined}
                    component={NumberField}
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Prices */}
            <Grid item xs={12} sm={6} md={1} lg={2} xl={1}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={12} lg={6}>
                  <Field
                    name={`${lineItem}.estimatedCost`}
                    label={mdAndDown ? 'Est Cost' : ''}
                    placeholder={mdAndDown ? '' : 'Est Cost'}
                    // type={xsOnly ? 'number' : undefined}
                    component={NumberField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }}
                    numberType="currency"
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={6} sm={6} md={12} lg={6}>
                  <Field
                    name={`${lineItem}.currentCost`}
                    label={mdAndDown && 'Curr Cost'}
                    placeholder={mdAndDown ? '' : 'Curr Cost'}
                    component={NumberField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }}
                    // type={xsOnly ? 'number' : undefined}
                    numberType="currency"
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Hidden mdUp>
              <Grid item xs={12}>
                <Field
                  name={`${lineItem}.addNote`}
                  label="Add Note"
                  component={DebouncedTextField}
                  fullWidth
                  multiline
                  margin="dense"
                />
              </Grid>
            </Hidden>
          </Grid>
        </Grid>

        {/* Actions */}
        <Hidden smDown>
          <Grid item className={classes.actions}>
            <LineItemNotes {...props} />
          </Grid>
        </Hidden>
      </Grid>
    </Grid>
  );
};

export default React.memo(LineItem);
