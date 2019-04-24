import faker from "faker";
import random from 'lodash/random'
import { populate } from "../helpers";

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const mockPhase = (job, shopDrawings) => {
  const letter = faker.random.arrayElement(alphabet)
  const number = faker.random.number({
    min: 1,
    max: 50
  })

  const phase = faker.lorem.words(
    faker.random.number({
      min: 1,
      max: 5
    })
  );

  const shopDrawingIndex = random(0, shopDrawings.length - 1)
  const sd = shopDrawings[shopDrawingIndex]

  return {
    id: faker.random.uuid(),
    number: `${letter}${number}`,
    phase,
    relatedJob: job.id,
    job: {
      ...job
    },
    relatedShopDrawing: sd.id,
    shopDrawing: {
      ...sd
    }
  };
};

const mockPhases = (jobs, shopDrawings, numPhasesOptions = { min: 5, max: 25 }) =>
  jobs.reduce((acc, curr) => {
    const numPhases = faker.random.number(numPhasesOptions)
    const sds = shopDrawings.filter(sd => sd.relatedJob === curr.id)

    return [...acc, ...populate(mockPhase)(numPhases, curr, sds)]
  }, []);

export default mockPhases
