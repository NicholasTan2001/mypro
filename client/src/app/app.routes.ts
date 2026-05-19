import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Home } from './pages/home/home';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'about', component: About },
    { path: 'home', component: Home }
];
