import get from 'lodash/fp/get';
// import has from 'lodash/fp/has';
import { createSelector as ormCreateSelector } from 'redux-orm';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import orm, { tableModelMap } from './orm';
// import { getFormValues, formValueSelector } from 'redux-form';
// import { SELECTED_ALL, SELECTED_NONE, SELECTED_SOME } from './constants';

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
    // console.log('requisitionSelector');
    // console.log('props: ', props);
    const model = session.Requisition.withId(props.id);

    const obj = model ? model.ref : {};

    return {
      ...obj,
      lineItems: model ? model.requisitionLineItems.toRefArray() : []
    };
  })
);

export const noteSelector = createSelector(
  [dbStateSelector, (_state, props) => props],
  ormCreateSelector(orm, (session, props) => {
    return session.Note.filter(
      note => note.relatedRequisitionLineItem === props.id
    )
      .orderBy('dateCreated')
      .toRefArray();
  })
);

export const getSelectedRequisitionId = state => state.selectedRequisitionId;

export const getSelectedRequisition = createSelector(
  [state => state.db, getSelectedRequisitionId],
  ormCreateSelector(orm, (session, id) => {
    // console.log('requisitionSelector');
    // console.log('props: ', props);
    const model = session.Requisition.withId(id);

    const obj = model ? model.ref : {};

    return {
      ...obj,
      lineItems: model ? model.requisitionLineItems.toRefArray() : []
    };
  })
);
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
