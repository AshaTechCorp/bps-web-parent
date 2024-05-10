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

@Component({
    selector: 'app-success',
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

    templateUrl: './success.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptpaySuccessComponent implements OnInit {
    users: any[] = []
	balance: number = 1400
	card: any
    time : any
	data_amount : any
	success_date : Date = new Date()
    amount : any
    form : any
    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService
    ) {
        this.form = this._fb.group({
            amount: 0,
        })
    }
    ngOnInit(): void {
		this.card = this._topup.getCardData()
        this.amount = this._topup.getTopUp()

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
        this.data_amount = i
        this.form.patchValue({
			amount: i
		});
		console.log(this.form.value.amount);

    }

	backto(){
		this._router.navigate(['/top-up'])
	}
}

