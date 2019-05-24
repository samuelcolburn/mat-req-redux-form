import cloneDeepWith from 'lodash/fp/cloneDeepWith';
import {
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
  change,
  formValueSelector
  // getFormValues
} from 'redux-form';
import { makeLineItemId } from '../helpers';

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
