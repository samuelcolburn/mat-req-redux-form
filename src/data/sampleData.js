import mockJobs from './jobs';
import mockShopDrawings from './shopDrawings';
import mockPhases from './phases';
import mockRequisitions from './requisitions';
import mockRequisitionLineItems from './requisitionLineItems';
import mockVendors from './vendors';
import mockItemTypes from './itemTypes';
import mockInventoryItems from './inventoryItems';
import mockNotes from './notes';
import mockAttachments from './attachments';
import mockUsers from './users';

const makeSampleData = () => {
  const vendors = mockVendors(100);
  const itemTypes = mockItemTypes(20);
  const inventoryItems = mockInventoryItems(itemTypes);
  const users = mockUsers(100);

  const jobs = mockJobs(10);
  const shopDrawings = mockShopDrawings(jobs, { min: 2, max: 5 });
  const phases = mockPhases(jobs, shopDrawings, { min: 2, max: 5 });
  const requisitions = mockRequisitions(shopDrawings, users, {
    min: 2,
    max: 5
  });
  const requisitionLineItems = mockRequisitionLineItems(
    requisitions,
    vendors,
    phases,
    itemTypes,
    inventoryItems,
    { min: 4, max: 10 }
  );
  const notes = mockNotes(requisitionLineItems, users);
  const attachments = mockAttachments(requisitions, users);

  const sampleData = {
    jobs,
    shopDrawings,
    phases,
    requisitions,
    requisitionLineItems,
    vendors,
    itemTypes,
    inventoryItems,
    notes,
    attachments,
    users
  };
  console.log('sampleData: ', sampleData);

  return sampleData;
};

const sampleData = makeSampleData();

export default sampleData;
