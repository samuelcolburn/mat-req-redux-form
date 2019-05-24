import faker from 'faker';
import { populate } from '../helpers';

const mockAttachment = (users, requisition) => {
  const user = users[faker.random.number({ min: 0, max: users.length - 1 })];

  return {
    id: faker.random.uuid(),
    name: faker.system.commonFileName(),
    file: faker.random.image(),
    mimeType: faker.system.mimeType(),
    fileType: faker.system.commonFileType(),
    dateCreated: faker.date.recent(),
    relatedUser: user.id,
    user: { ...user },
    relatedRequisition: requisition.id //,
    // requisition: { ...requisition }
  };
};

const mockAttachments = (requisitions, users, opts = { min: 0, max: 3 }) =>
  requisitions.reduce((acc, curr) => {
    const count = faker.random.number(opts);

    return [...acc, ...populate(mockAttachment)(count, users, curr)];
  }, []);

export default mockAttachments;
