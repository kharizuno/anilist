import * as t from '../../constant/initialType';

interface Data {
    animeList: any
}

let data: Data = {
    animeList: false
}

const animeReducer = (state = data, action: any) => {
    switch(action.type) {
        case t.CLEAR_ANIME:
            state = {
                ...state,
                animeList: (!action.payload) ? false : state.animeList
            }
            break;
        case t.LOAD_ANIME:
            state = {
                ...state,
                animeList: action.payload
            }
            break;
        default:
    }

    return state;
}

export default animeReducer;