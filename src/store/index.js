import { createStore, compose, applyMiddleware } from 'redux';
import mainReducers from '../reducers';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialStore = {
  loggedIn: false,
  user: null,
};

export default function configureStore() {
  return createStore(
    mainReducers,
    initialStore,
    composeEnhancers(applyMiddleware(thunk))
  );
}
