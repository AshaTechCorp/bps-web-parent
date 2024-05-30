import { Routes } from '@angular/router';
import { TopUpComponent } from './topUp.component';
import { PromptpayComponent } from './promptpay/promptpay.component';
import { QRcodeComponent } from './qr-code/qrcode.component';
import { PromptpaySuccessComponent } from './success/success.component';
import { CreditdebitTopupComponent } from './dialog-credit-debit/credit-debit/creditdebit-topup.component';

export default [
    {
        path     : ':sn',
        component: TopUpComponent,
    },
    {
        path     : 'promptpay/:sn',
        component: PromptpayComponent,
    },
    {
        path     : 'qr-code/:sn',
        component: QRcodeComponent,
    },
    {
        path     : 'success/:sn',
        component: PromptpaySuccessComponent,
    },
    {
        path     : 'credit-debit/:sn',
        component: CreditdebitTopupComponent,
    },
] as Routes;
