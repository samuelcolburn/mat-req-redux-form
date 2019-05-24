import { CREATE_PHASE, UPDATE_PHASE, REMOVE_PHASE } from '../constants';

export const createPhase = props => {
  return {
    type: CREATE_PHASE,
    payload: props
  };
};

export const updatePhase = (id, props) => ({
  type: UPDATE_PHASE,
  payload: {
    id,
    ...props
  }
});

export const removePhase = id => ({
  type: REMOVE_PHASE,
  payload: {
    id
  }
});
