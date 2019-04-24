import faker from "faker";
import { populate } from "../helpers";

const mockShopDrawing = job => {
  const number = faker.random.number({
    min: 1,
    max: 35
  });
  const subject = faker.lorem.words(
    faker.random.number({
      min: 5,
      max: 15
    })
  );

  return {
    id: faker.random.uuid(),
    number,
    subject,
    shopDrawing: `SD.${number} - ${subject}`,
    relatedJob: job.id,
    job: {
      ...job
    }
  };
};

const mockShopDrawings = (jobs, numShopDrawingOptions = { min: 1, max: 25 }) => jobs
  .reduce((acc, curr) => {
    const numShopDrawings = faker.random.number(numShopDrawingOptions)

    return [...acc, ...populate(mockShopDrawing)(numShopDrawings, curr)]
  }, []);

  export default mockShopDrawings
