import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Myprofile } from './pages/myprofile/myprofile'
import { Setting } from './pages/setting/setting';

import { AuthGuardService } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'about', component: About },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'myprofile',
        component: Myprofile,
        canActivate: [AuthGuardService]
    },
    {
        path: 'setting',
        component: Setting,
        canActivate: [AuthGuardService]
    },

    { path: '**', redirectTo: 'login' },
];
