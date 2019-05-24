import {
  CREATE_SHOP_DRAWING,
  UPDATE_SHOP_DRAWING,
  REMOVE_SHOP_DRAWING
} from '../constants';

export const createShopDrawing = props => ({
  type: CREATE_SHOP_DRAWING,
  payload: props
});

export const updateShopDrawing = (id, props) => ({
  type: UPDATE_SHOP_DRAWING,
  payload: {
    id,
    ...props
  }
});

export const removeShopDrawing = id => ({
  type: REMOVE_SHOP_DRAWING,
  payload: {
    id
  }
});
