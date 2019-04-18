import faker from "faker";

const values = obj => Object.values(obj);

const delay = ms => new Promise(_ => setTimeout(_, ms));

const mockJob = () => ({
  id: faker.random.uuid(),
  number: faker.random.number({
    max: 9999,
    min: 6000
  }),
  name: faker.company.companyName()
});

const mockJobs = (qty = 100) => {
  let jobs = [];

  for (let i = 0; i < qty; i++) {
    const job = mockJob();
    jobs.push(job);
  }

  return jobs;
};
const jobs = mockJobs();

const mockShopDrawing = job => ({
  id: faker.random.uuid(),
  number: faker.random.number({
    min: 1,
    max: 35
  }),
  subject: faker.lorem.words(
    faker.random.number({
      min: 5,
      max: 15
    })
  ),
  job: job.id
});

const mockShopDrawings = (qtyPerJob = 10) =>
  jobs.reduce((acc, curr) => {
    const shopDrawings = [];

    for (let i = 0; i < qtyPerJob; i++) {
      const shopDrawing = mockShopDrawing(curr);
      shopDrawings.push(shopDrawing);
    }

    return [...acc, ...shopDrawings];
  }, []);

const shopDrawings = mockShopDrawings();

export const getJobs = async () => {
  console.log("gettings jobs...");
  await delay(500);

  console.log("returning jobs: ", jobs);

  return jobs;
};

export const getShopDrawings = async () => {
  console.log("gettings shopDrawings...");
  await delay(500);

  console.log("returning shopDrawings: ", shopDrawings);

  return shopDrawings;
};

const sampleData = {
  jobs,
  shopDrawings
};

const hasAllRelations = (params, data) =>
  params.related
    ? params.related.every(relation => data[relation.key] === relation.value)
    : true;

export const doQuery = async ({ table, params }) => {
  await delay(500);
  const query = params.q.trim().toLowerCase();

  console.log("sampleData: ", sampleData);
  console.log('table" ', table);

  return sampleData[table].filter(data => {
    return (
      hasAllRelations(params, data) &&
      JSON.stringify(values(data))
        .toLowerCase()
        .includes(query)
    );
  });
};
