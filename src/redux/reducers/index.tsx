import { combineReducers } from 'redux';

import post from './post';
import anime from './anime';
import collection from './collection';

const rootReducer = combineReducers({
    post, anime, collection
})

export default rootReducer;