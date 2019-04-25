import faker from 'faker';
import { populate } from '../helpers';

const mockRequisition = shopDrawing => {
  return {
    id: faker.random.uuid(),
    createdBy: faker.fake('{{name.firstName}} {{name.lastName}}'),
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
  };
};

const mockRequisitions = shopDrawings =>
  shopDrawings.reduce((acc, curr) => {
    const numRequisitions = faker.random.number({ min: 5, max: 25 });

    return [...acc, ...populate(mockRequisition)(numRequisitions, curr)];
  }, []);

export default mockRequisitions;
