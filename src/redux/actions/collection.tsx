import * as t from '../../constant/initialType';

export const clearCollection = () => async (dispatch: any) => {
    dispatch({type: t.CLEAR_COLLECTION, payload: false, multiple: {type: t.CLEAR_COLLECTION}});
}

export const loadCollection = (dt: any) => async (dispatch: any) => {
    dispatch({type: t.LOAD_COLLECTION, payload: dt});
}