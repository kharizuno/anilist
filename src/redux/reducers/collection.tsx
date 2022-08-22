import * as t from '../../constant/initialType';

interface Data {
    collectionList: any
}

let data: Data = {
    collectionList: false
}

const collectionReducer = (state = data, action: any) => {
    switch(action.type) {
        case t.CLEAR_COLLECTION:
            state = {
                ...state,
                collectionList: (!action.payload) ? false : state.collectionList
            }
            break;
        case t.LOAD_COLLECTION:
            state = {
                ...state,
                collectionList: action.payload
            }
            break;
        default:
    }

    return state;
}

export default collectionReducer;