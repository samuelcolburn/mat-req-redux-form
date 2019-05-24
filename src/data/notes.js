import faker from 'faker';
import { populate } from '../helpers';

const mockNote = requisitionLineItem => ({
  id: faker.random.uuid(),
  user: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  dateCreated: faker.date.recent(),
  note: faker.lorem.text(),
  readBy: '',
  relatedRequisitionLineItem: requisitionLineItem.id,
  readBy: '',
  requisitionLineItem: { ...requisitionLineItem }
});

const mockNotes = (
  requisitionLineItems,
  numNotesOptions = { min: 0, max: 2 }
) =>
  requisitionLineItems.reduce((acc, curr) => {
    const numNotes = faker.random.number(numNotesOptions);

    return [...acc, ...populate(mockNote)(numNotes, curr)];
  }, []);

export default mockNotes;
