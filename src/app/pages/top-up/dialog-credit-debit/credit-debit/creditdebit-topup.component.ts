import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ElementRef, Renderer2, ViewChild, AfterViewInit, NgZone, inject, Inject, AfterViewChecked } from '@angular/core';
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
import { TopUpService } from '../../topUp.service';
import { CreditDebitDialog } from '../creditdebit.component';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-credit-debit',
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

    templateUrl: './creditdebit-topup.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CreditdebitTopupComponent implements OnInit, AfterViewInit{
    //htmlStr: string = `<script type="text/typescript"
    //                        src="https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js"
    //                        data-apikey="pkey_prod_9929s93IlIbSmViDgW4eqjcqlnbT3JOWVrXB"
    //                        data-amount="100.00"
    //                        data-currency="THB"
    //                        data-payment-methods="card"
    //                        data-name="BANGKOK PATANA SCHOOL"
    //                        data-mid="401012208444001">
    //                    </script>`
    //@ViewChild('formElement') formElement!: ElementRef;
    //private renderer: Renderer2 = inject(Renderer2);
    form: FormGroup;
    users: any[] = []
	card: any
    time : any
    currentColor: string[] = ['bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent'];
    currentTextColor: string[] = ['text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]'];
    sn: string;
    bgCard!: string;
    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService,
        private activityroute: ActivatedRoute,
        private ngZone: NgZone,
        private el: ElementRef,
        private renderer: Renderer2,
        private sanitizer: DomSanitizer
        //private ngZone: NgZone,
    ) {
        this.sn = this.decodeBase64(this.activityroute.snapshot.params['sn'])
        this.form = this._fb.group({
            amount: '',
        })
    }
    ngOnInit(): void {
        
             //this.ngZone.runOutsideAngular(() => {
            //this.formElement.nativeElement.appendChild(script);
        //});
        //const script = this.renderer.createElement('script');
        //script.onload = this.loadNextScript.bind(this);
        //script.type = 'text/javascript';
        //script.src = 'https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js';
        //script.setAttribute('data-apikey', 'pkey_prod_9929s93IlIbSmViDgW4eqjcqlnbT3JOWVrXB');
        //script.setAttribute('data-amount', '100.00');
        //script.setAttribute('data-currency', 'THB');
        //script.setAttribute('data-payment-methods', 'card');
        //script.setAttribute('data-name', 'BANGKOK PATANA SCHOOL');
        //script.setAttribute('data-mid', '401012208444001');

        //const formElement = this.el.nativeElement.querySelector('#kbankGate');
        //this.renderer.appendChild(formElement, script);
        //this.renderer.appendChild(this._document.body, script);
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~use~~~~~~~~~~~~~~~~~~~~~~~
		this._topup.get_card_by_SN(123123213).subscribe((resp: any) =>{
            this.card = {
                id: resp.sn, 
                role: resp.role, 
                name: resp.name, 
                balance: parseInt(resp.remain).toLocaleString(), 
                update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
            }
            this.bgCard = this.bg_card()
            console.log('this.card', this.card);
        })
    }

    //loadNextScript() {
    //    const scriptUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js');
    //    console.log(scriptUrl as string);
        
    //    const script = this.renderer.createElement('script');
    //    script.src = 'https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js';
    //    script.type = 'text/javascript';
    
    //    // กำหนดค่า data-* attributes อย่างถูกต้อง
    //    script.setAttribute('data-apikey', 'pkey_prod_9929s93IlIbSmViDgW4eqjcqlnbT3JOWVrXB');
    //    script.setAttribute('data-amount', '100.00');
    //    script.setAttribute('data-currency', 'THB');
    //    script.setAttribute('data-payment-methods', 'card');
    //    script.setAttribute('data-name', 'BANGKOK PATANA SCHOOL');
    //    script.setAttribute('data-mid', '401012208444001');
    //    //this.renderer.appendChild(this._document.body, script);
    
    //    // เพิ่มสคริปต์ไปที่ DOM
    //    const formElement = this.el.nativeElement.querySelector('#kbankGate');
    //    this.renderer.appendChild(formElement, script);
    //}

    //loadScript() {
    //    const script = this.renderer.createElement('script');
    //    script.type = 'text/javascript';
    //    script.src = 'https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js';
    //    script.onload = () => {
    //        console.log('Script loaded successfully');
    //    };
    //    script.onerror = (error: any) => {
    //    console.error('Script load error', error);
    //    };
    //    this.renderer.setAttribute(script, 'data-apikey', 'pkey_prod_9929s93IlIbSmViDgW4eqjcqlnbT3JOWVrXB');
    //    this.renderer.setAttribute(script, 'data-amount', '100.00');
    //    this.renderer.setAttribute(script, 'data-currency', 'THB');
    //    this.renderer.setAttribute(script, 'data-payment-methods', 'card');
    //    this.renderer.setAttribute(script, 'data-name', 'BANGKOK PATANA SCHOOL');
    //    this.renderer.setAttribute(script, 'data-mid', '401012208444001');
    //    //this.renderer.appendChild(this.formElement.nativeElement, script);
    //    //this.renderer.appendChild(this.formElement.nativeElement, script);
    //}

    //loadScript() {
    //    const script = this.renderer.createElement('script');
    //    script.type = 'text/javascript';
    //    script.src = 'https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js';
    //    this.renderer.setAttribute(script, 'data-apikey', 'pkey_prod_9929s93IlIbSmViDgW4eqjcqlnbT3JOWVrXB');
    //    this.renderer.setAttribute(script, 'data-amount', '100.00');
    //    this.renderer.setAttribute(script, 'data-currency', 'THB');
    //    this.renderer.setAttribute(script, 'data-payment-methods', 'card');
    //    this.renderer.setAttribute(script, 'data-name', 'BANGKOK PATANA SCHOOL');
    //    this.renderer.setAttribute(script, 'data-mid', '401012208444001');
    //    this.renderer.appendChild(this.formElement.nativeElement, script);
    //  }

    ngAfterViewInit(): void {
        this.ngZone.run(() => {
            // โค้ดสำหรับโหลด KPayment script
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js';
            script.setAttribute('data-apikey', 'pkey_prod_9929s93IlIbSmViDgW4eqjcqlnbT3JOWVrXB');
            script.setAttribute('data-amount', '100.00');
            script.setAttribute('data-currency', 'THB');
            script.setAttribute('data-payment-methods', 'card');
            script.setAttribute('data-name', 'BANGKOK PATANA SCHOOL');
            script.setAttribute('data-mid', '401012208444001');
            document.body.appendChild(script);
            //document.getElementById('formElement')!.appendChild(script);
        });
    //    //this.loadScript();
    //    //this.ngZone.runOutsideAngular(() => {
    //        const script = document.createElement('script');
    //        script.type = 'text/javascript';
    //        script.src = 'https://kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js';
    //        script.setAttribute('data-apikey', 'pkey_prod_9929s93IlIbSmViDgW4eqjcqlnbT3JOWVrXB');
    //        script.setAttribute('data-amount', '100.00');
    //        script.setAttribute('data-currency', 'THB');
    //        script.setAttribute('data-payment-methods', 'card');
    //        script.setAttribute('data-name', 'BANGKOK PATANA SCHOOL');
    //        script.setAttribute('data-mid', '401012208444001');
    //        this.formElement.nativeElement.appendChild(script);
    //    //});
    }

    decodeBase64(input: string): string {
        return atob(input);
    }

    encodeBase64(input: string): string {
        return btoa(input);
    }

	openDialogEdit(item: any) {
		console.log(item);

        const DialogRef = this.dialog.open(CreditDebitDialog, {
            disableClose: true,
            width: '400px',
            height: '417px',
            data: {
                type: 'EDIT',
                value: item
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result, 'result')
                window.location.reload();
            }
        });
    }

    bg_card(): string{
        return this._topup.get_bg_card(this.card.role)
    }

    clickForUpdateTime(){
        const date = DateTime.local()
        this.card.update = date.toFormat('HH:mm')
        this._topup.setUpdateCard(this.card.update)
    }

    select_amount(i : number){
        if (i == 0) {
            this.currentColor = ['bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent']
            this.currentTextColor = ['text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]']
            this.form.patchValue({
                amount: ''
            });
        }else {
            this.form.patchValue({
                amount: i
            });
            this.currentColor = ['bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent']
            this.currentTextColor = ['text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]']
            if(i == 50){
                this.currentColor[0] = 'bg-[#990033]'
                this.currentTextColor[0] = 'text-white'
            }
            else if(i == 100){
                this.currentColor[1] = 'bg-[#990033]'
                this.currentTextColor[1] = 'text-white'
            }
            else if(i == 200){
                this.currentColor[2] = 'bg-[#990033]'
                this.currentTextColor[2] = 'text-white'
            }
            else if(i == 300){
                this.currentColor[3] = 'bg-[#990033]'
                this.currentTextColor[3] = 'text-white'
            }
            else if(i == 500){
                this.currentColor[4] = 'bg-[#990033]'
                this.currentTextColor[4] = 'text-white'
            }
            else if(i == 1000){
                this.currentColor[5] = 'bg-[#990033]'
                this.currentTextColor[5] = 'text-white'
            }
            console.log(this.form.value.amount);
        }
    }

	backto(){
		this._router.navigate(['/top-up',this.encodeBase64(this.sn)])
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

    nextto(){       
        this._topup.setTopUp(+this.form.value.amount)
        console.log(this.form.value.amount);
        this.openDialogEdit(+this.form.value.amount)
    }
}

