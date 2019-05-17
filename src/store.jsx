import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';

const composedEnhancer = composeWithDevTools({
  trace: true,
  maxAge: 100
});

export default function configureStore(preloadedState) {
  const middlewares = [thunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const storeEnhancers = [middlewareEnhancer];

  const store = createStore(
    rootReducer,
    preloadedState,
    composedEnhancer(...storeEnhancers)
  );

  return store;
}
