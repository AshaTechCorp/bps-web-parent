import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2,} from '@angular/core';
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
import { TopUpService } from '../top-up/topUp.service';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

@Component({
    selector: 'app-select',
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

    templateUrl: './selectCard.component.html',
    //styleUrl: './selectCard.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectCardComponent implements OnInit {
    orders: any[] = [];
    form: FormGroup;
    users: any[] = []
	cards: any[] = []
	data1: any[] = []
    time : any
    cards_family: any;
    loadsuccess: boolean = false
    acc_email: any;
    constructor(
        public dialog: MatDialog,
        private _fb: FormBuilder,
        private _router: Router,
        private _topupservice: TopUpService,
        private renderer: Renderer2
    ) {
        this.form = this._fb.group({
            payment_type: '',

        })
    }

    ngOnInit(): void {
		//this.cards = this._topupservice.getAllCard()
		//this.cards = this._topupservice.getAllCard()
        this._topupservice.getProfile().subscribe((resp: any) =>{
            console.log(resp.userPrincipalName);

            this.acc_email = resp.userPrincipalName
            localStorage.setItem('family', this.acc_email);
            this._topupservice.get_family_card().subscribe((resp: any) =>{
                this.cards_family = resp
                console.log(this.cards_family);
               
              for (let index = 0; index <  this.cards_family.persons.length; index++) {
                const element =  this.cards_family.persons[index];
                const data = {
                    //id: element.sn, 
                    id: element.fkId, 
                    role: element.role, 
                    name: element.name, 
                    balance: parseInt(element.remain).toLocaleString(), 
                    update: DateTime.fromISO(element.at).toFormat('HH:mm')
                }
                this.cards.push(data)
                }
                console.log(this.cards[0].id , 'data1');
                this.loadsuccess = true
            })
        })

        
        this.form.patchValue({
            payment_type: ''
        })

    }

    encodeBase64(input: string): string {
        return btoa(input);
    }

    bg_card(i: number): string{
        return this._topupservice.get_bg_card(this.cards[i].role)
    }

    clickForUpdateTime(i : number){
        const date = DateTime.local()
        this.cards[i].update = date.toFormat('HH:mm')
    }

    select(fk : string, i: number){
        this._topupservice.setCardData(i)
        this._router.navigate(['/card',this.encodeBase64(fk)]);
    }

    getTextWidth(text: string): number {
        const span = this.renderer.createElement('span');
        span.textContent = text;
        span.style.fontFamily = "IBM Plex Sans Thai"
        span.style.fontSize = "16px"
        span.style.letterSpacing ="0.25px"
        span.style.fontWeight = "500"
        this.renderer.setStyle(span, 'position', 'absolute');
        this.renderer.setStyle(span, 'visibility', 'hidden');
        document.body.appendChild(span);
        const width = span.offsetWidth;
        document.body.removeChild(span);
        return width;
    }
}

