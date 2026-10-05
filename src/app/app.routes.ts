import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {Verify} from './components/verify/verify';
import {Home} from './components/home/home';
import {ThreadList} from './components/thread-list/thread-list';
import {ThreadCreate} from './components/thread-create/thread-create';
import {ThreadDetail} from './components/thread-detail/thread-detail';
import {AdminPanel} from './components/admin-panel/admin-panel';
import {adminGuard} from './guards/admin-guard';
import {CategoryRedirect} from './components/category-redirect/category-redirect';
import {UserPanel} from './components/user-panel/user-panel';
import {authGuard} from './guards/auth-guard';
import {ForgotPassword} from './components/forgot-password/forgot-password';

export const routes: Routes = [

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  { path: 'verify', component: Verify },

  { path: '', component: Home },

  { path: 'category/:categoryId', component: ThreadList },

  { path: 'category/:categoryId/new', component: ThreadCreate },

  { path: 'thread/:threadId', component: ThreadDetail },

  { path: 'admin-panel', component: AdminPanel, canActivate: [adminGuard] },

  { path: 'rules', component: CategoryRedirect, data: {categoryName: 'rules'} },

  { path: 'announcements', component: CategoryRedirect, data: {categoryName: 'announcements'} },

  { path: 'user-panel', component: UserPanel, canActivate: [authGuard] },

  { path: 'forgot-password', component: ForgotPassword }

];
