import faker from 'faker';
import { populate } from '../helpers';

const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

const mockPhase = (job, shopDrawing) => {
  const phaseLetter = faker.random.arrayElement(alphabet);
  const phaseNumber = faker.random.number({
    min: 1,
    max: 50
  });
  const number = `${phaseLetter}${phaseNumber}`;

  const description = faker.lorem.words(
    faker.random.number({
      min: 1,
      max: 5
    })
  );

  return {
    id: faker.random.uuid(),
    number,
    description,
    phase: `${number} - ${description}`,
    relatedJob: job.id,
    job: {
      ...job
    },
    relatedShopDrawing: shopDrawing.id,
    shopDrawing: {
      ...shopDrawing
    }
  };
};

const populatePhase = populate(mockPhase);

const mockPhases = (
  jobs,
  shopDrawings,
  numPhasesOptions = { min: 5, max: 25 }
) =>
  jobs.reduce((acc, job) => {
    const numPhases = faker.random.number(numPhasesOptions);
    const jobDrawings = shopDrawings.filter(sd => sd.relatedJob === job.id);

    const jobPhases = jobDrawings.reduce((sdPhases, sd) => {
      return [...sdPhases, ...populatePhase(numPhases, job, sd)];
    }, []);

    return [...acc, ...jobPhases];
  }, []);

export default mockPhases;
