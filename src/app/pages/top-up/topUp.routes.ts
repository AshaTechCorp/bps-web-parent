import { Routes } from '@angular/router';
import { TopUpComponent } from './topUp.component';
import { PromptpayComponent } from './promptpay/promptpay.component';
import { QRcodeComponent } from './qr-code/qrcode.component';
import { PromptpaySuccessComponent } from './success/success.component';
import { CreditdebitTopupComponent } from './dialog-credit-debit/credit-debit/creditdebit-topup.component';

export default [
    {
        path     : 'promptpay/:fk',
        component: PromptpayComponent,
    },
    {
        path     : 'qr-code/:fk',
        component: QRcodeComponent,
    },
    {
        path     : 'success/:fk',
        component: PromptpaySuccessComponent,
        pathMatch: 'full'
    },
    {
        path     : 'complete',
        component: PromptpaySuccessComponent,
    },
    {
        path     : 'credit-debit/:fk/:card',
        component: CreditdebitTopupComponent,
    },
    {
        path     : ':fk',
        component: TopUpComponent,
    },
] as Routes;
