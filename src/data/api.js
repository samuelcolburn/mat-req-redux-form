import compose from 'lodash/fp/compose';
import get from 'lodash/fp/get';
import filter from 'lodash/fp/filter';
import random from 'lodash/random';
import { delay, filterTableRecord, parseParams } from '../helpers';

import sampleData from './sampleData';

export const doQuery = async ({ table, params }) => {
  console.log('doQuery Called: ', table, params);
  await delay(500);

  const results = compose(
    filter(filterTableRecord(parseParams(params))),
    get(table)
  )(sampleData);

  console.log('results: ', results);
  return results;
};

export const getRandomData = async ({ table, wait = 500 }) => {
  await delay;

  const data = sampleData[table];

  if (!data) {
    return Promise.reject('data not found');
  }

  const index = random(0, data.length - 1);

  const record = data[index];
  if (!record) {
    return Promise.reject(new Error('record not found'));
  }

  return Promise.resolve(record);
};

export const getData = async ({ table, id, wait = 500 }) => {
  console.log('fetchData');
  console.log('sampleData: ', sampleData);
  console.log('table: ', table);
  console.log('id: ', id);

  await delay(wait);

  const data = sampleData[table];

  if (!data) {
    return Promise.reject('data not found');
  }

  if (!id) {
    return Promise.resolve(data);
  }

  const record = data.find(item => item.id === id);

  if (!record) {
    return Promise.reject(new Error('record not found'));
  }

  return Promise.resolve(record);
};

export const getLineItemsForReq = async ({ id, wait = 500 }) => {
  console.log('fetchLineItemsForReq, id: ', id);

  await delay(wait);

  if (!id) {
    return Promise.reject('No Req Id supplied');
  }

  const lineItems = sampleData['requisitionLineItems'];
  console.log('lineItems: ', lineItems);

  if (!lineItems) {
    return Promise.reject('no line items found for that Requisition');
  }

  const forReq = lineItems.filter(item => item.relatedRequisition === id);

  console.log('API returning lineItems: ', forReq);

  return Promise.resolve(forReq);
};
