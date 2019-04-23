import map from "lodash/fp/map";
import filter from "lodash/fp/filter";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import get from "lodash/fp/get";


export const makeLineItem = id => ({
  id,
  selected: false,
  status: "Needs Review",
  phase: "",
  vendor: "",
  type: "",
  description: "",
  inventoryItem: "",
  startingInventory: "",
  quantityRequested: "",
  quantityOrdered: "",
  quantityNeeded: "",
  estimatedCost: "",
  currentCost: ""
});

export const values = obj => Object.values(obj);
export const toLowerCase = str => str.toLowerCase();
export const includes = inc => str => str.includes(inc);
export const stringify = obj => JSON.stringify(obj);
export const trim = str => str.trim();
export const cleanUpStr = str =>
  compose(
    toLowerCase,
    trim
  )(str);

export const delay = ms => new Promise(_ => setTimeout(_, ms));

const recordHasRelation = record => relation =>
  record[relation.key] === relation.value;
export const hasAllRelations = (related, record) =>
  related ? related.every(recordHasRelation(record)) : true;

export const recordHasQueryString = (query, record) =>
  compose(
    includes(query),
    toLowerCase,
    stringify,
    values
  )(record);
export const parseQueryString = str => (str ? cleanUpStr(str) : "");
export const parseParams = params => ({
  ...params,
  q: parseQueryString(params.q)
});
export const filterTableRecord = params => record =>
  hasAllRelations(params.related, record) &&
  recordHasQueryString(params.q, record);

const objToArray = (ids, obj) => ids.map(id => obj[id]);
export const tableToArray = table =>
  table && table.allIds ? objToArray(table.allIds, table.byId) : [];
