import pick from 'lodash/fp/pick';
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
  REMOVE_INVENTORY_ITEM,
  CREATE_MANY_NOTES,
  CREATE_NOTE,
  UPDATE_NOTE,
  REMOVE_NOTE,
  CREATE_MANY_ATTACHMENTS,
  CREATE_ATTACHMENT,
  UPDATE_ATTACHMENT,
  REMOVE_ATTACHMENT,
  CREATE_USER,
  UPDATE_USER,
  REMOVE_USER
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

// const createOrUpdate = (model, record) =>
//   model.idExists(record.id)
//     ? model.withId(record.id).update(record)
//     : model.create(record);

const createOrUpdate = (model, record) => model.upsert(record);

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
    InventoryItem,
    Note,
    Attachment,
    User
  } = sess;

  const { type, payload } = action;

  switch (type) {
    case AUTOCOMPLETE_FETCH_SUCCESS:
      autocompleteOrmReducer(sess, action);
      break;

    case CREATE_JOB:
      Job.create(payload);
      break;
    case UPDATE_JOB:
      Job.withId(payload.id).update(payload);
      break;
    case REMOVE_JOB:
      Job.withId(payload.id).delete();
      break;

    case CREATE_SHOP_DRAWING:
      ShopDrawing.create(payload);
      break;
    case UPDATE_SHOP_DRAWING:
      ShopDrawing.withId(payload.id).update(payload);
      break;
    case REMOVE_SHOP_DRAWING:
      ShopDrawing.withId(payload.id).delete();
      break;

    case CREATE_PHASE:
      Phase.create(payload);
      break;

    case UPDATE_PHASE:
      Phase.withId(payload.id).update(payload);
      break;

    case REMOVE_PHASE:
      Phase.withId(payload.id).update(payload);
      break;

    case CREATE_REQUISITION:
      // console.log('ormReducer, action: ', action.type);
      // console.log('payload: ', payload);
      // Requisition.create(payload);
      // const req = pick(
      //   [
      //     'id',
      //     'createdBy',
      //     'relatedUser',
      //     'dateCreated',
      //     'dateNeeded',
      //     'number',
      //     'subject',
      //     'relatedJob',
      //     'relatedShopDrawing'
      //   ],
      //   payload
      // );
      createOrUpdate(Requisition, payload);

      // if (payload.relatedJob && payload.job) {
      //   Job.upsert({
      //     id: payload.relatedJob,
      //     ...payload.job
      //   });
      // }

      break;

    case UPDATE_REQUISITION:
      // Requisition.withId(payload.id).update(payload);
      createOrUpdate(Requisition, payload);
      break;

    case REMOVE_REQUISITION:
      Requisition.withId(payload.id).update(payload);
      break;

    case CREATE_MANY_REQUISITION_LINE_ITEM:
      // console.log('ormReducer, action: ', action.type);
      // console.log('payload: ', payload);
      payload.forEach(requisitionLineItem => {
        // console.log('item: ', requisitionLineItem);
        // RequisitionLineItem.create(requisitionLineItem);
        createOrUpdate(RequisitionLineItem, requisitionLineItem);
      });
      break;

    case CREATE_REQUISITION_LINE_ITEM:
      // RequisitionLineItem.create(payload);
      createOrUpdate(RequisitionLineItem, payload);
      break;

    case UPDATE_REQUISITION_LINE_ITEM:
      // RequisitionLineItem.withId(payload.id).update(payload);
      createOrUpdate(RequisitionLineItem, payload);
      break;

    case REMOVE_REQUISITION_LINE_ITEM:
      RequisitionLineItem.withId(payload.id).update(payload);
      break;

    case CREATE_VENDOR:
      Vendor.create(payload);
      break;

    case UPDATE_VENDOR:
      Vendor.withId(payload.id).update(payload);
      break;

    case REMOVE_VENDOR:
      Vendor.withId(payload.id).update(payload);
      break;

    case CREATE_ITEM_TYPE:
      ItemType.create(payload);
      break;

    case UPDATE_ITEM_TYPE:
      ItemType.withId(payload.id).update(payload);
      break;

    case REMOVE_ITEM_TYPE:
      ItemType.withId(payload.id).update(payload);
      break;

    case CREATE_INVENTORY_ITEM:
      InventoryItem.create(payload);
      break;

    case UPDATE_INVENTORY_ITEM:
      InventoryItem.withId(payload.id).update(payload);
      break;

    case REMOVE_INVENTORY_ITEM:
      InventoryItem.withId(payload.id).update(payload);
      break;

    case CREATE_MANY_NOTES:
      payload.forEach(note => {
        createOrUpdate(Note, note);
      });
      break;

    case CREATE_NOTE:
      Note.create(payload);
      break;

    case UPDATE_NOTE:
      Note.withId(payload.id).update(payload);
      break;

    case REMOVE_NOTE:
      Note.withId(payload.id).update(payload);
      break;

    case CREATE_MANY_ATTACHMENTS:
      payload.forEach(attachment => {
        createOrUpdate(Attachment, attachment);
      });
      break;

    case CREATE_ATTACHMENT:
      Attachment.create(payload);
      break;

    case UPDATE_ATTACHMENT:
      Attachment.withId(payload.id).update(payload);
      break;

    case REMOVE_ATTACHMENT:
      Attachment.withId(payload.id).update(payload);
      break;

    case CREATE_USER:
      User.create(payload);
      break;

    case UPDATE_USER:
      User.withId(payload.id).update(payload);
      break;

    case REMOVE_USER:
      User.withId(payload.id).update(payload);
      break;

    default:
      break;
  }
  /*
        case 'ADD_AUTHOR_TO_BOOK':
        Book.withId(payload.bookId).authors.add(payload.author);
        break;
    case 'REMOVE_AUTHOR_FROM_BOOK':
        Book.withId(payload.bookId).authors.remove(payload.authorId);
        break;
    case 'ASSIGN_PUBLISHER':
        Book.withId(payload.bookId).publisher = payload.publisherId;
        break;
    }
    */

  // the state property of Session always points to the current database.
  // Updates don't mutate the original state, so this reference is not
  // equal to `dbState` that was an argument to this reducer.
  return sess.state;
}

export default ormReducer;
