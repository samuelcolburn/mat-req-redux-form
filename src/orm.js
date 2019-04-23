import { ORM } from "redux-orm";
import {
  Job,
  ShopDrawing,
  Phase,
  Requisition,
  RequisitionLineItem
} from "./models";

const orm = new ORM();
orm.register(Job, ShopDrawing, Phase, Requisition, RequisitionLineItem);

export default orm;

export const tableModelMap = {
  jobs: "Job",
  phases: "Phase",
  shopDrawings: 'ShopDrawing',
  requisitions: 'Requisition',
  requisitionLineItems: "RequisitionLineItem"
}
