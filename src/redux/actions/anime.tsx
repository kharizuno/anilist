import * as t from '../../constant/initialType';

export const clearAnime = () => async (dispatch: any) => {
    dispatch({type: t.CLEAR_ANIME, payload: false, multiple: {type: t.CLEAR_ANIME}});
}

export const loadAnime = (dt: any) => async (dispatch: any) => {
    dispatch({type: t.LOAD_ANIME, payload: dt});
}