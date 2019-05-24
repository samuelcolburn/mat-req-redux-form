import faker from 'faker';
import { populate } from '../helpers';

const mockNote = (users, requisitionLineItem) => {
  const user = users[faker.random.number({ min: 0, max: users.length - 1 })];

  return {
    id: faker.random.uuid(),
    relatedUser: user.id,
    user: { ...user },
    dateCreated: faker.date.recent(),
    note: faker.lorem.text(),
    readBy: '',
    relatedRequisitionLineItem: requisitionLineItem.id,
    requisitionLineItem: { ...requisitionLineItem }
  };
};

const mockNotes = (
  requisitionLineItems,
  users,
  numNotesOptions = { min: 0, max: 2 }
) =>
  requisitionLineItems.reduce((acc, curr) => {
    const numNotes = faker.random.number(numNotesOptions);

    return [...acc, ...populate(mockNote)(numNotes, users, curr)];
  }, []);

export default mockNotes;
