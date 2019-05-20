import { ORM } from 'redux-orm';
import {
  Job,
  ShopDrawing,
  Phase,
  Requisition,
  RequisitionLineItem,
  Vendor,
  InventoryItem,
  ItemType,
  Note
} from './models';

const orm = new ORM();
orm.register(
  Job,
  ShopDrawing,
  Phase,
  Requisition,
  Vendor,
  ItemType,
  InventoryItem,
  RequisitionLineItem,
  Note
);

export default orm;

export const tableModelMap = {
  jobs: 'Job',
  phases: 'Phase',
  shopDrawings: 'ShopDrawing',
  requisitions: 'Requisition',
  requisitionLineItems: 'RequisitionLineItem',
  vendors: 'Vendor',
  itemTypes: 'ItemType',
  inventoryItems: 'InventoryItem',
  note: 'Note'
};
