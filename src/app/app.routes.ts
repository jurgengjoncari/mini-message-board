import { Routes } from '@angular/router';
import { Chat } from './chat/chat';

export const routes: Routes = [
  {path: '', component: Chat},
  {path: 'login', loadComponent: () => import('./auth/auth').then(({Auth}) => Auth), data: {mode: 'login'}},
  {path: 'signup', loadComponent: () => import('./auth/auth').then(({Auth}) => Auth), data: {mode: 'signup'}}
];
