import compose from 'lodash/fp/compose';
import {
  includes, toLowerCase, stringify, values, parseParams
} from './helpers'
import { createSelector as ormCreateSelector } from "redux-orm";
import orm, { tableModelMap } from "./orm";

import { createSelector } from "reselect";

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

export const tableQuerySelector = ormCreateSelector(
  orm,
  dbStateSelector,
  (state, table) => table,
  (state, table, params) => params,
  (session, table, params) => {
  console.log('tableQuerySelector: ')
  console.log('session: ', session)
  console.log("table: ", table)
  console.log('params: ', params)

  const modelName = tableModelMap[table]
  if (!modelName) return [];

  const parsedParams = parseParams(params);

  const records = session[modelName].all()
    .filter(hasAllRelations(parsedParams))
    .toModelArray()
    .map(record => ({ ...record.ref }))
    .filter(recordHasQueryString(parsedParams.q))
  console.log('records: ', records)

  return records
    //
  /*


    return relatedRecords.filter(record => {
      console.log("filter after ref array'd")
      return recordHasQueryString(parsedParams.q)(record)
    }) */
}
);
