import * as ls from '../../localStorage';

const savedProfile = ls.get('setting.profile');
const defaultState = {
  membershipType: savedProfile && savedProfile.membershipType,
  membershipId: savedProfile && savedProfile.membershipId,
  characterId: savedProfile && savedProfile.characterId,
  data: false,
  prevData: false,
  loading: false,
  error: false
};

export default function profileReducer(state = defaultState, action) {
  switch (action.type) {
    case 'PROFILE_CHARACTER_SELECT':
      return {
        ...state,
        characterId: action.payload
      };
    case 'PROFILE_LOADING_NEW_MEMBERSHIP':
      const reset = action.payload.membershipId !== state.membershipId || action.payload.membershipType !== state.membershipType;
      return {
        ...state,
        membershipId: action.payload.membershipId,
        membershipType: action.payload.membershipType,
        data: reset ? false : state.data,
        characterId: reset ? false : state.characterId,
        error: false,
        loading: true
      };
    case 'PROFILE_LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'PROFILE_LOADED':
      if (state.prevData !== action.payload) {
        action.payload.updated = new Date().getTime();
      }
      return {
        ...state,
        data: action.payload,
        prevData: state.data,
        loading: false,
        error: false
      };
    default:
      return state;
  }
}
