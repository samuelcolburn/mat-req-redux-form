import faker from 'faker';

import { populate } from '../helpers';

const mockVendor = () => ({
  id: faker.random.uuid(),
  name: faker.company.companyName(),
  phoneNumber: faker.phone.phoneNumber(),
  website: faker.internet.url()
});

const mockVendors = populate(mockVendor);

export default mockVendors;
