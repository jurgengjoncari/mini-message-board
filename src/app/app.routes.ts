import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Chat } from './chat/chat';

export const routes: Routes = [
  {path: '', component: Chat},
  {path: 'login', component: Auth, data: {mode: 'login'}},
  {path: 'signup', component: Auth, data: {mode: 'signup'}}
];
