import * as Yup from "yup";

const LineItemSchema = Yup.object({
  status: Yup.string()
    .oneOf([
      "Needs Review",
      "Needs Pricing",
      "Needs Approval",
      "Approved",
      "Rejected",
      "Ordered",
      "Received",
      "Complete"
    ])
    .required("A Status is required"),
  phase: Yup.object({
    id: Yup.string(),
    job: Yup.string(),
    name: Yup.string()
  }).required("A Phase is required"),
  vendor: Yup.object({
    rid: Yup.number(),
    name: Yup.string()
  })
    .nullable()
    .required("A Vendor is required"),
  type: Yup.object({
    rid: Yup.number(),
    name: Yup.string()
  })
    .nullable()
    .required("An Item Type is required"),
  description: Yup.string().when("type", (type, schema) => {
    return type && type.rid === 6
      ? schema.required("A description is required for Custom Items")
      : schema.notRequired();
  }),
  inventoryItem: Yup.object({
    rid: Yup.number(),
    computerEaseNumber: Yup.string(),
    manufacturer: Yup.string(),
    manufacturerNumber: Yup.string()
  })
    .nullable()
    .when("type", (type, schema) => {
      return type && type.rid !== 6
        ? schema.required("An Inventory Item is required for non-custom items")
        : schema.notRequired();
    }),
  startingInventory: Yup.number("Starting Inventory must be a number"),
  quantityRequested: Yup.number("Qty Requested must be a number").required(
    "A qty requested is required"
  ),
  quantityNeeded: Yup.number("Qty Needed must be a number"),
  quantityOrdered: Yup.number("Qty Ordered must be a number"),
  estimatedCost: Yup.number("Est Cost must be a number"),
  currentCost: Yup.number("Current Cost must be a number")
});

const validationSchema = Yup.object({
  createdBy: Yup.string().required("Created by is required"),
  dateCreated: Yup.date()
    .min(new Date(), "Date Created must be later than today")
    .required("Date Created is required"),
  dateNeeded: Yup.date().required("Date Needed is required"),
  job: Yup.object({
    id: Yup.string(),
    number: Yup.string(),
    name: Yup.string()
  }).required("A Job is required"),
  shopDrawing: Yup.object({
    id: Yup.string(),
    job: Yup.string(),
    name: Yup.string()
  }).required("A Shop Drawing is required"),
  number: Yup.string().required("A TO number is required"),
  subject: Yup.string().required("A subject is required"),
  lineItems: Yup.array(LineItemSchema)
    .min(1, "At least ${min} Line Item is required")
    .required("Line Items are required")
});

export default validationSchema;
