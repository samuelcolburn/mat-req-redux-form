import faker from 'faker';
import { populate } from '../helpers';

const mockJob = () => {
  const number = faker.random.number({
    max: 9999,
    min: 6000
  });
  const name = faker.company.companyName();
  return {
    id: faker.random.uuid(),
    number,
    name,
    job: `${number} - ${name}`
  };
};

const mockJobs = populate(mockJob);

export default mockJobs;
