import { User } from '../models/user.model';
import * as UserActions from '../actions/user.actions';

export type Action = UserActions.All;

const defaultUser = new User(null, 'GUEST');

export function userReducer(state: User = defaultUser, action: Action) {
  switch (action.type) {
    case UserActions.GET_USER:

      return {
        ...state,
        loading: true
      };

    case UserActions.AUTHENTICATED:

      return {
        ...state,
        ...action.payload,
        loading: false
      };

    case UserActions.NOT_AUTHENTICATED:

      return {
        ...state,
        ...defaultUser,
        loading: false
      };

    case UserActions.GOOGLE_LOGIN:

      return {
        ...state,
        loading: true
      };

    case UserActions.LOGOUT:

      return {
        ...state,
        loading: true
      };

    case UserActions.AUTH_ERROR:

      return {
        ...state,
        ...action.payload,
        loading: false
      };

    default:

      return defaultUser;
  }
}
