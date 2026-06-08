import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Myprofile } from './pages/myprofile/myprofile'
import { Setting } from './pages/setting/setting';
import { Search } from './pages/search/search';
import { UserDetails } from './pages/userdetails/userdetails';
import { Friend } from './pages/friend/friend';

import { AuthGuardService, PublicGuardService } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'about', component: About },
    { path: 'home', component: Home },
    { path: 'login', component: Login, canActivate: [PublicGuardService] },
    { path: 'register', component: Register, canActivate: [PublicGuardService] },
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
    {
        path: 'search',
        component: Search,
        canActivate: [AuthGuardService]
    },
    {
        path: 'friend',
        component: Friend,
        canActivate: [AuthGuardService]
    },
    { path: 'user/:id', component: UserDetails, canActivate: [AuthGuardService] },

    { path: '**', redirectTo: 'login' },
];
