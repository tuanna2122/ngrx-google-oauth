import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AngularFireAuth } from 'angularfire4/auth';
import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { User } from '../models/user.model';
import * as UserActions from '../actions/user.actions';
export type Action = UserActions.All;

@Injectable()
export class UserEffects {
  constructor(private actions: Actions, private afAuth: AngularFireAuth) {
  }

  @Effect()
  getUser: Observable<Action> = this.actions.ofType(UserActions.GET_USER)
    .map((action: UserActions.GetUser) => action.payload)
    .switchMap(payload => this.afAuth.authState)
    .map(authData => {
      if (authData) {
        const user = new User(authData.uid, authData.displayName);
        return new UserActions.Authenticated(user);
      } else {
        return new UserActions.NotAuthenticated();
      }
    })
    .catch(err => Observable.of(new UserActions.AuthError()));

  @Effect()
  login: Observable<Action> = this.actions.ofType(UserActions.GOOGLE_LOGIN)
    .map((action: UserActions.GoogleLogin) => action.payload)
    .switchMap(payload => {
      return Observable.fromPromise(this.googleLogin());
    })
    .map(credential => {
      return new UserActions.GetUser();
    })
    .catch(err => {
      return Observable.of(new UserActions.AuthError({
        error: err.message
      }));
    });

  @Effect()
  logout: Observable<Action> = this.actions.ofType(UserActions.LOGOUT)
    .map((action: UserActions.Logout) => action.payload)
    .switchMap(payload => {
      return Observable.fromPromise(this.afAuth.auth.signOut());
    })
    .map(authData => {
      return new UserActions.NotAuthenticated();
    })
    .catch(err => {
      return Observable.of(new UserActions.AuthError({
        error: err.message
      }));
    });

  private googleLogin(): firebase.Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
