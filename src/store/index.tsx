import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import rootReducer from '../redux/reducers';

const initialState = {};
const enhancers: any = [];
const middleware = [thunk, promise];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);
export const store = createStore(rootReducer, /*window.__initialData__,*/initialState,  composedEnhancers);