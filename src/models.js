import { fk, many, attr, Model } from 'redux-orm';

export class User extends Model {
  toString() {
    return `User: [${this.id}, ${this.email}, ${this.firstName} ${
      this.lastName
    }]`;
  }
}
User.modelName = 'User';
User.fields = {
  id: attr(),
  firstName: attr(),
  lastName: attr(),
  email: attr()
};

export class Job extends Model {
  toString() {
    return `Job: ${this.number} - ${this.name}`;
  }
}
Job.modelName = 'Job';

Job.fields = {
  id: attr(),
  number: attr(),
  name: attr()
};

export class ShopDrawing extends Model {
  toString() {
    return `Shop Drawing: ${this.number} - ${this.name}`;
  }
}
ShopDrawing.modelName = 'ShopDrawing';

ShopDrawing.fields = {
  id: attr(),
  number: attr(),
  subject: attr(),
  relatedJob: fk({
    to: 'Job',
    as: 'job',
    relatedName: 'shopDrawings'
  }),
  phases: many('Phase', 'shopDrawings')
};

export class Phase extends Model {
  toString() {
    return `Phase: ${this.phase}`;
  }
}
Phase.modelName = 'Phase';

Phase.fields = {
  id: attr(),
  phase: attr(),
  relatedJob: fk({
    to: 'Job',
    as: 'job',
    relatedName: 'phases'
  })
};

export class Requisition extends Model {
  toString() {
    return `Requisition: ${this.id}`;
  }
}
Requisition.modelName = 'Requisition';

Requisition.fields = {
  id: attr(),
  createdBy: attr(),
  dateCreated: attr(),
  dateNeeded: attr(),
  number: attr(),
  subject: attr(),
  relatedUser: fk({
    to: 'User',
    as: 'user',
    relatedName: 'requisitions'
  }),
  relatedJob: fk({
    to: 'Job',
    as: 'job',
    relatedName: 'requisitions'
  }),
  relatedShopDrawing: fk({
    to: 'ShopDrawing',
    as: 'shopDrawing',
    relatedName: 'requisitions'
  })
};

export class Vendor extends Model {
  toString() {
    return `Vendor: ${this.id}`;
  }
}
Vendor.modelName = 'Vendor';

Vendor.fields = {
  id: attr(),
  name: attr(),
  phoneNumber: attr(),
  website: attr()
};

export class ItemType extends Model {
  toString() {
    return `ItemType: ${this.id}`;
  }
}
ItemType.modelName = 'ItemType';

ItemType.fields = {
  id: attr(),
  name: attr(),
  fullName: attr()
};

export class InventoryItem extends Model {
  toString() {
    return `InventoryItem: ${this.id}`;
  }
}
InventoryItem.modelName = 'InventoryItem';

InventoryItem.fields = {
  id: attr(),
  computerEaseNumber: attr(),
  name: attr(),
  relatedItemType: fk({
    to: 'ItemType',
    as: 'itemType',
    relatedName: 'inventoryItems'
  })
};

export class RequisitionLineItem extends Model {
  toString() {
    return `Requisition Line Item: ${this.id}`;
  }
}
RequisitionLineItem.modelName = 'RequisitionLineItem';

RequisitionLineItem.fields = {
  id: attr(),
  status: attr(),
  description: attr(),
  startingInventory: attr(),
  quantityRequested: attr(),
  quantityOrdered: attr(),
  quantityNeeded: attr(),
  estimatedCost: attr(),
  currentCost: attr(),
  relatedPhase: fk({
    to: 'Phase',
    as: 'phase',
    relatedName: 'requisitionLineItems'
  }),
  relatedRequisition: fk({
    to: 'Requisition',
    as: 'requisition',
    relatedName: 'requisitionLineItems'
  }),
  relatedVendor: fk({
    to: 'Vendor',
    as: 'vendor',
    relatedName: 'requisitionLineItems'
  }),
  relatedItemType: fk({
    to: 'ItemType',
    as: 'itemType',
    relatedName: 'requisitionLineItems'
  }),
  relatedInventoryItem: fk({
    to: 'InventoryItem',
    as: 'inventoryItem',
    relatedName: 'requisitionLineItems'
  })
};

export class Note extends Model {
  toString() {
    return `Requisition Line Item: ${this.id}`;
  }
}

Note.modelName = 'Note';

Note.fields = {
  id: attr(),
  user: attr(),
  userName: attr(),
  dateCreated: attr(),
  note: attr(),
  readBy: attr(),
  relatedUser: fk({
    to: 'User',
    as: 'user',
    relatedName: 'notes'
  }),
  relatedRequisitionLineItem: fk({
    to: 'RequisitionLineItem',
    as: 'requisitionLineItem',
    relatedName: 'notes'
  })
};

export class Attachment extends Model {
  toString() {
    return `Attachment: ${this.id}`;
  }
}

Attachment.modelName = 'Attachment';

Attachment.fields = {
  id: attr(),
  name: attr(),
  file: attr(),
  mimeType: attr(),
  fileType: attr(),
  dateCreated: attr(),
  relatedUser: fk({
    to: 'User',
    as: 'user',
    relatedName: 'attachments'
  }),
  relatedRequisition: fk({
    to: 'Requisition',
    as: 'requisition',
    relatedName: 'attachments'
  })
};
