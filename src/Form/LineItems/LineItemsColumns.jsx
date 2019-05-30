import React from 'react';
import clsx from 'clsx';

import SelectAllCheckbox from './SelectAllCheckbox';

const LineItemsColumns = ({ form, classes }) => {
  return (
    <div className={classes.itemContainer}>
      {/* Select All checkbox */}
      <div className={classes.attributeContainer}>
        <SelectAllCheckbox form={form} />
      </div>

      {/* Group1: Status, Phase, Vendors */}
      <div className={clsx(classes.attributeContainer, classes.line)}>
        <div className={clsx(classes.attributeContainer, classes.status)}>
          <div>Status</div>
          <div>Phase</div>
        </div>

        <div classes={clsx(classes.attributeContainer, classes.vendor)}>
          <div>Vendor</div>
        </div>
      </div>

      {/* Group 2: Type, Item */}
      <div className={clsx(classes.attributeContainer, classes.item)}>
        {/* <div className={clsx(classes.attributeContainer, classes.itemType)}> */}
        <div>Type</div>
        {/* </div> */}
        {/* <div
          className={clsx(classes.attributeContainer, classes.itemDescription)}
        > */}
        <div>Item</div>
        {/* </div> */}
      </div>

      {/* Group 3: Quantities */}
      <div
        className={clsx(classes.attributeContainer, classes.quantityRequest)}
      >
        <div>Starting</div>
        <div>Requested</div>
      </div>
      <div className={clsx(classes.attributeContainer, classes.quantityOrder)}>
        <div>Needed</div>
        <div>Ordered</div>
      </div>

      {/* Group 4: Prices */}
      <div className={clsx(classes.attributeContainer, classes.cost)}>
        <div>Est Cost</div>
        <div>Curr Cost</div>
      </div>

      {/* Spacer for the Actions Column */}
      <div className={clsx(classes.attributeContainer, classes.actions)}>
        <div />
      </div>
    </div>
  );
};

export default React.memo(LineItemsColumns);
