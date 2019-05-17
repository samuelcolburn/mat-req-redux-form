import orm, { tableModelMap } from '../orm';
import {
  CREATE_JOB,
  UPDATE_JOB,
  REMOVE_JOB,
  CREATE_SHOP_DRAWING,
  UPDATE_SHOP_DRAWING,
  REMOVE_SHOP_DRAWING,
  CREATE_PHASE,
  UPDATE_PHASE,
  REMOVE_PHASE,
  CREATE_REQUISITION,
  UPDATE_REQUISITION,
  REMOVE_REQUISITION,
  CREATE_MANY_REQUISITION_LINE_ITEM,
  CREATE_REQUISITION_LINE_ITEM,
  UPDATE_REQUISITION_LINE_ITEM,
  REMOVE_REQUISITION_LINE_ITEM,
  AUTOCOMPLETE_FETCH_SUCCESS,
  CREATE_VENDOR,
  UPDATE_VENDOR,
  REMOVE_VENDOR,
  CREATE_ITEM_TYPE,
  UPDATE_ITEM_TYPE,
  REMOVE_ITEM_TYPE,
  CREATE_INVENTORY_ITEM,
  UPDATE_INVENTORY_ITEM,
  REMOVE_INVENTORY_ITEM
} from '../constants';

function autocompleteOrmReducer(sess, action) {
  if (action.type !== AUTOCOMPLETE_FETCH_SUCCESS) return;

  const { data, table } = action.payload;

  if (!tableModelMap[table]) return;

  if (!data || !data.length) return;

  const modelName = tableModelMap[table];

  const model = sess[modelName];

  if (!model) return;

  data.forEach(record => {
    model.idExists(record.id)
      ? model.withId(record.id).update(record)
      : model.create(record);
  });
}

const createOrUpdate = (model, record) =>
  model.idExists(record.id)
    ? model.withId(record.id).update(record)
    : model.create(record);

function ormReducer(dbState, action) {
  const sess = orm.session(dbState);

  // Session-specific Models are available
  // as properties on the Session instance.
  const {
    Job,
    ShopDrawing,
    Phase,
    Requisition,
    RequisitionLineItem,
    Vendor,
    ItemType,
    InventoryItem
  } = sess;

  switch (action.type) {
    case AUTOCOMPLETE_FETCH_SUCCESS:
      autocompleteOrmReducer(sess, action);
      break;

    case CREATE_JOB:
      Job.create(action.payload);
      break;
    case UPDATE_JOB:
      Job.withId(action.payload.id).update(action.payload);
      break;
    case REMOVE_JOB:
      Job.withId(action.payload.id).delete();
      break;

    case CREATE_SHOP_DRAWING:
      ShopDrawing.create(action.payload);
      break;
    case UPDATE_SHOP_DRAWING:
      ShopDrawing.withId(action.payload.id).update(action.payload);
      break;
    case REMOVE_SHOP_DRAWING:
      ShopDrawing.withId(action.payload.id).delete();
      break;

    case CREATE_PHASE:
      Phase.create(action.payload);
      break;

    case UPDATE_PHASE:
      Phase.withId(action.payload.id).update(action.payload);
      break;

    case REMOVE_PHASE:
      Phase.withId(action.payload.id).update(action.payload);
      break;

    case CREATE_REQUISITION:
      console.log('ormReducer, action: ', action.type);
      console.log('payload: ', action.payload);
      // Requisition.create(action.payload);
      createOrUpdate(Requisition, action.payload);
      break;

    case UPDATE_REQUISITION:
      // Requisition.withId(action.payload.id).update(action.payload);
      createOrUpdate(Requisition, action.payload);
      break;

    case REMOVE_REQUISITION:
      Requisition.withId(action.payload.id).update(action.payload);
      break;

    case CREATE_MANY_REQUISITION_LINE_ITEM:
      console.log('ormReducer, action: ', action.type);
      console.log('payload: ', action.payload);
      action.payload.forEach(requisitionLineItem => {
        console.log('item: ', requisitionLineItem);
        // RequisitionLineItem.create(requisitionLineItem);
        createOrUpdate(RequisitionLineItem, requisitionLineItem);
      });
      break;

    case CREATE_REQUISITION_LINE_ITEM:
      // RequisitionLineItem.create(action.payload);
      createOrUpdate(RequisitionLineItem, action.payload);
      break;

    case UPDATE_REQUISITION_LINE_ITEM:
      // RequisitionLineItem.withId(action.payload.id).update(action.payload);
      createOrUpdate(RequisitionLineItem, action.payload);
      break;

    case REMOVE_REQUISITION_LINE_ITEM:
      RequisitionLineItem.withId(action.payload.id).update(action.payload);
      break;

    case CREATE_VENDOR:
      Vendor.create(action.payload);
      break;

    case UPDATE_VENDOR:
      Vendor.withId(action.payload.id).update(action.payload);
      break;

    case REMOVE_VENDOR:
      Vendor.withId(action.payload.id).update(action.payload);
      break;

    case CREATE_ITEM_TYPE:
      ItemType.create(action.payload);
      break;

    case UPDATE_ITEM_TYPE:
      ItemType.withId(action.payload.id).update(action.payload);
      break;

    case REMOVE_ITEM_TYPE:
      ItemType.withId(action.payload.id).update(action.payload);
      break;

    case CREATE_INVENTORY_ITEM:
      InventoryItem.create(action.payload);
      break;

    case UPDATE_INVENTORY_ITEM:
      InventoryItem.withId(action.payload.id).update(action.payload);
      break;

    case REMOVE_INVENTORY_ITEM:
      InventoryItem.withId(action.payload.id).update(action.payload);
      break;

    default:
      break;
  }
  /*
        case 'ADD_AUTHOR_TO_BOOK':
        Book.withId(action.payload.bookId).authors.add(action.payload.author);
        break;
    case 'REMOVE_AUTHOR_FROM_BOOK':
        Book.withId(action.payload.bookId).authors.remove(action.payload.authorId);
        break;
    case 'ASSIGN_PUBLISHER':
        Book.withId(action.payload.bookId).publisher = action.payload.publisherId;
        break;
    }
    */

  // the state property of Session always points to the current database.
  // Updates don't mutate the original state, so this reference is not
  // equal to `dbState` that was an argument to this reducer.
  return sess.state;
}

export default ormReducer;
