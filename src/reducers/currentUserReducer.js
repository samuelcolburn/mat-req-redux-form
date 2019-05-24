import { SET_CURRENT_USER } from '../constants';

const currentUserReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENT_USER:
      return payload;
    default:
      return state;
  }
};

export default currentUserReducer;
