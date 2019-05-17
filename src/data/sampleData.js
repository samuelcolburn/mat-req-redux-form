import mockJobs from './jobs';
import mockShopDrawings from './shopDrawings';
import mockPhases from './phases';
import mockRequisitions from './requisitions';
import mockRequisitionLineItems from './requisitionLineItems';
import mockVendors from './vendors';
import mockItemTypes from './itemTypes';
import mockInventoryItems from './inventoryItems';

const makeSampleData = () => {
  const vendors = mockVendors(100);
  const itemTypes = mockItemTypes(20);
  const inventoryItems = mockInventoryItems(itemTypes);

  const jobs = mockJobs(10);
  const shopDrawings = mockShopDrawings(jobs, { min: 2, max: 5 });
  const phases = mockPhases(jobs, shopDrawings, { min: 2, max: 5 });
  const requisitions = mockRequisitions(shopDrawings, { min: 2, max: 5 });
  const requisitionLineItems = mockRequisitionLineItems(
    requisitions,
    vendors,
    phases,
    itemTypes,
    inventoryItems,
    { min: 4, max: 10 }
  );

  const sampleData = {
    jobs,
    shopDrawings,
    phases,
    requisitions,
    requisitionLineItems,
    vendors,
    itemTypes,
    inventoryItems
  };
  console.log('sampleData: ', sampleData);

  return sampleData;
};

const sampleData = makeSampleData();

export default sampleData;
