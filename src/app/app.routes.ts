import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {Verify} from './components/verify/verify';
import {Home} from './components/home/home';
import {ThreadList} from './components/thread-list/thread-list';
import {ThreadCreate} from './components/thread-create/thread-create';

export const routes: Routes = [

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  { path: 'verify', component: Verify },

  { path: '', component: Home },

  { path: 'category/:categoryId', component: ThreadList },

  { path: 'category/:categoryId/new', component: ThreadCreate }

];
