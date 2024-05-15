import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { DateTime } from 'luxon';
import { TopUpService } from '../topUp.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
    selector: 'app-qr-code',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        NavbarComponent
    ],

    templateUrl: './qrcode.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QRcodeComponent implements OnInit {
    users: any[] = []
    card: any
    time : any
    cardName : any
    form : FormGroup = this._fb.group({
        amount: 100,
        card: '2617800948'
    })
	amountTopup: any
    img_qr: string = 'assets/images/logo/loading_payment.gif';
    
    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService,
        private cdr: ChangeDetectorRef
    ) {
    }
    async ngOnInit(){
        this.amountTopup = this._topup.getTopUp()
        this.form = this._fb.group({
            amount: this.amountTopup,
            card: '2617800948'
        })
        console.log(this.form.value);
        this._topup.create_QR(this.form.value).subscribe((resp : any) => {
            console.log(resp);
            this.img_qr = resp.qrCodeUrl
            console.log(this.img_qr);
            this.cdr.markForCheck();
            //this._topup.check_status(resp.id).subscribe((resp : any) => {
            //    if (resp && resp.status === 'complete') {
            //        console.log('Status is complete:', resp);
            //        this._router.navigate(['/top-up/success'])
            //      } else {
            //        console.log('Polling stopped or timed out.');
            //      }
            //});
        });

		this.card = this._topup.getCardData()
        this.cardName = this.card.name
        console.log(this.amountTopup);

    }

    bg_card(): string{
        const index = this._topup.getSelectIndex()
        if (this.card.role == "student"){
            if (index % 2 == 1)
                return "assets/images/logo/card/bg_CardStudentGray.svg"
            else
                return "assets/images/logo/card/bg_CardStudentRed.svg"
        }
        else if (this.card.role == "business")
            return "assets/images/logo/card/bg_CardBusiness.svg"
        else if (this.card.role == "academic")
            return "assets/images/logo/card/bg_CardAcademic.svg"
        else
            return ""
    }

    text_card(): string{
        if (this.card.role == "student")
            return "assets/images/logo/card/student.svg"
        else if (this.card.role == "business")
            return "assets/images/logo/card/business.svg"
        else if (this.card.role == "academic")
            return "assets/images/logo/card/academic.svg"
        else
            return ""
    }

    clickForUpdateTime(){
        const date = DateTime.local()
        this.card.update = date.toFormat('HH:mm')
        this._topup.setUpdateCard(this.card.update)
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogComponent, {
        disableClose: true,
        width: '118px',
        height: '118px',
      });

      setTimeout(() => {
        dialogRef.close();
      }, 3000);


      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed with result:', result);
        this._router.navigate(['/select'])
      });
    }

    backto(){
		this._router.navigate(['/top-up/promptpay'])
	}
}

