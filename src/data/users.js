import faker from 'faker';
import { populate } from '../helpers';

const mockUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@walterafurman.com`;

  return {
    id: faker.random.uuid(),
    firstName,
    lastName,
    email
  };
};

const mockUsers = populate(mockUser);

export default mockUsers;
