import sampleData from "./sampleData";

export const fetchData = (table, id) => {
  console.log("fetchData");
  console.log("sampleData: ", sampleData);
  console.log("table: ", table);
  console.log("id: ", id);

  const data = sampleData[table];

  let returnData = null;

  if (!data) {
    return Promise.reject("data not found");
  }

  if (!id) {
    return Promise.resolve(data);
  }

  const record = data.find(item => item.id === id);

  if (!record) {
    return Promise.reject("record not found");
  }

  return Promise.resolve(record);

  console.log("returnData: ", returnData);
  return returnData;
};

export const fetchLineItemsForReq = id => {
  console.log("fetchLineItemsForReq, id: ", id);
  if (!id) {
    return Promise.reject("No Req Id supplied");
  }

  const lineItems = sampleData["requisitionLineItems"];

  console.log("lineItems: ", lineItems);
  const forReq = lineItems.filter(item => item.requisition === id);

  return Promise.resolve(forReq);
};
