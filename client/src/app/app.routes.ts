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
import { Verify } from './pages/verify/verify';
import { Admin } from './pages/admin/admin';

import { AuthGuardService, PublicGuardService } from './services/auth.guard';
import { VerifyGuard } from './services/verify.guard';
import { AdminGuard } from './services/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'about', component: About },
    { path: 'home', component: Home },
    { path: 'login', component: Login, canActivate: [PublicGuardService] },
    { path: 'register', component: Register, canActivate: [PublicGuardService] },
    {
        path: 'myprofile',
        component: Myprofile,
        canActivate: [AuthGuardService, VerifyGuard]
    },
    {
        path: 'setting',
        component: Setting,
        canActivate: [AuthGuardService, VerifyGuard]
    },
    {
        path: 'search',
        component: Search,
        canActivate: [AuthGuardService, VerifyGuard]
    },
    {
        path: 'friend',
        component: Friend,
        canActivate: [AuthGuardService, VerifyGuard]
    },
    {
        path: 'verify',
        component: Verify,
        canActivate: [AuthGuardService]
    },
    {
        path: 'admin',
        component: Admin,
        canActivate: [AuthGuardService, VerifyGuard, AdminGuard]
    },
    { path: 'user/:id', component: UserDetails, canActivate: [AuthGuardService, VerifyGuard] },

    { path: '**', redirectTo: 'login' },
];
