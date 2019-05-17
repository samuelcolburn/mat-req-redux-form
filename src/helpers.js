import compose from 'lodash/fp/compose';
import uniqueId from 'lodash/fp/uniqueId';

export const lineItemIdPrefix = () => 'lineItem_';

export const makeLineItemId = compose(
  uniqueId,
  lineItemIdPrefix
);

export const makeLineItem = id => ({
  id,
  selected: false,
  status: 'needsReview',
  phase: '',
  vendor: '',
  type: '',
  description: '',
  inventoryItem: '',
  startingInventory: '',
  quantityRequested: '',
  quantityOrdered: '',
  quantityNeeded: '',
  estimatedCost: '',
  currentCost: ''
});

export const makeLineItemWithId = compose(
  makeLineItem,
  makeLineItemId
);

/**
 * Functional Object.values
 */
export const values = obj => Object.values(obj);

/**
 * Functional String.toLowerCase
 */
export const toLowerCase = str => str.toLowerCase();

/**
 * Curried String.includes
 * @param {string} inc inclusion string
 * @param {string} str the string to test for inclusion
 */
export const includes = inc => str => str.includes(inc);

/**
 * Functional JSON.stringify
 */
export const stringify = obj => JSON.stringify(obj);

/**
 * Functional String.trim()
 * @param {string} str the String to trim
 */
export const trim = str => str.trim();

/**
 * @name cleanUpStr
 * @description trims and lowerCases a String
 * @param {*} str the string to cleanup
 * @return {string} the trimmed and lowerCased String
 */
export const cleanUpStr = str =>
  compose(
    toLowerCase,
    trim
  )(str);

/**
 * @name delay
 * @description create a delay
 * @param {int} ms the number of milliseconds to delay by
 */
export const delay = ms => new Promise(_ => setTimeout(_, ms));

const recordHasRelation = record => relation =>
  record[relation.key] === relation.value;

export const hasAllRelations = relations => record =>
  relations ? relations.every(recordHasRelation(record)) : true;

/**
 * @name recordToQueryString
 * @description convert a record data object to a string of its values
 * @param {*} record the record to convert
 * @return {string} the string of record valeus
 */
const recordToQueryString = record =>
  compose(
    toLowerCase,
    stringify,
    values
  )(record);

export const recordHasQueryString = query => record =>
  includes(query)(recordToQueryString(record));

export const parseQueryString = str => (str ? cleanUpStr(str) : '');

export const parseParams = params => ({
  ...params,
  q: parseQueryString(params.q)
});

/**
 * @name filterTableRecord
 * @description filter a record based on the given query params
 * @param {*} params the params to filter a record by
 * @param {*} record the record to filter
 * @return {boolean} whether the record passes the filter
 */
export const filterTableRecord = params => record =>
  hasAllRelations(params.related)(record) &&
  recordHasQueryString(params.q)(record);

const objToArray = (ids, obj) => ids.map(id => obj[id]);

export const tableToArray = table =>
  table && table.allIds ? objToArray(table.allIds, table.byId) : [];

/**
 * @name populate
 *
 * @description Curried function. Accepts a function to generate a data object, and returns
 * a populate function that will create an array of those data objects using the generate function.
 * The size of the resulting array is based on qty, and funcArgs are passed to the generate function.
 *
 * @param {Function} func the function to generate an array item
 * @param {int} qty The number of items in the array
 * @param {...*} funcArgs arguments to give to the generator function
 * @return {Array} generated array of data items
 */
export const populate = func => (qty, ...funcArgs) => {
  let items = [];

  for (let i = 0; i < qty; i++) {
    const item = func(...funcArgs);

    if (item) {
      items.push(item);
    }
  }

  return items;
};
