// src/app/auth/auth.service.ts
import {Injectable} from '@angular/core';

// const {apiUrl} = environment;

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
  // private http = inject(HttpClient);
  // private _user = new BehaviorSubject<User | null>(null);
  // user$ = this._user.asObservable();

  constructor() {
    // this.refreshUser();
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

  get token() {
    return localStorage.getItem('token');
  }

  /**
   * Fetches the currently logged-in user from the backend.
   * Updates the BehaviorSubject so components can react.
   */
  // refreshUser() {
  //   this.http.get<User>(`${apiUrl}/auth/me`, {
  //     withCredentials: true
  //   })
  //     .subscribe({
  //       next: res => this._user.next(res),
  //       error: () => this._user.next(null)
  //     });
  // }

  /**
   * Helper to check if the user is logged in.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
    // return !!this._user.value;
  }

  login(user: User, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
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
