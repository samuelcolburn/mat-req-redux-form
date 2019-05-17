import faker from 'faker';

const mockItemType = parentTypes => {
  const name = faker.commerce.department();
  const parentNames =
    parentTypes && parentTypes.length ? parentTypes.join('>') : '';

  const fullName =
    parentNames && parentNames.length ? `${parentNames}>${name}` : name;
  return {
    id: faker.random.uuid(),
    name: name,
    fullName,
    parents: parentTypes
  };
};

const mockItemTypes = qty => {
  let itemTypes = [
    {
      id: faker.random.uuid(),
      name: 'Custom',
      fullName: 'Custom'
    }
  ];

  for (let i = 0; i < qty; i++) {
    const itemType = mockItemType();

    const numChildren = faker.random.number({ min: 0, max: 10 });

    for (let j = 0; j < numChildren; j++) {
      const childType = mockItemType([itemType.fullName]);
      itemTypes.push(childType);
    }
    itemTypes.push(itemType);
  }

  return itemTypes;
};

export default mockItemTypes;
