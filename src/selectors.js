import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';

import pick from 'lodash/fp/pick';
import toNumber from 'lodash/fp/toNumber';
import { createSelector as ormCreateSelector } from 'redux-orm';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import orm, { tableModelMap } from './orm';
// import { getFormValues, formValueSelector } from 'redux-form';
// import { SELECTED_ALL, SELECTED_NONE, SELECTED_SOME } from './constants';
import { formValueSelector, getFormValues } from 'redux-form';
import { SELECTED_ALL, SELECTED_NONE, SELECTED_SOME } from './constants';
import { values } from './helpers';

const dbStateSelector = state => state.db;

export const jobs = ormCreateSelector([orm, dbStateSelector], session => {
  return session.Job.all()
    .toModelArray()
    .map(job => {
      const obj = job.ref;

      return Object.assign({}, obj, {
        shopDrawings: job.shopDrawings
          .toRefArray()
          .map(shopDrawing => shopDrawing.subject),
        phases: job.phases.toRefArray().map(phase => phase.phase)
      });
    });
});

export const requisitionSelector = createSelector(
  [state => state.db, (_state, props) => props],
  ormCreateSelector(orm, (session, props) => {
    console.log('REQUISITION SELECTOR');

    const model = session.Requisition.withId(props.id);
    console.log('model : ', model);
    const obj = model ? model.ref : {};

    return {
      ...obj,
      job: {
        ...model.job.ref
      },
      lineItems: model ? model.requisitionLineItems.toRefArray() : []
    };
  })
);

export const noteSelector = createSelector(
  [dbStateSelector, (_state, props) => get('id', props)],
  ormCreateSelector(orm, (session, lineItemId) => {
    return session.Note.filter(
      note => note.relatedRequisitionLineItem === lineItemId
    )
      .orderBy('dateCreated')
      .toRefArray();
  })
);

export const getSelectedRequisitionId = state => state.selectedRequisitionId;

export const getSelectedRequisition = createSelector(
  [state => state.db, getSelectedRequisitionId],
  ormCreateSelector(orm, (session, id) => {
    console.log('getSelectedRequisition');
    console.log('session: ', session);
    console.log('id: ', id);
    const model = session.Requisition.withId(id);
    console.log('model: ', model);

    return !model
      ? { lineItems: [], attachments: [] }
      : {
          ...model.ref,
          user: { ...model.user.ref },
          job: { ...model.job.ref },
          shopDrawing: { ...model.shopDrawing.ref },
          lineItems: model.requisitionLineItems.toRefArray(),
          attachments: model.attachments.toRefArray()
        };
  })
);

export const getSelectedRequisitionAttachments = createSelector(
  [getSelectedRequisition, (_state, props) => props],
  (selectedRequisition, props) => {
    return get('attachments', selectedRequisition);
  }
);

export const tableQuerySelector = ormCreateSelector(
  orm,
  dbStateSelector,
  (state, table) => table,
  (state, table, indices) => indices,
  (session, table, indices) => {
    if (!indices || !indices.length) return [];

    const modelName = tableModelMap[table];
    if (!modelName) return [];

    const model = session[modelName];
    return indices.reduce(
      (acc, curr) =>
        model.idExists(curr) ? [...acc, { ...model.withId(curr).ref }] : acc,
      []
    );
  }
);

const getAutocompleteData = state => state.autocomplete;
export const autocompleteStateSelector = createCachedSelector(
  getAutocompleteData,
  (state, aspect) => aspect,
  (state, aspect, table) => table,
  (state, aspect, table) => get([table, aspect], state)
)((state, aspect, table) => `autocomplete:${table}:${aspect}`);

// const FORM_NAME = 'RequisitionForm';

// export const formSelector = formValueSelector(FORM_NAME);

// OK
export const valueSelector = valueName => (state, props) =>
  formValueSelector(props.form)(state, valueName);

// OK
// export const makeValueSelector = valueName => state =>
//   formSelector(state, valueName);

// OK
// export const getLineItems = createStructuredSelector({
//   lineItems: valueSelector('lineItems')
// });

// ok
export const getSelected = createSelector(
  [valueSelector('lineItems')],
  lineItems =>
    lineItems.filter(item => item.selected).map(pick(['id', 'selected']))
);

export const getAllSelected = createSelector(
  [valueSelector('lineItems'), getSelected],
  (lineItems, selectedLineItems) => {
    if (!lineItems || !lineItems.length) {
      return SELECTED_NONE;
    }

    const lineItemsLength = lineItems.length;
    const selectedLength = lineItems.filter(item => item.selected).length;

    return !selectedLength
      ? SELECTED_NONE
      : selectedLength >= 0 && selectedLength < lineItemsLength
      ? SELECTED_SOME
      : selectedLength === lineItems.length
      ? SELECTED_ALL
      : SELECTED_NONE;

    // return {
    //   allSelected
    // };
  }
);

export const formValuesSelector = (state, props) => {
  return getFormValues(props.form)(state);
};

const lineItemValues = createSelector(
  [valueSelector('lineItems'), (_, props) => get('field', props)],
  (lineItems, field) =>
    lineItems.reduce((acc, lineItem) => {
      const value = getOr(null, field, lineItem);
      if (value !== null) acc[lineItem.id] = value;
      return acc;
    }, {})
);

export const makeTotalSelector = () =>
  createSelector(
    [lineItemValues, (_, props) => get('field', props)],
    (lineItemValues, field) =>
      values(lineItemValues).reduce((acc, value) => acc + toNumber(value), 0)
  );

// ::::: non reselect getAllselected :::::
// const OLDformSelector = (form, ...other) => formValueSelector(form)(...other);
// export const getAllSelected = (state, props) => {
//   const lineItems = OLDformSelector(props.form, state, 'lineItems');
//   if (!lineItems || !lineItems.length) {
//     return { allSelected: SELECTED_NONE };
//   }

//   const lineItemsLength = lineItems.length;
//   const selectedLength = lineItems.filter(item => item.selected).length;

//   const allSelected = !selectedLength
//     ? SELECTED_NONE
//     : selectedLength >= 0 && selectedLength < lineItemsLength
//     ? SELECTED_SOME
//     : selectedLength === lineItems.length
//     ? SELECTED_ALL
//     : SELECTED_NONE;

//   return {
//     allSelected
//   };
// };

// export const getTotalCost = createSelector(
//   [lineItems, (_state, props) => props],
//   (lineItems, props) => lineItems.redu
// );

/*
const recordHasRelation = record => relation =>
  record[relation.key] === relation.value;
const hasAllRelations = params => record =>
  params.related ? params.related.every(recordHasRelation(record)) : true;

const recordHasQueryString = query => record =>
  compose(
    includes(query),
    toLowerCase,
    stringify,
    values
  )(record);

export const tableQuerySelector = ormCreateSelector(
  orm,
  dbStateSelector,
  (state, table) => table,
  (state, table, params) => params,
  (session, table, params) => {
  const modelName = tableModelMap[table]
  if (!modelName) return [];

  const parsedParams = parseParams(params);

  return session[modelName].all()
    .filter(hasAllRelations(parsedParams))
    .toModelArray()
    .map(record => ({ ...record.ref }))
    .filter(recordHasQueryString(parsedParams.q))
}
);

 */

// const requisitionFormSelector = state => state.form.RequisitionForm;
// const lineItemsLengthSelector = state =>
//   state.form.RequisitionForm.lineItems.length;

// const requisitionFormValuesSelector = state =>
//   getFormValues(state.selectedRequisitionId);

// export const lineItemsSelector = requisitionFormValuesSelector('lineItems');

// export const selectedLineItemsSelector = createSelector(
//   [lineItemsSelector],
//   lineItems =>
//     lineItems && lineItems.length
//       ? lineItems.filter(lineItem => lineItem.selected)
//       : []
// );

// export const selectAllSelector = createSelector(
//   [lineItemsSelector, selectedLineItemsSelector],
//   (lineItems, selectedLineItems) => {
//     if (!lineItems) return SELECTED_NONE;
//     if (!selectedLineItems) return SELECTED_NONE;
//     if (!selectedLineItems.length) return SELECTED_NONE;

//     const lineItemsLength = lineItems.length;
//     const selectedLength = selectedLineItems.length;

//     return !selectedLength
//       ? SELECTED_NONE
//       : selectedLength >= 0 && selectedLength < lineItemsLength
//       ? SELECTED_SOME
//       : selectedLength === lineItems.length
//       ? SELECTED_ALL
//       : SELECTED_NONE;
//   }
// );

// export const getSelectedLineItems = state => state.selectedLineItems;
// export const getFormSelectedLineItems = createSelector(
//   [getSelectedLineItems, getSelectedRequisitionId],
//   (selectedLineItems, id) => {
//     return selectedLineItems[id];
//   }
// );

// export const getSelectedLineItemsArray = createSelector(
//   [getSelectedLineItems],
//   lineItems => Object.values(lineItems)
// );

// const getGetFormValues = (state, props) =>
//   props && props.form ? getFormValues(props.form)(state) : SELECTED_NONE;

// export const selectAllSelector = createSelector(
//   [getFormSelectedLineItems, getGetFormValues],
//   (selectedLineItems, formValues) => {
//     if (!selectedLineItems) return SELECTED_NONE;
//     if (!selectedLineItems.length) return SELECTED_NONE;
//     if (!formValues) return SELECTED_NONE;

//     const lineItems = get(['lineItems'], formValues);
//     if (!lineItems) return SELECTED_NONE;

//     const lineItemsLength = lineItems.length;
//     const selectedLength = selectedLineItems.length;

//     return !selectedLength
//       ? SELECTED_NONE
//       : selectedLength >= 0 && selectedLength < lineItemsLength
//       ? SELECTED_SOME
//       : selectedLength === lineItems.length
//       ? SELECTED_ALL
//       : SELECTED_NONE;
//   }
// );

// export const getLineItemIsSelected = createSelector(
//   [getSelectedLineItems, getGetFormValues, (_state, props) => props],
//   (selectedLineItems, formValues, props) => {
//     const itemId = get(['lineItems', props.index, 'id'], formValues);
//     return (
//       selectedLineItems &&
//       selectedLineItems.length &&
//       selectedLineItems.some(id => id === itemId)
//     );
//   }
// );
