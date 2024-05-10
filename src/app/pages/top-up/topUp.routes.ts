import { Routes } from '@angular/router';
import { TopUpComponent } from './topUp.component';
import { PromptpayComponent } from './promptpay/promptpay.component';
import { QRcodeComponent } from './qr-code/qrcode.component';
import { PromptpaySuccessComponent } from './success/success.component';
import { CreditdebitTopupComponent } from './dialog-credit-debit/credit-debit/creditdebit-topup.component';

export default [
    {
        path     : '',
        component: TopUpComponent,
    },
    {
        path     : 'promptpay',
        component: PromptpayComponent,
    },
    {
        path     : 'qr-code',
        component: QRcodeComponent,
    },
    {
        path     : 'success',
        component: PromptpaySuccessComponent,
    },
    {
        path     : 'credit-debit',
        component: CreditdebitTopupComponent,
    },
] as Routes;
