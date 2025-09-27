// src/app/auth/auth.service.ts
import {inject, Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

const {apiUrl} = environment;

export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  profilePicture?: string;
  username?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  constructor() {
    this.refreshUser();
  }

  /**
   * Synchronous getter for the current user.
   * Returns null if not logged in or before refreshUser completes.
   */
  get currentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
    // return this._user.value;
  }

  /**
   * Fetches the currently logged-in user from the backend.
   * Updates the BehaviorSubject so components can react.
   */
  refreshUser() {
    this.http.get<User>(`${apiUrl}/auth/me`, {
      withCredentials: true
    })
      .subscribe({
        next: res => this._user.next(res),
        error: () => this._user.next(null)
      });
  }

  /**
   * Helper to check if the user is logged in.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
    // return !!this._user.value;
  }

  /**
   * Logout by calling the backend.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // this.http.get(`${apiUrl}/auth/logout`, {
    //   withCredentials: true
    // })
    //   .subscribe({
    //     complete: () => { this._user.next(null); },
    //     error: (error) => { console.error(error); },
    //   });
  }
}
