import faker from "faker";
import random from 'lodash/random'

const price = () => faker.random.number({ min: 0, max: 100000 }) + (faker.random.number({min: 0, max: 99 })/100)

const mockJob = () => {
  const number = faker.random.number({
    max: 9999,
    min: 6000
  });
  const name = faker.company.companyName();
  return {
    id: faker.random.uuid(),
    number,
    name,
    job: `${number} - ${name}`
  };
};

const mockJobs = (qty = 100) => {
  let jobs = [];

  for (let i = 0; i < qty; i++) {
    const job = mockJob();
    jobs.push(job);
  }

  return jobs;
};

const mockShopDrawing = job => {
  const number = faker.random.number({
    min: 1,
    max: 35
  });
  const subject = faker.lorem.words(
    faker.random.number({
      min: 5,
      max: 15
    })
  );

  return {
    id: faker.random.uuid(),
    number,
    subject,
    shopDrawing: `SD.${number} - ${subject}`,
    relatedJob: job.id,
    job: {
      ...job
    }
  };
};

const mockShopDrawings = (jobs, numShopDrawingOptions = {
  min: 1,
  max: 25
}) =>
  jobs.reduce((acc, curr) => {
    const shopDrawings = [];
    const numShopDrawings = faker.random.number(numShopDrawingOptions)

    for (let i = 0; i <= numShopDrawings; i++) {
      const shopDrawing = mockShopDrawing(curr);
      shopDrawings.push(shopDrawing);
    }

    return [...acc, ...shopDrawings];
  }, []);

const mockPhase = (job, shopDrawings) => {
  const letter = faker.random.word().charAt(0).toUpperCase()
  const number = faker.random.number({
    min: 1,
    max: 50
  })

  const phase = faker.lorem.words(
    faker.random.number({
      min: 1,
      max: 5
    })
  );

  const shopDrawingIndex = random(0, shopDrawings.length - 1)
  const sd = shopDrawings[shopDrawingIndex]
  return {
    id: faker.random.uuid(),
    number: `${letter}${number}`,
    phase,
    relatedJob: job.id,
    job: {
      ...job
    },
    relatedShopDrawing: sd.id,
    shopDrawing: {
      ...sd
    }
  };
};
const mockPhases = (jobs, shopDrawings, numPhasesOptions = { min: 5, max: 25 }) =>
jobs.reduce((acc, curr) => {
  const phases = [];
  const numPhases = faker.random.number(numPhasesOptions)

  const sds = shopDrawings.filter(sd => sd.relatedJob === curr.id)

  for (let i = 0; i <= numPhases; i++) {
    const phase = mockPhase(curr, sds);
    phases.push(phase);
  }

  return [...acc, ...phases];
}, []);

const mockRequisition = (shopDrawing) => {
  return {
    id: faker.random.uuid(),
    createdBy: faker.fake("{{name.firstName}} {{name.lastName}}"),
    dateCreated: faker.date.recent().toLocaleDateString(),
    dateNeeded: faker.date.future(0, new Date()).toLocaleDateString(),
    number: faker.random.number({
      min: 1,
      max: 99
    }),
    subject: faker.lorem.words(faker.random.number({ max: 10 })),
    relatedJob: shopDrawing.relatedJob,
    job: { ...shopDrawing.job },
    relatedShopDrawing: shopDrawing.id,
    shopDrawing: { ...shopDrawing }
  }
}
const mockRequisitions = shopDrawings => shopDrawings
  .reduce((acc, curr) => {
    const requisitions = [];
    const numRequisitions = faker.random.number({
      min: 5,
      max: 25
    })

    for (let i = 0; i <= numRequisitions; i++) {
      const mr = mockRequisition(curr);
      requisitions.push(mr);
    }

    return [...acc, ...requisitions];
  }, []);

const mockRequisitionLineItem = (requisition, phase) => {
  return {
    id: faker.random.uuid(),
    selected: false,
    status: faker.random.arrayElement([
      'Needs Review',
      'Needs Pricing',
      'Needs Approval',
      'Approved',
      'Rejected',
      'Ordered',
      'Received',
      'Complete'
    ]),
    vendor: "",
    type: "",
    description: faker.lorem.words(faker.random.number({ max: 15 })),
    inventoryItem: "",
    startingInventory: faker.random.number({ min: 0, max: 1000}),
    quantityRequested: faker.random.number({ min: 0, max: 1000}),
    quantityOrdered: price(),
    quantityNeeded: price(),
    estimatedCost: price(),
    currentCost: price(),
    relatedRequisition: requisition.id,
    requisition: {...requisition},
    relatedPhase: phase.id,
    phase: {...phase}
  }
}
const mockRequisitionLineItems = (requisitions, phases, numLineItemsOptions = { min: 1, max: 10 }) => requisitions
.reduce((acc, curr) => {
  const lineItems = [];
  const numLineItems = faker.random.number(numLineItemsOptions)

  const sdPhases = phases.filter(phase => phase.relatedShopDrawing === curr.relatedShopDrawing)

  if (!sdPhases) return [...acc, ...lineItems];

  for (let i = 0; i <= numLineItems; i++) {
    const phase = sdPhases[faker.random.number({min: 0, max: sdPhases.length  - 1})]

    if (!phase) return [...acc, ...lineItems];

    const lineItem = mockRequisitionLineItem(curr, phase);
    lineItems.push(lineItem);
  }

  return [...acc, ...lineItems];
}, []);

const makeSampleData = () => {
  const jobs = mockJobs(10)
  const shopDrawings = mockShopDrawings(jobs, { min: 2, max: 5})
  const phases = mockPhases(jobs, shopDrawings, { min: 2, max: 5})
  const requisitions = mockRequisitions(shopDrawings, { min: 2, max: 5 })
  const requisitionLineItems = mockRequisitionLineItems(requisitions, phases, { min: 2, max: 5 })

  const sampleData = {
    jobs,
    shopDrawings,
    phases,
    requisitions,
    requisitionLineItems
  }

  console.log('sampleData: ', sampleData)

  return sampleData
}

const sampleData = makeSampleData()

export default sampleData
