import { Routes } from '@angular/router';
import { CardComponent } from './page.component';

export default [
    {
        path     : ':sn',
        component: CardComponent,
    },
] as Routes;
