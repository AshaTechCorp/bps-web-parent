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
import { TopUpService } from './topUp.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

@Component({
    selector: 'app-top-up',
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

    templateUrl: './topUp.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopUpComponent implements OnInit {
  users: any[] = []
	balance: number = 1400
	card: any
  time : any
    constructor(
        public dialog: MatDialog,
        private _router: Router,
        private _topup: TopUpService,
    ) {
    }
    ngOnInit(): void {
		this.card = this._topup.getCardData()

        console.log(this.card);


    }

    bg_card(): string{
        const index = this._topup.getSelectIndex()
        if (this.card.role == "student"){
            //if (index % 2 == 1)
            //    return "assets/images/logo/card/bg_CardStudentGray.svg"
            //else
            return "assets/images/logo/card/bg_CardStudentRed.svg"
        }
        else if (this.card.role == "staff")
            return "assets/images/logo/card/bg_CardStaff.svg"
        else if (this.card.role == "parent")
            return "assets/images/logo/card/bg_CardParent.svg"
        else if (this.card.role == "temporary")
            return "assets/images/logo/card/bg_CardTemporary.svg"
        else if (this.card.role == "contracted")
            return "assets/images/logo/card/bg_CardContracted.svg"
        else
            return ""
    }

    clickForUpdateTime(){
        // const date = DateTime.local()
        // this.card.update = date.toFormat('HH:mm')
        // this._topup.setUpdateCard(this.card.update)
    }

    select(data : string){
        if(data == "promptpay")
            this._router.navigate(['/top-up/promptpay']);
        else if(data == "credit_debit")
            this._router.navigate(['/top-up/credit-debit']);
    }

    backto(){
		this._router.navigate(['/card'])
	}



}

