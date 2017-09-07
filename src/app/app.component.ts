import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { User } from './models/user.model';
import * as UserActions from './actions/user.actions';

interface AppState {
  user: User;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user$: Observable<User>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.user$ = this.store.select('user');

    this.store.dispatch(new UserActions.GetUser());
  }

  googleLogin() {
    this.store.dispatch(new UserActions.GoogleLogin());
  }

  logout() {
    this.store.dispatch(new UserActions.Logout());
  }
}
