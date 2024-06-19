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
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TopUpComponent implements OnInit {
    users: any[] = []
	balance: number = 1400
	card: any
    time : any
    fk: string;
    bgCard!: string;
    loadsuccess: boolean = false
    constructor(
        public dialog: MatDialog,
        private _router: Router,
        private _topup: TopUpService,
        private activityroute: ActivatedRoute
    ) {
        this.fk = this.decodeBase64(this.activityroute.snapshot.params['fk'])
    }
    ngOnInit(): void {
		this._topup.get_card_by_fk(this.fk).subscribe((resp: any) =>{
            this.card = {
                id: resp.fkId, 
                role: resp.role, 
                name: resp.name, 
                balance: parseInt(resp.remain).toLocaleString(), 
                update: (DateTime.fromISO(resp.at)).toFormat('HH:mm')
            }
            this.bgCard = this.bg_card()
            console.log(this.card);
            this.loadsuccess = true
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
        // const date = DateTime.local()
        // this.card.update = date.toFormat('HH:mm')
        // this._topup.setUpdateCard(this.card.update)
    }

    select(data : string){
        if(data == "promptpay")
            this._router.navigate(['/top-up/promptpay',this.encodeBase64(this.card.id)]);
        else if(data == "credit_debit")
            this._router.navigate(['/top-up/credit-debit',this.encodeBase64(this.card.id)]);
    }

    backto(){
		this._router.navigate(['/card',this.encodeBase64(this.card.id)])
	}
}

