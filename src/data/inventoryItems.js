import faker from 'faker';
import { populate } from '../helpers';

const mockInventoryItem = itemType => ({
  id: faker.random.uuid(),
  computerEaseNumber: faker.random.alphaNumeric(15).toUpperCase(),
  name: faker.commerce.productName(),
  relatedItemType: itemType.id,
  itemType: { ...itemType }
});

const mockInventoryItems = (itemTypes, opts = { min: 10, max: 100 }) =>
  itemTypes.reduce((acc, curr) => {
    const itemsPerType = faker.random.number(opts);

    return [...acc, ...populate(mockInventoryItem)(itemsPerType, curr)];
  }, []);

export default mockInventoryItems;
