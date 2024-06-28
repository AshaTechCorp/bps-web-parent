import { CommonModule} from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ElementRef, Renderer2, NgZone, inject, ViewChild} from '@angular/core';
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
export class CreditdebitTopupComponent implements OnInit{
    @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;
    IsDialogOpen: boolean = false
    cantTopUp: boolean = true
    form: FormGroup;
    users: any[] = []
	card: any
    time : any
    currentColor: string[] = ['bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent'];
    currentTextColor: string[] = ['text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]'];
    fk: string;
    bgCard!: string;
    loadsuccess: boolean = false
    all_cards: any[] = []
    slice_src: string = '';
    display_right: string = 'hidden';
    display_left: string = 'hidden';
    type_card: string
    method_text: string
    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService,
        private activityroute: ActivatedRoute,
    ) {
        this.fk = this.decodeBase64(this.activityroute.snapshot.params['fk'])
        this.type_card = this.decodeBase64(this.activityroute.snapshot.params['card'])
        this.form = this._fb.group({
            amount: '',
        })
        if (this.type_card == 'visa'){
            this.method_text = 'Credit Card (VISA/MASTER CARD)'
        }
        else if (this.type_card == 'jcb'){
            this.method_text = 'Credit Card (JCB/Union Pay/TPN)'
        }
        else
            this.method_text = 'Credit Card'
    }
    ngOnInit(): void {
		this._topup.get_card_by_fk(this.fk).subscribe((resp: any) =>{
            this.card = {
                id: resp.fkId, 
                role: resp.role, 
                name: resp.name, 
                balance: resp.remain, 
                update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
            }
            this.bgCard = this.bg_card()
            this.all_cards = this._topup.getAllCard()
            this.loadsuccess = true
            this.buttonL()
            this.buttonR()
            this.slice_card()
            this.check_disable(this.form.value.amount)
        })
        this.form.get('amount')?.valueChanges.subscribe((value) => {
            this.check_disable(value); // เรียกใช้งาน check พร้อมส่งค่าที่เปลี่ยนแปลงไปด้วย
        });
    }

    decodeBase64(input: string): string {
        return atob(input);
    }

    encodeBase64(input: string): string {
        return btoa(input);
    }

    buttonL(){
        const index = this._topup.getIndex(this.card.id)

        if (index > 0){
            this.display_left = "block"
        }
        else{
            this.display_left = "hidden"
        }
    }

    buttonR(){
        const index = this._topup.getIndex(this.card.id)
        if (index < this.all_cards.length - 1){
            this.display_right = "block"
        }
        else{
            this.display_right = "hidden"
        }
    }

    slice_card(){
        const index = this._topup.getIndex(this.card.id)
        if (this.all_cards.length == 0) 
            this.slice_src = ""
        else if (this.all_cards.length == 1)
            this.slice_src = "assets/images/logo/card/slide_card0.svg"
        else if (index == 0)
            this.slice_src = "assets/images/logo/card/slide_card1.svg"
        else if ((index < this.all_cards.length - 1) && (index > 0))
            this.slice_src = "assets/images/logo/card/slide_card2.svg"
        else if (index == this.all_cards.length - 1)
            this.slice_src = "assets/images/logo/card/slide_card3.svg"
    }

    change_left(){
        const index = this._topup.getIndex(this.card.id) - 1
        this.card = this.all_cards[index]
        this.buttonL()
        this.buttonR()
        this.slice_card()
        this.bgCard = this.bg_card()
        this._router.navigate(['/top-up/credit-debit',this.encodeBase64(this.card.id)])
    }

    change_right(){
        const index = this._topup.getIndex(this.card.id) + 1
        this.card = this.all_cards[index]
        this.buttonL()
        this.buttonR()
        this.slice_card()
        this.bgCard = this.bg_card()
        this._router.navigate(['/top-up/credit-debit',this.encodeBase64(this.card.id)])
    }

	openDialogEdit(item: any) {
        this.IsDialogOpen = true
        this.navbarComponent.disableButton();

        item = this.form.value.amount
        const DialogRef = this.dialog.open(CreditDebitDialog, {
            disableClose: true,
            width: 'fit-content',
            height: 'fit-content',
            data: {
                card: this.card,
                value: item,
                type: this.type_card
            }
        });
        DialogRef.afterClosed().subscribe((result) => {
            this.IsDialogOpen = false
            this.navbarComponent.enableButton();
            if (result) {
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
        if (!this.IsDialogOpen) {
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
            }
        }
    }

	backto(){
        if (this.card?.id)
		    this._router.navigate(['/top-up',this.encodeBase64(this.card.id)])
	}

    nextto(){       
        this._topup.setTopUp(+this.form.value.amount)
        this.openDialogEdit(+this.form.value.amount)
    }

    check_disable(data: number){
        if ((+this.card.balance) + (+data) <= 5000 && +data > 0){
            this.cantTopUp = false
        }else {
            this.cantTopUp = true
        }
    }

    restrictToDigits(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.trim();
        
        // Remove non-digit characters
        value = value.replace(/\D/g, '');
        // Update input value
        input.value = value;
        // Update form control value
        this.form.controls['amount'].setValue(value);
      }
}

