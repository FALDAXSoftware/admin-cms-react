import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
// import { routerReducer } from 'react-router-redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducers from '../redux/reducers';
import rootSaga from '../redux/sagas';
import { loadState, saveState } from './localstorage';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];
const persistedState = loadState();
// const createRootReducer = (history) => combineReducers({
//   router: connectRouter(history),
//   ... // rest of your reducers
// })
const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  ...reducers
})
// delete initial router property
if (persistedState) {
  delete persistedState.router
}

const store = createStore(
  rootReducer(history),
  persistedState,
  compose(applyMiddleware(...middlewares))
);

store.subscribe(() => {
  saveState(store.getState())
})

sagaMiddleware.run(rootSaga);
export { store, history };
