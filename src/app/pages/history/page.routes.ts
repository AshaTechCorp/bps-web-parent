import { Routes } from '@angular/router';
import { HistoryComponent } from './page.component';

export default [
    {
        path     : ':fk',
        component: HistoryComponent,
    },
] as Routes;
