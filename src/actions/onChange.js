import get from 'lodash/fp/get';

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

export default onChange;
