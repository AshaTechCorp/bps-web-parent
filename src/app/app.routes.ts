import { Routes } from '@angular/router';
import { FailedComponent } from './failed/failed.component';
import { HomeComponent } from './home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { CardComponent } from './pages/card/page.component';
import { SelectCardComponent } from './pages/select-card/selectCard.component';
import { HistoryComponent } from './pages/history/page.component';
import { TopUpComponent } from './pages/top-up/topUp.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        // canActivate: [MsalGuard]
    },
    {
        path: 'login-failed',
        component: FailedComponent
    },
    {
      path: '',
      canActivate: [MsalGuard],
      canActivateChild: [MsalGuard],
      children: [
        { path: 'card', loadChildren: () => import('./pages/card/page.routes') },
        { path: 'select', loadChildren: () => import('./pages/select-card/selectCard.routes') },
        { path: 'top-up', loadChildren: () => import('./pages/top-up/topUp.routes') },
        { path: 'history', loadChildren: () => import('./pages/history/page.routes') },
      ]
    }
];
