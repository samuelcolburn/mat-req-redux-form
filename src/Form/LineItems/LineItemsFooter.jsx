import React from 'react';
import clsx from 'clsx';

import TotalField from './TotalField';

let LineItemsFooter = props => {
  const { form, classes } = props;
  return (
    <div className={clsx(classes.itemContainer, classes.footer)}>
      {/* Select All checkbox */}
      <div className={classes.attributeContainer}>Totals</div>

      {/* Group1: Status, Phase, Vendors */}
      <div className={clsx(classes.attributeContainer, classes.line)}>
        <div className={clsx(classes.attributeContainer, classes.status)} />

        <div classes={clsx(classes.attributeContainer, classes.vendor)} />
      </div>

      {/* Group 2: Type, Item */}
      <div className={clsx(classes.attributeContainer, classes.item)} />

      {/* Group 3: Quantities */}
      <div
        className={clsx(classes.attributeContainer, classes.quantityRequest)}
      >
        <TotalField field="startingInventory" label="Inventory" form={form} />
        <TotalField field="quantityRequested" label="Requested" form={form} />
      </div>
      <div className={clsx(classes.attributeContainer, classes.quantityOrder)}>
        <TotalField field="quantityNeeded" label="Needed" form={form} />
        <TotalField field="quantityOrdered" label="Ordered" form={form} />
      </div>

      {/* Group 4: Prices */}
      <div className={clsx(classes.attributeContainer, classes.cost)}>
        <TotalField
          field="estimatedCost"
          form={form}
          label="Est Cost"
          NumberFieldProps={{
            prefix: '$'
          }}
        />
        <TotalField
          field="currentCost"
          form={form}
          label="Curr Cost"
          NumberFieldProps={{
            prefix: '$'
          }}
        />
      </div>

      {/* Spacer for the Actions Column */}
      <div className={clsx(classes.attributeContainer, classes.actions)}>
        <div />
      </div>
    </div>
  );
};

export default LineItemsFooter;
