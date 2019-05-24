import React from 'react';
import { Field, Fields } from 'redux-form';
import clsx from 'clsx';

import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';

import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import SelectField from '../../components/SelectField';
import Autocomplete from '../../components/Autocomplete';
import DebouncedTextField from '../../components/DebouncedTextField';
import NumberField from '../../components/NumberField';
import CheckboxField from '../../components/CheckboxField';

import useMediaQueryWithTheme from '../../hooks/useMediaQueryWithTheme';
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
      <div>
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
      </div>
      <div>{itemInput}</div>
    </React.Fragment>
  );
};

let LineItem = props => {
  const {
    lineItem,
    index,
    id,
    fields,
    job,
    form,
    shopDrawing,
    classes
  } = props;

  // const classes = useStyles({ fields, index });
  const mdAndDown = useMediaQueryWithTheme(theme =>
    theme.breakpoints.down('md')
  );

  return (
    <div className={clsx(classes.itemContainer, classes.lineItem)}>
      {/* Select Checkbox */}

      <Hidden smDown>
        <div className={classes.attributeContainer}>
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
        </div>
      </Hidden>

      {/* Group1: Status, Phase, Vendors */}
      <div className={clsx(classes.attributeContainer, classes.line)}>
        <div className={clsx(classes.attributeContainer, classes.status)}>
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

          <div>
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
                    value: shopDrawing && shopDrawing.id ? shopDrawing.id : 0
                  }
                ]
              }}
              itemToString={phaseToString}
              component={Autocomplete}
              margin="dense"
            />
          </div>
        </div>

        <div classes={clsx(classes.attributeContainer, classes.vendor)}>
          <div>
            <Field
              name={`${lineItem}.vendor`}
              label={mdAndDown ? 'Vendor' : ''}
              placeholder={mdAndDown ? '' : 'Vendor'}
              table="vendors"
              itemToString={vendorToString}
              component={Autocomplete}
              margin="dense"
            />
          </div>
        </div>
      </div>

      {/* Group 2: Type, Item */}
      <div className={clsx(classes.attributeContainer, classes.item)}>
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
      </div>

      {/* Group 3: Quantities */}
      <div
        className={clsx(classes.attributeContainer, classes.quantityRequest)}
      >
        <div>
          <Field
            name={`${lineItem}.startingInventory`}
            label={mdAndDown && 'Inventory'}
            placeholder={mdAndDown ? '' : 'Inventory'}
            // type={xsOnly ? 'number' : undefined}
            component={NumberField}
            margin="dense"
          />{' '}
        </div>
        <div>
          <Field
            name={`${lineItem}.quantityRequested`}
            label={mdAndDown ? 'Requested' : ''}
            placeholder={mdAndDown ? '' : 'Requested'}
            // type={xsOnly ? 'number' : undefined}
            component={NumberField}
            margin="dense"
          />
        </div>
      </div>

      <div className={clsx(classes.attributeContainer, classes.quantityOrder)}>
        <div>
          <Field
            name={`${lineItem}.quantityNeeded`}
            label={mdAndDown ? 'Needed' : ''}
            placeholder={mdAndDown ? '' : 'Needed'}
            // type={xsOnly ? 'number' : undefined}
            component={NumberField}
            margin="dense"
          />
        </div>
        <div>
          <Field
            name={`${lineItem}.quantityOrdered`}
            label={mdAndDown ? 'Ordered' : ''}
            placeholder={mdAndDown ? '' : 'Ordered'}
            // type={xsOnly ? 'number' : undefined}
            component={NumberField}
            margin="dense"
          />
        </div>
      </div>

      {/* Group 4: Prices */}
      <div className={clsx(classes.attributeContainer, classes.cost)}>
        <div>
          <Field
            name={`${lineItem}.estimatedCost`}
            label={mdAndDown ? 'Est Cost' : ''}
            placeholder={mdAndDown ? '' : 'Est Cost'}
            // type={xsOnly ? 'number' : undefined}
            component={NumberField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: '3px' }}>
                  {'$'}
                </InputAdornment>
              )
            }}
            numberType="currency"
            margin="dense"
          />
        </div>
        <div>
          <Field
            name={`${lineItem}.currentCost`}
            label={mdAndDown && 'Curr Cost'}
            placeholder={mdAndDown ? '' : 'Curr Cost'}
            component={NumberField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ marginRight: '3px' }}>
                  {'$'}
                </InputAdornment>
              )
            }}
            // type={xsOnly ? 'number' : undefined}
            numberType="currency"
            margin="dense"
          />
        </div>
      </div>

      {/* Actions */}
      <div className={clsx(classes.attributeContainer, classes.actions)}>
        <div>
          <LineItemNotes {...props} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(LineItem);
