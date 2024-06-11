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
import { TopUpService } from '../top-up/topUp.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

@Component({
    selector: 'app-success-ornot',
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

    templateUrl: './success-ornot.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SuccessOrnotComponent implements OnInit {
    users: any[] = []
	balance: number = 1400
	card: any
    time : any
	data_amount : any
	success_date : Date = new Date()
    amount : any
    form : any
    //sn: string;
    bgCard!: string;
    ref!: string;
    success: number = 3
    //loading: string = 'assets/images/waiting/pending.gif';
    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topup: TopUpService,
        private activityroute: ActivatedRoute
    ) {
        //this.sn = this.decodeBase64(this.activityroute.snapshot.params['sn'])
        //this.ref = this.activityroute.snapshot.params['referenceOrder']
        this.activityroute.queryParams.subscribe(params => {
          this.ref = params['referenceOrder'];
          console.log('ref ',this.ref);
          
        })
        this.form = this._fb.group({
            amount: 0,
        })
    }
    ngOnInit(): void {
      console.log(this.ref);

      if (this.ref){
        this._topup.check_status_credit(this.ref).subscribe((resp: any) =>{
          if (!resp)
            console.log("resp = null");
          else if (resp.status == "CREATE")
            this.success = 1
          else if (resp.status == "SUCCESS")
            this.success = 2
          else
            console.log("555555");
            
        })
        console.log("success",this.success);
        console.log('111');
      }
		  this._topup.get_card_by_SN(123123213).subscribe((resp: any) =>{
            this.card = {
                id: resp.sn, 
                role: resp.role, 
                name: resp.name, 
                balance: parseInt(resp.remain).toLocaleString(), 
                update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
            }
            this.bgCard = this.bg_card()
        })
        console.log('this.card', this.card);
        this.amount = this._topup.getTopUp()
        
        
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

    select_amount(i : number){
        this.data_amount = i
        this.form.patchValue({
			amount: i
		});
		console.log(this.form.value.amount);

    }

	backto(){
		this._router.navigate(['/top-up',this.encodeBase64('123123213')])
	}
}

