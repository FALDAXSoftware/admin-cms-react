import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
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

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  persistedState,
  compose(applyMiddleware(...middlewares))
);

store.subscribe(() => {
  saveState(store.getState())
})

sagaMiddleware.run(rootSaga);
export { store, history };
