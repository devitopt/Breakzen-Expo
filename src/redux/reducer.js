// import remove from 'lodash.remove';

import { ADD_INFO, SET_USER } from './actiontypes';

const initialState = {};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case ADD_INFO:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}

export default reducer;
