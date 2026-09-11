import {
  PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG, USER_DETAILS,
  CLEAN_PROFILE
} from "./actionTypes";

const initialState = {
  error: "",
  success: "",
  userDetails: undefined,
  user: {}
};

const profile = (state = initialState, action) => {

  switch (action.type) {
    case EDIT_PROFILE:
      state = { ...state };
      break;
    case PROFILE_SUCCESS:
      state = {
        ...state,
        success: action.payload.status,
        user: action.payload.data
      };
      break;
    case PROFILE_ERROR:
      state = {
        ...state,
        error: action.payload
      };
      break;
    case RESET_PROFILE_FLAG:
      state = {
        ...state,
        success: null
      };
      break;
    case USER_DETAILS:
      state = {
        ...state,
        userDetails: action.payload,
      }
      break;
    case CLEAN_PROFILE:
      state = {
        ...state,
        userDetails: undefined,
      }
      break;
    default:
      return state;
      break;
  }
  return state;
};

export default profile;
