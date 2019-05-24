import { CREATE_JOB, UPDATE_JOB, REMOVE_JOB } from '../constants';

export const createJob = props => ({
  type: CREATE_JOB,
  payload: props
});

export const updateJob = (id, props) => ({
  type: UPDATE_JOB,
  payload: {
    id,
    ...props
  }
});

export const removeJob = id => ({
  type: REMOVE_JOB,
  payload: {
    id
  }
});
