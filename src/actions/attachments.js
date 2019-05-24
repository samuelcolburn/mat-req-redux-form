import {
  CREATE_MANY_ATTACHMENTS,
  CREATE_ATTACHMENT,
  UPDATE_ATTACHMENT,
  REMOVE_ATTACHMENT
} from '../constants';

import { getAttachmentsForReq } from '../data/api';

export const createManyAttachments = props => ({
  type: CREATE_MANY_ATTACHMENTS,
  payload: props
});

export const createAttachment = props => ({
  type: CREATE_ATTACHMENT,
  payload: props
});

export const updateAttachment = (id, props) => ({
  type: UPDATE_ATTACHMENT,
  payload: {
    id,
    ...props
  }
});

export const removeAttachment = id => ({
  type: REMOVE_ATTACHMENT,
  payload: {
    id
  }
});

export const fetchAttachmentsForReq = id => (dispatch, getState) =>
  getAttachmentsForReq({ id });
