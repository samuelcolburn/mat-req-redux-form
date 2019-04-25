import faker from 'faker';
import { populate } from '../helpers';

const price = () =>
  faker.random.number({ min: 0, max: 100000 }) +
  faker.random.number({ min: 0, max: 99 }) / 100;

const mockRequisitionLineItem = (requisition, vendors, sdPhases) => {
  const phase =
    sdPhases[faker.random.number({ min: 0, max: sdPhases.length - 1 })];
  if (!phase) return null;

  const vendor =
    vendors[faker.random.number({ min: 0, max: vendors.length - 1 })];

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
    type: '',
    description: faker.lorem.words(faker.random.number({ max: 15 })),
    inventoryItem: '',
    startingInventory: faker.random.number({ min: 0, max: 1000 }),
    quantityRequested: faker.random.number({ min: 0, max: 1000 }),
    quantityOrdered: price(),
    quantityNeeded: price(),
    estimatedCost: price(),
    currentCost: price(),
    relatedRequisition: requisition.id,
    requisition: { ...requisition },
    relatedPhase: phase.id,
    phase: { ...phase },
    relatedVendor: vendor.id,
    vendor: { ...vendor }
  };
};

const mockRequisitionLineItems = (
  requisitions,
  vendors,
  phases,
  numLineItemsOptions = { min: 1, max: 10 }
) =>
  requisitions.reduce((acc, curr) => {
    const numLineItems = faker.random.number(numLineItemsOptions);

    const sdPhases = phases.filter(
      phase => phase.relatedShopDrawing === curr.relatedShopDrawing
    );

    if (!sdPhases) return acc;

    return [
      ...acc,
      ...populate(mockRequisitionLineItem)(
        numLineItems,
        curr,
        vendors,
        sdPhases
      )
    ];
  }, []);

export default mockRequisitionLineItems;
