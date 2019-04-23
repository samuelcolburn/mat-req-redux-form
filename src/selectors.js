import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get'
import { createSelector as ormCreateSelector } from "redux-orm";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import {
  includes, toLowerCase, stringify, values, parseParams
} from './helpers'
import orm, { tableModelMap } from "./orm";

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
  [
    state => state.db,
    (state, props) => props,
  ],
  ormCreateSelector(orm, (session, props) => {
    console.log("requisitionSelector");
    console.log("props: ", props);
    const model = session.Requisition.withId(props.rid);

    const obj = model ? model.ref : {};

    return {
      ...obj,
      lineItems: model ? model.requisitionLineItems.toRefArray() : []
    };
  })
);

const recordHasRelation = record => relation =>
  record[relation.key] === relation.value;
const hasAllRelations = params => record => params.related ? params.related.every(recordHasRelation(record)) : true;


const recordHasQueryString = query => record =>
  compose(
    includes(query),
    toLowerCase,
    stringify,
    values
  )(record);
/*
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
    if (!indices || !indices.length) return []

  const modelName = tableModelMap[table]
  if (!modelName) return [];

  const model = session[modelName]
  return indices.reduce((acc, curr) => model.idExists(curr)
  ? [...acc, { ...model.withId(curr).ref }]
  : acc,
  [])
}
);

const getAutocompleteData = state => state.autocomplete
export const autocompleteStateSelector = createCachedSelector(
  getAutocompleteData,
  (state, aspect) => aspect,
  (state, aspect, table) => table,
  (state, aspect, table) => get([table, aspect], state),
)(
  (state, aspect, table) => `autocomplete:${table}:${aspect}`
);
