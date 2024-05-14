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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCardComponent implements OnInit {
    orders: any[] = [];
    form: FormGroup;
    users: any[] = []
	cards: any[] = []
    time : any
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
		this.cards = this._topupservice.getAllCard()
        console.log(this.cards);

        this.form.patchValue({
            payment_type: ''
        })

    }

    bg_card(i: number): string{
        if (this.cards[i].role == "student"){
            return "assets/images/logo/card/bg_CardStudentRed.svg"
        }
        else if (this.cards[i].role == "business")
            return "assets/images/logo/card/bg_CardBusiness.svg"
        else if (this.cards[i].role == "academic")
            return "assets/images/logo/card/bg_CardAcademic.svg"
        else
            return ""
    }

    text_card(i: number): string{
        if (this.cards[i].role == "student")
            return "assets/images/logo/card/student.svg"
        else if (this.cards[i].role == "business")
            return "assets/images/logo/card/business.svg"
        else if (this.cards[i].role == "academic")
            return "assets/images/logo/card/academic.svg"
        else
            return ""
    }

    clickForUpdateTime(i : number){
        const date = DateTime.local()
        this.cards[i].update = date.toFormat('HH:mm')
    }

    select(i : number){
        this._topupservice.setCardData(i)
        this._router.navigate(['/card']);
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

