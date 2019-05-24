import faker from 'faker';
import { populate } from '../helpers';

const mockRequisition = (users, shopDrawing) => {
  const user = users[faker.random.number({ min: 0, max: users.length - 1 })];
  return {
    id: faker.random.uuid(),
    createdBy: `${user.firstName} ${user.lastName}`,
    relatedUser: user.id,
    user: { ...user },
    dateCreated: faker.date.recent(),
    dateNeeded: faker.date.future(0, new Date()),
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

const mockRequisitions = (shopDrawings, users, opts = { min: 5, max: 25 }) =>
  shopDrawings.reduce((acc, curr) => {
    const numRequisitions = faker.random.number(opts);

    return [...acc, ...populate(mockRequisition)(numRequisitions, users, curr)];
  }, []);

export default mockRequisitions;
