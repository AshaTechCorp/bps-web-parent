import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    changeDetection: ChangeDetectionStrategy.Default,
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
  fk: string;
  img_qr: string
  bgCard!: string;
  loadsuccess: boolean = false

  constructor(
      public dialog: MatDialog,
      private _fb: FormBuilder,
      private _router: Router,
      private _topup: TopUpService,
      //private cdr: ChangeDetectorRef,
      private activityroute: ActivatedRoute
  ) {
    this.fk = this.decodeBase64(this.activityroute.snapshot.params['fk'])
    this.img_qr  = 'assets/images/logo/loading_payment.gif';

  }
  ngOnInit(){
    this._topup.get_card_by_fk(this.fk).subscribe((resp: any) =>{
      this.card = {
          id: resp.fkId,
          role: resp.role,
          name: resp.name,
          balance: resp.remain,
          update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
      }
      this.bgCard = this.bg_card()
      this.cardName = this.card.name
      this.loadsuccess = true
      this.amountTopup = this._topup.getTopUp()
      this.form = this._fb.group({
          amount: this.amountTopup,
          fkId: this.card.id,
          location: 'WEB'
          //card: this.fkId
          //card: '123123213'
      })
      this._topup.create_QR(this.form.value).subscribe((resp : any) => {
          this.img_qr = resp.qrCodeUrl
          //ปิด dialog
          this._topup.check_status(resp.id).subscribe((resp : any) => {
              if (resp && resp.status === 'SUCCESS') {
                  //console.log('Status is complete:', resp);
                  this._router.navigate(['/top-up/success',this.encodeBase64(this.card.id)])
                } else {
                 // console.log('Polling stopped or timed out.');
                }
          });
      },error =>{
        this._router.navigate(['//top-up/promptpay',this.encodeBase64(this.card.id)])

      });
    })
  }

  decodeBase64(input: string): string {
    return atob(input);
  }

  encodeBase64(input: string): string {
    return btoa(input);
  }

  bg_card(): string{
    return this._topup.get_bg_card(this.card.role)
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
      //console.log('The dialog was closed with result:', result);
      this._router.navigate(['/select'])
    });
  }

  backto(){
    if (this.card?.id)
      this._router.navigate(['/top-up/promptpay',this.encodeBase64(this.card.id)])
  }
}

