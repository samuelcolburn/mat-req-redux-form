import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';

import { makeTotalSelector } from '../../selectors';

let TotalField = props => {
  const { total, NumberFieldProps } = props;

  return (
    <NumberFormat
      value={total}
      displayType={'text'}
      thousandSeparator={true}
      decimalScale={2}
      {...NumberFieldProps}
    />
  );
};
const mapStateToProps = (state, props) => {
  const getTotal = makeTotalSelector();

  return {
    total: getTotal(state, props)
  };
};

TotalField = connect(mapStateToProps)(TotalField);

let LineItemsFooter = props => {
  const { form, classes } = props;
  return (
    <div className={classes.itemContainer}>
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
        <TotalField field="startingInventory" form={form} />
        {/* <div>{requestedTotal}</div> */}
        <TotalField field="quantityRequested" form={form} />
      </div>
      <div className={clsx(classes.attributeContainer, classes.quantityOrder)}>
        {/* <div>{neededTotal}</div>
        <div>{orderedTotal}</div> */}
        <TotalField field="quantityNeeded" form={form} />
        <TotalField field="quantityOrdered" form={form} />
      </div>

      {/* Group 4: Prices */}
      <div className={clsx(classes.attributeContainer, classes.cost)}>
        {/* <div>{estimatedTotal}</div>
        <div>{currentTotal}</div> */}
        <TotalField
          field="estimatedCost"
          form={form}
          NumberFieldProps={{
            prefix: '$'
          }}
        />
        <TotalField
          field="currentCost"
          form={form}
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
// const mapStateToProps = (state, props) => {
//   console.log('LineItemsFooter: mapStateToProps');
//   const getInventoryTotal = makeTotalSelector();
//   const getRequestedTotal = makeTotalSelector();
//   const getNeededTotal = makeTotalSelector();
//   const getOrderedTotal = makeTotalSelector();

//   const getEstimatedTotal = makeTotalSelector();
//   const getCurrentTotal = makeTotalSelector();

//   return {
//     inventoryTotal: getInventoryTotal(state, props),
//     requestedTotal: getRequestedTotal(state, props),
//     neededTotal: getNeededTotal(state, props),
//     orderedTotal: getOrderedTotal(state, props),
//     estimatedTotal: getEstimatedTotal(state, props),
//     currentTotal: getCurrentTotal(state, props)
//   };
// };

// const mapDispatchToProps = {};

// LineItemsFooter = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(LineItemsFooter);

export default LineItemsFooter;
