export const makeLineItem = id => ({
  id,
  selected: false,
  status: "Needs Review",
  phase: "",
  vendor: "",
  type: "",
  description: "",
  inventoryItem: "",
  startingInventory: "",
  quantityRequested: "",
  quantityOrdered: "",
  quantityNeeded: "",
  estimatedCost: "",
  currentCost: ""
});
