import { get, cloneDeepWith } from 'lodash/fp';
import debounce from 'lodash/debounce';
import {
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
  change,
  formValueSelector
  // getFormValues
} from 'redux-form';
import {
  AUTOCOMPLETE_FETCH_INIT,
  AUTOCOMPLETE_FETCH_ERROR,
  AUTOCOMPLETE_FETCH_SUCCESS,
  CREATE_JOB,
  UPDATE_JOB,
  REMOVE_JOB,
  CREATE_SHOP_DRAWING,
  UPDATE_SHOP_DRAWING,
  REMOVE_SHOP_DRAWING,
  CREATE_PHASE,
  UPDATE_PHASE,
  REMOVE_PHASE,
  REQ_REQUISITION,
  REQ_REQUISITION_SUCCESS,
  REQ_REQUISITION_ERROR,
  CREATE_REQUISITION,
  UPDATE_REQUISITION,
  REMOVE_REQUISITION,
  SELECT_REQUISITION,
  CREATE_MANY_REQUISITION_LINE_ITEM,
  CREATE_REQUISITION_LINE_ITEM,
  UPDATE_REQUISITION_LINE_ITEM,
  REMOVE_REQUISITION_LINE_ITEM,
  CREATE_MANY_NOTES,
  CREATE_NOTE,
  UPDATE_NOTE,
  REMOVE_NOTE
  // SELECT_LINE_ITEM,
  // DESELECT_LINE_ITEM,
  // SELECT_LINE_ITEMS,
  // DESELECT_LINE_ITEMS
} from './constants';
import { delay, stringify, makeLineItemId } from './helpers';
import {
  doQuery,
  getData,
  getRandomData,
  getLineItemsForReq,
  getNotesForLineItems
} from './data/api';
import orm from './orm';
// import { getSelectedLineItems } from './selectors';

export const createJob = props => {
  return {
    type: CREATE_JOB,
    payload: props
  };
};

export const updateJob = (id, props) => {
  return {
    type: UPDATE_JOB,
    payload: {
      id,
      ...props
    }
  };
};

export const removeJob = id => {
  return {
    type: REMOVE_JOB,
    payload: {
      id
    }
  };
};

export const createShopDrawing = props => {
  return {
    type: CREATE_SHOP_DRAWING,
    payload: props
  };
};

export const updateShopDrawing = (id, props) => {
  return {
    type: UPDATE_SHOP_DRAWING,
    payload: {
      id,
      ...props
    }
  };
};

export const removeShopDrawing = id => {
  return {
    type: REMOVE_SHOP_DRAWING,
    payload: {
      id
    }
  };
};

export const createPhase = props => {
  return {
    type: CREATE_PHASE,
    payload: props
  };
};

export const updatePhase = (id, props) => {
  return {
    type: UPDATE_PHASE,
    payload: {
      id,
      ...props
    }
  };
};

export const removePhase = id => {
  return {
    type: REMOVE_PHASE,
    payload: {
      id
    }
  };
};

export const createManyRequisitionLineItem = props => {
  return {
    type: CREATE_MANY_REQUISITION_LINE_ITEM,
    payload: props
  };
};

export const createManyLineItemNotes = props => {
  return {
    type: CREATE_MANY_NOTES,
    payload: props
  };
};

export const createRequisitionLineItem = props => {
  // console.log('createRequisitionLineItem: ', props);
  return {
    type: CREATE_REQUISITION_LINE_ITEM,
    payload: props
  };
};

export const updateRequisitionLineItem = (id, props) => {
  return {
    type: UPDATE_REQUISITION_LINE_ITEM,
    payload: {
      id,
      ...props
    }
  };
};

export const removeRequisitionLineItem = id => {
  return {
    type: REMOVE_REQUISITION_LINE_ITEM,
    payload: {
      id
    }
  };
};

const createRequisition = requisition => {
  return {
    type: CREATE_REQUISITION,
    payload: requisition
  };
};

export const updateRequisition = (id, props) => {
  return {
    type: UPDATE_REQUISITION,
    payload: {
      id,
      ...props
    }
  };
};

export const removeRequisition = id => {
  return {
    type: REMOVE_REQUISITION,
    payload: {
      id
    }
  };
};

export const selectRequisition = id => {
  return {
    type: SELECT_REQUISITION,
    payload: id
  };
};

const reqRequisitionInit = id => {
  return {
    type: REQ_REQUISITION,
    payload: id
  };
};
const reqRequisitionSuccess = requisition => {
  return (dispatch, getState) => {
    dispatch(createRequisition(requisition));
    dispatch({
      type: REQ_REQUISITION_SUCCESS
    });

    const dbState = getState().db;
    const sess = orm.session(dbState);

    if (!sess.Job.idExists(requisition.relatedJob)) {
      dispatch(createJob(requisition.job));
    }

    if (!sess.ShopDrawing.idExists(requisition.relatedShopDrawing)) {
      dispatch(createShopDrawing(requisition.shopDrawing));
    }
  };
};

const reqRequisitionError = error => {
  return {
    type: REQ_REQUISITION_ERROR,
    error
  };
};
const fetchRequisition = id => {
  // console.log('fetching Requisition: ', id);
  return (dispatch, getState) => {
    dispatch(reqRequisitionInit(id));

    return getData({ table: 'requisitions', id });
    /*       .then(
        res => dispatch(reqRequisitionSuccess(res)),
        error => dispatch(reqRequisitionError(error))
      ) */
  };
};

const fetchLineItemsForReq = id => {
  return (dispatch, getState) => getLineItemsForReq({ id });
};

const fetchNotesForLineItems = lineItems => (dispatch, getState) =>
  getNotesForLineItems(lineItems);

export const loadRequisitionById = ({ id }) => {
  console.log('loadRequisitionById', id);
  return (dispatch, getState) => {
    Promise.all([
      dispatch(fetchRequisition(id)),
      dispatch(fetchLineItemsForReq(id))
    ]).then(
      data => {
        console.log('load req done fetching: ', data);
        dispatch(reqRequisitionSuccess(data[0]));
        dispatch(createManyRequisitionLineItem(data[1]));
        dispatch(selectRequisition(data[0].id));
      },
      error => {
        console.log('error fetching data: ', error.message);
        console.error(error);
        dispatch(reqRequisitionError(error));
      }
    );
  };
};

const fetchRandomRequisition = () => {
  return (dispatch, getState) => {
    dispatch(reqRequisitionInit());

    return getRandomData({ table: 'requisitions' });
  };
};
export const loadRandomRequisition = () => {
  return (dispatch, getState) => {
    dispatch(fetchRandomRequisition()).then(data =>
      Promise.all([data, dispatch(fetchLineItemsForReq(data.id))])
        .then(([requisition, lineItems]) =>
          Promise.all([
            requisition,
            lineItems,
            dispatch(fetchNotesForLineItems(lineItems))
          ])
        )
        .then(
          ([requisition, lineItems, lineItemNotes]) => {
            console.log('load req done fetching: ', data);
            dispatch(reqRequisitionSuccess(requisition));
            dispatch(createManyRequisitionLineItem(lineItems));
            dispatch(createManyLineItemNotes(lineItemNotes));

            dispatch(selectRequisition(requisition.id));
          },
          error => {
            console.log('error fetching data: ', error.message);
            console.error(error);
            dispatch(reqRequisitionError(error));
          }
        )
    );
  };
};

const autocompleteFetchInit = props => {
  return {
    type: AUTOCOMPLETE_FETCH_INIT,
    payload: props
  };
};
const autocompleteFetchSuccess = props => {
  return {
    type: AUTOCOMPLETE_FETCH_SUCCESS,
    payload: props
  };
};
const autocompleteFetchError = props => {
  return {
    type: AUTOCOMPLETE_FETCH_ERROR,
    payload: props
  };
};

export const getQuery = ({ table, params }) => {
  return (dispatch, getState) => {
    const { autocomplete } = getState();
    if (get(`${table}.loading`, autocomplete)) {
      // bail out early if we are already loading
      return Promise.resolve();
    }

    dispatch(autocompleteFetchInit({ table, params }));

    return doQuery({ table, params }).then(
      data => dispatch(autocompleteFetchSuccess({ table, params, data })),
      err => dispatch(autocompleteFetchError({ table, error: err }))
    );

    /*
      return {
    type: FETCH_INIT
  }
  */
  };
};

const debouncedGetQuery = debounce(
  (dispatch, ...args) => dispatch(getQuery(...args)),
  200
);

export const search = ({ table, params }) => (dispatch, getState) => {
  // if (!params) return Promise.resolve();
  // if (!params.q) return Promise.resolve();
  // if (!params.q.length) return Promise.resolve();
  // if (!params.q.trim().length) return Promise.resolve();

  // console.log('search action');
  // console.log('table: ', table);
  // console.log('params: ', params);
  const { autocomplete } = getState();
  // console.log('autcomplete state: ', autocomplete);
  const searchKey = stringify(params);
  // console.log('searchKey: ', searchKey);

  const cachedSearch = get([table, 'byId', searchKey], autocomplete);
  // console.log('cachedSearch: ', cachedSearch);

  if (cachedSearch) {
    // console.log('already searched this value, returning resolved promise: ');
    return Promise.resolve();
  }

  debouncedGetQuery(dispatch, { table, params });
};

/**
 * @name determineNewSubject
 *
 * @description When the Shop Drawing is updated, check if we need to update the Subject
 * The subject should be updated to match the current Shop Drawing, unless the user has modified it.
 *
 * @param {object} previousValues the form values prior to this change
 * @param {object} newShopDrawing the new shop drawing object
 * @return {string} the new Requisition subject for the form
 */
const determineNewSubject = (previousValues, newShopDrawing) => {
  // get the relevant subjects from the provided data
  const prevSubject = get('subject', previousValues);
  const previousShopDrawingSubject = get(
    ['shopDrawing', 'subject'],
    previousValues
  );
  const newShopDrawingSubject = get('subject', newShopDrawing) || '';

  // If there wasn't a subject previously, put in the new subject
  if (!prevSubject && newShopDrawingSubject) return newShopDrawingSubject;

  // If the previous subject matches the previous Shop Drawing's subject
  // then should update it to the new subject
  if (prevSubject === previousShopDrawingSubject) return newShopDrawingSubject;

  // If the subject was modified by the user, then assume they want to keep their custom subject,
  // and do not change it
  console.log('new subject: ', prevSubject);
  return prevSubject;
};

/**
 * @name handleJobChange
 * @description when the Job is changed on the form, empty the ShopDrawing value
 */
const handleJobChange = (values, dispatch, props, previousValues) => {
  const getId = get(['job', 'id']);
  const prevId = getId(previousValues);
  const id = getId(values);

  if (prevId && id !== prevId) {
    // console.log("CHANGE HANDLER: JOB");
    dispatch(props.change('relatedJob', id ? id : null));
    dispatch(props.change('relatedShopDrawing', null));
    dispatch(props.change('shopDrawing', null));
  }
};

/**
 * @name handleShopDrawingChange
 * @description when the ShopDrawing is changed on the form:
 *  1. Update the subject if necessary
 *  2. Clear all phase values on all line Items
 */
const handleShopDrawingChange = (values, dispatch, props, previousValues) => {
  const prevId = get(['shopDrawing', 'id'], previousValues);
  const shopDrawing = get('shopDrawing', values);
  const id = get('id', shopDrawing);

  if (id !== prevId) {
    // console.log("CHANGE HANDLER: SHOP DRAWING");
    dispatch(props.change('relatedShopDrawing', id ? id : null));
    dispatch(props.change('number', id ? `${shopDrawing.number}.1` : ''));
    const newSubject = determineNewSubject(previousValues, shopDrawing);
    dispatch(props.change('subject', newSubject));

    const previousLineItems = get('lineItems', previousValues);
    const lineItems = get('lineItems', values);
    if (previousLineItems && previousLineItems.length) {
      lineItems.forEach((lineItem, index) => {
        dispatch(props.change(`lineItems[${index}].phase`, null));
        dispatch(props.change(`lineItems[${index}].relatedPhase`, null));
      });
    }
  }
};

/**
 * @name handleItemTypeChange
 * @description If the Item Type for a Line Item is changed, clear related inventory item
 */
const handleItemTypeChange = (values, dispatch, props, previousValues) => (
  lineItem,
  index
) => {
  const getId = get(['lineItems', index, 'itemType', 'id']);
  const prevId = getId(previousValues);
  const id = getId(values);

  if (id !== prevId) {
    dispatch(props.change(`lineItems[${index}].relatedItemType`, id || null));
    dispatch(props.change(`lineItems[${index}].relatedInventoryItem`, null));
    dispatch(props.change(`lineItems[${index}].inventoryItem`, null));
  }
};

/**
 * @name handleLineItemItemTypeChange
 * @description Handle item type changes for all line items if lineItems has changed
 */
const handleLineItemItemTypeChange = (
  values,
  dispatch,
  props,
  previousValues
) => {
  const lineItems = get('lineItems', values);
  if (!lineItems || !lineItems.length) return;

  lineItems.forEach(
    handleItemTypeChange(values, dispatch, props, previousValues)
  );
};

export const onChange = (values, dispatch, props, previousValues) => {
  // Ignore change handlers if the form is still pristine
  if (props.pristine) {
    return;
  }

  handleJobChange(values, dispatch, props, previousValues);
  handleShopDrawingChange(values, dispatch, props, previousValues);
  handleLineItemItemTypeChange(values, dispatch, props, previousValues);
};

// ** select as separate piece of state **

// const selectLineItem = props => ({
//   type: SELECT_LINE_ITEM,
//   payload: props
// });

// const deselectLineItem = props => ({
//   type: DESELECT_LINE_ITEM,
//   payload: props
// });

// const deselectLineItems = props => ({
//   type: DESELECT_LINE_ITEMS,
//   payload: props
// });

// const selectLineItems = props => ({
//   type: SELECT_LINE_ITEMS,
//   payload: props
// });

// export const selectItem = ({ form, id }) => (dispatch, getState) => {
//   dispatch(selectLineItem({ form, id }));
// };

// export const deselectItem = ({ form, id }) => (dispatch, getState) => {
//   dispatch(deselectLineItem({ form, id }));
// };

// export const selectAll = ({ form }) => (dispatch, getState) => {
//   console.log('selectAll');
//   console.log('dispatch: ', dispatch);
//   console.log('getstate: ', getState);
//   console.log('form: ', form);
//   // const lineItems = formValueSelector(getState(), form);
//   const formValues = getFormValues(form)(getState());
//   const lineItems = get(['lineItems'], formValues);

//   console.log('lineItems: ', lineItems);

//   dispatch(selectLineItems({ form, lineItems }));
// };

// export const deselectAll = ({ form }) => (dispatch, getState) => {
//   console.log('deselectAll');
//   console.log('dispatch: ', dispatch);
//   console.log('getstate: ', getState);
//   console.log('form: ', form);

//   dispatch(deselectLineItems({ form }));
// };

const selector = (form, ...other) => formValueSelector(form)(...other);

export const selectAll = ({ form }) => (dispatch, getState) => {
  // console.log('selectAll');
  // console.log('dispatch: ', dispatch);
  // console.log('getstate: ', getState);
  // console.log('form: ', form);
  // const lineItems = formValueSelector(getState(), form);
  // const formValues = getFormValues(form)(getState());
  // const lineItems = get(['lineItems'], formValues);

  const lineItems = selector(form, getState(), 'lineItems');

  // console.log('lineItems: ', lineItems);
  lineItems.forEach((lineItem, index) => {
    dispatch(change(form, `lineItems.${index}.selected`, true, false));
  });
};

export const deselectAll = ({ form }) => (dispatch, getState) => {
  // console.log('deselectAll');
  // console.log('dispatch: ', dispatch);
  // console.log('getstate: ', getState);
  // console.log('form: ', form);

  const lineItems = selector(form, getState(), 'lineItems');

  // console.log('lineItems: ', lineItems);
  lineItems.forEach((lineItem, index) => {
    dispatch(change(form, `lineItems.${index}.selected`, false, false));
  });
};

export const updateStatus = ({ form, status }) => (dispatch, getState) => {
  // console.log('updateStatus');
  // console.log('props: ', status);

  const lineItems = selector(form, getState(), 'lineItems');

  // console.log('lineItems: ', lineItems);
  // console.log('dispatch: ', dispatch);
  // console.log('change: ', change);

  lineItems.forEach((lineItem, index) => {
    if (lineItem.selected) {
      dispatch(change(form, `lineItems.${index}.status`, status));
    }
  });
};

// const lineItemIdPrefix = () => 'lineItem_';
// const makeLineItemCopy = lineItem => ({
//   ...lineItem,
//   id: uniqueId(lineItemIdPrefix()),
//   selected: false
// });

const copyLineItem = cloneDeepWith((val, key, obj, stack) => {
  switch (key) {
    case 'id':
      return makeLineItemId();

    case 'selected':
      return false;

    default:
      break;
  }
});

export const copySelected = ({ form }) => (dispatch, getState) => {
  // console.log('copySelected');
  // console.log('form: ', form);

  const lineItems = selector(form, getState(), 'lineItems');

  // console.log('lineItems: ', lineItems);
  // console.log('arrayPush: ', arrayPush);

  lineItems.forEach((lineItem, index) => {
    if (lineItem.selected) {
      // console.log('copyLineItem: ', copyLineItem);
      const copiedItem = copyLineItem(lineItem);
      dispatch(arrayPush(form, 'lineItems', copiedItem));
    }
  });
};
export const removeSelected = ({ form }) => (dispatch, getState) => {
  // console.log('removeSelected');
  // console.log('form: ', form);

  // get the current lineItems on the form
  const lineItems = selector(form, getState(), 'lineItems');
  // console.log('lineItems: ', lineItems);
  // console.log('arrayRemove: ', arrayRemove);

  // create an array of selected items
  const selectedLineItems = lineItems.reduceRight((acc, lineItem, index) => {
    if (!lineItem.selected) return acc;

    return [
      ...acc,
      {
        id: lineItem.id,
        originalIndex: index,
        updatedIndex: index
      }
    ];
  }, []);

  // console.log('selectedLineItems: ', selectedLineItems);

  if (lineItems.length === selectedLineItems.length) {
    // if their lengths are equal, we can use the arrayRemoveAll
    // action creator instead.
    dispatch(arrayRemoveAll(form, 'lineItems'));
    return;
  }

  let temp = [...selectedLineItems];
  selectedLineItems.forEach((lineItem, index, arr) => {
    const itemToRemove = temp.find(li => li.id === lineItem.id);
    const indexToRemove = itemToRemove.updatedIndex;
    dispatch(arrayRemove(form, 'lineItems', indexToRemove));

    temp = temp.map(li => ({
      ...li,
      updatedIndex:
        li.updatedIndex > indexToRemove ? li.updatedIndex - 1 : li.updatedIndex
    }));
  });
};

export const saveNote = ({ form, index, note }) => (dispatch, getState) => {
  dispatch(change(form, `lineItems.${index}.addNote`, note, false));
};

const readNote = ({ note, user }) => ({
  type: UPDATE_NOTE,
  payload: {
    id: note.id,
    readBy: note.readBy + ';' + user
  }
});

export const readNotes = ({ notes, user }) => (dispatch, getState) => {
  console.group('readNotes: ');
  console.log('notes: ', notes);
  console.log('user: ', user);
  console.groupEnd();
  delay(200).then(
    success => {
      console.log('notes were set to read in database: ');
      notes.forEach(note => dispatch(readNote({ note, user })));
    },
    error => {
      console.log('error reading notes: ', error.message);
      console.error(error);
    }
  );
};
