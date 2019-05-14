import faker from 'faker';
import { populate } from '../helpers';

const price = () =>
  faker.random.number({ min: 0, max: 100000 }) +
  faker.random.number({ min: 0, max: 99 }) / 100;

const mockRequisitionLineItem = (
  requisition,
  vendors,
  itemTypes,
  inventoryItems,
  sdPhases
) => {
  const phase =
    sdPhases[faker.random.number({ min: 0, max: sdPhases.length - 1 })];
  if (!phase) return null;

  const vendor =
    vendors[faker.random.number({ min: 0, max: vendors.length - 1 })];

  const itemType =
    itemTypes[faker.random.number({ min: 0, max: itemTypes.length - 1 })];
  let itemsOfType;
  let inventoryItem = null;
  if (itemType.name !== 'Custom') {
    itemsOfType = inventoryItems.filter(
      inventoryItem => inventoryItem.relatedItemType === itemType.id
    );
    inventoryItem =
      itemsOfType[faker.random.number({ min: 0, max: itemsOfType.length - 1 })];
  }

  return {
    id: faker.random.uuid(),
    selected: false,
    status: faker.random.arrayElement([
      'needsReview',
      'needsPricing',
      'needsApproval',
      'approved',
      'rejected',
      'ordered',
      'received',
      'complete'
    ]),
    relatedItemType: itemType.id,
    itemType: itemType,
    description: faker.lorem.words(faker.random.number({ max: 15 })),
    relatedInventoryItem: inventoryItem ? inventoryItem.id : null,
    inventoryItem: inventoryItem,
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
  itemTypes,
  inventoryItems,
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
        itemTypes,
        inventoryItems,
        sdPhases
      )
    ];
  }, []);

export default mockRequisitionLineItems;
