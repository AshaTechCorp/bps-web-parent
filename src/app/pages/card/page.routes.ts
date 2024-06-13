import { Routes } from '@angular/router';
import { CardComponent } from './page.component';

export default [
    {
        path     : ':fk',
        component: CardComponent,
    },
] as Routes;
