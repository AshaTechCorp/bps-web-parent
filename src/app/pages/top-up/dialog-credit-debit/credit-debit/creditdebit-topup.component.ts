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
import { TopUpService } from '../../topUp.service';
import { CreditDebitDialog } from '../creditdebit.component';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditdebitTopupComponent implements OnInit {
    form: FormGroup;
    users: any[] = []
	  card: any
    time : any
    currentColor: string[] = ['bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent', 'bg-transparent'];
    currentTextColor: string[] = ['text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]', 'text-[#000000]'];
    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService,

    ) {
        this.form = this._fb.group({
            amount: '',
        })
    }
    ngOnInit(): void {
		  this.card = this._topup.getCardData()
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
		this._router.navigate(['/top-up'])
	}

    nextto(){
        this._topup.setTopUp(this.form.value.amount)
		console.log(this.form.value.amount);

		this.openDialogEdit(this.form.value.amount)

		//this._router.navigate(['/top-up/success'])
    }
}

