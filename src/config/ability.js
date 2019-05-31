import { AbilityBuilder } from '@casl/ability';

function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }

  return item.__type;
}

const admin = AbilityBuilder.define(can => {
  can('manage', 'all');
});

const cam = AbilityBuilder.define(can => {
  can('read', 'all');
  can('update', 'RequisitionLineItem', { status: 'needsReview' });
});

const defineAbilitesFor = user =>
  AbilityBuilder.define((can, cannot) => {
    if (user.isAdmin()) {
      can('manage', 'all');
    } else {
      can('read', 'all');
    }
  });

export const ABILITIES = { admin, cam };
