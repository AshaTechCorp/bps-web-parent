import { Routes } from '@angular/router';
import { HistoryComponent } from './page.component';

export default [
    {
        path     : ':sn',
        component: HistoryComponent,
    },
] as Routes;
