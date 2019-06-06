import {
  CREATE_USER,
  UPDATE_USER,
  REMOVE_USER,
  SET_CURRENT_USER
} from '../constants';
import { getRandomData } from '../data/api';
import { delay } from '../helpers';

export const createUser = props => ({
  type: CREATE_USER,
  payload: props
});

export const updateUser = (id, props) => ({
  type: UPDATE_USER,
  payload: {
    id,
    ...props
  }
});

export const removeUser = id => ({
  type: REMOVE_USER,
  payload: {
    id
  }
});

const setCurrentUser = props => ({
  type: SET_CURRENT_USER,
  payload: props
});

export const fetchCurrentUser = () => (dispatch, getState) => {
  delay(500)
    .then(r => getRandomData({ table: 'users' }))
    .then(
      user => {
        console.log('current user: ', user);
        dispatch(createUser(user));
        dispatch(setCurrentUser(user));
      },
      error => {
        console.log('error getting current user');
        console.error(error);
      }
    );
};
