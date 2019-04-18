import uniqueId from "lodash/uniqueId";

const makeMultiple = of => qty => id => {
  const items = [];

  for (let i = 0; i < qty; i++) {
    items.push(of(id));
  }

  return items;
};

const makeShopDrawing = (id, job) => ({
  id,
  job,
  name: `SD.${id.slice(-1)}`,
  number: id.slice(-1)
});

const makeSD = job => makeShopDrawing(uniqueId("shopDrawing_"), job);
const makeSDs = makeMultiple(makeSD);

const makeP = (id, job) => ({
  id,
  job,
  name: `phase.${id.slice(-1)}`
});
const makePhase = job => makeP(uniqueId("phase_"), job);
const makePhases = makeMultiple(makePhase);

const makeJob = (name, number) => {
  const id = uniqueId("job_");
  return {
    id,
    name,
    number
  };
};

const jobs = [
  makeJob("Foo", "6785"),
  makeJob("Bar", "6899"),
  makeJob("Baz", "6645")
];

const phases = jobs.reduce((phases, job) => {
  const jobPhases = makePhases(5)(job.id);

  return [...phases, ...jobPhases];
}, []);

const shopDrawings = jobs.reduce((shopDrawings, job) => {
  const jobShopDrawings = makeSDs(5)(job.id);

  return [...shopDrawings, ...jobShopDrawings];
}, []);

const makeLineItem = phases => mr => id => ({
  id,
  requisition: mr.id,
  selected: false,
  status: "Needs Review",
  phase: phases.find(phase => phase.job === mr.job).id,
  vendor: "",
  type: "",
  description: "",
  inventoryItem: "",
  startingInventory: "",
  quantityRequested: "",
  quantityOrdered: "",
  quantityNeeded: "",
  estimatedCost: "",
  currentCost: ""
});

const makeLineItems = phases => qty => mr => {
  const lineItems = [];

  for (let i = 0; i < qty; i++) {
    const id = uniqueId("lineItem_");
    const lineItem = makeLineItem(phases)(mr)(id);
    lineItems.push(lineItem);
  }

  return lineItems;
};

const makeRequisition = () => ({
  id: "1", // uniqueId("requisition_")
  createdBy: "Sam C.",
  dateCreated: "4/16/2019",
  dateNeeded: "4/16/2019",
  job: jobs[0].id,
  shopDrawing: shopDrawings[0].id,
  number: "99.99",
  subject: "subject example"
});

const requisitions = [makeRequisition()];

const requisitionLineItems = requisitions.reduce((lineItems, mr) => {
  const mrLineItems = makeLineItems(phases)(5)(mr);

  return [...lineItems, ...mrLineItems];
}, []);

export default {
  jobs,
  phases,
  shopDrawings,
  requisitions,
  requisitionLineItems
};
